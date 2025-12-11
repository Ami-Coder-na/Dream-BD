
import React, { useState } from 'react';
import { Menu, X, Globe, Bell, LogOut, ChevronDown, User as UserIcon, Heart, Map, ShoppingBasket, Check, Trash2, Info, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { User, AppModule, Notification } from '../../types';

interface HeaderProps {
  user?: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onModuleSelect: (module: AppModule) => void;
  onNavigateHome: () => void;
  isBangla: boolean;
  toggleLanguage: () => void;
  notifications?: Notification[];
  onMarkAllRead?: () => void;
  onClearNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogin, 
  onRegister, 
  onLogout,
  onModuleSelect,
  onNavigateHome,
  isBangla, 
  toggleLanguage,
  notifications = [],
  onMarkAllRead,
  onClearNotifications
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-orange-500" />;
      case 'alert': return <ShieldAlert size={16} className="text-red-600 animate-pulse" />;
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 60000); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
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
              <button 
                onClick={() => onModuleSelect(AppModule.AMAR_BD)} 
                className="flex items-center gap-2 text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
              >
                <Heart size={14} fill="currentColor" />
                {isBangla ? 'আমার বাংলাদেশ' : 'Amar BD'}
              </button>

              <button 
                onClick={() => onModuleSelect(AppModule.AMAR_JELA)} 
                className="flex items-center gap-2 text-sm font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors"
              >
                <Map size={14} />
                {isBangla ? 'আমার জেলা' : 'Amar Jela'}
              </button>

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
              
              <button 
                onClick={() => onModuleSelect(AppModule.BAZAR_SODAI)} 
                className="flex items-center gap-2 text-sm font-bold text-lime-700 bg-lime-50 px-3 py-1.5 rounded-full hover:bg-lime-100 transition-colors"
              >
                <ShoppingBasket size={14} />
                {isBangla ? 'বাজার সদাই' : 'Bazar Sodai'}
              </button>

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
                className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{isBangla ? 'নোটিফিকেশন' : 'Notifications'}</h4>
                      {unreadCount > 0 && (
                        <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={onMarkAllRead} 
                         className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                         title={isBangla ? 'সব পড়া হয়েছে' : 'Mark all read'}
                       >
                         <Check size={16} />
                       </button>
                       <button 
                         onClick={onClearNotifications} 
                         className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                         title={isBangla ? 'সব মুছুন' : 'Clear all'}
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-50">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              if(notif.moduleId) onModuleSelect(notif.moduleId);
                              setShowNotifications(false);
                            }}
                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-brand-50/30' : ''}`}
                          >
                            <div className={`mt-1 shrink-0`}>
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <p className={`text-sm font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {notif.title}
                                </p>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                  {formatTime(notif.timestamp)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="self-center w-2 h-2 bg-brand-500 rounded-full shrink-0"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">{isBangla ? 'কোন নোটিফিকেশন নেই' : 'No notifications'}</p>
                      </div>
                    )}
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
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-600 p-1"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Notifications Overlay */}
      {showNotifications && (
         <div className="lg:hidden absolute top-20 left-0 right-0 bg-white shadow-xl z-40 border-b border-gray-100 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 bg-gray-50 sticky top-0">
               <h4 className="font-bold text-gray-900">{isBangla ? 'নোটিফিকেশন' : 'Notifications'}</h4>
               <button onClick={() => setShowNotifications(false)}><X size={20} /></button>
            </div>
            {notifications.length > 0 ? (
               <div className="divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => {
                         if(notif.moduleId) onModuleSelect(notif.moduleId);
                         setShowNotifications(false);
                      }}
                      className={`p-4 flex gap-3 ${!notif.read ? 'bg-brand-50/20' : ''}`}
                    >
                       <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                       <div>
                          <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-2">{formatTime(notif.timestamp)}</p>
                       </div>
                    </div>
                  ))}
               </div>
            ) : (
               <div className="p-8 text-center text-gray-400">{isBangla ? 'কোন নোটিফিকেশন নেই' : 'No notifications'}</div>
            )}
         </div>
      )}

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

            <button 
              onClick={() => handleModuleClick(AppModule.AMAR_BD)} 
              className="flex items-center gap-2 text-left font-bold text-green-700 bg-green-50 p-3 rounded-lg border border-green-100"
            >
               <Heart size={16} fill="currentColor" />
              {isBangla ? 'আমার বাংলাদেশ' : 'Amar BD'}
            </button>

            <button 
              onClick={() => handleModuleClick(AppModule.AMAR_JELA)} 
              className="flex items-center gap-2 text-left font-bold text-teal-700 bg-teal-50 p-3 rounded-lg border border-teal-100"
            >
               <Map size={16} />
              {isBangla ? 'আমার জেলা' : 'Amar Jela'}
            </button>

            <button 
                onClick={() => handleModuleClick(AppModule.BAZAR_SODAI)} 
                className="flex items-center gap-2 text-left font-bold text-lime-700 bg-lime-50 p-3 rounded-lg border border-lime-100"
              >
                <ShoppingBasket size={16} />
                {isBangla ? 'বাজার সদাই' : 'Bazar Sodai'}
              </button>

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
