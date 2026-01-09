
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Briefcase, MapPin, Clock, DollarSign, Search, X, CheckCircle, Calendar, 
  Building2, Filter, ChevronDown, RefreshCw, PlusCircle, Send, Globe, 
  Info, FileText, Download, User as UserIcon, Mail, Phone, Link as LinkIcon,
  Trash2, Plus, Layout, Type as TypeIcon, Camera, Globe2, Share2, Banknote, Loader2, Bird, Printer,
  AlignLeft, GraduationCap
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { User } from '../../types';
import { compressImage } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
  user?: User | null;
  onLogin?: () => void;
}

type JobCategory = 'Government' | 'Private' | 'NGO' | 'International' | 'Autonomous' | 'Local Government' | 'Public University';
type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Remote';
type JobLevel = 'Entry' | 'Mid' | 'Senior';

interface CvExperience {
  company: string;
  role: string;
  period: string;
  desc: string;
}

interface CvEducation {
  school: string;
  degree: string;
  year: string;
}

interface CvData {
  name: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  website: string;
  image: string | null;
  summary: string;
  experience: CvExperience[];
  education: CvEducation[];
  skills: string[];
}

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
  const { jobs, addRequest, logCvGeneration, isLoading } = useData();
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobCopyStatus, setJobCopyStatus] = useState<number | null>(null);
  
  const [selectedCategories, setSelectedCategories] = useState<JobCategory[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<JobLevel[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvStep, setCvStep] = useState(1);
  const [cvTemplate, setCvTemplate] = useState<'executive' | 'modern' | 'classic'>('executive');

  const cvPhotoInputRef = useRef<HTMLInputElement>(null);

  const [cvData, setCvData] = useState<CvData>({
    name: user?.name || '',
    title: '',
    email: user?.email || '',
    phone: '',
    address: '',
    dob: '',
    website: '',
    image: user?.avatar || null,
    summary: '',
    experience: [{ company: '', role: '', period: '', desc: '' }],
    education: [{ school: '', degree: '', year: '' }],
    skills: ['']
  });

  const [postSubmitted, setPostSubmitted] = useState(false);
  const [newJobData, setNewJobData] = useState({
      title: '',
      company: '',
      description: '',
      location: '',
      salary: '',
      type: 'Full Time',
      deadline: '',
      category: 'Private',
      level: 'Entry'
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const jobId = params.get('jobId');
      if (jobId && jobs && jobs.length > 0) {
        const job = jobs.find((j: any) => j.id?.toString() === jobId);
        if (job) setSelectedJob(job);
      }
    } catch (e) { console.warn(e); }
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (jobs || []).filter((job: any) => {
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
    if (current.includes(item)) setter(current.filter(i => i !== item));
    else setter([...current, item]);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedLevels([]);
    setSearchTerm('');
  };

  const handlePostClick = () => {
      if (!user) { onLogin?.(); return; }
      setShowPostModal(true);
      setPostSubmitted(false);
  };

  const handleCvGeneratorClick = () => {
      if (!user) { onLogin?.(); return; }
      setShowCvModal(true);
      setCvStep(1);
  };

  const handleCvPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 0.6);
        setCvData({ ...cvData, image: compressed });
      } catch (err) { console.error(err); }
    }
  };

  const handleApplyClick = () => {
      if (!user) { onLogin?.(); return; }
      alert(isBangla ? 'আবেদন সফল হয়েছে!' : 'Application Submitted!');
      setSelectedJob(null);
  };

  const handleCopyJobLink = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}${window.location.pathname}?jobId=${id}`;
      navigator.clipboard.writeText(url);
      setJobCopyStatus(id);
      setTimeout(() => setJobCopyStatus(null), 2000);
    } catch (err) { console.warn(err); }
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
        category: newJobData.category,
        level: newJobData.level,
        postedby: user?.name || 'Guest', 
    };
    addRequest(request);
    setPostSubmitted(true);
    setNewJobData({ title: '', company: '', description: '', location: '', salary: '', type: 'Full Time', deadline: '', category: 'Private', level: 'Entry' });
  };

  const addExperience = () => setCvData({ ...cvData, experience: [...cvData.experience, { company: '', role: '', period: '', desc: '' }] });
  const addEducation = () => setCvData({ ...cvData, education: [...cvData.education, { school: '', degree: '', year: '' }] });
  
  const handlePrintCv = () => {
    logCvGeneration();
    window.print();
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
    <div className="bg-gray-50 min-h-screen py-8 lg:py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body * { visibility: hidden !important; }
          #cv-paper, #cv-paper * { visibility: visible !important; }
          #cv-paper { position: absolute !important; left: 0 !important; top: 0 !important; width: 210mm !important; min-height: 297mm !important; margin: 0 !important; padding: 10mm !important; box-shadow: none !important; background: white !important; z-index: 9999 !important; }
          html, body { margin: 0 !important; padding: 0 !important; height: auto !important; background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto print:max-w-none no-print">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{isBangla ? 'আপনার স্বপ্নের চাকরি খুঁজুন' : 'Find Your Dream Job'}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">{isBangla ? 'সরকারি, বেসরকারি, স্বায়ত্বশাসিত এবং এনজিও - সব ধরনের চাকরির বিশাল সমাহার।' : 'Government, Private, Autonomous, and NGO - A vast collection of all types of jobs.'}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Button onClick={handlePostClick} className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20 rounded-full px-8 py-3 flex items-center justify-center gap-2 text-lg font-bold w-full sm:w-auto">
              <PlusCircle size={20} /> {isBangla ? 'চাকরির পোস্ট দিন' : 'Create Job Post'}
            </Button>
            <Button onClick={handleCvGeneratorClick} variant="outline" className="bg-white border-brand-500 text-brand-700 shadow-lg rounded-full px-8 py-3 flex items-center justify-center gap-2 text-lg font-bold hover:bg-brand-50 w-full sm:w-auto">
              <FileText size={20} /> {isBangla ? 'সিভি জেনারেটর' : 'CV Generator'}
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
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={isBangla ? 'পদের নাম, কোম্পানি বা স্থান খুঁজুন...' : 'Search jobs...'} className="w-full px-4 py-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400" />
              <Button className="rounded-xl px-6 m-1 hidden sm:inline-flex">{isBangla ? 'খুঁজুন' : 'Search'}</Button>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                   <div className="absolute inset-0 bg-brand-500/5 shonali-loader-pulse"></div>
                   <div className="relative z-10 flex flex-col items-center">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-md border-2 border-brand-100 shonali-loader-spin mb-4"><Bird size={32} /></div>
                     <p className="text-brand-700 font-black tracking-widest animate-pulse">{isBangla ? 'চাকরি লোড হচ্ছে...' : 'LOADING JOBS...'}</p>
                   </div>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job: any) => (
                  <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-bold rounded-bl-xl border-l border-b ${getCategoryColor(job.category)}`}>
                      {isBangla ? categoryLabels[job.category]?.bn || job.category : categoryLabels[job.category]?.en || job.category}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 border border-gray-100 shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors"><Building2 size={28} /></div>
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-700 transition-colors">{job.title}</h3>
                           <span className="text-[10px] font-black uppercase text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100">{job.level}</span>
                        </div>
                        <p className="text-gray-600 font-medium mb-3 text-sm">{job.company}</p>
                        <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><MapPin size={12} className="text-red-400" /> {job.location}</span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><Clock size={12} className="text-blue-400" /> {job.type}</span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><Banknote size={12} className="text-green-600" /> {job.salary}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full md:w-auto text-xs h-9 mt-2 md:mt-0">{isBangla ? 'বিস্তারিত' : 'Details'}</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন চাকরি পাওয়া যায়নি' : 'No jobs found'}</h3>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="relative h-32 bg-brand-600 shrink-0">
               <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"><X size={24}/></button>
            </div>
            <div className="p-8 pt-12 overflow-y-auto custom-scrollbar">
               <h2 className="text-2xl font-black text-gray-900">{selectedJob.title}</h2>
               <p className="text-brand-600 font-bold text-lg mt-1">{selectedJob.company}</p>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">TYPE</p><p className="font-bold text-gray-800 text-sm">{selectedJob.type}</p></div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">LEVEL</p><p className="font-bold text-gray-800 text-sm">{selectedJob.level}</p></div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">LOCATION</p><p className="font-bold text-gray-800 text-sm">{selectedJob.location}</p></div>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center"><p className="text-[10px] font-bold text-red-400 uppercase mb-1">DEADLINE</p><p className="font-bold text-red-600 text-sm">{selectedJob.deadline}</p></div>
               </div>
               <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-medium bg-gray-50/50 p-6 rounded-2xl border border-gray-100 whitespace-pre-wrap">{selectedJob.description}</div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
               <button onClick={(e) => handleCopyJobLink(e, selectedJob.id)} className={`flex-1 flex items-center justify-center gap-2 font-black py-4 rounded-2xl transition-all ${jobCopyStatus === selectedJob.id ? 'bg-green-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                 {jobCopyStatus === selectedJob.id ? <CheckCircle size={20}/> : <LinkIcon size={20}/>}
                 {jobCopyStatus === selectedJob.id ? (isBangla ? 'লিঙ্ক কপি হয়েছে' : 'Copied') : (isBangla ? 'লিঙ্ক কপি করুন' : 'Copy Link')}
               </button>
               <Button onClick={handleApplyClick} size="lg" className="flex-[2] bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-black text-lg">
                 {isBangla ? 'এখনই আবেদন করুন' : 'Apply Now'}
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in no-print" onClick={() => setShowPostModal(false)}>
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <div className="bg-brand-600 p-6 flex justify-between items-center text-white">
                 <h2 className="text-xl font-black uppercase flex items-center gap-2"><PlusCircle size={24}/> {isBangla ? 'চাকরির পোস্টের জন্য অনুরোধ' : 'Request Job Posting'}</h2>
                 <button onClick={() => setShowPostModal(false)}><X size={24}/></button>
              </div>
              <div className="p-8">
                 {postSubmitted ? (
                    <div className="text-center py-10 animate-fade-in">
                       <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle size={64} className="animate-bounce" /></div>
                       <h3 className="text-3xl font-black text-gray-900 mb-2">{isBangla ? 'সফল হয়েছে!' : 'Success!'}</h3>
                       <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">{isBangla ? 'আপনার চাকরির পোস্টটি অনুমোদনের জন্য জমা দেওয়া হয়েছে।' : 'Your job request has been submitted for approval.'}</p>
                       <Button onClick={() => setShowPostModal(false)} className="w-full bg-brand-600 font-black py-4 rounded-2xl shadow-lg">ঠিক আছে</Button>
                    </div>
                 ) : (
                    <form onSubmit={handlePostSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">{isBangla ? 'পদের নাম' : 'Job Title'} *</label>
                            <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-500/20" value={newJobData.title} onChange={e => setNewJobData({...newJobData, title: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">{isBangla ? 'প্রতিষ্ঠানের নাম' : 'Company Name'} *</label>
                            <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-500/20" value={newJobData.company} onChange={e => setNewJobData({...newJobData, company: e.target.value})} />
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">{isBangla ? 'বেতন' : 'Salary'}</label>
                            <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" placeholder="৳ 20,000" value={newJobData.salary} onChange={e => setNewJobData({...newJobData, salary: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">{isBangla ? 'ডেডলাইন' : 'Deadline'} *</label>
                            <input required type="date" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={newJobData.deadline} onChange={e => setNewJobData({...newJobData, deadline: e.target.value})} />
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">{isBangla ? 'বিবরণ' : 'Description'} *</label>
                          <textarea required rows={5} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium leading-relaxed resize-none" value={newJobData.description} onChange={e => setNewJobData({...newJobData, description: e.target.value})}></textarea>
                       </div>
                       <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-5 rounded-2xl shadow-xl text-lg flex items-center justify-center gap-3 mt-4">
                          <Send size={24} /> {isBangla ? 'রিকোয়েস্ট পাঠান' : 'Submit Request'}
                       </Button>
                    </form>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* CV Modal */}
      {showCvModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in no-print" onClick={() => setShowCvModal(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3"><FileText size={24} className="text-brand-600"/> {isBangla ? 'স্মার্ট সিভি জেনারেটর' : 'Smart CV Generator'}</h2>
                <button onClick={() => setShowCvModal(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all"><X size={24}/></button>
             </div>
             <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                   {cvStep === 1 && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-8">
                           <div className="relative inline-block group" onClick={() => cvPhotoInputRef.current?.click()}>
                              <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer group-hover:brightness-90 transition-all">
                                 {cvData.image ? <img src={cvData.image} className="w-full h-full object-cover" /> : <Camera className="text-gray-300" size={40} />}
                              </div>
                              <input type="file" ref={cvPhotoInputRef} className="hidden" accept="image/*" onChange={handleCvPhotoUpload} />
                           </div>
                           <h3 className="mt-4 font-black text-gray-900">{isBangla ? 'ব্যক্তিগত তথ্য' : 'Personal Info'}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={cvData.name} onChange={e => setCvData({...cvData, name: e.target.value})} placeholder="Full Name" />
                           <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={cvData.title} onChange={e => setCvData({...cvData, title: e.target.value})} placeholder="Professional Title" />
                        </div>
                        <textarea rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium" value={cvData.summary} onChange={e => setCvData({...cvData, summary: e.target.value})} placeholder="Short Summary"></textarea>
                     </div>
                   )}
                   {cvStep === 2 && (
                     <div className="space-y-10 animate-fade-in">
                        <div>
                           <div className="flex justify-between items-center mb-6"><h3 className="font-black text-gray-900 uppercase text-xs flex items-center gap-2"><Briefcase size={16} className="text-brand-600"/> {isBangla ? 'কাজের অভিজ্ঞতা' : 'Experience'}</h3><button onClick={addExperience} className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Plus size={20}/></button></div>
                           <div className="space-y-4">
                              {cvData.experience.map((exp, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                                   <input className="w-full bg-white p-2 rounded-lg border border-gray-100 font-bold text-sm" placeholder="Company" value={exp.company} onChange={e => { const n = [...cvData.experience]; n[i].company = e.target.value; setCvData({...cvData, experience: n}); }} />
                                   <input className="w-full bg-white p-2 rounded-lg border border-gray-100 text-sm font-bold" placeholder="Role" value={exp.role} onChange={e => { const n = [...cvData.experience]; n[i].role = e.target.value; setCvData({...cvData, experience: n}); }} />
                                </div>
                              ))}
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between items-center mb-6"><h3 className="font-black text-gray-900 uppercase text-xs flex items-center gap-2"><GraduationCap size={16} className="text-brand-600"/> {isBangla ? 'শিক্ষা' : 'Education'}</h3><button onClick={addEducation} className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Plus size={20}/></button></div>
                           <div className="space-y-4">
                              {cvData.education.map((edu, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                                   <input className="w-full bg-white p-2 rounded-lg border border-gray-100 font-bold text-sm" placeholder="School/Uni" value={edu.school} onChange={e => { const n = [...cvData.education]; n[i].school = e.target.value; setCvData({...cvData, education: n}); }} />
                                   <input className="w-full bg-white p-2 rounded-lg border border-gray-100 text-sm font-bold" placeholder="Degree" value={edu.degree} onChange={e => { const n = [...cvData.education]; n[i].degree = e.target.value; setCvData({...cvData, education: n}); }} />
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}
                   {cvStep === 3 && (
                     <div className="space-y-8 animate-fade-in text-center p-20">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} /></div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{isBangla ? 'সিভি তৈরি সম্পন্ন!' : 'CV is Ready!'}</h3>
                        <p className="text-gray-500 font-medium">ডাউনলোড বাটনে ক্লিক করে আপনার সিভিটি পিডিএফ হিসেবে সেভ করুন।</p>
                     </div>
                   )}
                </div>
                <div className="w-full md:w-[400px] bg-gray-50 border-l border-gray-100 p-8 overflow-y-auto hidden md:block">
                   <div id="cv-paper" className="w-full aspect-[1/1.41] bg-white shadow-xl flex flex-col p-8 text-[10px] overflow-hidden border-l-8 border-brand-600">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex-1 pr-4">
                            <h2 className="text-xl font-black text-gray-900 uppercase">{cvData.name || 'Your Name'}</h2>
                            <p className="text-brand-600 font-bold">{cvData.title || 'Title'}</p>
                            <div className="mt-4 text-[8px] text-gray-500 uppercase font-bold">
                               <p>{cvData.email}</p><p>{cvData.phone}</p><p>{cvData.address}</p>
                            </div>
                         </div>
                         <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">{cvData.image && <img src={cvData.image} className="w-full h-full object-cover" />}</div>
                      </div>
                      <div className="space-y-4">
                         <div><h3 className="font-black text-gray-900 border-b pb-1 mb-2 uppercase">Summary</h3><p className="text-gray-600 leading-relaxed">{cvData.summary}</p></div>
                         <div><h3 className="font-black text-gray-900 border-b pb-1 mb-2 uppercase">Experience</h3>{cvData.experience.map((e, i) => e.company && <div key={i} className="mb-2"><p className="font-black">{e.company}</p><p className="text-brand-600">{e.role}</p></div>)}</div>
                         <div><h3 className="font-black text-gray-900 border-b pb-1 mb-2 uppercase">Education</h3>{cvData.education.map((e, i) => e.school && <div key={i} className="mb-2"><p className="font-black">{e.school}</p><p className="text-brand-600">{e.degree}</p></div>)}</div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                <Button variant="outline" disabled={cvStep === 1} onClick={() => setCvStep(prev => prev - 1)} className="px-10 rounded-xl font-black text-xs uppercase">Back</Button>
                {cvStep < 3 ? (
                  <Button onClick={() => setCvStep(prev => prev + 1)} className="bg-brand-600 text-white px-10 rounded-xl font-black text-xs uppercase shadow-lg shadow-brand-200">Next Step</Button>
                ) : (
                  <Button onClick={handlePrintCv} className="bg-gray-900 hover:bg-black text-white px-12 rounded-xl font-black text-xs uppercase shadow-xl flex items-center gap-2"><Printer size={16}/> Print & Download CV</Button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
