
import React, { useState, useMemo } from 'react';
import { 
  Bus, Train, Ship, MapPin, Search, ArrowRight, Navigation, Clock, 
  AlertTriangle, Shield, Phone, Truck, Ticket, Info, ExternalLink,
  Siren, Map, RefreshCw, Filter, Calculator
} from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

type TransportMode = 'bus' | 'train' | 'launch';
type TransportTab = 'routes' | 'traffic' | 'safety' | 'logistics';

// --- STATIC DATA ---

const ROUTES_DB = [
  { id: 1, mode: 'bus', operator: 'Hanif Enterprise', route: 'Dhaka - Chattogram', dep: '10:00 AM', arr: '04:00 PM', price: '850-1200', type: 'AC/Non-AC', duration: '6h' },
  { id: 2, mode: 'bus', operator: 'Ena Transport', route: 'Dhaka - Sylhet', dep: '11:30 AM', arr: '04:30 PM', price: '600-900', type: 'AC/Non-AC', duration: '5h' },
  { id: 3, mode: 'bus', operator: 'Shyamoli Paribahan', route: 'Dhaka - Rajshahi', dep: '08:00 AM', arr: '02:00 PM', price: '700-1100', type: 'AC', duration: '6h' },
  { id: 4, mode: 'bus', operator: 'Nabil Paribahan', route: 'Dhaka - Rangpur', dep: '09:00 PM', arr: '06:00 AM', price: '1000-1500', type: 'AC Scania', duration: '9h' },
  
  { id: 5, mode: 'train', operator: 'Subarna Express', route: 'Dhaka - Chattogram', dep: '03:00 PM', arr: '08:00 PM', price: '450-1100', type: 'Intercity', duration: '5h' },
  { id: 6, mode: 'train', operator: 'Parabat Express', route: 'Dhaka - Sylhet', dep: '06:20 AM', arr: '01:00 PM', price: '380-900', type: 'Intercity', duration: '6.5h' },
  { id: 7, mode: 'train', operator: 'Silk City Express', route: 'Dhaka - Rajshahi', dep: '02:40 PM', arr: '08:30 PM', price: '340-800', type: 'Intercity', duration: '6h' },

  { id: 8, mode: 'launch', operator: 'MV Sundarban 10', route: 'Dhaka - Barisal', dep: '09:00 PM', arr: '05:00 AM', price: '300-4500', type: 'Launch', duration: '8h' },
  { id: 9, mode: 'launch', operator: 'Green Line Water', route: 'Dhaka - Barisal', dep: '08:00 AM', arr: '01:00 PM', price: '700-1000', type: 'Catamaran', duration: '5h' },
  { id: 10, mode: 'launch', operator: 'MV Parabat 12', route: 'Dhaka - Barisal', dep: '08:30 PM', arr: '04:30 AM', price: '300-4000', type: 'Launch', duration: '8h' },
];

const TRAFFIC_ALERTS = [
  { id: 1, locationBn: 'মহাখালী ফ্লাইওভার', locationEn: 'Mohakhali Flyover', status: 'jam', messageBn: 'তীব্র যানজট, ৩০ মিনিট দেরি হতে পারে।', messageEn: 'Heavy traffic, expect 30 min delay.', time: '10 mins ago' },
  { id: 2, locationBn: 'ঢাকা-চট্টগ্রাম হাইওয়ে', locationEn: 'Dhaka-Ctg Highway', status: 'clear', messageBn: 'রাস্তা পরিষ্কার, স্বাভাবিক গতি।', messageEn: 'Road clear, normal speed.', time: '25 mins ago' },
  { id: 3, locationBn: 'গুলিস্তান জিরো পয়েন্ট', locationEn: 'Gulistan Zero Point', status: 'diversion', messageBn: 'রাস্তা মেরামত চলছে, বিকল্প পথ ব্যবহার করুন।', messageEn: 'Road work, use alternative route.', time: '1 hour ago' },
];

const EMERGENCY_CONTACTS = [
  { titleBn: 'জাতীয় জরুরি সেবা', titleEn: 'National Emergency', number: '999', icon: <Siren size={20}/>, color: 'bg-red-500' },
  { titleBn: 'হাইওয়ে পুলিশ', titleEn: 'Highway Police', number: '01320-181888', icon: <Shield size={20}/>, color: 'bg-blue-600' },
  { titleBn: 'ফায়ার সার্ভিস', titleEn: 'Fire Service', number: '16163', icon: <AlertTriangle size={20}/>, color: 'bg-orange-500' },
];

