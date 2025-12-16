
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { Button } from './ui/Button';
import { 
  User as UserIcon, Mail, Phone, MapPin, Briefcase, Camera, Save, X, 
  Settings, Shield, Bell, CheckCircle, List, BookOpen, FileText, Truck, 
  Droplets, Clock, AlertTriangle, MonitorPlay, Edit3, Trash2, Plus 
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  isBangla: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, isBangla }) => {
  const { 
    jobs, blogs, wholesaleAds, donors, enrolledCourses,
    deleteJob, updateJob,
    deleteBlog, updateBlog,
    deleteWholesaleAd, updateWholesaleAd
  } = useData();

  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'learning' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({ ...user });
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Item State
  const [editItem, setEditItem] = useState<any | null>(null);
  const [editType, setEditType] = useState<'job' | 'blog' | 'ad' | null>(null);

  // Filter Data for Current User
  const myJobs = jobs.filter((j: any) => j.postedBy === user.name);
  const myBlogs = blogs.filter((b: any) => b.author === user.name);
  const myAds = wholesaleAds.filter((a: any) => a.seller === user.name);
  const isDonor = donors.some((d: any) => d.phone === user.phone || d.name === user.name);
  const myCourses = enrolledCourses; // In a real app, filter by user ID

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  // --- CRUD HANDLERS ---

  const handleDelete = (type: 'job' | 'blog' | 'ad', id: number) => {
    if (window.confirm(isBangla ? 'আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this?')) {
      if (type === 'job') deleteJob(id);
      if (type === 'blog') deleteBlog(id);
      if (type === 'ad') deleteWholesaleAd(id);
    }
  };

  const openEditModal = (type: 'job' | 'blog' | 'ad', item: any) => {
    setEditType(type);
    setEditItem({ ...item });
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !editType) return;

    if (editType === 'job') {
      updateJob(editItem);
    } else if (editType === 'blog') {
      updateBlog(editItem);
    } else if (editType === 'ad') {
      updateWholesaleAd(editItem);
    }

    setEditItem(null);
    setEditType(null);
    alert(isBangla ? 'আপডেট সফল হয়েছে!' : 'Updated successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto relative">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in-up flex items-center gap-3">
          <CheckCircle size={20} />
          <span className="font-medium">{isBangla ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isBangla ? 'আমার একাউন্ট' : 'My Account'}
        </h1>
        <p className="text-gray-500">
          {isBangla ? 'আপনার ব্যক্তিগত তথ্য ও কার্যক্রম' : 'Manage your personal info and activities'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-6 text-sm font-medium transition-colors whitespace-nowrap relative ${
            activeTab === 'profile' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isBangla ? 'প্রোফাইল' : 'Profile Details'}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-4 px-6 text-sm font-medium transition-colors whitespace-nowrap relative ${
            activeTab === 'activity' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isBangla ? 'আমার কার্যক্রম' : 'My Activity'}
        </button>
        <button
          onClick={() => setActiveTab('learning')}
          className={`pb-4 px-6 text-sm font-medium transition-colors whitespace-nowrap relative ${
            activeTab === 'learning' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isBangla ? 'আমার শিক্ষা' : 'My Learning'}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-4 px-6 text-sm font-medium transition-colors whitespace-nowrap relative ${
            activeTab === 'settings' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isBangla ? 'সেটিংস' : 'Settings'}
        </button>
      </div>

      {/* --- PROFILE TAB --- */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-600"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6 gap-4">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => isEditing && fileInputRef.current?.click()}
                >
                  <img 
                    src={formData.avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
      )}

      {/* --- ACTIVITY TAB --- */}
      {activeTab === 'activity' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">{isBangla ? 'চাকরি পোস্ট' : 'Jobs Posted'}</p>
                <h3 className="text-2xl font-bold text-gray-900">{myJobs.length}</h3>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">{isBangla ? 'ব্লগ লেখা' : 'Blogs Written'}</p>
                <h3 className="text-2xl font-bold text-gray-900">{myBlogs.length}</h3>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">{isBangla ? 'পাইকারি বিজ্ঞাপন' : 'Wholesale Ads'}</p>
                <h3 className="text-2xl font-bold text-gray-900">{myAds.length}</h3>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase mb-1">{isBangla ? 'রক্তদাতা' : 'Blood Donor'}</p>
                   <h3 className={`text-lg font-bold ${isDonor ? 'text-green-600' : 'text-gray-400'}`}>
                     {isDonor ? (isBangla ? 'নিবন্ধিত' : 'Registered') : (isBangla ? 'না' : 'No')}
                   </h3>
                </div>
                <Droplets size={24} className={isDonor ? 'text-red-500' : 'text-gray-300'} />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             
             {/* Job History */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-purple-600"/> {isBangla ? 'চাকরি পোস্টের ইতিহাস' : 'Job Post History'}
                </h3>
                {myJobs.length > 0 ? (
                  <div className="space-y-3">
                    {myJobs.map((job: any) => (
                      <div key={job.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start group">
                         <div>
                           <h4 className="font-bold text-gray-800 text-sm">{job.title}</h4>
                           <p className="text-xs text-gray-500">{job.postedDate} • {job.type}</p>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                             {job.status}
                           </span>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal('job', job)} className="p-1.5 bg-white border hover:bg-gray-100 rounded text-gray-600"><Edit3 size={14}/></button>
                            <button onClick={() => handleDelete('job', job.id)} className="p-1.5 bg-white border hover:bg-red-50 text-red-500 rounded"><Trash2 size={14}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">{isBangla ? 'কোন পোস্ট নেই' : 'No jobs posted yet.'}</p>
                )}
             </div>

             {/* Blog History */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600"/> {isBangla ? 'আমার ব্লগ' : 'My Blogs'}
                </h3>
                {myBlogs.length > 0 ? (
                  <div className="space-y-3">
                    {myBlogs.map((blog: any) => (
                      <div key={blog.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start group">
                         <div className="flex-1">
                           <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{blog.title}</h4>
                           <p className="text-xs text-gray-500">{blog.postedDate} • {blog.category}</p>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${blog.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                             {blog.status}
                           </span>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <button onClick={() => openEditModal('blog', blog)} className="p-1.5 bg-white border hover:bg-gray-100 rounded text-gray-600"><Edit3 size={14}/></button>
                            <button onClick={() => handleDelete('blog', blog.id)} className="p-1.5 bg-white border hover:bg-red-50 text-red-500 rounded"><Trash2 size={14}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">{isBangla ? 'কোন ব্লগ নেই' : 'No blogs written yet.'}</p>
                )}
             </div>

             {/* Wholesale Ads */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-orange-600"/> {isBangla ? 'পাইকারি বিজ্ঞাপন' : 'Wholesale Ads'}
                </h3>
                {myAds.length > 0 ? (
                  <div className="space-y-3">
                    {myAds.map((ad: any) => (
                      <div key={ad.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start group">
                         <div>
                           <h4 className="font-bold text-gray-800 text-sm">{ad.product}</h4>
                           <p className="text-xs text-gray-500">{ad.quantity} • ৳ {ad.price}</p>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                             {ad.status}
                           </span>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal('ad', ad)} className="p-1.5 bg-white border hover:bg-gray-100 rounded text-gray-600"><Edit3 size={14}/></button>
                            <button onClick={() => handleDelete('ad', ad.id)} className="p-1.5 bg-white border hover:bg-red-50 text-red-500 rounded"><Trash2 size={14}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">{isBangla ? 'কোন বিজ্ঞাপন নেই' : 'No ads posted yet.'}</p>
                )}
             </div>

          </div>
        </div>
      )}

      {/* --- LEARNING TAB --- */}
      {activeTab === 'learning' && (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen size={24} className="text-amber-600"/> {isBangla ? 'আমার কোর্সসমূহ' : 'My Courses'}
              </h3>
              
              {myCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myCourses.map((course: any, idx: number) => (
                    <div key={idx} className="bg-amber-50/50 rounded-xl p-5 border border-amber-100 flex gap-4">
                       <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                          <MonitorPlay size={32} />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{isBangla ? course.titleBn : course.title}</h4>
                          <p className="text-xs text-gray-500 mb-3">{isBangla ? 'ভর্তি তারিখ:' : 'Enrolled:'} {course.enrolledDate}</p>
                          
                          <div className="w-full bg-white rounded-full h-2.5 mb-1 border border-gray-200">
                            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-amber-700">
                             <span>{isBangla ? 'অগ্রগতি' : 'Progress'}</span>
                             <span>{course.progress}%</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                   <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                   <h4 className="text-gray-900 font-bold mb-1">{isBangla ? 'কোন কোর্স চালু নেই' : 'No Active Courses'}</h4>
                   <p className="text-gray-500 text-sm mb-4">{isBangla ? 'দক্ষতা অর্জনের জন্য নতুন কোর্স শুরু করুন।' : 'Start a new course to learn skills.'}</p>
                   <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                     {isBangla ? 'কোর্স খুঁজুন' : 'Browse Courses'}
                   </Button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* --- SETTINGS TAB --- */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in">
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

      {/* --- EDIT MODAL --- */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setEditItem(null)}>
          <div 
            className={`bg-white w-full ${editType === 'job' ? 'max-w-2xl' : 'max-w-lg'} rounded-2xl shadow-2xl overflow-hidden transform transition-all`} 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit3 size={18} /> {isBangla ? (editType === 'job' ? 'চাকরি আপডেট করুন' : 'তথ্য আপডেট করুন') : (editType === 'job' ? 'Update Job Post' : 'Update Info')}
              </h3>
              <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateItem} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {editType === 'job' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'পদের নাম' : 'Job Title'} *</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'প্রতিষ্ঠান' : 'Company'} *</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.company} onChange={e => setEditItem({...editItem, company: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'কাজের ধরন' : 'Job Type'} *</label>
                            <select 
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                                value={editItem.type || 'Full Time'}
                                onChange={(e) => setEditItem({...editItem, type: e.target.value})}
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'অবস্থান' : 'Location'} *</label>
                            <input type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.location || ''} onChange={e => setEditItem({...editItem, location: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'বেতন' : 'Salary Range'}</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.salary || ''} onChange={e => setEditItem({...editItem, salary: e.target.value})} placeholder="e.g. 20k-30k" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'আবেদনের শেষ তারিখ' : 'Deadline'} *</label>
                            <input type="date" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-600" value={editItem.deadline || ''} onChange={e => setEditItem({...editItem, deadline: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'বিবরণ' : 'Description'} *</label>
                        <textarea required rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none" value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})}></textarea>
                    </div>
                </div>
              )}

              {editType === 'blog' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'শিরোনাম' : 'Title'}</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'ক্যাটাগরি' : 'Category'}</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'বিস্তারিত' : 'Content'}</label>
                    <textarea rows={6} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none" value={editItem.content} onChange={e => setEditItem({...editItem, content: e.target.value})} required></textarea>
                  </div>
                </>
              )}

              {editType === 'ad' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'পণ্যের নাম' : 'Product Name'}</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.product} onChange={e => setEditItem({...editItem, product: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'পরিমাণ' : 'Quantity'}</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.quantity} onChange={e => setEditItem({...editItem, quantity: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{isBangla ? 'দাম' : 'Price'}</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={editItem.price} onChange={e => setEditItem({...editItem, price: e.target.value})} required />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <Button type="button" variant="outline" onClick={() => setEditItem(null)}>{isBangla ? 'বাতিল' : 'Cancel'}</Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6">{isBangla ? 'আপডেট করুন' : 'Update'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
