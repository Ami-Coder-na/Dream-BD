
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole } from '../types';

// Initial structure for 64 districts
const INITIAL_DISTRICT_LIST = [
  { id: 'dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা', division: 'Dhaka' },
  { id: 'gazipur', nameEn: 'Gazipur', nameBn: 'গাজীপুর', division: 'Dhaka' },
  { id: 'narayanganj', nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', division: 'Dhaka' },
  { id: 'munshiganj', nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', division: 'Dhaka' },
  { id: 'narsingdi', nameEn: 'Narsingdi', nameBn: 'নরসিংদী', division: 'Dhaka' },
  { id: 'manikganj', nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', division: 'Dhaka' },
  { id: 'tangail', nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', division: 'Dhaka' },
  { id: 'kishoreganj', nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', division: 'Dhaka' },
  { id: 'faridpur', nameEn: 'Faridpur', nameBn: 'ফরিদপুর', division: 'Dhaka' },
  { id: 'gopalganj', nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', division: 'Dhaka' },
  { id: 'madaripur', nameEn: 'Madaripur', nameBn: 'মাদারীপুর', division: 'Dhaka' },
  { id: 'shariatpur', nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর', division: 'Dhaka' },
  { id: 'rajbari', nameEn: 'Rajbari', nameBn: 'রাজবাড়ী', division: 'Dhaka' },
  { id: 'chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', division: 'Chattogram' },
  { id: 'coxsbazar', nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার', division: 'Chattogram' },
  { id: 'comilla', nameEn: 'Comilla', nameBn: 'কুমিল্লা', division: 'Chattogram' },
  { id: 'brahmanbaria', nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram' },
  { id: 'chandpur', nameEn: 'Chandpur', nameBn: 'চাঁদপুর', division: 'Chattogram' },
  { id: 'noakhali', nameEn: 'Noakhali', nameBn: 'নোয়াখালী', division: 'Chattogram' },
  { id: 'lakshmipur', nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', division: 'Chattogram' },
  { id: 'feni', nameEn: 'Feni', nameBn: 'ফেনী', division: 'Chattogram' },
  { id: 'khagrachari', nameEn: 'Khagrachari', nameBn: 'খাগড়াছড়ি', division: 'Chattogram' },
  { id: 'rangamati', nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', division: 'Chattogram' },
  { id: 'bandarban', nameEn: 'Bandarban', nameBn: 'বান্দরবান', division: 'Chattogram' },
  { id: 'sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট', division: 'Sylhet' },
  { id: 'moulvibazar', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', division: 'Sylhet' },
  { id: 'habiganj', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', division: 'Sylhet' },
  { id: 'sunamganj', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', division: 'Sylhet' },
  { id: 'khulna', nameEn: 'Khulna', nameBn: 'খুলনা', division: 'Khulna' },
  { id: 'bagerhat', nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', division: 'Khulna' },
  { id: 'satkhira', nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', division: 'Khulna' },
  { id: 'jessore', nameEn: 'Jessore', nameBn: 'যশোর', division: 'Khulna' },
  { id: 'magura', nameEn: 'Magura', nameBn: 'মাগুরা', division: 'Khulna' },
  { id: 'jhenaidah', nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', division: 'Khulna' },
  { id: 'narail', nameEn: 'Narail', nameBn: 'নড়াইল', division: 'Khulna' },
  { id: 'kushtia', nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', division: 'Khulna' },
  { id: 'chuadanga', nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', division: 'Khulna' },
  { id: 'meherpur', nameEn: 'Meherpur', nameBn: 'মেহেরপুর', division: 'Khulna' },
  { id: 'rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী', division: 'Rajshahi' },
  { id: 'bogra', nameEn: 'Bogra', nameBn: 'বগুড়া', division: 'Rajshahi' },
  { id: 'pabna', nameEn: 'Pabna', nameBn: 'পাবনা', division: 'Rajshahi' },
  { id: 'sirajganj', nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', division: 'Rajshahi' },
  { id: 'natore', nameEn: 'Natore', nameBn: 'নাটোর', division: 'Rajshahi' },
  { id: 'naogaon', nameEn: 'Naogaon', nameBn: 'নওগাঁ', division: 'Rajshahi' },
  { id: 'chapainawabganj', nameEn: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi' },
  { id: 'joypurhat', nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট', division: 'Rajshahi' },
  { id: 'barisal', nameEn: 'Barisal', nameBn: 'বরিশাল', division: 'Barisal' },
  { id: 'patuakhali', nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', division: 'Barisal' },
  { id: 'bhola', nameEn: 'Bhola', nameBn: 'ভোলা', division: 'Barisal' },
  { id: 'pirojpur', nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', division: 'Barisal' },
  { id: 'barguna', nameEn: 'Barguna', nameBn: 'বরগুনা', division: 'Barisal' },
  { id: 'jhalokati', nameEn: 'Jhalokati', nameBn: 'ঝালকাঠি', division: 'Barisal' },
  { id: 'rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর', division: 'Rangpur' },
  { id: 'dinajpur', nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', division: 'Rangpur' },
  { id: 'gaibandha', nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', division: 'Rangpur' },
  { id: 'kurigram', nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', division: 'Rangpur' },
  { id: 'nilphamari', nameEn: 'Nilphamari', nameBn: 'নীলফামারী', division: 'Rangpur' },
  { id: 'lalmonirhat', nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট', division: 'Rangpur' },
  { id: 'thakurgaon', nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', division: 'Rangpur' },
  { id: 'panchagarh', nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', division: 'Rangpur' },
  { id: 'mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', division: 'Mymensingh' },
  { id: 'netrokona', nameEn: 'Netrokona', nameBn: 'নেত্রকোনা', division: 'Mymensingh' },
  { id: 'sherpur', nameEn: 'Sherpur', nameBn: 'শেরপুর', division: 'Mymensingh' },
  { id: 'jamalpur', nameEn: 'Jamalpur', nameBn: 'জামালপুর', division: 'Mymensingh' }
].map(d => ({
  ...d,
  population: 'N/A',
  area: 'N/A',
  description: '',
  upazilas: [],
  education: { primary: 0, highSchool: 0, college: 0, university: 0 },
  hospitals: [],
  touristSpots: [],
  images: []
}));

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
  const [districts, setDistricts] = useState<any[]>(INITIAL_DISTRICT_LIST);
  const [totalVisitors, setTotalVisitors] = useState<number>(1250);

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
      normalized[key.toLowerCase()] = data[key] === undefined ? null : data[key];
    }
    return normalized;
  };

  const mapFromDb = (item: any) => {
    if (!item) return item;
    const newItem = { ...item };
    const fieldMap: Record<string, string> = {
      'postedby': 'postedBy', 'posteddate': 'postedDate', 'readtime': 'readTime',
      'sellertype': 'sellerType', 'nameen': 'nameEn', 'namebn': 'nameBn',
      'titlebn': 'titleBn', 'lastdonation': 'lastDonation', 'enrolleddate': 'enrolledDate', 'user_name': 'user',
      'touristspots': 'touristSpots'
    };
    Object.keys(fieldMap).forEach(dbKey => {
      if (dbKey in newItem) {
        newItem[fieldMap[dbKey]] = newItem[dbKey];
        if (dbKey !== fieldMap[dbKey]) delete newItem[dbKey];
      }
    });
    return newItem;
  };

  const fetchTable = async (table: string, setter: any, orderBy = 'created_at', ascending = false) => {
    if (!isSupabaseConfigured) return;
    try {
        const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
        if (!error && data) setter(data.map(mapFromDb));
    } catch(e) {}
  };

  const fetchData = async () => {
    setJobs(getLocal('db_jobs', MOCK_JOBS));
    setBlogs(getLocal('db_blogs', MOCK_BLOGS));
    setRequests(getLocal('db_requests', []));
    setBlogRequests(getLocal('db_blog_requests', []));
    setWholesaleRequests(getLocal('db_wholesale_requests', []));
    setGrievances(getLocal('db_grievances', []));
    setUsers(getLocal('db_users', MOCK_USERS));
    setMessages(getLocal('db_messages', []));
    setDistricts(getLocal('db_districts', INITIAL_DISTRICT_LIST));
    
    if (isSupabaseConfigured) {
      fetchTable('jobs', setJobs);
      fetchTable('blogs', setBlogs);
      fetchTable('requests', setRequests);
      fetchTable('blog_requests', setBlogRequests);
      fetchTable('wholesale_requests', setWholesaleRequests);
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
      fetchTable('districts', setDistricts, 'nameen', true);
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
            const payload = normalizeData(newItem);
            const { error } = await supabase.from(table).insert([payload]);
            if (!error) await fetchTable(table, setter);
        } catch (err) {}
    }
  };

  const addRequest = async (request: any) => {
    const { contentType, ...dbData } = request;
    let table = 'requests';
    let setter = setRequests;
    let current = requests;

    if (contentType === 'blog') { table = 'blog_requests'; setter = setBlogRequests; current = blogRequests; }
    else if (contentType === 'wholesale') { table = 'wholesale_requests'; setter = setWholesaleRequests; current = wholesaleRequests; }
    
    const newReq = { ...dbData, status: 'Pending', postedDate: dbData.postedDate || new Date().toLocaleDateString() };
    await optimisticAdd(table, newReq, setter, current);
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject', type: 'job' | 'blog' | 'wholesale') => {
    let table = 'requests';
    if (type === 'blog') { table = 'blog_requests'; setBlogRequests(blogRequests.filter(r => r.id !== item.id)); }
    else if (type === 'wholesale') { table = 'wholesale_requests'; setWholesaleRequests(wholesaleRequests.filter(r => r.id !== item.id)); }
    else { setRequests(requests.filter(r => r.id !== item.id)); }
    
    if (isSupabaseConfigured) await supabase.from(table).delete().eq('id', item.id);

    if (action === 'approve') {
      const { id, created_at, ...rest } = item;
      if (type === 'job') await optimisticAdd('jobs', { ...rest, status: 'Active' }, setJobs, jobs);
      else if (type === 'blog') await optimisticAdd('blogs', { ...rest, status: 'Active' }, setBlogs, blogs);
      else if (type === 'wholesale') await optimisticAdd('wholesale_ads', { ...rest, status: 'Active' }, setWholesaleAds, wholesaleAds);
    }
  };

  // CRUD Methods
  const addJob = async (job: any) => await optimisticAdd('jobs', { ...job, postedDate: new Date().toLocaleDateString(), status: 'Active' }, setJobs, jobs);
  const updateJob = async (item: any) => { setJobs(jobs.map(j => j.id === item.id ? item : j)); if (isSupabaseConfigured) await supabase.from('jobs').update(normalizeData(item)).eq('id', item.id); };
  const deleteJob = async (id: number) => { setJobs(jobs.filter(j => j.id !== id)); if (isSupabaseConfigured) await supabase.from('jobs').delete().eq('id', id); };
  const addBlog = async (blog: any) => await optimisticAdd('blogs', { ...blog, postedDate: new Date().toLocaleDateString(), status: 'Active' }, setBlogs, blogs);
  const updateBlog = async (item: any) => { setBlogs(blogs.map(b => b.id === item.id ? item : b)); if (isSupabaseConfigured) await supabase.from('blogs').update(normalizeData(item)).eq('id', item.id); };
  const deleteBlog = async (id: number) => { setBlogs(blogs.filter(b => b.id !== id)); if (isSupabaseConfigured) await supabase.from('blogs').delete().eq('id', id); };
  const addGrievance = async (g: any) => await optimisticAdd('grievances', { ...g, status: 'Pending', date: new Date().toLocaleDateString() }, setGrievances, grievances);
  const updateGrievanceStatus = async (id: number, status: string) => { setGrievances(grievances.map(g => g.id === id ? { ...g, status } : g)); if (isSupabaseConfigured) await supabase.from('grievances').update({ status }).eq('id', id); };
  const deleteGrievance = async (id: number) => { setGrievances(grievances.filter(g => g.id !== id)); if (isSupabaseConfigured) await supabase.from('grievances').delete().eq('id', id); };
  const addUser = async (u: any) => await optimisticAdd('users', u, setUsers, users);
  const deleteUser = async (id: string) => { setUsers(users.filter(u => u.id !== id)); if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id); };
  const resetPassword = async (email: string, pw: string) => { const u = users.find(u => u.email.toLowerCase() === email.toLowerCase()); if (u) { setUsers(users.map(us => us.id === u.id ? {...u, password: pw} : us)); if (isSupabaseConfigured) await supabase.from('users').update({ password: pw }).eq('id', u.id); } };
  const addMessage = async (m: any) => await optimisticAdd('contact_messages', m, setMessages, messages);
  const markMessageRead = async (id: number) => { setMessages(messages.map(m => m.id === id ? { ...m, status: 'Read' } : m)); if (isSupabaseConfigured) await supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id); };
  const deleteMessage = async (id: number) => { setMessages(messages.filter(m => m.id !== id)); if (isSupabaseConfigured) await supabase.from('contact_messages').delete().eq('id', id); };
  const updateMarketPrices = async (p: any[]) => setMarketPrices(p);
  const addRetailProduct = async (p: any) => await optimisticAdd('retail_products', p, setRetailProducts, retailProducts);
  const updateRetailProduct = async (p: any) => { setRetailProducts(retailProducts.map(pr => pr.id === p.id ? p : pr)); if (isSupabaseConfigured) await supabase.from('retail_products').update(normalizeData(p)).eq('id', p.id); };
  const deleteRetailProduct = async (id: number) => { setRetailProducts(retailProducts.filter(p => p.id !== id)); if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id); };
  const addWholesaleAd = async (a: any) => await optimisticAdd('wholesale_ads', a, setWholesaleAds, wholesaleAds);
  const updateWholesaleAd = async (a: any) => { setWholesaleAds(wholesaleAds.map(ad => ad.id === a.id ? a : ad)); if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(normalizeData(a)).eq('id', a.id); };
  const deleteWholesaleAd = async (id: number) => { setWholesaleAds(wholesaleAds.filter(a => a.id !== id)); if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id); };
  const addLawyer = async (l: any) => await optimisticAdd('lawyers', l, setLawyers, lawyers);
  const deleteLawyer = async (id: number) => { setLawyers(lawyers.filter(l => l.id !== id)); if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id); };
  const addExchangeRate = async (r: any) => await optimisticAdd('exchange_rates', r, setExchangeRates, exchangeRates);
  const deleteExchangeRate = async (id: number) => { setExchangeRates(exchangeRates.filter(r => r.id !== id)); if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id); };
  const addVocationalCourse = async (c: any) => await optimisticAdd('vocational_courses', c, setVocationalCourses, vocationalCourses);
  const deleteVocationalCourse = async (id: number) => { setVocationalCourses(vocationalCourses.filter(c => c.id !== id)); if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id); };
  const enrollCourse = async (c: any) => await optimisticAdd('enrolled_courses', c, setEnrolledCourses, enrolledCourses);
  const addDonor = async (d: any) => await optimisticAdd('donors', d, setDonors, donors);
  
  const updateDistrict = async (d: any) => {
    const newList = districts.map(item => item.id === d.id ? d : item);
    setDistricts(newList);
    setLocal('db_districts', newList);
    if (isSupabaseConfigured) {
        const payload = normalizeData(d);
        await supabase.from('districts').upsert([payload], { onConflict: 'id' });
    }
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, blogRequests, wholesaleRequests, grievances, users, messages, donors, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses, districts,
      addJob, updateJob, deleteJob, addBlog, updateBlog, deleteBlog, addRequest, handleRequestAction, addGrievance, updateGrievanceStatus, deleteGrievance, addUser, deleteUser, resetPassword, addMessage, markMessageRead, deleteMessage, updateMarketPrices, addRetailProduct, updateRetailProduct, deleteRetailProduct, addWholesaleAd, updateWholesaleAd, deleteWholesaleAd, addLawyer, deleteLawyer, addExchangeRate, deleteExchangeRate, addVocationalCourse, deleteVocationalCourse, enrollCourse, addDonor, updateDistrict,
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
