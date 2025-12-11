
import React, { useState, Suspense, lazy } from 'react';
import { User, AppModule } from './types';
import { GeminiAssistant } from './components/GeminiAssistant';
import { LandingPage } from './components/LandingPage';
import { AiChatPage } from './components/AiChatPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

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
const ProfilePage = lazy(() => import('./components/ProfilePage').then(module => ({ default: module.ProfilePage })));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-brand-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); 
  const [activeModule, setActiveModule] = useState<AppModule | 'LANDING'>('LANDING');
  const [isBangla, setIsBangla] = useState(true);
  const [showAiChat, setShowAiChat] = useState(false);
  const [authView, setAuthView] = useState<'none' | 'login' | 'signup'>('none');

  // Login handler
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAuthView('none');
    setShowAiChat(false);
    setActiveModule('LANDING'); // Default to Landing Page after login
  };
  
  const handleLogout = () => {
    setUser(null);
    setAuthView('none');
    setActiveModule('LANDING');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const navigateToLogin = () => setAuthView('login');
  const navigateToSignUp = () => setAuthView('signup');
  const navigateBack = () => setAuthView('none');

  // Module Selection Handler
  const handleModuleSelect = (module: AppModule) => {
    setActiveModule(module);
  };

  const handleNavigateHome = () => {
    setActiveModule('LANDING');
  };

  // Render AI Chat Page if requested
  if (showAiChat) {
    return (
      <ErrorBoundary>
        <AiChatPage 
          onBack={() => setShowAiChat(false)} 
          isBangla={isBangla} 
        />
      </ErrorBoundary>
    );
  }

  // Render Authentication Views
  if (!user && authView === 'login') {
    return (
      <ErrorBoundary>
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignUp={navigateToSignUp}
          onBack={navigateBack}
          isBangla={isBangla}
        />
      </ErrorBoundary>
    );
  }

  if (!user && authView === 'signup') {
    return (
      <ErrorBoundary>
        <SignUpPage 
          onSignUpSuccess={handleLoginSuccess}
          onNavigateToLogin={navigateToLogin}
          onBack={navigateBack}
          isBangla={isBangla}
        />
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    // Use Suspense to handle the lazy loaded components and ErrorBoundary to catch failures
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {(() => {
            switch (activeModule) {
              case AppModule.PROFILE:
                if (!user) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="text-gray-500 mb-4 font-medium">
                        {isBangla ? 'প্রোফাইল দেখতে অনুগ্রহ করে লগইন করুন।' : 'Please log in to view your profile.'}
                      </div>
                      <button 
                        onClick={navigateToLogin}
                        className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-md"
                      >
                        {isBangla ? 'লগইন' : 'Login'}
                      </button>
                    </div>
                  );
                }
                return <ProfilePage user={user} onUpdateUser={handleUpdateUser} isBangla={isBangla} />;
              case AppModule.JOB: return <JobModule isBangla={isBangla} />;
              case AppModule.BLOG: return <BlogModule isBangla={isBangla} />;
              case AppModule.CONTACT: return <ContactModule isBangla={isBangla} />;
              case AppModule.AMAR_BD: return <AmarBdModule isBangla={isBangla} onModuleSelect={handleModuleSelect} />;
              case AppModule.AMAR_JELA: return <AmarJelaModule isBangla={isBangla} />;
              case AppModule.BAZAR_SODAI: return <BazarSodaiModule isBangla={isBangla} />;
              case AppModule.CRAFT: return <CraftModule isBangla={isBangla} />;
              case AppModule.AGRI: return <AgriModule isBangla={isBangla} />;
              case AppModule.EDU: return <EduModule isBangla={isBangla} />;
              case AppModule.HEALTH: return <HealthModule isBangla={isBangla} />;
              case AppModule.TRANSPORT: return <TransportModule isBangla={isBangla} />;
              case AppModule.WASTE: return <WasteModule isBangla={isBangla} />;
              case AppModule.FISHERY: return <FisheryModule isBangla={isBangla} />;
              case AppModule.DISASTER: return <DisasterModule isBangla={isBangla} />;
              case 'LANDING':
              default:
                return (
                  <LandingPage 
                    user={user}
                    onLogin={navigateToLogin}
                    onRegister={navigateToSignUp}
                    onLogout={handleLogout}
                    onOpenAiChat={() => setShowAiChat(true)}
                    onModuleSelect={handleModuleSelect}
                    isBangla={isBangla} 
                    toggleLanguage={() => setIsBangla(!isBangla)} 
                  />
                );
            }
          })()}
        </Suspense>
      </ErrorBoundary>
    );
  };

  if (activeModule === 'LANDING') {
    return (
      <>
        {renderContent()}
      </>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <Header 
          user={user} 
          onLogin={navigateToLogin} 
          onRegister={navigateToSignUp} 
          onLogout={handleLogout} 
          onModuleSelect={handleModuleSelect}
          onNavigateHome={handleNavigateHome}
          isBangla={isBangla} 
          toggleLanguage={() => setIsBangla(!isBangla)} 
        />
        <div className="flex-1">
            {/* Wrapper to ensure full page modules look good */}
            {activeModule === AppModule.JOB || activeModule === AppModule.BLOG || activeModule === AppModule.CONTACT || activeModule === AppModule.AMAR_BD || activeModule === AppModule.AMAR_JELA || activeModule === AppModule.BAZAR_SODAI
              ? renderContent() // These already have container
              : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
                  {renderContent()}
                </div>
              )
            }
        </div>
        <Footer 
          isBangla={isBangla} 
          toggleLanguage={() => setIsBangla(!isBangla)} 
          onNavigateHome={handleNavigateHome}
        />
        <GeminiAssistant currentModule={activeModule as AppModule} isBangla={isBangla} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
