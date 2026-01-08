
import React, { useState, useRef } from 'react';
import { 
  Trash2, MapPin, Calendar, Camera, AlertTriangle, 
  Recycle, BookOpen, Leaf, Search, Phone, Navigation,
  Clock, CheckCircle, X, ChevronRight, FileText, ShoppingBag,
  Info, AlertOctagon, LocateFixed, Hammer, Upload, Truck, AlertCircle, Check, ChevronDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { User } from '../../types';
import { compressImage } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
  user?: User | null;
  onLogin?: () => void;
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

export const WasteModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const { addGrievance } = useData();
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
  
  // --- HANDLERS ---

  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }
    const btn = document.getElementById('geo-btn');
    if(btn) btn.classList.add('animate-pulse');

    setTimeout(() => {
      setUserAddress('Mirpur 10, Dhaka');
      setLocationDetected(true);
      if(btn) btn.classList.remove('animate-pulse');
    }, 1000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1000, 0.6);
        setGrievanceImage(compressed);
      } catch (err) {
        console.error("Grievance image compression failed", err);
      }
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
    if (!user) {
        if (onLogin) onLogin();
        return;
    }

    if (!userAddress || !grievanceDesc) {
      alert(isBangla ? 'অনুগ্রহ করে ঠিকানা এবং সমস্যার বিবরণ দিন।' : 'Please provide location and description.');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      const report = {
          location: userAddress,
          issue: grievanceDesc,
          type: 'Waste',
          image: grievanceImage,
          user: user.name
      };
      addGrievance(report);
      setIsSubmitting(false);
      alert(isBangla ? 'অভিযোগ সফলভাবে জমা দেওয়া হয়েছে!' : 'Grievance submitted successfully!');
      setGrievanceImage(null);
      setUserAddress('');
      setGrievanceDesc('');
      setLocationDetected(false);
    }, 1500);
  };

  const handleScheduleSearch = () => {
    const addr = (userAddress || '').trim().toLowerCase();
    if (!addr) {
        alert(isBangla ? 'অনুগ্রহ করে ঠিকানা লিখুন' : 'Please enter an address');
        return;
    }
    const areaKey = Object.keys(SCHEDULE_DB).find(k => addr.includes(k.toLowerCase()));
    if (areaKey) setScheduleResult(SCHEDULE_DB[areaKey]);
    else setScheduleResult(SCHEDULE_DB['Mirpur']);
  };

  // --- RENDER FUNCTIONS ---

  const renderServices = () => (
    <div className="space-y-8 animate-fade-in">
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
          <div 
            onClick={() => !grievanceImage && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-64 cursor-pointer transition-all relative overflow-hidden group ${
                grievanceImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
             {grievanceImage ? (
               <div className="relative w-full h-full">
                 <img src={grievanceImage} alt="Preview" className="w-full h-full object-cover" />
                 <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm z-10"><X size={16} /></button>
               </div>
             ) : (
               <>
                 <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform"><Upload className="text-gray-500" /></div>
                 <span className="text-sm font-medium text-gray-500 mb-2">{isBangla ? 'ছবি আপলোড করুন' : 'Upload Photo'}</span>
               </>
             )}
          </div>
          
          <div className="space-y-4 flex flex-col">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{isBangla ? 'লোকেশন' : 'Location'}</label>
                <div className="flex gap-2">
                  <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder={isBangla ? 'ঠিকানা লিখুন...' : 'Enter address...'} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400" />
                  <button id="geo-btn" onClick={handleLocationDetect} className={`p-3 rounded-lg border transition-colors ${locationDetected ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-500'}`}><LocateFixed size={20} /></button>
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{isBangla ? 'বর্ণনা' : 'Description'}</label>
                <textarea rows={3} value={grievanceDesc} onChange={(e) => setGrievanceDesc(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 resize-none" placeholder={isBangla ? 'সমস্যা বিস্তারিত লিখুন...' : 'Describe the issue...'}></textarea>
             </div>
             <div className="mt-auto pt-2">
               <Button onClick={handleSubmitGrievance} disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12">
                 {isSubmitting ? (isBangla ? 'জমা হচ্ছে...' : 'Submitting...') : (isBangla ? 'অভিযোগ জমা দিন' : 'Submit Grievance')}
               </Button>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
         <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Clock className="text-brand-600" /> {isBangla ? 'সংগ্রহের সময়সূচী' : 'Collection Schedule'}</h3>
         <div className="flex gap-3 mb-6">
            <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder={isBangla ? 'এলাকার নাম লিখুন (উদা: Mirpur)' : 'Enter area name (e.g. Mirpur)'} className="flex-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20" />
            <Button onClick={handleScheduleSearch} className="bg-brand-600 text-white px-8">{isBangla ? 'খুঁজুন' : 'Search'}</Button>
         </div>
         {scheduleResult && (
           <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 animate-fade-in flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm"><Truck size={32}/></div>
              <div>
                <h4 className="text-lg font-bold text-brand-900">{isBangla ? scheduleResult.areaBn : scheduleResult.areaEn}</h4>
                <p className="text-sm font-medium text-brand-700 mt-1 flex items-center gap-1"><Clock size={14}/> {scheduleResult.time}</p>
                <p className="text-xs text-gray-400 mt-1">{isBangla ? 'গাড়ি নম্বর: ' : 'Vehicle: '} {scheduleResult.vehicle}</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );

  const renderGuide = () => (
    <div className="animate-fade-in space-y-8">
       <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isBangla ? 'বর্জ্য বিভাজন গাইড' : 'Waste Segregation Guide'}</h2>
          <p className="text-gray-500">{isBangla ? 'সঠিক ডাস্টবিনে সঠিক ময়লা ফেলুন' : 'Dispose waste in the correct bins'}</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WASTE_CATEGORIES.map(cat => (
            <div key={cat.id} className={`p-6 rounded-3xl border-2 ${cat.color} flex flex-col items-center text-center shadow-sm`}>
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">{cat.icon}</div>
               <h4 className="font-bold text-lg mb-2">{isBangla ? cat.titleBn : cat.titleEn}</h4>
               <p className="text-xs font-medium opacity-80">{isBangla ? cat.itemsBn : cat.itemsEn}</p>
            </div>
          ))}
       </div>
    </div>
  );

  const renderRecycle = () => (
    <div className="animate-fade-in space-y-6">
       <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Recycle className="text-blue-600" /> {isBangla ? 'নিকটস্থ রিসাইক্লিং সেন্টার' : 'Nearby Recycling Centers'}</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECYCLING_CENTERS.map(center => (
            <div key={center.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-all">
               <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Hammer size={24}/></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{isBangla ? center.nameBn : center.nameEn}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {center.location} ({center.distance})</p>
                  </div>
               </div>
               <a href={`tel:${center.phone}`} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 transition-colors"><Phone size={20}/></a>
            </div>
          ))}
       </div>
    </div>
  );

  const renderEco = () => (
    <div className="animate-fade-in space-y-10">
       <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Hammer className="text-orange-600" /> {isBangla ? 'বাড়িতেই রিসাইক্লিং (DIY)' : 'Upcycling at Home (DIY)'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {DIY_PROJECTS.map(proj => (
               <div key={proj.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group cursor-pointer hover:shadow-md transition-all">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase mb-2 inline-block">{proj.category}</span>
                  <h4 className="font-bold text-gray-900 text-lg mb-4">{isBangla ? proj.titleBn : proj.titleEn}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                    <span>{proj.duration}</span>
                    <ChevronRight size={16} />
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><AlertCircle size={28} className="text-red-400" /> {isBangla ? 'শহরের পরিচ্ছন্নতা নিয়মাবলী' : 'City Sanitation Rules'}</h3>
          <div className="space-y-4">
             {CITY_RULES.map((rule, idx) => (
               <div key={idx} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold shrink-0">{idx+1}</div>
                  <div>
                    <p className="font-bold text-lg">{isBangla ? rule.ruleBn : rule.ruleEn}</p>
                    <p className="text-xs text-red-400 font-black mt-1 uppercase tracking-widest">{isBangla ? 'জরিমানা: ' : 'Fine: '} {rule.fine}</p>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-bold mb-4">
            <Trash2 size={16} />
            {isBangla ? 'স্মার্ট বর্জ্য ব্যবস্থাপনা' : 'Smart Waste Management'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{isBangla ? 'পরিচ্ছন্ন শহর, সুস্থ জীবন' : 'Clean City, Healthy Life'}</h1>
        </div>

        <div className="flex justify-center mb-10 overflow-x-auto pb-2 no-scrollbar">
           <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
              {[
                { id: 'services', icon: <Navigation size={18}/>, labelBn: 'সেবাসমূহ', labelEn: 'Services' },
                { id: 'guide', icon: <BookOpen size={18}/>, labelBn: 'গাইডলাইন', labelEn: 'Guidelines' },
                { id: 'recycle', icon: <Recycle size={18}/>, labelBn: 'রিসাইক্লিং', labelEn: 'Recycle' },
                { id: 'eco', icon: <Leaf size={18}/>, labelBn: 'ইকো টিপস', labelEn: 'Eco Tips' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as WasteTab)} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>{tab.icon} {isBangla ? tab.labelBn : tab.labelEn}</button>
              ))}
           </div>
        </div>

        <div className="min-h-[500px]">
           {activeTab === 'services' && renderServices()}
           {activeTab === 'guide' && renderGuide()}
           {activeTab === 'recycle' && renderRecycle()}
           {activeTab === 'eco' && renderEco()}
        </div>
      </div>
    </div>
  );
};
