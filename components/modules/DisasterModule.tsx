import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, PhoneCall, ShieldAlert, CloudLightning, 
  Waves, Activity, FileText, Phone, MapPin, Clock, Search, ChevronDown
} from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

type Tab = 'dashboard' | 'guide' | 'contacts';
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
  const [earthquakes, setEarthquakes] = useState<any[]>([]);
  const [loadingQuakes, setLoadingQuakes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const fetchQuakes = async () => {
        setLoadingQuakes(true);
        try {
          // Fetch earthquakes > 4.0 mag in the last 7 days, surrounding Bangladesh (approx 23.8, 90.4) within 2000km
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${sevenDaysAgo}&minmagnitude=4&latitude=23.8103&longitude=90.4125&maxradiuskm=2000&orderby=time&limit=50`;
          
          const response = await fetch(url);
          const data = await response.json();
          setEarthquakes(data.features || []);
        } catch (error) {
          console.error("Failed to fetch earthquakes", error);
        } finally {
          setLoadingQuakes(false);
        }
      };
      fetchQuakes();
    }
  }, [activeTab]);

  const filteredQuakes = earthquakes.filter(eq => 
    eq.properties.place.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedQuakes = filteredQuakes.slice(0, visibleCount);

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Live Earthquake Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
         <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
           <Activity className="text-orange-600" />
           {isBangla ? 'সাম্প্রতিক ভূমিকম্প (লাইভ আপডেট)' : 'Recent Earthquakes (Live Update)'}
         </h3>
         
         <div className="mb-6 relative">
            <input 
              type="text" 
              placeholder={isBangla ? "দেশ বা জায়গার নাম দিয়ে খুঁজুন..." : "Search by country or place..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
         </div>

         {loadingQuakes ? (
           <div className="py-12 text-center text-gray-400 animate-pulse flex flex-col items-center">
             <Activity className="mb-2 animate-spin" />
             <p>{isBangla ? 'তথ্য লোড হচ্ছে...' : 'Loading live data...'}</p>
           </div>
         ) : displayedQuakes.length > 0 ? (
           <>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {displayedQuakes.map((eq) => (
                 <div key={eq.id} className="flex items-center gap-4 p-4 rounded-xl border border-orange-100 bg-orange-50 hover:bg-orange-100 transition-colors">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0 ${eq.properties.mag >= 5 ? 'bg-red-500' : 'bg-orange-500'}`}>
                     {eq.properties.mag.toFixed(1)}
                   </div>
                   <div className="min-w-0">
                     <h4 className="font-bold text-gray-900 text-sm truncate" title={eq.properties.place}>{eq.properties.place}</h4>
                     <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                       <Clock size={10} />
                       {new Date(eq.properties.time).toLocaleString(isBangla ? 'bn-BD' : 'en-US')}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
             
             {visibleCount < filteredQuakes.length && (
                <div className="mt-6 text-center">
                   <Button onClick={handleSeeMore} variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                      {isBangla ? 'আরও দেখুন' : 'See More'} <ChevronDown size={16} className="ml-1" />
                   </Button>
                </div>
             )}
           </>
         ) : (
           <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
             <Activity className="mx-auto mb-2 opacity-20" size={32} />
             <p>{isBangla ? 'কোন তথ্য পাওয়া যায়নি।' : 'No data found matching your search.'}</p>
           </div>
         )}
         <p className="text-[10px] text-gray-400 mt-4 text-right italic">
            Source: USGS (United States Geological Survey)
         </p>
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
          {activeTab === 'guide' && renderGuide()}
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