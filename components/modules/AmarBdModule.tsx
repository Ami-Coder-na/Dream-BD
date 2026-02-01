
import React, { useState, useMemo } from 'react';
import { MapPin, ArrowRight, Search, Info, ChevronRight, X, Users, BookOpen, HeartPulse, Camera, Building2, Map, ChevronDown, Gem, Utensils, Shirt, Coffee, Leaf, Droplets, Gift, Calendar, ChevronLeft, List } from 'lucide-react';
import { Button } from '../ui/Button';
import { AppModule } from '../../types';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
  onModuleSelect?: (module: AppModule) => void;
}

interface DistrictData {
  nameBn: string;
  nameEn: string;
  spots: any[]; // Changed to support {en, bn} objects or strings
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
    { nameBn: 'ভোলা', nameEn: 'Bhola', productBn: 'মহিষের ডই ও নারিকেল', productEn: 'Buffalo Curd & Coconut', type: 'food' },
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

const tourismData: DivisionData[] = [
  {
    id: 'dhaka',
    nameBn: 'ঢাকা বিভাগ',
    nameEn: 'Dhaka Division',
    districts: [
      { nameBn: 'ঢাকা', nameEn: 'Dhaka', spots: [{en: 'Lalbagh Fort', bn: 'লালবাগ কেল্লা'}, {en: 'Ahsan Manzil', bn: 'আহসান মঞ্জিল'}, {en: 'National Parliament', bn: 'জাতীয় সংসদ ভবন'}, {en: 'Dhakeshwari Temple', bn: 'ঢাকেশ্বরী মন্দির'}, {en: 'Shaheed Minar', bn: 'শহীদ মিনার'}] },
      { nameBn: 'গাজীপুর', nameEn: 'Gazipur', spots: [{en: 'Bhawal National Park', bn: 'ভাওয়াল জাতীয় উদ্যান'}, {en: 'Safari Park', bn: 'সাফারি পার্ক'}, {en: 'Nuhash Polli', bn: 'নুহাশ পল্লী'}, {en: 'Turag River', bn: 'তুরাগ নদী'}] },
      { nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', spots: [{en: 'Sonargaon (Panam City)', bn: 'সোনারগাঁও (পানাম নগর)'}, {en: 'Folk Art Museum', bn: 'লোকশিল্প জাদুঘর'}, {en: 'Mary Anderson Floating Restaurant', bn: 'মেরি এন্ডারসন ভাসমান রেস্তোরাঁ'}] },
      { nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', spots: [{en: 'Idrakpur Fort', bn: 'ইদ্রাকপুর কেল্লা'}, {en: 'Baba Adam Mosque', bn: 'বাবা আদম মসজিদ'}, {en: 'Arial Beel', bn: 'আড়িয়াল বিল'}, {en: 'Padma Bridge View Point', bn: 'পদ্মা সেতু ভিউ পয়েন্ট'}] },
      { nameBn: 'নরসিংদী', nameEn: 'Narsingdi', spots: [{en: 'Wari-Bateshwar Ruins', bn: 'উয়ারী-বটেশ্বর'}, {en: 'Dream Holiday Park', bn: 'ড্রিম হলিডে পার্ক'}, {en: 'Ghorashal', bn: 'ঘোড়াশাল'}] },
      { nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', spots: [{en: 'Baliati Palace', bn: 'বালিয়াটি প্রাসাদ'}, {en: 'Teota Zamindar Bari', bn: 'তেউতা জমিদার বাড়ি'}, {en: 'Aricha Ghat', bn: 'আরিচা ঘাট'}] },
      { nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', spots: [{en: 'Mohera Jamindar Bari', bn: 'মহেরা জমিদার বাড়ি'}, {en: 'Madhupur National Park', bn: 'মধুপুর জাতীয় উদ্যান'}, {en: 'Atiya Mosque', bn: 'আতিয়া মসজিদ'}, {en: '201 Dome Mosque', bn: '২০১ গম্বুজ মসজিদ'}] },
      { nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', spots: [{en: 'Nikli Haor', bn: 'নিকলী হাওর'}, {en: 'Jangalbari Fort', bn: 'জঙ্গলবাড়ি দুর্গ'}, {en: 'Egarosindur', bn: 'এগারসিন্দুর'}, {en: 'Sholakia Eidgah', bn: 'শোলাকিয়া ঈদগাহ'}] },
      { nameBn: 'ফরিদুর', nameEn: 'Faridpur', spots: [{en: 'River Research Institute', bn: 'নদী গবেষণা ইনস্টিটিউট'}, {en: 'Kanaipur Zamindar Bari', bn: 'কানাইপুর জমিদার বাড়ি'}, {en: 'Pallikabi Jasimuddin Home', bn: 'পল্লীকবি জসীমউদ্দীনের বাড়ি'}] },
      { nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', spots: [{en: 'Mausoleum of Bangabandhu', bn: 'বঙ্গবন্ধুর সমাধি সৌধ'}, {en: 'Ulpur Zamindar Bari', bn: 'উলপুর জমিদার বাড়ি'}, {en: 'Modhumoti River', bn: ' মধুমতি নদী'}] },
      { nameBn: 'মাদারীপুর', nameEn: 'Madaripur', spots: [{en: 'Shakuni Lake', bn: 'শকুনি লেক'}, {en: 'Raza Ram Khal', bn: 'রাজা রাম খাল'}, {en: 'Senapati Dighi', bn: 'সেনাপতি দিঘি'}] },
      { nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', spots: [{en: 'Fateh Jangpur Fort', bn: 'ফতেহজংপুর দুর্গ'}, {en: 'Modern Fantasy Kingdom', bn: 'মডার্ন ফ্যান্টাসি কিংডম'}, {en: 'River Padma', bn: 'পদ্মা নদী'}] },
      { nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', spots: [{en: 'Goalanda Ghat', bn: 'গোয়ালন্দ ঘাট'}, {en: 'Jor Bangla Temple', bn: 'জোড় বাংলা মন্দির'}, {en: 'Gododhi', bn: 'গদধি'}] }
    ]
  },
  {
    id: 'chattogram',
    nameBn: 'চট্টগ্রাম বিভাগ',
    nameEn: 'Chattogram Division',
    districts: [
      { nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', spots: [{en: 'Patenga Beach', bn: 'পতেঙ্গা সমুদ্র সৈকত'}, {en: "Foy's Lake", bn: 'ফয়েজ লেক'}, {en: 'Ethnological Museum', bn: 'জাতি তাত্ত্বিক জাদুঘর'}, {en: 'War Cemetery', bn: 'ওয়ার সিমেট্রি'}, {en: 'Guliakhali Beach', bn: 'গুলিয়াখালী বিচ'}] },
      { nameBn: 'কক্সবাজার', nameEn: 'Cox\'s Bazar', spots: [{en: 'Longest Sea Beach', bn: 'দীর্ঘতম সমুদ্র সৈকত'}, {en: 'Himchari', bn: 'হিমছড়ি'}, {en: 'Inani Beach', bn: 'ইনানী বিচ'}, {en: "Saint Martin's Island", bn: 'সেন্ট মার্টিন দ্বীপ'}, {en: 'Radiant Fish World', bn: 'রেডিয়েন্ট ফিশ ওয়ার্ল্ড'}] },
      { nameBn: 'কুমিল্লা', nameEn: 'Comilla', spots: [{en: 'Shalban Vihara', bn: 'শালবন বিহার'}, {en: 'Mainamati Ruins', bn: 'ময়নামতি ধ্বংসাবশেষ'}, {en: 'Dharmasagar Dighi', bn: 'ধর্মসাগর দিঘী'}, {en: 'War Cemetery', bn: 'ওয়ার সিমেট্রি'}] },
      { nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', spots: [{en: 'Arifil Mosque', bn: 'আরিফিল মসজিদ'}, {en: 'Titas Gas Field', bn: 'তিতাস গ্যাস ক্ষেত্র'}, {en: 'Ulchapara Mosque', bn: 'উলচাপাড়া মসজিদ'}] },
      { nameBn: 'চাঁদপুর', nameEn: 'Chandpur', spots: [{en: 'Mohona (Padma-Meghna-Dakatia)', bn: 'মোহনা (তিন নদীর মিলনস্থল)'}, {en: 'Rokto Dhara', bn: 'রক্তধারা স্মৃতিসৌধ'}, {en: "Mini Cox's Bazar", bn: 'মিনি কক্সবাজার'}] },
      { nameBn: 'নোয়াখালী', nameEn: 'Noakhali', spots: [{en: 'Nijhum Dwip', bn: 'নিঝুম দ্বীপ'}, {en: 'Bajra Shahi Mosque', bn: 'বজরা শাহী মসজিদ'}, {en: 'Gandhi Ashram', bn: 'গান্ধী আশ্রম'}] },
      { nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', spots: [{en: 'Dalal Bazar Zamindar Bari', bn: 'দালাল বাজার জমিদার বাড়ি'}, {en: 'Khoa Sagar Dighi', bn: 'খোয়া সাগর দিঘী'}, {en: 'Ramgati', bn: 'রামগতি'}] },
      { nameBn: 'ফেনী', nameEn: 'Feni', spots: [{en: 'Muhuri Project', bn: 'মুহুরী প্রজেক্ট'}, {en: 'Bijoy Singh Dighi', bn: 'বিজয় সিংহ দিঘী'}, {en: 'Chandgazi Mosque', bn: 'চাঁদগাজী মসজিদ'}] },
      { nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachari', spots: [{en: 'Alutila Cave', bn: 'আলুটিলা গুহা'}, {en: 'Risang Waterfall', bn: 'রিছাং ঝর্ণা'}, {en: 'Hanging Bridge', bn: 'ঝুলন্ত সেতু'}, {en: 'Sajek Valley (Route)', bn: 'সাজেক ভ্যালি (রুট)'}] },
      { nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', spots: [{en: 'Kaptai Lake', bn: 'কাপ্তাই হ্রদ'}, {en: 'Hanging Bridge', bn: 'ঝুলন্ত সেতু'}, {en: 'Shuvolong Waterfall', bn: 'শুভলং ঝর্ণা'}, {en: 'Polwel Park', bn: 'পলওয়েল পার্ক'}, {en: 'Sajek Valley', bn: 'সাজেক ভ্যালি'}] },
      { nameBn: 'বান্দরবান', nameEn: 'Bandarban', spots: [{en: 'Nilagiri', bn: 'নীলাচল'}, {en: 'Boga Lake', bn: 'বগা লেক'}, {en: 'Golden Temple', bn: 'স্বর্ণ মন্দির'}, {en: 'Nafakhum', bn: 'নাফাখুম'}, {en: 'Chimbuk Hill', bn: 'চিম্বুক পাহাড়'}] }
    ]
  },
  {
    id: 'sylhet',
    nameBn: 'সিলেট বিভাগ',
    nameEn: 'Sylhet Division',
    districts: [
      { nameBn: 'সিলেট', nameEn: 'Sylhet', spots: [{en: 'Jaflong', bn: 'জাফলং'}, {en: 'Ratargul Swamp Forest', bn: 'রাতারগুল সোয়াম্প ফরেস্ট'}, {en: 'Bichnakandi', bn: 'বিছনাকান্দি'}, {en: 'Shahjalal Mazar', bn: 'শাহজালাল মাজার'}, {en: 'Lalakhal', bn: 'লালাখাল'}] },
      { nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', spots: [{en: 'Lawachara National Park', bn: 'লাউয়াছড়া জাতীয় উদ্যান'}, {en: 'Madhabkunda Waterfall', bn: 'মাধবকুন্ড ঝর্ণা'}, {en: 'Srimangal Tea Gardens', bn: 'শ্রীমঙ্গল চা বাগান'}, {en: 'Hum Hum Waterfall', bn: 'হামহাম ঝর্ণা'}] },
      { nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', spots: [{en: 'Satchari National Park', bn: 'সাতছড়ি জাতীয় উদ্যান'}, {en: 'Greenland Park', bn: 'গ্রিনল্যান্ড পার্ক'}, {en: 'Remaskona', bn: 'রেমা-কালেঙ্গা'}] },
      { nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', spots: [{en: 'Tanguar Haor', bn: 'টাঙ্গুয়ার হাওর'}, {en: 'Shimul Bagan', bn: 'শিমুল বাগান'}, {en: 'Niladri Lake', bn: 'নীলাদ্রি লেক'}, {en: 'Hason Raja Museum', bn: 'হাসন রাজা জাদুঘর'}] }
    ]
  },
  {
    id: 'khulna',
    nameBn: 'খুলনা বিভাগ',
    nameEn: 'Khulna Division',
    districts: [
      { nameBn: 'খুলনা', nameEn: 'Khulna', spots: [{en: 'Sundarbans', bn: 'সুন্দরবন'}, {en: 'Rupsha Bridge', bn: 'রূপসা সেতু'}, {en: 'Sixty Dome Mosque (Nearby)', bn: 'ষাট গম্বুজ মসজিদ (কাছেই)'}, {en: 'Khan Jahan Ali Bridge', bn: 'খান জাহান আলী সেতু'}] },
      { nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', spots: [{en: 'Shat Gombujuj Masjid', bn: 'ষাট গম্বুজ মসজিদ'}, {en: 'Khan Jahan Ali Mazar', bn: 'খান জাহান আলী মাজার'}, {en: 'Sundarbans (Karamjal)', bn: 'সুন্দরবন (করমজল)'}] },
      { nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', spots: [{en: 'Sundarbans (Kalagachia)', bn: 'সুন্দরবন (কলাগাছিয়া)'}, {en: 'Mandarbariya Beach', bn: 'মান্দারবাড়িয়া সমুদ্র সৈকত'}, {en: 'Mozaffar Garden', bn: 'মোজাফফর গার্ডেন'}] },
      { nameBn: 'যশোর', nameEn: 'Jessore', spots: [{en: 'Michael Madhusudan Dutta Home', bn: 'মাইকেল মধুসূদন দত্তের বাড়ি'}, {en: 'Benapole Border', bn: 'বেনাপোল বর্ডার'}, {en: 'Jess Garden Park', bn: 'জেস গার্ডেন পার্ক'}] },
      { nameBn: 'মাগুরা', nameEn: 'Magura', spots: [{en: 'Sreepur Zamindar Bari', bn: 'শ্রীপুর জমিদার বাড়ি'}, {en: 'Siddheshwari Mot', bn: 'সিদ্ধেশ্বরী মঠ'}] },
      { nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', spots: [{en: 'Johor Dighi', bn: 'জোহর দিঘী'}, {en: 'Miar Dalan', bn: 'মিয়ার দালান'}, {en: 'Naldanga Temple', bn: 'নলডাঙ্গা মন্দির'}] },
      { nameBn: 'নড়াইল', nameEn: 'Narail', spots: [{en: 'SM Sultan Complex', bn: 'এস এম সুলতান কমপ্লেক্স'}, {en: 'Niribili Picnic Spot', bn: 'নিরিবিলি পিকনিক স্পট'}, {en: 'Chitra River', bn: 'চিত্রা নদী'}] },
      { nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', spots: [{en: 'Lalon Shah Mazar', bn: 'লালন শাহ মাজার'}, {en: 'Shilaidaha Kuthibari', bn: 'শিলাইদহ কুঠিবাড়ি'}, {en: 'Hardinge Bridge', bn: 'হার্ডিঞ্জ ব্রিজ'}] },
      { nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', spots: [{en: 'Police Park', bn: 'পুলিশ পার্ক'}, {en: 'Keru & Co', bn: 'কেরু এন্ড কোম্পানি'}, {en: 'Gholdari Mosque', bn: 'ঘোলদাড়ি মসজিদ'}] },
      { nameBn: 'মেহেরপুর', nameEn: 'Meherpur', spots: [{en: 'Mujibnagar Memorial', bn: 'মুজিবনগর স্মৃতিসৌধ'}, {en: 'Amjhupi Kuthibari', bn: 'আমঝুপি কুঠিবাড়ি'}] }
    ]
  },
  {
    id: 'rajshahi',
    nameBn: 'রাজশাহী বিভাগ',
    nameEn: 'Rajshahi Division',
    districts: [
      { nameBn: 'রাজশাহী', nameEn: 'Rajshahi', spots: [{en: 'Varendra Research Museum', bn: 'বরেন্দ্র গবেষণা জাদুঘর'}, {en: 'Bagha Mosque', bn: 'বাঘা মসজিদ'}, {en: 'Puthia Temple Complex', bn: 'পুঠিয়া মন্দির চত্বর'}, {en: 'Padma Garden', bn: 'পদ্মা গার্ডেন'}] },
      { nameBn: 'বগুড়া', nameEn: 'Bogra', spots: [{en: 'Mahasthangarh', bn: 'মহাস্থানগড়'}, {en: 'Behular Bashor Ghar', bn: 'বেহুলার বাসর ঘর'}, {en: 'Vasubihara', bn: 'ভাসু বিহার'}, {en: 'Museum', bn: 'জাদুঘর'}] },
      { nameBn: 'পাবনা', nameEn: 'Pabna', spots: [{en: 'Paksey Hardinge Bridge', bn: 'পাকশী হার্ডিঞ্জ ব্রিজ'}, {en: 'Tarash Bhaban', bn: 'তাড়াশ ভবন'}, {en: 'Gajnar Beel', bn: 'গাজনার বিল'}] },
      { nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', spots: [{en: 'Jamuna Bridge', bn: 'যমুনা সেতু'}, {en: 'Navaratna Temple', bn: 'নবরত্ন মন্দির'}, {en: 'Rabindra Kuthibari', bn: 'রবীন্দ্র কুঠিবাড়ি'}] },
      { nameBn: 'নাটোর', nameEn: 'Natore', spots: [{en: 'Natore Rajbari', bn: 'নাটোর রাজবাড়ি'}, {en: 'Uttara Gonobhaban', bn: 'উত্তরা গণভবন'}, {en: 'Chalan Beel', bn: 'চলন বিল'}] },
      { nameBn: 'নওগাঁ', nameEn: 'Naogaon', spots: [{en: 'Paharpur Buddhist Vihara', bn: 'পাহাড়পুর বৌদ্ধ বিহার'}, {en: 'Kusumba Mosque', bn: 'কুসুম্বা মসজিদ'}, {en: 'Jobai Beel', bn: 'জবই বিল'}] },
      { nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', spots: [{en: 'Choto Sona Mosque', bn: 'ছোট সোনা মসজিদ'}, {en: 'Mango Orchards', bn: 'আম বাগান'}, {en: 'Mahananda River View', bn: 'মহানন্দা নদীর দৃশ্য'}] },
      { nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', spots: [{en: 'Nandail Dighi', bn: 'নান্দাইল দিঘী'}, {en: 'Baro Shivalaya', bn: 'বারো শিবালয়'}, {en: 'Lockma Rajbari', bn: 'লকমা রাজবাড়ি'}] }
    ]
  },
  {
    id: 'barisal',
    nameBn: 'বরিশাল বিভাগ',
    nameEn: 'Barisal Division',
    districts: [
      { nameBn: 'বরিশাল', nameEn: 'Barisal', spots: [{en: 'Durga Sagar Dighi', bn: 'দুর্গাসাগর দিঘী'}, {en: 'Guthia Mosque', bn: 'গুঠিয়া মসজিদ'}, {en: 'Floating Guava Market (Bhimruli)', bn: 'ভাসমান পেয়ারা বাজার (ভীমরুলি)'}] },
      { nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', spots: [{en: 'Kuakata Sea Beach', bn: 'কুয়াকাটা সমুদ্র সৈকত'}, {en: 'Fatrar Chor', bn: 'ফাতরার চর'}, {en: 'Lebur Chor', bn: 'লেবুর চর'}, {en: 'Shutki Palli', bn: 'শুঁটকি পল্লী'}] },
      { nameBn: 'ভোলা', nameEn: 'Bhola', spots: [{en: 'Monpura Island', bn: 'মনপুরা দ্বীপ'}, {en: 'Char Kukri Mukri', bn: 'চর কুকরি মুকরি'}, {en: 'Jacob Watch Tower', bn: 'জ্যাকব ওয়াচ টাওয়ার'}] },
      { nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', spots: [{en: 'Rayerkathi Zamindar Bari', bn: 'রায়েরকাঠি জমিদার বাড়ি'}, {en: 'Hularhat', bn: 'হুলারহাট'}, {en: 'Baleshwar River', bn: 'বলেশ্বর নদী'}] },
      { nameBn: 'বরগুনা', nameEn: 'Barguna', spots: [{en: 'Bibichini Mosque', bn: 'বিবিচিনি মসজিদ'}, {en: 'Haringhata Forest', bn: 'হরিণঘাটা বন'}, {en: 'Sonakata', bn: 'সোনাকাটা'}] },
      { nameBn: 'ঝালকাঠি', nameEn: 'Jhalokati', spots: [{en: 'Kirtipasha Zamindar Bari', bn: 'কীর্তিপাশা জমিদার বাড়ি'}, {en: 'Floating Markets (Backwaters)', bn: 'ভাসমান বাজার'}] }
    ]
  },
  {
    id: 'rangpur',
    nameBn: 'রংপুর বিভাগ',
    nameEn: 'Rangpur Division',
    districts: [
      { nameBn: 'রংপুর', nameEn: 'Rangpur', spots: [{en: 'Tajhat Palace', bn: 'তাজহাট জমিদার বাড়ি'}, {en: 'Vinna Jogot', bn: 'ভিন্ন জগত'}, {en: 'Chikli Beel', bn: 'চিকলি বিল'}, {en: 'Begum Rokeya University', bn: 'বেগম রোকেয়া বিশ্ববিদ্যালয়'}] },
      { nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', spots: [{en: 'Kantajew Temple', bn: 'কান্তজীউ মন্দির'}, {en: 'Ramsagar Dighi', bn: 'রামসাগর দিঘী'}, {en: 'Swapnapuri', bn: 'স্বপ্নপুরী'}, {en: 'Nayabad Mosque', bn: 'নয়াবাদ মসজিদ'}] },
      { nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', spots: [{en: 'Balashi Ghat', bn: 'বালাসী ঘাট'}, {en: 'Friendship Centre', bn: 'ফ্রেন্ডশিপ সেন্টার'}, {en: 'Dreamland', bn: 'ড্রিমল্যান্ড'}] },
      { nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', spots: [{en: 'Dharla Bridge', bn: 'ধরলা সেতু'}, {en: 'Chilmari Port', bn: 'চিলমারী বন্দর'}, {en: 'Shahi Mosque', bn: 'শাহী মসজিদ'}] },
      { nameBn: 'নীলফামারী', nameEn: 'Nilphamari', spots: [{en: 'Nilsagar', bn: 'নীলসাগর'}, {en: 'Teesta Barrage', bn: 'তিস্তা ব্যারেজ'}, {en: 'Chini Mosque', bn: 'চিনি মসজিদ'}] },
      { nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', spots: [{en: 'Tin Bigha Corridor', bn: 'তিন বিঘা করিডোর'}, {en: 'Teesta Barrage Park', bn: 'তিস্তা ব্যারেজ পার্ক'}, {en: 'Mogolhat', bn: 'মোগলহাট'}] },
      { nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', spots: [{en: 'Baliadangi Mango Tree', bn: 'বালিয়াডাঙ্গী সূর্যপুরী আমগাছ'}, {en: 'Fun City', bn: 'ফন সিটি'}, {en: 'River Tangon', bn: 'টাঙ্গন নদী'}] },
      { nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', spots: [{en: 'Kanchenjunga View Point', bn: 'কাঞ্চনজঙ্ঘা ভিউ পয়েন্ট'}, {en: 'Tetulia Zero Point', bn: 'তেঁতুলিয়া জিরো পয়েন্ট'}, {en: 'Banglabandha Port', bn: 'বাংলাবান্ধা স্থলবন্দর'}, {en: 'Tea Gardens', bn: 'চা বাগান'}] }
    ]
  },
  {
    id: 'mymensingh',
    nameBn: 'ময়মনসিংহ বিভাগ',
    nameEn: 'Mymensingh Division',
    districts: [
      { nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', spots: [{en: 'Shashi Lodge', bn: 'শশী লজ'}, {en: 'Bangladesh Agricultural University', bn: 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয়'}, {en: 'Muktigacha Zamindar Bari', bn: 'মুক্তাগাছা জমিদার বাড়ি'}, {en: 'Shilpacharya Zainul Abedin Sangrahashala', bn: 'শিল্পাচার্য জয়নুল আবেদিন সংগ্রহশালা'}] },
      { nameBn: 'নেত্রকোনা', nameEn: 'Netrokona', spots: [{en: 'Birishiri (China Matir Pahar)', bn: 'বিরিশিরি (চীনা মাটির পাহাড়)'}, {en: 'Someshwari River', bn: 'সোমেশ্বরী নদী'}, {en: 'Durgapur', bn: 'দুর্গাপুর'}] },
      { nameBn: 'শেরপুর', nameEn: 'Sherpur', spots: [{en: 'Ghazni Abakash', bn: 'গজনী অবকাশ'}, {en: 'Madhutila Eco Park', bn: 'মধুটিলা ইকোপার্ক'}, {en: 'Garo Hill Tracks', bn: 'গারো পাহাড়'}] },
      { nameBn: 'জামালপুর', nameEn: 'Jamalpur', spots: [{en: 'Lauk Chapra', bn: 'লাউয়াচাপড়া'}, {en: 'Gandhi Ashram', bn: 'গান্ধী আশ্রম'}, {en: 'Jamuna Fertilizer Factory Area', bn: 'যমুনা সার কারখানা এলাকা'}] }
    ]
  }
];

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

// ... (Rest of the file remains same, just skipping to the Modal render part to save output space) ...
// --- HOLIDAY DATA (Updated for 2026) ---
const GOVT_HOLIDAYS = [
  { month: 1, date: '21 Feb', nameBn: 'শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস', nameEn: 'Shaheed Day & Int. Mother Language Day', type: 'National' },
  { month: 2, date: '17 Mar', nameBn: 'জাতির পিতার জন্মবার্ষিকী', nameEn: 'Birth Anniversary of Father of the Nation', type: 'National' },
  { month: 2, date: '26 Mar', nameBn: 'স্বাধীনতা ও জাতীয় দিবস', nameEn: 'Independence & National Day', type: 'National' },
  { month: 2, date: '20-22 Mar', nameBn: 'ঈদুল ফিতর (সম্ভাব্য)', nameEn: 'Eid-ul-Fitr (Expected)', type: 'Religious' },
  { month: 3, date: '14 Apr', nameBn: 'পহেলা বৈশাখ (বাংলা নববর্ষ)', nameEn: 'Pohela Boishakh (Bangla New Year)', type: 'Cultural' },
  { month: 4, date: '01 May', nameBn: 'মে দিবস', nameEn: 'May Day', type: 'International' },
  { month: 4, date: '27-29 May', nameBn: 'ঈদুল আযহা (সম্ভাব্য)', nameEn: 'Eid-ul-Azha (Expected)', type: 'Religious' },
  { month: 4, date: 'May', nameBn: 'বুদ্ধ পূর্ণিমা', nameEn: 'Buddha Purnima', type: 'Religious' },
  { month: 7, date: '15 Aug', nameBn: 'জাতীয় শোক দিবস', nameEn: 'National Mourning Day', type: 'National' },
  { month: 7, date: 'Aug', nameBn: 'জন্মাষ্টমী', nameEn: 'Janmashtami', type: 'Religious' },
  { month: 8, date: 'Sep', nameBn: 'ঈদে মিলাদুন্নবী (সা.)', nameEn: 'Eid-e-Miladunnabi', type: 'Religious' },
  { month: 9, date: 'Oct', nameBn: 'দুর্গাপূজা (বিজয়া দশমী)', nameEn: 'Durga Puja (Bijaya Dashami)', type: 'Religious' },
  { month: 11, date: '16 Dec', nameBn: 'বিজয় দিবস', nameEn: 'Victory Day', type: 'National' },
  { month: 11, date: '25 Dec', nameBn: 'বড়দিন', nameEn: 'Christmas Day', type: 'Religious' },
];

const BANGLA_MONTHS = [
  { bn: 'বৈশাখ', en: 'Boishakh' }, { bn: 'জ্যৈষ্ঠ', en: 'Joishtho' }, 
  { bn: 'আষাঢ়', en: 'Ashar' }, { bn: 'শ্রাবণ', en: 'Srabon' },
  { bn: 'ভাদ্র', en: 'Bhadro' }, { bn: 'আশ্বিন', en: 'Ashwin' },
  { bn: 'কার্তিক', en: 'Kartik' }, { bn: 'অগ্রহায়ন', en: 'Agrohayon' },
  { bn: 'পৌষ', en: 'Poush' }, { bn: 'মাঘ', en: 'Magh' },
  { bn: 'ফাল্গুন', en: 'Falgun' }, { bn: 'চৈত্র', en: 'Choitro' }
];

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const AmarBdModule: React.FC<Props> = ({ isBangla, onModuleSelect }) => {
  const { districts: dbDistricts } = useData();
  const [activeDivision, setActiveDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictForDetails, setSelectedDistrictForDetails] = useState<{ district: any, divisionName: string, divisionId: string } | null>(null);
  const [treeOpenDivision, setTreeOpenDivision] = useState<string | null>(null);
  const [brandingDivision, setBrandingDivision] = useState<string>('dhaka');
  const [calendarView, setCalendarView] = useState<'monthly' | 'yearly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredList = useMemo(() => {
    let districts: { district: any, divisionName: string, divisionId: string }[] = [];
    
    // Add static districts
    tourismData.forEach(div => {
      if (activeDivision === 'All' || activeDivision === div.id) {
        div.districts.forEach(dist => {
           districts.push({ district: dist, divisionName: isBangla ? div.nameBn : div.nameEn, divisionId: div.id });
        });
      }
    });

    // Add dynamic districts from database (filter duplicates by name)
    (dbDistricts || []).forEach((dbD: any) => {
        const divId = (dbD.division || '').toLowerCase();
        if (activeDivision === 'All' || activeDivision === divId) {
            // Check if already in static list (by name match)
            const exists = districts.some(d => d.district.nameEn?.toLowerCase() === dbD.nameEn?.toLowerCase());
            if (!exists) {
                districts.push({ 
                    district: { ...dbD, spots: dbD.touristspots || dbD.touristSpots || [] }, 
                    divisionName: dbD.division + (isBangla ? ' বিভাগ' : ' Division'), 
                    divisionId: divId 
                });
            }
        }
    });

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      districts = districts.filter(d => 
        (d.district?.nameEn || '').toLowerCase().includes(lowerQuery) ||
        (d.district?.nameBn || '').includes(searchQuery)
      );
    }

    return districts;
  }, [activeDivision, searchQuery, isBangla, dbDistricts]);

  const getBrandingIcon = (type: string) => {
    switch(type) {
      case 'food': return <Utensils size={14} className="text-orange-500" />;
      case 'cloth': return <Shirt size={14} className="text-purple-500" />;
      case 'fruit': return <Gem size={14} className="text-pink-500" />;
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

            <div className="w-full lg:w-3/4 min-h-[500px] flex items-center">
               <div className="relative w-full">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:block">
                     <div className="w-24 h-24 rounded-full bg-emerald-600 border-4 border-white shadow-xl flex items-center justify-center text-center text-white p-2 animate-pulse">
                        <span className="font-bold text-sm leading-tight">
                          {isBangla ? divInfo?.nameBn.replace(' বিভাগ', '') : (divInfo?.nameEn || '').replace(' Division', '')}
                        </span>
                     </div>
                  </div>

                  <div className="md:pl-32 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                     {districts.map((item, index) => (
                       <div key={index} className="relative group perspective-1000">
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

                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 relative z-10 flex items-center gap-4 transform hover:-translate-y-1">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                               item.type === 'food' ? 'bg-orange-50' : 
                               item.type === 'cloth' ? 'bg-purple-50' : 
                               item.type === 'nature' ? 'bg-green-50' : 
                               item.type === 'fruit' ? 'bg-pink-50' : 
                               item.type === 'fruit' ? 'bg-blue-50' : 'bg-blue-50'
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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const getBanglaMonthName = (engMonthIndex: number) => {
    const index = (engMonthIndex + 8) % 12; 
    return isBangla ? BANGLA_MONTHS[index].bn : BANGLA_MONTHS[index].en;
  };

  const renderMonthlyCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 sm:h-20 bg-gray-50/50 border border-gray-100"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
      const currentMonthIndex = currentDate.getMonth(); 
      const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const specificHoliday = GOVT_HOLIDAYS.find(h => h.date === `${i} ${monthNamesShort[currentMonthIndex]}` || h.date.startsWith(`${i} `) && h.month === currentMonthIndex);

      days.push(
        <div key={i} className={`h-14 sm:h-20 border border-gray-100 p-1 sm:p-2 relative group hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50' : ''}`}>
          <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : specificHoliday ? 'text-red-600' : 'text-gray-700'}`}>
            {i}
          </span>
          {specificHoliday && (
            <div className="absolute bottom-1 left-1 right-1">
              <div className="h-1.5 w-full bg-red-400 rounded-full"></div>
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {isBangla ? specificHoliday.nameBn : specificHoliday.nameEn}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-red-600 to-red-500 text-white flex justify-between items-center">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/20 rounded-full"><ChevronLeft size={20}/></button>
          <div className="text-center">
            <h3 className="text-xl font-bold">
              {currentDate.toLocaleString(isBangla ? 'bn-BD' : 'en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-xs text-red-100 opacity-90">
              {isBangla ? 'বাংলা: ' : 'Bangla: '} {getBanglaMonthName(currentDate.getMonth())} - {getBanglaMonthName((currentDate.getMonth() + 1) % 12)}
            </p>
          </div>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/20 rounded-full"><ChevronRight size={20}/></button>
        </div>

        <div className="grid grid-cols-7 text-center bg-gray-50 border-b border-gray-100">
          {(isBangla ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map((d, i) => (
            <div key={i} className={`py-2 text-xs font-bold uppercase ${i === 5 || i === 6 ? 'text-red-500' : 'text-gray-500'}`}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white">
          {days}
        </div>
      </div>
    );
  };

  const renderYearlyView = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
          {isBangla ? '২০২৪-২৬ সালের ছুটির তালিকা' : 'Holiday List 2024-26'}
        </h3>
        <div className="space-y-6">
          {ENGLISH_MONTHS.map((month, mIdx) => {
            const holidaysInMonth = GOVT_HOLIDAYS.filter(h => h.month === mIdx);
            if (holidaysInMonth.length === 0) return null;

            return (
              <div key={mIdx}>
                <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                  <Calendar size={16} /> 
                  {month} 
                  <span className="text-xs text-gray-400 font-normal">({getBanglaMonthName(mIdx)})</span>
                </h4>
                <div className="space-y-2 pl-4 border-l-2 border-red-100">
                  {holidaysInMonth.map((h, hIdx) => (
                    <div key={hIdx} className="flex gap-4 items-start">
                      <div className="min-w-[60px] font-bold text-gray-800 bg-gray-100 px-2 rounded text-center text-sm">
                        {h.date.split(' ')[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{isBangla ? h.nameBn : h.nameEn}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${h.type === 'National' ? 'bg-green-100 text-green-700' : h.type === 'Religious' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {h.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendarSection = () => {
    return (
        <div className="py-20 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
                        <Calendar className="text-red-600" />
                        {isBangla ? 'ক্যালেন্ডার ও ছুটির তালিকা' : 'Calendar & Holidays'}
                    </h2>
                    <p className="text-gray-500">
                        {isBangla ? '২০২৬ সালের সরকারি, ধর্মীয় এবং ঐচ্ছিক ছুটির সম্পূর্ণ তালিকা।' : 'Complete list of 2026 Government, Religious, and Optional holidays.'}
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 flex">
                    <button 
                      onClick={() => setCalendarView('monthly')}
                      className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${calendarView === 'monthly' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {isBangla ? 'মাসিক ভিউ' : 'Monthly View'}
                    </button>
                    <button 
                      onClick={() => setCalendarView('yearly')}
                      className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${calendarView === 'yearly' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {isBangla ? 'বাৎসরিক তালিকা' : 'Yearly List'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                        {calendarView === 'monthly' ? renderMonthlyCalendar() : renderYearlyView()}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <List className="text-blue-600" size={20} /> 
                                {isBangla ? 'আসন্ন ছুটি' : 'Upcoming Holidays'}
                            </h3>
                            <div className="space-y-4">
                                {GOVT_HOLIDAYS.slice(0, 4).map((h, i) => (
                                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-default">
                                     <div className="bg-red-50 text-red-600 w-12 h-12 flex flex-col items-center justify-center rounded-lg border border-red-100 shrink-0">
                                        <span className="text-lg font-bold leading-none">{h.date.split(' ')[0]}</span>
                                        <span className="text-[10px] font-bold uppercase">{h.date.split(' ')[1]}</span>
                                     </div>
                                     <div>
                                        <p className="font-bold text-gray-800 text-sm line-clamp-1">{isBangla ? h.nameBn : h.nameEn}</p>
                                        <p className="text-xs text-gray-500">{h.type}</p>
                                     </div>
                                  </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                               <div className="bg-blue-50 p-4 rounded-xl">
                                  <h4 className="text-blue-800 font-bold text-sm mb-1">{isBangla ? 'আজকের তারিখ' : 'Today'}</h4>
                                  <p className="text-2xl font-bold text-blue-900">
                                    {new Date().toLocaleDateString(isBangla ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </p>
                                  <p className="text-sm text-blue-700 mt-1">
                                    {isBangla ? 'বঙ্গাব্দ: ১৪৩১' : 'Bangabda: 1431'} (Approx)
                                  </p>
                               </div>
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
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={getOptimizedImageUrl('https://images.unsplash.com/photo-1548013146-72479768bada', 1280)}
            alt="Bangladesh Landscape" 
            className="w-full h-full object-cover"
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

      {renderBrandingTree()}
      {renderCalendarSection()}

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
                {tourismData.map((division, idx) => {
                  const divId = division.id;
                  // Get dynamic districts for this division
                  const dynamicInDiv = (dbDistricts || []).filter((d: any) => d.division?.toLowerCase() === divId);
                  const staticInDiv = division.districts;
                  
                  return (
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
                              {isBangla ? `${staticInDiv.length + dynamicInDiv.length}টি জেলা` : `${staticInDiv.length + dynamicInDiv.length} Districts`}
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
                              {/* Render Static */}
                              {staticInDiv.map((dist, dIdx) => (
                                <span 
                                  key={`static-${dIdx}`} 
                                  className="inline-block px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                                >
                                  {isBangla ? dist.nameBn : dist.nameEn}
                                </span>
                              ))}
                              {/* Render Dynamic */}
                              {dynamicInDiv.map((dbD: any, dIdx: number) => {
                                // Prevent double display if dynamic matches static name
                                const isDuplicate = staticInDiv.some(s => s.nameEn?.toLowerCase() === dbD.nameEn?.toLowerCase());
                                if (isDuplicate) return null;
                                return (
                                  <span 
                                    key={`dynamic-${dIdx}`} 
                                    className="inline-block px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors"
                                  >
                                    {isBangla ? (dbD.nameBn || dbD.namebn) : (dbD.nameEn || dbD.nameen)}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 tracking-wider ${divisionColors[item.divisionId] ? divisionColors[item.divisionId].replace('text-white', 'text-white bg-opacity-90') : 'bg-gray-200 text-gray-700'}`}>
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
                      {(item.district?.spots || []).slice(0, 3).map((spot: any, sIdx: number) => (
                        <li key={sIdx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0"></span>
                          <span className="line-clamp-1">{typeof spot === 'string' ? spot : (isBangla ? (spot.bn || spot.en) : (spot.en || spot.bn))}</span>
                        </li>
                      ))}
                      {(item.district?.spots || []).length === 0 && (
                        <li className="text-xs text-gray-300 italic">{isBangla ? 'কোন স্পট যুক্ত নেই' : 'No spots added'}</li>
                      )}
                    </ul>
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
              {selectedDistrictForDetails.district.description && (
                <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-sm text-gray-600">
                   {selectedDistrictForDetails.district.description}
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="text-green-600" size={20} />
                {isBangla ? 'দর্শনীয় স্থানসমূহ' : 'Tourist Attractions'}
              </h3>
              
              <div className="space-y-3">
                {(selectedDistrictForDetails.district?.spots || []).map((spot: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer group">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 font-medium group-hover:text-green-700">
                      {typeof spot === 'string' ? spot : (isBangla ? (spot.bn || spot.en) : (spot.en || spot.bn))}
                    </span>
                  </div>
                ))}
                {(selectedDistrictForDetails.district?.spots || []).length === 0 && (
                   <div className="p-8 text-center text-gray-300 italic">{isBangla ? 'কোন স্থান যুক্ত নেই' : 'No spots listed'}</div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <Button variant="outline" onClick={() => setSelectedDistrictForDetails(null)}>
                {isBangla ? 'বন্ধ করুন' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
