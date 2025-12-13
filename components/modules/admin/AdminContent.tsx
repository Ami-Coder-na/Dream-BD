
import React, { useState } from 'react';
import { Briefcase, FileText, Plus, Search, Eye, Edit3, Trash2, Check, X } from 'lucide-react';
import { Button } from '../../ui/Button';

// Mock Data
const INITIAL_JOBS = [
  { id: 101, title: 'Assistant Teacher', company: 'School A', status: 'Active', date: '2023-10-25' },
  { id: 102, title: 'Farm Manager', company: 'Green Agro', status: 'Pending', date: '2023-10-26' },
];

export const AdminContent = () => {
  const [activeContentTab, setActiveContentTab] = useState<'jobs' | 'blogs'>('jobs');
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex bg-gray-200 p-1 rounded-xl border-2 border-gray-400">
              <button onClick={() => setActiveContentTab('jobs')} className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${activeContentTab === 'jobs' ? 'bg-white text-blue-900 shadow-sm ring-2 ring-black' : 'text-black hover:text-gray-800'}`}>Jobs</button>
              <button onClick={() => setActiveContentTab('blogs')} className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${activeContentTab === 'blogs' ? 'bg-white text-blue-900 shadow-sm ring-2 ring-black' : 'text-black hover:text-gray-800'}`}>Blogs</button>
           </div>
           <Button className="whitespace-nowrap bg-black hover:bg-gray-800 font-bold text-white border-2 border-black"><Plus size={18} className="mr-2" /> Create New</Button>
        </div>

        <div className="bg-white rounded-t-2xl shadow-sm border-2 border-black overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-black text-white font-extrabold uppercase text-sm">
                    <tr>
                        <th className="p-5 border-r border-gray-700">Title</th>
                        <th className="p-5 border-r border-gray-700">Company</th>
                        <th className="p-5 border-r border-gray-700">Date</th>
                        <th className="p-5 border-r border-gray-700">Status</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {jobs.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-200 transition-colors border-b-2 border-gray-300">
                            <td className="p-5 font-black text-black text-lg border-r border-gray-300">{item.title}</td>
                            <td className="p-5 text-black font-bold border-r border-gray-300">{item.company}</td>
                            <td className="p-5 text-black font-bold border-r border-gray-300">{item.date}</td>
                            <td className="p-5 border-r border-gray-300">
                                <span className={`px-3 py-1.5 rounded-md text-sm font-black border-2 ${
                                    item.status === 'Active' ? 'bg-green-200 text-black border-green-600' : 'bg-yellow-200 text-black border-yellow-600'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-5 text-right flex justify-end gap-2">
                                <button className="p-2 text-black hover:text-white hover:bg-blue-600 rounded-lg border-2 border-gray-400 hover:border-blue-600 font-bold transition-all"><Eye size={18}/></button>
                                <button className="p-2 text-black hover:text-white hover:bg-red-600 rounded-lg border-2 border-gray-400 hover:border-red-600 font-bold transition-all"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
