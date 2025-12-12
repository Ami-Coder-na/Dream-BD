
import React, { useState, useRef } from 'react';
import { 
  Trash2, MapPin, Calendar, Camera, AlertTriangle, 
  Recycle, BookOpen, Leaf, Search, Phone, Navigation,
  Clock, CheckCircle, X, ChevronRight, FileText, ShoppingBag,
  Info, AlertOctagon, LocateFixed, Hammer, Upload, Truck, AlertCircle, Check
} from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

type WasteTab = 'services' | 'guide' | 'recycle' | 'eco';

// --- STATIC DATA ---

const WASTE_CATEGORIES = [
  {
    id: 'organic',
    titleBn: 'জৈব বর্জ্য',
    titleEn: 'Organic Waste',
    itemsBn: 'খাবারের উচ্ছিষ্ট, ফলের খোসা, শাকসবজি',
    itemsEn: 'Food scraps, peels, vegetables',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <Leaf size={24} className="text-green-600" />
  },
  {
    id: 'recyclable',
    titleBn: 'পুনর্ব্যবহারযোগ্য',
    titleEn: 'Recyclable',
    itemsBn: 'প্লাস্টিক বোতল, কাগজ, কাঁচ, ধাতু',
    itemsEn: 'Plastic bottles, paper, glass, metal',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Recycle size={24} className="text-blue-600" />
  },
  {
    id: 'hazardous',
    titleBn: 'ক্ষতিকর বর্জ্য',
    titleEn: 'Hazardous',
    itemsBn: 'ব্যাটারি, ঔষধ, কেমিক্যাল, বাল্ব',
    itemsEn: 'Batteries, meds, chemicals, bulbs',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <AlertTriangle size={24} className="text-red-600" />
  },
  {
    id: 'ewaste',
    titleBn: 'ই-বর্জ্য',
    titleEn: 'E-Waste',
    itemsBn: 'পুরানো ফোন, ল্যাপটপ, তার, চার্জার',
    itemsEn: 'Old phones, laptops, wires, chargers',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Trash2 size={24} className="text-purple-600" />
  }
];

const SCHEDULE_DB: Record<string, { areaBn: string, areaEn: string, time: string, vehicle: string }> = {
  'Mirpur': { areaBn: 'মিরপুর', areaEn: 'Mirpur', time: '6:30 AM - 8:00 AM', vehicle: 'Truck #DH-203' },
  'Dhanmondi': { areaBn: 'ধানমন্ডি', areaEn: 'Dhanmondi', time: '8:00 AM - 9:30 AM', vehicle: 'Van #GT-55' },
  'Gulshan': { areaBn: 'গুলশান', areaEn: 'Gulshan', time: '9:00 PM - 11:00 PM', vehicle: 'Compactor #CP-09' },
  'Uttara': { areaBn: 'উত্তরা', areaEn: 'Uttara', time: '7:00 AM - 9:00 AM', vehicle: 'Truck #UT-11' },
};

const RECYCLING_CENTERS = [
  { id: 1, nameBn: 'গ্রীন রিসাইকেল জোন', nameEn: 'Green Recycle Zone', type: 'E-Waste', location: 'Mirpur 10', distance: '1.2 km', phone: '01711-000000' },
  { id: 2, nameBn: 'মামা ভাগ্নে ভাংগারি', nameEn: 'Mama Vagne Scrap', type: 'Scrap/Plastic', location: 'Kazipara', distance: '0.8 km', phone: '01811-000000' },
  { id: 3, nameBn: 'সিটি কর্পোরেশন কালেকশন', nameEn: 'City Corp Collection', type: 'General', location: 'Agargaon', distance: '3.5 km', phone: '02-999999' },
  { id: 4, nameBn: 'ইকো বিডি সলিউশন', nameEn: 'Eco BD Solution', type: 'Industrial', location: 'Tejgaon', distance: '5.0 km', phone: '01911-000000' },
];

