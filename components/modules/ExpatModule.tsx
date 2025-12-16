
import React, { useState } from 'react';
import { Globe, Plane, DollarSign, FileText, TrendingUp, RefreshCw, Briefcase, Landmark } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

export const ExpatModule: React.FC<Props> = ({ isBangla }) => {
  const { exchangeRates } = useData();
  const [activeTab, setActiveTab] = useState<'rates' | 'services' | 'remit'>('rates');
  
  // Remittance Calc
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [converted, setConverted] = useState<number | null>(null);

  const calculateRemittance = () => {
    const rate = exchangeRates.find((r: any) => r.currency === currency)?.rate || 0;
    const val = parseFloat(amount);
    if(val && rate) setConverted(parseFloat((val * rate).toFixed(2)));
  };

  return (
    <div className="bg-cyan-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-200 text-cyan-800 text-sm font-bold mb-4">
            <Plane size={16} />
            {isBangla ? 'প্রবাসী ও রেমিট্যান্স' : 'Expat & Remittance'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'প্রবাসীদের জন্য সব সেবা' : 'All Services for Expats'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'টাকার রেট, ভিসা চেক এবং রেমিট্যান্স পাঠানোর সহজ সমাধান।' 
              : 'Exchange rates, visa checks, and easy remittance solutions.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-cyan-100 flex gap-2">
            <button onClick={() => setActiveTab('rates')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'rates' ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-cyan-50'}`}>
              <TrendingUp size={16} /> {isBangla ? 'টাকার রেট' : 'Exchange Rates'}
            </button>
            <button onClick={() => setActiveTab('services')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'services' ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-cyan-50'}`}>
              <Briefcase size={16} /> {isBangla ? 'সেবাসমূহ' : 'Services'}
            </button>
            <button onClick={() => setActiveTab('remit')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'remit' ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-cyan-50'}`}>
              <DollarSign size={16} /> {isBangla ? 'ক্যালকুলেটর' : 'Calculator'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-cyan-100 p-6 md:p-8 min-h-[400px]">
          
          {/* RATES TAB */}
          {activeTab === 'rates' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="text-cyan-600" /> {isBangla ? 'আজকের টাকার রেট' : 'Today\'s Exchange Rates'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {exchangeRates.map((rate: any, idx: number) => (
                  <div key={idx} className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 text-center">
                    <h4 className="text-cyan-800 font-bold text-lg mb-1">{rate.currency}</h4>
                    <p className="text-3xl font-black text-gray-800 mb-2">৳ {rate.rate}</p>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${rate.trend === 'up' ? 'bg-green-100 text-green-700' : rate.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>
                      {rate.trend === 'up' ? '▲ Up' : rate.trend === 'down' ? '▼ Down' : '• Stable'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-6 text-center">* Rates are indicative and subject to bank policy.</p>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { titleBn: 'পাসপোর্ট নবায়ন', titleEn: 'Passport Renewal', icon: <FileText size={32} className="text-blue-500" />, descBn: 'অনলাইনে ই-পাসপোর্ট আবেদন ও স্ট্যাটাস চেক।', descEn: 'Apply for E-Passport and check status online.' },
                { titleBn: 'বিএমইটি কার্ড', titleEn: 'BMET Card', icon: <Briefcase size={32} className="text-green-500" />, descBn: 'বিদেশে যাওয়ার ছাড়পত্র ও স্মার্ট কার্ড।', descEn: 'Immigration clearance and smart card info.' },
                { titleBn: 'ওয়েজ আর্নার্স বন্ড', titleEn: 'Wage Earners Bond', icon: <Landmark size={32} className="text-purple-500" />, descBn: 'প্রবাসীদের জন্য সরকারি বিনিয়োগ সুবিধা।', descEn: 'Government investment scheme for expats.' },
              ].map((srv, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all text-center group cursor-pointer">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {srv.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{isBangla ? srv.titleBn : srv.titleEn}</h4>
                  <p className="text-gray-500 text-sm">{isBangla ? srv.descBn : srv.descEn}</p>
                </div>
              ))}
            </div>
          )}

          {/* CALCULATOR TAB */}
          {activeTab === 'remit' && (
            <div className="animate-fade-in max-w-md mx-auto">
              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">{isBangla ? 'রেমিট্যান্স ক্যালকুলেটর' : 'Remittance Calculator'}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'পরিমাণ' : 'Amount'}</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="1000" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'মুদ্রা' : 'Currency'}</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none">
                      {exchangeRates.map((r: any) => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                    </select>
                  </div>

                  <Button onClick={calculateRemittance} className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-200">
                    {isBangla ? 'হিসাব করুন' : 'Convert'}
                  </Button>

                  {converted && (
                    <div className="mt-6 text-center p-4 bg-white rounded-xl shadow-sm">
                      <p className="text-gray-500 text-xs font-bold uppercase mb-1">{isBangla ? 'সমপরিমাণ টাকা' : 'Equivalent BDT'}</p>
                      <p className="text-3xl font-black text-cyan-700">৳ {converted}</p>
                      <p className="text-xs text-green-600 mt-2 font-bold">+2.5% {isBangla ? 'সরকারি প্রণোদনা সহ' : 'Govt Incentive included'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
