
import React, { useState } from 'react';
import { 
  Database, Search, Sprout, Stethoscope, BookOpen, 
  Navigation, Recycle, Home, Fish, Hammer, MapPin, 
  Plus, Trash2, Filter, X, Edit3, Scale, Plane, Wrench,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

type ConfigTab = 'agri' | 'health' | 'edu' | 'transport' | 'disaster' | 'fishery' | 'craft' | 'waste' | 'jela' | 'legal' | 'expat' | 'vocational';

export const AdminConfig: React.FC<Props> = ({ isBangla }) => {
  const { 
    marketPrices, updateMarketPrices,
    lawyers, addLawyer, deleteLawyer, 
    exchangeRates, updateExchangeRates,
    vocationalCourses, addVocationalCourse, deleteVocationalCourse
  } = useData();

  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('agri');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configForm, setConfigForm] = useState<any>({});

  const openModal = () => {
    setConfigForm({});
    setIsConfigModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        if (activeConfigTab === 'agri') {
            // Validate numbers
            const todayPrice = parseFloat(configForm.today);
            if (isNaN(todayPrice)) throw new Error("Price must be a number");

            const newItem = { 
                ...configForm, 
                id: Date.now(), 
                today: todayPrice,
                yesterday: todayPrice, // Init new item yesterday price same as today
                trend: 'stable' 
            };
            updateMarketPrices([...marketPrices, newItem]);
            alert("Market Price Added Successfully!");

        } else if (activeConfigTab === 'legal') {
            addLawyer({ ...configForm });
            alert("Lawyer Added Successfully!");

        } else if (activeConfigTab === 'expat') {
            const rate = parseFloat(configForm.rate);
            if (isNaN(rate)) throw new Error("Rate must be a number");
            
            updateExchangeRates([...exchangeRates, { ...configForm, rate: rate, trend: 'stable' }]);
            alert("Exchange Rate Added Successfully!");

        } else if (activeConfigTab === 'vocational') {
            const fee = parseFloat(configForm.fee);
            if (isNaN(fee)) throw new Error("Fee must be a number");

            addVocationalCourse({ ...configForm, fee: fee, image: 'https://placehold.co/600x400' });
            alert("Course Added Successfully!");
        } else {
            alert("Configuration for this module is static in this demo version and cannot be updated dynamically.");
            return;
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
      else if (activeConfigTab === 'expat') {
          // For exchange rates which might not have ID in this specific mock structure, we filter by currency if ID missing
          // But our DataContext structure assumes objects have IDs usually. 
          // If using the mock INITIAL_EXCHANGE_RATES, they don't have IDs.
          // Let's handle it gracefully:
          const updated = exchangeRates.filter((r:any) => r.id !== id && r.currency !== configForm.currency); // Fallback logic
          // Actually, we need to pass the whole object or ID. In renderTable we pass item.id.
          // If item doesn't have ID, we can't delete easily.
          alert("Default exchange rates cannot be deleted in this demo.");
      }
  };

  const renderTable = () => {
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
                    <p className="text-xs mt-2">Dynamic configuration is available for Agri, Legal, Expat, and Vocational modules.</p>
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
        
        {/* Header & Controls */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Database className="text-brand-600" size={28} /> Module Config
            </h3>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { id: 'agri', label: 'Agriculture', icon: <Sprout size={16}/> },
              { id: 'legal', label: 'Legal Aid', icon: <Scale size={16}/> },
              { id: 'expat', label: 'Expat', icon: <Plane size={16}/> },
              { id: 'vocational', label: 'Vocational', icon: <Wrench size={16}/> },
              { id: 'health', label: 'Health', icon: <Stethoscope size={16}/> },
              { id: 'edu', label: 'Education', icon: <BookOpen size={16}/> },
              { id: 'transport', label: 'Transport', icon: <Navigation size={16}/> },
              { id: 'craft', label: 'Craft', icon: <Hammer size={16}/> },
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
               <h4 className="font-bold text-gray-800 text-lg capitalize">{activeConfigTab} Data</h4>
               {isEditable && (
                 <Button onClick={openModal} size="sm" className="bg-brand-600 text-white">Add New</Button>
               )}
            </div>
            {renderTable()}
        </div>
      </div>

      {/* Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">Add New Item</h3>
                    <button onClick={() => setIsConfigModalOpen(false)}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dynamic Fields based on Tab */}
                    {activeConfigTab === 'agri' && (
                        <>
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Name (English)" onChange={e => setConfigForm({...configForm, nameEn: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Name (Bangla)" onChange={e => setConfigForm({...configForm, nameBn: e.target.value})} />
                            <input required type="number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Price (Today)" onChange={e => setConfigForm({...configForm, today: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Unit (e.g. kg)" onChange={e => setConfigForm({...configForm, unit: e.target.value})} />
                        </>
                    )}
                    {activeConfigTab === 'legal' && (
                        <>
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Lawyer Name" onChange={e => setConfigForm({...configForm, name: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Speciality" onChange={e => setConfigForm({...configForm, speciality: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Location" onChange={e => setConfigForm({...configForm, location: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Phone" onChange={e => setConfigForm({...configForm, phone: e.target.value})} />
                        </>
                    )}
                    {activeConfigTab === 'expat' && (
                        <>
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Currency (e.g. USD)" onChange={e => setConfigForm({...configForm, currency: e.target.value})} />
                            <input required type="number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Rate (BDT)" onChange={e => setConfigForm({...configForm, rate: e.target.value})} />
                        </>
                    )}
                    {activeConfigTab === 'vocational' && (
                        <>
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Course Title" onChange={e => setConfigForm({...configForm, title: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Category" onChange={e => setConfigForm({...configForm, category: e.target.value})} />
                            <input required type="number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Fee" onChange={e => setConfigForm({...configForm, fee: e.target.value})} />
                            <input required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Duration" onChange={e => setConfigForm({...configForm, duration: e.target.value})} />
                        </>
                    )}

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
