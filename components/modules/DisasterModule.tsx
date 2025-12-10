import React from 'react';
import { AlertOctagon, Map, PhoneCall, ShieldAlert, CloudLightning, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const DisasterModule: React.FC<Props> = ({ isBangla }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Active Alert Banner - High Contrast */}
      <div className="bg-red-600 text-white rounded-2xl p-6 shadow-lg shadow-red-200 border-4 border-red-500 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="p-4 bg-white/20 rounded-full animate-pulse">
           <AlertOctagon size={48} />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold uppercase tracking-wider mb-2">
            {isBangla ? 'সতর্ক সংকেত ৪' : 'Warning Signal 4'}
          </h2>
          <p className="text-red-100 text-lg">
            {isBangla 
              ? 'ঘূর্ণিঝড় "হামুন" উপকূলের দিকে ধেয়ে আসছে। নিরাপদ আশ্রয়ে যান।' 
              : 'Cyclone "Hamoon" is approaching the coast. Move to safe shelters.'}
          </p>
        </div>
        <Button className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-3 h-auto">
          {isBangla ? 'বিস্তারিত দেখুন' : 'View Details'}
        </Button>
      </div>

      {/* Safety & Shelter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shelter Map Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-100 h-48 w-full flex items-center justify-center relative">
             <Map size={48} className="text-gray-400" />
             <span className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded shadow">Map Placeholder</span>
             
             {/* Mock Map Markers */}
             <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-bounce" title="Shelter 1"></div>
             <div className="absolute top-1/3 left-2/3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg" title="Shelter 2"></div>
          </div>
          <div className="p-5">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Home size={20} className="text-green-600" />
              {isBangla ? 'নিকটস্থ আশ্রয়কেন্দ্র' : 'Nearby Shelters'}
            </h3>
            <ul className="space-y-3 mb-4">
              <li className="flex justify-between text-sm">
                <span className="text-gray-700">1. Model School Shelter</span>
                <span className="text-green-600 font-bold">0.5 km</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-700">2. Union Council Complex</span>
                <span className="text-green-600 font-bold">1.2 km</span>
              </li>
            </ul>
            <Button className="w-full bg-green-600 hover:bg-green-700">
               {isBangla ? 'পথ দেখুন' : 'Get Directions'}
            </Button>
          </div>
        </div>

        {/* Emergency Checklist */}
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
             <ShieldAlert size={20} />
             {isBangla ? 'প্রস্তুতি চেকলিস্ট' : 'Preparation Checklist'}
          </h3>
          <div className="space-y-3">
            {[
              isBangla ? 'শুকনো খাবার ও পানি সংরক্ষণ করুন' : 'Stock dry food and water',
              isBangla ? 'মোবাইল ও পাওয়ার ব্যাংক চার্জ দিন' : 'Charge mobile and power bank',
              isBangla ? 'জরুরী নথিপত্র পলিথিনে মুড়িয়ে রাখুন' : 'Wrap important docs in plastic',
              isBangla ? 'ফার্স্ট এইড বক্স সাথে রাখুন' : 'Keep first aid box ready'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-100">
                <input type="checkbox" className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300" />
                <span className="text-gray-700 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Forecast Mini */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
           <CloudLightning size={32} className="text-blue-600" />
           <div>
             <h4 className="font-bold text-blue-900">Next 24 Hours</h4>
             <p className="text-sm text-blue-700">Heavy rain expected (50mm)</p>
           </div>
         </div>
         <div className="text-right">
           <p className="text-2xl font-bold text-blue-900">24°C</p>
           <p className="text-xs text-blue-600">Wind: 45 km/h</p>
         </div>
      </div>
    </div>
  );
};