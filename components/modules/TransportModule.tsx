import React, { useState } from 'react';
import { Bus, MapPin, Search, ArrowRight, Navigation, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const TransportModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<'bus' | 'train' | 'launch'>('bus');

  const routes = [
    { id: 1, operator: 'Hanif Enterprise', from: 'Dhaka', to: 'Chittagong', time: '10:00 AM', price: 850, type: 'AC', seats: 12 },
    { id: 2, operator: 'Ena Transport', from: 'Dhaka', to: 'Sylhet', time: '11:30 AM', price: 600, type: 'Non-AC', seats: 5 },
    { id: 3, operator: 'Nabil Paribahan', from: 'Dhaka', to: 'Rangpur', time: '09:15 PM', price: 1100, type: 'AC Scania', seats: 20 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Box Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex gap-4 border-b border-gray-100 pb-4 mb-6 overflow-x-auto">
          {['bus', 'train', 'launch'].map((mode) => (
             <button 
               key={mode}
               onClick={() => setActiveTab(mode as any)}
               className={`flex items-center gap-2 px-6 py-2 rounded-full capitalize font-medium transition-colors whitespace-nowrap ${
                 activeTab === mode 
                   ? 'bg-indigo-600 text-white shadow-md' 
                   : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
               }`}
             >
               {mode === 'bus' && <Bus size={18} />}
               {mode === 'train' && <div className="text-lg">🚂</div>}
               {mode === 'launch' && <div className="text-lg">🚢</div>}
               {isBangla 
                 ? (mode === 'bus' ? 'বাস' : mode === 'train' ? 'ট্রেন' : 'লঞ্চ') 
                 : mode}
             </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
          <div className="md:col-span-3">
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
               {isBangla ? 'কোথা থেকে' : 'From'}
             </label>
             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
               <MapPin className="text-indigo-500 mr-2" size={20} />
               <input type="text" defaultValue="Dhaka" className="bg-transparent w-full outline-none font-semibold text-gray-800" />
             </div>
          </div>
          
          <div className="hidden md:flex justify-center pb-3 text-gray-400">
            <ArrowRight />
          </div>

          <div className="md:col-span-3">
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
               {isBangla ? 'কোথায় যাবেন' : 'To'}
             </label>
             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
               <MapPin className="text-gray-400 mr-2" size={20} />
               <input type="text" placeholder={isBangla ? 'গন্তব্য লিখুন' : 'Enter Destination'} className="bg-transparent w-full outline-none text-gray-800" />
             </div>
          </div>
        </div>

        <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 h-12 text-lg">
          {isBangla ? 'সার্চ করুন' : 'Search Routes'}
        </Button>
      </div>

      {/* Available Routes */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 ml-1">
          {isBangla ? 'জনপ্রিয় রুটসমূহ' : 'Available Routes Today'}
        </h3>
        <div className="space-y-4">
          {routes.map(route => (
            <div key={route.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <Bus />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{route.operator}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span className="font-medium text-gray-700">{route.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {route.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end">
                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium mb-1">
                  <span>{route.from}</span>
                  <ArrowRight size={14} />
                  <span>{route.to}</span>
                </div>
                <div className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit">
                   {route.seats} {isBangla ? 'টি সিট বাকি' : 'Seats Left'}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <span className="text-xl font-bold text-indigo-700">৳ {route.price}</span>
                <Button size="sm" className="bg-indigo-600">
                   {isBangla ? 'বুক করুন' : 'Book Now'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Tracking Promo */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white flex justify-between items-center overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">
            {isBangla ? 'বাস ট্র্যাকিং' : 'Live Bus Tracking'}
          </h3>
          <p className="text-gray-400 text-sm max-w-xs mb-4">
            {isBangla 
              ? 'আপনার বাস এখন কোথায় আছে তা ম্যাপে দেখুন সরাসরি।' 
              : 'Track your bus location in real-time on the map.'}
          </p>
          <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-white/10">
             <Navigation size={16} className="mr-2" />
             {isBangla ? 'ট্র্যাক করুন' : 'Track Now'}
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-indigo-600/20 skew-x-12"></div>
        <MapPin size={100} className="text-white/10 absolute right-4 bottom-[-20px]" />
      </div>
    </div>
  );
};