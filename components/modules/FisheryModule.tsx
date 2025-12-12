
import React, { useState } from 'react';
import { 
  Fish, Droplets, Activity, TrendingUp, AlertCircle, 
  Calculator, BookOpen, Scale, Gavel, Stethoscope, 
  ChevronRight, Thermometer, Leaf, DollarSign, Search,
  Info, CheckCircle, X, PlayCircle, FileText, Phone
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

type FisheryTab = 'market' | 'encyclopedia' | 'tools' | 'govt';

// --- STATIC DATA ---

const MARKET_PRICES = [
  { id: 1, nameBn: 'রুই (বড়)', nameEn: 'Rui (Large)', price: '350', unit: 'kg', trend: 'up', change: '+10' },
  { id: 2, nameBn: 'কাতল', nameEn: 'Katol', price: '320', unit: 'kg', trend: 'stable', change: '0' },
  { id: 3, nameBn: 'তেলাপিয়া', nameEn: 'Tilapia', price: '180', unit: 'kg', trend: 'down', change: '-5' },
  { id: 4, nameBn: 'পাঙ্গাস', nameEn: 'Pangas', price: '140', unit: 'kg', trend: 'up', change: '+2' },
  { id: 5, nameBn: 'চিংড়ি (গলদা)', nameEn: 'Prawn (Golda)', price: '800', unit: 'kg', trend: 'up', change: '+50' },
  { id: 6, nameBn: 'পাবদা', nameEn: 'Pabda', price: '450', unit: 'kg', trend: 'down', change: '-20' },
];

const FISH_GUIDES = [
  {
    id: 1,
    titleBn: 'রুই মাছ চাষ পদ্ধতি',
    titleEn: 'Rui Fish Farming',
    type: 'Traditional',
    image: 'https://images.unsplash.com/photo-1599321955726-90471f64560d',
    stepsBn: ['পুকুর প্রস্তুতি: চুন ও সার প্রয়োগ', 'পোনা মজুদ: শতাংশে ৩০-৪০টি', 'খাবার: ওজনের ৩-৫%', 'রোগ ব্যবস্থাপনা: মাসে একবার চুন প্রয়োগ', 'ফসল সংগ্রহ: ৬-৮ মাস পর'],
    stepsEn: ['Pond Prep: Lime & Fertilizer', 'Stocking: 30-40/decimal', 'Feeding: 3-5% of body weight', 'Disease Mgmt: Monthly liming', 'Harvest: After 6-8 months']
  },
  {
    id: 2,
    titleBn: 'বায়োফ্লক পদ্ধতিতে তেলাপিয়া',
    titleEn: 'Biofloc Tilapia Farming',
    type: 'Modern',
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99',
    stepsBn: ['ট্যাংক সেটআপ ও এয়ারেশন', 'প্রোবায়োটিক ও মোলাসেস মিশ্রণ', 'পানির প্যারামিটার (TDS, pH) চেক', 'উচ্চ ঘনত্বের চাষ', 'অ্যামোনিয়া নিয়ন্ত্রণ'],
    stepsEn: ['Tank Setup & Aeration', 'Probiotic & Molasses mix', 'Check Parameters (TDS, pH)', 'High density farming', 'Ammonia Control']
  },
  {
    id: 3,
    titleBn: 'চিংড়ি ঘের ব্যবস্থাপনা',
    titleEn: 'Shrimp Enclosure Mgmt',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1628189873998-25f00e95a947',
    stepsBn: ['লোনা পানির উৎস নিশ্চিত করা', 'ঘেরের তলা পরিষ্কার রাখা', 'ভাইরাস প্রতিরোধে নিরাপত্তা', 'নিয়মিত চুন প্রয়োগ', 'পিএইচ ৭.৫-৮.৫ রাখা'],
    stepsEn: ['Ensure saline water source', 'Clean bottom soil', 'Bio-security for virus', 'Regular liming', 'Maintain pH 7.5-8.5']
  }
];

const DISEASES_DB = [
  {
    id: 1,
    nameBn: 'ক্ষত রোগ (Ulcer)',
    nameEn: 'Epizootic Ulcerative Syndrome',
    symptomsBn: 'শরীরে লাল দাগ, ঘা হওয়া, মাছ দুর্বল হয়ে পড়া।',
    symptomsEn: 'Red spots on body, ulcers, fish becomes weak.',
    treatmentBn: 'প্রতি শতাংশে ১ কেজি চুন ও ১ কেজি লবণ প্রয়োগ করুন।',
    treatmentEn: 'Apply 1kg Lime and 1kg Salt per decimal.',
    severity: 'High'
  },
  {
    id: 2,
    nameBn: 'পাখনা পচা রোগ',
    nameEn: 'Fin Rot',
    symptomsBn: 'পাখনা ছিঁড়ে যাওয়া বা পচে যাওয়া, সাদা দাগ।',
    symptomsEn: 'Fins torn or rotting, white spots.',
    treatmentBn: 'পটাশিয়াম পারম্যাঙ্গানেট (২-৩ পিপিএম) দিয়ে গোসল করান।',
    treatmentEn: 'Bath in Potassium Permanganate (2-3 PPM).',
    severity: 'Medium'
  },
  {
    id: 3,
    nameBn: 'উ উকুন (Argulosis)',
    nameEn: 'Fish Lice (Argulus)',
    symptomsBn: 'মাছের গায়ে চ্যাপ্টা পোকা দেখা যায়, মাছ লাফালাফি করে।',
    symptomsEn: 'Flat lice visible on body, fish jumps erratically.',
    treatmentBn: 'ডিপটারেক্স (০.৫ পিপিএম) ব্যবহার করুন।',
    treatmentEn: 'Use Dipterex (0.5 PPM).',
    severity: 'Medium'
  }
];

const GOVT_SERVICES = [
  {
    titleBn: 'মৎস্য ঋণ সহায়তা',
    titleEn: 'Fishery Loan Support',
    descBn: 'নতুন খামার তৈরিতে সহজ শর্তে ৫ লক্ষ টাকা পর্যন্ত ঋণ।',
    descEn: 'Easy loans up to 5 Lakh BDT for new farms.',
    icon: <DollarSign size={20} className="text-green-600" />,
    detailsBn: 'সোনালী ব্যাংক এবং কর্মসংস্থান ব্যাংকের মাধ্যমে ৫% সুদে এই ঋণ দেওয়া হয়। পরিশোধের সময়সীমা ২ বছর।',
    detailsEn: 'Loans provided via Sonali & Karmasangsthan Bank at 5% interest. Repayment period: 2 years.',
    requirementsBn: ['জাতীয় পরিচয়পত্র', 'পুকুরের মালিকানা দলিল', 'ট্রেড লাইসেন্স', 'চেয়ারম্যানের প্রত্যয়নপত্র'],
    requirementsEn: ['National ID', 'Pond ownership docs', 'Trade License', 'Chairman Certificate']
  },
  {
    titleBn: 'ইলিশ ধরা নিষেধাজ্ঞা',
    titleEn: 'Hilsa Fishing Ban',
    descBn: 'প্রজনন মৌসুমে (অক্টোবর ৭ - ২৮) ইলিশ ধরা সম্পূর্ণ নিষেধ।',
    descEn: 'Total ban on Hilsa fishing during breeding season (Oct 7-28).',
    icon: <AlertCircle size={20} className="text-red-600" />,
    detailsBn: 'এই ২২ দিন সারা দেশে ইলিশ ধরা, পরিবহন, মজুত ও বিক্রি নিষিদ্ধ। আইন অমান্যকারীর ১-২ বছরের জেল এবং জরিমানা হতে পারে। সরকার জেলেদের এই সময়ে খাদ্য সহায়তা দেয়।',
    detailsEn: 'Catching, transporting, storing, and selling Hilsa is banned nationwide for 22 days. Violators face 1-2 years jail. Govt provides food aid.',
    requirementsBn: ['প্রজনন ক্ষেত্র সংরক্ষণ', 'জাটকা নিধন বন্ধ করা', 'আইন মান্য করা'],
    requirementsEn: ['Preserve breeding grounds', 'Stop Jatka fishing', 'Obey the law']
  },
  {
    titleBn: 'বিনামূল্যে প্রশিক্ষণ',
    titleEn: 'Free Training',
    descBn: 'উপজেলা মৎস্য অফিসে ৩ দিনব্যাপী আধুনিক চাষ প্রশিক্ষণ।',
    descEn: '3-day modern farming training at Upazila Fishery Office.',
    icon: <BookOpen size={20} className="text-blue-600" />,
    detailsBn: 'বায়োফ্লক, মিশ্র চাষ এবং রোগ বালাই দমন বিষয়ে হাতে-কলমে প্রশিক্ষণ। প্রশিক্ষণ শেষে সনদ ও যাতায়াত ভাতা প্রদান করা হয়।',
    detailsEn: 'Hands-on training on Biofloc, mixed farming, and disease control. Certificate and travel allowance provided upon completion.',
    requirementsBn: ['মৎস্য চাষি হিসেবে নিবন্ধন', 'অষ্টম শ্রেণি পাস', 'বয়স ১৮-৪৫ বছর'],
    requirementsEn: ['Registered Fish Farmer', 'Class 8 Pass', 'Age 18-45 years']
  }
];

export const FisheryModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<FisheryTab>('market');
  
  // Calculator State
  const [calcSpecies, setCalcSpecies] = useState('Rui');
  const [calcCount, setCalcCount] = useState('');
  const [calcWeight, setCalcWeight] = useState(''); // Average body weight in grams
  const [feedResult, setFeedResult] = useState<string | null>(null);

  // Modal State
  const [selectedGuide, setSelectedGuide] = useState<typeof FISH_GUIDES[0] | null>(null);
  const [selectedGovtService, setSelectedGovtService] = useState<typeof GOVT_SERVICES[0] | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const calculateFeed = () => {
    const count = parseFloat(calcCount);
    const weight = parseFloat(calcWeight); // grams
    if (!count || !weight) return;

    let percentage = 0.03; // Default 3%
    if (calcSpecies === 'Rui') percentage = 0.03;
    else if (calcSpecies === 'Tilapia') percentage = 0.04;
    else if (calcSpecies === 'Catfish') percentage = 0.05;

    const totalBiomassKg = (count * weight) / 1000;
    const dailyFeedKg = totalBiomassKg * percentage;

    setFeedResult(dailyFeedKg.toFixed(2));
  };

  // --- RENDER FUNCTIONS ---

  const renderMarket = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Dashboard */}
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {isBangla ? 'আজকের বাজার দর' : 'Today\'s Market Price'}
              </h2>
              <p className="text-cyan-100 text-sm mb-6 flex items-center gap-1">
                <Leaf size={14} /> {new Date().toLocaleDateString()} • {isBangla ? 'পাইকারি বাজার' : 'Wholesale Market'}
              </p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-black/20 rounded-xl p-3">
              <p className="text-cyan-100 text-xs uppercase font-bold mb-1">{isBangla ? 'রুই' : 'Rui'}</p>
              <p className="text-xl font-bold">৳ ৩৫০</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3">
              <p className="text-cyan-100 text-xs uppercase font-bold mb-1">{isBangla ? 'চিংড়ি' : 'Shrimp'}</p>
              <p className="text-xl font-bold">৳ ৮০০</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3">
              <p className="text-cyan-100 text-xs uppercase font-bold mb-1">{isBangla ? 'তেলাপিয়া' : 'Tilapia'}</p>
              <p className="text-xl font-bold">৳ ১৮০</p>
            </div>
          </div>
        </div>
        
        {/* Decorative BG */}
        <Fish className="absolute -right-6 -bottom-6 text-white/10 w-48 h-48 rotate-12" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      </div>

      {/* Detailed Price List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Scale size={18} className="text-cyan-600" />
            {isBangla ? 'মাছের দরের তালিকা' : 'Detailed Price List'}
          </h3>
          <Button variant="outline" size="sm" className="text-xs h-8">
            {isBangla ? 'রিফ্রেশ' : 'Refresh'}
          </Button>
        </div>
        <div className="divide-y divide-gray-100">
          {MARKET_PRICES.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-cyan-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full ${item.trend === 'up' ? 'bg-green-500' : item.trend === 'down' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <div>
                  <h4 className="font-bold text-gray-900">{isBangla ? item.nameBn : item.nameEn}</h4>
                  <p className="text-xs text-gray-500">{isBangla ? `প্রতি ${item.unit}` : `Per ${item.unit}`}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800 text-lg">৳ {item.price}</p>
                <div className={`text-xs font-medium flex items-center justify-end gap-1 ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                  {item.trend === 'up' && <TrendingUp size={12} />}
                  {item.change !== '0' && item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEncyclopedia = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-cyan-600" />
            {isBangla ? 'চাষ পদ্ধতি ও গাইড' : 'Farming Encyclopedia'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {isBangla ? 'সনাতন ও আধুনিক পদ্ধতির নির্দেশিকা' : 'Guides for traditional and modern farming'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FISH_GUIDES.map(guide => (
          <div key={guide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={getOptimizedImageUrl(guide.image, 400)} 
                alt={guide.titleEn} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
                  guide.type === 'Modern' ? 'bg-purple-600' : 
                  guide.type === 'Commercial' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {guide.type}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-lg text-gray-900 mb-3 line-clamp-1">
                {isBangla ? guide.titleBn : guide.titleEn}
              </h4>
              <ul className="space-y-2 mb-4">
                {(isBangla ? guide.stepsBn : guide.stepsEn).slice(0, 3).map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-cyan-500 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{step}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => setSelectedGuide(guide)} 
                variant="outline" 
                className="w-full text-xs border-cyan-200 text-cyan-700 hover:bg-cyan-50"
              >
                {isBangla ? 'বিস্তারিত পড়ুন' : 'Read Full Guide'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Tech Promo */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">
            {isBangla ? 'আধুনিক প্রযুক্তি: বায়োফ্লক ও আরএএস' : 'Modern Tech: Biofloc & RAS'}
          </h3>
          <p className="text-indigo-700 text-sm mb-4 leading-relaxed">
            {isBangla 
              ? 'অল্প জায়গায় অধিক মাছ উৎপাদনের জন্য বায়োফ্লক বা রিসার্কুলেটিং অ্যাকুয়াকালচার সিস্টেম (RAS) ব্যবহার করুন। এটি পানির অপচয় কমায়।' 
              : 'Use Biofloc or Recirculating Aquaculture System (RAS) for high-density farming in small spaces. Saves water.'}
          </p>
          <Button onClick={() => setShowVideoModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {isBangla ? 'ভিডিও টিউটোরিয়াল দেখুন' : 'Watch Video Tutorials'}
          </Button>
        </div>
        <div 
          className="w-full md:w-1/3 h-40 bg-indigo-200 rounded-xl flex items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-lg transition-all"
          onClick={() => setShowVideoModal(true)}
        >
           {/* Placeholder for Video Thumbnail */}
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center opacity-60"></div>
           <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg relative z-10 hover:scale-110 transition-transform">
             <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-indigo-600 border-b-8 border-b-transparent ml-1"></div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Feed Calculator */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calculator className="text-cyan-600" />
          {isBangla ? 'খাদ্য ক্যালকুলেটর' : 'Feed Calculator'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'মাছের প্রজাতি' : 'Fish Species'}</label>
              <select 
                value={calcSpecies}
                onChange={(e) => setCalcSpecies(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Rui">Rui / Katol</option>
                <option value="Tilapia">Tilapia</option>
                <option value="Catfish">Catfish (Pangash/Magur)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'মোট মাছের সংখ্যা' : 'Total Fish Count'}</label>
              <input 
                type="number" 
                value={calcCount}
                onChange={(e) => setCalcCount(e.target.value)}
                placeholder="Ex: 500"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'গড় ওজন (গ্রাম)' : 'Average Weight (gm)'}</label>
              <input 
                type="number" 
                value={calcWeight}
                onChange={(e) => setCalcWeight(e.target.value)}
                placeholder="Ex: 150"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <Button onClick={calculateFeed} className="w-full bg-cyan-600 hover:bg-cyan-700">
              {isBangla ? 'হিসাব করুন' : 'Calculate'}
            </Button>
          </div>

          <div className="bg-cyan-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-cyan-100">
            {feedResult ? (
              <>
                <p className="text-cyan-800 font-medium mb-2">{isBangla ? 'দৈনিক প্রয়োজনীয় খাবার' : 'Daily Feed Required'}</p>
                <h4 className="text-5xl font-bold text-cyan-600 mb-2">{feedResult} <span className="text-lg text-cyan-500">kg</span></h4>
                <p className="text-xs text-cyan-700 mt-2 bg-white/50 px-3 py-1 rounded-full">
                  {isBangla ? 'সকালে ৫০% ও বিকেলে ৫০% দিন' : 'Give 50% in morning & 50% in evening'}
                </p>
              </>
            ) : (
              <div className="text-cyan-400">
                <Info size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">{isBangla ? 'তথ্য দিয়ে হিসাব বাটন চাপুন' : 'Enter details and press calculate'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disease Doctor Catalog */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Stethoscope className="text-red-500" />
          {isBangla ? 'মাছের রোগ ও সমাধান' : 'Disease Diagnosis & Solution'}
        </h3>
        
        <div className="space-y-4">
          {DISEASES_DB.map((disease) => (
            <div key={disease.id} className="border border-gray-100 rounded-xl p-4 hover:border-red-200 transition-colors bg-white hover:shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 text-lg">
                  {isBangla ? disease.nameBn : disease.nameEn}
                </h4>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                  disease.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {disease.severity} Risk
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-xs font-bold text-red-700 uppercase mb-1">{isBangla ? 'লক্ষণ' : 'Symptoms'}</p>
                  <p className="text-sm text-gray-700">{isBangla ? disease.symptomsBn : disease.symptomsEn}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs font-bold text-green-700 uppercase mb-1">{isBangla ? 'চিকিৎসা' : 'Treatment'}</p>
                  <p className="text-sm text-gray-700">{isBangla ? disease.treatmentBn : disease.treatmentEn}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGovt = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Gavel className="text-blue-600" />
          {isBangla ? 'সরকারি সহায়তা ও আইন' : 'Govt Support & Laws'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GOVT_SERVICES.map((service, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors group">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                {isBangla ? service.titleBn : service.titleEn}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {isBangla ? service.descBn : service.descEn}
              </p>
              <button 
                onClick={() => setSelectedGovtService(service)}
                className="mt-4 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                {isBangla ? 'বিস্তারিত জানুন' : 'Learn More'} <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
           <h4 className="font-bold text-blue-900 text-lg mb-1">{isBangla ? 'মৎস্য কর্মকর্তার সাথে যোগাযোগ' : 'Contact Fisheries Officer'}</h4>
           <p className="text-blue-700 text-sm">{isBangla ? 'উপজেলা মৎস্য অফিস থেকে সরাসরি পরামর্শ নিন।' : 'Get direct advice from Upazila Fisheries Office.'}</p>
         </div>
         <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
           {isBangla ? 'নম্বর খুঁজুন' : 'Find Number'}
         </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cyan-50/30 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold mb-3 border border-cyan-200">
            <Fish size={14} />
            {isBangla ? 'মৎস্য সম্পদ ও প্রযুক্তি' : 'Fisheries & Technology'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'স্মার্ট মৎস্য চাষ' : 'Smart Fish Farming'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'চাষ পদ্ধতি, রোগ নির্ণয় এবং বাজার দরের সকল তথ্য এখন হাতের মুঠোয়।' 
              : 'All info on farming methods, disease diagnosis, and market prices at your fingertips.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-center gap-1">
            <button 
              onClick={() => setActiveTab('market')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'market' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={16} />
              {isBangla ? 'মার্কেট ও ড্যাশবোর্ড' : 'Market & Dashboard'}
            </button>
            <button 
              onClick={() => setActiveTab('encyclopedia')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'encyclopedia' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen size={16} />
              {isBangla ? 'এনসাইক্লোপিডিয়া' : 'Encyclopedia'}
            </button>
            <button 
              onClick={() => setActiveTab('tools')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tools' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calculator size={16} />
              {isBangla ? 'টুলস ও সেবা' : 'Tools & Services'}
            </button>
            <button 
              onClick={() => setActiveTab('govt')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'govt' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Gavel size={16} />
              {isBangla ? 'আইন ও সহায়তা' : 'Laws & Support'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'market' && renderMarket()}
          {activeTab === 'encyclopedia' && renderEncyclopedia()}
          {activeTab === 'tools' && renderTools()}
          {activeTab === 'govt' && renderGovt()}
        </div>

      </div>

      {/* Guide Details Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedGuide(null)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="relative h-48 sm:h-64">
              <img 
                src={getOptimizedImageUrl(selectedGuide.image, 800)} 
                alt={selectedGuide.titleEn} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedGuide(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
                  selectedGuide.type === 'Modern' ? 'bg-purple-600' : 
                  selectedGuide.type === 'Commercial' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {selectedGuide.type}
                </span>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isBangla ? selectedGuide.titleBn : selectedGuide.titleEn}
              </h2>
              
              <div className="space-y-4">
                {(isBangla ? selectedGuide.stepsBn : selectedGuide.stepsEn).map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setSelectedGuide(null)}>{isBangla ? 'বন্ধ করুন' : 'Close'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Govt Service Modal */}
      {selectedGovtService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedGovtService(null)}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  {selectedGovtService.icon}
                </div>
                <h3 className="font-bold text-lg">{isBangla ? selectedGovtService.titleBn : selectedGovtService.titleEn}</h3>
              </div>
              <button 
                onClick={() => setSelectedGovtService(null)} 
                className="hover:bg-blue-700 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                  <FileText size={16} /> {isBangla ? 'বিস্তারিত' : 'Details'}
                </h4>
                <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
                  {isBangla ? selectedGovtService.detailsBn : selectedGovtService.detailsEn}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <CheckCircle size={16} /> {isBangla ? 'প্রয়োজনীয় কাগজপত্র / যোগ্যতা' : 'Requirements / Eligibility'}
                </h4>
                <ul className="space-y-2">
                  {(isBangla ? selectedGovtService.requirementsBn : selectedGovtService.requirementsEn).map((req, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedGovtService(null)}>
                {isBangla ? 'বন্ধ করুন' : 'Close'}
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Phone size={16} className="mr-2" /> {isBangla ? 'কল করুন' : 'Call Office'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setShowVideoModal(false)}>
          <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};
