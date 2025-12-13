import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Settings, Database, Activity, 
  LogOut, Shield, Bell, Lock, Search, Eye, Edit3, Trash2, 
  BarChart2, Server, AlertTriangle, CheckCircle, X,
  FileText, Globe, UserPlus, Info, Mail, Key, EyeOff, Sparkles,
  ShoppingBag, Truck, AlertOctagon, MessageSquare, Check, RotateCcw,
  TrendingUp, DollarSign, PieChart, Clock, Briefcase,
  Sprout, Stethoscope, BookOpen, Home, Navigation, Plus,
  ArrowLeft, MapPin, Phone, Calendar, Fish, Recycle, Hammer, Filter, MoreHorizontal, User, Save,
  UserCheck, UserX, CalendarDays, XCircle, PenTool, BarChart3, ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AppModule } from '../../types';

interface Props {
  isBangla: boolean;
  onExit: () => void;
}

type AdminSection = 'overview' | 'users' | 'content' | 'module-config' | 'market' | 'grievance' | 'emergency' | 'settings';
type ConfigTab = 'agri' | 'health' | 'edu' | 'transport' | 'disaster' | 'fishery' | 'craft' | 'waste' | 'jela';
type UserViewMode = 'list' | 'add' | 'details';
type ContentTab = 'jobs' | 'blogs' | 'requests';
type ContentViewMode = 'list' | 'form' | 'details';

// --- MOCK DATA ---

const MOCK_USERS = [
  { id: '1', name: 'Rahim Uddin', role: 'Farmer', email: 'rahim@agri.com', status: 'Active', date: '2023-10-01' },
  { id: '2', name: 'Dr. Nusrat', role: 'Doctor', email: 'nusrat@health.com', status: 'Active', date: '2023-09-15' },
  { id: '3', name: 'Karim Transport', role: 'Transport Operator', email: 'karim@bus.com', status: 'Suspended', date: '2023-11-20' },
  { id: '4', name: 'Sumaiya Akter', role: 'Vendor', email: 'sumaiya@craft.com', status: 'Active', date: '2023-12-05' },
  { id: '5', name: 'Rafiqul Islam', role: 'Citizen', email: 'rafiq@mail.com', status: 'Active', date: '2024-01-10' },
];

const getMockActivity = (userName: string) => [
  { action: 'Logged in', date: 'Today, 9:00 AM' },
  { action: 'Updated profile picture', date: 'Yesterday, 4:30 PM' },
  { action: 'Viewed Agriculture Module', date: 'Oct 24, 2023' },
  { action: 'Posted a comment on Forum', date: 'Oct 22, 2023' },
  { action: 'Changed password', date: 'Oct 10, 2023' }
];

const INITIAL_JOBS = [
  { id: 101, title: 'Assistant Teacher', company: 'Little Flower School', type: 'Full Time', location: 'Dhaka', salary: '15k-20k', description: 'Teaching mathematics to primary students.', postedBy: 'Admin', authorName: 'Admin', date: '2023-10-25', status: 'Active', views: 1250 },
  { id: 102, title: 'Farm Manager', company: 'Green Agro', type: 'Contract', location: 'Rangpur', salary: '25k', description: 'Managing daily farm operations and labor.', postedBy: 'User', authorName: 'Rahim Uddin', date: '2023-10-26', status: 'Pending', views: 0 },
  { id: 103, title: 'Software Engineer', company: 'Tech BD', type: 'Remote', location: 'Dhaka', salary: '50k+', description: 'React and Node.js developer needed.', postedBy: 'Admin', authorName: 'Admin', date: '2023-10-20', status: 'Active', views: 3400 },
  { id: 104, title: 'Driver Needed', company: 'Desh Transport', type: 'Full Time', location: 'Chittagong', salary: '18k', description: 'Bus driver with 5 years experience.', postedBy: 'User', authorName: 'Karim Transport', date: '2023-10-27', status: 'Pending', views: 0 },
];

const INITIAL_BLOGS = [
  { id: 201, title: 'Winter Farming Tips', category: 'Agriculture', content: 'Detailed guide on winter vegetables...', author: 'Abdul Malek', postedBy: 'User', date: '2023-10-24', status: 'Pending', views: 0 },
  { id: 202, title: 'Digital Health Services', category: 'Health', content: 'How telemedicine is changing lives...', author: 'Dr. Nusrat', postedBy: 'Admin', date: '2023-10-15', status: 'Active', views: 5600 },
  { id: 203, title: 'Safe Driving Rules', category: 'Transport', content: 'Traffic rules everyone must obey...', author: 'Admin', postedBy: 'Admin', date: '2023-10-10', status: 'Active', views: 2100 },
];

const MARKET_ITEMS_INIT = [
  { id: 1, name: 'Rice (Miniket)', price: 68, unit: 'kg' },
  { id: 2, name: 'Potato', price: 45, unit: 'kg' },
  { id: 3, name: 'Onion (Local)', price: 90, unit: 'kg' },
  { id: 4, name: 'Rui Fish', price: 350, unit: 'kg' },
  { id: 5, name: 'Broiler Chicken', price: 190, unit: 'kg' },
];

const WASTE_REPORTS_INIT = [
  { id: 301, area: 'Mirpur 10', description: 'Overflowing dustbin near bus stand', status: 'Pending', date: 'Today, 10 AM' },
  { id: 302, area: 'Dhanmondi 27', description: 'Construction debris on road', status: 'Resolved', date: 'Yesterday' },
];

const MODULE_STATUS = {
  [AppModule.AGRI]: true,
  [AppModule.HEALTH]: true,
  [AppModule.EDU]: true,
  [AppModule.TRANSPORT]: true,
  [AppModule.WASTE]: true,
  [AppModule.FISHERY]: true,
  [AppModule.DISASTER]: true,
  [AppModule.CRAFT]: true,
  [AppModule.JOB]: true,
  [AppModule.BLOG]: true,
  [AppModule.BAZAR_SODAI]: true,
};

