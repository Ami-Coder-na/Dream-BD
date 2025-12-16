
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';

// --- INITIAL MOCK DATA (Fallback) ---
const INITIAL_JOBS: any[] = [];
const INITIAL_BLOGS: any[] = [
  {
    id: 1,
    title: "আধুনিক কৃষি প্রযুক্তির ব্যবহার",
    category: "Agriculture",
    content: "কৃষিতে ড্রোন এবং স্মার্ট সেন্সর ব্যবহারের ফলে উৎপাদন বাড়ছে...",
    author: "System Admin",
    postedDate: new Date().toLocaleDateString(),
    views: 120,
    status: 'Active'
  }
];

const BASE_MARKET_PRICES = [
  { id: 1, nameBn: 'তাজা আলু', nameEn: 'Fresh Potato', unit: 'kg', today: 45, yesterday: 40, trend: 'up' },
  { id: 2, nameBn: 'দেশি পেঁয়াজ', nameEn: 'Local Onion', unit: 'kg', today: 90, yesterday: 85, trend: 'up' },
  { id: 3, nameBn: 'রুই মাছ', nameEn: 'Rui Fish', unit: 'kg', today: 350, yesterday: 360, trend: 'down' },
  { id: 4, nameBn: 'মসুর ডাল', nameEn: 'Lentils', unit: 'kg', today: 130, yesterday: 130, trend: 'stable' },
  { id: 5, nameBn: 'সবুজ আপেল', nameEn: 'Green Apple', unit: 'kg', today: 220, yesterday: 210, trend: 'up' },
  { id: 6, nameBn: 'সয়াবিন তেল', nameEn: 'Soybean Oil', unit: 'L', today: 170, yesterday: 175, trend: 'down' },
  { id: 7, nameBn: 'বেগুন', nameEn: 'Eggplant', unit: 'kg', today: 60, yesterday: 55, trend: 'up' },
  { id: 8, nameBn: 'ব্রয়লার মুরগি', nameEn: 'Broiler Chicken', unit: 'kg', today: 190, yesterday: 190, trend: 'stable' },
];

const INITIAL_RETAIL_PRODUCTS: any[] = [];
const INITIAL_WHOLESALE_ADS: any[] = [];
const INITIAL_REQUESTS: any[] = [];
const INITIAL_GRIEVANCES: any[] = [];
const INITIAL_USERS: any[] = [];
const INITIAL_LAWYERS: any[] = [];
const INITIAL_EXCHANGE_RATES: any[] = [];
const INITIAL_VOCATIONAL_COURSES: any[] = [];
const INITIAL_DONORS: any[] = [];
const INITIAL_ENROLLED_COURSES: any[] = [];

// --- CONTEXT SETUP ---

interface DataContextType {
  jobs: any[];
  blogs: any[];
  requests: any[];
  grievances: any[];
  users: any[];
  marketPrices: any[];
  retailProducts: any[];
  wholesaleAds: any[];
  lawyers: any[];
  exchangeRates: any[];
  vocationalCourses: any[];
  donors: any[];
  enrolledCourses: any[];

  addJob: (job: any) => void;
  deleteJob: (id: number) => void;
  updateJob: (job: any) => void;
  addBlog: (blog: any) => void;
  deleteBlog: (id: number) => void;
  updateBlog: (blog: any) => void;
  addRequest: (request: any) => void;
  handleRequestAction: (item: any, action: 'approve' | 'reject') => void;
  addGrievance: (report: any) => void;
  updateGrievanceStatus: (id: number, status: string) => void;
  deleteGrievance: (id: number) => void;
  addUser: (user: any) => void;
  updateUserStatus: (id: string, status: 'Active' | 'Suspended') => void;
  deleteUser: (id: string) => void;
  resetPassword: (email: string, newPass: string) => void;
  updateMarketPrices: (prices: any[]) => void;
  addRetailProduct: (product: any) => void;
  deleteRetailProduct: (id: number) => void;
  updateRetailProduct: (product: any) => void;
  addWholesaleAd: (ad: any) => void;
  updateWholesaleAd: (ad: any) => void;
  deleteWholesaleAd: (id: number) => void;
  addLawyer: (lawyer: any) => void;
  deleteLawyer: (id: number) => void;
  updateExchangeRates: (rates: any[]) => void;
  addVocationalCourse: (course: any) => void;
  deleteVocationalCourse: (id: number) => void;
  addDonor: (donor: any) => void;
  enrollCourse: (enrollment: any) => void;
  
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<any[]>(INITIAL_JOBS);
  const [blogs, setBlogs] = useState<any[]>(INITIAL_BLOGS);
  const [requests, setRequests] = useState<any[]>(INITIAL_REQUESTS);
  const [grievances, setGrievances] = useState<any[]>(INITIAL_GRIEVANCES);
  const [users, setUsers] = useState<any[]>(INITIAL_USERS);
  const [marketPrices, setMarketPrices] = useState<any[]>(BASE_MARKET_PRICES);
  const [retailProducts, setRetailProducts] = useState<any[]>(INITIAL_RETAIL_PRODUCTS);
  const [wholesaleAds, setWholesaleAds] = useState<any[]>(INITIAL_WHOLESALE_ADS);
  const [lawyers, setLawyers] = useState<any[]>(INITIAL_LAWYERS);
  const [exchangeRates, setExchangeRates] = useState<any[]>(INITIAL_EXCHANGE_RATES);
  const [vocationalCourses, setVocationalCourses] = useState<any[]>(INITIAL_VOCATIONAL_COURSES);
  const [donors, setDonors] = useState<any[]>(INITIAL_DONORS);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>(INITIAL_ENROLLED_COURSES);

