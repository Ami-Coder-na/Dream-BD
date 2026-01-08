
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
      deadline: '',
      category: 'Private',
      level: 'Entry'
  });

  // Safe deep linking
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const jobId = params.get('jobId');
      if (jobId && jobs && jobs.length > 0) {
        const job = jobs.find((j: any) => j.id?.toString() === jobId);
        if (job) setSelectedJob(job);
      }
    } catch (e) {
      console.warn("Could not access URL search params.");
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
    try {
      const url = `${window.location.origin}${window.location.pathname}?jobId=${id}`;
      navigator.clipboard.writeText(url);
      setJobCopyStatus(id);
      setTimeout(() => setJobCopyStatus(null), 2000);
    } catch (err) {
      console.warn("Could not copy link.");
    }
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
        postedby: user ? user.name : 'Guest', 
    };
    
    addRequest(request);
    setPostSubmitted(true);
    setNewJobData({ title: '', company: '', description: '', location: '', salary: '', type: 'Full Time', deadline: '', category: 'Private', level: 'Entry' });
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
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-brand-700 transition-colors pr-12">{job.title}</h3>
                           <span className="text-[10px] font-black uppercase text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100">{job.level}</span>
                        </div>
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
      {/* Modals unchanged... */}
    </div>
  );
};
