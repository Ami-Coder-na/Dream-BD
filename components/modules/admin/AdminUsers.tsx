
import React, { useState } from 'react';
import { 
  Users, Search, UserPlus, Eye, Lock, Trash2, Filter, 
  ArrowLeft, Save, UserCheck, UserX, Calendar, Mail, 
  Briefcase, Key, MoreVertical, Phone, MapPin, Shield, Activity, Unlock
} from 'lucide-react';
import { Button } from '../../ui/Button';

// Mock Data matching the screenshot
const MOCK_USERS = [
  { id: '1', name: 'Rahim Uddin', email: 'rahim@agri.com', role: 'Farmer', status: 'Active', date: '2023-10-01' },
  { id: '2', name: 'Dr. Nusrat', email: 'nusrat@health.com', role: 'Doctor', status: 'Active', date: '2023-09-15' },
  { id: '3', name: 'Karim Transport', email: 'karim@bus.com', role: 'Transport Operator', status: 'Suspended', date: '2023-11-20' },
  { id: '4', name: 'Sumaiya Akter', email: 'sumaiya@craft.com', role: 'Vendor', status: 'Active', date: '2023-12-05' },
  { id: '5', name: 'Rafiqul Islam', email: 'rafiq@mail.com', role: 'Citizen', status: 'Active', date: '2024-01-10' },
];

export const AdminUsers = () => {
  const [view, setView] = useState<'list' | 'add' | 'details'>('list');
  const [users, setUsers] = useState(MOCK_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Stats Calculation
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const suspendedUsers = users.filter(u => u.status === 'Suspended').length;
  const newUsers = 0; // Hardcoded as per screenshot example

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // --- ACTIONS ---

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setView('details');
  };

  const handleSuspendUser = (id: string) => {
    const user = users.find(u => u.id === id);
    const action = user?.status === 'Active' ? 'suspend' : 'activate';
    
    if(confirm(`Are you sure you want to ${action} this user?`)) {
      setUsers(users.map(u => 
        u.id === id 
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } 
          : u
      ));
    }
  };

  const handleDeleteUser = (id: string) => {
    if(confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== id));
      if (selectedUser?.id === id) {
          setView('list');
          setSelectedUser(null);
      }
    }
  };

  // --- RENDERERS ---

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
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">NEW (THIS MONTH)</p>
          <h3 className="text-3xl font-bold text-gray-900">{newUsers}</h3>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
          <Calendar size={24} />
        </div>
      </div>
    </div>
  );

  const renderUserDetails = () => {
    if (!selectedUser) return null;

    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        {/* Header */}
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
             <Button className="bg-gray-900 text-white hover:bg-black">Edit Details</Button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-500">
                                {selectedUser.name.charAt(0)}
                            </div>
                        </div>
                        <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-white rounded-full ${selectedUser.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{selectedUser.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                            <Briefcase size={14} /> {selectedUser.role}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> Joined: {selectedUser.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Shield size={14} /> User ID: #{selectedUser.id.padStart(4, '0')}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Information</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Mail size={16}/></div>
                                <div>
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="font-medium">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><Phone size={16}/></div>
                                <div>
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p className="font-medium">+880 1700 000000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><MapPin size={16}/></div>
                                <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className="font-medium">Dhaka, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Activity</h4>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1"><Activity size={16} className="text-gray-400"/></div>
                                <div>
                                    <p className="text-sm text-gray-800">Logged in from new device</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1"><Activity size={16} className="text-gray-400"/></div>
                                <div>
                                    <p className="text-sm text-gray-800">Updated profile information</p>
                                    <p className="text-xs text-gray-500">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

  if (view === 'details') {
    return renderUserDetails();
  }

  if (view === 'add') {
    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserPlus className="text-green-600" size={24} /> Add New User
            </h3>
            <Button variant="outline" onClick={() => setView('list')} className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 border-gray-200">
              <ArrowLeft size={16} /> Back to Users
            </Button>
          </div>
          
          <div className="p-8">
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert('User created!'); setView('list'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">FULL NAME</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><Users size={18}/></span>
                    <input 
                      type="text" 
                      placeholder="e.g. Rahim Uddin" 
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">EMAIL ADDRESS</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><Mail size={18}/></span>
                    <input 
                      type="email" 
                      placeholder="user@example.com" 
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">ASSIGN PASSWORD</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><Key size={18}/></span>
                    <input 
                      type="text" 
                      placeholder="Set a temporary password" 
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Securely share this password with the user.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">ROLE</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><Briefcase size={18}/></span>
                    <select className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium appearance-none cursor-pointer">
                      <option>Citizen</option>
                      <option>Farmer</option>
                      <option>Doctor</option>
                      <option>Vendor</option>
                      <option>Teacher</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                <Button type="button" variant="outline" onClick={() => setView('list')} className="px-6 bg-white hover:bg-gray-50 border-gray-200 text-gray-700">Cancel</Button>
                <Button type="submit" className="bg-gray-900 hover:bg-black text-white px-6 flex items-center gap-2">
                  <Save size={18} /> Create Account
                </Button>
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
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-green-600" size={20} /> User Management
            </h3>
            <p className="text-gray-500 text-xs mt-1">Manage system users, roles and permissions</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
               <select 
                 value={userRoleFilter}
                 onChange={(e) => setUserRoleFilter(e.target.value)}
                 className="pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 appearance-none cursor-pointer hover:bg-gray-50 transition-colors h-10"
               >
                 <option value="All">All Roles</option>
                 <option value="Citizen">Citizen</option>
                 <option value="Farmer">Farmer</option>
                 <option value="Doctor">Doctor</option>
                 <option value="Vendor">Vendor</option>
               </select>
               <Filter className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
            </div>

            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 h-10" 
              />
            </div>

            <Button onClick={() => setView('add')} className="bg-gray-900 hover:bg-black text-white text-sm font-medium px-4 h-10 rounded-lg shadow-sm flex items-center gap-2">
              <UserPlus size={16} /> Add New User
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold border border-gray-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">
                    {user.date}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Active' 
                        ? 'bg-green-50 text-green-700 border border-green-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleViewUser(user)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleSuspendUser(user.id)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}>
                        {user.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} className="text-green-600" />}
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete User">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
           <span className="text-xs text-gray-500 font-medium">Showing {filteredUsers.length} of {users.length} results</span>
           <div className="flex gap-2">
             <button className="px-3 py-1 border border-gray-200 bg-white rounded text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
             <button className="px-3 py-1 border border-gray-200 bg-white rounded text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};
