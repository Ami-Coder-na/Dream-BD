
import React from 'react';
import { Info, Target, Heart, Users, Globe, Shield, Activity, Sparkles } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

export const AboutModule: React.FC<Props> = ({ isBangla }) => {
  const { aboutUs } = useData();

  return (
    <div className="bg-white min-h-screen animate-fade-in font-sans">
      {/* Hero Section */}
      <div className="bg-[#0f172a] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight animate-fade-in-up">
            {isBangla ? aboutUs.titleBn : aboutUs.titleEn}
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed font-medium">
             {isBangla ? 'ডিজিটাল সেবার মাধ্যমে জীবনযাত্রার মান উন্নয়ন এবং মানুষের ক্ষমতায়ন।' : 'Improving quality of life and empowering people through digital services.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-black uppercase mb-6">
                 <Sparkles size={14} /> Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">
                {isBangla ? 'কেন সোনালী দেশ?' : 'Why Shonali Desh?'}
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                 <p>{isBangla ? aboutUs.contentBn : aboutUs.contentEn}</p>
              </div>
           </div>
           <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-50 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1200" 
                alt="About" 
                className="rounded-[3rem] shadow-2xl relative z-10 border-8 border-white"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
           <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-50 group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-8 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                 <Target size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{isBangla ? 'আমাদের লক্ষ্য' : 'Our Mission'}</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {isBangla ? aboutUs.missionBn : aboutUs.missionEn}
              </p>
           </div>

           <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-50 group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <Globe size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{isBangla ? 'আমাদের স্বপ্ন' : 'Our Vision'}</h3>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {isBangla ? aboutUs.visionBn : aboutUs.visionEn}
              </p>
           </div>
        </div>

        <div className="text-center mb-20">
           <h2 className="text-3xl font-black text-gray-900 mb-12">{isBangla ? 'আমাদের মূল বৈশিষ্ট্যসমূহ' : 'Key Core Values'}</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: <Heart className="text-red-500" />, titleBn: 'মানবিকতা', titleEn: 'Humanity' },
                { icon: <Shield className="text-blue-500" />, titleBn: 'নিরাপত্তা', titleEn: 'Security' },
                { icon: <Activity className="text-green-500" />, titleBn: 'সক্রিয়তা', titleEn: 'Activity' },
                { icon: <Users className="text-purple-500" />, titleBn: 'সমন্বয়', titleEn: 'Collaboration' },
              ].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-2xl shadow-inner border border-gray-100">
                      {val.icon}
                   </div>
                   <h4 className="font-bold text-gray-800 uppercase tracking-wider text-sm">{isBangla ? val.titleBn : val.titleEn}</h4>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
