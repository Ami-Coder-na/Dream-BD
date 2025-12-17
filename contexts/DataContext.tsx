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
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultData;
  };

  const setLocal = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const normalizeData = (data: any) => {
    if (!data || typeof data !== 'object') return data;
    const normalized: any = {};
    for (const key in data) {
      if (key === 'id' || key === 'created_at') continue; // Don't insert IDs or timestamps manually
      if (data[key] === undefined) continue; // Skip undefined
      normalized[key.toLowerCase()] = data[key];
    }
    return normalized;
  };

  const fetchTable = async (table: string, setter: any, orderBy = 'created_at', ascending = false) => {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
    if (error) {
        console.error(`Error fetching ${table}:`, error);
        return;
    }
    if (data) setter(data);
  };

  const fetchData = async () => {
    if (isSupabaseConfigured) {
      // Use Promise.allSettled to ensure one failure doesn't stop others
      await Promise.allSettled([
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
    } else {
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
    }
  };

  useEffect(() => {
    fetchData();
    
    if (isSupabaseConfigured) {
        const channels = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public' },
            () => {
                fetchData();
            }
        )
        .subscribe();

        return () => {
            supabase.removeChannel(channels);
        };
    }
  }, []);

  const refreshData = () => fetchData();

  // --- GENERIC OPTIMISTIC ADD HELPER ---
  const optimisticAdd = async (table: string, newItem: any, setter: React.Dispatch<React.SetStateAction<any[]>>, currentList: any[]) => {
    // 1. Optimistic Update (Immediate UI Change)
    const tempItem = { ...newItem, id: Date.now() }; // Temporary ID for UI
    setter(prev => [tempItem, ...prev]);

    if (isSupabaseConfigured) {
        // 2. DB Insert
        // Normalization: Keys to lowercase, remove 'id' and 'created_at'
        const normalizedDbData = normalizeData(newItem);

        console.log(`Attempting to insert into ${table}:`, normalizedDbData);

        const { data, error } = await supabase.from(table).insert([normalizedDbData]).select();
        
        if (error) {
            console.error(`Error adding to ${table}:`, error);
            
            // Detailed Error Message construction
            let errorMsg = `Database Error (${error.code}): ${error.message}`;
            if (error.details) errorMsg += `\nDetails: ${error.details}`;
            if (error.hint) errorMsg += `\nHint: ${error.hint}`;

            if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
               errorMsg = `Table '${table}' not found. Please go to Admin > Website Manage and click 'Copy SQL' then run it in Supabase SQL Editor.`;
            }

            alert(errorMsg);
            
            // Revert on error
            setter(currentList); 
        } else {
            console.log(`Successfully inserted into ${table}:`, data);
            // 3. Fetch fresh data (to get real ID)
            await fetchTable(table, setter);
        }
    } else {
        // Local Storage Mode
        setLocal(`db_${table}`, [tempItem, ...currentList]);
    }
  };

  // Actions
  const addJob = async (job: any) => {
    // Ensure all fields are strings or numbers, no undefined
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
    if (isSupabaseConfigured) {
        const normalizedData = normalizeData(updatedJob);
        const { error } = await supabase.from('jobs').update(normalizedData).eq('id', updatedJob.id);
        if (error) {
            alert(`Update Error: ${error.message}`);
        } else {
            await fetchTable('jobs', setJobs);
        }
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
        if(error) {
            alert(`Delete Error: ${error.message}`);
            setJobs(prev);
        }
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
        const normalizedData = normalizeData(updatedBlog);
        await supabase.from('blogs').update(normalizedData).eq('id', updatedBlog.id);
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
    const prevRequests = [...requests];
    setRequests(requests.filter(r => r.id !== item.id));

    if (isSupabaseConfigured) {
        await supabase.from('requests').delete().eq('id', item.id);
    } else {
        setLocal('db_requests', requests.filter(r => r.id !== item.id));
    }

    if (action === 'approve') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const normalizedData = normalizeData(newUser);
        const { error } = await supabase.from('users').insert([normalizedData]);
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
        // Since batch upsert might have issues with mixed casing, normalize individually
        const normalizedPrices = newPrices.map(normalizeData);
        await supabase.from('market_prices').upsert(normalizedPrices);
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
          const normalizedData = normalizeData(product);
          await supabase.from('retail_products').update(normalizedData).eq('id', product.id);
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
        const normalizedData = normalizeData(updatedAd);
        await supabase.from('wholesale_ads').update(normalizedData).eq('id', updatedAd.id);
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
