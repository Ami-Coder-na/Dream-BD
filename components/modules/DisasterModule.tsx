import React, { useState } from 'react';
import { 
  AlertOctagon, Map, PhoneCall, ShieldAlert, CloudLightning, Home, 
  Waves, Activity, TriangleAlert, CheckCircle, Navigation, Camera, 
  FileText, ChevronRight, Phone, Siren, Info, MapPin, Upload, X
} from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

type Tab = 'dashboard' | 'shelters' | 'guide' | 'report' | 'contacts';
type DisasterType = 'cyclone' | 'flood' | 'earthquake';
type Phase = 'before' | 'during' | 'after';

// --- MOCK DATA ---

const ALERTS = {
  cyclone: {
    active: true,
    signal: 4,
    nameBn: 'ঘূর্ণিঝড় "হামুন"',
    nameEn: 'Cyclone "Hamoon"',
    locationBn: 'চট্টগ্রাম ও কক্সবাজার উপকূল',
    locationEn: 'Chattogram & Cox\'s Bazar Coast',
    updateTime: '10 mins ago'
  },
  flood: {
    active: true,
    statusBn: 'বিপদসীমার উপরে (যমুনা)',
    statusEn: 'Above Danger Level (Jamuna)',
    level: '10.5m',
    trend: 'Rising'
  },
  earthquake: {
    active: false,
    lastBn: '৪.২ মাত্রা (সিলেট)',
    lastEn: '4.2 Mag (Sylhet)',
    time: '2 days ago'
  }
};

const SHELTERS = [
  { id: 1, nameBn: 'মডেল স্কুল আশ্রয়কেন্দ্র', nameEn: 'Model School Shelter', distance: '0.5 km', capacity: 500, type: 'Cyclone' },
  { id: 2, nameBn: 'ইউনিয়ন পরিষদ কমপ্লেক্স', nameEn: 'Union Council Complex', distance: '1.2 km', capacity: 300, type: 'Flood' },
  { id: 3, nameBn: 'পাকা মসজিদ (দোতলা)', nameEn: 'Concrete Mosque (2nd Fl)', distance: '0.8 km', capacity: 200, type: 'General' },
];

const GUIDELINES = {
  cyclone: {
    before: [
      { bn: 'শুকনো খাবার ও পানি সংরক্ষণ করুন', en: 'Stock dry food and water' },
      { bn: 'মোবাইল ও পাওয়ার ব্যাংক চার্জ দিন', en: 'Charge mobile and power bank' },
      { bn: 'গুরুত্বপূর্ণ নথিপত্র পলিথিনে মুড়িয়ে রাখুন', en: 'Wrap important docs in plastic' }
    ],
    during: [
      { bn: 'নিরাপদ আশ্রয়ে বা পাকা ঘরে থাকুন', en: 'Stay in a shelter or concrete house' },
      { bn: 'রেডিও বা টিভিতে খবর শুনুন', en: 'Listen to radio/TV for updates' },
      { bn: 'দরজা-জানালা বন্ধ রাখুন', en: 'Keep windows and doors closed' }
    ],
    after: [
      { bn: 'ছিঁড়ে যাওয়া বৈদ্যুতিক তার স্পর্শ করবেন না', en: 'Do not touch fallen power lines' },
      { bn: 'ক্ষতিগ্রস্ত ঘরবাড়ি পরীক্ষা করুন', en: 'Inspect house for damage' },
      { bn: 'ত্রাণ দলের জন্য অপেক্ষা করুন', en: 'Wait for relief teams' }
    ]
  },
  flood: {
    before: [
      { bn: 'উঁচু স্থানে মাচা তৈরি করুন', en: 'Build platforms on high ground' },
      { bn: 'টিউবওয়েলের মুখ উঁচু করুন', en: 'Raise tubewell head' }
    ],
    during: [
      { bn: 'বন্যার পানি ফুটিয়ে পান করুন', en: 'Boil flood water before drinking' },
      { bn: 'সাপ ও পোকামাকড় থেকে সতর্ক থাকুন', en: 'Beware of snakes and insects' }
    ],
    after: [
      { bn: 'ঘরবাড়ি ব্লিচিং পাউডার দিয়ে পরিষ্কার করুন', en: 'Clean house with bleaching powder' },
      { bn: 'জমে থাকা পানি নিষ্কাশন করুন', en: 'Drain stagnant water' }
    ]
  },
  earthquake: {
    before: [
      { bn: 'ভারী আসবাবপত্র দেয়ালের সাথে আটকে রাখুন', en: 'Secure heavy furniture to walls' },
      { bn: 'আগুন নেভানোর ব্যবস্থা রাখুন', en: 'Keep fire extinguisher ready' }
    ],
    during: [
      { bn: 'ডাক, কাভার ও হোল্ড অন (টেবিলের নিচে)', en: 'Duck, Cover, and Hold On' },
      { bn: 'লিফট ব্যবহার করবেন না', en: 'Do not use elevators' }
    ],
    after: [
      { bn: 'গ্যাস লিক আছে কিনা পরীক্ষা করুন', en: 'Check for gas leaks' },
      { bn: 'আফটার শকের জন্য প্রস্তুত থাকুন', en: 'Be prepared for aftershocks' }
    ]
  }
};

