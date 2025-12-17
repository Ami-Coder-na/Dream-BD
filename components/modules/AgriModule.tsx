
import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudRain, Sun, Sprout, TrendingUp, AlertTriangle, 
  ScanLine, Calculator, BookOpen, Users, Video, 
  Calendar, Droplets, Wind, ChevronRight, Upload, X, CheckCircle, MapPin,
  Leaf, Info, Thermometer, Search, Clock, Loader2, ChevronDown, ChevronUp,
  CircleDollarSign, CalendarClock, Filter, BarChart3, MessageSquare, Heart, Share2, Send, Image as ImageIcon
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

type Tab = 'overview' | 'encyclopedia' | 'calculator' | 'community';

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
    seasonBn: 'শীত',
    seasonEn: 'Winter',
    durationBn: '৮৫-৯০ দিন',
    durationEn: '85-90 days',
    waterReq: 'Medium',
    difficulty: 'Medium',
    soilBn: 'বেলে দোআঁশ মাটি',
    soilEn: 'Sandy Loam soil',
    timeBn: 'নভেম্বর - ডিসেম্বর',
    timeEn: 'November - December',
    fertilizerBn: 'গোবর সার: ১ টন, ইউরিয়া: ৩৫ কেজি (প্রতি একর)',
    fertilizerEn: 'Cow dung: 1 ton, Urea: 35 kg (Per Acre)',
    careBn: 'মাটি শুকিয়ে গেলে সেচ দিন, তবে পানি জমতে দেবেন না।',
    careEn: 'Irrigate when soil is dry, but avoid waterlogging.',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655' 
  },
  {
    id: 4,
    nameBn: 'গম (Wheat)',
    nameEn: 'Wheat',
    scientificName: 'Triticum',
    seasonBn: 'শীত',
    seasonEn: 'Winter',
    durationBn: '১১০-১২০ দিন',
    durationEn: '110-120 days',
    waterReq: 'Low',
    difficulty: 'Easy',
    soilBn: 'উঁচু ও মাঝারি দোআঁশ মাটি',
    soilEn: 'High and Medium Loam soil',
    timeBn: 'নভেম্বর মাসের প্রথমার্ধ',
    timeEn: 'First half of November',
    fertilizerBn: 'জিপসাম: ১৫ কেজি, বোরন: ১ কেজি (প্রতি একর)',
    fertilizerEn: 'Gypsum: 15 kg, Boron: 1 kg (Per Acre)',
    careBn: 'শীষ বের হওয়ার সময় সেচ দেওয়া জরুরি।',
    careEn: 'Irrigation is crucial during heading stage.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'
  }
];

interface CalculationResult {
  urea: number;
  tsp: number;
  mop: number;
  gypsum: number;
  seed: number;
  cost: number;
  schedule: {
    stageBn: string;
    stageEn: string;
    detailBn: string;
    detailEn: string;
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

  // Other states
  const [landSize, setLandSize] = useState<string>('');
  const [unit, setUnit] = useState('decimal');
  const [cropType, setCropType] = useState('Rice');
  const [seedVariety, setSeedVariety] = useState('HYV');
  const [calculatedResult, setCalculatedResult] = useState<CalculationResult | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [visibleCrops, setVisibleCrops] = useState(4);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cropFilter, setCropFilter] = useState('All');
  const [cropSearch, setCropSearch] = useState('');
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [expertForm, setExpertForm] = useState({ name: '', contact: '', address: '', message: '' });
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const forumFileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<ForumPost[]>([
    { id: 1, user: 'Rahim Mia', text: isBangla ? 'আলু গাছের পাতা হলুদ হয়ে যাচ্ছে, কি করব?' : 'Potato leaves are turning yellow, what to do?', likes: 15, liked: false, comments: [{ id: 101, user: 'Karim', text: isBangla ? 'ছত্রাকনাশক স্প্রে করুন।' : 'Spray fungicide.' }], showComments: false, timeAgo: '2h ago' },
    { id: 2, user: 'Kamal Hossain', text: isBangla ? 'বোরো ধানের জন্য সেরা সার কোনটি?' : 'Which fertilizer is best for Boro rice?', likes: 24, liked: true, comments: [], showComments: false, timeAgo: '5h ago' },
  ]);

