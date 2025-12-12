
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

interface Props {
  isBangla: boolean;
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

// --- Extended Mock Data ---

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
    image: 'https://images.unsplash.com/photo-1536630596259-26e1a2c3a52c'
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
    image: 'https://images.unsplash.com/photo-1599940784857-4b726df23146'
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
  },
  {
    id: 5,
    nameBn: 'সরিষা (Mustard)',
    nameEn: 'Mustard',
    scientificName: 'Brassica',
    seasonBn: 'শীত',
    seasonEn: 'Winter',
    durationBn: '৭০-৮০ দিন',
    durationEn: '70-80 days',
    waterReq: 'Low',
    difficulty: 'Easy',
    soilBn: 'দোআঁশ ও বেলে মাটি',
    soilEn: 'Loam and Sandy soil',
    timeBn: 'অক্টোবর - নভেম্বর',
    timeEn: 'October - November',
    fertilizerBn: 'ইউরিয়া ও টিএসপি পরিমিত পরিমাণে',
    fertilizerEn: 'Urea and TSP in moderate amounts',
    careBn: 'ফুল আসার আগে একবার সেচ দিন।',
    careEn: 'Irrigate once before flowering.',
    image: 'https://images.unsplash.com/photo-1505235682978-95f52956a8d1'
  },
  {
    id: 6,
    nameBn: 'ভুট্টা (Maize)',
    nameEn: 'Maize',
    scientificName: 'Zea mays',
    seasonBn: 'রবি/খরিফ',
    seasonEn: 'Rabi/Kharif',
    durationBn: '১৩৫-১৪৫ দিন',
    durationEn: '135-145 days',
    waterReq: 'Medium',
    difficulty: 'Easy',
    soilBn: 'উর্বর দোআঁশ মাটি',
    soilEn: 'Fertile Loam soil',
    timeBn: 'সারা বছর চাষ করা যায়',
    timeEn: 'Can be cultivated year-round',
    fertilizerBn: 'জিংক ও বোরন সার ফলন বাড়ায়',
    fertilizerEn: 'Zinc and Boron increase yield',
    careBn: 'অতিরিক্ত পানি নিষ্কাশনের ব্যবস্থা রাখুন।',
    careEn: 'Ensure proper drainage system.',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076'
  },
  {
    id: 7,
    nameBn: 'টমেটো (Tomato)',
    nameEn: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    seasonBn: 'শীত',
    seasonEn: 'Winter',
    durationBn: '৯০-১০০ দিন',
    durationEn: '90-100 days',
    waterReq: 'Medium',
    difficulty: 'Medium',
    soilBn: 'বেলে দোআঁশ',
    soilEn: 'Sandy Loam',
    timeBn: 'সেপ্টেম্বর - অক্টোবর',
    timeEn: 'September - October',
    fertilizerBn: 'কম্পোস্ট সার বেশি ব্যবহার করুন',
    fertilizerEn: 'Use more compost fertilizer',
    careBn: 'গাছে খুঁটি দিন এবং পোকা দমন করুন।',
    careEn: 'Stake the plants and control pests.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
  },
  {
    id: 8,
    nameBn: 'পেঁয়াজ (Onion)',
    nameEn: 'Onion',
    scientificName: 'Allium cepa',
    seasonBn: 'শীত',
    seasonEn: 'Winter',
    durationBn: '১০০-১২০ দিন',
    durationEn: '100-120 days',
    waterReq: 'Low',
    difficulty: 'Medium',
    soilBn: 'উর্বর ও ঝুরঝুরে মাটি',
    soilEn: 'Fertile and loose soil',
    timeBn: 'ডিসেম্বর - জানুয়ারি',
    timeEn: 'December - January',
    fertilizerBn: 'পটাশ সার পেঁয়াজের জন্য ভালো',
    fertilizerEn: 'Potash is good for onions',
    careBn: 'আগাছা মুক্ত রাখুন।',
    careEn: 'Keep weed-free.',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb'
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

export const AgriModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedCrop, setSelectedCrop] = useState<typeof CROPS_DB[0] | null>(null);
  
  // State for AI Detection
  const [analyzing, setAnalyzing] = useState(false);
  const [scannedResult, setScannedResult] = useState<null | { disease: string; severity: string; solution: string }>(null);
  
  // State for Calculator
  const [landSize, setLandSize] = useState<string>('');
  const [unit, setUnit] = useState('decimal'); // decimal, katha, bigha
  const [cropType, setCropType] = useState('Rice');
  const [seedVariety, setSeedVariety] = useState('HYV');
  const [calculatedResult, setCalculatedResult] = useState<CalculationResult | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // State for Crop List Filtering & Pagination
  const [visibleCrops, setVisibleCrops] = useState(4);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cropFilter, setCropFilter] = useState('All');
  const [cropSearch, setCropSearch] = useState('');

  // --- Expert & Forum States ---
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  
  const [expertForm, setExpertForm] = useState({
    name: '',
    contact: '',
    address: '',
    message: ''
  });

  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Posts State
  const [posts, setPosts] = useState<ForumPost[]>([
    { 
      id: 1, 
      user: 'Rahim Mia', 
      text: isBangla ? 'আলু গাছের পাতা হলুদ হয়ে যাচ্ছে, কি করব?' : 'Potato leaves are turning yellow, what to do?', 
      likes: 15,
      liked: false,
      comments: [
        { id: 101, user: 'Karim', text: isBangla ? 'ছত্রাকনাশক স্প্রে করুন।' : 'Spray fungicide.' }
      ],
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

  // --- Handlers ---

  const handleScan = () => {
    setAnalyzing(true);
    setScannedResult(null);
    // Simulate AI Delay
    setTimeout(() => {
      setAnalyzing(false);
      setScannedResult({
        disease: isBangla ? 'ব্লাস্ট রোগ (Blast Disease)' : 'Blast Disease',
        severity: 'High',
        solution: isBangla 
          ? 'জমিতে ট্রাইসাইক্লাজোল গ্রুপের ছত্রাকনাশক (যেমন: ট্রুপার) স্প্রে করুন। ইউরিয়া সার ব্যবহার বন্ধ রাখুন এবং জমি শুকিয়ে ফেলুন।' 
          : 'Spray Tricyclazole group fungicide (e.g., Trooper). Stop using Urea fertilizer temporarily and drain the field.'
      });
    }, 2000);
  };

  const handleCalculate = () => {
    const size = parseFloat(landSize);
    if (!size) return;

    // Conversion to Decimal as base unit
    let sizeInDecimal = size;
    if (unit === 'katha') sizeInDecimal = size * 1.65;
    if (unit === 'bigha') sizeInDecimal = size * 33;

    // Rates per Decimal (Mock Data)
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
      urea,
      tsp,
      mop,
      gypsum,
      seed,
      cost: totalCost,
      schedule: [
        { 
          stageBn: 'জমি তৈরি (শেষ চাষে)', 
          stageEn: 'Land Preparation (Final Ploughing)', 
          detailBn: 'টিএসপি, এমওপি এবং জিপসাম সারের সম্পূর্ণ অংশ প্রয়োগ করুন।',
          detailEn: 'Apply full dose of TSP, MOP, and Gypsum.' 
        },
        { 
          stageBn: 'চারা রোপণের ১৫-২০ দিন পর', 
          stageEn: '15-20 Days After Planting', 
          detailBn: 'ইউরিয়া সারের প্রথম কিস্তি প্রয়োগ করুন। আগাছা পরিষ্কার করে নিন।',
          detailEn: 'Apply 1st installment of Urea. Clean weeds beforehand.' 
        },
        { 
          stageBn: 'চারা রোপণের ৪০-৪৫ দিন পর', 
          stageEn: '40-45 Days After Planting', 
          detailBn: 'ইউরিয়া সারের দ্বিতীয় কিস্তি প্রয়োগ করুন (কাইচ থোড় আসার আগে)।',
          detailEn: 'Apply 2nd installment of Urea (Before panicle initiation).' 
        },
        { 
          stageBn: 'ফুল আসার সময়', 
          stageEn: 'Flowering Stage', 
          detailBn: 'প্রয়োজনে সামান্য পটাশ সার ও ছত্রাকনাশক স্প্রে করুন।',
          detailEn: 'Spray Potash and fungicide if needed.' 
        }
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

  // Expert Form Handlers
  const handleExpertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API submission
    alert(isBangla ? 'আপনার অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!' : 'Your request has been submitted successfully!');
    setExpertForm({ name: '', contact: '', address: '', message: '' });
    setShowExpertModal(false);
  };

  // Forum Handlers
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostImage) return;

    const newPost: ForumPost = {
      id: Date.now(),
      user: isBangla ? 'আমি' : 'Me',
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };

  const addComment = (postId: number, text: string) => {
    if (!text.trim()) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now(), user: isBangla ? 'আমি' : 'Me', text }]
        };
      }
      return post;
    }));
  };

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCrops(4);
  }, [cropFilter, cropSearch]);

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

  // --- Render Sections ---

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Weather Widget (Hyper-Local) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                <MapPin size={14} className="text-white" />
                <span className="text-xs font-semibold tracking-wide">Pirganj, Rangpur</span>
              </div>
              <h2 className="text-5xl font-bold mb-1">28°C</h2>
              <p className="text-blue-100 font-medium text-lg">{isBangla ? 'আংশিক মেঘলা' : 'Partly Cloudy'}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
               <Sun size={64} className="text-yellow-300 drop-shadow-lg" />
               <span className="text-xs text-blue-100 opacity-80">H: 31° L: 24°</span>
            </div>
          </div>
          
          <div className="mb-6 bg-yellow-500/20 backdrop-blur-md border border-yellow-300/30 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className="text-yellow-300 shrink-0 animate-pulse" />
            <p className="text-sm font-medium text-yellow-50">
              {isBangla 
                ? 'সতর্কতা: আগামী ২৪ ঘণ্টায় ভারী বৃষ্টিপাতের সম্ভাবনা আছে।' 
                : 'Alert: Heavy rain expected in the next 24 hours.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-4">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Droplets size={20} className="mb-1 text-blue-200"/>
              <span className="text-xs opacity-70">{isBangla ? 'আর্দ্রতা' : 'Humidity'}</span>
              <span className="font-bold">75%</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Wind size={20} className="mb-1 text-blue-200"/>
              <span className="text-xs opacity-70">{isBangla ? 'বাতাস' : 'Wind'}</span>
              <span className="font-bold">12 km/h</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <CloudRain size={20} className="mb-1 text-blue-200"/>
              <span className="text-xs opacity-70">{isBangla ? 'বৃষ্টি' : 'Rain'}</span>
              <span className="font-bold">60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Crops Section */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sprout className="text-brand-600" size={24} />
              {isBangla ? 'এই মৌসুমের ফসল' : 'Seasonal Crops'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {isBangla ? 'চাষাবাদের জন্য উপযুক্ত ফসলসমূহ' : 'Recommended crops for current season'}
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              value={cropSearch}
              onChange={(e) => setCropSearch(e.target.value)}
              placeholder={isBangla ? 'ফসল খুঁজুন...' : 'Search crops...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
          {[
            { id: 'All', labelBn: 'সব', labelEn: 'All' },
            { id: 'Winter', labelBn: 'শীতকালীন', labelEn: 'Winter' },
            { id: 'Summer', labelBn: 'গ্রীষ্মকালীন', labelEn: 'Summer' },
            { id: 'Easy', labelBn: 'সহজ চাষ', labelEn: 'Easy Care' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setCropFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                cropFilter === f.id 
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isBangla ? f.labelBn : f.labelEn}
            </button>
          ))}
        </div>
        
        {filteredCrops.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCrops.slice(0, visibleCrops).map(crop => (
                <div 
                  key={crop.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-brand-200 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getOptimizedImageUrl(crop.image, 400)} 
                      alt={crop.nameEn} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                       <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1">
                         <Calendar size={10} /> {isBangla ? crop.seasonBn : crop.seasonEn}
                       </span>
                    </div>
                    <div className="absolute top-3 right-3">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold border backdrop-blur-sm shadow-sm ${getDifficultyColor(crop.difficulty)}`}>
                          {isBangla ? (crop.difficulty === 'Easy' ? 'সহজ' : crop.difficulty === 'Medium' ? 'মাঝারি' : 'কঠিন') : crop.difficulty}
                       </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 text-lg line-clamp-1">{isBangla ? crop.nameBn : crop.nameEn}</h4>
                      <p className="text-xs text-gray-500 italic">{crop.scientificName}</p>
                    </div>
                    
                    {/* Informative Grid */}
                    <div className="space-y-3 mb-5 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                       <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                             <CalendarClock size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-bold text-gray-400">{isBangla ? 'বপন সময়' : 'Sowing Time'}</p>
                             <p className="text-xs font-semibold text-gray-800 line-clamp-1">{isBangla ? crop.timeBn : crop.timeEn}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                             <MapPin size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-bold text-gray-400">{isBangla ? 'উপযুক্ত মাটি' : 'Soil Type'}</p>
                             <p className="text-xs font-semibold text-gray-800 line-clamp-1">{isBangla ? crop.soilBn : crop.soilEn}</p>
                          </div>
                       </div>
                    </div>

                    {/* Footer Badges */}
                    <div className="flex gap-2 mb-4">
                       <div className={`flex-1 px-2 py-1.5 rounded text-[10px] font-bold border flex items-center justify-center gap-1 ${getWaterReqColor(crop.waterReq)}`}>
                          <Droplets size={12} /> {isBangla ? 'সেচ:' : 'Water:'} {crop.waterReq}
                       </div>
                       <div className="flex-1 px-2 py-1.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center gap-1">
                          <Clock size={12} /> {isBangla ? crop.durationBn : crop.durationEn.split(' ')[0] + 'd'}
                       </div>
                    </div>

                    <Button 
                      onClick={() => setSelectedCrop(crop)}
                      variant="outline"
                      className="mt-auto w-full rounded-xl text-xs font-bold border-gray-200 hover:border-brand-600 hover:text-brand-600 group/btn h-10 hover:bg-brand-50"
                    >
                      {isBangla ? 'বিস্তারিত গাইড দেখুন' : 'View Detailed Guide'} 
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCrops < filteredCrops.length && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={handleLoadMoreCrops} 
                  variant="secondary" 
                  className="rounded-full px-8 shadow-sm border border-gray-200 bg-white hover:bg-gray-50"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      {isBangla ? 'লোড হচ্ছে...' : 'Loading...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ChevronDown size={16} />
                      {isBangla ? 'আরও দেখুন' : 'Load More Crops'}
                    </div>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Sprout size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন ফসল পাওয়া যায়নি' : 'No crops found'}</h3>
            <p className="text-gray-500 text-sm mt-1">{isBangla ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন করুন' : 'Please adjust your filters'}</p>
          </div>
        )}
      </div>

      {/* AI Disease Detection (Secondary) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-100 relative overflow-hidden group mt-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-brand-50 text-brand-600 rounded-full mb-3 shadow-inner">
            <ScanLine size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isBangla ? 'রোগ বালাই ও সমাধান (AI)' : 'AI Disease Detection'}
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {isBangla 
              ? 'আক্রান্ত পাতার ছবি তুলুন, আমাদের কৃত্রিম বুদ্ধিমত্তা রোগ শনাক্ত করে সমাধানের উপায় বলে দিবে।' 
              : 'Take a photo of the affected leaf. Our AI will identify the disease and prescribe medicine.'}
          </p>
        </div>

        {!scannedResult && !analyzing && (
          <div 
            onClick={handleScan}
            className="border-2 border-dashed border-brand-200 bg-brand-50/50 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-50 hover:border-brand-400 transition-all duration-300 relative group/scan"
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

        {scannedResult && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-left animate-fade-in-up shadow-sm">
            <div className="flex items-start justify-between mb-4 border-b border-red-100 pb-4">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">{isBangla ? 'শনাক্তকৃত রোগ' : 'Detected Disease'}</span>
                <h4 className="text-xl font-bold text-red-800 mt-1 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-600" />
                  {scannedResult.disease}
                </h4>
              </div>
              <button onClick={() => setScannedResult(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-red-100 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  {isBangla ? 'সমাধান / ঔষধ' : 'Recommended Solution'}
                </p>
                <p className="text-gray-800 leading-relaxed font-medium text-sm">{scannedResult.solution}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button size="sm" variant="danger" className="flex-1 shadow-lg shadow-red-200">
                {isBangla ? 'ঔষধ কিনুন' : 'Buy Medicine'}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-white hover:bg-gray-50 border-red-200 text-red-700">
                {isBangla ? 'বিশেষজ্ঞের পরামর্শ' : 'Ask Expert'}
              </Button>
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
          <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
            <Calculator size={24} />
          </div>
          {isBangla ? 'সার ও বীজ ক্যালকুলেটর' : 'Fertilizer & Seed Calculator'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'জমির পরিমাণ' : 'Land Size'}</label>
            <div className="relative">
              <input 
                type="number" 
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                className="w-full p-4 rounded-xl outline-none transition-all bg-gray-50 border border-gray-200 text-gray-900 text-lg font-medium placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent"
                placeholder="Ex: 10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'একক' : 'Unit'}</label>
            <div className="relative">
              <select 
                value={unit} 
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-4 rounded-xl outline-none transition-all bg-gray-50 border border-gray-200 text-gray-900 text-lg font-medium cursor-pointer focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent appearance-none"
              >
                <option value="decimal">{isBangla ? 'শতাংশ (Decimal)' : 'Decimal'}</option>
                <option value="katha">{isBangla ? 'কাঠা (Katha)' : 'Katha'}</option>
                <option value="bigha">{isBangla ? 'বিঘা (Bigha)' : 'Bigha'}</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'ফসলের ধরন' : 'Crop Type'}</label>
            <div className="relative">
              <select 
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full p-4 rounded-xl outline-none transition-all bg-gray-50 border border-gray-200 text-gray-900 text-lg font-medium cursor-pointer focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent appearance-none"
              >
                <option value="Rice">{isBangla ? 'ধান' : 'Rice'}</option>
                <option value="Wheat">{isBangla ? 'গম' : 'Wheat'}</option>
                <option value="Maize">{isBangla ? 'ভুট্টা' : 'Maize'}</option>
                <option value="Potato">{isBangla ? 'আলু' : 'Potato'}</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'বীজের জাত' : 'Seed Variety'}</label>
            <div className="relative">
              <select 
                value={seedVariety}
                onChange={(e) => setSeedVariety(e.target.value)}
                className="w-full p-4 rounded-xl outline-none transition-all bg-gray-50 border border-gray-200 text-gray-900 text-lg font-medium cursor-pointer focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent appearance-none"
              >
                <option value="HYV">{isBangla ? 'উফশী (HYV)' : 'High Yielding (HYV)'}</option>
                <option value="Hybrid">{isBangla ? 'হাইব্রিড' : 'Hybrid'}</option>
                <option value="Local">{isBangla ? 'দেশি' : 'Local'}</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full mt-8 h-14 text-lg font-bold shadow-lg shadow-green-200 bg-green-600 hover:bg-green-700 text-white">
          {isBangla ? 'হিসাব করুন' : 'Calculate'}
        </Button>
      </div>

      {calculatedResult && (
        <div className="animate-fade-in-up space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                <p className="text-green-100 text-sm font-medium mb-1">{isBangla ? 'প্রয়োজনীয় বীজ' : 'Seed Required'}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold">{calculatedResult.seed}</h3>
                  <span className="text-sm opacity-80">kg</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs bg-white/20 w-fit px-2 py-1 rounded">
                   <Sprout size={12} />
                   {isBangla ? 'ভাল ফলনের জন্য' : 'For best yield'}
                </div>
             </div>
             <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                <p className="text-orange-100 text-sm font-medium mb-1">{isBangla ? 'আনুমানিক খরচ' : 'Estimated Cost'}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-bold">৳ {calculatedResult.cost}</h3>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs bg-white/20 w-fit px-2 py-1 rounded">
                   <CircleDollarSign size={12} />
                   {isBangla ? 'সার ও বীজ বাবদ' : 'Fertilizer & Seed'}
                </div>
             </div>
          </div>

          {/* Detailed Fertilizer Breakdown */}
          <div className="bg-white border border-brand-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Leaf className="text-brand-600" size={20} />
              {isBangla ? 'সারের পরিমাণ' : 'Fertilizer Amount'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Urea', val: calculatedResult.urea, color: 'bg-blue-50 text-blue-700', desc: isBangla ? 'গাছ বৃদ্ধিতে সহায়ক' : 'Leaf growth' },
                { name: 'TSP', val: calculatedResult.tsp, color: 'bg-gray-100 text-gray-800', desc: isBangla ? 'শিকড় মজবুত করে' : 'Root strength' },
                { name: 'MOP', val: calculatedResult.mop, color: 'bg-red-50 text-red-700', desc: isBangla ? 'রোগ প্রতিরোধ করে' : 'Disease resistance' },
                { name: 'Gypsum', val: calculatedResult.gypsum, color: 'bg-yellow-50 text-yellow-700', desc: isBangla ? 'মাটির পুষ্টি যোগায়' : 'Soil nutrient' },
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl ${item.color} text-center`}>
                  <p className="text-xs font-bold uppercase opacity-70 mb-1">{item.name}</p>
                  <p className="text-xl font-bold mb-1">{item.val} <span className="text-xs">kg</span></p>
                  <p className="text-[10px] opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Schedule (Pagination Logic Applied Here) */}
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
             <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CalendarClock className="text-brand-600" size={20} />
                  {isBangla ? 'সার প্রয়োগের সময়সূচী' : 'Application Schedule'}
                </h3>
                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">
                  {calculatedResult.schedule.length} Steps
                </span>
             </div>
             
             <div className="divide-y divide-gray-100">
                {calculatedResult.schedule.slice(0, showFullSchedule ? undefined : 2).map((step, idx) => (
                  <div key={idx} className="p-5 flex gap-4 hover:bg-gray-50 transition-colors">
                     <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        {idx !== calculatedResult.schedule.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                        )}
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-800 text-base mb-1">{isBangla ? step.stageBn : step.stageEn}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{isBangla ? step.detailBn : step.detailEn}</p>
                     </div>
                  </div>
                ))}
             </div>

             {/* Pagination / Load More Button */}
             <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                <button 
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  {showFullSchedule 
                    ? (isBangla ? 'কম দেখান' : 'Show Less') 
                    : (isBangla ? 'আরও ধাপ দেখুন' : 'Show Full Schedule')}
                  {showFullSchedule ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-brand-50 p-6 rounded-2xl border border-brand-100">
        <div>
           <h3 className="text-xl font-bold text-brand-900 flex items-center gap-2">
             <Users className="text-brand-600" />
             {isBangla ? 'কৃষক ফোরাম' : 'Farmers Community'}
           </h3>
           <p className="text-brand-700 text-sm mt-1">
             {isBangla ? 'আপনার সমস্যা ও অভিজ্ঞতা শেয়ার করুন' : 'Share your problems and experiences'}
           </p>
        </div>
        <Button onClick={() => setShowPostModal(true)} className="bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-200">
           <MessageSquare size={18} className="mr-2" />
           {isBangla ? 'নতুন পোস্ট' : 'Create Post'}
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                   {post.user.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-900">{post.user}</h4>
                   <p className="text-xs text-gray-500">{post.timeAgo}</p>
                 </div>
               </div>
             </div>
             
             <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.text}</p>
             
             {post.image && (
               <div className="mb-4 rounded-xl overflow-hidden">
                 <img src={post.image} alt="Post" className="w-full max-h-96 object-cover" />
               </div>
             )}

             <div className="flex items-center gap-6 pt-3 border-t border-gray-50">
               <button 
                 onClick={() => toggleLike(post.id)}
                 className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
               >
                 <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
                 {post.likes}
               </button>
               <button 
                 onClick={() => toggleComments(post.id)}
                 className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors"
               >
                 <MessageSquare size={18} />
                 {post.comments.length}
               </button>
               <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors ml-auto">
                 <Share2 size={18} />
               </button>
             </div>

             {post.showComments && (
               <div className="mt-4 pt-4 border-t border-gray-50 space-y-3 animate-fade-in">
                 {post.comments.map(comment => (
                   <div key={comment.id} className="bg-gray-50 p-3 rounded-xl text-sm">
                     <span className="font-bold text-gray-900 mr-2">{comment.user}:</span>
                     <span className="text-gray-700">{comment.text}</span>
                   </div>
                 ))}
                 <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      placeholder={isBangla ? 'মন্তব্য লিখুন...' : 'Write a comment...'}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-300"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addComment(post.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                 </div>
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-50/30 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Tab Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            {/* Title */}
            <div>
               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                 <Leaf className="text-green-600" />
                 {isBangla ? 'স্মার্ট কৃষি' : 'Smart Agriculture'}
               </h1>
               <p className="text-gray-500 text-sm mt-1">{isBangla ? 'প্রযুক্তির ছোঁয়ায় ফলন বাড়ান' : 'Maximize yield with technology'}</p>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 overflow-x-auto max-w-full">
              {[
                { id: 'overview', icon: <TrendingUp size={16}/>, label: isBangla ? 'ড্যাশবোর্ড' : 'Dashboard' },
                { id: 'calculator', icon: <Calculator size={16}/>, label: isBangla ? 'ক্যালকুলেটর' : 'Calculator' },
                { id: 'community', icon: <Users size={16}/>, label: isBangla ? 'ফোরাম' : 'Forum' },
              ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as Tab)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                     activeTab === tab.id 
                       ? 'bg-green-600 text-white shadow-md' 
                       : 'text-gray-600 hover:bg-gray-50'
                   }`}
                 >
                   {tab.icon} {tab.label}
                 </button>
              ))}
            </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'calculator' && renderCalculator()}
        {activeTab === 'community' && renderCommunity()}
        {/* Fallback for encyclopedia if set via other means, default to overview */}
        {activeTab === 'encyclopedia' && renderOverview()} 
      </div>

      {/* Modals */}
      {showExpertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowExpertModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="bg-[#22c55e] p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-xl">{isBangla ? 'বিশেষজ্ঞ পরামর্শ' : 'Expert Consultation'}</h3>
              <button onClick={() => setShowExpertModal(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors"><X size={24}/></button>
            </div>
            <form onSubmit={handleExpertSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">{isBangla ? 'আপনার নাম' : 'Your Name'}</label>
                <input 
                  type="text" 
                  required
                  value={expertForm.name}
                  onChange={e => setExpertForm({...expertForm, name: e.target.value})}
                  className="w-full bg-[#374151] text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">{isBangla ? 'মোবাইল নম্বর' : 'Mobile Number'}</label>
                <input 
                  type="text" 
                  required
                  value={expertForm.contact}
                  onChange={e => setExpertForm({...expertForm, contact: e.target.value})}
                  className="w-full bg-[#374151] text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">{isBangla ? 'ঠিকানা' : 'Address'}</label>
                <input 
                  type="text" 
                  required
                  value={expertForm.address}
                  onChange={e => setExpertForm({...expertForm, address: e.target.value})}
                  className="w-full bg-[#374151] text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">{isBangla ? 'সমস্যা / বার্তা' : 'Problem / Message'}</label>
                <textarea 
                  required
                  rows={4}
                  value={expertForm.message}
                  onChange={e => setExpertForm({...expertForm, message: e.target.value})}
                  className="w-full bg-[#374151] text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none resize-none placeholder-gray-400"
                ></textarea>
              </div>
              <Button type="submit" className="w-full mt-2 bg-[#22c55e] hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg">
                {isBangla ? 'জমা দিন' : 'Submit Request'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up transform transition-all" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="font-bold text-xl text-gray-900">{isBangla ? 'নতুন পোস্ট লিখুন' : 'Create New Post'}</h3>
              <button 
                onClick={() => setShowPostModal(false)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
              >
                <X size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-6">
              {/* User Info (Optional enhancement for 'social' feel) */}
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                   {isBangla ? 'আ' : 'Me'}
                 </div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">{isBangla ? 'আমি' : 'Me'}</p>
                   <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit">Farmer</p>
                 </div>
              </div>

              <textarea 
                placeholder={isBangla ? 'আপনার প্রশ্ন বা অভিজ্ঞতা বিস্তারিত লিখুন...' : 'Write your question or experience in detail...'}
                className="w-full h-40 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none text-base mb-4 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 transition-all"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                autoFocus
              ></textarea>
              
              {newPostImage && (
                <div className="relative mb-4 rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={newPostImage} alt="Preview" className="w-full h-48 object-cover" />
                  <button 
                    type="button"
                    onClick={() => setNewPostImage(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-gray-600 hover:text-brand-700 hover:bg-brand-50 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm group"
                >
                  <div className="p-1.5 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                    <ImageIcon size={20} />
                  </div>
                  {isBangla ? 'ছবি / ভিডিও' : 'Photo / Video'}
                </button>
                
                <Button 
                  type="submit" 
                  disabled={!newPostText.trim() && !newPostImage}
                  className="rounded-xl px-8 shadow-lg shadow-brand-200 disabled:opacity-50 disabled:shadow-none"
                >
                  <Send size={18} className="mr-2" />
                  {isBangla ? 'পোস্ট করুন' : 'Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
