import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

export const AdminFaqs = ({ isBangla }: { isBangla: boolean }) => {
  const { faqs, updateFaqs } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ id: 0, questionBn: '', questionEn: '', answerBn: '', answerEn: '' });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setFormData(item);
      setEditingItem(item);
    } else {
      setFormData({ id: Date.now(), questionBn: '', questionEn: '', answerBn: '', answerEn: '' });
      setEditingItem(null);
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let newFaqs = [];
    if (editingItem) {
      newFaqs = faqs.map((f: any) => f.id === formData.id ? formData : f);
    } else {
      newFaqs = [...faqs, formData];
    }
    await updateFaqs(newFaqs);
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      const newFaqs = faqs.filter((f: any) => f.id !== id);
      await updateFaqs(newFaqs);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
            <HelpCircle size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
            <p className="text-gray-500 text-sm">Manage Frequently Asked Questions for the Contact page</p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-gray-900 hover:bg-black text-white px-6">
          <Plus size={18} className="mr-2" /> Add New FAQ
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {faqs.map((faq: any) => (
          <div key={faq.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bangla</p>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">{faq.questionBn}</h4>
                  <p className="text-gray-600 text-sm mt-1">{faq.answerBn}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">English</p>
                  <h4 className="font-bold text-gray-800 text-base leading-tight">{faq.questionEn}</h4>
                  <p className="text-gray-500 text-sm mt-1">{faq.answerEn}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => handleOpenModal(faq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"><Edit3 size={18}/></button>
                <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"><Trash2 size={18}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
              <h3 className="font-bold text-xl">{editingItem ? 'Edit FAQ' : 'New FAQ Entry'}</h3>
              <button onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Question (Bangla)</label>
                    <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" value={formData.questionBn} onChange={e => setFormData({...formData, questionBn: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Answer (Bangla)</label>
                    <textarea rows={3} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none" value={formData.answerBn} onChange={e => setFormData({...formData, answerBn: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Question (English)</label>
                    <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" value={formData.questionEn} onChange={e => setFormData({...formData, questionEn: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Answer (English)</label>
                    <textarea rows={3} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none" value={formData.answerEn} onChange={e => setFormData({...formData, answerEn: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1 bg-gray-900 text-white hover:bg-black font-bold flex items-center justify-center gap-2"><Save size={18}/> Save FAQ</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};