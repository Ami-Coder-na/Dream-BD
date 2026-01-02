
import React from 'react';
import { Globe, MapPin, Phone, Mail } from 'lucide-react';
import { AppModule } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

interface FooterProps {
  isBangla: boolean;
  toggleLanguage: () => void;
  onNavigateHome: () => void;
  onModuleSelect: (module: AppModule) => void;
}

export const Footer: React.FC<FooterProps> = ({ isBangla, toggleLanguage, onNavigateHome, onModuleSelect }) => {
  const { settings } = useSiteConfig();

  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={onNavigateHome}>
              {settings.websiteLogo ? (
                <img src={settings.websiteLogo} alt="Logo" className="h-12 w-auto object-contain" />
              ) : (
                <div className="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {settings.websiteTitle.charAt(0) || 'D'}
                </div>
              )}
              <span className="text-2xl font-bold text-white">{settings.websiteTitle}</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              {isBangla 
                ? 'স্মার্ট বাংলাদেশের জন্য একটি সমন্বিত ডিজিটাল প্ল্যাটফর্ম।'
                : 'An integrated digital platform for a Smart Bangladesh.'}
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61586117421232" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer transition-colors text-inherit decoration-none"
              >
                f
              </a>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer transition-colors">t</div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer transition-colors">in</div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{isBangla ? 'কুইক লিঙ্ক' : 'Quick Links'}</h4>
            <ul className="space-y-3 text-sm">
              <li onClick={onNavigateHome} className="hover:text-brand-500 cursor-pointer">{isBangla ? 'হোম' : 'Home'}</li>
              <li onClick={() => onModuleSelect(AppModule.ABOUT)} className="hover:text-brand-500 cursor-pointer">{isBangla ? 'আমাদের সম্পর্কে' : 'About Us'}</li>
              <li onClick={() => onModuleSelect(AppModule.AMAR_BD)} className="hover:text-brand-500 cursor-pointer">{isBangla ? 'সেবাসমূহ' : 'Services'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{isBangla ? 'লিগ্যাল' : 'Legal'}</h4>
            <ul className="space-y-3 text-sm">
              <li onClick={() => onModuleSelect(AppModule.PRIVACY)} className="hover:text-brand-500 cursor-pointer">{isBangla ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</li>
              <li onClick={() => onModuleSelect(AppModule.TERMS)} className="hover:text-brand-500 cursor-pointer">{isBangla ? 'শর্তাবলী' : 'Terms of Use'}</li>
              <li onClick={() => onModuleSelect(AppModule.CONTACT)} className="hover:text-brand-500 cursor-pointer">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">{isBangla ? 'যোগাযোগ করুন' : 'Contact Us'}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-brand-500" />
                <span className="whitespace-pre-wrap">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-500" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-500" />
                <span>{settings.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} {settings.websiteTitle}. All rights reserved.</p>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <Globe size={14} />
                  <button onClick={toggleLanguage} className="hover:text-white">
                    {isBangla ? 'English' : 'বাংলা'}
                  </button>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
