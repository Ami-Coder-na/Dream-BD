
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

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

// --- HELPER FOR LOCAL STORAGE ---
const getLocal = (key: string, fallback: any) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  }
  return fallback;
};

const setLocal = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  }
};

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

  addJob: (job: any) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
  updateJob: (job: any) => Promise<void>;
  addBlog: (blog: any) => Promise<void>;
  deleteBlog: (id: number) => Promise<void>;
  updateBlog: (blog: any) => Promise<void>;
  addRequest: (request: any) => Promise<void>;
  handleRequestAction: (item: any, action: 'approve' | 'reject') => Promise<void>;
  addGrievance: (report: any) => Promise<void>;
  updateGrievanceStatus: (id: number, status: string) => Promise<void>;
  deleteGrievance: (id: number) => Promise<void>;
  addUser: (user: any) => Promise<void>;
  updateUserStatus: (id: string, status: 'Active' | 'Suspended') => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetPassword: (email: string, newPass: string) => Promise<void>;
  updateMarketPrices: (prices: any[]) => Promise<void>;
  addRetailProduct: (product: any) => Promise<void>;
  deleteRetailProduct: (id: number) => Promise<void>;
  updateRetailProduct: (product: any) => Promise<void>;
  addWholesaleAd: (ad: any) => Promise<void>;
  updateWholesaleAd: (ad: any) => Promise<void>;
  deleteWholesaleAd: (id: number) => Promise<void>;
  addLawyer: (lawyer: any) => Promise<void>;
  deleteLawyer: (id: number) => Promise<void>;
  addExchangeRate: (rate: any) => Promise<void>;
  deleteExchangeRate: (id: number) => Promise<void>;
  addVocationalCourse: (course: any) => Promise<void>;
  deleteVocationalCourse: (id: number) => Promise<void>;
  addDonor: (donor: any) => Promise<void>;
  enrollCourse: (enrollment: any) => Promise<void>;
  
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state
  const [jobs, setJobs] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_JOBS : getLocal('db_jobs', INITIAL_JOBS));
  const [blogs, setBlogs] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_BLOGS : getLocal('db_blogs', INITIAL_BLOGS));
  const [requests, setRequests] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_REQUESTS : getLocal('db_requests', INITIAL_REQUESTS));
  const [grievances, setGrievances] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_GRIEVANCES : getLocal('db_grievances', INITIAL_GRIEVANCES));
  const [users, setUsers] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_USERS : getLocal('db_users', INITIAL_USERS));
  const [marketPrices, setMarketPrices] = useState<any[]>(() => isSupabaseConfigured ? BASE_MARKET_PRICES : getLocal('db_prices', BASE_MARKET_PRICES));
  const [retailProducts, setRetailProducts] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_RETAIL_PRODUCTS : getLocal('db_retail', INITIAL_RETAIL_PRODUCTS));
  const [wholesaleAds, setWholesaleAds] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_WHOLESALE_ADS : getLocal('db_ads', INITIAL_WHOLESALE_ADS));
  const [lawyers, setLawyers] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_LAWYERS : getLocal('db_lawyers', INITIAL_LAWYERS));
  const [exchangeRates, setExchangeRates] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_EXCHANGE_RATES : getLocal('db_rates', INITIAL_EXCHANGE_RATES));
  const [vocationalCourses, setVocationalCourses] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_VOCATIONAL_COURSES : getLocal('db_courses', INITIAL_VOCATIONAL_COURSES));
  const [donors, setDonors] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_DONORS : getLocal('db_donors', INITIAL_DONORS));
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>(() => isSupabaseConfigured ? INITIAL_ENROLLED_COURSES : getLocal('db_enrolled', INITIAL_ENROLLED_COURSES));

  // --- SUPABASE DATA FETCHING HELPER ---
  const fetchTable = async (table: string, setter: React.Dispatch<React.SetStateAction<any[]>>, orderBy = 'created_at', ascending = false) => {
    try {
      const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
      if (error) {
        console.error(`Error fetching ${table}:`, error.message);
      } else if (data) {
        setter(data);
      }
    } catch (e) {
      console.error(`Exception fetching ${table}:`, e);
    }
  };

  const fetchData = async () => {
    if (!isSupabaseConfigured) return;
    
    // Fetch all tables
    await Promise.all([
      fetchTable('jobs', setJobs),
      fetchTable('blogs', setBlogs),
      fetchTable('market_prices', setMarketPrices, 'id', true),
      fetchTable('users', setUsers),
      fetchTable('requests', setRequests),
      fetchTable('grievances', setGrievances),
      fetchTable('wholesale_ads', setWholesaleAds),
      fetchTable('lawyers', setLawyers),
      fetchTable('donors', setDonors),
      fetchTable('retail_products', setRetailProducts),
      fetchTable('exchange_rates', setExchangeRates),
      fetchTable('vocational_courses', setVocationalCourses),
      fetchTable('enrolled_courses', setEnrolledCourses),
    ]);
  };

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
           // Keep DB blogs, append news
           const dbBlogsOnly = prev.filter((b: any) => !b.id.toString().startsWith('news_'));
           return [...dbBlogsOnly, ...fetchedBlogs];
        });
      }
    } catch (error) {
      // console.error("Failed to fetch live news");
    }
  };

  useEffect(() => {
    fetchData();
    fetchLiveNews();

    let subscription: any = null;
    
    if (isSupabaseConfigured) {
      subscription = supabase
        .channel('public:db_changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
        .subscribe();
    } else {
      const handleStorageChange = (e: StorageEvent) => {
        // ... (Local storage listener logic remains same)
        if (e.key === 'db_jobs') setJobs(getLocal('db_jobs', INITIAL_JOBS));
        if (e.key === 'db_blogs') setBlogs(getLocal('db_blogs', INITIAL_BLOGS));
        if (e.key === 'db_requests') setRequests(getLocal('db_requests', INITIAL_REQUESTS));
        if (e.key === 'db_users') setUsers(getLocal('db_users', INITIAL_USERS));
        if (e.key === 'db_prices') setMarketPrices(getLocal('db_prices', BASE_MARKET_PRICES));
        if (e.key === 'db_retail') setRetailProducts(getLocal('db_retail', INITIAL_RETAIL_PRODUCTS));
        if (e.key === 'db_ads') setWholesaleAds(getLocal('db_ads', INITIAL_WHOLESALE_ADS));
        if (e.key === 'db_lawyers') setLawyers(getLocal('db_lawyers', INITIAL_LAWYERS));
        if (e.key === 'db_rates') setExchangeRates(getLocal('db_rates', INITIAL_EXCHANGE_RATES));
        if (e.key === 'db_courses') setVocationalCourses(getLocal('db_courses', INITIAL_VOCATIONAL_COURSES));
        if (e.key === 'db_donors') setDonors(getLocal('db_donors', INITIAL_DONORS));
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const refreshData = () => {
    fetchData();
    fetchLiveNews();
  };

  // --- ACTIONS (UPDATED TO REFETCH) ---

  const addJob = async (job: any) => {
    const { id, ...jobData } = job;
    if (isSupabaseConfigured) {
        const newJob = { ...jobData, postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
        await supabase.from('jobs').insert([newJob]);
        await fetchTable('jobs', setJobs); // Force Update
    } else {
        const newJob = { ...jobData, id: Date.now(), postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
        const updated = [newJob, ...jobs];
        setJobs(updated);
        setLocal('db_jobs', updated);
    }
  };

  const updateJob = async (updatedJob: any) => {
    if (isSupabaseConfigured) {
        await supabase.from('jobs').update(updatedJob).eq('id', updatedJob.id);
        await fetchTable('jobs', setJobs); // Force Update
    } else {
        const updated = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
        setJobs(updated);
        setLocal('db_jobs', updated);
    }
  };

  const deleteJob = async (id: number) => {
    if (isSupabaseConfigured) {
        await supabase.from('jobs').delete().eq('id', id);
        await fetchTable('jobs', setJobs); // Force Update
    } else {
        const updated = jobs.filter(j => j.id !== id);
        setJobs(updated);
        setLocal('db_jobs', updated);
    }
  };

  const addBlog = async (blog: any) => {
    const { id, ...blogData } = blog;
    if (isSupabaseConfigured) {
        const newBlog = { ...blogData, postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
        await supabase.from('blogs').insert([newBlog]);
        await fetchTable('blogs', setBlogs); // Force Update
    } else {
        const newBlog = { ...blogData, id: Date.now(), postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
        const updated = [newBlog, ...blogs];
        setBlogs(updated);
        setLocal('db_blogs', updated);
    }
  };

  const updateBlog = async (updatedBlog: any) => {
    if (isSupabaseConfigured) {
        await supabase.from('blogs').update(updatedBlog).eq('id', updatedBlog.id);
        await fetchTable('blogs', setBlogs); // Force Update
    } else {
        const updated = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
        setBlogs(updated);
        setLocal('db_blogs', updated);
    }
  };

  const deleteBlog = async (id: number) => {
    if (isSupabaseConfigured) {
        await supabase.from('blogs').delete().eq('id', id);
        await fetchTable('blogs', setBlogs); // Force Update
    } else {
        const updated = blogs.filter(b => b.id !== id);
        setBlogs(updated);
        setLocal('db_blogs', updated);
    }
  };

  const addRequest = async (request: any) => {
    if (isSupabaseConfigured) {
        const newReq = { ...request, status: 'Pending', postedDate: new Date().toLocaleDateString() };
        await supabase.from('requests').insert([newReq]);
        await fetchTable('requests', setRequests);
    } else {
        const newReq = { ...request, id: Date.now(), status: 'Pending', postedDate: new Date().toLocaleDateString() };
        const updated = [newReq, ...requests];
        setRequests(updated);
        setLocal('db_requests', updated);
    }
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject') => {
    if (isSupabaseConfigured) {
        await supabase.from('requests').delete().eq('id', item.id);
        await fetchTable('requests', setRequests);
    } else {
        const updatedReqs = requests.filter(r => r.id !== item.id);
        setRequests(updatedReqs);
        setLocal('db_requests', updatedReqs);
    }

    if (action === 'approve') {
      const { id, created_at, contentType, ...rest } = item;
      if (contentType === 'job') await addJob(rest);
      else await addBlog(rest);
    }
  };

  const addGrievance = async (report: any) => {
    if (isSupabaseConfigured) {
        const newReport = { ...report, status: 'Pending', date: new Date().toLocaleDateString() };
        await supabase.from('grievances').insert([newReport]);
        await fetchTable('grievances', setGrievances);
    } else {
        const newReport = { ...report, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() };
        const updated = [newReport, ...grievances];
        setGrievances(updated);
        setLocal('db_grievances', updated);
    }
  };

  const updateGrievanceStatus = async (id: number, status: string) => {
    if (isSupabaseConfigured) {
        await supabase.from('grievances').update({ status }).eq('id', id);
        await fetchTable('grievances', setGrievances);
    } else {
        const updated = grievances.map(g => g.id === id ? { ...g, status } : g);
        setGrievances(updated);
        setLocal('db_grievances', updated);
    }
  };

  const deleteGrievance = async (id: number) => {
    if (isSupabaseConfigured) {
        await supabase.from('grievances').delete().eq('id', id);
        await fetchTable('grievances', setGrievances);
    } else {
        const updated = grievances.filter(g => g.id !== id);
        setGrievances(updated);
        setLocal('db_grievances', updated);
    }
  };

  const addUser = async (user: any) => {
    if (users.some((u: any) => u.email === user.email)) { alert('Email already registered!'); return; }
    
    if (isSupabaseConfigured) {
        const newUser = { ...user, status: 'Active', date: new Date().toLocaleDateString() };
        await supabase.from('users').insert([newUser]);
        await fetchTable('users', setUsers);
    } else {
        const newUser = { ...user, status: 'Active', date: new Date().toLocaleDateString() };
        if(!newUser.id) newUser.id = `u${Date.now()}`;
        const updated = [newUser, ...users];
        setUsers(updated);
        setLocal('db_users', updated);
    }
  };

  const updateUserStatus = async (id: string, status: 'Active' | 'Suspended') => {
    if (isSupabaseConfigured) {
        await supabase.from('users').update({ status }).eq('id', id);
        await fetchTable('users', setUsers);
    } else {
        const updated = users.map(u => u.id === id ? { ...u, status } : u);
        setUsers(updated);
        setLocal('db_users', updated);
    }
  };

  const deleteUser = async (id: string) => {
    if (isSupabaseConfigured) {
        await supabase.from('users').delete().eq('id', id);
        await fetchTable('users', setUsers);
    } else {
        const updated = users.filter(u => u.id !== id);
        setUsers(updated);
        setLocal('db_users', updated);
    }
  };

  const resetPassword = async (email: string, newPass: string) => {
    if (isSupabaseConfigured) {
        await supabase.from('users').update({ password: newPass }).eq('email', email);
        await fetchTable('users', setUsers);
    } else {
        const updated = users.map(u => u.email === email ? { ...u, password: newPass } : u);
        setUsers(updated);
        setLocal('db_users', updated);
    }
  };

  const updateMarketPrices = async (newPrices: any[]) => {
    setMarketPrices(newPrices);
    if (isSupabaseConfigured) {
        await supabase.from('market_prices').upsert(newPrices);
        await fetchTable('market_prices', setMarketPrices, 'id', true);
    } else {
        setLocal('db_prices', newPrices);
    }
  };
  
  const addRetailProduct = async (product: any) => {
      const { id, ...data } = product;
      if (isSupabaseConfigured) {
          await supabase.from('retail_products').insert([data]);
          await fetchTable('retail_products', setRetailProducts);
      } else {
          const updated = [...retailProducts, { ...product, id: Date.now() }];
          setRetailProducts(updated);
          setLocal('db_retail', updated);
      }
  };
  const updateRetailProduct = async (product: any) => {
      if (isSupabaseConfigured) {
          await supabase.from('retail_products').update(product).eq('id', product.id);
          await fetchTable('retail_products', setRetailProducts);
      } else {
          const updated = retailProducts.map(p => p.id === product.id ? product : p);
          setRetailProducts(updated);
          setLocal('db_retail', updated);
      }
  };
  const deleteRetailProduct = async (id: number) => {
      if (isSupabaseConfigured) {
          await supabase.from('retail_products').delete().eq('id', id);
          await fetchTable('retail_products', setRetailProducts);
      } else {
          const updated = retailProducts.filter(p => p.id !== id);
          setRetailProducts(updated);
          setLocal('db_retail', updated);
      }
  };

  const addWholesaleAd = async (ad: any) => {
    if (isSupabaseConfigured) {
        const newAd = { ...ad, status: 'Pending', date: new Date().toLocaleDateString() };
        await supabase.from('wholesale_ads').insert([newAd]);
        await fetchTable('wholesale_ads', setWholesaleAds);
    } else {
        const newAd = { ...ad, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() };
        const updated = [newAd, ...wholesaleAds];
        setWholesaleAds(updated);
        setLocal('db_ads', updated);
    }
  };

  const updateWholesaleAd = async (updatedAd: any) => {
    if (isSupabaseConfigured) {
        await supabase.from('wholesale_ads').update(updatedAd).eq('id', updatedAd.id);
        await fetchTable('wholesale_ads', setWholesaleAds);
    } else {
        const updated = wholesaleAds.map(a => a.id === updatedAd.id ? updatedAd : a);
        setWholesaleAds(updated);
        setLocal('db_ads', updated);
    }
  };

  const deleteWholesaleAd = async (id: number) => {
    if (isSupabaseConfigured) {
        await supabase.from('wholesale_ads').delete().eq('id', id);
        await fetchTable('wholesale_ads', setWholesaleAds);
    } else {
        const updated = wholesaleAds.filter(a => a.id !== id);
        setWholesaleAds(updated);
        setLocal('db_ads', updated);
    }
  };

  const addLawyer = async (lawyer: any) => {
      const { id, ...data } = lawyer;
      const newLawyer = { ...data, status: 'Active' };
      if (isSupabaseConfigured) {
          await supabase.from('lawyers').insert([newLawyer]);
          await fetchTable('lawyers', setLawyers);
      } else {
          const updated = [newLawyer, ...lawyers];
          setLawyers(updated);
          setLocal('db_lawyers', updated);
      }
  };
  const deleteLawyer = async (id: number) => {
      if (isSupabaseConfigured) {
          await supabase.from('lawyers').delete().eq('id', id);
          await fetchTable('lawyers', setLawyers);
      } else {
          const updated = lawyers.filter(l => l.id !== id);
          setLawyers(updated);
          setLocal('db_lawyers', updated);
      }
  };
  
  const addExchangeRate = async (rate: any) => {
      const { id, ...data } = rate;
      if (isSupabaseConfigured) {
          await supabase.from('exchange_rates').insert([data]);
          await fetchTable('exchange_rates', setExchangeRates);
      } else {
          const updated = [...exchangeRates, { ...rate, id: Date.now() }];
          setExchangeRates(updated);
          setLocal('db_rates', updated);
      }
  };
  
  const deleteExchangeRate = async (id: number) => {
      if (isSupabaseConfigured) {
          await supabase.from('exchange_rates').delete().eq('id', id);
          await fetchTable('exchange_rates', setExchangeRates);
      } else {
          const updated = exchangeRates.filter(r => r.id !== id);
          setExchangeRates(updated);
          setLocal('db_rates', updated);
      }
  };

  const addVocationalCourse = async (course: any) => {
      const { id, ...data } = course;
      if (isSupabaseConfigured) {
          await supabase.from('vocational_courses').insert([{...data, status: 'Active'}]);
          await fetchTable('vocational_courses', setVocationalCourses);
      } else {
          const updated = [...vocationalCourses, { ...course, id: Date.now(), status: 'Active' }];
          setVocationalCourses(updated);
          setLocal('db_courses', updated);
      }
  };
  const deleteVocationalCourse = async (id: number) => {
      if (isSupabaseConfigured) {
          await supabase.from('vocational_courses').delete().eq('id', id);
          await fetchTable('vocational_courses', setVocationalCourses);
      } else {
          const updated = vocationalCourses.filter((c: any) => c.id !== id);
          setVocationalCourses(updated);
          setLocal('db_courses', updated);
      }
  };

  const addDonor = async (donor: any) => {
      if (isSupabaseConfigured) {
          await supabase.from('donors').insert([donor]);
          await fetchTable('donors', setDonors);
      } else {
          const updated = [donor, ...donors];
          setDonors(updated);
          setLocal('db_donors', updated);
      }
  };
  
  const enrollCourse = async (enrollment: any) => {
      if (isSupabaseConfigured) {
          await supabase.from('enrolled_courses').insert([enrollment]);
          await fetchTable('enrolled_courses', setEnrolledCourses);
      } else {
          const updated = [enrollment, ...enrolledCourses];
          setEnrolledCourses(updated);
          setLocal('db_enrolled', updated);
      }
  };

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
      addLawyer, deleteLawyer, 
      addExchangeRate, deleteExchangeRate,
      addVocationalCourse, deleteVocationalCourse,
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
