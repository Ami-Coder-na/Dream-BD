
import React, { useState } from 'react';
import { 
  History, Search, Trash2, User, Phone, MapPin, 
  Calendar, ArrowRight, ShieldCheck, Droplets
} from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

export const AdminDonorLogs = () => {
  const { donorViewLogs } = useData();
  const [search, setSearch] = useState('');

  const filteredLogs = (donorViewLogs || []).filter((log: any) => 
    log.donorName?.toLowerCase().includes(search.toLowerCase()) || 
    log.viewerName?.toLowerCase().includes(search.toLowerCase()) ||
    log.viewerPhone?.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <History className="text-red-600" /> Donor View History
          </h3>
          <p className="text-gray-500 text-sm mt-1">Tracking who accessed donor contact numbers</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 font-bold text-gray-500 uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-5">Donor (Target)</th>
              <th className="p-5">Viewer (Requester)</th>
              <th className="p-5">Requester Contact</th>
              <th className="p-5">Location</th>
              <th className="p-5">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredLogs.map((log: any, idx: number) => (
              <tr key={idx} className="hover:bg-red-50/20 transition-colors">
                <td className="p-5">
                   <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Droplets size={14}/></div>
                      <div>
                        <p className="font-bold text-gray-900">{log.donorName}</p>
                        <p className="text-[10px] text-gray-400">{log.donorPhone}</p>
                      </div>
                   </div>
                </td>
                <td className="p-5">
                   <p className="font-bold text-gray-900">{log.viewerName}</p>
                   <p className="text-[10px] text-blue-500 uppercase font-bold">Verified Requester</p>
                </td>
                <td className="p-5">
                   <p className="font-medium text-gray-700">{log.viewerPhone}</p>
                </td>
                <td className="p-5">
                   <p className="text-gray-600 flex items-center gap-1"><MapPin size={12}/> {log.viewerDistrict}</p>
                </td>
                <td className="p-5 text-gray-400 text-xs">
                   {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400">
                   <History size={48} className="mx-auto mb-3 opacity-20" />
                   <p>No contact view logs found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
