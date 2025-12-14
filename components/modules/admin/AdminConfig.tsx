
import React, { useState } from 'react';
import { 
  Database, Search, Sprout, Stethoscope, BookOpen, 
  Navigation, Recycle, Home, Fish, Hammer, MapPin, 
  Plus, Trash2, Filter, X, Edit3
} from 'lucide-react';
import { Button } from '../../ui/Button';

interface Props {
  isBangla: boolean;
}

type ConfigTab = 'agri' | 'health' | 'edu' | 'transport' | 'disaster' | 'fishery' | 'craft' | 'waste' | 'jela';

// --- MOCK DATA (CLEARED) ---
const ADMIN_CROPS: any[] = [];
const ADMIN_HOSPITALS: any[] = [];
const ADMIN_ROUTES: any[] = [];
const ADMIN_WASTE_ZONES: any[] = [];
const ADMIN_BOOKS: any[] = [];
const ADMIN_SHELTERS: any[] = [];
const ADMIN_FISHES: any[] = [];
const ADMIN_CRAFTS: any[] = [];
const ADMIN_DISTRICTS: any[] = [];

export const AdminConfig: React.FC<Props> = ({ isBangla }) => {
  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('agri');
  
  const [configSearch, setConfigSearch] = useState('');
  const [configStatusFilter, setConfigStatusFilter] = useState('All'); 
  
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configForm, setConfigForm] = useState<any>({});

  const [adminCrops, setAdminCrops] = useState(ADMIN_CROPS);
  const [adminHospitals, setAdminHospitals] = useState(ADMIN_HOSPITALS);
  const [adminRoutes, setAdminRoutes] = useState(ADMIN_ROUTES);
  const [adminWasteZones, setAdminWasteZones] = useState(ADMIN_WASTE_ZONES);
  const [adminBooks, setAdminBooks] = useState(ADMIN_BOOKS);
  const [adminShelters, setAdminShelters] = useState(ADMIN_SHELTERS);
  const [adminFishes, setAdminFishes] = useState(ADMIN_FISHES);
  const [adminCrafts, setAdminCrafts] = useState(ADMIN_CRAFTS);
  const [adminDistricts, setAdminDistricts] = useState(ADMIN_DISTRICTS);

  // --- ACTIONS ---

  const handleDelete = (id: number) => {
    if(!confirm('Are you sure you want to delete this item?')) return;
    
    if(activeConfigTab === 'agri') setAdminCrops(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'health') setAdminHospitals(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'transport') setAdminRoutes(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'waste') setAdminWasteZones(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'edu') setAdminBooks(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'disaster') setAdminShelters(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'fishery') setAdminFishes(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'craft') setAdminCrafts(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'jela') setAdminDistricts(prev => prev.filter(i => i.id !== id));
  };

  const openModal = () => {
    setConfigForm({});
    setIsConfigModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (configForm.id) {
        // Edit Mode: Update existing item
        const updateState = (prev: any[]) => prev.map(item => item.id === configForm.id ? { ...item, ...configForm } : item);
        
        if(activeConfigTab === 'agri') setAdminCrops(updateState);
        else if(activeConfigTab === 'health') setAdminHospitals(updateState);
        else if(activeConfigTab === 'transport') setAdminRoutes(updateState);
        else if(activeConfigTab === 'waste') setAdminWasteZones(updateState);
        else if(activeConfigTab === 'edu') setAdminBooks(updateState);
        else if(activeConfigTab === 'disaster') setAdminShelters(updateState);
        else if(activeConfigTab === 'fishery') setAdminFishes(updateState);
        else if(activeConfigTab === 'craft') setAdminCrafts(updateState);
        else if(activeConfigTab === 'jela') setAdminDistricts(updateState);
    } else {
        // Add Mode: Create new item
        const newItem = { id: Date.now(), status: 'Active', ...configForm };
        
        if(activeConfigTab === 'agri') setAdminCrops([newItem, ...adminCrops]);
        else if(activeConfigTab === 'health') setAdminHospitals([newItem, ...adminHospitals]);
        else if(activeConfigTab === 'transport') setAdminRoutes([newItem, ...adminRoutes]);
        else if(activeConfigTab === 'waste') setAdminWasteZones([newItem, ...adminWasteZones]);
        else if(activeConfigTab === 'edu') setAdminBooks([newItem, ...adminBooks]);
        else if(activeConfigTab === 'disaster') setAdminShelters([newItem, ...adminShelters]);
        else if(activeConfigTab === 'fishery') setAdminFishes([newItem, ...adminFishes]);
        else if(activeConfigTab === 'craft') setAdminCrafts([newItem, ...adminCrafts]);
        else if(activeConfigTab === 'jela') setAdminDistricts([newItem, ...adminDistricts]);
    }

    setIsConfigModalOpen(false);
    setConfigForm({}); // Clear form on close
  };

  const getItemLabel = () => {
    switch(activeConfigTab) {
        case 'agri': return 'Crop';
        case 'health': return 'Hospital';
        case 'edu': return 'Book';
        case 'transport': return 'Route';
        case 'disaster': return 'Shelter';
        case 'fishery': return 'Fish';
        case 'craft': return 'Craft';
        case 'waste': return 'Zone';
        case 'jela': return 'District';
        default: return 'Item';
    }
  };

  // --- RENDERING HELPERS ---

  const renderStatusBadge = (status: string) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
      status === 'Active' 
        ? 'bg-green-50 text-green-700 border-green-200' 
        : 'bg-gray-100 text-gray-600 border-gray-200'
    }`}>
      {status}
    </span>
  );

  const filterData = (data: any[]) => {
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(configSearch.toLowerCase())
      );
      const matchesStatus = configStatusFilter === 'All' || item.status === configStatusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  // --- TABLE RENDERERS (Standard Soft UI) ---

  const renderTable = () => {
    let headers: string[] = [];
    let data: any[] = [];
    let renderRow: (item: any) => React.ReactNode;

    switch (activeConfigTab) {
        case 'agri':
            headers = ['Name', 'Season', 'Water Req', 'Status'];
            data = adminCrops;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.season}</td>
                    <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">{item.water}</span>
                    </td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'health':
            headers = ['Hospital Name', 'District', 'Type', 'Status'];
            data = adminHospitals;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.district}</td>
                    <td className="p-4">
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-100">{item.type}</span>
                    </td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'transport':
            headers = ['Route Name', 'Mode', 'Fare (Tk)', 'Status'];
            data = adminRoutes;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.route}</td>
                    <td className="p-4 text-gray-600 capitalize font-medium">{item.mode}</td>
                    <td className="p-4 font-bold text-gray-800">{item.fare}</td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'waste':
            headers = ['Zone Area', 'Assigned Vehicle', 'Timing', 'Status'];
            data = adminWasteZones;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.zone}</td>
                    <td className="p-4">
                        <span className="text-gray-700 text-xs bg-gray-100 px-2 py-1 rounded font-bold border border-gray-200">{item.truck}</span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{item.timing}</td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'edu':
            headers = ['Book Title', 'Class/Level', 'Subject', 'Status'];
            data = adminBooks;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.title}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.level}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.subject}</td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'disaster':
            headers = ['Shelter Name', 'District', 'Capacity', 'Status'];
            data = adminShelters;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.district}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.capacity}</td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'fishery':
            headers = ['Fish Name', 'Water Type', 'Feed Type', 'Status'];
            data = adminFishes;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.type}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.feed}</td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'craft':
            headers = ['Product Name', 'Category', 'Artisan', 'Status'];
            data = adminCrafts;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.category}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.artisan}</td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'jela':
            headers = ['District', 'Division', 'Famous Spots', 'Status'];
            data = adminDistricts;
            renderRow = (item) => (
                <>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.division}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.spots}</td>
                    <td className="p-4">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
    }

    const filtered = filterData(data);

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
                    {filtered.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                            {renderRow(item)}
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => { setConfigForm(item); setIsConfigModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr><td colSpan={headers.length + 1} className="p-10 text-center text-gray-400 font-medium">No items found. Add new items to start.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Header & Controls */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Database className="text-brand-600" size={28} />
                {isBangla ? 'মডিউল কনফিগারেশন' : 'Module Configuration'}
              </h3>
              <p className="text-gray-500 text-sm mt-1 font-medium">Manage database records for various modules</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="relative">
                 <select 
                   value={configStatusFilter} 
                   onChange={(e) => setConfigStatusFilter(e.target.value)}
                   className="h-full pl-3 pr-9 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer"
                 >
                   <option value="All">All Status</option>
                   <option value="Active">Active</option>
                   <option value="Inactive">Inactive</option>
                 </select>
                 <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
              </div>
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search database..." 
                  value={configSearch} 
                  onChange={(e) => setConfigSearch(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { id: 'agri', label: 'Agriculture', icon: <Sprout size={16}/>, color: 'text-green-700 bg-green-50 border-green-200' },
              { id: 'health', label: 'Health', icon: <Stethoscope size={16}/>, color: 'text-teal-700 bg-teal-50 border-teal-200' },
              { id: 'edu', label: 'Education', icon: <BookOpen size={16}/>, color: 'text-blue-700 bg-blue-50 border-blue-200' },
              { id: 'transport', label: 'Transport', icon: <Navigation size={16}/>, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
              { id: 'disaster', label: 'Disaster', icon: <Home size={16}/>, color: 'text-red-700 bg-red-50 border-red-200' },
              { id: 'fishery', label: 'Fishery', icon: <Fish size={16}/>, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
              { id: 'craft', label: 'Craft', icon: <Hammer size={16}/>, color: 'text-orange-700 bg-orange-50 border-orange-200' },
              { id: 'waste', label: 'Waste', icon: <Recycle size={16}/>, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              { id: 'jela', label: 'Amar Jela', icon: <MapPin size={16}/>, color: 'text-purple-700 bg-purple-50 border-purple-200' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveConfigTab(tab.id as ConfigTab); setConfigSearch(''); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                  activeConfigTab === tab.id 
                    ? `${tab.color} shadow-sm` 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="min-h-[400px]">
            <div className="flex justify-between items-center p-4 mb-4 bg-gray-50 rounded-xl border border-gray-100">
               <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                 Data Table: <span className="capitalize text-brand-600">{activeConfigTab}</span>
               </h4>
               <Button onClick={openModal} size="sm" className="shadow-md flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl">
                 <Plus size={18} /> Add New {getItemLabel()}
               </Button>
            </div>
            {renderTable()}
        </div>
      </div>

      {/* Dynamic Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-xl text-gray-900">{configForm.id ? 'Edit' : 'Add'} {getItemLabel()}</h3>
                    <button onClick={() => setIsConfigModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Dynamic Fields */}
                    {activeConfigTab === 'agri' && (
                        <>
                            <div><label className="block text-sm font-bold text-gray-700 mb-1">Crop Name</label><input required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-gray-900 bg-gray-50 focus:bg-white transition-all" value={configForm.name || ''} onChange={e => setConfigForm({...configForm, name: e.target.value})} placeholder="e.g. Rice" /></div>
                            <div><label className="block text-sm font-bold text-gray-700 mb-1">Season</label><input required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-gray-900 bg-gray-50 focus:bg-white transition-all" value={configForm.season || ''} onChange={e => setConfigForm({...configForm, season: e.target.value})} placeholder="e.g. Winter" /></div>
                            <div><label className="block text-sm font-bold text-gray-700 mb-1">Water Req</label><select className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={configForm.water || 'High'} onChange={e => setConfigForm({...configForm, water: e.target.value})}><option>High</option><option>Medium</option><option>Low</option></select></div>
                        </>
                    )}
                    
                    {activeConfigTab === 'health' && (
                        <>
                            <div><label className="block text-sm font-bold text-gray-700 mb-1">Hospital Name</label><input required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-gray-900 bg-gray-50" value={configForm.name || ''} onChange={e => setConfigForm({...configForm, name: e.target.value})} /></div>
                            <div><label className="block text-sm font-bold text-gray-700 mb-1">District</label><input required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-gray-900 bg-gray-50" value={configForm.district || ''} onChange={e => setConfigForm({...configForm, district: e.target.value})} /></div>
                            <div><label className="block text-sm font-bold text-gray-700 mb-1">Type</label><select className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value={configForm.type || 'Public'} onChange={e => setConfigForm({...configForm, type: e.target.value})}><option>Public</option><option>Private</option></select></div>
                        </>
                    )}
                    
                    {['transport', 'edu', 'disaster', 'fishery', 'craft', 'waste', 'jela'].includes(activeConfigTab) && (
                         <div><label className="block text-sm font-bold text-gray-700 mb-1">Name / Title</label><input required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-gray-900 bg-gray-50" value={configForm.name || configForm.title || configForm.route || configForm.zone || ''} onChange={e => setConfigForm({...configForm, name: e.target.value, title: e.target.value, route: e.target.value, zone: e.target.value})} placeholder="Enter Details" /></div>
                    )}

                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsConfigModalOpen(false)} className="text-gray-600 border-gray-300 hover:bg-gray-50 font-bold px-6">Cancel</Button>
                        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 shadow-md">Save Item</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
