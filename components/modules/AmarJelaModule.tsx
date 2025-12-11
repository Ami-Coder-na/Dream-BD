
import React, { useState } from 'react';
import { Search, MapPin, Users, BookOpen, HeartPulse, Building2, Phone, Camera, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

// 1. Types for District Data
interface DistrictInfo {
  id: string;
  nameEn: string;
  nameBn: string;
  division: string;
  population: string;
  area: string;
  description: string;
  upazilas: string[];
  education: {
    primary: number;
    highSchool: number;
    college: number;
    university: number;
  };
  hospitals: {
    name: string;
    address: string;
    phone: string;
  }[];
  touristSpots: string[];
  images: string[];
}

// 2. Data Population Helper
const getDistrictData = (id: string, nameEn: string, nameBn: string, division: string): DistrictInfo => {
  return {
    id,
    nameEn,
    nameBn,
    division,
    population: '2,500,000+', // Placeholder average
    area: '2,000 km²',
    description: `Welcome to ${nameEn}, a beautiful district in the ${division} division. Known for its rich culture and friendly people.`,
    upazilas: [`${nameEn} Sadar`, 'Upazila A', 'Upazila B', 'Upazila C', 'Upazila D'],
    education: {
      primary: 1250,
      highSchool: 450,
      college: 85,
      university: 2
    },
    hospitals: [
      { name: `${nameEn} Sadar Hospital`, address: 'Hospital Road, Sadar', phone: '01700-000000' },
      { name: 'District General Clinic', address: 'College Road', phone: '01800-000000' }
    ],
    touristSpots: [`${nameEn} Park`, 'Central Mosque', 'River View Point'],
    images: [
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5', // Green Bangladesh
      'https://images.unsplash.com/photo-1628189873998-25f00e95a947', // Nature
      'https://images.unsplash.com/photo-1582811466099-28c148f34346'  // River
    ]
  };
};

// 3. The 64 District List (Grouped by Division)
const ALL_DISTRICTS = [
  // Dhaka
  { id: 'dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা', division: 'Dhaka' },
  { id: 'gazipur', nameEn: 'Gazipur', nameBn: 'গাজীপুর', division: 'Dhaka' },
  { id: 'narayanganj', nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', division: 'Dhaka' },
  { id: 'munshiganj', nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', division: 'Dhaka' },
  { id: 'narsingdi', nameEn: 'Narsingdi', nameBn: 'নরসিংদী', division: 'Dhaka' },
  { id: 'manikganj', nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', division: 'Dhaka' },
  { id: 'tangail', nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', division: 'Dhaka' },
  { id: 'kishoreganj', nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', division: 'Dhaka' },
  { id: 'faridpur', nameEn: 'Faridpur', nameBn: 'ফরিদপুর', division: 'Dhaka' },
  { id: 'gopalganj', nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', division: 'Dhaka' },
  { id: 'madaripur', nameEn: 'Madaripur', nameBn: 'মাদারীপুর', division: 'Dhaka' },
  { id: 'shariatpur', nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর', division: 'Dhaka' },
  { id: 'rajbari', nameEn: 'Rajbari', nameBn: 'রাজবাড়ী', division: 'Dhaka' },
  
  // Chattogram
  { id: 'chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', division: 'Chattogram' },
  { id: 'coxsbazar', nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার', division: 'Chattogram' },
  { id: 'comilla', nameEn: 'Comilla', nameBn: 'কুমিল্লা', division: 'Chattogram' },
  { id: 'brahmanbaria', nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram' },
  { id: 'chandpur', nameEn: 'Chandpur', nameBn: 'চাঁদপুর', division: 'Chattogram' },
  { id: 'noakhali', nameEn: 'Noakhali', nameBn: 'নোয়াখালী', division: 'Chattogram' },
  { id: 'lakshmipur', nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', division: 'Chattogram' },
  { id: 'feni', nameEn: 'Feni', nameBn: 'ফেনী', division: 'Chattogram' },
  { id: 'khagrachari', nameEn: 'Khagrachari', nameBn: 'খাগড়াছড়ি', division: 'Chattogram' },
  { id: 'rangamati', nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', division: 'Chattogram' },
  { id: 'bandarban', nameEn: 'Bandarban', nameBn: 'বান্দরবান', division: 'Chattogram' },

  // Sylhet
  { id: 'sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট', division: 'Sylhet' },
  { id: 'moulvibazar', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', division: 'Sylhet' },
  { id: 'habiganj', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', division: 'Sylhet' },
  { id: 'sunamganj', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', division: 'Sylhet' },

  // Khulna
  { id: 'khulna', nameEn: 'Khulna', nameBn: 'খুলনা', division: 'Khulna' },
  { id: 'bagerhat', nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', division: 'Khulna' },
  { id: 'satkhira', nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', division: 'Khulna' },
  { id: 'jessore', nameEn: 'Jessore', nameBn: 'যশোর', division: 'Khulna' },
  { id: 'magura', nameEn: 'Magura', nameBn: 'মাগুরা', division: 'Khulna' },
  { id: 'jhenaidah', nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', division: 'Khulna' },
  { id: 'narail', nameEn: 'Narail', nameBn: 'নড়াইল', division: 'Khulna' },
  { id: 'kushtia', nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', division: 'Khulna' },
  { id: 'chuadanga', nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', division: 'Khulna' },
  { id: 'meherpur', nameEn: 'Meherpur', nameBn: 'মেহেরপুর', division: 'Khulna' },

  // Rajshahi
  { id: 'rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী', division: 'Rajshahi' },
  { id: 'bogra', nameEn: 'Bogra', nameBn: 'বগুড়া', division: 'Rajshahi' },
  { id: 'pabna', nameEn: 'Pabna', nameBn: 'পাবনা', division: 'Rajshahi' },
  { id: 'sirajganj', nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', division: 'Rajshahi' },
  { id: 'natore', nameEn: 'Natore', nameBn: 'নাটোর', division: 'Rajshahi' },
  { id: 'naogaon', nameEn: 'Naogaon', nameBn: 'নওগাঁ', division: 'Rajshahi' },
  { id: 'chapainawabganj', nameEn: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi' },
  { id: 'joypurhat', nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট', division: 'Rajshahi' },

  // Barisal
  { id: 'barisal', nameEn: 'Barisal', nameBn: 'বরিশাল', division: 'Barisal' },
  { id: 'patuakhali', nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', division: 'Barisal' },
  { id: 'bhola', nameEn: 'Bhola', nameBn: 'ভোলা', division: 'Barisal' },
  { id: 'pirojpur', nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', division: 'Barisal' },
  { id: 'barguna', nameEn: 'Barguna', nameBn: 'বরগুনা', division: 'Barisal' },
  { id: 'jhalokati', nameEn: 'Jhalokati', nameBn: 'ঝালকাঠি', division: 'Barisal' },

  // Rangpur
  { id: 'rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর', division: 'Rangpur' },
  { id: 'dinajpur', nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', division: 'Rangpur' },
  { id: 'gaibandha', nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', division: 'Rangpur' },
  { id: 'kurigram', nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', division: 'Rangpur' },
  { id: 'nilphamari', nameEn: 'Nilphamari', nameBn: 'নীলফামারী', division: 'Rangpur' },
  { id: 'lalmonirhat', nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট', division: 'Rangpur' },
  { id: 'thakurgaon', nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', division: 'Rangpur' },
  { id: 'panchagarh', nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', division: 'Rangpur' },

  // Mymensingh
  { id: 'mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', division: 'Mymensingh' },
  { id: 'netrokona', nameEn: 'Netrokona', nameBn: 'নেত্রকোনা', division: 'Mymensingh' },
  { id: 'sherpur', nameEn: 'Sherpur', nameBn: 'শেরপুর', division: 'Mymensingh' },
  { id: 'jamalpur', nameEn: 'Jamalpur', nameBn: 'জামালপুর', division: 'Mymensingh' }
];

export const AmarJelaModule: React.FC<Props> = ({ isBangla }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(null);
  const [suggestions, setSuggestions] = useState<typeof ALL_DISTRICTS>([]);

  // Search Logic
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = ALL_DISTRICTS.filter(d => 
        d.nameEn.toLowerCase().includes(term.toLowerCase()) || 
        d.nameBn.includes(term)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectDistrict = (district: typeof ALL_DISTRICTS[0]) => {
    // Generate full data for the selected district
    const fullData = getDistrictData(district.id, district.nameEn, district.nameBn, district.division);
    
    // CUSTOMIZATION for specific districts to show accurate examples
    if (district.id === 'dhaka') {
      fullData.population = '22 Million+';
      fullData.touristSpots = ['Lalbagh Fort', 'Ahsan Manzil', 'National Parliament', 'Dhakeshwari Temple'];
      fullData.hospitals = [
        { name: 'Dhaka Medical College Hospital', address: 'Bakshi Bazar, Dhaka', phone: '02-55165088' },
        { name: 'Kurmitola General Hospital', address: 'Cantonment, Dhaka', phone: '02-8712345' }
      ];
      fullData.images = [
        'https://images.unsplash.com/photo-1619671603704-8b6567958611', // Parliament
        'https://images.unsplash.com/photo-1594196163273-5a02796fb322', // Ahsan Manzil
        'https://images.unsplash.com/photo-1628189873998-25f00e95a947'  // City
      ];
    } else if (district.id === 'coxsbazar') {
      fullData.population = '2.3 Million';
      fullData.touristSpots = ['Longest Sea Beach', 'Himchari', 'Inani Beach', 'Radiant Fish World'];
      fullData.images = [
        'https://images.unsplash.com/photo-1599580460305-64906f23349e', // Beach
        'https://images.unsplash.com/photo-1549885744-83952f4a5697', // Boats
        'https://images.unsplash.com/photo-1582811466099-28c148f34346'  // Sunset
      ];
    }

    setSelectedDistrict(fullData);
    setSuggestions([]);
    setSearchTerm('');
  };

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in pb-24">
      
      {/* Hero Search Section - Fixed Clipping/Z-Index */}
      <div className="relative pt-20 pb-32 px-4 text-center">
        {/* Background - Separated to handle overflow hiding independently */}
        <div className="absolute inset-0 overflow-hidden z-0">
           <div className="absolute inset-0 bg-teal-700"></div>
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-teal-800"></div>
        </div>

        {/* Content - High Z-index to float above everything */}
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

            {/* Suggestions Dropdown - Now visible outside hero */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left max-h-72 overflow-y-auto animate-fade-in-up ring-1 ring-black/5">
                {suggestions.map((dist) => (
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

      {/* Main Content Area - Z-20 to be below search dropdown but above background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        
        {selectedDistrict ? (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start border border-gray-100">
              <div className="w-full lg:w-1/3 space-y-3">
                 <img 
                   src={getOptimizedImageUrl(selectedDistrict.images[0], 600)} 
                   alt={selectedDistrict.nameEn} 
                   className="w-full h-64 object-cover rounded-2xl shadow-md transform hover:scale-[1.02] transition-transform duration-500"
                   loading="lazy"
                   onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/teal/white?text=District+Image"; }}
                 />
                 <div className="grid grid-cols-2 gap-3">
                    <img 
                      src={getOptimizedImageUrl(selectedDistrict.images[1], 400)} 
                      className="w-full h-28 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity" 
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/teal/white?text=Image"; }}
                    />
                    <img 
                      src={getOptimizedImageUrl(selectedDistrict.images[2], 400)} 
                      className="w-full h-28 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity" 
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/teal/white?text=Image"; }}
                    />
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
                   {selectedDistrict.description}
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
                       <p className="font-bold text-gray-900 text-lg">{selectedDistrict.upazilas.length}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Detailed Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
               
               {/* Education */}
               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isBangla ? 'শিক্ষা প্রতিষ্ঠান' : 'Education Statistics'}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 text-center hover:bg-blue-50 transition-colors">
                        <p className="text-3xl font-bold text-blue-700 mb-1">{selectedDistrict.education.primary}</p>
                        <p className="text-sm text-blue-600 font-medium">{isBangla ? 'প্রাথমিক বিদ্যালয়' : 'Primary Schools'}</p>
                     </div>
                     <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-center hover:bg-indigo-50 transition-colors">
                        <p className="text-3xl font-bold text-indigo-700 mb-1">{selectedDistrict.education.highSchool}</p>
                        <p className="text-sm text-indigo-600 font-medium">{isBangla ? 'উচ্চ বিদ্যালয়' : 'High Schools'}</p>
                     </div>
                     <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 text-center hover:bg-purple-50 transition-colors">
                        <p className="text-3xl font-bold text-purple-700 mb-1">{selectedDistrict.education.college}</p>
                        <p className="text-sm text-purple-600 font-medium">{isBangla ? 'কলেজ' : 'Colleges'}</p>
                     </div>
                     <div className="p-5 bg-pink-50/50 rounded-2xl border border-pink-100 text-center hover:bg-pink-50 transition-colors">
                        <p className="text-3xl font-bold text-pink-700 mb-1">{selectedDistrict.education.university}</p>
                        <p className="text-sm text-pink-600 font-medium">{isBangla ? 'বিশ্ববিদ্যালয়' : 'Universities'}</p>
                     </div>
                  </div>
               </div>

               {/* Health */}
               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-red-50 rounded-full text-red-600">
                      <HeartPulse size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isBangla ? 'হাসপাতাল ও জরুরী সেবা' : 'Hospitals & Emergency'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                     {selectedDistrict.hospitals.map((hosp, idx) => (
                       <div key={idx} className="flex items-start gap-4 p-5 bg-red-50/30 rounded-2xl border border-red-100 hover:bg-red-50 transition-colors group">
                          <div className="bg-white p-3 rounded-full text-red-500 shadow-sm border border-red-50">
                             <Building2 size={20} />
                          </div>
                          <div className="flex-1">
                             <h4 className="font-bold text-gray-900 text-lg group-hover:text-red-700 transition-colors">{hosp.name}</h4>
                             <p className="text-sm text-gray-600 flex items-center gap-1 mt-1 mb-3">
                               <MapPin size={14} className="text-red-400" /> {hosp.address}
                             </p>
                             <Button size="sm" variant="danger" className="text-xs h-9 px-4 rounded-lg shadow-sm">
                                <Phone size={14} className="mr-2" /> Call: {hosp.phone}
                             </Button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Tourist Spots */}
               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-orange-50 rounded-full text-orange-600">
                      <Camera size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isBangla ? 'দর্শনীয় স্থান' : 'Tourist Spots'}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {selectedDistrict.touristSpots.map((spot, idx) => (
                      <li key={idx} className="flex items-center gap-4 p-4 hover:bg-orange-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-orange-100">
                         <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                           {idx + 1}
                         </span>
                         <span className="font-bold text-gray-700 group-hover:text-orange-800 text-lg">{spot}</span>
                         <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                           <ArrowRight className="text-orange-500" size={20} />
                         </div>
                      </li>
                    ))}
                  </ul>
               </div>

               {/* Upazila List */}
               <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-green-50 rounded-full text-green-600">
                      <MapPin size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isBangla ? 'উপজেলা সমূহ' : 'Administrative Upazilas'}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {selectedDistrict.upazilas.map((upa, idx) => (
                      <span key={idx} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all cursor-default">
                        {upa}
                      </span>
                    ))}
                  </div>
               </div>

            </div>

          </div>
        ) : (
          /* Empty State / Initial Prompt - COMPACT & POSITIONED */
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100 animate-fade-in-up max-w-3xl mx-auto mt-12">
             <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 shadow-sm">
               <MapPin size={32} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-3">
               {isBangla ? 'আপনার জেলা নির্বাচন করুন' : 'Select Your District'}
             </h2>
             <p className="text-gray-500 max-w-md mx-auto text-base mb-8">
               {isBangla ? 'উপরে সার্চ বক্সে আপনার জেলার নাম লিখে বিস্তারিত তথ্য দেখুন।' : 'Use the search box above to find detailed information about any of the 64 districts.'}
             </p>
             
             {/* Suggested Districts Pills */}
             <div className="flex flex-wrap justify-center gap-2">
               {['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh'].map(city => (
                 <button 
                   key={city}
                   onClick={() => handleSearch(city)}
                   className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all text-sm font-medium"
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
