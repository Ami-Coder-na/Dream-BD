
import React, { useState } from 'react';
import { MapPin, ArrowRight, Search, Info, ChevronRight, X, Users, BookOpen, HeartPulse, Camera, Building2, Map, ChevronDown, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { AppModule } from '../../types';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
  onModuleSelect?: (module: AppModule) => void;
}

interface DistrictData {
  nameBn: string;
  nameEn: string;
  spots: string[];
}

interface DivisionData {
  id: string;
  nameBn: string;
  nameEn: string;
  districts: DistrictData[];
}

export const AmarBdModule: React.FC<Props> = ({ isBangla, onModuleSelect }) => {
  const [activeDivision, setActiveDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictForDetails, setSelectedDistrictForDetails] = useState<{ district: DistrictData, divisionName: string } | null>(null);
  const [treeOpenDivision, setTreeOpenDivision] = useState<string | null>(null);

  const tourismData: DivisionData[] = [
    {
      id: 'dhaka',
      nameBn: 'ঢাকা বিভাগ',
      nameEn: 'Dhaka Division',
      districts: [
        { nameBn: 'ঢাকা', nameEn: 'Dhaka', spots: ['Lalbagh Fort', 'Ahsan Manzil', 'National Parliament', 'Dhakeshwari Temple', 'Shaheed Minar'] },
        { nameBn: 'গাজীপুর', nameEn: 'Gazipur', spots: ['Bhawal National Park', 'Safari Park', 'Nuhash Polli', 'Turag River'] },
        { nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', spots: ['Sonargaon (Panam City)', 'Folk Art Museum', 'Mary Anderson Floating Restaurant'] },
        { nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', spots: ['Idrakpur Fort', 'Baba Adam Mosque', 'Arial Beel', 'Padma Bridge View Point'] },
        { nameBn: 'নরসিংদী', nameEn: 'Narsingdi', spots: ['Wari-Bateshwar Ruins', 'Dream Holiday Park', 'Ghorashal'] },
        { nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', spots: ['Baliati Palace', 'Teota Zamindar Bari', 'Aricha Ghat'] },
        { nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', spots: ['Mohera Jamindar Bari', 'Madhupur National Park', 'Atiya Mosque', '201 Dome Mosque'] },
        { nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', spots: ['Nikli Haor', 'Jangalbari Fort', 'Egarosindur', 'Sholakia Eidgah'] },
        { nameBn: 'ফরিদপুর', nameEn: 'Faridpur', spots: ['River Research Institute', 'Kanaipur Zamindar Bari', 'Pallikabi Jasimuddin Home'] },
        { nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', spots: ['Mausoleum of Bangabandhu', 'Ulpur Zamindar Bari', 'Modhumoti River'] },
        { nameBn: 'মাদারীপুর', nameEn: 'Madaripur', spots: ['Shakuni Lake', 'Raza Ram Khal', 'Senapati Dighi'] },
        { nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', spots: ['Fateh Jangpur Fort', 'Modern Fantasy Kingdom', 'River Padma'] },
        { nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', spots: ['Goalanda Ghat', 'Jor Bangla Temple', 'Gododhi'] }
      ]
    },
    {
      id: 'chattogram',
      nameBn: 'চট্টগ্রাম বিভাগ',
      nameEn: 'Chattogram Division',
      districts: [
        { nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', spots: ['Patenga Beach', 'Foy\'s Lake', 'Ethnological Museum', 'War Cemetery', 'Guliakhali Beach'] },
        { nameBn: 'কক্সবাজার', nameEn: 'Cox\'s Bazar', spots: ['Longest Sea Beach', 'Himchari', 'Inani Beach', 'Saint Martin\'s Island', 'Radiant Fish World'] },
        { nameBn: 'কুমিল্লা', nameEn: 'Comilla', spots: ['Shalban Vihara', 'Mainamati Ruins', 'Dharmasagar Dighi', 'War Cemetery'] },
        { nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', spots: ['Arifil Mosque', 'Titas Gas Field', 'Ulchapara Mosque'] },
        { nameBn: 'চাঁদপুর', nameEn: 'Chandpur', spots: ['Mohona (Padma-Meghna-Dakatia)', 'Rokto Dhara', 'Mini Cox\'s Bazar'] },
        { nameBn: 'নোয়াখালী', nameEn: 'Noakhali', spots: ['Nijhum Dwip', 'Bajra Shahi Mosque', 'Gandhi Ashram'] },
        { nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', spots: ['Dalal Bazar Zamindar Bari', 'Khoa Sagar Dighi', 'Ramgati'] },
        { nameBn: 'ফেনী', nameEn: 'Feni', spots: ['Muhuri Project', 'Bijoy Singh Dighi', 'Chandgazi Mosque'] },
        { nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachari', spots: ['Alutila Cave', 'Risang Waterfall', 'Hanging Bridge', 'Sajek Valley (Route)'] },
        { nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', spots: ['Kaptai Lake', 'Hanging Bridge', 'Shuvolong Waterfall', 'Polwel Park', 'Sajek Valley'] },
        { nameBn: 'বান্দরবান', nameEn: 'Bandarban', spots: ['Nilagiri', 'Boga Lake', 'Golden Temple', 'Nafakhum', 'Chimbuk Hill'] }
      ]
    },
    {
      id: 'sylhet',
      nameBn: 'সিলেট বিভাগ',
      nameEn: 'Sylhet Division',
      districts: [
        { nameBn: 'সিলেট', nameEn: 'Sylhet', spots: ['Jaflong', 'Ratargul Swamp Forest', 'Bichnakandi', 'Shahjalal Mazar', 'Lalakhal'] },
        { nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', spots: ['Lawachara National Park', 'Madhabkunda Waterfall', 'Srimangal Tea Gardens', 'Hum Hum Waterfall'] },
        { nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', spots: ['Satchari National Park', 'Greenland Park', 'Remaskona'] },
        { nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', spots: ['Tanguar Haor', 'Shimul Bagan', 'Niladri Lake', 'Hason Raja Museum'] }
      ]
    },
    {
      id: 'khulna',
      nameBn: 'খুলনা বিভাগ',
      nameEn: 'Khulna Division',
      districts: [
        { nameBn: 'খুলনা', nameEn: 'Khulna', spots: ['Sundarbans', 'Rupsha Bridge', 'Sixty Dome Mosque (Nearby)', 'Khan Jahan Ali Bridge'] },
        { nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', spots: ['Shat Gombujuj Masjid', 'Khan Jahan Ali Mazar', 'Sundarbans (Karamjal)'] },
        { nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', spots: ['Sundarbans (Kalagachia)', 'Mandarbariya Beach', 'Mozaffar Garden'] },
        { nameBn: 'যশোর', nameEn: 'Jessore', spots: ['Michael Madhusudan Dutta Home', 'Benapole Border', 'Jess Garden Park'] },
        { nameBn: 'মাগুরা', nameEn: 'Magura', spots: ['Sreepur Zamindar Bari', 'Siddheshwari Mot'] },
        { nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', spots: ['Johor Dighi', 'Miar Dalan', 'Naldanga Temple'] },
        { nameBn: 'নড়াইল', nameEn: 'Narail', spots: ['SM Sultan Complex', 'Niribili Picnic Spot', 'Chitra River'] },
        { nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', spots: ['Lalon Shah Mazar', 'Shilaidaha Kuthibari', 'Hardinge Bridge'] },
        { nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', spots: ['Police Park', 'Keru & Co', 'Gholdari Mosque'] },
        { nameBn: 'মেহেরপুর', nameEn: 'Meherpur', spots: ['Mujibnagar Memorial', 'Amjhupi Kuthibari'] }
      ]
    },
    {
      id: 'rajshahi',
      nameBn: 'রাজশাহী বিভাগ',
      nameEn: 'Rajshahi Division',
      districts: [
        { nameBn: 'রাজশাহী', nameEn: 'Rajshahi', spots: ['Varendra Research Museum', 'Bagha Mosque', 'Puthia Temple Complex', 'Padma Garden'] },
        { nameBn: 'বগুড়া', nameEn: 'Bogra', spots: ['Mahasthangarh', 'Behular Bashor Ghar', 'Vasubihara', 'Museum'] },
        { nameBn: 'পাবনা', nameEn: 'Pabna', spots: ['Paksey Hardinge Bridge', 'Tarash Bhaban', 'Gajnar Beel'] },
        { nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', spots: ['Jamuna Bridge', 'Navaratna Temple', 'Rabindra Kuthibari'] },
        { nameBn: 'নাটোর', nameEn: 'Natore', spots: ['Natore Rajbari', 'Uttara Gonobhaban', 'Chalan Beel'] },
        { nameBn: 'নওগাঁ', nameEn: 'Naogaon', spots: ['Paharpur Buddhist Vihara', 'Kusumba Mosque', 'Jobai Beel'] },
        { nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', spots: ['Choto Sona Mosque', 'Mango Orchards', 'Mahananda River View'] },
        { nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', spots: ['Nandail Dighi', 'Baro Shivalaya', 'Lockma Rajbari'] }
      ]
    },
    {
      id: 'barisal',
      nameBn: 'বরিশাল বিভাগ',
      nameEn: 'Barisal Division',
      districts: [
        { nameBn: 'বরিশাল', nameEn: 'Barisal', spots: ['Durga Sagar Dighi', 'Guthia Mosque', 'Floating Guava Market (Bhimruli)'] },
        { nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', spots: ['Kuakata Sea Beach', 'Fatrar Chor', 'Lebur Chor', 'Shutki Palli'] },
        { nameBn: 'ভোলা', nameEn: 'Bhola', spots: ['Monpura Island', 'Char Kukri Mukri', 'Jacob Watch Tower'] },
        { nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', spots: ['Rayerkathi Zamindar Bari', 'Hularhat', 'Baleshwar River'] },
        { nameBn: 'বরগুনা', nameEn: 'Barguna', spots: ['Bibichini Mosque', 'Haringhata Forest', 'Sonakata'] },
        { nameBn: 'ঝালকাঠি', nameEn: 'Jhalokati', spots: ['Kirtipasha Zamindar Bari', 'Floating Markets (Backwaters)'] }
      ]
    },
    {
      id: 'rangpur',
      nameBn: 'রংপুর বিভাগ',
      nameEn: 'Rangpur Division',
      districts: [
        { nameBn: 'রংপুর', nameEn: 'Rangpur', spots: ['Tajhat Palace', 'Vinna Jogot', 'Chikli Beel', 'Begum Rokeya University'] },
        { nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', spots: ['Kantajew Temple', 'Ramsagar Dighi', 'Swapnapuri', 'Nayabad Mosque'] },
        { nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', spots: ['Balashi Ghat', 'Friendship Centre', 'Dreamland'] },
        { nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', spots: ['Dharla Bridge', 'Chilmari Port', 'Shahi Mosque'] },
        { nameBn: 'নীলফামারী', nameEn: 'Nilphamari', spots: ['Nilsagar', 'Teesta Barrage', 'Chini Mosque'] },
        { nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', spots: ['Tin Bigha Corridor', 'Teesta Barrage Park', 'Mogolhat'] },
        { nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', spots: ['Baliadangi Mango Tree', 'Fun City', 'River Tangon'] },
        { nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', spots: ['Kanchenjunga View Point', 'Tetulia Zero Point', 'Banglabandha Port', 'Tea Gardens'] }
      ]
    },
    {
      id: 'mymensingh',
      nameBn: 'ময়মনসিংহ বিভাগ',
      nameEn: 'Mymensingh Division',
      districts: [
        { nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', spots: ['Shashi Lodge', 'Bangladesh Agricultural University', 'Muktigacha Zamindar Bari', 'Shilpacharya Zainul Abedin Sangrahashala'] },
        { nameBn: 'নেত্রকোনা', nameEn: 'Netrokona', spots: ['Birishiri (China Matir Pahar)', 'Someshwari River', 'Durgapur'] },
        { nameBn: 'শেরপুর', nameEn: 'Sherpur', spots: ['Ghazni Abakash', 'Madhutila Eco Park', 'Garo Hill Tracks'] },
        { nameBn: 'জামালপুর', nameEn: 'Jamalpur', spots: ['Lauk Chapra', 'Gandhi Ashram', 'Jamuna Fertilizer Factory Area'] }
      ]
    }
  ];

  // Colors for tree nodes
  const divisionColors: Record<string, string> = {
    dhaka: 'bg-green-600 border-green-600 text-white',
    chattogram: 'bg-teal-600 border-teal-600 text-white',
    sylhet: 'bg-emerald-600 border-emerald-600 text-white',
    khulna: 'bg-cyan-600 border-cyan-600 text-white',
    rajshahi: 'bg-rose-500 border-rose-500 text-white',
    barisal: 'bg-indigo-500 border-indigo-500 text-white',
    rangpur: 'bg-orange-500 border-orange-500 text-white',
    mymensingh: 'bg-purple-600 border-purple-600 text-white',
  };

  const getFilteredDistricts = () => {
    let districts: { district: DistrictData, divisionName: string, divisionId: string }[] = [];
    
    tourismData.forEach(div => {
      if (activeDivision === 'All' || activeDivision === div.id) {
        div.districts.forEach(dist => {
           districts.push({ district: dist, divisionName: isBangla ? div.nameBn : div.nameEn, divisionId: div.id });
        });
      }
    });

    if (searchQuery) {
      districts = districts.filter(d => 
        d.district.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.district.nameBn.includes(searchQuery)
      );
    }

    return districts;
  };

  const filteredList = getFilteredDistricts();

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getOptimizedImageUrl('https://images.unsplash.com/photo-1548013146-72479768bada', 1280)}
            srcSet={`${getOptimizedImageUrl('https://images.unsplash.com/photo-1548013146-72479768bada', 640)} 640w,
                    ${getOptimizedImageUrl('https://images.unsplash.com/photo-1548013146-72479768bada', 1024)} 1024w,
                    ${getOptimizedImageUrl('https://images.unsplash.com/photo-1548013146-72479768bada', 1280)} 1280w`}
            sizes="100vw"
            alt="Bangladesh Landscape" 
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            width="1280"
            height="500"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/1280x500/22c55e/ffffff?text=Beautiful+Bangladesh";
            }}
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider shadow-lg">
            {isBangla ? 'আমাদের মাতৃভূমি' : 'Our Motherland'}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl tracking-tight">
            {isBangla ? 'আমার বাংলাদেশ' : 'Amar Bangladesh'}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl text-gray-100 drop-shadow-md font-medium leading-relaxed">
            {isBangla 
              ? 'হাজার বছরের ইতিহাস, ঐতিহ্য এবং প্রাকৃতিক সৌন্দর্যের এক অপরূপ লীলাভূমি।' 
              : 'A land of thousands of years of history, heritage, and unparalleled natural beauty.'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-700 mb-2">1971</h3>
              <p className="text-gray-600 font-medium">{isBangla ? 'স্বাধীনতা অর্জন' : 'Independence Year'}</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-red-600 mb-2">147k</h3>
              <p className="text-gray-600 font-medium">{isBangla ? 'বর্গ কিলোমিটার' : 'Square Kilometers'}</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-700 mb-2">170M+</h3>
              <p className="text-gray-600 font-medium">{isBangla ? 'জনসংখ্যা' : 'Population'}</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-red-600 mb-2">8th</h3>
              <p className="text-gray-600 font-medium">{isBangla ? 'বিশ্বে জনসংখ্যায়' : 'Most Populous'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW SECTION: ADMINISTRATIVE TREE (Prashashonik Kathamo) --- */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Building2 className="text-green-600" size={32} />
              {isBangla ? 'প্রশাসনিক কাঠামো' : 'Administrative Structure'}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {isBangla 
                ? 'এক নজরে বাংলাদেশের ৮টি বিভাগ এবং ৬৪টি জেলা। বিস্তারিত দেখতে বিভাগে ক্লিক করুন।'
                : 'Bangladesh at a glance: 8 Divisions and 64 Districts. Click on a division to explore.'}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Root Node: Bangladesh */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-24 h-24 rounded-full bg-green-600 border-4 border-white shadow-xl flex flex-col items-center justify-center text-white z-20 hover:scale-110 transition-transform cursor-pointer">
                <span className="text-xs font-bold opacity-80">{isBangla ? 'দেশ' : 'Country'}</span>
                <span className="font-bold text-sm text-center px-1">{isBangla ? 'বাংলাদেশ' : 'Bangladesh'}</span>
              </div>
              {/* Vertical Connector Line */}
              <div className="h-12 w-0.5 bg-gray-300"></div>
            </div>

            {/* Tree Branch Container */}
            <div className="relative pt-8 pb-10 px-4">
              {/* Horizontal Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-0 left-10 right-10 h-8 border-t-2 border-l-2 border-r-2 border-gray-300 rounded-t-2xl"></div>
              {/* Center vertical connector to branch */}
              <div className="hidden md:block absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>

              {/* Division Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {tourismData.map((division, idx) => (
                  <div key={division.id} className="flex flex-col items-center">
                    {/* Vertical Connector for each node (Desktop) */}
                    <div className="hidden md:block h-8 w-0.5 bg-gray-300 mb-[-2px]"></div>
                    
                    {/* Mobile Connector */}
                    <div className="md:hidden h-8 w-0.5 bg-gray-300"></div>

                    {/* Division Card */}
                    <div 
                      onClick={() => setTreeOpenDivision(treeOpenDivision === division.id ? null : division.id)}
                      className={`w-full rounded-xl shadow-sm hover:shadow-lg border-2 transition-all cursor-pointer overflow-hidden ${
                        treeOpenDivision === division.id 
                          ? `${divisionColors[division.id]} ring-2 ring-offset-2 ring-green-500` 
                          : 'bg-white border-gray-100 hover:border-green-200'
                      }`}
                    >
                      <div className={`p-4 flex items-center justify-between ${treeOpenDivision === division.id ? 'text-white' : 'text-gray-800'}`}>
                        <div>
                          <h4 className="font-bold text-lg">{isBangla ? division.nameBn : division.nameEn}</h4>
                          <span className={`text-xs ${treeOpenDivision === division.id ? 'text-white/80' : 'text-gray-500'}`}>
                            {isBangla ? `${division.districts.length}টি জেলা` : `${division.districts.length} Districts`}
                          </span>
                        </div>
                        {treeOpenDivision === division.id ? <ChevronDown size={20} /> : <ChevronRight size={20} className="text-gray-400" />}
                      </div>
                      
                      {/* Expanded Districts Panel */}
                      {treeOpenDivision === division.id && (
                        <div className="bg-white p-4 border-t border-white/20 animate-fade-in cursor-default">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
                            {isBangla ? 'জেলাসমূহ' : 'Districts'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {division.districts.map((dist, dIdx) => (
                              <span 
                                key={dIdx} 
                                className="inline-block px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                              >
                                {isBangla ? dist.nameBn : dist.nameEn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 64 Districts Tourism Section - Sticky controls */}
      <div id="districts" className="py-20 bg-gray-50/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {isBangla ? '৬৪ জেলার দর্শনীয় স্থান' : 'Explore 64 Districts'}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
              {isBangla 
                ? 'আপনার ভ্রমণের গন্তব্য ঠিক করুন। বিভাগ অনুযায়ী জেলা খুঁজুন এবং দর্শনীয় স্থান সম্পর্কে জানুন।' 
                : 'Plan your next trip. Find tourist spots in every district organized by division.'}
            </p>
          </div>

          {/* Sticky Controls */}
          <div className="sticky top-24 z-30 mb-12">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-3 max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50 px-1">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveDivision('All')}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                        activeDivision === 'All' 
                          ? 'bg-green-600 text-white shadow-md' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-green-700'
                      }`}
                    >
                      {isBangla ? 'সব' : 'All'}
                    </button>
                    {tourismData.map(div => (
                      <button
                        key={div.id}
                        onClick={() => setActiveDivision(div.id)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                          activeDivision === div.id 
                            ? 'bg-green-600 text-white shadow-md' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-green-700'
                        }`}
                      >
                        {isBangla ? div.nameBn : div.nameEn}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-72 shrink-0 border-l border-gray-100 md:pl-4">
                   <div className="relative group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                     <input 
                       type="text" 
                       placeholder={isBangla ? 'জেলা খুঁজুন...' : 'Search district...'}
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 bg-gray-50 focus:bg-white transition-all text-sm font-medium"
                     />
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredList.length > 0 ? (
              filteredList.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDistrictForDetails(item)}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                       {isBangla ? item.district.nameBn : item.district.nameEn}
                    </h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.divisionName}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    {item.district.spots.slice(0, 3).map((spot, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0 group-hover:bg-green-600 transition-colors shadow-sm"></div>
                         <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors line-clamp-1">{spot}</span>
                      </li>
                    ))}
                    {item.district.spots.length > 3 && (
                      <li className="pl-4 text-xs font-semibold text-green-600/70">
                        + {item.district.spots.length - 3} {isBangla ? 'আরও' : 'more'}
                      </li>
                    )}
                  </ul>
                  
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between group/link mt-auto">
                    <span className="text-xs font-bold text-green-600 group-hover:underline transition-colors flex items-center gap-1">
                      {isBangla ? 'বিস্তারিত দেখুন' : 'View Details'} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                   <Info size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-1">{isBangla ? 'কোন জেলা পাওয়া যায়নি' : 'No districts found'}</h3>
                 <p className="text-gray-500 text-sm">
                   {isBangla ? 'অনুগ্রহ করে বানান যাচাই করুন অথবা অন্য জেলা খুঁজুন।' : 'Try adjusting your search terms.'}
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* District Details Modal */}
      {selectedDistrictForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedDistrictForDetails(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{isBangla ? selectedDistrictForDetails.district.nameBn : selectedDistrictForDetails.district.nameEn}</h2>
                <p className="text-sm text-gray-500">{selectedDistrictForDetails.divisionName}</p>
              </div>
              <button onClick={() => setSelectedDistrictForDetails(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                <p className="text-green-800 text-sm leading-relaxed">
                  {isBangla 
                    ? `স্বাগতম ${selectedDistrictForDetails.district.nameBn} জেলায়। এটি ${selectedDistrictForDetails.divisionName}-এর একটি ঐতিহ্যবাহী জেলা যা তার প্রাকৃতিক সৌন্দর্য এবং ঐতিহাসিক নিদর্শনের জন্য পরিচিত।` 
                    : `Welcome to ${selectedDistrictForDetails.district.nameEn} district. A traditional district in ${selectedDistrictForDetails.divisionName}, known for its natural beauty and historical sites.`}
                </p>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Map size={20} className="text-green-600" />
                {isBangla ? 'দর্শনীয় স্থানসমূহ' : 'Tourist Spots'}
              </h3>

              <div className="space-y-4">
                {selectedDistrictForDetails.district.spots.map((spot, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-green-200 hover:bg-green-50/30 transition-colors">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{spot}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {isBangla 
                        ? 'এটি জেলার অন্যতম জনপ্রিয় পর্যটন কেন্দ্র। পর্যটকদের জন্য একটি চমৎকার গন্তব্য।' 
                        : 'One of the most popular tourist centers in the district. A wonderful destination for tourists.'}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded">
                      <MapPin size={12} />
                      {isBangla ? 'শহর থেকে ৫ কি.মি. দূরে' : '5 km from city center'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setSelectedDistrictForDetails(null)}>
                {isBangla ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* History & Culture */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-red-500 pl-4">
               {isBangla ? 'ইতিহাস ও ঐতিহ্য' : 'History & Heritage'}
             </h2>
             <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
               <p>
                 {isBangla 
                   ? '১৯৫২ সালের ভাষা আন্দোলন এবং ১৯৭১ সালের মহান মুক্তিযুদ্ধের মাধ্যমে অর্জিত আমাদের এই বাংলাদেশ। রক্তস্নাত ইতিহাসের সাক্ষী এই দেশ।'
                   : 'Bangladesh was born through the Language Movement of 1952 and the Great Liberation War of 1971. A nation built on sacrifice and resilience.'}
               </p>
               <p>
                 {isBangla
                   ? 'পহেলা বৈশাখ, ঈদ, দুর্গোৎসব এবং নবান্ন উৎসবের মতো হাজারো রঙে রঙিন আমাদের সংস্কৃতি।'
                   : 'Our culture is vibrant with festivals like Pohela Boishakh, Eid, Durga Puja, and Nabanna, celebrating unity in diversity.'}
               </p>
             </div>
             <div className="mt-8 flex gap-4">
               <Button className="bg-red-600 hover:bg-red-700 border-none">
                 {isBangla ? 'মুক্তিযুদ্ধ জাদুঘর' : 'Liberation War Museum'}
               </Button>
               <Button variant="outline">
                 {isBangla ? 'আরও জানুন' : 'Learn More'}
               </Button>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img 
               src={getOptimizedImageUrl('https://images.unsplash.com/photo-1584351608663-7140f7f32924', 800)}
               srcSet={`${getOptimizedImageUrl('https://images.unsplash.com/photo-1584351608663-7140f7f32924', 400)} 400w,
                       ${getOptimizedImageUrl('https://images.unsplash.com/photo-1584351608663-7140f7f32924', 800)} 800w`}
               sizes="(max-width: 768px) 100vw, 50vw"
               className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8" 
               alt="Rickshaw Art" 
               loading="lazy" 
               decoding="async"
               width="400"
               height="600"
               onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600?text=Rickshaw+Art"; }}
             />
             <img 
               src={getOptimizedImageUrl('https://images.unsplash.com/photo-1596464716127-f2a82984de30', 800)}
               srcSet={`${getOptimizedImageUrl('https://images.unsplash.com/photo-1596464716127-f2a82984de30', 400)} 400w,
                       ${getOptimizedImageUrl('https://images.unsplash.com/photo-1596464716127-f2a82984de30', 800)} 800w`}
               sizes="(max-width: 768px) 100vw, 50vw"
               className="rounded-2xl shadow-lg w-full h-64 object-cover" 
               alt="Culture" 
               loading="lazy"
               decoding="async" 
               width="400"
               height="600"
               onError={(e) => { e.currentTarget.src = "https://placehold.co/400x600?text=Culture"; }}
             />
          </div>
        </div>
      </div>

      {/* National Symbols Grid */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <h2 className="text-3xl font-bold text-gray-900 mb-12">
            {isBangla ? 'জাতীয় প্রতীকসমূহ' : 'National Symbols'}
         </h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img 
                 src={getOptimizedImageUrl('https://images.unsplash.com/photo-1505576399279-565b52d4ac71', 400)}
                 srcSet={`${getOptimizedImageUrl('https://images.unsplash.com/photo-1505576399279-565b52d4ac71', 200)} 200w,
                         ${getOptimizedImageUrl('https://images.unsplash.com/photo-1505576399279-565b52d4ac71', 400)} 400w`}
                 sizes="(max-width: 768px) 50vw, 25vw"
                 alt="Tiger" 
                 className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" 
                 loading="lazy"
                 decoding="async" 
                 width="80"
                 height="80"
                 onError={(e) => { e.currentTarget.src = "https://placehold.co/100?text=Tiger"; }}
               />
               <h4 className="font-bold text-gray-800">{isBangla ? 'রয়েল বেঙ্গল টাইগার' : 'Royal Bengal Tiger'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় পশু' : 'National Animal'}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img 
                 src={getOptimizedImageUrl('https://images.unsplash.com/photo-1508605448373-bd85d0335e98', 400)}
                 srcSet={`${getOptimizedImageUrl('https://images.unsplash.com/photo-1508605448373-bd85d0335e98', 200)} 200w,
                         ${getOptimizedImageUrl('https://images.unsplash.com/photo-1508605448373-bd85d0335e98', 400)} 400w`}
                 sizes="(max-width: 768px) 50vw, 25vw"
                 alt="Water Lily" 
                 className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" 
                 loading="lazy"
                 decoding="async" 
                 width="80"
                 height="80"
                 onError={(e) => { e.currentTarget.src = "https://placehold.co/100?text=Water+Lily"; }}
               />
               <h4 className="font-bold text-gray-800">{isBangla ? 'শাপলা' : 'Water Lily'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় ফুল' : 'National Flower'}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img 
                 src={getOptimizedImageUrl('https://images.unsplash.com/photo-1559865611-30018314ddf4', 400)}
                 srcSet={`${getOptimizedImageUrl('https://images.unsplash.com/photo-1559865611-30018314ddf4', 200)} 200w,
                         ${getOptimizedImageUrl('https://images.unsplash.com/photo-1559865611-30018314ddf4', 400)} 400w`}
                 sizes="(max-width: 768px) 50vw, 25vw"
                 alt="Jackfruit" 
                 className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" 
                 loading="lazy"
                 decoding="async" 
                 width="80"
                 height="80"
                 onError={(e) => { e.currentTarget.src = "https://placehold.co/100?text=Jackfruit"; }}
               />
               <h4 className="font-bold text-gray-800">{isBangla ? 'কাঁঠাল' : 'Jackfruit'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় ফল' : 'National Fruit'}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Tenualosa_ilisha_fish.jpg/640px-Tenualosa_ilisha_fish.jpg" 
                 alt="Fish" 
                 className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" 
                 loading="lazy"
                 decoding="async" 
                 width="80"
                 height="80"
                 onError={(e) => { e.currentTarget.src = "https://placehold.co/100?text=Hilsa+Fish"; }}
               />
               <h4 className="font-bold text-gray-800">{isBangla ? 'ইলিশ' : 'Hilsa'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় মাছ' : 'National Fish'}</p>
            </div>
         </div>
      </div>

    </div>
  );
};