const EMERGENCY_CONTACTS = [
  { nameBn: 'জাতীয় জরুরি সেবা', nameEn: 'National Emergency', number: '999', bg: 'bg-red-600' },
  { nameBn: 'ফায়ার সার্ভিস', nameEn: 'Fire Service', number: '16163', bg: 'bg-orange-500' },
  { nameBn: 'নারী ও শিশু নির্যাতন', nameEn: 'Women & Child Helpline', number: '109', bg: 'bg-pink-600' },
  { nameBn: 'দুর্যোগ আগাম বার্তা', nameEn: 'Disaster Early Warning', number: '1090', bg: 'bg-blue-600' },
];

export const DisasterModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [guideType, setGuideType] = useState<DisasterType>('cyclone');
  const [guidePhase, setGuidePhase] = useState<Phase>('before');
  
  // Report Form State
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportImage, setReportImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportImage(null);
    }, 3000);
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-red-600 text-white rounded-2xl p-6 shadow-lg shadow-red-200 border-4 border-red-500 flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
        <div className="p-4 bg-white/20 rounded-full relative z-10">
           <AlertOctagon size={48} className="animate-bounce" />
        </div>
        <div className="flex-1 relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="bg-white text-red-600 text-xs font-bold px-2 py-1 rounded uppercase animate-pulse">
              {isBangla ? 'সতর্ক সংকেত' : 'Warning Signal'}
            </span>
            <span className="text-red-100 text-xs">{ALERTS.cyclone.updateTime}</span>
          </div>
          <h2 className="text-3xl font-extrabold uppercase tracking-wider mb-2 leading-tight">
            {isBangla ? `${ALERTS.cyclone.nameBn} - সংকেত ৪` : `${ALERTS.cyclone.nameEn} - Signal 4`}
          </h2>
          <p className="text-red-100 text-lg">
            {isBangla ? ALERTS.cyclone.locationBn : ALERTS.cyclone.locationEn}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
             <Waves size={24} />
           </div>
           <div>
             <h4 className="font-bold text-blue-900">{isBangla ? 'বন্যা পরিস্থিতি' : 'Flood Status'}</h4>
             <p className="text-sm font-bold text-red-500 mt-1">
               {isBangla ? ALERTS.flood.statusBn : ALERTS.flood.statusEn}
             </p>
             <p className="text-xs text-blue-600 mt-1">
               Level: {ALERTS.flood.level} ({ALERTS.flood.trend})
             </p>
           </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
           <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shrink-0">
             <Activity size={24} />
           </div>
           <div>
             <h4 className="font-bold text-orange-900">{isBangla ? 'ভূমিকম্প আপডেট' : 'Earthquake Update'}</h4>
             <p className="text-sm text-gray-600 mt-1">
               {isBangla ? `শেষ: ${ALERTS.earthquake.lastBn}` : `Last: ${ALERTS.earthquake.lastEn}`}
             </p>
             <p className="text-xs text-orange-600 mt-1">{ALERTS.earthquake.time}</p>
           </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
           <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
             <MapPin size={24} />
           </div>
           <div>
             <h4 className="font-bold text-green-900">{isBangla ? 'আপনার অবস্থান' : 'Your Location'}</h4>
             <p className="text-sm text-gray-600 mt-1">Dhaka (Safe Zone)</p>
             <p className="text-xs text-green-600 mt-1">{isBangla ? 'বর্তমানে কোনো ঝুঁকি নেই' : 'Currently no major risk'}</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderShelters = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-100 h-64 w-full flex items-center justify-center relative">
           <Map size={48} className="text-gray-400" />
           <span className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded shadow">Map Placeholder</span>
        </div>
        <div className="p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Home size={20} className="text-green-600" />
            {isBangla ? 'নিকটস্থ আশ্রয়কেন্দ্র তালিকা' : 'Nearby Shelter List'}
          </h3>
          <div className="space-y-3">
            {SHELTERS.map((shelter) => (
              <div key={shelter.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                <div>
                  <h4 className="font-bold text-gray-800">{isBangla ? shelter.nameBn : shelter.nameEn}</h4>
                  <div className="flex gap-3 text-xs text-gray-500 mt-1">
                    <span className="bg-white px-2 py-0.5 rounded border">{shelter.type}</span>
                    <span>Cap: {shelter.capacity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
                  <span className="text-green-600 font-bold text-sm whitespace-nowrap">{shelter.distance}</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                     <Navigation size={14} className="mr-1" /> {isBangla ? 'পথ' : 'Route'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGuide = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShieldAlert className="text-orange-600" />
          {isBangla ? 'দুর্যোগ প্রস্তুতি গাইডলাইন' : 'Disaster Prep Guidelines'}
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { id: 'cyclone', labelBn: 'ঘূর্ণিঝড়', labelEn: 'Cyclone', icon: <CloudLightning size={16}/> },
            { id: 'flood', labelBn: 'বন্যা', labelEn: 'Flood', icon: <Waves size={16}/> },
            { id: 'earthquake', labelBn: 'ভূমিকম্প', labelEn: 'Earthquake', icon: <Activity size={16}/> },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setGuideType(type.id as DisasterType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                guideType === type.id 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.icon} {isBangla ? type.labelBn : type.labelEn}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {GUIDELINES[guideType][guidePhase].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-gray-800 font-medium">
                {isBangla ? item.bn : item.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-red-50/30 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-bold mb-4 border border-red-200">
            <ShieldAlert size={16} />
            {isBangla ? 'দুর্যোগ ব্যবস্থাপনা' : 'Disaster Management'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'সতর্ক থাকুন, নিরাপদ থাকুন' : 'Stay Alert, Stay Safe'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'ঘূর্ণিঝড়, বন্যা বা ভূমিকম্প—যেকোনো দুর্যোগের আগাম তথ্য ও প্রস্তুতি।' 
              : 'Early warnings and preparation for Cyclone, Flood, or Earthquake.'}
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-center gap-1">
            {[
              { id: 'dashboard', icon: <Activity size={16} />, labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard' },
              { id: 'guide', icon: <FileText size={16} />, labelBn: 'গাইড', labelEn: 'Guide' },
              { id: 'shelters', icon: <Home size={16} />, labelBn: 'আশ্রয়কেন্দ্র', labelEn: 'Shelters' },
              { id: 'report', icon: <Camera size={16} />, labelBn: 'রিপোর্ট', labelEn: 'Report' },
              { id: 'contacts', icon: <PhoneCall size={16} />, labelBn: 'যোগাযোগ', labelEn: 'Contacts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{isBangla ? tab.labelBn : tab.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'shelters' && renderShelters()}
          {activeTab === 'guide' && renderGuide()}
          {activeTab === 'report' && (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in">
               <Camera size={48} className="mx-auto mb-4 text-gray-300" />
               <p className="text-gray-500 font-bold">{isBangla ? 'রিপোর্ট সিস্টেম শীঘ্রই আসছে' : 'Reporting system coming soon'}</p>
            </div>
          )}
          {activeTab === 'contacts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {EMERGENCY_CONTACTS.map((c, i) => (
                <div key={i} className={`${c.bg} p-6 rounded-2xl text-white shadow-lg flex justify-between items-center`}>
                   <div><h4 className="font-bold text-lg">{isBangla ? c.nameBn : c.nameEn}</h4><p className="text-2xl font-black">{c.number}</p></div>
                   <Phone size={32} className="opacity-40" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};