
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

  const [activeSubTab, setActiveSubTab] = useState<ConfigTab>('districts');
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
      touristSpots: d.touristspots || d.touristSpots || [],
      upazilas_str: Array.isArray(d.upazilas) ? d.upazilas.join(', ') : '',
      spots_str: Array.isArray(d.touristspots || d.touristSpots) ? (d.touristspots || d.touristSpots).join(', ') : '',
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
      id: finalId,
      nameen: editingDistrict.nameEn,
      namebn: editingDistrict.nameBn,
      division: editingDistrict.division,
      population: editingDistrict.population,
      area: editingDistrict.area,
      description: editingDistrict.description,
      upazilas: (editingDistrict.upazilas_str || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      touristspots: (editingDistrict.spots_str || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      images: Array.isArray(editingDistrict.images) ? editingDistrict.images : [],
      education: editingDistrict.education,
      hospitals: editingDistrict.hospitals.filter((h: any) => h.name && h.name.trim() !== '')
    };
    
    updateDistrict(updated);
    setEditingDistrict(null);
  };

  const openModal = () => {
    if (activeSubTab === 'districts') {
        setEditingDistrict({ id: '', nameEn: '', nameBn: '', division: 'Dhaka', population: '', area: '', description: '', upazilas_str: '', spots_str: '', images: [], education: { primary: 0, highSchool: 0, college: 0, university: 0 }, hospitals: [] });
    } else {
        setConfigForm({});
        setEditingCraft(null);
        setIsConfigModalOpen(true);
    }
  };

  const handleDeleteItem = (id: any) => {
      if(!confirm('Delete this item permanently?')) return;
      if (activeSubTab === 'agri') updateMarketPrices(marketPrices.filter((p: any) => p.id !== id));
      else if (activeSubTab === 'legal') deleteLawyer(id);
      else if (activeSubTab === 'vocational') deleteVocationalCourse(id);
      else if (activeSubTab === 'expat') deleteExchangeRate(id);
      else if (activeSubTab === 'districts') deleteDistrict(id);
      else if (activeSubTab === 'craft') deleteCraftProduct(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (activeSubTab === 'agri') {
            const todayPrice = bnToEn(configForm.today);
            const yesterdayPrice = configForm.yesterday ? bnToEn(configForm.yesterday) : todayPrice;
            const trend = todayPrice > yesterdayPrice ? 'up' : todayPrice < yesterdayPrice ? 'down' : 'stable';
            const newItem = { ...configForm, id: Date.now(), today: todayPrice, yesterday: yesterdayPrice, trend };
            updateMarketPrices([...marketPrices, newItem]);
        } else if (activeSubTab === 'legal') {
            addLawyer({ ...configForm, id: Date.now() });
        } else if (activeSubTab === 'vocational') {
            addVocationalCourse({ ...configForm, id: Date.now() });
        } else if (activeSubTab === 'expat') {
            addExchangeRate({ ...configForm, id: Date.now() });
        } else if (activeSubTab === 'craft') {
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

  const renderTable = () => {
    if (activeSubTab === 'districts') {
        return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-[450px]">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search 64 districts (e.g. Dhaka, Bogra)..." 
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" 
                          value={districtSearch} 
                          onChange={e => setDistrictSearch(e.target.value)} 
                        />
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold text-gray-500 border border-gray-200">
                        {filteredDistricts.length} Districts Found
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDistricts.map((d: any) => (
                        <div key={d.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col group relative overflow-hidden border-t-4 border-t-brand-500">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h4 className="font-black text-xl text-gray-900">{isBangla ? (d.nameBn || d.namebn) : (d.nameEn || d.nameen)}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{d.division} DIVISION</p>
                              </div>
                              <div className="bg-brand-50 text-brand-700 p-2 rounded-lg"><MapPin size={20} /></div>
                            </div>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">Pop:</span>
                                    <span className="font-black text-gray-900">{d.population || '0'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">Area:</span>
                                    <span className="font-black text-gray-900">{d.area || '0'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">Hospitals:</span>
                                    <span className="font-black text-red-600">{Array.isArray(d.hospitals) ? d.hospitals.length : (d.hospital_count || 0)}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditDistrict(d)} 
                                  className="flex-1 bg-[#0f172a] hover:bg-black text-white flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all"
                                >
                                  <Edit3 size={14} /> Edit District Data
                                </button>
                                <button 
                                  onClick={() => setViewingDistrict(d)}
                                  className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-100"
                                >
                                  <Eye size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(d.id)} 
                                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                                >
                                  <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const dataMap: any = {
      agri: marketPrices,
      legal: lawyers,
      expat: exchangeRates,
      vocational: vocationalCourses,
      craft: craftProducts
    };

    const currentData = dataMap[activeSubTab] || [];

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                    <tr><th className="p-4 border-b border-gray-100">Item Details</th><th className="p-4 border-b border-gray-100">Category/Status</th><th className="p-4 border-b border-gray-100 text-right">Action</th></tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                    {currentData.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                           <div className="font-bold text-gray-900">{item.nameEn || item.titleEn || item.currency || item.product || item.name}</div>
                           <div className="text-xs text-gray-500">{item.nameBn || item.titleBn || item.specialty || '#' + item.id}</div>
                        </td>
                        <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{item.category || item.unit || 'N/A'}</span></td>
                        <td className="p-4 text-right">
                           <div className="flex justify-end gap-2">
                             {activeSubTab === 'craft' && <button onClick={() => handleEditCraft(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>}
                             <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  };

  const TABS = [
    { id: 'districts', label: '64 Districts', icon: <MapPin size={16}/> },
    { id: 'agri', label: 'Agriculture', icon: <Sprout size={16}/> },
    { id: 'legal', label: 'Legal Aid', icon: <Scale size={16}/> },
    { id: 'expat', label: 'Expat', icon: <Plane size={16}/> },
    { id: 'vocational', label: 'Vocational', icon: <Wrench size={16}/> },
    { id: 'health', label: 'Health', icon: <HeartPulse size={16}/> },
    { id: 'edu', label: 'Education', icon: <BookOpen size={16}/> },
    { id: 'transport', label: 'Transport', icon: <Navigation size={16}/> },
    { id: 'disaster', label: 'Disaster', icon: <Waves size={16}/> },
    { id: 'fishery', label: 'Fishery', icon: <Fish size={16}/> },
    { id: 'craft', label: 'Heritage Craft', icon: <Hammer size={16}/> },
  ];

  const districtInputStyles = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium text-gray-900";
  const districtLabelStyles = "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 rounded-xl text-brand-600"><Database size={28} /></div>
            <div><h2 className="text-2xl font-bold text-gray-900">Module Configuration</h2><p className="text-gray-500 text-sm">Fine-tune data and settings for specific modules</p></div>
          </div>
          <Button onClick={openModal} className="bg-[#0f172a] hover:bg-black text-white px-6"><Plus size={18} className="mr-2" /> Add New Entry</Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-2 border-b-8 border-gray-400 bg-gray-50/50">
            <div className="flex overflow-x-auto gap-1 no-scrollbar p-1">
              {TABS.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveSubTab(tab.id as any)} 
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeSubTab === tab.id ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">{renderTable()}</div>
        </div>

        {isConfigModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-xl text-gray-900">{editingCraft ? 'Edit Entry' : 'Add New Entry'}</h3>
                  <button onClick={() => setIsConfigModalOpen(false)}><X size={24}/></button>
               </div>
               <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto max-h-[70vh]">
                  {activeSubTab === 'craft' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (EN)</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl" value={configForm.nameEn || ''} onChange={e => setConfigForm({...configForm, nameEn: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (BN)</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl" value={configForm.nameBn || ''} onChange={e => setConfigForm({...configForm, nameBn: e.target.value})} /></div>
                      </div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label><select className="w-full p-2.5 bg-gray-50 border rounded-xl" value={configForm.category || 'Textile'} onChange={e => setConfigForm({...configForm, category: e.target.value})}><option>Textile</option><option>Bamboo</option><option>Pottery</option><option>Jute</option><option>Wood</option><option>Metal</option></select></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Artisan Info</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl" value={configForm.artisan || ''} onChange={e => setConfigForm({...configForm, artisan: e.target.value})} placeholder="Name, District" /></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (BN)</label><textarea rows={3} required className="w-full p-2.5 bg-gray-50 border rounded-xl" value={configForm.descriptionBn || ''} onChange={e => setConfigForm({...configForm, descriptionBn: e.target.value})} /></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Image</label>
                        <div className="flex gap-2">
                           <input className="flex-1 p-2.5 bg-gray-50 border rounded-xl text-xs" value={configForm.image || ''} onChange={e => setConfigForm({...configForm, image: e.target.value})} placeholder="URL or Upload" />
                           <button type="button" onClick={() => craftImageInputRef.current?.click()} className="px-3 bg-white border rounded-xl text-gray-500 hover:bg-gray-50">{isCompressing ? <Loader2 className="animate-spin" size={16}/> : <Upload size={18}/>}</button>
                        </div>
                        <input type="file" ref={craftImageInputRef} className="hidden" accept="image/*" onChange={handleCraftImageUpload} />
                      </div>
                    </>
                  )}
                  <Button type="submit" disabled={isCompressing} className="w-full bg-[#0f172a] text-white font-bold py-3 mt-4">{isCompressing ? 'Processing...' : 'Save Entry'}</Button>
               </form>
            </div>
          </div>
        )}
        
        {/* District Detail View Modal */}
        {viewingDistrict && (
          <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header matching screenshot */}
                <div className="px-8 py-6 flex justify-between items-start bg-[#f0fdfa] shrink-0 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-3xl text-[#0f172a] tracking-tight">{viewingDistrict.nameen || viewingDistrict.nameEn}</h3>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.1em] mt-1">{viewingDistrict.division} DIVISION</p>
                  </div>
                  <button onClick={() => setViewingDistrict(null)} className="p-2 hover:bg-emerald-100 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                    <X size={28}/>
                  </button>
                </div>
                
                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                  {/* Description matching screenshot structure */}
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">DESCRIPTION</label>
                     <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-gray-700 leading-relaxed font-medium">
                          {viewingDistrict.description || 'No description available for this district.'}
                        </p>
                     </div>
                  </div>

                  {/* Population and Area matching screenshot */}
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">POPULATION</label>
                        <p className="text-3xl font-black text-[#0f172a]">{viewingDistrict.population || '0'}</p>
                     </div>
                     <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">AREA</label>
                        <p className="text-3xl font-black text-[#0f172a]">{viewingDistrict.area || '0'}</p>
                     </div>
                  </div>

                  {/* Education Centers matching screenshot blue cards */}
                  <div>
                     <h4 className="text-sm font-black text-[#1e293b] mb-4 flex items-center gap-2">
                        <Building2 size={18} className="text-blue-500" /> Education Centers
                     </h4>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'PRI', val: viewingDistrict.education?.primary || 0 },
                          { label: 'HIGH', val: viewingDistrict.education?.highSchool || 0 },
                          { label: 'COL', val: viewingDistrict.education?.college || 0 },
                          { label: 'UNI', val: viewingDistrict.education?.university || 0 }
                        ].map((item, idx) => (
                           <div key={idx} className="bg-[#f0f7ff] p-4 rounded-xl border border-[#dbeafe] text-center">
                              <p className="text-blue-600 font-black text-lg leading-none mb-1">{item.val}</p>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Missing Sections Restored: Tourist Spots */}
                  <div>
                    <h4 className="text-sm font-black text-[#1e293b] mb-4 flex items-center gap-2">
                      <Camera size={18} className="text-orange-500" /> Tourist Attractions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(viewingDistrict.touristspots || viewingDistrict.touristSpots || []).length > 0 ? (
                        (viewingDistrict.touristspots || viewingDistrict.touristSpots).map((spot: string, idx: number) => (
                          <span key={idx} className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100">
                            {spot}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No tourist spots added.</p>
                      )}
                    </div>
                  </div>

                  {/* Missing Sections Restored: Health Centers */}
                  <div>
                    <h4 className="text-sm font-black text-[#1e293b] mb-4 flex items-center gap-2">
                      <HeartPulse size={18} className="text-red-500" /> Health Centers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {viewingDistrict.hospitals && viewingDistrict.hospitals.length > 0 ? (
                        viewingDistrict.hospitals.map((h: any, idx: number) => (
                          <div key={idx} className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-red-900 text-sm">{h.name}</p>
                              <p className="text-xs text-red-600 font-medium">{h.phone}</p>
                            </div>
                            <Phone size={16} className="text-red-300" />
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic col-span-2">No health centers added.</p>
                      )}
                    </div>
                  </div>

                  {/* Missing Sections Restored: Upazila List */}
                  <div>
                    <h4 className="text-sm font-black text-[#1e293b] mb-4 flex items-center gap-2">
                      <MapPin size={18} className="text-emerald-500" /> Upazila List
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingDistrict.upazilas && viewingDistrict.upazilas.length > 0 ? (
                        viewingDistrict.upazilas.map((upz: string, idx: number) => (
                          <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                            {upz}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No upazilas added.</p>
                      )}
                    </div>
                  </div>

                  {/* Gallery Section Restored */}
                  {viewingDistrict.images && viewingDistrict.images.length > 0 && (
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">GALLERY PREVIEW</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         {viewingDistrict.images.map((img: string, idx: number) => (
                           <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                             <img src={img} className="w-full h-full object-cover" />
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer matching screenshot */}
                <div className="p-6 border-t border-gray-100 flex justify-end bg-white shrink-0">
                  <button 
                    onClick={() => setViewingDistrict(null)}
                    className="bg-[#0f172a] hover:bg-black text-white px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg"
                  >
                    Close Preview
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* --- FULL DISTRICT ADD/EDIT MODAL --- */}
        {editingDistrict && (
          <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up border border-white/20" onClick={e => e.stopPropagation()}>
               <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Pencil size={24} className="text-green-600" />
                    <h3 className="font-bold text-2xl text-[#1e293b]">
                      {editingDistrict.id ? 'Edit District' : 'Add New District'}
                    </h3>
                  </div>
                  <button onClick={() => setEditingDistrict(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                    <X size={28}/>
                  </button>
               </div>
               
               <form onSubmit={handleSaveDistrict} className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={districtLabelStyles}>Name (EN)</label>
                      <input required className={districtInputStyles} value={editingDistrict.nameEn} onChange={e => setEditingDistrict({...editingDistrict, nameEn: e.target.value})} />
                    </div>
                    <div>
                      <label className={districtLabelStyles}>Name (BN)</label>
                      <input required className={districtInputStyles} value={editingDistrict.nameBn} onChange={e => setEditingDistrict({...editingDistrict, nameBn: e.target.value})} />
                    </div>
                    <div>
                      <label className={districtLabelStyles}>Division</label>
                      <select className={districtInputStyles + " cursor-pointer appearance-none"} value={editingDistrict.division} onChange={e => setEditingDistrict({...editingDistrict, division: e.target.value})}>
                        <option>Dhaka</option><option>Chattogram</option><option>Sylhet</option><option>Rajshahi</option><option>Khulna</option><option>Barisal</option><option>Rangpur</option><option>Mymensingh</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={districtLabelStyles}>Population (e.g. 9.1M)</label>
                      <input className={districtInputStyles} value={editingDistrict.population} onChange={e => setEditingDistrict({...editingDistrict, population: e.target.value})} />
                    </div>
                    <div>
                      <label className={districtLabelStyles}>Area (e.g. 1463 km²)</label>
                      <input className={districtInputStyles} value={editingDistrict.area} onChange={e => setEditingDistrict({...editingDistrict, area: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className={districtLabelStyles}>Short Description</label>
                    <textarea rows={4} className={districtInputStyles + " resize-none"} value={editingDistrict.description} onChange={e => setEditingDistrict({...editingDistrict, description: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Education Stats Card */}
                    <div className="bg-[#f0f7ff] p-6 rounded-[20px] border border-[#dbeafe] relative overflow-hidden">
                       <h4 className="text-blue-700 font-bold mb-6 flex items-center gap-2">
                         <BookOpen size={20} /> Education Stats
                       </h4>
                       <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                          <div>
                            <label className="block text-[10px] font-black text-blue-600 uppercase mb-1.5 ml-1">Primary</label>
                            <input type="number" className="w-full p-3 bg-white border border-blue-200 rounded-xl text-blue-900 outline-none font-bold" value={editingDistrict.education.primary} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, primary: parseInt(e.target.value) || 0}})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-blue-600 uppercase mb-1.5 ml-1">High School</label>
                            <input type="number" className="w-full p-3 bg-white border border-blue-200 rounded-xl text-blue-900 outline-none font-bold" value={editingDistrict.education.highSchool} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, highSchool: parseInt(e.target.value) || 0}})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-blue-600 uppercase mb-1.5 ml-1">College</label>
                            <input type="number" className="w-full p-3 bg-white border border-blue-200 rounded-xl text-blue-900 outline-none font-bold" value={editingDistrict.education.college} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, college: parseInt(e.target.value) || 0}})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-blue-600 uppercase mb-1.5 ml-1">University</label>
                            <input type="number" className="w-full p-3 bg-white border border-blue-200 rounded-xl text-blue-900 outline-none font-bold" value={editingDistrict.education.university} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, university: parseInt(e.target.value) || 0}})} />
                          </div>
                       </div>
                    </div>

                    {/* Hospitals List Card */}
                    <div className="bg-[#f0fdf4] p-6 rounded-[20px] border border-[#dcfce7]">
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="text-green-700 font-bold flex items-center gap-2">
                            <HeartPulse size={20} /> Hospitals
                          </h4>
                          <button 
                            type="button" 
                            onClick={() => setEditingDistrict({...editingDistrict, hospitals: [...editingDistrict.hospitals, {name: '', phone: ''}]})}
                            className="bg-white text-green-600 text-[10px] font-black px-3 py-1.5 rounded-lg border border-green-200 shadow-sm hover:bg-green-50"
                          >
                             + Add New
                          </button>
                       </div>
                       <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                          {editingDistrict.hospitals.map((h: any, idx: number) => (
                             <div key={idx} className="flex gap-2">
                               <input placeholder="Hosp Name" className="flex-1 p-2.5 bg-white border border-green-100 rounded-xl text-xs font-bold outline-none" value={h.name} onChange={e => {
                                 const newList = [...editingDistrict.hospitals];
                                 newList[idx].name = e.target.value;
                                 setEditingDistrict({...editingDistrict, hospitals: newList});
                               }} />
                               <input placeholder="Phone" className="w-24 p-2.5 bg-white border border-green-100 rounded-xl text-xs font-bold outline-none" value={h.phone} onChange={e => {
                                 const newList = [...editingDistrict.hospitals];
                                 newList[idx].phone = e.target.value;
                                 setEditingDistrict({...editingDistrict, hospitals: newList});
                               }} />
                               <button type="button" onClick={() => setEditingDistrict({...editingDistrict, hospitals: editingDistrict.hospitals.filter((_:any, i:number) => i !== idx)})} className="p-2 text-red-400 hover:text-red-600"><X size={16}/></button>
                             </div>
                          ))}
                          {editingDistrict.hospitals.length === 0 && (
                            <p className="text-center py-6 text-green-300 text-xs italic font-medium">No hospitals added.</p>
                          )}
                       </div>
                    </div>
                  </div>

                  <div>
                    <label className={districtLabelStyles}>Upazilas (Comma Separated)</label>
                    <textarea rows={2} className={districtInputStyles + " resize-none text-sm"} placeholder="Upazila 1, Upazila 2, ..." value={editingDistrict.upazilas_str} onChange={e => setEditingDistrict({...editingDistrict, upazilas_str: e.target.value})} />
                  </div>

                  <div>
                    <label className={districtLabelStyles}>Tourist Spots (Comma Separated)</label>
                    <textarea rows={2} className={districtInputStyles + " resize-none text-sm"} placeholder="Lalbagh Fort, Ahsan Manzil, ..." value={editingDistrict.spots_str} onChange={e => setEditingDistrict({...editingDistrict, spots_str: e.target.value})} />
                  </div>

                  {/* District Photos Upload Area */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <label className={districtLabelStyles + " mb-4 flex items-center gap-2"}>
                      <Camera size={18} className="text-gray-600" /> District Photos (High Quality Compressed)
                    </label>
                    <div className="flex flex-wrap gap-4">
                       <div 
                         onClick={() => imageInputRef.current?.click()}
                         className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-[20px] flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-brand-500 transition-all group"
                       >
                          <div className="p-2 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                            <Plus size={24} className="text-gray-400 group-hover:text-brand-600" />
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-600">Upload</span>
                       </div>
                       <input type="file" multiple ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                       
                       {editingDistrict.images.map((img: string, idx: number) => (
                         <div key={idx} className="w-40 h-40 rounded-[20px] overflow-hidden relative shadow-sm group">
                            <img src={img} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => setEditingDistrict({...editingDistrict, images: editingDistrict.images.filter((_:any, i:number) => i !== idx)})}
                              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14}/>
                            </button>
                         </div>
                       ))}
                    </div>
                    <p className="text-[10px] text-gray-400 italic mt-4">Images are automatically compressed to 60% quality & resized to save space.</p>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex gap-4 sticky bottom-0 bg-white pb-2">
                     <button 
                       type="button" 
                       onClick={() => setEditingDistrict(null)}
                       className="flex-1 py-4 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                     >
                       Cancel
                     </button>
                     <Button type="submit" className="flex-[2] bg-brand-600 hover:bg-brand-700 text-white font-black py-4 rounded-xl shadow-xl shadow-brand-500/20 text-lg flex items-center justify-center gap-3">
                        <Save size={24} /> Save District Data
                     </Button>
                  </div>
               </form>
            </div>
          </div>
        )}
    </div>
  );
};