const COURIER_SERVICES = [
  { id: 1, name: 'Sundarban Courier', type: 'Nationwide', contact: '09666-700700', areaBn: 'সমগ্র বাংলাদেশ', areaEn: 'All Bangladesh' },
  { id: 2, name: 'Pathao Courier', type: 'E-commerce', contact: '09678-100800', areaBn: 'ঢাকা ও প্রধান শহর', areaEn: 'Dhaka & Major Cities' },
  { id: 3, name: 'RedX', type: 'Logistics', contact: '09610-007339', areaBn: '৬৪ জেলা', areaEn: '64 Districts' },
  { id: 4, name: 'SA Paribahan', type: 'Parcel', contact: '02-9332052', areaBn: 'সমগ্র বাংলাদেশ', areaEn: 'All Bangladesh' },
];

export const TransportModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<TransportTab>('routes');
  const [selectedMode, setSelectedMode] = useState<TransportMode>('bus');
  const [fromLocation, setFromLocation] = useState('Dhaka');
  const [toLocation, setToLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<{km: number, time: string} | null>(null);

  // Search Logic
  const filteredRoutes = useMemo(() => {
    // If no destination is typed, show general routes for the selected mode
    if (!toLocation) return ROUTES_DB.filter(r => r.mode === selectedMode);
    
    // Filter based on input
    return ROUTES_DB.filter(r => 
      r.mode === selectedMode && 
      (
        (r.route.toLowerCase().includes(fromLocation.toLowerCase()) && 
         r.route.toLowerCase().includes(toLocation.toLowerCase())) 
         ||
         // Fallback partial matching
         r.route.toLowerCase().includes(toLocation.toLowerCase())
      )
    );
  }, [selectedMode, fromLocation, toLocation]);

  const handleSearch = () => {
    if (!fromLocation || !toLocation) return;
    setIsSearching(true);
    setDistanceInfo(null);

    // Simulate Calculation delay
    setTimeout(() => {
      // Mock distance calculation logic (simple randomization based on string length for demo)
      const baseDist = Math.abs(fromLocation.length + toLocation.length) * 15 + 100;
      const speed = selectedMode === 'train' ? 50 : selectedMode === 'launch' ? 25 : 40;
      const hours = Math.floor(baseDist / speed);
      const mins = Math.round((baseDist % speed) * 1.5);
      
      setDistanceInfo({
        km: baseDist,
        time: `${hours}h ${mins}m`
      });
      
      setIsSearching(false);
    }, 800);
  };

  // --- RENDER FUNCTIONS ---

  const renderRouteFinder = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Search Box */}
      <div className="bg-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold mb-6 relative z-10 flex items-center gap-2">
          <Navigation size={28} className="text-indigo-300" />
          {isBangla ? 'রুট এবং দূরত্ব খুঁজুন' : 'Find Routes & Distance'}
        </h2>

        {/* Mode Selector */}
        <div className="flex gap-4 mb-6 relative z-10 overflow-x-auto pb-2">
          {[
            { id: 'bus', icon: <Bus />, labelBn: 'বাস', labelEn: 'Bus' },
            { id: 'train', icon: <Train />, labelBn: 'ট্রেন', labelEn: 'Train' },
            { id: 'launch', icon: <Ship />, labelBn: 'লঞ্চ', labelEn: 'Launch' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => { setSelectedMode(m.id as TransportMode); setDistanceInfo(null); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedMode === m.id 
                  ? 'bg-white text-indigo-900 shadow-lg scale-105' 
                  : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700'
              }`}
            >
              {m.icon} {isBangla ? m.labelBn : m.labelEn}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10 bg-white/10 p-2 rounded-2xl">
          <div className="md:col-span-5 flex items-center bg-white rounded-xl px-4 py-3">
            <div className="p-2 bg-indigo-50 rounded-full mr-3 text-indigo-600"><MapPin size={20} /></div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 font-bold uppercase">{isBangla ? 'কোথা থেকে' : 'From'}</label>
              <input 
                type="text" 
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full text-gray-900 font-bold outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex items-center justify-center">
            <div className="p-2 bg-indigo-500 rounded-full text-white shadow-lg rotate-90 md:rotate-0">
              <ArrowRight size={20} />
            </div>
          </div>

          <div className="md:col-span-5 flex items-center bg-white rounded-xl px-4 py-3">
            <div className="p-2 bg-indigo-50 rounded-full mr-3 text-indigo-600"><Navigation size={20} /></div>
            <div className="flex-1">
              <label className="block text-xs text-gray-400 font-bold uppercase">{isBangla ? 'কোথায় যাবেন' : 'To'}</label>
              <input 
                type="text" 
                placeholder={isBangla ? 'গন্তব্য লিখুন (যেমন: চট্টগ্রাম)' : 'Enter Destination (e.g. Chattogram)'}
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full text-gray-900 font-bold outline-none bg-transparent placeholder-gray-300"
              />
            </div>
          </div>

          <div className="md:col-span-1">
             <button 
               onClick={handleSearch}
               disabled={!toLocation}
               className={`w-full h-full text-white rounded-xl flex items-center justify-center shadow-lg transition-colors ${!toLocation ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-400'}`}
             >
               {isSearching ? <RefreshCw className="animate-spin" /> : <Search />}
             </button>
          </div>
        </div>
      </div>

      {/* Distance Result Card */}
      {distanceInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 animate-fade-in-up">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-white rounded-full text-indigo-600 shadow-sm">
                    <Calculator size={32} />
                 </div>
                 <div>
                    <h3 className="text-gray-900 font-bold text-lg">{isBangla ? 'ভ্রমণের দূরত্ব ও সময়' : 'Distance & Est. Time'}</h3>
                    <p className="text-gray-500 text-sm">
                      {fromLocation} <ArrowRight size={12} className="inline mx-1"/> {toLocation} ({isBangla ? (selectedMode === 'bus' ? 'বাস' : selectedMode === 'train' ? 'ট্রেন' : 'লঞ্চ') : selectedMode})
                    </p>
                 </div>
              </div>
              
              <div className="flex gap-8 text-center">
                 <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">{isBangla ? 'দূরত্ব' : 'Distance'}</p>
                    <p className="text-3xl font-black text-indigo-700">{distanceInfo.km} <span className="text-sm font-medium">km</span></p>
                 </div>
                 <div className="w-px bg-gray-300 h-10 self-center"></div>
                 <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">{isBangla ? 'সময়' : 'Time'}</p>
                    <p className="text-3xl font-black text-indigo-700">{distanceInfo.time}</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Results */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Ticket size={20} className="text-indigo-600" />
          {isBangla ? 'উপলব্ধ রুট ও ভাড়া তালিকা' : 'Available Routes & Fare List'}
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <div key={route.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6 group">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {route.mode === 'bus' && <Bus size={28} />}
                    {route.mode === 'train' && <Train size={28} />}
                    {route.mode === 'launch' && <Ship size={28} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">{route.operator}</h4>
                    <p className="text-gray-500 text-sm mt-1">{route.route}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold uppercase text-gray-600">{route.type}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {route.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">{isBangla ? 'সময়সূচী' : 'Schedule'}</p>
                    <div className="flex items-center gap-2 font-medium text-gray-800 mt-1">
                       <span>{route.dep}</span> 
                       <ArrowRight size={14} className="text-gray-400" />
                       <span>{route.arr}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">{isBangla ? 'ভাড়া (জনপ্রতি)' : 'Fare (Per Person)'}</p>
                    <p className="font-black text-indigo-600 text-2xl">৳ {route.price}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Search size={24} className="text-gray-400" />
              </div>
              <p className="font-medium text-lg">{isBangla ? 'কোন রুট পাওয়া যায়নি।' : 'No routes found.'}</p>
              <p className="text-sm text-gray-400">{isBangla ? 'অন্য গন্তব্য দিয়ে চেষ্টা করুন।' : 'Try searching for a different destination.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTraffic = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Map className="text-indigo-600" />
          {isBangla ? 'লাইভ ট্রাফিক আপডেট' : 'Live Traffic Updates'}
        </h3>
        
        {/* Mock Map Placeholder */}
        <div className="w-full h-64 bg-gray-100 rounded-xl relative overflow-hidden mb-6 flex items-center justify-center group cursor-pointer">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"></div>
           <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full font-bold text-gray-800 shadow-lg z-10 flex items-center gap-2">
             <Navigation size={18} className="text-indigo-600" />
             {isBangla ? 'ম্যাপ দেখতে ক্লিক করুন' : 'Click to View Live Map'}
           </div>
        </div>

        <div className="space-y-4">
          {TRAFFIC_ALERTS.map(alert => (
            <div key={alert.id} className={`p-4 rounded-xl border-l-4 flex gap-4 items-start ${
              alert.status === 'jam' ? 'bg-red-50 border-red-500' : 
              alert.status === 'clear' ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'
            }`}>
              <div className={`p-2 rounded-full shrink-0 ${
                alert.status === 'jam' ? 'bg-red-100 text-red-600' : 
                alert.status === 'clear' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {alert.status === 'jam' ? <AlertTriangle size={20} /> : alert.status === 'clear' ? <Navigation size={20} /> : <Info size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900">{isBangla ? alert.locationBn : alert.locationEn}</h4>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{isBangla ? alert.messageBn : alert.messageEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSafety = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Emergency Numbers */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {isBangla ? 'জরুরি যোগাযোগ' : 'Emergency Contacts'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all flex items-center gap-4 group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${contact.color} shadow-lg group-hover:scale-110 transition-transform`}>
                {contact.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">{isBangla ? contact.titleBn : contact.titleEn}</p>
                <a href={`tel:${contact.number}`} className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                  {contact.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Guidelines */}
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
        <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
          <Shield size={20} />
          {isBangla ? 'নিরাপত্তা নির্দেশিকা (নারী ও শিশু)' : 'Safety Guidelines (Women & Children)'}
        </h3>
        <ul className="space-y-3">
          {[
            isBangla ? 'রাতের বেলা পরিচিত পরিবহন ব্যবহার করার চেষ্টা করুন।' : 'Try to use familiar transport at night.',
            isBangla ? 'লাইভ লোকেশন পরিবারের সাথে শেয়ার করুন।' : 'Share live location with family.',
            isBangla ? 'যেকোনো বিপদে ৯৯৯ এ কল করুন বা প্যানিক বাটন চাপুন।' : 'Call 999 or press panic button in emergency.',
            isBangla ? 'সন্দেহজনক আচরণ দেখলে চালক বা হেল্পারকে জানান।' : 'Report suspicious behavior to driver or helper.'
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg text-sm text-gray-700 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderLogistics = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="text-indigo-600" />
            {isBangla ? 'পণ্য পরিবহন ও কুরিয়ার' : 'Logistics & Courier Directory'}
          </h3>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter size={16} /> {isBangla ? 'ফিল্টার' : 'Filter'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURIER_SERVICES.map(courier => (
            <div key={courier.id} className="border border-gray-200 p-5 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-gray-900">{courier.name}</h4>
                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{courier.type}</span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-500" />
                  {isBangla ? `সার্ভিস এরিয়া: ${courier.areaBn}` : `Area: ${courier.areaEn}`}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-indigo-500" />
                  {courier.contact}
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  {isBangla ? 'কল করুন' : 'Call Now'}
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  {isBangla ? 'রেট চার্ট' : 'Rate Chart'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-indigo-50/30 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-4 border border-indigo-200">
            <Navigation size={16} />
            {isBangla ? 'স্মার্ট পরিবহন সেবা' : 'Smart Transport Services'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'পরিবহন ও যোগাযোগ' : 'Transport & Communication'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'বাস, ট্রেন ও লঞ্চের সময়সূচী জানুন, ভাড়া যাচাই করুন এবং নিরাপদ ভ্রমণ নিশ্চিত করুন।' 
              : 'Find schedules, check fares, plan routes, and ensure safe travel across Bangladesh.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-center gap-1">
            <button 
              onClick={() => setActiveTab('routes')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'routes' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Search size={16} />
              {isBangla ? 'রুট ও ভাড়া' : 'Routes & Fares'}
            </button>
            <button 
              onClick={() => setActiveTab('traffic')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'traffic' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <AlertTriangle size={16} />
              {isBangla ? 'ট্রাফিক অ্যালার্ট' : 'Traffic Alerts'}
            </button>
            <button 
              onClick={() => setActiveTab('safety')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'safety' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Shield size={16} />
              {isBangla ? 'নিরাপত্তা' : 'Safety'}
            </button>
            <button 
              onClick={() => setActiveTab('logistics')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'logistics' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Truck size={16} />
              {isBangla ? 'কুরিয়ার' : 'Courier'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'routes' && renderRouteFinder()}
          {activeTab === 'traffic' && renderTraffic()}
          {activeTab === 'safety' && renderSafety()}
          {activeTab === 'logistics' && renderLogistics()}
        </div>

      </div>
    </div>
  );
};
