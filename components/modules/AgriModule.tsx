
import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudRain, Sun, Sprout, TrendingUp, AlertTriangle, 
  ScanLine, Calculator, BookOpen, Users, Video, 
  Calendar, Droplets, Wind, ChevronRight, Upload, X, CheckCircle, MapPin,
  Leaf, Info, Thermometer, Search, Clock, Loader2, ChevronDown, ChevronUp,
  CircleDollarSign, CalendarClock, Filter, BarChart3, MessageSquare, Heart, Share2, Send, Image as ImageIcon,
  FlaskConical, ClipboardList, Camera
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { User } from '../../types';
import { analyzePlantDisease } from '../../services/geminiService';

interface Props {
  isBangla: boolean;
  user?: User | null;
  onLogin?: () => void;
}

type Tab = 'overview' | 'calculator' | 'community';

interface Comment {
  id: number;
  user: string;
  text: string;
  time?: string;
}

interface ForumPost {
  id: number;
  user: string;
  text: string;
  image?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  showComments: boolean;
  timeAgo: string;
}

const CROPS_DB = [
  {
    id: 1,
    nameBn: 'ধান (Rice)',
    nameEn: 'Rice (Paddy)',
    scientificName: 'Oryza sativa',
    seasonBn: 'বর্ষা/হেমন্ত',
    seasonEn: 'Monsoon/Late Autumn',
    durationBn: '১২০-১৫০ দিন',
    durationEn: '120-150 days',
    waterReq: 'High',
    difficulty: 'Medium',
    soilBn: 'দোআঁশ ও এঁটেল মাটি',
    soilEn: 'Loamy and Clay soil',
    timeBn: 'আউশ: মার্চ-এপ্রিল, আমন: জুন-জুলাই',
    timeEn: 'Aus: Mar-Apr, Aman: Jun-Jul',
    fertilizerBn: 'ইউরিয়া: ১২-১৫ কেজি, টিএসপি: ৩-৪ কেজি (প্রতি বিঘা)',
    fertilizerEn: 'Urea: 12-15 kg, TSP: 3-4 kg (Per Bigha)',
    careBn: 'নিয়মিত আগাছা পরিষ্কার করুন এবং पाण्याची স্তর ২-৩ ইঞ্চি রাখুন।',
    careEn: 'Weed regularly and maintain 2-3 inch water level.',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff' 
  },
  {
    id: 2,
    nameBn: 'পাট (Jute)',
    nameEn: 'Jute',
    scientificName: 'Corchorus',
    seasonBn: 'গ্রীষ্ম',
    seasonEn: 'Summer',
    durationBn: '১০০-১২০ দিন',
    durationEn: '100-120 days',
    waterReq: 'Medium',
    difficulty: 'Low',
    soilBn: 'ব্রহ্মপুত্র ও মেঘনার পলিযুক্ত মাটি',
    soilEn: 'Alluvial soil of Brahmaputra',
    timeBn: 'মার্চ - এপ্রিল',
    timeEn: 'March - April',
    fertilizerBn: 'ইউরিয়া: ৮-১০ কেজি, পটাশ: ২-৩ কেজি',
    fertilizerEn: 'Urea: 8-10 kg, Potash: 2-3 kg',
    careBn: 'চারা গজানোর পর নিড়ানি দিয়ে মাটি আলগা করে দিন।',
    careEn: 'Loosen soil after germination using a weeder.',
    image: 'https://images.unsplash.com/photo-1623227866882-c005c207758f' 
  },
  {
    id: 3,
    nameBn: 'আলু (Potato)',
    nameEn: 'Potato',
    scientificName: 'Solanum tuberosum',
    seasonBn: 'শীতকাল',
    seasonEn: 'Winter',
    durationBn: '৯০-১১০ দিন',
    durationEn: '90-110 days',
    waterReq: 'Medium',
    difficulty: 'Medium',
    soilBn: 'বেলে দোআঁশ মাটি',
    soilEn: 'Sandy loam soil',
    timeBn: 'অক্টোবর - নভেম্বর',
    timeEn: 'October - November',
    fertilizerBn: 'ইউরিয়া: ২৫-৩০ কেজি, টিএসপি: ১০-১২ কেজি',
    fertilizerEn: 'Urea: 25-30 kg, TSP: 10-12 kg',
    careBn: 'মাটি ঝুরঝুরে রাখুন এবং পরিমিত সেচ দিন।',
    careEn: 'Keep soil loose and provide moderate irrigation.',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655' 
  }
];

