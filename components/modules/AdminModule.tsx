import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Settings, Database, Activity, 
  LogOut, Shield, Bell, Lock, Search, Eye, Edit3, Trash2, 
  BarChart2, Server, Power, AlertTriangle, CheckCircle, X,
  FileText, Globe, Smartphone, UserPlus, Info
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AppModule, UserRole } from '../../types';

interface Props {
  isBangla: boolean;
  onExit: () => void;
}

type AdminSection = 'overview' | 'users' | 'modules' | 'alerts' | 'settings';

// Mock Data
const MOCK_USERS = [
  { id: '1', name: 'Rahim Uddin', role: 'Farmer', email: 'rahim@agri.com', status: 'Active', date: '2023-10-01' },
  { id: '2', name: 'Dr. Nusrat', role: 'Doctor', email: 'nusrat@health.com', status: 'Active', date: '2023-09-15' },
  { id: '3', name: 'Karim Transport', role: 'Transport Operator', email: 'karim@bus.com', status: 'Suspended', date: '2023-11-20' },
  { id: '4', name: 'Sumaiya Akter', role: 'Vendor', email: 'sumaiya@craft.com', status: 'Active', date: '2023-12-05' },
  { id: '5', name: 'Rafiqul Islam', role: 'Citizen', email: 'rafiq@mail.com', status: 'Active', date: '2024-01-10' },
];

const MODULE_STATUS = {
  [AppModule.AGRI]: true,
  [AppModule.HEALTH]: true,
  [AppModule.EDU]: true,
  [AppModule.TRANSPORT]: true,
  [AppModule.WASTE]: false, // Under Maintenance
  [AppModule.FISHERY]: true,
  [AppModule.DISASTER]: true,
  [AppModule.CRAFT]: true,
};

