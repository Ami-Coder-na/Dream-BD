
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Users, BookOpen, HeartPulse, Building2, Phone, Camera, ArrowRight, X, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

export const AmarJelaModule: React.FC<Props> = ({ isBangla }) => {
  const { districts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Filter districts as user types
  useEffect(() => {
    if (searchTerm.trim().length > 0 && isTyping) {
      const filtered = districts.filter((d: any) => 
        d.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.nameBn.includes(searchTerm)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, districts, isTyping]);

  const handleSearchInputChange = (val: string) => {
    setSearchTerm(val);
    setIsTyping(true);
  };

  const handleSelectDistrict = (district: any) => {
    setSelectedDistrict(district);
    setSuggestions([]);
    setSearchTerm('');
    setIsTyping(false);
    // Smooth scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const executeSearch = (overrideTerm?: string) => {
    const term = (overrideTerm || searchTerm).trim().toLowerCase();
    if (!term) return;

    // Check if there's a match in the full list
    const match = districts.find((d: any) => 
      d.nameEn.toLowerCase() === term || 
      d.nameBn === term ||
      d.nameEn.toLowerCase().includes(term) ||
      d.nameBn.includes(term)
    );

    if (match) {
      handleSelectDistrict(match);
    } else {
      alert(isBangla ? 'দুঃখিত, এই জেলাটি পাওয়া যায়নি। সঠিক নাম লিখুন।' : 'Sorry, district not found. Please type correctly.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  };

  const DEFAULT_IMG = "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5";

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in pb-24">
      
      {/* Hero Search Section */}
      <div className="relative pt-20 pb-32 px-4 text-center">
        <div className="absolute inset-0 overflow-hidden z-0">
           <div className="absolute inset-0 bg-teal-700"></div>
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-teal-800"></div>
        </div>

        <div className="relative z-30 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {isBangla ? 'আমার জেলা - সব তথ্য এক সাথে' : 'My District - All Info in One Place'}
          </h1>
          <p className="text-teal-100 mb-10 text-lg max-w-2xl mx-auto">
            {isBangla ? 'আপনার জেলার নাম লিখুন এবং শিক্ষা, স্বাস্থ্য ও দর্শনীয় স্থানের তথ্য জানুন।' : 'Enter your district name to find details about education, health, and tourism.'}
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-2xl p-2 transition-transform focus-within:ring-4 focus-within:ring-teal-500/20 duration-300">
              <Search className="text-gray-400 ml-4 shrink-0" size={24} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isBangla ? 'আপনার জেলার নাম লিখুন...' : 'Type your district name...'}
                className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-gray-800 text-lg w-full"
                autoComplete="off"
              />
              <Button 
                onClick={() => executeSearch()}
                className="rounded-full px-8 py-3 bg-teal-600 hover:bg-teal-800 font-bold shrink-0 shadow-lg"
              >
                {isBangla ? 'খুঁজুন' : 'Search'}
              </Button>
            </div>

            {/* Suggestions Dropdown */}
            {searchTerm.trim().length > 0 && isTyping && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left max-h-72 overflow-y-auto animate-fade-in-up ring-1 ring-black/5">
                {suggestions.length > 0 ? suggestions.map((dist: any) => (
                  <div 
                    key={dist.id}
                    onClick={() => handleSelectDistrict(dist)}
                    className="px-6 py-4 hover:bg-teal-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center group transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 group-hover:text-teal-700 text-lg">{isBangla ? dist.nameBn : dist.nameEn}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{dist.division} Division</span>
                    </div>
                    <ArrowRight className="text-teal-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                )) : (
                  <div className="px-6 py-4 text-gray-400 italic">
                    {isBangla ? 'কোন জেলা পাওয়া যায়নি' : 'No districts found'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20" ref={resultRef}>
        
        {selectedDistrict ? (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Main Info Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start border border-gray-100">
              <div className="w-full lg:w-1/3 space-y-3">
                 <div className="relative group overflow-hidden rounded-2xl shadow-md">
                    <img 
                      src={getOptimizedImageUrl(selectedDistrict.images?.[0] || DEFAULT_IMG, 600)} 
                      alt={selectedDistrict.nameEn} 
                      className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                       <span className="text-white text-sm font-bold flex items-center gap-1"><Camera size={14}/> {isBangla ? 'জেলা ছবি' : 'District View'}</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <img src={getOptimizedImageUrl(selectedDistrict.images?.[1] || DEFAULT_IMG, 400)} className="w-full h-28 object-cover rounded-xl shadow-sm border border-gray-100" />
                    <img src={getOptimizedImageUrl(selectedDistrict.images?.[2] || DEFAULT_IMG, 400)} className="w-full h-28 object-cover rounded-xl shadow-sm border border-gray-100" />
                 </div>
              </div>

              <div className="w-full lg:w-2/3">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                   <div>
                     <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-bold uppercase tracking-wider mb-2 border border-teal-100">
                       {isBangla ? selectedDistrict.division + ' বিভাগ' : selectedDistrict.division + ' Division'}
                     </span>
                     <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                       {isBangla ? selectedDistrict.nameBn : selectedDistrict.nameEn}
                     </h2>
                   </div>
                   <div className="bg-teal-50 px-6 py-4 rounded-2xl text-center border border-teal-100 shadow-sm min-w-[140px]">
                      <Users className="mx-auto text-teal-600 mb-2" size={24} />
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">{isBangla ? 'জনসংখ্যা' : 'Population'}</p>
                      <p className="text-xl font-black text-gray-900">{selectedDistrict.population}</p>
                   </div>
                 </div>
                 
                 <p className="text-gray-600 text-lg leading-relaxed mb-8 border-l-4 border-teal-500 pl-4 bg-gray-50/50 py-4 rounded-r-2xl">
                   {selectedDistrict.description || (isBangla ? 'এই জেলার বিস্তারিত তথ্য শীঘ্রই যুক্ত করা হবে।' : 'Detailed information for this district will be updated soon.')}
                 </p>

                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500 mb-3"><MapPin size={20} /></div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{isBangla ? 'আয়তন' : 'Area'}</p>
                       <p className="font-black text-gray-900 text-lg">{selectedDistrict.area}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 mb-3"><Building2 size={20} /></div>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{isBangla ? 'উপজেলা' : 'Upazilas'}</p>
                       <p className="font-black text-gray-900 text-lg">{selectedDistrict.upazilas?.length || 0}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Grid for Detailed Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Education Section */}
               <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100 flex flex-col">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><BookOpen size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">{isBangla ? 'শিক্ষা সংক্রান্ত তথ্য' : 'Education Data'}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
                        <p className="text-4xl font-black text-blue-700 mb-1">{selectedDistrict.education?.primary || 0}</p>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{isBangla ? 'প্রাথমিক বিদ্যালয়' : 'Primary Schools'}</p>
                     </div>
                     <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center">
                        <p className="text-4xl font-black text-indigo-700 mb-1">{selectedDistrict.education?.highSchool || 0}</p>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{isBangla ? 'উচ্চ বিদ্যালয়' : 'High Schools'}</p>
                     </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center gap-3 text-sm text-gray-500 italic">
                    <Info size={16} /> {isBangla ? 'সরকারি সর্বশেষ ডাটা অনুযায়ী প্রদর্শিত। ' : 'Displaying based on latest govt data.'}
                  </div>
               </div>

               {/* Tourist Spots Section */}
               <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-600"><Camera size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">{isBangla ? 'দর্শনীয় স্থান' : 'Must Visit Spots'}</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedDistrict.touristSpots?.length > 0 ? selectedDistrict.touristSpots.map((spot: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-4 hover:bg-orange-50 rounded-2xl transition-all cursor-default border border-transparent hover:border-orange-100 group">
                         <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">{idx + 1}</span>
                         <span className="font-bold text-gray-700 text-lg">{spot}</span>
                         <ArrowRight className="ml-auto text-orange-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
                      </div>
                    )) : (
                      <div className="text-center py-10">
                        <p className="text-gray-400 italic">{isBangla ? 'দর্শনীয় স্থানের তথ্য পাওয়া যায়নি' : 'No tourist spots data available'}</p>
                      </div>
                    )}
                  </div>
               </div>

               {/* Health Section */}
               <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
                    <div className="p-3 bg-red-50 rounded-2xl text-red-600"><HeartPulse size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">{isBangla ? 'হাসপাতাল ও জরুরী সেবা' : 'Health & Emergency'}</h3>
                  </div>
                  <div className="space-y-4">
                     {selectedDistrict.hospitals?.length > 0 ? selectedDistrict.hospitals.map((hosp: any, idx: number) => (
                       <div key={idx} className="flex items-start gap-4 p-5 bg-red-50/30 rounded-2xl border border-red-100 group hover:bg-white transition-all hover:shadow-md">
                          <div className="bg-white p-3 rounded-xl text-red-500 shadow-sm"><Building2 size={20} /></div>
                          <div className="flex-1">
                             <h4 className="font-black text-gray-900 text-lg">{hosp.name}</h4>
                             <p className="text-sm text-gray-600 flex items-center gap-1 mt-1 mb-4"><MapPin size={14} className="text-red-400" /> {hosp.address}</p>
                             <a href={`tel:${hosp.phone}`} className="inline-flex items-center bg-red-600 text-white text-sm px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all hover:scale-105">
                               <Phone size={16} className="mr-2" /> {isBangla ? 'কল করুন' : 'Call Now'}: {hosp.phone}
                             </a>
                          </div>
                       </div>
                     )) : (
                       <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <Phone size={32} className="mx-auto text-gray-300 mb-3" />
                          <p className="text-gray-400 font-medium italic">{isBangla ? 'হাসপাতালের তথ্য আপলোড করা হচ্ছে' : 'Hospital data is being updated'}</p>
                       </div>
                     )}
                  </div>
               </div>

               {/* Upazila List Section */}
               <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-5">
                    <div className="p-3 bg-green-50 rounded-2xl text-green-600"><MapPin size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">{isBangla ? 'উপজেলা সমূহ' : 'Upazila List'}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedDistrict.upazilas?.length > 0 ? selectedDistrict.upazilas.map((upa: string, idx: number) => (
                      <span key={idx} className="bg-gray-50 text-gray-800 px-5 py-3 rounded-2xl text-sm font-bold border border-gray-100 hover:bg-green-600 hover:text-white hover:shadow-lg transition-all cursor-default">{upa}</span>
                    )) : (
                       <p className="text-gray-400 italic p-6">{isBangla ? 'উপজেলার তথ্য পাওয়া যায়নি' : 'No upazila data available'}</p>
                    )}
                  </div>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center pt-10">
               <Button 
                variant="outline" 
                onClick={() => { setSelectedDistrict(null); setSearchTerm(''); }}
                className="rounded-full px-12 py-3 border-gray-300 text-gray-600 hover:bg-gray-100 font-bold"
               >
                 {isBangla ? 'অন্য জেলা খুঁজুন' : 'Search Another District'}
               </Button>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-gray-100 animate-fade-in-up max-w-3xl mx-auto mt-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-50 rounded-full -ml-16 -mb-16 opacity-50"></div>
             
             <div className="w-24 h-24 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-teal-600 shadow-xl shadow-teal-100 rotate-3"><MapPin size={48} /></div>
             <h2 className="text-3xl font-black text-gray-900 mb-4">{isBangla ? 'জেলা নির্বাচন করুন' : 'Select Your District'}</h2>
             <p className="text-gray-500 max-w-md mx-auto text-lg mb-10 leading-relaxed">
               {isBangla ? 'উপরে সার্চ বক্সে জেলার নাম লিখে অথবা নিচের জনপ্রিয় জেলাগুলো থেকে সিলেক্ট করে তথ্য দেখুন।' : 'Type your district name above or select from popular cities to see details.'}
             </p>
             
             <div className="flex flex-wrap justify-center gap-3">
               {['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Bogra'].map(city => (
                 <button 
                  key={city} 
                  onClick={() => executeSearch(city)} 
                  className="px-6 py-2.5 rounded-full border-2 border-gray-100 text-gray-600 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all text-sm font-bold shadow-sm"
                 >
                   {city}
                 </button>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
