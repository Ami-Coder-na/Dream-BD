import React from 'react';
import { CloudRain, Sun, Sprout, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const AgriModule: React.FC<Props> = ({ isBangla }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium opacity-90">{isBangla ? 'আজকের আবহাওয়া' : 'Today\'s Weather'}</h3>
              <p className="text-3xl font-bold mt-1">28°C</p>
              <p className="text-sm opacity-90 mt-1">{isBangla ? 'রংপুর, বাংলাদেশ' : 'Rangpur, Bangladesh'}</p>
            </div>
            <CloudRain size={40} className="text-blue-100" />
          </div>
          <div className="mt-6 flex justify-between text-sm opacity-80 border-t border-blue-400 pt-3">
            <span>{isBangla ? 'আর্দ্রতা' : 'Humidity'}: 65%</span>
            <span>{isBangla ? 'বৃষ্টিপাত' : 'Rain'}: 10mm</span>
          </div>
        </div>

        {/* Market Price Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-600" />
              {isBangla ? 'বাজার দর' : 'Market Prices'}
            </h3>
            <span className="text-xs text-gray-500">Live</span>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b border-gray-50 pb-2">
              <span className="text-gray-700">{isBangla ? 'ধান (মোটা)' : 'Rice (Coarse)'}</span>
              <span className="font-medium">৳ 1,200 / {isBangla ? 'মণ' : 'maund'}</span>
            </li>
            <li className="flex justify-between items-center border-b border-gray-50 pb-2">
              <span className="text-gray-700">{isBangla ? 'আলু' : 'Potato'}</span>
              <span className="font-medium">৳ 45 / kg</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-700">{isBangla ? 'পেঁয়াজ' : 'Onion'}</span>
              <span className="font-medium text-red-500">৳ 90 / kg ▲</span>
            </li>
          </ul>
        </div>

        {/* Advisory Card */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sprout size={20} className="text-green-600" />
            <h3 className="font-bold text-green-900">{isBangla ? 'কৃষি পরামর্শ' : 'Agri Advisory'}</h3>
          </div>
          <p className="text-sm text-green-800 mb-4">
            {isBangla 
              ? 'বোরো ধানের জন্য এখন ইউরিয়া সার প্রয়োগের উপযুক্ত সময়। পোকা দমনের জন্য নিয়মিত খেত পর্যবেক্ষণ করুন।' 
              : 'It is the right time to apply Urea fertilizer for Boro rice. Monitor fields regularly for pest control.'}
          </p>
          <Button variant="outline" size="sm" className="w-full border-green-200 text-green-700 hover:bg-green-100">
            {isBangla ? 'আরও দেখুন' : 'Read More'}
          </Button>
        </div>
      </div>

      {/* Disease Alert Section */}
      <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-4">
        <AlertTriangle className="text-red-500 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-red-800">{isBangla ? 'সতর্কবার্তা: ব্লাস্ট রোগ' : 'Alert: Blast Disease'}</h4>
          <p className="text-sm text-red-700 mt-1">
            {isBangla 
              ? 'আপনার এলাকায় ধানের ব্লাস্ট রোগের প্রাদুর্ভাব দেখা দিতে পারে। ছত্রাকনাশক স্প্রে করার প্রস্তুতি নিন।' 
              : 'Blast disease outbreak reported in your region. Prepare specific fungicides immediately.'}
          </p>
        </div>
      </div>
    </div>
  );
};
