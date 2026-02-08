
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Sprout, BookOpen, HeartPulse, 
  Bus, Trash2, Fish, AlertOctagon, CheckCircle, Star, Bird,
  ArrowRight, MapPin, Calendar, ShieldAlert, TrendingUp, CloudRain, Phone, Activity,
  UserPlus, LayoutGrid, Shield, Building2, Landmark, Truck, Globe,
  CloudSun, Stethoscope, Recycle, Navigation, Clock, Fuel, ChevronDown, Camera,
  Smile, Sparkles, MoveRight, Siren, Droplets, Moon, Sunrise, Sunset,
  Search, Filter, Eye, Zap, Crown, FileText, CreditCard, Image as ImageIcon, Briefcase, ExternalLink, X, RefreshCw
} from 'lucide-react';
import { Button } from './ui/Button';
import { User, AppModule, Notification } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { useData } from '../contexts/DataContext';

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
  
  const { sections, modules, settings } = useSiteConfig();
  const { serviceLinks, serviceCategories, updateServiceLink } = useData();

  // Rotating Headline State
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  
  // Hero Slider State
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Distance Calculator State
  const [fromDistrict, setFromDistrict] = useState('');
  const [toDistrict, setToDistrict] = useState('');
  const [distanceResult, setDistanceResult] = useState<{km: number, time: string, fare: number} | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Service Directory State
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // In-App Browser State
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [browserTitle, setBrowserTitle] = useState('');

  // Ramadan Location State
  const [ramadanDistrict, setRamadanDistrict] = useState('Dhaka');

  // Real-time Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const headlines = [
    {
      bn: <>এক প্ল্যাটফর্মে <span className={`${settings.heroSliderActive ? 'text-brand-400' : 'text-brand-600'}`}>কৃষি, শিক্ষা, স্বাস্থ্য ও পরিবহন</span> সেবা</>,
      en: <>Agriculture, Education, Health <br className="hidden md:block"/> <span className={`${settings.heroSliderActive ? 'text-brand-400' : 'text-brand-600'}`}>& Transport in One Platform</span></>
    },
    {
      bn: <>গ্রামীণ জীবনের সব সমস্যার <span className={`${settings.heroSliderActive ? 'text-brand-400' : 'text-brand-600'}`}>স্মার্ট ডিজিটাল সমাধান</span></>,
      en: <>Smart Digital Solutions for <br className="hidden md:block"/> <span className={`${settings.heroSliderActive ? 'text-brand-400' : 'text-brand-600'}`}>All Rural Challenges</span></>
    },
    {
      bn: <>কৃষকের মুখে হাসি, <span className={`${settings.heroSliderActive ? 'text-brand-400' : 'text-brand-600'}`}>শিক্ষার আলো</span> সবার ঘরে পৌঁছে দিচ্ছে ডিজিটাল দেশ</>,
      en: <>Empowering Farmers, <br className="hidden md:block"/> <span className={`${settings.heroSliderActive ? 'text-brand-400' : 'text-brand-600'}`}>Enlightening Students Everywhere</span></>
    },
    {
      bn: <>জরুরি স্বাস্থ্যসেবা ও অ্যাম্বুলেন্স <span className={`${settings.heroSliderActive ? 'text-brand-400' : 'text-brand-600'}`}>এখন হাতের মুঠোয়</span></>,
      en: <>Emergency Healthcare & Transport <br className="hidden md:block"/> <span className={`${settings.heroSliderActive ? 'text-brand-400' : 'text-brand-600'}`}>at Your Fingertips</span></>
    }
  ];

  useEffect(() => {
    const headlineInterval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 6000); 
    
    let heroInterval: any;
    if (settings.heroSliderActive && settings.heroImages?.length > 0) {
      heroInterval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % settings.heroImages.length);
      }, 5000);
    }
    
    return () => {
      clearInterval(headlineInterval);
      if (heroInterval) clearInterval(heroInterval);
    };
  }, [settings.heroSliderActive, settings.heroImages]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCalculateDistance = () => {
    if (!fromDistrict || !toDistrict) return;
    setCalculating(true);
    setDistanceResult(null);

    setTimeout(() => {
      const baseDist = Math.abs(fromDistrict.length - toDistrict.length) * 50 + 120;
      const hours = Math.floor(baseDist / 40);
      const mins = Math.round((baseDist % 40) * 1.5);
      
      setDistanceResult({
        km: baseDist,
        time: `${hours}h ${mins}m`,
        fare: baseDist * 2.5
      });
      setCalculating(false);
    }, 800);
  };

  const filteredServices = useMemo(() => {
    return (serviceLinks || []).filter((service: any) => {
      const matchesSearch = (service.titleBn.toLowerCase().includes(serviceSearch.toLowerCase()) || 
                             service.titleEn.toLowerCase().includes(serviceSearch.toLowerCase()));
      const matchesTag = selectedTag === 'All' || service.category === selectedTag;
      return matchesSearch && matchesTag;
    });
  }, [serviceSearch, selectedTag, serviceLinks]);

  const handleServiceClick = (service: any) => {
    // Increment view count
    if (updateServiceLink) {
        updateServiceLink({ ...service, views: (service.views || 0) + 1 });
    }

    if (service.link) {
      // Most government sites block iframes via X-Frame-Options.
      // To ensure reliability ("solved koro"), we default to opening in a new tab.
      // If we had a whitelist of iframe-friendly sites, we could use setBrowserUrl here.
      const iframeFriendly = false; // Default to false to prevent errors
      
      if (iframeFriendly) {
        setBrowserUrl(service.link);
        setBrowserTitle(isBangla ? service.titleBn : service.titleEn);
      } else {
        window.open(service.link, '_blank', 'noopener,noreferrer');
      }
    } else if (service.module) {
      // Internal Module
      onModuleSelect(service.module);
    }
  };

  const districts = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Cox\'s Bazar'];

  // All 64 Districts for Ramadan
  const allDistricts = [
    'Bagerhat', 'Bandarban', 'Barguna', 'Barisal', 'Bhola', 'Bogra', 'Brahmanbaria', 'Chandpur', 'Chapainawabganj', 'Chittagong', 'Chuadanga', 'Comilla', 'Cox\'s Bazar', 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur', 'Jessore', 'Jhalokati', 'Jhenaidah', 'Joypurhat', 'Khagrachari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon'
  ];

  // Ramadan Schedule Generator
  const ramadanSchedule = useMemo(() => {
    const DISTRICT_OFFSETS: Record<string, number> = {
        'Dhaka': 0, 'Gazipur': 0, 'Narayanganj': -1, 'Munshiganj': -1, 'Manikganj': +3, 'Narsingdi': -2,
        'Kishoreganj': -2, 'Tangail': +2, 'Faridpur': +3, 'Madaripur': +2, 'Shariatpur': +2, 'Gopalganj': +4,
        'Rajbari': +4, 'Chittagong': -5, 'Cox\'s Bazar': -6, 'Comilla': -4, 'Chandpur': -3, 'Brahmanbaria': -3,
        'Noakhali': -4, 'Feni': -4, 'Lakshmipur': -4, 'Rangamati': -6, 'Khagrachari': -6, 'Bandarban': -6,
        'Sylhet': -6, 'Moulvibazar': -5, 'Habiganj': -4, 'Sunamganj': -5,
        'Rajshahi': +7, 'Chapainawabganj': +8, 'Natore': +6, 'Naogaon': +7, 'Pabna': +6, 'Sirajganj': +4,
        'Bogra': +6, 'Joypurhat': +7,
        'Rangpur': +9, 'Dinajpur': +10, 'Panchagarh': +11, 'Thakurgaon': +11, 'Nilphamari': +10, 'Lalmonirhat': +9,
        'Kurigram': +9, 'Gaibandha': +8,
        'Khulna': +5, 'Bagerhat': +4, 'Satkhira': +6, 'Jessore': +6, 'Jhenaidah': +6, 'Magura': +5,
        'Narail': +4, 'Kushtia': +6, 'Chuadanga': +7, 'Meherpur': +8,
        'Barisal': +1, 'Jhalokati': +2, 'Pirojpur': +3, 'Patuakhali': +1, 'Barguna': +2, 'Bhola': 0,
        'Mymensingh': +2, 'Jamalpur': +4, 'Sherpur': +4, 'Netrokona': +1
    };

    const offset = DISTRICT_OFFSETS[ramadanDistrict] || 0;
    const startDate = new Date('2026-02-18'); // Tentative start
    const schedule = [];
    
    for (let i = 0; i < 30; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      
      const sehriTime = new Date(current);
      sehriTime.setHours(5, 12, 0, 0);
      sehriTime.setMinutes(sehriTime.getMinutes() - i + offset);
      
      const iftarTime = new Date(current);
      iftarTime.setHours(17, 55, 0, 0);
      iftarTime.setMinutes(iftarTime.getMinutes() + i + offset);

      schedule.push({
        roza: i + 1,
        date: current.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long' }),
        day: current.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { weekday: 'long' }),
        sehri: sehriTime.toLocaleTimeString(isBangla ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        iftar: iftarTime.toLocaleTimeString(isBangla ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      });
    }
    return schedule;
  }, [isBangla, ramadanDistrict]);

  // --- BROWSER VIEW RENDER ---
  if (browserUrl) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in font-sans">
        {/* Browser Header */}
        <div className="h-16 border-b border-gray-200 flex items-center px-4 justify-between bg-white shadow-sm shrink-0">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setBrowserUrl(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title={isBangla ? 'বন্ধ করুন' : 'Close'}
              >
                <X size={24} className="text-gray-600" />
              </button>
              <div className="flex flex-col">
                 <span className="font-bold text-gray-900 text-sm line-clamp-1">{browserTitle}</span>
                 <span className="text-xs text-gray-400 line-clamp-1">{browserUrl}</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => { const iframe = document.getElementById('service-frame') as HTMLIFrameElement; if(iframe) iframe.src = browserUrl; }} 
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                title={isBangla ? 'রিলোড' : 'Reload'}
              >
                <RefreshCw size={18} />
              </button>
              <a 
                href={browserUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-100 transition-colors"
              >
                {isBangla ? 'ব্রাউজারে খুলুন' : 'Open in Browser'} <ExternalLink size={14} />
              </a>
           </div>
        </div>
        
        {/* Iframe Container */}
        <div className="flex-1 w-full bg-gray-50 relative">
           <iframe 
             id="service-frame"
             src={browserUrl} 
             className="w-full h-full border-0"
             sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
             title={browserTitle}
           />
           {/* Fallback/Loader Layer */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
              <div className="text-center text-gray-400">
                 <p className="mb-2">Loading...</p>
                 <p className="text-xs">If content doesn't appear, use "Open in Browser"</p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Hero Section */}
      {sections.hero && (
        <section className="relative overflow-hidden pt-20 pb-32 min-h-[600px] flex items-center">
          {settings.heroSliderActive && settings.heroImages?.length > 0 ? (
            <div className="absolute inset-0 z-0">
              {settings.heroImages.map((img, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={img} alt="Digital Desh BD Slider" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-50 z-0"></div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
            <span className={`inline-block py-2 px-4 rounded-full border text-sm font-semibold mb-8 shadow-sm animate-fade-in-up ${settings.heroSliderActive ? 'bg-white/10 text-white border-white/20 backdrop-blur-md' : 'bg-white border-brand-100 text-brand-700'}`}>
              🚀 {isBangla ? 'স্মার্ট বাংলাদেশের সেরা ডিজিটাল সেবা পোর্টাল' : 'The Best Digital Service Portal for Smart Bangladesh'}
            </span>
            
            <h1 
              key={currentHeadlineIndex}
              className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight animate-fade-in min-h-[120px] md:min-h-[160px] ${settings.heroSliderActive ? 'text-white drop-shadow-xl' : 'text-gray-900'}`}
            >
              {isBangla ? headlines[currentHeadlineIndex].bn : headlines[currentHeadlineIndex].en}
            </h1>

            <p className={`text-xl mb-10 max-w-3xl mx-auto leading-relaxed ${settings.heroSliderActive ? 'text-gray-200' : 'text-gray-600'}`}>
              {isBangla 
                ? 'বাংলাদেশের সব জরুরি ডিজিটাল সেবা এখন এক ঠিকানায়। কৃষি তথ্য, স্বাস্থ্য সেবা, শিক্ষা এবং পরিবহন সব সমস্যার সমাধান ডিজিটাল দেশ বিডি।'
                : 'All essential services for Bangladesh in one platform. Agriculture, Health, Education, and Transport solutions with Digital Desh BD.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onOpenAiChat} 
                size="lg" 
                className="text-lg px-10 py-4 shadow-xl shadow-brand-600/30 hover:shadow-2xl hover:shadow-brand-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 relative overflow-hidden group w-full sm:w-auto"
              >
                 <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                 <Bird size={20} className="animate-pulse" />
                {isBangla ? 'মিঠু এআই এর সাথে চ্যাট' : 'Chat with Mithu AI'} 
              </Button>

              <Button onClick={() => scrollToSection('about')} variant="outline" size="lg" className={`text-lg px-10 py-4 w-full sm:w-auto ${settings.heroSliderActive ? 'bg-white/10 border-white/30 hover:bg-white/20 !text-white' : 'bg-gray-800/20 border-gray-300 hover:bg-gray-800/30'}`}>
                {isBangla ? 'সেবা সম্পর্কে জানুন' : 'Learn More'}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* About Platform */}
      {sections.about && (
        <section id="about" className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
                {isBangla ? 'আমাদের লক্ষ্য: স্মার্ট বাংলাদেশ গঠন' : 'Our Mission: Building Smart Bangladesh'}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed relative z-10 font-medium">
                {isBangla 
                  ? 'Digital Desh BD এর মূল লক্ষ্য হলো বাংলাদেশের গ্রামীণ ও শহরের সব মানুষের কাছে আধুনিক প্রযুক্তি এবং জরুরি ডিজিটাল সেবা পৌঁছে দেওয়া। আমরা চাই প্রতিটি নাগরিক হোক স্মার্ট এবং আত্মনির্ভরশীল।'
                  : 'Digital Desh BD aims to provide modern technology and essential digital services to everyone in Bangladesh. We want every citizen to be smart and self-reliant.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Ramadan 2026 Section */}
      <section className="py-16 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-white/5 transform translate-x-1/3 -translate-y-1/3">
          <Moon size={400} strokeWidth={0.5} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
            <div className="text-center md:text-left w-full md:w-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold mb-4 border border-emerald-500/30">
                  <Moon size={16} />
                  {isBangla ? 'পবিত্র মাহে রমজান' : 'Holy Ramadan 2026'}
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight text-white">
                  {isBangla ? 'রমজান ক্যালেন্ডার ২০২৬' : 'Ramadan Calendar 2026'}
                </h2>
                <p className="text-gray-400 max-w-xl text-lg">
                  {isBangla ? 'আপনার জেলার সেহরি ও ইফতারের সঠিক সময়সূচি' : 'Accurate Sehri & Iftar schedule for your district'}
                </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full md:w-72 shadow-xl">
               <label className="text-xs text-emerald-400 font-bold uppercase mb-2 flex items-center gap-2 tracking-widest">
                 <MapPin size={14} /> {isBangla ? 'আপনার জেলা নির্বাচন করুন' : 'Select Your District'}
               </label>
               <div className="relative">
                 <select 
                   value={ramadanDistrict} 
                   onChange={(e) => setRamadanDistrict(e.target.value)}
                   className="w-full bg-gray-900/80 text-white pl-4 pr-10 py-3 rounded-xl border border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold appearance-none cursor-pointer hover:bg-gray-900 transition-colors custom-scrollbar"
                 >
                   {allDistricts.sort().map(d => <option key={d} value={d} className="bg-gray-900">{d}</option>)}
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's / Next Highlight */}
            <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               {/* Real-time Clock */}
               <div className="w-full border-b border-white/10 pb-6 mb-6">
                  <p className="text-emerald-300 font-bold text-lg mb-1">
                    {currentTime.toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-3xl md:text-4xl font-black text-white tracking-widest">
                    {currentTime.toLocaleTimeString(isBangla ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </p>
               </div>

               <h3 className="text-xl font-bold text-emerald-300 mb-2 uppercase tracking-widest">{isBangla ? 'প্রথম রোজা' : '1st Ramadan'}</h3>
               <h1 className="text-5xl font-black text-white mb-6">{ramadanSchedule[0].date}</h1>
               
               <div className="w-full grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                     <div className="flex items-center justify-center gap-2 text-orange-300 mb-1">
                       <Sunrise size={20} /> <span className="text-xs font-bold uppercase">{isBangla ? 'সেহরি শেষ' : 'Sehri End'}</span>
                     </div>
                     <p className="text-2xl font-bold">{ramadanSchedule[0].sehri}</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                     <div className="flex items-center justify-center gap-2 text-indigo-300 mb-1">
                       <Sunset size={20} /> <span className="text-xs font-bold uppercase">{isBangla ? 'ইফতার শুরু' : 'Iftar Start'}</span>
                     </div>
                     <p className="text-2xl font-bold">{ramadanSchedule[0].iftar}</p>
                  </div>
               </div>

               {/* Duas Section */}
               <div className="mt-6 w-full space-y-3">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                     <p className="text-xs font-bold text-emerald-300 uppercase mb-1">{isBangla ? 'রোজা রাখার নিয়ত (সেহরি)' : 'Sehri Dua'}</p>
                     <p className="text-lg font-serif text-white/90 mb-1">نَوَيْتُ اَنْ اُصُوْمَ غَدًا مِّنْ شَهْرِ رَمْضَانَ الْمُبَارَكِ فَرْضًا لَكَ يَا اللهُ فَتَقَبَّل مَنِّي اِنَّكَ اَنْتَ السَّمِيْعُ الْعَلِيْم</p>
                     <p className="text-xs text-gray-300">{isBangla ? 'নাওয়াইতু আন আছুমা গাদাম, মিন শাহরি রমাদানাল মুবারাক; ফারদাল্লাকা ইয়া আল্লাহু, ফাতাকাব্বাল মিন্নি ইন্নিকা আনতাস সামিউল আলিম।' : 'Nawaitu an asuma gadam min shahri ramadanal mubarak; Fardallaka ya Allahu, fatakabbal minni innika antas samiul alim.'}</p>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                     <p className="text-xs font-bold text-emerald-300 uppercase mb-1">{isBangla ? 'ইফতারের দোয়া' : 'Iftar Dua'}</p>
                     <p className="text-lg font-serif text-white/90 mb-1">اَللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ بِرَحْمَتِكَ يَا اَرْحَمَ الرَّاحِمِيْنَ</p>
                     <p className="text-xs text-gray-300">{isBangla ? 'আল্লাহুম্মা লাকা ছুমতু ওয়া আলা রিযক্বিকা ওয়া আফতারতু বিরাহমাতিকা ইয়া আরহামার রাহিমিন।' : 'Allahumma laka sumtu wa ala rizqika wa aftartu bi-rahmatika ya arhamar rahimin.'}</p>
                  </div>
               </div>
            </div>

            {/* Calendar List */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 md:p-8 text-gray-900 shadow-xl overflow-hidden flex flex-col max-h-[650px]">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <Calendar size={20} className="text-emerald-600" /> {isBangla ? 'পুরো মাসের সময়সূচি' : 'Full Month Schedule'}
                  </h3>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">২০২৬</span>
               </div>
               
               <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                  <div className="grid grid-cols-1 gap-3">
                     {ramadanSchedule.map((day, idx) => (
                       <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${idx === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:border-emerald-100 transition-colors'}`}>
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                               {day.roza}
                             </div>
                             <div>
                                <p className="font-bold text-gray-900">{day.date}</p>
                                <p className="text-xs text-gray-500">{day.day}</p>
                             </div>
                          </div>
                          <div className="text-right flex gap-4 md:gap-8">
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">{isBangla ? 'সেহরি' : 'Sehri'}</p>
                                <p className="font-bold text-gray-800">{day.sehri}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">{isBangla ? 'ইফতার' : 'Iftar'}</p>
                                <p className="font-bold text-emerald-600">{day.iftar}</p>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Service Directory Section */}
      {sections.features && (
        <section id="features" className="py-24 bg-white text-gray-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-10">
              <div className="relative mb-8 max-w-xl mx-auto">
                <input 
                  type="text" 
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder={isBangla ? 'কাজের টাইটেল বা ডেসক্রিপশন দিয়ে খুঁজুন...' : 'Search by service title or description...'}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Filter Chips */}
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar justify-center">
                {serviceCategories.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTag(cat.id)}
                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                      selectedTag === cat.id 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {isBangla ? cat.titleBn : cat.titleEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service: any) => (
                <div 
                  key={service.id} 
                  onClick={() => handleServiceClick(service)}
                  className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-between hover:border-blue-100 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-3">
                    {service.badge && (
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                        service.badge === 'FREE' ? 'bg-green-50 text-green-600' : 
                        service.badge === 'NEW' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                      {isBangla ? service.titleBn : service.titleEn}
                    </h3>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide opacity-80">
                      {service.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <Eye size={14} /> {service.views || 0}
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-blue-600">
                      {service.link ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">{isBangla ? 'কোনো সেবা পাওয়া যায়নি' : 'No services found'}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Usage Guide (Step-by-step) */}
      <section className="py-24 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-600 font-bold text-sm uppercase tracking-widest block mb-2">{isBangla ? 'ব্যবহার নির্দেশিকা' : 'Usage Guide'}</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900">{isBangla ? 'খুব সহজেই সেবা নিন' : 'Get Services Easily'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '১', title: isBangla ? 'একাউন্ট তৈরি করুন' : 'Create Account', desc: isBangla ? 'আপনার মোবাইল নম্বর বা ইমেল ব্যবহার করে খুব সহজেই রেজিস্ট্রেশন করুন।' : 'Register easily using your mobile number or email.', icon: <UserPlus className="text-blue-500" size={32} /> },
              { step: '২', title: isBangla ? 'সেবা নির্বাচন করুন' : 'Select Service', desc: isBangla ? 'কৃষি, স্বাস্থ্য, শিক্ষা বা পরিবহন—আপনার প্রয়োজনীয় সেবাটি বেছে নিন।' : 'Agri, Health, Edu, or Transport—choose your needed service.', icon: <LayoutGrid className="text-green-500" size={32} /> },
              { step: '৩', title: isBangla ? 'সমাধান পান' : 'Get Solution', desc: isBangla ? 'দ্রুত এবং নির্ভরযোগ্য সেবা উপভোগ করুন এবং জীবনযাত্রার মান উন্নয়ন করুন।' : 'Enjoy fast and reliable service and improve your life quality.', icon: <Smile className="text-purple-500" size={32} /> },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center group hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.step}. {item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft Highlight Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-black uppercase tracking-widest border border-orange-100">
                   {isBangla ? 'কারুশিল্প' : 'Crafts'}
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                    {isBangla ? 'কারুশিল্পীদের ক্ষমতায়ন, ঐতিহ্যের সুরক্ষা' : 'Empowering Artisans, Protecting Heritage'}
                 </h2>
                 <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    {isBangla 
                     ? 'সরাসরি কারিগরদের কাছ থেকে কিনুন। নকশী কাঁথা, জামদানি, এবং মাটির তৈরি পণ্য—সবই এক ক্লিকে।' 
                     : 'Buy directly from artisans. Nakshi Kantha, Jamdani, and Pottery—all in one click.'}
                 </p>
                 <Button onClick={() => onModuleSelect(AppModule.CRAFT)} size="lg" className="bg-orange-600 hover:bg-orange-700 rounded-2xl px-12 py-4 font-black shadow-lg shadow-orange-200">
                    {isBangla ? 'কারুশিল্প দেখুন' : 'View Crafts'}
                 </Button>
              </div>
              <div className="flex-1 w-full grid grid-cols-2 gap-4">
                 {[
                   { name: isBangla ? 'নকশী কাঁথা' : 'Nakshi Kantha', img: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6' },
                   { name: isBangla ? 'বাঁশের ঝুড়ি' : 'Bamboo Basket', img: 'https://images.unsplash.com/photo-1595265677860-9a3143b87c32' },
                   { name: isBangla ? 'জামদানি শাড়ি' : 'Jamdani Saree', img: 'https://images.unsplash.com/photo-1610725664285-a3a962e51a46' },
                   { name: isBangla ? 'মাটির কলস' : 'Clay Pot', img: 'https://images.unsplash.com/photo-1620395461140-5e586043ef7a' },
                 ].map((item, i) => (
                   <div key={i} className="space-y-2 group cursor-pointer" onClick={() => onModuleSelect(AppModule.CRAFT)}>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                         <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <p className="font-bold text-gray-700 text-sm pl-1">{item.name}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Smart Agri Preview */}
      {sections.agri && (
        <section className="py-24 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-black uppercase tracking-widest border border-green-100">
                    <Sprout size={16} /> {isBangla ? 'কৃষকদের জন্য প্রযুক্তি' : 'Tech for Farmers'}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                    {isBangla ? 'আপনার ফসলের যত্ন নিন এআই প্রযুক্তির মাধ্যমে' : 'Take Care of Your Crops with AI Tech'}
                  </h2>
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    {isBangla 
                      ? 'এখন ফসলের রোগ শনাক্ত করা আরও সহজ। মিঠু এআই এর সাহায্যে ছবি তুলেই জেনে নিন রোগের কারণ এবং প্রতিকার। সাথে থাকছে বাজার দরের লাইভ আপডেট।'
                      : 'Now identifying crop diseases is easier. With Mithu AI, snap a photo and find cause & solution instantly. Also get live market prices.'}
                  </p>
                  <ul className="space-y-4">
                     {[
                       isBangla ? 'ফসলের রোগ নির্ণয় (AI Scan)' : 'Disease Diagnosis (AI Scan)',
                       isBangla ? 'আজকের বাজার দর' : 'Daily Market Prices',
                       isBangla ? 'সার ও বীজ ক্যালকুলেটর' : 'Fertilizer & Seed Calc'
                     ].map((point, i) => (
                       <li key={i} className="flex items-center gap-3 text-gray-700 font-bold">
                         <div className="p-1 bg-green-100 text-green-600 rounded-full"><CheckCircle size={18} /></div>
                         {point}
                       </li>
                     ))}
                  </ul>
                  <Button onClick={() => onModuleSelect(AppModule.AGRI)} size="lg" className="bg-green-600 hover:bg-green-700 rounded-2xl px-10 shadow-lg shadow-green-200">
                    {isBangla ? 'কৃষি মডিউল দেখুন' : 'Go to Agri Module'}
                  </Button>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-60"></div>
                  <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1200" alt="Agri Tech" className="rounded-[3rem] shadow-2xl relative z-10 border-8 border-white" />
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Emergency & Health Preview */}
      {sections.health && (
        <section className="py-24 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse shadow-lg">
                <Siren size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">{isBangla ? 'জরুরি স্বাস্থ্য সেবা ২৪/৭' : '24/7 Emergency Health'}</h2>
              <p className="text-lg text-gray-600 font-medium">
                {isBangla 
                  ? 'আপনার এলাকায় নিকটস্থ হাসপাতাল, অ্যাম্বুলেন্স এবং রক্তদাতার তথ্য পান নিমেষেই। ডিজিটাল দেশ সব সময় আপনার পাশে।'
                  : 'Find nearby hospitals, ambulances, and blood donors in your area instantly. Digital Desh is always by your side.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                 <div className="bg-white p-6 rounded-3xl shadow-md border border-red-100 flex items-center justify-between group cursor-pointer" onClick={() => onModuleSelect(AppModule.HEALTH)}>
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Droplets size={24} /></div>
                       <div className="text-left"><h4 className="font-bold text-gray-900">{isBangla ? 'রক্তের প্রয়োজন?' : 'Need Blood?'}</h4><p className="text-xs text-gray-400 font-bold uppercase">{isBangla ? 'রক্তদাতা খুঁজুন' : 'Find Donors'}</p></div>
                    </div>
                    <ArrowRight className="text-gray-300 group-hover:text-red-500 transition-colors" />
                 </div>
                 <div className="bg-white p-6 rounded-3xl shadow-md border border-red-100 flex items-center justify-between group cursor-pointer" onClick={() => onModuleSelect(AppModule.HEALTH)}>
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Building2 size={24} /></div>
                       <div className="text-left"><h4 className="font-bold text-gray-900">{isBangla ? 'হাসপাতাল খুঁজুন' : 'Find Hospitals'}</h4><p className="text-xs text-gray-400 font-bold uppercase">{isBangla ? 'কাছের সেবাকেন্দ্র' : 'Nearby Centers'}</p></div>
                    </div>
                    <ArrowRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                 </div>
              </div>
              <Button onClick={() => onModuleSelect(AppModule.HEALTH)} variant="outline" className="mt-10 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl px-12 py-4 font-black">
                {isBangla ? 'বিস্তারিত স্বাস্থ্যসেবা' : 'Detailed Health Services'}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Distance Calculator Section */}
      {sections.transport && (
        <section id="distance" className="py-24 bg-[#0f172a] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                 <h2 className="text-4xl md:text-5xl font-black">{isBangla ? 'ভ্রমণ সহজ করুন' : 'Travel Simplified'}</h2>
                 <p className="text-lg text-gray-400 font-medium leading-relaxed">
                   {isBangla 
                    ? 'বাংলাদেশের এক জেলা থেকে অন্য জেলার দূরত্ব এবং সম্ভাব্য বাস ভাড়া জেনে নিন এক ক্লিকেই।' 
                    : 'Get distance between districts and estimated bus fares in just one click.'}
                 </p>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{isBangla ? 'শুরু' : 'From'}</label>
                          <select className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-500 font-bold" value={fromDistrict} onChange={e => setFromDistrict(e.target.value)}>
                             <option className="text-black">Select District</option>
                             {districts.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{isBangla ? 'গন্তব্য' : 'To'}</label>
                          <select className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-500 font-bold" value={toDistrict} onChange={e => setToDistrict(e.target.value)}>
                             <option className="text-black">Select District</option>
                             {districts.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
                          </select>
                       </div>
                    </div>
                    <Button onClick={handleCalculateDistance} disabled={calculating} className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 font-black text-lg shadow-xl shadow-brand-500/20">
                       {calculating ? (isBangla ? 'হিসাবচ্ছে...' : 'Calculating...') : (isBangla ? 'দূরত্ব ও ভাড়া দেখুন' : 'Check Distance & Fare')}
                    </Button>
                 </div>
              </div>
              <div className="flex-1 w-full">
                 {distanceResult ? (
                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 space-y-10 animate-fade-in">
                      <div className="flex justify-between items-center pb-8 border-b border-white/10">
                         <div className="text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? 'দূরত্ব' : 'Distance'}</p>
                            <h4 className="text-4xl font-black">{distanceResult.km} <span className="text-sm font-medium text-brand-400">km</span></h4>
                         </div>
                         <div className="w-px h-10 bg-white/10"></div>
                         <div className="text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? 'সময় (প্রায়)' : 'Est. Time'}</p>
                            <h4 className="text-4xl font-black">{distanceResult.time}</h4>
                         </div>
                      </div>
                      <div className="bg-brand-600/10 border border-brand-500/30 rounded-2xl p-6 text-center">
                         <p className="text-xs font-bold text-brand-400 uppercase mb-2">{isBangla ? 'সম্ভাব্য বাস ভাড়া' : 'Est. Bus Fare'}</p>
                         <h4 className="text-5xl font-black text-white">৳ {distanceResult.fare}</h4>
                         <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">{isBangla ? '* দূরত্ব অনুযায়ী ভাড়া কম-বেশি হতে পারে' : '* Fares may vary based on route'}</p>
                      </div>
                   </div>
                 ) : (
                   <div className="bg-white/5 border border-dashed border-white/20 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center">
                      <Navigation size={64} className="text-gray-700 mb-6" />
                      <p className="text-gray-500 font-medium">{isBangla ? 'বামে তথ্য প্রদান করে দূরত্ব ও সম্ভাব্য ভাড়া দেখে নিন।' : 'Fill details on the left to check distance and fare.'}</p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Beautiful Bangladesh Gallery */}
      {sections.gallery && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">{isBangla ? 'অপূর্ব বাংলাদেশ' : 'Beautiful Bangladesh'}</h2>
                <p className="text-gray-500 text-lg font-medium">{isBangla ? 'আমাদের গর্ব, আমাদের ঐতিহ্য' : 'Our Pride, Our Heritage'}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(settings.galleryImages?.length > 0 ? settings.galleryImages : [
                  'https://images.unsplash.com/photo-1548013146-72479768bada',
                  'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5',
                  'https://images.unsplash.com/photo-1628189873998-25f00e95a947',
                  'https://images.unsplash.com/photo-1595265677860-9a3143b87c32'
                ]).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Bangladesh" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Camera className="text-white" size={32} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {sections.testimonials && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">{isBangla ? 'নাগরিকদের কথা' : 'Voices of Citizens'}</h2>
                <p className="text-gray-500 text-lg font-medium">{isBangla ? 'আমাদের ইউজারদের ফিডব্যাক' : 'Feedback from our valued users'}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'আব্দুর রহিম', role: 'কৃষক', text: 'মিঠু এআই ব্যবহার করে আমার ধানের পোকা দমনে আমি সফল হয়েছি। দারুণ একটি অ্যাপ!' },
                  { name: 'ফাতেমা বেগম', role: 'শিক্ষার্থী', text: 'লাইব্রেরি মডিউলটি পড়াশোনায় অনেক সাহায্য করছে। সরকারি চাকরির সব তথ্য এক জায়গায় পাওয়া যায়।' },
                  { name: 'সালাম আহমেদ', role: 'উদ্যোক্তা', text: 'কারুশিল্প বাজারে আমার পণ্য বিক্রি করছি। বাংলাদেশের ঐতিহ্যকে বাঁচিয়ে রাখতে এটি ভালো উদ্যোগ।' },
                ].map((test, i) => (
                  <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                     <div className="flex gap-1 mb-6">
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#f59e0b" className="text-amber-500" />)}
                     </div>
                     <p className="text-gray-600 italic font-medium mb-8 leading-relaxed">"{test.text}"</p>
                     <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                     <h4 className="font-bold text-gray-900">{test.name}</h4>
                     <p className="text-xs text-brand-600 font-black uppercase tracking-widest mt-1">{test.role}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* App Promo Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-gradient-to-r from-[#3DB378] to-[#9CDDB7] rounded-[3.5rem] p-10 md:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[0_20px_50px_rgba(45,171,109,0.2)]">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-10"></div>
              <div className="relative z-10 space-y-8 flex-1 text-center lg:text-left">
                 <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                    {isBangla ? 'স্মার্ট বাংলাদেশ এখন আপনার পকেটে' : 'Smart Bangladesh in Your Pocket'}
                 </h2>
                 <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-xl">
                    {isBangla 
                     ? 'আজই ডিজিটাল দেশ পোর্টালটি ব্যবহার শুরু করুন এবং সব সেবা গ্রহণ করুন মুহূর্তেই।' 
                     : 'Start using Digital Desh portal today and access all services instantly.'}
                 </p>
                 <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                    {!user && (
                       <Button onClick={onRegister} size="lg" className="bg-white !text-black hover:bg-white/90 font-black px-12 py-4 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 border-none">
                          {isBangla ? 'রেজিস্ট্রেশন করুন' : 'Sign Up Free'}
                       </Button>
                    )}
                    <Button onClick={onOpenAiChat} variant="outline" size="lg" className="bg-white/25 border-white/70 !text-black hover:bg-white/35 rounded-xl font-black px-10 py-4 backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                       <Sparkles className="mr-2" size={20} /> {isBangla ? 'এআই সহকারীর সাহায্য নিন' : 'Talk to AI Assistant'}
                    </Button>
                 </div>
              </div>
              <div className="relative z-10 flex-1 flex justify-center lg:justify-end">
                 <div className="w-64 h-64 md:w-80 md:h-80 bg-white/15 rounded-full flex items-center justify-center border-2 border-white/10 backdrop-blur-sm animate-pulse shadow-inner group transition-all">
                    <Bird size={140} className="text-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-500" />
                 </div>
              </div>
           </div>
        </div>
      </section>
      
    </div>
  );
};
