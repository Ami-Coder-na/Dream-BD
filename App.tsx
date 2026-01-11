
"use client";

import React, { useState, Suspense, lazy, useEffect, useMemo, useCallback } from 'react';
import { User, AppModule } from './types';
import { GeminiAssistant } from './components/GeminiAssistant';
import { LandingPage } from './components/LandingPage';
import { AiChatPage } from './components/AiChatPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { Loader2, Bell, Settings as SettingsIcon, Bird } from 'lucide-react';
import { useData } from './contexts/DataContext';
import { useSiteConfig } from './contexts/SiteConfigContext';

const LoadingFallback = () => {
  const { settings } = useSiteConfig();
  // Error #31 Fix: Explicitly ensure title is a string
  const siteTitle = typeof settings?.websiteTitle === 'string' ? settings.websiteTitle : 'সোনালী দেশ';
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-brand-500/20 rounded-full shonali-loader-pulse"></div>
        <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-brand-500 shadow-xl z-10 overflow-hidden">
          {settings?.websiteLogo ? (
            <img src={settings.websiteLogo} className="w-16 h-16 object-contain" alt="Loading" />
          ) : (
            <Bird className="text-brand-600 w-12 h-12" />
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-spin">
           <div className="w-1 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      <h2 className="text-xl font-black text-gray-800 tracking-tighter animate-pulse uppercase">
        {siteTitle}
      </h2>
      <div className="mt-4 flex gap-1">
        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

// Lazy Load All Modules
const JobModule = lazy(() => import('./components/modules/JobModule').then(m => ({ default: m.JobModule })));
const BlogModule = lazy(() => import('./components/modules/BlogModule').then(m => ({ default: m.BlogModule })));
const ContactModule = lazy(() => import('./components/modules/ContactModule').then(m => ({ default: m.ContactModule })));
const AmarBdModule = lazy(() => import('./components/modules/AmarBdModule').then(m => ({ default: m.AmarBdModule })));
const AmarJelaModule = lazy(() => import('./components/modules/AmarJelaModule').then(m => ({ default: m.AmarJelaModule })));
const BazarSodaiModule = lazy(() => import('./components/modules/BazarSodaiModule').then(m => ({ default: m.BazarSodaiModule })));
const CraftModule = lazy(() => import('./components/modules/CraftModule').then(m => ({ default: m.CraftModule })));
const AgriModule = lazy(() => import('./components/modules/AgriModule').then(m => ({ default: m.AgriModule })));
const EduModule = lazy(() => import('./components/modules/EduModule').then(m => ({ default: m.EduModule })));
const HealthModule = lazy(() => import('./components/modules/HealthModule').then(m => ({ default: m.HealthModule })));
const TransportModule = lazy(() => import('./components/modules/TransportModule').then(m => ({ default: m.TransportModule })));
const WasteModule = lazy(() => import('./components/modules/WasteModule').then(m => ({ default: m.WasteModule })));
const FisheryModule = lazy(() => import('./components/modules/FisheryModule').then(m => ({ default: m.FisheryModule })));
const DisasterModule = lazy(() => import('./components/modules/DisasterModule').then(m => ({ default: m.DisasterModule })));
const LegalModule = lazy(() => import('./components/modules/LegalModule').then(m => ({ default: m.LegalModule })));
const ExpatModule = lazy(() => import('./components/modules/ExpatModule').then(m => ({ default: m.ExpatModule })));
const VocationalModule = lazy(() => import('./components/modules/VocationalModule').then(m => ({ default: m.VocationalModule })));
const ProfilePage = lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminModule = lazy(() => import('./components/modules/AdminModule').then(m => ({ default: m.AdminModule })));
const AboutModule = lazy(() => import('./components/modules/AboutModule').then(m => ({ default: m.AboutModule })));
const PrivacyModule = lazy(() => import('./components/modules/PrivacyModule').then(m => ({ default: m.PrivacyModule })));
const TermsModule = lazy(() => import('./components/modules/TermsModule').then(m => ({ default: m.TermsModule })));
const JanteChaiModule = lazy(() => import('./components/modules/JanteChaiModule').then(m => ({ default: m.JanteChaiModule })));

const App: React.FC = () => {
  const { logVisit } = useData();
  const { settings } = useSiteConfig();
  const [currentView, setCurrentView] = useState('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [isBangla, setIsBangla] = useState(true);
  const [authView, setAuthView] = useState<'none' | 'login' | 'signup'>('none');

  useEffect(() => {
    // DEV TEST: Defensive parsing of session
    try {
      const saved = localStorage.getItem('digital_desh_bd_user_session');
      if (saved && saved !== "undefined" && saved !== "null") {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.user) {
          setUser(parsed.user);
        }
      }
    } catch (e) { 
      console.warn("Failed to load user session, clearing corrupt data.");
      localStorage.removeItem('digital_desh_bd_user_session');
    }
    
    // URL Detection for admin
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/rmadmin' || path === '/adminrm' || path === '/admin') {
        setCurrentView('admin');
      }
    }

    logVisit();
  }, [logVisit]);

  const handleNavigate = useCallback((viewPath: string) => {
    const cleanPath = viewPath.replace(/^\/|\/$/g, '') || 'LANDING';
    setCurrentView(cleanPath);
    setAuthView('none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeModule = useMemo(() => {
    if (currentView === 'admin' || currentView === 'adminrm' || currentView === 'rmadmin') return AppModule.ADMIN;
    if (currentView === 'mithu-ai') return 'AI_CHAT';
    
    const allModuleValues = Object.values(AppModule);
    return allModuleValues.find(m => m === currentView) || (currentView === 'LANDING' ? 'LANDING' : 'LANDING');
  }, [currentView]);

  // SEO: Dynamic Page Titles
  useEffect(() => {
    const siteTitle = (typeof settings?.websiteTitle === 'string') ? settings.websiteTitle : "Digital Desh BD";
    let pageTitle = siteTitle;

    switch(activeModule) {
      case AppModule.AGRI: pageTitle = isBangla ? `স্মার্ট কৃষি সেবা - ${siteTitle}` : `Smart Agri Services - ${siteTitle}`; break;
      case AppModule.HEALTH: pageTitle = isBangla ? `জরুরি স্বাস্থ্য সেবা - ${siteTitle}` : `Emergency Health Services - ${siteTitle}`; break;
      case AppModule.JOB: pageTitle = isBangla ? `চাকরির খবর ও ক্যারিয়ার - ${siteTitle}` : `Job Portal & Career - ${siteTitle}`; break;
      case AppModule.EDU: pageTitle = isBangla ? `অনলাইন শিক্ষা ও দক্ষতা - ${siteTitle}` : `Online Education - ${siteTitle}`; break;
      case AppModule.AMAR_BD: pageTitle = isBangla ? `আমার বাংলাদেশ পর্যটন - ${siteTitle}` : `Beautiful Bangladesh - ${siteTitle}`; break;
      case AppModule.JANTE_CHAI: pageTitle = isBangla ? `জানতে চাই (সাহিত্য ও ইতিহাস) - ${siteTitle}` : `Jante Chai (Literature) - ${siteTitle}`; break;
      case AppModule.ADMIN: pageTitle = `Admin Dashboard - ${siteTitle}`; break;
      case 'AI_CHAT': pageTitle = isBangla ? `মিঠু এআই সহকারী - ${siteTitle}` : `Mithu AI Assistant - ${siteTitle}`; break;
      default: pageTitle = isBangla ? `${siteTitle} - বাংলাদেশের ডিজিটাল সেবা পোর্টাল` : `${siteTitle} - Digital Services of Bangladesh`;
    }
    
    document.title = pageTitle;
  }, [activeModule, isBangla, settings?.websiteTitle]);

  const isAdminView = useMemo(() => {
    if (typeof window === 'undefined') return activeModule === AppModule.ADMIN;
    const path = window.location.pathname;
    return activeModule === AppModule.ADMIN || path.includes('admin') || path.includes('rmadmin');
  }, [activeModule]);

  const isChatView = currentView === 'mithu-ai' || activeModule === 'AI_CHAT';

  if (settings?.maintenanceMode && !isAdminView) {
    const maintenanceTitle = typeof settings?.websiteTitle === 'string' ? settings.websiteTitle : 'সোনালী দেশ';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 animate-pulse">
          <SettingsIcon size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          {isBangla ? 'রক্ষণাবেক্ষণ চলছে' : 'Maintenance in Progress'}
        </h1>
        <p className="text-gray-500 max-md font-medium leading-relaxed">
          {isBangla 
            ? 'আমরা ওয়েবসাইটটি আরও উন্নত করার কাজ করছি। খুব শীঘ্রই আমরা ফিরে আসব। আমাদের সাথেই থাকুন।' 
            : 'We are currently improving the website for a better experience. We will be back shortly.'}
        </p>
        <div className="mt-12 pt-8 border-t border-gray-100 w-full max-w-xs">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{maintenanceTitle}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeModule === 'AI_CHAT' && !user) {
      return <LoginPage onLoginSuccess={u => { setUser(u); setAuthView('none'); localStorage.setItem('digital_desh_bd_user_session', JSON.stringify({ user: u })); }} onNavigateToSignUp={() => setAuthView('signup')} onBack={() => handleNavigate('LANDING')} isBangla={isBangla} />;
    }
    
    if (activeModule === 'AI_CHAT') return <AiChatPage isBangla={isBangla} onBack={() => handleNavigate('LANDING')} onLogin={() => setAuthView('login')} />;
    if (authView === 'login') return <LoginPage onLoginSuccess={u => { setUser(u); setAuthView('none'); localStorage.setItem('digital_desh_bd_user_session', JSON.stringify({ user: u })); }} onNavigateToSignUp={() => setAuthView('signup')} onBack={() => setAuthView('none')} isBangla={isBangla} />;
    if (authView === 'signup') return <SignUpPage onSignUpSuccess={u => { setUser(u); setAuthView('none'); localStorage.setItem('digital_desh_bd_user_session', JSON.stringify({ user: u })); }} onNavigateToLogin={() => setAuthView('login')} onBack={() => setAuthView('none')} isBangla={isBangla} />;

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {(() => {
            switch (activeModule) {
              case AppModule.ADMIN: return <AdminModule isBangla={isBangla} onExit={() => handleNavigate('LANDING')} user={user} />;
              case AppModule.PROFILE: return user ? <ProfilePage user={user} onUpdateUser={setUser} isBangla={isBangla} /> : null;
              case AppModule.JOB: return <JobModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.BLOG: return <BlogModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.AMAR_BD: return <AmarBdModule isBangla={isBangla} onModuleSelect={m => handleNavigate(m)} />;
              case AppModule.AMAR_JELA: return <AmarJelaModule isBangla={isBangla} />;
              case AppModule.AGRI: return <AgriModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.HEALTH: return <HealthModule isBangla={isBangla} />;
              case AppModule.EDU: return <EduModule isBangla={isBangla} user={user} />;
              case AppModule.TRANSPORT: return <TransportModule isBangla={isBangla} />;
              case AppModule.CRAFT: return <CraftModule isBangla={isBangla} />;
              case AppModule.BAZAR_SODAI: return <BazarSodaiModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.WASTE: return <WasteModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.FISHERY: return <FisheryModule isBangla={isBangla} />;
              case AppModule.DISASTER: return <DisasterModule isBangla={isBangla} />;
              case AppModule.LEGAL: return <LegalModule isBangla={isBangla} />;
              case AppModule.EXPAT: return <ExpatModule isBangla={isBangla} />;
              case AppModule.VOCATIONAL: return <VocationalModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.JANTE_CHAI: return <JanteChaiModule isBangla={isBangla} />;
              case AppModule.CONTACT: return <ContactModule isBangla={isBangla} />;
              case AppModule.ABOUT: return <AboutModule isBangla={isBangla} />;
              case AppModule.PRIVACY: return <PrivacyModule isBangla={isBangla} />;
              case AppModule.TERMS: return <TermsModule isBangla={isBangla} />;
              case 'LANDING':
              default: return (
                <LandingPage 
                  user={user} 
                  onLogin={() => setAuthView('login')} 
                  onRegister={() => setAuthView('signup')}
                  onLogout={() => { setUser(null); localStorage.removeItem('digital_desh_bd_user_session'); }}
                  onOpenAiChat={() => handleNavigate('mithu-ai')}
                  onModuleSelect={m => handleNavigate(m)}
                  isBangla={isBangla}
                  toggleLanguage={() => setIsBangla(!isBangla)}
                />
              );
            }
          })()}
        </Suspense>
        
        {!isAdminView && !isChatView && (
          <GeminiAssistant currentModule={activeModule as AppModule} isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />
        )}

        {!isAdminView && !isChatView && (
          <Footer isBangla={isBangla} toggleLanguage={() => setIsBangla(!isBangla)} onNavigateHome={() => handleNavigate('LANDING')} onModuleSelect={m => handleNavigate(m)} />
        )}
        <ScrollToTop />
      </ErrorBoundary>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {settings?.announcementActive && (typeof settings.announcement === 'string') && !isAdminView && (
        <div className="bg-amber-400 text-black py-2.5 px-4 text-center font-black text-xs md:text-sm relative z-[60] border-b border-amber-500 shadow-sm animate-fade-in">
           <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
              <Bell size={16} className="shrink-0 animate-bounce" />
              <span>{settings.announcement}</span>
           </div>
        </div>
      )}

      {!isAdminView && !isChatView && (
        <Header 
          user={user} 
          onLogin={() => setAuthView('login')} 
          onRegister={() => setAuthView('signup')} 
          onLogout={() => { setUser(null); localStorage.removeItem('digital_desh_bd_user_session'); }}
          onModuleSelect={m => handleNavigate(m)}
          onNavigateHome={() => handleNavigate('LANDING')}
          isBangla={isBangla}
          toggleLanguage={() => setIsBangla(!isBangla)}
        />
      )}
      {renderContent()}
    </div>
  );
};

export default App;
