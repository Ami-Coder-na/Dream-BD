import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole } from '../types';

// Mock Data (Fallback)
const MOCK_JOBS = [
  { id: 1, title: 'Assistant Teacher', company: 'Dhaka Govt High School', type: 'Full Time', location: 'Dhaka', salary: '25k-35k', deadline: '2023-12-31', category: 'Government', description: 'Teaching position for Science subjects.', postedBy: 'Admin', postedDate: '10/24/2023', status: 'Active', views: 120, level: 'Entry' },
  { id: 2, title: 'Sales Executive', company: 'Pran RFL', type: 'Full Time', location: 'Chittagong', salary: '15k-20k', deadline: '2023-11-20', category: 'Private', description: 'Field sales executive needed.', postedBy: 'Admin', postedDate: '10/25/2023', status: 'Active', views: 85, level: 'Entry' }
];

const MOCK_BLOGS = [
  { id: 1, title: 'Modern Rice Farming', category: 'Agriculture', author: 'Dr. Rahim', date: 'Oct 20, 2023', postedDate: '10/20/2023', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff', content: 'Using technology in rice farming increases yield...', readTime: '5 min read', status: 'Active', views: 200, excerpt: 'Using technology in rice farming increases yield...' },
  { id: 2, title: 'Winter Health Tips', category: 'Health', author: 'Dr. Samia', date: 'Oct 22, 2023', postedDate: '10/22/2023', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', content: 'Stay warm and drink plenty of water...', readTime: '3 min read', status: 'Active', views: 150, excerpt: 'Stay warm and drink plenty of water...' }
];

const MOCK_USERS = [
  { id: 'u1', name: 'Rahim Uddin', email: 'demo@dreambd.com', password: 'demo', role: 'Citizen', phone: '01700000000', location: 'Dhaka', status: 'Active', date: '10/01/2023', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'u2', name: 'Admin User', email: 'admin@dreambd.com', password: 'admin123', role: 'Admin', phone: '01800000000', location: 'HQ', status: 'Active', date: '01/01/2023', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' }
];

const MOCK_MARKET_PRICES = [
  { id: 1, nameEn: 'Rice (Miniket)', nameBn: 'চাল (মিনিকেট)', unit: 'kg', today: 70, yesterday: 68, trend: 'up' },
  { id: 2, nameEn: 'Potato', nameBn: 'আলু', unit: 'kg', today: 45, yesterday: 45, trend: 'stable' },
  { id: 3, nameEn: 'Onion (Local)', nameBn: 'পেঁয়াজ (দেশি)', unit: 'kg', today: 90, yesterday: 100, trend: 'down' }
];

const MOCK_RETAIL_PRODUCTS = [
  { id: 1, nameBn: 'তাজা আলু', nameEn: 'Fresh Potato', price: 45, unit: 'kg', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655', category: 'Vegetable', stock: 'Available' },
  { id: 2, nameBn: 'দেশি পেঁয়াজ', nameEn: 'Local Onion', price: 90, unit: 'kg', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb', category: 'Vegetable', stock: 'Available' }
];

const MOCK_WHOLESALE_ADS = [
  { id: 1, product: 'Dinajpur Lychee', quantity: '5000 pcs', price: '3.5', seller: 'Karim Fruit Store', sellerType: 'Store', location: 'Dinajpur', date: '2 hrs ago', status: 'Active' }
];

const MOCK_LAWYERS = [
  { id: 1, name: 'Adv. Rafiqul Islam', speciality: 'Land Property', phone: '01711223344', location: 'Dhaka Judge Court', status: 'Active' }
];

const MOCK_EXCHANGE_RATES = [
  { id: 1, currency: 'USD', rate: 110.50, trend: 'up' },
  { id: 2, currency: 'EUR', rate: 118.20, trend: 'down' },
  { id: 3, currency: 'SAR', rate: 29.45, trend: 'stable' }
];

const MOCK_VOCATIONAL_COURSES = [
  { id: 1, title: 'Mobile Servicing', titleBn: 'মোবাইল সার্ভিসিং', category: 'Technical', duration: '3 Months', fee: 5000, image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780', status: 'Active' }
];

const DataContext = createContext<any>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
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

  // Helpers
  const getLocal = (key: string, defaultData: any[]) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultData;
    } catch (e) {
        return defaultData;
    }
  };

  const setLocal = (key: string, data: any[]) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Local storage error:", e);
    }
  };

  const normalizeData = (data: any) => {
    if (!data || typeof data !== 'object') return data;
    const normalized: any = {};
    for (const key in data) {
      if (key === 'id' || key === 'created_at') continue; 
      // Handle undefined/null to prevent DB errors
      const val = data[key];
      normalized[key.toLowerCase()] = val === undefined ? null : val;
    }
    return normalized;
  };

  const fetchTable = async (table: string, setter: any, orderBy = 'created_at', ascending = false) => {
    if (!isSupabaseConfigured) return;
    try {
        const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
        if (!error && data) setter(data);
    } catch(e) {
        // Silent fail for fetch, use local data
    }
  };

  const fetchData = async () => {
    // Always load local data first for immediate rendering
    setJobs(getLocal('db_jobs', MOCK_JOBS));
    setBlogs(getLocal('db_blogs', MOCK_BLOGS));
    setRequests(getLocal('db_requests', []));
    setGrievances(getLocal('db_grievances', []));
    setUsers(getLocal('db_users', MOCK_USERS));
    setMarketPrices(getLocal('db_prices', MOCK_MARKET_PRICES));
    setRetailProducts(getLocal('db_retail', MOCK_RETAIL_PRODUCTS));
    setWholesaleAds(getLocal('db_ads', MOCK_WHOLESALE_ADS));
    setLawyers(getLocal('db_lawyers', MOCK_LAWYERS));
    setExchangeRates(getLocal('db_rates', MOCK_EXCHANGE_RATES));
    setVocationalCourses(getLocal('db_courses', MOCK_VOCATIONAL_COURSES));
    setDonors(getLocal('db_donors', []));
    setEnrolledCourses(getLocal('db_enrolled', []));

    if (isSupabaseConfigured) {
      // Then try to fetch fresh data from DB silently
      Promise.allSettled([
        fetchTable('jobs', setJobs),
        fetchTable('blogs', setBlogs),
        fetchTable('requests', setRequests),
        fetchTable('grievances', setGrievances),
        fetchTable('users', setUsers),
        fetchTable('market_prices', setMarketPrices),
        fetchTable('retail_products', setRetailProducts),
        fetchTable('wholesale_ads', setWholesaleAds),
        fetchTable('lawyers', setLawyers),
        fetchTable('exchange_rates', setExchangeRates),
        fetchTable('vocational_courses', setVocationalCourses),
        fetchTable('donors', setDonors),
        fetchTable('enrolled_courses', setEnrolledCourses),
      ]);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (isSupabaseConfigured) {
        const channels = supabase.channel('custom-all-channel')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
        .subscribe();

        return () => { supabase.removeChannel(channels); };
    }
  }, []);

  const refreshData = () => fetchData();

  // --- SAFE ADD HELPER ---
  const optimisticAdd = async (table: string, newItem: any, setter: React.Dispatch<React.SetStateAction<any[]>>, currentList: any[]) => {
    // 1. Always update UI immediately (Optimistic)
    const tempItem = { ...newItem, id: Date.now() }; 
    const newList = [tempItem, ...currentList];
    setter(newList);
    setLocal(`db_${table}`, newList); // Ensure local save happens immediately
    
    // 2. Try DB Insert
    if (isSupabaseConfigured) {
        try {
            const normalizedDbData = normalizeData(newItem);
            const { error } = await supabase.from(table).insert([normalizedDbData]);
            
            if (error) {
                // FAIL SILENTLY AND LOG
                console.warn(`Supabase Insert Failed for ${table}. Using local fallback.`, error);
                // We already saved to local above, so user sees success.
            } else {
                // Success: Fetch to sync ID from DB (swaps temp ID with real ID eventually)
                await fetchTable(table, setter);
            }
        } catch (err) {
             console.warn("Unexpected DB Error, using local fallback:", err);
        }
    }
  };

  // Actions
  const addJob = async (job: any) => {
    const newJob = { 
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        type: job.type || 'Full Time',
        category: job.category || 'Private',
        description: job.description || '',
        deadline: job.deadline || '',
        postedBy: job.postedBy || 'Admin',
        postedDate: new Date().toLocaleDateString(),
        status: 'Active',
        views: 0,
        level: job.level || 'Entry'
    };
    await optimisticAdd('jobs', newJob, setJobs, jobs);
  };

  const updateJob = async (updatedJob: any) => {
    const updatedList = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    setJobs(updatedList); // Optimistic UI update
    setLocal('db_jobs', updatedList);
    
    if (isSupabaseConfigured) {
        try {
            const normalizedData = normalizeData(updatedJob);
            await supabase.from('jobs').update(normalizedData).eq('id', updatedJob.id);
        } catch { /* Silent */ }
    }
  };

  const deleteJob = async (id: number) => {
    const filtered = jobs.filter(j => j.id !== id);
    setJobs(filtered); // Optimistic UI
    setLocal('db_jobs', filtered);
    
    if (isSupabaseConfigured) {
        await supabase.from('jobs').delete().eq('id', id);
    }
  };

  const addBlog = async (blog: any) => {
    const newBlog = { ...blog, postedDate: new Date().toLocaleDateString(), views: 0, status: 'Active' };
    await optimisticAdd('blogs', newBlog, setBlogs, blogs);
  };

  const updateBlog = async (updatedBlog: any) => {
    const updatedList = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
    setBlogs(updatedList);
    setLocal('db_blogs', updatedList);
    if (isSupabaseConfigured) {
        try {
            const normalizedData = normalizeData(updatedBlog);
            await supabase.from('blogs').update(normalizedData).eq('id', updatedBlog.id);
        } catch { /* Silent */ }
    }
  };

  const deleteBlog = async (id: number) => {
    const filtered = blogs.filter(b => b.id !== id);
    setBlogs(filtered);
    setLocal('db_blogs', filtered);
    if (isSupabaseConfigured) {
        await supabase.from('blogs').delete().eq('id', id);
    }
  };

  const addRequest = async (request: any) => {
    const newReq = { ...request, status: 'Pending', postedDate: new Date().toLocaleDateString() };
    await optimisticAdd('requests', newReq, setRequests, requests);
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject') => {
    const filtered = requests.filter(r => r.id !== item.id);
    setRequests(filtered);
    setLocal('db_requests', filtered);

    if (isSupabaseConfigured) {
        await supabase.from('requests').delete().eq('id', item.id);
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
    const updated = grievances.map(g => g.id === id ? { ...g, status } : g);
    setGrievances(updated);
    setLocal('db_grievances', updated);
    if (isSupabaseConfigured) {
        await supabase.from('grievances').update({ status }).eq('id', id);
    }
  };

  const deleteGrievance = async (id: number) => {
    const filtered = grievances.filter(g => g.id !== id);
    setGrievances(filtered);
    setLocal('db_grievances', filtered);
    if (isSupabaseConfigured) {
        await supabase.from('grievances').delete().eq('id', id);
    }
  };

  const addUser = async (user: any) => {
    if (users.some((u: any) => u.email === user.email)) { alert('Email already registered!'); return; }
    const newUser = { ...user, status: 'Active', date: new Date().toLocaleDateString() };
    if(!newUser.id) newUser.id = `u${Date.now()}`;
    
    // Always optimistic update for users
    const newList = [newUser, ...users];
    setUsers(newList);
    setLocal('db_users', newList); 

    if (isSupabaseConfigured) {
        const normalizedData = normalizeData(newUser);
        await supabase.from('users').insert([normalizedData]);
    }
  };

  const updateUserStatus = async (id: string, status: 'Active' | 'Suspended') => {
    const updated = users.map(u => u.id === id ? { ...u, status } : u);
    setUsers(updated);
    setLocal('db_users', updated);
    if (isSupabaseConfigured) {
        await supabase.from('users').update({ status }).eq('id', id);
    }
  };

  const deleteUser = async (id: string) => {
    const filtered = users.filter(u => u.id !== id);
    setUsers(filtered);
    setLocal('db_users', filtered);
    if (isSupabaseConfigured) {
        await supabase.from('users').delete().eq('id', id);
    }
  };

  const resetPassword = async (email: string, newPass: string) => {
    const updated = users.map(u => u.email === email ? { ...u, password: newPass } : u);
    setUsers(updated);
    setLocal('db_users', updated);
    if (isSupabaseConfigured) {
        await supabase.from('users').update({ password: newPass }).eq('email', email);
    }
  };

  const updateMarketPrices = async (newPrices: any[]) => {
    setMarketPrices(newPrices);
    setLocal('db_prices', newPrices);
    if (isSupabaseConfigured) {
        try {
            const normalizedPrices = newPrices.map(normalizeData);
            await supabase.from('market_prices').upsert(normalizedPrices);
        } catch { /* Silent */ }
    }
  };
  
  const addRetailProduct = async (product: any) => {
      await optimisticAdd('retail_products', product, setRetailProducts, retailProducts);
  };
  const updateRetailProduct = async (product: any) => {
      const updated = retailProducts.map(p => p.id === product.id ? product : p);
      setRetailProducts(updated);
      setLocal('db_retail', updated);
      if (isSupabaseConfigured) {
          const normalizedData = normalizeData(product);
          await supabase.from('retail_products').update(normalizedData).eq('id', product.id);
      }
  };
  const deleteRetailProduct = async (id: number) => {
      const filtered = retailProducts.filter(p => p.id !== id);
      setRetailProducts(filtered);
      setLocal('db_retail', filtered);
      if (isSupabaseConfigured) {
          await supabase.from('retail_products').delete().eq('id', id);
      }
  };

  const addWholesaleAd = async (ad: any) => {
    const newAd = { ...ad, status: 'Pending', date: new Date().toLocaleDateString() };
    await optimisticAdd('wholesale_ads', newAd, setWholesaleAds, wholesaleAds);
  };

  const updateWholesaleAd = async (updatedAd: any) => {
    const updated = wholesaleAds.map(a => a.id === updatedAd.id ? updatedAd : a);
    setWholesaleAds(updated);
    setLocal('db_ads', updated);
    if (isSupabaseConfigured) {
        const normalizedData = normalizeData(updatedAd);
        await supabase.from('wholesale_ads').update(normalizedData).eq('id', updatedAd.id);
    }
  };

  const deleteWholesaleAd = async (id: number) => {
    const filtered = wholesaleAds.filter(a => a.id !== id);
    setWholesaleAds(filtered);
    setLocal('db_ads', filtered);
    if (isSupabaseConfigured) {
        await supabase.from('wholesale_ads').delete().eq('id', id);
    }
  };

  const addLawyer = async (lawyer: any) => {
      const newLawyer = { ...lawyer, status: 'Active' };
      await optimisticAdd('lawyers', newLawyer, setLawyers, lawyers);
  };
  const deleteLawyer = async (id: number) => {
      const filtered = lawyers.filter(l => l.id !== id);
      setLawyers(filtered);
      setLocal('db_lawyers', filtered);
      if (isSupabaseConfigured) {
          await supabase.from('lawyers').delete().eq('id', id);
      }
  };
  
  const addExchangeRate = async (rate: any) => {
      await optimisticAdd('exchange_rates', rate, setExchangeRates, exchangeRates);
  };
  
  const deleteExchangeRate = async (id: number) => {
      const filtered = exchangeRates.filter(r => r.id !== id);
      setExchangeRates(filtered);
      setLocal('db_rates', filtered);
      if (isSupabaseConfigured) {
          await supabase.from('exchange_rates').delete().eq('id', id);
      }
  };

  const addVocationalCourse = async (course: any) => {
      const newCourse = { ...course, status: 'Active' };
      await optimisticAdd('vocational_courses', newCourse, setVocationalCourses, vocationalCourses);
  };
  const deleteVocationalCourse = async (id: number) => {
      const filtered = vocationalCourses.filter(c => c.id !== id);
      setVocationalCourses(filtered);
      setLocal('db_courses', filtered);
      if (isSupabaseConfigured) {
          await supabase.from('vocational_courses').delete().eq('id', id);
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
