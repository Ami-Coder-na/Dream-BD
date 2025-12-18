
import React, { useState, useMemo } from 'react';
import { 
  Database, Search, Sprout, Stethoscope, BookOpen, 
  Navigation, Recycle, Home, Fish, Hammer, MapPin, 
  Plus, Trash2, Filter, X, Edit3, Scale, Plane, Wrench,
  AlertCircle, Users, Building2, Camera, Info, CheckCircle, Save, ChevronRight,
  // Added Image as ImageIcon to resolve TypeScript error on line 337
  Image as ImageIcon
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

  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('agri');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configForm, setConfigForm] = useState<any>({});
  const [districtSearch, setDistrictSearch] = useState('');

  // --- DISTRICT EDITING LOGIC ---
  const [editingDistrict, setEditingDistrict] = useState<any>(null);
  
  const filteredDistricts = useMemo(() => {
    return districts.filter((d: any) => 
      d.nameEn.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.nameBn.includes(districtSearch)
    );
  }, [districts, districtSearch]);

  const handleEditDistrict = (d: any) => {
    setEditingDistrict({
      ...d,
      upazilas_str: d.upazilas?.join(', ') || '',
      spots_str: d.touristSpots?.join(', ') || '',
      images_str: d.images?.join(', ') || ''
    });
  };

  const handleSaveDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...editingDistrict,
      upazilas: editingDistrict.upazilas_str.split(',').map((s: string) => s.trim()).filter(Boolean),
      touristSpots: editingDistrict.spots_str.split(',').map((s: string) => s.trim()).filter(Boolean),
      images: editingDistrict.images_str.split(',').map((s: string) => s.trim()).filter(Boolean)
    };
    delete updated.upazilas_str;
    delete updated.spots_str;
    delete updated.images_str;
    
    updateDistrict(updated);
    setEditingDistrict(null);
    alert('District updated successfully!');
  };

  const openModal = () => {
    setConfigForm({});
    setIsConfigModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        if (activeConfigTab === 'agri') {
            const todayPrice = bnToEn(configForm.today);
            if (isNaN(todayPrice) || todayPrice === 0) throw new Error("Price must be a valid number");
            const newItem = { ...configForm, id: Date.now(), today: todayPrice, yesterday: todayPrice, trend: 'stable' };
            updateMarketPrices([...marketPrices, newItem]);
            alert("Market Price Added Successfully!");
        } else if (activeConfigTab === 'legal') {
            addLawyer({ ...configForm });
            alert("Lawyer Added Successfully!");
        } else if (activeConfigTab === 'expat') {
            const rate = bnToEn(configForm.rate);
            if (isNaN(rate) || rate === 0) throw new Error("Rate must be a valid number");
            addExchangeRate({ ...configForm, rate: rate, trend: 'stable' });
            alert("Exchange Rate Added Successfully!");
        } else if (activeConfigTab === 'vocational') {
            const fee = bnToEn(configForm.fee);
            addVocationalCourse({ ...configForm, fee: fee, image: 'https://placehold.co/600x400' });
            alert("Course Added Successfully!");
        }
        
        setIsConfigModalOpen(false);
        setConfigForm({});
    } catch (err: any) {
        alert("Error saving: " + err.message);
    }
  };

  const handleDeleteItem = (id: number) => {
      if(!confirm('Delete this item?')) return;
      if (activeConfigTab === 'agri') updateMarketPrices(marketPrices.filter((p: any) => p.id !== id));
      else if (activeConfigTab === 'legal') deleteLawyer(id);
      else if (activeConfigTab === 'vocational') deleteVocationalCourse(id);
      else if (activeConfigTab === 'expat') deleteExchangeRate(id);
  };

  const renderTable = () => {
    if (activeConfigTab === 'districts') {
        return (
            <div className="space-y-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search 64 districts..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                      value={districtSearch}
                      onChange={e => setDistrictSearch(e.target.value)}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDistricts.map((d: any) => (
                        <div key={d.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                            <div>
                                <h4 className="font-bold text-gray-900">{d.nameEn} ({d.nameBn})</h4>
                                <p className="text-xs text-gray-500">{d.division} Division</p>
                            </div>
                            <Button onClick={() => handleEditDistrict(d)} size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                <Edit3 size={14}/> Edit
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    let headers: string[] = [];
    let data: any[] = [];
    let renderRow: (item: any) => React.ReactNode;

    switch (activeConfigTab) {
        case 'agri':
            headers = ['Name (EN)', 'Name (BN)', 'Price', 'Unit'];
            data = marketPrices;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.nameEn}</td>
                    <td className="p-4 text-gray-600">{item.nameBn}</td>
                    <td className="p-4 text-green-600 font-bold">৳ {item.today}</td>
                    <td className="p-4 text-gray-600">{item.unit}</td>
                </>
            );
            break;
        case 'legal':
            headers = ['Name', 'Speciality', 'Phone', 'Location'];
            data = lawyers;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600">{item.speciality}</td>
                    <td className="p-4 text-gray-600">{item.phone}</td>
                    <td className="p-4 text-gray-600">{item.location}</td>
                </>
            );
            break;
        case 'expat':
            headers = ['Currency', 'Rate (BDT)', 'Trend'];
            data = exchangeRates;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.currency}</td>
                    <td className="p-4 font-bold text-cyan-600">{item.rate}</td>
                    <td className="p-4 capitalize">{item.trend}</td>
                </>
            );
            break;
        case 'vocational':
            headers = ['Title', 'Category', 'Fee', 'Duration'];
            data = vocationalCourses;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.title}</td>
                    <td className="p-4 text-gray-600">{item.category}</td>
                    <td className="p-4 font-bold text-amber-600">৳ {item.fee}</td>
                    <td className="p-4 text-gray-600">{item.duration}</td>
                </>
            );
            break;
        default:
            return (
                <div className="p-10 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <AlertCircle size={40} className="mx-auto mb-3 opacity-50" />
                    <p>Configuration for <strong>{activeConfigTab.charAt(0).toUpperCase() + activeConfigTab.slice(1)}</strong> is currently read-only / static.</p>
                </div>
            );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                        {headers.map((h, i) => <th key={i} className="p-4 border-b border-gray-100">{h}</th>)}
                        <th className="p-4 border-b border-gray-100 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                    {data.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            {renderRow(item)}
                            <td className="p-4 text-right">
                                <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-400 hover:text-red-600 rounded-lg"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={headers.length + 1} className="p-8 text-center text-gray-400">
                                No data found for this module.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
  };

  const isEditable = ['agri', 'legal', 'expat', 'vocational'].includes(activeConfigTab);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Database className="text-brand-600" size={28} /> Module Config
            </h3>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                  activeConfigTab === tab.id 
                    ? 'bg-brand-50 text-brand-700 border-brand-200' 
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
               <h4 className="font-bold text-gray-800 text-lg capitalize">{activeConfigTab === 'districts' ? 'District Database' : activeConfigTab + ' Data'}</h4>
               {isEditable && (
                 <Button onClick={openModal} size="sm" className="bg-brand-600 text-white">Add New</Button>
               )}
            </div>
            {renderTable()}
        </div>
      </div>

      {/* --- DISTRICT EDITOR MODAL --- */}
      {editingDistrict && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <div>
                        <h3 className="font-black text-2xl text-gray-900">Edit District: {editingDistrict.nameEn}</h3>
                        <p className="text-sm text-gray-500">{editingDistrict.division} Division</p>
                    </div>
                    <button onClick={() => setEditingDistrict(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSaveDistrict} className="p-8 space-y-8 overflow-y-auto flex-1">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Users size={16}/> Population (approx)</label>
                            <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.population} onChange={e => setEditingDistrict({...editingDistrict, population: e.target.value})} placeholder="e.g. 2.5 Million" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16}/> Area</label>
                            <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.area} onChange={e => setEditingDistrict({...editingDistrict, area: e.target.value})} placeholder="e.g. 2,000 km²" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Info size={16}/> Description</label>
                        <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" value={editingDistrict.description} onChange={e => setEditingDistrict({...editingDistrict, description: e.target.value})} placeholder="Describe the district..."></textarea>
                    </div>

                    {/* Array Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Navigation size={16}/> Upazila List (Comma Separated)</label>
                            <textarea rows={2} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none text-sm" value={editingDistrict.upazilas_str} onChange={e => setEditingDistrict({...editingDistrict, upazilas_str: e.target.value})} placeholder="Upazila 1, Upazila 2..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Camera size={16}/> Tourist Spots (Comma Separated)</label>
                            <textarea rows={2} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none text-sm" value={editingDistrict.spots_str} onChange={e => setEditingDistrict({...editingDistrict, spots_str: e.target.value})} placeholder="Spot 1, Spot 2..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><ImageIcon size={16}/> Image URLs (Comma Separated)</label>
                            <textarea rows={2} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none text-sm" value={editingDistrict.images_str} onChange={e => setEditingDistrict({...editingDistrict, images_str: e.target.value})} placeholder="https://url1, https://url2..."></textarea>
                        </div>
                    </div>

                    {/* Education Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Primary</label>
                            <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.education.primary} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, primary: parseInt(e.target.value) || 0}})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">High School</label>
                            <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.education.highSchool} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, highSchool: parseInt(e.target.value) || 0}})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">College</label>
                            <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.education.college} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, college: parseInt(e.target.value) || 0}})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">University</label>
                            <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" value={editingDistrict.education.university} onChange={e => setEditingDistrict({...editingDistrict, education: {...editingDistrict.education, university: parseInt(e.target.value) || 0}})} />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 sticky bottom-0 z-10">
                    <Button type="button" variant="outline" onClick={() => setEditingDistrict(null)}>Cancel</Button>
                    <Button onClick={handleSaveDistrict} className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2 px-8">
                        <Save size={18}/> Save Changes
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* Basic Config Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">Add New Item</h3>
                    <button onClick={() => setIsConfigModalOpen(false)}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeConfigTab === 'agri' && (
                        <>
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Name (English)" onChange={e => setConfigForm({...configForm, nameEn: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Name (Bangla)" onChange={e => setConfigForm({...configForm, nameBn: e.target.value})} />
                            <input required type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Price (e.g. 50)" onChange={e => setConfigForm({...configForm, today: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Unit (e.g. kg)" onChange={e => setConfigForm({...configForm, unit: e.target.value})} />
                        </>
                    )}
                    {/* Other forms... */}

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={() => setIsConfigModalOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white">Save Item</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
