
import React, { useState, useMemo } from 'react';
import { 
  Database, Search, Sprout, Stethoscope, BookOpen, 
  Navigation, Recycle, Home, Fish, Hammer, MapPin, 
  Plus, Trash2, Filter, X, Edit3, Scale, Plane, Wrench,
  AlertCircle, Users, Building2, Camera, Info, CheckCircle, Save, ChevronRight,
  Image as ImageIcon, HeartPulse, PlusCircle, Phone
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
    districts, updateDistrict
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
      (d.nameEn || '').toLowerCase().includes(searchLower) ||
      (d.nameBn || '').includes(districtSearch)
    );
  }, [districts, districtSearch]);

  const handleEditDistrict = (d: any) => {
    setEditingDistrict({
      ...d,
      upazilas_str: Array.isArray(d.upazilas) ? d.upazilas.join(', ') : '',
      spots_str: Array.isArray(d.touristSpots) ? d.touristSpots.join(', ') : '',
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
    const safeNameEn = (editingDistrict.nameEn || 'unnamed');
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

  const handleDeleteItem = (id: number) => {
      if(!confirm('Delete this item?')) return;
      if (activeConfigTab === 'agri') updateMarketPrices(marketPrices.filter((p: any) => p.id !== id));
      else if (activeConfigTab === 'legal') deleteLawyer(id);
      else if (activeConfigTab === 'vocational') deleteVocationalCourse(id);
      else if (activeConfigTab === 'expat') deleteExchangeRate(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (activeConfigTab === 'agri') {
            const todayPrice = bnToEn(configForm.today);
            const newItem = { ...configForm, id: Date.now(), today: todayPrice, yesterday: todayPrice, trend: 'stable' };
            updateMarketPrices([...marketPrices, newItem]);
            alert("Market Price Added!");
        } else if (activeConfigTab === 'legal') {
            addLawyer({ ...configForm });
        } else if (activeConfigTab === 'expat') {
            addExchangeRate({ ...configForm, rate: bnToEn(configForm.rate), trend: 'stable' });
        } else if (activeConfigTab === 'vocational') {
            addVocationalCourse({ ...configForm, fee: bnToEn(configForm.fee), image: 'https://placehold.co/600x400' });
        }
        setIsConfigModalOpen(false);
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
                                      <h4 className="font-black text-xl text-gray-900">{isBangla ? d.nameBn : d.nameEn}</h4>
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
                            <Button onClick={() => handleEditDistrict(d)} className="w-full bg-gray-900 hover:bg-brand-600 text-white flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all shadow-md group-hover:scale-[1.02]">
                                <Edit3 size={16}/> Edit District Data
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                        <th className="p-4 border-b border-gray-100">Entry Details</th>
                        <th className="p-4 border-b border-gray-100 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-10 text-center text-gray-400" colSpan={2}>
                           Click "Add New Entry" to populate this module.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
  };

  const isEditable = ['districts', 'agri', 'legal', 'expat', 'vocational'].includes(activeConfigTab);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Database className="text-brand-600" size={28} /> Module Configuration
            </h3>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar border-b border-gray-50">
            {[
              { id: 'districts', label: '64 Districts', icon: <MapPin size={16}/> },
              { id: 'agri', label: 'Agriculture', icon: <Sprout size={16}/> },
              { id: 'legal', label: 'Legal Aid', icon: <Scale size={16}/> },
              { id: 'expat', label: 'Expat', icon: <Plane size={16}/> },
              { id: 'vocational', label: 'Vocational', icon: <Wrench size={16}/> },
              { id: 'health', label: 'Health', icon: <Stethoscope size={16}/> },
              { id: 'edu', label: 'Education', icon: <BookOpen size={16}/> },
              { id: 'transport', label: 'Transport', icon: <Navigation size={16}/> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveConfigTab(tab.id as ConfigTab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                  activeConfigTab === tab.id 
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-105' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
            <div className="flex justify-between items-center p-4 mb-4 bg-gray-50 rounded-xl border border-gray-100">
               <h4 className="font-bold text-gray-800 text-lg capitalize">{activeConfigTab === 'districts' ? 'District Database' : activeConfigTab + ' Central Data'}</h4>
               {isEditable && (
                 <Button onClick={openModal} size="sm" className="bg-brand-600 text-white px-6">Add New Entry</Button>
               )}
            </div>
            {renderTable()}
        </div>
      </div>

      {editingDistrict && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl my-8 relative flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10 rounded-t-[2.5rem]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-200">
                          <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-3xl text-gray-900">{editingDistrict.id ? 'Configure ' + editingDistrict.nameEn : 'Add New District'}</h3>
                            <p className="text-sm font-bold text-brand-600 uppercase tracking-widest">{editingDistrict.division} Division</p>
                        </div>
                    </div>
                    <button onClick={() => setEditingDistrict(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSaveDistrict} className="p-8 space-y-10 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-900 border-l-4 border-brand-500 pl-3">Basic Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">District Name (English)</label>
                                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all font-medium" value={editingDistrict.nameEn} onChange={e => setEditingDistrict({...editingDistrict, nameEn: e.target.value})} placeholder="e.g. Dhaka" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">District Name (Bangla)</label>
                                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all font-medium" value={editingDistrict.nameBn} onChange={e => setEditingDistrict({...editingDistrict, nameBn: e.target.value})} placeholder="যেমন: ঢাকা" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2"><Building2 size={16}/> Division</label>
                                <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all font-medium" value={editingDistrict.division} onChange={e => setEditingDistrict({...editingDistrict, division: e.target.value})}>
                                    <option>Dhaka</option><option>Chattogram</option><option>Rajshahi</option><option>Khulna</option><option>Sylhet</option><option>Barisal</option><option>Rangpur</option><option>Mymensingh</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2"><Users size={16}/> Total Population</label>
                                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all font-medium" value={editingDistrict.population} onChange={e => setEditingDistrict({...editingDistrict, population: e.target.value})} placeholder="e.g. 2.5 Million" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2"><MapPin size={16}/> Total Area</label>
                                <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all font-medium" value={editingDistrict.area} onChange={e => setEditingDistrict({...editingDistrict, area: e.target.value})} placeholder="e.g. 2,000 km²" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2"><Info size={16}/> About District (Brief History/Intro)</label>
                            <textarea rows={4} className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none resize-none transition-all leading-relaxed" value={editingDistrict.description} onChange={e => setEditingDistrict({...editingDistrict, description: e.target.value})} placeholder="Write a short description about this district's history, economy, and culture..."></textarea>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-l-4 border-red-500 pl-3">
                            <h4 className="text-lg font-bold text-gray-900">Hospital & Emergency Services</h4>
                            <Button type="button" onClick={handleAddHospital} size="sm" className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center gap-2 font-bold px-4">
                                <PlusCircle size={16} /> Add Hospital
                            </Button>
                        </div>
                        
                        <div className="space-y-4">
                            {editingDistrict.hospitals.map((hospital: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-200 relative animate-fade-in">
                                    <button 
                                      type="button" 
                                      onClick={() => handleRemoveHospital(index)}
                                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Hospital Name</label>
                                            <div className="relative">
                                                <HeartPulse className="absolute left-3 top-3 text-red-400" size={16} />
                                                <input required className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none text-sm font-medium" value={hospital.name} onChange={e => handleHospitalChange(index, 'name', e.target.value)} placeholder="e.g. City General Hospital" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                                <input required className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none text-sm font-medium" value={hospital.address} onChange={e => handleHospitalChange(index, 'address', e.target.value)} placeholder="Full address..." />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Contact/Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                                                <input required className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none text-sm font-medium" value={hospital.phone} onChange={e => handleHospitalChange(index, 'phone', e.target.value)} placeholder="017..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-900 border-l-4 border-indigo-500 pl-3">Administration & Tourism</h4>
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2"><Navigation size={16}/> Upazilas (Separate by Commas)</label>
                                <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none transition-all text-sm font-medium" value={editingDistrict.upazilas_str} onChange={e => setEditingDistrict({...editingDistrict, upazilas_str: e.target.value})} placeholder="e.g. Savar, Dhamrai, Dohar..."></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2"><Camera size={16}/> Famous Tourist Spots (Separate by Commas)</label>
                                <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none resize-none transition-all text-sm font-medium" value={editingDistrict.spots_str} onChange={e => setEditingDistrict({...editingDistrict, spots_str: e.target.value})} placeholder="e.g. National Parliament, Lalbagh Fort..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-900 border-l-4 border-blue-500 pl-3">Education Statistics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Primary Schools</label>
                                <input type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-black text-blue-600 text-center text-xl" value={editingDistrict.education.primary} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, primary: parseInt(e.target.value) || 0}})} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">High Schools</label>
                                <input type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-black text-blue-600 text-center text-xl" value={editingDistrict.education.highSchool} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, highSchool: parseInt(e.target.value) || 0}})} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Colleges</label>
                                <input type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-black text-blue-600 text-center text-xl" value={editingDistrict.education.college} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, college: parseInt(e.target.value) || 0}})} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Universities</label>
                                <input type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-black text-blue-600 text-center text-xl" value={editingDistrict.education.university} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, university: parseInt(e.target.value) || 0}})} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-gray-900 border-l-4 border-pink-500 pl-3">Media Gallery</h4>
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2"><ImageIcon size={16}/> Image URLs (Separate by Commas)</label>
                            <textarea rows={2} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 outline-none resize-none transition-all text-xs font-mono text-gray-500" value={editingDistrict.images_str} onChange={e => setEditingDistrict({...editingDistrict, images_str: e.target.value})} placeholder="https://images.unsplash.com/..."></textarea>
                        </div>
                    </div>
                </form>

                <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50 sticky bottom-0 z-10 rounded-b-[2.5rem]">
                    <Button type="button" variant="outline" onClick={() => setEditingDistrict(null)} className="px-10 rounded-2xl bg-white hover:bg-gray-100 border-gray-300 h-14 font-bold text-gray-700">Cancel</Button>
                    <Button onClick={handleSaveDistrict} className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-3 px-14 rounded-2xl font-black text-lg shadow-xl shadow-brand-200 h-14 transition-all hover:scale-105 active:scale-95">
                        <Save size={22}/> {editingDistrict.id ? 'Save Updates' : 'Add District'}
                    </Button>
                </div>
            </div>
        </div>
      )}

      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-2xl text-gray-900">Add New Entry</h3>
                    <button onClick={() => setIsConfigModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Button type="submit" className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl">Save Item</Button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
