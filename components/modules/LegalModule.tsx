import React, { useState } from 'react';
import { Scale, Ruler, Book, Calculator, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const LegalModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<'calc' | 'guide'>('calc');
  
  // Calculator State
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [result, setResult] = useState<{ sqFt: number, satak: number, katha: number } | null>(null);

  const calculateLand = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    if (!l || !w) return;

    const sqFt = l * w;
    const satak = sqFt / 435.6;
    const katha = sqFt / 720;

    setResult({ 
      sqFt: parseFloat(sqFt.toFixed(2)), 
      satak: parseFloat(satak.toFixed(4)), 
      katha: parseFloat(katha.toFixed(4)) 
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm font-bold mb-4">
            <Scale size={16} />
            {isBangla ? 'আইনি সহায়তা ও জমি' : 'Legal Aid & Land'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'ডিজিটাল আমিন ও আইনি পরামর্শ' : 'Digital Amin & Legal Advice'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'জমি মাপুন খুব সহজে এবং আইনি জটিলতা নিরসনে প্রয়োজনীয় তথ্য জানুন।' 
              : 'Calculate land easily and get necessary information to resolve legal complications.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200 flex gap-2">
            <button onClick={() => setActiveTab('calc')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'calc' ? 'bg-slate-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Calculator size={16} /> {isBangla ? 'জমি মাপুন' : 'Land Calculator'}
            </button>
            <button onClick={() => setActiveTab('guide')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'guide' ? 'bg-slate-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Book size={16} /> {isBangla ? 'আইনি গাইড' : 'Legal Guide'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[400px]">
          
          {/* CALCULATOR TAB */}
          {activeTab === 'calc' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-fade-in">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Ruler className="text-slate-600" />
                  {isBangla ? 'জমির পরিমাপ ক্যালকুলেটর' : 'Land Measurement Calculator'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'দৈর্ঘ্য (ফুট)' : 'Length (Feet)'}</label>
                    <input 
                      type="number" 
                      value={length} 
                      onChange={(e) => setLength(e.target.value)} 
                      className="w-full p-4 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none text-lg placeholder-gray-400" 
                      placeholder="Example: 100" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'প্রস্থ (ফুট)' : 'Width (Feet)'}</label>
                    <input 
                      type="number" 
                      value={width} 
                      onChange={(e) => setWidth(e.target.value)} 
                      className="w-full p-4 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none text-lg placeholder-gray-400" 
                      placeholder="Example: 50" 
                    />
                  </div>
                  <Button onClick={calculateLand} className="w-full py-4 text-lg bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl mt-2">
                    {isBangla ? 'হিসাব করুন' : 'Calculate'}
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center h-full flex flex-col justify-center">
                {result ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-white rounded-xl shadow-sm">
                      <p className="text-slate-500 text-sm font-bold uppercase mb-1">{isBangla ? 'মোট বর্গফুট' : 'Total Sq. Feet'}</p>
                      <p className="text-3xl font-black text-slate-800">{result.sqFt}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                        <p className="text-green-600 text-xs font-bold uppercase mb-1">{isBangla ? 'শতাংশ (ডেসিমেল)' : 'Satak (Decimal)'}</p>
                        <p className="text-2xl font-bold text-green-800">{result.satak}</p>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-blue-600 text-xs font-bold uppercase mb-1">{isBangla ? 'কাঠা' : 'Katha'}</p>
                        <p className="text-2xl font-bold text-blue-800">{result.katha}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">* 1 Satak = 435.6 sq ft, 1 Katha = 720 sq ft</p>
                  </div>
                ) : (
                  <div className="text-slate-300 flex flex-col items-center">
                    <Calculator size={64} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">{isBangla ? 'ফলাফল এখানে দেখাবে' : 'Result will appear here'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GUIDE TAB */}
          {activeTab === 'guide' && (
            <div className="animate-fade-in space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{isBangla ? 'সচরাচর আইনি জিজ্ঞাসা' : 'Common Legal FAQs'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { qBn: 'জিডি (GD) কিভাবে করবেন?', qEn: 'How to file a GD?', aBn: 'নিকটস্থ থানায় গিয়ে ভারপ্রাপ্ত কর্মকর্তার বরাবর আবেদন করতে হবে। ঘটনার বিবরণ, সময় ও স্থান উল্লেখ করতে হবে।', aEn: 'Visit nearest police station. Write application to Officer-in-Charge mentioning details.' },
                  { qBn: 'জমি রেজিস্ট্রেশন খরচ কত?', qEn: 'Land Registration Cost?', aBn: 'দলিলে লিখিত মূল্যের উপর ১% রেজিস্ট্রেশন ফি, ১.৫% স্ট্যাম্প ডিউটি এবং অন্যান্য ফি প্রযোজ্য।', aEn: '1% Registration fee, 1.5% Stamp duty on deed value plus other fees.' },
                  { qBn: 'পারিবারিক আদালত কি?', qEn: 'What is Family Court?', aBn: 'তালাক, দেনমোহর, ভরণপোষণ এবং অভিভাবকত্ব সংক্রান্ত মামলা নিষ্পত্তির আদালত।', aEn: 'Court for settling divorce, dower, maintenance and guardianship cases.' },
                  { qBn: 'চেক ডিসঅনার হলে করণীয়?', qEn: 'Check Dishonor actions?', aBn: '৩০ দিনের মধ্যে লিগ্যাল নোটিশ পাঠাতে হবে। এরপর মামলা করা যাবে।', aEn: 'Send legal notice within 30 days. Then file a case.' },
                ].map((item, i) => (
                  <div key={i} className="border border-slate-100 bg-slate-50 p-6 rounded-xl hover:border-slate-300 transition-all">
                    <h4 className="font-bold text-slate-800 text-lg mb-2 flex gap-2"><CheckCircle size={20} className="text-slate-600"/> {isBangla ? item.qBn : item.qEn}</h4>
                    <p className="text-slate-600 leading-relaxed ml-7">{isBangla ? item.aBn : item.aEn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};