
import React, { useState, useRef } from 'react';
import { 
  Briefcase, FileText, Plus, Search, Eye, Edit3, Trash2, 
  Check, X, ArrowLeft, Save, 
  MapPin, DollarSign, Calendar, Tag, User, Building2, Image as ImageIcon, Loader2, Upload, Truck
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

export const AdminContent = () => {
  const { jobs, blogs, requests, blogRequests, wholesaleRequests, addJob, addBlog, deleteJob, deleteBlog, handleRequestAction, updateJob, updateBlog } = useData();
  
  const [view, setView] = useState<'list' | 'create_job' | 'create_blog' | 'details' | 'edit_job' | 'edit_blog'>('list');
  const [activeTab, setActiveTab] = useState<'jobs' | 'blogs' | 'requests'>('jobs');
  const [contentSearch, setContentSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobForm, setJobForm] = useState<any>({});
  const [blogForm, setBlogForm] = useState<any>({});

  const handleDelete = async (id: number, type: 'job' | 'blog') => {
    if(!confirm('Are you sure you want to delete this content?')) return;
    if (type === 'job') await deleteJob(id);
    else await deleteBlog(id);
    if (view === 'details') setView('list');
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    if (item.category && item.author) { setBlogForm({ ...item }); setView('edit_blog'); } 
    else { setJobForm({ ...item }); setView('edit_job'); }
  };

  const handleActionClick = async (item: any, action: 'approve' | 'reject', type: 'job' | 'blog' | 'wholesale') => {
      setIsProcessing(true);
      await handleRequestAction(item, action, type);
      setIsProcessing(false);
  };

  const renderStatusBadge = (status: string) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
      status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
      status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-600 border-gray-200'
    }`}>{status}</span>
  );

  const handleViewDetails = (item: any, type: 'job' | 'blog' | 'wholesale') => {
      setSelectedItem({ ...item, contentType: type });
      setView('details');
  };

  if (view === 'details' && selectedItem) {
      const isPending = selectedItem.status === 'Pending';
      const type = selectedItem.product ? 'wholesale' : (selectedItem.author ? 'blog' : 'job');

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
                                <Button disabled={isProcessing} onClick={() => handleActionClick(selectedItem, 'approve', type)} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Approve
                                </Button>
                                <Button disabled={isProcessing} onClick={() => handleActionClick(selectedItem, 'reject', type)} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />} Reject
                                </Button>
                            </>
                        ) : (
                            <button onClick={() => handleEdit(selectedItem)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all border border-gray-200"><Edit3 size={18} /></button>
                        )}
                    </div>
                </div>
                <div className="p-8">
                    <div className="mb-6">{renderStatusBadge(selectedItem.status)}</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedItem.title || selectedItem.product}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2"><User size={16} /><span>{selectedItem.postedBy || selectedItem.author || selectedItem.seller}</span></div>
                        <div className="flex items-center gap-2"><Calendar size={16} /><span>{selectedItem.postedDate}</span></div>
                        {selectedItem.location && <div className="flex items-center gap-2"><MapPin size={16} /><span>{selectedItem.location}</span></div>}
                    </div>
                    {selectedItem.content || selectedItem.description ? (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedItem.content || selectedItem.description}</div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-xl grid grid-cols-2 gap-4">
                        <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
                        <p><strong>Price:</strong> {selectedItem.price}</p>
                        <p><strong>Type:</strong> {selectedItem.sellerType}</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
              <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-full md:w-fit overflow-x-auto">
                  <button onClick={() => setActiveTab('jobs')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'jobs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Approved Jobs</button>
                  <button onClick={() => setActiveTab('blogs')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'blogs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Approved Blogs</button>
                  <button onClick={() => setActiveTab('requests')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
                    Moderation Queue {(requests.length + blogRequests.length + wholesaleRequests.length) > 0 && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{requests.length + blogRequests.length + wholesaleRequests.length}</span>}
                  </button>
              </div>
           </div>

           {activeTab === 'requests' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Briefcase size={20} className="text-purple-600"/> Jobs ({requests.length})</h4>
                    <div className="space-y-4">
                       {requests.map((req:any) => (
                          <div key={req.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all">
                             <h5 className="font-bold text-gray-900 text-sm mb-1">{req.title}</h5>
                             <p className="text-[10px] text-gray-500 mb-4">{req.company} • {req.location}</p>
                             <div className="flex justify-end gap-2"><button onClick={() => handleViewDetails(req, 'job')} className="p-2 text-gray-400 hover:text-blue-600"><Eye size={16}/></button><button onClick={() => handleActionClick(req, 'approve', 'job')} className="p-2 text-green-500"><Check size={16}/></button><button onClick={() => handleActionClick(req, 'reject', 'job')} className="p-2 text-red-500"><X size={16}/></button></div>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><FileText size={20} className="text-blue-600"/> Blogs ({blogRequests.length})</h4>
                    <div className="space-y-4">
                       {blogRequests.map((req:any) => (
                          <div key={req.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all">
                             <h5 className="font-bold text-gray-900 text-sm mb-1">{req.title}</h5>
                             <p className="text-[10px] text-gray-500 mb-4">By: {req.author}</p>
                             <div className="flex justify-end gap-2"><button onClick={() => handleViewDetails(req, 'blog')} className="p-2 text-gray-400 hover:text-blue-600"><Eye size={16}/></button><button onClick={() => handleActionClick(req, 'approve', 'blog')} className="p-2 text-green-500"><Check size={16}/></button><button onClick={() => handleActionClick(req, 'reject', 'blog')} className="p-2 text-red-500"><X size={16}/></button></div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Truck size={20} className="text-orange-600"/> Wholesale ({wholesaleRequests.length})</h4>
                    <div className="space-y-4">
                       {wholesaleRequests.map((req:any) => (
                          <div key={req.id} className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all">
                             <h5 className="font-bold text-gray-900 text-sm mb-1">{req.product}</h5>
                             <p className="text-[10px] text-gray-500 mb-4">{req.quantity} • {req.price}</p>
                             <div className="flex justify-end gap-2"><button onClick={() => handleViewDetails(req, 'wholesale')} className="p-2 text-gray-400 hover:text-blue-600"><Eye size={16}/></button><button onClick={() => handleActionClick(req, 'approve', 'wholesale')} className="p-2 text-green-500"><Check size={16}/></button><button onClick={() => handleActionClick(req, 'reject', 'wholesale')} className="p-2 text-red-500"><X size={16}/></button></div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           ) : (
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                       <tr><th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{activeTab === 'jobs' ? 'JOB TITLE' : 'BLOG TITLE'}</th><th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">AUTHOR/COMPANY</th><th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">DATE</th><th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">ACTIONS</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {(activeTab === 'jobs' ? jobs : blogs).map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                             <td className="p-4 font-bold text-gray-900 text-sm">{item.title}</td>
                             <td className="p-4 text-sm text-gray-600">{item.company || item.author}</td>
                             <td className="p-4 text-sm text-gray-500">{item.postedDate}</td>
                             <td className="p-4 text-right"><div className="flex justify-end gap-3 text-gray-400"><button onClick={() => handleViewDetails(item, activeTab === 'jobs' ? 'job' : 'blog')} className="hover:text-gray-600"><Eye size={18}/></button><button onClick={() => handleEdit(item)} className="hover:text-gray-600"><Edit3 size={18}/></button><button onClick={() => handleDelete(item.id, activeTab === 'jobs' ? 'job' : 'blog')} className="hover:text-red-500"><Trash2 size={18}/></button></div></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
    </div>
  );
};
