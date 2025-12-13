
import React, { useState } from 'react';
import { 
  Database, Search, Sprout, Stethoscope, BookOpen, 
  Navigation, Recycle, Home, Fish, Hammer, MapPin, 
  Plus, Trash2, Filter, X 
} from 'lucide-react';
import { Button } from '../../ui/Button';

interface Props {
  isBangla: boolean;
}

type ConfigTab = 'agri' | 'health' | 'edu' | 'transport' | 'disaster' | 'fishery' | 'craft' | 'waste' | 'jela';

// --- MOCK DATA ---
const ADMIN_CROPS = [
  { id: 1, name: 'Rice (Paddy)', season: 'Monsoon', water: 'High', status: 'Active' },
  { id: 2, name: 'Potato', season: 'Winter', water: 'Medium', status: 'Active' },
  { id: 3, name: 'Jute', season: 'Summer', water: 'Medium', status: 'Inactive' },
];

const ADMIN_HOSPITALS = [
  { id: 1, name: 'Dhaka Medical College', district: 'Dhaka', type: 'Public', status: 'Active' },
  { id: 2, name: 'Square Hospital', district: 'Dhaka', type: 'Private', status: 'Active' },
];

const ADMIN_ROUTES = [
  { id: 1, route: 'Dhaka - Chittagong', mode: 'Bus', fare: '800', status: 'Active' },
  { id: 2, route: 'Dhaka - Sylhet', mode: 'Train', fare: '450', status: 'Active' },
];

const ADMIN_WASTE_ZONES = [
  { id: 1, zone: 'Mirpur Zone-1', truck: 'Truck-A12', timing: '6 AM - 8 AM', status: 'Active' },
  { id: 2, zone: 'Dhanmondi West', truck: 'Truck-B05', timing: '7 AM - 9 AM', status: 'Inactive' },
];

