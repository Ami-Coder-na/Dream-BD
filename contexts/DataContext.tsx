
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
  jobs: any[]; blogs: any[]; requests: any[]; grievances: any[]; users: any[];
  marketPrices: any[]; retailProducts: any[]; wholesaleAds: any[]; lawyers: any[];
  exchangeRates: any[]; vocationalCourses: any[]; donors: any[]; enrolledCourses: any[];

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

  // --- SUPABASE DATA FETCHING ---
  const fetchTable = async (table: string, setter: React.Dispatch<React.SetStateAction<any[]>>, orderBy = 'created_at', ascending = false) => {
    try {
      const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
      if (error) throw error;
      if (data) setter(data);
    } catch (e) {
      // Fail silently in UI but log
      console.warn(`Fetch error for ${table}. Using existing state.`);
    }
  };

  const fetchData = async () => {
    if (!isSupabaseConfigured) return;
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

  // Real-time Subscription Setup
  useEffect(() => {
    fetchData();

    if (isSupabaseConfigured) {
      const channels = supabase.channel('custom-all-channel')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
          console.log('Change received!', payload);
          fetchData(); // Refetch all data on any change
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channels);
      };
    } else {
      // Local Storage Listener
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'db_jobs') setJobs(getLocal('db_jobs', INITIAL_JOBS));
        // ... (other keys can be added if needed for multi-tab sync in local mode)
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const refreshData = () => fetchData();

  // --- GENERIC OPTIMISTIC ADD HELPER ---
  const optimisticAdd = async (table: string, newItem: any, setter: React.Dispatch<React.SetStateAction<any[]>>, currentList: any[]) => {
    // 1. Optimistic Update (Immediate UI Change)
    const tempItem = { ...newItem, id: Date.now() }; // Temporary ID
    setter(prev => [tempItem, ...prev]);

    if (isSupabaseConfigured) {
        // 2. DB Insert
        const { id, ...dbData } = tempItem; // Remove temp ID, let DB generate
        const { error } = await supabase.from(table).insert([dbData]);
        
        if (error) {
            console.error(`Error adding to ${table}:`, error.message);
            // More descriptive error if table missing
            if (error.message.includes('relation') && error.message.includes('does not exist')) {
                alert(`System Error: The database table '${table}' does not exist. Please run the SQL Schema in Admin > Website Manage.`);
            } else if (error.message.includes('row-level security')) {
                alert(`Permission Error: Access denied to table '${table}'. Please run the SQL Schema to fix permissions.`);
            } else {
                alert(`Error saving data: ${error.message}`);
            }
            // Revert on error
            setter(currentList); 
        } else {
            // 3. Fetch fresh data (to get real ID)
            await fetchTable(table, setter);
        }
    } else {
        // Local Storage Mode
        setLocal(`db_${table}`, [tempItem, ...currentList]);
    }
  };

  // --- ACTIONS ---

  const addJob = async (job: any) => {
    const newJob = { ...job, postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
    await optimisticAdd('jobs', newJob, setJobs, jobs);
  };

  const updateJob = async (updatedJob: any) => {
    if (isSupabaseConfigured) {
        await supabase.from('jobs').update(updatedJob).eq('id', updatedJob.id);
        await fetchTable('jobs', setJobs);
    } else {
        const updated = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
        setJobs(updated);
        setLocal('db_jobs', updated);
    }
  };

  const deleteJob = async (id: number) => {
    // Optimistic Delete
    const prev = [...jobs];
    setJobs(jobs.filter(j => j.id !== id));

    if (isSupabaseConfigured) {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if(error) setJobs(prev); // Revert
    } else {
        setLocal('db_jobs', jobs.filter(j => j.id !== id));
    }
  };

  const addBlog = async (blog: any) => {
    const newBlog = { ...blog, postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
    await optimisticAdd('blogs', newBlog, setBlogs, blogs);
  };

  const updateBlog = async (updatedBlog: any) => {
    if (isSupabaseConfigured) {
        await supabase.from('blogs').update(updatedBlog).eq('id', updatedBlog.id);
        await fetchTable('blogs', setBlogs);
    } else {
        const updated = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
        setBlogs(updated);
        setLocal('db_blogs', updated);
    }
  };

  const deleteBlog = async (id: number) => {
    const prev = [...blogs];
    setBlogs(blogs.filter(b => b.id !== id));
    if (isSupabaseConfigured) {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if(error) setBlogs(prev);
    } else {
        setLocal('db_blogs', blogs.filter(b => b.id !== id));
    }
  };

  const addRequest = async (request: any) => {
    const newReq = { ...request, status: 'Pending', postedDate: new Date().toLocaleDateString() };
    await optimisticAdd('requests', newReq, setRequests, requests);
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject') => {
    // Remove from request list first
    const prevRequests = [...requests];
    setRequests(requests.filter(r => r.id !== item.id));

    if (isSupabaseConfigured) {
        await supabase.from('requests').delete().eq('id', item.id);
    } else {
        setLocal('db_requests', requests.filter(r => r.id !== item.id));
    }

    if (action === 'approve') {
      const { id, created_at, contentType, ...rest } = item;
      if (contentType === 'job') await addJob(rest);
      else await addBlog(rest);
    }
  };

  const addGrievance = async (report: any) => {
    const newReport = { ...report, status: 'Pending', date: new Date().toLocaleDateString() };
    await optimisticAdd('grievances', newReport, setGrievances, grievances);
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
    const prev = [...grievances];
    setGrievances(grievances.filter(g => g.id !== id));
    if (isSupabaseConfigured) {
        const { error } = await supabase.from('grievances').delete().eq('id', id);
        if(error) setGrievances(prev);
    } else {
        setLocal('db_grievances', grievances.filter(g => g.id !== id));
    }
  };

  const addUser = async (user: any) => {
    if (users.some((u: any) => u.email === user.email)) { alert('Email already registered!'); return; }
    const newUser = { ...user, status: 'Active', date: new Date().toLocaleDateString() };
    if(!newUser.id) newUser.id = `u${Date.now()}`;
    
    // For users table, we need careful handling as it's critical
    if (isSupabaseConfigured) {
        const { error } = await supabase.from('users').insert([newUser]);
        if(!error) await fetchTable('users', setUsers);
    } else {
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
    const prev = [...users];
    setUsers(users.filter(u => u.id !== id));
    if (isSupabaseConfigured) {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if(error) setUsers(prev);
    } else {
        setLocal('db_users', users.filter(u => u.id !== id));
    }
  };

  const resetPassword = async (email: string, newPass: string) => {
    if (isSupabaseConfigured) {
        await supabase.from('users').update({ password: newPass }).eq('email', email);
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
      await optimisticAdd('retail_products', product, setRetailProducts, retailProducts);
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
      const prev = [...retailProducts];
      setRetailProducts(retailProducts.filter(p => p.id !== id));
      if (isSupabaseConfigured) {
          const { error } = await supabase.from('retail_products').delete().eq('id', id);
          if(error) setRetailProducts(prev);
      } else {
          setLocal('db_retail', retailProducts.filter(p => p.id !== id));
      }
  };

  const addWholesaleAd = async (ad: any) => {
    const newAd = { ...ad, status: 'Pending', date: new Date().toLocaleDateString() };
    await optimisticAdd('wholesale_ads', newAd, setWholesaleAds, wholesaleAds);
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
    const prev = [...wholesaleAds];
    setWholesaleAds(wholesaleAds.filter(a => a.id !== id));
    if (isSupabaseConfigured) {
        const { error } = await supabase.from('wholesale_ads').delete().eq('id', id);
        if(error) setWholesaleAds(prev);
    } else {
        setLocal('db_ads', wholesaleAds.filter(a => a.id !== id));
    }
  };

  const addLawyer = async (lawyer: any) => {
      const newLawyer = { ...lawyer, status: 'Active' };
      await optimisticAdd('lawyers', newLawyer, setLawyers, lawyers);
  };
  const deleteLawyer = async (id: number) => {
      const prev = [...lawyers];
      setLawyers(lawyers.filter(l => l.id !== id));
      if (isSupabaseConfigured) {
          const { error } = await supabase.from('lawyers').delete().eq('id', id);
          if(error) setLawyers(prev);
      } else {
          setLocal('db_lawyers', lawyers.filter(l => l.id !== id));
      }
  };
  
  const addExchangeRate = async (rate: any) => {
      await optimisticAdd('exchange_rates', rate, setExchangeRates, exchangeRates);
  };
  
  const deleteExchangeRate = async (id: number) => {
      const prev = [...exchangeRates];
      setExchangeRates(exchangeRates.filter(r => r.id !== id));
      if (isSupabaseConfigured) {
          const { error } = await supabase.from('exchange_rates').delete().eq('id', id);
          if(error) setExchangeRates(prev);
      } else {
          setLocal('db_rates', exchangeRates.filter(r => r.id !== id));
      }
  };

  const addVocationalCourse = async (course: any) => {
      const newCourse = { ...course, status: 'Active' };
      await optimisticAdd('vocational_courses', newCourse, setVocationalCourses, vocationalCourses);
  };
  const deleteVocationalCourse = async (id: number) => {
      const prev = [...vocationalCourses];
      setVocationalCourses(vocationalCourses.filter(c => c.id !== id));
      if (isSupabaseConfigured) {
          const { error } = await supabase.from('vocational_courses').delete().eq('id', id);
          if(error) setVocationalCourses(prev);
      } else {
          setLocal('db_courses', vocationalCourses.filter(c => c.id !== id));
      }
  };

  const addDonor = async (donor: any) => {
      await optimisticAdd('donors', donor, setDonors, donors);
  };
  
  const enrollCourse = async (enrollment: any) => {
      await optimisticAdd('enrolled_courses', enrollment, setEnrolledCourses, enrolledCourses);
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
