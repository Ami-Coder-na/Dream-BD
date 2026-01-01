
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { User, AppModule, Notification } from './types';
import { GeminiAssistant } from './components/GeminiAssistant';
import { LandingPage } from './components/LandingPage';
import { AiChatPage } from './components/AiChatPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2, AlertTriangle, Lock } from 'lucide-react';
import { useSiteConfig } from './contexts/SiteConfigContext';
import { useData } from './contexts/DataContext';

// Lazy Load Modules for Bundle Splitting
const JobModule = lazy(() => import('./components/modules/JobModule').then(module => ({ default: module.JobModule })));
const BlogModule = lazy(() => import('./components/modules/BlogModule').then(module => ({ default: module.BlogModule })));
const ContactModule = lazy(() => import('./components/modules/ContactModule').then(module => ({ default: module.ContactModule })));
const AmarBdModule = lazy(() => import('./components/modules/AmarBdModule').then(module => ({ default: module.AmarBdModule })));
const AmarJelaModule = lazy(() => import('./components/modules/AmarJelaModule').then(module => ({ default: module.AmarJelaModule })));
const BazarSodaiModule = lazy(() => import('./components/modules/BazarSodaiModule').then(module => ({ default: module.BazarSodaiModule })));
const CraftModule = lazy(() => import('./components/modules/CraftModule').then(module => ({ default: module.CraftModule })));
const AgriModule = lazy(() => import('./components/modules/AgriModule').then(module => ({ default: module.AgriModule })));
const EduModule = lazy(() => import('./components/modules/EduModule').then(module => ({ default: module.EduModule })));
const HealthModule = lazy(() => import('./components/modules/HealthModule').then(module => ({ default: module.HealthModule })));
const TransportModule = lazy(() => import('./components/modules/TransportModule').then(module => ({ default: module.TransportModule })));
const WasteModule = lazy(() => import('./components/modules/WasteModule').then(module => ({ default: module.WasteModule })));
const FisheryModule = lazy(() => import('./components/modules/FisheryModule').then(module => ({ default: module.FisheryModule })));
const DisasterModule = lazy(() => import('./components/modules/DisasterModule').then(module => ({ default: module.DisasterModule })));
const LegalModule = lazy(() => import('./components/modules/LegalModule').then(module => ({ default: module.LegalModule })));
const ExpatModule = lazy(() => import('./components/modules/ExpatModule').then(module => ({ default: module.ExpatModule })));
const VocationalModule = lazy(() => import('./components/modules/VocationalModule').then(module => ({ default: module.VocationalModule })));
const ProfilePage = lazy(() => import('./components/ProfilePage').then(module => ({ default: module.ProfilePage })));
const AdminModule = lazy(() => import('./components/modules/AdminModule').then(module => ({ default: module.AdminModule })));

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-red-500 to-brand-500 animate-pulse"></div>
    <div className="absolute w-96 h-96 bg-brand-50 rounded-full blur-3xl -top-20 -left-20 opacity-50"></div>
    <div className="absolute w-96 h-96 bg-red-50 rounded-full blur-3xl -bottom-20 -right-20 opacity-50"></div>

    <div className="relative z-10 flex flex-col items-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-brand-100 rounded-full animate-ping opacity-25"></div>
        <div className="w-24 h-24 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl shadow-xl flex items-center justify-center transform rotate-3 transition-transform hover:rotate-0 border-4 border-white">
           <span className="text-5xl font-bold text-white">D</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
           <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Digital Desh BD</h2>
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full border border-gray-100 shadow-sm">
        <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
        <span className="text-gray-600 font-medium text-sm">লোড হচ্ছে...</span>
      </div>
    </div>
  </div>
);

const SESSION_KEY = 'digital_desh_bd_user_session';
const SESSION_DURATION = 12 * 60 * 60 * 1000;

