
import React, { useState } from 'react';
import { 
  Users, Search, UserPlus, Eye, Lock, Trash2, Filter, 
  ArrowLeft, Save, UserCheck, UserX, Calendar, Mail, 
  Briefcase, Key, MoreVertical, Phone, MapPin, Shield, Activity, Unlock,
  CheckCircle, ShieldCheck, ChevronDown
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';
import { UserRole } from '../../../types';

export const AdminUsers = () => {
  const { users, addUser, updateUserStatus, deleteUser, updateUser } = useData(); 
  const [view, setView] = useState<'list' | 'add' | 'details'>('list');
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Stats Calculation
  const totalUsers = users.length;
  const activeUsers = users.filter((u: any) => u.status === 'Active').length;
  const suspendedUsers = users.filter((u: any) => u.status === 'Suspended').length;
  const newUsers = 0; 

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch = (u.name?.toLowerCase() || '').includes(userSearch.toLowerCase()) || 
                          (u.email?.toLowerCase() || '').includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const ROLES_DATA = [
    { name: 'Admin', count: users.filter((u: any) => u.role === 'Admin').length, desc: 'Full system control and configuration access.', color: 'bg-purple-100 text-purple-700', perms: ['User Mgmt', 'Content Mod', 'System Config', 'Financials'] },
    { name: 'Citizen', count: users.filter((u: any) => u.role === 'Citizen').length, desc: 'Standard access to public services and content.', color: 'bg-blue-100 text-blue-700', perms: ['View Content', 'Post Comments', 'Submit Grievance', 'Emergency Services'] },
    { name: 'Farmer', count: users.filter((u: any) => u.role === 'Farmer').length, desc: 'Specialized access for agricultural tools and markets.', color: 'bg-green-100 text-green-700', perms: ['Agri Tools', 'Market Prices', 'Expert Consultation', 'Sell Produce'] },
    { name: 'Vendor', count: users.filter((u: any) => u.role === 'Vendor').length, desc: 'Business access for marketplace and sales.', color: 'bg-orange-100 text-orange-700', perms: ['Manage Shop', 'Post Products', 'Order Mgmt', 'Sales Analytics'] },
    { name: 'Doctor', count: users.filter((u: any) => u.role === 'Doctor').length, desc: 'Healthcare provider access for telemedicine.', color: 'bg-teal-100 text-teal-700', perms: ['Patient Mgmt', 'Prescriptions', 'Health Blog', 'Schedule'] },
    { name: 'Teacher', count: users.filter((u: any) => u.role === 'Teacher').length, desc: 'Educational content creator and mentor.', color: 'bg-indigo-100 text-indigo-700', perms: ['Course Mgmt', 'Student Analytics', 'Live Class', 'Assessments'] },
    { name: 'Transport Operator', count: users.filter((u: any) => u.role === 'Transport Operator').length, desc: 'Transport service management.', color: 'bg-red-100 text-red-700', perms: ['Route Mgmt', 'Ticket Booking', 'Fleet Status'] },
  ];

  // --- ACTIONS ---

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setView('details');
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const user = users.find((u: any) => u.id === userId);
    if (user) {
      await updateUser({ ...user, role: newRole as UserRole });
    }
  };

  const handleSuspendUser = async (id: string) => {
    const user = users.find((u: any) => u.id === id);
    if (!user) return;
    
    const action = user.status === 'Active' ? 'Suspended' : 'Active';
    const actionLabel = user.status === 'Active' ? 'suspend' : 'activate';
    
    if(confirm(`Are you sure you want to ${actionLabel} this user?`)) {
      await updateUserStatus(id, action);
    }
  };

  const handleDeleteUser = (id: string) => {
    if(confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      deleteUser(id);
      if (selectedUser?.id === id) {
          setView('list');
          setSelectedUser(null);
      }
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      const role = (form.elements.namedItem('role') as HTMLSelectElement).value;
      const password = (form.elements.namedItem('password') as HTMLInputElement).value;
      
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        alert('Only @gmail.com emails are allowed.');
        return;
      }

      const newUser = {
          id: Date.now().toString(),
          name,
          email,
          role,
          password: password, 
          status: 'Active',
          date: new Date().toLocaleDateString(),
          avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150`
      };
      
      addUser(newUser);
      alert('User created successfully!');
      setView('list');
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">TOTAL USERS</p>
          <h3 className="text-3xl font-bold text-gray-900">{totalUsers}</h3>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
          <Users size={24} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">ACTIVE USERS</p>
          <h3 className="text-3xl font-bold text-gray-900">{activeUsers}</h3>
        </div>
        <div className="p-3 rounded-xl bg-green-50 text-green-600">
          <UserCheck size={24} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">SUSPENDED</p>
          <h3 className="text-3xl font-bold text-gray-900">{suspendedUsers}</h3>
        </div>
        <div className="p-3 rounded-xl bg-red-50 text-red-600">
          <UserX size={24} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">NEW ACCOUNTS</p>
          <h3 className="text-3xl font-bold text-gray-900">{newUsers}</h3>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
          <Calendar size={24} />
        </div>
      </div>
    </div>
  );

  if (view === 'details') {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setView('list')} className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 border-gray-200">
            <ArrowLeft size={16} /> Back to Users
          </Button>
          <div className="flex gap-2">
             <Button 
                variant="outline" 
                onClick={() => handleSuspendUser(selectedUser.id)}
                className={`border-red-200 hover:bg-red-50 bg-white ${selectedUser.status === 'Active' ? 'text-red-600' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
             >
                {selectedUser.status === 'Active' ? 'Suspend User' : 'Activate User'}
             </Button>
             <Button className="bg-gray-900 text-white hover:bg-black" onClick={() => alert('Editing UI coming soon')}>Edit Details</Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md overflow-hidden">
                            <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                        </div>
                        <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-white rounded-full ${selectedUser.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{selectedUser.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <select 
                          className="bg-gray-100 px-3 py-1.5 rounded-lg text-gray-900 font-bold text-xs border-none outline-none cursor-pointer"
                          value={selectedUser.role}
                          onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                        >
                          {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={14} /> Joined: {selectedUser.date}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Contact Information</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Mail size={16}/></div>
                                <div><p className="text-[10px] text-gray-500 font-bold uppercase">Email</p><p className="font-bold text-sm">{selectedUser.email}</p></div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><Phone size={16}/></div>
                                <div><p className="text-[10px] text-gray-500 font-bold uppercase">Phone</p><p className="font-bold text-sm">{selectedUser.phone || 'N/A'}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (view === 'add') {
    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="text-green-600" size={24} /> Create Administrator Account
            </h3>
            <Button variant="outline" onClick={() => setView('list')} className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 border-gray-200">
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
          
          <div className="p-8">
            <form className="space-y-8" onSubmit={handleAddUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">Full Name</label>
                  <input type="text" name="name" required placeholder="Full Name" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">Email Address</label>
                  <input type="email" name="email" required placeholder="example@gmail.com" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">Initial Password</label>
                  <input type="text" name="password" required placeholder="Set Password" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">Assigned Role</label>
                  <select name="role" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none appearance-none cursor-pointer">
                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-50">
                <Button type="submit" className="bg-gray-900 hover:bg-black text-white px-10 py-4 font-black rounded-xl shadow-xl">Create Account</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {renderStats()}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-white">
          <div className="flex bg-gray-100 p-1 rounded-xl">
             <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>User Management</button>
             <button onClick={() => setActiveTab('roles')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'roles' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Roles & Permissions</button>
          </div>

          {activeTab === 'users' && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input type="text" placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 h-10" />
              </div>
              <Button onClick={() => setView('add')} className="bg-gray-900 hover:bg-black text-white text-sm font-bold px-6 h-10 rounded-lg shadow-sm">Add User</Button>
            </div>
          )}
        </div>

        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <tr>
                  <th className="p-6">User Details</th>
                  <th className="p-6">Role</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={user.avatar} className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm" />
                        <div><p className="font-black text-gray-900 text-sm leading-tight">{user.name}</p><p className="text-xs text-gray-400 mt-1 font-medium">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="p-6">
                       <div className="relative inline-block w-40">
                          <select 
                            value={user.role} 
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-700 outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer appearance-none"
                          >
                             {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                       </div>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleSuspendUser(user.id)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${user.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleViewUser(user)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Eye size={18}/></button>
                         <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50/50">
             {ROLES_DATA.map((role, idx) => (
               <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-4 group hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                     <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${role.color}`}>{role.name}</span>
                     <span className="text-[10px] font-bold text-gray-400">{role.count} Users</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{role.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                     {role.perms.map((p, i) => <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[9px] font-bold border border-gray-100">{p}</span>)}
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
