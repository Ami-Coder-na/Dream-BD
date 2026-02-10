
import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudRain, Sun, Sprout, TrendingUp, TriangleAlert, 
  ScanLine, Calculator, BookOpen, Users, Video, 
  Calendar, Droplets, Wind, ChevronRight, Upload, X, CheckCircle, MapPin,
  Leaf, Info, Thermometer, Search, Clock, Loader2, ChevronDown, ChevronUp,
  CircleDollarSign, CalendarClock, Filter, BarChart3, MessageSquare, Heart, Share2, Send, Image as ImageIcon,
  FlaskConical, ClipboardList, Camera, AlertCircle, PlayCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { User } from '../../types';
import { analyzePlantDisease } from '../../services/geminiService';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
  user?: User | null;
  onLogin?: () => void;
  initialTab?: string;
  onNavigate?: (path: string) => void;
}

type Tab = 'overview' | 'calculator' | 'aiscan' | 'market';

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
    careBn: 'নিয়মিত আগাছা পরিষ্কার করুন এবং পানির স্তর ২-৩ ইঞ্চি রাখুন।',
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

export const AgriModule: React.FC<Props> = ({ isBangla, user, onLogin, initialTab, onNavigate }) => {
  const { marketPrices } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  useEffect(() => {
    if (initialTab && ['overview', 'calculator', 'aiscan', 'market'].includes(initialTab)) {
      setActiveTab(initialTab as Tab);
    }
  }, [initialTab]);

  const handleTabChange = (tabId: Tab) => {
    if (onNavigate) {
      onNavigate(`agriculture:${tabId}`);
    } else {
      setActiveTab(tabId);
    }
  };

  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiFileInputRef = useRef<HTMLInputElement>(null);
  const [cropSearch, setCropSearch] = useState('');
  
  // Calculator State
  const [landSize, setLandSize] = useState<string>('');
  const [unit, setUnit] = useState('decimal');
  const [cropType, setCropType] = useState('dhan');
  const [seedVariety, setSeedVariety] = useState('hyv');
  const [calculatedResult, setCalculatedResult] = useState<any>(null);
  
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
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherRes.json();
          setWeather({
            city: isBangla ? 'আপনার এলাকা' : 'Your Area',
            temp: Math.round(weatherData.current_weather.temperature),
            condition: isBangla ? 'পরিষ্কার আকাশ' : 'Clear Sky'
          });
        } catch (err) { console.error("Weather fetch failed", err); }
      });
    }
  }, [isBangla]);

  const handleAiScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) { onLogin?.(); return; }

    setAnalyzing(true);
    setAiError(null);
    setScannedResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      try {
        const result = await analyzePlantDisease(base64, file.type, isBangla);
        setScannedResult(result);
      } catch (err) {
        setAiError(isBangla ? "শনাক্ত করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Detection failed. Please try again.");
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
    
    // Logic adjusted for dhan vs others
    const multiplier = cropType === 'dhan' ? 1 : 0.8;
    const ureaTotal = sizeInDecimal * 0.95 * multiplier;
    const tsp = sizeInDecimal * 0.4 * multiplier;
    const mop = sizeInDecimal * 0.45 * multiplier;
    const totalCost = Math.round((ureaTotal * 27) + (tsp * 22) + (mop * 20));
    
    setCalculatedResult({
      urea: parseFloat(ureaTotal.toFixed(2)),
      tsp: parseFloat(tsp.toFixed(2)),
      mop: parseFloat(mop.toFixed(2)),
      cost: totalCost
    });
  };

  const renderOverview = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4279F2] to-[#2858C2] p-8 text-white shadow-xl min-h-[280px] flex flex-col justify-between">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full w-fit"><MapPin size={16} /><span className="text-sm font-bold">{weather.city}</span></div>
              <div className="flex flex-col"><h2 className="text-7xl font-bold tracking-tight">{weather.temp}°C</h2><p className="text-blue-50 font-medium text-2xl mt-1">{weather.condition}</p></div>
            </div>
            <Sun size={96} className="text-yellow-300 animate-pulse hidden sm:block" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 relative z-10 text-center">
          <div><p className="text-sm opacity-80 mb-1">{isBangla ? 'আর্দ্রতা' : 'Humidity'}</p><p className="text-xl font-bold">75%</p></div>
          <div><p className="text-sm opacity-80 mb-1">{isBangla ? 'বাতাস' : 'Wind'}</p><p className="text-xl font-bold">12 km/h</p></div>
          <div><p className="text-sm opacity-80 mb-1">{isBangla ? 'বৃষ্টি' : 'Rain'}</p><p className="text-xl font-bold">60%</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all cursor-pointer" onClick={() => handleTabChange('aiscan')}>
           <div>
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><ScanLine size={32} /></div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{isBangla ? 'এআই রোগ নির্ণয় কেন্দ্র' : 'AI Agri-Diagnosis Center'}</h3>
              <p className="text-gray-500 font-medium">{isBangla ? 'ফসল, গবাদি পশু, হাঁস-মুরগি বা মাছের ছবি তুলে রোগ এবং সমাধান জানুন মুহূর্তেই।' : 'Snap a photo of crops, livestock, birds, or fish to get diagnosis instantly.'}</p>
           </div>
           <Button className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold">{isBangla ? 'স্ক্যান শুরু করুন' : 'Start Scan'}</Button>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all cursor-pointer" onClick={() => handleTabChange('calculator')}>
           <div>
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Calculator size={32} /></div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{isBangla ? 'সার ও বীজ ক্যালকুলেটর' : 'Agri Calculator'}</h3>
              <p className="text-gray-500 font-medium">{isBangla ? 'আপনার জমির আয়তন অনুযায়ী সারের সঠিক পরিমাণ হিসাব করুন।' : 'Calculate exact fertilizer needs for your land size.'}</p>
           </div>
           <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold">{isBangla ? 'হিসাব করুন' : 'Open Calculator'}</Button>
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><Leaf className="text-green-600" size={28} />{isBangla ? 'ফসলের ডাটাবেজ' : 'Crop Database'}</h3>
          <div className="relative w-full sm:w-72">
             <input type="text" placeholder={isBangla ? 'ফসল খুঁজুন...' : 'Search crop...'} value={cropSearch} onChange={(e) => setCropSearch(e.target.value)} className="w-full bg-white border border-gray-200 rounded-full px-5 py-2.5 pl-12 text-sm shadow-sm focus:ring-2 focus:ring-green-500/20 text-gray-900 placeholder-gray-400 font-bold" />
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CROPS_DB.filter(c => isBangla ? c.nameBn.includes(cropSearch) : c.nameEn.toLowerCase().includes(cropSearch.toLowerCase())).map(crop => (
            <div key={crop.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-56 overflow-hidden"><img src={getOptimizedImageUrl(crop.image, 500)} alt={crop.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
              <div className="p-6">
                <h4 className="font-bold text-gray-900 text-xl mb-1">{isBangla ? crop.nameBn : crop.nameEn}</h4>
                <p className="text-xs text-green-600 font-black uppercase tracking-wider mb-4">{crop.scientificName}</p>
                <Button onClick={() => setSelectedCrop(crop)} variant="outline" className="w-full rounded-xl text-sm font-bold border-green-100 text-green-700 hover:bg-green-50">{isBangla ? 'বিস্তারিত দেখুন' : 'View Details'}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAiScan = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
       <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"><ScanLine size={40} /></div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">{isBangla ? 'কৃষি ও পশুপাখির রোগ শনাক্ত করুন' : 'Diagnose Agri & Livestock Issues'}</h2>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto font-medium">{isBangla ? 'আপনার আক্রান্ত ফসল, গবাদি পশু (গরু/ছাগল), হাঁস-মুরগি বা মাছের একটি পরিষ্কার ছবি আপলোড করুন। আমাদের এআই আপনাকে রোগের নাম ও প্রতিকার জানিয়ে দেবে।' : 'Upload a clear photo of your infected crop, livestock, poultry, or fish. Our AI will identify the disease and suggest remedies.'}</p>
          
          <div className="flex flex-col items-center gap-6">
             <input type="file" ref={aiFileInputRef} className="hidden" accept="image/*" onChange={handleAiScan} />
             <Button 
                onClick={() => aiFileInputRef.current?.click()} 
                disabled={analyzing}
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-2xl shadow-2xl shadow-green-600/20 font-black text-xl flex items-center gap-3 transition-all active:scale-95"
             >
                {analyzing ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
                {analyzing ? (isBangla ? 'বিশ্লেষণ চলছে...' : 'Analyzing...') : (isBangla ? 'ছবি আপলোড করুন' : 'Upload Image')}
             </Button>
          </div>

          {scannedResult && (
            <div className="mt-12 bg-green-50 border border-green-200 rounded-[2rem] p-8 text-left animate-fade-in-up">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-600 text-white rounded-lg"><CheckCircle size={20}/></div>
                  <h3 className="text-xl font-black text-green-900">{isBangla ? 'বিশ্লেষণ ফলাফল' : 'Diagnosis Result'}</h3>
               </div>
               <div className="space-y-6">
                  <div><p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">{isBangla ? 'সমস্যার নাম / রোগ' : 'Problem / Disease Name'}</p><p className="text-2xl font-bold text-gray-900">{scannedResult.disease}</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">{isBangla ? 'ভয়াবহতা' : 'Severity'}</p><p className="font-bold text-red-600">{scannedResult.severity}</p></div>
                     <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm"><p className="text-[10px] font-black text-gray-400 uppercase mb-1">{isBangla ? 'ধরন' : 'Category'}</p><p className="font-bold text-green-700">{scannedResult.isPlant ? (isBangla ? 'ফসল/উদ্ভিদ' : 'Crop/Plant') : (isBangla ? 'প্রাণী/মাছ' : 'Animal/Fish')}</p></div>
                  </div>
                  <div><p className="text-xs font-black text-green-600 uppercase tracking-widest mb-2">{isBangla ? 'পরামর্শ ও সমাধান' : 'Advice & Solution'}</p><p className="text-gray-700 leading-relaxed font-medium bg-white p-5 rounded-2xl border border-green-100 whitespace-pre-wrap">{scannedResult.solution}</p></div>
               </div>
            </div>
          )}

          {aiError && (
            <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 justify-center font-bold">
               <AlertCircle size={20}/> {aiError}
            </div>
          )}
       </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="animate-fade-in space-y-8">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 md:p-12 border-r border-gray-100">
            <h3 className="text-2xl font-black text-[#1e293b] mb-8 flex items-center gap-3">
              <div className="bg-green-50 p-1.5 rounded-lg"><Calculator size={28} className="text-green-600" /></div>
              {isBangla ? 'সার ও বীজ ক্যালকুলেটর' : 'Fertilizer & Seed Calculator'}
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase mb-2 ml-1">{isBangla ? 'জমির পরিমাণ' : 'Land Size'}</label>
                  <input 
                    type="number" 
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold text-lg text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase mb-2 ml-1">{isBangla ? 'একক' : 'Unit'}</label>
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold cursor-pointer appearance-none text-gray-900"
                  >
                    <option value="decimal">{isBangla ? 'শতাংশ (Decimal)' : 'Decimal'}</option>
                    <option value="katha">{isBangla ? 'কাঠা' : 'Katha'}</option>
                    <option value="bigha">{isBangla ? 'বিঘা (৩৩ শতাংশ)' : 'Bigha (33 Dec)'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase mb-2 ml-1">{isBangla ? 'ফসলের ধরন' : 'Crop Type'}</label>
                  <select 
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold cursor-pointer appearance-none text-gray-900"
                  >
                    <option value="dhan">{isBangla ? 'ধান' : 'Rice'}</option>
                    <option value="pat">{isBangla ? 'পাট' : 'Jute'}</option>
                    <option value="alu">{isBangla ? 'আলু' : 'Potato'}</option>
                    <option value="shobji">{isBangla ? 'শাকসবজি' : 'Vegetables'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase mb-2 ml-1">{isBangla ? 'বীজের জাত' : 'Seed Variety'}</label>
                  <select 
                    value={seedVariety}
                    onChange={(e) => setSeedVariety(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none font-bold cursor-pointer appearance-none text-gray-900"
                  >
                    <option value="hyv">{isBangla ? 'উফশী (HYV)' : 'HYV'}</option>
                    <option value="local">{isBangla ? 'দেশি' : 'Local'}</option>
                    <option value="hybrid">{isBangla ? 'হাইব্রিড' : 'Hybrid'}</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-black text-xl rounded-2xl shadow-xl transition-all">{isBangla ? 'হিসাব করুন' : 'Calculate Now'}</Button>
            </div>
          </div>

          <div className="bg-gray-50 p-8 md:p-12 flex flex-col items-center justify-center">
            {calculatedResult ? (
              <div className="w-full space-y-8 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: isBangla ? 'ইউরিয়া' : 'Urea', value: calculatedResult.urea },
                    { label: isBangla ? 'টিএসপি' : 'TSP', value: calculatedResult.tsp },
                    { label: isBangla ? 'এমওপি' : 'MOP', value: calculatedResult.mop }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{item.label}</p>
                      <p className="text-2xl font-black text-gray-900">{item.value} kg</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                        <CircleDollarSign size={32} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">{isBangla ? 'আনুমানিক খরচ' : 'Est. Cost'}</p>
                        <p className="text-3xl font-black text-gray-900">৳ {calculatedResult.cost.toLocaleString()}</p>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xs">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
                  <Calculator size={40} />
                </div>
                <h4 className="text-xl font-bold text-gray-500 mb-2">{isBangla ? 'কোন হিসাব পাওয়া যায়নি' : 'No calculation found'}</h4>
                <p className="text-sm text-gray-400 font-medium">{isBangla ? 'বামে তথ্য পূরণ করে ক্যালকুলেট বাটনে ক্লিক করুন।' : 'Fill details on the left and click calculate button.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="animate-fade-in space-y-8">
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/30">
             <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3"><TrendingUp className="text-blue-600" />{isBangla ? 'আজকের বাজার দর' : 'Today\'s Market Price'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                <tr><th className="px-8 py-5">Product</th><th className="px-8 py-5">Price (BDT)</th><th className="px-8 py-5 text-right">Trend</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {marketPrices.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 font-bold text-gray-900">{isBangla ? item.nameBn : item.nameEn}</td>
                    <td className="px-8 py-5 font-black text-blue-700">৳ {item.today}</td>
                    <td className="px-8 py-5 text-right">
                       {item.trend === 'up' ? <span className="text-red-500 font-bold">▲ Up</span> : <span className="text-green-500 font-bold">▼ Down</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div><h1 className="text-4xl font-black text-gray-900 flex items-center gap-3"><div className="bg-green-100 p-2 rounded-xl"><Leaf className="text-green-600" size={32} /></div>{isBangla ? 'স্মার্ট কৃষি' : 'Smart Agriculture'}</h1><p className="text-gray-400 font-medium text-lg mt-1">{isBangla ? 'প্রযুক্তির ছোঁয়ায় ফলন ও খামার সুরক্ষিত রাখুন' : 'Protect your harvest and farm with technology'}</p></div>
            <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', icon: <BarChart3 size={18}/>, label: isBangla ? 'ড্যাশবোর্ড' : 'Dashboard' }, 
                { id: 'aiscan', icon: <ScanLine size={18}/>, label: isBangla ? 'এআই রোগ নির্ণয়' : 'AI Agri-Diagnosis' },
                { id: 'calculator', icon: <Calculator size={18}/>, label: isBangla ? 'ক্যালকুলেটর' : 'Calculator' },
                { id: 'market', icon: <TrendingUp size={18}/>, label: isBangla ? 'বাজার দর' : 'Market' }
              ].map(tab => (
                 <button key={tab.id} onClick={() => handleTabChange(tab.id as Tab)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-green-700 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:bg-gray-200'}`}>{tab.icon} {tab.label}</button>
              ))}
            </div>
        </div>
        <div className="min-h-[500px]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'aiscan' && renderAiScan()}
          {activeTab === 'calculator' && renderCalculator()}
          {activeTab === 'market' && renderMarket()}
        </div>
      </div>

      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCrop(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 overflow-hidden">
               <img src={selectedCrop.image} className="w-full h-full object-cover" />
               <button onClick={() => setSelectedCrop(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur text-white rounded-full transition-all"><X size={24}/></button>
               <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-black">{isBangla ? selectedCrop.nameBn : selectedCrop.nameEn}</h2>
                  <p className="text-sm italic opacity-80">{selectedCrop.scientificName}</p>
               </div>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
               <div><p className="text-xs font-bold text-gray-400 uppercase mb-2">{isBangla ? 'উপযুক্ত মাটি' : 'Best Soil'}</p><div className="bg-green-50 p-4 rounded-xl text-green-800 font-medium border border-green-100">{isBangla ? selectedCrop.soilBn : selectedCrop.soilEn}</div></div>
               <div><p className="text-xs font-bold text-gray-400 uppercase mb-2">{isBangla ? 'সার প্রয়োগ' : 'Fertilizers'}</p><p className="text-gray-700 leading-relaxed font-medium">{isBangla ? selectedCrop.fertilizerBn : selectedCrop.fertilizerEn}</p></div>
               <div><p className="text-xs font-bold text-gray-400 uppercase mb-2">{isBangla ? 'যত্ন ও পরামর্শ' : 'Care Tips'}</p><p className="text-gray-700 leading-relaxed font-medium">{isBangla ? selectedCrop.careBn : selectedCrop.careEn}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
