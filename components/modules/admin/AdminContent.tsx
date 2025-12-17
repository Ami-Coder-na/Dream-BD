
import React, { useState, useRef } from 'react';
import { 
  Briefcase, FileText, Plus, Search, Eye, Edit3, Trash2, 
  Check, X, ArrowLeft, Save, MapPin, DollarSign, Calendar, 
  Tag, User, Building2, ImageIcon, Loader2, Upload, 
  ShoppingBasket, Gem, Info, RefreshCw, Layers
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

type ContentTab = 'jobs' | 'blogs' | 'amar_bd' | 'amar_jela' | 'market' | 'moderation';

export const AdminContent = () => {
  const { 
    jobs, blogs, requests, blogRequests, marketPrices, retailProducts, districtBranding, districtDetails,
    addJob, updateJob, deleteJob, 
    addBlog, updateBlog, deleteBlog,
    addMarketPrice, updateMarketPrice, deleteMarketPrice,
    addRetailProduct, updateRetailProduct, deleteRetailProduct,
    addBranding, updateBranding, deleteBranding,
    updateDistrictDetails,
    handleRequestAction 
  } = useData();
  
  const [activeTab, setActiveTab] = useState<ContentTab>('jobs');
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ACTIONS ---

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setView('edit');
  };

  const handleAddNew = () => {
    setSelectedItem({});
    setView('edit');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    setIsProcessing(true);
    if (activeTab === 'jobs') await deleteJob(id);
    if (activeTab === 'blogs') await deleteBlog(id);
    if (activeTab === 'amar_bd') await deleteBranding(id);
    if (activeTab === 'market') await deleteMarketPrice(id);
    setIsProcessing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
        if (activeTab === 'jobs') {
            selectedItem.id ? await updateJob(selectedItem) : await addJob({ ...selectedItem, postedBy: 'Admin', postedDate: new Date().toLocaleDateString(), status: 'Active' });
        } else if (activeTab === 'blogs') {
            selectedItem.id ? await updateBlog(selectedItem) : await addBlog({ ...selectedItem, author: 'Admin', postedDate: new Date().toLocaleDateString(), status: 'Active' });
        } else if (activeTab === 'amar_bd') {
            selectedItem.id ? await updateBranding(selectedItem) : await addBranding(selectedItem);
        } else if (activeTab === 'market') {
            selectedItem.id ? await updateMarketPrice(selectedItem) : await addMarketPrice(selectedItem);
        } else if (activeTab === 'amar_jela') {
            await updateDistrictDetails(selectedItem);
        }
        alert('Saved Successfully!');
        setView('list');
    } catch (err) { alert('Error saving data'); }
    
    setIsProcessing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedItem({ ...selectedItem, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // --- RENDERERS ---

  if (view === 'edit') {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 capitalize">
              <Edit3 size={20} /> {selectedItem.id ? 'Edit' : 'Add New'} {activeTab.replace('_', ' ')}
            </h3>
            <Button variant="outline" onClick={() => setView('list')} className="bg-white border-gray-200">
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
          </div>
          
          <form onSubmit={handleSave} className="p-8 space-y-6">
             {activeTab === 'jobs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Job Title</label>
                      <input required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.title || ''} onChange={e => setSelectedItem({...selectedItem, title: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Company</label>
                      <input required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.company || ''} onChange={setSelectedItem ? (e => setSelectedItem({...selectedItem, company: e.target.value})) : undefined} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Location</label>
                      <input required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.location || ''} onChange={e => setSelectedItem({...selectedItem, location: e.target.value})} />
                   </div>
                </div>
             )}

             {activeTab === 'blogs' && (
                <div className="space-y-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Blog Title</label>
                      <input required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.title || ''} onChange={e => setSelectedItem({...selectedItem, title: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                        <input className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.category || ''} onChange={e => setSelectedItem({...selectedItem, category: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image</label>
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full p-3 bg-gray-50 border rounded-xl text-left truncate flex items-center gap-2">
                           <Upload size={14}/> {selectedItem.image ? 'Image Selected' : 'Upload Image'}
                        </button>
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Content</label>
                      <textarea rows={8} className="w-full p-3 bg-gray-50 border rounded-xl resize-none" value={selectedItem.content || ''} onChange={e => setSelectedItem({...selectedItem, content: e.target.value})} />
                   </div>
                </div>
             )}

             {activeTab === 'amar_bd' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">District Name (EN)</label>
                      <input required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.nameEn || ''} onChange={e => setSelectedItem({...selectedItem, nameEn: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Product/Famous For (BN)</label>
                      <input required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.productBn || ''} onChange={e => setSelectedItem({...selectedItem, productBn: e.target.value})} />
                   </div>
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category Type</label>
                      <select className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.type || 'food'} onChange={e => setSelectedItem({...selectedItem, type: e.target.value})}>
                        <option value="food">Food</option><option value="cloth">Clothing</option><option value="fruit">Fruits</option><option value="nature">Nature/Natural</option><option value="craft">Handicraft</option>
                      </select>
                   </div>
                </div>
             )}

             {activeTab === 'market' && (
                <div className="grid grid-cols-2 gap-6">
                   <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Item Name (BN)</label><input required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.nameBn || ''} onChange={e => setSelectedItem({...selectedItem, nameBn: e.target.value})} /></div>
                   <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Unit</label><input required className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="kg/mon" value={selectedItem.unit || ''} onChange={e => setSelectedItem({...selectedItem, unit: e.target.value})} /></div>
                   <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Today Price</label><input type="number" required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.today || ''} onChange={e => setSelectedItem({...selectedItem, today: e.target.value})} /></div>
                   <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Yesterday Price</label><input type="number" required className="w-full p-3 bg-gray-50 border rounded-xl" value={selectedItem.yesterday || ''} onChange={e => setSelectedItem({...selectedItem, yesterday: e.target.value})} /></div>
                </div>
             )}

             <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setView('list')}>Cancel</Button>
                <Button type="submit" disabled={isProcessing} className="bg-green-600 text-white font-bold px-8">
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Save Content'}
                </Button>
             </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Tab Navigation */}
       <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-2 overflow-x-auto">
          {[
            { id: 'jobs', label: 'Jobs', icon: <Briefcase size={16}/> },
            { id: 'blogs', label: 'Blogs', icon: <FileText size={16}/> },
            { id: 'amar_bd', label: 'Amar BD', icon: <Gem size={16}/> },
            { id: 'amar_jela', label: 'Amar Jela', icon: <MapPin size={16}/> },
            { id: 'market', label: 'Bazar Sodai', icon: <ShoppingBasket size={16}/> },
            { id: 'moderation', label: 'Queue', icon: <Layers size={16}/> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as ContentTab); setView('list'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.icon} {tab.label}
              {tab.id === 'moderation' && (requests.length + blogRequests.length) > 0 && (
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{requests.length + blogRequests.length}</span>
              )}
            </button>
          ))}
       </div>

       {/* Content List View */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 capitalize">
               {activeTab.replace('_', ' ')} Management
             </h3>
             {activeTab !== 'moderation' && activeTab !== 'amar_jela' && (
                <Button onClick={handleAddNew} size="sm" className="bg-green-600 text-white"><Plus size={16}/> Add New</Button>
             )}
          </div>

          <div className="overflow-x-auto">
             {activeTab === 'jobs' && (
                <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50/80 text-gray-500 uppercase font-bold text-[10px]">
                      <tr><th className="p-4">Job Title</th><th className="p-4">Company</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {jobs.map((item: any) => (
                         <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-900">{item.title}</td>
                            <td className="p-4 text-gray-600">{item.company}</td>
                            <td className="p-4 text-gray-400">{item.postedDate}</td>
                            <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.status}</span></td>
                            <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600"><Edit3 size={16}/></button><button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button></div></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             )}

             {activeTab === 'blogs' && (
                <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50/80 text-gray-500 uppercase font-bold text-[10px]">
                      <tr><th className="p-4">Blog Title</th><th className="p-4">Author</th><th className="p-4">Category</th><th className="p-4 text-right">Actions</th></tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {blogs.map((item: any) => (
                         <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-900">{item.title}</td>
                            <td className="p-4 text-gray-600">{item.author}</td>
                            <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">{item.category}</span></td>
                            <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600"><Edit3 size={16}/></button><button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button></div></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             )}

             {activeTab === 'amar_bd' && (
                <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50/80 text-gray-500 uppercase font-bold text-[10px]">
                      <tr><th className="p-4">District</th><th className="p-4">Famous For (BN)</th><th className="p-4">Type</th><th className="p-4 text-right">Actions</th></tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {districtBranding.map((item: any) => (
                         <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-900">{item.nameEn}</td>
                            <td className="p-4 text-gray-600">{item.productBn}</td>
                            <td className="p-4 capitalize text-xs font-medium text-emerald-600">{item.type}</td>
                            <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600"><Edit3 size={16}/></button><button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button></div></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             )}

             {activeTab === 'market' && (
                <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50/80 text-gray-500 uppercase font-bold text-[10px]">
                      <tr><th className="p-4">Item Name</th><th className="p-4">Today (৳)</th><th className="p-4">Yesterday (৳)</th><th className="p-4 text-right">Actions</th></tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {marketPrices.map((item: any) => (
                         <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-900">{item.nameBn} <span className="text-gray-400 font-normal">({item.unit})</span></td>
                            <td className="p-4 font-bold text-emerald-600">{item.today}</td>
                            <td className="p-4 text-gray-400">{item.yesterday}</td>
                            <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-blue-600"><Edit3 size={16}/></button><button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button></div></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             )}

             {activeTab === 'moderation' && (
                <div className="p-6 space-y-6">
                   <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-3 text-orange-800 mb-4">
                      <Info size={18} /> <span className="text-sm font-bold">Manage pending user-submitted content. Approve to make it live.</span>
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider border-b pb-2">Pending Jobs ({requests.length})</h4>
                         {requests.map((r: any) => (
                            <div key={r.id} className="bg-gray-50 border rounded-xl p-4 flex justify-between items-center group">
                               <div><p className="font-bold text-gray-900">{r.title}</p><p className="text-xs text-gray-500">By: {r.postedBy}</p></div>
                               <div className="flex gap-2"><button onClick={() => handleRequestAction(r, 'approve', 'job')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-all"><Check size={16}/></button><button onClick={() => handleRequestAction(r, 'reject', 'job')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-all"><X size={16}/></button></div>
                            </div>
                         ))}
                      </div>
                      <div className="space-y-4">
                         <h4 className="font-bold text-gray-700 uppercase text-xs tracking-wider border-b pb-2">Pending Blogs ({blogRequests.length})</h4>
                         {blogRequests.map((r: any) => (
                            <div key={r.id} className="bg-gray-50 border rounded-xl p-4 flex justify-between items-center group">
                               <div><p className="font-bold text-gray-900 truncate max-w-[200px]">{r.title}</p><p className="text-xs text-gray-500">By: {r.author}</p></div>
                               <div className="flex gap-2"><button onClick={() => handleRequestAction(r, 'approve', 'blog')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-all"><Check size={16}/></button><button onClick={() => handleRequestAction(r, 'reject', 'blog')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-all"><X size={16}/></button></div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};
