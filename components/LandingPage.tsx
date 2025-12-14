
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Sprout, BookOpen, HeartPulse, 
  Bus, Trash2, Fish, AlertOctagon, CheckCircle, Star, Sparkles,
  ArrowRight, MapPin, Calendar, ShieldAlert, TrendingUp, CloudRain, Phone, Activity,
  UserPlus, LayoutGrid, Smile, Building2, Landmark, Truck, Globe,
  CloudSun, Stethoscope, Recycle, Navigation, Clock, Fuel, ChevronDown, Camera
} from 'lucide-react';
import { Button } from './ui/Button';
import { User, AppModule, Notification } from '../types';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { MOCK_PRODUCTS } from '../constants';
import { useSiteConfig } from '../contexts/SiteConfigContext';

interface Props {
  user?: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onOpenAiChat: () => void;
  onModuleSelect: (module: AppModule) => void;
  isBangla: boolean;
  toggleLanguage: () => void;
  notifications?: Notification[];
  onMarkAllRead?: () => void;
  onClearNotifications?: () => void;
}

export const LandingPage: React.FC<Props> = ({ 
  user, 
  onLogin, 
  onRegister, 
  onLogout,
  onOpenAiChat, 
  onModuleSelect,
  isBangla, 
  toggleLanguage,
  notifications,
  onMarkAllRead,
  onClearNotifications
}) => {
  
  const { sections, modules } = useSiteConfig();

  // Rotating Headline State
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  // Distance Calculator State
  const [fromDistrict, setFromDistrict] = useState('');
  const [toDistrict, setToDistrict] = useState('');
  const [distanceResult, setDistanceResult] = useState<{km: number, time: string, fare: number} | null>(null);
  const [calculating, setCalculating] = useState(false);

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
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCalculateDistance = () => {
    if (!fromDistrict || !toDistrict) return;
    setCalculating(true);
    setDistanceResult(null);

    // Mock Calculation Logic based on string length mainly for demo variety
    setTimeout(() => {
      const baseDist = Math.abs(fromDistrict.length - toDistrict.length) * 50 + 120;
      const hours = Math.floor(baseDist / 40); // Avg speed 40km/h
      const mins = Math.round((baseDist % 40) * 1.5);
      
      setDistanceResult({
        km: baseDist,
        time: `${hours}h ${mins}m`,
        fare: baseDist * 2.5 // Approx bus fare rate
      });
      setCalculating(false);
    }, 800);
  };

  const districts = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Cox\'s Bazar'];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Hero Section */}
      {sections.hero && (
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block py-2 px-4 rounded-full bg-white border border-brand-100 text-brand-700 text-sm font-semibold mb-8 shadow-sm animate-fade-in-up">
              🚀 {isBangla ? 'ডিজিটাল বাংলাদেশের এক নতুন দিগন্ত' : 'A New Horizon for Digital Bangladesh'}
            </span>
            
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
              <Button 
                onClick={onOpenAiChat} 
                size="lg" 
                className="text-lg px-10 py-4 shadow-xl shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
              >
                 <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                 <Sparkles size={20} className="animate-pulse" />
                {isBangla ? 'AI-এর সাথে কথা বলুন' : 'Talk With AI'} 
              </Button>
              
              <Button onClick={() => scrollToSection('about')} variant="outline" size="lg" className="text-lg px-10 py-4 bg-white border-gray-300 hover:bg-gray-50">
                {isBangla ? 'আরও জানুন' : 'Learn More'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* About Platform */}
      {sections.about && (
        <div id="about" className="py-20 bg-white border-b border-gray-100">
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
      )}

      {/* --- HOW IT WORKS (NEW SECTION) --- */}
      {sections.features && (
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
               <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-2 block">
                 {isBangla ? 'ব্যবহার নির্দেশিকা' : 'How It Works'}
               </span>
               <h2 className="text-3xl font-bold text-gray-900">
                 {isBangla ? 'খুব সহজেই সেবা নিন' : 'Get Started in 3 Steps'}
               </h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Step 1 */}
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <UserPlus size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isBangla ? '১. একাউন্ট তৈরি করুন' : '1. Create Account'}
                  </h3>
                  <p className="text-gray-600">
                    {isBangla 
                      ? 'আপনার মোবাইল নম্বর বা ইমেল ব্যবহার করে খুব সহজেই রেজিস্ট্রেশন করুন।' 
                      : 'Register easily using your mobile number or email address.'}
                  </p>
               </div>

               {/* Step 2 */}
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
                    <LayoutGrid size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isBangla ? '২. সেবা নির্বাচন করুন' : '2. Choose Service'}
                  </h3>
                  <p className="text-gray-600">
                    {isBangla 
                      ? 'কৃষি, স্বাস্থ্য, শিক্ষা বা পরিবহন—আপনার প্রয়োজনীয় সেবাটি বেছে নিন।' 
                      : 'Select the service you need—Agriculture, Health, Education or Transport.'}
                  </p>
               </div>

               {/* Step 3 */}
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                    <Smile size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isBangla ? '৩. সমাধান পান' : '3. Get Solution'}
                  </h3>
                  <p className="text-gray-600">
                    {isBangla 
                      ? 'দ্রুত এবং নির্ভরযোগ্য সেবা উপভোগ করুন এবং জীবনযাত্রার মান উন্নয়ন করুন।' 
                      : 'Enjoy fast, reliable services and improve your quality of life.'}
                  </p>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* --- CRAFT SECTION --- */}
      {sections.craft && modules[AppModule.CRAFT] && (
        <div id="crafts" className="py-24 bg-orange-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <span className="text-orange-600 font-bold tracking-wider uppercase text-sm mb-2 block">{isBangla ? 'কারুশিল্প' : 'Heritage Crafts'}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {isBangla ? 'বাংলার ঐতিহ্য, বিশ্বমানে' : 'Empowering Artisans, Preserving Heritage'}
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {isBangla 
                    ? 'সরাসরি কারিগরদের কাছ থেকে কিনুন। নকশী কাঁথা, জামদানি, এবং মাটির তৈরি পণ্য—সবই এক ক্লিকে।' 
                    : 'Buy authentic handmade products directly from rural artisans. From Nakshi Kantha to Jamdani, support local craftsmanship.'}
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => onModuleSelect(AppModule.CRAFT)} className="!bg-orange-600 hover:!bg-orange-700 !text-white border-none shadow-lg shadow-orange-600/20 px-8">
                    {isBangla ? 'কারুশিল্প দেখুন' : 'Explore Crafts'}
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                {MOCK_PRODUCTS.slice(0, 4).map((prod, idx) => (
                  <div key={idx} className={`bg-white p-4 rounded-xl shadow-sm border border-orange-100 ${idx % 2 === 1 ? 'translate-y-8' : ''}`}>
                    <img src={prod.image} alt={prod.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <h4 className="font-bold text-gray-800 text-sm">{isBangla ? prod.nameBn : prod.name}</h4>
                    <p className="text-orange-600 font-bold text-sm">৳ {prod.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- AGRICULTURE SECTION --- */}
      {sections.agri && modules[AppModule.AGRI] && (
        <div id="agri" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-1/2">
                 <span className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2 block">{isBangla ? 'কৃষি ও খামার' : 'Smart Agriculture'}</span>
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                   {isBangla ? 'প্রযুক্তির ছোঁয়ায় ফসলের সুরক্ষা' : 'Data-Driven Farming for Better Yields'}
                 </h2>
                 <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                   {isBangla 
                     ? 'আবহাওয়ার সঠিক পূর্বাভাস এবং বিশেষজ্ঞ পরামর্শ নিয়ে আপনার ফসল রক্ষা করুন। জানুন আজকের বাজার দর।' 
                     : 'Get accurate weather forecasts, pest control advice, and live market prices to maximize your harvest.'}
                 </p>
                 <ul className="space-y-3 mb-8">
                   {[
                     isBangla ? '✅ ৬৪ জেলার আবহাওয়া আপডেট' : '✅ 64 District Weather Updates',
                     isBangla ? '✅ বিশেষজ্ঞ কৃষি পরামর্শ' : '✅ Expert Agri-Advisory',
                     isBangla ? '✅ ফসলের রোগ নির্ণয় (AI)' : '✅ AI Disease Detection'
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-2 text-gray-700 font-medium">{item}</li>
                   ))}
                 </ul>
                 <Button onClick={() => onModuleSelect(AppModule.AGRI)} className="!bg-green-600 hover:!bg-green-700 !text-white border-none shadow-lg shadow-green-600/20 px-8">
                   {isBangla ? 'কৃষি সেবা দেখুন' : 'Explore Agriculture'}
                 </Button>
              </div>
              <div className="lg:w-1/2 relative">
                 <div className="absolute inset-0 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                 <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-green-100 max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg"><CloudRain className="text-blue-500" /></div>
                        <div>
                          <p className="font-bold text-gray-800">Rangpur</p>
                          <p className="text-xs text-gray-500">Cloudy</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-gray-800">28°C</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                         <span className="text-sm font-medium text-gray-700 flex items-center gap-2"><TrendingUp size={16}/> Rice (Coarse)</span>
                         <span className="font-bold text-green-700">৳ 1,200</span>
                      </div>
                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                         <span className="text-sm font-medium text-gray-700 flex items-center gap-2"><TrendingUp size={16}/> Potato</span>
                         <span className="font-bold text-green-700">৳ 45/kg</span>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HEALTH SECTION --- */}
      {sections.health && modules[AppModule.HEALTH] && (
        <div id="health" className="py-24 bg-teal-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                 <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-2 block">{isBangla ? 'স্বাস্থ্য সেবা' : 'Healthcare'}</span>
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                   {isBangla ? 'ঘরে বসেই বিশেষজ্ঞ ডাক্তার' : 'Quality Healthcare, Anytime, Anywhere'}
                 </h2>
                 <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                   {isBangla 
                     ? 'গ্রাম বা শহর—যেখানেই থাকুন, টেলিমেডিসিনের মাধ্যমে অভিজ্ঞ ডাক্তারের পরামর্শ নিন। জরুরি প্রয়োজনে অ্যাম্বুলেন্স খুঁজুন।' 
                     : 'Connect with specialized doctors through video consultation. Find nearby hospitals and emergency services instantly.'}
                 </p>
                 <div className="flex flex-wrap gap-4">
                   <Button onClick={() => onModuleSelect(AppModule.HEALTH)} className="!bg-teal-600 hover:!bg-teal-700 !text-white border-none shadow-lg shadow-teal-600/20 px-8">
                     {isBangla ? 'ডাক্তার খুঁজুন' : 'Find a Doctor'}
                   </Button>
                   <Button onClick={() => onModuleSelect(AppModule.HEALTH)} variant="outline" className="border-teal-200 !text-teal-700 hover:!bg-teal-50">
                     {isBangla ? 'জরুরি সেবা' : 'Emergency Help'}
                   </Button>
                 </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                    <HeartPulse size={40} className="text-teal-500 mb-3" />
                    <h4 className="font-bold text-gray-800">{isBangla ? 'টেলিমেডিসিন' : 'Telemedicine'}</h4>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 mt-8">
                    <Calendar size={40} className="text-blue-500 mb-3" />
                    <h4 className="font-bold text-gray-800">{isBangla ? 'অ্যাপয়েন্টমেন্ট' : 'Appointments'}</h4>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 -mt-8">
                    <MapPin size={40} className="text-red-500 mb-3" />
                    <h4 className="font-bold text-gray-800">{isBangla ? 'হাসপাতাল' : 'Hospitals'}</h4>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
                    <ShieldAlert size={40} className="text-orange-500 mb-3" />
                    <h4 className="font-bold text-gray-800">{isBangla ? 'হেলথ টিপস' : 'Health Tips'}</h4>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDUCATION SECTION --- */}
      {sections.edu && modules[AppModule.EDU] && (
        <div id="edu" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">{isBangla ? 'শিক্ষা' : 'Education'}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {isBangla ? 'সবার জন্য মানসম্মত শিক্ষা' : 'Learning Without Boundaries'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                {isBangla ? 'একাডেমিক থেকে কারিগরি—সব ধরনের কোর্স এখন এক অ্যাপে।' : 'From academic to vocational training, access diverse courses in one app.'}
              </p>
              <Button onClick={() => onModuleSelect(AppModule.EDU)} className="!bg-blue-600 hover:!bg-blue-700 !text-white shadow-lg shadow-blue-600/20 px-8">
                {isBangla ? 'শিক্ষা সেবা দেখুন' : 'Explore Education'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'একাডেমিক কোর্স' : 'Academic Courses'}</h3>
                  <p className="text-gray-600 mb-6 text-sm">{isBangla ? 'HSC, SSC এবং বিশ্ববিদ্যালয়ের ভর্তি প্রস্তুতির সম্পূর্ণ গাইডলাইন।' : 'Complete guidelines for HSC, SSC and University admission.'}</p>
                  <button onClick={() => onModuleSelect(AppModule.EDU)} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    {isBangla ? 'শুরু করুন' : 'Start Learning'} <ArrowRight size={16}/>
                  </button>
               </div>
               <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'দক্ষতা উন্নয়ন' : 'Skill Development'}</h3>
                  <p className="text-gray-600 mb-6 text-sm">{isBangla ? 'ফ্রিল্যান্সিং, ওয়েব ডিজাইন এবং ভাষার কোর্স করে স্বাবলম্বী হোন।' : 'Become self-reliant with courses on Freelancing, Web Design and Languages.'}</p>
                  <button onClick={() => onModuleSelect(AppModule.EDU)} className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    {isBangla ? 'কোর্স দেখুন' : 'View Courses'} <ArrowRight size={16}/>
                  </button>
               </div>
               <div className="bg-pink-50 rounded-2xl p-8 border border-pink-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 mb-6">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'ক্যুইজ ও পরীক্ষা' : 'Quiz & Exams'}</h3>
                  <p className="text-gray-600 mb-6 text-sm">{isBangla ? 'নিয়মিত মডেল টেস্ট দিয়ে নিজের প্রস্তুতি যাচাই করুন।' : 'Verify your preparation with regular model tests and quizzes.'}</p>
                  <button onClick={() => onModuleSelect(AppModule.EDU)} className="text-pink-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    {isBangla ? 'পরীক্ষা দিন' : 'Take Exam'} <ArrowRight size={16}/>
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TRANSPORT SECTION --- */}
      {sections.transport && modules[AppModule.TRANSPORT] && (
        <div id="transport" className="py-24 bg-indigo-900 text-white relative overflow-hidden">
          {/* Background Patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute left-0 bottom-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                  <span className="text-indigo-300 font-bold tracking-wider uppercase text-sm mb-2 block">{isBangla ? 'ভ্রমণ ও দূরত্ব' : 'Travel & Distance'}</span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    {isBangla ? 'জেলা ভিত্তিক দূরত্ব ও রুট প্ল্যানিং' : 'District Distance Calculator & Route Info'}
                  </h2>
                  <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                    {isBangla 
                      ? 'বাংলাদেশের যেকোনো দুটি জেলার দূরত্ব জানুন এবং ভ্রমণের সম্ভাব্য সময় হিসাব করুন। আপনার যাত্রা হোক সহজ ও নিরাপদ।'
                      : 'Calculate the distance between any two districts in Bangladesh. Estimate travel time and plan your journey efficiently.'}
                  </p>
                  <Button onClick={() => onModuleSelect(AppModule.TRANSPORT)} className="!bg-white !text-indigo-900 hover:!bg-indigo-50 border-none font-bold px-8">
                    {isBangla ? 'বিস্তারিত ম্যাপ দেখুন' : 'View Full Map'}
                  </Button>
                </div>
                
                <div className="md:w-1/2 w-full max-w-md">
                   <div className="bg-white rounded-2xl p-6 shadow-2xl text-gray-900 relative">
                      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                         <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                           <Navigation size={20} />
                         </div>
                         <h3 className="font-bold text-lg">{isBangla ? 'দূরত্ব ক্যালকুলেটর' : 'Distance Calculator'}</h3>
                      </div>

                      <div className="space-y-4 relative">
                         {/* Connector Line */}
                         <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-gray-200 z-0"></div>

                         <div className="relative z-10">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">{isBangla ? 'কোথা থেকে' : 'From'}</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                               <MapPin className="text-indigo-500 mr-3" size={18} />
                               <select 
                                 className="bg-transparent w-full outline-none text-gray-800 font-medium appearance-none cursor-pointer"
                                 value={fromDistrict}
                                 onChange={(e) => setFromDistrict(e.target.value)}
                               >
                                  <option value="">{isBangla ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
                                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                               </select>
                               <ChevronDown className="text-gray-400" size={16} />
                            </div>
                         </div>

                         <div className="relative z-10">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">{isBangla ? 'কোথায় যাবেন' : 'To'}</label>
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                               <MapPin className="text-red-500 mr-3" size={18} />
                               <select 
                                 className="bg-transparent w-full outline-none text-gray-800 font-medium appearance-none cursor-pointer"
                                 value={toDistrict}
                                 onChange={(e) => setToDistrict(e.target.value)}
                               >
                                  <option value="">{isBangla ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
                                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                               </select>
                               <ChevronDown className="text-gray-400" size={16} />
                            </div>
                         </div>
                      </div>

                      {distanceResult ? (
                        <div className="mt-6 animate-fade-in-up bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                           <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold">{isBangla ? 'দূরত্ব' : 'Distance'}</p>
                                 <p className="text-2xl font-bold text-indigo-700">{distanceResult.km} km</p>
                              </div>
                              <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold">{isBangla ? 'সময়' : 'Time'}</p>
                                 <p className="text-2xl font-bold text-indigo-700">{distanceResult.time}</p>
                              </div>
                           </div>
                           <div className="mt-3 pt-3 border-t border-indigo-100 flex justify-between items-center text-sm">
                              <span className="text-gray-600 flex items-center gap-1"><Fuel size={14} /> {isBangla ? 'আনুমানিক ভাড়া' : 'Est. Bus Fare'}</span>
                              <span className="font-bold text-gray-800">৳ {distanceResult.fare}</span>
                           </div>
                           <button 
                             onClick={() => setDistanceResult(null)}
                             className="w-full mt-3 text-xs text-indigo-600 hover:underline text-center"
                           >
                             {isBangla ? 'আবার হিসাব করুন' : 'Calculate Again'}
                           </button>
                        </div>
                      ) : (
                        <Button 
                          onClick={handleCalculateDistance} 
                          disabled={calculating || !fromDistrict || !toDistrict}
                          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 h-12 text-lg shadow-lg shadow-indigo-200"
                        >
                          {calculating ? (isBangla ? 'হিসাব হচ্ছে...' : 'Calculating...') : (isBangla ? 'দূরত্ব দেখুন' : 'Calculate Distance')}
                        </Button>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- BEAUTIFUL BANGLADESH GALLERY SECTION --- */}
      {sections.gallery && (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-2 block">
                {isBangla ? 'রূপসী বাংলা' : 'Beautiful Bangladesh'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {isBangla ? 'ছবির ক্যানভাসে বাংলাদেশ' : 'Capturing the Essence of Bengal'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {isBangla 
                  ? 'প্রকৃতি, ঐতিহ্য এবং মানুষের জীবনের এক অনন্য মেলবন্ধন।' 
                  : 'A unique blend of nature, heritage, and vibrant life.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {/* Image 1: Tea Garden */}
               <div className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
                 <img 
                   src="https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5" 
                   alt="Sylhet Tea Garden" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                   <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     <h4 className="font-bold text-lg">{isBangla ? 'সিলেটের চা বাগান' : 'Sylhet Tea Gardens'}</h4>
                     <p className="text-sm text-gray-200 flex items-center gap-1"><MapPin size={14}/> Sylhet</p>
                   </div>
                 </div>
               </div>

               {/* Image 2: Boats */}
               <div className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-lg lg:col-span-2">
                 <img 
                   src="https://images.unsplash.com/photo-1628189873998-25f00e95a947" 
                   alt="Riverine Life" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                   <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     <h4 className="font-bold text-lg">{isBangla ? 'নদীমাতৃক বাংলাদেশ' : 'Riverine Bangladesh'}</h4>
                     <p className="text-sm text-gray-200 flex items-center gap-1"><MapPin size={14}/> Barisal</p>
                   </div>
                 </div>
               </div>

               {/* Image 3: Heritage */}
               <div className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-lg lg:col-span-2">
                 <img 
                   src="https://images.unsplash.com/photo-1594196163273-5a02796fb322" 
                   alt="Ahsan Manzil" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                   <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     <h4 className="font-bold text-lg">{isBangla ? 'আহসান মঞ্জিল' : 'Ahsan Manzil'}</h4>
                     <p className="text-sm text-gray-200 flex items-center gap-1"><MapPin size={14}/> Dhaka</p>
                   </div>
                 </div>
               </div>

               {/* Image 4: Sundarbans */}
               <div className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
                 <img 
                   src="https://images.unsplash.com/photo-1548013146-72479768bada" 
                   alt="Sundarbans" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                   <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     <h4 className="font-bold text-lg">{isBangla ? 'সুন্দরবন' : 'The Sundarbans'}</h4>
                     <p className="text-sm text-gray-200 flex items-center gap-1"><MapPin size={14}/> Khulna</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials */}
      {sections.testimonials && (
        <div className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              {isBangla ? 'ব্যবহারকারীদের কথা' : 'Success Stories'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative">
                  <div className="absolute top-6 right-8 text-6xl text-gray-200 font-serif">"</div>
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-700 italic mb-6 text-lg relative z-10">
                    {isBangla 
                      ? 'ড্রিম বিডি অ্যাপ ব্যবহার করে আমি আবহাওয়ার সঠিক খবর পাই, যা আমার ফসল বাঁচাতে সাহায্য করে।' 
                      : 'Using Dream BD, I get accurate weather updates which helps save my crops from unexpected rain.'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">R</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{isBangla ? 'রহিম উদ্দিন' : 'Rahim Uddin'}</h4>
                      <p className="text-sm text-gray-500">{isBangla ? 'কৃষক, রংপুর' : 'Farmer, Rangpur'}</p>
                    </div>
                  </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative">
                  <div className="absolute top-6 right-8 text-6xl text-gray-200 font-serif">"</div>
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-700 italic mb-6 text-lg relative z-10">
                    {isBangla 
                      ? 'আমার হাতের তৈরি পণ্য এখন সারা দেশে বিক্রি করতে পারছি। এটি সত্যি অসাধারণ একটি উদ্যোগ!' 
                      : 'I can now sell my handmade Nakshi Kantha all over the country without any middleman. Truly amazing!'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-xl">S</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{isBangla ? 'সুমাইয়া আক্তার' : 'Sumaiya Akter'}</h4>
                      <p className="text-sm text-gray-500">{isBangla ? 'উদ্যোক্তা, ঢাকা' : 'Entrepreneur, Dhaka'}</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!user && (
        <div className="py-24 bg-brand-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {isBangla ? 'আজই যুক্ত হোন ড্রিম বিডি-তে' : 'Join Dream BD Today'}
            </h2>
            <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              {isBangla 
                ? 'কৃষক, শিক্ষক, ডাক্তার বা সাধারণ নাগরিক—সবার জন্য একটি প্ল্যাটফর্ম। আজই ফ্রি রেজিস্ট্রেশন করুন।'
                : 'Whether you are a farmer, teacher, doctor or citizen—one platform for all. Register for free now.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onRegister} size="lg" className="!bg-white !text-brand-900 hover:!bg-gray-100 px-12 py-4 text-lg font-bold">
                {isBangla ? 'রেজিস্ট্রেশন করুন' : 'Register Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
