
import React, { useState } from 'react';
import { 
  Briefcase, FileText, Plus, Search, Eye, Edit3, Trash2, 
  Check, X, MessageSquare, Clock, ArrowLeft, Save, 
  MapPin, DollarSign, Calendar, Tag, User, Building2 
} from 'lucide-react';
import { Button } from '../../ui/Button';

// Mock Data
const INITIAL_JOBS = [
  { id: 101, title: 'Assistant Teacher', company: 'Little Flower School', type: 'Full Time', location: 'Dhaka', salary: '15k-20k', postedBy: 'Admin', postedDate: '2023-10-25', views: 1250, status: 'Active', description: 'Teaching mathematics to primary students.' },
  { id: 103, title: 'Software Engineer', company: 'Tech BD', type: 'Remote', location: 'Dhaka', salary: '50k+', postedBy: 'Admin', postedDate: '2023-10-20', views: 3400, status: 'Active', description: 'Developing web applications using React and Node.js.' },
];

const INITIAL_BLOGS = [
  { id: 201, title: 'Digital Health Services', category: 'Health', author: 'Dr. Nusrat', postedDate: '2023-10-15', views: 5600, status: 'Active', content: 'How telemedicine is changing lives...' },
  { id: 203, title: 'Safe Driving Rules', category: 'Transport', author: 'Admin', postedDate: '2023-10-10', views: 2100, status: 'Active', content: 'Traffic rules you must follow...' },
];

const INITIAL_REQUESTS = [
  { id: 301, contentType: 'job', title: 'Farm Manager', company: 'Green Agro', location: 'Rangpur', salary: '25k', postedBy: 'Rahim Uddin', postedDate: '2023-10-26', views: 0, status: 'Pending', description: 'Managing daily farm operations and labor.' },
  { id: 302, contentType: 'job', title: 'Driver Needed', company: 'Desh Transport', location: 'Chittagong', salary: '12k', postedBy: 'User', postedDate: '2023-10-27', views: 0, status: 'Pending', description: 'Experienced heavy vehicle driver needed.' },
  { id: 303, contentType: 'blog', title: 'Winter Farming Tips', category: 'Agriculture', author: 'Abdul Malek', postedDate: '2023-10-24', views: 0, status: 'Pending', content: 'Best crops to grow in winter...' },
];

