
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Settings, Database, Activity, 
  LogOut, Shield, Bell, FileText, ShoppingBag, Trash2, AlertOctagon, 
  Clock, DollarSign, Mail, Key, EyeOff, Eye, ChevronDown, UserPlus, FilePlus, AlertTriangle,
  Globe, Sparkles, Monitor, RefreshCw, CheckCircle, BarChart3, TrendingUp, Inbox, Droplets
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
import { AdminDonorLogs } from './admin/AdminDonorLogs'; // New Component
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';

interface Props {
  isBangla: boolean;
  onExit: () => void;
}

type AdminSection = 'overview' | 'website-manage' | 'users' | 'content' | 'inbox' | 'donor-logs' | 'module-config' | 'market' | 'grievance' | 'emergency' | 'settings';

export const AdminModule: React.FC<Props> = ({ isBangla, onExit }) => {
  const { requests, totalVisitors, messages, donorViewLogs } = useData();

  // Session Configuration
  const SESSION_KEY = 'dream_admin_session';
  const SESSION_DURATION = 12 * 60 * 60 * 1000; 

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const { timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < SESSION_DURATION) return true;
        localStorage.removeItem(SESSION_KEY);
        return false;
      } catch (e) { return false; }
    }
    return false;
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const unreadMessagesCount = messages.filter((m: any) => m.status === 'Unread').length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === 'admin@dreambd.com' && password === 'admin123') || (email === 'demo' && password === 'demo')) {
      setIsAuthenticated(true);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
    } else {
      alert('Invalid Credentials.');
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveSection('donor-logs')}>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Donor Access</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{donorViewLogs.length}</h3>
                <p className="text-red-500 text-xs font-bold mt-1">Contact Reveal Logs</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 text-red-600">
                <Droplets size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Unread Inbox</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{unreadMessagesCount}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
                <Inbox size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending Tasks</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{requests.length}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 text-orange-600">
                <Bell size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Visitors</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalVisitors.toLocaleString()}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-green-50 text-green-600">
                <Monitor size={24} />
            </div>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 max-w-[400px] w-full text-center shadow-2xl">
          <Shield size={40} className="mx-auto mb-6 text-indigo-600" />
          <h2 className="text-2xl font-bold mb-8">Admin Portal</h2>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div><label className="text-xs font-bold uppercase">Email</label><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg" required /></div>
            <div><label className="text-xs font-bold uppercase">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-50 border rounded-lg" required /></div>
            <Button type="submit" className="w-full bg-[#0f172a] text-white py-3 rounded-lg font-bold">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-800"><h2 className="text-xl font-bold flex items-center gap-2"><Shield className="text-brand-500" /> Dream Admin</h2></div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveSection('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'overview' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><LayoutDashboard size={18} /> Overview</button>
          <button onClick={() => setActiveSection('donor-logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'donor-logs' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Droplets size={18} /> Donor View Logs</button>
          <button onClick={() => setActiveSection('website-manage')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'website-manage' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Monitor size={18} /> Website Manage</button>
          <button onClick={() => setActiveSection('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'users' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Users size={18} /> Users & Roles</button>
          <button onClick={() => setActiveSection('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'content' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><FileText size={18} /> Content Mod</button>
          <button onClick={() => setActiveSection('inbox')} className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'inbox' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><div className="flex items-center gap-3"><Inbox size={18} /> Inbox</div> {unreadMessagesCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadMessagesCount}</span>}</button>
          <button onClick={() => setActiveSection('module-config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'module-config' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Database size={18} /> Module Config</button>
          <button onClick={() => setActiveSection('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'settings' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Settings size={18} /> Settings</button>
        </nav>
        <div className="p-4 border-t border-gray-800"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 transition-all"><LogOut size={18} /> Logout</button></div>
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 capitalize mb-6">{activeSection.replace('-', ' ')}</h1>
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'donor-logs' && <AdminDonorLogs />}
        {activeSection === 'website-manage' && <AdminWebsiteManage />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'content' && <AdminContent />}
        {activeSection === 'inbox' && <AdminMessages />}
        {activeSection === 'module-config' && <AdminConfig isBangla={isBangla} />}
        {activeSection === 'settings' && <AdminProfile />}
      </main>
    </div>
  );
};
