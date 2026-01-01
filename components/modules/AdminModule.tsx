
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Settings, Database, Activity, 
  LogOut, Shield, Bell, FileText, ShoppingBag, Trash2, AlertOctagon, 
  Clock, DollarSign, Mail, Key, EyeOff, Eye, ChevronDown, UserPlus, FilePlus, AlertTriangle,
  Globe, Sparkles, Monitor, RefreshCw, CheckCircle, BarChart3, TrendingUp, Inbox, Droplets, PlusCircle, Briefcase,
  ArrowUpRight, Zap
} from 'lucide-react';
import { AdminUsers } from './admin/AdminUsers';
import { AdminContent } from './admin/AdminContent';
import { AdminConfig } from './admin/AdminConfig';
import { AdminProfile } from './admin/AdminProfile';
import { AdminGrievance } from './admin/AdminGrievance';
import { AdminEmergency } from './admin/AdminEmergency';
import { AdminMarket } from './admin/AdminMarket';
import { AdminWebsiteManage } from './admin/AdminWebsiteManage';
import { AdminMessages } from './admin/AdminMessages';
import { AdminBloodLogs } from './admin/AdminBloodLogs';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';

interface Props {
  isBangla: boolean;
  onExit: () => void;
}

type AdminSection = 'overview' | 'website-manage' | 'users' | 'content' | 'inbox' | 'module-config' | 'market' | 'grievance' | 'emergency' | 'settings' | 'blood-logs';

