
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Briefcase, MapPin, Clock, DollarSign, Search, X, CheckCircle, Calendar, 
  Building2, Filter, ChevronDown, RefreshCw, PlusCircle, Send, Globe, 
  Info, FileText, Download, User as UserIcon, Mail, Phone, Link as LinkIcon,
  Trash2, Plus, Layout, Type as TypeIcon, Camera, Globe2, Share2, Banknote
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

// CV Types
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
  const { jobs, addRequest, logCvGeneration } = useData();
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobCopyStatus, setJobCopyStatus] = useState<number | null>(null);
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<JobCategory[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<JobLevel[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modal States
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvStep, setCvStep] = useState(1);
  const [cvTemplate, setCvTemplate] = useState<'executive' | 'modern' | 'classic'>('executive');

  const cvPhotoInputRef = useRef<HTMLInputElement>(null);

  // CV Form Data
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
      deadline: ''
  });

  // Deep linking for shared jobs
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('jobId');
    if (jobId && jobs && jobs.length > 0) {
      const job = jobs.find((j: any) => j.id?.toString() === jobId);
      if (job) setSelectedJob(job);
    }
  }, [jobs]);

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

  const handleCvGeneratorClick = () => {
      if (!user) {
          if (onLogin) onLogin();
          return;
      }
      setShowCvModal(true);
      setCvStep(1);
  };

  const handleCvPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setCvData({ ...cvData, image: compressed });
      } catch (err) {
        console.error("CV Photo compression failed", err);
      }
    }
  };

  const handleApplyClick = () => {
      if (!user) {
          if (onLogin) onLogin();
          return;
      }
      alert(isBangla ? 'আবেদন সফল হয়েছে!' : 'Application Submitted Successfully!');
      setSelectedJob(null);
  };

  const handleCopyJobLink = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?jobId=${id}`;
    navigator.clipboard.writeText(url);
    setJobCopyStatus(id);
    setTimeout(() => setJobCopyStatus(null), 2000);
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

  // CV Handlers
  const addExperience = () => setCvData({ ...cvData, experience: [...cvData.experience, { company: '', role: '', period: '', desc: '' }] });
  const addEducation = () => setCvData({ ...cvData, education: [...cvData.education, { school: '', degree: '', year: '' }] });
  const addSkill = () => setCvData({ ...cvData, skills: [...cvData.skills, ''] });

  const handlePrintCv = () => {
    logCvGeneration(); // Real-time track CV generation
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
      {/* Robust Print CSS to fix white page issue */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          /* Hide all content by default */
          body * {
            visibility: hidden !important;
          }
          /* Specifically show the CV and its contents */
          #cv-paper, #cv-paper * {
            visibility: visible !important;
          }
          /* Position CV at the very top of the printed document */
          #cv-paper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-shadow: none !important;
            background: white !important;
            z-index: 9999 !important;
          }
          /* Ensure no scrollbars or extra space */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto print:max-w-none no-print">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'আপনার স্বপ্নের চাকরি খুঁজুন' : 'Find Your Dream Job'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            {isBangla 
              ? 'সরকারি, বেসরকারি, স্বায়ত্বশাসিত এবং এনজিও - সব ধরনের চাকরির বিশাল সমাহার।' 
              : 'Government, Private, Autonomous, and NGO - A vast collection of all types of jobs.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Button onClick={handlePostClick} className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20 rounded-full px-8 py-3 flex items-center justify-center gap-2 text-lg font-bold w-full sm:w-auto">
              <PlusCircle size={20} />
              {isBangla ? 'চাকরির পোস্ট দিন' : 'Create Job Post'}
            </Button>
            <Button onClick={handleCvGeneratorClick} variant="outline" className="bg-white border-brand-500 text-brand-700 shadow-lg rounded-full px-8 py-3 flex items-center justify-center gap-2 text-lg font-bold hover:bg-brand-50 w-full sm:w-auto">
              <FileText size={20} />
              {isBangla ? 'সিভি জেনারেটর' : 'CV Generator'}
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
              <Button className="rounded-xl px-6 m-1 hidden sm:inline-flex">{isBangla ? 'খুঁজুন' : 'Search'}</Button>
            </div>
            <p className="text-sm text-gray-500 font-medium px-2">{isBangla ? `${filteredJobs.length} টি চাকরি পাওয়া গেছে` : `Showing ${filteredJobs.length} jobs`}</p>
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job: any) => (
                  <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-200 transition-all cursor-pointer group relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-bold rounded-bl-xl border-l border-b ${getCategoryColor(job.category)}`}>
                      {isBangla ? categoryLabels[job.category]?.bn || job.category : categoryLabels[job.category]?.en || job.category}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-5 items-start">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 border border-gray-100 shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors"><Building2 size={28} /></div>
                      <div className="flex-1 w-full">
                        <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-brand-700 transition-colors mb-1 pr-12">{job.title}</h3>
                        <p className="text-gray-600 font-medium mb-3 text-sm sm:text-base">{job.company}</p>
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><MapPin size={14} className="text-red-400" /> {job.location}</span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><Clock size={14} className="text-blue-400" /> {job.type}</span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><Banknote size={14} className="text-green-600" /> {job.salary}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full md:w-auto text-xs h-9 mt-2 md:mt-0">{isBangla ? 'বিস্তারিত' : 'Details'}</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 mx-2">
                  <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন চাকরি পাওয়া যায়নি' : 'No jobs found'}</h3>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">{isBangla ? 'ফিল্টার মুছুন' : 'Clear Filters'}</Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* CV GENERATOR MODAL */}
      {showCvModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in print:relative print:inset-auto print:p-0 print:bg-white print:block">
          <div className="min-h-screen flex items-center justify-center p-0 md:p-8 print:block print:p-0">
            <div className="bg-white w-full max-w-6xl rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-full md:h-auto md:max-h-[95vh] print:max-h-none print:shadow-none print:rounded-none print:h-auto no-print" onClick={e => e.stopPropagation()}>
              <div className="bg-brand-600 p-4 sm:p-6 flex justify-between items-center text-white shrink-0 print:hidden">
                <div className="flex items-center gap-3">
                  <FileText size={24} />
                  <h3 className="font-bold text-lg sm:text-xl">{isBangla ? 'সিভি জেনারেটর' : 'CV Generator'}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(step => (
                      <div key={step} className={`w-4 sm:w-8 h-1 sm:h-1.5 rounded-full ${cvStep >= step ? 'bg-white' : 'bg-white/30'}`}></div>
                    ))}
                  </div>
                  <button onClick={() => setShowCvModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-all ml-2"><X size={24}/></button>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
                <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-10 overflow-y-auto custom-scrollbar border-r border-gray-100 print:hidden">
                  {cvStep === 1 && (
                    <div className="space-y-5 sm:space-y-6 animate-fade-in">
                      <h4 className="text-lg font-black text-gray-900 mb-4 border-b-2 border-brand-100 pb-2 flex items-center gap-2">
                        <UserIcon size={20} className="text-brand-600"/> {isBangla ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:gap-5">
                        <div className="flex items-center gap-5 sm:gap-6 mb-2">
                          <div className="relative group cursor-pointer" onClick={() => cvPhotoInputRef.current?.click()}>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-brand-500 shadow-lg">
                              {cvData.image ? <img src={cvData.image} className="w-full h-full object-cover" /> : <Camera size={24} className="text-gray-400" />}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus size={20} className="text-white" />
                            </div>
                          </div>
                          <input type="file" ref={cvPhotoInputRef} className="hidden" accept="image/*" onChange={handleCvPhotoUpload} />
                          <div>
                              <p className="text-sm font-bold text-gray-700">{isBangla ? 'প্রোফাইল ছবি' : 'Profile Picture'}</p>
                              <p className="text-[10px] sm:text-xs text-gray-400">{isBangla ? 'সিভির জন্য একটি ছবি আপলোড করুন' : 'Upload a photo for your CV'}</p>
                          </div>
                        </div>
                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name</label><input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm" value={cvData.name} onChange={e => setCvData({...cvData, name: e.target.value})} /></div>
                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Professional Title</label><input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm" placeholder="e.g. Sales Manager" value={cvData.title} onChange={e => setCvData({...cvData, title: e.target.value})} /></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email</label><input type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm" value={cvData.email} onChange={e => setCvData({...cvData, email: e.target.value})} /></div>
                          <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Phone</label><input type="tel" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm" value={cvData.phone} onChange={e => setCvData({...cvData, phone: e.target.value})} /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Date of Birth</label><input type="text" placeholder="e.g. Jan 15, 1987" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm" value={cvData.dob} onChange={e => setCvData({...cvData, dob: e.target.value})} /></div>
                          <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Website</label><input type="text" placeholder="www.example.me" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm" value={cvData.website} onChange={e => setCvData({...cvData, website: e.target.value})} /></div>
                        </div>
                        <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Address</label><input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-sm" value={cvData.address} onChange={e => setCvData({...cvData, address: e.target.value})} /></div>
                      </div>
                    </div>
                  )}

                  {cvStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <h4 className="text-lg font-black text-gray-900 mb-4 border-b-2 border-brand-100 pb-2 flex items-center gap-2">
                        <FileText size={20} className="text-brand-600"/> {isBangla ? 'সারসংক্ষেপ ও অভিজ্ঞতা' : 'Summary & Experience'}
                      </h4>
                      <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">OBJECTIVE / SUMMARY</label><textarea rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-medium text-sm resize-none" value={cvData.summary} onChange={e => setCvData({...cvData, summary: e.target.value})} /></div>
                      
                      <div className="space-y-4">
                        {cvData.experience.map((exp, idx) => (
                          <div key={idx} className="p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                              <button onClick={() => { const newList = [...cvData.experience]; newList.splice(idx, 1); setCvData({...cvData, experience: newList}); }} className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full"><X size={14}/></button>
                              <div className="grid grid-cols-1 gap-3">
                                <input placeholder="Company Name" className="bg-transparent border-b border-gray-200 py-1 font-bold outline-none focus:border-brand-500 text-sm" value={exp.company} onChange={e => { const nl = [...cvData.experience]; nl[idx].company = e.target.value; setCvData({...cvData, experience: nl}); }} />
                                <input placeholder="Your Role" className="bg-transparent border-b border-gray-200 py-1 font-medium outline-none focus:border-brand-500 text-sm" value={exp.role} onChange={e => { const nl = [...cvData.experience]; nl[idx].role = e.target.value; setCvData({...cvData, experience: nl}); }} />
                                <input placeholder="Period (e.g. 2020 - Present)" className="bg-transparent border-b border-gray-200 py-1 text-xs outline-none focus:border-brand-500" value={exp.period} onChange={e => { const nl = [...cvData.experience]; nl[idx].period = e.target.value; setCvData({...cvData, experience: nl}); }} />
                                <textarea placeholder="Job Description" className="bg-transparent border-b border-gray-200 py-1 text-xs outline-none focus:border-brand-500 resize-none" rows={2} value={exp.desc} onChange={e => { const nl = [...cvData.experience]; nl[idx].desc = e.target.value; setCvData({...cvData, experience: nl}); }} />
                              </div>
                          </div>
                        ))}
                        <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"><Plus size={18}/> Add Experience</button>
                      </div>
                    </div>
                  )}

                  {cvStep === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <h4 className="text-lg font-black text-gray-900 mb-4 border-b-2 border-brand-100 pb-2 flex items-center gap-2">
                        <Plus size={20} className="text-brand-600"/> {isBangla ? 'শিক্ষা ও দক্ষতা' : 'Education & Skills'}
                      </h4>
                      
                      <div className="space-y-4">
                        {cvData.education.map((edu, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                              <button onClick={() => { const newList = [...cvData.education]; newList.splice(idx, 1); setCvData({...cvData, education: newList}); }} className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full"><X size={14}/></button>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input placeholder="University/School Name" className="bg-transparent border-b border-gray-200 py-1 font-bold outline-none focus:border-brand-500 sm:col-span-2 text-sm" value={edu.school} onChange={e => { const nl = [...cvData.education]; nl[idx].school = e.target.value; setCvData({...cvData, education: nl}); }} />
                                <input placeholder="Major/Degree" className="bg-transparent border-b border-gray-200 py-1 font-medium outline-none focus:border-brand-500 text-sm" value={edu.degree} onChange={e => { const nl = [...cvData.education]; nl[idx].degree = e.target.value; setCvData({...cvData, education: nl}); }} />
                                <input placeholder="Year / GPA" className="bg-transparent border-b border-gray-200 py-1 text-xs outline-none focus:border-brand-500" value={edu.year} onChange={e => { const nl = [...cvData.education]; nl[idx].year = e.target.value; setCvData({...cvData, education: nl}); }} />
                              </div>
                          </div>
                        ))}
                        <button onClick={addEducation} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"><Plus size={18}/> Add Education</button>
                      </div>

                      <div className="pt-4">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Skills / Activities</label>
                        <div className="flex flex-wrap gap-2">
                            {cvData.skills.map((skill, idx) => (
                              <div key={idx} className="relative flex items-center bg-brand-50 border border-brand-100 rounded-full px-3 py-1.5">
                                <input className="bg-transparent border-none text-brand-700 font-bold text-xs focus:outline-none w-20" value={skill} onChange={e => { const nl = [...cvData.skills]; nl[idx] = e.target.value; setCvData({...cvData, skills: nl}); }} />
                                <button onClick={() => { const nl = [...cvData.skills]; nl.splice(idx, 1); setCvData({...cvData, skills: nl}); }} className="ml-1 text-brand-400 hover:text-red-500"><X size={12}/></button>
                              </div>
                            ))}
                            <button onClick={addSkill} className="px-3 py-1.5 rounded-full border-2 border-dashed border-gray-200 text-gray-400 hover:bg-gray-50"><Plus size={14}/></button>
                        </div>
                      </div>
                    </div>
                  )}

                  {cvStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                      <h4 className="text-lg font-black text-gray-900 mb-4 border-b-2 border-brand-100 pb-2 flex items-center gap-2">
                        <Layout size={20} className="text-brand-600"/> {isBangla ? 'টেমপ্লেট নির্বাচন' : 'Select Template'}
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4 sm:gap-6">
                        <div 
                          onClick={() => setCvTemplate('executive')}
                          className={`cursor-pointer rounded-2xl border-2 sm:border-4 overflow-hidden transition-all relative ${cvTemplate === 'executive' ? 'border-brand-500 shadow-lg' : 'border-gray-100 grayscale'}`}
                        >
                            <div className="p-2 bg-gray-50 border-b text-center font-black text-[10px] uppercase">Executive</div>
                            <div className="h-28 sm:h-40 bg-white p-3 space-y-1">
                              <div className="flex gap-1.5">
                                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                                  <div className="space-y-0.5">
                                    <div className="h-2 w-10 bg-brand-600 rounded"></div>
                                    <div className="h-1 w-6 bg-gray-200 rounded"></div>
                                  </div>
                              </div>
                              <div className="h-1 w-full bg-brand-200"></div>
                              <div className="space-y-1 pt-1">
                                  <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                              </div>
                            </div>
                        </div>

                        <div 
                          onClick={() => setCvTemplate('modern')}
                          className={`cursor-pointer rounded-2xl border-2 sm:border-4 overflow-hidden transition-all relative ${cvTemplate === 'modern' ? 'border-brand-500 shadow-lg' : 'border-gray-100 grayscale'}`}
                        >
                            <div className="p-2 bg-gray-50 border-b text-center font-black text-[10px]">MODERN</div>
                            <div className="h-28 sm:h-40 bg-white p-3 space-y-2">
                              <div className="h-3 w-2/3 bg-brand-600 rounded"></div>
                              <div className="h-1.5 w-1/2 bg-gray-200 rounded"></div>
                              <div className="flex gap-1 pt-2">
                                  <div className="h-1.5 w-6 bg-gray-100 rounded"></div>
                              </div>
                            </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex gap-3">
                        <Info size={20} className="text-yellow-600 shrink-0" />
                        <p className="text-xs text-yellow-800 leading-relaxed">
                          {isBangla ? 'পছন্দমতো টেমপ্লেট বেছে নিয়ে পিডিএফ ডাউনলোড করুন।' : 'Choose your preferred template and download as PDF.'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex gap-3">
                    {cvStep > 1 && (
                      <Button variant="outline" className="flex-1 py-3.5 rounded-2xl font-bold" onClick={() => setCvStep(cvStep - 1)}>
                        {isBangla ? 'পিছনে' : 'Back'}
                      </Button>
                    )}
                    {cvStep < 4 ? (
                      <Button className="flex-1 py-3.5 rounded-2xl font-bold shadow-lg" onClick={() => setCvStep(cvStep + 1)}>
                        {isBangla ? 'পরবর্তী' : 'Next'}
                      </Button>
                    ) : (
                      <Button onClick={handlePrintCv} className="flex-1 py-3.5 rounded-2xl font-black bg-brand-600 hover:bg-brand-700 text-white shadow-xl flex items-center justify-center gap-2">
                        <Download size={18} /> {isBangla ? 'ডাউনলোড' : 'Download'}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-1/2 bg-gray-200 p-2 sm:p-6 md:p-12 overflow-y-auto custom-scrollbar flex flex-col items-center print:p-0 print:block print:bg-white">
                  <div className="w-full max-w-[210mm] overflow-x-auto pb-4 md:pb-0">
                    <div id="cv-paper" className={`bg-white shadow-2xl origin-top transition-all duration-300 print:shadow-none print:w-full print:scale-100 p-6 sm:p-10 md:p-14 min-h-[297mm] mx-auto ${cvTemplate === 'classic' ? 'font-serif' : 'font-sans'}`} style={{ width: '210mm' }}>
                        {/* CV Paper Templates remain unchanged but now nested in a scrollable wrapper for mobile */}
                        {/* Template: EXECUTIVE */}
                        {cvTemplate === 'executive' && (
                          <div className="h-full flex flex-col font-sans text-[#333]">
                            <div className="flex gap-6 sm:gap-8 items-center mb-8">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#0366d6] shadow-md shrink-0">
                                  <img src={cvData.image || 'https://placehold.co/200x200?text=Photo'} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h2 className="text-2xl sm:text-4xl font-bold text-[#0366d6] tracking-tight mb-2 uppercase">{cvData.name || 'FULL NAME'}</h2>
                                  <div className="border-t-2 border-[#0366d6] pt-2">
                                      <p className="text-sm sm:text-lg font-bold text-[#0366d6] tracking-wider uppercase">{cvData.title || 'PROFESSIONAL TITLE'}</p>
                                  </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 text-[10px] sm:text-[11px] mb-8 sm:mb-10 font-medium">
                                <div className="flex items-center gap-2 sm:gap-3"><Calendar size={14} className="text-[#0366d6]" /> <span>{cvData.dob || 'Birth Date'}</span></div>
                                <div className="flex items-center gap-2 sm:gap-3"><UserIcon size={14} className="text-[#0366d6]" /> <span>Mail</span></div>
                                <div className="flex items-center gap-2 sm:gap-3"><Phone size={14} className="text-[#0366d6]" /> <span>{cvData.phone || '+880 1XXX'}</span></div>
                                <div className="flex items-center gap-2 sm:gap-3"><Mail size={14} className="text-[#0366d6]" /> <span className="lowercase truncate">{cvData.email || 'email@example.com'}</span></div>
                                <div className="flex items-center gap-2 sm:gap-3"><MapPin size={14} className="text-[#0366d6]" /> <span className="truncate">{cvData.address || 'Address'}</span></div>
                                <div className="flex items-center gap-2 sm:gap-3"><Globe2 size={14} className="text-[#0366d6]" /> <span className="lowercase truncate">{cvData.website || 'Portfolio/Link'}</span></div>
                            </div>

                            <div className="space-y-8 sm:space-y-10">
                                <section>
                                  <h3 className="text-base sm:text-lg font-bold text-[#0366d6] border-b-2 border-[#0366d6] mb-3 sm:mb-4 uppercase pb-1">OBJECTIVE</h3>
                                  <p className="text-[11px] sm:text-[12px] leading-relaxed text-gray-700 whitespace-pre-wrap">{cvData.summary || 'Your career goal and objective goes here.'}</p>
                                </section>

                                <section>
                                  <h3 className="text-base sm:text-lg font-bold text-[#0366d6] border-b-2 border-[#0366d6] mb-4 sm:mb-6 uppercase pb-1">EDUCATION</h3>
                                  <div className="space-y-4 sm:space-y-6">
                                      {cvData.education.map((edu, idx) => (
                                        <div key={idx} className="flex gap-4 sm:gap-6">
                                          <div className="w-1/3 shrink-0">
                                              <p className="font-bold text-[#0366d6] text-[10px] sm:text-[11px] uppercase tracking-tight">{edu.degree || 'Degree'}</p>
                                              <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">{edu.year || 'Duration'}</p>
                                          </div>
                                          <div className="flex-1">
                                              <p className="font-bold text-gray-900 text-[10px] sm:text-[11px] uppercase">{edu.school || 'School/University'}</p>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </section>

                                <section>
                                  <h3 className="text-base sm:text-lg font-bold text-[#0366d6] border-b-2 border-[#0366d6] mb-4 sm:mb-6 uppercase pb-1">WORK EXPERIENCE</h3>
                                  <div className="space-y-6 sm:space-y-8">
                                      {cvData.experience.map((exp, idx) => (
                                        <div key={idx} className="flex gap-4 sm:gap-6">
                                          <div className="w-1/3 shrink-0">
                                              <p className="font-bold text-[#0366d6] text-[10px] sm:text-[11px] uppercase tracking-tight">{exp.role || 'Role'}</p>
                                              <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">{exp.period || 'Period'}</p>
                                          </div>
                                          <div className="flex-1">
                                              <p className="font-bold text-gray-900 text-[10px] sm:text-[11px] uppercase mb-1 sm:mb-2">{exp.company || 'Company'}</p>
                                              <div className="text-[10px] sm:text-[11px] text-gray-600 leading-relaxed">
                                                {(exp.desc || '').split('\n').filter(l => l.trim()).map((line, i) => (
                                                  <p key={i} className="flex gap-1.5"><span>•</span> {line}</p>
                                                ))}
                                              </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </section>
                            </div>
                          </div>
                        )}

                        {/* Template: MODERN */}
                        {cvTemplate === 'modern' && (
                          <div className="h-full flex flex-col">
                            <div className="flex justify-between items-start border-b-4 border-brand-600 pb-6 sm:pb-8">
                                <div className="flex-1">
                                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mb-2 sm:mb-3">{cvData.name || 'YOUR NAME'}</h2>
                                  <p className="text-base sm:text-xl font-bold text-brand-600 uppercase tracking-widest">{cvData.title || 'PROFESSIONAL TITLE'}</p>
                                </div>
                                <div className="text-right text-[8px] sm:text-[10px] space-y-0.5 sm:space-y-1 text-gray-500 font-bold uppercase tracking-wider">
                                  <p className="flex items-center justify-end gap-1.5 sm:gap-2">{cvData.email || 'email@example.com'} <Mail size={10} /></p>
                                  <p className="flex items-center justify-end gap-1.5 sm:gap-2">{cvData.phone || '+880 1XXX'} <Phone size={10} /></p>
                                  <p className="flex items-center justify-end gap-1.5 sm:gap-2">{cvData.address || 'Dhaka, BD'} <MapPin size={10} /></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-6 sm:gap-8 mt-8 sm:mt-10">
                                <div className="col-span-8 space-y-8 sm:space-y-10">
                                  <section>
                                      <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="w-3 h-3 sm:w-4 sm:h-4 bg-brand-600 rounded-full"></span> EXPERIENCE
                                      </h3>
                                      <div className="space-y-4 sm:space-y-6">
                                        {cvData.experience.map((exp, idx) => (
                                          <div key={idx}>
                                              <div className="flex justify-between font-bold text-gray-800 text-xs sm:text-sm">
                                                <span>{exp.role || 'Position'}</span>
                                                <span className="text-gray-400 text-[10px] sm:text-xs">{exp.period || '2020 - 24'}</span>
                                              </div>
                                              <p className="text-[10px] sm:text-xs text-brand-600 font-black mb-1 sm:mb-2">{exp.company || 'Company Name'}</p>
                                              <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed line-clamp-3">{exp.desc || 'Responsibilities...'}</p>
                                          </div>
                                        ))}
                                      </div>
                                  </section>
                                </div>

                                <div className="col-span-4 space-y-8 sm:space-y-10">
                                  <section>
                                      <h3 className="text-[9px] sm:text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-3 sm:mb-4 border-b border-gray-100 pb-1">SUMMARY</h3>
                                      <p className="text-[10px] sm:text-[11px] text-gray-600 leading-relaxed italic">{cvData.summary || 'Summary...'}</p>
                                  </section>

                                  <section>
                                      <h3 className="text-[9px] sm:text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-3 sm:mb-4 border-b border-gray-100 pb-1">SKILLS</h3>
                                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {cvData.skills.filter(s => s.trim()).map((skill, idx) => (
                                          <span key={idx} className="bg-gray-100 text-gray-700 text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                              {skill}
                                          </span>
                                        ))}
                                      </div>
                                  </section>
                                </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedJob(null)}>
          <div className="bg-white w-full max-w-2xl rounded-none sm:rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col h-full sm:h-auto max-h-screen sm:max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 sm:p-8 text-white relative">
              <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all text-white"><X size={24} /></button>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
                  <Building2 size={32} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold leading-tight pr-8">{selectedJob.title}</h2>
                  <p className="text-brand-100 font-medium mt-1 text-sm sm:text-base">{selectedJob.company}</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6 sm:space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <MapPin size={18} className="text-red-500 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'অবস্থান' : 'Location'}</p>
                  <p className="text-xs font-bold text-gray-800">{selectedJob.location}</p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <Clock size={18} className="text-blue-500 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'ধরন' : 'Type'}</p>
                  <p className="text-xs font-bold text-gray-800">{selectedJob.type}</p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <Banknote size={18} className="text-green-600 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'বেতন' : 'Salary'}</p>
                  <p className="text-xs font-bold text-gray-800">{selectedJob.salary || 'Negotiable'}</p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                  <Calendar size={18} className="text-orange-500 mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isBangla ? 'ডেডলাইন' : 'Deadline'}</p>
                  <p className="text-xs font-bold text-gray-800">{selectedJob.deadline}</p>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Info size={20} className="text-brand-600" />
                  {isBangla ? 'চাকরির বিবরণ' : 'Job Description'}
                </h3>
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed bg-gray-50/50 p-4 sm:p-6 rounded-2xl border border-gray-100 text-sm">
                  <p className="whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                 <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-4 items-center">
                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Globe size={18}/></div>
                    <div><p className="text-[10px] font-black text-indigo-400 uppercase">{isBangla ? 'ক্যাটাগরি' : 'Category'}</p><p className="font-bold text-gray-800 text-sm">{selectedJob.category}</p></div>
                 </div>
                 <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4 items-center">
                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><CheckCircle size={18}/></div>
                    <div><p className="text-[10px] font-black text-emerald-400 uppercase">{isBangla ? 'লেভেল' : 'Level'}</p><p className="font-bold text-gray-800 text-sm">{selectedJob.level}</p></div>
                 </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex gap-3 items-center shrink-0">
              <button 
                onClick={(e) => handleCopyJobLink(e, selectedJob.id)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-center shrink-0 ${jobCopyStatus === selectedJob.id ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-500 hover:text-brand-600'}`}
                title={isBangla ? 'লিঙ্ক কপি করুন' : 'Copy Link'}
              >
                {jobCopyStatus === selectedJob.id ? <CheckCircle size={20}/> : <LinkIcon size={20} />}
              </button>
              <Button variant="outline" className="flex-1 py-3 sm:py-4 font-bold text-sm" onClick={() => setSelectedJob(null)}>
                {isBangla ? 'বন্ধ করুন' : 'Close'}
              </Button>
              <Button onClick={handleApplyClick} className="flex-[2] py-3 sm:py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xl shadow-brand-500/20 text-sm">
                {isBangla ? 'আবেদন করুন' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-none sm:rounded-2xl shadow-2xl overflow-hidden transform transition-all h-full sm:h-auto flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-brand-50 to-white shrink-0">
              <div><h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2"><div className="p-2 bg-brand-100 rounded-lg text-brand-600"><PlusCircle size={20} /></div>{isBangla ? 'নতুন চাকরির পোস্ট' : 'Create New Job Post'}</h2></div>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"><X size={20} /></button>
            </div>
            <div className="p-5 sm:p-8 flex-1 overflow-y-auto custom-scrollbar">
              {postSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center animate-fade-in-up"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-lg shadow-green-100"><CheckCircle size={40} className="animate-bounce" /></div><h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{isBangla ? 'জমা দেওয়া সফল হয়েছে!' : 'Submission Successful!'}</h3><Button onClick={() => setShowPostModal(false)}>{isBangla ? 'বন্ধ করুন' : 'Close'}</Button></div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-700">{isBangla ? 'পদের নাম' : 'Job Title'} *</label><input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm" value={newJobData.title} onChange={e => setNewJobData({...newJobData, title: e.target.value})} placeholder="e.g. Manager" /></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-700">{isBangla ? 'প্রতিষ্ঠান' : 'Company'} *</label><input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm" value={newJobData.company} onChange={e => setNewJobData({...newJobData, company: e.target.value})} placeholder="Company Name" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-700">{isBangla ? 'কাজের ধরন' : 'Job Type'} *</label><select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm appearance-none cursor-pointer" value={newJobData.type} onChange={(e) => setNewJobData({...newJobData, type: e.target.value})}><option value="Full Time">Full Time</option><option value="Part Time">Part Time</option><option value="Contract">Contract</option><option value="Remote">Remote</option></select></div>
                    <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-700">{isBangla ? 'অবস্থান' : 'Location'} *</label><input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm" value={newJobData.location} onChange={e => setNewJobData({...newJobData, location: e.target.value})} placeholder="e.g. Dhaka" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"><div className="space-y-1.5"><label className="text-xs font-semibold text-gray-700">{isBangla ? 'বেতন' : 'Salary Range'}</label><input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm" value={newJobData.salary} onChange={e => setNewJobData({...newJobData, salary: e.target.value})} placeholder="e.g. 20k-30k" /></div><div className="space-y-1.5"><label className="text-xs font-semibold text-gray-700">{isBangla ? 'আবেদনের শেষ তারিখ' : 'Deadline'} *</label><input type="date" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm text-gray-600" value={newJobData.deadline} onChange={e => setNewJobData({...newJobData, deadline: e.target.value})} /></div></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-700">{isBangla ? 'বিবরণ' : 'Description'} *</label><textarea required rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none" value={newJobData.description} onChange={e => setNewJobData({...newJobData, description: e.target.value})} placeholder="Job details..."></textarea></div>
                  <div className="flex justify-end pt-2"><Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30 py-3.5 rounded-xl font-bold text-base">{isBangla ? 'জমা দিন' : 'Submit Job Post'}</Button></div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