const CITY_RULES = [
  { ruleBn: 'নির্দিষ্ট ডাস্টবিন ছাড়া ময়লা ফেলা দণ্ডনীয় অপরাধ।', ruleEn: 'Littering outside designated bins is a punishable offense.', fine: '৳ 500 - ৳ 5000' },
  { ruleBn: 'মেডিকেল বর্জ্য সাধারণ বর্জ্যের সাথে মেশানো নিষেধ।', ruleEn: 'Do not mix medical waste with general waste.', fine: '৳ 10,000' },
  { ruleBn: 'নির্মাণ সামগ্রী রাস্তার পাশে ফেলে রাখা যাবে না।', ruleEn: 'Construction materials cannot be dumped on roadsides.', fine: 'Seizure of goods' },
];

const DIY_PROJECTS = [
  { id: 1, titleBn: 'প্লাস্টিক বোতলের বাগান', titleEn: 'Plastic Bottle Garden', category: 'Upcycling', duration: '30 mins' },
  { id: 2, titleBn: 'পুরানো কাপড়ের ব্যাগ', titleEn: 'Old Cloth Bag', category: 'Sewing', duration: '1 hour' },
  { id: 3, titleBn: 'কাগজের ঝুড়ি', titleEn: 'Paper Basket', category: 'Craft', duration: '45 mins' },
];