// --- CONFIG MOCK DATA ---
const ADMIN_CROPS = [
  { id: 1, name: 'Rice (Paddy)', season: 'Monsoon', water: 'High' },
  { id: 2, name: 'Potato', season: 'Winter', water: 'Medium' },
  { id: 3, name: 'Jute', season: 'Summer', water: 'Medium' },
];

const ADMIN_HOSPITALS = [
  { id: 1, name: 'Dhaka Medical College', district: 'Dhaka', type: 'Public' },
  { id: 2, name: 'Square Hospital', district: 'Dhaka', type: 'Private' },
  { id: 3, name: 'Chittagong Medical', district: 'Chittagong', type: 'Public' },
];

const ADMIN_ROUTES = [
  { id: 1, route: 'Dhaka - Chittagong', mode: 'Bus', fare: '800' },
  { id: 2, route: 'Dhaka - Sylhet', mode: 'Train', fare: '450' },
];

const ADMIN_BOOKS = [
  { id: 1, title: 'Amar Bangla Boi', class: 'Class 5', subject: 'Bangla' },
  { id: 2, title: 'English For Today', class: 'Class 9', subject: 'English' },
];

const ADMIN_SHELTERS = [
  { id: 1, name: 'Model School Shelter', district: 'Cox\'s Bazar', capacity: 500 },
  { id: 2, name: 'Union Parishad', district: 'Bhola', capacity: 300 },
];

const ADMIN_FISHES = [
  { id: 1, name: 'Rui', type: 'Freshwater', feed: 'Commercial' },
  { id: 2, name: 'Tilapia', type: 'Freshwater', feed: 'Natural/Commercial' },
  { id: 3, name: 'Shrimp (Bagda)', type: 'Saline', feed: 'Specialized' },
];

const ADMIN_CRAFTS = [
  { id: 1, name: 'Nakshi Kantha', category: 'Textile', artisan: 'Rahima Begum' },
  { id: 2, name: 'Jamdani Saree', category: 'Textile', artisan: 'Rupganj Weavers' },
  { id: 3, name: 'Terracotta Pot', category: 'Pottery', artisan: 'Pal Para' },
];

const ADMIN_WASTE_ZONES = [
  { id: 1, zone: 'Mirpur Zone-1', truck: 'Truck-A12', timing: '6 AM - 8 AM' },
  { id: 2, zone: 'Dhanmondi West', truck: 'Truck-B05', timing: '7 AM - 9 AM' },
];

const ADMIN_DISTRICTS = [
  { id: 1, name: 'Dhaka', division: 'Dhaka', spots: 12 },
  { id: 2, name: 'Cox\'s Bazar', division: 'Chattogram', spots: 8 },
  { id: 3, name: 'Sylhet', division: 'Sylhet', spots: 15 },
];

