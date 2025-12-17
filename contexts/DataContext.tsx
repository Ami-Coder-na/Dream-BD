import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

// --- MOCK DATA FOR INITIALIZATION (Fallback) ---
const INITIAL_JOBS = [
  { id: 1, title: 'Software Engineer', company: 'Tech BD', location: 'Dhaka', salary: '40k-60k', type: 'Full Time', postedDate: '12/10/2023', category: 'Private', status: 'Active', views: 120, level: 'Entry' },
  { id: 2, title: 'Assistant Teacher', company: 'Govt. Primary School', location: 'Comilla', salary: '20k-30k', type: 'Full Time', postedDate: '10/10/2023', category: 'Government', status: 'Active', views: 450, level: 'Entry' },
];

const INITIAL_BLOGS = [
  { id: 1, title: 'Smart Agriculture in 2024', category: 'Agriculture', author: 'Dr. Rahim', date: 'Oct 20, 2023', postedDate: 'Oct 20, 2023', views: 230, status: 'Active', image: 'https://images.unsplash.com/photo-1625246333195-55197c3401e8', content: 'Modern farming techniques...', excerpt: 'Modern farming techniques...' },
];

const INITIAL_MARKET_PRICES = [
  { id: 1, nameEn: 'Rice (Miniket)', nameBn: 'চাল (মিনিকেট)', unit: 'kg', today: 75, yesterday: 72, trend: 'up' },
  { id: 2, nameEn: 'Potato', nameBn: 'আলু', unit: 'kg', today: 45, yesterday: 50, trend: 'down' },
  { id: 3, nameEn: 'Onion (Local)', nameBn: 'পেঁয়াজ (দেশি)', unit: 'kg', today: 90, yesterday: 90, trend: 'stable' },
];

const INITIAL_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@dreambd.com', role: 'Admin', status: 'Active', date: '01/01/2023', password: 'admin123' },
  { id: 'u2', name: 'Rahim Uddin', email: 'user@example.com', role: 'Farmer', status: 'Active', date: '15/05/2023', password: 'user123' },
];

// Helper to get local storage data safely
const getLocal = (key: string, defaultVal: any) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  }
  return defaultVal;
};

const setLocal = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const DataContext = createContext<any>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [jobs, setJobs] = useState<any[]>(() => getLocal('db_jobs', INITIAL_JOBS));
  const [blogs, setBlogs] = useState<any[]>(() => getLocal('db_blogs', INITIAL_BLOGS));
  const [requests, setRequests] = useState<any[]>(() => getLocal('db_requests', []));
  const [grievances, setGrievances] = useState<any[]>(() => getLocal('db_grievances', []));
  const [users, setUsers] = useState<any[]>(() => getLocal('db_users', INITIAL_USERS));
  const [marketPrices, setMarketPrices] = useState<any[]>(() => getLocal('db_prices', INITIAL_MARKET_PRICES));
  const [retailProducts, setRetailProducts] = useState<any[]>(() => getLocal('db_retail', []));
  const [wholesaleAds, setWholesaleAds] = useState<any[]>(() => getLocal('db_ads', []));
  const [lawyers, setLawyers] = useState<any[]>(() => getLocal('db_lawyers', []));
  const [exchangeRates, setExchangeRates] = useState<any[]>(() => getLocal('db_rates', []));
  const [vocationalCourses, setVocationalCourses] = useState<any[]>(() => getLocal('db_courses', []));
  const [donors, setDonors] = useState<any[]>(() => getLocal('db_donors', []));
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>(() => getLocal('db_enrolled', []));

  // Fetch Data from Supabase
  const fetchTable = async (table: string, setter: React.Dispatch<React.SetStateAction<any[]>>, orderBy = 'created_at', ascending = false) => {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
    if (!error && data) setter(data);
  };

  const fetchData = async () => {
    if (isSupabaseConfigured) {
      await Promise.all([
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
        // Realtime Subscription
        const channel = supabase.channel('db-changes')
            .on('postgres_changes', { event: '*', schema: 'public' }, () => {
                fetchData();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
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
            console.error(`Error adding to ${table}:`, error);
            // More descriptive error if table missing
            if (error.message.includes('relation') && error.message.includes('does not exist')) {
                alert(`System Error: The database table '${table}' does not exist. Please run the SQL Schema in Admin > Website Manage.`);
            } else if (error.message.includes('row-level security')) {
                alert(`Permission Error: Access denied to table '${table}'. Please run the SQL Schema to fix permissions.`);
            } else {
                // Improved generic error message
                alert(`Error saving data: ${error.message || JSON.stringify(error)}`);
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

  // --- Actions ---

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