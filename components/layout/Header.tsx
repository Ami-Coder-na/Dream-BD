
import React, { useState } from 'react';
import { Menu, X, Globe, Bell, LogOut, ChevronDown, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { User, AppModule } from '../../types';

interface HeaderProps {
  user?: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onModuleSelect: (module: AppModule) => void;
  onNavigateHome: () => void;
  isBangla: boolean;
  toggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogin, 
  onRegister, 
  onLogout,
  onModuleSelect,
  onNavigateHome,
  isBangla, 
  toggleLanguage 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const modules = [
    { id: AppModule.CRAFT, title: isBangla ? 'কারুশিল্প' : 'Crafts' },
    { id: AppModule.AGRI, title: isBangla ? 'কৃষি' : 'Agriculture' },
    { id: AppModule.HEALTH, title: isBangla ? 'স্বাস্থ্য' : 'Health' },
    { id: AppModule.EDU, title: isBangla ? 'শিক্ষা' : 'Education' },
    { id: AppModule.TRANSPORT, title: isBangla ? 'পরিবহন' : 'Transport' },
    { id: AppModule.WASTE, title: isBangla ? 'বর্জ্য' : 'Waste Mgmt' },
    { id: AppModule.FISHERY, title: isBangla ? 'মৎস্য' : 'Fishery' },
    { id: AppModule.DISASTER, title: isBangla ? 'দুর্যোগ' : 'Disaster' },
  ];

  const handleModuleClick = (moduleId: AppModule) => {
    onModuleSelect(moduleId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={onNavigateHome}
          >
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              D
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Dream BD</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
              {/* Services Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors py-2"
                >
                  {isBangla ? 'সেবাসমূহ' : 'Services'}
                  <ChevronDown size={16} />
                </button>
                
                <div className="absolute top-full -left-4 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors flex items-center gap-3"
                      onClick={() => handleModuleClick(mod.id)}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                      <span className="font-medium">{mod.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <button onClick={() => onModuleSelect(AppModule.JOB)} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                {isBangla ? 'চাকরি' : 'Jobs'}
              </button>

              <button onClick={() => onModuleSelect(AppModule.BLOG)} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                {isBangla ? 'ব্লগ' : 'Blog'}
              </button>

              <button onClick={() => onModuleSelect(AppModule.CONTACT)} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                {isBangla ? 'যোগাযোগ' : 'Contact'}
              </button>
          </div>
          
          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-brand-600 hover:bg-gray-50 rounded-full transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-gray-900">{isBangla ? 'নোটিফিকেশন' : 'Notifications'}</h4>
                    <span className="text-xs text-brand-600 font-medium cursor-pointer">{isBangla ? 'সব দেখুন' : 'View all'}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <div className="w-2 h-2 mt-2 rounded-full bg-brand-500 shrink-0"></div>
                      <div>
                        <p className="text-sm text-gray-800 font-medium">{isBangla ? 'নতুন এআই চ্যাট!' : 'New Feature: AI Chat'}</p>
                        <p className="text-xs text-gray-500">{isBangla ? 'আমাদের স্মার্ট সহকারীর সাথে কথা বলুন।' : 'Talk to our smart assistant now!'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600 px-3 py-1.5 rounded-full border border-gray-200 hover:border-brand-200 transition-all"
            >
              <Globe size={16} />
              <span>{isBangla ? 'English' : 'বাংলা'}</span>
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2"
                >
                  <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                      <button 
                        onClick={() => {
                          onModuleSelect(AppModule.PROFILE);
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <UserIcon size={16} />
                        {isBangla ? 'প্রোফাইল' : 'Profile'}
                      </button>
                      <div className="border-t border-gray-50 my-1"></div>
                      <button 
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        {isBangla ? 'লগ আউট' : 'Log Out'}
                      </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={onLogin} variant="primary" className="shadow-lg shadow-brand-500/20">
                {isBangla ? 'লগইন' : 'Login'}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-xl h-[calc(100vh-5rem)] overflow-y-auto">
            {user && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            )}

            <div className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">
              {isBangla ? 'সেবাসমূহ' : 'Services'}
            </div>
            <div className="pl-4 grid grid-cols-2 gap-2 mb-2">
              {modules.map((mod) => (
                <button 
                  key={mod.id} 
                  onClick={() => handleModuleClick(mod.id)} 
                  className="text-xs text-gray-500 text-left py-1 hover:text-brand-600"
                >
                  {mod.title}
                </button>
              ))}
            </div>
            
            <button onClick={() => handleModuleClick(AppModule.JOB)} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">
              {isBangla ? 'চাকরি' : 'Jobs'}
            </button>

            <button onClick={() => handleModuleClick(AppModule.BLOG)} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">
              {isBangla ? 'ব্লগ' : 'Blog'}
            </button>
            
            <button onClick={() => handleModuleClick(AppModule.CONTACT)} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">
              {isBangla ? 'যোগাযোগ' : 'Contact'}
            </button>
            
            <div className="flex gap-4 mt-2">
              <Button onClick={toggleLanguage} variant="outline" size="sm" className="flex-1">
                {isBangla ? 'English' : 'বাংলা'}
              </Button>
              {user ? (
                  <Button onClick={onLogout} variant="danger" size="sm" className="flex-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
                    {isBangla ? 'লগ আউট' : 'Log Out'}
                  </Button>
              ) : (
                  <Button onClick={onLogin} className="flex-1">
                    {isBangla ? 'লগইন' : 'Login'}
                  </Button>
              )}
            </div>
        </div>
      )}
    </nav>
  );
};
