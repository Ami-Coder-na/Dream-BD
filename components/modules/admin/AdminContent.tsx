
import React, { useState } from 'react';
import { Briefcase, FileText, Plus, Search, Eye, Edit3, Trash2, Check, X, Filter, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/Button';

// Mock Data
const INITIAL_JOBS = [
  { id: 101, title: 'Assistant Teacher', company: 'Little Flower School', type: 'Full Time', location: 'Dhaka', salary: '15k-20k', postedBy: 'Admin', date: '2023-10-25', status: 'Active', views: 1250 },
  { id: 102, title: 'Farm Manager', company: 'Green Agro', type: 'Contract', location: 'Rangpur', salary: '25k', postedBy: 'User', date: '2023-10-26', status: 'Pending', views: 0 },
  { id: 103, title: 'Software Engineer', company: 'Tech BD', type: 'Remote', location: 'Dhaka', salary: '50k+', postedBy: 'Admin', date: '2023-10-20', status: 'Active', views: 3400 },
];

const INITIAL_BLOGS = [
  { id: 201, title: 'Winter Farming Tips', category: 'Agriculture', author: 'Abdul Malek', postedBy: 'User', date: '2023-10-24', status: 'Pending', views: 0 },
  { id: 202, title: 'Digital Health Services', category: 'Health', author: 'Dr. Nusrat', postedBy: 'Admin', date: '2023-10-15', status: 'Active', views: 5600 },
  { id: 203, title: 'Safe Driving Rules', category: 'Transport', author: 'Admin', postedBy: 'Admin', date: '2023-10-10', status: 'Active', views: 2100 },
];

export const AdminContent = () => {
  const [activeContentTab, setActiveContentTab] = useState<'jobs' | 'blogs' | 'requests'>('jobs');
  const [contentSearch, setContentSearch] = useState('');
  
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);

  const handleStatusChange = (id: number, type: 'job' | 'blog', newStatus: string) => {
    if (type === 'job') {
      setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
    } else {
      setBlogs(blogs.map(b => b.id === id ? { ...b, status: newStatus } : b));
    }
  };

  const handleDelete = (id: number, type: 'job' | 'blog') => {
    if(!confirm('Are you sure?')) return;
    if (type === 'job') setJobs(jobs.filter(j => j.id !== id));
    else setBlogs(blogs.filter(b => b.id !== id));
  };

  const pendingJobs = jobs.filter(j => j.status === 'Pending');
  const pendingBlogs = blogs.filter(b => b.status === 'Pending');

  const getFilteredData = () => {
    const term = contentSearch.toLowerCase();
    if (activeContentTab === 'jobs') {
      return jobs.filter(j => j.status !== 'Pending' && (j.title.toLowerCase().includes(term) || j.company.toLowerCase().includes(term)));
    } else if (activeContentTab === 'blogs') {
      return blogs.filter(b => b.status !== 'Pending' && (b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)));
    }
    return [];
  };

  const renderStatusBadge = (status: string) => (
    <span className={`px-3 py-1.5 rounded-md text-sm font-bold border-2 ${
      status === 'Active' 
        ? 'bg-green-200 text-black border-green-600' 
        : status === 'Pending' 
          ? 'bg-orange-200 text-black border-orange-600'
          : 'bg-red-200 text-black border-red-600'
    }`}>
      {status}
    </span>
  );

  return (
    <div className="space-y-6 animate-fade-in">
        
        {/* Header & Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-300">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
              <div>
                <h3 className="text-2xl font-black text-black flex items-center gap-2">
                  <FileText className="text-blue-800" size={28} /> Content Management
                </h3>
                <p className="text-black font-bold text-sm mt-1">Manage jobs, blogs, and user requests</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                 {/* Search */}
                 {activeContentTab !== 'requests' && (
                   <div className="relative flex-1 sm:w-64">
                     <Search className="absolute left-3 top-3 text-black" size={18} />
                     <input 
                       type="text" 
                       placeholder="Search content..." 
                       value={contentSearch} 
                       onChange={(e) => setContentSearch(e.target.value)} 
                       className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black text-black rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm placeholder-gray-600" 
                     />
                   </div>
                 )}
                 <Button className="bg-black hover:bg-gray-800 text-white font-bold border-2 border-black px-6">
                    <Plus size={18} className="mr-2" /> Create New
                 </Button>
              </div>
           </div>

           {/* Tabs */}
           <div className="flex bg-gray-100 p-1.5 rounded-xl border-2 border-black w-full md:w-fit mb-6">
              <button 
                onClick={() => setActiveContentTab('jobs')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-black transition-all ${activeContentTab === 'jobs' ? 'bg-white text-blue-900 shadow-sm border-2 border-black' : 'text-black hover:bg-gray-200'}`}
              >
                Jobs
              </button>
              <button 
                onClick={() => setActiveContentTab('blogs')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-black transition-all ${activeContentTab === 'blogs' ? 'bg-white text-blue-900 shadow-sm border-2 border-black' : 'text-black hover:bg-gray-200'}`}
              >
                Blogs
              </button>
              <button 
                onClick={() => setActiveContentTab('requests')}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-black transition-all flex items-center justify-center gap-2 ${activeContentTab === 'requests' ? 'bg-white text-orange-800 shadow-sm border-2 border-black' : 'text-black hover:bg-gray-200'}`}
              >
                Requests 
                {(pendingJobs.length + pendingBlogs.length) > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{pendingJobs.length + pendingBlogs.length}</span>
                )}
              </button>
           </div>

           {/* Content Area */}
           {activeContentTab === 'requests' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Pending Jobs */}
                 <div className="bg-white border-2 border-black rounded-xl p-5 shadow-sm">
                    <h4 className="font-black text-lg text-black mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                       <Briefcase size={20} className="text-purple-700"/> Pending Jobs ({pendingJobs.length})
                    </h4>
                    <div className="space-y-3">
                       {pendingJobs.map(job => (
                          <div key={job.id} className="p-4 bg-gray-50 border-2 border-gray-300 rounded-xl hover:border-purple-500 transition-colors">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                   <h5 className="font-bold text-black">{job.title}</h5>
                                   <p className="text-xs font-bold text-gray-600">{job.company}</p>
                                </div>
                                <span className="text-xs font-bold text-gray-500">{job.date}</span>
                             </div>
                             <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-gray-200">
                                <span className="text-xs font-bold text-gray-700">By: {job.postedBy}</span>
                                <div className="flex gap-2">
                                   <button className="p-1.5 bg-white border-2 border-black rounded text-black hover:bg-gray-100"><Eye size={16}/></button>
                                   <button onClick={() => handleStatusChange(job.id, 'job', 'Active')} className="p-1.5 bg-green-200 border-2 border-green-600 rounded text-green-800 hover:bg-green-300"><Check size={16}/></button>
                                   <button onClick={() => handleStatusChange(job.id, 'job', 'Rejected')} className="p-1.5 bg-red-200 border-2 border-red-600 rounded text-red-800 hover:bg-red-300"><X size={16}/></button>
                                </div>
                             </div>
                          </div>
                       ))}
                       {pendingJobs.length === 0 && <p className="text-center text-gray-500 font-bold py-4">No pending job requests.</p>}
                    </div>
                 </div>

                 {/* Pending Blogs */}
                 <div className="bg-white border-2 border-black rounded-xl p-5 shadow-sm">
                    <h4 className="font-black text-lg text-black mb-4 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                       <MessageSquare size={20} className="text-blue-700"/> Pending Blogs ({pendingBlogs.length})
                    </h4>
                    <div className="space-y-3">
                       {pendingBlogs.map(blog => (
                          <div key={blog.id} className="p-4 bg-gray-50 border-2 border-gray-300 rounded-xl hover:border-blue-500 transition-colors">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                   <h5 className="font-bold text-black">{blog.title}</h5>
                                   <p className="text-xs font-bold text-gray-600">{blog.category}</p>
                                </div>
                                <span className="text-xs font-bold text-gray-500">{blog.date}</span>
                             </div>
                             <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-gray-200">
                                <span className="text-xs font-bold text-gray-700">Author: {blog.author}</span>
                                <div className="flex gap-2">
                                   <button className="p-1.5 bg-white border-2 border-black rounded text-black hover:bg-gray-100"><Eye size={16}/></button>
                                   <button onClick={() => handleStatusChange(blog.id, 'blog', 'Active')} className="p-1.5 bg-green-200 border-2 border-green-600 rounded text-green-800 hover:bg-green-300"><Check size={16}/></button>
                                   <button onClick={() => handleStatusChange(blog.id, 'blog', 'Rejected')} className="p-1.5 bg-red-200 border-2 border-red-600 rounded text-red-800 hover:bg-red-300"><X size={16}/></button>
                                </div>
                             </div>
                          </div>
                       ))}
                       {pendingBlogs.length === 0 && <p className="text-center text-gray-500 font-bold py-4">No pending blog requests.</p>}
                    </div>
                 </div>
              </div>
           ) : (
              /* Active Content Table */
              <div className="overflow-x-auto rounded-t-xl border-2 border-black">
                 <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-black text-white font-extrabold uppercase text-sm tracking-wider">
                       <tr>
                          <th className="p-5 border-r border-gray-700">{activeContentTab === 'jobs' ? 'Job Title' : 'Blog Title'}</th>
                          <th className="p-5 border-r border-gray-700">{activeContentTab === 'jobs' ? 'Company' : 'Category'}</th>
                          <th className="p-5 border-r border-gray-700">Date</th>
                          <th className="p-5 border-r border-gray-700">Views</th>
                          <th className="p-5 border-r border-gray-700">Status</th>
                          <th className="p-5 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="bg-white">
                       {getFilteredData().map((item: any) => (
                          <tr key={item.id} className="border-b-2 border-gray-300 hover:bg-gray-100 transition-colors">
                             <td className="p-5 border-r border-gray-300 font-black text-black text-base">{item.title}</td>
                             <td className="p-5 border-r border-gray-300 font-bold text-gray-800">
                                {activeContentTab === 'jobs' ? item.company : item.category}
                             </td>
                             <td className="p-5 border-r border-gray-300 font-bold text-gray-600">{item.date}</td>
                             <td className="p-5 border-r border-gray-300 font-bold text-gray-600">{item.views}</td>
                             <td className="p-5 border-r border-gray-300">{renderStatusBadge(item.status)}</td>
                             <td className="p-5 text-right">
                                <div className="flex justify-end gap-2">
                                   <button className="p-2 bg-white border-2 border-black rounded-lg hover:bg-gray-200 transition-all text-black"><Eye size={18}/></button>
                                   <button className="p-2 bg-white border-2 border-black rounded-lg hover:bg-blue-100 hover:text-blue-700 hover:border-blue-700 transition-all text-black"><Edit3 size={18}/></button>
                                   <button onClick={() => handleDelete(item.id, activeContentTab === 'jobs' ? 'job' : 'blog')} className="p-2 bg-white border-2 border-red-500 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all text-red-500"><Trash2 size={18}/></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                       {getFilteredData().length === 0 && (
                          <tr><td colSpan={6} className="p-10 text-center font-bold text-gray-500">No content found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
    </div>
  );
};
