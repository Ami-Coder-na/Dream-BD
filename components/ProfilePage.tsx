import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Button } from './ui/Button';
import { User as UserIcon, Mail, Phone, MapPin, Briefcase, Camera, Save, X, Settings, Shield, Bell } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  isBangla: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, isBangla }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isBangla ? 'আমার একাউন্ট' : 'My Account'}
        </h1>
        <p className="text-gray-500">
          {isBangla ? 'আপনার ব্যক্তিগত তথ্য ও সেটিংস' : 'Manage your personal info and settings'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
            activeTab === 'profile' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isBangla ? 'প্রোফাইল' : 'Profile Details'}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
            activeTab === 'settings' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isBangla ? 'সেটিংস' : 'Settings'}
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-600"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6 gap-4">
                <div className="relative group">
                  <img 
                    src={formData.avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                    <Briefcase size={16} />
                    {user.role}
                  </p>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    {isBangla ? 'এডিট প্রোফাইল' : 'Edit Profile'}
                  </Button>
                )}
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isBangla ? 'নাম' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-600'}`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isBangla ? 'ইমেল' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-600'}`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isBangla ? 'ফোন নম্বর' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+880 1..."
                      className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-600'}`}
                    />
                  </div>
                </div>

                 {/* Location */}
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isBangla ? 'ঠিকানা' : 'Location'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Dhaka, Bangladesh"
                      className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 ${isEditing ? 'border-gray-300 bg-white' : 'border-transparent bg-gray-50 text-gray-600'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                    <X size={18} />
                    {isBangla ? 'বাতিল' : 'Cancel'}
                  </Button>
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save size={18} />
                    {isBangla ? 'সেভ করুন' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Stats/Role Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {isBangla ? 'অ্যাকাউন্ট স্ট্যাটাস' : 'Account Status'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <span className="text-xs font-semibold text-green-600 uppercase">Role</span>
                <p className="font-bold text-green-900 mt-1">{user.role}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-xs font-semibold text-blue-600 uppercase">Member Since</span>
                <p className="font-bold text-blue-900 mt-1">Oct 2023</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <span className="text-xs font-semibold text-purple-600 uppercase">Verified</span>
                <p className="font-bold text-purple-900 mt-1">Level 2</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Settings Tab Content */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center gap-3 mb-6">
               <Shield className="text-gray-400" size={24} />
               <div>
                 <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'নিরাপত্তা' : 'Security'}</h3>
                 <p className="text-sm text-gray-500">{isBangla ? 'আপনার পাসওয়ার্ড পরিবর্তন করুন' : 'Change your password'}</p>
               </div>
             </div>
             <div className="space-y-4 max-w-md">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">{isBangla ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}</label>
                 <input type="password" className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">{isBangla ? 'নতুন পাসওয়ার্ড' : 'New Password'}</label>
                 <input type="password" className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500" />
               </div>
               <Button>{isBangla ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}</Button>
             </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center gap-3 mb-6">
               <Bell className="text-gray-400" size={24} />
               <div>
                 <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'নোটিফিকেশন' : 'Notifications'}</h3>
                 <p className="text-sm text-gray-500">{isBangla ? 'আপনি কি ধরনের বার্তা পেতে চান' : 'Manage how you receive updates'}</p>
               </div>
             </div>
             <div className="space-y-3">
               <div className="flex items-center justify-between py-2">
                 <span className="text-gray-700">{isBangla ? 'ইমেল বার্তা' : 'Email Notifications'}</span>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" defaultChecked />
                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                 </label>
               </div>
               <div className="flex items-center justify-between py-2">
                 <span className="text-gray-700">{isBangla ? 'এসএমএস বার্তা' : 'SMS Alerts'}</span>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" />
                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                 </label>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};