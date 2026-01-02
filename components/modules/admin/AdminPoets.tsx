
import React, { useState, useMemo, useRef, useCallback, useEffect, memo } from 'react';
import { Feather, Plus, Search, Edit3, Trash2, X, Upload, Loader2, Save, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

const INITIAL_STATE = {
  nameBn: '', nameEn: '', sectionBn: '', sectionEn: '',
  birthYear: '', deathYear: '', worksBn: '', worksEn: '',
  awardsBn: '', awardsEn: '', image: ''
};

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
        const MAX_SIZE = 400;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx!.imageSmoothingEnabled = true;
        ctx!.imageSmoothingQuality = 'high';
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
    };
  });
};

const PoetRow = memo(({ poet, onEdit, onDelete }: { poet: any, onEdit: (p: any) => void, onDelete: (id: any) => void }) => {
  return (
    <tr className="hover:bg-indigo-50/20 transition-colors group">
      <td className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border-2 border-white bg-gray-100 shrink-0">
            <img 
              src={poet.image} 
              className="w-full h-full object-cover" 
              loading="lazy"
              onError={(e) => e.currentTarget.src = 'https://placehold.co/100x100?text=Author'} 
            />
          </div>
          <div>
            <p className="font-black text-gray-900 leading-none mb-1.5">{poet.nameBn}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{poet.nameEn}</p>
          </div>
        </div>
      </td>
      <td className="p-5">
        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase">
          {poet.sectionEn}
        </span>
      </td>
      <td className="p-5">
        <div className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block">
          {poet.birthYear} — {poet.deathYear}
        </div>
      </td>
      <td className="p-5 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(poet)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl"><Edit3 size={18}/></button>
          <button onClick={() => onDelete(poet.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18}/></button>
        </div>
      </td>
    </tr>
  );
});

export const AdminPoets = () => {
  const { poets, addPoet, updatePoet, deletePoet } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visibleItems, setVisibleItems] = useState(20); // Pagination: Initial visible items
  
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setVisibleItems(20); // Reset pagination on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return poets || [];
    return (poets || []).filter((p: any) => 
      p.nameEn?.toLowerCase().includes(term) || 
      p.nameBn?.includes(term) ||
      p.sectionEn?.toLowerCase().includes(term) ||
      p.sectionBn?.includes(term)
    );
  }, [poets, debouncedSearch]);

  // Sliced data for pagination
  const paginatedList = useMemo(() => {
    return filtered.slice(0, visibleItems);
  }, [filtered, visibleItems]);

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 20);
  };

  const handleOpenModal = useCallback((item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData(INITIAL_STATE);
    }
    setShowModal(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setFormData(prev => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error("Compression failed", err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, id: editingItem?.id || Date.now() };
    if (editingItem) {
      await updatePoet(payload);
    } else {
      await addPoet(payload);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = useCallback((id: any) => {
    if(confirm('Are you sure?')) deletePoet(id);
  }, [deletePoet]);

  const inputStyles = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm";
  const labelStyles = "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner">
            <Feather size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">জানতে চাই (Poets & Writers)</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-tighter">Manage historical and contemporary Bengali authors</p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-gray-900 text-white shadow-xl hover:scale-105 transition-transform px-6">
          <Plus size={18} className="mr-2" /> Add Writer
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        <input 
          type="text" 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or era..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Writer Profile</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Era / Section</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedList.map((p: any) => (
                <PoetRow 
                  key={p.id} 
                  poet={p} 
                  onEdit={handleOpenModal} 
                  onDelete={handleDelete} 
                />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest italic opacity-30">No writers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Control */}
        {filtered.length > visibleItems && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
            <button 
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-xl text-indigo-600 font-bold text-sm shadow-sm hover:bg-indigo-50 transition-all"
            >
              <ChevronDown size={18} /> Load More ({filtered.length - visibleItems} left)
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up border border-white/20" onClick={e => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                  <Feather size={20} />
                </div>
                <h3 className="font-black text-xl text-gray-900 tracking-tight">{editingItem ? 'Edit Profile' : 'Add New Writer'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelStyles}>Name (Bangla)</label>
                  <input required name="nameBn" className={inputStyles} value={formData.nameBn} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelStyles}>Name (English)</label>
                  <input required name="nameEn" className={inputStyles} value={formData.nameEn} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelStyles}>Era (Bangla)</label>
                  <input required name="sectionBn" className={inputStyles} value={formData.sectionBn} onChange={handleChange} placeholder="e.g. সমকালীন কবি" />
                </div>
                <div>
                  <label className={labelStyles}>Era (English)</label>
                  <input required name="sectionEn" className={inputStyles} value={formData.sectionEn} onChange={handleChange} placeholder="e.g. Contemporary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelStyles}>Birth Year</label>
                  <input required name="birthYear" className={inputStyles} value={formData.birthYear} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelStyles}>Death Year</label>
                  <input required name="deathYear" className={inputStyles} value={formData.deathYear} onChange={handleChange} placeholder="or 'Alive'" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelStyles}>Main Works (Bangla)</label>
                  <textarea name="worksBn" rows={3} className={inputStyles} value={formData.worksBn} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelStyles}>Main Works (English)</label>
                  <textarea name="worksEn" rows={3} className={inputStyles} value={formData.worksEn} onChange={handleChange} />
                </div>
              </div>

              <div className="flex gap-6 items-start bg-indigo-50/50 p-5 rounded-[2rem] border border-indigo-100">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white shrink-0">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/200x200?text=Preview'} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-200"><ImageIcon size={32}/></div>
                  )}
                </div>
                <div className="flex-1">
                  <label className={labelStyles}>Profile Image URL</label>
                  <div className="flex gap-2">
                    <input required name="image" className={inputStyles} value={formData.image} onChange={handleChange} placeholder="https://unsplash.com/..." />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      disabled={isCompressing}
                      className="px-4 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[56px]"
                    >
                      {isCompressing ? <Loader2 size={22} className="animate-spin text-indigo-600" /> : <Upload size={22}/>}
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <p className="text-[10px] text-indigo-400 font-bold mt-2 uppercase tracking-tighter">Enter URL or click icon to upload portrait</p>
                </div>
              </div>

              <div className="pt-4 sticky bottom-0 bg-white border-t border-gray-50">
                <Button type="submit" disabled={isCompressing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 text-base">
                  <Save size={20}/> {editingItem ? 'Update Profile' : 'Publish Writer Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
