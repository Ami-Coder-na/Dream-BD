
import React, { useState, useRef } from 'react';
import { 
  Trash2, MapPin, Calendar, Camera, AlertTriangle, 
  Recycle, BookOpen, Leaf, Search, Phone, Navigation,
  Clock, CheckCircle, X, ChevronRight, FileText, ShoppingBag,
  Info, AlertOctagon, LocateFixed, Hammer, Upload, Truck, AlertCircle, Check
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
    
    // Simulate API call
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
      // Reset Form
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
    if (areaKey) {
      setScheduleResult(SCHEDULE_DB[areaKey]);
    } else {
      // Default fallback for demo
      setScheduleResult(SCHEDULE_DB['Mirpur']);
    }
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
      {/* ... Rest of components ... */}
    </div>
  );
};
