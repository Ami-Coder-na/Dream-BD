import React from 'react';
import { Layout, ArrowRight, ShoppingBag, Sprout, BookOpen, HeartPulse, Bus, Trash2, Fish, Globe, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  onLogin: () => void;
  isBangla: boolean;
  toggleLanguage: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLogin, isBangla, toggleLanguage }) => {
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8 text-orange-500" />,
      title: isBangla ? 'ঐতিহ্যবাহী কারুশিল্প' : 'Heritage Crafts',
      desc: isBangla ? 'সরাসরি কারিগরদের থেকে কিনুন' : 'Buy directly from artisans'
    },
    {
      icon: <Sprout className="w-8 h-8 text-green-600" />,
      title: isBangla ? 'স্মার্ট কৃষি' : 'Smart Agriculture',
      desc: isBangla ? 'আবহাওয়া ও ফসলের পরামর্শ' : 'Weather & crop advisory'
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-teal-500" />,
      title: isBangla ? 'ডিজিটাল স্বাস্থ্যসেবা' : 'Digital Health',
      desc: isBangla ? 'টেলিমেডিসিন ও অ্যাপয়েন্টমেন্ট' : 'Telemedicine & appointments'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
      title: isBangla ? 'শিক্ষা' : 'Education',
      desc: isBangla ? 'সবার জন্য উন্মুক্ত শিক্ষা' : 'Learning for everyone'
    },
    {
      icon: <Bus className="w-8 h-8 text-indigo-600" />,
      title: isBangla ? 'পরিবহন' : 'Transport',
      desc: isBangla ? 'রুট ট্র্যাকিং ও টিকিট' : 'Route tracking & tickets'
    },
    {
      icon: <Trash2 className="w-8 h-8 text-gray-600" />,
      title: isBangla ? 'বর্জ্য ব্যবস্থাপনা' : 'Waste Mgmt',
      desc: isBangla ? 'নাগরিক রিপোর্ট ও রিসাইক্লিং' : 'Reporting & recycling'
    }
  ];

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                D
              </div>
              <span className="text-2xl font-bold text-gray-800 tracking-tight">Dream BD</span>
            </div>

            {/* Middle Nav Items */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
               <button onClick={scrollToServices} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                 {isBangla ? 'কারুশিল্প' : 'Crafts'}
               </button>
               <button onClick={scrollToServices} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                 {isBangla ? 'কৃষি' : 'Agriculture'}
               </button>
               <button onClick={scrollToServices} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                 {isBangla ? 'স্বাস্থ্য' : 'Health'}
               </button>
               <button onClick={scrollToServices} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                 {isBangla ? 'শিক্ষা' : 'Education'}
               </button>
               <button onClick={scrollToServices} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                 {isBangla ? 'পরিবহন' : 'Transport'}
               </button>
               <button onClick={scrollToServices} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                 {isBangla ? 'বর্জ্য ব্যবস্থাপনা' : 'Waste Mgmt'}
               </button>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600 px-3 py-1.5 rounded-full border border-gray-200 hover:border-brand-200 transition-all"
              >
                <Globe size={16} />
                <span>{isBangla ? 'English' : 'বাংলা'}</span>
              </button>
              <Button onClick={onLogin} variant="primary" className="shadow-lg shadow-brand-500/20">
                {isBangla ? 'লগইন করুন' : 'Login'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-brand-50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary-500 rounded-full blur-3xl opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6">
              {isBangla ? '🇧🇩 ডিজিটাল বাংলাদেশের জন্য একটি প্ল্যাটফর্ম' : '🇧🇩 One Platform for Digital Bangladesh'}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              {isBangla ? (
                <>
                  স্বপ্ন দেখুন, <span className="text-brand-600">গড়ুন আগামীর বাংলাদেশ</span>
                </>
              ) : (
                <>
                  Empowering Citizens, <span className="text-brand-600">Building Dream BD</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {isBangla 
                ? 'কারুশিল্প থেকে কৃষি, স্বাস্থ্য থেকে শিক্ষা—সব সেবা এখন এক ছাতার নিচে। আজই যুক্ত হোন দেশের সবচেয়ে বড় ডিজিটাল প্ল্যাটফর্মে।'
                : 'From heritage crafts to smart agriculture, health to education—access all essential services in one unified digital platform.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onLogin} size="lg" className="text-lg px-8 py-4 shadow-xl shadow-brand-600/20 hover:shadow-brand-600/30 transform hover:-translate-y-1 transition-all">
                {isBangla ? 'শুরু করুন' : 'Get Started'} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button onClick={onLogin} variant="outline" size="lg" className="text-lg px-8 py-4 bg-white border-gray-300 hover:bg-gray-50">
                {isBangla ? 'আরও জানুন' : 'Learn More'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isBangla ? 'আমাদের সেবাসমূহ' : 'Our Services'}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {isBangla 
                ? 'নাগরিক জীবনের প্রতিটি প্রয়োজন মেটাতে আমরা আছি আপনার পাশে'
                : 'Comprehensive digital solutions for every aspect of daily life'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 border border-transparent hover:border-gray-100 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust/Footer Section */}
      <div className="bg-gray-900 text-white py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">D</div>
                <span className="text-2xl font-bold">Dream BD</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                {isBangla 
                  ? 'একটি সমৃদ্ধ ও স্মার্ট বাংলাদেশ গড়ার লক্ষ্যে আমাদের এই পথচলা।'
                  : 'A unified platform committed to building a prosperous and Smart Bangladesh.'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">{isBangla ? 'যোগাযোগ' : 'Contact'}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@dreambd.gov.bd</li>
                <li>+880 1234 567890</li>
                <li>Dhaka, Bangladesh</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">{isBangla ? 'লিঙ্ক' : 'Links'}</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">{isBangla ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</li>
                <li className="hover:text-white cursor-pointer">{isBangla ? 'শর্তাবলী' : 'Terms of Service'}</li>
                <li className="hover:text-white cursor-pointer">{isBangla ? 'সহায়তা' : 'Help Center'}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © 2024 Dream BD Platform. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};