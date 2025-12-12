
import React, { useState, useMemo } from 'react';
import { MapPin, ArrowRight, Search, Info, ChevronRight, X, Users, BookOpen, HeartPulse, Camera, Building2, Map, ChevronDown, Gem, Utensils, Shirt, Coffee, Leaf, Droplets, Gift } from 'lucide-react';
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

// --- NEW DATA: District Branding (Famous For) ---
const DISTRICT_BRANDING = {
  dhaka: [
    { nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', productBn: 'তাঁতের শাড়ি ও চমচম', productEn: 'Handloom Saree & Chomchom', type: 'cloth' },
    { nameBn: 'গাজীপুর', nameEn: 'Gazipur', productBn: 'কাঁঠাল ও পেয়ারা', productEn: 'Jackfruit & Guava', type: 'fruit' },
    { nameBn: 'নরসিংদী', nameEn: 'Narsingdi', productBn: 'কলা ও তাঁত শিল্প', productEn: 'Banana & Loom Industry', type: 'fruit' },
    { nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', productBn: 'আলু ও ভাগ্যকুলের মিষ্টি', productEn: 'Potato & Sweets', type: 'food' },
    { nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', productBn: 'বালিশ মিষ্টি ও পনির', productEn: 'Balish Misti & Cheese', type: 'food' },
    { nameBn: 'ঢাকা', nameEn: 'Dhaka', productBn: 'বেনারসি শাড়ি ও বাকরখানি', productEn: 'Benarosi Saree & Bakarkhani', type: 'cloth' },
  ],
  chattogram: [
    { nameBn: 'কুমিল্লা', nameEn: 'Comilla', productBn: 'রসমলাই ও খাদি কাপড়', productEn: 'Rasmalai & Khadi Cloth', type: 'food' },
    { nameBn: 'চাঁদপুর', nameEn: 'Chandpur', productBn: 'ইলিশ মাছ', productEn: 'Hilsa Fish', type: 'nature' },
    { nameBn: 'ফেনী', nameEn: 'Feni', productBn: 'মহিষের ঘি', productEn: 'Buffalo Ghee', type: 'food' },
    { nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", productBn: 'শুঁটকি ও লবণ', productEn: 'Dry Fish & Salt', type: 'food' },
    { nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', productBn: 'আনারস ও কাজুবাদাম', productEn: 'Pineapple & Cashew Nut', type: 'fruit' },
    { nameBn: 'বান্দরবান', nameEn: 'Bandarban', productBn: 'পাহাড়ি তাঁত ও কফি', productEn: 'Hill Loom & Coffee', type: 'nature' },
  ],
  rajshahi: [
    { nameBn: 'রাজশাহী', nameEn: 'Rajshahi', productBn: 'রেশম (সিল্ক) ও আম', productEn: 'Silk & Mango', type: 'cloth' },
    { nameBn: 'বগুড়া', nameEn: 'Bogra', productBn: 'দই ও কটকটি', productEn: 'Curd (Doi) & Kotkoti', type: 'food' },
    { nameBn: 'নাটোর', nameEn: 'Natore', productBn: 'কাঁচাগোল্লা', productEn: 'Kachagolla (Sweet)', type: 'food' },
    { nameBn: 'পাবনা', nameEn: 'Pabna', productBn: 'ঘি ও হোসিয়ারি পণ্য', productEn: 'Ghee & Hosiery', type: 'food' },
    { nameBn: 'নওগাঁ', nameEn: 'Naogaon', productBn: 'নকশী কাঁথা ও চাল', productEn: 'Nakshi Kantha & Rice', type: 'cloth' },
    { nameBn: 'চাপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', productBn: 'ফজলির আম ও কলাই রুটি', productEn: 'Fazli Mango & Kalai Ruti', type: 'fruit' },
  ],
  khulna: [
    { nameBn: 'খুলনা', nameEn: 'Khulna', productBn: 'চিংড়ি ও সুন্দরবনের মধু', productEn: 'Shrimp & Honey', type: 'nature' },
    { nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', productBn: 'দুধের সন্দেশ ও আম', productEn: 'Milk Sandesh & Mango', type: 'food' },
    { nameBn: 'যশোর', nameEn: 'Jessore', productBn: 'খেজুরের গুড় ও ফুল', productEn: 'Date Molasses & Flowers', type: 'nature' },
    { nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', productBn: 'নারিকেল ও চিংড়ি', productEn: 'Coconut & Shrimp', type: 'fruit' },
    { nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', productBn: 'তিলের খাজা ও কুলফি', productEn: 'Sesame Khaja & Kulfi', type: 'food' },
    { nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', productBn: 'পান ও ভুট্টা', productEn: 'Betel Leaf & Corn', type: 'nature' },
  ],
  barisal: [
    { nameBn: 'বরিশাল', nameEn: 'Barisal', productBn: 'আমড়া ও পেয়ারা', productEn: 'Hog Plum & Guava', type: 'fruit' },
    { nameBn: 'ঝালকাঠি', nameEn: 'Jhalokati', productBn: 'পেয়ারা ও শীতল পাটি', productEn: 'Guava & Shital Pati', type: 'craft' },
    { nameBn: 'ভোলা', nameEn: 'Bhola', productBn: 'মহিষের দই ও নারিকেল', productEn: 'Buffalo Curd & Coconut', type: 'food' },
    { nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', productBn: 'নারিকেল ও সুপারি', productEn: 'Coconut & Betel Nut', type: 'fruit' },
  ],
  sylhet: [
    { nameBn: 'সিলেট', nameEn: 'Sylhet', productBn: 'চা পাতা ও সাতকরা', productEn: 'Tea & Satkora (Citrus)', type: 'nature' },
    { nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', productBn: 'চা ও আগর আতর', productEn: 'Tea & Agar Ator', type: 'nature' },
    { nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', productBn: 'শুঁটকি ও মাছ', productEn: 'Dry Fish & Fish', type: 'food' },
  ],
  rangpur: [
    { nameBn: 'রংপুর', nameEn: 'Rangpur', productBn: 'শতরঞ্জি ও তামাক', productEn: 'Shataranji & Tobacco', type: 'craft' },
    { nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', productBn: 'লিচু ও কাটারিভোগ চাল', productEn: 'Lychee & Kataribhog Rice', type: 'fruit' },
    { nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', productBn: 'রসমঞ্জুরী', productEn: 'Rasmanjari (Sweet)', type: 'food' },
  ],
  mymensingh: [
    { nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', productBn: 'মুক্তাগাছার মন্ডা', productEn: 'Monda of Muktagacha', type: 'food' },
    { nameBn: 'জামালপুর', nameEn: 'Jamalpur', productBn: 'নকশী কাঁথা', productEn: 'Nakshi Kantha', type: 'craft' },
    { nameBn: 'নেত্রকোনা', nameEn: 'Netrokona', productBn: 'বালিশ মিষ্টি', productEn: 'Balish Sweet', type: 'food' },
  ]
};

// Static data moved outside component to prevent reallocation on re-renders
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

export const AmarBdModule: React.FC<Props> = ({ isBangla, onModuleSelect }) => {
  const [activeDivision, setActiveDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictForDetails, setSelectedDistrictForDetails] = useState<{ district: DistrictData, divisionName: string } | null>(null);
  const [treeOpenDivision, setTreeOpenDivision] = useState<string | null>(null);
  
  // State for the new Branding Tree section
  const [brandingDivision, setBrandingDivision] = useState<string>('dhaka');

  // Optimized filtering with useMemo
  const filteredList = useMemo(() => {
    let districts: { district: DistrictData, divisionName: string, divisionId: string }[] = [];
    
    tourismData.forEach(div => {
      if (activeDivision === 'All' || activeDivision === div.id) {
        div.districts.forEach(dist => {
           districts.push({ district: dist, divisionName: isBangla ? div.nameBn : div.nameEn, divisionId: div.id });
        });
      }
    });

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      districts = districts.filter(d => 
        d.district.nameEn.toLowerCase().includes(lowerQuery) ||
        d.district.nameBn.includes(searchQuery)
      );
    }

    return districts;
  }, [activeDivision, searchQuery, isBangla]);

  // Helper to get icon for branding type
  const getBrandingIcon = (type: string) => {
    switch(type) {
      case 'food': return <Utensils size={14} className="text-orange-500" />;
      case 'cloth': return <Shirt size={14} className="text-purple-500" />;
      case 'fruit': return <Gem size={14} className="text-pink-500" />; // Used Gem for premium fruits look
      case 'nature': return <Leaf size={14} className="text-green-500" />;
      case 'craft': return <Gift size={14} className="text-blue-500" />;
      default: return <Info size={14} className="text-gray-500" />;
    }
  };

  const renderBrandingTree = () => {
    const districts = DISTRICT_BRANDING[brandingDivision as keyof typeof DISTRICT_BRANDING] || [];
    const divInfo = tourismData.find(d => d.id === brandingDivision);

    return (
      <div className="py-20 bg-emerald-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
              <Gem className="text-emerald-600" />
              {isBangla ? 'জেলা ব্র্যান্ডিং' : 'District Branding'}
            </h2>
            <p className="text-gray-500">{isBangla ? 'কোন জেলা কিসের জন্য বিখ্যাত? এক নজরে দেখুন।' : 'What is each district famous for? Explore at a glance.'}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Controller: Division List */}
            <div className="w-full lg:w-1/4 bg-white rounded-2xl shadow-sm border border-gray-100 p-2 h-fit">
              <p className="text-xs font-bold text-gray-400 uppercase p-3">{isBangla ? 'বিভাগ নির্বাচন করুন' : 'Select Division'}</p>
              <div className="space-y-1">
                {tourismData.map(div => (
                  <button
                    key={div.id}
                    onClick={() => setBrandingDivision(div.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                      brandingDivision === div.id 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {isBangla ? div.nameBn : div.nameEn}
                    {brandingDivision === div.id && <ChevronRight size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Canvas: The Tree Visualization */}
            <div className="w-full lg:w-3/4 min-h-[500px] flex items-center">
               <div className="relative w-full">
                  {/* Root Node: Division */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:block">
                     <div className="w-24 h-24 rounded-full bg-emerald-600 border-4 border-white shadow-xl flex items-center justify-center text-center text-white p-2 animate-pulse">
                        <span className="font-bold text-sm leading-tight">
                          {isBangla ? divInfo?.nameBn.replace(' বিভাগ', '') : divInfo?.nameEn.replace(' Division', '')}
                        </span>
                     </div>
                  </div>

                  {/* Connectors & Nodes Container */}
                  <div className="md:pl-32 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                     {districts.map((item, index) => (
                       <div key={index} className="relative group perspective-1000">
                          {/* SVG Connector Line (Desktop Only) */}
                          <svg className="absolute top-1/2 -left-32 w-32 h-20 -translate-y-1/2 hidden md:block pointer-events-none z-0" style={{ overflow: 'visible' }}>
                             <path 
                               d="M0,0 C60,0 40,0 120,0" 
                               fill="none" 
                               stroke="#d1fae5" 
                               strokeWidth="2" 
                               className="group-hover:stroke-emerald-400 transition-colors duration-500"
                             />
                             <circle cx="120" cy="0" r="3" fill="#10b981" />
                          </svg>

                          {/* District Node Card */}
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 relative z-10 flex items-center gap-4 transform hover:-translate-y-1">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                               item.type === 'food' ? 'bg-orange-50' : 
                               item.type === 'cloth' ? 'bg-purple-50' : 
                               item.type === 'nature' ? 'bg-green-50' : 
                               item.type === 'fruit' ? 'bg-pink-50' : 'bg-blue-50'
                             }`}>
                                {getBrandingIcon(item.type)}
                             </div>
                             <div>
                                <h4 className="font-bold text-gray-800 text-lg">{isBangla ? item.nameBn : item.nameEn}</h4>
                                <p className="text-sm text-emerald-600 font-medium">
                                  {isBangla ? item.productBn : item.productEn}
                                </p>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

      {/* NEW SECTION: District Branding Tree */}
      {renderBrandingTree()}

      {/* Administrative Tree */}
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
              <div className="h-12 w-0.5 bg-gray-300"></div>
            </div>

            <div className="relative pt-8 pb-10 px-4">
              <div className="hidden md:block absolute top-0 left-10 right-10 h-8 border-t-2 border-l-2 border-r-2 border-gray-300 rounded-t-2xl"></div>
              <div className="hidden md:block absolute top-0 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {tourismData.map((division, idx) => (
                  <div key={division.id} className="flex flex-col items-center">
                    <div className="hidden md:block h-8 w-0.5 bg-gray-300 mb-[-2px]"></div>
                    <div className="md:hidden h-8 w-0.5 bg-gray-300"></div>

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

          <div className="sticky top-24 z-30 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Division Filter Tabs */}
              <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                 <button
                   onClick={() => setActiveDivision('All')}
                   className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeDivision === 'All' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                 >
                   {isBangla ? 'সব' : 'All'}
                 </button>
                 {tourismData.map(div => (
                   <button
                     key={div.id}
                     onClick={() => setActiveDivision(div.id)}
                     className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeDivision === div.id ? 'bg-green-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                   >
                     {isBangla ? div.nameBn : div.nameEn}
                   </button>
                 ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isBangla ? 'জেলা খুঁজুন...' : 'Search District...'}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Districts Grid */}
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDistrictForDetails(item)}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                        {isBangla ? item.district.nameBn : item.district.nameEn}
                      </h3>
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 tracking-wider ${divisionColors[item.divisionId].replace('text-white', 'text-white bg-opacity-90')}`}>
                         {item.divisionName}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Camera size={20} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
                      <MapPin size={12} />
                      {isBangla ? 'জনপ্রিয় স্থানসমূহ' : 'Popular Spots'}
                    </p>
                    <ul className="space-y-2">
                      {item.district.spots.slice(0, 3).map((spot, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0"></span>
                          <span className="line-clamp-1">{spot}</span>
                        </li>
                      ))}
                    </ul>
                    {item.district.spots.length > 3 && (
                      <p className="text-xs text-green-600 font-medium mt-3 pl-3.5">
                        +{item.district.spots.length - 3} {isBangla ? 'আরও' : 'more'}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50 flex justify-end">
                     <span className="text-sm font-bold text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                       {isBangla ? 'বিস্তারিত' : 'Details'} <ArrowRight size={16} />
                     </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন জেলা পাওয়া যায়নি' : 'No districts found'}</h3>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveDivision('All'); }} className="mt-4">
                {isBangla ? 'রিসেট' : 'Reset'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* District Details Modal */}
      {selectedDistrictForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedDistrictForDetails(null)}>
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isBangla ? selectedDistrictForDetails.district.nameBn : selectedDistrictForDetails.district.nameEn}
                </h2>
                <p className="text-sm text-green-700 font-medium">
                  {selectedDistrictForDetails.divisionName}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDistrictForDetails(null)} 
                className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="text-green-600" size={20} />
                {isBangla ? 'দর্শনীয় স্থানসমূহ' : 'Tourist Attractions'}
              </h3>
              
              <div className="space-y-3">
                {selectedDistrictForDetails.district.spots.map((spot, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer group">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 font-medium group-hover:text-green-700">{spot}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <Button variant="outline" onClick={() => setSelectedDistrictForDetails(null)}>
                {isBangla ? 'বন্ধ করুন' : 'Close'}
              </Button>
              {onModuleSelect && (
                <Button onClick={() => onModuleSelect(AppModule.AMAR_JELA)}>
                  {isBangla ? 'জেলার বিস্তারিত দেখুন' : 'View District Details'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
