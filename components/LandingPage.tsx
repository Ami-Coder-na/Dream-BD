
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Sprout, BookOpen, HeartPulse, 
  Bus, Trash2, Fish, AlertOctagon, CheckCircle, Star, Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';
import { User, AppModule } from '../types';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';

interface Props {
  user?: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onOpenAiChat: () => void;
  onModuleSelect: (module: AppModule) => void;
  isBangla: boolean;
  toggleLanguage: () => void;
}

export const LandingPage: React.FC<Props> = ({ 
  user, 
  onLogin, 
  onRegister, 
  onLogout,
  onOpenAiChat, 
  onModuleSelect,
  isBangla, 
  toggleLanguage 
}) => {
  
  // Rotating Headline State
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  const headlines = [
    {
      bn: <>এক প্ল্যাটফর্মে <span className="text-brand-600">কৃষি, শিক্ষা, স্বাস্থ্য ও পরিবহন</span></>,
      en: <>Agriculture, Education, Health <br className="hidden md:block"/> <span className="text-brand-600">& Transport in One Platform</span></>
    },
    {
      bn: <>গ্রামীণ জীবনের সব সমস্যার <span className="text-brand-600">ডিজিটাল সমাধান</span></>,
      en: <>Digital Solutions for <br className="hidden md:block"/> <span className="text-brand-600">All Rural Challenges</span></>
    },
    {
      bn: <>কৃষকের মুখে হাসি, <span className="text-brand-600">শিক্ষার আলো</span> সবার ঘরে</>,
      en: <>Empowering Farmers, <br className="hidden md:block"/> <span className="text-brand-600">Enlightening Students Everywhere</span></>
    },
    {
      bn: <>জরুরি স্বাস্থ্যসেবা ও পরিবহন <span className="text-brand-600">এখন হাতের মুঠোয়</span></>,
      en: <>Emergency Healthcare & Transport <br className="hidden md:block"/> <span className="text-brand-600">at Your Fingertips</span></>
    },
    {
      bn: <>স্বপ্নের বাংলাদেশ গড়ার <span className="text-brand-600">ডিজিটাল কারিগর</span></>,
      en: <>Building a Smart & <br className="hidden md:block"/> <span className="text-brand-600">Digital Dream Bangladesh</span></>
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 6000); // Increased to 6 seconds for slower rotation
    return () => clearInterval(interval);
  }, []);

  const modules = [
    {
      id: AppModule.CRAFT,
      icon: <ShoppingBag className="w-8 h-8 text-orange-500" />,
      title: isBangla ? 'কারুশিল্প' : 'Crafts',
      desc: isBangla ? 'দেশীয় পণ্যের বিশ্ববাজার' : 'Global market for local goods'
    },
    {
      id: AppModule.AGRI,
      icon: <Sprout className="w-8 h-8 text-green-600" />,
      title: isBangla ? 'কৃষি' : 'Agriculture',
      desc: isBangla ? 'আধুনিক চাষাবাদ ও পরামর্শ' : 'Smart farming advisory'
    },
    {
      id: AppModule.HEALTH,
      icon: <HeartPulse className="w-8 h-8 text-teal-500" />,
      title: isBangla ? 'স্বাস্থ্য' : 'Health',
      desc: isBangla ? 'ঘরে বসেই ডাক্তার দেখান' : 'Telemedicine services'
    },
    {
      id: AppModule.EDU,
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
      title: isBangla ? 'শিক্ষা' : 'Education',
      desc: isBangla ? 'সবার জন্য মানসম্মত শিক্ষা' : 'Quality education for all'
    },
    {
      id: AppModule.TRANSPORT,
      icon: <Bus className="w-8 h-8 text-indigo-600" />,
      title: isBangla ? 'পরিবহন' : 'Transport',
      desc: isBangla ? 'সহজ টিকেট ও ট্র্যাকিং' : 'Easy ticketing & tracking'
    },
    {
      id: AppModule.WASTE,
      icon: <Trash2 className="w-8 h-8 text-gray-600" />,
      title: isBangla ? 'বর্জ্য' : 'Waste Mgmt',
      desc: isBangla ? 'পরিচ্ছন্ন পরিবেশ গড়ি' : 'Clean environment initiative'
    },
    {
      id: AppModule.FISHERY,
      icon: <Fish className="w-8 h-8 text-cyan-600" />,
      title: isBangla ? 'মৎস্য' : 'Fishery',
      desc: isBangla ? 'বৈজ্ঞানিক মাছ চাষ' : 'Scientific fish farming'
    },
    {
      id: AppModule.DISASTER,
      icon: <AlertOctagon className="w-8 h-8 text-red-600" />,
      title: isBangla ? 'দুর্যোগ' : 'Disaster',
      desc: isBangla ? 'আগাম সতর্কবার্তা' : 'Early warning system'
    }
  ];

  const features = [
    isBangla ? 'আবহাওয়া তথ্য' : 'Weather Info',
    isBangla ? 'ডাক্তার বুকিং' : 'Doctor Booking',
    isBangla ? 'পরিবহন ট্র্যাকিং' : 'Transport Tracking',
    isBangla ? 'বর্জ্য রিসাইক্লিং' : 'Recycling Marketplace',
    isBangla ? 'কৃষি পরামর্শ' : 'Agri Advisory',
    isBangla ? 'অনলাইন ক্লাস' : 'Online Classes',
  ];

  const testimonials = [
    {
      name: isBangla ? 'রহিম উদ্দিন' : 'Rahim Uddin',
      role: isBangla ? 'কৃষক, রংপুর' : 'Farmer, Rangpur',
      text: isBangla 
        ? 'ড্রিম বিডি অ্যাপ ব্যবহার করে আমি আবহাওয়ার সঠিক খবর পাই, যা আমার ফসল বাঁচাতে সাহায্য করে।' 
        : 'Using Dream BD, I get accurate weather updates which helps save my crops.'
    },
    {
      name: isBangla ? 'সুমাইয়া আক্তার' : 'Sumaiya Akter',
      role: isBangla ? 'উদ্যোক্তা, ঢাকা' : 'Entrepreneur, Dhaka',
      text: isBangla 
        ? 'আমার হাতের তৈরি পণ্য এখন সারা দেশে বিক্রি করতে পারছি। এটি সত্যি অসাধারণ!' 
        : 'I can now sell my handmade products all over the country. Truly amazing!'
    }
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleModuleClick = (moduleId: AppModule) => {
    onModuleSelect(moduleId);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Header 
        user={user} 
        onLogin={onLogin} 
        onRegister={onRegister} 
        onLogout={onLogout} 
        onModuleSelect={onModuleSelect}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        isBangla={isBangla} 
        toggleLanguage={toggleLanguage} 
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-2 px-4 rounded-full bg-white border border-brand-100 text-brand-700 text-sm font-semibold mb-8 shadow-sm animate-fade-in-up">
            🚀 {isBangla ? 'ডিজিটাল বাংলাদেশের এক নতুন দিগন্ত' : 'A New Horizon for Digital Bangladesh'}
          </span>
          
          {/* Animated Headline */}
          <h1 
            key={currentHeadlineIndex}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight animate-fade-in min-h-[120px] md:min-h-[160px]"
          >
            {isBangla ? headlines[currentHeadlineIndex].bn : headlines[currentHeadlineIndex].en}
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            {isBangla 
              ? 'স্বপ্ন দেখুন, গড়ুন আগামীর বাংলাদেশ। কারুশিল্প থেকে কৃষি, স্বাস্থ্য থেকে শিক্ষা—সব সেবা এখন আপনার হাতের মুঠোয়।'
              : 'Dream it, build it. From heritage crafts to smart agriculture, health to education—access all essential services at your fingertips.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Main CTA: Talk With AI - Enhanced with Animation */}
            <Button 
              onClick={onOpenAiChat} 
              size="lg" 
              className="text-lg px-10 py-4 shadow-xl shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
            >
               {/* Shine Effect */}
               <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
               
               <Sparkles size={20} className="animate-pulse" />
              {isBangla ? 'AI-এর সাথে কথা বলুন' : 'Talk With AI'} 
            </Button>
            
            <Button onClick={() => scrollToSection('modules')} variant="outline" size="lg" className="text-lg px-10 py-4 bg-white border-gray-300 hover:bg-gray-50">
              {isBangla ? 'সেবাসমূহ দেখুন' : 'Explore Modules'}
            </Button>
          </div>
        </div>
      </div>

      {/* About Platform */}
      <div id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            <h2 className="text-3xl font-bold mb-6 relative z-10">
              {isBangla ? 'আমাদের লক্ষ্য' : 'Our Mission'}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed relative z-10">
              {isBangla 
                ? 'বাংলাদেশের বাস্তব সমস্যার ডিজিটাল সমাধান প্রদান করা। আমরা এমন একটি ইকোসিস্টেম তৈরি করছি যেখানে প্রযুক্তি ও ঐতিহ্য মিলেমিশে কাজ করে।'
                : 'To provide digital solutions for real-world problems in Bangladesh. We are building an ecosystem where technology and heritage work hand in hand.'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Modules Overview */}
      <div id="modules" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isBangla ? 'মূল সেবাসমূহ' : 'Key Modules'}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {isBangla ? 'আপনার প্রয়োজনের সব সমাধান এক জায়গায়' : 'All solutions for your needs in one place'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group text-center cursor-pointer" 
                onClick={() => handleModuleClick(mod.id)}
              >
                <div className="w-14 h-14 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-50 transition-colors">
                  {mod.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{mod.title}</h3>
                <p className="text-sm text-gray-500">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full text-gray-700 font-medium">
                <CheckCircle size={18} className="text-brand-600" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            {isBangla ? 'ব্যবহারকারীদের কথা' : 'Success Stories'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 italic mb-6 text-lg">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!user && (
        <div className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-brand-50 rounded-3xl p-8 md:p-16 text-center border border-brand-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {isBangla ? 'আজই যুক্ত হোন ড্রিম বিডি-তে' : 'Join Dream BD Today'}
              </h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                {isBangla 
                  ? 'কৃষক, শিক্ষক, ডাক্তার বা সাধারণ নাগরিক—সবার জন্য একটি প্ল্যাটফর্ম।'
                  : 'Whether you are a farmer, teacher, doctor or citizen—one platform for all.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={onRegister} size="lg" className="px-12 py-4 text-lg">
                  {isBangla ? 'রেজিস্ট্রেশন করুন' : 'Register Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer 
        isBangla={isBangla} 
        toggleLanguage={toggleLanguage} 
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
};
