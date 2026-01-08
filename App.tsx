
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
import { Loader2 } from 'lucide-react';
import { useData } from './contexts/DataContext';

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

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
    <p className="text-brand-700 font-bold">লোড হচ্ছে...</p>
  </div>
);

const App: React.FC = () => {
  const { logVisit } = useData();
  const [currentView, setCurrentView] = useState('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [isBangla, setIsBangla] = useState(true);
  const [authView, setAuthView] = useState<'none' | 'login' | 'signup'>('none');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('digital_desh_bd_user_session');
      if (saved) setUser(JSON.parse(saved).user);
    } catch (e) { console.error(e); }
    
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
    // Robustly clean path for state routing
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

  const renderContent = () => {
    // If accessing AI Chat and not logged in, show Login Page directly
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
        
        {/* Condition to hide Mithu AI icon on Admin module and AI Chat page */}
        {activeModule !== AppModule.ADMIN && activeModule !== 'AI_CHAT' && (
          <GeminiAssistant currentModule={activeModule as AppModule} isBangla={isBangla} user={user} onLogin={() => setAuthView('login')} />
        )}

        {activeModule !== AppModule.ADMIN && (
          <Footer isBangla={isBangla} toggleLanguage={() => setIsBangla(!isBangla)} onNavigateHome={() => handleNavigate('LANDING')} onModuleSelect={m => handleNavigate(m)} />
        )}
        <ScrollToTop />
      </ErrorBoundary>
    );
  };

  return (
    <div className="min-h-screen bg-white">
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
      {renderContent()}
    </div>
  );
};

export default App;
