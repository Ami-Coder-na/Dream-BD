import React, { useState, useMemo } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search, X, CheckCircle, Calendar, Building2, Filter, ChevronDown, RefreshCw, PlusCircle, Send, Globe, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { User } from '../../types';

interface Props {
  isBangla: boolean;
  user?: User | null;
  onLogin?: () => void;
}

type JobCategory = 'Government' | 'Private' | 'NGO' | 'International' | 'Autonomous' | 'Local Government' | 'Public University';
type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Remote';
type JobLevel = 'Entry' | 'Mid' | 'Senior';

// Translations for categories
const categoryLabels: Record<string, { bn: string; en: string }> = {
  'Government': { bn: 'সরকারি', en: 'Government' },
  'Autonomous': { bn: 'স্বায়ত্বশাসিত', en: 'Autonomous' },
  'Public University': { bn: 'পাবলিক ভার্সিটি', en: 'Public Univ.' },
  'Local Government': { bn: 'স্থানীয় সরকার', en: 'Local Govt.' },
  'Private': { bn: 'বেসরকারি', en: 'Private' },
  'NGO': { bn: 'এনজিও', en: 'NGO' },
  'International': { bn: 'আন্তর্জাতিক', en: 'International' },
};

export const JobModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const { jobs, addRequest } = useData();
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<JobCategory[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<JobLevel[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Post Job States
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [newJobData, setNewJobData] = useState({
      title: '',
      company: '',
      description: '',
      location: '',
      salary: '',
      type: 'Full Time',
      deadline: ''
  });

  // Memoized Filtering Logic
  const filteredJobs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return jobs.filter((job: any) => {
      const matchesSearch = 
        (job.title?.toLowerCase() || '').includes(term) ||
        (job.company?.toLowerCase() || '').includes(term) ||
        (job.location?.toLowerCase() || '').includes(term);

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(job.level);

      return matchesSearch && matchesCategory && matchesType && matchesLevel;
    });
  }, [jobs, searchTerm, selectedCategories, selectedTypes, selectedLevels]);

  const toggleFilter = <T extends string>(item: T, current: T[], setter: (val: T[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedLevels([]);
    setSearchTerm('');
  };

  const handlePostClick = () => {
      if (!user) {
          if (onLogin) onLogin();
          return;
      }
      setShowPostModal(true);
      setPostSubmitted(false);
  };

  const handleApplyClick = () => {
      if (!user) {
          if (onLogin) onLogin();
          return;
      }
      alert(isBangla ? 'আবেদন সফল হয়েছে!' : 'Application Submitted Successfully!');
      setSelectedJob(null);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request = {
        contenttype: 'job', 
        title: newJobData.title,
        company: newJobData.company,
        description: newJobData.description,
        location: newJobData.location,
        salary: newJobData.salary,
        type: newJobData.type,
        deadline: newJobData.deadline,
        postedby: user ? user.name : 'Guest', 
        category: 'Private',
        level: 'Entry'
    };
    
    addRequest(request);
    setPostSubmitted(true);
    setNewJobData({ title: '', company: '', description: '', location: '', salary: '', type: 'Full Time', deadline: '' });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Government': return 'bg-green-100 text-green-800 border-green-200';
      case 'Autonomous': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Public University': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Local Government': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Private': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NGO': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const jobCategoriesList = [
    { val: 'Government', label: isBangla ? 'সরকারি (মন্ত্রণালয়/অধিদপ্তর)' : 'Government (Ministry/Dept)' },
    { val: 'Autonomous', label: isBangla ? 'স্বায়ত্বশাসিত প্রতিষ্ঠান' : 'Autonomous Bodies' },
    { val: 'Public University', label: isBangla ? 'পাবলিক বিশ্ববিদ্যালয়' : 'Public Universities' },
    { val: 'Local Government', label: isBangla ? 'স্থানীয় সরকার (সিটি/পৌরসভা)' : 'Local Govt. (City/Municipal)' },
    { val: 'Private', label: isBangla ? 'বেসরকারি কোম্পানি' : 'Private Company' },
    { val: 'NGO', label: isBangla ? 'এনজিও / উন্নয়ন সংস্থা' : 'NGO / Development' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'আপনার স্বপ্নের চাকরি খুঁজুন' : 'Find Your Dream Job'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            {isBangla 
              ? 'সরকারি, বেসরকারি, স্বায়ত্বশাসিত এবং এনজিও - সব ধরনের চাকরির বিশাল সমাহার।' 
              : 'Government, Private, Autonomous, and NGO - A vast collection of all types of jobs.'}
          </p>
          <div className="flex justify-center">
            <Button onClick={handlePostClick} className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20 rounded-full px-8 py-3 flex items-center gap-2 text-lg font-bold">
              <PlusCircle size={20} />
              {isBangla ? 'চাকরির পোস্ট দিন' : 'Create Job Post'}
            </Button>
          </div>
        </div>
        <div className="lg:hidden mb-4">
          <Button variant="outline" className="w-full flex justify-between items-center bg-white border-gray-200" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <span className="flex items-center gap-2"><Filter size={18}/> {isBangla ? 'ফিল্টার' : 'Filters'}</span>
            <ChevronDown size={18} className={`transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} lg:sticky lg:top-24 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Filter size={20} /> {isBangla ? 'ফিল্টার করুন' : 'Filter By'}</h3>
              {(selectedCategories.length > 0 || selectedTypes.length > 0 || selectedLevels.length > 0) && (
                <button onClick={clearFilters} className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1"><RefreshCw size={12} /> {isBangla ? 'রিসেট' : 'Reset'}</button>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">{isBangla ? 'প্রতিষ্ঠানের ধরন' : 'Job Category'}</h4>
              <div className="space-y-2">
                {jobCategoriesList.map((cat) => (
                  <label key={cat.val} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat.val as JobCategory) ? 'bg-brand-600 border-brand-600' : 'border-gray-300 group-hover:border-brand-400'}`}>
                      {selectedCategories.includes(cat.val as JobCategory) && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat.val as JobCategory)} onChange={() => toggleFilter(cat.val as JobCategory, selectedCategories, setSelectedCategories)} />
                    <span className={`text-sm ${selectedCategories.includes(cat.val as JobCategory) ? 'text-brand-700 font-medium' : 'text-gray-600'}`}>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
          <main className="lg:col-span-3 space-y-6">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
              <Search className="text-gray-400 ml-4" size={20} />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={isBangla ? 'পদের নাম, কোম্পানি বা স্থান খুঁজুন...' : 'Search by title, company, or location...'} className="w-full px-4 py-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400" />
              <Button className="rounded-xl px-6 m-1">{isBangla ? 'খুঁজুন' : 'Search'}</Button>
            </div>
            <p className="text-sm text-gray-500 font-medium">{isBangla ? `${filteredJobs.length} টি চাকরি পাওয়া গেছে` : `Showing ${filteredJobs.length} jobs`}</p>
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job: any) => (
                  <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-200 transition-all cursor-pointer group relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-xl border-l border-b ${getCategoryColor(job.category)}`}>
                      {isBangla ? categoryLabels[job.category]?.bn || job.category : categoryLabels[job.category]?.en || job.category}
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 border border-gray-100 shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors"><Building2 size={28} /></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-brand-700 transition-colors mb-1">{job.title}</h3>
                        <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><MapPin size={14} className="text-red-400" /> {job.location}</span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><Clock size={14} className="text-blue-400" /> {job.type}</span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><DollarSign size={14} className="text-green-500" /> {job.salary}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full md:w-auto text-xs h-9">{isBangla ? 'বিস্তারিত' : 'Details'}</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন চাকরি পাওয়া যায়নি' : 'No jobs found'}</h3>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">{isBangla ? 'ফিল্টার মুছুন' : 'Clear Filters'}</Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedJob(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-white relative">
              <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all text-white"><X size={24} /></button>
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
                  <Building2 size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold leading-tight">{selectedJob.title}</h2>
                  <p className="text-brand-100 font-medium mt-1">{selectedJob.company}</p>
                </div>
              </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <MapPin size={18} className="text-red-500 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'অবস্থান' : 'Location'}</p>
                  <p className="text-xs font-bold text-gray-800">{selectedJob.location}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <Clock size={18} className="text-blue-500 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'ধরন' : 'Type'}</p>
                  <p className="text-xs font-bold text-gray-800">{selectedJob.type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <DollarSign size={18} className="text-green-600 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'বেতন' : 'Salary'}</p>
                  <p className="text-xs font-bold text-gray-800">{selectedJob.salary || 'Negotiable'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <Calendar size={18} className="text-orange-500 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'ডেডলাইন' : 'Deadline'}</p>
                  <p className="text-xs font-bold text-gray-800">{selectedJob.deadline}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info size={20} className="text-brand-600" />
                  {isBangla ? 'চাকরির বিবরণ' : 'Job Description'}
                </h3>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <p className="whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-4 items-center">
                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Globe size={18}/></div>
                    <div><p className="text-[10px] font-black text-indigo-400 uppercase">{isBangla ? 'ক্যাটাগরি' : 'Category'}</p><p className="font-bold text-gray-800">{selectedJob.category}</p></div>
                 </div>
                 <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4 items-center">
                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><CheckCircle size={18}/></div>
                    <div><p className="text-[10px] font-black text-emerald-400 uppercase">{isBangla ? 'লেভেল' : 'Level'}</p><p className="font-bold text-gray-800">{selectedJob.level}</p></div>
                 </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              <Button variant="outline" className="flex-1 py-4 font-bold" onClick={() => setSelectedJob(null)}>
                {isBangla ? 'বন্ধ করুন' : 'Close'}
              </Button>
              <Button onClick={handleApplyClick} className="flex-1 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xl shadow-brand-500/20">
                {isBangla ? 'আবেদন করুন' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-brand-50 to-white">
              <div><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="p-2 bg-brand-100 rounded-lg text-brand-600"><PlusCircle size={20} /></div>{isBangla ? 'নতুন চাকরির পোস্ট' : 'Create New Job Post'}</h2></div>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"><X size={20} /></button>
            </div>
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              {postSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center animate-fade-in-up"><div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-lg shadow-green-100"><CheckCircle size={40} className="animate-bounce" /></div><h3 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? 'জমা দেওয়া সফল হয়েছে!' : 'Submission Successful!'}</h3><Button onClick={() => setShowPostModal(false)}>{isBangla ? 'বন্ধ করুন' : 'Close'}</Button></div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">{isBangla ? 'পদের নাম' : 'Job Title'} *</label><input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm" value={newJobData.title} onChange={e => setNewJobData({...newJobData, title: e.target.value})} placeholder="e.g. Manager" /></div>
                    <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">{isBangla ? 'প্রতিষ্ঠান' : 'Company'} *</label><input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm" value={newJobData.company} onChange={e => setNewJobData({...newJobData, company: e.target.value})} placeholder="Company Name" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">{isBangla ? 'কাজের ধরন' : 'Job Type'} *</label><select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm appearance-none cursor-pointer" value={newJobData.type} onChange={(e) => setNewJobData({...newJobData, type: e.target.value})}><option value="Full Time">Full Time</option><option value="Part Time">Part Time</option><option value="Contract">Contract</option><option value="Remote">Remote</option></select></div>
                    <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">{isBangla ? 'অবস্থান' : 'Location'} *</label><input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm" value={newJobData.location} onChange={e => setNewJobData({...newJobData, location: e.target.value})} placeholder="e.g. Dhaka" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-sm font-semibold text-gray-700">{isBangla ? 'বেতন' : 'Salary Range'} (Optional)</label><input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm" value={newJobData.salary} onChange={e => setNewJobData({...newJobData, salary: e.target.value})} placeholder="e.g. 20k-30k" /></div><div className="space-y-2"><label className="text-sm font-semibold text-gray-700">{isBangla ? 'আবেদনের শেষ তারিখ' : 'Deadline'} *</label><input type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm text-gray-600" value={newJobData.deadline} onChange={e => setNewJobData({...newJobData, deadline: e.target.value})} /></div></div>
                  <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">{isBangla ? 'বিবরণ' : 'Description'} *</label><textarea required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all text-sm resize-none" value={newJobData.description} onChange={e => setNewJobData({...newJobData, description: e.target.value})} placeholder="Job details..."></textarea></div>
                  <div className="flex justify-end pt-2"><Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30 py-3 rounded-xl font-bold">{isBangla ? 'জমা দিন' : 'Submit Job Post'}</Button></div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
