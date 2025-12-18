
import React, { useState, useRef } from 'react';
import { 
  HeartPulse, Calendar, Phone, MapPin, Star, UserPlus, 
  Thermometer, Activity, Baby, Utensils, AlertCircle, 
  Search, ChevronRight, Droplets, ShieldCheck, Stethoscope,
  Info, Clock, ChevronDown, Check, Building2, X, Copy, Printer, Share2, Loader2, Edit3, Download,
  Filter, User as UserIcon, Eye, CheckCircle, Heart
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

type Tab = 'diseases' | 'access' | 'bloodbank' | 'maternal' | 'lifestyle';

const DISEASES_DB = [
  { id: 1, nameBn: 'ডেঙ্গু জ্বর', nameEn: 'Dengue Fever', riskLevel: 'High', season: 'Monsoon', symptomsBn: 'উচ্চ জ্বর, তীব্র মাথা ব্যথা, চোখের পেছনে ব্যথা, শরীরে র‍্যাশ।', symptomsEn: 'High fever, severe headache, pain behind eyes, body rash.', image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289' },
  { id: 2, nameBn: 'নিউমোনিয়া', nameEn: 'Pneumonia', riskLevel: 'Medium', season: 'Winter', symptomsBn: 'কাশি, শ্বাসকষ্ট, জ্বর, বুকে ব্যথা।', symptomsEn: 'Cough, shortness of breath, fever, chest pain.', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8' },
  { id: 3, nameBn: 'ডায়রিয়া', nameEn: 'Diarrhea', riskLevel: 'Medium', season: 'Summer/Monsoon', symptomsBn: 'পাতলা পায়খানা, বমি, পানিশূন্যতা।', symptomsEn: 'Loose motion, vomiting, dehydration.', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f' }
];

const DISTRICT_LIST = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Feni', 'Bogra', 'Jessore'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const HealthModule: React.FC<Props> = ({ isBangla }) => {
  const { donors, addDonorViewLog } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('diseases');
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
      {/* Tracker Section */}
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

      {/* Disease Cards Grid */}
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

      <div className="flex justify-center mt-8">
        <Button variant="secondary" className="rounded-xl px-8 flex items-center gap-2">
           <ChevronDown size={18} /> {isBangla ? 'আরও দেখুন' : 'View More'}
        </Button>
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

  return (
    <div className="min-h-screen bg-teal-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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

        <div className="flex justify-center mb-12 overflow-x-auto pb-2 hide-scrollbar">
          <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 flex gap-2">
            <button onClick={() => setActiveTab('diseases')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'diseases' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}><Thermometer size={18}/> {isBangla ? 'রোগের তথ্য' : 'Diseases'}</button>
            <button onClick={() => setActiveTab('access')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'access' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}><Building2 size={18}/> {isBangla ? 'সেবা ও যোগাযোগ' : 'Access'}</button>
            <button onClick={() => setActiveTab('bloodbank')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'bloodbank' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}><Droplets size={18}/> {isBangla ? 'ব্লাড ব্যাংক' : 'Blood Bank'}</button>
            <button onClick={() => setActiveTab('maternal')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'maternal' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}><Baby size={18}/> {isBangla ? 'মা ও শিশু' : 'Maternal'}</button>
            <button onClick={() => setActiveTab('lifestyle')} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'lifestyle' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}><Utensils size={18}/> {isBangla ? 'লাইফস্টাইল' : 'Lifestyle'}</button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'diseases' && renderDiseases()}
          {activeTab === 'bloodbank' && renderBloodBank()}
          {(activeTab === 'access' || activeTab === 'maternal' || activeTab === 'lifestyle') && (
            <div className="bg-white p-12 text-center rounded-[2.5rem] border border-gray-100 shadow-sm animate-fade-in">
              <Stethoscope size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{isBangla ? 'শীঘ্রই আসছে' : 'Coming Soon'}</h3>
              <p className="text-gray-500">{isBangla ? 'এই বিভাগের তথ্যসমূহ নিয়মিত আপডেট করা হচ্ছে।' : 'Information for this section is being updated regularly.'}</p>
            </div>
          )}
        </div>

        {/* View Number Information Modal */}
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
