
import React, { useState, useRef, useMemo } from 'react';
import { 
  Briefcase, FileText, Plus, Search, Eye, Edit3, Trash2, 
  Check, X, ArrowLeft, Save, 
  MapPin, DollarSign, Calendar, Tag, User, Building2, Image as ImageIcon, Loader2, Upload, Truck, Phone, PlusCircle, Filter, RefreshCw,
  ChevronDown, Clock, CheckCircle, AlignLeft, Layers, BarChart, AlertTriangle, ExternalLink
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';
import { compressImage } from '../../utils/imageUtils';

export const AdminContent = () => {
  const { 
    jobs, blogs, requests, blogRequests, wholesaleRequests, 
    addJob, addBlog, deleteJob, deleteBlog, updateJob, updateBlog,
    handleRequestAction
  } = useData();
  
  const [view, setView] = useState<'list' | 'create_job' | 'create_blog' | 'details' | 'edit_job' | 'edit_blog'>('list');
  const [activeTab, setActiveTab] = useState<'jobs' | 'blogs' | 'requests'>('jobs');
  
  const [contentSearch, setContentSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const INITIAL_JOB = {
    title: '', 
    company: '', 
    description: '', 
    location: '', 
    salary: '', 
    type: 'Full Time', 
    deadline: '', 
    category: 'Private',
    level: 'Entry'
  };

  const INITIAL_BLOG = {
    title: '', 
    category: 'General', 
    content: '', 
    image: '', 
    author: 'Admin'
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
    setIsProcessing(true);
    try {
        if (view === 'edit_job') {
            await updateJob(jobForm);
        } else {
            await addJob({ ...jobForm, status: 'Active', posteddate: new Date().toLocaleDateString() });
        }
        setView('list');
        setJobForm(INITIAL_JOB);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
        const wordCount = (blogForm.content || '').split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200) + ' min read';
        const excerpt = (blogForm.content || '').substring(0, 150) + '...';

        const finalBlog = {
            ...blogForm,
            readtime: readTime,
            excerpt: excerpt,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            posteddate: new Date().toLocaleDateString(),
            status: 'Active'
        };

        if (view === 'edit_blog') {
            await updateBlog(finalBlog);
        } else {
            await addBlog(finalBlog);
        }
        setView('list');
        setBlogForm(INITIAL_BLOG);
    } finally {
        setIsProcessing(false);
    }
  };

  const openEditJob = (job: any) => {
    setJobForm({ ...job });
    setView('edit_job');
  };

  const openEditBlog = (blog: any) => {
    setBlogForm({ ...blog });
    setView('edit_blog');
  };

  const filteredJobs = (jobs || []).filter((j: any) => {
    const title = String(j.title || '').toLowerCase();
    const company = String(j.company || '').toLowerCase();
    const search = contentSearch.toLowerCase();
    return title.includes(search) || company.includes(search);
  });

  const filteredBlogs = (blogs || []).filter((b: any) => {
    const title = String(b.title || '').toLowerCase();
    return title.includes(contentSearch.toLowerCase());
  });

  const inputStyles = "w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-black focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold text-sm";
  const labelStyles = "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1";

  if (view === 'create_job' || view === 'edit_job') {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in pb-20">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-purple-100 rounded-2xl text-purple-600 shadow-sm"><Briefcase size={24} /></div>
               <div>
                  <h3 className="font-black text-xl text-gray-900">{view === 'edit_job' ? 'Edit Job Posting' : 'Post New Vacancy'}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Shonali Desh Career Portal</p>
               </div>
            </div>
            <button onClick={() => setView('list')} className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all">
              <X size={24}/>
            </button>
          </div>
          
          <form onSubmit={handleJobSubmit} className="p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelStyles}>Job Title / Designation</label>
                <input required className={inputStyles} value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="e.g. Senior Software Engineer" />
              </div>
              <div className="space-y-1">
                <label className={labelStyles}>Company / Institution Name</label>
                <input required className={inputStyles} value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} placeholder="e.g. Bangladesh Bank" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className={labelStyles}>Job Category</label>
                <select className={inputStyles} value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                  <option value="Government">Government</option>
                  <option value="Private">Private Company</option>
                  <option value="NGO">NGO / International</option>
                  <option value="Autonomous">Autonomous Body</option>
                  <option value="Public University">Public University</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelStyles}>Experience Level</label>
                <select className={inputStyles} value={jobForm.level} onChange={e => setJobForm({...jobForm, level: e.target.value})}>
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior / Executive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelStyles}>Job Type</label>
                <select className={inputStyles} value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-1">
                <label className={labelStyles}>Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input required className={`${inputStyles} pl-10`} value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Dhaka, BD" />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelStyles}>Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input className={`${inputStyles} pl-10`} value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} placeholder="e.g. 40k - 60k" />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelStyles}>Application Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input required type="date" className={`${inputStyles} pl-10`} value={jobForm.deadline} onChange={e => setJobForm({...jobForm, deadline: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelStyles}>Full Job Description & Requirements</label>
              <textarea 
                required 
                rows={10} 
                className={`${inputStyles} resize-none font-medium leading-relaxed`} 
                value={jobForm.description} 
                onChange={e => setJobForm({...jobForm, description: e.target.value})} 
                placeholder="List educational requirements, experience, and key responsibilities..."
              ></textarea>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isProcessing} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-brand-500/20 flex items-center justify-center gap-3">
                {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle size={24} />}
                {view === 'edit_job' ? 'Update Job Details' : 'Publish Job Listing'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'create_blog' || view === 'edit_blog') {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm"><FileText size={24} /></div>
                       <div>
                          <h3 className="font-black text-xl text-gray-900">{view === 'edit_blog' ? 'Edit Article' : 'Write New Blog'}</h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Shonali Desh Knowledge Hub</p>
                       </div>
                    </div>
                    <button onClick={() => setView('list')} className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all">
                      <X size={24}/></button>
                </div>
                <form onSubmit={handleBlogSubmit} className="p-8 md:p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className={labelStyles}>Article Title</label>
                        <input required className={inputStyles} value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="e.g. Modern Agriculture in Bangladesh" />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>Category</label>
                        <select className={inputStyles} value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Health">Health</option>
                          <option value="Education">Education</option>
                          <option value="Crafts">Crafts</option>
                          <option value="Transport">Transport</option>
                          <option value="Technology">Technology</option>
                          <option value="General">General News</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className={labelStyles}>Author Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                          <input required className={`${inputStyles} pl-10`} value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyles}>Cover Image</label>
                        <div className="flex gap-2">
                           <input className={`${inputStyles} flex-1`} value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} placeholder="Image URL or Upload..." />
                           <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center min-w-[56px]"
                           >
                             {isProcessing ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                           </button>
                           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className={labelStyles}>Full Article Content (Markdown Supported)</label>
                      <textarea 
                        required 
                        rows={15} 
                        className={`${inputStyles} resize-none font-medium leading-relaxed`} 
                        value={blogForm.content} 
                        onChange={e => setBlogForm({...blogForm, content: e.target.value})} 
                        placeholder="Write your article here..."
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3">
                        {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle size={24} />}
                        {view === 'edit_blog' ? 'Update Article' : 'Publish Blog Article'}
                      </Button>
                    </div>
                </form>
            </div>
        </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Content Management</h2>
              <p className="text-gray-500 font-medium mt-1">Review, edit, and moderate platform content.</p>
           </div>
           <div className="flex gap-3">
              <Button onClick={() => setView('create_job')} className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 py-3 font-bold shadow-lg shadow-purple-100 flex items-center gap-2">
                <PlusCircle size={20} /> Add Job
              </Button>
              <Button onClick={() => setView('create_blog')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-bold shadow-lg shadow-blue-100 flex items-center gap-2">
                <PlusCircle size={20} /> Add Blog
              </Button>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/30">
              <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 w-full md:w-fit overflow-x-auto no-scrollbar">
                  <button onClick={() => setActiveTab('jobs')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'jobs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>Approved Jobs</button>
                  <button onClick={() => setActiveTab('blogs')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'blogs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>Approved Blogs</button>
                  <button onClick={() => setActiveTab('requests')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Moderation Queue {( (requests?.length || 0) + (blogRequests?.length || 0) + (wholesaleRequests?.length || 0) ) > 0 && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{ (requests?.length || 0) + (blogRequests?.length || 0) + (wholesaleRequests?.length || 0) }</span>}</button>
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none text-black focus:ring-4 focus:ring-brand-500/10 font-bold text-sm shadow-sm" 
                  placeholder={`Search in ${activeTab}...`} 
                  value={contentSearch} 
                  onChange={e => setContentSearch(e.target.value)} 
                />
              </div>
           </div>
           
           <div className="p-8">
              {activeTab === 'jobs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job: any) => (
                    <div key={job.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group relative overflow-hidden border-t-4 border-t-purple-500">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <h4 className="font-black text-lg text-gray-900 leading-tight group-hover:text-purple-600 transition-colors pr-8">{job.title}</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{job.company}</p>
                          </div>
                          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Briefcase size={20}/></div>
                        </div>
                        
                        <div className="space-y-2 mb-6 text-xs font-bold text-gray-500">
                          <div className="flex items-center gap-2"><MapPin size={12}/> {job.location}</div>
                          <div className="flex items-center gap-2"><DollarSign size={12}/> {job.salary}</div>
                          <div className="flex items-center gap-2"><Clock size={12}/> {job.type}</div>
                        </div>

                        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                           <button onClick={() => openEditJob(job)} className="flex-1 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"><Edit3 size={14}/> Edit</button>
                           <button onClick={() => deleteJob(job.id)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"><Trash2 size={18}/></button>
                        </div>
                    </div>
                  ))}
                  {filteredJobs.length === 0 && <div className="col-span-full text-center py-20 text-gray-400 font-bold uppercase italic opacity-20">No jobs found</div>}
                </div>
              )}

              {activeTab === 'blogs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog: any) => (
                    <div key={blog.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden border-t-4 border-t-blue-500">
                        <div className="h-40 bg-gray-100 relative">
                           <img src={blog.image || 'https://placehold.co/400x200?text=No+Cover'} className="w-full h-full object-cover" />
                           <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full shadow-lg">{blog.category}</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                           <h4 className="font-black text-lg text-gray-900 mb-2 line-clamp-2">{blog.title}</h4>
                           <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1"><User size={10}/> {blog.author}</p>
                           
                           <div className="flex gap-2 mt-6 pt-4 border-t border-gray-50">
                              <button onClick={() => openEditBlog(blog)} className="flex-1 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"><Edit3 size={14}/> Edit</button>
                              <button onClick={() => deleteBlog(blog.id)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"><Trash2 size={18}/></button>
                           </div>
                        </div>
                    </div>
                  ))}
                  {filteredBlogs.length === 0 && <div className="col-span-full text-center py-20 text-gray-400 font-bold uppercase italic opacity-20">No blogs found</div>}
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="space-y-10 animate-fade-in">
                  {/* JOB REQUESTS */}
                  {(requests || []).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-black text-purple-700 flex items-center gap-2 uppercase tracking-widest text-xs px-2"><Briefcase size={16}/> Job Submissions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requests.map((req: any) => (
                          <div key={req.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 group">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h5 className="font-black text-gray-900 leading-tight">{req.title}</h5>
                                   <p className="text-xs text-gray-400 font-bold uppercase mt-1">{req.company}</p>
                                </div>
                                <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">Pending Approval</span>
                             </div>
                             <div className="text-xs text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                {req.description}
                             </div>
                             <div className="flex items-center justify-between pt-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Submitted By: <span className="text-gray-900">{req.postedby}</span></p>
                                <div className="flex gap-2">
                                   <button onClick={() => handleRequestAction(req, 'approve', 'job')} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl transition-all shadow-md"><Check size={18}/></button>
                                   <button onClick={() => handleRequestAction(req, 'reject', 'job')} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-xl transition-all"><X size={18}/></button>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BLOG REQUESTS */}
                  {(blogRequests || []).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-black text-blue-700 flex items-center gap-2 uppercase tracking-widest text-xs px-2"><FileText size={16}/> Blog Article Submissions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {blogRequests.map((req: any) => (
                          <div key={req.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                             <div className="flex gap-4">
                                <img src={req.image || 'https://placehold.co/100x100'} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                <div className="flex-1">
                                   <h5 className="font-black text-gray-900 leading-tight">{req.title}</h5>
                                   <p className="text-[10px] text-blue-600 font-black uppercase mt-1">{req.category}</p>
                                </div>
                             </div>
                             <div className="flex items-center justify-between pt-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Author: <span className="text-gray-900">{req.author}</span></p>
                                <div className="flex gap-2">
                                   <button onClick={() => handleRequestAction(req, 'approve', 'blog')} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all shadow-md"><Check size={18}/></button>
                                   <button onClick={() => handleRequestAction(req, 'reject', 'blog')} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-xl transition-all"><X size={18}/></button>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WHOLESALE REQUESTS */}
                  {(wholesaleRequests || []).length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-black text-orange-700 flex items-center gap-2 uppercase tracking-widest text-xs px-2"><Truck size={16}/> Wholesale Ad Submissions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wholesaleRequests.map((req: any) => (
                          <div key={req.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h5 className="font-black text-gray-900">{req.product}</h5>
                                   <p className="text-xs font-bold text-orange-600">৳ {req.price} | {req.quantity}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 justify-end"><MapPin size={10}/> {req.location}</p>
                                </div>
                             </div>
                             <div className="flex items-center justify-between pt-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1"><User size={10}/> {req.seller}</p>
                                <div className="flex gap-2">
                                   <button onClick={() => handleRequestAction(req, 'approve', 'wholesale')} className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-xl transition-all shadow-md"><Check size={18}/></button>
                                   <button onClick={() => handleRequestAction(req, 'reject', 'wholesale')} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-xl transition-all"><X size={18}/></button>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!requests?.length && !blogRequests?.length && !wholesaleRequests?.length) && (
                    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                       <Clock size={48} className="mx-auto mb-4 text-gray-200" />
                       <h4 className="text-gray-400 font-black text-lg">Nothing to review</h4>
                       <p className="text-gray-400 font-medium text-sm italic">User submissions will appear here for moderation.</p>
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>
    </div>
  );
};
