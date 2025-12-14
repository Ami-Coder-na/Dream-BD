
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- INITIAL MOCK DATA (CLEARED FOR FRESH START) ---

const INITIAL_JOBS: any[] = [];
const INITIAL_BLOGS: any[] = [];
const INITIAL_MARKET_PRICES: any[] = [];
const INITIAL_RETAIL_PRODUCTS: any[] = [];
const INITIAL_WHOLESALE_ADS: any[] = [];
const INITIAL_REQUESTS: any[] = [];
const INITIAL_GRIEVANCES: any[] = [];
// Initial admin user to ensure system is accessible if localStorage is empty
const INITIAL_USERS: any[] = [
  {
    id: 'admin_01',
    name: 'Super Admin',
    email: 'admin@dreambd.com',
    password: 'admin123', // In real app, never store plain text
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    status: 'Active',
    date: new Date().toLocaleDateString()
  }
];

// --- CONTEXT SETUP ---

interface DataContextType {
  // Content State
  jobs: any[];
  blogs: any[];
  requests: any[];
  grievances: any[];
  users: any[]; // Added Users State
  
  // Market State
  marketPrices: any[];
  retailProducts: any[];
  wholesaleAds: any[];

  // Content Actions
  addJob: (job: any) => void;
  deleteJob: (id: number) => void;
  updateJob: (job: any) => void;
  addBlog: (blog: any) => void;
  deleteBlog: (id: number) => void;
  updateBlog: (blog: any) => void;
  
  // Request Actions (User Side)
  addRequest: (request: any) => void;
  handleRequestAction: (item: any, action: 'approve' | 'reject') => void;

  // Grievance Actions
  addGrievance: (report: any) => void;
  updateGrievanceStatus: (id: number, status: string) => void;
  deleteGrievance: (id: number) => void;

  // User Actions
  addUser: (user: any) => void;
  updateUserStatus: (id: string, status: 'Active' | 'Suspended') => void;
  deleteUser: (id: string) => void;
  resetPassword: (email: string, newPass: string) => void; // New Action

  // Market Actions
  updateMarketPrices: (prices: any[]) => void;
  addRetailProduct: (product: any) => void;
  deleteRetailProduct: (id: number) => void;
  updateRetailProduct: (product: any) => void;
  
  // Wholesale Actions
  addWholesaleAd: (ad: any) => void;
  updateWholesaleAd: (ad: any) => void; // For approving/rejecting or editing
  deleteWholesaleAd: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with localStorage check
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

  const [marketPrices, setMarketPrices] = useState(() => {
    const saved = localStorage.getItem('db_prices');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_PRICES;
  });

  const [retailProducts, setRetailProducts] = useState(() => {
    const saved = localStorage.getItem('db_retail');
    return saved ? JSON.parse(saved) : INITIAL_RETAIL_PRODUCTS;
  });

  const [wholesaleAds, setWholesaleAds] = useState(() => {
    const saved = localStorage.getItem('db_wholesale');
    return saved ? JSON.parse(saved) : INITIAL_WHOLESALE_ADS;
  });

