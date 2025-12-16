
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Settings, Database, Activity, 
  LogOut, Shield, Bell, FileText, ShoppingBag, Trash2, AlertOctagon, 
  Clock, DollarSign, Mail, Key, EyeOff, Eye, ChevronDown, UserPlus, FilePlus, AlertTriangle,
  Globe, Sparkles, Monitor
} from 'lucide-react';
import { AdminUsers } from './admin/AdminUsers';
import { AdminContent } from './admin/AdminContent';
import { AdminConfig } from './admin/AdminConfig';
import { AdminProfile } from './admin/AdminProfile';
import { AdminGrievance } from './admin/AdminGrievance';
import { AdminEmergency } from './admin/AdminEmergency';
import { AdminMarket } from './admin/AdminMarket';
import { AdminWebsiteManage } from './admin/AdminWebsiteManage';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
  onExit: () => void;
}

type AdminSection = 'overview' | 'website-manage' | 'users' | 'content' | 'module-config' | 'market' | 'grievance' | 'emergency' | 'settings';

export const AdminModule: React.FC<Props> = ({ isBangla, onExit }) => {
  const { requests } = useData(); // Get dynamic data

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  // Dashboard Stats (Reset to 0 / Dynamic)
  const stats = {
    users: '0', // In a real app, fetch from UserContext
    revenue: '৳ 0',
    health: '100%',
    pending: requests.length // Dynamic based on DataContext
  };

  // Login Handler
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

  // --- RENDERERS ---

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-800">
         <AlertTriangle className="shrink-0 mt-0.5" size={20} />
         <div>
           <p className="font-bold text-sm">Demo Mode Active</p>
           <p className="text-xs mt-1">
             Changes made here are saved to your browser's local storage. They will persist on this device but will NOT sync to other users or devices in this demo environment.
           </p>
         </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</h3>
                <p className="text-gray-400 text-xs font-bold mt-1">No new users</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                <Users size={24} />
            </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.revenue}</h3>
                <p className="text-gray-400 text-xs font-bold mt-1">No revenue yet</p>
            </div>
            <div className="p-4 rounded-2xl bg-green-50 text-green-600">
                <DollarSign size={24} />
            </div>
        </div>

        {/* Health */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">System Health</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.health}</h3>
                <p className="text-green-500 text-xs mt-1 font-bold">Operational</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 text-purple-600">
                <Activity size={24} />
            </div>
        </div>

        {/* Pending */}
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
      </div>

      {/* Middle Row: Analytics & Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Analytics Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-800 text-lg border-l-4 border-gray-900 pl-3">Revenue Analytics</h3>
                <button className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    This Year <ChevronDown size={14} />
                </button>
            </div>
            {/* Chart Area (Empty State) */}
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                    <div key={m} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                        <div 
                            className="w-full bg-gray-100 rounded-t-lg relative transition-all" 
                            style={{ height: '0%' }} // Reset to 0
                        ></div>
                        <span className="text-[10px] text-gray-400 font-medium">{m}</span>
                    </div>
                ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">No data available to display</p>
        </div>

        {/* User Roles Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
                User Roles
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div 
                    className="w-48 h-48 rounded-full relative bg-gray-100"
                >
                    <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">0</span>
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Total</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-xs opacity-50">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Citizens (0%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Farmers (0%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Vendors (0%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Transport (0%)</div>
            </div>
        </div>
      </div>

      {/* Bottom Row: Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-gray-400"/> Recent Activity
            </h3>
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
               <Activity size={32} className="mb-2 opacity-50"/>
               <p className="text-sm">No recent activity logs.</p>
            </div>
        </div>

        {/* System Status Grid */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Globe size={20} className="text-gray-400"/> System Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { name: 'Agriculture', status: 'Live' },
                    { name: 'Health', status: 'Live' },
                    { name: 'Education', status: 'Live' },
                    { name: 'Transport', status: 'Live' },
                    { name: 'Waste', status: 'Live' },
                    { name: 'Fishery', status: 'Live' }
                ].map((mod, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs font-bold uppercase text-gray-600">{mod.name}</span>
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">{mod.status}</span>
                    </div>
                ))}
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

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight"><Shield className="text-brand-500" /> Dream Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveSection('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'overview' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><LayoutDashboard size={18} /> Overview</button>
          <button onClick={() => setActiveSection('website-manage')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'website-manage' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Monitor size={18} /> Website Manage</button>
          <button onClick={() => setActiveSection('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'users' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><Users size={18} /> Users</button>
          <button onClick={() => setActiveSection('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'content' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><FileText size={18} /> Content Mod</button>
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
        {activeSection === 'website-manage' && <AdminWebsiteManage />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'content' && <AdminContent />}
        {activeSection === 'module-config' && <AdminConfig isBangla={isBangla} />}
        {activeSection === 'market' && <AdminMarket />}
        {activeSection === 'grievance' && <AdminGrievance />}
        {activeSection === 'emergency' && <AdminEmergency />}
        {activeSection === 'settings' && <AdminProfile />}
      </main>
    </div>
  );
};