  // --- SUPABASE DATA FETCHING ---
  const fetchData = async () => {
    try {
      const { data: dbJobs } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (dbJobs) setJobs(dbJobs);

      const { data: dbBlogs } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (dbBlogs) setBlogs(dbBlogs);

      const { data: dbPrices } = await supabase.from('market_prices').select('*').order('id', { ascending: true });
      if (dbPrices && dbPrices.length > 0) setMarketPrices(dbPrices);

      const { data: dbUsers } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (dbUsers) setUsers(dbUsers);

      const { data: dbRequests } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
      if (dbRequests) setRequests(dbRequests);

      const { data: dbGrievances } = await supabase.from('grievances').select('*').order('created_at', { ascending: false });
      if (dbGrievances) setGrievances(dbGrievances);

      const { data: dbAds } = await supabase.from('wholesale_ads').select('*').order('created_at', { ascending: false });
      if (dbAds) setWholesaleAds(dbAds);

      const { data: dbLawyers } = await supabase.from('lawyers').select('*').order('created_at', { ascending: false });
      if (dbLawyers) setLawyers(dbLawyers);

      const { data: dbDonors } = await supabase.from('donors').select('*').order('created_at', { ascending: false });
      if (dbDonors) setDonors(dbDonors);

    } catch (error) {
      console.error("Supabase Fetch Error:", error);
    }
  };

