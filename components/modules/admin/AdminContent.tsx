
import React, { useState, useRef, useMemo } from 'react';
import { 
  Briefcase, FileText, Plus, Search, Eye, Edit3, Trash2, 
  Check, X, ArrowLeft, Save, 
  MapPin, DollarSign, Calendar, Tag, User, Building2, Image as ImageIcon, Loader2, Upload, Truck, Phone, PlusCircle, Filter, RefreshCw,
  ChevronDown, Clock
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

export const AdminContent = () => {
  const { jobs, blogs, requests, blogRequests, wholesaleRequests, addJob, addBlog, deleteJob, deleteBlog, handleRequestAction, updateJob, updateBlog } = useData();
  
  const [view, setView] = useState<'list' | 'create_job' | 'create_blog' | 'details' | 'edit_job' | 'edit_blog'>('list');
  const [activeTab, setActiveTab] = useState<'jobs' | 'blogs' | 'requests'>('jobs');
  
  // Filter & Search States
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

  // --- FILTERING LOGIC (SAFE) ---
  const filteredJobs = useMemo(() => {
    const searchLower = contentSearch.toLowerCase();
    return jobs.filter((job: any) => {
      const matchesSearch = (job.title?.toLowerCase() || '').includes(searchLower) || 
                            (job.company?.toLowerCase() || '').includes(searchLower);
      const matchesCategory = categoryFilter === 'All' || job.category === categoryFilter;
      const matchesType = jobTypeFilter === 'All' || job.type === jobTypeFilter;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [jobs, contentSearch, categoryFilter, jobTypeFilter]);

  const filteredBlogs = useMemo(() => {
    const searchLower = contentSearch.toLowerCase();
    return blogs.filter((blog: any) => {
      const matchesSearch = (blog.title?.toLowerCase() || '').includes(searchLower) || 
                            (blog.author?.toLowerCase() || '').includes(searchLower);
      const matchesCategory = categoryFilter === 'All' || blog.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, contentSearch, categoryFilter]);

  const resetFilters = () => {
    setContentSearch('');
    setCategoryFilter('All');
    setJobTypeFilter('All');
  };

  const handleOpenCreateJob = () => {
    setJobForm(INITIAL_JOB);
    setView('create_job');
  };

  const handleOpenCreateBlog = () => {
    setBlogForm(INITIAL_BLOG);
    setView('create_blog');
  };

  const handleDelete = async (id: number, type: 'job' | 'blog') => {
    if(!confirm('Are you sure you want to delete this content?')) return;
    if (type === 'job') await deleteJob(id);
    else await deleteBlog(id);
    if (view === 'details') setView('list');
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    if (item.author) { 
        setBlogForm({ ...item }); 
        setView('edit_blog'); 
    } else { 
        setJobForm({ ...item }); 
        setView('edit_job'); 
    }
  };

  const handleActionClick = async (item: any, action: 'approve' | 'reject', type: 'job' | 'blog' | 'wholesale') => {
      setIsProcessing(true);
      await handleRequestAction(item, action, type);
      setIsProcessing(false);
      setView('list');
  };

  const handleViewDetails = (item: any, type: 'job' | 'blog' | 'wholesale') => {
      setSelectedItem({ ...item, contentType: type });
      setView('details');
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'edit_job') {
        await updateJob(jobForm);
        alert('Job updated successfully!');
    } else {
        await addJob(jobForm);
        alert('Job added successfully!');
    }
    setView('list');
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'edit_blog') {
        await updateBlog(blogForm);
        alert('Blog updated successfully!');
    } else {
        await addBlog(blogForm);
        alert('Blog added successfully!');
    }
    setView('list');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogForm({ ...blogForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStatusBadge = (status: string) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
      status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
      status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-600 border-gray-200'
    }`}>{status}</span>
  );

  if (view === 'create_job' || view === 'edit_job') {
    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Briefcase size={20} className="text-purple-600" />{view === 'edit_job' ? 'Edit Job Post' : 'Add New Job Post'}</h3>
                    <button onClick={() => setView('list')} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                </div>
                <form onSubmit={handleJobSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Job Title</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} /></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Company</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Job Type</label><select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}><option value="Full Time">Full Time</option><option value="Part Time">Part Time</option><option value="Contract">Contract</option><option value="Remote">Remote</option></select></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Location</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} /></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Salary</label><input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="e.g. 25k-30k" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Deadline</label><input type="date" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100" value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} /></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Category</label><select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})}><option value="Government">Government</option><option value="Private">Private</option><option value="NGO">NGO</option><option value="International">International</option><option value="Autonomous">Autonomous</option></select></div>
                    </div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea rows={5} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-100 resize-none" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})}></textarea></div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 font-bold">{view === 'edit_job' ? 'Update Job' : 'Post Job Now'}</Button>
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
                        <div><label className="block text-sm font-bold text-gray-700 mb-1">Cover Image</label><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1 border-dashed">{blogForm.image ? 'Change Image' : 'Upload Image'}</Button><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />{blogForm.image && <div className="w-10 h-10 rounded-lg border overflow-hidden"><img src={blogForm.image} className="w-full h-full object-cover" /></div>}</div></div>
                    </div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Content</label><textarea rows={10} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 resize-none" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})}></textarea></div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 font-bold">{view === 'edit_blog' ? 'Update Article' : 'Publish Article'}</Button>
                </form>
            </div>
        </div>
    );
  }

  if (view === 'details' && selectedItem) {
      const isPending = selectedItem.status === 'Pending';
      const type = selectedItem.product ? 'wholesale' : (selectedItem.author ? 'blog' : 'job');

      return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <Button variant="outline" onClick={() => setView('list')} className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 border-gray-200"><ArrowLeft size={16} /> Back</Button>
                    <div className="flex gap-2">
                        {isPending ? (
                            <><Button disabled={isProcessing} onClick={() => handleActionClick(selectedItem, 'approve', type)} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">{isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Approve</Button><Button disabled={isProcessing} onClick={() => handleActionClick(selectedItem, 'reject', type)} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">{isProcessing ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />} Reject</Button></>
                        ) : (<button onClick={() => handleEdit(selectedItem)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"><Edit3 size={18} /></button>)}
                    </div>
                </div>
                <div className="p-8">
                    <div className="mb-6">{renderStatusBadge(selectedItem.status)}</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedItem.title || selectedItem.product}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2"><User size={16} /><span>{selectedItem.postedby || selectedItem.author || selectedItem.seller}</span></div>
                        {selectedItem.phone && <div className="flex items-center gap-2"><Phone size={16} /><span>{selectedItem.phone}</span></div>}
                        <div className="flex items-center gap-2"><Calendar size={16} /><span>{selectedItem.posteddate}</span></div>
                        {selectedItem.location && <div className="flex items-center gap-2"><MapPin size={16} /><span>{selectedItem.location}</span></div>}
                        {selectedItem.type && <div className="flex items-center gap-2"><Clock size={16} /><span>{selectedItem.type}</span></div>}
                    </div>
                    {selectedItem.content || selectedItem.description ? (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedItem.content || selectedItem.description}</div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-100 shadow-inner"><div className="space-y-1"><p className="text-xs font-bold text-gray-400 uppercase">Quantity</p><p className="text-xl font-bold text-gray-900">{selectedItem.quantity}</p></div><div className="space-y-1"><p className="text-xs font-bold text-gray-400 uppercase">Asking Price</p><p className="text-xl font-bold text-orange-600">{selectedItem.price}</p></div><div className="space-y-1"><p className="text-xs font-bold text-gray-400 uppercase">Seller Type</p><p className="text-lg font-medium text-gray-800">{selectedItem.sellertype || selectedItem.sellerType}</p></div><div className="space-y-1"><p className="text-xs font-bold text-gray-400 uppercase">Contact Number</p><p className="text-lg font-bold text-blue-600 underline">{selectedItem.phone || 'N/A'}</p></div></div>
                    )}
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-50 pb-6">
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-full md:w-fit overflow-x-auto">
                  <button onClick={() => { setActiveTab('jobs'); resetFilters(); }} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'jobs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Approved Jobs</button>
                  <button onClick={() => { setActiveTab('blogs'); resetFilters(); }} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'blogs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Approved Blogs</button>
                  <button onClick={() => setActiveTab('requests')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Moderation Queue {(requests.length + blogRequests.length + wholesaleRequests.length) > 0 && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{requests.length + blogRequests.length + wholesaleRequests.length}</span>}</button>
              </div>
              <div className="flex gap-3 w-full md:w-auto"><Button onClick={handleOpenCreateJob} className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 px-6 shadow-md"><Briefcase size={18} /> Add Job</Button><Button onClick={handleOpenCreateBlog} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 px-6 shadow-md"><FileText size={18} /> Add Blog</Button></div>
           </div>
           {activeTab !== 'requests' && (
             <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-gray-400" size={18} /><input type="text" placeholder={activeTab === 'jobs' ? "Search jobs or companies..." : "Search blog titles or authors..."} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" value={contentSearch} onChange={e => setContentSearch(e.target.value)} /></div>
                <div className="flex gap-3 flex-wrap"><div className="relative"><select className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="All">All Categories</option><option>Agriculture</option><option>Health</option><option>Education</option><option>Technology</option><option>General</option></select><Tag className="absolute left-3 top-2.5 text-gray-400" size={16} /><ChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={16} /></div>{activeTab === 'jobs' && (<div className="relative"><select className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer" value={jobTypeFilter} onChange={e => setJobTypeFilter(e.target.value)}><option value="All">All Types</option><option>Full Time</option><option>Part Time</option><option>Contract</option><option>Remote</option></select><Clock className="absolute left-3 top-2.5 text-gray-400" size={16} /><ChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={16} /></div>)}{(contentSearch || categoryFilter !== 'All' || jobTypeFilter !== 'All') && (<button onClick={resetFilters} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"><RefreshCw size={14} /> Reset</button>)}</div>
             </div>
           )}
           {activeTab === 'requests' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"><h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Briefcase size={20} className="text-purple-600"/> Jobs ({requests.length})</h4><div className="space-y-4">{requests.map((req:any) => (<div key={req.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all"><h5 className="font-bold text-gray-900 text-sm mb-1">{req.title}</h5><p className="text-[10px] text-gray-500 mb-4">{req.company} • {req.location}</p><div className="flex justify-end gap-2"><button onClick={() => handleViewDetails(req, 'job')} className="p-2 text-gray-400 hover:text-blue-600"><Eye size={16}/></button><button onClick={() => handleActionClick(req, 'approve', 'job')} className="p-2 text-green-500"><Check size={16}/></button><button onClick={() => handleActionClick(req, 'reject', 'job')} className="p-2 text-red-500"><X size={16}/></button></div></div>))}</div></div>
                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"><h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><FileText size={20} className="text-blue-600"/> Blogs ({blogRequests.length})</h4><div className="space-y-4">{blogRequests.map((req:any) => (<div key={req.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all"><h5 className="font-bold text-gray-900 text-sm mb-1">{req.title}</h5><p className="text-[10px] text-gray-500 mb-4">By: {req.author}</p><div className="flex justify-end gap-2"><button onClick={() => handleViewDetails(req, 'blog')} className="p-2 text-gray-400 hover:text-blue-600"><Eye size={16}/></button><button onClick={() => handleActionClick(req, 'approve', 'blog')} className="p-2 text-green-500"><Check size={16}/></button><button onClick={() => handleActionClick(req, 'reject', 'blog')} className="p-2 text-red-500"><X size={16}/></button></div></div>))}</div></div>
                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"><h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Truck size={20} className="text-orange-600"/> Wholesale ({wholesaleRequests.length})</h4><div className="space-y-4">{wholesaleRequests.map((req:any) => (<div key={req.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all"><h5 className="font-bold text-gray-900 text-sm mb-1">{req.product}</h5><p className="text-[10px] text-gray-500 mb-4">{req.quantity} • {req.price}</p><div className="flex justify-end gap-2"><button onClick={() => handleViewDetails(req, 'wholesale')} className="p-2 text-gray-400 hover:text-blue-600"><Eye size={16}/></button><button onClick={() => handleActionClick(req, 'approve', 'wholesale')} className="p-2 text-green-500"><Check size={16}/></button><button onClick={() => handleActionClick(req, 'reject', 'wholesale')} className="p-2 text-red-500"><X size={16}/></button></div></div>))}</div></div>
              </div>
           ) : (
              <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead className="bg-gray-50/50 border-b border-gray-100"><tr><th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{activeTab === 'jobs' ? 'JOB TITLE' : 'BLOG TITLE'}</th><th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{activeTab === 'jobs' ? 'COMPANY' : 'AUTHOR'}</th><th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">CATEGORY</th>{activeTab === 'jobs' && <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">TYPE</th>}<th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">ACTIONS</th></tr></thead><tbody className="divide-y divide-gray-50">{(activeTab === 'jobs' ? filteredJobs : filteredBlogs).map((item: any) => (<tr key={item.id} className="hover:bg-gray-50/50 transition-colors"><td className="p-4 font-bold text-gray-900 text-sm">{item.title}</td><td className="p-4 text-sm text-gray-600">{item.company || item.author}</td><td className="p-4"><span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-[10px] font-bold border border-gray-200">{item.category}</span></td>{activeTab === 'jobs' && (<td className="p-4"><span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-[10px] font-bold border border-blue-100">{item.type}</span></td>)}<td className="p-4 text-right"><div className="flex justify-end gap-3 text-gray-400"><button onClick={() => handleViewDetails(item, activeTab === 'jobs' ? 'job' : 'blog')} className="hover:text-gray-600"><Eye size={18}/></button><button onClick={() => handleEdit(item)} className="hover:text-gray-600"><Edit3 size={18}/></button><button onClick={() => handleDelete(item.id, activeTab === 'jobs' ? 'job' : 'blog')} className="hover:text-red-500"><Trash2 size={18}/></button></div></td></tr>))}{(activeTab === 'jobs' ? filteredJobs : filteredBlogs).length === 0 && (<tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium"><div className="flex flex-col items-center gap-3"><Search size={32} className="opacity-20" /><p>No matches found. Try changing your search or filters.</p></div></td></tr>)}</tbody></table></div>
           )}
        </div>
    </div>
  );
};
