import React, { useState } from 'react';
import { Droplets, Search, Clock, MapPin, User, Phone, Filter, Trash2, ShieldCheck, Info } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

export const AdminBloodLogs = () => {
  const { donorViewLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'N/A';
    try {
      const date = new Date(ts);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    } catch (e) {
      return 'N/A';
    }
  };

  // Safe access helper for both snake_case (DB) and camelCase (App)
  const getVal = (obj: any, keys: string[]) => {
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return '';
  };

  const filteredLogs = (donorViewLogs || []).filter((log: any) => {
    const searchLower = searchQuery.toLowerCase();
    
    const dName = getVal(log, ['donorName', 'donorname']).toLowerCase();
    const vName = getVal(log, ['viewerName', 'viewername']).toLowerCase();
    const vPhone = getVal(log, ['viewerPhone', 'viewerphone']);
    const dPhone = getVal(log, ['donorPhone', 'donorphone']);

    return dName.includes(searchLower) ||
           vName.includes(searchLower) ||
           vPhone.includes(searchQuery) ||
           dPhone.includes(searchQuery);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 rounded-xl text-red-600 shadow-sm">
            <Droplets size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blood Access Logs</h2>
            <p className="text-gray-500 text-sm font-medium">
              {(donorViewLogs || []).length} total records • {filteredLogs.length} matches
            </p>
          </div>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search donor, viewer or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase font-bold text-[10px] tracking-widest">
              <tr>
                <th className="p-5">Access Time</th>
                <th className="p-5">Viewer (Who Looked)</th>
                <th className="p-5">Donor (Accessed)</th>
                <th className="p-5 text-center">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log: any, idx: number) => (
                  <tr key={log.id || idx} className="hover:bg-red-50/20 transition-colors">
                    <td className="p-5 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        {formatTimestamp(getVal(log, ['created_at', 'createdat']))}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <User size={14} className="text-blue-500" /> {getVal(log, ['viewerName', 'viewername']) || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-2">
                          <Phone size={12} /> {getVal(log, ['viewerPhone', 'viewerphone']) || 'N/A'}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin size={10} /> {getVal(log, ['viewerDistrict', 'viewerdistrict']) || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-red-700 text-sm">
                          {getVal(log, ['donorName', 'donorname'])}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={12} /> {getVal(log, ['donorPhone', 'donorphone'])}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                        <Droplets size={48} className="opacity-10" />
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-bold text-lg">No access logs found</h4>
                        <p className="text-sm">When users view donor numbers, they will appear here.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Security Note:</strong> These logs track which users are accessing sensitive donor phone numbers. 
          Use this information to prevent harassment or unauthorized bulk collection of donor data. 
          All logs include the viewer's provided phone and location.
        </p>
      </div>
    </div>
  );
};