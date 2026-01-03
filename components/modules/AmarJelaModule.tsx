
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, Users, BookOpen, HeartPulse, Building2, Phone, Camera, ArrowRight, X, Info, Map as MapIcon, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

export const AmarJelaModule: React.FC<Props> = ({ isBangla }) => {
  const { districts: dbDistricts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const getDValue = (obj: any, keys: string[]) => {
    if (!obj) return '';
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return '';
  };

  const allDistricts = useMemo(() => [...(dbDistricts || [])], [dbDistricts]);

  useEffect(() => {
    const term = (searchTerm || '').trim().toLowerCase();
    if (term.length > 0 && isTyping) {
      const filtered = allDistricts.filter((d: any) => {
        const nameE = getDValue(d, ['nameEn', 'nameen']).toString().toLowerCase();
        const nameB = getDValue(d, ['nameBn', 'namebn']).toString();
        return nameE.includes(term) || nameB.includes(searchTerm);
      });
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
    const match = allDistricts.find((d: any) => {
      const nameE = getDValue(d, ['nameEn', 'nameen']).toString().toLowerCase();
      const nameB = getDValue(d, ['nameBn', 'namebn']).toString();
      return nameE === term || nameB === term || nameE.includes(term) || nameB.includes(term);
    });
    if (match) handleSelectDistrict(match);
    else alert(isBangla ? 'দুঃখিত, এই জেলাটি পাওয়া যায়নি।' : 'Sorry, district not found.');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); executeSearch(); }
  };

  const DEFAULT_IMG = "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5";
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.src = DEFAULT_IMG; };

  return (
    <div className="bg-white min-h-screen animate-fade-in pb-16 font-sans">
      <div className="bg-[#0b6352] relative pt-10 pb-20 px-4 text-center">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}></div>
        <div className="relative z-30 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">{isBangla ? 'আমার জেলা' : 'My District'}</h1>
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-xl p-1 transition-all focus-within:ring-4 focus-within:ring-white/10">
              <Search className="text-gray-400 ml-4 shrink-0" size={20} />
              <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setIsTyping(true); }} onKeyDown={handleKeyDown} placeholder={isBangla ? 'জেলার নাম লিখুন...' : 'Search district...'} className="flex-1 bg-transparent border-none focus:outline-none px-3 py-3 text-gray-800 text-lg font-medium w-full" autoComplete="off" />
              <button onClick={() => executeSearch()} className="rounded-xl px-6 py-2.5 bg-[#0b6352] hover:bg-[#084d3f] text-white font-bold text-sm transition-all">{isBangla ? 'খুঁজুন' : 'Search'}</button>
            </div>
            {searchTerm.trim().length > 0 && isTyping && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left">
                {suggestions.length > 0 ? suggestions.map((dist: any, idx: number) => (
                  <div key={idx} onClick={() => handleSelectDistrict(dist)} className="px-6 py-4 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 flex justify-between items-center group transition-colors">
                    <span className="font-bold text-gray-900 group-hover:text-[#0b6352]">{isBangla ? getDValue(dist, ['nameBn', 'namebn']) : getDValue(dist, ['nameEn', 'nameen'])}</span>
                    <ArrowRight className="text-emerald-200 group-hover:text-[#0b6352] transition-all" size={16} />
                  </div>
                )) : <div className="px-6 py-4 text-gray-400 italic text-sm">{isBangla ? 'পাওয়া যায়নি' : 'Not found'}</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20" ref={resultRef}>
        {!selectedDistrict ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center border border-gray-100 max-w-3xl mx-auto">
             <div className="w-16 h-16 bg-[#e6f4f1] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0b6352]"><MapPin size={32} /></div>
             <h2 className="text-2xl font-bold text-gray-900 mb-8">{isBangla ? 'জেলা নির্বাচন করুন' : 'Select District'}</h2>
             <div className="flex flex-wrap justify-center gap-2">
               {allDistricts.length > 0 ? allDistricts.slice(0, 12).map((city, idx) => (
                 <button key={city.id || idx} onClick={() => executeSearch(getDValue(city, ['nameEn', 'nameen']))} className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-[#0b6352] hover:text-[#0b6352] hover:bg-emerald-50 transition-all text-sm font-bold">{isBangla ? getDValue(city, ['nameBn', 'namebn']) : getDValue(city, ['nameEn', 'nameen'])}</button>
               )) : <p className="text-gray-400 italic">{isBangla ? 'কোন জেলা ডাটাবেজে নেই।' : 'No districts found.'}</p>}
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-gray-100">
               <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                  <div className="flex-1">
                     <span className="inline-block px-3 py-1 rounded-full bg-[#e6f4f1] text-[#0b6352] text-[10px] font-black uppercase mb-2 border border-emerald-100 tracking-widest">
                       {selectedDistrict.division} {isBangla ? 'বিভাগ' : 'Division'}
                     </span>
                     <h2 className="text-4xl md:text-6xl font-black text-gray-900">
                       {isBangla ? getDValue(selectedDistrict, ['nameBn', 'namebn']) : getDValue(selectedDistrict, ['nameEn', 'nameen'])}
                     </h2>
                  </div>
                  <div className="bg-[#f0fdfa] px-5 py-4 rounded-2xl border border-emerald-50 shadow-sm flex items-center gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm"><Users size={20} /></div>
                     <div><p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{isBangla ? 'জনসংখ্যা' : 'Population'}</p><p className="text-xl font-black text-gray-800">{selectedDistrict.population || 'N/A'}</p></div>
                     <button onClick={() => setSelectedDistrict(null)} className="ml-4 p-2 text-gray-300 hover:text-red-500 transition-all"><X size={20} /></button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-4 space-y-4">
                     <div className="rounded-3xl overflow-hidden shadow-md aspect-[4/3] bg-gray-100 ring-1 ring-gray-100">
                        <img src={getOptimizedImageUrl(selectedDistrict.images?.[0] || DEFAULT_IMG, 800)} onError={handleImageError} alt="District" className="w-full h-full object-cover" />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <img src={getOptimizedImageUrl(selectedDistrict.images?.[1] || DEFAULT_IMG, 400)} onError={handleImageError} className="rounded-2xl overflow-hidden shadow-sm aspect-video object-cover bg-gray-100" />
                        <img src={getOptimizedImageUrl(selectedDistrict.images?.[2] || DEFAULT_IMG, 400)} onError={handleImageError} className="rounded-2xl overflow-hidden shadow-sm aspect-video object-cover bg-gray-100" />
                     </div>
                  </div>
                  <div className="lg:col-span-8 space-y-6">
                     <div className="bg-[#f9fafb] p-6 rounded-3xl border-l-[6px] border-[#0b6352] min-h-[140px]">
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                          {selectedDistrict.description || (isBangla ? 'জেলার পরিচিতি ও গুরুত্ব এখানে তুলে ধরা হবে।' : 'District profile and significance.')}
                        </p>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-red-100 transition-all">
                           <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0"><MapIcon size={28} /></div>
                           <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{isBangla ? 'আয়তন' : 'Area'}</p><p className="text-2xl font-black text-gray-900">{selectedDistrict.area || 'N/A'} <span className="text-xs font-bold text-gray-400 uppercase ml-1">km²</span></p></div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-blue-100 transition-all">
                           <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0"><Building2 size={28} /></div>
                           <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{isBangla ? 'উপজেলা' : 'Upazila'}</p><p className="text-2xl font-black text-gray-900">{selectedDistrict.upazilas?.length || '0'}</p></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Card 1: Education */}
               <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-50 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3"><BookOpen size={24} className="text-blue-500" /> {isBangla ? 'শিক্ষা তথ্য' : 'Education Info'}</h3>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                     <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-50 text-center flex flex-col justify-center">
                        <p className="text-4xl font-black text-blue-600 leading-none mb-2">{selectedDistrict.education?.primary || '0'}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'প্রাথমিক' : 'Primary'}</p>
                     </div>
                     <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-50 text-center flex flex-col justify-center">
                        <p className="text-4xl font-black text-blue-600 leading-none mb-2">{selectedDistrict.education?.highSchool || '0'}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'উচ্চ' : 'High'}</p>
                     </div>
                  </div>
               </div>

               {/* Card 2: Tourist Spots */}
               <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-50 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3"><Camera size={24} className="text-orange-500" /> {isBangla ? 'দর্শনীয় স্থান' : 'Tourist Spots'}</h3>
                  <div className="space-y-3 flex-1">
                     {(selectedDistrict.touristspots || selectedDistrict.touristSpots || []).length > 0 ? (selectedDistrict.touristspots || selectedDistrict.touristSpots).slice(0, 5).map((spot: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 group">
                           <span className="w-8 h-8 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">{idx + 1}</span>
                           <p className="text-base font-bold text-gray-700">{spot}</p>
                        </div>
                     )) : <p className="text-gray-300 text-sm italic py-10 text-center">{isBangla ? 'কোন তথ্য পাওয়া যায়নি' : 'No information found'}</p>}
                  </div>
               </div>

               {/* Card 3: Health */}
               <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-50 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3"><HeartPulse size={24} className="text-red-500" /> {isBangla ? 'স্বাস্থ্য তথ্য' : 'Health Info'}</h3>
                  <div className="space-y-3 flex-1">
                    {Array.isArray(selectedDistrict.hospitals) && selectedDistrict.hospitals.length > 0 ? (
                      selectedDistrict.hospitals.slice(0, 4).map((h: any, i: number) => (
                        <div key={i} className="bg-red-50/40 p-4 rounded-2xl border border-red-50 flex flex-col gap-1">
                           <p className="font-black text-gray-800 text-sm">{h.name}</p>
                           <p className="text-[10px] text-red-600 font-black flex items-center gap-1 uppercase tracking-tighter"><Phone size={10} /> {h.phone}</p>
                        </div>
                      ))
                    ) : (
                      <div className="h-full border-2 border-dashed border-gray-100 rounded-[1.5rem] flex items-center justify-center text-gray-300 text-sm font-bold py-10">
                        {isBangla ? 'শীঘ্রই তথ্য যুক্ত হবে' : 'Coming Soon'}
                      </div>
                    )}
                  </div>
               </div>

               {/* Card 4: Upazilas */}
               <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-50 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3"><MapPin size={24} className="text-emerald-500" /> {isBangla ? 'উপজেলা সমূহ' : 'Upazila List'}</h3>
                  <div className="flex flex-wrap gap-2 flex-1 items-start content-start">
                     {(selectedDistrict.upazilas || []).length > 0 ? (selectedDistrict.upazilas).map((upz: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shadow-sm">
                           {upz}
                        </span>
                     )) : <p className="text-gray-300 text-sm italic py-10 text-center w-full">{isBangla ? 'কোন তথ্য পাওয়া যায়নি' : 'No information found'}</p>}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
