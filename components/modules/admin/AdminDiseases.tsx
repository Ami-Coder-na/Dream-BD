
import React, { useState, useRef, useMemo, memo, useEffect } from 'react';
import { HeartPulse, Plus, Search, Edit3, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';
import { compressImage } from '../../utils/imageUtils';

const DiseaseFormModal = memo(({ isOpen, onClose, initialData, onSave }: { 
  isOpen: boolean, 
  onClose: () => void, 
  initialData: any, 
  onSave: (payload: any) => void 
}) => {
  const [formData, setFormData] = useState({
    id: null,
    namebn: '', 
    nameen: '', 
    symptomsbn: '', 
    symptomsen: '', 
    treatmentbn: '', 
    treatmenten: '', 
    image: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        namebn: initialData.namebn || initialData.nameBn || '',
        nameen: initialData.nameen || initialData.nameEn || '',
        symptomsbn: initialData.symptomsbn || initialData.symptomsBn || '',
        symptomsen: initialData.symptomsen || initialData.symptomsEn || '',
        treatmentbn: initialData.treatmentbn || initialData.treatmentBn || '',
        treatmenten: initialData.treatmenten || initialData.treatmentEn || '',
        image: initialData.image || ''
      });
    } else {
      setFormData({
        id: null,
        namebn: '', 
        nameen: '', 
        symptomsbn: '', 
        symptomsen: '', 
        treatmentbn: '', 
        treatmenten: '', 
        image: ''
      });
    }
  }, [initialData, isOpen]);

  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file, 1000, 0.6);
        setFormData(prev => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error("Compression failed", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const inputStyles = "w-full p-4 bg-[#333333] border-none rounded-xl text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-500 font-medium text-sm";
  const labelStyles = "block text-[13px] font-bold text-[#1e293b] mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-xl text-[#0f172a]">{formData.id ? 'Edit Disease' : 'Add Disease'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24}/>
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="px-8 py-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Disease Name (BN)</label>
              <input required className={inputStyles} value={formData.namebn} onChange={e => setFormData({...formData, namebn: e.target.value})} />
            </div>
            <div>
              <label className={labelStyles}>Disease Name (EN)</label>
              <input required className={inputStyles} value={formData.nameen} onChange={e => setFormData({...formData, nameen: e.target.value})} />
            </div>
          </div>

          <div>
            <label className={labelStyles}>Symptoms (BN)</label>
            <textarea required rows={4} className={`${inputStyles} resize-none`} value={formData.symptomsbn} onChange={e => setFormData({...formData, symptomsbn: e.target.value})} />
          </div>

          <div>
            <label className={labelStyles}>Symptoms (EN)</label>
            <textarea required rows={4} className={`${inputStyles} resize-none`} value={formData.symptomsen} onChange={e => setFormData({...formData, symptomsen: e.target.value})} />
          </div>

          <div>
            <label className={labelStyles}>Treatment (BN)</label>
            <textarea required rows={4} className={`${inputStyles} resize-none`} value={formData.treatmentbn} onChange={e => setFormData({...formData, treatmentbn: e.target.value})} />
          </div>

          <div>
            <label className={labelStyles}>Treatment (EN)</label>
            <textarea required rows={4} className={`${inputStyles} resize-none`} value={formData.treatmenten} onChange={e => setFormData({...formData, treatmenten: e.target.value})} />
          </div>

          <div>
            <label className={labelStyles}>Image URL or Upload (Compressed)</label>
            <div className="flex gap-2">
              <input className={`${inputStyles} flex-1`} value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Paste URL or click upload button..." />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isCompressing}
                className="px-4 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[56px]"
              >
                {isCompressing ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22}/>}
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="pt-2 sticky bottom-0 bg-white pb-4">
            <button 
              type="submit" 
              disabled={isCompressing}
              className="w-full bg-[#111827] hover:bg-black text-white font-bold py-4 rounded-xl shadow-xl transition-all active:scale-[0.98] disabled:bg-gray-400 text-base"
            >
              {isCompressing ? 'Processing...' : 'Save Disease Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export const AdminDiseases = () => {
  const { diseases, addDisease, updateDisease, deleteDisease } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => (diseases || []).filter((d: any) => {
    if (!d) return false;
    const nameE = (d.nameen || d.nameEn || '').toString().toLowerCase();
    const nameB = (d.namebn || d.nameBn || '').toString();
    return nameE.includes(searchTerm.toLowerCase()) || nameB.includes(searchTerm);
  }), [diseases, searchTerm]);

  const handleSave = async (data: any) => {
    const payload = {
        id: data.id || Date.now(),
        namebn: data.namebn,
        nameen: data.nameen,
        symptomsbn: data.symptomsbn,
        symptomsen: data.symptomsen,
        treatmentbn: data.treatmentbn,
        treatmenten: data.treatmenten,
        image: data.image
    };

    if (data.id) {
      await updateDisease(payload);
    } else {
      await addDisease(payload);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 rounded-xl text-red-600"><HeartPulse size={28} /></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Disease Management</h2>
            <p className="text-gray-500 text-sm">Manage information about seasonal diseases</p>
          </div>
        </div>
        <Button onClick={() => { setEditingItem(null); setShowModal(true); }} className="bg-gray-900 text-white">
          <Plus size={18} className="mr-2" /> Add New Disease
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search diseases by name (Bangla or English)..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((d: any) => (
          <div key={d.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
            <div className="h-40 bg-gray-100 relative overflow-hidden">
              <img src={d.image || 'https://placehold.co/400x300?text=No+Image'} alt={d.nameen || d.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => { setEditingItem(d); setShowModal(true); }} className="p-2 bg-white/90 rounded-full text-blue-600 shadow-sm hover:bg-white transition-colors"><Edit3 size={16}/></button>
                <button onClick={() => { if(confirm('Delete this disease permanently?')) deleteDisease(d.id); }} className="p-2 bg-white/90 rounded-full text-red-600 shadow-sm hover:bg-white transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="p-4 flex-1">
              <h4 className="font-bold text-gray-900">{d.namebn || d.nameBn}</h4>
              <p className="text-xs text-gray-500 font-medium">{d.nameen || d.nameEn}</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">{d.symptomsbn || d.symptomsBn}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
             <HeartPulse size={48} className="mx-auto mb-4 opacity-10" />
             <p>No diseases found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <DiseaseFormModal 
          isOpen={showModal} 
          onClose={() => { setShowModal(false); setEditingItem(null); }} 
          initialData={editingItem} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};