  // Persist to localStorage
  useEffect(() => localStorage.setItem('db_jobs', JSON.stringify(jobs)), [jobs]);
  useEffect(() => localStorage.setItem('db_blogs', JSON.stringify(blogs)), [blogs]);
  useEffect(() => localStorage.setItem('db_requests', JSON.stringify(requests)), [requests]);
  useEffect(() => localStorage.setItem('db_grievances', JSON.stringify(grievances)), [grievances]);
  useEffect(() => localStorage.setItem('db_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('db_prices', JSON.stringify(marketPrices)), [marketPrices]);
  useEffect(() => localStorage.setItem('db_retail', JSON.stringify(retailProducts)), [retailProducts]);
  useEffect(() => localStorage.setItem('db_wholesale', JSON.stringify(wholesaleAds)), [wholesaleAds]);

  // --- ACTIONS ---

  const addJob = (job: any) => {
    const newJob = { 
      ...job, 
      id: Date.now(), 
      status: 'Active', 
      postedDate: new Date().toLocaleDateString(),
      views: 0,
      responsibilities: job.responsibilities || [] 
    };
    setJobs([newJob, ...jobs]);
  };

  const updateJob = (updatedJob: any) => {
    setJobs(jobs.map((j: any) => j.id === updatedJob.id ? updatedJob : j));
  };

  const deleteJob = (id: number) => {
    setJobs(jobs.filter((j: any) => j.id !== id));
  };

  const addBlog = (blog: any) => {
    const newBlog = {
      ...blog,
      id: Date.now(),
      status: 'Active',
      postedDate: new Date().toLocaleDateString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      views: 0,
      readTime: '3 min read'
    };
    setBlogs([newBlog, ...blogs]);
  };

  const updateBlog = (updatedBlog: any) => {
    setBlogs(blogs.map((b: any) => b.id === updatedBlog.id ? updatedBlog : b));
  };

  const deleteBlog = (id: number) => {
    setBlogs(blogs.filter((b: any) => b.id !== id));
  };

  const addRequest = (request: any) => {
    const newRequest = {
        ...request,
        id: Date.now(),
        status: 'Pending',
        postedDate: new Date().toLocaleDateString(),
        views: 0
    };
    setRequests([newRequest, ...requests]);
  };

  const handleRequestAction = (item: any, action: 'approve' | 'reject') => {
    setRequests(requests.filter((r: any) => r.id !== item.id));
    if (action === 'approve') {
      if (item.contentType === 'job') {
        addJob(item);
      } else {
        addBlog(item);
      }
    }
  };

  const addGrievance = (report: any) => {
    const newReport = {
        ...report,
        id: Date.now(),
        status: 'Pending',
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        severity: 'Medium' // Default
    };
    setGrievances([newReport, ...grievances]);
  };

  const updateGrievanceStatus = (id: number, status: string) => {
    setGrievances(grievances.map((g: any) => g.id === id ? { ...g, status } : g));
  };

  const deleteGrievance = (id: number) => {
    setGrievances(grievances.filter((g: any) => g.id !== id));
  };

  // User Actions
  const addUser = (user: any) => {
    // Check if email already exists
    if (users.some((u: any) => u.email === user.email)) {
      alert('Email already registered!');
      return;
    }
    const newUser = {
      ...user,
      id: user.id || Date.now().toString(),
      status: 'Active',
      date: new Date().toLocaleDateString()
    };
    setUsers([...users, newUser]);
  };

  const updateUserStatus = (id: string, status: 'Active' | 'Suspended') => {
    setUsers(users.map((u: any) => u.id === id ? { ...u, status } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((u: any) => u.id !== id));
  };

  const resetPassword = (email: string, newPass: string) => {
    setUsers(users.map((u: any) => u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPass } : u));
  };

  const updateMarketPrices = (newPrices: any[]) => {
    setMarketPrices(newPrices);
  };

  const addRetailProduct = (product: any) => {
      setRetailProducts([...retailProducts, { ...product, id: Date.now() }]);
  };

  const updateRetailProduct = (product: any) => {
      setRetailProducts(retailProducts.map((p: any) => p.id === product.id ? product : p));
  };

  const deleteRetailProduct = (id: number) => {
      setRetailProducts(retailProducts.filter((p: any) => p.id !== id));
  };

  const addWholesaleAd = (ad: any) => {
      const newAd = { ...ad, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() };
      setWholesaleAds([newAd, ...wholesaleAds]);
  };

  const updateWholesaleAd = (updatedAd: any) => {
      setWholesaleAds(wholesaleAds.map((ad: any) => ad.id === updatedAd.id ? updatedAd : ad));
  };

  const deleteWholesaleAd = (id: number) => {
      setWholesaleAds(wholesaleAds.filter((ad: any) => ad.id !== id));
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, grievances, users, marketPrices, retailProducts, wholesaleAds,
      addJob, deleteJob, updateJob,
      addBlog, deleteBlog, updateBlog,
      addRequest, handleRequestAction,
      addGrievance, updateGrievanceStatus, deleteGrievance,
      addUser, updateUserStatus, deleteUser, resetPassword,
      updateMarketPrices,
      addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addWholesaleAd, updateWholesaleAd, deleteWholesaleAd
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
