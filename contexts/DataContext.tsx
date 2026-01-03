
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole, SubscriptionTier, PricingPlan, PromoCode, PaymentRequest } from '../types';

const DataContext = createContext<any>(null);

const getLocal = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  try {
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

const DEFAULT_PLANS: PricingPlan[] = [
  { id: 'pro', nameEn: 'Mithu Pro', nameBn: 'মিঠু প্রো', price: 99, tier: SubscriptionTier.PRO, limit: 10, featuresEn: ['10 Image Uploads', 'Unlimited Chat', 'Standard Support'], featuresBn: ['১০টি ইমেজ আপলোড', 'আনলিমিটেড চ্যাট', 'স্ট্যান্ডার্ড সাপোর্ট'], color: 'from-yellow-400 to-orange-500' },
  { id: 'master', nameEn: 'Mithu Master', nameBn: 'মিঠু মাস্টার', price: 299, tier: SubscriptionTier.MASTER, limit: 20, featuresEn: ['20 Image Uploads', 'Priority AI Response', '24/7 Support'], featuresBn: ['২০টি ইমেজ আপলোড', 'দ্রুত এআই উত্তর', '২৪/৭ সাপোর্ট'], color: 'from-blue-500 to-indigo-600' },
  { id: 'ultra', nameEn: 'Mithu Ultra', nameBn: 'মিঠু আল্ট্রা', price: 499, tier: SubscriptionTier.ULTRA, limit: 999999, featuresEn: ['Unlimited Everything', 'Beta Features Access', 'Custom AI Training'], featuresBn: ['আনলিমিটেড সবকিছু', 'নতুন ফিচার সবার আগে', 'কাস্টম এআই ট্রেনিং'], color: 'from-purple-500 to-pink-600' }
];

const INITIAL_CRAFTS = [
  { id: 1, nameEn: 'Nakshi Kantha', nameBn: 'নকশী কাঁথা', category: 'Textile', image: 'https://images.unsplash.com/photo-1597113366853-fea190b6cd82', rating: 4.8, reviews: 120, artisan: 'Rahima Begum, Jessore', descriptionEn: 'Traditional embroidered quilt made from old saris and dhotis. A masterpiece of rural art.', descriptionBn: 'পুরাতন শাড়ি এবং ধুতি দিয়ে তৈরি ঐতিহ্যবাহী নকশা করা কাঁথা। গ্রামীণ শিল্পের এক অনন্য নিদর্শন।', ecoFriendly: true, material: 'Cotton' },
  { id: 2, nameEn: 'Bamboo Basket Set', nameBn: 'বাঁশের ঝুড়ি সেট', category: 'Bamboo', image: 'https://images.unsplash.com/photo-1595265677860-9a3143b87c32', rating: 4.5, reviews: 45, artisan: 'Sunil Das, Sylhet', descriptionEn: 'Handwoven bamboo baskets perfect for storage or decoration. Durable and eco-friendly.', descriptionBn: 'হাতে বোনা বাঁশের ঝুড়ি যা সংরক্ষণ বা সাজসজ্জার জন্য উপযুক্ত। টেকসই এবং পরিবেশবান্ধব।', ecoFriendly: true, material: 'Bamboo' },
  { id: 3, nameEn: 'Jamdani Saree', nameBn: 'জামদানি শাড়ি', category: 'Textile', image: 'https://images.unsplash.com/photo-1610725664285-a3a962e51a46', rating: 4.9, reviews: 210, artisan: 'Rupganj Weavers', descriptionEn: 'Authentic Dhakai Jamdani with intricate geometric patterns. A symbol of Bengali nobility.', descriptionBn: 'জ্যামিতিক নকশা সম্বলিত আসল ঢাকাই জামদানি। বাঙালি আভিজাত্যের প্রতীক।', ecoFriendly: false, material: 'Cotton & Silk' }
];

const normalizeUser = (u: any) => ({
  ...u,
  subscriptionTier: u.subscriptiontier || u.subscriptionTier || SubscriptionTier.FREE,
  imageUploadCount: u.imageuploadcount || u.imageUploadCount || 0
});

const normalizeLog = (log: any) => {
  if (!log) return null;
  return {
    id: log.id || Date.now() + Math.random(),
    donorName: log.donorname || log.donorName || log.donor_name || 'Unknown',
    donorPhone: log.donorphone || log.donorPhone || log.donor_phone || 'N/A',
    viewerName: log.viewername || log.viewerName || log.viewer_name || 'Anonymous',
    viewerPhone: log.viewerphone || log.viewerPhone || log.viewer_phone || 'N/A',
    viewerDistrict: log.viewerdistrict || log.viewerDistrict || log.viewer_district || 'Unknown',
    created_at: log.created_at || log.createdat || log.date || new Date().toISOString()
  };
};

const normalizeDistrict = (d: any) => {
  if (!d) return null;
  return {
    id: d.id,
    nameEn: d.nameen || d.nameEn || '',
    nameBn: d.namebn || d.nameBn || '',
    division: d.division || '',
    population: d.population || '',
    area: d.area || '',
    description: d.description || '',
    upazilas: Array.isArray(d.upazilas) ? d.upazilas : [],
    education: d.education || { primary: 0, highSchool: 0, college: 0, university: 0 },
    hospitals: Array.isArray(d.hospitals) ? d.hospitals : [],
    touristSpots: d.touristspots || d.touristSpots || [],
    images: d.images || []
  };
};

const normalizeFaq = (f: any) => ({
  id: f.id,
  questionBn: f.questionbn || f.questionBn || '',
  questionEn: f.questionen || f.questionEn || '',
  answerBn: f.answerbn || f.answerBn || '',
  answerEn: f.answeren || f.answerEn || ''
});

const DEFAULT_FAQS = [
  { id: 1, questionBn: 'কিভাবে একাউন্ট খুলব?', questionEn: 'How to create account?', answerBn: 'রেজিস্ট্রেশন বাটনে ক্লিক করে আপনার তথ্য দিন।', answerEn: 'Click Register and fill out your information.' },
  { id: 2, questionBn: 'পাসওয়ার্ড ভুলে গেছি কি করব?', questionEn: 'Forgot Password?', answerBn: 'লগইন পেজে "পাসওয়ার্ড ভুলে গেছেন" লিঙ্কে ক্লিক করুন।', answerEn: 'Use the "Forgot Password" link on the login page.' },
  { id: 3, questionBn: 'এই অ্যাপটি কি সরকারি?', questionEn: 'Is this a govt app?', answerBn: 'এটি একটি সমন্বিত ডিজিটাল প্ল্যাটফর্ম যা নাগরিকদের বিভিন্ন সেবা সহজে পৌঁছে দেয়।', answerEn: 'It is an integrated digital platform designed to provide easy access to various services for citizens.' },
  { id: 4, questionBn: 'কিভাবে অভিযোগ জানাব?', questionEn: 'How to report an issue?', answerBn: 'বর্জ্য ব্যবস্থাপনা বা অন্যান্য মডিউলের "অভিযোগ জানান" অপশনটি ব্যবহার করুন।', answerEn: 'Use the "Report Issue" option in the Waste Management or other modules.' },
  { id: 5, questionBn: 'চাকরির খবর কোথায় পাব?', questionEn: 'Where to find jobs?', answerBn: 'হোমপেজ বা মেনু থেকে "চাকরি" মডিউলে গেলেই সব আপডেট পাবেন।', answerEn: 'You can find all updates in the "Jobs" module from the homepage or menu.' }
];

const INITIAL_POETS = [
  { id: 1, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'শাহ মুহাম্মদ সগীর', nameEn: 'Shah Muhammad Sagir', birthYear: '১৪শ শতাব্দী', deathYear: '১৫শ শতাব্দী', worksBn: 'ইউসুফ-জুলেখা', worksEn: 'Yusuf-Zulekha', awardsBn: 'রাজকীয় পৃষ্ঠপোষকতা', awardsEn: 'Royal patronage', image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a' },
  { id: 2, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'দৌলত কাজী', nameEn: 'Daulat Qazi', birthYear: '১৬শ শতাব্দী', deathYear: 1638, worksBn: 'সতী ময়না ও লোর-চন্দ্রানী', worksEn: 'Sati Maina', awardsBn: 'আরাকান রাজসভার মর্যাদা', awardsEn: 'Arakan Royal Court honor', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f' },
  { id: 3, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'আলাওল', nameEn: 'Alaol', birthYear: 1607, deathYear: 1680, worksBn: 'পদ্মাবতী, তোহফা', worksEn: 'Padmavati, Tohfa', awardsBn: 'মধ্যযুগের শ্রেষ্ঠ কবি', awardsEn: 'Greatest medieval poet', image: 'https://images.unsplash.com/photo-1457369804593-52c41a4a159e' },
  { id: 4, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'সৈয়দ সুলতান', nameEn: 'Syed Sultan', birthYear: 1550, deathYear: 1648, worksBn: 'নবী বংশ', worksEn: 'Nabi Bangsha', awardsBn: 'মহাকাব্যিক অবদান', awardsEn: 'Epic contribution', image: 'https://images.unsplash.com/photo-1519791823145-803154c79810' },
  { id: 5, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'আবদুল হাকিম', nameEn: 'Abdul Hakim', birthYear: 1620, deathYear: 1690, worksBn: 'নূরনামা', worksEn: 'Noornama', awardsBn: 'মাতৃভাষা প্রেমের প্রতীক', awardsEn: 'Linguistic patriotism symbol', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353' },
  { id: 6, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'কাজী নজরুল ইসলাম', nameEn: 'Kazi Nazrul Islam', birthYear: 1899, deathYear: 1976, worksBn: 'অগ্নিবীণা, বিষের বাঁশি', worksEn: 'Agni Bina, National Poet', awardsBn: 'স্বাধীনতা পদক, একুশে পদক', awardsEn: 'Independence & Ekushey Padak', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' },
  { id: 7, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'জসীমউদ্দীন', nameEn: 'Jasimuddin', birthYear: 1903, deathYear: 1976, worksBn: 'নকশী কাঁথার মাঠ', worksEn: 'Nakshi Kanthar Math', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1513001900722-370f803f498d' },
  { id: 8, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'ফররুখ আহমদ', nameEn: 'Farrukh Ahmad', birthYear: 1918, deathYear: 1974, worksBn: 'সাত সাগরের মাঝি', worksEn: 'Sat Sagorer Majhi', awardsBn: 'বাংলা একাডেমি পুরস্কার', awardsEn: 'Bangla Academy Award', image: 'https://images.unsplash.com/photo-1491841251912-0708f5146c9a' },
  { id: 9, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'গোলাম মোস্তফা', nameEn: 'Golam Mostafa', birthYear: 1897, deathYear: 1964, worksBn: 'বিশ্বনবী', worksEn: 'Bishonabi', awardsBn: 'সিতারা-ই-ইমতিয়াজ', awardsEn: 'Sitara-i-Imtiaz', image: 'https://images.unsplash.com/photo-1474932430478-3a7fb9082db0' },
  { id: 10, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'সুফিয়া কামাল', nameEn: 'Sufia কামাল', birthYear: 1911, deathYear: 1999, worksBn: 'সাঁঝের মায়া', worksEn: 'Sanjher Maya', awardsBn: 'স্বাধীনতা পদক', awardsEn: 'Independence Award', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f' }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [blogRequests, setBlogRequests] = useState<any[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [wholesaleAds, setWholesaleAds] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [vocationalCourses, setVocationalCourses] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [donorViewLogs, setDonorViewLogs] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<any[]>([]);
  const [craftProducts, setCraftProducts] = useState<any[]>(() => getLocal('db_craft_products', INITIAL_CRAFTS));
  const [poets, setPoets] = useState<any[]>(() => getLocal('db_poets', INITIAL_POETS));
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(() => getLocal('db_pricing_plans', DEFAULT_PLANS));
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => getLocal('db_promo_codes', []));
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => getLocal('db_payment_requests', []));

  const [aboutUs, setAboutUs] = useState<any>(getLocal('db_about_us', {
    titleEn: 'About Shonali Desh',
    titleBn: 'সোনালী দেশ সম্পর্কে',
    contentEn: 'Shonali Desh is a unified digital platform dedicated to empowering the people of Bangladesh.',
    contentBn: 'সোনালী দেশ বাংলাদেশের মানুষের ক্ষমতায়নের জন্য একটি সমন্বিত ডিজিটাল প্ল্যাটফর্ম।',
    missionEn: 'Our mission is to bring technology to every corner of the country.',
    missionBn: 'আমাদের লক্ষ্য দেশের প্রতিটি প্রান্তে প্রযুক্তি পৌঁছে দেওয়া।',
    visionEn: 'To build a smart, sustainable, and digital Bangladesh.',
    visionBn: 'একটি স্মার্ট, টেকসই এবং ডিজিটাল বাংলাদেশ গড়া।'
  }));
  const [privacyPolicy, setPrivacyPolicy] = useState<any>(getLocal('db_privacy_policy', {
    contentEn: 'Default Privacy Policy...',
    contentBn: 'ডিফল্ট গোপনীয়তা নীতি...'
  }));
  const [termsConditions, setTermsConditions] = useState<any>(getLocal('db_terms_conditions', {
    contentEn: 'Default Terms and Conditions...',
    contentBn: 'ডিফল্ট শর্তাবলী...'
  }));
  
  const [faqs, setFaqs] = useState<any[]>(() => {
    const local = getLocal('db_faqs', []);
    return local.length > 0 ? local.map(normalizeFaq) : DEFAULT_FAQS;
  });

  const [totalVisitors, setTotalVisitors] = useState<number>(() => parseInt(localStorage.getItem('total_visitors') || '1250'));
  const [todayVisitors, setTodayVisitors] = useState<number>(() => parseInt(localStorage.getItem('today_visitors') || '1'));

  const fetchData = async () => {
    if (!isSupabaseConfigured) {
      setJobs(getLocal('db_jobs', []));
      setBlogs(getLocal('db_blogs', []));
      setRequests(getLocal('db_requests', []));
      setBlogRequests(getLocal('db_blog_requests', []));
      setWholesaleRequests(getLocal('db_wholesale_requests', []));
      setDistricts(getLocal('db_districts', []).map(normalizeDistrict));
      setDonorViewLogs(getLocal('db_donor_view_logs', []).map(normalizeLog).filter(Boolean));
      setDonors(getLocal('db_donors', []));
      setGrievances(getLocal('db_grievances', []));
      setMessages(getLocal('db_contact_messages', []));
      setWholesaleAds(getLocal('db_wholesale_ads', []));
      setLawyers(getLocal('db_lawyers', []));
      setMarketPrices(getLocal('db_market_prices', []));
      setRetailProducts(getLocal('db_retail_products', []));
      setExchangeRates(getLocal('db_exchange_rates', []));
      setVocationalCourses(getLocal('db_vocational_courses', []));
      setUsers(getLocal('db_users', []).map(normalizeUser));
      setDiseases(getLocal('db_diseases', []));
      setCraftProducts(getLocal('db_craft_products', INITIAL_CRAFTS));
      setPoets(getLocal('db_poets', INITIAL_POETS));
      setPaymentRequests(getLocal('db_payment_requests', []));
      return;
    }

    try {
      const { data: configData } = await supabase.from('app_config').select('*');
      if (configData) {
        const aboutItem = configData.find(i => i.key === 'about_us');
        if (aboutItem) setAboutUs(aboutItem.value);
        const privacyItem = configData.find(i => i.key === 'privacy_policy');
        if (privacyItem) setPrivacyPolicy(privacyItem.value);
        const termsItem = configData.find(i => i.key === 'terms_conditions');
        if (termsItem) setTermsConditions(termsItem.value);
        const plansItem = configData.find(i => i.key === 'pricing_plans');
        if (plansItem) setPricingPlans(plansItem.value);
        const promoItem = configData.find(i => i.key === 'promo_codes');
        if (promoItem) setPromoCodes(promoItem.value);
        const paymentRequestsItem = configData.find(i => i.key === 'payment_requests');
        if (paymentRequestsItem) setPaymentRequests(paymentRequestsItem.value);
        
        const visitorData = configData.find(i => i.key === 'visitor_stats');
        if (visitorData) {
          const stats = visitorData.value;
          const todayStr = new Date().toLocaleDateString('en-GB');
          setTotalVisitors(stats.total || 1250);
          if (stats.lastDate === todayStr) {
            setTodayVisitors(stats.today || 1);
          } else {
            setTodayVisitors(1);
          }
        }
      }

      const loadTable = async (name: string, setter: any, normalizer?: any) => {
        const { data } = await supabase.from(name).select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          const normalizedData = normalizer ? data.map(normalizer).filter(Boolean) : data;
          setter(normalizedData);
          localStorage.setItem(`db_${name}`, JSON.stringify(normalizedData));
        } else {
          setter([]);
        }
      };

      await Promise.all([
        loadTable('jobs', setJobs),
        loadTable('blogs', setBlogs),
        loadTable('requests', setRequests),
        loadTable('blog_requests', setBlogRequests),
        loadTable('wholesale_requests', setWholesaleRequests),
        loadTable('grievances', setGrievances),
        loadTable('users', setUsers, normalizeUser),
        loadTable('contact_messages', setMessages),
        loadTable('market_prices', setMarketPrices),
        loadTable('retail_products', setRetailProducts),
        loadTable('wholesale_ads', setWholesaleAds),
        loadTable('donors', setDonors),
        loadTable('districts', setDistricts, normalizeDistrict),
        loadTable('lawyers', setLawyers),
        loadTable('exchange_rates', setExchangeRates),
        loadTable('vocational_courses', setVocationalCourses),
        loadTable('donor_view_logs', setDonorViewLogs, normalizeLog),
        loadTable('diseases', setDiseases),
        loadTable('faqs', setFaqs, normalizeFaq),
        loadTable('poets', setPoets),
        loadTable('craft_products', setCraftProducts)
      ]);
    } catch (globalErr: any) {}
  };

  useEffect(() => {
    fetchData();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('visitor-updates')
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'app_config', filter: 'key=eq.visitor_stats' }, 
          (payload) => {
            if (payload.new && payload.new.value) {
               const stats = payload.new.value;
               const todayStr = new Date().toLocaleDateString('en-GB');
               setTotalVisitors(stats.total);
               if (stats.lastDate === todayStr) {
                 setTodayVisitors(stats.today);
               } else {
                 setTodayVisitors(1);
               }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const updateDistrict = async (district: any) => {
    // Optimistically update local state for immediate reflection
    const normalized = normalizeDistrict(district);
    setDistricts(prev => {
        const index = prev.findIndex(d => d.id === district.id);
        if (index !== -1) {
            const newList = [...prev];
            newList[index] = normalized;
            return newList;
        } else {
            return [normalized, ...prev];
        }
    });

    if (isSupabaseConfigured) {
        await supabase.from('districts').upsert(district);
    }
    // Deep sync
    await fetchData();
  };

  const addCraftProduct = async (prod: any) => {
    const updated = [prod, ...craftProducts];
    setCraftProducts(updated);
    localStorage.setItem('db_craft_products', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('craft_products').insert([prod]);
  };

  const updateCraftProduct = async (prod: any) => {
    const updated = craftProducts.map(p => p.id === prod.id ? prod : p);
    setCraftProducts(updated);
    localStorage.setItem('db_craft_products', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('craft_products').update(prod).eq('id', prod.id);
  };

  const deleteCraftProduct = async (id: any) => {
    const updated = craftProducts.filter(p => p.id !== id);
    setCraftProducts(updated);
    localStorage.setItem('db_craft_products', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('craft_products').delete().eq('id', id);
  };

  const addPaymentRequest = async (request: PaymentRequest) => {
    const updated = [request, ...paymentRequests];
    setPaymentRequests(updated);
    localStorage.setItem('db_payment_requests', JSON.stringify(updated));
    if (isSupabaseConfigured) {
      await supabase.from('app_config').upsert({ key: 'payment_requests', value: updated });
    }
  };

  const handlePaymentAction = async (requestId: string, action: 'Approved' | 'Rejected') => {
    const request = paymentRequests.find(r => r.id === requestId);
    if (!request) return;

    if (action === 'Approved') {
      const user = users.find(u => u.id === request.userId);
      if (user) {
        await updateUser({ ...user, subscriptionTier: request.tier });
      }
    }

    const updatedRequests = paymentRequests.map(r => r.id === requestId ? { ...r, status: action } : r);
    setPaymentRequests(updatedRequests);
    localStorage.setItem('db_payment_requests', JSON.stringify(updatedRequests));
    if (isSupabaseConfigured) {
      await supabase.from('app_config').upsert({ key: 'payment_requests', value: updatedRequests });
    }
  };

  const updatePricingPlans = async (plans: PricingPlan[]) => {
    setPricingPlans(plans);
    localStorage.setItem('db_pricing_plans', JSON.stringify(plans));
    if (isSupabaseConfigured) await supabase.from('app_config').upsert({ key: 'pricing_plans', value: plans });
  };

  const updatePromoCodes = async (codes: PromoCode[]) => {
    setPromoCodes(codes);
    localStorage.setItem('db_promo_codes', JSON.stringify(codes));
    if (isSupabaseConfigured) await supabase.from('app_config').upsert({ key: 'promo_codes', value: codes });
  };

  const addPoet = async (poet: any) => {
    const updated = [poet, ...poets];
    setPoets(updated);
    localStorage.setItem('db_poets', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('poets').insert([poet]);
  };

  const updatePoet = async (poet: any) => {
    const updated = poets.map(p => p.id === poet.id ? poet : p);
    setPoets(updated);
    localStorage.setItem('db_poets', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('poets').update(poet).eq('id', poet.id);
  };

  const deletePoet = async (id: any) => {
    const updated = poets.filter(p => p.id !== id);
    setPoets(updated);
    localStorage.setItem('db_poets', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('poets').delete().eq('id', id);
  };

  const updateAboutUs = async (data: any) => {
    setAboutUs(data);
    localStorage.setItem('db_about_us', JSON.stringify(data));
    if (isSupabaseConfigured) await supabase.from('app_config').upsert({ key: 'about_us', value: data });
  };

  const updatePrivacyPolicy = async (data: any) => {
    setPrivacyPolicy(data);
    localStorage.setItem('db_privacy_policy', JSON.stringify(data));
    if (isSupabaseConfigured) await supabase.from('app_config').upsert({ key: 'privacy_policy', value: data });
  };

  const updateTermsConditions = async (data: any) => {
    setTermsConditions(data);
    localStorage.setItem('db_terms_conditions', JSON.stringify(data));
    if (isSupabaseConfigured) await supabase.from('app_config').upsert({ key: 'terms_conditions', value: data });
  };

  const updateFaqs = async (data: any[]) => {
    setFaqs(data);
    localStorage.setItem('db_faqs', JSON.stringify(data));
    if (isSupabaseConfigured) {
       const payload = data.map(f => ({
         id: f.id,
         questionbn: f.questionBn,
         questionen: f.questionEn,
         answerbn: f.answerBn,
         answeren: f.answerEn
       }));
       await supabase.from('faqs').upsert(payload);
    }
  };

  const addDisease = async (disease: any) => {
    if (isSupabaseConfigured) await supabase.from('diseases').insert([disease]);
    await fetchData();
  };

  const updateDisease = async (disease: any) => {
    if (isSupabaseConfigured) await supabase.from('diseases').update(disease).eq('id', disease.id);
    await fetchData();
  };

  const deleteDisease = async (id: number) => {
    setDiseases(prev => prev.filter(d => d.id !== id));
    if (isSupabaseConfigured) await supabase.from('diseases').delete().eq('id', id);
  };

  const updateUser = async (updatedUser: any) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem('db_users', JSON.stringify(updated));
      return updated;
    });
    const payload = {
      ...updatedUser,
      subscriptiontier: updatedUser.subscriptionTier,
      imageuploadcount: updatedUser.imageUploadCount
    };
    if (isSupabaseConfigured) await supabase.from('users').upsert(payload);
  };

  const updateMarketPrices = async (prices: any[]) => {
    setMarketPrices(prices);
    localStorage.setItem('db_market_prices', JSON.stringify(prices));
    if (isSupabaseConfigured) await supabase.from('market_prices').upsert(prices as any);
  };

  const seedDistricts = async () => {
    if (!isSupabaseConfigured) return;
    await fetchData();
  };

  const addDonorViewLog = async (log: any) => {
    if (isSupabaseConfigured) await supabase.from('donor_view_logs').insert([log]);
    await fetchData();
  };

  const logVisit = async () => {
    if (sessionStorage.getItem('dream_visited_logged')) return; 
    
    const todayStr = new Date().toLocaleDateString('en-GB'); 
    let stats = { total: totalVisitors, today: todayVisitors, lastDate: localStorage.getItem('last_visit_date') || '' };

    if (isSupabaseConfigured) {
      const { data } = await supabase.from('app_config').select('value').eq('key', 'visitor_stats').single();
      if (data && data.value) {
        stats = data.value;
      }
    }

    const newTotal = (stats.total || 1250) + 1;
    const newToday = (stats.lastDate === todayStr) ? (stats.today || 0) + 1 : 1;

    setTotalVisitors(newTotal);
    setTodayVisitors(newToday);
    
    localStorage.setItem('total_visitors', newTotal.toString());
    localStorage.setItem('today_visitors', newToday.toString());
    localStorage.setItem('last_visit_date', todayStr);
    sessionStorage.setItem('dream_visited_logged', 'true');

    if (isSupabaseConfigured) {
      await supabase.from('app_config').upsert({ 
        key: 'visitor_stats', 
        value: { total: newTotal, today: newToday, lastDate: todayStr } 
      });
    }
  };

  const addJob = async (job: any) => {
    if (isSupabaseConfigured) await supabase.from('jobs').insert([job]);
    await fetchData();
  };

  const updateJob = async (job: any) => {
    if (isSupabaseConfigured) await supabase.from('jobs').update(job).eq('id', job.id);
    await fetchData();
  };

  const deleteJob = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('jobs').delete().eq('id', id);
    await fetchData();
  };

  const addBlog = async (blog: any) => {
    if (isSupabaseConfigured) await supabase.from('blogs').insert([blog]);
    await fetchData();
  };

  const updateBlog = async (blog: any) => {
    if (isSupabaseConfigured) await supabase.from('blogs').update(blog).eq('id', blog.id);
    await fetchData();
  };

  const deleteBlog = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('blogs').delete().eq('id', id);
    await fetchData();
  };

  const addRequest = async (request: any) => {
    const table = request.contenttype === 'job' ? 'requests' : request.contenttype === 'blog' ? 'blog_requests' : 'wholesale_requests';
    if (isSupabaseConfigured) await supabase.from(table).insert([request]);
    await fetchData();
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject', type: string) => {
    if (isSupabaseConfigured) {
      const table = type === 'job' ? 'requests' : type === 'blog' ? 'blog_requests' : 'wholesale_requests';
      if (action === 'approve') {
        const target = type === 'job' ? 'jobs' : type === 'blog' ? 'blogs' : 'wholesale_ads';
        const { id, ...data } = item;
        await supabase.from(target).insert([data]);
      }
      await supabase.from(table).delete().eq('id', item.id);
    }
    await fetchData();
  };

  const addGrievance = async (g: any) => {
    if (isSupabaseConfigured) await supabase.from('grievances').insert([g]);
    await fetchData();
  };

  const updateGrievanceStatus = async (id: number, status: string) => {
    if (isSupabaseConfigured) await supabase.from('grievances').update({ status }).eq('id', id);
    await fetchData();
  };

  const deleteGrievance = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('grievances').delete().eq('id', id);
    await fetchData();
  };

  const addMessage = async (m: any) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').insert([m]);
    await fetchData();
  };

  const markMessageRead = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id);
    await fetchData();
  };

  const deleteMessage = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').delete().eq('id', id);
    await fetchData();
  };

  const addUser = async (u: any) => {
    if (isSupabaseConfigured) await supabase.from('users').insert([u]);
    await fetchData();
  };

  const updateUserStatus = async (id: string, status: string) => {
    if (isSupabaseConfigured) await supabase.from('users').update({ status }).eq('id', id);
    await fetchData();
  };

  const deleteUser = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id);
    await fetchData();
  };

  const updateWholesaleAd = async (ad: any) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(ad).eq('id', ad.id);
    await fetchData();
  };

  const deleteWholesaleAd = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id);
    await fetchData();
  };

  const addRetailProduct = async (p: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').insert([p]);
    await fetchData();
  };

  const updateRetailProduct = async (p: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').update(p).eq('id', p.id);
    await fetchData();
  };

  const deleteRetailProduct = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id);
    await fetchData();
  };

  const enrollCourse = (c: any) => setEnrolledCourses(prev => [...prev, c]);

  const deleteDistrict = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('districts').delete().eq('id', id);
    await fetchData();
  };

  const addLawyer = async (l: any) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').insert([l]);
    await fetchData();
  };

  const deleteLawyer = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id);
    await fetchData();
  };

  const addExchangeRate = async (r: any) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').insert([r]);
    await fetchData();
  };

  const deleteExchangeRate = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id);
    await fetchData();
  };

  const addVocationalCourse = async (c: any) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').insert([c]);
    await fetchData();
  };

  const deleteVocationalCourse = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id);
    await fetchData();
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, blogRequests, wholesaleRequests, grievances, users, messages, donors, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses, districts, donorViewLogs, diseases, aboutUs, privacyPolicy, termsConditions, faqs, poets, craftProducts,
      pricingPlans, promoCodes, paymentRequests, updatePricingPlans, updatePromoCodes, addPaymentRequest, handlePaymentAction,
      addPoet, updatePoet, deletePoet, addCraftProduct, updateCraftProduct, deleteCraftProduct,
      addRequest, addGrievance, updateGrievanceStatus, deleteGrievance, addMessage, markMessageRead, deleteMessage, enrollCourse, seedDistricts, updateDistrict, deleteDistrict, addDonorViewLog, addDisease, updateDisease, deleteDisease, updateAboutUs, updatePrivacyPolicy, updateTermsConditions, updateFaqs,
      addUser, updateUserStatus, deleteUser, updateMarketPrices, addJob, updateJob, deleteJob, addBlog, updateBlog, deleteBlog, handleRequestAction,
      updateWholesaleAd, deleteWholesaleAd, addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addLawyer, deleteLawyer, addExchangeRate, deleteExchangeRate, addVocationalCourse, deleteVocationalCourse,
      totalVisitors, todayVisitors, logVisit, updateUser, refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
