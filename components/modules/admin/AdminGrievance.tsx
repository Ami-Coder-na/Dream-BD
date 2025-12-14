
import React, { useState } from 'react';
import { 
  Trash2, CheckCircle, Clock, Filter, Search, MapPin, 
  AlertTriangle, MessageSquare, ArrowRight, MoreVertical 
} from 'lucide-react';
import { Button } from '../../ui/Button';

// Mock Data
const INITIAL_REPORTS = [
  { id: 1, location: 'Mirpur 10, Dhaka', issue: 'Overflowing dustbin near bus stand', type: 'Waste', status: 'Pending', date: 'Today, 10:00 AM', severity: 'High' },
  { id: 2, location: 'Dhanmondi 27, Dhaka', issue: 'Construction debris on road', type: 'Waste', status: 'Resolved', date: 'Yesterday', severity: 'Medium' },
  { id: 3, location: 'Agrabad, Chattogram', issue: 'Blocked drainage causing waterlog', type: 'Water', status: 'Pending', date: '2 days ago', severity: 'High' },
  { id: 4, location: 'Zindabazar, Sylhet', issue: 'Street light not working', type: 'Electric', status: 'Resolved', date: 'Last Week', severity: 'Low' },
  { id: 5, location: 'Farmgate, Dhaka', issue: 'Illegal parking blocking road', type: 'Traffic', status: 'Pending', date: 'Today, 09:30 AM', severity: 'Medium' },
];

export const AdminGrievance = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [filter, setFilter] = useState('All');

  const handleStatusChange = (id: number, newStatus: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleDelete = (id: number) => {
    if(confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const filteredReports = reports.filter(r => filter === 'All' || r.status === filter);

  // Stats
  const total = reports.length;
  const pending = reports.filter(r => r.status === 'Pending').length;
  const resolved = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Reports</p>
             <h3 className="text-3xl font-bold text-gray-900">{total}</h3>
           </div>
           <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
             <MessageSquare size={24} />
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Action</p>
             <h3 className="text-3xl font-bold text-gray-900">{pending}</h3>
           </div>
           <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
             <Clock size={24} />
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Resolved</p>
             <h3 className="text-3xl font-bold text-gray-900">{resolved}</h3>
           </div>
           <div className="bg-green-50 p-3 rounded-xl text-green-600">
             <CheckCircle size={24} />
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trash2 className="text-red-600" size={20} /> Grievance Reports
            </h3>
            <p className="text-gray-500 text-xs mt-1">Manage citizen complaints and issues</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
               <select 
                 value={filter}
                 onChange={(e) => setFilter(e.target.value)}
                 className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 appearance-none cursor-pointer"
               >
                 <option value="All">All Status</option>
                 <option value="Pending">Pending</option>
                 <option value="Resolved">Resolved</option>
               </select>
               <Filter className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={14} />
             </div>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors group">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        report.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {report.date}
                      </span>
                      {report.severity === 'High' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={10} /> High Priority
                        </span>
                      )}
                   </div>
                   <h4 className="text-lg font-bold text-gray-900 mb-1">{report.location}</h4>
                   <p className="text-gray-600 text-sm">{report.issue}</p>
                   <p className="text-xs text-gray-400 mt-2 font-medium">Type: {report.type}</p>
                </div>

                <div className="flex items-center gap-3 self-start md:self-center">
                   {report.status === 'Pending' ? (
                     <Button 
                       onClick={() => handleStatusChange(report.id, 'Resolved')}
                       className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 h-auto"
                     >
                       Mark Resolved
                     </Button>
                   ) : (
                     <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                       <CheckCircle size={16} /> Completed
                     </div>
                   )}
                   
                   <button 
                     onClick={() => handleDelete(report.id)}
                     className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                     title="Delete Report"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredReports.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <CheckCircle size={48} className="mx-auto mb-3 opacity-20" />
              <p>No reports found matching criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
