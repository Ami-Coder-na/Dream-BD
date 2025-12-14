
import React, { useState } from 'react';
import { 
  AlertOctagon, Radio, Send, Bell, Info, AlertTriangle, 
  Trash2, CheckCircle, ShieldAlert, X, Activity, Megaphone, Clock
} from 'lucide-react';
import { Button } from '../../ui/Button';

interface Broadcast {
  id: number;
  message: string;
  severity: 'Info' | 'Warning' | 'Danger';
  time: string;
  status: 'Active' | 'Ended';
  sentBy: string;
}

const INITIAL_BROADCASTS: Broadcast[] = [
  { id: 1, message: 'Cyclone Warning Signal 4 for Coastal Areas.', severity: 'Danger', time: '10 mins ago', status: 'Active', sentBy: 'Admin' },
  { id: 2, message: 'Heavy rainfall expected in Sylhet division.', severity: 'Warning', time: '2 hours ago', status: 'Active', sentBy: 'System' },
];

export const AdminEmergency = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(INITIAL_BROADCASTS);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'Info' | 'Warning' | 'Danger'>('Info');
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    // Simulate API delay
    setTimeout(() => {
      const newBroadcast: Broadcast = {
        id: Date.now(),
        message: message,
        severity: severity,
        time: 'Just now',
        status: 'Active',
        sentBy: 'Admin'
      };
      setBroadcasts([newBroadcast, ...broadcasts]);
      setMessage('');
      setSeverity('Info');
      setIsSending(false);
      alert('Alert Broadcasted Successfully!');
    }, 1000);
  };

  const handleEndAlert = (id: number) => {
    setBroadcasts(broadcasts.map(b => b.id === id ? { ...b, status: 'Ended' } : b));
  };

  const handleDelete = (id: number) => {
    setBroadcasts(broadcasts.filter(b => b.id !== id));
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'Danger': return 'bg-red-100 text-red-700 border-red-200';
      case 'Warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case 'Danger': return <AlertOctagon size={16} />;
      case 'Warning': return <AlertTriangle size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-red-50 rounded-xl text-red-600">
          <AlertOctagon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Emergency</h2>
          <p className="text-gray-500 text-sm">Manage emergency settings and data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Broadcast Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden h-fit">
          <div className="bg-red-600 p-6 text-white flex items-center justify-between">
             <h3 className="font-bold text-lg flex items-center gap-2">
               <Megaphone size={20} /> Emergency Alert Broadcast
             </h3>
             <Activity className="animate-pulse" />
          </div>
          
          <div className="p-8">
            <form onSubmit={handleBroadcast} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Alert Message</label>
                <textarea 
                  rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400 resize-none"
                  placeholder="e.g., Cyclone Warning Signal 4 for Coastal Areas..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Severity Level</label>
                <div className="flex gap-4">
                  <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${severity === 'Info' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="severity" className="hidden" checked={severity === 'Info'} onChange={() => setSeverity('Info')} />
                    <Info size={24} className={severity === 'Info' ? 'text-blue-600' : 'text-gray-400'} />
                    <span className="text-sm font-bold">Info</span>
                  </label>
                  <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${severity === 'Warning' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="severity" className="hidden" checked={severity === 'Warning'} onChange={() => setSeverity('Warning')} />
                    <AlertTriangle size={24} className={severity === 'Warning' ? 'text-orange-600' : 'text-gray-400'} />
                    <span className="text-sm font-bold">Warning</span>
                  </label>
                  <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${severity === 'Danger' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="severity" className="hidden" checked={severity === 'Danger'} onChange={() => setSeverity('Danger')} />
                    <AlertOctagon size={24} className={severity === 'Danger' ? 'text-red-600' : 'text-gray-400'} />
                    <span className="text-sm font-bold">Danger</span>
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={!message.trim() || isSending}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                {isSending ? 'Broadcasting...' : <>Send Alert Broadcast <Send size={18} /></>}
              </Button>
            </form>
          </div>
        </div>

        {/* History Log */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 px-1">
            <Clock size={20} className="text-gray-400" /> Recent Broadcasts
          </h3>
          
          <div className="space-y-3">
            {broadcasts.map((item) => (
              <div key={item.id} className={`bg-white p-5 rounded-xl border shadow-sm transition-all ${item.status === 'Active' ? 'border-l-4 border-l-red-500' : 'border-gray-100 opacity-80'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityColor(item.severity)}`}>
                    {getSeverityIcon(item.severity)} {item.severity}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.status === 'Active' ? (
                      <button onClick={() => handleEndAlert(item.id)} className="text-xs font-bold text-orange-600 hover:underline">End Alert</button>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><CheckCircle size={12}/> Ended</span>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 size={14}/></button>
                  </div>
                </div>
                
                <p className="text-gray-800 font-medium mb-3">{item.message}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                  <span>Sent by: <span className="font-bold">{item.sentBy}</span></span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
            
            {broadcasts.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p>No alerts broadcasted yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
