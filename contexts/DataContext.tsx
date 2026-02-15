
"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole, SubscriptionTier, PricingPlan, PromoCode, PaymentRequest, AppModule, ServiceLink, ServiceCategory } from '../types';

interface DataContextType {
  isLoading: boolean;
  users: User[];
  fetchUsers: () => Promise<void>;
  clearUsers: () => void;
  addUser: (user: any) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  updateUserStatus: (id: string, status: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetPassword: (email: string, pass: string) => Promise<void>;

  jobs: any[];
  addJob: (job: any) => Promise<void>;
  updateJob: (job: any) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;

  blogs: any[];
  addBlog: (blog: any) => Promise<void>;
  updateBlog: (blog: any) => Promise<void>;
  deleteBlog: (id: number) => Promise<void>;

  wholesaleAds: any[];
  addWholesaleAd: (ad: any) => Promise<void>;
  updateWholesaleAd: (ad: any) => Promise<void>;
  deleteWholesaleAd: (id: number) => Promise<void>;

  requests: any[];
  blogRequests: any[];
  wholesaleRequests: any[];
  addRequest: (req: any) => Promise<void>;
  handleRequestAction: (req: any, action: string, type: string) => Promise<void>;

  marketPrices: any[];
  updateMarketPrices: (prices: any[]) => Promise<void>;

  retailProducts: any[];
  addRetailProduct: (prod: any) => Promise<void>;
  updateRetailProduct: (prod: any) => Promise<void>;
  deleteRetailProduct: (id: number) => Promise<void>;

  donors: any[];
  donorViewLogs: any[];
  addDonorViewLog: (log: any) => Promise<void>;

  enrolledCourses: any[];
  enrollCourse: (course: any) => Promise<void>;

  messages: any[];
  addMessage: (msg: any) => Promise<void>;
  markMessageRead: (id: number) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;

  faqs: any[];
  updateFaqs: (faqs: any[]) => Promise<void>;

  districts: any[];
  updateDistrict: (d: any) => Promise<void>;
  deleteDistrict: (id: string) => Promise<void>;
  seedDistricts: () => Promise<void>;

  aboutUs: any;
  updateAboutUs: (data: any) => Promise<void>;

  privacyPolicy: any;
  updatePrivacyPolicy: (data: any) => Promise<void>;

  termsConditions: any;
  updateTermsConditions: (data: any) => Promise<void>;

  diseases: any[];
  addDisease: (d: any) => Promise<void>;
  updateDisease: (d: any) => Promise<void>;
  deleteDisease: (id: number) => Promise<void>;

  poets: any[];
  addPoet: (p: any) => Promise<void>;
  updatePoet: (p: any) => Promise<void>;
  deletePoet: (id: number) => Promise<void>;

  serviceLinks: ServiceLink[];
  addServiceLink: (s: ServiceLink) => Promise<void>;
  updateServiceLink: (s: ServiceLink) => Promise<void>;
  deleteServiceLink: (id: string | number) => Promise<void>;

  serviceCategories: ServiceCategory[];
  addServiceCategory: (c: ServiceCategory) => Promise<void>;
  updateServiceCategory: (c: ServiceCategory) => Promise<void>;
  deleteServiceCategory: (id: string) => Promise<void>;

  pregnancyInfo: any[];
  updatePregnancyInfo: (info: any[]) => Promise<void>;

  pricingPlans: PricingPlan[];
  promoCodes: PromoCode[];
  paymentRequests: PaymentRequest[];
  updatePricingPlans: (plans: PricingPlan[]) => Promise<void>;
  updatePromoCodes: (codes: PromoCode[]) => Promise<void>;
  addPaymentRequest: (req: PaymentRequest) => Promise<void>;
  handlePaymentAction: (id: string, action: string) => Promise<void>;

  totalVisitors: number;
  todayVisitors: number;
  logVisit: () => Promise<void>;
  totalCvGenerated: number;
  todayCvGenerated: number;
  logCvGeneration: () => void;

  grievances: any[];
  addGrievance: (g: any) => Promise<void>;
  updateGrievanceStatus: (id: number, status: string) => Promise<void>;
  deleteGrievance: (id: number) => Promise<void>;

  lawyers: any[];
  addLawyer: (l: any) => Promise<void>;
  deleteLawyer: (id: number) => Promise<void>;

  exchangeRates: any[];
  addExchangeRate: (e: any) => Promise<void>;
  deleteExchangeRate: (id: number) => Promise<void>;

  vocationalCourses: any[];
  addVocationalCourse: (v: any) => Promise<void>;
  deleteVocationalCourse: (id: number) => Promise<void>;

  craftProducts: any[];
  addCraftProduct: (c: any) => Promise<void>;
  updateCraftProduct: (c: any) => Promise<void>;
  deleteCraftProduct: (id: number) => Promise<void>;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const getSyncCache = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const cached = localStorage.getItem(`db_cache_${key}`);
    if (cached && cached !== "undefined" && cached !== "null" && cached !== "[object Object]") {
      const parsed = JSON.parse(cached);
      return parsed !== null ? parsed : defaultValue;
    }
  } catch (e) {
    console.warn(`Cache parsing failed for ${key}`);
  }
  return defaultValue;
};

