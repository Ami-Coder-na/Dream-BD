import React, { useState } from 'react';
import { User, UserRole, AppModule } from './types';
import { Dashboard } from './components/Dashboard';
import { GeminiAssistant } from './components/GeminiAssistant';
import { LandingPage } from './components/LandingPage';
import { Layout, Menu, Bell, LogOut, Globe, Search } from 'lucide-react';

const MOCK_USER: User = {
  id: 'u1',
  name: 'Rahim Uddin',
  role: UserRole.CITIZEN,
  avatar: 'https://i.pravatar.cc/150?u=rahim'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); 
  const [activeModule, setActiveModule] = useState<AppModule>(AppModule.HOME);
  const [isBangla, setIsBangla] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Simple login handler
  const handleLogin = () => {
    setUser(MOCK_USER);
    setActiveModule(AppModule.HOME);
  };
  
  const handleLogout = () => setUser(null);

  // Render Landing Page if not logged in
  if (!user) {
    return (
      <LandingPage 
        onLogin={handleLogin} 
        isBangla={isBangla} 
        toggleLanguage={() => setIsBangla(!isBangla)} 
      />
    );
  }

  // Render Dashboard if logged in
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
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 h-20">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-gray-800">Dream BD</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="mb-6">
             <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
               {isBangla ? 'প্রধান মেনু' : 'Main Menu'}
             </p>
             <button 
               onClick={() => { setActiveModule(AppModule.HOME); setSidebarOpen(false); }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeModule === AppModule.HOME ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
             >
               <Layout size={20} />
               {isBangla ? 'ড্যাশবোর্ড' : 'Dashboard'}
             </button>
          </div>

          <div>
             <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
               {isBangla ? 'সেবাসমূহ' : 'Services'}
             </p>
             {/* Simple list of modules as Nav Items */}
             {[AppModule.CRAFT, AppModule.AGRI, AppModule.EDU, AppModule.HEALTH, AppModule.TRANSPORT].map((mod) => (
                <button 
                  key={mod}
                  onClick={() => { setActiveModule(mod); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeModule === mod ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                  <span className="capitalize">{mod}</span>
                </button>
             ))}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
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
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 ml-2" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <Dashboard 
            user={user} 
            activeModule={activeModule} 
            onModuleSelect={setActiveModule}
            isBangla={isBangla}
          />
        </div>
      </main>

      {/* Global AI Assistant */}
      <GeminiAssistant currentModule={activeModule} isBangla={isBangla} />

    </div>
  );
};

export default App;