const App: React.FC = () => {
  const { logVisit, updateUser: syncUserGlobal } = useData();
  const { settings } = useSiteConfig();
  
  const [user, setUser] = useState<User | null>(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const { user, timestamp } = JSON.parse(savedSession);
        if (Date.now() - timestamp < SESSION_DURATION) {
          return user;
        } else {
          localStorage.removeItem(SESSION_KEY);
          return null;
        }
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
    }
    return null;
  });

  const [activeModule, setActiveModule] = useState<AppModule | 'LANDING'>('LANDING');
  const [isBangla, setIsBangla] = useState(true);
  const [showAiChat, setShowAiChat] = useState(false);
  const [authView, setAuthView] = useState<'none' | 'login' | 'signup'>('none');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // SEO: Dynamic Meta Content Sync
  useEffect(() => {
    // Sync Title
    if (settings.websiteTitle) {
      const moduleName = activeModule === 'LANDING' ? '' : ` - ${activeModule.toString().toUpperCase()}`;
      document.title = `${settings.websiteTitle}${moduleName}`;
    }
    
    // Sync Favicon
    if (settings.websiteFavicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.websiteFavicon;
    }

    // Dynamic Meta Description for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    
    const descriptions: Record<string, string> = {
      [AppModule.AGRI]: "শোনালী দেশ কৃষি সেবা - ফসলের বাজার দর, আবহাওয়া এবং বিশেষজ্ঞ কৃষি পরামর্শ।",
      [AppModule.HEALTH]: "ডিজিটাল স্বাস্থ্য সেবা - বিশেষজ্ঞ ডাক্তার, হাসপাতাল এবং জরুরি রক্তদাতার তালিকা।",
      [AppModule.JOB]: "চাকরি পোর্টাল - বাংলাদেশের সকল সরকারি ও বেসরকারি চাকরির খবর এবং আবেদনের সুযোগ।",
      [AppModule.AMAR_JELA]: "আমার জেলা - ৬৪ জেলার পর্যটন কেন্দ্র, ইতিহাস এবং প্রশাসনিক তথ্যের ডিজিটাল ভাণ্ডার।",
      'LANDING': "Digital Desh BD - কৃষি, শিক্ষা, স্বাস্থ্য ও ডিজিটাল বাংলাদেশ পোর্টাল। সকল ডিজিটাল নাগরিক সেবা এক জায়গায়।"
    };

    metaDesc.setAttribute('content', descriptions[activeModule.toString()] || descriptions['LANDING']);

  }, [activeModule, settings.websiteTitle, settings.websiteFavicon]);

  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path === '/adminrm') {
        setActiveModule(AppModule.ADMIN);
      } else if (path === '/') {
        setActiveModule('LANDING');
      }
    };
    handleNavigation();
    logVisit();
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: loggedInUser, timestamp: Date.now() }));
    setUser(loggedInUser);
    setAuthView('none');
    setActiveModule('LANDING');
  };
  
  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setAuthView('none');
    setActiveModule('LANDING');
  };

  const handleUpdateUser = (updatedUser: User) => {
    syncUserGlobal(updatedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: updatedUser, timestamp: Date.now() }));
    setUser(updatedUser);
  };

  const navigateToLogin = () => setAuthView('login');
  const navigateToSignUp = () => setAuthView('signup');
  const navigateBack = () => setAuthView('none');

  const handleModuleSelect = (module: AppModule) => {
    setActiveModule(module);
    if (module === AppModule.ADMIN) {
      window.history.pushState({}, '', '/adminrm');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const handleNavigateHome = () => {
    setActiveModule('LANDING');
    window.history.pushState({}, '', '/');
  };

  const handleOpenAiChat = () => {
    if (!user) { setAuthView('login'); return; }
    setShowAiChat(true);
  };

  if (settings.maintenanceMode && activeModule !== AppModule.ADMIN && user?.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100">
           <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
             <Lock size={48} className="text-red-500" />
           </div>
           <h1 className="text-3xl font-bold text-gray-900 mb-4">{isBangla ? 'রক্ষণাবেক্ষণ চলছে' : 'Under Maintenance'}</h1>
           <p className="text-gray-600 text-lg mb-8">আমাদের ওয়েবসাইটটি বর্তমানে রক্ষণাবেক্ষণের কাজ চলছে।</p>
        </div>
      </div>
    );
  }

  if (showAiChat) {
    return (
      <ErrorBoundary>
        <AiChatPage onBack={() => setShowAiChat(false)} isBangla={isBangla} />
      </ErrorBoundary>
    );
  }

  if (!user && authView === 'login') {
    return (
      <ErrorBoundary>
        <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={navigateToSignUp} onBack={navigateBack} isBangla={isBangla} />
      </ErrorBoundary>
    );
  }

  if (!user && authView === 'signup') {
    return (
      <ErrorBoundary>
        <SignUpPage onSignUpSuccess={handleLoginSuccess} onNavigateToLogin={navigateToLogin} onBack={navigateBack} isBangla={isBangla} />
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {(() => {
            switch (activeModule) {
              case AppModule.PROFILE:
                if (!user) { setAuthView('login'); return null; }
                return <ProfilePage user={user} onUpdateUser={handleUpdateUser} isBangla={isBangla} />;
              case AppModule.ADMIN: return <AdminModule isBangla={isBangla} onExit={handleNavigateHome} />;
              case AppModule.JOB: return <JobModule isBangla={isBangla} user={user} onLogin={navigateToLogin} />;
              case AppModule.BLOG: return <BlogModule isBangla={isBangla} user={user} onLogin={navigateToLogin} />;
              case AppModule.CONTACT: return <ContactModule isBangla={isBangla} />;
              case AppModule.AMAR_BD: return <AmarBdModule isBangla={isBangla} onModuleSelect={handleModuleSelect} />;
              case AppModule.AMAR_JELA: return <AmarJelaModule isBangla={isBangla} />;
              case AppModule.BAZAR_SODAI: return <BazarSodaiModule isBangla={isBangla} user={user} onLogin={navigateToLogin} />;
              case AppModule.CRAFT: return <CraftModule isBangla={isBangla} />;
              case AppModule.AGRI: return <AgriModule isBangla={isBangla} user={user} onLogin={navigateToLogin} />;
              case AppModule.EDU: return <EduModule isBangla={isBangla} user={user} />;
              case AppModule.HEALTH: return <HealthModule isBangla={isBangla} />;
              case AppModule.TRANSPORT: return <TransportModule isBangla={isBangla} />;
              case AppModule.WASTE: return <WasteModule isBangla={isBangla} user={user} onLogin={navigateToLogin} />;
              case AppModule.FISHERY: return <FisheryModule isBangla={isBangla} />;
              case AppModule.DISASTER: return <DisasterModule isBangla={isBangla} />;
              case AppModule.LEGAL: return <LegalModule isBangla={isBangla} />;
              case AppModule.EXPAT: return <ExpatModule isBangla={isBangla} />;
              case AppModule.VOCATIONAL: return <VocationalModule isBangla={isBangla} user={user} onLogin={navigateToLogin} />;
              case 'LANDING':
              default:
                return (
                  <LandingPage 
                    user={user} onLogin={navigateToLogin} onRegister={navigateToSignUp} onLogout={handleLogout} 
                    onOpenAiChat={handleOpenAiChat} onModuleSelect={handleModuleSelect} isBangla={isBangla} 
                    toggleLanguage={() => setIsBangla(!isBangla)} notifications={notifications}
                  />
                );
            }
          })()}
        </Suspense>
      </ErrorBoundary>
    );
  };

  if (activeModule === AppModule.ADMIN) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <AdminModule isBangla={isBangla} onExit={handleNavigateHome} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <Header 
          user={user} onLogin={navigateToLogin} onRegister={navigateToSignUp} onLogout={handleLogout} 
          onModuleSelect={handleModuleSelect} onNavigateHome={handleNavigateHome} isBangla={isBangla} 
          toggleLanguage={() => setIsBangla(!isBangla)} notifications={notifications}
        />
        <main className="flex-1">
            {renderContent()}
        </main>
        <Footer 
          isBangla={isBangla} toggleLanguage={() => setIsBangla(!isBangla)} 
          onNavigateHome={handleNavigateHome} onModuleSelect={handleModuleSelect}
        />
        <GeminiAssistant currentModule={activeModule as AppModule} isBangla={isBangla} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
