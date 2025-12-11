
import React, { useState } from 'react';
import { MapPin, ArrowRight, Search, Compass, Info, Star, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
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

export const AmarBdModule: React.FC<Props> = ({ isBangla }) => {
  const [activeDivision, setActiveDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Comprehensive Data for 8 Divisions and their Districts
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

  // Helper to get all districts if "All" is selected, or filtered by division
  const getFilteredDistricts = () => {
    let districts: { district: DistrictData, divisionName: string }[] = [];
    
    tourismData.forEach(div => {
      if (activeDivision === 'All' || activeDivision === div.id) {
        div.districts.forEach(dist => {
           districts.push({ district: dist, divisionName: isBangla ? div.nameBn : div.nameEn });
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
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1280"
            srcSet="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=640 640w,
                    https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1024 1024w,
                    https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1280 1280w"
            sizes="100vw"
            alt="Bangladesh Landscape" 
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          {/* Enhanced Dark Overlay for Contrast */}
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

      {/* 64 Districts Tourism Section - NEW DESIGN */}
      <div id="districts" className="py-20 bg-gray-50/50">
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

          {/* Sticky Controls Container */}
          <div className="sticky top-24 z-30 mb-12">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-3 max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-4">
                
                {/* Division Tabs - Scrollable */}
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

                {/* Search Bar - Fixed width on Desktop */}
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

          {/* Districts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredList.length > 0 ? (
              filteredList.map((item, idx) => (
                <div key={idx} className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  
                  {/* Decorative Background Icon */}
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
                    <MapPin size={120} className="transform rotate-12" />
                  </div>

                  {/* Header */}
                  <div className="relative z-10 mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold mb-3 border border-green-100">
                      {item.divisionName}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                       {isBangla ? item.district.nameBn : item.district.nameEn}
                    </h3>
                  </div>
                  
                  {/* Spots List */}
                  <div className="relative z-10 space-y-3 mb-6">
                    {item.district.spots.slice(0, 3).map((spot, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0 group-hover:bg-green-600 transition-colors shadow-sm"></div>
                         <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors line-clamp-1">{spot}</span>
                      </div>
                    ))}
                    {item.district.spots.length > 3 && (
                      <div className="pl-4 text-xs font-semibold text-green-600/70">
                        + {item.district.spots.length - 3} {isBangla ? 'আরও' : 'more'}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="relative z-10 pt-4 border-t border-gray-50 flex items-center justify-between group/link">
                    <span className="text-xs font-bold text-gray-400 group-hover:text-green-600 transition-colors">
                      {isBangla ? 'বিস্তারিত দেখুন' : 'View Details'}
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
               src="https://images.unsplash.com/photo-1584351608663-7140f7f32924?auto=format&fit=crop&q=80&w=800"
               srcSet="https://images.unsplash.com/photo-1584351608663-7140f7f32924?auto=format&fit=crop&q=80&w=400 400w,
                       https://images.unsplash.com/photo-1584351608663-7140f7f32924?auto=format&fit=crop&q=80&w=800 800w"
               sizes="(max-width: 768px) 100vw, 50vw"
               className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8" 
               alt="Rickshaw Art" 
               loading="lazy" 
               decoding="async"
             />
             <img 
               src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800"
               srcSet="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=400 400w,
                       https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800 800w"
               sizes="(max-width: 768px) 100vw, 50vw"
               className="rounded-2xl shadow-lg w-full h-64 object-cover" 
               alt="Culture" 
               loading="lazy"
               decoding="async" 
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
                 src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=400"
                 srcSet="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=200 200w,
                         https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=400 400w"
                 sizes="(max-width: 768px) 50vw, 25vw"
                 alt="Tiger" 
                 className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" 
                 loading="lazy"
                 decoding="async" 
               />
               <h4 className="font-bold text-gray-800">{isBangla ? 'রয়েল বেঙ্গল টাইগার' : 'Royal Bengal Tiger'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় পশু' : 'National Animal'}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img 
                 src="https://images.unsplash.com/photo-1508605448373-bd85d0335e98?auto=format&fit=crop&q=80&w=400"
                 srcSet="https://images.unsplash.com/photo-1508605448373-bd85d0335e98?auto=format&fit=crop&q=80&w=200 200w,
                         https://images.unsplash.com/photo-1508605448373-bd85d0335e98?auto=format&fit=crop&q=80&w=400 400w"
                 sizes="(max-width: 768px) 50vw, 25vw"
                 alt="Water Lily" 
                 className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" 
                 loading="lazy"
                 decoding="async" 
               />
               <h4 className="font-bold text-gray-800">{isBangla ? 'শাপলা' : 'Water Lily'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় ফুল' : 'National Flower'}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img 
                 src="https://images.unsplash.com/photo-1559865611-30018314ddf4?auto=format&fit=crop&q=80&w=400"
                 srcSet="https://images.unsplash.com/photo-1559865611-30018314ddf4?auto=format&fit=crop&q=80&w=200 200w,
                         https://images.unsplash.com/photo-1559865611-30018314ddf4?auto=format&fit=crop&q=80&w=400 400w"
                 sizes="(max-width: 768px) 50vw, 25vw"
                 alt="Jackfruit" 
                 className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" 
                 loading="lazy"
                 decoding="async" 
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
               />
               <h4 className="font-bold text-gray-800">{isBangla ? 'ইলিশ' : 'Hilsa'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় মাছ' : 'National Fish'}</p>
            </div>
         </div>
      </div>

    </div>
  );
};
