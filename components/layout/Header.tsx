
"use client";

import React, { useState } from 'react';
import { Menu, X, Globe, ChevronDown, User as UserIcon, Shield, HelpCircle, Bell, Bird, Info, ArrowRight, Briefcase, FileText, LayoutGrid, MapPin, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { User, AppModule, UserRole } from '../../types';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

interface HeaderProps {
  user?: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onModuleSelect: (module: AppModule | string) => void;
  onNavigateHome: () => void;
  isBangla: boolean;
  toggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, onLogin, onRegister, onLogout, onModuleSelect, onNavigateHome, isBangla, toggleLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { modules, settings } = useSiteConfig();

  const handleModuleClick = (moduleId: AppModule | string) => {
    setMobileMenuOpen(false);
    onModuleSelect(moduleId);
  };

  const allServices = [
    { id: AppModule.CRAFT, title: isBangla ? 'কারুশিল্প' : 'Crafts' },
    { id: AppModule.AGRI, title: isBangla ? 'কৃষি' : 'Agriculture' },
    { id: AppModule.HEALTH, title: isBangla ? 'স্বাস্থ্য' : 'Health' },
    { id: AppModule.EDU, title: isBangla ? 'শিক্ষা' : 'Education' },
    { id: AppModule.TRANSPORT, title: isBangla ? 'পরিবহন' : 'Transport' },
    { id: AppModule.WASTE, title: isBangla ? 'বর্জ্য' : 'Waste' },
    { id: AppModule.FISHERY, title: isBangla ? 'মৎস্য' : 'Fishery' },
    { id: AppModule.DISASTER, title: isBangla ? 'দুর্যোগ' : 'Disaster' },
    { id: AppModule.LEGAL, title: isBangla ? 'আইনি সহায়তা' : 'Legal' },
    { id: AppModule.EXPAT, title: isBangla ? 'প্রবাসী' : 'Expat' },
    { id: AppModule.VOCATIONAL, title: isBangla ? 'কারিগরি' : 'Vocational' },
  ].filter(s => modules[s.id]);

  // Error #31 Fix: Defensive string check
  const siteTitleString = typeof settings?.websiteTitle === 'string' ? settings.websiteTitle : 'Digital Desh BD';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 h-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0 group" onClick={onNavigateHome}>
            <div className="h-16 w-auto flex items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src={settings?.websiteLogo || "https://zpsxpqurazjeqviwooky.supabase.co/storage/v1/object/public/images/logo.png"} 
                  className="h-full w-auto object-contain" 
                  alt="Site Logo" 
                  onError={(e) => e.currentTarget.src = "https://placehold.co/150x150?text=D"} 
                />
            </div>
            {settings?.showWebsiteTitle && (
              <span className="text-xl font-black text-gray-800 hidden xl:block uppercase tracking-tighter animate-fade-in">
                {siteTitleString}
              </span>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-3">
            <button onClick={() => handleModuleClick(AppModule.AMAR_BD)} className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-all flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {isBangla ? 'আমার বাংলাদেশ' : 'Amar BD'}
            </button>
            
            <button onClick={() => handleModuleClick(AppModule.AMAR_JELA)} className="px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-bold text-sm hover:bg-teal-100 transition-all flex items-center gap-2">
               {isBangla ? 'আমার জেলা' : 'Amar Jela'}
            </button>

            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-600 hover:text-brand-600 transition-colors">
                {isBangla ? 'সেবাসমূহ' : 'Services'} <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0">
                {allServices.map(s => (
                  <button key={s.id} onClick={() => handleModuleClick(s.id)} className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 font-medium">{s.title}</button>
                ))}
              </div>
            </div>

            <button onClick={() => handleModuleClick(AppModule.BAZAR_SODAI)} className="px-4 py-2 rounded-full bg-lime-50 text-lime-700 font-bold text-sm hover:bg-lime-100 transition-all">
               {isBangla ? 'বাজার সদাই' : 'Bazar Sodai'}
            </button>

            <button onClick={() => handleModuleClick(AppModule.JOB)} className="px-3 py-2 text-sm font-bold text-gray-600 hover:text-brand-600 transition-colors">
              {isBangla ? 'চাকরি' : 'Jobs'}
            </button>

            <button onClick={() => handleModuleClick(AppModule.BLOG)} className="px-3 py-2 text-sm font-bold text-gray-600 hover:text-brand-600 transition-colors">
              {isBangla ? 'ব্লগ' : 'Blog'}
            </button>

            <button onClick={() => handleModuleClick(AppModule.JANTE_CHAI)} className="px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 font-black text-sm hover:bg-indigo-100 transition-all flex items-center gap-2 shadow-sm mr-2">
              <HelpCircle size={16} /> {isBangla ? 'জানতে চাই' : 'Learn'}
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-gray-50 rounded-full transition-colors relative">
               <Bell size={22} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Globe size={18} className="text-gray-400" />
              {isBangla ? 'English' : 'বাংলা'}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                 <button onClick={() => handleModuleClick(AppModule.PROFILE)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-100 ring-2 ring-white shadow-sm hover:opacity-90 transition-opacity">
                   <img src={user.avatar} className="w-full h-full object-cover" alt="User Profile" />
                 </button>
                 <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </div>
            ) : (
              <Button onClick={onLogin} size="sm" className="rounded-lg font-black px-6 shadow-md bg-brand-600 hover:bg-brand-700">
                {isBangla ? 'লগইন' : 'Login'}
              </Button>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-fade-in flex flex-col h-screen overflow-hidden">
          {/* Mobile Header Inside Drawer */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="flex items-center gap-3" onClick={() => { setMobileMenuOpen(false); onNavigateHome(); }}>
               <div className="h-14 w-auto flex items-center justify-center">
                  <img 
                    src={settings?.websiteLogo || "https://zpsxpqurazjeqviwooky.supabase.co/storage/v1/object/public/images/logo.png"} 
                    className="h-full w-auto object-contain" 
                    alt="Logo" 
                    onError={(e) => e.currentTarget.src = "https://placehold.co/150x150?text=D"} 
                  />
               </div>
               {settings?.showWebsiteTitle && (
                 <span className="font-black text-gray-800 text-lg uppercase tracking-tighter">
                   {siteTitleString}
                 </span>
               )}
            </div>
            <div className="flex items-center gap-2">
               {user && (
                 <button onClick={() => handleModuleClick(AppModule.PROFILE)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-brand-100 shadow-sm">
                   <img src={user.avatar} className="w-full h-full object-cover" />
                 </button>
               )}
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"><X size={28} /></button>
            </div>
          </div>

          {/* Navigation List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-1">
              {/* User Profile info if logged in */}
              {user && (
                <div className="p-4 mb-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 leading-none mb-1">{user.name}</p>
                    <p className="text-xs text-brand-600 font-bold uppercase">{user.role}</p>
                  </div>
                </div>
              )}

              <button onClick={() => handleModuleClick(AppModule.AMAR_BD)} className="w-full text-left font-black text-[#0b6352] text-lg py-4 px-2 border-b border-gray-50 flex items-center gap-3"> <LayoutGrid size={22}/> {isBangla ? 'আমার বাংলাদেশ' : 'Amar BD'}</button>
              <button onClick={() => handleModuleClick(AppModule.AMAR_JELA)} className="w-full text-left font-black text-[#0b6352] text-lg py-4 px-2 border-b border-gray-50 flex items-center gap-3"> <MapPin size={22}/> {isBangla ? 'আমার জেলা' : 'Amar Jela'}</button>
              
              {/* Expandable Services */}
              <div className="border-b border-gray-50">
                <button 
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)} 
                  className={`w-full text-left font-black text-[#0b6352] text-lg py-4 px-2 flex items-center justify-between transition-colors ${mobileServicesOpen ? 'bg-emerald-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid size={22} /> {isBangla ? 'সেবাসমূহ' : 'Services'}
                  </div>
                  <ChevronDown size={20} className={`transform transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileServicesOpen && (
                  <div className="bg-emerald-50/50 p-2 grid grid-cols-2 gap-2 animate-fade-in-up">
                    {allServices.map(s => (
                      <button key={s.id} onClick={() => handleModuleClick(s.id)} className="text-left p-3 rounded-xl bg-white border border-emerald-100 text-sm font-bold text-gray-700 hover:bg-emerald-100">
                        {s.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => handleModuleClick(AppModule.BAZAR_SODAI)} className="w-full text-left font-black text-[#0b6352] text-lg py-4 px-2 border-b border-gray-50 flex items-center gap-3"> <LayoutGrid size={22}/> {isBangla ? 'বাজার সদাই' : 'Bazar Sodai'}</button>
              <button onClick={() => handleModuleClick(AppModule.JOB)} className="w-full text-left font-black text-gray-700 text-lg py-4 px-2 border-b border-gray-50 flex items-center gap-3"> <Briefcase size={22}/> {isBangla ? 'চাকরি' : 'Jobs'}</button>
              <button onClick={() => handleModuleClick(AppModule.BLOG)} className="w-full text-left font-black text-gray-700 text-lg py-4 px-2 border-b border-gray-50 flex items-center gap-3"> <FileText size={22}/> {isBangla ? 'ব্লগ' : 'Blog'}</button>
              <button onClick={() => handleModuleClick(AppModule.JANTE_CHAI)} className="w-full text-left font-black text-[#4f46e5] text-lg py-4 px-2 flex items-center gap-3 border-b border-gray-50">
                <HelpCircle size={22} /> {isBangla ? 'জানতে চাই' : 'Jante Chai'}
              </button>

              {/* Language Toggle in Mobile */}
              <button onClick={toggleLanguage} className="w-full text-left font-black text-orange-600 text-lg py-4 px-2 flex items-center gap-3">
                <Globe size={22} /> {isBangla ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              </button>
            </div>
          </div>

          {/* Action Footer (Large Buttons) */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3 shrink-0">
             {!user && (
               <Button onClick={onLogin} className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 mb-2">
                 লগইন করুন
               </Button>
             )}
             <button 
               onClick={() => handleModuleClick('mithu-ai')} 
               className="w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all"
             >
                <Bird size={24} /> {isBangla ? 'মিঠু এআই এর সাথে চ্যাট' : 'Chat with Mithu AI'}
             </button>
             <button 
               onClick={() => { setMobileMenuOpen(false); onNavigateHome(); }} 
               className="w-full bg-white border border-gray-200 text-gray-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
             >
                {isBangla ? 'সেবা সম্পর্কে জানুন' : 'Learn about Services'}
             </button>
          </div>
        </div>
      )}
    </nav>
  );
};
