
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
  },
  {
    id: 4,
    nameBn: 'গম (Wheat)',
    nameEn: 'Wheat',
    scientificName: 'Triticum',
    seasonBn: 'শীতকাল',
    seasonEn: 'Winter',
    durationBn: '১০০-১২০ দিন',
    durationEn: '100-120 days',
    waterReq: 'Low',
    difficulty: 'Easy',
    soilBn: 'দোআঁশ মাটি',
    soilEn: 'Loamy soil',
    timeBn: 'নভেম্বরের মাঝামাঝি',
    timeEn: 'Mid November',
    fertilizerBn: 'ইউরিয়া: ১৫-২০ কেজি, এমওপি: ৮-১০ কেজি',
    fertilizerEn: 'Urea: 15-20 kg, MoP: 8-10 kg',
    careBn: 'তীব্র ঠান্ডায় ভালো ফলন হয়।',
    careEn: 'Good yield in cold weather.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b' 
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
  const [selectedCrop, setSelectedCrop] = useState<typeof CROPS_DB[0] | null>(null);
  
  // AI Disease State
  const [analyzing, setAnalyzing] = useState(false);
  const [scannedResult, setScannedResult] = useState<null | { disease: string; severity: string; solution: string }>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiFileInputRef = useRef<HTMLInputElement>(null);

  // Search
  const [cropSearch, setCropSearch] = useState('');

  // Calculator states
  const [landSize, setLandSize] = useState<string>('');
  const [unit, setUnit] = useState('decimal');
  const [cropType, setCropType] = useState('Rice');
  const [seedVariety, setSeedVariety] = useState('HYV');
  const [calculatedResult, setCalculatedResult] = useState<CalculationResult | null>(null);
  
  // Community state
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>([
    { id: 1, user: 'Rahim Mia', text: isBangla ? 'আলু গাছের পাতা হলুদ হয়ে যাচ্ছে, কি করব?' : 'Potato leaves are turning yellow, what to do?', likes: 15, liked: false, comments: [{ id: 101, user: 'Karim', text: isBangla ? 'ছত্রাকনাশক স্প্রে করুন।' : 'Spray fungicide.' }], showComments: false, timeAgo: '2h ago' },
    { id: 2, user: 'Kamal Hossain', text: isBangla ? 'বোরো ধানের জন্য সেরা সার কোনটি?' : 'Which fertilizer is best for Boro rice?', likes: 24, liked: true, comments: [], showComments: false, timeAgo: '5h ago' },
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
      const mimeType = file.type;

      try {
        const result = await analyzePlantDisease(base64Str, mimeType, isBangla);
        if (!result.isPlant) {
          setAiError(isBangla 
            ? "দুঃখিত! এটি কোনো কৃষি বা ফসলের ছবি নয়।" 
            : "Sorry! This is not an agricultural image.");
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
        { stageBn: 'রোপণের ৩৫-৪০ দিন পর (২য় কিস্তি)', stageEn: '35-40 Days After (2nd Split)', detailBn: 'ইউরিয়া সারের দ্বিতীয় কিস্তি প্রয়োগ করুন। এটি কাইচ থোড় আসার পূর্বের সময়।', detailEn: 'Apply 2/3 of total Urea.', fertilizers: [`Urea: ${(ureaTotal/3).toFixed(2)}kg`] },
        { stageBn: 'ফুল আসার ৫-৭ দিন পূর্বে (৩য় কিস্তি)', stageEn: 'Before Flowering (3rd Split)', detailBn: 'ইউরিয়ার শেষ কিস্তি এবং অবশিষ্ট এমওপি সার ছিটিয়ে দিন।', detailEn: 'Apply remaining Urea and MoP.', fertilizers: [`Urea: ${(ureaTotal/3).toFixed(2)}kg`, `MoP: ${(mop/2).toFixed(2)}kg`] }
      ]
    });
  };

  const renderOverview = () => (
    <div className="space-y-10 animate-fade-in">
      {/* Weather Widget */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#4279F2] p-8 text-white shadow-xl min-h-[280px] flex flex-col justify-between">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full w-fit">
                <MapPin size={16} className="text-white" />
                <span className="text-sm font-bold tracking-wide">Rangpur, BD</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-7xl font-bold tracking-tight">28°C</h2>
                <p className="text-blue-50 font-medium text-2xl mt-1">{isBangla ? 'আংশিক মেঘলা' : 'Partly Cloudy'}</p>
              </div>
            </div>
            <Sun size={96} className="text-yellow-300 drop-shadow-2xl animate-pulse" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 relative z-10">
          <div className="text-center">
            <p className="text-sm opacity-80 mb-1">{isBangla ? 'আর্দ্রতা' : 'Humidity'}</p>
            <p className="text-xl font-bold">75%</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80 mb-1">{isBangla ? 'বাতাস' : 'Wind'}</p>
            <p className="text-xl font-bold">12 km/h</p>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-80 mb-1">{isBangla ? 'বৃষ্টি' : 'Rain'}</p>
            <p className="text-xl font-bold">60%</p>
          </div>
        </div>
        {/* Background blobs for aesthetics */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)]"></div>
      </div>

      {/* Seasonal Crops Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Leaf className="text-green-600" size={28} />
            {isBangla ? 'এই মৌসুমের ফসল' : 'Seasonal Crops'}
          </h3>
          <div className="relative w-full sm:w-72">
             <input 
               type="text" 
               placeholder={isBangla ? 'ফসল খুঁজুন...' : 'Search crop...'}
               value={cropSearch}
               onChange={(e) => setCropSearch(e.target.value)}
               className="w-full bg-white border border-gray-200 rounded-full px-5 py-2.5 pl-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
             />
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CROPS_DB.filter(c => isBangla ? c.nameBn.includes(cropSearch) : c.nameEn.toLowerCase().includes(cropSearch.toLowerCase())).map(crop => (
            <div key={crop.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <img src={getOptimizedImageUrl(crop.image, 500)} alt={crop.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="font-bold text-gray-900 text-xl mb-1">{isBangla ? crop.nameBn : crop.nameEn}</h4>
                <p className="text-xs text-gray-400 italic mb-4">{crop.scientificName}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                   <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${crop.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                     {isBangla ? (crop.difficulty === 'Easy' ? 'সহজ' : 'মাঝারি') : crop.difficulty}
                   </span>
                   <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                     {isBangla ? `পানি: ${crop.waterReq === 'High' ? 'বেশি' : crop.waterReq === 'Medium' ? 'মাঝারি' : 'কম'}` : `Water: ${crop.waterReq}`}
                   </span>
                </div>

                <Button onClick={() => setSelectedCrop(crop)} variant="outline" className="mt-auto w-full rounded-xl text-sm font-bold border-gray-200 hover:bg-green-50 hover:text-green-700 transition-colors">
                  {isBangla ? 'বিস্তারিত দেখুন' : 'View Details'} 
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Disease Detection */}
      <div className="bg-[#FBFFFD] rounded-[2.5rem] p-10 shadow-sm border border-green-50 text-center mt-12 mb-20">
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
            <ScanLine size={32} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">{isBangla ? 'রোগ বালাই ও সমাধান (AI)' : 'AI Disease Detection'}</h3>
          <p className="text-gray-500 text-base mb-10 leading-relaxed">
            {isBangla 
              ? 'আক্রান্ত পাতার ছবি তুলুন, আমাদের কৃত্রিম বুদ্ধিমত্তা রোগ শনাক্ত করে সমাধানের উপায় বলে দিবে।' 
              : 'Take a photo of the affected leaf, our AI will identify the disease and provide solutions.'}
          </p>

          <input type="file" accept="image/*" ref={aiFileInputRef} className="hidden" onChange={handleAiFileSelect} />

          {!scannedResult && !analyzing && (
            <div 
              onClick={() => aiFileInputRef.current?.click()} 
              className="w-full max-w-lg border-2 border-dashed border-gray-200 bg-white rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:border-green-300 hover:bg-green-50/30 transition-all duration-300 group"
            >
              <div className="p-4 bg-gray-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-green-600" size={32} />
              </div>
              <span className="font-bold text-gray-900 text-xl mb-1">{isBangla ? 'ছবি তুলুন' : 'Take a Photo'}</span>
              <p className="text-gray-400 text-sm">{isBangla ? 'অথবা গ্যালারি থেকে আপলোড করুন' : 'or upload from gallery'}</p>
            </div>
          )}

          {analyzing && (
            <div className="w-full max-w-lg h-64 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100 shadow-inner">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent animate-spin rounded-full"></div>
              <p className="text-green-700 font-bold mt-6 text-lg">{isBangla ? 'রোগ নির্ণয় করা হচ্ছে...' : 'Analyzing...'}</p>
            </div>
          )}

          {scannedResult && (
            <div className="w-full max-w-2xl bg-white border border-green-100 rounded-[2rem] p-8 text-left animate-fade-in shadow-xl">
              <div className="flex items-start justify-between mb-6 border-b border-gray-50 pb-6">
                <div>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{isBangla ? 'সনাক্তকৃত ফলাফল' : 'Result'}</span>
                  <h4 className="text-3xl font-black text-gray-900 mt-2">{scannedResult.disease}</h4>
                </div>
                <button onClick={() => setScannedResult(null)} className="text-gray-300 p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                <p className="text-sm font-bold text-green-700 uppercase mb-3 flex items-center gap-2"><CheckCircle size={16} />{isBangla ? 'প্রস্তাবিত সমাধান' : 'Solution'}</p>
                <p className="text-gray-800 font-medium text-base leading-relaxed">{scannedResult.solution}</p>
              </div>
            </div>
          )}

          {aiError && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
               <AlertTriangle size={20} />
               <p className="font-bold">{aiError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-2xl text-green-600"><Calculator size={32} /></div>
          {isBangla ? 'সার ও বীজ ক্যালকুলেটর' : 'Fertilizer & Seed Calculator'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">{isBangla ? 'ফসলের ধরণ' : 'Crop Type'}</label>
            <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-lg appearance-none cursor-pointer hover:border-green-400 transition-colors focus:outline-none focus:ring-4 focus:ring-green-100">
                <option value="Rice">{isBangla ? 'ধান' : 'Rice'}</option>
                <option value="Potato">{isBangla ? 'আলু' : 'Potato'}</option>
                <option value="Wheat">{isBangla ? 'গম' : 'Wheat'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">{isBangla ? 'বীজের ধরণ' : 'Seed Variety'}</label>
            <select value={seedVariety} onChange={(e) => setSeedVariety(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-lg appearance-none cursor-pointer hover:border-green-400 transition-colors focus:outline-none focus:ring-4 focus:ring-green-100">
                <option value="HYV">{isBangla ? 'উফশী (HYV)' : 'HYV'}</option>
                <option value="Hybrid">{isBangla ? 'হাইব্রিড (Hybrid)' : 'Hybrid'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">{isBangla ? 'জমির পরিমাণ' : 'Land Size'}</label>
            <input type="number" value={landSize} onChange={(e) => setLandSize(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-lg hover:border-green-400 transition-colors focus:outline-none focus:ring-4 focus:ring-green-100" placeholder="Ex: 10" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">{isBangla ? 'একক' : 'Unit'}</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-lg appearance-none hover:border-green-400 transition-colors focus:outline-none focus:ring-4 focus:ring-green-100">
                <option value="decimal">{isBangla ? 'শতাংশ' : 'Decimal'}</option>
                <option value="katha">{isBangla ? 'কাঠা' : 'Katha'}</option>
                <option value="bigha">{isBangla ? 'বিঘা' : 'Bigha'}</option>
            </select>
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full mt-10 h-16 text-xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-95">
          {isBangla ? 'হিসাব করুন' : 'Calculate'}
        </Button>
      </div>

      {calculatedResult && (
        <div className="animate-fade-in-up space-y-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-green-600 text-white p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
                <p className="text-green-100 text-sm font-bold uppercase mb-2 tracking-widest">{isBangla ? 'প্রয়োজনীয় বীজ' : 'Seed Required'}</p>
                <h3 className="text-5xl font-black">{calculatedResult.seed} kg</h3>
                <Sprout className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 rotate-12" />
             </div>
             <div className="bg-orange-600 text-white p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
                <p className="text-orange-100 text-sm font-bold uppercase mb-2 tracking-widest">{isBangla ? 'আনুমানিক খরচ' : 'Estimated Cost'}</p>
                <h3 className="text-5xl font-black">৳ {calculatedResult.cost}</h3>
                <CircleDollarSign className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 rotate-12" />
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600"><FlaskConical size={24} /></div>
                <h3 className="text-2xl font-bold text-gray-900">{isBangla ? 'সারের বিস্তারিত বিবরণ' : 'Detailed Fertilizer Breakdown'}</h3>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100">
                {[
                  { label: 'Urea', bn: 'ইউরিয়া', value: calculatedResult.urea, color: 'text-blue-600' },
                  { label: 'TSP', bn: 'টিএসপি', value: calculatedResult.tsp, color: 'text-orange-600' },
                  { label: 'MoP', bn: 'এমওপি', value: calculatedResult.mop, color: 'text-red-600' },
                  { label: 'Gypsum', bn: 'জিপসাম', value: calculatedResult.gypsum, color: 'text-purple-600' },
                  { label: 'Zinc', bn: 'জিংক', value: calculatedResult.zinc, color: 'text-teal-600' },
                ].map((item, idx) => (
                  <div key={idx} className="p-8 text-center hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">{isBangla ? item.bn : item.label}</p>
                    <p className={`text-3xl font-black ${item.color}`}>{item.value} kg</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center gap-4 bg-green-50 p-8 rounded-[2rem] border border-green-100 mb-8">
        <div>
           <h3 className="text-2xl font-black text-green-900 mb-1">{isBangla ? 'কৃষক ফোরাম' : 'Farmers Community'}</h3>
           <p className="text-green-700 font-medium opacity-80">{isBangla ? 'আপনার সমস্যা ও অভিজ্ঞতা শেয়ার করুন' : 'Share your problems and experiences'}</p>
        </div>
        <Button onClick={() => setShowPostModal(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-green-200">
           <MessageSquare size={20} className="mr-2" />{isBangla ? 'নতুন পোস্ট' : 'Create Post'}
        </Button>
      </div>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-600 text-xl">{post.user.charAt(0)}</div>
               <div><h4 className="font-bold text-gray-900 text-lg leading-none mb-1">{post.user}</h4><p className="text-xs text-gray-400 font-medium">{post.timeAgo}</p></div>
             </div>
             <p className="text-gray-700 text-lg mb-6 leading-relaxed whitespace-pre-wrap">{post.text}</p>
             <div className="flex items-center gap-8 pt-6 border-t border-gray-50">
               <button className={`flex items-center gap-2 text-sm font-bold transition-colors ${post.liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}>
                 <Heart size={20} fill={post.liked ? 'currentColor' : 'none'} />{post.likes}
               </button>
               <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                 <MessageSquare size={20} />{post.comments.length} {isBangla ? 'মন্তব্য' : 'Comments'}
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Layout matching Screenshot */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
               <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-xl"><Leaf className="text-green-600" size={32} /></div>
                 {isBangla ? 'স্মার্ট কৃষি' : 'Smart Agriculture'}
               </h1>
               <p className="text-gray-400 font-medium text-lg mt-1">{isBangla ? 'প্রযুক্তির ছোঁয়ায় ফলন বাড়ান' : 'Maximize yield with technology'}</p>
            </div>
            
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
              {[
                { id: 'overview', icon: <TrendingUp size={18}/>, label: isBangla ? 'ড্যাশবোর্ড' : 'Dashboard' }, 
                { id: 'calculator', icon: <Calculator size={18}/>, label: isBangla ? 'ক্যালকুলেটর' : 'Calculator' }, 
                { id: 'community', icon: <Users size={18}/>, label: isBangla ? 'ফোরাম' : 'Forum' }
              ].map(tab => (
                 <button 
                   key={tab.id} 
                   onClick={() => setActiveTab(tab.id as Tab)} 
                   className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                     activeTab === tab.id 
                       ? 'bg-green-600 text-white shadow-xl shadow-green-100 scale-105' 
                       : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                   }`}
                 >
                   {tab.icon} {tab.label}
                 </button>
              ))}
            </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'calculator' && renderCalculator()}
        {activeTab === 'community' && renderCommunity()}
      </div>

      {/* Crop Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setSelectedCrop(null)}>
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 shrink-0">
               <img src={getOptimizedImageUrl(selectedCrop.image, 800)} alt={selectedCrop.nameEn} className="w-full h-full object-cover" />
               <button onClick={() => setSelectedCrop(null)} className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-gray-900 transition-all"><X size={24}/></button>
            </div>
            <div className="p-8 overflow-y-auto">
               <h2 className="text-3xl font-black text-gray-900 mb-6">{isBangla ? selectedCrop.nameBn : selectedCrop.nameEn}</h2>
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">{isBangla ? 'চাষের সময়' : 'Sowing Time'}</p>
                    <p className="font-bold text-gray-800 text-sm">{isBangla ? selectedCrop.timeBn : selectedCrop.timeEn}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">{isBangla ? 'মাটির ধরণ' : 'Soil Type'}</p>
                    <p className="font-bold text-gray-800 text-sm">{isBangla ? selectedCrop.soilBn : selectedCrop.soilEn}</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><FlaskConical size={20} className="text-green-600"/>{isBangla ? 'সারের মাত্রা' : 'Fertilizer Dose'}</h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{isBangla ? selectedCrop.fertilizerBn : selectedCrop.fertilizerEn}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><Droplets size={20} className="text-blue-600"/>{isBangla ? 'যত্ন ও সেচ' : 'Care & Irrigation'}</h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{isBangla ? selectedCrop.careBn : selectedCrop.careEn}</p>
                  </div>
               </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center shrink-0">
               <Button onClick={() => setSelectedCrop(null)} className="px-10 rounded-2xl bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100">{isBangla ? 'বন্ধ করুন' : 'Close'}</Button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <h3 className="font-black text-2xl text-gray-900">{isBangla ? 'নতুন পোস্ট' : 'Create Post'}</h3>
              <button onClick={() => setShowPostModal(false)} className="text-gray-300 hover:text-gray-600 transition-colors"><X size={28}/></button>
            </div>
            <div className="p-8">
              <textarea 
                placeholder={isBangla ? 'আপনার প্রশ্ন বা অভিজ্ঞতা বিস্তারিত লিখুন...' : 'Write your question or experience here...'} 
                className="w-full h-48 p-6 border border-gray-100 rounded-[1.5rem] outline-none resize-none mb-6 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-100 transition-all text-lg"
              ></textarea>
              <Button onClick={() => setShowPostModal(false)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-200 text-lg">
                {isBangla ? 'পোস্ট করুন' : 'Post Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
