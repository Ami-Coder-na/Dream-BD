import React from 'react';
import { Fish, Droplets, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const FisheryModule: React.FC<Props> = ({ isBangla }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Pond Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white col-span-1 md:col-span-2 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">
              {isBangla ? 'পুকুর ১ - রুই ও কাতল' : 'Pond 1 - Rui & Katol'}
            </h2>
            <p className="text-cyan-100 text-sm mb-6">Last updated: 10 mins ago</p>
            
            <div className="flex gap-8">
              <div>
                <p className="text-cyan-100 text-xs uppercase font-bold mb-1">pH Level</p>
                <p className="text-3xl font-bold">7.5</p>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">Normal</span>
              </div>
              <div>
                <p className="text-cyan-100 text-xs uppercase font-bold mb-1">Oxygen (DO)</p>
                <p className="text-3xl font-bold">5.2</p>
                <span className="text-xs bg-red-500/80 px-2 py-0.5 rounded text-white">Low</span>
              </div>
              <div>
                 <p className="text-cyan-100 text-xs uppercase font-bold mb-1">Temp</p>
                 <p className="text-3xl font-bold">28°C</p>
              </div>
            </div>
          </div>
          <Fish className="absolute right-[-20px] bottom-[-20px] text-white/10 w-48 h-48 rotate-12" />
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
           <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
             <AlertCircle size={20} />
             {isBangla ? 'সতর্কতা' : 'Alert'}
           </div>
           <p className="text-gray-600 text-sm mb-4">
             {isBangla 
               ? 'পুকুরে অক্সিজেনের মাত্রা কম। দ্রুত অ্যারেটর চালু করুন।' 
               : 'Dissolved Oxygen level is low. Turn on the aerator immediately.'}
           </p>
           <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
             {isBangla ? 'অ্যারেটর অন করুন' : 'Turn On Aerator'}
           </Button>
        </div>
      </div>

      {/* Market Prices & Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-cyan-600" />
            {isBangla ? 'আজকের মাছের বাজার' : 'Today\'s Fish Market'}
          </h3>
          <div className="space-y-3">
             {[
               { name: isBangla ? 'রুই' : 'Rui', price: '350', trend: 'up' },
               { name: isBangla ? 'ইলিশ' : 'Hilsa', price: '1200', trend: 'down' },
               { name: isBangla ? 'তেলাপিয়া' : 'Telapia', price: '180', trend: 'flat' }
             ].map((fish, i) => (
               <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                 <span className="font-medium text-gray-700">{fish.name}</span>
                 <div className="flex items-center gap-3">
                   <span className="font-bold text-gray-900">৳ {fish.price}</span>
                   {fish.trend === 'up' && <span className="text-red-500 text-xs">▲</span>}
                   {fish.trend === 'down' && <span className="text-green-500 text-xs">▼</span>}
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-3">
            {isBangla ? 'মৎস্য চাষ গাইড' : 'Farming Guide'}
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              {isBangla ? 'শীতকালে মাছের খাবার কম দিন।' : 'Reduce feed amount during winter.'}
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              {isBangla ? 'পানির পিএইচ ৭.৫-৮.৫ রাখা জরুরি।' : 'Keep water pH between 7.5-8.5.'}
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              {isBangla ? 'মাসে একবার জাল টেনে মাছের স্বাস্থ্য পরীক্ষা করুন।' : 'Check fish health by netting once a month.'}
            </li>
          </ul>
          <Button variant="outline" size="sm" className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-100">
            {isBangla ? 'বিস্তারিত পড়ুন' : 'Read Full Guide'}
          </Button>
        </div>
      </div>
    </div>
  );
};