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
        loadTable('donor_view_logs', setDonorViewLogs, normalizeLog)
      ]);
    } catch (globalErr: any) {
      console.error("Database connection failed.", globalErr.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    if (isSupabaseConfigured) {
      await supabase.from('jobs').delete().eq('id', id);
    }
    await fetchData();
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
    if (isSupabaseConfigured) {
      await supabase.from('blogs').delete().eq('id', id);
    }
    await fetchData();
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
    if (isSupabaseConfigured) {
      await supabase.from('grievances').delete().eq('id', id);
    }
    await fetchData();
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
    if (isSupabaseConfigured) {
      await supabase.from('contact_messages').delete().eq('id', id);
    }
    await fetchData();
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
    if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id);
    await fetchData();
  };

  const updateMarketPrices = (prices: any[]) => setMarketPrices(prices);

  const updateWholesaleAd = async (ad: any) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(ad).eq('id', ad.id);
    await fetchData();
  };

  const deleteWholesaleAd = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id);
    await fetchData();
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
    if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id);
    await fetchData();
  };

  const enrollCourse = (course: any) => setEnrolledCourses(prev => [...prev, course]);

  const updateDistrict = async (district: any) => {
    if (isSupabaseConfigured) await supabase.from('districts').upsert(district);
    await fetchData();
  };

  const addLawyer = async (lawyer: any) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').insert([lawyer]);
    await fetchData();
  };

  const deleteLawyer = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id);
    await fetchData();
  };

  const addExchangeRate = async (rate: any) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').insert([rate]);
    await fetchData();
  };

  const deleteExchangeRate = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id);
    await fetchData();
  };

  const addVocationalCourse = async (course: any) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').insert([course]);
    await fetchData();
  };

  const deleteVocationalCourse = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id);
    await fetchData();
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, blogRequests, wholesaleRequests, grievances, users, messages, donors, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses, districts, donorViewLogs,
      addRequest, addGrievance, updateGrievanceStatus, deleteGrievance, addMessage, markMessageRead, deleteMessage, enrollCourse, seedDistricts: async () => {}, updateDistrict, addDonorViewLog,
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