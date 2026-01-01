import React, { useState, useMemo } from 'react';
import { 
  Database, Search, Sprout, Stethoscope, BookOpen, 
  Navigation, Recycle, Home, Fish, Hammer, MapPin, 
  Plus, Trash2, Filter, X, Edit3, Scale, Plane, Wrench,
  AlertCircle, Users, Building2, Camera, Info, CheckCircle, Save, ChevronRight,
  Image as ImageIcon, HeartPulse, PlusCircle, Phone, DollarSign, Clock, Tag, Waves
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

type ConfigTab = 'agri' | 'health' | 'edu' | 'transport' | 'disaster' | 'fishery' | 'craft' | 'waste' | 'districts' | 'legal' | 'expat' | 'vocational';

// Helper to convert Bangla numbers to English for proper parsing
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
    districts, updateDistrict, deleteDistrict
  } = useData();

  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('districts');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configForm, setConfigForm] = useState<any>({});
  const [districtSearch, setDistrictSearch] = useState('');

  // --- DISTRICT EDITING LOGIC ---
  const [editingDistrict, setEditingDistrict] = useState<any>(null);
  
  const filteredDistricts = useMemo(() => {
    const searchLower = (districtSearch || '').toLowerCase();
    return districts.filter((d: any) => 
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
      images_str: Array.isArray(d.images) ? d.images.join(', ') : '',
      education: d.education || { primary: 0, highSchool: 0, college: 0, university: 0 },
      hospitals: Array.isArray(d.hospitals) ? d.hospitals : []
    });
  };

  const handleAddHospital = () => {
    const newHospitals = [...(editingDistrict.hospitals || []), { name: '', address: '', phone: '' }];
    setEditingDistrict({ ...editingDistrict, hospitals: newHospitals });
  };

  const handleRemoveHospital = (index: number) => {
    const newHospitals = editingDistrict.hospitals.filter((_: any, i: number) => i !== index);
    setEditingDistrict({ ...editingDistrict, hospitals: newHospitals });
  };

  const handleHospitalChange = (index: number, field: string, value: string) => {
    const newHospitals = [...editingDistrict.hospitals];
    newHospitals[index] = { ...newHospitals[index], [field]: value };
    setEditingDistrict({ ...editingDistrict, hospitals: newHospitals });
  };

  const handleSaveDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate an ID if it's a new district safely
    const safeNameEn = (editingDistrict.nameEn || editingDistrict.nameen || 'unnamed');
    const finalId = editingDistrict.id || safeNameEn.toLowerCase().replace(/\s+/g, '');

    const updated = {
      ...editingDistrict,
      id: finalId,
      upazilas: (editingDistrict.upazilas_str || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      touristSpots: (editingDistrict.spots_str || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      images: (editingDistrict.images_str || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      hospitals: editingDistrict.hospitals.filter((h: any) => h.name && h.name.trim() !== '')
    };
    
    delete updated.upazilas_str;
    delete updated.spots_str;
    delete updated.images_str;
    
    updateDistrict(updated);
    setEditingDistrict(null);
    alert('District data saved successfully!');
  };

  const openModal = () => {
    if (activeConfigTab === 'districts') {
        setEditingDistrict({
            id: '',
            nameEn: '',
            nameBn: '',
            division: 'Dhaka',
            population: '',
            area: '',
            description: '',
            upazilas_str: '',
            spots_str: '',
            images_str: '',
            education: { primary: 0, highSchool: 0, college: 0, university: 0 },
            hospitals: []
        });
    } else {
        setConfigForm({});
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (activeConfigTab === 'agri') {
            const todayPrice = bnToEn(configForm.today);
            const newItem = { 
              ...configForm, 
              id: Date.now(), 
              today: todayPrice, 
              yesterday: configForm.yesterday ? bnToEn(configForm.yesterday) : todayPrice, 
              trend: 'stable' 
            };
            updateMarketPrices([...marketPrices, newItem]);
        } else if (activeConfigTab === 'legal') {
            addLawyer({ ...configForm, id: Date.now() });
        } else if (activeConfigTab === 'expat') {
            addExchangeRate({ ...configForm, id: Date.now(), rate: bnToEn(configForm.rate), trend: 'stable' });
        } else if (activeConfigTab === 'vocational') {
            addVocationalCourse({ ...configForm, id: Date.now(), fee: bnToEn(configForm.fee), image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158' });
        }
        setIsConfigModalOpen(false);
        setConfigForm({});
    } catch (err: any) { alert(err.message); }
  };

  const renderTable = () => {
    if (activeConfigTab === 'districts') {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="Search 64 districts (e.g. Dhaka, Bogra)..." 
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                          value={districtSearch}
                          onChange={e => setDistrictSearch(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-bold bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
                        {filteredDistricts.length} Districts Found
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDistricts.map((d: any) => (
                        <div key={d.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group overflow-hidden relative">
                            <div className={`absolute top-0 left-0 h-1 transition-all ${d.description ? 'bg-green-500 w-full' : 'bg-red-300 w-1/4'}`}></div>
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <h4 className="font-black text-xl text-gray-900">{isBangla ? (d.nameBn || d.namebn) : (d.nameEn || d.nameen)}</h4>
                                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{d.division} Division</p>
                                  </div>
                                  <div className="bg-brand-50 text-brand-700 p-2 rounded-lg"><MapPin size={20} /></div>
                                </div>
                                <div className="space-y-2 mb-6">
                                    <p className="text-sm text-gray-600 flex justify-between"><span>Pop:</span> <span className="font-bold">{d.population}</span></p>
                                    <p className="text-sm text-gray-600 flex justify-between"><span>Area:</span> <span className="font-bold">{d.area}</span></p>
                                    <p className="text-sm text-gray-600 flex justify-between"><span>Hospitals:</span> <span className="font-bold text-red-600">{Array.isArray(d.hospitals) ? d.hospitals.length : 0}</span></p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => handleEditDistrict(d)} className="flex-1 bg-gray-900 hover:bg-brand-600 text-white flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all shadow-md group-hover:scale-[1.02]">
                                    <Edit3 size={16}/> Edit District Data
                                </Button>
                                <button 
                                    onClick={() => handleDeleteItem(d.id)} 
                                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
                                    title="Delete District"
                                >
                                    <Trash2 size={20} />
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
      vocational: vocationalCourses
    };

    const currentData = dataMap[activeConfigTab] || [];

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                        <th className="p-4 border-b border-gray-100">Item Details</th>
                        <th className="p-4 border-b border-gray-100">Metrics/Category</th>
                        <th className="p-4 border-b border-gray-100 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                    {currentData.length > 0 ? currentData.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                           <div className="font-bold text-gray-900">
                             {item.nameEn || item.titleEn || item.currency || item.name}
                           </div>
                           <div className="text-xs text-gray-500">
                             {item.nameBn || item.titleBn || item.specialty || 'Entry System ID: #' + item.id}
                           </div>
                        </td>
                        <td className="p-4">
                           <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">
                             {item.today ? `৳ ${item.today} / ${item.unit}` : 
                              item.rate ? `Rate: ৳ ${item.rate}` :
                              item.fee ? `Fee: ৳ ${item.fee}` :
                              item.location || item.category || 'N/A'}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="p-10 text-center text-gray-400" colSpan={3}>
                           No data entries for {activeConfigTab}. Click "Add New Entry" to populate.
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
              <Database size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Module Configuration</h2>
              <p className="text-gray-500 text-sm">Fine-tune data and settings for specific modules</p>
            </div>
          </div>
          <Button onClick={openModal} className="bg-gray-900 hover:bg-black text-white px-6">
            <Plus size={18} className="mr-2" /> Add New Entry
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-2 border-b border-gray-50 bg-gray-50/50">
            <div className="flex overflow-x-auto gap-1 no-scrollbar">
              {[
                { id: 'districts', label: '64 Districts', icon: <MapPin size={16}/> },
                { id: 'agri', label: 'Agriculture', icon: <Sprout size={16}/> },
                { id: 'legal', label: 'Legal Aid', icon: <Scale size={16}/> },
                { id: 'expat', label: 'Expat', icon: <Plane size={16}/> },
                { id: 'vocational', label: 'Vocational', icon: <Wrench size={16}/> },
                { id: 'health', label: 'Health', icon: <Building2 size={16}/> },
                { id: 'edu', label: 'Education', icon: <BookOpen size={16}/> },
                { id: 'transport', label: 'Transport', icon: <Navigation size={16}/> },
                { id: 'disaster', label: 'Disaster', icon: <Waves size={16}/> },
                { id: 'fishery', label: 'Fishery', icon: <Fish size={16}/> },
                { id: 'craft', label: 'Craft', icon: <Hammer size={16}/> },
                { id: 'waste', label: 'Waste', icon: <Recycle size={16}/> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveConfigTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeConfigTab === tab.id ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {renderTable()}
          </div>
        </div>

        {editingDistrict && (
            <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                           <Edit3 className="text-brand-600" size={24} /> {editingDistrict.id ? 'Edit District: ' + (isBangla ? editingDistrict.nameBn : editingDistrict.nameEn) : 'Add New District'}
                        </h3>
                        <button onClick={() => setEditingDistrict(null)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"><X size={24}/></button>
                    </div>

                    <form onSubmit={handleSaveDistrict} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name (EN)</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.nameEn} onChange={e => setEditingDistrict({...editingDistrict, nameEn: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name (BN)</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.nameBn} onChange={e => setEditingDistrict({...editingDistrict, nameBn: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Division</label><select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.division} onChange={e => setEditingDistrict({...editingDistrict, division: e.target.value})}><option>Dhaka</option><option>Chattogram</option><option>Sylhet</option><option>Khulna</option><option>Rajshahi</option><option>Barisal</option><option>Rangpur</option><option>Mymensingh</option></select></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Population (e.g. 9.1M)</label><input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.population} onChange={e => setEditingDistrict({...editingDistrict, population: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Area (e.g. 1463 km²)</label><input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.area} onChange={e => setEditingDistrict({...editingDistrict, area: e.target.value})} /></div>
                        </div>

                        <div className="mb-8"><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Short Description</label><textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" value={editingDistrict.description} onChange={e => setEditingDistrict({...editingDistrict, description: e.target.value})} /></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                <h4 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2"><BookOpen size={16}/> Education Stats</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-[10px] font-bold text-blue-400 mb-1 uppercase">Primary</label><input type="number" className="w-full p-2 rounded-lg border border-blue-200" value={editingDistrict.education.primary} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, primary: parseInt(e.target.value)}})} /></div>
                                    <div><label className="block text-[10px] font-bold text-blue-400 mb-1 uppercase">High School</label><input type="number" className="w-full p-2 rounded-lg border border-blue-200" value={editingDistrict.education.highSchool} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, highSchool: parseInt(e.target.value)}})} /></div>
                                    <div><label className="block text-[10px] font-bold text-blue-400 mb-1 uppercase">College</label><input type="number" className="w-full p-2 rounded-lg border border-blue-200" value={editingDistrict.education.college} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, college: parseInt(e.target.value)}})} /></div>
                                    <div><label className="block text-[10px] font-bold text-blue-400 mb-1 uppercase">University</label><input type="number" className="w-full p-2 rounded-lg border border-blue-200" value={editingDistrict.education.university} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, university: parseInt(e.target.value)}})} /></div>
                                </div>
                            </div>

                            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-bold text-teal-800 flex items-center gap-2"><HeartPulse size={16}/> Hospitals</h4>
                                    <button type="button" onClick={handleAddHospital} className="text-xs font-bold text-teal-600 bg-white px-2 py-1 rounded shadow-sm hover:bg-teal-50 transition-all">+ Add New</button>
                                </div>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {editingDistrict.hospitals.map((h: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-white rounded-xl border border-teal-100 relative group">
                                            <button type="button" onClick={() => handleRemoveHospital(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X size={14}/></button>
                                            <input placeholder="Hospital Name" className="w-full mb-1 text-sm font-bold outline-none border-b border-gray-100 focus:border-teal-500" value={h.name} onChange={e => handleHospitalChange(idx, 'name', e.target.value)} />
                                            <input placeholder="Phone" className="w-full text-xs outline-none" value={h.phone} onChange={e => handleHospitalChange(idx, 'phone', e.target.value)} />
                                        </div>
                                    ))}
                                    {editingDistrict.hospitals.length === 0 && <p className="text-center text-teal-300 text-xs py-10 italic">No hospitals added.</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Upazilas (Comma separated)</label><textarea rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Upazila 1, Upazila 2, ..." value={editingDistrict.upazilas_str} onChange={e => setEditingDistrict({...editingDistrict, upazilas_str: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tourist Spots (Comma separated)</label><textarea rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Lalbagh Fort, Ahsan Manzil, ..." value={editingDistrict.spots_str} onChange={e => setEditingDistrict({...editingDistrict, spots_str: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image URLs (Comma separated)</label><textarea rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="https://..., https://..." value={editingDistrict.images_str} onChange={e => setEditingDistrict({...editingDistrict, images_str: e.target.value})} /></div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4">
                            <Button type="button" variant="outline" onClick={() => setEditingDistrict(null)} className="flex-1 py-3">Cancel</Button>
                            <Button type="submit" className="flex-[2] bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 shadow-lg shadow-brand-100 flex items-center justify-center gap-2"><Save size={18}/> Save District Data</Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};