export const AdminContent = () => {
  const [view, setView] = useState<'list' | 'create_job' | 'create_blog' | 'details'>('list');
  const [activeTab, setActiveTab] = useState<'jobs' | 'blogs' | 'requests'>('jobs');
  const [contentSearch, setContentSearch] = useState('');
  
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // --- ACTIONS ---
  const handleDelete = (id: number, type: 'job' | 'blog') => {
    if(!confirm('Are you sure you want to delete this content?')) return;
    if (type === 'job') setJobs(jobs.filter(j => j.id !== id));
    else setBlogs(blogs.filter(b => b.id !== id));
    if (view === 'details') setView('list');
  };

  const handleEdit = (item: any) => {
    alert(`Editing functionality for "${item.title}" will be implemented here. \n(Pre-filling edit form...)`);
  };

  const handleRequestAction = (item: any, action: 'approve' | 'reject') => {
    setRequests(requests.filter(r => r.id !== item.id));
    if (action === 'approve') {
        const newItem = { ...item, status: 'Active' };
        if (item.contentType === 'job') {
            setJobs([newItem, ...jobs]);
        } else {
            setBlogs([newItem, ...blogs]);
        }
        alert(`${item.contentType === 'job' ? 'Job' : 'Blog'} approved!`);
    } else {
        alert('Request rejected.');
    }
    setView('list');
  };

  const renderStatusBadge = (status: string) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
      status === 'Active' 
        ? 'bg-green-50 text-green-700 border-green-200' 
        : status === 'Pending' 
          ? 'bg-orange-50 text-orange-700 border-orange-200'
          : 'bg-gray-100 text-gray-600 border-gray-200'
    }`}>
      {status}
    </span>
  );

  const handleViewDetails = (item: any, type: 'job' | 'blog') => {
      setSelectedItem({ ...item, contentType: type });
      setView('details');
  };

  // --- RENDER FORMS ---
  if (view === 'create_job') {
    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="text-gray-800" size={24} /> Create Job
            </h3>
            <Button variant="outline" onClick={() => setView('list')} className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 border-gray-200">
              <ArrowLeft size={16} /> Back to List
            </Button>
          </div>
          
          <div className="p-8">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Job Created!'); setView('list'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Job Title</label>
                  <input type="text" placeholder="e.g. Software Engineer" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Company</label>
                  <input type="text" placeholder="Company Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Job Type</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium appearance-none">
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                  <input type="text" placeholder="Dhaka" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Salary Range</label>
                  <input type="text" placeholder="20k-30k" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</label>
                  <input type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium text-gray-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                <textarea rows={5} placeholder="Job details..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <Button type="button" variant="outline" onClick={() => setView('list')} className="px-6 bg-white hover:bg-gray-50 border-gray-200 text-gray-700">Cancel</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 font-bold">
                  Publish
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'create_blog') {
    return (
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-gray-800" size={24} /> Create Blog
            </h3>
            <Button variant="outline" onClick={() => setView('list')} className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 border-gray-200">
              <ArrowLeft size={16} /> Back to List
            </Button>
          </div>
          
          <div className="p-8">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Blog Published!'); setView('list'); }}>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Blog Title</label>
                <input type="text" placeholder="Article Headline" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium appearance-none">
                    <option>Select Category</option>
                    <option>Agriculture</option>
                    <option>Health</option>
                    <option>Education</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Author</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Content</label>
                <textarea rows={8} placeholder="Write blog content here..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm font-medium resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <Button type="button" variant="outline" onClick={() => setView('list')} className="px-6 bg-white hover:bg-gray-50 border-gray-200 text-gray-700">Cancel</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 font-bold">
                  Publish
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER DETAILS VIEW ---
  if (view === 'details' && selectedItem) {
      const isPending = selectedItem.status === 'Pending';
      return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <Button variant="outline" onClick={() => setView('list')} className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 border-gray-200">
                        <ArrowLeft size={16} /> Back
                    </Button>
                    <div className="flex gap-2">
                        {isPending ? (
                            <>
                                <Button onClick={() => handleRequestAction(selectedItem, 'approve')} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                                    <Check size={16} /> Approve
                                </Button>
                                <Button onClick={() => handleRequestAction(selectedItem, 'reject')} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                                    <X size={16} /> Reject
                                </Button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit(selectedItem)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all border border-gray-200">
                                <Edit3 size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        {renderStatusBadge(selectedItem.status)}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedItem.title}</h1>
                    
                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{selectedItem.postedBy || selectedItem.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{selectedItem.postedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye size={16} />
                            <span>{selectedItem.views || 0} views</span>
                        </div>
                        {selectedItem.contentType === 'job' && (
                            <>
                                <div className="flex items-center gap-2">
                                    <Building2 size={16} />
                                    <span>{selectedItem.company}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>{selectedItem.location}</span>
                                </div>
                                {selectedItem.salary && (
                                    <div className="flex items-center gap-2 font-medium text-green-600">
                                        <DollarSign size={16} />
                                        <span>{selectedItem.salary}</span>
                                    </div>
                                )}
                            </>
                        )}
                        {selectedItem.contentType === 'blog' && selectedItem.category && (
                            <div className="flex items-center gap-2">
                                <Tag size={16} />
                                <span>{selectedItem.category}</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">
                            {selectedItem.contentType === 'job' ? 'Job Description' : 'Content'}
                        </h4>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {selectedItem.description || selectedItem.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- RENDER MAIN LIST VIEW ---
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
              {/* Tabs */}
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-full md:w-fit">
                  <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'jobs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    Jobs
                  </button>
                  <button 
                    onClick={() => setActiveTab('blogs')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'blogs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    Blogs
                  </button>
                  <button 
                    onClick={() => setActiveTab('requests')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'requests' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    Requests 
                    {requests.length > 0 && (
                      <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{requests.length}</span>
                    )}
                  </button>
              </div>

              {/* Controls */}
              {activeTab !== 'requests' && (
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                   <div className="relative flex-1 sm:w-64">
                     <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                     <input 
                       type="text" 
                       placeholder="Search..." 
                       value={contentSearch} 
                       onChange={(e) => setContentSearch(e.target.value)} 
                       className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 h-10" 
                     />
                   </div>
                   <Button 
                     onClick={() => setView(activeTab === 'jobs' ? 'create_job' : 'create_blog')}
                     className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 h-10 rounded-lg shadow-sm flex items-center gap-2"
                   >
                      <Plus size={16} /> {activeTab === 'jobs' ? 'Post Job' : 'Write Blog'}
                   </Button>
                </div>
              )}
           </div>

           {/* Content Area */}
           {activeTab === 'requests' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Pending Jobs */}
                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
                    <h4 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                       <Briefcase size={20} className="text-purple-600"/> Pending Jobs ({requests.filter(r => r.contentType === 'job').length})
                    </h4>
                    <div className="space-y-4">
                       {requests.filter(r => r.contentType === 'job').map(req => (
                          <div key={req.id} className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                   <h5 className="font-bold text-gray-900 text-base">{req.title}</h5>
                                   <p className="text-xs text-gray-500 mt-1">{req.company} • {req.location}</p>
                                </div>
                                <span className="text-xs text-gray-400">{req.postedDate}</span>
                             </div>
                             <div className="flex justify-between items-center mt-4">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Posted by: {req.postedBy}</span>
                                <div className="flex gap-3">
                                   <button onClick={() => handleViewDetails(req, 'job')} className="text-gray-400 hover:text-blue-600 transition-colors"><Eye size={18}/></button>
                                   <button onClick={() => handleRequestAction(req, 'approve')} className="text-green-500 hover:text-green-600 transition-colors"><Check size={18}/></button>
                                   <button onClick={() => handleRequestAction(req, 'reject')} className="text-red-500 hover:text-red-600 transition-colors"><X size={18}/></button>
                                </div>
                             </div>
                          </div>
                       ))}
                       {requests.filter(r => r.contentType === 'job').length === 0 && <p className="text-center text-gray-400 py-4">No pending jobs.</p>}
                    </div>
                 </div>

                 {/* Pending Blogs */}
                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
                    <h4 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                       <FileText size={20} className="text-blue-600"/> Pending Blogs ({requests.filter(r => r.contentType === 'blog').length})
                    </h4>
                    <div className="space-y-4">
                       {requests.filter(r => r.contentType === 'blog').map(req => (
                          <div key={req.id} className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                   <h5 className="font-bold text-gray-900 text-base">{req.title}</h5>
                                   <p className="text-xs text-gray-500 mt-1">Category: {req.category}</p>
                                </div>
                                <span className="text-xs text-gray-400">{req.postedDate}</span>
                             </div>
                             <div className="flex justify-between items-center mt-4">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Author: {req.author || 'Unknown'}</span>
                                <div className="flex gap-3">
                                   <button onClick={() => handleViewDetails(req, 'blog')} className="text-gray-400 hover:text-blue-600 transition-colors"><Eye size={18}/></button>
                                   <button onClick={() => handleRequestAction(req, 'approve')} className="text-green-500 hover:text-green-600 transition-colors"><Check size={18}/></button>
                                   <button onClick={() => handleRequestAction(req, 'reject')} className="text-red-500 hover:text-red-600 transition-colors"><X size={18}/></button>
                                </div>
                             </div>
                          </div>
                       ))}
                       {requests.filter(r => r.contentType === 'blog').length === 0 && <p className="text-center text-gray-400 py-4">No pending blogs.</p>}
                    </div>
                 </div>
              </div>
           ) : (
              /* Active Content Table */
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                       <tr>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{activeTab === 'jobs' ? 'JOB TITLE' : 'BLOG TITLE'}</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{activeTab === 'jobs' ? 'COMPANY/DETAILS' : 'CATEGORY/AUTHOR'}</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">POSTED DATE</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">VIEWS</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">STATUS</th>
                          <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">ACTIONS</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {(activeTab === 'jobs' ? jobs : blogs).map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                             <td className="p-4 font-bold text-gray-900 text-sm">{item.title}</td>
                             <td className="p-4 text-sm text-gray-600">
                                {activeTab === 'jobs' 
                                  ? <><span className="block text-gray-900 font-medium">{item.company}</span><span className="text-xs text-gray-500">{item.type}</span></>
                                  : <><span className="block text-gray-900 font-medium">{item.category}</span><span className="text-xs text-gray-500">by {item.author}</span></>
                                }
                             </td>
                             <td className="p-4 text-sm text-gray-500">{item.postedDate}</td>
                             <td className="p-4 text-sm font-bold text-gray-700 bg-gray-50 rounded-lg w-fit h-fit px-2 py-1">{item.views}</td>
                             <td className="p-4">{renderStatusBadge(item.status)}</td>
                             <td className="p-4 text-right">
                                <div className="flex justify-end gap-3 text-gray-400">
                                   <button onClick={() => handleViewDetails(item, activeTab === 'jobs' ? 'job' : 'blog')} className="hover:text-gray-600 transition-colors"><Eye size={18}/></button>
                                   <button onClick={() => handleEdit(item)} className="hover:text-gray-600 transition-colors"><Edit3 size={18}/></button>
                                   <button onClick={() => handleDelete(item.id, activeTab === 'jobs' ? 'job' : 'blog')} className="hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                       {(activeTab === 'jobs' ? jobs : blogs).length === 0 && (
                          <tr><td colSpan={6} className="p-10 text-center font-bold text-gray-400">No content found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
    </div>
  );
};
