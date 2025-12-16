
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
  { id: 1, nameBn: 'তাজা আলু', nameEn: 'Fresh Potato', unit: 'kg', basePrice: 45 },
  { id: 2, nameBn: 'দেশি পেঁয়াজ', nameEn: 'Local Onion', unit: 'kg', basePrice: 90 },
  { id: 3, nameBn: 'রুই মাছ', nameEn: 'Rui Fish', unit: 'kg', basePrice: 350 },
  { id: 4, nameBn: 'মসুর ডাল', nameEn: 'Lentils', unit: 'kg', basePrice: 130 },
  { id: 5, nameBn: 'সবুজ আপেল', nameEn: 'Green Apple', unit: 'kg', basePrice: 220 },
  { id: 6, nameBn: 'সয়াবিন তেল', nameEn: 'Soybean Oil', unit: 'L', basePrice: 170 },
  { id: 7, nameBn: 'বেগুন', nameEn: 'Eggplant', unit: 'kg', basePrice: 60 },
  { id: 8, nameBn: 'ব্রয়লার মুরগি', nameEn: 'Broiler Chicken', unit: 'kg', basePrice: 190 },
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
  
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('db_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem('db_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('db_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('db_grievances');
    return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('db_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [marketPrices, setMarketPrices] = useState<any[]>([]);

  const [retailProducts, setRetailProducts] = useState(() => {
    const saved = localStorage.getItem('db_retail');
    return saved ? JSON.parse(saved) : INITIAL_RETAIL_PRODUCTS;
  });

  const [wholesaleAds, setWholesaleAds] = useState(() => {
    const saved = localStorage.getItem('db_wholesale');
    return saved ? JSON.parse(saved) : INITIAL_WHOLESALE_ADS;
  });

  // New State
  const [lawyers, setLawyers] = useState(() => {
    const saved = localStorage.getItem('db_lawyers');
    return saved ? JSON.parse(saved) : INITIAL_LAWYERS;
  });

  const [exchangeRates, setExchangeRates] = useState(() => {
    const saved = localStorage.getItem('db_rates');
    return saved ? JSON.parse(saved) : INITIAL_EXCHANGE_RATES;
  });

  const [vocationalCourses, setVocationalCourses] = useState(() => {
    const saved = localStorage.getItem('db_vocational');
    return saved ? JSON.parse(saved) : INITIAL_VOCATIONAL_COURSES;
  });

  // --- AUTOMATED DATA FETCHING ---
  const generateLiveMarketPrices = () => {
    const updatedPrices = BASE_MARKET_PRICES.map(item => {
      const variance = (Math.random() * 0.1) - 0.05; 
      const currentPrice = Math.round(item.basePrice * (1 + variance));
      const yesterdayPrice = item.basePrice;
      
      let trend = 'stable';
      if (currentPrice > yesterdayPrice) trend = 'up';
      if (currentPrice < yesterdayPrice) trend = 'down';

      return { ...item, today: currentPrice, yesterday: yesterdayPrice, trend };
    });
    setMarketPrices(updatedPrices);
  };

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
           const manualBlogs = prev.filter((b: any) => !b.id.toString().startsWith('news_'));
           return [...manualBlogs, ...fetchedBlogs];
        });
      }
    } catch (error) {
      console.error("Failed to fetch live news:", error);
    }
  };

  useEffect(() => {
    generateLiveMarketPrices();
    fetchLiveNews();
  }, []);

  // Persist Local Changes
  useEffect(() => localStorage.setItem('db_jobs', JSON.stringify(jobs)), [jobs]);
  useEffect(() => localStorage.setItem('db_blogs', JSON.stringify(blogs)), [blogs]);
  useEffect(() => localStorage.setItem('db_requests', JSON.stringify(requests)), [requests]);
  useEffect(() => localStorage.setItem('db_grievances', JSON.stringify(grievances)), [grievances]);
  useEffect(() => localStorage.setItem('db_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('db_retail', JSON.stringify(retailProducts)), [retailProducts]);
  useEffect(() => localStorage.setItem('db_wholesale', JSON.stringify(wholesaleAds)), [wholesaleAds]);
  // New Persist
  useEffect(() => localStorage.setItem('db_lawyers', JSON.stringify(lawyers)), [lawyers]);
  useEffect(() => localStorage.setItem('db_rates', JSON.stringify(exchangeRates)), [exchangeRates]);
  useEffect(() => localStorage.setItem('db_vocational', JSON.stringify(vocationalCourses)), [vocationalCourses]);

  // --- ACTIONS ---

  const refreshData = () => {
    generateLiveMarketPrices();
    fetchLiveNews();
  };

  const addJob = (job: any) => setJobs([{ ...job, id: Date.now(), status: 'Active', postedDate: new Date().toLocaleDateString(), views: 0 }, ...jobs]);
  const updateJob = (updatedJob: any) => setJobs(jobs.map((j: any) => j.id === updatedJob.id ? updatedJob : j));
  const deleteJob = (id: number) => setJobs(jobs.filter((j: any) => j.id !== id));

  const addBlog = (blog: any) => setBlogs([{ ...blog, id: Date.now(), status: 'Active', postedDate: new Date().toLocaleDateString(), views: 0 }, ...blogs]);
  const updateBlog = (updatedBlog: any) => setBlogs(blogs.map((b: any) => b.id === updatedBlog.id ? updatedBlog : b));
  const deleteBlog = (id: number) => setBlogs(blogs.filter((b: any) => b.id !== id));

  const addRequest = (request: any) => setRequests([{ ...request, id: Date.now(), status: 'Pending', postedDate: new Date().toLocaleDateString() }, ...requests]);
  const handleRequestAction = (item: any, action: 'approve' | 'reject') => {
    setRequests(requests.filter((r: any) => r.id !== item.id));
    if (action === 'approve') {
      if (item.contentType === 'job') addJob(item);
      else addBlog(item);
    }
  };

  const addGrievance = (report: any) => setGrievances([{ ...report, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() }, ...grievances]);
  const updateGrievanceStatus = (id: number, status: string) => setGrievances(grievances.map((g: any) => g.id === id ? { ...g, status } : g));
  const deleteGrievance = (id: number) => setGrievances(grievances.filter((g: any) => g.id !== id));

  const addUser = (user: any) => {
    if (users.some((u: any) => u.email === user.email)) { alert('Email already registered!'); return; }
    setUsers([...users, { ...user, id: user.id || Date.now().toString(), status: 'Active', date: new Date().toLocaleDateString() }]);
  };
  const updateUserStatus = (id: string, status: 'Active' | 'Suspended') => setUsers(users.map((u: any) => u.id === id ? { ...u, status } : u));
  const deleteUser = (id: string) => setUsers(users.filter((u: any) => u.id !== id));
  const resetPassword = (email: string, newPass: string) => setUsers(users.map((u: any) => u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPass } : u));

  const updateMarketPrices = (newPrices: any[]) => setMarketPrices(newPrices);
  
  const addRetailProduct = (product: any) => setRetailProducts([...retailProducts, { ...product, id: Date.now() }]);
  const updateRetailProduct = (product: any) => setRetailProducts(retailProducts.map((p: any) => p.id === product.id ? product : p));
  const deleteRetailProduct = (id: number) => setRetailProducts(retailProducts.filter((p: any) => p.id !== id));

  const addWholesaleAd = (ad: any) => setWholesaleAds([{ ...ad, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() }, ...wholesaleAds]);
  const updateWholesaleAd = (updatedAd: any) => setWholesaleAds(wholesaleAds.map((ad: any) => ad.id === updatedAd.id ? updatedAd : ad));
  const deleteWholesaleAd = (id: number) => setWholesaleAds(wholesaleAds.filter((ad: any) => ad.id !== id));

  // --- NEW ACTIONS ---
  const addLawyer = (lawyer: any) => setLawyers([...lawyers, { ...lawyer, id: Date.now(), status: 'Active' }]);
  const deleteLawyer = (id: number) => setLawyers(lawyers.filter((l: any) => l.id !== id));
  
  const updateExchangeRates = (newRates: any[]) => setExchangeRates(newRates);
  
  const addVocationalCourse = (course: any) => setVocationalCourses([...vocationalCourses, { ...course, id: Date.now(), status: 'Active' }]);
  const deleteVocationalCourse = (id: number) => setVocationalCourses(vocationalCourses.filter((c: any) => c.id !== id));

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, grievances, users, marketPrices, retailProducts, wholesaleAds,
      lawyers, exchangeRates, vocationalCourses,
      addJob, deleteJob, updateJob,
      addBlog, deleteBlog, updateBlog,
      addRequest, handleRequestAction,
      addGrievance, updateGrievanceStatus, deleteGrievance,
      addUser, updateUserStatus, deleteUser, resetPassword,
      updateMarketPrices,
      addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addWholesaleAd, updateWholesaleAd, deleteWholesaleAd,
      addLawyer, deleteLawyer, updateExchangeRates, addVocationalCourse, deleteVocationalCourse,
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