  // --- AI SCAN LOGIC ---

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
            ? "দুঃখিত! এটি কোনো কৃষি বা ফসলের ছবি নয়। অনুগ্রহ করে আপনার ফসলের আক্রান্ত পাতার ছবি দিন।" 
            : "Sorry! This is not an agricultural image. Please upload a photo of an affected plant leaf.");
        } else {
          setScannedResult(result);
        }
      } catch (err) {
        setAiError(isBangla 
          ? "বিশ্লেষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" 
          : "Error analyzing the image. Please try again.");
      } finally {
        setAnalyzing(false);
        if (aiFileInputRef.current) aiFileInputRef.current.value = '';
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
    const ureaRate = 1.0;
    const tspRate = 0.5;
    const mopRate = 0.6;
    const gypsumRate = 0.4;
    const seedRate = seedVariety === 'Hybrid' ? 0.15 : 0.25; 
    const urea = parseFloat((sizeInDecimal * ureaRate).toFixed(2));
    const tsp = parseFloat((sizeInDecimal * tspRate).toFixed(2));
    const mop = parseFloat((sizeInDecimal * mopRate).toFixed(2));
    const gypsum = parseFloat((sizeInDecimal * gypsumRate).toFixed(2));
    const seed = parseFloat((sizeInDecimal * seedRate).toFixed(2));
    const totalCost = Math.round((urea * 25) + (tsp * 22) + (mop * 15) + (gypsum * 10) + (seed * 300));
    setCalculatedResult({
      urea, tsp, mop, gypsum, seed, cost: totalCost,
      schedule: [
        { stageBn: 'জমি তৈরি (শেষ চাষে)', stageEn: 'Land Preparation (Final Ploughing)', detailBn: 'টিএসপি, এমওপি এবং জিপসাম সারের সম্পূর্ণ অংশ প্রয়োগ করুন।', detailEn: 'Apply full dose of TSP, MOP, and Gypsum.' },
        { stageBn: 'চারা রোপণের ১৫-২০ দিন পর', stageEn: '15-20 Days After Planting', detailBn: 'ইউরিয়া সারের প্রথম কিস্তি প্রয়োগ করুন। আগাছা পরিষ্কার করে নিন।', detailEn: 'Apply 1st installment of Urea. Clean weeds beforehand.' },
        { stageBn: 'চারা রোপণের ৪০-৪৫ দিন পর', stageEn: '40-45 Days After Planting', detailBn: 'ইউরিয়া সারের দ্বিতীয় কিস্তি প্রয়োগ করুন (কাইচ থোড় আসার আগে)।', detailEn: 'Apply 2nd installment of Urea (Before panicle initiation).' },
        { stageBn: 'ফুল আসার সময়', stageEn: 'Flowering Stage', detailBn: 'প্রয়োজনে সামান্য পটাশ সার ও ছত্রাকনাশক স্প্রে করুন।', detailEn: 'Spray Potash and fungicide if needed.' }
      ]
    });
    setShowFullSchedule(false);
  };

  const handleLoadMoreCrops = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCrops(prev => prev + 4);
      setLoadingMore(false);
    }, 800);
  };

  const handleExpertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isBangla ? 'আপনার অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!' : 'Your request has been submitted successfully!');
    setExpertForm({ name: '', contact: '', address: '', message: '' });
    setShowExpertModal(false);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostImage) return;
    const newPost: ForumPost = {
      id: Date.now(),
      user: user ? user.name : 'User',
      text: newPostText,
      image: newPostImage || undefined,
      likes: 0,
      liked: false,
      comments: [],
      showComments: false,
      timeAgo: isBangla ? 'এইমাত্র' : 'Just now'
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostImage(null);
    setShowPostModal(false);
  };

  const handleAuthAction = (action: () => void) => {
      if (!user) {
          if (onLogin) onLogin();
          return;
      }
      action();
  };

  const handleForumImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post));
  };

  const toggleComments = (postId: number) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, showComments: !post.showComments } : post));
  };

  const addComment = (postId: number, text: string) => {
    if (!text.trim()) return;
    if (!user) { if (onLogin) onLogin(); return; }
    setPosts(posts.map(post => post.id === postId ? { ...post, comments: [...post.comments, { id: Date.now(), user: user.name, text }] } : post));
  };

  const filteredCrops = CROPS_DB.filter(crop => {
    const matchesSearch = (isBangla ? crop.nameBn : crop.nameEn).toLowerCase().includes(cropSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (cropFilter === 'All') return true;
    if (cropFilter === 'Winter') return crop.seasonEn === 'Winter';
    if (cropFilter === 'Summer') return crop.seasonEn === 'Summer';
    if (cropFilter === 'Easy') return crop.difficulty === 'Easy';
    return true;
  });

  const getWaterReqColor = (req: string) => {
    if (req === 'High') return 'text-blue-700 bg-blue-50 border-blue-100';
    if (req === 'Medium') return 'text-teal-700 bg-teal-50 border-teal-100';
    return 'text-amber-700 bg-amber-50 border-amber-100';
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy' || diff === 'Low') return 'bg-green-100 text-green-800 border-green-200';
    if (diff === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Weather Widget */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                <MapPin size={14} className="text-white" />
                <span className="text-xs font-semibold tracking-wide">Rangpur, BD</span>
              </div>
              <h2 className="text-5xl font-bold mb-1">28°C</h2>
              <p className="text-blue-100 font-medium text-lg">{isBangla ? 'আংশিক মেঘলা' : 'Partly Cloudy'}</p>
            </div>
            <Sun size={64} className="text-yellow-300 drop-shadow-lg" />
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-4">
            <div className="text-center"><p className="text-xs opacity-70">{isBangla ? 'আর্দ্রতা' : 'Humidity'}</p><p className="font-bold">75%</p></div>
            <div className="text-center"><p className="text-xs opacity-70">{isBangla ? 'বাতাস' : 'Wind'}</p><p className="font-bold">12 km/h</p></div>
            <div className="text-center"><p className="text-xs opacity-70">{isBangla ? 'বৃষ্টি' : 'Rain'}</p><p className="font-bold">60%</p></div>
          </div>
        </div>
      </div>

      {/* Seasonal Crops Section */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sprout className="text-brand-600" size={24} />
            {isBangla ? 'এই মৌসুমের ফসল' : 'Seasonal Crops'}
          </h3>
          <input 
            type="text" 
            value={cropSearch}
            onChange={(e) => setCropSearch(e.target.value)}
            placeholder={isBangla ? 'ফসল খুঁজুন...' : 'Search crops...'}
            className="pl-4 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm text-sm"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCrops.slice(0, visibleCrops).map(crop => (
            <div key={crop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <img src={getOptimizedImageUrl(crop.image, 400)} alt={crop.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-1">{isBangla ? crop.nameBn : crop.nameEn}</h4>
                <p className="text-xs text-gray-500 italic mb-4">{crop.scientificName}</p>
                <div className="flex gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${getDifficultyColor(crop.difficulty)}`}>{crop.difficulty}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${getWaterReqColor(crop.waterReq)}`}>Water: {crop.waterReq}</span>
                </div>
                <Button onClick={() => setSelectedCrop(crop)} variant="outline" className="mt-auto w-full rounded-xl text-xs font-bold border-gray-200 hover:border-brand-600 hover:text-brand-600">
                  {isBangla ? 'বিস্তারিত দেখুন' : 'View Details'} 
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Disease Detection */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-100 relative overflow-hidden group mt-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-brand-50 text-brand-600 rounded-full mb-3">
            <ScanLine size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'রোগ বালাই ও সমাধান (AI)' : 'AI Disease Detection'}</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {isBangla ? 'আক্রান্ত পাতার ছবি তুলুন, আমাদের কৃত্রিম বুদ্ধিমত্তা রোগ শনাক্ত করে সমাধানের উপায় বলে দিবে।' : 'Take a photo of the affected leaf. Our AI will identify the disease and provide a solution.'}
          </p>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          ref={aiFileInputRef} 
          className="hidden" 
          onChange={handleAiFileSelect} 
        />

        {!scannedResult && !analyzing && (
          <div 
            onClick={() => aiFileInputRef.current?.click()} 
            className="border-2 border-dashed border-brand-200 bg-brand-50/50 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-50 hover:border-brand-400 transition-all duration-300 group/scan"
          >
            <div className="p-4 bg-white rounded-full shadow-lg mb-3 group-hover/scan:scale-110 transition-transform">
              <Upload className="text-brand-600" size={24} />
            </div>
            <span className="font-bold text-brand-800 text-base mb-1">{isBangla ? 'ছবি তুলুন' : 'Take a Photo'}</span>
            <span className="text-xs text-gray-500">{isBangla ? 'অথবা গ্যালারি থেকে আপলোড করুন' : 'Or upload from gallery'}</span>
          </div>
        )}

        {analyzing && (
          <div className="h-48 flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-brand-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-brand-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              <ScanLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-600 animate-pulse" size={20} />
            </div>
            <p className="text-brand-700 font-bold mt-4 animate-pulse text-sm">{isBangla ? 'রোগ নির্ণয় করা হচ্ছে...' : 'Analyzing Disease...'}</p>
          </div>
        )}

        {aiError && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center animate-fade-in">
            <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
            <p className="text-red-700 font-medium mb-4">{aiError}</p>
            <Button variant="outline" onClick={() => setAiError(null)}>{isBangla ? 'আবার চেষ্টা করুন' : 'Try Again'}</Button>
          </div>
        )}

        {scannedResult && (
          <div className="bg-white border border-brand-100 rounded-2xl p-6 text-left animate-fade-in-up shadow-lg">
            <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{isBangla ? 'সনাক্তকৃত ফলাফল' : 'Detection Result'}</span>
                <h4 className="text-2xl font-bold text-gray-900 mt-1 flex items-center gap-2">{scannedResult.disease}</h4>
                <div className="mt-1 flex items-center gap-2">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${scannedResult.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {isBangla ? 'ঝুঁকি: ' : 'Severity: '} {scannedResult.severity}
                   </span>
                </div>
              </div>
              <button onClick={() => setScannedResult(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-xs font-bold text-green-700 uppercase mb-2 flex items-center gap-1"><CheckCircle size={12} />{isBangla ? 'প্রস্তাবিত সমাধান' : 'Recommended Solution'}</p>
                <p className="text-gray-800 leading-relaxed font-medium text-sm">{scannedResult.solution}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => setScannedResult(null)} variant="outline" className="flex-1">{isBangla ? 'নতুন ছবি' : 'New Scan'}</Button>
              <Button onClick={() => handleAuthAction(() => setShowExpertModal(true))} className="flex-1 bg-brand-600 text-white">{isBangla ? 'বিশেষজ্ঞের পরামর্শ' : 'Ask Expert'}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-brand-100 rounded-lg text-brand-600"><Calculator size={24} /></div>
          {isBangla ? 'সার ও বীজ ক্যালকুলেটর' : 'Fertilizer & Seed Calculator'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'জমির পরিমাণ' : 'Land Size'}</label>
            <input type="number" value={landSize} onChange={(e) => setLandSize(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-lg" placeholder="Ex: 10" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'একক' : 'Unit'}</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-lg appearance-none">
                <option value="decimal">{isBangla ? 'শতাংশ' : 'Decimal'}</option>
                <option value="katha">{isBangla ? 'কাঠা' : 'Katha'}</option>
                <option value="bigha">{isBangla ? 'বিঘা' : 'Bigha'}</option>
            </select>
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full mt-8 h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white">
          {isBangla ? 'হিসাব করুন' : 'Calculate'}
        </Button>
      </div>
      {calculatedResult && (
        <div className="animate-fade-in-up space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg">
                <p className="text-green-100 text-sm font-medium mb-1">{isBangla ? 'প্রয়োজনীয় বীজ' : 'Seed Required'}</p>
                <h3 className="text-3xl font-bold">{calculatedResult.seed} kg</h3>
             </div>
             <div className="bg-orange-600 text-white p-6 rounded-2xl shadow-lg">
                <p className="text-orange-100 text-sm font-medium mb-1">{isBangla ? 'আনুমানিক খরচ' : 'Estimated Cost'}</p>
                <h3 className="text-3xl font-bold">৳ {calculatedResult.cost}</h3>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center gap-4 bg-brand-50 p-6 rounded-2xl border border-brand-100">
        <div>
           <h3 className="text-xl font-bold text-brand-900">{isBangla ? 'কৃষক ফোরাম' : 'Farmers Community'}</h3>
           <p className="text-brand-700 text-sm">{isBangla ? 'আপনার সমস্যা ও অভিজ্ঞতা শেয়ার করুন' : 'Share your problems and experiences'}</p>
        </div>
        <Button onClick={() => handleAuthAction(() => setShowPostModal(true))} className="bg-brand-600 text-white">
           <MessageSquare size={18} className="mr-2" />{isBangla ? 'নতুন পোস্ট' : 'Create Post'}
        </Button>
      </div>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">{post.user.charAt(0)}</div>
                 <div><h4 className="font-bold text-gray-900">{post.user}</h4><p className="text-xs text-gray-500">{post.timeAgo}</p></div>
               </div>
             </div>
             <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.text}</p>
             <div className="flex items-center gap-6 pt-3 border-t border-gray-50">
               <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 text-sm font-medium ${post.liked ? 'text-red-500' : 'text-gray-500'}`}>
                 <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />{post.likes}
               </button>
               <button onClick={() => toggleComments(post.id)} className="flex items-center gap-2 text-sm font-medium text-gray-500">
                 <MessageSquare size={18} />{post.comments.length}
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-50/30 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><Leaf className="text-green-600" />{isBangla ? 'স্মার্ট কৃষি' : 'Smart Agriculture'}</h1>
               <p className="text-gray-500 text-sm mt-1">{isBangla ? 'প্রযুক্তির ছোঁয়ায় ফলন বাড়ান' : 'Maximize yield with technology'}</p>
            </div>
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              {[{ id: 'overview', icon: <TrendingUp size={16}/>, label: isBangla ? 'ড্যাশবোর্ড' : 'Dashboard' }, { id: 'calculator', icon: <Calculator size={16}/>, label: isBangla ? 'ক্যালকুলেটর' : 'Calculator' }, { id: 'community', icon: <Users size={16}/>, label: isBangla ? 'ফোরাম' : 'Forum' }].map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                   {tab.icon} {tab.label}
                 </button>
              ))}
            </div>
        </div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'calculator' && renderCalculator()}
        {activeTab === 'community' && renderCommunity()}
        {activeTab === 'encyclopedia' && renderOverview()} 
      </div>

      {showExpertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowExpertModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#22c55e] p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-xl">{isBangla ? 'বিশেষজ্ঞ পরামর্শ' : 'Expert Consultation'}</h3>
              <button onClick={() => setShowExpertModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleExpertSubmit} className="p-6 space-y-5">
              <input required className="w-full bg-gray-50 border p-3 rounded-lg" placeholder={isBangla ? 'আপনার নাম' : 'Your Name'} onChange={e => setExpertForm({...expertForm, name: e.target.value})} />
              <input required className="w-full bg-gray-50 border p-3 rounded-lg" placeholder={isBangla ? 'মোবাইল নম্বর' : 'Mobile Number'} onChange={e => setExpertForm({...expertForm, contact: e.target.value})} />
              <textarea required rows={4} className="w-full bg-gray-50 border p-3 rounded-lg" placeholder={isBangla ? 'সমস্যা / বার্তা' : 'Problem / Message'} onChange={e => setExpertForm({...expertForm, message: e.target.value})}></textarea>
              <Button type="submit" className="w-full bg-[#22c55e] text-white font-bold py-3 rounded-lg">
                {isBangla ? 'জমা দিন' : 'Submit Request'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-xl text-gray-900">{isBangla ? 'নতুন পোস্ট' : 'Create Post'}</h3>
              <button onClick={() => setShowPostModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleCreatePost} className="p-6">
              <textarea placeholder={isBangla ? 'আপনার প্রশ্ন বা অভিজ্ঞতা...' : 'Your question or experience...'} className="w-full h-40 p-4 border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none mb-4 bg-gray-50" value={newPostText} onChange={(e) => setNewPostText(e.target.value)}></textarea>
              <Button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg">
                {isBangla ? 'পোস্ট করুন' : 'Post'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
