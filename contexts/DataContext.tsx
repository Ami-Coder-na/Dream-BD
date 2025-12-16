
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- INITIAL MOCK DATA ---

const INITIAL_JOBS: any[] = [];
const INITIAL_BLOGS: any[] = [
  {
    id: 1,
    title: "আধুনিক কৃষি প্রযুক্তির ব্যবহার",
    category: "Agriculture",
    content: "কৃষিতে ড্রোন এবং স্মার্ট সেন্সর ব্যবহারের ফলে উৎপাদন বাড়ছে...",
    author: "System Admin",
    postedDate: new Date().toLocaleDateString(),
    date: "12 Oct 2023",
    views: 120,
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1625246333195-58197bd47d26",
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
const INITIAL_USERS: any[] = [
  {
    id: 'admin_01',
    name: 'Super Admin',
    email: 'admin@dreambd.com',
    password: 'admin123', 
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a', 
    status: 'Active',
    date: new Date().toLocaleDateString()
  }
];

// --- NEW DATA FOR NEW MODULES ---
const INITIAL_LAWYERS = [
  { id: 1, name: 'Adv. Rahim Khan', speciality: 'Land Law', location: 'Dhaka', phone: '01711000000', status: 'Active' },
  { id: 2, name: 'Adv. Nasrin Jahan', speciality: 'Family Law', location: 'Chittagong', phone: '01811000000', status: 'Active' }
];

const INITIAL_EXCHANGE_RATES = [
  { currency: 'USD', rate: 110.50, trend: 'up' },
  { currency: 'SAR', rate: 29.45, trend: 'stable' },
  { currency: 'EUR', rate: 118.20, trend: 'down' },
  { currency: 'MYR', rate: 23.50, trend: 'up' },
  { currency: 'GBP', rate: 138.10, trend: 'up' }
];

const INITIAL_VOCATIONAL_COURSES = [
  { id: 1, title: 'Mobile Servicing', titleBn: 'মোবাইল সার্ভিসিং', category: 'Technical', duration: '3 Months', fee: 5000, status: 'Active', image: 'https://images.unsplash.com/photo-1591196153072-6392963b0d80' },
  { id: 2, title: 'Professional Sewing', titleBn: 'পেশাদার সেলাই কাজ', category: 'Craft', duration: '2 Months', fee: 3000, status: 'Active', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2' },
  { id: 3, title: 'Electric House Wiring', titleBn: 'ইলেকট্রিক হাউজ ওয়্যারিং', category: 'Electrical', duration: '4 Months', fee: 6000, status: 'Active', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e' }
];

const INITIAL_DONORS = [
  { id: 1, name: 'Rahim Ahmed', group: 'A+', district: 'Dhaka', phone: '01712-345678', lastDonation: '2 months ago' },
  { id: 2, name: 'Karim Ullah', group: 'B+', district: 'Chittagong', phone: '01812-345678', lastDonation: '4 months ago' },
];

const INITIAL_ENROLLED_COURSES: any[] = [];

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
  // New Data Types
  lawyers: any[];
  exchangeRates: any[];
  vocationalCourses: any[];
  donors: any[];
  enrolledCourses: any[];

  addJob: (job: any) => void;
  deleteJob: (id: number) => void;
  updateJob: (job: any) => void;
  addBlog: (blog: any) => void;
  deleteBlog: (id: number) => void;
  updateBlog: (blog: any) => void;
  addRequest: (request: any) => void;
  handleRequestAction: (item: any, action: 'approve' | 'reject') => void;
  addGrievance: (report: any) => void;
  updateGrievanceStatus: (id: number, status: string) => void;
  deleteGrievance: (id: number) => void;
  addUser: (user: any) => void;
  updateUserStatus: (id: string, status: 'Active' | 'Suspended') => void;
  deleteUser: (id: string) => void;
  resetPassword: (email: string, newPass: string) => void;
  updateMarketPrices: (prices: any[]) => void;
  addRetailProduct: (product: any) => void;
  deleteRetailProduct: (id: number) => void;
  updateRetailProduct: (product: any) => void;
  addWholesaleAd: (ad: any) => void;
  updateWholesaleAd: (ad: any) => void;
  deleteWholesaleAd: (id: number) => void;
  // New Actions
  addLawyer: (lawyer: any) => void;
  deleteLawyer: (id: number) => void;
  updateExchangeRates: (rates: any[]) => void;
  addVocationalCourse: (course: any) => void;
  deleteVocationalCourse: (id: number) => void;
  addDonor: (donor: any) => void;
  enrollCourse: (enrollment: any) => void;
  
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to safely parse JSON
const safeParse = (key: string, fallback: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
    return fallback;
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState(() => safeParse('db_jobs', INITIAL_JOBS));
  const [blogs, setBlogs] = useState(() => safeParse('db_blogs', INITIAL_BLOGS));
  const [requests, setRequests] = useState(() => safeParse('db_requests', INITIAL_REQUESTS));
  const [grievances, setGrievances] = useState(() => safeParse('db_grievances', INITIAL_GRIEVANCES));
  const [users, setUsers] = useState(() => safeParse('db_users', INITIAL_USERS));
  const [marketPrices, setMarketPrices] = useState<any[]>(() => safeParse('db_market', BASE_MARKET_PRICES));
  const [retailProducts, setRetailProducts] = useState(() => safeParse('db_retail', INITIAL_RETAIL_PRODUCTS));
  const [wholesaleAds, setWholesaleAds] = useState(() => safeParse('db_wholesale', INITIAL_WHOLESALE_ADS));
  
  const [lawyers, setLawyers] = useState(() => safeParse('db_lawyers', INITIAL_LAWYERS));
  const [exchangeRates, setExchangeRates] = useState(() => safeParse('db_rates', INITIAL_EXCHANGE_RATES));
  const [vocationalCourses, setVocationalCourses] = useState(() => safeParse('db_vocational', INITIAL_VOCATIONAL_COURSES));
  const [donors, setDonors] = useState(() => safeParse('db_donors', INITIAL_DONORS));
  const [enrolledCourses, setEnrolledCourses] = useState(() => safeParse('db_enrolled', INITIAL_ENROLLED_COURSES));

  // --- AUTOMATED DATA FETCHING ---
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
          views: Math.floor(Math.random() * 500) + 50,
          readTime: '3 min read',
          image: item.thumbnail || item.enclosure?.link || 'https://images.unsplash.com/photo-1589923188900-85dae523342b',
          status: 'Active',
          isExternal: true,
          link: item.link
        }));
        
        setBlogs(prev => {
           // Filter out existing RSS items to avoid duplicates/stale data, keep manual
           const manualBlogs = prev.filter((b: any) => !b.id.toString().startsWith('news_'));
           return [...manualBlogs, ...fetchedBlogs];
        });
      }
    } catch (error) {
      console.error("Failed to fetch live news:", error);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, []);

  // --- PERSISTENCE & REALTIME SYNC ---
  useEffect(() => localStorage.setItem('db_jobs', JSON.stringify(jobs)), [jobs]);
  useEffect(() => localStorage.setItem('db_blogs', JSON.stringify(blogs)), [blogs]);
  useEffect(() => localStorage.setItem('db_requests', JSON.stringify(requests)), [requests]);
  useEffect(() => localStorage.setItem('db_grievances', JSON.stringify(grievances)), [grievances]);
  useEffect(() => localStorage.setItem('db_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('db_retail', JSON.stringify(retailProducts)), [retailProducts]);
  useEffect(() => localStorage.setItem('db_wholesale', JSON.stringify(wholesaleAds)), [wholesaleAds]);
  useEffect(() => localStorage.setItem('db_lawyers', JSON.stringify(lawyers)), [lawyers]);
  useEffect(() => localStorage.setItem('db_rates', JSON.stringify(exchangeRates)), [exchangeRates]);
  useEffect(() => localStorage.setItem('db_vocational', JSON.stringify(vocationalCourses)), [vocationalCourses]);
  useEffect(() => localStorage.setItem('db_donors', JSON.stringify(donors)), [donors]);
  useEffect(() => localStorage.setItem('db_enrolled', JSON.stringify(enrolledCourses)), [enrolledCourses]);
  useEffect(() => localStorage.setItem('db_market', JSON.stringify(marketPrices)), [marketPrices]);

  // Real-time synchronization across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return; // Ignore clear events or nulls
      try {
        if (e.key === 'db_jobs') setJobs(JSON.parse(e.newValue));
        if (e.key === 'db_blogs') setBlogs(JSON.parse(e.newValue));
        if (e.key === 'db_requests') setRequests(JSON.parse(e.newValue));
        if (e.key === 'db_grievances') setGrievances(JSON.parse(e.newValue));
        if (e.key === 'db_users') setUsers(JSON.parse(e.newValue));
        if (e.key === 'db_retail') setRetailProducts(JSON.parse(e.newValue));
        if (e.key === 'db_wholesale') setWholesaleAds(JSON.parse(e.newValue));
        if (e.key === 'db_lawyers') setLawyers(JSON.parse(e.newValue));
        if (e.key === 'db_rates') setExchangeRates(JSON.parse(e.newValue));
        if (e.key === 'db_vocational') setVocationalCourses(JSON.parse(e.newValue));
        if (e.key === 'db_donors') setDonors(JSON.parse(e.newValue));
        if (e.key === 'db_enrolled') setEnrolledCourses(JSON.parse(e.newValue));
        if (e.key === 'db_market') setMarketPrices(JSON.parse(e.newValue));
      } catch (err) {
        console.error("Error syncing storage:", err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- ACTIONS ---

  const refreshData = () => {
    fetchLiveNews();
  };

  const addJob = (job: any) => setJobs(prev => [{ ...job, id: Date.now(), status: 'Active', postedDate: new Date().toLocaleDateString(), views: 0 }, ...prev]);
  const updateJob = (updatedJob: any) => setJobs(prev => prev.map((j: any) => j.id === updatedJob.id ? updatedJob : j));
  const deleteJob = (id: number) => setJobs(prev => prev.filter((j: any) => j.id !== id));

  const addBlog = (blog: any) => setBlogs(prev => [{ ...blog, id: Date.now(), status: 'Active', postedDate: new Date().toLocaleDateString(), views: 0 }, ...prev]);
  const updateBlog = (updatedBlog: any) => setBlogs(prev => prev.map((b: any) => b.id === updatedBlog.id ? updatedBlog : b));
  const deleteBlog = (id: number) => setBlogs(prev => prev.filter((b: any) => b.id !== id));

  const addRequest = (request: any) => setRequests(prev => [{ ...request, id: Date.now(), status: 'Pending', postedDate: new Date().toLocaleDateString() }, ...prev]);
  const handleRequestAction = (item: any, action: 'approve' | 'reject') => {
    setRequests(prev => prev.filter((r: any) => r.id !== item.id));
    if (action === 'approve') {
      if (item.contentType === 'job') addJob(item);
      else addBlog(item);
    }
  };

  const addGrievance = (report: any) => setGrievances(prev => [{ ...report, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() }, ...prev]);
  const updateGrievanceStatus = (id: number, status: string) => setGrievances(prev => prev.map((g: any) => g.id === id ? { ...g, status } : g));
  const deleteGrievance = (id: number) => setGrievances(prev => prev.filter((g: any) => g.id !== id));

  const addUser = (user: any) => {
    if (users.some((u: any) => u.email === user.email)) { alert('Email already registered!'); return; }
    setUsers(prev => [...prev, { ...user, id: user.id || Date.now().toString(), status: 'Active', date: new Date().toLocaleDateString() }]);
  };
  const updateUserStatus = (id: string, status: 'Active' | 'Suspended') => setUsers(prev => prev.map((u: any) => u.id === id ? { ...u, status } : u));
  const deleteUser = (id: string) => setUsers(prev => prev.filter((u: any) => u.id !== id));
  const resetPassword = (email: string, newPass: string) => setUsers(prev => prev.map((u: any) => u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPass } : u));

  const updateMarketPrices = (newPrices: any[]) => setMarketPrices(newPrices);
  
  const addRetailProduct = (product: any) => setRetailProducts(prev => [...prev, { ...product, id: Date.now() }]);
  const updateRetailProduct = (product: any) => setRetailProducts(prev => prev.map((p: any) => p.id === product.id ? product : p));
  const deleteRetailProduct = (id: number) => setRetailProducts(prev => prev.filter((p: any) => p.id !== id));

  const addWholesaleAd = (ad: any) => setWholesaleAds(prev => [{ ...ad, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() }, ...prev]);
  const updateWholesaleAd = (updatedAd: any) => setWholesaleAds(prev => prev.map((ad: any) => ad.id === updatedAd.id ? updatedAd : ad));
  const deleteWholesaleAd = (id: number) => setWholesaleAds(prev => prev.filter((ad: any) => ad.id !== id));

  // --- NEW ACTIONS ---
  const addLawyer = (lawyer: any) => setLawyers(prev => [...prev, { ...lawyer, id: Date.now(), status: 'Active' }]);
  const deleteLawyer = (id: number) => setLawyers(prev => prev.filter((l: any) => l.id !== id));
  
  const updateExchangeRates = (newRates: any[]) => setExchangeRates(newRates);
  
  const addVocationalCourse = (course: any) => setVocationalCourses(prev => [...prev, { ...course, id: Date.now(), status: 'Active' }]);
  const deleteVocationalCourse = (id: number) => setVocationalCourses(prev => prev.filter((c: any) => c.id !== id));

  const addDonor = (donor: any) => setDonors(prev => [donor, ...prev]);
  const enrollCourse = (enrollment: any) => setEnrolledCourses(prev => [enrollment, ...prev]);

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
      addLawyer, deleteLawyer, updateExchangeRates, addVocationalCourse, deleteVocationalCourse,
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
