
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- INITIAL MOCK DATA (Moved from individual files) ---

const INITIAL_JOBS = [
  {
    id: 1,
    title: 'Assistant Director / সহকারী পরিচালক',
    company: 'Bangladesh Bank',
    location: 'Dhaka',
    salary: 'Grade 9',
    category: 'Autonomous',
    type: 'Full Time',
    level: 'Entry',
    posted: '2 days ago',
    deadline: '2023-10-30',
    description: 'Bangladesh Bank is looking for Assistant Directors for their General Banking division. / বাংলাদেশ ব্যাংক তাদের সাধারণ ব্যাংকিং বিভাগের জন্য সহকারী পরিচালক খুঁজছে।',
    responsibilities: ['Policy formulation', 'Supervising banking activities', 'Preparing reports'],
    status: 'Active',
    postedBy: 'Admin',
    views: 1250,
    postedDate: '2023-10-25'
  },
  {
    id: 2,
    title: 'Software Engineer / সফটওয়্যার ইঞ্জিনিয়ার',
    company: 'Pathao',
    location: 'Dhaka',
    salary: '৳ 60,000 - 80,000',
    category: 'Private',
    type: 'Full Time',
    level: 'Mid',
    posted: '1 day ago',
    deadline: '2023-11-15',
    description: 'We are looking for a skilled Full-Stack Developer to join our core team.',
    responsibilities: ['Developing new features', 'Optimizing code', 'Bug fixing'],
    status: 'Active',
    postedBy: 'Admin',
    views: 3400,
    postedDate: '2023-10-20'
  }
];

const INITIAL_BLOGS = [
  {
    id: 201,
    title: 'Adoption of Modern Agriculture / আধুনিক কৃষি প্রযুক্তি',
    category: 'Agriculture',
    author: 'Dr. Rahim',
    postedDate: '2023-10-15',
    views: 5600,
    status: 'Active',
    content: 'Smart sensors and drones are revolutionizing farming in Bangladesh...',
    image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26',
    excerpt: 'How farmers are increasing yields using smart sensors.',
    readTime: '5 min read',
    date: 'Oct 15, 2023'
  },
  {
    id: 203,
    title: 'Safe Driving Rules / নিরাপদ কি',
    category: 'Transport',
    author: 'Admin',
    postedDate: '2023-10-10',
    views: 2100,
    status: 'Active',
    content: 'Traffic rules you must follow for safety...',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    excerpt: 'Traffic rules you must follow...',
    readTime: '3 min read',
    date: 'Oct 10, 2023'
  },
];

const INITIAL_MARKET_PRICES = [
  { id: 1, nameBn: 'বেগুন (গোল)', nameEn: 'Eggplant (Round)', today: 60, yesterday: 55, unit: 'kg', trend: 'up' },
  { id: 2, nameBn: 'কাঁচা মরিচ', nameEn: 'Green Chili', today: 120, yesterday: 140, unit: 'kg', trend: 'down' },
  { id: 3, nameBn: 'টমেটো', nameEn: 'Tomato', today: 40, yesterday: 40, unit: 'kg', trend: 'stable' },
  { id: 4, nameBn: 'মুরগি (ব্রয়লার)', nameEn: 'Chicken (Broiler)', today: 210, yesterday: 200, unit: 'kg', trend: 'up' },
  { id: 5, nameBn: 'পেঁয়াজ (দেশি)', nameEn: 'Onion (Local)', today: 90, yesterday: 85, unit: 'kg', trend: 'up' },
];

const INITIAL_REQUESTS = [
  { id: 301, contentType: 'job', title: 'Farm Manager', company: 'Green Agro', location: 'Rangpur', salary: '25k', postedBy: 'Rahim Uddin', postedDate: '2023-10-26', views: 0, status: 'Pending', description: 'Managing daily farm operations.', category: 'Private', type: 'Full Time', level: 'Mid' },
  { id: 303, contentType: 'blog', title: 'Winter Farming Tips', category: 'Agriculture', author: 'Abdul Malek', postedDate: '2023-10-24', views: 0, status: 'Pending', content: 'Best crops to grow in winter...', image: '', excerpt: 'Tips for winter...', readTime: '3 min', date: 'Today' },
];

// --- CONTEXT SETUP ---

interface DataContextType {
  jobs: any[];
  blogs: any[];
  requests: any[];
  marketPrices: any[];
  addJob: (job: any) => void;
  deleteJob: (id: number) => void;
  updateJob: (job: any) => void; // Added for edit
  addBlog: (blog: any) => void;
  deleteBlog: (id: number) => void;
  updateBlog: (blog: any) => void; // Added for edit
  updateMarketPrices: (prices: any[]) => void;
  handleRequestAction: (item: any, action: 'approve' | 'reject') => void;
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

  const [marketPrices, setMarketPrices] = useState(() => {
    const saved = localStorage.getItem('db_prices');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_PRICES;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => localStorage.setItem('db_jobs', JSON.stringify(jobs)), [jobs]);
  useEffect(() => localStorage.setItem('db_blogs', JSON.stringify(blogs)), [blogs]);
  useEffect(() => localStorage.setItem('db_requests', JSON.stringify(requests)), [requests]);
  useEffect(() => localStorage.setItem('db_prices', JSON.stringify(marketPrices)), [marketPrices]);

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

  const updateMarketPrices = (newPrices: any[]) => {
    setMarketPrices(newPrices);
  };

  const handleRequestAction = (item: any, action: 'approve' | 'reject') => {
    setRequests(requests.filter((r: any) => r.id !== item.id));
    if (action === 'approve') {
      if (item.contentType === 'job') {
        const newJob = { ...item, status: 'Active', postedDate: new Date().toLocaleDateString(), id: Date.now() };
        setJobs([newJob, ...jobs]);
      } else {
        const newBlog = { ...item, status: 'Active', postedDate: new Date().toLocaleDateString(), id: Date.now() };
        setBlogs([newBlog, ...blogs]);
      }
    }
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, marketPrices,
      addJob, deleteJob, updateJob,
      addBlog, deleteBlog, updateBlog,
      updateMarketPrices, handleRequestAction 
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
