
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
  const [messages, setMessages] = useState<any[]>([]);
  const [totalVisitors, setTotalVisitors] = useState<number>(0);

  const getLocal = (key: string, defaultData: any[]) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultData;
    } catch (e) { return defaultData; }
  };

  const setLocal = (key: string, data: any[]) => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  };

  const normalizeData = (data: any) => {
    if (!data || typeof data !== 'object') return data;
    const normalized: any = {};
    for (const key in data) {
      if (key === 'id' || key === 'created_at') continue; 
      normalized[key.toLowerCase()] = data[key] === undefined ? null : data[key];
    }
    return normalized;
  };

  const mapFromDb = (item: any) => {
    if (!item) return item;
    const newItem = { ...item };
    
    // Comprehensive mapping for all potential lowercase DB keys to camelCase
    const fieldMap: Record<string, string> = {
      'contenttype': 'contentType',
      'postedby': 'postedBy',
      'posteddate': 'postedDate',
      'readtime': 'readTime',
      'sellertype': 'sellerType',
      'nameen': 'nameEn',
      'namebn': 'nameBn',
      'titlebn': 'titleBn',
      'lastdonation': 'lastDonation',
      'enrolleddate': 'enrolledDate',
      'user_name': 'user'
    };

    Object.keys(fieldMap).forEach(dbKey => {
      if (dbKey in newItem) {
        newItem[fieldMap[dbKey]] = newItem[dbKey];
        // Only delete if it's actually a different casing to avoid deleting camelCase
        if (dbKey !== fieldMap[dbKey]) delete newItem[dbKey];
      }
    });
    
    return newItem;
  };

  const fetchTable = async (table: string, setter: any, orderBy = 'created_at', ascending = false) => {
    if (!isSupabaseConfigured) return;
    try {
        const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
        if (!error && data) {
            setter(data.map(mapFromDb));
        }
    } catch(e) {}
  };

  const fetchData = async () => {
    setJobs(getLocal('db_jobs', MOCK_JOBS));
    setBlogs(getLocal('db_blogs', MOCK_BLOGS));
    setRequests(getLocal('db_requests', []));
    setGrievances(getLocal('db_grievances', []));
    setUsers(getLocal('db_users', MOCK_USERS));
    setMessages(getLocal('db_messages', []));
    
    if (isSupabaseConfigured) {
      fetchTable('jobs', setJobs);
      fetchTable('blogs', setBlogs);
      fetchTable('requests', setRequests);
      fetchTable('grievances', setGrievances);
      fetchTable('users', setUsers);
      fetchTable('contact_messages', setMessages);
      fetchTable('market_prices', setMarketPrices);
      fetchTable('retail_products', setRetailProducts);
      fetchTable('wholesale_ads', setWholesaleAds);
      fetchTable('lawyers', setLawyers);
      fetchTable('exchange_rates', setExchangeRates);
      fetchTable('vocational_courses', setVocationalCourses);
      fetchTable('donors', setDonors);
      fetchTable('enrolled_courses', setEnrolledCourses);
    }
  };

  useEffect(() => {
    fetchData();
    if (isSupabaseConfigured) {
        const channel = supabase.channel('realtime_data')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
        .subscribe();
        return () => { supabase.removeChannel(channel); };
    }
  }, []);

  const optimisticAdd = async (table: string, newItem: any, setter: any, currentList: any[]) => {
    const tempItem = { ...newItem, id: Date.now() };
    const newList = [tempItem, ...currentList];
    setter(newList);
    setLocal(`db_${table}`, newList);
    
    if (isSupabaseConfigured) {
        try {
            const { error } = await supabase.from(table).insert([normalizeData(newItem)]);
            if (!error) await fetchTable(table, setter);
        } catch (err) {}
    }
  };

  const addJob = async (job: any) => {
    const newJob = { ...job, postedDate: new Date().toLocaleDateString(), status: 'Active', views: 0 };
    await optimisticAdd('jobs', newJob, setJobs, jobs);
  };

  const addBlog = async (blog: any) => {
    const newBlog = { ...blog, postedDate: new Date().toLocaleDateString(), status: 'Active', views: 0 };
    await optimisticAdd('blogs', newBlog, setBlogs, blogs);
  };

  const addRequest = async (request: any) => {
    const newReq = { ...request, status: 'Pending', postedDate: new Date().toLocaleDateString() };
    await optimisticAdd('requests', newReq, setRequests, requests);
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject') => {
    setRequests(requests.filter(r => r.id !== item.id));
    if (isSupabaseConfigured) await supabase.from('requests').delete().eq('id', item.id);

    if (action === 'approve') {
      const { id, created_at, contentType, ...rest } = item;
      if (contentType === 'job') await addJob(rest);
      else await addBlog(rest);
    }
  };

  const updateJob = async (item: any) => {
    setJobs(jobs.map(j => j.id === item.id ? item : j));
    if (isSupabaseConfigured) await supabase.from('jobs').update(normalizeData(item)).eq('id', item.id);
  };

  const deleteJob = async (id: number) => {
    setJobs(jobs.filter(j => j.id !== id));
    if (isSupabaseConfigured) await supabase.from('jobs').delete().eq('id', id);
  };

  const updateBlog = async (item: any) => {
    setBlogs(blogs.map(b => b.id === item.id ? item : b));
    if (isSupabaseConfigured) await supabase.from('blogs').update(normalizeData(item)).eq('id', item.id);
  };

  const deleteBlog = async (id: number) => {
    setBlogs(blogs.filter(b => b.id !== id));
    if (isSupabaseConfigured) await supabase.from('blogs').delete().eq('id', id);
  };

  const addGrievance = async (grievance: any) => {
    const newGrievance = { ...grievance, status: 'Pending', date: new Date().toLocaleDateString() };
    await optimisticAdd('grievances', newGrievance, setGrievances, grievances);
  };

  const updateGrievanceStatus = async (id: number, status: string) => {
    setGrievances(grievances.map(g => g.id === id ? { ...g, status } : g));
    if (isSupabaseConfigured) await supabase.from('grievances').update({ status }).eq('id', id);
  };

  const deleteGrievance = async (id: number) => {
    setGrievances(grievances.filter(g => g.id !== id));
    if (isSupabaseConfigured) await supabase.from('grievances').delete().eq('id', id);
  };

  const addUser = async (user: any) => {
    await optimisticAdd('users', user, setUsers, users);
  };

  const updateUserStatus = async (id: string, status: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
    if (isSupabaseConfigured) await supabase.from('users').update({ status }).eq('id', id);
  };

  const deleteUser = async (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id);
  };

  const addMessage = async (msg: any) => {
    await optimisticAdd('contact_messages', msg, setMessages, messages);
  };

  const markMessageRead = async (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status: 'Read' } : m));
    if (isSupabaseConfigured) await supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id);
  };

  const deleteMessage = async (id: number) => {
    setMessages(messages.filter(m => m.id !== id));
    if (isSupabaseConfigured) await supabase.from('contact_messages').delete().eq('id', id);
  };

  const updateMarketPrices = async (newPrices: any[]) => {
    setMarketPrices(newPrices);
  };

  const addRetailProduct = async (prod: any) => {
    await optimisticAdd('retail_products', prod, setRetailProducts, retailProducts);
  };

  const updateRetailProduct = async (prod: any) => {
    setRetailProducts(retailProducts.map(p => p.id === prod.id ? prod : p));
    if (isSupabaseConfigured) await supabase.from('retail_products').update(normalizeData(prod)).eq('id', prod.id);
  };

  const deleteRetailProduct = async (id: number) => {
    setRetailProducts(retailProducts.filter(p => p.id !== id));
    if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id);
  };

  const addWholesaleAd = async (ad: any) => {
    await optimisticAdd('wholesale_ads', ad, setWholesaleAds, wholesaleAds);
  };

  const updateWholesaleAd = async (ad: any) => {
    setWholesaleAds(wholesaleAds.map(a => a.id === ad.id ? ad : a));
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(normalizeData(ad)).eq('id', ad.id);
  };

  const deleteWholesaleAd = async (id: number) => {
    setWholesaleAds(wholesaleAds.filter(a => a.id !== id));
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id);
  };

  const addLawyer = async (lawyer: any) => {
    await optimisticAdd('lawyers', lawyer, setLawyers, lawyers);
  };

  const deleteLawyer = async (id: number) => {
    setLawyers(lawyers.filter(l => l.id !== id));
    if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id);
  };

  const addExchangeRate = async (rate: any) => {
    await optimisticAdd('exchange_rates', rate, setExchangeRates, exchangeRates);
  };

  const deleteExchangeRate = async (id: number) => {
    setExchangeRates(exchangeRates.filter(r => r.id !== id));
    if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id);
  };

  const addVocationalCourse = async (course: any) => {
    await optimisticAdd('vocational_courses', course, setVocationalCourses, vocationalCourses);
  };

  const deleteVocationalCourse = async (id: number) => {
    setVocationalCourses(vocationalCourses.filter(c => c.id !== id));
    if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id);
  };

  const enrollCourse = async (course: any) => {
    await optimisticAdd('enrolled_courses', course, setEnrolledCourses, enrolledCourses);
  };

  const addDonor = async (donor: any) => {
    await optimisticAdd('donors', donor, setDonors, donors);
  };

  const resetPassword = async (email: string, newPassword: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      const updatedUser = { ...user, password: newPassword };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      if (isSupabaseConfigured) await supabase.from('users').update({ password: newPassword }).eq('id', user.id);
    }
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, grievances, users, messages, donors, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses,
      addJob, updateJob, deleteJob,
      addBlog, updateBlog, deleteBlog,
      addRequest, handleRequestAction,
      addGrievance, updateGrievanceStatus, deleteGrievance,
      addUser, updateUserStatus, deleteUser, resetPassword,
      addMessage, markMessageRead, deleteMessage,
      updateMarketPrices, addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addWholesaleAd, updateWholesaleAd, deleteWholesaleAd,
      addLawyer, deleteLawyer, addExchangeRate, deleteExchangeRate,
      addVocationalCourse, deleteVocationalCourse, enrollCourse, addDonor,
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
