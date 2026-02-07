
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
      </div>
      <h2 className="text-xl font-black text-gray-800 tracking-tighter animate-pulse uppercase">
        {siteTitle}
      </h2>
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
const NidPrintModule = lazy(() => import('./components/modules/NidPrintModule').then(m => ({ default: m.NidPrintModule })));
const PhotoStudioModule = lazy(() => import('./components/modules/PhotoStudioModule').then(m => ({ default: m.PhotoStudioModule })));

const App: React.FC = () => {
  const { logVisit, isLoading } = useData();
  const { settings } = useSiteConfig();
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize view based on URL to prevent flashing or wrong initial render
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      if (path === '/adminrm') return 'admin';
    }
    return 'LANDING';
  });

  const [user, setUser] = useState<User | null>(null);
  const [isBangla, setIsBangla] = useState(true);
  const [authView, setAuthView] = useState<'none' | 'login' | 'signup'>('none');

  useEffect(() => {
    setIsMounted(true);
    console.log("App Version: v2.5 (Stable Admin)");
    
    // URL Cleanup: If accidentally at /lander, visually reset to root without reloading
    if (typeof window !== 'undefined' && window.location.pathname === '/lander') {
       window.history.replaceState(null, '', '/');
    }

    try {
      const saved = localStorage.getItem('digital_desh_bd_user_session');
      if (saved && saved !== "undefined" && saved !== "null") {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.user) {
          setUser(parsed.user);
        }
      }
    } catch (e) { 
      localStorage.removeItem('digital_desh_bd_user_session');
    }
    
    logVisit();
  }, [logVisit]);

  const handleNavigate = useCallback((viewPath: string) => {
    const cleanPath = viewPath.replace(/^\/|\/$/g, '') || 'LANDING';
    setCurrentView(cleanPath);
    setAuthView('none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [viewModule, viewParam] = (currentView || '').split(':');

  const activeModule = useMemo(() => {
    // STRICT CHECK: Only allow admin view if the state matches explicitly
    if (viewModule === 'admin') return AppModule.ADMIN;
    if (viewModule === 'mithu-ai') return 'AI_CHAT';
    
    const allModuleValues = Object.values(AppModule);
    return allModuleValues.find(m => m === viewModule) || (viewModule === 'LANDING' ? 'LANDING' : 'LANDING');
  }, [viewModule]);

  const isAdminView = useMemo(() => {
    return activeModule === AppModule.ADMIN;
  }, [activeModule]);

  const isChatView = currentView === 'mithu-ai' || activeModule === 'AI_CHAT';
  const isToolView = activeModule === AppModule.NID_PRINT || activeModule === AppModule.PHOTO_STUDIO;

  if (!isMounted) {
    return <LoadingFallback />;
  }

  // Only show maintenance mode if NOT admin and maintenance is active
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
              case AppModule.ADMIN: 
                return <AdminModule isBangla={isBangla} onExit={() => { window.location.href = '/'; }} user={user} />;
              case AppModule.PROFILE: return user ? <ProfilePage user={user} onUpdateUser={setUser} isBangla={isBangla} onLogout={() => { setUser(null); localStorage.removeItem('digital_desh_bd_user_session'); handleNavigate('LANDING'); }} /> : null;
              case AppModule.JOB: return <JobModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} initialView={viewParam} />;
              case AppModule.BLOG: return <BlogModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.AMAR_BD: return <AmarBdModule isBangla={isBangla} onModuleSelect={m => handleNavigate(m)} />;
              case AppModule.AMAR_JELA: return <AmarJelaModule isBangla={isBangla} />;
              case AppModule.AGRI: return <AgriModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} initialTab={viewParam} />;
              case AppModule.HEALTH: return <HealthModule isBangla={isBangla} />;
              case AppModule.EDU: return <EduModule isBangla={isBangla} user={user} />;
              case AppModule.TRANSPORT: return <TransportModule isBangla={isBangla} />;
              case AppModule.CRAFT: return <CraftModule isBangla={isBangla} />;
              case AppModule.BAZAR_SODAI: return <BazarSodaiModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.WASTE: return <WasteModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.FISHERY: return <FisheryModule isBangla={isBangla} initialTab={viewParam} />;
              case AppModule.DISASTER: return <DisasterModule isBangla={isBangla} />;
              case AppModule.LEGAL: return <LegalModule isBangla={isBangla} />;
              case AppModule.EXPAT: return <ExpatModule isBangla={isBangla} initialTab={viewParam} />;
              case AppModule.VOCATIONAL: return <VocationalModule isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />;
              case AppModule.JANTE_CHAI: return <JanteChaiModule isBangla={isBangla} />;
              case AppModule.CONTACT: return <ContactModule isBangla={isBangla} />;
              case AppModule.ABOUT: return <AboutModule isBangla={isBangla} />;
              case AppModule.PRIVACY: return <PrivacyModule isBangla={isBangla} />;
              case AppModule.TERMS: return <TermsModule isBangla={isBangla} />;
              case AppModule.NID_PRINT: return <NidPrintModule isBangla={isBangla} />;
              case AppModule.PHOTO_STUDIO: return <PhotoStudioModule isBangla={isBangla} />;
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

        {!isAdminView && !isChatView && !isToolView && (
          <Footer isBangla={isBangla} toggleLanguage={() => setIsBangla(!isBangla)} onNavigateHome={() => handleNavigate('LANDING')} onModuleSelect={m => handleNavigate(m)} />
        )}
        <ScrollToTop />
      </ErrorBoundary>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Global Data Loading Indicator (Top Bar) */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-[100] overflow-hidden">
           <div className="h-full bg-brand-600 animate-pulse w-full origin-left"></div>
        </div>
      )}

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
          onLogout={() => { setUser(null); localStorage.removeItem('digital_desh_bd_user_session'); handleNavigate('LANDING'); }}
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