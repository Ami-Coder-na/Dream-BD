
import React, { useState, Suspense, lazy } from 'react';
import { User, UserRole, AppModule } from './types';
import { Dashboard } from './components/Dashboard';
import { GeminiAssistant } from './components/GeminiAssistant';
import { LandingPage } from './components/LandingPage';
import { AiChatPage } from './components/AiChatPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Button } from './components/ui/Button';
import { Menu, Bell, LogOut, Globe, Search, User as UserIcon, Briefcase, MessageCircle, Home, Heart, Loader2 } from 'lucide-react';

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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [authView, setAuthView] = useState<'none' | 'login' | 'signup'>('none');
  const [showNotifications, setShowNotifications] = useState(false);

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
    setSidebarOpen(false);
  };

  const handleNavigateHome = () => {
    setActiveModule('LANDING');
  };

  // Render AI Chat Page if requested
  if (showAiChat) {
    return (
      <AiChatPage 
        onBack={() => setShowAiChat(false)} 
        isBangla={isBangla} 
      />
    );
  }

  // Render Authentication Views
  if (!user && authView === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignUp={navigateToSignUp}
        onBack={navigateBack}
        isBangla={isBangla}
      />
    );
  }

  if (!user && authView === 'signup') {
    return (
      <SignUpPage 
        onSignUpSuccess={handleLoginSuccess}
        onNavigateToLogin={navigateToLogin}
        onBack={navigateBack}
        isBangla={isBangla}
      />
    );
  }

  // Helper to determine if we are in "Website Mode" (Full Page) vs "App Mode" (Sidebar)
  // ALL modules except Profile are now full website pages.
  const isWebsitePage = activeModule !== AppModule.PROFILE;

  if (isWebsitePage) {
    const renderWebsiteContent = () => {
      // Use Suspense to handle the lazy loaded components
      return (
        <Suspense fallback={<LoadingFallback />}>
          {(() => {
            switch (activeModule) {
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
      );
    };

    if (activeModule === 'LANDING') {
      return renderWebsiteContent();
    }

    return (
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
             ? renderWebsiteContent() // These already have container
             : (
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
                 {renderWebsiteContent()}
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
    );
  }

  // Render App (Sidebar Layout) for Profile (Only module left using sidebar)
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div 
          className="p-6 flex items-center gap-3 border-b border-gray-100 h-20 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleNavigateHome}
        >
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-gray-800">Dream BD</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
          
          <button 
             onClick={handleNavigateHome}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 mb-4`}
          >
            <Home size={20} />
            {isBangla ? 'হোম পেজ' : 'Home Page'}
          </button>

          {user && (
            <div className="mb-6">
               <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                 {isBangla ? 'আমার একাউন্ট' : 'My Account'}
               </p>
               <button 
                 onClick={() => { setActiveModule(AppModule.PROFILE); setSidebarOpen(false); }}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeModule === AppModule.PROFILE ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
               >
                 <UserIcon size={20} />
                 {isBangla ? 'প্রোফাইল ও সেটিংস' : 'Profile & Settings'}
               </button>
            </div>
          )}

          <div className="mb-6">
             <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
               {isBangla ? 'দ্রুত লিঙ্ক' : 'Quick Links'}
             </p>
             <button 
                onClick={() => { setActiveModule(AppModule.AMAR_BD); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
             >
                <Heart size={20} />
                {isBangla ? 'আমার বাংলাদেশ' : 'Amar BD'}
             </button>
             <button 
               onClick={() => { setActiveModule(AppModule.JOB); setSidebarOpen(false); }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50`}
             >
               <Briefcase size={20} />
               {isBangla ? 'চাকরি' : 'Jobs'}
             </button>
             <button 
               onClick={() => { setActiveModule(AppModule.CONTACT); setSidebarOpen(false); }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50`}
             >
               <MessageCircle size={20} />
               {isBangla ? 'যোগাযোগ' : 'Contact'}
             </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area for App Modules */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 lg:w-96">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder={isBangla ? 'সার্চ করুন...' : 'Search services, products...'} 
                className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button 
              onClick={() => setIsBangla(!isBangla)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-600 px-3 py-1.5 rounded-full border border-gray-200 hover:border-brand-200 transition-colors"
            >
              <Globe size={16} />
              <span>{isBangla ? 'EN' : 'BN'}</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-gray-900">{isBangla ? 'নোটিফিকেশন' : 'Notifications'}</h4>
                    <span className="text-xs text-brand-600 font-medium cursor-pointer">{isBangla ? 'সব মুছুন' : 'Clear all'}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-800 font-medium">{isBangla ? 'স্বাগতম!' : 'Welcome!'}</p>
                        <p className="text-xs text-gray-500">{isBangla ? 'ড্রিম বিডি প্ল্যাটফর্মে স্বাগতম।' : 'Welcome to Dream BD platform.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer" onClick={() => setActiveModule(AppModule.PROFILE)}>
                <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                <div className="hidden md:block text-sm">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="p-2 text-gray-400 hover:text-red-600 ml-2" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <Button onClick={navigateToLogin} size="sm">
                  {isBangla ? 'লগইন' : 'Login'}
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* View Content */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <Dashboard 
            user={user} 
            activeModule={activeModule as AppModule} 
            onModuleSelect={handleModuleSelect}
            onUpdateUser={handleUpdateUser}
            isBangla={isBangla}
          />
        </div>
      </main>

      {/* Global AI Assistant */}
      <GeminiAssistant currentModule={activeModule as AppModule} isBangla={isBangla} />

    </div>
  );
};

export default App;