export const AdminModule: React.FC<Props> = ({ isBangla, onExit }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard State
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('agri');
  
  // User Management State
  const [users, setUsers] = useState(MOCK_USERS);
  const [userViewMode, setUserViewMode] = useState<UserViewMode>('list');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'Citizen', password: '' });
  const [viewingUser, setViewingUser] = useState<any>(null);

  // Content Management State
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  
  const [activeContentTab, setActiveContentTab] = useState<ContentTab>('jobs');
  const [contentViewMode, setContentViewMode] = useState<ContentViewMode>('list');
  const [contentSearch, setContentSearch] = useState('');
  const [viewingContent, setViewingContent] = useState<any>(null); // For Details view or Editing
  
  // Forms
  const [jobForm, setJobForm] = useState({ title: '', company: '', type: 'Full Time', location: '', salary: '', description: '', deadline: '' });
  const [blogForm, setBlogForm] = useState({ title: '', category: '', content: '', author: '', readTime: '', image: '' });

  const [modules, setModules] = useState(MODULE_STATUS);
  const [configSearch, setConfigSearch] = useState('');
  
  // Feature Data State
  const [marketItems, setMarketItems] = useState(MARKET_ITEMS_INIT);
  const [wasteReports, setWasteReports] = useState(WASTE_REPORTS_INIT);
  
  // Config Data State
  const [adminCrops, setAdminCrops] = useState(ADMIN_CROPS);
  const [adminHospitals, setAdminHospitals] = useState(ADMIN_HOSPITALS);
  const [adminRoutes, setAdminRoutes] = useState(ADMIN_ROUTES);
  const [adminBooks, setAdminBooks] = useState(ADMIN_BOOKS);
  const [adminShelters, setAdminShelters] = useState(ADMIN_SHELTERS);
  const [adminFishes, setAdminFishes] = useState(ADMIN_FISHES);
  const [adminCrafts, setAdminCrafts] = useState(ADMIN_CRAFTS);
  const [adminWasteZones, setAdminWasteZones] = useState(ADMIN_WASTE_ZONES);
  const [adminDistricts, setAdminDistricts] = useState(ADMIN_DISTRICTS);

  // Alert State
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'danger'>('info');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Derived State for Overview
  const pendingJobsCount = jobs.filter(j => j.status === 'Pending').length;
  const pendingBlogsCount = blogs.filter(b => b.status === 'Pending').length;

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === 'admin@dreambd.com' && password === 'admin123') || (email === 'demo' && password === 'demo')) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Credentials. Try admin@dreambd.com / admin123');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@dreambd.com');
    setPassword('admin123');
  };

  // --- CONTENT ACTIONS ---

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date().toISOString().split('T')[0];
    
    if (activeContentTab === 'jobs') {
      const newJob = {
        id: Date.now(),
        ...jobForm,
        postedBy: 'Admin',
        authorName: 'Admin',
        date,
        status: 'Active',
        views: 0
      };
      if (viewingContent?.id) {
        // Edit Mode
        setJobs(jobs.map(j => j.id === viewingContent.id ? { ...j, ...jobForm } : j));
      } else {
        setJobs([newJob, ...jobs]);
      }
      setJobForm({ title: '', company: '', type: 'Full Time', location: '', salary: '', description: '', deadline: '' });
    } else {
      const newBlog = {
        id: Date.now(),
        ...blogForm,
        postedBy: 'Admin',
        date,
        status: 'Active',
        views: 0
      };
      if (viewingContent?.id) {
        setBlogs(blogs.map(b => b.id === viewingContent.id ? { ...b, ...blogForm } : b));
      } else {
        setBlogs([newBlog, ...blogs]);
      }
      setBlogForm({ title: '', category: '', content: '', author: 'Admin', readTime: '5 min', image: '' });
    }
    setContentViewMode('list');
    setViewingContent(null);
  };

  const handleEditContent = (item: any, type: 'job' | 'blog') => {
    setViewingContent(item);
    if (type === 'job') {
      setJobForm({ 
        title: item.title, company: item.company, type: item.type, 
        location: item.location, salary: item.salary, description: item.description, deadline: item.deadline || ''
      });
      setActiveContentTab('jobs');
    } else {
      setBlogForm({ 
        title: item.title, category: item.category, content: item.content, 
        author: item.author, readTime: item.readTime || '5 min', image: item.image || ''
      });
      setActiveContentTab('blogs');
    }
    setContentViewMode('form');
  };

  const handleViewContent = (item: any) => {
    setViewingContent(item);
    setContentViewMode('details');
  };

  const handleDeleteContent = (id: number, type: 'job' | 'blog') => {
    if(!confirm('Are you sure you want to delete this?')) return;
    if (type === 'job') setJobs(jobs.filter(j => j.id !== id));
    else setBlogs(blogs.filter(b => b.id !== id));
    
    if (viewingContent && viewingContent.id === id) {
      setContentViewMode('list');
      setViewingContent(null);
    }
  };

  const handleStatusChange = (id: number, type: 'job' | 'blog', newStatus: string) => {
    if (type === 'job') {
      setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
    } else {
      setBlogs(blogs.map(b => b.id === id ? { ...b, status: newStatus } : b));
    }
    // If viewing details, update the view state too
    if (viewingContent && viewingContent.id === id) {
        setViewingContent(prev => ({ ...prev, status: newStatus }));
    }
  };

  // --- USER ACTIONS ---

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    if (viewingUser && viewingUser.id === id) {
        setViewingUser(prev => ({ ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' }));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        setUsers(users.filter(u => u.id !== id));
        if (userViewMode === 'details') {
            setUserViewMode('list');
            setViewingUser(null);
        }
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newUserForm.name || !newUserForm.email || !newUserForm.password) return;
    const user = {
      id: Date.now().toString(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'Active',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    setUsers([user, ...users]);
    setNewUserForm({ name: '', email: '', role: 'Citizen', password: '' });
    setUserViewMode('list');
    alert(isBangla ? 'ব্যবহারকারী সফলভাবে তৈরি হয়েছে!' : 'User created successfully!');
  };

  const handleViewUser = (user: any) => {
    setViewingUser(user);
    setUserViewMode('details');
  };

  const handleUpdatePrice = (id: number, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (!isNaN(price)) {
      setMarketItems(marketItems.map(item => item.id === id ? { ...item, price } : item));
    }
  };

  const handleResolveReport = (id: number) => {
    setWasteReports(wasteReports.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setAlertMessage('');
    }, 3000);
  };

  // Generic Delete for Config Items
  const handleDeleteConfigItem = (type: ConfigTab, id: number) => {
    if(!confirm('Delete this item?')) return;
    if(type === 'agri') setAdminCrops(adminCrops.filter(i => i.id !== id));
    if(type === 'health') setAdminHospitals(adminHospitals.filter(i => i.id !== id));
    if(type === 'transport') setAdminRoutes(adminRoutes.filter(i => i.id !== id));
    if(type === 'edu') setAdminBooks(adminBooks.filter(i => i.id !== id));
    if(type === 'disaster') setAdminShelters(adminShelters.filter(i => i.id !== id));
    if(type === 'fishery') setAdminFishes(adminFishes.filter(i => i.id !== id));
    if(type === 'craft') setAdminCrafts(adminCrafts.filter(i => i.id !== id));
    if(type === 'waste') setAdminWasteZones(adminWasteZones.filter(i => i.id !== id));
    if(type === 'jela') setAdminDistricts(adminDistricts.filter(i => i.id !== id));
  };

  const handleAddConfigItem = (type: ConfigTab) => {
    const name = prompt('Enter Name/Title:');
    if(!name) return;
    const id = Date.now();
    
    if(type === 'agri') setAdminCrops([...adminCrops, { id, name, season: 'New Season', water: 'Medium' }]);
    if(type === 'health') setAdminHospitals([...adminHospitals, { id, name, district: 'Dhaka', type: 'Public' }]);
    if(type === 'transport') setAdminRoutes([...adminRoutes, { id, route: name, mode: 'Bus', fare: '0' }]);
    if(type === 'edu') setAdminBooks([...adminBooks, { id, title: name, class: 'General', subject: 'General' }]);
    if(type === 'disaster') setAdminShelters([...adminShelters, { id, name, district: 'Dhaka', capacity: 100 }]);
    if(type === 'fishery') setAdminFishes([...adminFishes, { id, name, type: 'Freshwater', feed: 'General' }]);
    if(type === 'craft') setAdminCrafts([...adminCrafts, { id, name, category: 'General', artisan: 'Unknown' }]);
    if(type === 'waste') setAdminWasteZones([...adminWasteZones, { id, zone: name, truck: 'Pending', timing: 'TBD' }]);
    if(type === 'jela') setAdminDistricts([...adminDistricts, { id, name, division: 'Dhaka', spots: 0 }]);
  };

  // --- RENDERERS ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-[400px] w-full text-center animate-fade-in relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-gray-100">
              <Shield size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Admin Portal</h2>
            <p className="text-gray-500 mb-8 text-sm font-medium">Secure login required.</p>
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#0f172a] hover:bg-gray-800 text-white py-3 rounded-lg text-base font-semibold shadow-lg shadow-gray-200 mt-2">Login to Dashboard</Button>
            </form>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button onClick={fillDemoCredentials} className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"><Sparkles size={16} /> Use Demo Credentials</button>
            </div>
            <button onClick={onExit} className="mt-6 text-xs text-gray-400 hover:text-gray-800 font-medium hover:underline transition-colors">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // --- CONTENT SUB-COMPONENTS ---

  const renderContentForm = () => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {activeContentTab === 'jobs' ? <Briefcase size={24}/> : <PenTool size={24}/>} 
                {viewingContent ? 'Edit' : 'Create'} {activeContentTab === 'jobs' ? 'Job' : 'Blog'}
            </h3>
            <Button onClick={() => { setContentViewMode('list'); setViewingContent(null); }} variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={18} /> Back to List
            </Button>
        </div>
        
        <form onSubmit={handleCreateContent} className="space-y-6">
            {activeContentTab === 'jobs' ? (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                        <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="Software Engineer" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                        <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                           <option>Full Time</option><option>Part Time</option><option>Contract</option><option>Remote</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                        <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="Dhaka" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Salary Range</label>
                        <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="20k-30k" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Deadline</label>
                        <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                     <textarea required rows={6} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} placeholder="Job details..."></textarea>
                  </div>
               </>
            ) : (
               <>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Blog Title</label>
                     <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Article Headline" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}>
                           <option value="">Select Category</option><option>Agriculture</option><option>Health</option><option>Education</option><option>Transport</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Author</label>
                        <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                     <textarea required rows={10} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Write blog content here..."></textarea>
                  </div>
               </>
            )}
            <div className="pt-4 flex justify-end gap-3">
               <Button type="button" variant="outline" onClick={() => { setContentViewMode('list'); setViewingContent(null); }}>Cancel</Button>
               <Button type="submit">{viewingContent ? 'Update' : 'Publish'}</Button>
            </div>
        </form>
    </div>
  );

  const renderContentDetails = () => {
    if (!viewingContent) return null;
    const isJob = 'company' in viewingContent;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in max-w-4xl mx-auto">
         <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
            <Button onClick={() => setContentViewMode('list')} variant="outline" className="flex items-center gap-2">
               <ArrowLeft size={18} /> Back
            </Button>
            <div className="flex gap-2">
               {viewingContent.status === 'Pending' && (
                 <>
                   <Button onClick={() => handleStatusChange(viewingContent.id, isJob ? 'job' : 'blog', 'Active')} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                     <Check size={18} /> Approve
                   </Button>
                   <Button onClick={() => handleStatusChange(viewingContent.id, isJob ? 'job' : 'blog', 'Rejected')} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                     <X size={18} /> Reject
                   </Button>
                 </>
               )}
               <Button onClick={() => handleEditContent(viewingContent, isJob ? 'job' : 'blog')} variant="outline">
                 <Edit3 size={18} />
               </Button>
            </div>
         </div>
         <div className="p-8">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${viewingContent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
               {viewingContent.status}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{viewingContent.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-6">
               <span className="flex items-center gap-2"><User size={16}/> {viewingContent.author || viewingContent.authorName}</span>
               <span className="flex items-center gap-2"><Calendar size={16}/> {viewingContent.date}</span>
               <span className="flex items-center gap-2"><Eye size={16}/> {viewingContent.views} views</span>
               {isJob && (
                 <>
                   <span className="flex items-center gap-2"><Briefcase size={16}/> {viewingContent.company}</span>
                   <span className="flex items-center gap-2"><MapPin size={16}/> {viewingContent.location}</span>
                   <span className="flex items-center gap-2 font-bold text-green-600"><DollarSign size={16}/> {viewingContent.salary}</span>
                 </>
               )}
            </div>

            <div className="prose max-w-none text-gray-800">
               <h3 className="text-lg font-bold mb-3">{isJob ? 'Job Description' : 'Content'}</h3>
               <p className="whitespace-pre-wrap leading-relaxed">{isJob ? viewingContent.description : viewingContent.content}</p>
            </div>
         </div>
      </div>
    );
  };

  const renderContentManagement = () => {
    if (contentViewMode === 'form') return renderContentForm();
    if (contentViewMode === 'details') return renderContentDetails();

    // List View Logic
    const pendingJobs = jobs.filter(j => j.status === 'Pending');
    const pendingBlogs = blogs.filter(b => b.status === 'Pending');

    const activeList = activeContentTab === 'jobs' ? jobs.filter(j => j.status !== 'Pending') 
                     : activeContentTab === 'blogs' ? blogs.filter(b => b.status !== 'Pending')
                     : []; // Requests tab handles its own lists

    const filteredList = activeList.filter((item: any) => 
        item.title.toLowerCase().includes(contentSearch.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-fade-in">
        
        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
           {/* Tab Switcher */}
           <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
              <button 
                onClick={() => { setActiveContentTab('jobs'); }}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeContentTab === 'jobs' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Jobs
              </button>
              <button 
                onClick={() => { setActiveContentTab('blogs'); }}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeContentTab === 'blogs' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Blogs
              </button>
              <button 
                onClick={() => { setActiveContentTab('requests'); }}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeContentTab === 'requests' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Requests 
                {(pendingJobsCount + pendingBlogsCount) > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingJobsCount + pendingBlogsCount}</span>
                )}
              </button>
           </div>

           {/* Search & Actions (Only for main lists) */}
           {activeContentTab !== 'requests' && (
             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={contentSearch} 
                    onChange={(e) => setContentSearch(e.target.value)} 
                    className="pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full" 
                  />
                </div>

                <Button onClick={() => { setContentViewMode('form'); setViewingContent(null); }} className="whitespace-nowrap">
                   <Plus size={18} className="mr-2" /> 
                   {activeContentTab === 'jobs' ? 'Post Job' : 'Write Blog'}
                </Button>
             </div>
           )}
        </div>

        {/* Requests Tab Content */}
        {activeContentTab === 'requests' ? (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Jobs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase className="text-purple-600" size={20}/> Pending Jobs ({pendingJobs.length})
                 </h3>
                 <div className="space-y-3">
                    {pendingJobs.map(job => (
                       <div key={job.id} className="p-4 border border-gray-100 rounded-xl hover:bg-purple-50/50 transition-colors bg-white">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h4 className="font-bold text-gray-900">{job.title}</h4>
                                <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                             </div>
                             <span className="text-xs text-gray-400">{job.date}</span>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Posted by: {job.postedBy}</span>
                             <div className="flex gap-2">
                                <button onClick={() => handleViewContent(job)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="View"><Eye size={16}/></button>
                                <button onClick={() => handleStatusChange(job.id, 'job', 'Active')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve"><Check size={16}/></button>
                                <button onClick={() => handleStatusChange(job.id, 'job', 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject"><X size={16}/></button>
                             </div>
                          </div>
                       </div>
                    ))}
                    {pendingJobs.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No pending jobs.</p>}
                 </div>
              </div>

              {/* Pending Blogs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="text-blue-600" size={20}/> Pending Blogs ({pendingBlogs.length})
                 </h3>
                 <div className="space-y-3">
                    {pendingBlogs.map(blog => (
                       <div key={blog.id} className="p-4 border border-gray-100 rounded-xl hover:bg-blue-50/50 transition-colors bg-white">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h4 className="font-bold text-gray-900">{blog.title}</h4>
                                <p className="text-sm text-gray-500">Category: {blog.category}</p>
                             </div>
                             <span className="text-xs text-gray-400">{blog.date}</span>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Author: {blog.author}</span>
                             <div className="flex gap-2">
                                <button onClick={() => handleViewContent(blog)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="View"><Eye size={16}/></button>
                                <button onClick={() => handleStatusChange(blog.id, 'blog', 'Active')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve"><Check size={16}/></button>
                                <button onClick={() => handleStatusChange(blog.id, 'blog', 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject"><X size={16}/></button>
                             </div>
                          </div>
                       </div>
                    ))}
                    {pendingBlogs.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No pending blogs.</p>}
                 </div>
              </div>
           </div>
        ) : (
           /* Active Content List Table */
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                       <tr>
                          <th className="p-4">{activeContentTab === 'jobs' ? 'Job Title' : 'Blog Title'}</th>
                          <th className="p-4">{activeContentTab === 'jobs' ? 'Company/Details' : 'Category/Author'}</th>
                          <th className="p-4">Posted Date</th>
                          <th className="p-4">Views</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {filteredList.map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                             <td className="p-4 font-bold text-gray-900">{item.title}</td>
                             <td className="p-4 text-gray-600">
                                {activeContentTab === 'jobs' ? `${item.company} (${item.type})` : `${item.category} by ${item.author}`}
                             </td>
                             <td className="p-4 text-gray-500">{item.date}</td>
                             <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{item.views}</span></td>
                             <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span></td>
                             <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                   <button onClick={() => handleViewContent(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={18}/></button>
                                   <button onClick={() => handleEditContent(item, activeContentTab === 'jobs' ? 'job' : 'blog')} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"><Edit3 size={18}/></button>
                                   <button onClick={() => handleDeleteContent(item.id, activeContentTab === 'jobs' ? 'job' : 'blog')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                       {filteredList.length === 0 && (
                          <tr><td colSpan={6} className="p-12 text-center text-gray-400">No content found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>
    );
  };

  // --- DASHBOARD SECTIONS ---

  const renderOverview = () => {
    return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">12,450</h3>
            <p className="text-green-500 text-xs mt-2 flex items-center gap-1 font-medium">
              <TrendingUp size={12} /> +12% this week
            </p>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Users size={24}/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">৳ 8.5M</h3>
            <p className="text-green-500 text-xs mt-2 flex items-center gap-1 font-medium">
              <TrendingUp size={12} /> +5.4% this month
            </p>
          </div>
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
            <DollarSign size={24}/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">System Health</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">98%</h3>
            <p className="text-gray-400 text-xs mt-2 font-medium">All systems operational</p>
          </div>
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Activity size={24}/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Tasks</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">{pendingJobsCount + pendingBlogsCount}</h3>
            <p className="text-orange-500 text-xs mt-2 font-medium">Requires attention</p>
          </div>
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
            <Bell size={24}/>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Revenue Chart & User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <BarChart2 size={20} className="text-gray-500"/> Revenue Analytics
            </h3>
            <select className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-2 py-1 outline-none text-gray-600">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {[45, 50, 60, 55, 70, 80, 75, 90, 85, 95, 100, 90].map((h, i) => (
              <div key={i} className="w-full flex flex-col justify-end gap-1 group relative">
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                  ৳ {(h * 1.5).toFixed(1)}k
                </div>
                <div style={{ height: `${h}%` }} className="w-full bg-green-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                </div>
                <span className="text-[10px] text-gray-400 text-center font-medium">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-gray-500"/> User Roles
          </h3>
          <div className="flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-full relative" 
                 style={{ 
                   background: `conic-gradient(#3b82f6 0% 35%, #10b981 35% 60%, #f59e0b 60% 80%, #ef4444 80% 90%, #8b5cf6 90% 100%)` 
                 }}>
               <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                 <span className="text-3xl font-bold text-gray-800">12.4k</span>
                 <span className="text-xs text-gray-400 uppercase tracking-wide">Total</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8 w-full px-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-gray-600 font-medium">Citizens (35%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs text-gray-600 font-medium">Farmers (25%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-xs text-gray-600 font-medium">Vendors (20%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs text-gray-600 font-medium">Transport (10%)</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-gray-500"/> Recent Activity
          </h3>
          <div className="space-y-6">
            {[
              { title: 'New User Registered', desc: 'Rahim Uddin joined as Farmer', time: '5 min ago', icon: <UserPlus size={16}/>, color: 'bg-blue-100 text-blue-600' },
              { title: 'New Job Posted', desc: 'Assistant Teacher at Dhaka School', time: '20 min ago', icon: <Briefcase size={16}/>, color: 'bg-purple-100 text-purple-600' },
              { title: 'Alert Broadcasted', desc: 'Cyclone Warning Signal 4', time: '1 hr ago', icon: <AlertTriangle size={16}/>, color: 'bg-red-100 text-red-600' },
              { title: 'Market Price Updated', desc: 'Vegetable prices for Dhaka', time: '2 hrs ago', icon: <TrendingUp size={16}/>, color: 'bg-green-100 text-green-600' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Globe size={20} className="text-gray-500"/> System Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(modules).slice(0, 6).map(([key, isActive], idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${isActive ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-bold text-sm text-gray-700 uppercase tracking-wide">{key}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isActive ? 'Live' : 'Down'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  };

  // --- SUB-COMPONENT: ADD USER FORM VIEW ---
  const renderAddUserView = () => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="text-brand-600" size={28} /> Add New User
            </h3>
            <Button onClick={() => setUserViewMode('list')} variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={18} /> Back to Users
            </Button>
        </div>
        
        <form onSubmit={handleAddUser} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            required 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900 font-medium" 
                            placeholder="e.g. Rahim Uddin"
                            value={newUserForm.name} 
                            onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="email" 
                            required 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900 font-medium" 
                            placeholder="user@example.com"
                            value={newUserForm.email} 
                            onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Assign Password</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            required 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900 font-medium" 
                            placeholder="Set a temporary password"
                            value={newUserForm.password} 
                            onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} 
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Securely share this password with the user.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Role</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select 
                            className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-gray-900 font-medium" 
                            value={newUserForm.role} 
                            onChange={e => setNewUserForm({...newUserForm, role: e.target.value})}
                        >
                            <option value="Citizen">Citizen</option>
                            <option value="Farmer">Farmer</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Transport Operator">Transport Operator</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setUserViewMode('list')} className="px-6 py-3">Cancel</Button>
                <Button type="submit" className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2">
                    <Save size={18} /> Create Account
                </Button>
            </div>
        </form>
    </div>
  );

  // --- SUB-COMPONENT: USER DETAILS VIEW ---
  const renderUserDetailsView = () => {
    if (!viewingUser) return null;
    
    // Mock user activity for the detailed view
    const activities = getMockActivity(viewingUser.name);

    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="text-brand-600" size={28} /> User Profile
            </h3>
            <Button onClick={() => setUserViewMode('list')} variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={18} /> Back to Users
            </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Info */}
            <div className="w-full md:w-1/3 text-center border-r border-gray-100 pr-0 md:pr-8">
                <div className="w-24 h-24 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-brand-100">
                    {viewingUser.name[0]}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{viewingUser.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{viewingUser.email}</p>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold mb-6">{viewingUser.role}</span>
                
                <div className="space-y-3">
                    <Button onClick={() => handleToggleUserStatus(viewingUser.id)} className={`w-full ${viewingUser.status === 'Active' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} border-none shadow-none`}>
                        {viewingUser.status === 'Active' ? 'Suspend User' : 'Activate User'}
                    </Button>
                    <Button onClick={() => handleDeleteUser(viewingUser.id)} variant="danger" className="w-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-none">
                        Delete Account
                    </Button>
                </div>
            </div>

            {/* Stats & Activity */}
            <div className="w-full md:w-2/3">
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                        <p className={`font-bold ${viewingUser.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{viewingUser.status}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase">Joined</p>
                        <p className="font-bold text-gray-800">{viewingUser.date}</p>
                    </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
                    <Activity size={16} /> Recent Activity
                </h4>
                <div className="space-y-4">
                    {activities.map((act, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{act.action}</span>
                            <span className="text-xs text-gray-400">{act.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderUsersList = () => {
    const filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });

    // Stats Calculation
    const totalCount = users.length;
    const activeCount = users.filter(u => u.status === 'Active').length;
    const suspendedCount = users.filter(u => u.status === 'Suspended').length;
    
    // Calculate new users (created in the current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newCount = users.filter(u => {
        const d = new Date(u.date);
        return !isNaN(d.getTime()) && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return (
      <div className="space-y-6 animate-fade-in">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
                    <h4 className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</h4>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Users size={24} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Users</p>
                    <h4 className="text-2xl font-bold text-gray-900 mt-1">{activeCount}</h4>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <UserCheck size={24} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Suspended</p>
                    <h4 className="text-2xl font-bold text-gray-900 mt-1">{suspendedCount}</h4>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                    <UserX size={24} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">New (This Month)</p>
                    <h4 className="text-2xl font-bold text-gray-900 mt-1">{newCount}</h4>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <CalendarDays size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <Users className="text-brand-600" /> User Management
              </h3>
              <p className="text-gray-500 text-sm mt-1">Manage system users, roles and permissions</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Filter */}
              <div className="relative">
                 <select 
                   value={userRoleFilter} 
                   onChange={(e) => setUserRoleFilter(e.target.value)}
                   className="h-full pl-3 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer text-gray-700"
                 >
                   <option value="All">All Roles</option>
                   <option value="Citizen">Citizen</option>
                   <option value="Farmer">Farmer</option>
                   <option value="Doctor">Doctor</option>
                   <option value="Teacher">Teacher</option>
                   <option value="Vendor">Vendor</option>
                   <option value="Transport Operator">Transport</option>
                 </select>
                 <Filter className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
              </div>

              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search name or email..." 
                  value={userSearch} 
                  onChange={(e) => setUserSearch(e.target.value)} 
                  className="pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-64 transition-all" 
                />
              </div>

              <Button onClick={() => setUserViewMode('add')} className="bg-gray-900 hover:bg-black text-white text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-gray-200">
                <UserPlus size={18} className="mr-2"/> Add New User
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 border-b border-gray-100">User Details</th>
                  <th className="p-4 border-b border-gray-100">Role</th>
                  <th className="p-4 border-b border-gray-100">Joined Date</th>
                  <th className="p-4 border-b border-gray-100">Status</th>
                  <th className="p-4 border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewUser(user)}>
                        <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg border border-brand-100 group-hover:bg-brand-100 transition-colors">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-brand-700 transition-colors">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{user.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleViewUser(user)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all" title="View Details">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleToggleUserStatus(user.id)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" title="Suspend/Activate">
                          <Lock size={18} />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete User">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500 bg-gray-50/30">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={32} className="text-gray-300 mb-3" />
                        <p className="font-medium">No users found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Main Render Switch for Users
  const renderUsers = () => {
    switch (userViewMode) {
        case 'add': return renderAddUserView();
        case 'details': return renderUserDetailsView();
        case 'list': 
        default: return renderUsersList();
    }
  };

  const renderMarket = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag className="text-green-600"/> Market Prices</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
            <tr><th className="p-4">Item Name</th><th className="p-4">Current Price</th><th className="p-4">Unit</th><th className="p-4 text-right">Update</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {marketItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">
                  <input 
                    type="number" 
                    defaultValue={item.price} 
                    onBlur={(e) => handleUpdatePrice(item.id, e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-brand-500"
                  />
                </td>
                <td className="p-4">{item.unit}</td>
                <td className="p-4 text-right"><span className="text-xs text-gray-400">Auto-saves on blur</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGrievance = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2"><Trash2 className="text-emerald-600"/> Waste Management Reports</h3>
      <div className="space-y-4">
        {wasteReports.map(report => (
          <div key={report.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{report.status}</span>
                <span className="text-xs text-gray-400">{report.date}</span>
              </div>
              <h4 className="font-bold text-gray-900">{report.area}</h4>
              <p className="text-sm text-gray-600">{report.description}</p>
            </div>
            {report.status !== 'Resolved' && (
              <Button size="sm" onClick={() => handleResolveReport(report.id)} className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs">Mark Resolved</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmergency = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in max-w-2xl mx-auto">
      <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2"><AlertOctagon className="text-red-600"/> Emergency Alert Broadcast</h3>
      <form onSubmit={handleBroadcast} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Alert Message</label>
          <textarea 
            rows={3}
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., Cyclone Warning Signal 4 for Coastal Areas..."
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Severity Level</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="severity" checked={alertType === 'info'} onChange={() => setAlertType('info')} />
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">Info</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="severity" checked={alertType === 'warning'} onChange={() => setAlertType('warning')} />
              <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">Warning</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="severity" checked={alertType === 'danger'} onChange={() => setAlertType('danger')} />
              <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">Danger</span>
            </label>
          </div>
        </div>
        <Button type="submit" variant="danger" className="w-full py-3" disabled={broadcastSent}>
          {broadcastSent ? 'Broadcast Sent!' : 'Send Alert Broadcast'}
        </Button>
      </form>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in max-w-xl">
      <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2"><Settings className="text-gray-600"/> Admin Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" />
        </div>
        <Button className="mt-2">Update Password</Button>
      </div>
    </div>
  );

  const renderModuleConfig = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Database className="text-blue-600" />
                {isBangla ? 'মডিউল কনফিগারেশন' : 'Module Configuration'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{isBangla ? 'প্রতিটি মডিউলের কন্টেন্ট আপডেট ও পরিচালনা করুন' : 'Update and manage content for specific modules'}</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={configSearch} 
                onChange={(e) => setConfigSearch(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { id: 'agri', label: 'Agriculture', icon: <Sprout size={16}/>, color: 'text-green-600 bg-green-50 border-green-200' },
              { id: 'health', label: 'Health', icon: <Stethoscope size={16}/>, color: 'text-teal-600 bg-teal-50 border-teal-200' },
              { id: 'edu', label: 'Education', icon: <BookOpen size={16}/>, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { id: 'transport', label: 'Transport', icon: <Navigation size={16}/>, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
              { id: 'disaster', label: 'Disaster', icon: <Home size={16}/>, color: 'text-red-600 bg-red-50 border-red-200' },
              { id: 'fishery', label: 'Fishery', icon: <Fish size={16}/>, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
              { id: 'craft', label: 'Craft', icon: <Hammer size={16}/>, color: 'text-orange-600 bg-orange-50 border-orange-200' },
              { id: 'waste', label: 'Waste', icon: <Recycle size={16}/>, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { id: 'jela', label: 'Amar Jela', icon: <MapPin size={16}/>, color: 'text-purple-600 bg-purple-50 border-purple-200' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveConfigTab(tab.id as ConfigTab); setConfigSearch(''); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
                  activeConfigTab === tab.id 
                    ? `${tab.color} shadow-sm ring-1 ring-offset-1 ring-gray-200` 
                    : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Based on Tab */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 min-h-[400px]">
          
          {/* 1. AGRI CONFIG */}
          {activeConfigTab === 'agri' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-green-700 text-lg">Manage Crops Database</h4>
                <Button onClick={() => handleAddConfigItem('agri')} size="sm" className="bg-green-600 hover:bg-green-700"><Plus size={16} className="mr-1"/> Add Crop</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">Name</th><th className="p-4">Season</th><th className="p-4">Water Req</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminCrops.filter(i => i.name.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.season}</td>
                        <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold border border-blue-100">{item.water}</span></td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('agri', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. HEALTH CONFIG */}
          {activeConfigTab === 'health' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-teal-700 text-lg">Manage Hospitals Directory</h4>
                <Button onClick={() => handleAddConfigItem('health')} size="sm" className="bg-teal-600 hover:bg-teal-700"><Plus size={16} className="mr-1"/> Add Hospital</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">Hospital Name</th><th className="p-4">District</th><th className="p-4">Type</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminHospitals.filter(i => i.name.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.district}</td>
                        <td className="p-4"><span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-xs font-bold border border-purple-100">{item.type}</span></td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('health', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. TRANSPORT CONFIG */}
          {activeConfigTab === 'transport' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-indigo-700 text-lg">Manage Routes & Fares</h4>
                <Button onClick={() => handleAddConfigItem('transport')} size="sm" className="bg-indigo-600 hover:bg-indigo-700"><Plus size={16} className="mr-1"/> Add Route</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">Route</th><th className="p-4">Mode</th><th className="p-4">Fare (Tk)</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminRoutes.filter(i => i.route.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.route}</td>
                        <td className="p-4">{item.mode}</td>
                        <td className="p-4 font-bold text-gray-800">{item.fare}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('transport', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. EDU CONFIG */}
          {activeConfigTab === 'edu' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-blue-700 text-lg">Manage Library Books</h4>
                <Button onClick={() => handleAddConfigItem('edu')} size="sm" className="bg-blue-600 hover:bg-blue-700"><Plus size={16} className="mr-1"/> Add Book</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">Title</th><th className="p-4">Class/Level</th><th className="p-4">Subject</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminBooks.filter(i => i.title.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.title}</td>
                        <td className="p-4">{item.class}</td>
                        <td className="p-4">{item.subject}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('edu', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. DISASTER CONFIG */}
          {activeConfigTab === 'disaster' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-red-700 text-lg">Manage Shelters</h4>
                <Button onClick={() => handleAddConfigItem('disaster')} size="sm" className="bg-red-600 hover:bg-red-700"><Plus size={16} className="mr-1"/> Add Shelter</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">Shelter Name</th><th className="p-4">District</th><th className="p-4">Capacity</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminShelters.filter(i => i.name.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.district}</td>
                        <td className="p-4">{item.capacity}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('disaster', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. FISHERY CONFIG */}
          {activeConfigTab === 'fishery' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-cyan-700 text-lg">Manage Fish Database</h4>
                <Button onClick={() => handleAddConfigItem('fishery')} size="sm" className="bg-cyan-600 hover:bg-cyan-700"><Plus size={16} className="mr-1"/> Add Species</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Feed Type</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminFishes.filter(i => i.name.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.type}</td>
                        <td className="p-4">{item.feed}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('fishery', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. CRAFT CONFIG */}
          {activeConfigTab === 'craft' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-orange-700 text-lg">Manage Craft Products</h4>
                <Button onClick={() => handleAddConfigItem('craft')} size="sm" className="bg-orange-600 hover:bg-orange-700"><Plus size={16} className="mr-1"/> Add Craft</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">Product Name</th><th className="p-4">Category</th><th className="p-4">Artisan/Source</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminCrafts.filter(i => i.name.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.artisan}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('craft', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. WASTE CONFIG */}
          {activeConfigTab === 'waste' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-emerald-700 text-lg">Manage Waste Collection Zones</h4>
                <Button onClick={() => handleAddConfigItem('waste')} size="sm" className="bg-emerald-600 hover:bg-emerald-700"><Plus size={16} className="mr-1"/> Add Zone</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">Zone Area</th><th className="p-4">Assigned Vehicle</th><th className="p-4">Timing</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminWasteZones.filter(i => i.zone.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.zone}</td>
                        <td className="p-4">{item.truck}</td>
                        <td className="p-4">{item.timing}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('waste', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. AMAR JELA CONFIG */}
          {activeConfigTab === 'jela' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-purple-700 text-lg">Manage District Data</h4>
                <Button onClick={() => handleAddConfigItem('jela')} size="sm" className="bg-purple-600 hover:bg-purple-700"><Plus size={16} className="mr-1"/> Add District Info</Button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr><th className="p-4">District Name</th><th className="p-4">Division</th><th className="p-4">Tourist Spots</th><th className="p-4 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminDistricts.filter(i => i.name.toLowerCase().includes(configSearch.toLowerCase())).map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.division}</td>
                        <td className="p-4">{item.spots}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteConfigItem('jela', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight"><Shield className="text-brand-500" /> Dream Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveSection('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'overview' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><LayoutDashboard size={18} /> Overview</button>
          <button onClick={() => setActiveSection('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'users' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Users size={18} /> Users</button>
          <button onClick={() => setActiveSection('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'content' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><FileText size={18} /> Content Mod</button>
          
          {/* Module Config Link */}
          <button onClick={() => setActiveSection('module-config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'module-config' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Database size={18} /> Module Config</button>

          <button onClick={() => setActiveSection('market')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'market' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><ShoppingBag size={18} /> Market & Prices</button>
          <button onClick={() => setActiveSection('grievance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'grievance' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Trash2 size={18} /> Grievances</button>
          <button onClick={() => setActiveSection('emergency')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'emergency' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><AlertOctagon size={18} /> Emergency</button>
          <button onClick={() => setActiveSection('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'settings' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Settings size={18} /> Settings</button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={onExit} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 transition-all"><LogOut size={18} /> Exit Admin</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-bold text-gray-800">Dream Admin</h2>
          <button onClick={onExit}><LogOut size={20} className="text-gray-600"/></button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{activeSection.replace('-', ' ')}</h1>
          <p className="text-gray-500 text-sm mt-1">Manage {activeSection.replace('-', ' ')} settings and data.</p>
        </div>

        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'users' && renderUsers()}
        {activeSection === 'content' && renderContentManagement()}
        {activeSection === 'module-config' && renderModuleConfig()}
        {activeSection === 'market' && renderMarket()}
        {activeSection === 'grievance' && renderGrievance()}
        {activeSection === 'emergency' && renderEmergency()}
        {activeSection === 'settings' && renderSettings()}
      </main>
    </div>
  );
};