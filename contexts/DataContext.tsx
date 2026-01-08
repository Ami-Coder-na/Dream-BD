
"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole, SubscriptionTier, PricingPlan, PromoCode, PaymentRequest, AppModule } from '../types';

interface DataContextType {
  users: User[];
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

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [wholesaleAds, setWholesaleAds] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [blogRequests, setBlogRequests] = useState<any[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [donorViewLogs, setDonorViewLogs] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [aboutUs, setAboutUs] = useState({ titleBn: 'সোনালী দেশ', titleEn: 'Shonali Desh', contentBn: '', contentEn: '', missionBn: '', missionEn: '', visionBn: '', visionEn: '' });
  const [privacyPolicy, setPrivacyPolicy] = useState({ contentBn: '', contentEn: '' });
  const [termsConditions, setTermsConditions] = useState({ contentBn: '', contentEn: '' });
  const [diseases, setDiseases] = useState<any[]>([]);
  const [poets, setPoets] = useState<any[]>([]);
  const [pregnancyInfo, setPregnancyInfo] = useState<any[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  
  // RESET stats to 0 for a clean state as requested
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [totalCvGenerated, setTotalCvGenerated] = useState(0);
  const [todayCvGenerated, setTodayCvGenerated] = useState(0);

  const [grievances, setGrievances] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [vocationalCourses, setVocationalCourses] = useState<any[]>([]);
  const [craftProducts, setCraftProducts] = useState<any[]>([]);

  const fetchInitialData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const [
        uRes, jRes, bRes, wRes, rRes, brRes, wrRes, mpRes, rpRes, dRes, msgRes, fRes, distRes, dsRes, pRes, cpRes, exRes, vcRes, lawRes, prRes
      ] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('blogs').select('*').order('created_at', { ascending: false }),
        supabase.from('wholesale_ads').select('*').order('created_at', { ascending: false }),
        supabase.from('requests').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('wholesale_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('market_prices').select('*').order('created_at', { ascending: false }),
        supabase.from('retail_products').select('*').order('created_at', { ascending: false }),
        supabase.from('donors').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('faqs').select('*').order('created_at', { ascending: false }),
        supabase.from('districts').select('*').order('nameen', { ascending: true }),
        supabase.from('diseases').select('*').order('created_at', { ascending: false }),
        supabase.from('poets').select('*').order('created_at', { ascending: false }),
        supabase.from('craft_products').select('*').order('created_at', { ascending: false }),
        supabase.from('exchange_rates').select('*').order('created_at', { ascending: false }),
        supabase.from('vocational_courses').select('*').order('created_at', { ascending: false }),
        supabase.from('lawyers').select('*').order('created_at', { ascending: false }),
        supabase.from('pregnancy_info').select('*').order('week', { ascending: true })
      ]);

      if (!uRes.error) setUsers(uRes.data || []);
      if (!jRes.error) setJobs(jRes.data || []);
      if (!bRes.error) setBlogs(bRes.data || []);
      if (!wRes.error) setWholesaleAds(wRes.data || []);
      if (!rRes.error) setRequests(rRes.data || []);
      if (!brRes.error) setBlogRequests(brRes.data || []);
      if (!wrRes.error) setWholesaleRequests(wrRes.data || []);
      if (!mpRes.error) setMarketPrices(mpRes.data || []);
      if (!rpRes.error) setRetailProducts(rpRes.data || []);
      if (!dRes.error) setDonors(dRes.data || []);
      if (!msgRes.error) setMessages(msgRes.data || []);
      if (!fRes.error) setFaqs(fRes.data || []);
      if (!distRes.error) setDistricts(distRes.data || []);
      if (!dsRes.error) setDiseases(dsRes.data || []);
      if (!pRes.error) setPoets(pRes.data || []);
      if (!cpRes.error) setCraftProducts(cpRes.data || []);
      if (!exRes.error) setExchangeRates(exRes.data || []);
      if (!vcRes.error) setVocationalCourses(vcRes.data || []);
      if (!lawRes.error) setLawyers(lawRes.data || []);
      if (!prRes.error) setPregnancyInfo(prRes.data || []);
      
      // Removed visitors count fetching to keep it clean (at 0) as requested.

    } catch (e) {
      console.error("Database fetch failed", e);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // --- ACTIONS ---

  const logVisit = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const sessionKey = 'last_logged_visit_date';
    const lastLoggedDate = localStorage.getItem(sessionKey);
    
    if (lastLoggedDate === today) return;

    if (isSupabaseConfigured) {
        try {
            // Visitors logging logic remains but we start from fresh local 0
            setTotalVisitors(prev => prev + 1);
            setTodayVisitors(1); // Fresh day starting at 1
            localStorage.setItem(sessionKey, today);
            
            // Sync to DB if needed, but UI will show clean increment from 0
            await supabase.from('app_config').upsert([
                { key: 'total_visitors', value: "1" },
                { key: 'today_visitors', value: "1" },
                { key: 'last_reset_date', value: today }
            ]);
        } catch (e) { console.error(e); }
    } else {
        setTotalVisitors(prev => prev + 1);
        setTodayVisitors(1);
    }
  }, []);

  const addUser = async (u: any) => {
    if (isSupabaseConfigured) await supabase.from('users').insert([u]);
    setUsers(prev => [...prev, u]);
  };

  const updateUser = async (u: User) => {
    if (isSupabaseConfigured) await supabase.from('users').update(u).eq('id', u.id);
    setUsers(prev => prev.map(item => item.id === u.id ? u : item));
  };

  const updateUserStatus = async (id: string, s: string) => {
    if (isSupabaseConfigured) await supabase.from('users').update({ status: s }).eq('id', id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: s } : u));
  };

  const deleteUser = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const resetPassword = async (email: string, pass: string) => {
    if (isSupabaseConfigured) await supabase.from('users').update({ password: pass }).eq('email', email);
    setUsers(prev => prev.map(u => u.email === email ? { ...u, password: pass } : u));
  };

  const addJob = async (j: any) => {
    const jobData = { ...j, status: 'Active', posteddate: j.posteddate || new Date().toLocaleDateString() };
    if (isSupabaseConfigured) await supabase.from('jobs').insert([jobData]);
    setJobs(prev => [{ ...jobData, id: jobData.id || Date.now() }, ...prev]);
  };

  const updateJob = async (j: any) => {
    if (isSupabaseConfigured) await supabase.from('jobs').update(j).eq('id', j.id);
    setJobs(prev => prev.map(item => item.id === j.id ? j : item));
  };

  const deleteJob = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('jobs').delete().eq('id', id);
    setJobs(prev => prev.filter(item => item.id !== id));
  };

  const addBlog = async (b: any) => {
    const blogData = { ...b, status: 'Active', posteddate: b.posteddate || new Date().toLocaleDateString() };
    if (isSupabaseConfigured) await supabase.from('blogs').insert([blogData]);
    setBlogs(prev => [{ ...blogData, id: blogData.id || Date.now() }, ...prev]);
  };

  const updateBlog = async (b: any) => {
    if (isSupabaseConfigured) await supabase.from('blogs').update(b).eq('id', b.id);
    setBlogs(prev => prev.map(item => item.id === b.id ? b : item));
  };

  const deleteBlog = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('blogs').delete().eq('id', id);
    setBlogs(prev => prev.filter(item => item.id !== id));
  };

  const addWholesaleAd = async (ad: any) => {
    const adData = { ...ad, status: 'Active', posteddate: ad.posteddate || new Date().toLocaleDateString() };
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').insert([adData]);
    setWholesaleAds(prev => [{ ...adData, id: adData.id || Date.now() }, ...prev]);
  };

  const updateWholesaleAd = async (ad: any) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(ad).eq('id', ad.id);
    setWholesaleAds(prev => prev.map(item => item.id === ad.id ? ad : item));
  };

  const deleteWholesaleAd = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id);
    setWholesaleAds(prev => prev.filter(item => item.id !== id));
  };

  const addRetailProduct = async (prod: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').insert([prod]);
    setRetailProducts(prev => [...prev, prod]);
  };

  const updateRetailProduct = async (prod: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').update(prod).eq('id', prod.id);
    setRetailProducts(prev => prev.map(item => item.id === prod.id ? prod : item));
  };

  const deleteRetailProduct = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id);
    setRetailProducts(prev => prev.filter(item => item.id !== id));
  };

  const addRequest = async (req: any) => {
    if (isSupabaseConfigured) {
        let tableName = 'requests';
        if (req.contenttype === 'blog') tableName = 'blog_requests';
        if (req.contenttype === 'wholesale') tableName = 'wholesale_requests';
        await supabase.from(tableName).insert([req]);
    }
    if (req.contenttype === 'job') setRequests(prev => [...prev, { ...req, id: Date.now() }]);
    else if (req.contenttype === 'blog') setBlogRequests(prev => [...prev, { ...req, id: Date.now() }]);
    else if (req.contenttype === 'wholesale') setWholesaleRequests(prev => [...prev, { ...req, id: Date.now() }]);
  };

  const handleRequestAction = async (req: any, action: string, type: string) => {
    if (isSupabaseConfigured) {
        let tableName = 'requests';
        if (type === 'blog') tableName = 'blog_requests';
        if (type === 'wholesale') tableName = 'wholesale_requests';
        await supabase.from(tableName).delete().eq('id', req.id);
    }
    
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

  const updateMarketPrices = async (p: any[]) => setMarketPrices(p);

  const addDonorViewLog = async (l: any) => {
    if (isSupabaseConfigured) await supabase.from('donor_view_logs').insert([l]);
    setDonorViewLogs(prev => [l, ...prev]);
  };

  const enrollCourse = async (c: any) => setEnrolledCourses(prev => [c, ...prev]);

  const addMessage = async (m: any) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').insert([m]);
    setMessages(prev => [{ ...m, id: Date.now(), status: 'Unread', created_at: new Date().toISOString() }, ...prev]);
  };

  const markMessageRead = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'Read' } : m));
  };

  const deleteMessage = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const updateFaqs = async (f: any[]) => setFaqs(f);

  const updateDistrict = async (d: any) => {
    if (isSupabaseConfigured) await supabase.from('districts').upsert([d]);
    setDistricts(prev => {
        const exists = prev.find(item => item.id === d.id);
        if (exists) return prev.map(item => item.id === d.id ? d : item);
        return [...prev, d];
    });
  };

  const deleteDistrict = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('districts').delete().eq('id', id);
    setDistricts(prev => prev.filter(d => d.id !== id));
  };

  const seedDistricts = async () => {};

  const updateAboutUs = async (d: any) => setAboutUs(d);
  const updatePrivacyPolicy = async (d: any) => setPrivacyPolicy(d);
  const updateTermsConditions = async (d: any) => setTermsConditions(d);

  const addDisease = async (d: any) => {
    if (isSupabaseConfigured) await supabase.from('diseases').insert([d]);
    setDiseases(prev => [...prev, d]);
  };
  const updateDisease = async (d: any) => {
    if (isSupabaseConfigured) await supabase.from('diseases').update(d).eq('id', d.id);
    setDiseases(prev => prev.map(item => item.id === d.id ? d : item));
  };
  const deleteDisease = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('diseases').delete().eq('id', id);
    setDiseases(prev => prev.filter(item => item.id !== id));
  };

  const addPoet = async (p: any) => {
    if (isSupabaseConfigured) await supabase.from('poets').insert([p]);
    setPoets(prev => [...prev, p]);
  };
  const updatePoet = async (p: any) => {
    if (isSupabaseConfigured) await supabase.from('poets').update(p).eq('id', p.id);
    setPoets(prev => prev.map(item => item.id === p.id ? p : item));
  };
  const deletePoet = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('poets').delete().eq('id', id);
    setPoets(prev => prev.filter(item => item.id !== id));
  };

  const updatePregnancyInfo = async (info: any[]) => {
     if (isSupabaseConfigured) await supabase.from('pregnancy_info').upsert(info);
     setPregnancyInfo(info);
  };

  const updatePricingPlans = async (p: PricingPlan[]) => setPricingPlans(p);
  const updatePromoCodes = async (c: PromoCode[]) => setPromoCodes(c);
  const addPaymentRequest = async (req: PaymentRequest) => setPaymentRequests(prev => [req, ...prev]);
  const handlePaymentAction = async (id: string, action: string) => {
    const req = paymentRequests.find(r => r.id === id);
    if (req && action === 'Approved') {
      const user = users.find(u => u.id === req.userId);
      if (user) await updateUser({ ...user, subscriptionTier: req.tier });
    }
    setPaymentRequests(prev => prev.map(r => r.id === id ? { ...r, status: action as any } : r));
  };

  // Reset CV statistics local counts
  const logCvGeneration = () => { 
    setTotalCvGenerated(prev => prev + 1); 
    setTodayCvGenerated(prev => prev + 1); 
  };

  const addGrievance = async (g: any) => {
    if (isSupabaseConfigured) await supabase.from('grievances').insert([g]);
    setGrievances(prev => [{ ...g, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() }, ...prev]);
  };
  const updateGrievanceStatus = async (id: number, s: string) => {
    if (isSupabaseConfigured) await supabase.from('grievances').update({ status: s }).eq('id', id);
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: s } : g));
  };
  const deleteGrievance = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('grievances').delete().eq('id', id);
    setGrievances(prev => prev.filter(g => g.id !== id));
  };

  const addLawyer = async (l: any) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').insert([l]);
    setLawyers(prev => [...prev, l]);
  };
  const deleteLawyer = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id);
    setLawyers(prev => prev.filter(l => l.id !== id));
  };

  const addExchangeRate = async (e: any) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').insert([e]);
    setExchangeRates(prev => [...prev, e]);
  };
  const deleteExchangeRate = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id);
    setExchangeRates(prev => prev.filter(ex => ex.id !== id));
  };

  const addVocationalCourse = async (v: any) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').insert([v]);
    setVocationalCourses(prev => [...prev, v]);
  };
  const deleteVocationalCourse = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id);
    setVocationalCourses(prev => prev.filter(v => v.id !== id));
  };

  const addCraftProduct = async (c: any) => {
    if (isSupabaseConfigured) await supabase.from('craft_products').insert([c]);
    setCraftProducts(prev => [...prev, c]);
  };
  const updateCraftProduct = async (c: any) => {
    if (isSupabaseConfigured) await supabase.from('craft_products').update(c).eq('id', c.id);
    setCraftProducts(prev => prev.map(item => item.id === c.id ? c : item));
  };
  const deleteCraftProduct = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('craft_products').delete().eq('id', id);
    setCraftProducts(prev => prev.filter(item => item.id !== id));
  };

  return (
    <DataContext.Provider value={{
      users, addUser, updateUser, updateUserStatus, deleteUser, resetPassword,
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
