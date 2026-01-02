
import React, { useState } from 'react';
import { Info, Save, FileText, Target, Eye } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

export const AdminAbout = () => {
  const { aboutUs, updateAboutUs } = useData();
  const [formData, setFormData] = useState(aboutUs);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAboutUs(formData);
      alert('About Us content updated successfully!');
    } catch (err) {
      alert('Update failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyles = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder-gray-400 font-medium";
  const labelStyles = "block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider";

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
          <Info size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About Us Content</h2>
          <p className="text-gray-500 text-sm">Write the story and mission of Shonali Desh</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <FileText className="text-brand-600" size={20} />
              Page Titles & Main Content
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className={labelStyles}>Page Title (BN)</label>
                <input required className={inputStyles} value={formData.titleBn} onChange={e => setFormData({...formData, titleBn: e.target.value})} />
              </div>
              <div>
                <label className={labelStyles}>Page Title (EN)</label>
                <input required className={inputStyles} value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} />
              </div>
           </div>

           <div className="grid grid-cols-1 gap-8">
              <div>
                <label className={labelStyles}>Main Description (BN)</label>
                <textarea rows={5} required className={inputStyles} value={formData.contentBn} onChange={e => setFormData({...formData, contentBn: e.target.value})} />
              </div>
              <div>
                <label className={labelStyles}>Main Description (EN)</label>
                <textarea rows={5} required className={inputStyles} value={formData.contentEn} onChange={e => setFormData({...formData, contentEn: e.target.value})} />
              </div>
           </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <Target className="text-emerald-600" size={20} />
              Mission & Vision
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className={labelStyles}>Our Mission (BN)</label>
                  <textarea rows={3} required className={inputStyles} value={formData.missionBn} onChange={e => setFormData({...formData, missionBn: e.target.value})} />
                </div>
                <div>
                  <label className={labelStyles}>Our Mission (EN)</label>
                  <textarea rows={3} required className={inputStyles} value={formData.missionEn} onChange={e => setFormData({...formData, missionEn: e.target.value})} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelStyles}>Our Vision (BN)</label>
                  <textarea rows={3} required className={inputStyles} value={formData.visionBn} onChange={e => setFormData({...formData, visionBn: e.target.value})} />
                </div>
                <div>
                  <label className={labelStyles}>Our Vision (EN)</label>
                  <textarea rows={3} required className={inputStyles} value={formData.visionEn} onChange={e => setFormData({...formData, visionEn: e.target.value})} />
                </div>
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
           <Button type="submit" disabled={isSaving} className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-12 rounded-xl shadow-xl shadow-brand-500/20 text-lg flex items-center gap-2 group">
              {isSaving ? 'Updating...' : <><Save size={22}/> Save & Publish</>}
           </Button>
        </div>
      </form>
    </div>
  );
};