export const AdminModule: React.FC<Props> = ({ isBangla, onExit }) => {
  const { requests, totalVisitors, messages, donorViewLogs, users } = useData();

  const SESSION_KEY = 'digital_desh_bd_admin_session';
  const SESSION_DURATION = 12 * 60 * 60 * 1000;

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const { timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < SESSION_DURATION) {
          return true;
        } else {
          localStorage.removeItem(SESSION_KEY);
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const unreadMessagesCount = messages.filter((m: any) => m.status === 'Unread').length;

  const stats = {
    users: users.length,
    revenue: '৳ 0',
    health: '100%',
    pending: requests.length
  };

  // Mock data for graphs
  const userGrowthData = [12, 18, 15, 25, 32, 28, 40]; // Last 7 days
  const trafficData = "20,40,30,50,45,70,60,90,80,100,95,120"; // Hourly points for SVG

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === 'admin@digitaldeshbd.com' && password === 'admin123') || (email === 'demo' && password === 'demo')) {
      setIsAuthenticated(true);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
    } else {
      alert('Invalid Credentials. Try admin@digitaldeshbd.com / admin123');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@digitaldeshbd.com');
    setPassword('admin123');
  };

  const handleLogout = () => {
    if(confirm('Are you sure you want to logout?')) {
      localStorage.removeItem(SESSION_KEY);
      setIsAuthenticated(false);
      onExit();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      {!isSupabaseConfigured ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-pulse">
           <div className="flex items-start gap-4">
             <div className="p-3 bg-red-100 rounded-full text-red-600 shrink-0">
               <Database size={32} />
             </div>
             <div>
               <h3 className="font-bold text-xl text-red-800">Database Not Connected!</h3>
               <p className="text-red-700 mt-1 max-w-xl">
                 Your app is running in <strong>Offline Mode</strong>. Any data you add now is saved only on your device.
               </p>
             </div>
           </div>
           <Button onClick={() => setActiveSection('website-manage')} className="bg-red-600 hover:bg-red-700 text-white border-none px-8 py-3 shadow-lg shadow-red-200 whitespace-nowrap">
             Connect Database Now
           </Button>
        </div>
      ) : (
         <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800 shadow-sm">
             <div className="bg-green-100 p-2 rounded-full"><CheckCircle size={20} /></div>
             <span className="font-bold">System Online: Database Connected Successfully. All updates are syncing globally.</span>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl flex items-center justify-between group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setActiveSection('content')}>
            <div className="space-y-2">
                <h3 className="text-2xl font-black">Manage Job Posts</h3>
                <p className="text-indigo-100 text-sm">Add or approve jobs across Bangladesh</p>
                <div className="pt-4 flex gap-2">
                   <button onClick={(e) => { e.stopPropagation(); setActiveSection('content'); }} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                     <PlusCircle size={14} /> Add New Job
                   </button>
                </div>
            </div>
            <Briefcase size={64} className="opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-3xl text-white shadow-xl flex items-center justify-between group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setActiveSection('content')}>
            <div className="space-y-2">
                <h3 className="text-2xl font-black">Admin Blogs</h3>
                <p className="text-blue-100 text-sm">Write articles and news updates</p>
                <div className="pt-4 flex gap-2">
                   <button onClick={(e) => { e.stopPropagation(); setActiveSection('content'); }} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                     <FilePlus size={14} /> Write Blog
                   </button>
                </div>
            </div>
            <FileText size={64} className="opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Visitors</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalVisitors.toLocaleString()}</h3>
                <p className="text-green-500 text-xs font-bold mt-1 flex items-center gap-1"><TrendingUp size={10} /> +1 New (Live)</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <BarChart3 size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveSection('inbox')}>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Unread Inbox</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{unreadMessagesCount}</h3>
                <p className={`${unreadMessagesCount > 0 ? 'text-indigo-600 animate-pulse' : 'text-gray-400'} text-xs font-bold mt-1`}>
                  {unreadMessagesCount > 0 ? 'New Contact Messages' : 'No new messages'}
                </p>
            </div>
            <div className={`p-4 rounded-2xl ${unreadMessagesCount > 0 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400'} transition-all`}>
                <Inbox size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveSection('blood-logs')}>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Blood Access Logs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{donorViewLogs.length}</h3>
                <p className="text-red-500 text-xs mt-1 font-bold">Number View Records</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                <Droplets size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveSection('users')}>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Registered</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</h3>
                <p className="text-blue-500 text-xs font-bold mt-1 flex items-center gap-1"><ArrowUpRight size={10} /> {users.length > 0 ? 'Verified' : 'Growing'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Users size={24} />
            </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Platform Traffic Flow
              </h3>
              <p className="text-xs text-gray-400 font-medium">Last 24 hours activity tracking</p>
            </div>
            <div className="flex gap-2">
               <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                 <ArrowUpRight size={12} /> +24% vs yesterday
               </span>
            </div>
          </div>
          
          <div className="relative h-48 w-full mt-4">
             {/* Simple SVG Chart */}
             <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                   <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                 </linearGradient>
               </defs>
               {/* Grid lines */}
               <line x1="0" y1="50" x2="1000" y2="50" stroke="#f3f4f6" strokeWidth="1" />
               <line x1="0" y1="100" x2="1000" y2="100" stroke="#f3f4f6" strokeWidth="1" />
               <line x1="0" y1="150" x2="1000" y2="150" stroke="#f3f4f6" strokeWidth="1" />
               
               {/* Area under the curve */}
               <path 
                 d={`M 0 200 L 0 180 L 100 160 L 200 170 L 300 150 L 400 155 L 500 130 L 600 140 L 700 110 L 800 120 L 900 100 L 1000 80 L 1000 200 Z`} 
                 fill="url(#chartGradient)"
               />
               
               {/* Main path */}
               <path 
                 d="M 0 180 L 100 160 L 200 170 L 300 150 L 400 155 L 500 130 L 600 140 L 700 110 L 800 120 L 900 100 L 1000 80" 
                 fill="none" 
                 stroke="#4f46e5" 
                 strokeWidth="4" 
                 strokeLinecap="round" 
                 strokeLinejoin="round" 
               />
               
               {/* Data points */}
               {[180, 160, 170, 150, 155, 130, 140, 110, 120, 100, 80].map((y, i) => (
                 <circle key={i} cx={i * 100} cy={y} r="4" fill="white" stroke="#4f46e5" strokeWidth="2" />
               ))}
             </svg>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <UserPlus size={20} className="text-emerald-600" /> New Users
            </h3>
            <p className="text-xs text-gray-400 font-medium">Daily registration stats (7 Days)</p>
          </div>

          <div className="flex items-end justify-between h-48 gap-2 px-2">
            {userGrowthData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative">
                  <div 
                    className="w-full bg-emerald-100 rounded-t-lg group-hover:bg-emerald-500 transition-all cursor-help relative"
                    style={{ height: `${(val / 40) * 100}%`, minHeight: '10%' }}
                  >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {val} users
                     </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl"><Zap size={24} /></div>
            <div>
              <p className="text-indigo-100 text-xs font-bold uppercase">Server Latency</p>
              <h4 className="text-2xl font-bold">42ms</h4>
            </div>
         </div>
         <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-lg flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl"><Shield size={24} /></div>
            <div>
              <p className="text-emerald-100 text-xs font-bold uppercase">System Health</p>
              <h4 className="text-2xl font-bold">Excellent</h4>
            </div>
         </div>
         <div className="bg-gray-800 rounded-2xl p-5 text-white shadow-lg flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl"><RefreshCw size={24} /></div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase">Last Backup</p>
              <h4 className="text-lg font-bold">2 Hours Ago</h4>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Tasks</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</h3>
                <p className={`${stats.pending > 0 ? 'text-orange-500' : 'text-green-500'} text-xs font-bold mt-1`}>
                  {stats.pending > 0 ? 'Requires attention' : 'All caught up'}
                </p>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 text-orange-600">
                <Bell size={24} />
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveSection('emergency')}>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Alerts</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
                <p className="text-gray-400 text-xs font-bold mt-1">Normal operations</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                <AlertOctagon size={24} />
            </div>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-[400px] w-full text-center animate-fade-in relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-gray-100">
              <Shield size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Digital Admin</h2>
            <p className="text-gray-500 mb-8 text-sm font-medium">Secure login required.</p>
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@digitaldeshbd.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]" required />
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

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight"><Shield className="text-brand-500" /> Digital Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveSection('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'overview' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><LayoutDashboard size={18} /> Overview</button>
          <button onClick={() => setActiveSection('website-manage')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'website-manage' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Monitor size={18} /> Website Manage</button>
          <button onClick={() => setActiveSection('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'users' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Users size={18} /> Users & Roles</button>
          <button onClick={() => setActiveSection('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'content' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><FileText size={18} /> Content Mod</button>
          <button onClick={() => setActiveSection('inbox')} className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'inbox' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <div className="flex items-center gap-3"><Inbox size={18} /> Inbox</div>
            {unreadMessagesCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadMessagesCount}</span>}
          </button>
          <button onClick={() => setActiveSection('blood-logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'blood-logs' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Droplets size={18} /> Blood Logs</button>
          <button onClick={() => setActiveSection('module-config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'module-config' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Database size={18} /> Module Config</button>
          <button onClick={() => setActiveSection('market')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'market' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><ShoppingBag size={18} /> Market & Prices</button>
          <button onClick={() => setActiveSection('grievance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'grievance' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Trash2 size={18} /> Grievances</button>
          <button onClick={() => setActiveSection('emergency')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'emergency' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><AlertOctagon size={18} /> Emergency</button>
          <button onClick={() => setActiveSection('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'settings' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Settings size={18} /> Settings</button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 transition-all"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-bold text-gray-800">Digital Admin</h2>
          <button onClick={handleLogout}><LogOut size={20} className="text-gray-600"/></button>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'website-manage' && <AdminWebsiteManage />}
          {activeSection === 'users' && <AdminUsers />}
          {activeSection === 'content' && <AdminContent />}
          {activeSection === 'inbox' && <AdminMessages />}
          {activeSection === 'blood-logs' && <AdminBloodLogs />}
          {activeSection === 'module-config' && <AdminConfig isBangla={isBangla} />}
          {activeSection === 'market' && <AdminMarket />}
          {activeSection === 'grievance' && <AdminGrievance />}
          {activeSection === 'emergency' && <AdminEmergency />}
          {activeSection === 'settings' && <AdminProfile />}
        </div>
      </main>
    </div>
  );
};
