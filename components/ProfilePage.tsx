
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { Button } from './ui/Button';
import { 
  User as UserIcon, Mail, Phone, MapPin, Briefcase, Camera, Save, X, 
  Settings, Shield, Bell, CheckCircle, List, BookOpen, FileText, Truck, 
  Droplets, Clock, AlertTriangle, MonitorPlay, Edit3, Trash2, Plus 
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { compressImage } from './utils/imageUtils';

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
  const myCourses = enrolledCourses; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 0.6); // Smaller size for avatar
        setFormData(prev => ({ ...prev, avatar: compressed }));
      } catch (err) {
        console.error("Avatar compression failed", err);
      }
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
    <div className="max-w-5xl mx-auto relative px-4 md:px-0">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in-up flex items-center gap-3">
          <CheckCircle size={20} />
          <span className="font-medium">{isBangla ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* Page Title */}
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {isBangla ? 'আমার একাউন্ট' : 'My Account'}
        </h1>
        <p className="text-gray-600 font-medium">
          {isBangla ? 'আপনার ব্যক্তিগত তথ্য ও কার্যক্রম' : 'Manage your personal info and activities'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-6 text-sm font-bold transition-colors whitespace-nowrap relative ${
            activeTab === 'profile' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {isBangla ? 'প্রোফাইল' : 'Profile Details'}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-4 px-6 text-sm font-bold transition-colors whitespace-nowrap relative ${
            activeTab === 'activity' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {isBangla ? 'আমার কার্যক্রম' : 'My Activity'}
        </button>
        <button
          onClick={() => setActiveTab('learning')}
          className={`pb-4 px-6 text-sm font-bold transition-colors whitespace-nowrap relative ${
            activeTab === 'learning' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {isBangla ? 'আমার শিক্ষা' : 'My Learning'}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-4 px-6 text-sm font-bold transition-colors whitespace-nowrap relative ${
            activeTab === 'settings' 
              ? 'text-brand-600 border-b-2 border-brand-600' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {isBangla ? 'সেটিংস' : 'Settings'}
        </button>
      </div>

      {/* --- PROFILE TAB --- */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-700"></div>
            <div className="px-6 pb-8 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-8 gap-4">
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
                  <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
                  <p className="text-brand-600 font-bold flex items-center justify-center sm:justify-start gap-1">
                    <Briefcase size={16} />
                    {user.role}
                  </p>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} className="px-8 font-bold">
                    {isBangla ? 'তথ্য পরিবর্তন করুন' : 'Edit Profile'}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                    {isBangla ? 'নাম' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold ${isEditing ? 'border-gray-300 bg-white text-gray-900 shadow-sm' : 'border-transparent bg-gray-100 text-gray-900'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                    {isBangla ? 'ইমেল' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold ${isEditing ? 'border-gray-300 bg-white text-gray-900 shadow-sm' : 'border-transparent bg-gray-100 text-gray-900'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                    {isBangla ? 'ফোন নম্বর' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+880 1..."
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold ${isEditing ? 'border-gray-300 bg-white text-gray-900 shadow-sm' : 'border-transparent bg-gray-100 text-gray-900'}`}
                    />
                  </div>
                </div>

                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                    {isBangla ? 'ঠিকানা' : 'Location'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Dhaka, Bangladesh"
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold ${isEditing ? 'border-gray-300 bg-white text-gray-900 shadow-sm' : 'border-transparent bg-gray-100 text-gray-900'}`}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 font-bold px-6">
                    <X size={18} />
                    {isBangla ? 'বাতিল' : 'Cancel'}
                  </Button>
                  <Button onClick={handleSave} className="flex items-center gap-2 font-bold px-8 shadow-lg shadow-brand-500/20">
                    <Save size={18} />
                    {isBangla ? 'সেভ করুন' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-widest">
              {isBangla ? 'অ্যাকাউন্ট স্ট্যাটাস' : 'Account Status'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-green-50 rounded-2xl border border-green-100 shadow-inner">
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Role</span>
                <p className="font-black text-green-900 text-xl mt-1">{user.role}</p>
              </div>
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 shadow-inner">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Member Since</span>
                <p className="font-black text-blue-900 text-xl mt-1">Oct 2023</p>
              </div>
              <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 shadow-inner">
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Verified</span>
                <p className="font-black text-purple-900 text-xl mt-1 flex items-center gap-2">
                  Level 2 <CheckCircle size={18} className="text-purple-500" />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ACTIVITY TAB --- */}
      {activeTab === 'activity' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{isBangla ? 'চাকরি পোস্ট' : 'Jobs Posted'}</p>
                <h3 className="text-3xl font-black text-gray-900">{myJobs.length}</h3>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{isBangla ? 'ব্লগ লেখা' : 'Blogs Written'}</p>
                <h3 className="text-3xl font-black text-gray-900">{myBlogs.length}</h3>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{isBangla ? 'পাইকারি বিজ্ঞাপন' : 'Wholesale Ads'}</p>
                <h3 className="text-3xl font-black text-gray-900">{myAds.length}</h3>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between px-6">
                <div className="text-left">
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{isBangla ? 'রক্তদাতা' : 'Blood Donor'}</p>
                   <h3 className={`text-xl font-black ${isDonor ? 'text-red-600' : 'text-gray-300'}`}>
                     {isDonor ? (isBangla ? 'নিবন্ধিত' : 'Registered') : (isBangla ? 'না' : 'No')}
                   </h3>
                </div>
                <Droplets size={32} className={isDonor ? 'text-red-500 animate-pulse' : 'text-gray-200'} />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><Briefcase size={20}/></div>
                  {isBangla ? 'চাকরি পোস্টের ইতিহাস' : 'Job Post History'}
                </h3>
                {myJobs.length > 0 ? (
                  <div className="space-y-4">
                    {myJobs.map((job: any) => (
                      <div key={job.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-start group hover:bg-white hover:border-brand-200 transition-all shadow-sm">
                         <div>
                           <h4 className="font-black text-gray-900 text-sm">{job.title}</h4>
                           <p className="text-xs text-gray-500 font-medium">{job.postedDate} • {job.type}</p>
                           <span className={`text-[10px] font-black px-2 py-0.5 rounded-full mt-2 inline-block uppercase tracking-wider ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                             {job.status}
                           </span>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal('job', job)} className="p-2 bg-white border border-gray-200 hover:bg-brand-50 rounded-xl text-gray-600 hover:text-brand-600 transition-all"><Edit3 size={16}/></button>
                            <button onClick={() => handleDelete('job', job.id)} className="p-2 bg-white border border-gray-200 hover:bg-red-50 rounded-xl text-red-500 transition-all"><Trash2 size={16}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-10 font-bold italic">{isBangla ? 'কোন পোস্ট নেই' : 'No jobs posted yet.'}</p>
                )}
             </div>

             <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><FileText size={20}/></div>
                  {isBangla ? 'আমার ব্লগ' : 'My Blogs'}
                </h3>
                {myBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {myBlogs.map((blog: any) => (
                      <div key={blog.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-start group hover:bg-white hover:border-brand-200 transition-all shadow-sm">
                         <div className="flex-1">
                           <h4 className="font-black text-gray-900 text-sm line-clamp-1">{blog.title}</h4>
                           <p className="text-xs text-gray-500 font-medium">{blog.postedDate} • {blog.category}</p>
                           <span className={`text-[10px] font-black px-2 py-0.5 rounded-full mt-2 inline-block uppercase tracking-wider ${blog.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                             {blog.status}
                           </span>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                            <button onClick={() => openEditModal('blog', blog)} className="p-2 bg-white border border-gray-200 hover:bg-brand-50 rounded-xl text-gray-600 hover:text-brand-600 transition-all"><Edit3 size={16}/></button>
                            <button onClick={() => handleDelete('blog', blog.id)} className="p-2 bg-white border border-gray-200 hover:bg-red-50 rounded-xl text-red-500 transition-all"><Trash2 size={16}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-10 font-bold italic">{isBangla ? 'কোন ব্লগ নেই' : 'No blogs written yet.'}</p>
                )}
             </div>
          </div>
        </div>
      )}

      {/* --- LEARNING TAB --- */}
      {activeTab === 'learning' && (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600"><BookOpen size={24}/></div>
                {isBangla ? 'আমার কোর্সসমূহ' : 'My Courses'}
              </h3>
              
              {myCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {myCourses.map((course: any, idx: number) => (
                    <div key={idx} className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100 flex gap-6 items-center hover:shadow-md transition-all group">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                          <MonitorPlay size={32} />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-black text-gray-900 mb-1">{isBangla ? course.titleBn : course.title}</h4>
                          <p className="text-xs text-gray-500 font-bold mb-4">{isBangla ? 'ভর্তি তারিখ:' : 'Enrolled:'} {course.enrolledDate}</p>
                          
                          <div className="w-full bg-white rounded-full h-3 mb-2 border border-gray-100 shadow-inner">
                            <div className="bg-amber-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs font-black text-amber-700 uppercase tracking-tighter">
                             <span>{isBangla ? 'অগ্রগতি' : 'Progress'}</span>
                             <span>{course.progress}%</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                   <BookOpen size={64} className="mx-auto text-gray-200 mb-4" />
                   <h4 className="text-gray-900 font-black text-xl mb-2">{isBangla ? 'কোন কোর্স চালু নেই' : 'No Active Courses'}</h4>
                   <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">{isBangla ? 'দক্ষতা অর্জনের জন্য নতুন কোর্স শুরু করুন এবং নিজেকে স্বাবলম্বী করে তুলুন।' : 'Start a new course to learn skills and become self-reliant.'}</p>
                   <Button className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95">
                     {isBangla ? 'কোর্স খুঁজুন' : 'Browse Courses'}
                   </Button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* --- SETTINGS TAB (High Contrast Update) --- */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in pb-12">
           <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10">
             <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
               <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Shield size={28} /></div>
               <div>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">{isBangla ? 'নিরাপত্তা' : 'Security'}</h3>
                 <p className="text-sm text-gray-500 font-medium">{isBangla ? 'আপনার পাসওয়ার্ড পরিবর্তন করুন এবং একাউন্ট সুরক্ষিত রাখুন' : 'Change your password and secure your account'}</p>
               </div>
             </div>
             <div className="space-y-6 max-w-md">
               <div>
                 <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2 ml-1">
                   {isBangla ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
                 </label>
                 <input 
                   type="password" 
                   className="block w-full px-5 py-4 border-2 border-gray-200 rounded-[1.25rem] bg-white text-gray-900 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold placeholder-gray-300"
                   placeholder="••••••••"
                 />
               </div>
               <div>
                 <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2 ml-1">
                   {isBangla ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                 </label>
                 <input 
                   type="password" 
                   className="block w-full px-5 py-4 border-2 border-gray-200 rounded-[1.25rem] bg-white text-gray-900 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-bold placeholder-gray-300"
                   placeholder="••••••••"
                 />
               </div>
               <Button className="w-full md:w-auto px-10 py-4 rounded-[1.25rem] font-black uppercase tracking-wider shadow-xl shadow-brand-500/20 text-sm">
                 {isBangla ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}
               </Button>
             </div>
           </div>

           <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10">
             <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-red-50 rounded-2xl text-red-500"><Bell size={28} /></div>
               <div>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">{isBangla ? 'নোটিফিকেশন' : 'Notifications'}</h3>
                 <p className="text-sm text-gray-500 font-medium">{isBangla ? 'আপনি কি ধরনের বার্তা পেতে চান তা নির্বাচন করুন' : 'Manage how you receive updates and alerts'}</p>
               </div>
             </div>
             <div className="space-y-4 max-w-xl">
               <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100 group hover:border-brand-200 transition-colors">
                 <span className="text-gray-900 font-bold text-lg">{isBangla ? 'ইমেল বার্তা' : 'Email Notifications'}</span>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" defaultChecked />
                   <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-brand-600"></div>
                 </label>
               </div>
               <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100 group hover:border-brand-200 transition-colors">
                 <span className="text-gray-900 font-bold text-lg">{isBangla ? 'এসএমএস বার্তা' : 'SMS Alerts'}</span>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" />
                   <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-brand-600"></div>
                 </label>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setEditItem(null)}>
          <div 
            className={`bg-white w-full ${editType === 'job' ? 'max-w-2xl' : 'max-w-lg'} rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all border border-white/20`} 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                <Edit3 size={24} className="text-brand-600" /> {isBangla ? (editType === 'job' ? 'চাকরি আপডেট করুন' : 'তথ্য আপডেট করুন') : (editType === 'job' ? 'Update Job Post' : 'Update Info')}
              </h3>
              <button onClick={() => setEditItem(null)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateItem} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              
              {editType === 'job' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'পদের নাম' : 'Job Title'} *</label>
                            <input type="text" className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'প্রতিষ্ঠান' : 'Company'} *</label>
                            <input type="text" className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.company} onChange={e => setEditItem({...editItem, company: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'কাজের ধরন' : 'Job Type'} *</label>
                            <select 
                                className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold bg-white appearance-none cursor-pointer"
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
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'অবস্থান' : 'Location'} *</label>
                            <input type="text" required className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.location || ''} onChange={e => setEditItem({...editItem, location: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'বেতন' : 'Salary Range'}</label>
                            <input type="text" className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.salary || ''} onChange={e => setEditItem({...editItem, salary: e.target.value})} placeholder="e.g. 20k-30k" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'আবেদনের শেষ তারিখ' : 'Deadline'} *</label>
                            <input type="date" required className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold text-gray-600" value={editItem.deadline || ''} onChange={e => setEditItem({...editItem, deadline: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'বিবরণ' : 'Description'} *</label>
                        <textarea required rows={6} className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-medium resize-none leading-relaxed" value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})}></textarea>
                    </div>
                </div>
              )}

              {editType === 'blog' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'শিরোনাম' : 'Title'}</label>
                    <input type="text" className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'ক্যাটাগরি' : 'Category'}</label>
                    <input type="text" className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'বিস্তারিত' : 'Content'}</label>
                    <textarea rows={10} className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-medium resize-none leading-relaxed" value={editItem.content} onChange={e => setEditItem({...editItem, content: e.target.value})} required></textarea>
                  </div>
                </div>
              )}

              {editType === 'ad' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'পণ্যের নাম' : 'Product Name'}</label>
                    <input type="text" className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.product} onChange={e => setEditItem({...editItem, product: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'পরিমাণ' : 'Quantity'}</label>
                        <input type="text" className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.quantity} onChange={e => setEditItem({...editItem, quantity: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">{isBangla ? 'দাম' : 'Price'}</label>
                        <input type="text" className="w-full px-5 py-3.5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold" value={editItem.price} onChange={e => setEditItem({...editItem, price: e.target.value})} required />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setEditItem(null)} className="px-8 font-bold">{isBangla ? 'বাতিল' : 'Cancel'}</Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-black px-10 rounded-[1.25rem] shadow-xl shadow-brand-500/20">{isBangla ? 'আপডেট করুন' : 'Update'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
