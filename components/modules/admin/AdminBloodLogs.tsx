
import React, { useState } from 'react';
import { Droplets, Search, Clock, MapPin, User, Phone, Filter, Trash2, ShieldCheck } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

export const AdminBloodLogs = () => {
  const { donorViewLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = donorViewLogs.filter((log: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (log.donorName?.toLowerCase() || '').includes(searchLower) ||
           (log.viewerName?.toLowerCase() || '').includes(searchLower) ||
           (log.viewerPhone || '').includes(searchQuery);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <Droplets size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blood Access Logs</h2>
            <p className="text-gray-500 text-sm">{donorViewLogs.length} total views recorded</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search donor or viewer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Viewer Info</th>
                <th className="p-4">Accessed Donor</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm flex items-center gap-1">
                          <User size={12} className="text-gray-400" /> {log.viewerName}
                        </span>
                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                          <Phone size={10} /> {log.viewerPhone}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <MapPin size={10} /> {log.viewerDistrict}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-red-700 text-sm">
                          {log.donorName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {log.donorPhone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400">
                    <Droplets size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No access logs found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