// Fallback data for other tabs
const GENERIC_DATA = [
  { id: 1, name: 'Sample Item 1', info: 'Details A', status: 'Active' },
  { id: 2, name: 'Sample Item 2', info: 'Details B', status: 'Inactive' },
];

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
  const [genericData, setGenericData] = useState(GENERIC_DATA);

  // --- ACTIONS ---

  const handleDelete = (id: number) => {
    if(!confirm('Are you sure you want to delete this item?')) return;
    
    if(activeConfigTab === 'agri') setAdminCrops(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'health') setAdminHospitals(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'transport') setAdminRoutes(prev => prev.filter(i => i.id !== id));
    else if(activeConfigTab === 'waste') setAdminWasteZones(prev => prev.filter(i => i.id !== id));
    else setGenericData(prev => prev.filter(i => i.id !== id));
  };

  const openModal = () => {
    setConfigForm({});
    setIsConfigModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { id: Date.now(), status: 'Active', ...configForm };
    
    if(activeConfigTab === 'agri') setAdminCrops([newItem, ...adminCrops]);
    else if(activeConfigTab === 'health') setAdminHospitals([newItem, ...adminHospitals]);
    else if(activeConfigTab === 'transport') setAdminRoutes([newItem, ...adminRoutes]);
    else if(activeConfigTab === 'waste') setAdminWasteZones([newItem, ...adminWasteZones]);
    else setGenericData([newItem, ...genericData]);

    setIsConfigModalOpen(false);
  };

  // --- RENDERING HELPERS ---

  const renderStatusBadge = (status: string) => (
    <span className={`px-3 py-1.5 rounded-md text-sm font-bold border-2 ${
      status === 'Active' 
        ? 'bg-green-200 text-black border-green-600' 
        : 'bg-gray-200 text-black border-gray-500'
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

  // --- TABLE RENDERERS ---

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
                    <td className="p-5 text-black font-bold text-base border-r border-gray-300">{item.name}</td>
                    <td className="p-5 text-black font-bold border-r border-gray-300">{item.season}</td>
                    <td className="p-5 border-r border-gray-300">
                        <span className="bg-blue-100 text-black px-3 py-1 rounded border-2 border-blue-500 font-bold text-sm">{item.water}</span>
                    </td>
                    <td className="p-5">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'health':
            headers = ['Hospital Name', 'District', 'Type', 'Status'];
            data = adminHospitals;
            renderRow = (item) => (
                <>
                    <td className="p-5 text-black font-bold text-base border-r border-gray-300">{item.name}</td>
                    <td className="p-5 text-black font-bold border-r border-gray-300">{item.district}</td>
                    <td className="p-5 border-r border-gray-300">
                        <span className="bg-purple-100 text-black px-3 py-1 rounded border-2 border-purple-500 font-bold text-sm">{item.type}</span>
                    </td>
                    <td className="p-5">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'transport':
            headers = ['Route Name', 'Mode', 'Fare (Tk)', 'Status'];
            data = adminRoutes;
            renderRow = (item) => (
                <>
                    <td className="p-5 text-black font-bold text-base border-r border-gray-300">{item.route}</td>
                    <td className="p-5 text-black font-bold border-r border-gray-300 capitalize">{item.mode}</td>
                    <td className="p-5 text-black font-bold border-r border-gray-300">{item.fare}</td>
                    <td className="p-5">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        case 'waste':
            headers = ['Zone Area', 'Assigned Vehicle', 'Timing', 'Status'];
            data = adminWasteZones;
            renderRow = (item) => (
                <>
                    <td className="p-5 text-black font-bold text-base border-r border-gray-300">{item.zone}</td>
                    <td className="p-5 border-r border-gray-300">
                        <span className="text-black text-sm font-mono bg-gray-100 px-3 py-1 rounded border-2 border-gray-400 font-bold">{item.truck}</span>
                    </td>
                    <td className="p-5 text-black font-bold border-r border-gray-300">{item.timing}</td>
                    <td className="p-5">{renderStatusBadge(item.status)}</td>
                </>
            );
            break;
        default:
            headers = ['Item Name', 'Details', 'Status'];
            data = genericData;
            renderRow = (item) => (
                <>
                    <td className="p-5 text-black font-bold text-base border-r border-gray-300">{item.name}</td>
                    <td className="p-5 text-black font-bold border-r border-gray-300">{item.info}</td>
                    <td className="p-5">{renderStatusBadge(item.status)}</td>
                </>
            );
    }

    const filtered = filterData(data);

    return (
        <div className="overflow-x-auto rounded-t-xl border-2 border-black">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-black text-white font-extrabold uppercase text-sm tracking-wider">
                    <tr>
                        {headers.map((h, i) => <th key={i} className="p-5 border-r border-gray-700">{h}</th>)}
                        <th className="p-5 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {filtered.map(item => (
                        <tr key={item.id} className="border-b-2 border-gray-300 hover:bg-gray-100 transition-colors">
                            {renderRow(item)}
                            <td className="p-5 text-right">
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white border-2 border-red-500 rounded-lg text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all shadow-sm">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr><td colSpan={headers.length + 1} className="p-10 text-center text-black font-bold text-lg">No items found matching your criteria.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-300">
        
        {/* Header & Controls */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-2xl font-black text-black flex items-center gap-2">
                <Database className="text-blue-800" size={28} />
                {isBangla ? 'মডিউল কনফিগারেশন' : 'Module Configuration'}
              </h3>
              <p className="text-black font-bold text-sm mt-1">Manage database records for various modules</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="relative">
                 <select 
                   value={configStatusFilter} 
                   onChange={(e) => setConfigStatusFilter(e.target.value)}
                   className="h-full pl-3 pr-9 py-2.5 bg-white border-2 border-black text-black rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer shadow-sm"
                 >
                   <option value="All">All Status</option>
                   <option value="Active">Active</option>
                   <option value="Inactive">Inactive</option>
                 </select>
                 <Filter className="absolute right-3 top-3 text-black pointer-events-none" size={14} />
              </div>
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 text-black" size={18} />
                <input 
                  type="text" 
                  placeholder="Search database..." 
                  value={configSearch} 
                  onChange={(e) => setConfigSearch(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-black text-black rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-600 shadow-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { id: 'agri', label: 'Agriculture', icon: <Sprout size={16}/>, color: 'bg-green-700' },
              { id: 'health', label: 'Health', icon: <Stethoscope size={16}/>, color: 'bg-teal-700' },
              { id: 'transport', label: 'Transport', icon: <Navigation size={16}/>, color: 'bg-indigo-700' },
              { id: 'waste', label: 'Waste', icon: <Recycle size={16}/>, color: 'bg-emerald-700' },
              { id: 'edu', label: 'Education', icon: <BookOpen size={16}/>, color: 'bg-blue-700' },
              { id: 'disaster', label: 'Disaster', icon: <Home size={16}/>, color: 'bg-red-700' },
              { id: 'fishery', label: 'Fishery', icon: <Fish size={16}/>, color: 'bg-cyan-700' },
              { id: 'craft', label: 'Craft', icon: <Hammer size={16}/>, color: 'bg-orange-700' },
              { id: 'jela', label: 'Amar Jela', icon: <MapPin size={16}/>, color: 'bg-purple-700' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveConfigTab(tab.id as ConfigTab); setConfigSearch(''); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border-2 ${
                  activeConfigTab === tab.id 
                    ? `${tab.color} text-white border-black ring-2 ring-offset-1 ring-gray-400` 
                    : 'bg-white text-black border-black hover:bg-gray-200'
                }`}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="min-h-[400px]">
            <div className="flex justify-between items-center p-5 mb-4 bg-gray-200 rounded-xl border-2 border-black">
               <h4 className="font-black text-black text-xl flex items-center gap-2">
                 Data Table: <span className="capitalize text-blue-800 underline">{activeConfigTab}</span>
               </h4>
               <Button onClick={openModal} size="sm" className="shadow-lg shadow-black/20 flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold border-2 border-gray-600 px-6">
                 <Plus size={18} /> Add New Item
               </Button>
            </div>
            {renderTable()}
        </div>
      </div>

      {/* Dynamic Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border-4 border-black">
                <div className="p-5 border-b-2 border-black flex justify-between items-center bg-gray-100">
                    <h3 className="font-black text-xl text-black">Add {activeConfigTab.charAt(0).toUpperCase() + activeConfigTab.slice(1)} Item</h3>
                    <button onClick={() => setIsConfigModalOpen(false)} className="p-1 hover:bg-gray-300 rounded-full border-2 border-transparent hover:border-black transition-all"><X size={24} className="text-black" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Dynamic Fields */}
                    {activeConfigTab === 'agri' && (
                        <>
                            <div><label className="block text-sm font-black text-black mb-1">Crop Name</label><input required className="w-full border-2 border-black p-3 rounded-lg focus:ring-2 focus:ring-black outline-none text-black font-bold text-lg" onChange={e => setConfigForm({...configForm, name: e.target.value})} placeholder="e.g. Rice" /></div>
                            <div><label className="block text-sm font-black text-black mb-1">Season</label><input required className="w-full border-2 border-black p-3 rounded-lg focus:ring-2 focus:ring-black outline-none text-black font-bold text-lg" onChange={e => setConfigForm({...configForm, season: e.target.value})} placeholder="e.g. Winter" /></div>
                            <div><label className="block text-sm font-black text-black mb-1">Water Req</label><select className="w-full border-2 border-black p-3 rounded-lg bg-white text-black font-bold text-lg" onChange={e => setConfigForm({...configForm, water: e.target.value})}><option>High</option><option>Medium</option><option>Low</option></select></div>
                        </>
                    )}
                    {activeConfigTab === 'health' && (
                        <>
                            <div><label className="block text-sm font-black text-black mb-1">Hospital Name</label><input required className="w-full border-2 border-black p-3 rounded-lg text-black font-bold text-lg" onChange={e => setConfigForm({...configForm, name: e.target.value})} /></div>
                            <div><label className="block text-sm font-black text-black mb-1">District</label><input required className="w-full border-2 border-black p-3 rounded-lg text-black font-bold text-lg" onChange={e => setConfigForm({...configForm, district: e.target.value})} /></div>
                            <div><label className="block text-sm font-black text-black mb-1">Type</label><select className="w-full border-2 border-black p-3 rounded-lg text-black font-bold text-lg" onChange={e => setConfigForm({...configForm, type: e.target.value})}><option>Public</option><option>Private</option></select></div>
                        </>
                    )}
                    {/* Fallback for other tabs */}
                    {!['agri','health'].includes(activeConfigTab) && (
                        <>
                            <div><label className="block text-sm font-black text-black mb-1">Name / Title</label><input required className="w-full border-2 border-black p-3 rounded-lg text-black font-bold text-lg" onChange={e => setConfigForm({...configForm, name: e.target.value})} /></div>
                            <div><label className="block text-sm font-black text-black mb-1">Details / Info</label><input required className="w-full border-2 border-black p-3 rounded-lg text-black font-bold text-lg" onChange={e => setConfigForm({...configForm, info: e.target.value})} /></div>
                        </>
                    )}

                    <div className="pt-6 flex justify-end gap-3 border-t-2 border-gray-200 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsConfigModalOpen(false)} className="border-2 border-black text-black hover:bg-gray-200 font-bold px-6">Cancel</Button>
                        <Button type="submit" className="bg-black hover:bg-gray-800 font-bold text-white px-8 border-2 border-black">Save Item</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