  // RSS Feed Fetcher (Client Side Only)
  const fetchLiveNews = async () => {
    try {
      const RSS_URL = 'https://www.tbsnews.net/rss/economy.xml';
      const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.status === 'ok' && data.items) {
        const fetchedBlogs = data.items.slice(0, 6).map((item: any, index: number) => ({
          id: `news_${index}`,
          title: item.title,
          category: 'Economy & Agri',
          content: item.description, 
          excerpt: item.description.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...',
          author: item.author || 'TBS News',
          postedDate: new Date(item.pubDate).toLocaleDateString(),
          date: new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: 100,
          readTime: '3 min read',
          image: item.thumbnail || item.enclosure?.link || 'https://images.unsplash.com/photo-1589923188900-85dae523342b',
          status: 'Active',
          isExternal: true,
          link: item.link
        }));
        
        setBlogs(prev => {
           // Keep DB blogs, remove old news, add new news
           const dbBlogsOnly = prev.filter((b: any) => !b.id.toString().startsWith('news_'));
           return [...dbBlogsOnly, ...fetchedBlogs];
        });
      }
    } catch (error) {
      console.error("Failed to fetch live news:", error);
    }
  };

  useEffect(() => {
    // 1. Initial Fetch
    fetchData();
    fetchLiveNews();

    // 2. Real-time Subscription
    // This listens to any change in the public schema and re-fetches data
    const subscription = supabase
      .channel('public:db_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Realtime change detected:', payload);
          fetchData(); // Re-fetch to sync all clients
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const refreshData = () => {
    fetchData();
    fetchLiveNews();
  };

  // --- ACTIONS (PERSIST TO SUPABASE) ---

  const addJob = async (job: any) => {
    const newJob = { ...job, postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
    const { error } = await supabase.from('jobs').insert([newJob]);
    if (error) console.error("Error adding job:", error);
    // State updates automatically via Realtime subscription
  };

  const updateJob = async (updatedJob: any) => {
    const { error } = await supabase.from('jobs').update(updatedJob).eq('id', updatedJob.id);
    if (error) console.error("Error updating job:", error);
  };

  const deleteJob = async (id: number) => {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) console.error("Error deleting job:", error);
  };

  const addBlog = async (blog: any) => {
    const newBlog = { ...blog, postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
    const { error } = await supabase.from('blogs').insert([newBlog]);
    if (error) console.error("Error adding blog:", error);
  };

  const updateBlog = async (updatedBlog: any) => {
    const { error } = await supabase.from('blogs').update(updatedBlog).eq('id', updatedBlog.id);
    if (error) console.error("Error updating blog:", error);
  };

  const deleteBlog = async (id: number) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) console.error("Error deleting blog:", error);
  };

  const addRequest = async (request: any) => {
    const newReq = { ...request, status: 'Pending', postedDate: new Date().toLocaleDateString() };
    const { error } = await supabase.from('requests').insert([newReq]);
    if (error) console.error("Error adding request:", error);
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject') => {
    // 1. Delete from requests
    await supabase.from('requests').delete().eq('id', item.id);

    // 2. If approved, add to respective table
    if (action === 'approve') {
      const { contentType, id, created_at, ...rest } = item; // Remove request-specific fields
      if (contentType === 'job') await addJob(rest);
      else await addBlog(rest);
    }
  };

  const addGrievance = async (report: any) => {
    const newReport = { ...report, status: 'Pending', date: new Date().toLocaleDateString() };
    const { error } = await supabase.from('grievances').insert([newReport]);
    if (error) console.error("Error adding grievance:", error);
  };

  const updateGrievanceStatus = async (id: number, status: string) => {
    const { error } = await supabase.from('grievances').update({ status }).eq('id', id);
    if (error) console.error("Error updating grievance:", error);
  };

  const deleteGrievance = async (id: number) => {
    const { error } = await supabase.from('grievances').delete().eq('id', id);
    if (error) console.error("Error deleting grievance:", error);
  };

  const addUser = async (user: any) => {
    // Check local state first to avoid DB call if possible (optional)
    if (users.some((u: any) => u.email === user.email)) { 
        alert('Email already registered!'); 
        return; 
    }
    
    const newUser = { ...user, status: 'Active', date: new Date().toLocaleDateString() };
    const { error } = await supabase.from('users').insert([newUser]);
    
    if (error) console.error("Add user error:", error);
  };

  const updateUserStatus = async (id: string, status: 'Active' | 'Suspended') => {
    const { error } = await supabase.from('users').update({ status }).eq('id', id);
    if (error) console.error("Error updating user:", error);
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error("Error deleting user:", error);
  };

  const resetPassword = async (email: string, newPass: string) => {
    const { error } = await supabase.from('users').update({ password: newPass }).eq('email', email);
    if (error) console.error("Error resetting password:", error);
  };

  const updateMarketPrices = async (newPrices: any[]) => {
    // Optimistic update for UI smoothness
    setMarketPrices(newPrices);
    const { error } = await supabase.from('market_prices').upsert(newPrices);
    if(error) console.error("Market price update failed", error);
  };
  
  const addRetailProduct = (product: any) => setRetailProducts(prev => [...prev, { ...product, id: Date.now() }]);
  const updateRetailProduct = (product: any) => setRetailProducts(prev => prev.map((p: any) => p.id === product.id ? product : p));
  const deleteRetailProduct = (id: number) => setRetailProducts(prev => prev.filter((p: any) => p.id !== id));

  const addWholesaleAd = async (ad: any) => {
    const newAd = { ...ad, status: 'Pending', date: new Date().toLocaleDateString() };
    const { error } = await supabase.from('wholesale_ads').insert([newAd]);
    if (error) console.error("Error adding ad:", error);
  };

  const updateWholesaleAd = async (updatedAd: any) => {
    const { error } = await supabase.from('wholesale_ads').update(updatedAd).eq('id', updatedAd.id);
    if (error) console.error("Error updating ad:", error);
  };

  const deleteWholesaleAd = async (id: number) => {
    const { error } = await supabase.from('wholesale_ads').delete().eq('id', id);
    if (error) console.error("Error deleting ad:", error);
  };

  const addLawyer = async (lawyer: any) => {
      const newLawyer = { ...lawyer, status: 'Active' };
      const { error } = await supabase.from('lawyers').insert([newLawyer]);
      if (error) console.error("Error adding lawyer:", error);
  };
  const deleteLawyer = async (id: number) => {
      const { error } = await supabase.from('lawyers').delete().eq('id', id);
      if (error) console.error("Error deleting lawyer:", error);
  };
  
  const updateExchangeRates = (newRates: any[]) => setExchangeRates(newRates);
  
  const addVocationalCourse = (course: any) => setVocationalCourses(prev => [...prev, { ...course, id: Date.now(), status: 'Active' }]);
  const deleteVocationalCourse = (id: number) => setVocationalCourses(prev => prev.filter((c: any) => c.id !== id));

  const addDonor = async (donor: any) => {
      const { error } = await supabase.from('donors').insert([donor]);
      if (error) console.error("Error adding donor:", error);
  };
  
  const enrollCourse = (enrollment: any) => setEnrolledCourses(prev => [enrollment, ...prev]);

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, grievances, users, marketPrices, retailProducts, wholesaleAds,
      lawyers, exchangeRates, vocationalCourses, donors, enrolledCourses,
      addJob, deleteJob, updateJob,
      addBlog, deleteBlog, updateBlog,
      addRequest, handleRequestAction,
      addGrievance, updateGrievanceStatus, deleteGrievance,
      addUser, updateUserStatus, deleteUser, resetPassword,
      updateMarketPrices,
      addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addWholesaleAd, updateWholesaleAd, deleteWholesaleAd,
      addLawyer, deleteLawyer, updateExchangeRates, addVocationalCourse, deleteVocationalCourse,
      addDonor, enrollCourse,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
