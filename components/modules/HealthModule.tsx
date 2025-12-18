
import React, { useState, useRef } from 'react';
import { 
  HeartPulse, Calendar, Phone, MapPin, Star, UserPlus, 
  Thermometer, Activity, Baby, Utensils, AlertCircle, 
  Search, ChevronRight, Droplets, ShieldCheck, Stethoscope,
  Info, Clock, ChevronDown, Check, Building2, X, Copy, Printer, Share2, Loader2, Edit3, Download,
  Filter, User as UserIcon, Eye, CheckCircle, Heart, Siren, Pill, HeartHandshake, Contact2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

type Tab = 'diseases' | 'access' | 'bloodbank' | 'maternal' | 'lifestyle';

// --- MOCK DATA FOR TABS ---
const DISEASES_DB = [
  { id: 1, nameBn: 'ডেঙ্গু জ্বর', nameEn: 'Dengue Fever', riskLevel: 'High', season: 'Monsoon', symptomsBn: 'উচ্চ জ্বর, তীব্র মাথা ব্যথা, চোখের পেছনে ব্যথা, শরীরে র‍্যাশ।', symptomsEn: 'High fever, severe headache, pain behind eyes, body rash.', image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289' },
  { id: 2, nameBn: 'নিউমোনিয়া', nameEn: 'Pneumonia', riskLevel: 'Medium', season: 'Winter', symptomsBn: 'কাশি, শ্বাসকষ্ট, জ্বর, বুকে ব্যথা।', symptomsEn: 'Cough, shortness of breath, fever, chest pain.', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8' },
  { id: 3, nameBn: 'ডায়রিয়া', nameEn: 'Diarrhea', riskLevel: 'Medium', season: 'Summer/Monsoon', symptomsBn: 'পাতলা পায়খানা, বমি, পানিশূন্যতা।', symptomsEn: 'Loose motion, vomiting, dehydration.', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f' }
];

const HOSPITALS_DB = [
  { id: 1, name: 'Dhaka Medical College Hospital', address: 'Secretariat Road, Dhaka', phone: '02-55165088', district: 'Dhaka' },
  { id: 2, name: 'Bangabandhu Sheikh Mujib Medical...', address: 'Shahbag, Dhaka', phone: '02-9661051', district: 'Dhaka' },
  { id: 3, name: 'Square Hospital', address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath', phone: '10616', district: 'Dhaka' },
  { id: 4, name: 'Evercare Hospital', address: 'Plot 81, Block E, Bashundhara R/A', phone: '10678', district: 'Dhaka' },
  { id: 5, name: 'Kurmitola General Hospital', address: 'Tong-Ashulia Road, Dhaka Cantonment', phone: '02-8712345', district: 'Dhaka' },
  { id: 6, name: 'United Hospital', address: 'Plot 15, Road 71, Gulshan', phone: '10666', district: 'Dhaka' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DISTRICT_LIST = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Feni', 'Bogra', 'Jessore'];

export const HealthModule: React.FC<Props> = ({ isBangla }) => {
  const { donors, addDonorViewLog } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('diseases');
  const [hospitalDistrict, setHospitalDistrict] = useState('Dhaka');
  const [pregnancyWeek, setPregnancyWeek] = useState(8);
  const [activeModal, setActiveModal] = useState<'donate' | 'view_number' | null>(null);

  // --- BLOOD VIEW FLOW STATE ---
  const [viewingDonor, setViewingDonor] = useState<any>(null);
  const [viewerInfo, setViewerInfo] = useState({ name: '', phone: '', district: 'Dhaka' });
  const [revealedNumber, setRevealedNumber] = useState<string | null>(null);

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

  // --- RENDER TABS ---

  const renderDiseases = () => (
    <div className="space-y-10 animate-fade-in">
      {/* Seasonal Tracker */}
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

      {/* Disease Cards */}
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
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                {isBangla ? disease.symptomsBn : disease.symptomsEn}
              </p>
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
      {/* Emergency Banner */}
      <div className="bg-red-50/50 border border-red-100 rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-inner">
             <Phone size={32} />
           </div>
           <div>
             <h2 className="text-3xl font-black text-gray-900 mb-2">{isBangla ? 'জরুরী সেবা' : 'Emergency Services'}</h2>
             <p className="text-red-600 font-bold text-lg">{isBangla ? 'অ্যাম্বুলেন্স বা রক্তের প্রয়োজনে কল করুন' : 'Call for Ambulance or Blood Emergency'}</p>
           </div>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <a href="tel:999" className="flex-1 md:flex-none inline-flex items-center justify-center gap-3 bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95">
              <Phone size={24} /> 999
            </a>
            <button onClick={() => setActiveTab('bloodbank')} className="flex-1 md:flex-none inline-flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-95">
              <Droplets size={24} className="text-red-500" /> {isBangla ? 'রক্তদাতা খুঁজুন' : 'Find Donor'}
            </button>
         </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 text-center hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
               <Building2 size={32} />
            </div>
            <h4 className="font-bold text-gray-900">{isBangla ? 'হাসপাতাল খুঁজুন' : 'Find Hospital'}</h4>
         </div>
         <div className="bg-green-50/50 p-8 rounded-[2rem] border border-green-100 text-center hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm group-hover:scale-110 transition-transform">
               <Pill size={32} />
            </div>
            <h4 className="font-bold text-gray-900">{isBangla ? 'ফার্মেসী' : 'Pharmacy'}</h4>
         </div>
         <div className="bg-purple-50/50 p-8 rounded-[2rem] border border-purple-100 text-center hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
               <ShieldCheck size={32} />
            </div>
            <h4 className="font-bold text-gray-900">{isBangla ? 'সরকারি স্কিম' : 'Govt Schemes'}</h4>
         </div>
         <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100 text-center hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
               <UserPlus size={32} />
            </div>
            <h4 className="font-bold text-gray-900">{isBangla ? 'হেলথ কার্ড' : 'Health Card'}</h4>
         </div>
      </div>

      {/* Hospital Directory */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
               <Building2 size={28} className="text-teal-600" />
               {isBangla ? 'হাসপাতাল ডিরেক্টরি' : 'Hospital Directory'}
            </h3>
            <div className="relative w-full md:w-64">
               <select 
                 className="w-full pl-4 pr-10 py-3 bg-teal-50/50 border border-teal-100 rounded-xl font-bold text-teal-800 outline-none appearance-none cursor-pointer"
                 value={hospitalDistrict}
                 onChange={(e) => setHospitalDistrict(e.target.value)}
               >
                  {DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600" size={18} />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOSPITALS_DB.map(hosp => (
               <div key={hosp.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
                  <h4 className="font-black text-gray-900 text-lg mb-2 group-hover:text-teal-600 transition-colors">{hosp.name}</h4>
                  <p className="text-sm text-gray-500 mb-6 flex items-start gap-2"><MapPin size={16} className="shrink-0 text-red-400 mt-0.5" /> {hosp.address}</p>
                  <a href={`tel:${hosp.phone}`} className="mt-auto flex items-center justify-center gap-2 bg-teal-50/50 text-teal-700 font-bold py-3 rounded-xl hover:bg-teal-600 hover:text-white transition-all">
                     <Phone size={16} /> {hosp.phone}
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
              <Filter size={18} className="text-red-500" />
              {isBangla ? 'ফিল্টার' : 'Filter Donors'}
            </h3>
            <div className="space-y-4">
              <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 py-2.5 pl-3 pr-8 rounded-xl text-sm outline-none">
                <option value="All">{isBangla ? 'সব জেলা' : 'All Districts'}</option>
                {DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(grp => (
                  <button key={grp} className="py-1.5 text-xs rounded-lg border font-bold bg-white text-gray-600 border-gray-200 hover:border-red-300">
                    {grp}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
             <UserPlus size={24} className="mx-auto mb-3 text-red-500" />
             <h4 className="font-bold text-red-900 mb-1">{isBangla ? 'রক্তদাতা হোন' : 'Become a Donor'}</h4>
             <Button onClick={() => setActiveModal('donate')} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-9 mt-3">
               {isBangla ? 'নিবন্ধন করুন' : 'Register Now'}
             </Button>
          </div>
        </aside>

        <main className="w-full lg:w-3/4">
           <h3 className="font-bold text-gray-800 text-lg mb-4">
             {isBangla ? 'রক্তদাতার তালিকা' : 'Donor List'} 
             <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{donors.length}</span>
           </h3>
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
                     <button 
                       onClick={() => handleOpenViewNumber(donor)}
                       className="flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md shadow-red-100"
                     >
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
       {/* Pregnancy Tracker */}
       <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-pink-50">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
             <Baby size={32} className="text-pink-500" />
             {isBangla ? 'গর্ভাবস্থা ট্র্যাকার' : 'Pregnancy Tracker'}
          </h3>
          <div className="mb-10 px-4">
             <label className="block text-sm font-bold text-gray-600 mb-4">{isBangla ? 'বর্তমান সপ্তাহ নির্বাচন করুন:' : 'Select Current Week:'} <span className="text-pink-600 text-lg">{pregnancyWeek}</span></label>
             <input 
               type="range" min="1" max="40" 
               className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600" 
               value={pregnancyWeek} 
               onChange={(e) => setPregnancyWeek(parseInt(e.target.value))}
             />
             <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
                <span>Week 1</span>
                <span>Week 40</span>
             </div>
          </div>
          <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100 flex gap-6 items-start">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-pink-600 font-black text-2xl shadow-sm shrink-0">{pregnancyWeek}</div>
             <div>
                <h4 className="font-bold text-pink-900 text-lg mb-1">{isBangla ? 'পরামর্শ' : 'Recommendation'}</h4>
                <p className="text-pink-800 leading-relaxed">
                   {isBangla ? 'শিশুর হৃদস্পন্দন শুরু হয়। মায়ের বমি বমি ভাব হতে পারে।' : 'Baby\'s heartbeat begins. Mother may experience nausea.'}
                </p>
             </div>
          </div>
       </div>

       {/* Vaccination Calendar */}
       <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
             <ShieldCheck size={32} className="text-blue-500" />
             {isBangla ? 'টিকা ক্যালেন্ডার (EPI)' : 'Vaccination Calendar (EPI)'}
          </h3>
          <div className="space-y-4">
             {[
               { ageBn: 'জন্মের সময়', ageEn: 'At Birth', vaccines: 'BCG, OPV-0, HepB-0' },
               { ageBn: '৬ সপ্তাহ', ageEn: '6 Weeks', vaccines: 'Pentavalent-1, OPV-1, PCV-1' },
               { ageBn: '৯ মাস', ageEn: '9 Months', vaccines: 'Measles-Rubella (MR)' }
             ].map((item, idx) => (
               <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-blue-50/30 transition-colors">
                  <div className="flex items-center gap-6">
                     <div className="bg-white px-4 py-2 rounded-xl text-blue-600 font-bold text-center border border-blue-50 shadow-sm">
                        <p className="text-[10px] uppercase opacity-50">{isBangla ? 'বয়স' : 'Age'}</p>
                        <p className="text-sm">{isBangla ? item.ageBn : item.ageEn}</p>
                     </div>
                     <div>
                        <h4 className="font-black text-gray-900 text-lg">{item.vaccines}</h4>
                        <p className="text-xs text-gray-500">{isBangla ? 'নিকটস্থ স্বাস্থ্যকেন্দ্রে যান' : 'Visit nearest health center'}</p>
                     </div>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
               </div>
             ))}
          </div>
       </div>

       {/* Child Diseases */}
       <div className="bg-orange-50/30 border border-orange-100 rounded-[2.5rem] p-10">
          <h3 className="text-2xl font-bold text-orange-900 mb-8 flex items-center gap-3">
             <AlertCircle size={32} className="text-orange-500" />
             {isBangla ? 'শিশুর সাধারণ রোগ ও প্রতিকার' : 'Common Child Diseases'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50">
                <h4 className="font-black text-gray-900 text-xl mb-3">{isBangla ? 'নিউমোনিয়া' : 'Pneumonia'}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{isBangla ? 'লক্ষণ: শ্বাসকষ্ট, জ্বর। প্রতিকার: দ্রুত হাসপাতালে নিন।' : 'Symptoms: Breathing difficulty, fever. Action: Take to hospital immediately.'}</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50">
                <h4 className="font-black text-gray-900 text-xl mb-3">{isBangla ? 'ডায়রিয়া' : 'Diarrhea'}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{isBangla ? 'লক্ষণ: পানিশূন্যতা। প্রতিকার: প্রতিবার পায়খানার পর স্যালাইন।' : 'Symptoms: Dehydration. Action: Provide saline after every stool.'}</p>
             </div>
          </div>
       </div>
    </div>
  );

  const renderLifestyle = () => (
    <div className="space-y-10 animate-fade-in">
       {/* Nutrition Section */}
       <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
             <Utensils size={32} className="text-green-500" />
             {isBangla ? 'পুষ্টি ও ডায়েট' : 'Nutrition & Diet'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                <div className="h-48 bg-gray-400 flex items-center justify-center text-white text-2xl font-black">{isBangla ? 'সুষম বাঙালি খাবার' : 'Balanced Bengali Meal'}</div>
                <div className="p-8">
                   <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700"><CheckCircle size={18} className="text-green-500" /> {isBangla ? 'লাল চালের ভাত ও শাকসবজি' : 'Brown Rice & Vegetables'}</li>
                      <li className="flex items-center gap-3 text-gray-700"><CheckCircle size={18} className="text-green-500" /> {isBangla ? 'ছোট মাছ ও ডাল' : 'Small Fish & Lentils'}</li>
                      <li className="flex items-center gap-3 text-gray-700"><CheckCircle size={18} className="text-green-500" /> {isBangla ? 'মৌসুমী ফল' : 'Seasonal Fruits'}</li>
                   </ul>
                </div>
             </div>
             <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                <div className="h-48 bg-gray-500 flex items-center justify-center text-white text-2xl font-black">{isBangla ? 'ডায়াবেটিস ডায়েট' : 'Diabetes Diet'}</div>
                <div className="p-8">
                   <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700"><CheckCircle size={18} className="text-green-500" /> {isBangla ? 'চিনি ও মিষ্টি পরিহার করুন' : 'Avoid Sugar & Sweets'}</li>
                      <li className="flex items-center gap-3 text-gray-700"><CheckCircle size={18} className="text-green-500" /> {isBangla ? 'নিয়মিত হাঁটাচলা' : 'Regular Walking'}</li>
                      <li className="flex items-center gap-3 text-gray-700"><CheckCircle size={18} className="text-green-500" /> {isBangla ? 'আঁশযুক্ত খাবার খান' : 'Eat Fiber-rich Foods'}</li>
                   </ul>
                </div>
             </div>
          </div>
       </div>

       {/* Fitness Section */}
       <div className="bg-blue-50/50 border border-blue-100 rounded-[2.5rem] p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
             <Activity size={32} className="text-blue-500" />
             {isBangla ? 'ব্যায়াম ও ফিটনেস' : 'Exercise & Fitness'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-8 rounded-3xl border border-blue-50 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Clock size={24} /></div>
                <h4 className="font-black text-gray-900 mb-1">{isBangla ? 'সকালের হাঁটা' : 'Morning Walk'}</h4>
                <p className="text-xs text-gray-400 font-bold">30 min daily</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-blue-50 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Clock size={24} /></div>
                <h4 className="font-black text-gray-900 mb-1">{isBangla ? 'যোগব্যায়াম' : 'Yoga'}</h4>
                <p className="text-xs text-gray-400 font-bold">20 min daily</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-blue-50 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Clock size={24} /></div>
                <h4 className="font-black text-gray-900 mb-1">{isBangla ? 'ফ্রি হ্যান্ড' : 'Free Hand'}</h4>
                <p className="text-xs text-gray-400 font-bold">15 min daily</p>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-teal-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold mb-4 border border-teal-200">
            <Heart size={14} fill="currentColor" />
            {isBangla ? 'সুস্থ জীবন, সুন্দর আগামী' : 'Healthy Life, Better Future'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            {isBangla ? 'স্বাস্থ্য সেবা' : 'Health Services'}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {isBangla ? 'আপনার এবং আপনার পরিবারের সুস্বাস্থ্যের জন্য নির্ভরযোগ্য তথ্য ও সেবা।' : 'Reliable information and services for the health of you and your family.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-2 hide-scrollbar">
          <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 flex gap-2">
            {[
              { id: 'diseases', icon: <Thermometer size={18}/>, label: isBangla ? 'রোগের তথ্য' : 'Diseases', color: 'teal' },
              { id: 'access', icon: <Building2 size={18}/>, label: isBangla ? 'সেবা ও যোগাযোগ' : 'Access', color: 'blue' },
              { id: 'bloodbank', icon: <Droplets size={18}/>, label: isBangla ? 'ব্লাড ব্যাংক' : 'Blood Bank', color: 'red' },
              { id: 'maternal', icon: <Baby size={18}/>, label: isBangla ? 'মা ও শিশু' : 'Maternal', color: 'pink' },
              { id: 'lifestyle', icon: <Utensils size={18}/>, label: isBangla ? 'লাইফস্টাইল' : 'Lifestyle', color: 'green' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)} 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? `bg-${tab.color}-600 text-white shadow-lg` 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'diseases' && renderDiseases()}
          {activeTab === 'access' && renderAccess()}
          {activeTab === 'bloodbank' && renderBloodBank()}
          {activeTab === 'maternal' && renderMaternal()}
          {activeTab === 'lifestyle' && renderLifestyle()}
        </div>

        {/* View Number Privacy Modal */}
        {activeModal === 'view_number' && viewingDonor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
               <div className="bg-red-600 p-5 flex justify-between items-center text-white">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Phone size={18}/> {isBangla ? 'নম্বর দেখতে তথ্য দিন' : 'Information Required'}</h3>
                  <button onClick={() => setActiveModal(null)}><X size={24}/></button>
               </div>
               
               <div className="p-8">
                  {revealedNumber ? (
                    <div className="text-center animate-fade-in-up">
                       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                          <CheckCircle size={40} className="animate-bounce" />
                       </div>
                       <p className="text-gray-500 font-bold uppercase text-xs mb-2">{isBangla ? 'রক্তদাতার নম্বর' : 'Donor Phone Number'}</p>
                       <a href={`tel:${revealedNumber}`} className="text-4xl font-black text-gray-900 block mb-6 hover:text-red-600 transition-colors">{revealedNumber}</a>
                       <Button onClick={() => window.open(`tel:${revealedNumber}`)} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 shadow-lg font-bold">
                          <Phone size={18} className="mr-2" /> {isBangla ? 'সরাসরি কল দিন' : 'Call Now'}
                       </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleViewerSubmit} className="space-y-5">
                       <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 mb-2">
                          <Info size={24} className="text-red-500 shrink-0" />
                          <p className="text-xs text-red-800 leading-relaxed">
                            {isBangla ? 'নম্বরটি দেখার আগে আপনার তথ্য প্রদান করুন। অ্যাডমিন আপনার তথ্যগুলো যাচাইয়ের জন্য জমা রাখবে।' : 'Please provide your details to view the donor number. Admin will log these details for security.'}
                          </p>
                       </div>
                       
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'আপনার নাম' : 'Your Name'}</label>
                          <div className="relative">
                             <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                             <input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium" value={viewerInfo.name} onChange={e => setViewerInfo({...viewerInfo, name: e.target.value})} placeholder="Full Name" />
                          </div>
                       </div>
                       
                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'আপনার ফোন নম্বর' : 'Your Phone Number'}</label>
                          <div className="relative">
                             <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                             <input required type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium" value={viewerInfo.phone} onChange={e => setViewerInfo({...viewerInfo, phone: e.target.value})} placeholder="017..." />
                          </div>
                       </div>

                       <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'আপনার জেলা' : 'Your District'}</label>
                          <div className="relative">
                             <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                             <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer appearance-none font-medium" value={viewerInfo.district} onChange={e => setViewerInfo({...viewerInfo, district: e.target.value})}>
                                {DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                             </select>
                             <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={16} />
                          </div>
                       </div>

                       <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 text-lg">
                          {isBangla ? 'নম্বর দেখুন' : 'Show Number'}
                       </Button>
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
