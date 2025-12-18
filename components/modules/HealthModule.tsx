
import React, { useState } from 'react';
import { 
  HeartPulse, Calendar, Phone, MapPin, Star, UserPlus, 
  Thermometer, Activity, Baby, Utensils, AlertCircle, 
  Search, ChevronRight, Droplets, ShieldCheck, Stethoscope,
  Info, Clock, ChevronDown, Check, Building2, X, Eye, CheckCircle, Heart, Siren, Pill
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

export const HealthModule: React.FC<Props> = ({ isBangla }) => {
  const { donors, addDonorViewLog } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('diseases');
  const [hospitalDistrict, setHospitalDistrict] = useState('Dhaka');
  const [pregnancyWeek, setPregnancyWeek] = useState(8);
  const [activeModal, setActiveModal] = useState<'donate' | 'view_number' | null>(null);

  // Blood View Flow State
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
         <div className="bg-[#FFF7ED] p-8 rounded-2xl border border-orange-50 text-center hover:shadow-md transition-all group cursor-pointer">
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
             <Button onClick={() => setActiveModal('donate')} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-9 mt-3">{isBangla ? 'নিবন্ধন করুন' : 'Register Now'}</Button>
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
          <div className="mb-10 px-4">
             <label className="block text-sm font-bold text-gray-600 mb-4">{isBangla ? 'বর্তমান সপ্তাহ নির্বাচন করুন:' : 'Select Current Week:'} <span className="text-pink-600 text-lg">{pregnancyWeek}</span></label>
             <input type="range" min="1" max="40" className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600" value={pregnancyWeek} onChange={(e) => setPregnancyWeek(parseInt(e.target.value))} />
             <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase"><span>Week 1</span><span>Week 40</span></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-pink-50 flex gap-6 items-center">
             <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 font-bold text-lg shrink-0">{pregnancyWeek}</div>
             <div>
                <h4 className="font-bold text-gray-800 mb-1">{isBangla ? 'পরামর্শ' : 'Advice'}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{isBangla ? 'শিশুর হৃদস্পন্দন শুরু হয়। মায়ের বমি বমি ভাব হতে পারে।' : "Baby's heartbeat starts. Mother may experience nausea."}</p>
             </div>
          </div>
       </div>

       <div className="bg-white p-2 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle size={20} className="text-blue-500" />
            {isBangla ? 'টিকা ক্যালেন্ডার (EPI)' : 'Vaccination Calendar (EPI)'}
          </h3>
          <div className="space-y-4">
             {[
               { ageBn: 'জন্মের সময়', ageEn: 'At Birth', vaccines: 'BCG, OPV-0, HepB-0' },
               { ageBn: '৬ সপ্তাহ', ageEn: '6 Weeks', vaccines: 'Pentavalent-1, OPV-1, PCV-1' },
               { ageBn: '৯ মাস', ageEn: '9 Months', vaccines: 'Measles-Rubella (MR)' }
             ].map((item, idx) => (
               <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center shadow-sm">
                  <div className="w-32">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">{isBangla ? 'বয়স' : 'Age'}</p>
                    <p className="font-bold text-blue-600 text-lg">{isBangla ? item.ageBn : item.ageEn}</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">{item.vaccines}</h4>
                    <p className="text-xs text-gray-400">{isBangla ? 'নিকটস্থ স্বাস্থ্যকেন্দ্রে যান' : 'Visit nearest health center'}</p>
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="bg-[#FFF7ED] border border-orange-100 rounded-3xl p-10">
          <h3 className="text-xl font-bold text-orange-900 mb-8 flex items-center gap-3"><AlertCircle size={24} className="text-orange-500" /> {isBangla ? 'শিশুর সাধারণ রোগ ও প্রতিকার' : 'Common Child Diseases'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h4 className="font-bold text-gray-800 text-lg mb-3">{isBangla ? 'নিউমোনিয়া' : 'Pneumonia'}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{isBangla ? 'লক্ষণ: শ্বাসকষ্ট, জ্বর। প্রতিকার: দ্রুত হাসপাতালে নিন।' : 'Symptoms: Breathing difficulty, fever. Action: Take to hospital immediately.'}</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h4 className="font-bold text-gray-800 text-lg mb-3">{isBangla ? 'ডায়রিয়া' : 'Diarrhea'}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{isBangla ? 'লক্ষণ: পানিশূন্যতা। প্রতিকার: প্রতিবার পায়খানার পর স্যালাইন।' : 'Symptoms: Dehydration. Action: Provide saline after every stool.'}</p>
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