export const AdminModule: React.FC<Props> = ({ isBangla, onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [users, setUsers] = useState(MOCK_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [modules, setModules] = useState(MODULE_STATUS);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'danger'>('info');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') { // Simple mock PIN
      setIsAuthenticated(true);
    } else {
      alert('Invalid Admin PIN');
    }
  };

  // User Management Handlers
  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Module Handler
  const toggleModule = (key: string) => {
    setModules(prev => ({ ...prev, [key]: !prev[key as any] }));
  };

  // Broadcast Handler
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setAlertMessage('');
    }, 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h2>
          <p className="text-gray-500 mb-6 text-sm">Restricted Area. Enter PIN to continue.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PIN (1234)"
              className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3 border-b-2 border-gray-300 focus:border-gray-900 outline-none transition-colors"
              autoFocus
            />
            <Button type="submit" className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl mt-4">
              Unlock Dashboard
            </Button>
          </form>
          <button onClick={onExit} className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline">
            Return to Site
          </button>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">12,450</h3>
            <p className="text-green-500 text-xs mt-2 flex items-center gap-1"><Activity size={12}/> +12% this week</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-full text-blue-600"><Users size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Alerts</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">3</h3>
            <p className="text-red-500 text-xs mt-2 font-medium">Critical: Cyclone</p>
          </div>
          <div className="p-4 bg-red-50 rounded-full text-red-600"><Bell size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">System Status</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">99.9%</h3>
            <p className="text-gray-400 text-xs mt-2">Uptime</p>
          </div>
          <div className="p-4 bg-green-50 rounded-full text-green-600"><Server size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Storage</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">45%</h3>
            <p className="text-gray-400 text-xs mt-2">120GB / 500GB Used</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-full text-purple-600"><Database size={24}/></div>
        </div>
      </div>

      {/* Charts Section (Visual Only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-gray-500"/> Traffic Overview
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="w-full bg-gray-100 rounded-t-lg relative group">
                <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg transition-all duration-500 hover:bg-blue-700"></div>
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                  {h * 100} hits
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium uppercase">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Globe size={20} className="text-gray-500"/> Module Usage
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Agriculture', val: 85, color: 'bg-green-500' },
              { label: 'Health', val: 70, color: 'bg-teal-500' },
              { label: 'Education', val: 60, color: 'bg-blue-500' },
              { label: 'Transport', val: 45, color: 'bg-indigo-500' },
              { label: 'Market', val: 90, color: 'bg-lime-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-500">{item.val}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="font-bold text-lg text-gray-800">User Management</h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search user..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-full"
            />
          </div>
          <Button className="bg-gray-900 hover:bg-black text-white text-sm px-4">
            <UserPlus size={16} className="mr-2"/> Add User
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">{u.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">{u.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{u.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleToggleStatus(u.id)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded" title="Toggle Status">
                      {u.status === 'Active' ? <Lock size={16}/> : <CheckCircle size={16}/>}
                    </button>
                    <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Edit">
                      <Edit3 size={16}/>
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
        <Info className="text-blue-600 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-blue-900">Module Configuration</h4>
          <p className="text-sm text-blue-700">Disabling a module will hide it from the main navigation and show a "Maintenance" page to users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(modules).map(([key, isActive]) => (
          <div key={key} className={`p-5 rounded-xl border transition-all ${isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-800 uppercase tracking-wider text-sm">{key}</span>
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-medium text-gray-500">{isActive ? 'Operational' : 'Maintenance'}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isActive} onChange={() => toggleModule(key)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gray-900 p-6 text-white">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <Bell size={24} /> Broadcast Alert
          </h3>
          <p className="text-gray-400 text-sm mt-1">Send notifications to all users instantly.</p>
        </div>
        
        {broadcastSent ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Alert Sent Successfully!</h4>
            <p className="text-gray-500 mt-2">Notification has been pushed to 12,450 users.</p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Alert Type</label>
              <div className="flex gap-4">
                {['info', 'warning', 'danger'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAlertType(t as any)}
                    className={`flex-1 py-3 rounded-xl border-2 font-bold capitalize transition-all ${
                      alertType === t 
                        ? (t === 'danger' ? 'border-red-500 bg-red-50 text-red-600' : t === 'warning' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-blue-500 bg-blue-50 text-blue-600')
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea 
                rows={4}
                required
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="e.g., Cyclone Warning Signal 4..."
              ></textarea>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl flex gap-3 border border-yellow-100">
              <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
              <p className="text-xs text-yellow-800">
                <strong>Warning:</strong> This action cannot be undone. All users will receive a push notification immediately.
              </p>
            </div>

            <Button type="submit" className="w-full bg-gray-900 hover:bg-black text-white h-12 text-lg">
              Send Broadcast
            </Button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-col hidden md:flex fixed h-full">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <Shield className="text-brand-500" /> Dream Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'overview' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Overview
          </button>
          <button 
            onClick={() => setActiveSection('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'users' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Users size={20} /> Users
          </button>
          <button 
            onClick={() => setActiveSection('modules')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'modules' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Server size={20} /> Modules
          </button>
          <button 
            onClick={() => setActiveSection('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'alerts' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Bell size={20} /> Alerts
          </button>
          <button 
            onClick={() => setActiveSection('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === 'settings' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={onExit} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 transition-all">
            <LogOut size={20} /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-bold text-gray-800">Dream Admin</h2>
          <button onClick={onExit}><LogOut size={20} className="text-gray-600"/></button>
        </div>

        {/* Dynamic Section Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{activeSection}</h1>
          <p className="text-gray-500 text-sm mt-1">Manage {activeSection} settings and data.</p>
        </div>

        {/* Content Render */}
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'users' && renderUsers()}
        {activeSection === 'modules' && renderModules()}
        {activeSection === 'alerts' && renderAlerts()}
        {activeSection === 'settings' && (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
            <Settings size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">General Settings</h3>
            <p className="text-gray-500">Global platform configuration options coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};