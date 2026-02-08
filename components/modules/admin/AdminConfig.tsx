
import React, { useState, useMemo, useRef } from 'react';
import { 
  Database, Search, Sprout, Stethoscope, BookOpen, 
  Navigation, Recycle, Home, Fish, Hammer, MapPin, 
  Plus, Trash2, Filter, X, Edit3, Scale, Plane, Wrench,
  AlertCircle, Users, Building2, Camera, Info, CheckCircle, Save, ChevronRight,
  Image as ImageIcon, HeartPulse, PlusCircle, Phone, DollarSign, Clock, Tag, Waves,
  Upload, Loader2, Eye, Gift, Pencil,
  Monitor, Globe
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';
import { compressImage } from '../../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

// Fix: Defined ConfigTab type to resolve "Cannot find name 'ConfigTab'" error
type ConfigTab = 'districts' | 'agri' | 'legal' | 'expat' | 'vocational' | 'health' | 'edu' | 'transport' | 'disaster' | 'fishery' | 'craft' | 'directory' | 'categories';

const bnToEn = (str: any) => {
    if(!str) return 0;
    const s = str.toString();
    const numbers = { '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4, '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9 };
    // @ts-ignore
    const enStr = s.replace(/[০-৯]/g, (match: string) => numbers[match]);
    return parseFloat(enStr) || parseFloat(s) || 0;
};

export const AdminConfig: React.FC<Props> = ({ isBangla }) => {
  const { 
    marketPrices, updateMarketPrices,
    lawyers, addLawyer, deleteLawyer, 
    exchangeRates, addExchangeRate, deleteExchangeRate,
    vocationalCourses, addVocationalCourse, deleteVocationalCourse,
    districts, updateDistrict, deleteDistrict,
    craftProducts, addCraftProduct, updateCraftProduct, deleteCraftProduct,
    serviceLinks, addServiceLink, updateServiceLink, deleteServiceLink,
    serviceCategories, addServiceCategory, updateServiceCategory, deleteServiceCategory
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<ConfigTab>('districts');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configForm, setConfigForm] = useState<any>({});
  const [districtSearch, setDistrictSearch] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const craftImageInputRef = useRef<HTMLInputElement>(null);
  const serviceLogoInputRef = useRef<HTMLInputElement>(null);

  const [editingDistrict, setEditingDistrict] = useState<any>(null);
  const [viewingDistrict, setViewingDistrict] = useState<any>(null);
  const [editingCraft, setEditingCraft] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
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
    setIsConfigModalOpen(true);
  };

  const handleEditCraft = (c: any) => {
    setEditingCraft(c);
    setConfigForm({ ...c });
    setIsConfigModalOpen(true);
  };

  const handleEditService = (s: any) => {
    setEditingService(s);
    setConfigForm({ ...s });
    setIsConfigModalOpen(true);
  };

  const handleEditCategory = (c: any) => {
    setEditingCategory(c);
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
        const compressed = await compressImage(files[i], 1200, 0.7);
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
        const compressed = await compressImage(file, 1000, 0.7);
        setConfigForm({ ...configForm, image: compressed });
      } catch (err) {
        console.error("Compression failed", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleServiceLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Removed logic as logo upload is removed
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
    setIsConfigModalOpen(false);
  };

  const openModal = () => {
    if (activeSubTab === 'districts') {
        setEditingDistrict({ id: '', nameEn: '', nameBn: '', division: 'Dhaka', population: '', area: '', description: '', upazilas_str: '', spots_str: '', images: [], education: { primary: 0, highSchool: 0, college: 0, university: 0 }, hospitals: [] });
    } else {
        setConfigForm({});
        setEditingCraft(null);
        setEditingService(null);
        setEditingCategory(null);
    }
    setIsConfigModalOpen(true);
  };

  const handleDeleteItem = (id: any) => {
      if(!confirm('Delete this item permanently?')) return;
      if (activeSubTab === 'agri') updateMarketPrices(marketPrices.filter((p: any) => p.id !== id));
      else if (activeSubTab === 'legal') deleteLawyer(id);
      else if (activeSubTab === 'vocational') deleteVocationalCourse(id);
      else if (activeSubTab === 'expat') deleteExchangeRate(id);
      else if (activeSubTab === 'districts') deleteDistrict(id);
      else if (activeSubTab === 'craft') deleteCraftProduct(id);
      else if (activeSubTab === 'directory') deleteServiceLink(id);
      else if (activeSubTab === 'categories') deleteServiceCategory(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubTab === 'districts') {
      handleSaveDistrict(e);
      return;
    }
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
        } else if (activeSubTab === 'directory') {
            if (editingService) {
              updateServiceLink({ ...configForm });
            } else {
              addServiceLink({ ...configForm, id: Date.now(), views: 0 });
            }
        } else if (activeSubTab === 'categories') {
            const catId = configForm.id || configForm.titleEn; // Use titleEn as ID if new, or existing ID
            const newCat = { ...configForm, id: catId };
            if (editingCategory) {
              updateServiceCategory(newCat);
            } else {
              addServiceCategory(newCat);
            }
        }
        setIsConfigModalOpen(false);
        setConfigForm({});
        setEditingCraft(null);
        setEditingService(null);
        setEditingCategory(null);
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
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-bold text-black" 
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

    if (activeSubTab === 'directory') {
      return (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceLinks.map((service: any) => (
                <div key={service.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-200 transition-all">
                   <div className="flex items-center gap-3">
                      <div>
                         <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{service.titleEn}</h4>
                         <p className="text-xs text-gray-500">{service.category}</p>
                      </div>
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditService(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                      <button onClick={() => handleDeleteItem(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      );
    }

    if (activeSubTab === 'categories') {
        return (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {serviceCategories.map((cat: any) => (
                   <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-brand-200">
                      <div>
                         <h4 className="font-bold text-gray-900">{cat.titleEn}</h4>
                         <p className="text-xs text-gray-500">{cat.titleBn}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEditCategory(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                         <button onClick={() => handleDeleteItem(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );
    }
    
    // Generic table for other subtabs
    return (
      <div className="text-center py-20 text-gray-400 font-medium border-2 border-dashed rounded-2xl border-gray-100">
        <p>Database table view for {activeSubTab} coming soon...</p>
      </div>
    );
  };

  const TABS = [
    { id: 'districts', label: '64 Districts', icon: <MapPin size={16}/> },
    { id: 'directory', label: 'Service Directory', icon: <Globe size={16}/> },
    { id: 'categories', label: 'Categories', icon: <Tag size={16}/> },
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

  const districtInputStyles = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-bold text-black";
  const districtLabelStyles = "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  const addHospital = () => {
    setEditingDistrict({
      ...editingDistrict,
      hospitals: [...(editingDistrict.hospitals || []), { name: '', phone: '' }]
    });
  };

  const removeHospital = (idx: number) => {
    setEditingDistrict({
      ...editingDistrict,
      hospitals: editingDistrict.hospitals.filter((_: any, i: number) => i !== idx)
    });
  };

  const updateHospital = (idx: number, field: string, val: string) => {
    const newList = [...editingDistrict.hospitals];
    newList[idx] = { ...newList[idx], [field]: val };
    setEditingDistrict({ ...editingDistrict, hospitals: newList });
  };

  const updateEdu = (field: string, val: string) => {
    setEditingDistrict({
      ...editingDistrict,
      education: { ...editingDistrict.education, [field]: Number(val) || 0 }
    });
  };

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-xl text-gray-900">{editingDistrict || editingCraft || editingService || editingCategory ? 'Edit Entry' : 'Add New Entry'}</h3>
                  <button onClick={() => { setIsConfigModalOpen(false); setEditingDistrict(null); setEditingCraft(null); setEditingService(null); setEditingCategory(null); }}><X size={24}/></button>
               </div>
               <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto max-h-[75vh] custom-scrollbar">
                  {activeSubTab === 'districts' && editingDistrict && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={districtLabelStyles}>Name (English)</label>
                          <input required className={districtInputStyles} value={editingDistrict.nameEn} onChange={e => setEditingDistrict({...editingDistrict, nameEn: e.target.value})} />
                        </div>
                        <div>
                          <label className={districtLabelStyles}>Name (Bangla)</label>
                          <input required className={districtInputStyles} value={editingDistrict.nameBn} onChange={e => setEditingDistrict({...editingDistrict, nameBn: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className={districtLabelStyles}>Division</label>
                          <select className={districtInputStyles} value={editingDistrict.division} onChange={e => setEditingDistrict({...editingDistrict, division: e.target.value})}>
                            <option>Dhaka</option><option>Chattogram</option><option>Sylhet</option><option>Khulna</option><option>Rajshahi</option><option>Barisal</option><option>Rangpur</option><option>Mymensingh</option>
                          </select>
                        </div>
                        <div>
                          <label className={districtLabelStyles}>Population</label>
                          <input className={districtInputStyles} value={editingDistrict.population} onChange={e => setEditingDistrict({...editingDistrict, population: e.target.value})} />
                        </div>
                        <div>
                          <label className={districtLabelStyles}>Area (km²)</label>
                          <input className={districtInputStyles} value={editingDistrict.area} onChange={e => setEditingDistrict({...editingDistrict, area: e.target.value})} placeholder="e.g. 1463" />
                        </div>
                      </div>

                      {/* Education Stats */}
                      <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2"><BookOpen size={14}/> Education Statistics</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Primary</label>
                              <input type="number" className={districtInputStyles} value={editingDistrict.education.primary} onChange={e => updateEdu('primary', e.target.value)} />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">High School</label>
                              <input type="number" className={districtInputStyles} value={editingDistrict.education.highSchool} onChange={e => updateEdu('highSchool', e.target.value)} />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">College</label>
                              <input type="number" className={districtInputStyles} value={editingDistrict.education.college} onChange={e => updateEdu('college', e.target.value)} />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">University</label>
                              <input type="number" className={districtInputStyles} value={editingDistrict.education.university} onChange={e => updateEdu('university', e.target.value)} />
                           </div>
                        </div>
                      </div>

                      {/* Hospital List */}
                      <div className="p-5 bg-red-50/30 rounded-2xl border border-red-100">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="text-xs font-black text-red-800 uppercase tracking-widest flex items-center gap-2"><HeartPulse size={14}/> Hospital List</h4>
                           <button type="button" onClick={addHospital} className="text-[10px] font-bold bg-white text-red-600 px-3 py-1 rounded-full shadow-sm border border-red-100 hover:bg-red-50 transition-all flex items-center gap-1">
                              <Plus size={12}/> Add Hospital
                           </button>
                        </div>
                        <div className="space-y-3">
                           {(editingDistrict.hospitals || []).map((h: any, i: number) => (
                             <div key={i} className="flex gap-3 items-end">
                                <div className="flex-1">
                                  <input placeholder="Hospital Name" className={districtInputStyles} value={h.name} onChange={e => updateHospital(i, 'name', e.target.value)} />
                                </div>
                                <div className="flex-1">
                                  <input placeholder="Phone" className={districtInputStyles} value={h.phone} onChange={e => updateHospital(i, 'phone', e.target.value)} />
                                </div>
                                <button type="button" onClick={() => removeHospital(i)} className="p-3 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={20}/></button>
                             </div>
                           ))}
                           {(editingDistrict.hospitals || []).length === 0 && <p className="text-center py-4 text-xs text-gray-400 italic">No hospitals added yet.</p>}
                        </div>
                      </div>

                      <div>
                        <label className={districtLabelStyles}>Brief Description</label>
                        <textarea rows={3} className={districtInputStyles} value={editingDistrict.description} onChange={e => setEditingDistrict({...editingDistrict, description: e.target.value})} />
                      </div>
                      <div>
                        <label className={districtLabelStyles}>Upazilas (Comma Separated)</label>
                        <textarea rows={2} className={districtInputStyles} value={editingDistrict.upazilas_str} onChange={e => setEditingDistrict({...editingDistrict, upazilas_str: e.target.value})} placeholder="Upazila 1, Upazila 2..." />
                      </div>
                      <div>
                        <label className={districtLabelStyles}>Tourist Spots (Comma Separated)</label>
                        <textarea rows={2} className={districtInputStyles} value={editingDistrict.spots_str} onChange={e => setEditingDistrict({...editingDistrict, spots_str: e.target.value})} placeholder="Spot 1, Spot 2..." />
                      </div>
                      
                      <div>
                        <label className={districtLabelStyles}>Images ({editingDistrict.images?.length || 0})</label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                           {(editingDistrict.images || []).map((img: string, i: number) => (
                             <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50 group">
                                <img src={img} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setEditingDistrict({...editingDistrict, images: editingDistrict.images.filter((_:any, idx:number) => idx !== i)})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                             </div>
                           ))}
                           <button type="button" onClick={() => imageInputRef.current?.click()} className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-all">
                              {isCompressing ? <Loader2 className="animate-spin" size={20}/> : <Plus size={24}/>}
                           </button>
                        </div>
                        <input type="file" ref={imageInputRef} className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                      </div>
                    </div>
                  )}

                  {activeSubTab === 'craft' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (EN)</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.nameEn || ''} onChange={e => setConfigForm({...configForm, nameEn: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (BN)</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.nameBn || ''} onChange={e => setConfigForm({...configForm, nameBn: e.target.value})} /></div>
                      </div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label><select className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.category || 'Textile'} onChange={e => setConfigForm({...configForm, category: e.target.value})}><option>Textile</option><option>Bamboo</option><option>Pottery</option><option>Jute</option><option>Wood</option><option>Metal</option></select></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Artisan Info</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.artisan || ''} onChange={e => setConfigForm({...configForm, artisan: e.target.value})} placeholder="Name, District" /></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (BN)</label><textarea rows={3} required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.descriptionBn || ''} onChange={e => setConfigForm({...configForm, descriptionBn: e.target.value})} /></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Image</label>
                        <div className="flex gap-2">
                           <input className="flex-1 p-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-black" value={configForm.image || ''} onChange={e => setConfigForm({...configForm, image: e.target.value})} placeholder="URL or Upload" />
                           <button type="button" onClick={() => craftImageInputRef.current?.click()} className="px-3 bg-white border rounded-xl text-gray-500 hover:bg-gray-50">{isCompressing ? <Loader2 className="animate-spin" size={16}/> : <Upload size={18}/>}</button>
                        </div>
                        <input type="file" ref={craftImageInputRef} className="hidden" accept="image/*" onChange={handleCraftImageUpload} />
                      </div>
                    </>
                  )}

                  {activeSubTab === 'directory' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (EN)</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.titleEn || ''} onChange={e => setConfigForm({...configForm, titleEn: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (BN)</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.titleBn || ''} onChange={e => setConfigForm({...configForm, titleBn: e.target.value})} /></div>
                      </div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Link URL</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.link || ''} onChange={e => setConfigForm({...configForm, link: e.target.value})} placeholder="https://..." /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                          <select 
                             required 
                             className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black cursor-pointer appearance-none" 
                             value={configForm.category || ''} 
                             onChange={e => setConfigForm({...configForm, category: e.target.value})}
                          >
                             <option value="" disabled>Select Category</option>
                             {serviceCategories.map((cat: any) => (
                               <option key={cat.id} value={cat.id}>{cat.titleEn}</option>
                             ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Badge</label>
                          <select className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black appearance-none cursor-pointer" value={configForm.badge || ''} onChange={e => setConfigForm({...configForm, badge: e.target.value})}>
                            <option value="">None</option>
                            <option value="FREE">FREE</option>
                            <option value="PREMIUM">PREMIUM</option>
                            <option value="NEW">NEW</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {activeSubTab === 'categories' && (
                    <>
                       <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name (EN)</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.titleEn || ''} onChange={e => setConfigForm({...configForm, titleEn: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name (BN)</label><input required className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-black" value={configForm.titleBn || ''} onChange={e => setConfigForm({...configForm, titleBn: e.target.value})} /></div>
                      </div>
                    </>
                  )}

                  <Button type="submit" disabled={isCompressing} className="w-full bg-[#0f172a] text-white font-bold py-3 mt-4">{isCompressing ? 'Processing...' : 'Save Entry'}</Button>
               </form>
            </div>
          </div>
        )}
        
        {viewingDistrict && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setViewingDistrict(null)}>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{isBangla ? (viewingDistrict.nameBn || viewingDistrict.namebn) : (viewingDistrict.nameEn || viewingDistrict.nameen)}</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{viewingDistrict.division} DIVISION</p>
                </div>
                <button onClick={() => setViewingDistrict(null)} className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"><X size={24}/></button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                 {/* Images Carousel or Single Image */}
                 {Array.isArray(viewingDistrict.images) && viewingDistrict.images.length > 0 && (
                   <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                     {viewingDistrict.images.map((img: string, i: number) => (
                       <img key={i} src={img} className="w-32 h-20 object-cover rounded-lg border border-gray-200" alt={`District ${i}`} />
                     ))}
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                       <p className="text-[10px] font-black text-gray-400 uppercase">Population</p>
                       <p className="text-lg font-bold text-gray-900">{viewingDistrict.population || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                       <p className="text-[10px] font-black text-gray-400 uppercase">Area</p>
                       <p className="text-lg font-bold text-gray-900">{viewingDistrict.area || 'N/A'} km²</p>
                    </div>
                 </div>

                 {viewingDistrict.description && (
                   <div>
                     <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Description</h4>
                     <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                       {viewingDistrict.description}
                     </p>
                   </div>
                 )}

                 <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2"><MapPin size={14}/> Tourist Spots</h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(viewingDistrict.touristspots) ? viewingDistrict.touristspots : (viewingDistrict.touristSpots || [])).map((spot: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">{spot}</span>
                      ))}
                      {(!viewingDistrict.touristspots?.length && !viewingDistrict.touristSpots?.length) && <p className="text-xs text-gray-400 italic">No spots listed</p>}
                    </div>
                 </div>

                 {viewingDistrict.education && (
                   <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2"><BookOpen size={14}/> Education</h4>
                      <div className="grid grid-cols-4 gap-2 text-center">
                         <div className="bg-blue-50 p-2 rounded-lg"><p className="text-[9px] font-bold text-blue-400">PRI</p><p className="font-bold">{viewingDistrict.education.primary || 0}</p></div>
                         <div className="bg-blue-50 p-2 rounded-lg"><p className="text-[9px] font-bold text-blue-400">SEC</p><p className="font-bold">{viewingDistrict.education.highSchool || 0}</p></div>
                         <div className="bg-blue-50 p-2 rounded-lg"><p className="text-[9px] font-bold text-blue-400">COL</p><p className="font-bold">{viewingDistrict.education.college || 0}</p></div>
                         <div className="bg-blue-50 p-2 rounded-lg"><p className="text-[9px] font-bold text-blue-400">UNI</p><p className="font-bold">{viewingDistrict.education.university || 0}</p></div>
                      </div>
                   </div>
                 )}

                 <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2"><HeartPulse size={14}/> Hospitals</h4>
                    <div className="space-y-2">
                      {(viewingDistrict.hospitals || []).map((h: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                           <span className="text-sm font-bold text-gray-800">{h.name}</span>
                           <span className="text-xs font-medium text-red-600">{h.phone}</span>
                        </div>
                      ))}
                      {(!viewingDistrict.hospitals || viewingDistrict.hospitals.length === 0) && <p className="text-xs text-gray-400 italic">No hospitals listed</p>}
                    </div>
                 </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50 text-right">
                 <Button onClick={() => setViewingDistrict(null)} className="bg-gray-900 text-white">Close</Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