interface CalculationResult {
  urea: number;
  tsp: number;
  mop: number;
  gypsum: number;
  zinc: number;
  seed: number;
  cost: number;
  schedule: {
    stageBn: string;
    stageEn: string;
    detailBn: string;
    detailEn: string;
    fertilizers: string[];
  }[];
}

export const AgriModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiFileInputRef = useRef<HTMLInputElement>(null);
  const [cropSearch, setCropSearch] = useState('');
  const [landSize, setLandSize] = useState<string>('');
  const [unit, setUnit] = useState('decimal');
  const [cropType, setCropType] = useState('Rice');
  const [seedVariety, setSeedVariety] = useState('HYV');
  const [calculatedResult, setCalculatedResult] = useState<CalculationResult | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  
  // Weather State
  const [weather, setWeather] = useState({
    city: isBangla ? 'রংপুর, বাংলাদেশ' : 'Rangpur, BD',
    temp: 28,
    condition: isBangla ? 'আংশিক মেঘলা' : 'Partly Cloudy'
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Get City Name (Reverse Geocoding)
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || "Unknown Location";
          
          // Get Current Weather (Open-Meteo)
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherRes.json();
          
          setWeather({
            city: `${city}, BD`,
            temp: Math.round(weatherData.current_weather.temperature),
            condition: isBangla ? 'পরিষ্কার আকাশ' : 'Clear Sky'
          });
        } catch (err) {
          console.error("Failed to fetch dynamic weather data", err);
        }
      }, (err) => {
        console.warn("Geolocation permission denied or error:", err.message);
      });
    }
  }, [isBangla]);

  const [posts, setPosts] = useState<ForumPost[]>([
    { 
      id: 1, 
      user: 'Rahim Mia', 
      text: isBangla ? 'আলু গাছের পাতা হলুদ হয়ে যাচ্ছে, কি করব?' : 'Potato leaves are turning yellow, what to do?', 
      likes: 15, 
      liked: false, 
      comments: [{ id: 101, user: 'Karim', text: isBangla ? 'ছত্রাকনাশক স্প্রে করুন।' : 'Spray fungicide.' }], 
      showComments: false, 
      timeAgo: '2h ago' 
    },
    { 
      id: 2, 
      user: 'Kamal Hossain', 
      text: isBangla ? 'বোরো ধানের জন্য সেরা সার কোনটি?' : 'Which fertilizer is best for Boro rice?', 
      likes: 24, 
      liked: true, 
      comments: [], 
      showComments: false, 
      timeAgo: '5h ago' 
    },
  ]);

  const handleAiFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    setScannedResult(null);
    setAiError(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Str = (event.target?.result as string).split(',')[1];
      try {
        const result = await analyzePlantDisease(base64Str, file.type, isBangla);
        if (!result.isPlant) {
          setAiError(isBangla ? "দুঃখিত! এটি কোনো কৃষি বা ফসলের ছবি নয়।" : "Sorry! This is not an agricultural image.");
        } else {
          setScannedResult(result);
        }
      } catch (err) {
        setAiError(isBangla ? "বিশ্লেষণ করতে সমস্যা হয়েছে।" : "Error analyzing the image.");
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCalculate = () => {
    const size = parseFloat(landSize);
    if (!size) return;
    let sizeInDecimal = size;
    if (unit === 'katha') sizeInDecimal = size * 1.65;
    if (unit === 'bigha') sizeInDecimal = size * 33;
    const ureaTotal = sizeInDecimal * 0.95;
    const tsp = sizeInDecimal * 0.4;
    const mop = sizeInDecimal * 0.45;
    const gypsum = sizeInDecimal * 0.3;
    const zinc = sizeInDecimal * 0.05;
    const seedRate = seedVariety === 'Hybrid' ? 0.06 : 0.25; 
    const seed = parseFloat((sizeInDecimal * seedRate).toFixed(2));
    const totalCost = Math.round((ureaTotal * 27) + (tsp * 22) + (mop * 20) + (gypsum * 12) + (zinc * 180) + (seed * 450));
    setCalculatedResult({
      urea: parseFloat(ureaTotal.toFixed(2)),
      tsp: parseFloat(tsp.toFixed(2)),
      mop: parseFloat(mop.toFixed(2)),
      gypsum: parseFloat(gypsum.toFixed(2)),
      zinc: parseFloat(zinc.toFixed(2)),
      seed,
      cost: totalCost,
      schedule: [
        { stageBn: 'জমি তৈরি (শেষ চাষে)', stageEn: 'Land Preparation', detailBn: 'টিএসপি, জিপসাম, জিংক এবং এমওপি সারের অর্ধেক অংশ জমিতে ছিটিয়ে চাষ দিন।', detailEn: 'Apply full TSP, Gypsum, Zinc and half of MOP.', fertilizers: [`TSP: ${tsp.toFixed(2)}kg`, `Gypsum: ${gypsum.toFixed(2)}kg`, `Zinc: ${zinc.toFixed(2)}kg`, `MoP: ${(mop/2).toFixed(2)}kg`] },
        { stageBn: 'রোপণের ১৫-২০ দিন পর (১ম কিস্তি)', stageEn: '15-20 Days After (1st Split)', detailBn: 'ইউরিয়া সারের এক-তৃতীয়াংশ জমিতে প্রয়োগ করুন। আগাছা পরিষ্কার রাখুন।', detailEn: 'Apply 1/3 of total Urea.', fertilizers: [`Urea: ${(ureaTotal/3).toFixed(2)}kg`] },
      ]
    });
  };

  const handleLikePost = (postId: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const toggleComments = (postId: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, showComments: !p.showComments } : p));
  };

  const handleCommentSubmit = (postId: number) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    if (!user) { if (onLogin) onLogin(); return; }

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment: Comment = {
          id: Date.now(),
          user: user.name,
          text: text,
          time: isBangla ? 'এইমাত্র' : 'Just now'
        };
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const DEFAULT_IMG = "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5";
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = DEFAULT_IMG; };

  const renderOverview = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#4279F2] p-8 text-white shadow-xl min-h-[280px] flex flex-col justify-between">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full w-fit"><MapPin size={16} /><span className="text-sm font-bold">{weather.city}</span></div>
              <div className="flex flex-col"><h2 className="text-7xl font-bold tracking-tight">{weather.temp}°C</h2><p className="text-blue-50 font-medium text-2xl mt-1">{weather.condition}</p></div>
            </div>
            <Sun size={96} className="text-yellow-300 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 relative z-10 text-center">
          <div><p className="text-sm opacity-80 mb-1">{isBangla ? 'আর্দ্রতা' : 'Humidity'}</p><p className="text-xl font-bold">75%</p></div>
          <div><p className="text-sm opacity-80 mb-1">{isBangla ? 'বাতাস' : 'Wind'}</p><p className="text-xl font-bold">12 km/h</p></div>
          <div><p className="text-sm opacity-80 mb-1">{isBangla ? 'বৃষ্টি' : 'Rain'}</p><p className="text-xl font-bold">60%</p></div>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><Leaf className="text-green-600" size={28} />{isBangla ? 'এই মৌসুমের ফসল' : 'Seasonal Crops'}</h3>
          <div className="relative w-full sm:w-72">
             <input type="text" placeholder={isBangla ? 'ফসল খুঁজুন...' : 'Search crop...'} value={cropSearch} onChange={(e) => setCropSearch(e.target.value)} className="w-full bg-white border border-gray-200 rounded-full px-5 py-2.5 pl-12 text-sm shadow-sm focus:ring-2 focus:ring-green-500/20" />
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CROPS_DB.filter(c => isBangla ? c.nameBn.includes(cropSearch) : c.nameEn.toLowerCase().includes(cropSearch.toLowerCase())).map(crop => (
            <div key={crop.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-56 overflow-hidden"><img src={getOptimizedImageUrl(crop.image, 500)} onError={handleImageError} alt={crop.nameEn} className="w-full h-full object-cover" /></div>
              <div className="p-6">
                <h4 className="font-bold text-gray-900 text-xl mb-1">{isBangla ? crop.nameBn : crop.nameEn}</h4>
                <Button onClick={() => setSelectedCrop(crop)} variant="outline" className="mt-4 w-full rounded-xl text-sm font-bold">{isBangla ? 'বিস্তারিত দেখুন' : 'View Details'}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="animate-fade-in space-y-8">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Inputs Section */}
          <div className="p-8 md:p-12 border-r border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Calculator size={32} className="text-green-600" />
              {isBangla ? 'সার ও বীজ ক্যালকুলেটর' : 'Fertilizer & Seed Calculator'}
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'জমির পরিমাণ' : 'Land Size'}</label>
                  <input 
                    type="number" 
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'একক' : 'Unit'}</label>
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold cursor-pointer appearance-none"
                  >
                    <option value="decimal">{isBangla ? 'শতাংশ (Decimal)' : 'Decimal'}</option>
                    <option value="katha">{isBangla ? 'কাঠা' : 'Katha'}</option>
                    <option value="bigha">{isBangla ? 'বিঘা (৩৩ শতাংশ)' : 'Bigha (33 Dec)'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'ফসলের ধরন' : 'Crop Type'}</label>
                  <select 
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold cursor-pointer appearance-none"
                  >
                    <option value="Rice">{isBangla ? 'ধান' : 'Rice'}</option>
                    <option value="Wheat">{isBangla ? 'গম' : 'Wheat'}</option>
                    <option value="Potato">{isBangla ? 'আলু' : 'Potato'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'বীজের জাত' : 'Seed Variety'}</label>
                  <select 
                    value={seedVariety}
                    onChange={(e) => setSeedVariety(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold cursor-pointer appearance-none"
                  >
                    <option value="HYV">{isBangla ? 'উফশী (HYV)' : 'HYV'}</option>
                    <option value="Hybrid">{isBangla ? 'হাইব্রিড' : 'Hybrid'}</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-green-200 transition-all hover:scale-[1.02] active:scale-95"
              >
                {isBangla ? 'হিসাব করুন' : 'Calculate Now'}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 p-8 md:p-12">
            {calculatedResult ? (
              <div className="space-y-8 animate-fade-in-up">
                <div>
                  <h4 className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">
                    {isBangla ? 'প্রয়োজনীয় সারের পরিমাণ (কেজি)' : 'Required Fertilizer (KG)'}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: isBangla ? 'ইউরিয়া' : 'Urea', value: calculatedResult.urea, color: 'bg-white text-blue-600 border-blue-100' },
                      { label: isBangla ? 'টিএসপি' : 'TSP', value: calculatedResult.tsp, color: 'bg-white text-orange-600 border-orange-100' },
                      { label: isBangla ? 'এমওপি' : 'MOP', value: calculatedResult.mop, color: 'bg-white text-red-600 border-red-100' },
                      { label: isBangla ? 'জিপসাম' : 'Gypsum', value: calculatedResult.gypsum, color: 'bg-white text-emerald-600 border-emerald-100' },
                      { label: isBangla ? 'জিংক' : 'Zinc', value: calculatedResult.zinc, color: 'bg-white text-purple-600 border-purple-100' },
                    ].map((item, i) => (
                      <div key={i} className={`p-4 rounded-2xl border shadow-sm ${item.color}`}>
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">{item.label}</p>
                        <p className="text-2xl font-black">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                        <CircleDollarSign size={32} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">{isBangla ? 'মোট আনুমানিক খরচ' : 'Est. Total Cost'}</p>
                        <p className="text-3xl font-black text-gray-900">৳ {calculatedResult.cost.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-gray-400 uppercase">{isBangla ? 'প্রয়োজনীয় বীজ' : 'Required Seed'}</p>
                      <p className="text-xl font-black text-green-700">{calculatedResult.seed} KG</p>
                   </div>
                </div>

                <div>
                   <h4 className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                     <CalendarClock size={16} />
                     {isBangla ? 'সার প্রয়োগের সময়সূচী' : 'Fertilizer Application Schedule'}
                   </h4>
                   <div className="space-y-3">
                      {calculatedResult.schedule.map((step, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4">
                           <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                              {i + 1}
                           </div>
                           <div>
                              <h5 className="font-bold text-gray-900">{isBangla ? step.stageBn : step.stageEn}</h5>
                              <p className="text-sm text-gray-500 mt-1">{isBangla ? step.detailBn : step.detailEn}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                 {step.fertilizers.map((f, fi) => (
                                   <span key={fi} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded-md text-gray-600">{f}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20 lg:py-0">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <Calculator size={48} className="text-gray-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'কোন হিসাব পাওয়া যায়নি' : 'No Calculation Found'}</h4>
                <p className="text-gray-600 max-w-xs">{isBangla ? 'বামে তথ্য পূরণ করে ক্যালকুলেট বাটনে ক্লিক করুন।' : 'Fill out the form on the left to see the required fertilizer amounts.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
         <Info className="text-amber-600 shrink-0 mt-0.5" size={18} />
         <p className="text-xs text-amber-800 leading-relaxed">
            {isBangla 
              ? 'দ্রষ্টব্য: এই ক্যালকুলেটরটি কৃষি গবেষণা প্রতিষ্ঠান (BARI/BRRI) এর সাধারণ গাইডলাইনের ওপর ভিত্তি করে তৈরি। মাটির গুণাগুণ ভেদে সার ও বীজের পরিমাণ কম-বেশি হতে পারে। সঠিক পরামর্শের জন্য স্থানীয় কৃষি কর্মকর্তার সহায়তা নিন।'
              : 'Note: This calculator is based on general guidelines from BARI/BRRI. Actual requirements may vary based on soil quality. Consult your local agriculture officer for precise advice.'}
         </p>
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex justify-between items-center gap-4 bg-green-50 p-8 rounded-[2rem] border border-green-100 mb-8">
        <div>
           <h3 className="text-2xl font-black text-green-900 mb-1">{isBangla ? 'কৃষক ফোরাম' : 'Farmers Community'}</h3>
           <p className="text-green-700 font-medium opacity-80">{isBangla ? 'আপনার সমস্যা ও অভিজ্ঞতা শেয়ার করুন' : 'Share your problems and experiences'}</p>
        </div>
        <Button onClick={() => setShowPostModal(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg">
           <MessageSquare size={20} className="mr-2" />{isBangla ? 'নতুন পোস্ট' : 'Create Post'}
        </Button>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
             <div className="flex items-center gap-4 mb-5">
               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-xl">{post.user.charAt(0)}</div>
               <div><h4 className="font-bold text-gray-900 text-lg leading-none mb-1">{post.user}</h4><p className="text-xs text-gray-400 font-medium">{post.timeAgo}</p></div>
             </div>
             
             <p className="text-gray-700 text-xl mb-8 leading-relaxed whitespace-pre-wrap">{post.text}</p>
             
             <div className="flex items-center gap-8 pt-4 border-t border-gray-50">
               <button 
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <Heart size={20} fill={post.liked ? 'currentColor' : 'none'} />{post.likes}
               </button>
               
               <button 
                onClick={() => toggleComments(post.id)}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.showComments ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <MessageSquare size={20} />
                 {post.comments.length} {isBangla ? 'মন্তব্য' : 'Comments'}
               </button>
             </div>

             {/* Comment Section */}
             {post.showComments && (
               <div className="mt-6 pt-6 border-t border-gray-50 space-y-4 animate-fade-in">
                  {/* List of Comments */}
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {post.comments.length > 0 ? post.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-black text-gray-900">{comment.user}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{comment.time || '1h ago'}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{comment.text}</p>
                      </div>
                    )) : (
                      <p className="text-center text-gray-300 text-sm italic py-2">{isBangla ? 'এখনো কোনো মন্তব্য নেই' : 'No comments yet'}</p>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div className="flex gap-2 mt-4 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                     <input 
                       type="text" 
                       value={commentInputs[post.id] || ''}
                       onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                       onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                       placeholder={isBangla ? 'একটি মন্তব্য লিখুন...' : 'Write a comment...'}
                       className="flex-1 bg-transparent border-none focus:outline-none px-3 py-2 text-sm font-medium text-gray-800"
                     />
                     <button 
                       onClick={() => handleCommentSubmit(post.id)}
                       className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all active:scale-95 disabled:opacity-50"
                       disabled={!commentInputs[post.id]?.trim()}
                     >
                       <Send size={18} />
                     </button>
                  </div>
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div><h1 className="text-4xl font-black text-gray-900 flex items-center gap-3"><div className="bg-green-100 p-2 rounded-xl"><Leaf className="text-green-600" size={32} /></div>{isBangla ? 'স্মার্ট কৃষি' : 'Smart Agriculture'}</h1><p className="text-gray-400 font-medium text-lg mt-1">{isBangla ? 'প্রযুক্তির ছোঁয়ায় ফলন বাড়ান' : 'Maximize yield with technology'}</p></div>
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
              {[{ id: 'overview', icon: <TrendingUp size={18}/>, label: isBangla ? 'ড্যাশবোর্ড' : 'Dashboard' }, { id: 'calculator', icon: <Calculator size={18}/>, label: isBangla ? 'ক্যালকুলেটর' : 'Calculator' }, { id: 'community', icon: <Users size={18}/>, label: isBangla ? 'ফোরাম' : 'Forum' }].map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-green-600 text-white shadow-xl' : 'text-gray-500 hover:bg-gray-50'}`}>{tab.icon} {tab.label}</button>
              ))}
            </div>
        </div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'calculator' && renderCalculator()}
        {activeTab === 'community' && renderCommunity()}
      </div>
    </div>
  );
};
