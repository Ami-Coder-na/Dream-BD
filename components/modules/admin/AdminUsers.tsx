
import React, { useState } from 'react';
import { Users, Search, UserPlus, Eye, Lock, Trash2, Filter } from 'lucide-react';
import { Button } from '../../ui/Button';

// Mock Data
const MOCK_USERS = [
  { id: '1', name: 'Rahim Uddin', role: 'Farmer', email: 'rahim@agri.com', status: 'Active', date: '2023-10-01' },
  { id: '2', name: 'Dr. Nusrat', role: 'Doctor', email: 'nusrat@health.com', status: 'Active', date: '2023-09-15' },
  { id: '3', name: 'Karim Transport', role: 'Transport Operator', email: 'karim@bus.com', status: 'Suspended', date: '2023-11-20' },
  { id: '4', name: 'Sumaiya Akter', role: 'Vendor', email: 'sumaiya@craft.com', status: 'Active', date: '2023-12-05' },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h3 className="font-black text-xl text-black flex items-center gap-2">
                <Users className="text-blue-800" /> User Management
              </h3>
              <p className="text-black text-sm mt-1 font-bold">Manage system users, roles and permissions</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                 <select 
                   value={userRoleFilter} 
                   onChange={(e) => setUserRoleFilter(e.target.value)}
                   className="h-full pl-3 pr-9 py-2.5 bg-white border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer text-black"
                 >
                   <option value="All">All Roles</option>
                   <option value="Citizen">Citizen</option>
                   <option value="Farmer">Farmer</option>
                   <option value="Doctor">Doctor</option>
                 </select>
                 <Filter className="absolute right-3 top-2.5 text-black pointer-events-none" size={16} />
              </div>

              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-2.5 text-black" size={18} />
                <input 
                  type="text" 
                  placeholder="Search name or email..." 
                  value={userSearch} 
                  onChange={(e) => setUserSearch(e.target.value)} 
                  className="pl-10 pr-4 py-2.5 border-2 border-black bg-white text-black font-bold rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-full md:w-64 transition-all placeholder-gray-600" 
                />
              </div>

              <Button className="bg-black hover:bg-gray-800 text-white text-sm px-5 py-2.5 rounded-xl font-bold border-2 border-black">
                <UserPlus size={18} className="mr-2"/> Add User
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-t-xl border-2 border-black">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-black text-white font-extrabold uppercase text-sm tracking-wider">
                <tr>
                  <th className="p-5 border-r border-gray-700">User Details</th>
                  <th className="p-5 border-r border-gray-700">Role</th>
                  <th className="p-5 border-r border-gray-700">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-200 transition-colors border-b-2 border-gray-300">
                    <td className="p-5 border-r border-gray-300">
                      <div>
                        <p className="font-extrabold text-black text-lg">{user.name}</p>
                        <p className="text-sm text-black font-bold">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-5 border-r border-gray-300">
                        <span className="bg-gray-200 px-3 py-1.5 rounded-md text-sm font-black text-black border-2 border-gray-400">
                            {user.role}
                        </span>
                    </td>
                    <td className="p-5 border-r border-gray-300">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-black border-2 ${
                          user.status === 'Active' ? 'bg-green-200 text-black border-green-600' : 'bg-red-200 text-black border-red-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-black hover:text-white hover:bg-blue-600 rounded-lg border-2 border-gray-400 hover:border-blue-600 font-bold transition-all"><Eye size={18} /></button>
                        <button className="p-2 text-black hover:text-white hover:bg-orange-600 rounded-lg border-2 border-gray-400 hover:border-orange-600 font-bold transition-all"><Lock size={18} /></button>
                        <button className="p-2 text-black hover:text-white hover:bg-red-600 rounded-lg border-2 border-gray-400 hover:border-red-600 font-bold transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};
