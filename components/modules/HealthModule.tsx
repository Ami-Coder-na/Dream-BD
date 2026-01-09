
import React, { useState, useMemo } from 'react';
import { 
  HeartPulse, Calendar, Phone, MapPin, Star, UserPlus, 
  Thermometer, Activity, Baby, Utensils, AlertCircle, 
  Search, ChevronRight, Droplets, ShieldCheck, Stethoscope,
  Info, Clock, ChevronDown, Check, Building2, X, Eye, CheckCircle, Heart, Siren, Pill, CreditCard, User, Fingerprint, Sparkles, UserCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

type Tab = 'diseases' | 'access' | 'bloodbank' | 'maternal' | 'lifestyle';

const DISTRICT_LIST = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Feni', 'Bogra', 'Jessore'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const DISEASES_DB = [
  { id: 1, nameBn: 'ডেঙ্গু জ্বর', nameEn: 'Dengue Fever', symptomsBn: 'উচ্চ জ্বর, তীব্র মাথা ব্যথা, চোখের পেছনে ব্যথা, শরীরে র‍্যাশ।', symptomsEn: 'High fever, severe headache, pain behind eyes, body rash.', image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289' },
  { id: 2, nameBn: 'নিউমোনিয়া', nameEn: 'Pneumonia', symptomsBn: 'কাশি, শ্বাসকষ্ট, জ্বর, বুকে ব্যথা।', symptomsEn: 'Cough, shortness of breath, fever, chest pain.', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8' },
  { id: 3, nameBn: 'ডায়রিয়া', nameEn: 'Diarrhea', symptomsBn: 'পাতলা পায়খানা, বমি, পানিশূন্যতা।', symptomsEn: 'Loose motion, vomiting, dehydration.', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f' }
];

const HOSPITALS_DB = [
  { id: 1, name: 'Dhaka Medical College Hospital', address: 'Secretariat Road, Dhaka', phone: '02-55165088' },
  { id: 2, name: 'Bangabandhu Sheikh Mujib Medical...', address: 'Shahbag, Dhaka', phone: '02-9661051' },
  { id: 3, name: 'Square Hospital', address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath', phone: '10616' },
  { id: 4, name: 'Evercare Hospital', address: 'Plot 81, Block E, Bashundhara R/A', phone: '10678' },
  { id: 5, name: 'Kurmitola General Hospital', address: 'Tong-Ashulia Road, Dhaka Cantonment', phone: '02-8712345' },
  { id: 6, name: 'United Hospital', address: 'Plot 15, Road 71, Gulshan', phone: '10666' },
];

const PREGNANCY_WEEKS_FALLBACK: Record<number, any> = {
  1: { babyBn: 'নিষেক প্রক্রিয়া শুরু হয়।', babyEn: 'Fertilization process starts.', momBn: 'পিরিয়ড বন্ধ হয়, হালকা ক্লান্তি আসতে পারে।', momEn: 'Periods stop, light fatigue may occur.' },
  4: { babyBn: 'ভ্রূণ জরায়ুতে স্থাপিত হয়। এটি পোস্ত দানার মতো ছোট।', babyEn: 'Embryo implants. Tiny like a poppy seed.', momBn: 'স্তনে ব্যথা বা বমি বমি ভাব হতে পারে।', momEn: 'Breast tenderness or morning sickness.' },
  8: { babyBn: 'শিশুর হৃদস্পন্দন শুরু হয় এবং ক্ষুদ্র অঙ্গপ্রত্যঙ্গ তৈরি হয়।', babyEn: "Baby's heartbeat starts, tiny limbs form.", momBn: 'ঘন ঘন প্রস্রাবের বেগ এবং মেজাজ পরিবর্তন হতে পারে।', momEn: 'Frequent urination and mood swings.' },
  12: { babyBn: 'শিশুর সব অঙ্গ এখন গঠিত, নড়াচড়া শুরু হয়।', babyEn: 'All organs formed, baby starts moving.', momBn: 'পেট একটু বড় হতে শুরু করে, বমি ভাব কমে আসে।', momEn: 'Belly starts showing, nausea decreases.' },
  16: { babyBn: 'শিশু এখন চোখের আলো অনুভব করতে পারে।', babyEn: 'Baby can now sense light.', momBn: 'ত্বকে পরিবর্তন আসতে পারে, শক্তির মাত্রা বৃদ্ধি পায়।', momEn: 'Skin changes, energy levels increase.' },
  20: { babyBn: 'শিশুর লিঙ্গ নির্ধারণ সম্ভব এবং সে শুনতে পায়।', babyEn: 'Gender can be identified, baby can hear.', momBn: 'শিশুর নড়াচড়া (কুইকেনিং) অনুভব করতে পারবেন।', momEn: 'You can feel baby movements (quickening).' },
  24: { babyBn: 'ফুসফুস তৈরি হচ্ছে, শিশু এখন হাই তোলে।', babyEn: 'Lungs developing, baby can yawn.', momBn: 'পা ফুলে যাওয়া বা পিঠের ব্যথা হতে পারে।', momEn: 'Swollen feet or backaches may occur.' },
  28: { babyBn: 'শিশু এখন চোখ মেলে তাকাতে পারে।', babyEn: 'Baby can open and close eyes.', momBn: 'ব্র্যাক্সটন হিকস (ফলস লেবার) অনুভব হতে পারে।', momEn: 'Braxton Hicks contractions may occur.' },
  32: { babyBn: 'শিশুর হাড় শক্ত হচ্ছে, কিন্তু খুলি নরম থাকে।', babyEn: 'Bones hardening, but skull remains soft.', momBn: 'পেটে চুলকানি বা শ্বাসকষ্ট হতে পারে।', momEn: 'Abdominal itching or breathlessness.' },
  36: { babyBn: 'শিশু এখন মাথা নিচের দিকে নামিয়ে জন্মের প্রস্তুতি নেয়।', babyEn: 'Baby drops head down for birth prep.', momBn: 'হাঁটাচলায় অসুবিধা এবং পেলভিক এলাকায় চাপ অনুভূত হয়।', momEn: 'Walking becomes difficult, pelvic pressure.' },
  40: { babyBn: 'শিশু সম্পূর্ণ প্রস্তুত! এটি কুমড়োর মতো ওজনের।', babyEn: 'Full term! Baby is about the size of a pumpkin.', momBn: 'যেকোনো সময় প্রসব বেদনা শুরু হতে পারে।', momEn: 'Labor pains can start any time.' }
};

export const HealthModule: React.FC<Props> = ({ isBangla }) => {
  const { donors, addDonorViewLog, pregnancyInfo } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('diseases');
  const [hospitalDistrict, setHospitalDistrict] = useState('Dhaka');
  const [pregnancyWeek, setPregnancyWeek] = useState(8);
  const [activeModal, setActiveModal] = useState<'donate' | 'view_number' | 'health_card' | null>(null);

  // Blood Donor Registration State
  const [donorRegistered, setDonorRegistered] = useState(false);
  const [donorForm, setDonorForm] = useState({ name: '', phone: '', group: 'A+', district: 'Dhaka', lastDonation: '' });

  // Blood View Flow State
  const [viewingDonor, setViewingDonor] = useState<any>(null);
  const [viewerInfo, setViewerInfo] = useState({ name: '', phone: '', district: 'Dhaka' });
  const [revealedNumber, setRevealedNumber] = useState<string | null>(null);

  // Health Card State
  const [cardRegistered, setCardRegistered] = useState(false);
  const [cardInfo, setCardInfo] = useState({ name: '', phone: '', age: '', blood: 'A+' });

  const handleOpenViewNumber = (donor: any) => {
    setViewingDonor(donor);
    setRevealedNumber(null);
    setViewerInfo({ name: '', phone: '', district: 'Dhaka' });
    setActiveModal('view_number');
  };

  const handleViewerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewerInfo.name || !viewerInfo.phone || !viewingDonor) return;
    addDonorViewLog({
      donorName: viewingDonor.name,
      donorPhone: viewingDonor.phone,
      viewerName: viewerInfo.name,
      viewerPhone: viewerInfo.phone,
      viewerDistrict: viewerInfo.district,
      created_at: new Date().toISOString()
    });
    setRevealedNumber(viewingDonor.phone);
  };

  const handleCardRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setCardRegistered(true);
  };

  const handleDonorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setDonorRegistered(true);
  };

  const getWeekData = (week: number) => {
     if (pregnancyInfo && pregnancyInfo.length > 0) {
        let closest = pregnancyInfo[0];
        for (const info of pregnancyInfo) {
           if (week >= info.week) closest = info;
           else break;
        }
        return {
           babyBn: closest.baby_bn,
           babyEn: closest.baby_en,
           momBn: closest.mom_bn,
           momEn: closest.mom_en
        };
     }
     const keys = Object.keys(PREGNANCY_WEEKS_FALLBACK).map(Number).sort((a, b) => a - b);
     let closestKey = keys[0];
     for (const k of keys) {
        if (week >= k) closestKey = k;
        else break;
     }
     return PREGNANCY_WEEKS_FALLBACK[closestKey];
  };

  const currentWeekData = getWeekData(pregnancyWeek);

  const renderDiseases = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-red-50">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="text-red-500" />
          {isBangla ? 'মৌসুমী রোগ ট্র্যাকার' : 'Seasonal Disease Tracker'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">{isBangla ? 'উচ্চ ঝুঁকি' : 'High Risk'}</span>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{isBangla ? 'ডেঙ্গু' : 'Dengue'}</h4>
            <p className="text-sm text-gray-500 mt-1">Dhaka, Ctg</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">{isBangla ? 'মাঝারি' : 'Medium'}</span>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{isBangla ? 'ভাইরাল ফিভার' : 'Viral Fever'}</h4>
            <p className="text-sm text-gray-500 mt-1">All Districts</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">{isBangla ? 'কম' : 'Low'}</span>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{isBangla ? 'কলেরা' : 'Cholera'}</h4>
            <p className="text-sm text-gray-500 mt-1">Coastal Areas</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {DISEASES_DB.map((disease) => (
          <div key={disease.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
            <div className="relative h-56 overflow-hidden">
              <img src={getOptimizedImageUrl(disease.image, 600)} alt={disease.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-2xl font-bold">{isBangla ? disease.nameBn : disease.nameEn}</h4>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">{isBangla ? 'লক্ষণ' : 'Symptoms'}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{isBangla ? disease.symptomsBn : disease.symptomsEn}</p>
              <Button variant="outline" className="w-full rounded-xl text-sm font-bold border-gray-200 hover:bg-teal-50 transition-colors">
                {isBangla ? 'বিস্তারিত ও চিকিৎসা' : 'Details & Treatment'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Button variant="secondary" className="rounded-xl px-8 flex items-center gap-2">
           <ChevronDown size={18} /> {isBangla ? 'আরও দেখুন' : 'View More'}
        </Button>
      </div>
    </div>
  );

  const renderAccess = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="bg-[#FFF1F1] border border-red-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
             <Phone size={24} />
           </div>
           <div>
             <h2 className="text-xl font-bold text-red-900">{isBangla ? 'জরুরী সেবা' : 'Emergency Services'}</h2>
             <p className="text-red-500 text-sm">{isBangla ? 'অ্যাম্বুলেন্স বা রক্তের প্রয়োজনে কল করুন' : 'Call for Ambulance or Blood Emergency'}</p>
           </div>
         </div>
         <div className="flex gap-3">
            <a href="tel:999" className="bg-[#E12B31] text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
              <Phone size={18} /> 999
            </a>
            <button onClick={() => setActiveTab('bloodbank')} className="bg-[#9E1111] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
              <Droplets size={18} /> {isBangla ? 'রক্তদাতা খুঁজুন' : 'Find Donor'}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <div className="bg-[#EEF4FF] p-8 rounded-2xl border border-blue-50 text-center hover:shadow-md transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm">
               <Building2 size={24} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">{isBangla ? 'হাসপাতাল খুঁজুন' : 'Find Hospital'}</h4>
         </div>
         <div className="bg-[#F0FFF4] p-8 rounded-2xl border border-green-50 text-center hover:shadow-md transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm">
               <Pill size={24} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">{isBangla ? 'ফার্মেসী' : 'Pharmacy'}</h4>
         </div>
         <div className="bg-[#F5F3FF] p-8 rounded-2xl border border-purple-50 text-center hover:shadow-md transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-600 shadow-sm">
               <ShieldCheck size={24} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">{isBangla ? 'সরকারি স্কিম' : 'Govt Schemes'}</h4>
         </div>
         <div onClick={() => setActiveModal('health_card')} className="bg-[#FFF7ED] p-8 rounded-2xl border border-orange-50 text-center hover:shadow-md transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 text-orange-600 shadow-sm">
               <UserPlus size={24} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">{isBangla ? 'হেলথ কার্ড' : 'Health Card'}</h4>
         </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <Building2 size={22} className="text-teal-600" /> {isBangla ? 'হাসপাতাল ডিরেক্টরি' : 'Hospital Directory'}
            </h3>
            <div className="relative w-full md:w-64">
               <select className="w-full pl-4 pr-10 py-2.5 bg-[#F0FDF4] border border-green-100 rounded-xl text-sm font-medium outline-none appearance-none cursor-pointer" value={hospitalDistrict} onChange={(e) => setHospitalDistrict(e.target.value)}>
                  {DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" size={16} />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOSPITALS_DB.map(hosp => (
               <div key={hosp.id} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition-all group">
                  <h4 className="font-bold text-gray-900 mb-2">{hosp.name}</h4>
                  <p className="text-xs text-gray-500 mb-6 flex items-start gap-2"><MapPin size={14} className="text-red-400 mt-0.5" /> {hosp.address}</p>
                  <a href={`tel:${hosp.phone}`} className="flex items-center justify-center gap-2 bg-[#F0FDF4] text-[#166534] font-bold py-2 rounded-xl text-sm hover:bg-[#166534] hover:text-white transition-all">
                     <Phone size={14} /> {hosp.phone}
                  </a>
               </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderBloodBank = () => (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Search size={18} className="text-red-500" /> {isBangla ? 'ফিল্টার' : 'Filter'}
            </h3>
            <div className="space-y-4">
              <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 py-2.5 pl-3 pr-8 rounded-xl text-sm outline-none">
                <option value="All">{isBangla ? 'সব জেলা' : 'All Districts'}</option>
                {DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(grp => (
                  <button key={grp} className="py-1.5 text-xs rounded-lg border font-bold bg-white text-gray-600 border-gray-200 hover:border-red-300">{grp}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
             <UserPlus size={24} className="mx-auto mb-3 text-red-500" />
             <h4 className="font-bold text-red-900 mb-1">{isBangla ? 'রক্তদাতা হোন' : 'Become a Donor'}</h4>
             <Button onClick={() => { setDonorRegistered(false); setActiveModal('donate'); }} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-9 mt-3">{isBangla ? 'নিবন্ধন করুন' : 'Register Now'}</Button>
          </div>
        </aside>
        <main className="w-full lg:w-3/4">
           <h3 className="font-bold text-gray-800 text-lg mb-4">{isBangla ? 'রক্তদাতার তালিকা' : 'Donor List'}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {donors.map(donor => (
               <div key={donor.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">{(donor.name || 'D').charAt(0)}</div>
                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1">{donor.name}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10} /> {donor.district}</p>
                        </div>
                     </div>
                     <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-extrabold">{donor.group}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                     <p className="text-[10px] text-gray-400">{isBangla ? 'শেষ দান:' : 'Last:'} {donor.lastDonation}</p>
                     <button onClick={() => handleOpenViewNumber(donor)} className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md shadow-red-100">
                       <Eye size={14} /> {isBangla ? 'নম্বর দেখুন' : 'View Number'}
                     </button>
                  </div>
               </div>
             ))}
           </div>
        </main>
      </div>
    </div>
  );

  const renderMaternal = () => (
    <div className="space-y-10 animate-fade-in">
       <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-pink-50">
          <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
             <Baby size={24} className="text-pink-500" /> {isBangla ? 'গর্ভাবস্থা ট্র্যাকার' : 'Pregnancy Tracker'}
          </h3>
          <div className="mb-12 px-4 max-w-2xl">
             <label className="block text-sm font-black text-gray-600 mb-6 uppercase tracking-widest">
               {isBangla ? 'আপনার বর্তমান সপ্তাহ নির্বাচন করুন' : 'Select Your Current Week'}: 
               <span className="text-pink-600 text-2xl ml-2 font-black">{pregnancyWeek}</span>
             </label>
             <div className="relative pt-2">
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  className="w-full h-2.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600" 
                  value={pregnancyWeek} 
                  onChange={(e) => setPregnancyWeek(parseInt(e.target.value))} 
                />
                <div className="flex justify-between mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Week 1</span>
                  <span>Week 40</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-[#FFF5F8] p-6 rounded-3xl border border-pink-100 shadow-sm flex gap-5 items-start hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pink-500 shadow-sm shrink-0">
                  <Sparkles size={28} />
                </div>
                <div>
                   <h4 className="font-black text-pink-900 text-lg mb-2 uppercase tracking-tight">{isBangla ? 'শিশুর অবস্থা' : "Baby's Status"}</h4>
                   <p className="text-pink-800/80 text-sm leading-relaxed font-medium">
                     {isBangla ? currentWeekData.babyBn : currentWeekData.babyEn}
                   </p>
                </div>
             </div>

             <div className="bg-[#F0F9FF] p-6 rounded-3xl border border-blue-100 shadow-sm flex gap-5 items-start hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                  <HeartPulse size={28} />
                </div>
                <div>
                   <h4 className="font-black text-blue-900 text-lg mb-2 uppercase tracking-tight">{isBangla ? 'মায়ের পরামর্শ' : "Mother's Advice"}</h4>
                   <p className="text-blue-800/80 text-sm leading-relaxed font-medium">
                     {isBangla ? currentWeekData.momBn : currentWeekData.momEn}
                   </p>
                </div>
             </div>
          </div>
       </div>

       <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="bg-blue-600 p-6 text-white flex items-center gap-3">
            <CheckCircle size={24} />
            <h3 className="text-xl font-bold">{isBangla ? 'টিকা ক্যালেন্ডার (EPI)' : 'Vaccination Calendar (EPI)'}</h3>
          </div>
          <div className="divide-y divide-gray-50">
             {[
               { ageBn: 'জন্মের সময়', ageEn: 'At Birth', vaccines: 'BCG, OPV-0, HepB-0', icon: <Baby size={20}/> },
               { ageBn: '৬ সপ্তাহ', ageEn: '6 Weeks', vaccines: 'Pentavalent-1, OPV-1, PCV-1', icon: <Clock size={20}/> },
               { ageBn: '৯ মাস', ageEn: '9 Months', vaccines: 'Measles-Rubella (MR)', icon: <Activity size={20}/> }
             ].map((item, idx) => (
               <div key={idx} className="p-6 flex items-center hover:bg-gray-50 transition-colors">
                  <div className="w-36 shrink-0">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">{isBangla ? 'বয়স' : 'Age'}</p>
                    <p className="font-black text-blue-600 text-lg">{isBangla ? item.ageBn : item.ageEn}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{item.vaccines}</h4>
                      <p className="text-xs text-gray-400 font-medium">{isBangla ? 'নিকটস্থ সরকারি স্বাস্থ্যকেন্দ্রে যোগাযোগ করুন' : 'Contact nearest govt health center'}</p>
                    </div>
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="bg-[#FFF7ED] border border-orange-100 rounded-3xl p-10">
          <h3 className="text-2xl font-black text-orange-900 mb-8 flex items-center gap-3"><AlertCircle size={32} className="text-orange-500" /> {isBangla ? 'শিশুর জরুরি লক্ষণসমূহ' : 'Emergency Child Symptoms'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50 group hover:border-orange-200 transition-all">
                <h4 className="font-black text-gray-800 text-xl mb-3 flex items-center gap-2"><div className="w-2 h-8 bg-red-500 rounded-full"></div> {isBangla ? 'নিউমোনিয়া' : 'Pneumonia'}</h4>
                <p className="text-gray-600 leading-relaxed font-medium">{isBangla ? 'লক্ষণ: শ্বাস নিতে কষ্ট হওয়া, পাঁজরের নিচ দেবে যাওয়া, দ্রুত শ্বাস নেওয়া। করণীয়: দেরি না করে হাসপাতালে নিন।' : 'Symptoms: Fast breathing, chest indrawing, fever. Action: Take to hospital immediately.'}</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50 group hover:border-orange-200 transition-all">
                <h4 className="font-black text-gray-800 text-xl mb-3 flex items-center gap-2"><div className="w-2 h-8 bg-blue-500 rounded-full"></div> {isBangla ? 'ডায়রিয়া' : 'Diarrhea'}</h4>
                <p className="text-gray-600 leading-relaxed font-medium">{isBangla ? 'লক্ষণ: দিনে ৩ বারের বেশি পাতলা পায়খানা। করণীয়: প্রতিবার পায়খানার পর বয়স অনুযায়ী খাবার স্যালাইন দিন।' : 'Symptoms: More than 3 loose stools. Action: Provide age-appropriate saline after each stool.'}</p>
             </div>
          </div>
       </div>
    </div>
  );

  const renderLifestyle = () => (
    <div className="space-y-10 animate-fade-in">
       <div>
          <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3"><Utensils size={24} className="text-green-500" /> {isBangla ? 'পুষ্টি ও ডায়েট' : 'Nutrition & Diet'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full">
                <div className="h-48 bg-gray-500 flex items-center justify-center text-white text-xl font-bold">{isBangla ? 'সুষম বাঙালি খাবার' : 'Balanced Bengali Meal'}</div>
                <div className="p-8">
                   <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-green-500" /> {isBangla ? 'লাল চালের ভাত ও শাকসবজি' : 'Brown Rice & Vegetables'}</li>
                      <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-green-500" /> {isBangla ? 'ছোট মাছ ও ডাল' : 'Small Fish & Lentils'}</li>
                      <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-green-500" /> {isBangla ? 'মৌসুমী ফল' : 'Seasonal Fruits'}</li>
                   </ul>
                </div>
             </div>
             <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full">
                <div className="h-48 bg-gray-500 flex items-center justify-center text-white text-xl font-bold">{isBangla ? 'ডায়াবেটিস ডায়েট' : 'Diabetes Diet'}</div>
                <div className="p-8">
                   <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-green-500" /> {isBangla ? 'চিনি ও মিষ্টি পরিহার করুন' : 'Avoid Sugar & Sweets'}</li>
                      <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-green-500" /> {isBangla ? 'নিয়মিত হাঁটাচলা' : 'Regular Walking'}</li>
                      <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-green-500" /> {isBangla ? 'আঁশযুক্ত খাবার খান' : 'Eat Fiber-rich Foods'}</li>
                   </ul>
                </div>
             </div>
          </div>
       </div>
       <div className="bg-[#EFF6FF] border border-blue-50 rounded-3xl p-10">
          <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3"><Activity size={24} className="text-blue-500" /> {isBangla ? 'ব্যায়াম ও ফিটনেস' : 'Exercise & Fitness'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-8 rounded-3xl text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Clock size={24} /></div>
                <h4 className="font-bold text-gray-800 mb-1">{isBangla ? 'সকালের হাঁটা' : 'Morning Walk'}</h4>
                <p className="text-xs text-gray-400 font-bold">30 min daily</p>
             </div>
             <div className="bg-white p-8 rounded-3xl text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Clock size={24} /></div>
                <h4 className="font-bold text-gray-800 mb-1">{isBangla ? 'যোগব্যায়াম' : 'Yoga'}</h4>
                <p className="text-xs text-gray-400 font-bold">20 min daily</p>
             </div>
             <div className="bg-white p-8 rounded-3xl text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Clock size={24} /></div>
                <h4 className="font-bold text-gray-800 mb-1">{isBangla ? 'ফ্রি হ্যান্ড' : 'Free Hand'}</h4>
                <p className="text-xs text-gray-400 font-bold">15 min daily</p>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">{isBangla ? 'স্বাস্থ্য সেবা' : 'Health Services'}</h1>
          <p className="text-gray-500 text-lg">{isBangla ? 'আপনার এবং আপনার পরিবারের সুস্বাস্থ্যের জন্য নির্ভরযোগ্য তথ্য ও সেবা।' : 'Reliable info for your family.'}</p>
        </div>
        
        <div className="flex justify-center mb-12 overflow-x-auto pb-2 hide-scrollbar">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 flex gap-2">
            <button onClick={() => setActiveTab('diseases')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'diseases' ? 'bg-[#3B82F6] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}><Thermometer size={18}/> {isBangla ? 'রোগের তথ্য' : 'Diseases'}</button>
            <button onClick={() => setActiveTab('access')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'access' ? 'bg-[#3B82F6] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}><Building2 size={18}/> {isBangla ? 'সেবা ও যোগাযোগ' : 'Access'}</button>
            <button onClick={() => setActiveTab('bloodbank')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'bloodbank' ? 'bg-[#3B82F6] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}><Droplets size={18}/> {isBangla ? 'ব্লাড ব্যাংক' : 'Blood Bank'}</button>
            <button onClick={() => setActiveTab('maternal')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'maternal' ? 'bg-[#E11D48] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}><Baby size={18}/> {isBangla ? 'মা ও শিশু' : 'Maternal'}</button>
            <button onClick={() => setActiveTab('lifestyle')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'lifestyle' ? 'bg-[#10B981] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}><Utensils size={18}/> {isBangla ? 'লাইফস্টাইল' : 'Lifestyle'}</button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'diseases' && renderDiseases()}
          {activeTab === 'access' && renderAccess()}
          {activeTab === 'bloodbank' && renderBloodBank()}
          {activeTab === 'maternal' && renderMaternal()}
          {activeTab === 'lifestyle' && renderLifestyle()}
        </div>

        {/* Donor Registration Modal */}
        {activeModal === 'donate' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
               <div className="bg-red-600 p-6 flex justify-between items-center text-white">
                  <h3 className="font-bold text-xl flex items-center gap-3"><Heart size={24}/> {isBangla ? 'রক্তদাতা হিসেবে নিবন্ধন' : 'Register as Donor'}</h3>
                  <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={24}/></button>
               </div>
               <div className="p-8">
                  {donorRegistered ? (
                    <div className="animate-fade-in text-center py-10">
                       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                          <CheckCircle size={48} className="animate-bounce" />
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 mb-2">{isBangla ? 'নিবন্ধন সফল হয়েছে!' : 'Registration Success!'}</h3>
                       <p className="text-gray-500 font-medium mb-8">{isBangla ? 'রক্তদাতা হিসেবে যুক্ত হওয়ার জন্য আপনাকে ধন্যবাদ। আপনার মহানুভবতা জীবন বাঁচাতে পারে।' : 'Thank you for joining as a donor. Your kindness can save lives.'}</p>
                       <Button onClick={() => setActiveModal(null)} className="w-full bg-gray-900 text-white py-4 rounded-2xl shadow-lg">ঠিক আছে</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleDonorRegister} className="space-y-5">
                       <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3 mb-2">
                          <Info size={24} className="text-red-500 shrink-0" />
                          <p className="text-xs text-red-800 leading-relaxed font-medium">
                            {isBangla ? 'নিবন্ধনের পর আপনার রক্তদানের তথ্য জনসমক্ষে প্রদর্শিত হবে যাতে প্রয়োজনে কেউ আপনার সাথে যোগাযোগ করতে পারে।' : 'Your donor information will be publicly visible so that those in need can contact you.'}
                          </p>
                       </div>
                       
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">{isBangla ? 'পূর্ণ নাম' : 'Full Name'}</label>
                          <div className="relative">
                             <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                             <input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-gray-800" value={donorForm.name} onChange={e => setDonorForm({...donorForm, name: e.target.value})} placeholder="Rahim Ahmed" />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">{isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
                             <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold appearance-none cursor-pointer text-black" value={donorForm.group} onChange={e => setDonorForm({...donorForm, group: e.target.value})}>
                                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                             </select>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">{isBangla ? 'জেলা' : 'District'}</label>
                             <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold appearance-none cursor-pointer text-black" value={donorForm.district} onChange={e => setDonorForm({...donorForm, district: e.target.value})}>
                                {DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                             </select>
                          </div>
                       </div>

                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">{isBangla ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                          <div className="relative">
                             <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                             <input required type="tel" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-gray-800" value={donorForm.phone} onChange={e => setDonorForm({...donorForm, phone: e.target.value})} placeholder="017..." />
                          </div>
                       </div>

                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">{isBangla ? 'শেষ রক্তদানের তারিখ' : 'Last Donation Date'}</label>
                          <div className="relative">
                             <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                             <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-gray-800" value={donorForm.lastDonation} onChange={e => setDonorForm({...donorForm, lastDonation: e.target.value})} />
                          </div>
                       </div>

                       <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-200 text-lg flex items-center justify-center gap-3 mt-4">
                          <UserCheck size={24} /> {isBangla ? 'নিবন্ধন সম্পন্ন করুন' : 'Complete Registration'}
                       </Button>
                    </form>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* Health Card Modal */}
        {activeModal === 'health_card' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
               <div className="bg-orange-500 p-6 flex justify-between items-center text-white">
                  <h3 className="font-bold text-xl flex items-center gap-3"><CreditCard size={24}/> {isBangla ? 'ডিজিটাল হেলথ কার্ড' : 'Digital Health Card'}</h3>
                  <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={24}/></button>
               </div>
               <div className="p-8">
                  {cardRegistered ? (
                    <div className="animate-fade-in text-center">
                       <div className="bg-gradient-to-br from-orange-400 to-red-500 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden mb-8 text-left border-4 border-white ring-4 ring-orange-100">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                          <div className="flex justify-between items-start mb-10">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg"><Heart size={20} fill="currentColor" /></div>
                                <span className="font-black tracking-tighter text-sm">HEALTH CARD</span>
                             </div>
                             <Fingerprint size={32} className="opacity-40" />
                          </div>
                          
                          <div className="space-y-4">
                             <h4 className="text-2xl font-black uppercase">{cardInfo.name || 'CITIZEN NAME'}</h4>
                             <div className="flex gap-8">
                                <div><p className="text-[10px] font-bold text-orange-100 uppercase mb-0.5">{isBangla ? 'রক্তের গ্রুপ' : 'BLOOD'}</p><p className="text-xl font-black">{cardInfo.blood}</p></div>
                                <div><p className="text-[10px] font-bold text-orange-100 uppercase mb-0.5">{isBangla ? 'বয়স' : 'AGE'}</p><p className="text-xl font-black">{cardInfo.age} Y</p></div>
                                <div><p className="text-[10px] font-bold text-orange-100 uppercase mb-0.5">ID</p><p className="text-xl font-black font-mono">#DX{Date.now().toString().slice(-4)}</p></div>
                             </div>
                          </div>
                       </div>
                       <Button onClick={() => window.print()} className="bg-gray-900 text-white w-full py-4 rounded-2xl shadow-lg">
                         {isBangla ? 'ডাউনলোড ও প্রিন্ট' : 'Download & Print'}
                       </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleCardRegister} className="space-y-5">
                       <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3 mb-2">
                          <Info size={24} className="text-orange-500 shrink-0" />
                          <p className="text-xs text-orange-800 leading-relaxed">
                            {isBangla ? 'আপনার ডিজিটাল হেলথ কার্ড তৈরি করতে নিচের তথ্যগুলো দিন। এটি আপনার চিকিৎসা সেবা গ্রহণকে আরও সহজ করবে।' : 'Provide the information below to create your digital health card. It will simplify your medical access.'}
                          </p>
                       </div>
                       
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'পূর্ণ নাম' : 'Full Name'}</label>
                          <div className="relative">
                             <User className="absolute left-3 top-3 text-gray-400" size={18} />
                             <input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-black" value={cardInfo.name} onChange={e => setCardInfo({...cardInfo, name: e.target.value})} placeholder="Rahim Ahmed" />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'বয়স' : 'Age'}</label>
                             <input required type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-black" value={cardInfo.age} onChange={e => setCardInfo({...cardInfo, age: e.target.value})} placeholder="25" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
                             <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium appearance-none cursor-pointer text-black" value={cardInfo.blood} onChange={e => setCardInfo({...cardInfo, blood: e.target.value})}>
                                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                             </select>
                          </div>
                       </div>

                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                          <div className="relative">
                             <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                             <input required type="tel" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-medium text-black" value={cardInfo.phone} onChange={e => setCardInfo({...cardInfo, phone: e.target.value})} placeholder="017..." />
                          </div>
                       </div>

                       <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 text-lg">
                          {isBangla ? 'কার্ড তৈরি করুন' : 'Generate Card'}
                       </Button>
                    </form>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeModal === 'view_number' && viewingDonor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
               <div className="bg-red-600 p-5 flex justify-between items-center text-white">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Phone size={18}/> {isBangla ? 'নম্বর দেখতে তথ্য দিন' : 'Information Required'}</h3>
                  <button onClick={() => setActiveModal(null)}><X size={24}/></button>
               </div>
               <div className="p-8">
                  {revealedNumber ? (
                    <div className="text-center animate-fade-in-up">
                       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle size={40} className="animate-bounce" /></div>
                       <p className="text-gray-500 font-bold uppercase text-xs mb-2">{isBangla ? 'রক্তদাতার নম্বর' : 'Donor Phone Number'}</p>
                       <a href={`tel:${revealedNumber}`} className="text-4xl font-black text-gray-900 block mb-6 hover:text-red-600 transition-colors">{revealedNumber}</a>
                       <Button onClick={() => window.open(`tel:${revealedNumber}`)} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 shadow-lg font-bold"><Phone size={18} className="mr-2" /> {isBangla ? 'সরাসরি কল দিন' : 'Call Now'}</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleViewerSubmit} className="space-y-5">
                       <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 mb-2"><Info size={24} className="text-red-500 shrink-0" /><p className="text-xs text-red-800 leading-relaxed">{isBangla ? 'নম্বরটি দেখার আগে আপনার তথ্য প্রদান করুন। অ্যাডমিন আপনার তথ্যগুলো যাচাইয়ের জন্য জমা রাখবে।' : 'Please provide your details to view the donor number. Admin will log these details for security.'}</p></div>
                       <div><label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'আপনার নাম' : 'Your Name'}</label><div className="relative"><UserPlus className="absolute left-3 top-3 text-gray-400" size={18} /><input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium" value={viewerInfo.name} onChange={e => setViewerInfo({...viewerInfo, name: e.target.value})} placeholder="Full Name" /></div></div>
                       <div><label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'আপনার ফোন নম্বর' : 'Your Phone Number'}</label><div className="relative"><Phone className="absolute left-3 top-3 text-gray-400" size={18} /><input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium" value={viewerInfo.phone} onChange={e => setViewerInfo({...viewerInfo, phone: e.target.value})} placeholder="017..." /></div></div>
                       <div><label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'আপনার জেলা' : 'Your District'}</label><div className="relative"><MapPin className="absolute left-3 top-3 text-gray-400" size={18} /><select className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer appearance-none font-medium" value={viewerInfo.district} onChange={e => setViewerInfo({...viewerInfo, district: e.target.value})}>{DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}</select><ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={16} /></div></div>
                       <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 text-lg">{isBangla ? 'নম্বর দেখুন' : 'Show Number'}</Button>
                    </form>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
