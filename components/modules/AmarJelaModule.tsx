
import React, { useState } from 'react';
import { Search, MapPin, Users, BookOpen, HeartPulse, Building2, Phone, Camera, ArrowRight } from 'lucide-react';
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

  // Search Logic
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = districts.filter((d: any) => 
        d.nameEn.toLowerCase().includes(term.toLowerCase()) || 
        d.nameBn.includes(term)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectDistrict = (district: any) => {
    setSelectedDistrict(district);
    setSuggestions([]);
    setSearchTerm('');
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
            <div className="flex items-center bg-white rounded-full shadow-xl p-2 transition-transform focus-within:scale-105 duration-300">
              <Search className="text-gray-400 ml-4 shrink-0" size={24} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={isBangla ? 'জেলার নাম লিখুন (যেমন: ঢাকা, কুমিল্লা...)' : 'Type district name (e.g. Dhaka, Comilla...)'}
                className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-gray-800 text-lg w-full"
              />
              <Button className="rounded-full px-8 py-3 bg-teal-600 hover:bg-teal-800 font-bold shrink-0">
                {isBangla ? 'খুঁজুন' : 'Search'}
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left max-h-72 overflow-y-auto animate-fade-in-up ring-1 ring-black/5">
                {suggestions.map((dist: any) => (
                  <div 
                    key={dist.id}
                    onClick={() => handleSelectDistrict(dist)}
                    className="px-6 py-4 hover:bg-teal-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center group transition-colors"
                  >
                    <span className="font-bold text-gray-800 group-hover:text-teal-700 text-lg">{isBangla ? dist.nameBn : dist.nameEn}</span>
                    <span className="text-xs text-teal-600 bg-teal-100/50 px-3 py-1 rounded-full font-medium">{isBangla ? dist.division + ' বিভাগ' : dist.division + ' Division'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        
        {selectedDistrict ? (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start border border-gray-100">
              <div className="w-full lg:w-1/3 space-y-3">
                 <img 
                   src={getOptimizedImageUrl(selectedDistrict.images?.[0] || DEFAULT_IMG, 600)} 
                   alt={selectedDistrict.nameEn} 
                   className="w-full h-64 object-cover rounded-2xl shadow-md transform hover:scale-[1.02] transition-transform duration-500"
                   loading="lazy"
                 />
                 <div className="grid grid-cols-2 gap-3">
                    <img src={getOptimizedImageUrl(selectedDistrict.images?.[1] || DEFAULT_IMG, 400)} className="w-full h-28 object-cover rounded-xl shadow-sm" />
                    <img src={getOptimizedImageUrl(selectedDistrict.images?.[2] || DEFAULT_IMG, 400)} className="w-full h-28 object-cover rounded-xl shadow-sm" />
                 </div>
              </div>
              <div className="w-full lg:w-2/3">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                   <div>
                     <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-bold uppercase tracking-wider mb-2 border border-teal-100">
                       {isBangla ? selectedDistrict.division + ' বিভাগ' : selectedDistrict.division + ' Division'}
                     </span>
                     <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                       {isBangla ? selectedDistrict.nameBn : selectedDistrict.nameEn}
                     </h2>
                   </div>
                   <div className="bg-teal-50 px-6 py-4 rounded-2xl text-center border border-teal-100 shadow-sm min-w-[140px]">
                      <Users className="mx-auto text-teal-600 mb-2" size={24} />
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">{isBangla ? 'জনসংখ্যা' : 'Population'}</p>
                      <p className="text-xl font-bold text-gray-900">{selectedDistrict.population}</p>
                   </div>
                 </div>
                 
                 <p className="text-gray-600 text-lg leading-relaxed mb-8 border-l-4 border-teal-500 pl-4 bg-gray-50/50 py-2 rounded-r-lg">
                   {selectedDistrict.description || (isBangla ? 'এই জেলার বিস্তারিত তথ্য এখনো যুক্ত করা হয়নি।' : 'Detailed info for this district has not been added yet.')}
                 </p>

                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                       <MapPin className="text-red-500 mb-2" />
                       <p className="text-xs text-gray-400 font-bold uppercase">{isBangla ? 'আয়তন' : 'Area'}</p>
                       <p className="font-bold text-gray-900 text-lg">{selectedDistrict.area}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                       <Building2 className="text-blue-500 mb-2" />
                       <p className="text-xs text-gray-400 font-bold uppercase">{isBangla ? 'উপজেলা' : 'Upazilas'}</p>
                       <p className="font-bold text-gray-900 text-lg">{selectedDistrict.upazilas?.length || 0}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
               {/* Education */}
               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600"><BookOpen size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">{isBangla ? 'শিক্ষা প্রতিষ্ঠান' : 'Education Statistics'}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
                        <p className="text-3xl font-bold text-blue-700 mb-1">{selectedDistrict.education?.primary || 0}</p>
                        <p className="text-sm text-blue-600 font-medium">{isBangla ? 'প্রাথমিক বিদ্যালয়' : 'Primary Schools'}</p>
                     </div>
                     <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center">
                        <p className="text-3xl font-bold text-indigo-700 mb-1">{selectedDistrict.education?.highSchool || 0}</p>
                        <p className="text-sm text-indigo-600 font-medium">{isBangla ? 'উচ্চ বিদ্যালয়' : 'High Schools'}</p>
                     </div>
                     <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 text-center">
                        <p className="text-3xl font-bold text-purple-700 mb-1">{selectedDistrict.education?.college || 0}</p>
                        <p className="text-sm text-purple-600 font-medium">{isBangla ? 'কলেজ' : 'Colleges'}</p>
                     </div>
                     <div className="p-5 bg-pink-50/50 rounded-2xl border border-pink-100 text-center">
                        <p className="text-3xl font-bold text-pink-700 mb-1">{selectedDistrict.education?.university || 0}</p>
                        <p className="text-sm text-pink-600 font-medium">{isBangla ? 'বিশ্ববিদ্যালয়' : 'Universities'}</p>
                     </div>
                  </div>
               </div>

               {/* Health */}
               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-red-50 rounded-full text-red-600"><HeartPulse size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">{isBangla ? 'হাসপাতাল ও জরুরী সেবা' : 'Hospitals & Emergency'}</h3>
                  </div>
                  <div className="space-y-4">
                     {selectedDistrict.hospitals?.length > 0 ? selectedDistrict.hospitals.map((hosp: any, idx: number) => (
                       <div key={idx} className="flex items-start gap-4 p-5 bg-red-50/30 rounded-2xl border border-red-100">
                          <div className="bg-white p-3 rounded-full text-red-500 shadow-sm"><Building2 size={20} /></div>
                          <div className="flex-1">
                             <h4 className="font-bold text-gray-900 text-lg">{hosp.name}</h4>
                             <p className="text-sm text-gray-600 flex items-center gap-1 mt-1 mb-3"><MapPin size={14} className="text-red-400" /> {hosp.address}</p>
                             <Button size="sm" variant="danger" className="text-xs h-9 px-4 rounded-lg shadow-sm"><Phone size={14} className="mr-2" /> Call: {hosp.phone}</Button>
                          </div>
                       </div>
                     )) : (
                       <p className="text-center text-gray-400 py-8 italic">{isBangla ? 'কোন তথ্য নেই' : 'No hospital data found'}</p>
                     )}
                  </div>
               </div>

               {/* Tourist Spots */}
               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-orange-50 rounded-full text-orange-600"><Camera size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">{isBangla ? 'দর্শনীয় স্থান' : 'Tourist Spots'}</h3>
                  </div>
                  <ul className="space-y-3">
                    {selectedDistrict.touristSpots?.length > 0 ? selectedDistrict.touristSpots.map((spot: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-4 p-4 hover:bg-orange-50 rounded-xl transition-all cursor-default border border-transparent hover:border-orange-100">
                         <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">{idx + 1}</span>
                         <span className="font-bold text-gray-700 text-lg">{spot}</span>
                         <ArrowRight className="ml-auto text-orange-500 opacity-0 hover:opacity-100" size={20} />
                      </li>
                    )) : (
                      <p className="text-center text-gray-400 py-8 italic">{isBangla ? 'কোন তথ্য নেই' : 'No tourist spots found'}</p>
                    )}
                  </ul>
               </div>

               {/* Upazila List */}
               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-green-50 rounded-full text-green-600"><MapPin size={24} /></div>
                    <h3 className="text-xl font-bold text-gray-900">{isBangla ? 'উপজেলা সমূহ' : 'Administrative Upazilas'}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedDistrict.upazilas?.length > 0 ? selectedDistrict.upazilas.map((upa: string, idx: number) => (
                      <span key={idx} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200">{upa}</span>
                    )) : (
                       <p className="text-gray-400 italic">{isBangla ? 'কোন তথ্য নেই' : 'No upazila data found'}</p>
                    )}
                  </div>
               </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100 animate-fade-in-up max-w-3xl mx-auto mt-12">
             <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 shadow-sm"><MapPin size={32} /></div>
             <h2 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? 'আপনার জেলা নির্বাচন করুন' : 'Select Your District'}</h2>
             <p className="text-gray-500 max-w-md mx-auto text-base mb-8">{isBangla ? 'উপরে সার্চ বক্সে আপনার জেলার নাম লিখে বিস্তারিত তথ্য দেখুন।' : 'Use the search box above to find detailed information about any of the 64 districts.'}</p>
             <div className="flex flex-wrap justify-center gap-2">
               {['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh'].map(city => (
                 <button key={city} onClick={() => handleSearch(city)} className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all text-sm font-medium">{city}</button>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
