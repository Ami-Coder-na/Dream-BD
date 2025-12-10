import React from 'react';
import { 
  ShoppingBag, Sprout, BookOpen, HeartPulse, 
  Bus, Trash2, Fish, Globe, AlertOctagon, 
  Users, CheckCircle, Star, Phone, Mail, MapPin, Menu, X, ChevronDown, Sparkles, Bell, LogOut, User as UserIcon
} from 'lucide-react';
import { Button } from './ui/Button';
import { User, AppModule } from '../types';

interface Props {
  user?: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout?: () => void;
  onOpenAiChat: () => void;
  onModuleSelect?: (module: AppModule) => void;
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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

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
    setMobileMenuOpen(false);
  };

  const handleModuleClick = (moduleId: AppModule) => {
    if (user && onModuleSelect) {
      onModuleSelect(moduleId);
    } else {
      if (!user) {
        onLogin();
      } else {
        onModuleSelect?.(moduleId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                   onClick={() => scrollToSection('modules')}
                 >
                   {isBangla ? 'সেবাসমূহ' : 'Services'}
                   <ChevronDown size={16} />
                 </button>
                 
                 {/* Dropdown Content */}
                 <div className="absolute top-full -left-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                   <div className="px-4 py-2 border-b border-gray-50 bg-gray-50">
                     <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                       {isBangla ? 'মডিউলসমূহ' : 'Modules'}
                     </span>
                   </div>
                   {modules.map((mod, idx) => (
                     <button
                       key={idx}
                       className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors flex items-center gap-3"
                       onClick={() => handleModuleClick(mod.id)}
                     >
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                       <span className="font-medium">{mod.title}</span>
                     </button>
                   ))}
                 </div>
               </div>
               
               {/* Jobs Link */}
               <button 
                onClick={() => user && onModuleSelect ? onModuleSelect(AppModule.JOB) : onLogin()} 
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
               >
                 {isBangla ? 'চাকরি' : 'Jobs'}
               </button>

               {/* Blog Link */}
               <button 
                onClick={() => user && onModuleSelect ? onModuleSelect(AppModule.BLOG) : onLogin()} 
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
               >
                 {isBangla ? 'ব্লগ' : 'Blog'}
               </button>

               <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                 {isBangla ? 'আমাদের সম্পর্কে' : 'About'}
               </button>
               
               {/* Contact Link */}
               <button 
                onClick={() => user && onModuleSelect ? onModuleSelect(AppModule.CONTACT) : onLogin()}
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
               >
                 {isBangla ? 'যোগাযোগ' : 'Contact'}
               </button>
            </div>
            
            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Notification Bell */}
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
                      <div className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 shrink-0"></div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium">{isBangla ? 'সিস্টেম আপডেট' : 'System Update'}</p>
                          <p className="text-xs text-gray-500">{isBangla ? 'আমরা গোপনীয়তা নীতি আপডেট করেছি।' : 'We have updated the privacy policy.'}</p>
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
                           if(onModuleSelect) onModuleSelect(AppModule.PROFILE);
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
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-xl">
             {user && (
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                 <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full" />
                 <div>
                   <p className="text-sm font-bold text-gray-900">{user.name}</p>
                   <p className="text-xs text-gray-500">{user.role}</p>
                 </div>
               </div>
             )}

             <button onClick={() => scrollToSection('modules')} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50 flex justify-between items-center">
               {isBangla ? 'সেবাসমূহ' : 'Services'}
               <ChevronDown size={16} />
             </button>
             {/* Simple list for mobile for better UX than huge dropdown */}
             <div className="pl-4 grid grid-cols-2 gap-2 mb-2">
               {modules.map((mod, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleModuleClick(mod.id)} 
                    className="text-xs text-gray-500 text-left py-1 hover:text-brand-600"
                  >
                    {mod.title}
                  </button>
               ))}
             </div>
             
             <button 
               onClick={() => user && onModuleSelect ? onModuleSelect(AppModule.JOB) : onLogin()}
               className="text-left font-medium text-gray-700 py-2 border-b border-gray-50"
             >
               {isBangla ? 'চাকরি' : 'Jobs'}
             </button>

             <button 
               onClick={() => user && onModuleSelect ? onModuleSelect(AppModule.BLOG) : onLogin()}
               className="text-left font-medium text-gray-700 py-2 border-b border-gray-50"
             >
               {isBangla ? 'ব্লগ' : 'Blog'}
             </button>

             <button onClick={() => scrollToSection('about')} className="text-left font-medium text-gray-700 py-2 border-b border-gray-50">
               {isBangla ? 'আমাদের সম্পর্কে' : 'About'}
             </button>
             
             <button 
               onClick={() => user && onModuleSelect ? onModuleSelect(AppModule.CONTACT) : onLogin()}
               className="text-left font-medium text-gray-700 py-2 border-b border-gray-50"
             >
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

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-2 px-4 rounded-full bg-white border border-brand-100 text-brand-700 text-sm font-semibold mb-8 shadow-sm animate-fade-in-up">
            🚀 {isBangla ? 'ডিজিটাল বাংলাদেশের এক নতুন দিগন্ত' : 'A New Horizon for Digital Bangladesh'}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            {isBangla ? (
              <>
                এক প্ল্যাটফর্মে <span className="text-brand-600">কৃষি, শিক্ষা, স্বাস্থ্য ও পরিবহন</span>
              </>
            ) : (
              <>
                Agriculture, Education, Health <br/> <span className="text-brand-600">& Transport in One Platform</span>
              </>
            )}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold">D</div>
                <span className="text-2xl font-bold text-white">Dream BD</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                {isBangla 
                  ? 'স্মার্ট বাংলাদেশের জন্য একটি সমন্বিত ডিজিটাল প্ল্যাটফর্ম।'
                  : 'An integrated digital platform for a Smart Bangladesh.'}
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer transition-colors">f</div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer transition-colors">t</div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-600 cursor-pointer transition-colors">in</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">{isBangla ? 'কুইক লিঙ্ক' : 'Quick Links'}</h4>
              <ul className="space-y-3 text-sm">
                <li onClick={() => scrollToSection('about')} className="hover:text-brand-500 cursor-pointer">{isBangla ? 'আমাদের সম্পর্কে' : 'About Us'}</li>
                <li onClick={() => scrollToSection('modules')} className="hover:text-brand-500 cursor-pointer">{isBangla ? 'সেবাসমূহ' : 'Services'}</li>
                <li className="hover:text-brand-500 cursor-pointer">{isBangla ? 'ব্লগ' : 'Blog'}</li>
                <li className="hover:text-brand-500 cursor-pointer">{isBangla ? 'যোগাযোগ' : 'Contact'}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">{isBangla ? 'লিগ্যাল' : 'Legal'}</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-brand-500 cursor-pointer">{isBangla ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</li>
                <li className="hover:text-brand-500 cursor-pointer">{isBangla ? 'শর্তাবলী' : 'Terms of Use'}</li>
                <li className="hover:text-brand-500 cursor-pointer">FAQ</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">{isBangla ? 'যোগাযোগ করুন' : 'Contact Us'}</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-brand-500" />
                  <span>ICT Tower, Agargaon,<br/>Dhaka-1207, Bangladesh</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-brand-500" />
                  <span>+880 1234 567890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-brand-500" />
                  <span>info@dreambd.gov.bd</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2024 Dream BD. All rights reserved.</p>
            <div className="flex items-center gap-2">
               <Globe size={14} />
               <button onClick={toggleLanguage} className="hover:text-white">
                 {isBangla ? 'English' : 'বাংলা'}
               </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};