export const WasteModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<WasteTab>('services');
  
  // Grievance State
  const [userAddress, setUserAddress] = useState('');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [grievanceImage, setGrievanceImage] = useState<string | null>(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Schedule State
  const [scheduleResult, setScheduleResult] = useState<any>(null);
  
  // Modal State
  const [showCompostModal, setShowCompostModal] = useState(false);

  // --- HANDLERS ---

  const handleLocationDetect = () => {
    // Simulate Geo-tagging
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }
    
    // Simulating delay for effect
    const btn = document.getElementById('geo-btn');
    if(btn) btn.classList.add('animate-pulse');

    setTimeout(() => {
      setUserAddress('Mirpur 10, Dhaka');
      setLocationDetected(true);
      if(btn) btn.classList.remove('animate-pulse');
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGrievanceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGrievanceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitGrievance = () => {
    if (!userAddress || !grievanceDesc) {
      alert(isBangla ? 'অনুগ্রহ করে ঠিকানা এবং সমস্যার বিবরণ দিন।' : 'Please provide location and description.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(isBangla ? 'অভিযোগ সফলভাবে জমা দেওয়া হয়েছে!' : 'Grievance submitted successfully!');
      // Reset Form
      setGrievanceImage(null);
      setUserAddress('');
      setGrievanceDesc('');
      setLocationDetected(false);
    }, 1500);
  };

  const handleScheduleSearch = () => {
    // Simulate DB Lookup
    if (!userAddress.trim()) {
        alert(isBangla ? 'অনুগ্রহ করে ঠিকানা লিখুন' : 'Please enter an address');
        return;
    }
    const area = Object.keys(SCHEDULE_DB).find(k => userAddress.toLowerCase().includes(k.toLowerCase())) || 'Mirpur';
    setScheduleResult(SCHEDULE_DB[area]);
  };

  // --- RENDER FUNCTIONS ---

  const renderServices = () => (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Grievance Platform */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Camera size={24} className="text-red-400" />
              {isBangla ? 'অভিযোগ জানান' : 'Report Issue'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {isBangla ? 'বর্জ্য জমে আছে? ছবি তুলে পাঠান।' : 'Waste piled up? Upload a photo.'}
            </p>
          </div>
          <AlertOctagon size={32} className="text-gray-700" />
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Upload Area */}
          <div 
            onClick={() => !grievanceImage && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-64 cursor-pointer transition-all relative overflow-hidden group ${
                grievanceImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
             <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={fileInputRef}
               onChange={handleImageUpload}
             />
             
             {grievanceImage ? (
               <div className="relative w-full h-full">
                 <img src={grievanceImage} alt="Preview" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold">{isBangla ? 'ছবি পরিবর্তন করুন' : 'Change Photo'}</p>
                 </div>
                 <button 
                   onClick={handleRemoveImage}
                   className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm z-10"
                 >
                   <X size={16} />
                 </button>
               </div>
             ) : (
               <>
                 <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                   <Upload className="text-gray-500" />
                 </div>
                 <span className="text-sm font-medium text-gray-500 mb-2">{isBangla ? 'ছবি আপলোড করুন' : 'Upload Photo'}</span>
                 <span className="text-xs text-gray-400">(JPEG, PNG - Max 5MB)</span>
               </>
             )}
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4 flex flex-col">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{isBangla ? 'লোকেশন' : 'Location'}</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder={isBangla ? 'ঠিকানা লিখুন...' : 'Enter address...'}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                  />
                  <button 
                    id="geo-btn"
                    onClick={handleLocationDetect}
                    className={`p-3 rounded-lg border transition-colors ${locationDetected ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    title={isBangla ? 'লোকেশন শনাক্ত করুন' : 'Detect Location'}
                  >
                    <LocateFixed size={20} />
                  </button>
                </div>
             </div>
             
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{isBangla ? 'বর্ণনা' : 'Description'}</label>
                <textarea 
                  rows={3}
                  value={grievanceDesc}
                  onChange={(e) => setGrievanceDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 resize-none transition-all"
                  placeholder={isBangla ? 'সমস্যা বিস্তারিত লিখুন...' : 'Describe the issue...'}
                ></textarea>
             </div>

             <div className="mt-auto pt-2">
               <Button 
                 onClick={handleSubmitGrievance} 
                 disabled={isSubmitting}
                 className="w-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-100 h-12 text-base"
               >
                 {isSubmitting 
                   ? (isBangla ? 'জমা হচ্ছে...' : 'Submitting...') 
                   : (isBangla ? 'অভিযোগ জমা দিন' : 'Submit Grievance')}
               </Button>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Schedule Tracker */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">
                <Clock size={24} />
                {isBangla ? 'বর্জ্য সংগ্রহ সূচি' : 'Collection Schedule'}
              </h3>
              <p className="text-green-600 text-sm mt-1">
                {isBangla ? 'আপনার এলাকায় গাড়ি কখন আসবে জানুন' : 'Know when the waste truck arrives'}
              </p>
            </div>
            {/* Using address from grievance form as default if available */}
            <Button onClick={handleScheduleSearch} variant="outline" className="bg-white border-green-200 text-green-700 hover:bg-green-100">
              {isBangla ? 'সূচি দেখুন' : 'Check Schedule'}
            </Button>
         </div>

         {scheduleResult ? (
           <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                   <Truck size={24} />
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-800">{isBangla ? scheduleResult.areaBn : scheduleResult.areaEn}</h4>
                   <p className="text-sm text-gray-500">{scheduleResult.vehicle}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-xs text-gray-400 font-bold uppercase">{isBangla ? 'সময়' : 'Time'}</p>
                 <p className="text-xl font-bold text-green-600">{scheduleResult.time}</p>
              </div>
           </div>
         ) : (
           <div className="text-center py-8 text-green-400 opacity-60 font-medium border-2 border-dashed border-green-200 rounded-xl bg-white/50">
             {isBangla ? 'উপরের বক্সে ঠিকানা লিখে সার্চ করুন' : 'Enter address above and search to see schedule'}
           </div>
         )}
      </div>
    </div>
  );

  const renderGuide = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WASTE_CATEGORIES.map(cat => (
          <div key={cat.id} className={`p-5 rounded-2xl border ${cat.color} flex items-start gap-4 transition-transform hover:scale-[1.02]`}>
             <div className="p-3 bg-white rounded-full shadow-sm bg-opacity-60">
               {cat.icon}
             </div>
             <div>
               <h4 className="font-bold text-lg mb-1">{isBangla ? cat.titleBn : cat.titleEn}</h4>
               <p className="text-sm opacity-90 leading-relaxed">
                 {isBangla ? cat.itemsBn : cat.itemsEn}
               </p>
             </div>
          </div>
        ))}
      </div>

      {/* Compost Tutorial Banner */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-4 rounded-full text-amber-600">
              <Leaf size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">{isBangla ? 'ঘরেই তৈরি করুন সার' : 'Make Compost at Home'}</h3>
              <p className="text-amber-700 text-sm mt-1 max-w-md">
                {isBangla ? 'জৈব বর্জ্য থেকে সার তৈরির সহজ পদ্ধতি শিখুন এবং পরিবেশ বাঁচান।' : 'Learn how to turn organic waste into rich compost.'}
              </p>
            </div>
         </div>
         <Button onClick={() => setShowCompostModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200">
           {isBangla ? 'টিউটোরিয়াল দেখুন' : 'View Tutorial'}
         </Button>
      </div>

      {/* Rules & Fines */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="text-gray-600" />
          {isBangla ? 'সিটি কর্পোরেশন নিয়মাবলী' : 'City Corporation Rules'}
        </h3>
        <div className="space-y-4">
          {CITY_RULES.map((rule, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
               <div className="mt-1"><AlertCircle size={20} className="text-red-500" /></div>
               <div className="flex-1">
                 <p className="font-medium text-gray-800 text-sm mb-1">{isBangla ? rule.ruleBn : rule.ruleEn}</p>
                 <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                   {isBangla ? `জরিমানা: ${rule.fine}` : `Fine: ${rule.fine}`}
                 </span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecycle = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <div>
           <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <MapPin className="text-blue-600" />
             {isBangla ? 'রিসাইক্লিং কেন্দ্র' : 'Recycling Centers'}
           </h3>
           <p className="text-gray-500 text-sm mt-1">{isBangla ? 'নিকটস্থ ই-বর্জ্য ও স্ক্র্যাপ ক্রেতা খুঁজুন' : 'Find nearby E-waste & scrap buyers'}</p>
         </div>
         <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={isBangla ? 'এলাকা খুঁজুন...' : 'Search area...'} 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RECYCLING_CENTERS.map(center => (
          <div key={center.id} className="bg-white p-5 rounded-xl border border-gray-100 hover:border-blue-300 transition-all shadow-sm hover:shadow-md group">
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-gray-900 text-lg">{isBangla ? center.nameBn : center.nameEn}</h4>
                 <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                   <MapPin size={14} /> {center.location} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> <span className="text-blue-600 font-bold">{center.distance}</span>
                 </div>
               </div>
               <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${center.type === 'E-Waste' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                 {center.type}
               </span>
             </div>
             
             <div className="flex gap-2 mt-4">
               <a href={`tel:${center.phone}`} className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                 <Phone size={14} /> {isBangla ? 'কল করুন' : 'Call'}
               </a>
               <button className="flex-1 bg-gray-50 text-gray-700 text-xs font-bold py-2 rounded-lg text-center hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200">
                 <Navigation size={14} /> {isBangla ? 'ম্যাপ' : 'Map'}
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEcoLife = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center py-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl text-white mb-8">
         <Leaf size={48} className="mx-auto mb-4 text-emerald-200" />
         <h2 className="text-3xl font-bold mb-2">{isBangla ? 'পরিবেশবান্ধব জীবন' : 'Eco-Friendly Living'}</h2>
         <p className="text-emerald-100">{isBangla ? 'অপ্রয়োজনীয় জিনিস ফেলবেন না, নতুন কিছু তৈরি করুন।' : 'Don\'t throw away, create something new.'}</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Hammer className="text-emerald-600" />
          {isBangla ? 'DIY প্রজেক্ট (Upcycling)' : 'DIY Projects (Upcycling)'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           {DIY_PROJECTS.map(project => (
             <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer">
                <div className="h-40 bg-gray-200 relative flex items-center justify-center">
                   <Hammer className="text-gray-400 group-hover:scale-110 transition-transform" size={40} />
                   <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                     {project.duration}
                   </span>
                </div>
                <div className="p-4">
                   <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mb-2 inline-block">{project.category}</span>
                   <h4 className="font-bold text-gray-800 text-lg mb-1">{isBangla ? project.titleBn : project.titleEn}</h4>
                   <button className="text-xs font-bold text-gray-500 mt-2 flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                     {isBangla ? 'টিউটোরিয়াল দেখুন' : 'Watch Tutorial'} <ChevronRight size={14} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <ShoppingBag className="text-teal-600" />
              {isBangla ? 'পরিবেশবান্ধব পণ্য' : 'Eco Products'}
            </h3>
            <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded font-bold">Directory</span>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {['Jute Bags', 'Bamboo Toothbrush', 'Clay Pots', 'Paper Pens'].map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 transition-colors cursor-pointer">
                 <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-500">
                   <Leaf size={20} />
                 </div>
                 <p className="font-bold text-gray-700 text-sm">{item}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-4 border border-green-200">
            <Recycle size={16} />
            {isBangla ? 'বর্জ্য ব্যবস্থাপনা' : 'Waste Management'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'পরিচ্ছন্ন শহর, সুস্থ জীবন' : 'Cleaner Cities, Healthier Lives'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'বর্জ্য সঠিকভাবে ফেলুন, রিসাইক্লিং করুন এবং আপনার শহরকে সুন্দর রাখুন।' 
              : 'Dispose waste correctly, recycle more, and keep your city beautiful.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-center gap-1">
            <button 
              onClick={() => setActiveTab('services')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'services' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Camera size={16} />
              {isBangla ? 'রিপোর্ট ও সূচি' : 'Report & Schedule'}
            </button>
            <button 
              onClick={() => setActiveTab('guide')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'guide' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen size={16} />
              {isBangla ? 'গাইড ও নিয়ম' : 'Guide & Rules'}
            </button>
            <button 
              onClick={() => setActiveTab('recycle')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'recycle' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapPin size={16} />
              {isBangla ? 'রিসাইক্লিং ম্যাপ' : 'Recycling Map'}
            </button>
            <button 
              onClick={() => setActiveTab('eco')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'eco' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Leaf size={16} />
              {isBangla ? 'ইকো-লাইফ' : 'Eco-Life'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'services' && renderServices()}
          {activeTab === 'guide' && renderGuide()}
          {activeTab === 'recycle' && renderRecycle()}
          {activeTab === 'eco' && renderEcoLife()}
        </div>

      </div>

      {/* Compost Modal */}
      {showCompostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowCompostModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-amber-500 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-xl">{isBangla ? 'কম্পোস্ট টিউটোরিয়াল' : 'Compost Tutorial'}</h3>
              <button onClick={() => setShowCompostModal(false)} className="hover:bg-amber-600 p-1 rounded-full"><X size={24}/></button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
               {[
                 { step: 1, titleBn: 'পাত্র নির্বাচন', titleEn: 'Choose Container', descBn: 'একটি বালতি বা বিন নিন এবং তাতে ছোট ছিদ্র করুন।' },
                 { step: 2, titleBn: 'স্তর তৈরি (বাদামী)', titleEn: 'Brown Layer', descBn: 'শুকনো পাতা, কাগজ বা পিচবোর্ড দিয়ে প্রথম স্তর দিন।' },
                 { step: 3, titleBn: 'স্তর তৈরি (সবুজ)', titleEn: 'Green Layer', descBn: 'ফলের খোসা, শাকসবজির উচ্ছিষ্ট দিন (তেল/মাংস বাদে)।' },
                 { step: 4, titleBn: 'রক্ষণাবেক্ষণ', titleEn: 'Maintain', descBn: 'মাঝে মাঝে পানি ছিটান এবং উল্টেপাল্টে দিন। ৩ মাসে সার তৈরি হবে।' },
               ].map((item) => (
                 <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-1">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-1">{isBangla ? item.titleBn : item.titleEn}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{isBangla ? item.descBn : isBangla ? item.descBn : 'Description here...'}</p>
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
               <Button onClick={() => setShowCompostModal(false)} className="bg-amber-600 hover:bg-amber-700 text-white">
                 {isBangla ? 'বুঝতে পেরেছি' : 'Got it'}
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
