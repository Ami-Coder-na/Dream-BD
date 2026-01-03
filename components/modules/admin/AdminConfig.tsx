import React, { useState, useMemo, useRef } from 'react';
import { 
  Database, Search, Sprout, Stethoscope, BookOpen, 
  Navigation, Recycle, Home, Fish, Hammer, MapPin, 
  Plus, Trash2, Filter, X, Edit3, Scale, Plane, Wrench,
  AlertCircle, Users, Building2, Camera, Info, CheckCircle, Save, ChevronRight,
  Image as ImageIcon, HeartPulse, PlusCircle, Phone, DollarSign, Clock, Tag, Waves,
  Upload, Loader2, Eye, Gift, Pencil
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

type ConfigTab = 'agri' | 'health' | 'edu' | 'transport' | 'disaster' | 'fishery' | 'craft' | 'waste' | 'districts' | 'legal' | 'expat' | 'vocational';

const bnToEn = (str: any) => {
    if(!str) return 0;
    const s = str.toString();
    const numbers = { '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4, '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9 };
    // @ts-ignore
    const enStr = s.replace(/[০-৯]/g, (match: string) => numbers[match]);
    return parseFloat(enStr) || parseFloat(s) || 0;
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  });
};

export const AdminConfig: React.FC<Props> = ({ isBangla }) => {
  const { 
    marketPrices, updateMarketPrices,
    lawyers, addLawyer, deleteLawyer, 
    exchangeRates, addExchangeRate, deleteExchangeRate,
    vocationalCourses, addVocationalCourse, deleteVocationalCourse,
    districts, updateDistrict, deleteDistrict,
    craftProducts, addCraftProduct, updateCraftProduct, deleteCraftProduct
  } = useData();

  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('districts');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configForm, setConfigForm] = useState<any>({});
  const [districtSearch, setDistrictSearch] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const craftImageInputRef = useRef<HTMLInputElement>(null);

  const [editingDistrict, setEditingDistrict] = useState<any>(null);
  const [viewingDistrict, setViewingDistrict] = useState<any>(null);
  const [editingCraft, setEditingCraft] = useState<any>(null);
  
  const filteredDistricts = useMemo(() => {
    const searchLower = (districtSearch || '').toLowerCase();
    return (districts || []).filter((d: any) => 
      (d.nameEn || d.nameen || '').toLowerCase().includes(searchLower) ||
      (d.nameBn || d.namebn || '').includes(districtSearch)
    );
  }, [districts, districtSearch]);

  const handleEditDistrict = (d: any) => {
    setEditingDistrict({
      ...d,
      nameEn: d.nameEn || d.nameen || '',
      nameBn: d.nameBn || d.namebn || '',
      touristSpots: d.touristSpots || d.touristspots || [],
      upazilas_str: Array.isArray(d.upazilas) ? d.upazilas.join(', ') : '',
      spots_str: Array.isArray(d.touristSpots || d.touristspots) ? (d.touristSpots || d.touristspots).join(', ') : '',
      images: Array.isArray(d.images) ? d.images : [],
      education: d.education || { primary: 0, highSchool: 0, college: 0, university: 0 },
      hospitals: Array.isArray(d.hospitals) ? d.hospitals : []
    });
  };

  const handleEditCraft = (c: any) => {
    setEditingCraft(c);
    setConfigForm({ ...c });
    setIsConfigModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsCompressing(true);
    const newCompressedImages = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await compressImage(files[i]);
        newCompressedImages.push(compressed);
      } catch (err) {
        console.error("Compression failed for file:", files[i].name);
      }
    }

    setEditingDistrict({
      ...editingDistrict,
      images: [...(editingDistrict.images || []), ...newCompressedImages]
    });
    setIsCompressing(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleCraftImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setConfigForm({ ...configForm, image: compressed });
      } catch (err) {
        console.error("Compression failed", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSaveDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    const safeNameEn = (editingDistrict.nameEn || editingDistrict.nameen || 'unnamed');
    const finalId = editingDistrict.id || safeNameEn.toLowerCase().replace(/\s+/g, '');
    const updated = {
      ...editingDistrict,
      id: finalId,
      upazilas: (editingDistrict.upazilas_str || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      touristSpots: (editingDistrict.spots_str || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      images: Array.isArray(editingDistrict.images) ? editingDistrict.images : [],
      hospitals: editingDistrict.hospitals.filter((h: any) => h.name && h.name.trim() !== '')
    };
    delete updated.upazilas_str;
    delete updated.spots_str;
    updateDistrict(updated);
    setEditingDistrict(null);
  };

  const openModal = () => {
    if (activeConfigTab === 'districts') {
        setEditingDistrict({ id: '', nameEn: '', nameBn: '', division: 'Dhaka', population: '', area: '', description: '', upazilas_str: '', spots_str: '', images: [], education: { primary: 0, highSchool: 0, college: 0, university: 0 }, hospitals: [] });
    } else {
        setConfigForm({});
        setEditingCraft(null);
        setIsConfigModalOpen(true);
    }
  };

  const handleDeleteItem = (id: any) => {
      if(!confirm('Delete this item permanently?')) return;
      if (activeConfigTab === 'agri') updateMarketPrices(marketPrices.filter((p: any) => p.id !== id));
      else if (activeConfigTab === 'legal') deleteLawyer(id);
      else if (activeConfigTab === 'vocational') deleteVocationalCourse(id);
      else if (activeConfigTab === 'expat') deleteExchangeRate(id);
      else if (activeConfigTab === 'districts') deleteDistrict(id);
      else if (activeConfigTab === 'craft') deleteCraftProduct(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (activeConfigTab === 'agri') {
            const todayPrice = bnToEn(configForm.today);
            const yesterdayPrice = configForm.yesterday ? bnToEn(configForm.yesterday) : todayPrice;
            // Define trend to fix shorthand property error on line 196
            const trend = todayPrice > yesterdayPrice ? 'up' : todayPrice < yesterdayPrice ? 'down' : 'stable';
            const newItem = { ...configForm, id: Date.now(), today: todayPrice, yesterday: yesterdayPrice, trend };
            updateMarketPrices([...marketPrices, newItem]);
        } else if (activeConfigTab === 'legal') {
            addLawyer({ ...configForm, id: Date.now() });
        } else if (activeConfigTab === 'vocational') {
            addVocationalCourse({ ...configForm, id: Date.now() });
        } else if (activeConfigTab === 'expat') {
            addExchangeRate({ ...configForm, id: Date.now() });
        } else if (activeConfigTab === 'craft') {
            if (editingCraft) {
              updateCraftProduct({ ...configForm });
            } else {
              addCraftProduct({ ...configForm, id: Date.now() });
            }
        }
        setIsConfigModalOpen(false);
        setConfigForm({});
        setEditingCraft(null);
    } catch (err) {
        console.error(err);
    }
  };

  const renderTabContent = () => {
    switch (activeConfigTab) {
      case 'districts':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                 <input type="text" value={districtSearch} onChange={e => setDistrictSearch(e.target.value)} placeholder="Search districts..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
               </div>
               <Button onClick={openModal} className="bg-brand-600 text-white flex items-center gap-2"><Plus size={18}/> Add District</Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDistricts.map((d: any) => (
                  <div key={d.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{d.nameEn}</h4>
                        <p className="text-sm text-gray-500">{d.nameBn}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => setViewingDistrict(d)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-brand-50 hover:text-brand-600"><Eye size={16}/></button>
                         <button onClick={() => handleEditDistrict(d)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600"><Edit3 size={16}/></button>
                         <button onClick={() => handleDeleteItem(d.id)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600"><Trash2 size={16}/></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded w-fit mb-3">{d.division}</div>
                    <div className="flex justify-between text-xs text-gray-400 font-bold uppercase">
                      <span>{d.upazilas?.length || 0} Upazilas</span>
                      <span>{d.touristSpots?.length || 0} Spots</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'agri':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Daily Market Rates</h3>
              <Button onClick={openModal} className="bg-brand-600 text-white"><Plus size={18}/> Add Rate</Button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase">
                    <tr><th className="p-4">Commodity</th><th className="p-4">Today</th><th className="p-4">Yesterday</th><th className="p-4 text-center">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {marketPrices.map((p: any) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-4 font-bold">{p.nameEn} ({p.nameBn})</td>
                        <td className="p-4">৳ {p.today} / {p.unit}</td>
                        <td className="p-4 text-gray-400">৳ {p.yesterday}</td>
                        <td className="p-4 text-center"><button onClick={() => handleDeleteItem(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        );
      case 'craft':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Heritage Craft Products</h3>
              <Button onClick={openModal} className="bg-brand-600 text-white"><Plus size={18}/> Add Craft</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {craftProducts.map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center">
                  <img src={c.image} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{c.nameEn}</h4>
                    <p className="text-xs text-gray-500">{c.artisan}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditCraft(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                    <button onClick={() => handleDeleteItem(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="p-20 text-center text-gray-400 italic">Configuration for this module coming soon.</div>;
    }
  };

  const tabs: { id: ConfigTab; label: string; icon: any }[] = [
    { id: 'districts', label: '64 Districts', icon: <MapPin size={18}/> },
    { id: 'agri', label: 'Agri Prices', icon: <Sprout size={18}/> },
    { id: 'craft', label: 'Craft Market', icon: <Gift size={18}/> },
    { id: 'legal', label: 'Lawyers', icon: <Scale size={18}/> },
    { id: 'vocational', label: 'Courses', icon: <Wrench size={18}/> },
    { id: 'expat', label: 'Expat Rates', icon: <Plane size={18}/> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 rounded-xl text-brand-600"><Database size={24} /></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Module Configuration</h2>
            <p className="text-gray-500 text-sm">Manage dynamic data across all platform modules</p>
          </div>
       </div>

       <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveConfigTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeConfigTab === tab.id 
                  ? 'bg-brand-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
       </div>

       {renderTabContent()}

       {/* District Edit Modal */}
       {editingDistrict && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setEditingDistrict(null)}>
           <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-xl flex items-center gap-2"><MapPin size={22} className="text-brand-600" /> {editingDistrict.id ? 'Edit District' : 'Add New District'}</h3>
                 <button onClick={() => setEditingDistrict(null)}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
              </div>
              <form onSubmit={handleSaveDistrict} className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (English)</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={editingDistrict.nameEn} onChange={e => setEditingDistrict({...editingDistrict, nameEn: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (Bangla)</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={editingDistrict.nameBn} onChange={e => setEditingDistrict({...editingDistrict, nameBn: e.target.value})} /></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Division</label><select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={editingDistrict.division} onChange={e => setEditingDistrict({...editingDistrict, division: e.target.value})}><option>Dhaka</option><option>Chattogram</option><option>Sylhet</option><option>Khulna</option><option>Rajshahi</option><option>Barisal</option><option>Rangpur</option><option>Mymensingh</option></select></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Population</label><input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={editingDistrict.population} onChange={e => setEditingDistrict({...editingDistrict, population: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Area (sq km)</label><input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={editingDistrict.area} onChange={e => setEditingDistrict({...editingDistrict, area: e.target.value})} /></div>
                 </div>
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label><textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" value={editingDistrict.description} onChange={e => setEditingDistrict({...editingDistrict, description: e.target.value})} /></div>
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Upazilas (Comma Separated)</label><textarea rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none font-mono text-sm" value={editingDistrict.upazilas_str} onChange={e => setEditingDistrict({...editingDistrict, upazilas_str: e.target.value})} /></div>
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tourist Spots (Comma Separated)</label><textarea rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none font-mono text-sm" value={editingDistrict.spots_str} onChange={e => setEditingDistrict({...editingDistrict, spots_str: e.target.value})} /></div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">District Gallery (Multiple)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {(editingDistrict.images || []).map((img: string, idx: number) => (
                         <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-100">
                           <img src={img} className="w-full h-full object-cover" />
                           <button type="button" onClick={() => setEditingDistrict({...editingDistrict, images: editingDistrict.images.filter((_:any, i:any) => i !== idx)})} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                         </div>
                       ))}
                       <button type="button" onClick={() => imageInputRef.current?.click()} className="aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
                          {isCompressing ? <Loader2 className="animate-spin" size={24}/> : <PlusCircle size={24}/>}
                          <span className="text-[10px] font-bold mt-1 uppercase">Upload</span>
                       </button>
                    </div>
                    <input type="file" ref={imageInputRef} className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                 </div>

                 <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                    <Button type="button" variant="outline" onClick={() => setEditingDistrict(null)}>Cancel</Button>
                    <Button type="submit" className="bg-brand-600 text-white font-bold px-8 shadow-lg shadow-brand-100"><Save size={18} className="mr-2"/> Save District</Button>
                 </div>
              </form>
           </div>
         </div>
       )}

       {/* General Config Modal (Agri, Craft, etc) */}
       {isConfigModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsConfigModalOpen(false)}>
           <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-bold text-xl uppercase tracking-tighter">{activeConfigTab} Configuration</h3>
                 <button onClick={() => setIsConfigModalOpen(false)}><X size={24} className="text-gray-400"/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                 {activeConfigTab === 'agri' && (
                   <div className="space-y-4">
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Name (EN)" value={configForm.nameEn} onChange={e => setConfigForm({...configForm, nameEn: e.target.value})} />
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Name (BN)" value={configForm.nameBn} onChange={e => setConfigForm({...configForm, nameBn: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                         <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Today's Price" value={configForm.today} onChange={e => setConfigForm({...configForm, today: e.target.value})} />
                         <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Yesterday's Price" value={configForm.yesterday} onChange={e => setConfigForm({...configForm, yesterday: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Unit (kg/mon/pc)" value={configForm.unit} onChange={e => setConfigForm({...configForm, unit: e.target.value})} />
                         <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={configForm.category} onChange={e => setConfigForm({...configForm, category: e.target.value})}><option>Vegetable</option><option>Fruit</option><option>Fish</option><option>Grocery</option><option>Meat</option></select>
                      </div>
                   </div>
                 )}

                 {activeConfigTab === 'craft' && (
                   <div className="space-y-4">
                      <div className="flex gap-4 items-center mb-4">
                         <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer" onClick={() => craftImageInputRef.current?.click()}>
                            {configForm.image ? <img src={configForm.image} className="w-full h-full object-cover" /> : <Camera className="text-gray-300" />}
                            {isCompressing && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" size={16}/></div>}
                         </div>
                         <div className="flex-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Craft Image</label>
                            <Button type="button" variant="outline" size="sm" onClick={() => craftImageInputRef.current?.click()} className="mt-1">Upload Product</Button>
                            <input type="file" ref={craftImageInputRef} className="hidden" accept="image/*" onChange={handleCraftImageUpload} />
                         </div>
                      </div>
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Product Name (EN)" value={configForm.nameEn} onChange={e => setConfigForm({...configForm, nameEn: e.target.value})} />
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Product Name (BN)" value={configForm.nameBn} onChange={e => setConfigForm({...configForm, nameBn: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                         <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Artisan / Location" value={configForm.artisan} onChange={e => setConfigForm({...configForm, artisan: e.target.value})} />
                         <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={configForm.category} onChange={e => setConfigForm({...configForm, category: e.target.value})}><option>Textile</option><option>Bamboo</option><option>Pottery</option><option>Jute</option><option>Wood</option><option>Metal</option></select>
                      </div>
                      <textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" placeholder="Brief Description (EN)" value={configForm.descriptionEn} onChange={e => setConfigForm({...configForm, descriptionEn: e.target.value})} />
                      <textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none" placeholder="Brief Description (BN)" value={configForm.descriptionBn} onChange={e => setConfigForm({...configForm, descriptionBn: e.target.value})} />
                   </div>
                 )}

                 {activeConfigTab === 'legal' && (
                   <div className="space-y-4">
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Lawyer Name" value={configForm.name} onChange={e => setConfigForm({...configForm, name: e.target.value})} />
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Specialty" value={configForm.specialty} onChange={e => setConfigForm({...configForm, specialty: e.target.value})} />
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Location" value={configForm.location} onChange={e => setConfigForm({...configForm, location: e.target.value})} />
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Phone" value={configForm.phone} onChange={e => setConfigForm({...configForm, phone: e.target.value})} />
                   </div>
                 )}

                 {activeConfigTab === 'vocational' && (
                   <div className="space-y-4">
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Course Title" value={configForm.title} onChange={e => setConfigForm({...configForm, title: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                         <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Duration" value={configForm.duration} onChange={e => setConfigForm({...configForm, duration: e.target.value})} />
                         <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Fee" value={configForm.fee} onChange={e => setConfigForm({...configForm, fee: e.target.value})} />
                      </div>
                      <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Image URL" value={configForm.image} onChange={e => setConfigForm({...configForm, image: e.target.value})} />
                   </div>
                 )}

                 {activeConfigTab === 'expat' && (
                   <div className="space-y-4">
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Currency (e.g. USD)" value={configForm.currency} onChange={e => setConfigForm({...configForm, currency: e.target.value})} />
                      <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Exchange Rate (to BDT)" value={configForm.rate} onChange={e => setConfigForm({...configForm, rate: e.target.value})} />
                      <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={configForm.trend} onChange={e => setConfigForm({...configForm, trend: e.target.value})}><option value="up">Trending Up</option><option value="down">Trending Down</option><option value="stable">Stable</option></select>
                   </div>
                 )}

                 <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-100 text-lg">Save Config</Button>
              </form>
           </div>
         </div>
       )}

       {/* View District Modal */}
       {viewingDistrict && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setViewingDistrict(null)}>
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <div className="relative h-48 sm:h-64 overflow-hidden">
                 <img src={viewingDistrict.images?.[0] || 'https://placehold.co/800x600?text=District'} className="w-full h-full object-cover" />
                 <button onClick={() => setViewingDistrict(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"><X size={20}/></button>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 <div className="absolute bottom-6 left-8 text-white">
                    <h3 className="text-3xl font-black">{viewingDistrict.nameEn}</h3>
                    <p className="text-brand-300 font-bold">{viewingDistrict.division} Division</p>
                 </div>
              </div>
              <div className="p-8 space-y-6 overflow-y-auto max-h-[50vh]">
                 <div><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</h4><p className="text-gray-600 leading-relaxed font-medium">{viewingDistrict.description}</p></div>
                 <div className="grid grid-cols-2 gap-6">
                    <div><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Upazilas ({viewingDistrict.upazilas?.length})</h4><div className="flex flex-wrap gap-1">{viewingDistrict.upazilas?.map((u:string, i:number)=>(<span key={i} className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded">{u}</span>))}</div></div>
                    <div><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tourist Spots ({viewingDistrict.touristSpots?.length})</h4><div className="flex flex-wrap gap-1">{viewingDistrict.touristSpots?.map((s:string, i:number)=>(<span key={i} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">{s}</span>))}</div></div>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                 <Button onClick={() => setViewingDistrict(null)} className="bg-gray-900 text-white px-10">Done</Button>
              </div>
           </div>
         </div>
       )}
    </div>
  );
};