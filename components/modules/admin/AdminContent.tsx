
import React, { useState, useRef, useMemo } from 'react';
import { 
  Briefcase, FileText, Plus, Search, Eye, Edit3, Trash2, 
  Check, X, ArrowLeft, Save, 
  MapPin, DollarSign, Calendar, Tag, User, Building2, Image as ImageIcon, Loader2, Upload, Truck, Phone, PlusCircle, Filter, RefreshCw,
  ChevronDown, Clock, CheckCircle
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';
import { compressImage } from '../../utils/imageUtils';

export const AdminContent = () => {
  const { jobs, blogs, requests, blogRequests, wholesaleRequests, addJob, addBlog, deleteJob, deleteBlog, handleRequestAction, updateJob, updateBlog } = useData();
  
  const [view, setView] = useState<'list' | 'create_job' | 'create_blog' | 'details' | 'edit_job' | 'edit_blog'>('list');
  const [activeTab, setActiveTab] = useState<'jobs' | 'blogs' | 'requests'>('jobs');
  
  const [contentSearch, setContentSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const INITIAL_JOB = {
    title: '', company: '', description: '', location: '', salary: '', type: 'Full Time', deadline: '', category: 'Private'
  };

  const INITIAL_BLOG = {
    title: '', category: 'General', content: '', image: '', author: 'Admin'
  };

  const [jobForm, setJobForm] = useState<any>(INITIAL_JOB);
  const [blogForm, setBlogForm] = useState<any>(INITIAL_BLOG);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        const compressed = await compressImage(file, 1200, 0.7);
        setBlogForm({ ...blogForm, image: compressed });
      } catch (err) {
        console.error("Image compression failed", err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'edit_job') {
        await updateJob(jobForm);
        alert('Job updated successfully!');
    } else {
        await addJob({ ...jobForm, status: 'Active', posteddate: new Date().toLocaleDateString() });
        alert('Job added successfully!');
    }
    setView('list');
    setJobForm(INITIAL_JOB);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'edit_blog') {
        await updateBlog(blogForm);
        alert('Blog updated successfully!');
    } else {
        await addBlog({ ...blogForm, status: 'Active', posteddate: new Date().toLocaleDateString(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
        alert('Blog added successfully!');
    }
    setView('list');
    setBlogForm(INITIAL_BLOG);
  };

  const openEditJob = (job: any) => {
    setJobForm({ ...job });
    setView('edit_job');
  };

  const openEditBlog = (blog: any) => {
    setBlogForm({ ...blog });
    setView('edit_blog');
  };

  const filteredJobs = jobs.filter((j: any) => {
    const matchesSearch = (j.title?.toLowerCase() || '').includes(contentSearch.toLowerCase()) || (j.company?.toLowerCase() || '').includes(contentSearch.toLowerCase());
    return matchesSearch;
  });

  const filteredBlogs = blogs.filter((b: any) => {
    return (b.title?.toLowerCase() || '').includes(contentSearch.toLowerCase());
  });

  if (view === 'create_job' || view === 'edit_job') {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Briefcase size={20} className="text-purple-600" />
              {view === 'edit_job' ? 'Edit Job Post' : 'Post New Job'}
            </h3>
            <button onClick={() => setView('list')} className="text-gray-400 hover:text-red-500">
              <X size={20}/>
            </button>
          </div>
          <form onSubmit={handleJobSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Job Title</label>
                <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="e.g. Senior Accountant" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} placeholder="Company Ltd." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Job Type</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                  <option>Government</option>
                  <option>Private</option>
                  <option>NGO</option>
                  <option>Autonomous</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Dhaka" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Salary Range</label>
                <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="e.g. 30k - 40k" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Application Deadline</label>
                <input type="date" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Description</label>
              <textarea rows={8} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 resize-none" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} placeholder="Detailed requirements, responsibilities..."></textarea>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 font-bold shadow-lg shadow-purple-200">
              {view === 'edit_job' ? 'Update Job Post' : 'Publish Job Listing'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'create_blog' || view === 'edit_blog') {
    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><FileText size={20} className="text-blue-600" />{view === 'edit_blog' ? 'Edit Blog Article' : 'Write New Blog'}</h3>
                    <button onClick={() => setView('list')} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                </div>
                <form onSubmit={handleBlogSubmit} className="p-8 space-y-6">
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Title</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Category</label><select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}><option>Agriculture</option><option>Health</option><option>Education</option><option>Technology</option><option>General</option></select></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Cover Image</label><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1 border-dashed" disabled={isProcessing}>{isProcessing ? 'Processing...' : (blogForm.image ? 'Change Image' : 'Upload Image')}</Button><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />{blogForm.image && <div className="w-10 h-10 rounded-lg border overflow-hidden"><img src={blogForm.image} className="w-full h-full object-cover" /></div>}</div></div>
                    </div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Content</label><textarea rows={10} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 resize-none" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})}></textarea></div>
                    <Button type="submit" disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 font-bold">Publish Article</Button>
                </form>
            </div>
        </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-50 pb-6">
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-full md:w-fit overflow-x-auto">
                  <button onClick={() => { setActiveTab('jobs'); }} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'jobs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Approved Jobs</button>
                  <button onClick={() => { setActiveTab('blogs'); }} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'blogs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Approved Blogs</button>
                  <button onClick={() => setActiveTab('requests')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Moderation Queue {(requests.length + blogRequests.length + wholesaleRequests.length) > 0 && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{requests.length + blogRequests.length + wholesaleRequests.length}</span>}</button>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button onClick={() => setView('create_job')} className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 px-6 shadow-md">
                  <Briefcase size={18} /> Add Job
                </Button>
                <Button onClick={() => setView('create_blog')} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 px-6 shadow-md">
                  <FileText size={18} /> Add Blog
                </Button>
              </div>
           </div>
           
           <div className="relative mb-6">
             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
             <input 
               type="text" 
               className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-100" 
               placeholder={`Search in ${activeTab}...`}
               value={contentSearch}
               onChange={e => setContentSearch(e.target.value)}
             />
           </div>

           <div className="overflow-x-auto">
              {activeTab === 'jobs' && (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-widest border-b border-gray-100">
                    <tr><th className="p-4">Job Info</th><th className="p-4">Category</th><th className="p-4">Location</th><th className="p-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredJobs.map((j: any) => (
                      <tr key={j.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{j.title}</p>
                          <p className="text-xs text-gray-500">{j.company}</p>
                        </td>
                        <td className="p-4"><span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">{j.category}</span></td>
                        <td className="p-4 text-sm text-gray-600">{j.location}</td>
                        <td className="p-4 text-right">
                           <div className="flex justify-end gap-2">
                             <button onClick={() => openEditJob(j)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                             <button onClick={() => deleteJob(j.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'blogs' && (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-widest border-b border-gray-100">
                    <tr><th className="p-4">Article Title</th><th className="p-4">Category</th><th className="p-4">Author</th><th className="p-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredBlogs.map((b: any) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-gray-900">{b.title}</td>
                        <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">{b.category}</span></td>
                        <td className="p-4 text-sm text-gray-600">{b.author}</td>
                        <td className="p-4 text-right">
                           <div className="flex justify-end gap-2">
                             <button onClick={() => openEditBlog(b)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                             <button onClick={() => deleteBlog(b.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'requests' && (
                <div className="space-y-4 py-4">
                  {(requests.length + blogRequests.length + wholesaleRequests.length) === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      {/* Added missing CheckCircle import from lucide-react */}
                      <CheckCircle size={48} className="mx-auto mb-4 opacity-10" />
                      <p className="font-bold">Moderation queue is empty.</p>
                    </div>
                  ) : (
                    <>
                      {requests.map((r: any) => (
                        <div key={r.id} className="bg-white p-5 rounded-2xl border border-orange-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                               <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">JOB POST</span>
                               <h4 className="font-bold text-gray-900">{r.title}</h4>
                             </div>
                             <p className="text-xs text-gray-500">{r.company} • Posted by {r.postedby}</p>
                           </div>
                           <div className="flex gap-3">
                             <Button onClick={() => handleRequestAction(r, 'approve', 'job')} size="sm" className="bg-green-600">Approve</Button>
                             <Button onClick={() => handleRequestAction(r, 'reject', 'job')} size="sm" variant="danger">Reject</Button>
                           </div>
                        </div>
                      ))}
                      {blogRequests.map((r: any) => (
                        <div key={r.id} className="bg-white p-5 rounded-2xl border border-orange-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                               <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">BLOG POST</span>
                               <h4 className="font-bold text-gray-900">{r.title}</h4>
                             </div>
                             <p className="text-xs text-gray-500">By {r.author}</p>
                           </div>
                           <div className="flex gap-3">
                             <Button onClick={() => handleRequestAction(r, 'approve', 'blog')} size="sm" className="bg-green-600">Approve</Button>
                             <Button onClick={() => handleRequestAction(r, 'reject', 'blog')} size="sm" variant="danger">Reject</Button>
                           </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
           </div>
        </div>
    </div>
  );
};
