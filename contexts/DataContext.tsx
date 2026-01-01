import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole } from '../types';

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

const normalizeLog = (log: any) => {
  if (!log) return null;
  return {
    id: log.id || Date.now() + Math.random(),
    donorName: log.donorname || log.donorName || 'Unknown',
    donorPhone: log.donorphone || log.donorPhone || 'N/A',
    viewerName: log.viewername || log.viewerName || 'Anonymous',
    viewerPhone: log.viewerphone || log.viewerPhone || 'N/A',
    viewerDistrict: log.viewerdistrict || log.viewerDistrict || 'Unknown',
    created_at: log.created_at || log.createdat || new Date().toISOString()
  };
};

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
  const [totalVisitors, setTotalVisitors] = useState<number>(() => parseInt(localStorage.getItem('total_visitors') || '1250'));

  const fetchData = async () => {
    setJobs(getLocal('db_jobs', []));
    setBlogs(getLocal('db_blogs', []));
    setRequests(getLocal('db_requests', []));
    setBlogRequests(getLocal('db_blog_requests', []));
    setWholesaleRequests(getLocal('db_wholesale_requests', []));
    setDistricts(getLocal('db_districts', []));
    setDonorViewLogs(getLocal('db_donor_view_logs', []));
    setDonors(getLocal('db_donors', [
        { id: 1, name: 'Ariful Islam', phone: '01711223344', district: 'Dhaka', group: 'O+', lastDonation: '3 months ago' },
        { id: 2, name: 'Sumi Akter', phone: '01811223344', district: 'Chittagong', group: 'A+', lastDonation: '1 month ago' }
    ]));
    setGrievances(getLocal('db_grievances', []));
    setMessages(getLocal('db_contact_messages', []));
    setWholesaleAds(getLocal('db_wholesale_ads', []));
    setLawyers(getLocal('db_lawyers', []));
    setExchangeRates(getLocal('db_exchange_rates', []));
    setVocationalCourses(getLocal('db_vocational_courses', []));
    
    if (!isSupabaseConfigured) return;

    try {
      const loadTable = async (name: string, setter: any, normalizer?: any) => {
        try {
          const { data, error } = await supabase.from(name).select('*').order('created_at', { ascending: false });
          if (error) throw error;
          if (data) {
            const normalizedData = normalizer ? data.map(normalizer).filter(Boolean) : data;
            setter(normalizedData);
            localStorage.setItem(`db_${name}`, JSON.stringify(normalizedData));
          }
        } catch (e: any) {
          console.warn(`Sync failed for ${name}:`, e.message);
        }
      };

      await Promise.all([
        loadTable('jobs', setJobs),
        loadTable('blogs', setBlogs),
        loadTable('requests', setRequests),
        loadTable('blog_requests', setBlogRequests),
        loadTable('wholesale_requests', setWholesaleRequests),
        loadTable('grievances', setGrievances),
        loadTable('users', setUsers),
        loadTable('contact_messages', setMessages),
        loadTable('market_prices', setMarketPrices),
        loadTable('wholesale_ads', setWholesaleAds),
        loadTable('donors', setDonors),
        loadTable('districts', setDistricts),
        loadTable('lawyers', setLawyers),
        loadTable('exchange_rates', setExchangeRates),
        loadTable('vocational_courses', setVocationalCourses),
        loadTable('donor_view_logs', setDonorViewLogs, normalizeLog)
      ]);
    } catch (globalErr: any) {
      console.error("Database connection failed.", globalErr.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const seedDistricts = async () => {
    if (!isSupabaseConfigured) return;
    const sampleDistricts = [
      { id: 'dhaka', nameen: 'Dhaka', namebn: 'ঢাকা', division: 'Dhaka', population: '20M', area: '1463 km²' },
      { id: 'chattogram', nameen: 'Chattogram', namebn: 'চট্টগ্রাম', division: 'Chattogram', population: '9.1M', area: '5283 km²' },
      { id: 'sylhet', nameen: 'Sylhet', namebn: 'সিলেট', division: 'Sylhet', population: '3.4M', area: '3490 km²' }
    ];
    try {
      await supabase.from('districts').upsert(sampleDistricts);
      await fetchData();
    } catch (e) {
      console.error("Seeding failed", e);
    }
  };

  const addDonorViewLog = async (log: any) => {
    const timestamp = new Date().toISOString();
    const dbLog = {
      donorname: log.donorName,
      donorphone: log.donorPhone,
      viewername: log.viewerName,
      viewerphone: log.viewerPhone,
      viewerdistrict: log.viewerDistrict,
      created_at: timestamp
    };

    const newLogEntry = normalizeLog(dbLog);
    setDonorViewLogs(prev => {
        const updated = [newLogEntry, ...prev];
        localStorage.setItem('db_donor_view_logs', JSON.stringify(updated));
        return updated;
    });

    if (isSupabaseConfigured) {
      try {
        await supabase.from('donor_view_logs').insert([dbLog]);
      } catch (e) {
        console.error("Failed to log donor view to DB", e);
      }
    }
  };

  const logVisit = () => {
    setTotalVisitors(prev => {
        const newVal = prev + 1;
        localStorage.setItem('total_visitors', newVal.toString());
        return newVal;
    });
  };

  const addJob = async (job: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('jobs').insert([{ ...job, status: 'Active', posteddate: new Date().toLocaleDateString() }]);
    }
    await fetchData();
  };

  const updateJob = async (job: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('jobs').update(job).eq('id', job.id);
    }
    await fetchData();
  };

  const deleteJob = async (id: number) => {
    setJobs(prev => prev.filter(i => i.id !== id));
    if (isSupabaseConfigured) await supabase.from('jobs').delete().eq('id', id);
    const local = getLocal('db_jobs', []);
    localStorage.setItem('db_jobs', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const addBlog = async (blog: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('blogs').insert([{ ...blog, status: 'Active', posteddate: new Date().toLocaleDateString() }]);
    }
    await fetchData();
  };

  const updateBlog = async (blog: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('blogs').update(blog).eq('id', blog.id);
    }
    await fetchData();
  };

  const deleteBlog = async (id: number) => {
    setBlogs(prev => prev.filter(i => i.id !== id));
    if (isSupabaseConfigured) await supabase.from('blogs').delete().eq('id', id);
    const local = getLocal('db_blogs', []);
    localStorage.setItem('db_blogs', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const addRequest = async (request: any) => {
    const type = request.contenttype;
    const table = type === 'job' ? 'requests' : 
                  type === 'blog' ? 'blog_requests' : 
                  'wholesale_requests';
    
    const enrichedRequest = { 
      ...request, 
      status: 'Pending', 
      id: Date.now() + Math.floor(Math.random() * 1000) 
    };

    const storageKey = `db_${table}`;
    const currentLocal = getLocal(storageKey, []);
    const updatedLocal = [enrichedRequest, ...currentLocal];
    localStorage.setItem(storageKey, JSON.stringify(updatedLocal));

    if (type === 'job') setRequests(updatedLocal);
    else if (type === 'blog') setBlogRequests(updatedLocal);
    else setWholesaleRequests(updatedLocal);

    if (isSupabaseConfigured) {
      try {
        await supabase.from(table).insert([request]);
      } catch (e) {
        console.error(`Failed to push ${table} to DB`, e);
      }
    }
    
    await fetchData();
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject', type: string) => {
    if (isSupabaseConfigured) {
      const reqTable = type === 'job' ? 'requests' : type === 'blog' ? 'blog_requests' : 'wholesale_requests';
      if (action === 'approve') {
        const targetTable = type === 'job' ? 'jobs' : type === 'blog' ? 'blogs' : 'wholesale_ads';
        const { id, contenttype, contentType, ...dataToInsert } = item;
        await supabase.from(targetTable).insert([{ ...dataToInsert, status: 'Active' }]);
      }
      await supabase.from(reqTable).delete().eq('id', item.id);
    }
    await fetchData();
  };

  const addGrievance = async (grievance: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('grievances').insert([{ ...grievance, status: 'Pending', date: new Date().toLocaleDateString() }]);
    }
    await fetchData();
  };

  const updateGrievanceStatus = async (id: number, status: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('grievances').update({ status }).eq('id', id);
    }
    await fetchData();
  };

  const deleteGrievance = async (id: number) => {
    setGrievances(prev => prev.filter(i => i.id !== id));
    if (isSupabaseConfigured) await supabase.from('grievances').delete().eq('id', id);
    const local = getLocal('db_grievances', []);
    localStorage.setItem('db_grievances', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const addMessage = async (message: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('contact_messages').insert([{ ...message, status: 'Unread', created_at: new Date().toISOString() }]);
    }
    await fetchData();
  };

  const markMessageRead = async (id: number) => {
    if (isSupabaseConfigured) {
      await supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id);
    }
    await fetchData();
  };

  const deleteMessage = async (id: number) => {
    setMessages(prev => prev.filter(i => i.id !== id));
    if (isSupabaseConfigured) await supabase.from('contact_messages').delete().eq('id', id);
    const local = getLocal('db_contact_messages', []);
    localStorage.setItem('db_contact_messages', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const addUser = async (user: any) => {
    if (isSupabaseConfigured) await supabase.from('users').insert([user]);
    await fetchData();
  };

  const updateUserStatus = async (id: string, status: string) => {
    if (isSupabaseConfigured) await supabase.from('users').update({ status }).eq('id', id);
    await fetchData();
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id);
    const local = getLocal('db_users', []);
    localStorage.setItem('db_users', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const updateMarketPrices = (prices: any[]) => {
    setMarketPrices(prices);
    localStorage.setItem('db_market_prices', JSON.stringify(prices));
  };

  const updateWholesaleAd = async (ad: any) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(ad).eq('id', ad.id);
    await fetchData();
  };

  const deleteWholesaleAd = async (id: number) => {
    setWholesaleAds(prev => prev.filter(a => a.id !== id));
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id);
    const local = getLocal('db_wholesale_ads', []);
    localStorage.setItem('db_wholesale_ads', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const addRetailProduct = async (prod: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').insert([prod]);
    await fetchData();
  };

  const updateRetailProduct = async (prod: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').update(prod).eq('id', prod.id);
    await fetchData();
  };

  const deleteRetailProduct = async (id: number) => {
    setRetailProducts(prev => prev.filter(p => p.id !== id));
    if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id);
    const local = getLocal('db_retail_products', []);
    localStorage.setItem('db_retail_products', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const enrollCourse = (course: any) => setEnrolledCourses(prev => [...prev, course]);

  const updateDistrict = async (district: any) => {
    if (isSupabaseConfigured) await supabase.from('districts').upsert(district);
    const local = getLocal('db_districts', []);
    const exists = local.some((d: any) => d.id === district.id);
    const updated = exists ? local.map((d: any) => d.id === district.id ? district : d) : [district, ...local];
    localStorage.setItem('db_districts', JSON.stringify(updated));
    setDistricts(updated);
  };

  const deleteDistrict = async (id: string) => {
    // 1. Update local state immediately
    setDistricts(prev => prev.filter((d: any) => d.id !== id));
    
    // 2. Update local storage immediately
    const local = getLocal('db_districts', []);
    const updatedLocal = local.filter((d: any) => d.id !== id);
    localStorage.setItem('db_districts', JSON.stringify(updatedLocal));

    // 3. Update Supabase asynchronously
    if (isSupabaseConfigured) {
        try {
            await supabase.from('districts').delete().eq('id', id);
        } catch (e) {
            console.error("Supabase deletion failed:", e);
        }
    }
  };

  const addLawyer = async (lawyer: any) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').insert([lawyer]);
    const local = getLocal('db_lawyers', []);
    const updated = [lawyer, ...local];
    localStorage.setItem('db_lawyers', JSON.stringify(updated));
    setLawyers(updated);
  };

  const deleteLawyer = async (id: number) => {
    setLawyers(prev => prev.filter(l => l.id !== id));
    if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id);
    const local = getLocal('db_lawyers', []);
    localStorage.setItem('db_lawyers', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const addExchangeRate = async (rate: any) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').insert([rate]);
    const local = getLocal('db_exchange_rates', []);
    const updated = [rate, ...local];
    localStorage.setItem('db_exchange_rates', JSON.stringify(updated));
    setExchangeRates(updated);
  };

  const deleteExchangeRate = async (id: number) => {
    setExchangeRates(prev => prev.filter(r => r.id !== id));
    if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id);
    const local = getLocal('db_exchange_rates', []);
    localStorage.setItem('db_exchange_rates', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  const addVocationalCourse = async (course: any) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').insert([course]);
    const local = getLocal('db_vocational_courses', []);
    const updated = [course, ...local];
    localStorage.setItem('db_vocational_courses', JSON.stringify(updated));
    setVocationalCourses(updated);
  };

  const deleteVocationalCourse = async (id: number) => {
    setVocationalCourses(prev => prev.filter(c => c.id !== id));
    if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id);
    const local = getLocal('db_vocational_courses', []);
    localStorage.setItem('db_vocational_courses', JSON.stringify(local.filter((i: any) => i.id !== id)));
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, blogRequests, wholesaleRequests, grievances, users, messages, donors, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses, districts, donorViewLogs,
      addRequest, addGrievance, updateGrievanceStatus, deleteGrievance, addMessage, markMessageRead, deleteMessage, enrollCourse, seedDistricts, updateDistrict, deleteDistrict, addDonorViewLog,
      addUser, updateUserStatus, deleteUser, updateMarketPrices, addJob, updateJob, deleteJob, addBlog, updateBlog, deleteBlog, handleRequestAction,
      updateWholesaleAd, deleteWholesaleAd, addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addLawyer, deleteLawyer, addExchangeRate, deleteExchangeRate, addVocationalCourse, deleteVocationalCourse,
      totalVisitors, logVisit, refreshData: fetchData
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