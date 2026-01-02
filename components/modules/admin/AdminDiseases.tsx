
import React, { useState, useRef, useMemo, memo } from 'react';
import { HeartPulse, Plus, Search, Edit3, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

/**
 * Image compression utility to save storage space and improve performance
 */
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    };
  });
};

const DiseaseFormModal = memo(({ isOpen, onClose, initialData, onSave }: { 
  isOpen: boolean, 
  onClose: () => void, 
  initialData: any, 
  onSave: (payload: any) => void 
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setFormData({ ...formData, image: compressed });
      } catch (err) {
        console.error("Compression failed", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const inputStyles = "w-full p-3 bg-[#333] border-none rounded-lg text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-500";
  const labelStyles = "block text-sm font-bold text-gray-800 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up">
        <div className="p-5 border-b flex justify-between items-center bg-white">
          <h3 className="font-bold text-xl text-gray-900">{formData.id ? 'Edit Disease' : 'Add Disease'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Name (BN)</label>
              <input required className={inputStyles} value={formData.namebn || formData.nameBn || ''} onChange={e => setFormData({...formData, namebn: e.target.value})} />
            </div>
            <div>
              <label className={labelStyles}>Name (EN)</label>
              <input required className={inputStyles} value={formData.nameen || formData.nameEn || ''} onChange={e => setFormData({...formData, nameen: e.target.value})} />
            </div>
          </div>
          <div>
            <label className={labelStyles}>Symptoms (BN)</label>
            <textarea required rows={3} className={`${inputStyles} resize-none`} value={formData.symptomsbn || formData.symptomsBn || ''} onChange={e => setFormData({...formData, symptomsbn: e.target.value})} />
          </div>
          <div>
            <label className={labelStyles}>Symptoms (EN)</label>
            <textarea required rows={3} className={`${inputStyles} resize-none`} value={formData.symptomsen || formData.symptomsEn || ''} onChange={e => setFormData({...formData, symptomsen: e.target.value})} />
          </div>
          <div>
            <label className={labelStyles}>Treatment (BN)</label>
            <textarea required rows={3} className={`${inputStyles} resize-none`} value={formData.treatmentbn || formData.treatmentBn || ''} onChange={e => setFormData({...formData, treatmentbn: e.target.value})} />
          </div>
          <div>
            <label className={labelStyles}>Treatment (EN)</label>
            <textarea required rows={3} className={`${inputStyles} resize-none`} value={formData.treatmenten || formData.treatmentEn || ''} onChange={e => setFormData({...formData, treatmenten: e.target.value})} />
          </div>
          <div>
            <label className={labelStyles}>Image URL or Upload (Compressed)</label>
            <div className="flex gap-2">
              <input className={`${inputStyles} flex-1`} value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isCompressing}
                className="p-3 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isCompressing ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20}/>}
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={isCompressing} className="w-full bg-[#111827] hover:bg-black text-white font-bold py-4 rounded-lg shadow-lg transition-all active:scale-[0.98] disabled:bg-gray-400">
              {isCompressing ? 'Compressing Image...' : 'Save Disease Post'}
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

  const filtered = useMemo(() => (diseases || []).filter((d: any) => 
    (d.nameen || d.nameEn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.namebn || d.nameBn || '').includes(searchTerm)
  ), [diseases, searchTerm]);

  const handleSave = async (data: any) => {
    const payload = {
        id: data.id || Date.now(),
        namebn: data.namebn || data.nameBn,
        nameen: data.nameen || data.nameEn,
        symptomsbn: data.symptomsbn || data.symptomsBn,
        symptomsen: data.symptomsen || data.symptomsEn,
        treatmentbn: data.treatmentbn || data.treatmentBn,
        treatmenten: data.treatmenten || data.treatmentEn,
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
        <Button onClick={() => { setEditingItem({}); setShowModal(true); }} className="bg-gray-900 text-white">
          <Plus size={18} className="mr-2" /> Add New Disease
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search diseases..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((d: any) => (
          <div key={d.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-40 bg-gray-100 relative">
              <img src={d.image} alt={d.nameen || d.nameEn} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => { setEditingItem(d); setShowModal(true); }} className="p-2 bg-white/90 rounded-full text-blue-600 shadow-sm"><Edit3 size={16}/></button>
                <button onClick={() => { if(confirm('Delete?')) deleteDisease(d.id); }} className="p-2 bg-white/90 rounded-full text-red-600 shadow-sm"><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="p-4 flex-1">
              <h4 className="font-bold text-gray-900">{d.namebn || d.nameBn} ({d.nameen || d.nameEn})</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{d.symptomsbn || d.symptomsBn}</p>
            </div>
          </div>
        ))}
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
