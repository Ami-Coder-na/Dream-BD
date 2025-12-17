
import React, { useState } from 'react';
import { 
  Inbox, Trash2, CheckCircle, Clock, Filter, Search, User, 
  Mail, Phone, Calendar, ArrowLeft, MoreVertical, Eye, Check
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

export const AdminMessages = () => {
  const { messages, markMessageRead, deleteMessage } = useData();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const filteredMessages = messages.filter((m: any) => {
    const matchesFilter = filter === 'All' || m.status === filter;
    const matchesSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMarkRead = (id: number) => {
    markMessageRead(id);
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, status: 'Read' });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this message permanently?')) {
      deleteMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  const unreadCount = messages.filter((m: any) => m.status === 'Unread').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Inbox size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Inbox</h2>
            <p className="text-gray-500 text-sm">{unreadCount} new messages</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search sender or text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <select 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Messages</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 font-bold text-gray-500 text-xs uppercase tracking-wider">
            Conversations
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg: any) => (
                <div 
                  key={msg.id}
                  onClick={() => { setSelectedMessage(msg); if(msg.status === 'Unread') handleMarkRead(msg.id); }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors relative group ${
                    selectedMessage?.id === msg.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-bold truncate pr-4 ${msg.status === 'Unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                      {msg.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                  {msg.status === 'Unread' && (
                    <span className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Inbox size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No messages found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Message View Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          {selectedMessage ? (
            <div className="flex flex-col h-full animate-fade-in">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    selectedMessage.status === 'Unread' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {selectedMessage.status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-8 flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedMessage.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Mail size={14}/> {selectedMessage.email}</span>
                      {selectedMessage.phone && <span className="flex items-center gap-1"><Phone size={14}/> {selectedMessage.phone}</span>}
                      <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(selectedMessage.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              {/* Quick Reply Placeholder */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                 <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col gap-4">
                    <textarea 
                      rows={2} 
                      className="w-full text-sm outline-none resize-none" 
                      placeholder="Write a quick reply..."
                      disabled
                    ></textarea>
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] text-gray-400 italic">Reply functionality coming soon to Dream BD Admin v2.0</p>
                       <Button size="sm" disabled className="bg-indigo-600 opacity-50">Send Reply</Button>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-gray-400">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Eye size={40} className="opacity-20" />
               </div>
               <h4 className="text-xl font-bold text-gray-700 mb-2">Select a Message</h4>
               <p className="max-w-xs mx-auto">Click on a conversation on the left to read and manage the message.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
