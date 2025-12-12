
import React, { useState, useRef } from 'react';
import { 
  HeartPulse, Calendar, Phone, MapPin, Star, UserPlus, 
  Thermometer, Activity, Baby, Utensils, AlertCircle, 
  Search, ChevronRight, Droplets, ShieldCheck, Stethoscope,
  Info, Clock, ChevronDown, Check, Building2, X, Copy, Printer, Share2, Loader2, Edit3, Download,
  Filter, User
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

type Tab = 'diseases' | 'access' | 'maternal' | 'lifestyle' | 'bloodbank';

// --- MOCK DATA ---

const DISEASES_DB = [
  {
    id: 1,
    nameBn: 'ডেঙ্গু জ্বর',
    nameEn: 'Dengue Fever',
    riskLevel: 'High', // High, Medium, Low
    season: 'Monsoon',
    symptomsBn: 'উচ্চ জ্বর, তীব্র মাথা ব্যথা, চোখের পেছনে ব্যথা, শরীরে র‍্যাশ।',
    symptomsEn: 'High fever, severe headache, pain behind eyes, body rash.',
    preventionBn: 'মশার কামড় থেকে বাঁচুন, জমে থাকা পানি পরিষ্কার রাখুন।',
    preventionEn: 'Avoid mosquito bites, clean stagnant water.',
    treatmentBn: 'প্রচুর তরল খাবার খান, প্যারাসিটামল সেবন করুন (ডাক্তারের পরামর্শে)।',
    treatmentEn: 'Drink plenty of fluids, take Paracetamol (consult doctor).',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289'
  },
  {
    id: 2,
    nameBn: 'নিউমোনিয়া',
    nameEn: 'Pneumonia',
    riskLevel: 'Medium',
    season: 'Winter',
    symptomsBn: 'কাশি, শ্বাসকষ্ট, জ্বর, বুকে ব্যথা।',
    symptomsEn: 'Cough, shortness of breath, fever, chest pain.',
    preventionBn: 'ঠান্ডা লাগা থেকে বিরত থাকুন, হাত ধোয়ার অভ্যাস করুন।',
    preventionEn: 'Avoid cold exposure, practice hand washing.',
    treatmentBn: 'দ্রুত ডাক্তারের পরামর্শ নিন, অ্যান্টিবায়োটিক (প্রয়োজনে)।',
    treatmentEn: 'Consult doctor immediately, antibiotics (if needed).',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8'
  },
  {
    id: 3,
    nameBn: 'ডায়রিয়া',
    nameEn: 'Diarrhea',
    riskLevel: 'Medium',
    season: 'Summer/Monsoon',
    symptomsBn: 'পাতলা পায়খানা, বমি, পানিশূন্যতা।',
    symptomsEn: 'Loose motion, vomiting, dehydration.',
    preventionBn: 'নিরাপদ পানি পান করুন, বাসি খাবার এড়িয়ে চলুন।',
    preventionEn: 'Drink safe water, avoid stale food.',
    treatmentBn: 'ওরাল স্যালাইন (ORS) এবং জিঙ্ক ট্যাবলেট।',
    treatmentEn: 'Oral Rehydration Saline (ORS) and Zinc tablets.',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f'
  },
  {
    id: 4,
    nameBn: 'টাইফয়েড',
    nameEn: 'Typhoid',
    riskLevel: 'Medium',
    season: 'Monsoon/Summer',
    symptomsBn: 'ক্রমান্বয়ে জ্বর বৃদ্ধি, পেটে ব্যথা, দুর্বলতা।',
    symptomsEn: 'Prolonged fever, abdominal pain, weakness.',
    preventionBn: 'নিরাপদ পানি ও সুসিদ্ধ খাবার গ্রহণ।',
    preventionEn: 'Safe water and well-cooked food.',
    treatmentBn: 'অ্যান্টিবায়োটিক (ডাক্তারের পরামর্শে)।',
    treatmentEn: 'Antibiotics (consult doctor).',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144'
  },
  {
    id: 5,
    nameBn: 'ম্যালেরিয়া',
    nameEn: 'Malaria',
    riskLevel: 'High',
    season: 'Monsoon',
    symptomsBn: 'কাঁপুনি দিয়ে জ্বর, ঘাম হওয়া, মাথাব্যথা।',
    symptomsEn: 'Fever with chills, sweating, headache.',
    preventionBn: 'মশারি ব্যবহার করুন, ঝোপঝাড় পরিষ্কার রাখুন।',
    preventionEn: 'Use mosquito nets, clean bushes.',
    treatmentBn: 'রক্ত পরীক্ষা ও দ্রুত চিকিৎসা নিন।',
    treatmentEn: 'Blood test and immediate treatment.',
    image: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed'
  },
  {
    id: 6,
    nameBn: 'চর্মরোগ (দাদ)',
    nameEn: 'Fungal Infection',
    riskLevel: 'Low',
    season: 'Summer/Humid',
    symptomsBn: 'ত্বকে লাল চাকা, চুলকানি।',
    symptomsEn: 'Red circular patches, itching.',
    preventionBn: 'পরিষ্কার পরিচ্ছন্ন থাকুন, অন্যের কাপড় ব্যবহার করবেন না।',
    preventionEn: 'Maintain hygiene, avoid sharing clothes.',
    treatmentBn: 'অ্যান্টিফাঙ্গাল ক্রিম ব্যবহার করুন।',
    treatmentEn: 'Use antifungal cream.',
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74'
  }
];

const PREGNANCY_WEEKS = [
  { week: 8, infoBn: 'শিশুর হৃদস্পন্দন শুরু হয়। মায়ের বমি বমি ভাব হতে পারে।', infoEn: "Baby's heartbeat starts. Mother may feel nausea." },
  { week: 20, infoBn: 'শিশুর নড়াচড়া অনুভব করা যায়। আল্ট্রাসাউন্ড করার সঠিক সময়।', infoEn: "Baby movement can be felt. Good time for ultrasound." },
  { week: 36, infoBn: 'শিশুর মাথা নিচের দিকে ঘুরতে পারে। হাসপাতালের ব্যাগ গুছিয়ে রাখুন।', infoEn: "Baby may drop into pelvis. Pack hospital bag." },
];

const VACCINES = [
  { ageBn: 'জন্মের সময়', ageEn: 'At Birth', name: 'BCG, OPV-0, HepB-0' },
  { ageBn: '৬ সপ্তাহ', ageEn: '6 Weeks', name: 'Pentavalent-1, OPV-1, PCV-1' },
  { ageBn: '৯ মাস', ageEn: '9 Months', name: 'Measles-Rubella (MR)' },
];

const HOSPITALS_DB: Record<string, { name: string; address: string; phone: string }[]> = {
  'Dhaka': [
    { name: 'Dhaka Medical College Hospital', address: 'Secretariat Road, Dhaka', phone: '02-55165088' },
    { name: 'Bangabandhu Sheikh Mujib Medical University (PG Hospital)', address: 'Shahbag, Dhaka', phone: '02-9661051' },
    { name: 'Square Hospital', address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath', phone: '10616' },
    { name: 'Evercare Hospital', address: 'Plot 81, Block E, Bashundhara R/A', phone: '10678' },
    { name: 'Kurmitola General Hospital', address: 'Tong-Ashulia Road, Dhaka Cantonment', phone: '02-8712345' },
    { name: 'United Hospital', address: 'Plot 15, Road 71, Gulshan', phone: '10666' },
    { name: 'BIRDEM General Hospital', address: '122 Kazi Nazrul Islam Avenue, Shahbag', phone: '02-9661551' },
    { name: 'Ibn Sina Hospital', address: 'House 48, Road 9/A, Dhanmondi', phone: '10615' }
  ],
  'Chittagong': [
    { name: 'Chittagong Medical College Hospital', address: 'KB Fazlul Kader Road, Chittagong', phone: '031-619400' },
    { name: 'Evercare Hospital Chattogram', address: 'H-2860, Plot 89, CDA Avenue', phone: '10663' },
    { name: 'Imperial Hospital', address: 'Zakir Hossain Road, Pahartali', phone: '09612-247247' },
    { name: 'Chattogram Ma-O-Shishu Hospital', address: 'Agrabad, Chittagong', phone: '031-718527' }
  ],
  'Sylhet': [
    { name: 'Sylhet MAG Osmani Medical College', address: 'Medical Road, Kajolshah, Sylhet', phone: '0821-713312' },
    { name: 'Mount Adora Hospital', address: 'Noyasarak, Sylhet', phone: '01717-373800' },
    { name: 'Al Haramain Hospital', address: 'Sobhani Ghat, Sylhet', phone: '09613-233333' },
    { name: 'North East Medical College Hospital', address: 'South Surma, Sylhet', phone: '0821-728551' }
  ],
  'Rajshahi': [
    { name: 'Rajshahi Medical College Hospital', address: 'Laxmipur, Rajshahi', phone: '0721-776001' },
    { name: 'Islami Bank Hospital', address: 'Laxmipur, Rajshahi', phone: '0721-774975' },
    { name: 'Barind Medical College Hospital', address: 'Talaimari, Rajshahi', phone: '0721-751302' }
  ],
  'Khulna': [
    { name: 'Khulna Medical College Hospital', address: 'Boyra, Khulna', phone: '041-760350' },
    { name: 'City Medical College Hospital', address: 'KDA Avenue, Khulna', phone: '041-2833883' },
    { name: 'Gazi Medical College Hospital', address: 'Sonadanga, Khulna', phone: '041-731393' }
  ],
  'Barisal': [
    { name: 'Sher-e-Bangla Medical College Hospital', address: 'Band Road, Barisal', phone: '0431-2173323' },
    { name: 'Rahat Anwar Hospital', address: 'Band Road, Barisal', phone: '01711-993707' }
  ],
  'Rangpur': [
    { name: 'Rangpur Medical College Hospital', address: 'Rangpur', phone: '0521-62222' },
    { name: 'Prime Medical College Hospital', address: 'Pirjabad, Rangpur', phone: '0521-65011' },
    { name: 'Community Medical College Hospital', address: 'Medical East Gate, Rangpur', phone: '0521-64333' }
  ],
  'Mymensingh': [
    { name: 'Mymensingh Medical College Hospital', address: 'Char Para, Mymensingh', phone: '091-66063' },
    { name: 'Community Based Medical College Hospital', address: 'Winnerpar, Mymensingh', phone: '091-67087' }
  ],
  'Comilla': [
    { name: 'Comilla Medical College Hospital', address: 'Kuchaitoli, Comilla', phone: '081-76406' },
    { name: 'Moon Hospital', address: 'Jhawtala, Comilla', phone: '081-68686' }
  ]
};

const PHARMACIES = [
  { name: 'Lazz Pharma', address: 'Kalabagan, Dhaka', phone: '01711-000000', open: '24/7' },
  { name: 'Tamanna Pharmacy', address: 'Mirpur 10, Dhaka', phone: '01822-000000', open: '8 AM - 11 PM' },
  { name: 'Bhuiyan Pharmacy', address: 'Chawkbazar, Chittagong', phone: '01633-000000', open: '9 AM - 10 PM' },
  { name: 'Green Life Pharmacy', address: 'Zindabazar, Sylhet', phone: '01755-000000', open: '24/7' },
];

const SCHEMES = [
  { 
    titleEn: 'Shastho Surokhsha Karmasuchi (SSK)', 
    titleBn: 'স্বাস্থ্য সুরক্ষা কর্মসূচি (SSK)',
    descEn: 'Free healthcare services for people below the poverty line. Includes medicines and hospitalization.',
    descBn: 'দারিদ্র্যসীমার নিচে বসবাসকারী মানুষের জন্য বিনামূল্যে স্বাস্থ্যসেবা। ওষুধ এবং হাসপাতালে ভর্তি অন্তর্ভুক্ত।'
  },
  { 
    titleEn: 'Maternal Health Voucher Scheme', 
    titleBn: 'মাতৃস্বাস্থ্য ভাউচার স্কিম',
    descEn: 'Financial assistance for pregnant women for checkups and delivery.',
    descBn: 'গর্ভবতী মহিলাদের চেকআপ এবং প্রসবের জন্য আর্থিক সহায়তা।'
  },
  {
    titleEn: 'Community Clinic Services',
    titleBn: 'কমিউনিটি ক্লিনিক সেবা',
    descEn: 'Primary healthcare at village level including 30 types of free medicines.',
    descBn: 'গ্রাম পর্যায়ে প্রাথমিক স্বাস্থ্যসেবা এবং ৩০ ধরনের বিনামূল্যে ওষুধ।'
  }
];

// --- BLOOD BANK DATA ---
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DISTRICT_LIST = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Feni', 'Bogra', 'Jessore'];

const INITIAL_DONORS = [
  { id: 1, name: 'Rahim Ahmed', group: 'A+', district: 'Dhaka', phone: '01712-345678', lastDonation: '2 months ago' },
  { id: 2, name: 'Karim Ullah', group: 'B+', district: 'Chittagong', phone: '01812-345678', lastDonation: '4 months ago' },
  { id: 3, name: 'Sumaia Akter', group: 'O+', district: 'Dhaka', phone: '01912-345678', lastDonation: '1 month ago' },
  { id: 4, name: 'Biplob Das', group: 'AB-', district: 'Sylhet', phone: '01711-223344', lastDonation: 'New Donor' },
  { id: 5, name: 'Nusrat Jahan', group: 'A-', district: 'Rajshahi', phone: '01611-223344', lastDonation: '3 months ago' },
  { id: 6, name: 'Abdul Malek', group: 'B-', district: 'Comilla', phone: '01511-223344', lastDonation: '5 months ago' },
];

export const HealthModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<Tab>('diseases');
  const [selectedWeek, setSelectedWeek] = useState(8);
  const [selectedDisease, setSelectedDisease] = useState<number | null>(null);
  const [hospitalDistrict, setHospitalDistrict] = useState('Dhaka');
  
  // Pagination & Load More
  const [visibleDiseases, setVisibleDiseases] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<'pharmacy' | 'schemes' | 'card' | 'donate' | null>(null);
  const hospitalRef = useRef<HTMLDivElement>(null);

  // --- CARD GENERATION STATE ---
  const [cardStep, setCardStep] = useState<'form' | 'preview'>('form');
  const [cardInfo, setCardInfo] = useState({
    name: '',
    mobile: '',
    bloodGroup: 'A+',
    age: ''
  });

  // --- BLOOD BANK STATE ---
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [newDonor, setNewDonor] = useState({ name: '', phone: '', district: 'Dhaka', group: 'A+' });

  const scrollToHospital = () => {
    if (hospitalRef.current) {
      hospitalRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
        setVisibleDiseases(prev => prev + 3);
        setLoadingMore(false);
    }, 800);
  };

  // --- CARD FUNCTIONS ---

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardInfo.name && cardInfo.mobile) {
      setCardStep('preview');
    }
  };

  const generateCardImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Background Gradient (Orange to Red)
    const grd = ctx.createLinearGradient(0, 0, 600, 350);
    grd.addColorStop(0, "#f97316"); // orange-500
    grd.addColorStop(1, "#ef4444"); // red-500
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 600, 350);

    // Decorative Circle
    ctx.beginPath();
    ctx.arc(550, 50, 100, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fill();

    // Text Content
    ctx.fillStyle = "#ffffff";
    
    // Header
    ctx.font = "14px sans-serif";
    ctx.fillText("HEALTH CARD", 40, 60);
    
    // Title
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("Dream BD Health", 40, 100);

    // Info Labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "12px sans-serif";
    ctx.fillText("NAME", 40, 160);
    ctx.fillText("MOBILE / ID", 300, 160);
    ctx.fillText("BLOOD GROUP", 40, 240);

    // Info Values
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(cardInfo.name, 40, 190);
    ctx.fillText(cardInfo.mobile, 300, 190);
    
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(cardInfo.bloodGroup, 40, 280);

    // Footer
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "14px sans-serif";
    ctx.fillText("Generated via Dream BD App", 400, 320);

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleDownloadCard = () => {
    const dataUrl = generateCardImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `HealthCard-${cardInfo.name.replace(/\s+/g, '_')}.jpg`;
      link.click();
    }
  };

  const handleShareCard = async () => {
    const dataUrl = generateCardImage();
    if (dataUrl) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "health_card.jpg", { type: blob.type });
        
        if (navigator.share) {
          await navigator.share({
            title: 'My Digital Health Card',
            text: 'Here is my digital health card generated by Dream BD.',
            files: [file]
          });
        } else {
          alert(isBangla ? 'আপনার ডিভাইসে শেয়ারিং সাপোর্ট নেই।' : 'Sharing not supported on this device.');
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  // --- BLOOD BANK FUNCTIONS ---
  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDonor.name && newDonor.phone) {
      setDonors(prev => [{
        id: Date.now(),
        name: newDonor.name,
        phone: newDonor.phone,
        district: newDonor.district,
        group: newDonor.group,
        lastDonation: isBangla ? 'নতুন দাতা' : 'New Donor'
      }, ...prev]);
      setActiveModal(null);
      setNewDonor({ name: '', phone: '', district: 'Dhaka', group: 'A+' });
      alert(isBangla ? 'অভিনন্দন! আপনি রক্তদাতা তালিকায় যুক্ত হয়েছেন।' : 'Congratulations! You have been added to the donor list.');
    }
  };

  const filteredDonors = donors.filter(d => {
    const matchDist = filterDistrict === 'All' || d.district === filterDistrict;
    const matchGroup = filterGroup === 'All' || d.group === filterGroup;
    return matchDist && matchGroup;
  });

  // --- RENDER FUNCTIONS ---

  const renderDiseaseHub = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Seasonal Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-red-500" />
            {isBangla ? 'মৌসুমী রোগ ট্র্যাকার' : 'Seasonal Disease Tracker'}
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="min-w-[140px] bg-red-50 rounded-xl p-4 border border-red-100 text-center">
              <p className="text-xs text-red-600 font-bold uppercase mb-1">{isBangla ? 'উচ্চ ঝুঁকি' : 'High Risk'}</p>
              <p className="font-bold text-gray-800">{isBangla ? 'ডেঙ্গু' : 'Dengue'}</p>
              <span className="text-xs text-gray-500">Dhaka, Ctg</span>
            </div>
            <div className="min-w-[140px] bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-center">
              <p className="text-xs text-yellow-600 font-bold uppercase mb-1">{isBangla ? 'মাঝারি' : 'Medium'}</p>
              <p className="font-bold text-gray-800">{isBangla ? 'ভাইরাল ফিভার' : 'Viral Fever'}</p>
              <span className="text-xs text-gray-500">All Districts</span>
            </div>
            <div className="min-w-[140px] bg-green-50 rounded-xl p-4 border border-green-100 text-center">
              <p className="text-xs text-green-600 font-bold uppercase mb-1">{isBangla ? 'কম' : 'Low'}</p>
              <p className="font-bold text-gray-800">{isBangla ? 'কলেরা' : 'Cholera'}</p>
              <span className="text-xs text-gray-500">Coastal Areas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disease List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DISEASES_DB.slice(0, visibleDiseases).map((disease) => (
          <div key={disease.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="relative h-40">
              <img src={getOptimizedImageUrl(disease.image, 400)} alt={disease.nameEn} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h4 className="absolute bottom-3 left-4 text-white font-bold text-lg">
                {isBangla ? disease.nameBn : disease.nameEn}
              </h4>
            </div>
            <div className="p-5">
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-teal-600 uppercase mb-1">{isBangla ? 'লক্ষণ' : 'Symptoms'}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{isBangla ? disease.symptomsBn : disease.symptomsEn}</p>
                </div>
                {selectedDisease === disease.id && (
                  <div className="animate-fade-in space-y-3 pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase mb-1">{isBangla ? 'প্রতিরোধ' : 'Prevention'}</p>
                      <p className="text-sm text-gray-600">{isBangla ? disease.preventionBn : disease.preventionEn}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-600 uppercase mb-1">{isBangla ? 'চিকিৎসা' : 'Treatment'}</p>
                      <p className="text-sm text-gray-600">{isBangla ? disease.treatmentBn : disease.treatmentEn}</p>
                    </div>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                className="w-full text-xs"
                onClick={() => setSelectedDisease(selectedDisease === disease.id ? null : disease.id)}
              >
                {selectedDisease === disease.id ? (isBangla ? 'কম দেখুন' : 'Show Less') : (isBangla ? 'বিস্তারিত ও চিকিৎসা' : 'Details & Treatment')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleDiseases < DISEASES_DB.length && (
        <div className="flex justify-center mt-8">
            <Button
                onClick={handleLoadMore}
                variant="secondary"
                className="rounded-full px-8 shadow-sm border border-gray-200 bg-white hover:bg-gray-50"
                disabled={loadingMore}
            >
                {loadingMore ? (
                    <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        {isBangla ? 'লোড হচ্ছে...' : 'Loading...'}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <ChevronDown size={16} />
                        {isBangla ? 'আরও দেখুন' : 'Load More'}
                    </div>
                )}
            </Button>
        </div>
      )}
    </div>
  );

  const renderAccess = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
            <Phone className="text-red-600" size={32} />
          </div>
          <div>
            <h3 className="font-bold text-red-800 text-xl">
              {isBangla ? 'জরুরী সেবা' : 'Emergency Services'}
            </h3>
            <p className="text-red-600 text-sm mt-1">
              {isBangla ? 'অ্যাম্বুলেন্স বা রক্তের প্রয়োজনে কল করুন' : 'Call for Ambulance or Blood'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" className="font-bold text-lg px-8 shadow-lg shadow-red-200">
            <Phone size={18} className="mr-2" /> 999
          </Button>
          <Button onClick={() => setActiveTab('bloodbank')} className="bg-red-700 hover:bg-red-800 text-white border-none shadow-lg shadow-red-200">
            <Droplets size={18} className="mr-2" /> {isBangla ? 'রক্তদাতা খুঁজুন' : 'Find Blood'}
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isBangla ? 'হাসপাতাল খুঁজুন' : 'Find Hospital', icon: <Building2 />, color: 'text-blue-600', bg: 'bg-blue-50', action: scrollToHospital },
          { label: isBangla ? 'ফার্মেসী' : 'Pharmacy', icon: <HeartPulse />, color: 'text-green-600', bg: 'bg-green-50', action: () => setActiveModal('pharmacy') },
          { label: isBangla ? 'সরকারি স্কিম' : 'Gov Schemes', icon: <ShieldCheck />, color: 'text-purple-600', bg: 'bg-purple-50', action: () => setActiveModal('schemes') },
          { label: isBangla ? 'হেলথ কার্ড' : 'Health Card', icon: <UserPlus />, color: 'text-orange-600', bg: 'bg-orange-50', action: () => { setActiveModal('card'); setCardStep('form'); } },
        ].map((item, idx) => (
          <div 
            key={idx} 
            onClick={item.action}
            className={`${item.bg} p-6 rounded-xl border border-transparent hover:border-gray-200 cursor-pointer transition-all text-center group hover:-translate-y-1`}
          >
            <div className={`w-14 h-14 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-3 ${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <p className="font-bold text-gray-800 text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Hospital Directory (Replaced Specialist Doctors) */}
      <div ref={hospitalRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-teal-600" />
            {isBangla ? 'হাসপাতাল ডিরেক্টরি' : 'Hospital Directory'}
          </h3>
          <div className="relative w-full md:w-48">
             <select 
               value={hospitalDistrict}
               onChange={(e) => setHospitalDistrict(e.target.value)}
               className="w-full appearance-none bg-teal-50 border border-teal-100 text-teal-800 py-2.5 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
             >
               {Object.keys(HOSPITALS_DB).map(dist => (
                 <option key={dist} value={dist}>{dist}</option>
               ))}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none" size={16} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HOSPITALS_DB[hospitalDistrict] ? (
            HOSPITALS_DB[hospitalDistrict].map((hosp, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-5 hover:border-teal-200 transition-all bg-gray-50/30 hover:bg-white hover:shadow-sm">
                 <h4 className="font-bold text-gray-900 mb-2 text-lg line-clamp-1">{hosp.name}</h4>
                 <p className="text-sm text-gray-600 mb-3 flex items-start gap-2 h-10 overflow-hidden">
                   <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
                   <span className="line-clamp-2">{hosp.address}</span>
                 </p>
                 <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                   <a href={`tel:${hosp.phone}`} className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-teal-100 transition-colors w-full justify-center">
                     <Phone size={14} /> {hosp.phone}
                   </a>
                 </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No hospitals found for this district.
            </div>
          )}
        </div>
        <div className="mt-6 text-center">
           <p className="text-xs text-gray-400">
             {isBangla ? '* এটি নির্বাচিত প্রধান হাসপাতালের তালিকা। জরুরী প্রয়োজনে ৯৯৯ এ কল করুন।' : '* List contains selected major hospitals. For emergencies call 999.'}
           </p>
        </div>
      </div>
    </div>
  );

  const renderMaternal = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Pregnancy Tracker */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Baby className="text-pink-500" />
          {isBangla ? 'গর্ভাবস্থা ট্র্যাকার' : 'Pregnancy Tracker'}
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isBangla ? 'বর্তমান সপ্তাহ নির্বাচন করুন:' : 'Select Current Week:'} <span className="text-pink-600 font-bold">{selectedWeek}</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="40" 
            value={selectedWeek} 
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Week 1</span>
            <span>Week 40</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-pink-100 flex gap-4 items-start">
           <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold shrink-0">
             {selectedWeek}
           </div>
           <div>
             <h4 className="font-bold text-gray-800 mb-1">
               {isBangla ? 'পরামর্শ' : 'Advice'}
             </h4>
             <p className="text-gray-600 text-sm leading-relaxed">
               {/* Simplified logic for demo */}
               {selectedWeek <= 12 
                 ? (isBangla ? PREGNANCY_WEEKS[0].infoBn : PREGNANCY_WEEKS[0].infoEn)
                 : selectedWeek <= 28
                 ? (isBangla ? PREGNANCY_WEEKS[1].infoBn : PREGNANCY_WEEKS[1].infoEn)
                 : (isBangla ? PREGNANCY_WEEKS[2].infoBn : PREGNANCY_WEEKS[2].infoEn)
               }
             </p>
           </div>
        </div>
      </div>

      {/* Vaccine Calendar */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="text-blue-500" />
          {isBangla ? 'টিকা ক্যালেন্ডার (EPI)' : 'Vaccination Calendar'}
        </h3>
        <div className="space-y-3">
          {VACCINES.map((vax, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="w-24 shrink-0 text-center">
                <span className="block text-xs text-gray-500 font-bold uppercase">{isBangla ? 'বয়স' : 'Age'}</span>
                <span className="block font-bold text-blue-600">{isBangla ? vax.ageBn : vax.ageEn}</span>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div>
                <p className="font-bold text-gray-800">{vax.name}</p>
                <p className="text-xs text-gray-500">{isBangla ? 'নিকটস্থ স্বাস্থ্যকেন্দ্রে যান' : 'Visit nearest health center'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Child Health Issues */}
      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
         <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
           <AlertCircle className="text-orange-500" />
           {isBangla ? 'শিশুর সাধারণ রোগ ও প্রতিকার' : 'Common Child Diseases'}
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
               <h4 className="font-bold text-gray-800 mb-2">{isBangla ? 'নিউমোনিয়া' : 'Pneumonia'}</h4>
               <p className="text-xs text-gray-600 mb-2">
                 {isBangla ? 'লক্ষণ: শ্বাসকষ্ট, জ্বর। প্রতিকার: দ্রুত হাসপাতালে নিন।' : 'Symptoms: Breathing trouble, fever. Action: Hospital immediately.'}
               </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
               <h4 className="font-bold text-gray-800 mb-2">{isBangla ? 'ডায়রিয়া' : 'Diarrhea'}</h4>
               <p className="text-xs text-gray-600 mb-2">
                 {isBangla ? 'লক্ষণ: পানিশূন্যতা। প্রতিকার: প্রতিবার পায়খানার পর স্যালাইন।' : 'Symptoms: Dehydration. Action: ORS after every stool.'}
               </p>
            </div>
         </div>
      </div>
    </div>
  );

  const renderLifestyle = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Nutrition Guide */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Utensils className="text-green-600" />
          {isBangla ? 'পুষ্টি ও ডায়েট' : 'Nutrition & Diet'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
             <div className="h-40 overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1603048588665-791ca8aea617" alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <h4 className="text-white font-bold text-lg">{isBangla ? 'সুষম বাঙালি খাবার' : 'Healthy Bengali Diet'}</h4>
               </div>
             </div>
             <div className="p-5">
               <ul className="space-y-2 text-sm text-gray-600">
                 <li className="flex gap-2"><Check size={16} className="text-green-500"/> {isBangla ? 'লাল চালের ভাত ও শাকসবজি' : 'Red rice and leafy vegetables'}</li>
                 <li className="flex gap-2"><Check size={16} className="text-green-500"/> {isBangla ? 'ছোট মাছ ও ডাল' : 'Small fish and lentils'}</li>
                 <li className="flex gap-2"><Check size={16} className="text-green-500"/> {isBangla ? 'মৌসুমী ফল' : 'Seasonal fruits'}</li>
               </ul>
             </div>
          </div>
          
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
             <div className="h-40 overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061" alt="Diet" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <h4 className="text-white font-bold text-lg">{isBangla ? 'ডায়াবেটিস ডায়েট' : 'Diabetes Diet Plan'}</h4>
               </div>
             </div>
             <div className="p-5">
               <ul className="space-y-2 text-sm text-gray-600">
                 <li className="flex gap-2"><Check size={16} className="text-green-500"/> {isBangla ? 'চিনি ও মিষ্টি পরিহার করুন' : 'Avoid sugar and sweets'}</li>
                 <li className="flex gap-2"><Check size={16} className="text-green-500"/> {isBangla ? 'নিয়মিত হাঁটাচলা' : 'Regular walking'}</li>
                 <li className="flex gap-2"><Check size={16} className="text-green-500"/> {isBangla ? 'আঁশযুক্ত খাবার খান' : 'Eat fiber-rich foods'}</li>
               </ul>
             </div>
          </div>
        </div>
      </div>

      {/* Fitness */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
         <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
           <Activity className="text-blue-600" />
           {isBangla ? 'ব্যায়াম ও ফিটনেস' : 'Exercise & Fitness'}
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Morning Walk', bn: 'সকালের হাঁটা', min: '30 min' },
              { title: 'Yoga', bn: 'যোগব্যায়াম', min: '20 min' },
              { title: 'Free Hand', bn: 'ফ্রি হ্যান্ড', min: '15 min' },
            ].map((ex, i) => (
              <div key={i} className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                   <Clock size={20} />
                 </div>
                 <h4 className="font-bold text-gray-800">{isBangla ? ex.bn : ex.title}</h4>
                 <p className="text-xs text-gray-500">{ex.min} daily</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderBloodBank = () => (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={18} className="text-red-500" />
              {isBangla ? 'ফিল্টার' : 'Filter Donors'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{isBangla ? 'জেলা' : 'District'}</label>
                <div className="relative">
                  <select 
                    value={filterDistrict}
                    onChange={(e) => setFilterDistrict(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 py-2.5 pl-3 pr-8 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                  >
                    <option value="All">{isBangla ? 'সব জেলা' : 'All Districts'}</option>
                    {DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    onClick={() => setFilterGroup('All')}
                    className={`col-span-4 py-1.5 text-xs rounded-lg border font-medium transition-colors ${filterGroup === 'All' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
                  >
                    {isBangla ? 'সব' : 'All'}
                  </button>
                  {BLOOD_GROUPS.map(grp => (
                    <button
                      key={grp}
                      onClick={() => setFilterGroup(grp)}
                      className={`py-1.5 text-xs rounded-lg border font-bold transition-colors ${filterGroup === grp ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-red-500 shadow-sm">
               <UserPlus size={24} />
             </div>
             <h4 className="font-bold text-red-900 mb-1">{isBangla ? 'রক্তদাতা হোন' : 'Become a Donor'}</h4>
             <p className="text-xs text-red-700 mb-3 leading-relaxed">
               {isBangla ? 'আপনার রক্ত বাঁচাবে একটি প্রাণ। আজই যুক্ত হোন।' : 'Your blood can save a life. Join today.'}
             </p>
             <Button onClick={() => setActiveModal('donate')} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-9">
               {isBangla ? 'নিবন্ধন করুন' : 'Register Now'}
             </Button>
          </div>
        </aside>

        {/* Donors List */}
        <main className="w-full lg:w-3/4">
           <div className="mb-4 flex justify-between items-center">
             <h3 className="font-bold text-gray-800 text-lg">
               {isBangla ? 'রক্তদাতার তালিকা' : 'Donor List'} 
               <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{filteredDonors.length}</span>
             </h3>
           </div>

           {filteredDonors.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {filteredDonors.map(donor => (
                 <div key={donor.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                    
                    <div className="relative z-10 flex justify-between items-start mb-3">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                            {donor.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1">{donor.name}</h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin size={10} /> {donor.district}
                            </p>
                          </div>
                       </div>
                       <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-extrabold shadow-sm border border-red-200">
                         {donor.group}
                       </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                       <p className="text-[10px] text-gray-400">
                         {isBangla ? 'শেষ দান:' : 'Last:'} {donor.lastDonation}
                       </p>
                       <a href={`tel:${donor.phone}`} className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors">
                         <Phone size={12} /> {isBangla ? 'কল' : 'Call'}
                       </a>
                    </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <Droplets size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">{isBangla ? 'কোন রক্তদাতা পাওয়া যায়নি' : 'No donors found'}</p>
                <Button variant="outline" onClick={() => {setFilterDistrict('All'); setFilterGroup('All');}} className="mt-3 text-xs">
                  {isBangla ? 'ফিল্টার মুছুন' : 'Clear Filters'}
                </Button>
             </div>
           )}
        </main>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-teal-50/30 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold mb-3 border border-teal-200">
            <HeartPulse size={14} />
            {isBangla ? 'সুস্থ জীবন, সুন্দর আগামী' : 'Healthy Life, Better Future'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'স্বাস্থ্য সেবা' : 'Health Services'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'আপনার এবং আপনার পরিবারের সুস্বাস্থ্যের জন্য নির্ভরযোগ্য তথ্য ও সেবা।' 
              : 'Reliable information and services for the well-being of you and your family.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2 hide-scrollbar">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 flex gap-1">
            <button 
              onClick={() => setActiveTab('diseases')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'diseases' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Thermometer size={16} />
              {isBangla ? 'রোগের তথ্য' : 'Diseases'}
            </button>
            <button 
              onClick={() => setActiveTab('access')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'access' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 size={16} />
              {isBangla ? 'সেবা ও যোগাযোগ' : 'Access'}
            </button>
            <button 
              onClick={() => setActiveTab('bloodbank')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'bloodbank' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Droplets size={16} />
              {isBangla ? 'ব্লাড ব্যাংক' : 'Blood Bank'}
            </button>
            <button 
              onClick={() => setActiveTab('maternal')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'maternal' ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Baby size={16} />
              {isBangla ? 'মা ও শিশু' : 'Mother & Child'}
            </button>
            <button 
              onClick={() => setActiveTab('lifestyle')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'lifestyle' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Utensils size={16} />
              {isBangla ? 'লাইফস্টাইল' : 'Lifestyle'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'diseases' && renderDiseaseHub()}
          {activeTab === 'access' && renderAccess()}
          {activeTab === 'bloodbank' && renderBloodBank()}
          {activeTab === 'maternal' && renderMaternal()}
          {activeTab === 'lifestyle' && renderLifestyle()}
        </div>

        {/* Modals for Access Tab Grid Items */}
        
        {/* Pharmacy Modal */}
        {activeModal === 'pharmacy' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-green-600 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2"><HeartPulse size={20}/> {isBangla ? 'নিকটস্থ ফার্মেসী' : 'Nearby Pharmacies'}</h3>
                <button onClick={() => setActiveModal(null)} className="hover:bg-green-700 p-1 rounded"><X size={20}/></button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                {PHARMACIES.map((pharmacy, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:bg-green-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{pharmacy.name}</h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {pharmacy.address}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded">{pharmacy.open}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a href={`tel:${pharmacy.phone}`} className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded-lg text-center hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <Phone size={14} /> {isBangla ? 'কল করুন' : 'Call Now'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schemes Modal */}
        {activeModal === 'schemes' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2"><ShieldCheck size={20}/> {isBangla ? 'সরকারি স্বাস্থ্য স্কিম' : 'Government Health Schemes'}</h3>
                <button onClick={() => setActiveModal(null)} className="hover:bg-purple-700 p-1 rounded"><X size={20}/></button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {SCHEMES.map((scheme, idx) => (
                  <div key={idx} className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                    <h4 className="font-bold text-purple-900 text-lg mb-2">{isBangla ? scheme.titleBn : scheme.titleEn}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{isBangla ? scheme.descBn : scheme.descEn}</p>
                    <button className="mt-3 text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
                      {isBangla ? 'আরও জানুন' : 'Learn More'} <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Health Card Modal */}
        {activeModal === 'card' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20}/> {isBangla ? 'ডিজিটাল হেলথ কার্ড' : 'Digital Health Card'}</h3>
                <button onClick={() => setActiveModal(null)} className="hover:bg-orange-600 p-1 rounded"><X size={20}/></button>
              </div>
              
              <div className="p-6">
                {cardStep === 'form' ? (
                  <form onSubmit={handleCardSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'আপনার নাম' : 'Your Name'}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                        value={cardInfo.name}
                        onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                        placeholder={isBangla ? 'নাম লিখুন' : 'Enter your name'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'মোবাইল নম্বর (আইডি)' : 'Mobile Number (ID)'}</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                        value={cardInfo.mobile}
                        onChange={(e) => setCardInfo({...cardInfo, mobile: e.target.value})}
                        placeholder="017..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
                        <div className="relative">
                          <select 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-900 appearance-none cursor-pointer"
                            value={cardInfo.bloodGroup}
                            onChange={(e) => setCardInfo({...cardInfo, bloodGroup: e.target.value})}
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'বয়স' : 'Age'}</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                          value={cardInfo.age}
                          onChange={(e) => setCardInfo({...cardInfo, age: e.target.value})}
                          placeholder="Ex: 25"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl mt-2 shadow-lg shadow-orange-200">
                      {isBangla ? 'কার্ড তৈরি করুন' : 'Create Card'}
                    </Button>
                  </form>
                ) : (
                  <>
                    {/* Mock Card UI */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-5 text-white shadow-lg relative overflow-hidden mb-6">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                          <p className="text-xs opacity-80 uppercase tracking-wider mb-1">Health Card</p>
                          <h3 className="text-xl font-bold">Dream BD Health</h3>
                        </div>
                        <Activity className="text-white/80" />
                      </div>
                      <div className="space-y-4 relative z-10">
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[10px] opacity-70 uppercase">Name</p>
                            <p className="font-medium text-sm">{cardInfo.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] opacity-70 uppercase">ID No</p>
                            <p className="font-medium text-sm">{cardInfo.mobile}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-[10px] opacity-70 uppercase">Blood Group</p>
                                <p className="font-bold text-lg">{cardInfo.bloodGroup}</p>
                            </div>
                            {cardInfo.age && (
                              <div>
                                <p className="text-[10px] opacity-70 uppercase">Age</p>
                                <p className="font-bold text-lg">{cardInfo.age}</p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={() => setCardStep('form')} className="flex items-center justify-center gap-2 text-xs">
                        <Edit3 size={14} /> {isBangla ? 'এডিট করুন' : 'Edit'}
                      </Button>
                      <Button variant="outline" onClick={handleShareCard} className="flex items-center justify-center gap-2 text-xs">
                        <Share2 size={14} /> {isBangla ? 'শেয়ার' : 'Share'}
                      </Button>
                      <Button onClick={handleDownloadCard} className="col-span-2 bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2">
                        <Download size={16} /> {isBangla ? 'ডাউনলোড JPEG' : 'Download JPEG'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Donor Registration Modal */}
        {activeModal === 'donate' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20}/> {isBangla ? 'রক্তদাতা নিবন্ধন' : 'Donor Registration'}</h3>
                <button onClick={() => setActiveModal(null)} className="hover:bg-red-700 p-1 rounded"><X size={20}/></button>
              </div>
              <form onSubmit={handleDonorSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'আপনার নাম' : 'Your Name'}</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900"
                    value={newDonor.name}
                    onChange={(e) => setNewDonor({...newDonor, name: e.target.value})}
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'মোবাইল নম্বর' : 'Mobile Number'}</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900"
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({...newDonor, phone: e.target.value})}
                    placeholder="017..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'জেলা' : 'District'}</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900 appearance-none cursor-pointer"
                        value={newDonor.district}
                        onChange={(e) => setNewDonor({...newDonor, district: e.target.value})}
                      >
                        {DISTRICT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900 appearance-none cursor-pointer"
                        value={newDonor.group}
                        onChange={(e) => setNewDonor({...newDonor, group: e.target.value})}
                      >
                        {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl mt-2 shadow-lg shadow-red-200">
                  {isBangla ? 'নিবন্ধন করুন' : 'Register'}
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