const getStatCache = (key: string, defaultVal: number) => {
  if (typeof window === 'undefined') return defaultVal;
  const v = localStorage.getItem(key);
  return (v && v !== "undefined" && v !== "null") ? parseInt(v) : defaultVal;
};

const INITIAL_SERVICES: ServiceLink[] = [
  { id: 'nid_new', titleBn: 'জাতীয় পরিচয়পত্র', titleEn: 'NID Application', views: 2632, badge: 'FREE', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_of_Bangladesh_Logo.svg/1200px-Government_of_Bangladesh_Logo.svg.png', link: 'https://services.nidw.gov.bd/nid-pub/', category: 'NID', module: AppModule.NID_PRINT },
  { id: 'election_2026', titleBn: 'ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬', titleEn: '13th National Election 2026', views: 1, badge: 'FREE', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bangladesh_Election_Commission_logo.svg/1200px-Bangladesh_Election_Commission_logo.svg.png', link: 'https://en.wikipedia.org/wiki/Next_Bangladeshi_general_election', category: 'All', module: undefined, iframe: true },
  { id: 'birth_check', titleBn: 'জন্ম নিবন্ধন চেক', titleEn: 'Birth Reg Check', views: 3886, badge: 'FREE', logo: 'https://bdris.gov.bd/resources/img/logo_en.png', link: 'https://bdris.gov.bd/br/search', category: 'Birth Reg', module: AppModule.LEGAL },
  { id: 'birth_correct', titleBn: 'জন্ম নিবন্ধন আবেদন', titleEn: 'Birth Reg Apply', views: 2433, badge: 'FREE', logo: 'https://bdris.gov.bd/resources/img/logo_en.png', link: 'https://bdris.gov.bd/br/application', category: 'Birth Reg', module: AppModule.LEGAL },
  { id: 'nid_wallet', titleBn: 'NID Wallet', titleEn: 'NID Wallet App', views: 2131, badge: 'NEW', logo: 'https://play-lh.googleusercontent.com/Ti2qV9X80vG9FqF-k7h_M-qG6G6fG6h6G6h6G6h6G6h6G6h6G6h6G6h6G6h6G6h6=w240-h480-rw', link: '', category: 'NID', module: AppModule.NID_PRINT },
  { id: 'land_khatiyan', titleBn: 'ই-পর্চা / খতিয়ান', titleEn: 'E-Porcha / Khatiyan', views: 2011, badge: 'PREMIUM', logo: 'https://eporcha.gov.bd/assets/img/logo.png', link: 'https://eporcha.gov.bd/', category: 'Land', module: AppModule.LEGAL },
  { id: 'photo_color', titleBn: 'সাদা কালো ছবি রঙিন', titleEn: 'Photo Colorizer AI', views: 1859, badge: 'FREE', logo: 'https://cdn-icons-png.flaticon.com/512/8353/8353265.png', link: '', category: 'Studio', module: AppModule.PHOTO_STUDIO },
  { id: 'police_clearance', titleBn: 'পুলিশ ক্লিয়ারেন্স', titleEn: 'Police Clearance', views: 1650, badge: 'PREMIUM', logo: 'https://pcc.police.gov.bd/ords/pcc/r/144/files/static/v2/logo-pcc.png', link: 'https://pcc.police.gov.bd/ords/f?p=500:1::::::', category: 'Police', module: AppModule.LEGAL },
  { id: 'driving_license', titleBn: 'ড্রাইভিং লাইসেন্স', titleEn: 'Driving License', views: 1592, badge: 'FREE', logo: 'https://brta.gov.bd/themes/responsive_npf/img/logo/logo.png', link: 'http://bsp.brta.gov.bd/', category: 'Transport', module: AppModule.TRANSPORT },
  { id: 'passport_renew', titleBn: 'ই-পাসপোর্ট পোর্টাল', titleEn: 'E-Passport Portal', views: 1420, badge: 'FREE', logo: 'https://www.epassport.gov.bd/img/logo.png', link: 'https://www.epassport.gov.bd/landing', category: 'Passport', module: AppModule.EXPAT },
  { id: 'nu_result', titleBn: 'জাতীয় বিশ্ববিদ্যালয়', titleEn: 'National University', views: 3100, badge: 'FREE', logo: 'https://www.nu.ac.bd/assets/images/nu_logo.png', link: 'http://results.nu.ac.bd/', category: 'Education', module: AppModule.EDU },
  { id: 'agri_loan', titleBn: 'কৃষি ঋণ আবেদন', titleEn: 'Agri Loan Apply', views: 980, badge: 'FREE', logo: 'https://www.bb.org.bd/images/bblogo.png', link: '', category: 'Agriculture', module: AppModule.AGRI },
  { id: 'doc_appointment', titleBn: 'ডাক্তার অ্যাপয়েন্টমেন্ট', titleEn: 'Doctor Appointment', views: 2200, badge: 'PREMIUM', logo: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', link: '', category: 'Health', module: AppModule.HEALTH },
];

const INITIAL_CATEGORIES: ServiceCategory[] = [
  { id: 'All', titleBn: 'সব', titleEn: 'All' },
  { id: 'NID', titleBn: 'এনআইডি', titleEn: 'NID' },
  { id: 'Birth Reg', titleBn: 'জন্ম নিবন্ধন', titleEn: 'Birth Reg' },
  { id: 'Land', titleBn: 'ভূমি', titleEn: 'Land' },
  { id: 'Passport', titleBn: 'পাসপোর্ট', titleEn: 'Passport' },
  { id: 'Education', titleBn: 'শিক্ষা', titleEn: 'Education' },
  { id: 'Health', titleBn: 'স্বাস্থ্য', titleEn: 'Health' },
  { id: 'Transport', titleBn: 'পরিবহন', titleEn: 'Transport' },
  { id: 'Studio', titleBn: 'স্টুডিও', titleEn: 'Studio' },
  { id: 'Police', titleBn: 'পুলিশ', titleEn: 'Police' },
  { id: 'Agriculture', titleBn: 'কৃষি', titleEn: 'Agriculture' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); 
  
  const [users, setUsers] = useState<User[]>(() => getSyncCache('users', [])); 
  
  const [jobs, setJobs] = useState<any[]>(() => getSyncCache('jobs', []));
  const [blogs, setBlogs] = useState<any[]>(() => getSyncCache('blogs', []));
  const [wholesaleAds, setWholesaleAds] = useState<any[]>(() => getSyncCache('wholesale_ads', []));
  const [requests, setRequests] = useState<any[]>(() => getSyncCache('requests', []));
  const [blogRequests, setBlogRequests] = useState<any[]>(() => getSyncCache('blog_requests', []));
  const [wholesaleRequests, setWholesaleRequests] = useState<any[]>(() => getSyncCache('wholesale_requests', []));
  const [marketPrices, setMarketPrices] = useState<any[]>(() => getSyncCache('market_prices', []));
  const [retailProducts, setRetailProducts] = useState<any[]>(() => getSyncCache('retail_products', []));
  const [donors, setDonors] = useState<any[]>(() => getSyncCache('donors', []));
  const [donorViewLogs, setDonorViewLogs] = useState<any[]>(() => getSyncCache('donor_view_logs', []));
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>(() => getSyncCache('contact_messages', []));
  const [faqs, setFaqs] = useState<any[]>(() => getSyncCache('faqs', []));
  const [districts, setDistricts] = useState<any[]>(() => getSyncCache('districts', []));
  
  const [aboutUs, setAboutUs] = useState(() => getSyncCache('about_us', { titleBn: 'সোনালী দেশ', titleEn: 'Shonali Desh', contentBn: '', contentEn: '', missionBn: '', missionEn: '', visionBn: '', visionEn: '' }));
  const [privacyPolicy, setPrivacyPolicy] = useState(() => getSyncCache('privacy_policy', { contentBn: '', contentEn: '' }));
  const [termsConditions, setTermsConditions] = useState(() => getSyncCache('terms_conditions', { contentBn: '', contentEn: '' }));
  
  const [diseases, setDiseases] = useState<any[]>(() => getSyncCache('diseases', []));
  const [poets, setPoets] = useState<any[]>(() => getSyncCache('poets', []));
  const [serviceLinks, setServiceLinks] = useState<ServiceLink[]>(() => getSyncCache('service_links', INITIAL_SERVICES));
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(() => getSyncCache('service_categories', INITIAL_CATEGORIES));
  const [pregnancyInfo, setPregnancyInfo] = useState<any[]>(() => getSyncCache('pregnancy_info', []));
  
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(() => getSyncCache('pricing_plans', []));
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => getSyncCache('promo_codes', []));
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => getSyncCache('payment_requests', []));
  
  const [totalVisitors, setTotalVisitors] = useState(() => getStatCache('stat_total_visitors', 1));
  const [todayVisitors, setTodayVisitors] = useState(() => getStatCache('stat_today_visitors', 1));
  const [totalCvGenerated, setTotalCvGenerated] = useState(() => getStatCache('stat_total_cvs', 0));
  const [todayCvGenerated, setTodayCvGenerated] = useState(() => getStatCache('stat_today_cvs', 0));

  const [grievances, setGrievances] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>(() => getSyncCache('lawyers', []));
  const [exchangeRates, setExchangeRates] = useState<any[]>(() => getSyncCache('exchange_rates', []));
  const [vocationalCourses, setVocationalCourses] = useState<any[]>(() => getSyncCache('vocational_courses', []));
  const [craftProducts, setCraftProducts] = useState<any[]>(() => getSyncCache('craft_products', []));

  const saveCache = (key: string, data: any) => {
    try {
      if (typeof window === 'undefined' || data === undefined || data === null) return;
      localStorage.setItem(`db_cache_${key}`, JSON.stringify(data));
    } catch (e) { console.warn(`Cache save failed for ${key}`); }
  };

  const fetchUsers = async () => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, avatar, phone, location, status, date, subscriptionTier, imageUploadCount')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setUsers(data as User[]);
        saveCache('users', data); 
      }
    } catch (e) { console.warn("Failed to fetch users:", e); }
  };

  const clearUsers = () => {
    setUsers([]);
  };

  const fetchInitialData = useCallback(async () => {
    if (!isSupabaseConfigured) {
        setIsLoading(false); 
        return;
    }

    const fetchTable = async (table: string, setter: (data: any[]) => void, orderCol: string = 'created_at') => {
      try {
        const { data, error } = await supabase.from(table).select('*').order(orderCol, { ascending: table === 'districts' || table === 'pregnancy_info' });
        if (!error && data) {
          setter(data);
          saveCache(table, data);
        }
      } catch (e) {
        console.warn(`Failed to fetch ${table} in background:`, e);
      }
    };

    const fetchSiteContent = async () => {
      try {
        const { data, error } = await supabase.from('site_config').select('*');
        if (!error && data) {
          data.forEach(item => {
            if (item.key === 'about_us') { setAboutUs(item.value); saveCache('about_us', item.value); }
            if (item.key === 'privacy_policy') { setPrivacyPolicy(item.value); saveCache('privacy_policy', item.value); }
            if (item.key === 'terms_conditions') { setTermsConditions(item.value); saveCache('terms_conditions', item.value); }
            if (item.key === 'pricing_plans') { setPricingPlans(item.value); saveCache('pricing_plans', item.value); }
            if (item.key === 'promo_codes') { setPromoCodes(item.value); saveCache('promo_codes', item.value); }
            if (item.key === 'payment_requests') { setPaymentRequests(item.value); saveCache('payment_requests', item.value); }
          });
        }
      } catch (e) { console.warn("Failed to fetch site config:", e); }
    };

    try {
      await fetchSiteContent();
      setIsLoading(false);

      const fetchPromises = [
        fetchTable('jobs', setJobs),
        fetchTable('blogs', setBlogs),
        fetchTable('market_prices', setMarketPrices),
        fetchTable('districts', setDistricts, 'nameen'),
        fetchTable('wholesale_ads', setWholesaleAds),
        fetchTable('retail_products', setRetailProducts),
        fetchTable('donors', setDonors),
        fetchTable('diseases', setDiseases),
        fetchTable('poets', setPoets),
        fetchTable('service_links', setServiceLinks),
        fetchTable('service_categories', setServiceCategories),
        fetchTable('craft_products', setCraftProducts),
        fetchTable('exchange_rates', setExchangeRates),
        fetchTable('vocational_courses', setVocationalCourses),
        fetchTable('lawyers', setLawyers),
        fetchTable('pregnancy_info', setPregnancyInfo, 'week'),
        fetchTable('faqs', setFaqs),
        fetchTable('requests', setRequests),
        fetchTable('blog_requests', setBlogRequests),
        fetchTable('wholesale_requests', setWholesaleRequests),
        fetchTable('contact_messages', setMessages),
        fetchTable('donor_view_logs', setDonorViewLogs)
      ];
      Promise.allSettled(fetchPromises);

    } catch (e) {
      console.error("Data fetch error:", e);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
    
    if (isSupabaseConfigured) {
      const channel = supabase.channel('data_context_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, (payload: any) => {
          if (payload.new) {
            const { key, value } = payload.new;
            if (key === 'about_us') { setAboutUs(value); saveCache('about_us', value); }
            else if (key === 'privacy_policy') { setPrivacyPolicy(value); saveCache('privacy_policy', value); }
            else if (key === 'terms_conditions') { setTermsConditions(value); saveCache('terms_conditions', value); }
            else if (key === 'pricing_plans') { setPricingPlans(value); saveCache('pricing_plans', value); }
            else if (key === 'promo_codes') { setPromoCodes(value); saveCache('promo_codes', value); }
            else if (key === 'payment_requests') { setPaymentRequests(value); saveCache('payment_requests', value); }
          }
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [fetchInitialData]);

  const saveSiteContent = async (key: string, value: any) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('site_config').upsert([{ key, value, updated_at: new Date().toISOString() }], { onConflict: 'key' });
      if (error) throw error;
      saveCache(key, value);
    } catch (e) { console.warn(`Cloud save failed for ${key}`, e); }
  };

  const logVisit = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    const today = new Date().toISOString().split('T')[0];
    const sessionKey = 'last_logged_visit_date';
    const lastLoggedDate = localStorage.getItem(sessionKey);
    
    const vTotal = localStorage.getItem('stat_total_visitors');
    const vToday = localStorage.getItem('stat_today_visitors');
    
    const currentTotal = (vTotal && vTotal !== "undefined" && vTotal !== "null") ? parseInt(vTotal) : 0;
    const currentToday = (lastLoggedDate === today && vToday && vToday !== "undefined" && vToday !== "null") ? parseInt(vToday) : 0;

    const nextTotal = currentTotal + 1;
    const nextToday = currentToday + 1;

    setTotalVisitors(nextTotal);
    setTodayVisitors(nextToday);
    
    localStorage.setItem('stat_total_visitors', nextTotal.toString());
    localStorage.setItem('stat_today_visitors', nextToday.toString());
    localStorage.setItem(sessionKey, today);

    if (isSupabaseConfigured && window.navigator.onLine) {
        try {
            await supabase.from('app_config').upsert([
                { key: 'total_visitors', value: nextTotal.toString() },
                { key: 'today_visitors', value: nextToday.toString() },
                { key: 'last_reset_date', value: today }
            ]);
        } catch (e) { /* silent fail */ }
    }
  }, []);

  const logCvGeneration = () => { 
    if (typeof window === 'undefined') return;
    const nextTotal = totalCvGenerated + 1;
    const nextToday = todayCvGenerated + 1;
    setTotalCvGenerated(nextTotal); 
    setTodayCvGenerated(nextToday); 
    localStorage.setItem('stat_total_cvs', nextTotal.toString());
    localStorage.setItem('stat_today_cvs', nextToday.toString());
  };

  const wrapSupabase = async (action: () => Promise<any>) => {
    if (!isSupabaseConfigured || (typeof window !== 'undefined' && !window.navigator.onLine)) return;
    try { await action(); } catch (e) { console.warn("Supabase action failed."); }
  };

  const addUser = async (u: any) => {
    await wrapSupabase(() => supabase.from('users').insert([u]));
    if (localStorage.getItem('digital_desh_bd_admin_session')) {
       setUsers(prev => [...prev, u]);
       const currentUsers = getSyncCache('users', []);
       saveCache('users', [...currentUsers, u]);
    }
  };

  const updateUser = async (u: User) => {
    await wrapSupabase(() => supabase.from('users').update(u).eq('id', u.id));
    setUsers(prev => prev.map(item => item.id === u.id ? u : item));
    
    if (typeof window !== 'undefined') {
        const sessionStr = localStorage.getItem('digital_desh_bd_user_session');
        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr);
                if (session.user && session.user.id === u.id) {
                    localStorage.setItem('digital_desh_bd_user_session', JSON.stringify({ ...session, user: u }));
                }
            } catch(e) {}
        }
    }
  };

  const updateUserStatus = async (id: string, s: string) => {
    await wrapSupabase(() => supabase.from('users').update({ status: s }).eq('id', id));
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: s } : u));
  };

  const deleteUser = async (id: string) => {
    await wrapSupabase(() => supabase.from('users').delete().eq('id', id));
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const resetPassword = async (email: string, pass: string) => {
    await wrapSupabase(() => supabase.from('users').update({ password: pass }).eq('email', email));
    setUsers(prev => prev.map(u => u.email === email ? { ...u, password: pass } : u));
  };

  const addJob = async (j: any) => {
    const jobData = { ...j, status: 'Active', posteddate: j.posteddate || new Date().toLocaleDateString() };
    await wrapSupabase(() => supabase.from('jobs').insert([jobData]));
    setJobs(prev => [{ ...jobData, id: jobData.id || Date.now() }, ...prev]);
  };

  const updateJob = async (j: any) => {
    await wrapSupabase(() => supabase.from('jobs').update(j).eq('id', j.id));
    setJobs(prev => prev.map(item => item.id === j.id ? j : item));
  };

  const deleteJob = async (id: number) => {
    await wrapSupabase(() => supabase.from('jobs').delete().eq('id', id));
    setJobs(prev => prev.filter(item => item.id !== id));
  };

  const addBlog = async (b: any) => {
    const blogData = { ...b, status: 'Active', posteddate: b.posteddate || new Date().toLocaleDateString() };
    await wrapSupabase(() => supabase.from('blogs').insert([blogData]));
    setBlogs(prev => [{ ...blogData, id: blogData.id || Date.now() }, ...prev]);
  };

  const updateBlog = async (b: any) => {
    await wrapSupabase(() => supabase.from('blogs').update(b).eq('id', b.id));
    setBlogs(prev => prev.map(item => item.id === b.id ? b : item));
  };

  const deleteBlog = async (id: number) => {
    await wrapSupabase(() => supabase.from('blogs').delete().eq('id', id));
    setBlogs(prev => prev.filter(item => item.id !== id));
  };

  const addWholesaleAd = async (ad: any) => {
    const adData = { ...ad, status: 'Active', posteddate: ad.posteddate || new Date().toLocaleDateString() };
    await wrapSupabase(() => supabase.from('wholesale_ads').insert([adData]));
    setWholesaleAds(prev => [{ ...adData, id: adData.id || Date.now() }, ...prev]);
  };

  const updateWholesaleAd = async (ad: any) => {
    await wrapSupabase(() => supabase.from('wholesale_ads').update(ad).eq('id', ad.id));
    setWholesaleAds(prev => prev.map(item => item.id === ad.id ? ad : item));
  };

  const deleteWholesaleAd = async (id: number) => {
    await wrapSupabase(() => supabase.from('wholesale_ads').delete().eq('id', id));
    setWholesaleAds(prev => prev.filter(item => item.id !== id));
  };

  const addRetailProduct = async (prod: any) => {
    await wrapSupabase(() => supabase.from('retail_products').insert([prod]));
    setRetailProducts(prev => [...prev, prod]);
  };

  const updateRetailProduct = async (prod: any) => {
    await wrapSupabase(() => supabase.from('retail_products').update(prod).eq('id', prod.id));
    setRetailProducts(prev => prev.map(item => item.id === prod.id ? prod : item));
  };

  const deleteRetailProduct = async (id: number) => {
    await wrapSupabase(() => supabase.from('retail_products').delete().eq('id', id));
    setRetailProducts(prev => prev.filter(item => item.id !== id));
  };

  const addRequest = async (req: any) => {
    await wrapSupabase(() => {
        let tableName = 'requests';
        if (req.contenttype === 'blog') tableName = 'blog_requests';
        if (req.contenttype === 'wholesale') tableName = 'wholesale_requests';
        return supabase.from(tableName).insert([req]);
    });
    if (req.contenttype === 'job') setRequests(prev => [...prev, { ...req, id: Date.now() }]);
    else if (req.contenttype === 'blog') setBlogRequests(prev => [...prev, { ...req, id: Date.now() }]);
    else if (req.contenttype === 'wholesale') setWholesaleRequests(prev => [...prev, { ...req, id: Date.now() }]);
  };

  const handleRequestAction = async (req: any, action: string, type: string) => {
    await wrapSupabase(() => {
        let tableName = 'requests';
        if (type === 'blog') tableName = 'blog_requests';
        if (type === 'wholesale') tableName = 'wholesale_requests';
        return supabase.from(tableName).delete().eq('id', req.id);
    });
    
    if (action === 'approve') {
      const cleanReq = { ...req };
      delete cleanReq.id; 
      if (type === 'job') await addJob(cleanReq);
      else if (type === 'blog') await addBlog(cleanReq);
      else if (type === 'wholesale') await addWholesaleAd(cleanReq);
    }
    
    if (type === 'job') setRequests(prev => prev.filter(r => r.id !== req.id));
    else if (type === 'blog') setBlogRequests(prev => prev.filter(r => r.id !== req.id));
    else if (type === 'wholesale') setWholesaleRequests(prev => prev.filter(r => r.id !== req.id));
  };

  const updateMarketPrices = async (p: any[]) => {
    await wrapSupabase(() => supabase.from('market_prices').upsert(p));
    setMarketPrices(p);
    saveCache('market_prices', p);
  };

  const addDonorViewLog = async (l: any) => {
    await wrapSupabase(() => supabase.from('donor_view_logs').insert([l]));
    setDonorViewLogs(prev => [l, ...prev]);
  };

  const enrollCourse = async (c: any) => setEnrolledCourses(prev => [c, ...prev]);

  const addMessage = async (m: any) => {
    await wrapSupabase(() => supabase.from('contact_messages').insert([m]));
    setMessages(prev => [{ ...m, id: Date.now(), status: 'Unread', created_at: new Date().toISOString() }, ...prev]);
  };

  const markMessageRead = async (id: number) => {
    await wrapSupabase(() => supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id));
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'Read' } : m));
  };

  const deleteMessage = async (id: number) => {
    await wrapSupabase(() => supabase.from('contact_messages').delete().eq('id', id));
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const updateFaqs = async (f: any[]) => {
    // Note: Assuming 'faqs' table exists and follows upsert logic, otherwise delete/insert
    // Simplified: Just local and cache for now as specific API was not requested
    setFaqs(f);
    saveCache('faqs', f);
  };

  const updateDistrict = async (d: any) => {
    await wrapSupabase(() => supabase.from('districts').upsert([d]));
    setDistricts(prev => {
        const exists = prev.find(item => item.id === d.id);
        if (exists) return prev.map(item => item.id === d.id ? d : item);
        return [...prev, d];
    });
  };

  const deleteDistrict = async (id: string) => {
    await wrapSupabase(() => supabase.from('districts').delete().eq('id', id));
    setDistricts(prev => prev.filter(d => d.id !== id));
  };

  const seedDistricts = async () => {};

  const addDisease = async (d: any) => {
    await wrapSupabase(() => supabase.from('diseases').insert([d]));
    setDiseases(prev => [...prev, d]);
  };
  const updateDisease = async (d: any) => {
    await wrapSupabase(() => supabase.from('diseases').update(d).eq('id', d.id));
    setDiseases(prev => prev.map(item => item.id === d.id ? d : item));
  };
  const deleteDisease = async (id: number) => {
    await wrapSupabase(() => supabase.from('diseases').delete().eq('id', id));
    setDiseases(prev => prev.filter(item => item.id !== id));
  };

  const addPoet = async (p: any) => {
    await wrapSupabase(() => supabase.from('poets').insert([p]));
    setPoets(prev => [...prev, p]);
  };
  const updatePoet = async (p: any) => {
    await wrapSupabase(() => supabase.from('poets').update(p).eq('id', p.id));
    setPoets(prev => prev.map(item => item.id === p.id ? p : item));
  };
  const deletePoet = async (id: number) => {
    await wrapSupabase(() => supabase.from('poets').delete().eq('id', id));
    setPoets(prev => prev.filter(item => item.id !== id));
  };

  const addServiceLink = async (s: ServiceLink) => {
    await wrapSupabase(() => supabase.from('service_links').insert([s]));
    setServiceLinks(prev => [...prev, s]);
    saveCache('service_links', [...serviceLinks, s]);
  };
  const updateServiceLink = async (s: ServiceLink) => {
    await wrapSupabase(() => supabase.from('service_links').update(s).eq('id', s.id));
    setServiceLinks(prev => prev.map(item => item.id === s.id ? s : item));
    saveCache('service_links', serviceLinks.map(item => item.id === s.id ? s : item));
  };
  const deleteServiceLink = async (id: string | number) => {
    await wrapSupabase(() => supabase.from('service_links').delete().eq('id', id));
    setServiceLinks(prev => prev.filter(item => item.id !== id));
    saveCache('service_links', serviceLinks.filter(item => item.id !== id));
  };

  const addServiceCategory = async (c: ServiceCategory) => {
    await wrapSupabase(() => supabase.from('service_categories').insert([c]));
    setServiceCategories(prev => [...prev, c]);
    saveCache('service_categories', [...serviceCategories, c]);
  };
  const updateServiceCategory = async (c: ServiceCategory) => {
    await wrapSupabase(() => supabase.from('service_categories').update(c).eq('id', c.id));
    setServiceCategories(prev => prev.map(cat => cat.id === c.id ? c : cat));
    saveCache('service_categories', serviceCategories.map(cat => cat.id === c.id ? c : cat));
  };
  const deleteServiceCategory = async (id: string) => {
    await wrapSupabase(() => supabase.from('service_categories').delete().eq('id', id));
    setServiceCategories(prev => prev.filter(cat => cat.id !== id));
    saveCache('service_categories', serviceCategories.filter(cat => cat.id !== id));
  };

  const updatePregnancyInfo = async (info: any[]) => {
     await wrapSupabase(() => supabase.from('pregnancy_info').upsert(info));
     setPregnancyInfo(info);
  };

  const updatePricingPlans = async (p: PricingPlan[]) => {
    setPricingPlans(p);
    await saveSiteContent('pricing_plans', p);
  };
  
  const updatePromoCodes = async (c: PromoCode[]) => {
    setPromoCodes(c);
    await saveSiteContent('promo_codes', c);
  };
  
  const addPaymentRequest = async (req: PaymentRequest) => {
    const updatedRequests = [req, ...paymentRequests];
    setPaymentRequests(updatedRequests);
    await saveSiteContent('payment_requests', updatedRequests);
  };

  const handlePaymentAction = async (id: string, action: string) => {
    const req = (paymentRequests || []).find(r => r.id === id);
    if (req && action === 'Approved') {
      const user = users.find(u => u.id === req.userId);
      if (user) await updateUser({ ...user, subscriptionTier: req.tier });
    }
    const updated = (paymentRequests || []).map(r => r.id === id ? { ...r, status: action as any } : r);
    setPaymentRequests(updated);
    await saveSiteContent('payment_requests', updated);
  };

  const addGrievance = async (g: any) => {
    await wrapSupabase(() => supabase.from('grievances').insert([g]));
    setGrievances(prev => [{ ...g, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() }, ...prev]);
  };
  const updateGrievanceStatus = async (id: number, s: string) => {
    await wrapSupabase(() => supabase.from('grievances').update({ status: s }).eq('id', id));
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: s } : g));
  };
  const deleteGrievance = async (id: number) => {
    await wrapSupabase(() => supabase.from('grievances').delete().eq('id', id));
    setGrievances(prev => prev.filter(g => g.id !== id));
  };

  const addLawyer = async (l: any) => {
    await wrapSupabase(() => supabase.from('lawyers').insert([l]));
    setLawyers(prev => [...prev, l]);
  };
  const deleteLawyer = async (id: number) => {
    await wrapSupabase(() => supabase.from('lawyers').delete().eq('id', id));
    setLawyers(prev => prev.filter(l => l.id !== id));
  };

  const addExchangeRate = async (e: any) => {
    await wrapSupabase(() => supabase.from('exchange_rates').insert([e]));
    setExchangeRates(prev => [...prev, e]);
  };
  const deleteExchangeRate = async (id: number) => {
    await wrapSupabase(() => supabase.from('exchange_rates').delete().eq('id', id));
    setExchangeRates(prev => prev.filter(ex => ex.id !== id));
  };

  const addVocationalCourse = async (v: any) => {
    await wrapSupabase(() => supabase.from('vocational_courses').insert([v]));
    setVocationalCourses(prev => [...prev, v]);
  };
  const deleteVocationalCourse = async (id: number) => {
    await wrapSupabase(() => supabase.from('vocational_courses').delete().eq('id', id));
    setVocationalCourses(prev => prev.filter(v => v.id !== id));
  };

  const addCraftProduct = async (c: any) => {
    await wrapSupabase(() => supabase.from('craft_products').insert([c]));
    setCraftProducts(prev => [...prev, c]);
  };
  const updateCraftProduct = async (c: any) => {
    await wrapSupabase(() => supabase.from('craft_products').update(c).eq('id', c.id));
    setCraftProducts(prev => prev.map(item => item.id === c.id ? c : item));
  };
  const deleteCraftProduct = async (id: number) => {
    await wrapSupabase(() => supabase.from('craft_products').delete().eq('id', id));
    setCraftProducts(prev => prev.filter(item => item.id !== id));
  };

  const updateAboutUs = async (data: any) => {
    setAboutUs(data);
    await saveSiteContent('about_us', data);
  };

  const updatePrivacyPolicy = async (data: any) => {
    setPrivacyPolicy(data);
    await saveSiteContent('privacy_policy', data);
  };

  const updateTermsConditions = async (data: any) => {
    setTermsConditions(data);
    await saveSiteContent('terms_conditions', data);
  };

  return (
    <DataContext.Provider value={{
      isLoading,
      users, fetchUsers, clearUsers, addUser, updateUser, updateUserStatus, deleteUser, resetPassword,
      jobs, addJob, updateJob, deleteJob,
      blogs, addBlog, updateBlog, deleteBlog,
      wholesaleAds, addWholesaleAd, updateWholesaleAd, deleteWholesaleAd,
      requests, blogRequests, wholesaleRequests, addRequest, handleRequestAction,
      marketPrices, updateMarketPrices,
      retailProducts, addRetailProduct, updateRetailProduct, deleteRetailProduct,
      donors, donorViewLogs, addDonorViewLog,
      enrolledCourses, enrollCourse,
      messages, addMessage, markMessageRead, deleteMessage,
      faqs, updateFaqs,
      districts, updateDistrict, deleteDistrict, seedDistricts,
      aboutUs, updateAboutUs,
      privacyPolicy, updatePrivacyPolicy,
      termsConditions, updateTermsConditions,
      diseases, addDisease, updateDisease, deleteDisease,
      poets, addPoet, updatePoet, deletePoet,
      serviceLinks, addServiceLink, updateServiceLink, deleteServiceLink,
      serviceCategories, addServiceCategory, updateServiceCategory, deleteServiceCategory,
      pregnancyInfo, updatePregnancyInfo,
      pricingPlans, promoCodes, paymentRequests, updatePricingPlans, updatePromoCodes, addPaymentRequest, handlePaymentAction,
      totalVisitors, todayVisitors, logVisit, totalCvGenerated, todayCvGenerated, logCvGeneration,
      grievances, addGrievance, updateGrievanceStatus, deleteGrievance,
      lawyers, addLawyer, deleteLawyer,
      exchangeRates, addExchangeRate, deleteExchangeRate,
      vocationalCourses, addVocationalCourse, deleteVocationalCourse,
      craftProducts, addCraftProduct, updateCraftProduct, deleteCraftProduct,
      refreshData: fetchInitialData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
