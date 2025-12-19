
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole } from '../types';

const DataContext = createContext<any>(null);

const getLocal = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
};

const mapFromDb = (item: any) => {
  return item;
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
  const [totalVisitors, setTotalVisitors] = useState<number>(1250);

  const fetchData = async () => {
    setJobs(getLocal('db_jobs', []));
    setBlogs(getLocal('db_blogs', []));
    setDistricts(getLocal('db_districts', []));
    
    if (!isSupabaseConfigured) return;

    try {
      const loadTable = async (name: string, setter: any) => {
        try {
          const { data, error } = await supabase.from(name).select('*');
          if (error) throw error;
          if (data) setter(data.map(mapFromDb));
        } catch (e: any) {
          console.warn(`Could not sync ${name}:`, e.message);
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
        loadTable('donor_view_logs', setDonorViewLogs)
      ]);
    } catch (globalErr: any) {
      console.error("Database connection failed.", globalErr.message);
    }
  };

  useEffect(() => {
    fetchData();
    if (isSupabaseConfigured) {
        try {
            const channel = supabase.channel('realtime_data')
            .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
            .subscribe();
            return () => { supabase.removeChannel(channel); };
        } catch(e) {}
    }
  }, []);

  // --- JOB CRUD ---
  const addJob = async (job: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('jobs').insert([{ ...job, status: 'Active', postedDate: new Date().toLocaleDateString() }]);
    }
    fetchData();
  };

  const updateJob = async (job: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('jobs').update(job).eq('id', job.id);
    }
    fetchData();
  };

  const deleteJob = async (id: number) => {
    if (isSupabaseConfigured) {
      await supabase.from('jobs').delete().eq('id', id);
    }
    fetchData();
  };

  // --- BLOG CRUD ---
  const addBlog = async (blog: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('blogs').insert([{ ...blog, status: 'Active', postedDate: new Date().toLocaleDateString() }]);
    }
    fetchData();
  };

  const updateBlog = async (blog: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('blogs').update(blog).eq('id', blog.id);
    }
    fetchData();
  };

  const deleteBlog = async (id: number) => {
    if (isSupabaseConfigured) {
      await supabase.from('blogs').delete().eq('id', id);
    }
    fetchData();
  };

  // --- REQUEST HANDLING ---
  const addRequest = async (request: any) => {
    if (isSupabaseConfigured) {
      const table = request.contentType === 'job' ? 'requests' : 
                    request.contentType === 'blog' ? 'blog_requests' : 
                    'wholesale_requests';
      await supabase.from(table).insert([request]);
    }
    fetchData();
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject', type: string) => {
    if (isSupabaseConfigured) {
      const reqTable = type === 'job' ? 'requests' : type === 'blog' ? 'blog_requests' : 'wholesale_requests';
      if (action === 'approve') {
        const targetTable = type === 'job' ? 'jobs' : type === 'blog' ? 'blogs' : 'wholesale_ads';
        await supabase.from(targetTable).insert([{ ...item, status: 'Active', id: undefined }]);
      }
      await supabase.from(reqTable).delete().eq('id', item.id);
    }
    fetchData();
  };

  // --- GRIEVANCE CRUD ---
  const addGrievance = async (grievance: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('grievances').insert([{ ...grievance, status: 'Pending', date: new Date().toLocaleDateString() }]);
    }
    fetchData();
  };

  const updateGrievanceStatus = async (id: number, status: string) => {
    if (isSupabaseConfigured) {
      await supabase.from('grievances').update({ status }).eq('id', id);
    }
    fetchData();
  };

  const deleteGrievance = async (id: number) => {
    if (isSupabaseConfigured) {
      await supabase.from('grievances').delete().eq('id', id);
    }
    fetchData();
  };

  // --- MESSAGES CRUD ---
  const addMessage = async (message: any) => {
    if (isSupabaseConfigured) {
      await supabase.from('contact_messages').insert([{ ...message, status: 'Unread', created_at: new Date().toISOString() }]);
    }
    fetchData();
  };

  const markMessageRead = async (id: number) => {
    if (isSupabaseConfigured) {
      await supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id);
    }
    fetchData();
  };

  const deleteMessage = async (id: number) => {
    if (isSupabaseConfigured) {
      await supabase.from('contact_messages').delete().eq('id', id);
    }
    fetchData();
  };

  // --- USER CRUD ---
  const addUser = async (user: any) => {
    if (isSupabaseConfigured) await supabase.from('users').insert([user]);
    fetchData();
  };

  const updateUserStatus = async (id: string, status: string) => {
    if (isSupabaseConfigured) await supabase.from('users').update({ status }).eq('id', id);
    fetchData();
  };

  const deleteUser = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id);
    fetchData();
  };

  // --- MARKET & ADS ---
  const updateMarketPrices = (prices: any[]) => setMarketPrices(prices);

  const updateWholesaleAd = async (ad: any) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(ad).eq('id', ad.id);
    fetchData();
  };

  const deleteWholesaleAd = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id);
    fetchData();
  };

  const addRetailProduct = async (prod: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').insert([prod]);
    fetchData();
  };

  const updateRetailProduct = async (prod: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').update(prod).eq('id', prod.id);
    fetchData();
  };

  const deleteRetailProduct = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id);
    fetchData();
  };

  // --- MISC ---
  const enrollCourse = (course: any) => setEnrolledCourses(prev => [...prev, course]);

  const updateDistrict = async (district: any) => {
    if (isSupabaseConfigured) await supabase.from('districts').upsert(district);
    fetchData();
  };

  const addDonorViewLog = async (log: any) => {
    if (isSupabaseConfigured) await supabase.from('donor_view_logs').insert([log]);
    fetchData();
  };

  const addLawyer = async (lawyer: any) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').insert([lawyer]);
    fetchData();
  };

  const deleteLawyer = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id);
    fetchData();
  };

  const addExchangeRate = async (rate: any) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').insert([rate]);
    fetchData();
  };

  const deleteExchangeRate = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id);
    fetchData();
  };

  const addVocationalCourse = async (course: any) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').insert([course]);
    fetchData();
  };

  const deleteVocationalCourse = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id);
    fetchData();
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, blogRequests, wholesaleRequests, grievances, users, messages, donors, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses, districts, donorViewLogs,
      addRequest, addGrievance, updateGrievanceStatus, deleteGrievance, addMessage, markMessageRead, deleteMessage, enrollCourse, seedDistricts: async () => {}, updateDistrict, addDonorViewLog,
      addUser, updateUserStatus, deleteUser, updateMarketPrices, addJob, updateJob, deleteJob, addBlog, updateBlog, deleteBlog, handleRequestAction,
      updateWholesaleAd, deleteWholesaleAd, addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addLawyer, deleteLawyer, addExchangeRate, deleteExchangeRate, addVocationalCourse, deleteVocationalCourse,
      totalVisitors, logVisit: () => {}, refreshData: fetchData
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
