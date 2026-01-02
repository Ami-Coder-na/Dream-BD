
import React, { useState } from 'react';
import { Shield, FileText, Save, History, Globe } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

export const AdminLegal = () => {
  const { privacyPolicy, termsConditions, updatePrivacyPolicy, updateTermsConditions } = useData();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  
  const [privacyForm, setPrivacyForm] = useState(privacyPolicy);
  const [termsForm, setTermsForm] = useState(termsConditions);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (activeTab === 'privacy') {
        await updatePrivacyPolicy(privacyForm);
      } else {
        await updateTermsConditions(termsForm);
      }
      alert('Legal content updated successfully!');
    } catch (err) {
      alert('Update failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyles = "w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium min-h-[300px]";
  const labelStyles = "block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider";

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
            <Shield size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Legal Pages Management</h2>
            <p className="text-gray-500 text-sm">Manage Privacy Policy and Terms of Use</p>
          </div>
        </div>

        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
           <button 
             onClick={() => setActiveTab('privacy')} 
             className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'privacy' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             Privacy Policy
           </button>
           <button 
             onClick={() => setActiveTab('terms')} 
             className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'terms' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             Terms & Conditions
           </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <FileText className="text-brand-600" size={20} />
              {activeTab === 'privacy' ? 'Privacy Policy Content' : 'Terms & Conditions Content'}
           </h3>
           
           <div className="grid grid-cols-1 gap-8">
              <div>
                <label className={labelStyles}>Content (Bangla)</label>
                {activeTab === 'privacy' ? (
                  <textarea className={inputStyles} value={privacyForm.contentBn} onChange={e => setPrivacyForm({...privacyForm, contentBn: e.target.value})} />
                ) : (
                  <textarea className={inputStyles} value={termsForm.contentBn} onChange={e => setTermsForm({...termsForm, contentBn: e.target.value})} />
                )}
              </div>
              <div>
                <label className={labelStyles}>Content (English)</label>
                {activeTab === 'privacy' ? (
                  <textarea className={inputStyles} value={privacyForm.contentEn} onChange={e => setPrivacyForm({...privacyForm, contentEn: e.target.value})} />
                ) : (
                  <textarea className={inputStyles} value={termsForm.contentEn} onChange={e => setTermsForm({...termsForm, contentEn: e.target.value})} />
                )}
              </div>
           </div>
        </div>

        <div className="flex justify-end pt-4">
           <Button type="submit" disabled={isSaving} className="bg-gray-900 hover:bg-black text-white px-10 py-3 shadow-lg flex items-center gap-2">
              {isSaving ? 'Saving...' : <><Save size={18}/> Update Legal Content</>}
           </Button>
        </div>
      </form>
    </div>
  );
};
