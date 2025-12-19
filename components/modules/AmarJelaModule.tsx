import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, Users, BookOpen, HeartPulse, Building2, Phone, Camera, ArrowRight, X, Info, Map as MapIcon, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

const COMMON_DISTRICTS = [
  { id: 'dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা', division: 'Dhaka' },
  { id: 'chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', division: 'Chattogram' },
  { id: 'sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট', division: 'Sylhet' },
  { id: 'khulna', nameEn: 'Khulna', nameBn: 'খুলনা', division: 'Khulna' },
  { id: 'rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী', division: 'Rajshahi' },
  { id: 'barisal', nameEn: 'Barisal', nameBn: 'বরিশাল', division: 'Barisal' },
  { id: 'rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর', division: 'Rangpur' },
  { id: 'bogra', nameEn: 'Bogra', nameBn: 'বগুড়া', division: 'Rajshahi' },
];

export const AmarJelaModule: React.FC<Props> = ({ isBangla }) => {
  const { districts: dbDistricts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const allDistricts = useMemo(() => {
    const list = [...(dbDistricts || [])];
    COMMON_DISTRICTS.forEach(fallback => {
      const exists = list.some(d => (d.id === fallback.id) || (d.nameEn?.toLowerCase() === fallback.nameEn.toLowerCase()));
      if (!exists) list.push(fallback);
    });
    return list;
  }, [dbDistricts]);

  useEffect(() => {
    const term = (searchTerm || '').trim().toLowerCase();
    if (term.length > 0 && isTyping) {
      const filtered = allDistricts.filter((d: any) => 
        (d.nameEn || d.nameen || '').toLowerCase().includes(term) || 
        (d.nameBn || d.namebn || '').includes(searchTerm)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, allDistricts, isTyping]);

  const handleSelectDistrict = (district: any) => {
    setSelectedDistrict(district);
    setSuggestions([]);
    setSearchTerm('');
    setIsTyping(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const executeSearch = (overrideTerm?: string) => {
    const term = (overrideTerm || searchTerm || '').trim().toLowerCase();
    if (!term) return;

    const match = allDistricts.find((d: any) => 
      (d.nameEn || d.nameen || '').toLowerCase() === term || 
      (d.nameBn || d.namebn || '') === term ||
      (d.nameEn || d.nameen || '').toLowerCase().includes(term) ||
      (d.nameBn || d.namebn || '').includes(term)
    );

    if (match) {
      handleSelectDistrict(match);
    } else {
      alert(isBangla ? 'দুঃখিত, এই জেলাটি পাওয়া যায়নি।' : 'Sorry, district not found.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  };

  const DEFAULT_IMG = "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5";
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMG;
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-16 font-sans">
      {/* 1. HEADER SECTION - Compact & Minimalist */}
      <div className="bg-[#0b6352] relative pt-10 pb-20 px-4 text-center">
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}>
        </div>

        <div className="relative z-30 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {isBangla ? 'আমার জেলা' : 'My District'}
          </h1>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-xl p-1 transition-all focus-within:ring-4 focus-within:ring-white/10">
              <Search className="text-gray-400 ml-4 shrink-0" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setIsTyping(true); }}
                onKeyDown={handleKeyDown}
                placeholder={isBangla ? 'জেলার নাম লিখুন...' : 'Search district...'}
                className="flex-1 bg-transparent border-none focus:outline-none px-3 py-3 text-gray-800 text-lg font-medium w-full"
                autoComplete="off"
              />
              <button 
                onClick={() => executeSearch()} 
                className="rounded-xl px-6 py-2.5 bg-[#0b6352] hover:bg-[#084d3f] text-white font-bold text-sm transition-all"
              >
                {isBangla ? 'খুঁজুন' : 'Search'}
              </button>
            </div>

            {searchTerm.trim().length > 0 && isTyping && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left">
                {suggestions.length > 0 ? suggestions.map((dist: any, idx: number) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelectDistrict(dist)}
                    className="px-6 py-4 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 flex justify-between items-center group transition-colors"
                  >
                    <div>
                      <span className="font-bold text-gray-900 group-hover:text-[#0b6352]">
                        {isBangla ? (dist.nameBn || dist.namebn) : (dist.nameEn || dist.nameen)}
                      </span>
                    </div>
                    <ArrowRight className="text-emerald-200 group-hover:text-[#0b6352] transition-all" size={16} />
                  </div>
                )) : (
                  <div className="px-6 py-4 text-gray-400 italic text-sm">{isBangla ? 'পাওয়া যায়নি' : 'Not found'}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20" ref={resultRef}>
        {!selectedDistrict ? (
          /* SELECTION GRID - Smaller Buttons */
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center border border-gray-100 max-w-3xl mx-auto">
             <div className="w-16 h-16 bg-[#e6f4f1] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0b6352]">
                <MapPin size={32} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-8">
               {isBangla ? 'জেলা নির্বাচন করুন' : 'Select District'}
             </h2>
             <div className="flex flex-wrap justify-center gap-2">
               {COMMON_DISTRICTS.map(city => (
                 <button 
                    key={city.id} 
                    onClick={() => executeSearch(city.nameEn)} 
                    className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-[#0b6352] hover:text-[#0b6352] hover:bg-emerald-50 transition-all text-sm font-bold"
                 >
                   {isBangla ? city.nameBn : city.nameEn}
                 </button>
               ))}
             </div>
          </div>
        ) : (
          /* DISTRICT DETAILS VIEW - Minimalist */
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-gray-100">
               <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                  <div className="flex-1">
                     <span className="inline-block px-3 py-1 rounded-full bg-[#e6f4f1] text-[#0b6352] text-[10px] font-black uppercase mb-2 border border-emerald-100 tracking-widest">
                       {isBangla ? selectedDistrict.division + ' বিভাগ' : selectedDistrict.division + ' Division'}
                     </span>
                     <h2 className="text-4xl md:text-6xl font-black text-gray-900">
                       {isBangla ? (selectedDistrict.nameBn || selectedDistrict.namebn) : (selectedDistrict.nameEn || selectedDistrict.nameen)}
                     </h2>
                  </div>

                  <div className="bg-[#f0fdfa] px-5 py-4 rounded-2xl border border-emerald-50 shadow-sm flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <Users size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{isBangla ? 'জনসংখ্যা' : 'Population'}</p>
                        <p className="text-xl font-black text-gray-800">{selectedDistrict.population || '9.1M'}</p>
                     </div>
                     <button onClick={() => setSelectedDistrict(null)} className="ml-4 p-2 text-gray-300 hover:text-red-500 transition-all">
                       <X size={20} />
                     </button>
                  </div>
               </div>

               <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="w-full lg:w-[350px] shrink-0 space-y-3">
                     <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-gray-100">
                        <img 
                          src={getOptimizedImageUrl(selectedDistrict.images?.[0] || DEFAULT_IMG, 800)} 
                          onError={handleImageError}
                          alt={selectedDistrict.nameEn} 
                          className="w-full h-full object-cover" 
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <img 
                          src={getOptimizedImageUrl(selectedDistrict.images?.[1] || DEFAULT_IMG, 400)} 
                          onError={handleImageError}
                          className="rounded-xl overflow-hidden shadow-sm aspect-video object-cover bg-gray-100" 
                        />
                        <img 
                          src={getOptimizedImageUrl(selectedDistrict.images?.[2] || DEFAULT_IMG, 400)} 
                          onError={handleImageError}
                          className="rounded-xl overflow-hidden shadow-sm aspect-video object-cover bg-gray-100" 
                        />
                     </div>
                  </div>

                  <div className="flex-1 space-y-6">
                     <div className="bg-[#f9fafb] p-6 rounded-2xl border-l-4 border-[#0b6352]">
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                          {selectedDistrict.description || (isBangla ? 'জেলার পরিচিতি ও গুরুত্ব এখানে তুলে ধরা হবে।' : 'District profile and significance.')}
                        </p>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                           <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                              <MapIcon size={24} />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{isBangla ? 'আয়তন' : 'Area'}</p>
                              <p className="text-lg font-black text-gray-900">{selectedDistrict.area || '5,283'} <span className="text-xs font-bold text-gray-400">km²</span></p>
                           </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                              <Building2 size={24} />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">{isBangla ? 'উপজেলা' : 'Upazila'}</p>
                              <p className="text-lg font-black text-gray-900">{selectedDistrict.upazila_count || (selectedDistrict.upazilas?.length || '10')}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
               {/* Education */}
               <div className="bg-white rounded-[1.5rem] p-8 shadow-md border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <BookOpen size={20} className="text-blue-500" /> {isBangla ? 'শিক্ষা তথ্য' : 'Education'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50 text-center">
                        <p className="text-3xl font-black text-blue-600">{selectedDistrict.education?.primary || '0'}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">{isBangla ? 'প্রাথমিক' : 'Primary'}</p>
                     </div>
                     <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50 text-center">
                        <p className="text-3xl font-black text-blue-600">{selectedDistrict.education?.highSchool || '0'}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">{isBangla ? 'উচ্চ' : 'High'}</p>
                     </div>
                  </div>
               </div>

               {/* Tourist Spots */}
               <div className="bg-white rounded-[1.5rem] p-8 shadow-md border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Camera size={20} className="text-orange-500" /> {isBangla ? 'দর্শনীয় স্থান' : 'Tourism'}
                  </h3>
                  <div className="space-y-2">
                     {(selectedDistrict.touristSpots || selectedDistrict.spots || ['Patenga Beach', 'Foy\'s Lake']).slice(0, 3).map((spot: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                           <span className="w-6 h-6 bg-orange-50 text-orange-600 rounded flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</span>
                           <p className="text-sm font-bold text-gray-700">{spot}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Hospital */}
               <div className="bg-white rounded-[1.5rem] p-8 shadow-md border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <HeartPulse size={20} className="text-red-500" /> {isBangla ? 'হাসপাতাল' : 'Health'}
                  </h3>
                  <div className="h-24 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center text-gray-300 text-sm font-bold">
                    {isBangla ? 'শীঘ্রই তথ্য যুক্ত হবে' : 'Coming Soon'}
                  </div>
               </div>

               {/* Upazilas */}
               <div className="bg-white rounded-[1.5rem] p-8 shadow-md border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-emerald-500" /> {isBangla ? 'উপজেলা সমূহ' : 'Upazilas'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {(selectedDistrict.upazilas || ['Upazila List']).slice(0, 6).map((upz: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                           {upz}
                        </span>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};