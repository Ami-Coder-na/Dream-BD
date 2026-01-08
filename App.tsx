
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { User, AppModule, UserRole, Notification } from './types';
import { GeminiAssistant } from './components/GeminiAssistant';
import { LandingPage } from './components/LandingPage';
import { AiChatPage } from './components/AiChatPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { Loader2, AlertTriangle, Lock } from 'lucide-react';
import { useSiteConfig } from './contexts/SiteConfigContext';
import { useData } from './contexts/DataContext';

// Lazy Load Modules
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
const AboutModule = lazy(() => import('./components/modules/AboutModule').then(module => ({ default: module.AboutModule })));
const PrivacyModule = lazy(() => import('./components/modules/PrivacyModule').then(module => ({ default: module.PrivacyModule })));
const TermsModule = lazy(() => import('./components/modules/TermsModule').then(module => ({ default: module.TermsModule })));
const JanteChaiModule = lazy(() => import('./components/modules/JanteChaiModule').then(module => ({ default: module.JanteChaiModule })));

const LoadingFallback = () => {
  const { settings } = useSiteConfig();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 flex items-center justify-center relative">
            {settings.websiteLogo ? (
              <img 
                src={settings.websiteLogo} 
                alt="Logo" 
                className="w-full h-full object-contain animate-bounce" 
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-brand-600 to-brand-700 rounded-[2rem] shadow-2xl flex items-center justify-center transform rotate-3">
                 <span className="text-5xl font-black text-white">D</span>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-500 rounded-full border-4 border-white animate-ping"></div>
          </div>
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-4">Digital Desh BD</h2>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-2.5 rounded-full border border-gray-100 shadow-xl shadow-brand-500/10">
          <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
          <span className="text-brand-700 font-bold text-sm tracking-wide">লোড হচ্ছে...</span>
        </div>
      </div>
      
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </div>
  );
};

const SESSION_KEY = 'digital_desh_bd_user_session';
const SESSION_DURATION = 12 * 60 * 60 * 1000;

const App: React.FC = () => {
  const { logVisit, updateUser: syncUserGlobal, isLoading } = useData();
  const { settings } = useSiteConfig();
  
  const [user, setUser] = useState<User | null>(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const { user, timestamp } = JSON.parse(savedSession);
        if (Date.now() - timestamp < SESSION_DURATION) return user;
        localStorage.removeItem(SESSION_KEY);
      } catch (e) { localStorage.removeItem(SESSION_KEY); }
    }
    return null;
  });

  const [activeModule, setActiveModule] = useState<AppModule | 'LANDING'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/adminrm') return AppModule.ADMIN;
      if (window.location.pathname.startsWith('/blog')) return AppModule.BLOG;
    }
    return 'LANDING';
  });

  const [isBangla, setIsBangla] = useState(true);
  const [showAiChat, setShowAiChat] = useState(false);
  const [authView, setAuthView] = useState<'none' | 'login' | 'signup'>('none');

  useEffect(() => {
    // Update Favicon
    if (settings.websiteFavicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.websiteFavicon;
    }
  }, [settings.websiteFavicon]);

  useEffect(() => {
    if (isLoading) return;

    // Always scroll to top when any view state changes
    window.scrollTo(0, 0);

    // Only log visit if not an admin or on admin route
    const isAdmin = user?.role === UserRole.ADMIN || window.location.pathname === '/adminrm';
    if (!isAdmin) {
      logVisit();
    }
    
    // Support browser back button
    const handlePopState = () => {
      if (window.location.pathname === '/adminrm') {
        setActiveModule(AppModule.ADMIN);
      } else if (window.location.pathname.startsWith('/blog')) {
        setActiveModule(AppModule.BLOG);
      } else if (activeModule !== 'LANDING') {
        setActiveModule('LANDING');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, isLoading, activeModule, authView, showAiChat]);

  if (isLoading) {
    return <LoadingFallback />;
  }

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

  const handleModuleSelect = (module: AppModule) => {
    setActiveModule(module);
    setShowAiChat(false);
    if (module === AppModule.ADMIN) window.history.pushState({}, '', '/adminrm');
    else if (module === AppModule.BLOG) window.history.pushState({}, '', '/blog');
    else window.history.pushState({}, '', '/');
  };

  const handleOpenAiChat = () => {
    if (!user) {
      setAuthView('login');
      return;
    }
    setShowAiChat(true);
  };

  const renderContent = () => {
    if (showAiChat) {
      if (!user) {
        setAuthView('login');
        setShowAiChat(false);
        return null;
      }
      return (
        <AiChatPage 
          isBangla={isBangla} 
          onBack={() => setShowAiChat(false)} 
        />
      );
    }
    
    if (authView === 'login') {
      return (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onNavigateToSignUp={() => setAuthView('signup')} 
          onBack={() => setAuthView('none')}
          isBangla={isBangla}
        />
      );
    }
    if (authView === 'signup') {
      return (
        <SignUpPage 
          onSignUpSuccess={handleLoginSuccess} 
          onNavigateToLogin={() => setAuthView('login')} 
          onBack={() => setAuthView('none')}
          isBangla={isBangla}
        />
      );
    }

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {(() => {
            switch (activeModule) {
              case AppModule.PROFILE: return user ? <ProfilePage user={user} onUpdateUser={setUser} isBangla={isBangla} /> : null;
              case AppModule.ADMIN: return <AdminModule isBangla={isBangla} onExit={() => { setActiveModule('LANDING'); window.history.pushState({}, '', '/'); }} />;
              case AppModule.JOB: return <JobModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.BLOG: return <BlogModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.CONTACT: return <ContactModule isBangla={isBangla} />;
              case AppModule.AMAR_BD: return <AmarBdModule isBangla={isBangla} onModuleSelect={handleModuleSelect} />;
              case AppModule.AMAR_JELA: return <AmarJelaModule isBangla={isBangla} />;
              case AppModule.BAZAR_SODAI: return <BazarSodaiModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.CRAFT: return <CraftModule isBangla={isBangla} />;
              case AppModule.AGRI: return <AgriModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.EDU: return <EduModule isBangla={isBangla} user={user} />;
              case AppModule.HEALTH: return <HealthModule isBangla={isBangla} />;
              case AppModule.TRANSPORT: return <TransportModule isBangla={isBangla} />;
              case AppModule.WASTE: return <WasteModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.FISHERY: return <FisheryModule isBangla={isBangla} />;
              case AppModule.DISASTER: return <DisasterModule isBangla={isBangla} />;
              case AppModule.LEGAL: return <LegalModule isBangla={isBangla} />;
              case AppModule.EXPAT: return <ExpatModule isBangla={isBangla} />;
              case AppModule.VOCATIONAL: return <VocationalModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.ABOUT: return <AboutModule isBangla={isBangla} />;
              case AppModule.PRIVACY: return <PrivacyModule isBangla={isBangla} />;
              case AppModule.TERMS: return <TermsModule isBangla={isBangla} />;
              case AppModule.JANTE_CHAI: return <JanteChaiModule isBangla={isBangla} />;
              case 'LANDING':
              default:
                return (
                  <LandingPage 
                    user={user} onLogin={() => setAuthView('login')} onRegister={() => setAuthView('signup')} onLogout={handleLogout} 
                    onOpenAiChat={handleOpenAiChat} onModuleSelect={handleModuleSelect} isBangla={isBangla} 
                    toggleLanguage={() => setIsBangla(!isBangla)}
                  />
                );
            }
          })()}
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        {activeModule !== AppModule.ADMIN && authView === 'none' && !showAiChat && (
          <Header 
            user={user} onLogin={() => setAuthView('login')} onRegister={() => setAuthView('signup')} onLogout={handleLogout} 
            onModuleSelect={handleModuleSelect} onNavigateHome={() => { setActiveModule('LANDING'); setShowAiChat(false); window.history.pushState({}, '', '/'); }} isBangla={isBangla} 
            toggleLanguage={() => setIsBangla(!isBangla)}
          />
        )}
        <main className="flex-1">{renderContent()}</main>
        {activeModule !== AppModule.ADMIN && authView === 'none' && !showAiChat && (
          <Footer 
            isBangla={isBangla} toggleLanguage={() => setIsBangla(!isBangla)} 
            onNavigateHome={() => { setActiveModule('LANDING'); setShowAiChat(false); window.history.pushState({}, '', '/'); }} onModuleSelect={handleModuleSelect}
          />
        )}
        {!showAiChat && (
          <GeminiAssistant 
            currentModule={activeModule as AppModule} 
            isBangla={isBangla} 
            user={user}
            onLogin={() => setAuthView('login')}
          />
        )}
        <ScrollToTop />
      </div>
    </ErrorBoundary>
  );
};

export default App;
