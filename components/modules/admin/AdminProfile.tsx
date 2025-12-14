
import React, { useState } from 'react';
import { 
  User, Lock, Activity, Shield, Save, Mail, Phone, 
  MapPin, Camera, Key, Clock, CheckCircle, AlertCircle, Edit3, X
} from 'lucide-react';
import { Button } from '../../ui/Button';

export const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'activity' | 'permissions'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock Admin Data
  const [adminData, setAdminData] = useState({
    name: 'Super Admin',
    email: 'admin@dreambd.com',
    phone: '+880 1711 000000',
    role: 'Super Administrator',
    location: 'Dhaka, Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    joined: 'Jan 2023'
  });

  // Mock Activity Data
  const activities = [
    { id: 1, action: 'Updated Agriculture Config', date: 'Today, 10:30 AM', type: 'update' },
    { id: 2, action: 'Banned User: user_452', date: 'Yesterday, 4:15 PM', type: 'alert' },
    { id: 3, action: 'Approved 5 Job Posts', date: 'Oct 24, 2023', type: 'success' },
    { id: 4, action: 'System Backup Completed', date: 'Oct 23, 2023', type: 'info' },
    { id: 5, action: 'Changed Password', date: 'Oct 20, 2023', type: 'security' }
  ];

  // Mock Permissions
  const permissions = [
    { module: 'User Management', read: true, write: true, delete: true },
    { module: 'Content Moderation', read: true, write: true, delete: true },
    { module: 'Module Configuration', read: true, write: true, delete: true },
    { module: 'System Settings', read: true, write: true, delete: false },
    { module: 'Financial Reports', read: true, write: false, delete: false },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Password changed successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-green-100 bg-white">
            <img src={adminData.avatar} alt="Admin" className="w-full h-full rounded-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full hover:bg-black transition-colors shadow-md">
            <Camera size={14} />
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1 justify-center md:justify-start">
            <h2 className="text-2xl font-bold text-gray-900">{adminData.name}</h2>
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
              {adminData.role}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-4 flex items-center justify-center md:justify-start gap-2">
            <Mail size={14} /> {adminData.email}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="text-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
              <p className="text-green-600 font-bold text-sm flex items-center gap-1 justify-center"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</p>
            </div>
            <div className="text-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase">Joined</p>
              <p className="text-gray-900 font-bold text-sm">{adminData.joined}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-2 space-y-1">
              {[
                { id: 'general', label: 'General Info', icon: <User size={18} /> },
                { id: 'security', label: 'Password & Security', icon: <Lock size={18} /> },
                { id: 'activity', label: 'Activity Logs', icon: <Activity size={18} /> },
                { id: 'permissions', label: 'Role Permissions', icon: <Shield size={18} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[400px]">
            
            {/* General Info Tab */}
            {activeTab === 'general' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                      <Edit3 size={16}/> Edit
                    </Button>
                  )}
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={adminData.name}
                          onChange={e => setAdminData({...adminData, name: e.target.value})}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-gray-900' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                          type="email" 
                          disabled={!isEditing}
                          value={adminData.email}
                          onChange={e => setAdminData({...adminData, email: e.target.value})}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-gray-900' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={adminData.phone}
                          onChange={e => setAdminData({...adminData, phone: e.target.value})}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-gray-900' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={adminData.location}
                          onChange={e => setAdminData({...adminData, location: e.target.value})}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-gray-900' : 'bg-gray-50 border-transparent text-gray-500 cursor-not-allowed'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button type="submit" disabled={loading} className="bg-gray-900 text-white">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="animate-fade-in max-w-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="password" required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all" placeholder="••••••••" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="password" required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all" placeholder="••••••••" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Minimum 8 characters with letters and numbers.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="password" required className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg">
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Recent Activity Logs</h3>
                <div className="space-y-6">
                  {activities.map((act, i) => (
                    <div key={act.id} className="flex gap-4 relative">
                      {/* Timeline Line */}
                      {i !== activities.length - 1 && (
                        <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-gray-200 -mb-6"></div>
                      )}
                      
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm z-10 ${
                        act.type === 'update' ? 'bg-blue-100 text-blue-600' :
                        act.type === 'alert' ? 'bg-red-100 text-red-600' :
                        act.type === 'success' ? 'bg-green-100 text-green-600' :
                        act.type === 'security' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {act.type === 'security' ? <Lock size={16}/> : act.type === 'alert' ? <AlertCircle size={16}/> : <Clock size={16}/>}
                      </div>
                      <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <p className="font-bold text-gray-900 text-sm">{act.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{act.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button className="text-sm font-bold text-gray-600 hover:text-gray-900 hover:underline">View All History</button>
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                  <Shield className="text-green-600" /> Role & Permissions
                </h3>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-bold text-green-800 text-sm">Super Administrator Access</p>
                    <p className="text-xs text-green-700 mt-1">You have full access to all modules and settings. Be careful with critical actions.</p>
                  </div>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-900 text-white font-bold uppercase text-xs">
                      <tr>
                        <th className="p-4">Module Name</th>
                        <th className="p-4 text-center">Read</th>
                        <th className="p-4 text-center">Write</th>
                        <th className="p-4 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {permissions.map((perm, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-4 font-bold text-gray-800">{perm.module}</td>
                          <td className="p-4 text-center">{perm.read ? <CheckCircle size={18} className="text-green-500 mx-auto"/> : <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>}</td>
                          <td className="p-4 text-center">{perm.write ? <CheckCircle size={18} className="text-green-500 mx-auto"/> : <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>}</td>
                          <td className="p-4 text-center">{perm.delete ? <CheckCircle size={18} className="text-green-500 mx-auto"/> : <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>}</td>
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
    </div>
  );
};
