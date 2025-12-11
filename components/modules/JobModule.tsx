
import React, { useState, useMemo } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search, X, CheckCircle, Calendar, Building2, Filter, ChevronDown, RefreshCw, PlusCircle, Send } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

type JobCategory = 'Government' | 'Private' | 'NGO' | 'International' | 'Autonomous' | 'Local Government' | 'Public University';
type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Remote';
type JobLevel = 'Entry' | 'Mid' | 'Senior';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  category: JobCategory;
  type: JobType;
  level: JobLevel;
  posted: string;
  deadline: string;
  description: string;
  responsibilities: string[];
}

// Translations for categories
const categoryLabels: Record<JobCategory, { bn: string; en: string }> = {
  'Government': { bn: 'সরকারি', en: 'Government' },
  'Autonomous': { bn: 'স্বায়ত্বশাসিত', en: 'Autonomous' },
  'Public University': { bn: 'পাবলিক ভার্সিটি', en: 'Public Univ.' },
  'Local Government': { bn: 'স্থানীয় সরকার', en: 'Local Govt.' },
  'Private': { bn: 'বেসরকারি', en: 'Private' },
  'NGO': { bn: 'এনজিও', en: 'NGO' },
  'International': { bn: 'আন্তর্জাতিক', en: 'International' },
};

// Static Data Moved Outside Component
const JOBS_DATA: Job[] = [
  {
    id: 1,
    title: 'Assistant Director / সহকারী পরিচালক',
    company: 'Bangladesh Bank',
    location: 'Dhaka',
    salary: 'Grade 9',
    category: 'Autonomous',
    type: 'Full Time',
    level: 'Entry',
    posted: '2 days ago',
    deadline: '30 Oct, 2023',
    description: 'Bangladesh Bank is looking for Assistant Directors for their General Banking division. / বাংলাদেশ ব্যাংক তাদের সাধারণ ব্যাংকিং বিভাগের জন্য সহকারী পরিচালক খুঁজছে।',
    responsibilities: ['Policy formulation', 'Supervising banking activities', 'Preparing reports']
  },
  {
    id: 2,
    title: 'Software Engineer / সফটওয়্যার ইঞ্জিনিয়ার',
    company: 'Pathao',
    location: 'Dhaka',
    salary: '৳ 60,000 - 80,000',
    category: 'Private',
    type: 'Full Time',
    level: 'Mid',
    posted: '1 day ago',
    deadline: '15 Nov, 2023',
    description: 'We are looking for a skilled Full-Stack Developer to join our core team. / আমরা একজন দক্ষ ফুল-স্ট্যাক ডেভেলপার খুঁজছি।',
    responsibilities: ['Developing new features', 'Optimizing code', 'Bug fixing']
  },
  {
    id: 3,
    title: 'Field Worker / মাঠ কর্মী',
    company: 'BRAC',
    location: 'Rangpur',
    salary: '৳ 18,000',
    category: 'NGO',
    type: 'Contract',
    level: 'Entry',
    posted: '3 days ago',
    deadline: '20 Nov, 2023',
    description: 'Field workers needed for rural development programs. / গ্রামীণ উন্নয়ন কর্মসূচির জন্য মাঠ কর্মী প্রয়োজন।',
    responsibilities: ['Conducting surveys', 'Data collection', 'Weekly reporting']
  },
  {
    id: 4,
    title: 'Agriculture Officer / কৃষি কর্মকর্তা',
    company: 'Dept of Agricultural Extension',
    location: 'Rajshahi',
    salary: 'Grade 10',
    category: 'Government',
    type: 'Full Time',
    level: 'Mid',
    posted: '5 days ago',
    deadline: '25 Oct, 2023',
    description: 'Recruitment of officers for advising farmers. / কৃষকদের পরামর্শ প্রদানের জন্য কর্মকর্তা নিয়োগ।',
    responsibilities: ['Training farmers', 'Crop monitoring', 'Incentive distribution']
  },
  {
    id: 5,
    title: 'Graphics Designer / গ্রাফিক্স ডিজাইনার',
    company: 'Creative IT',
    location: 'Remote',
    salary: '৳ 30,000',
    category: 'Private',
    type: 'Remote',
    level: 'Entry',
    posted: '1 week ago',
    deadline: '10 Nov, 2023',
    description: 'Creative designer needed for social media content. / সোশ্যাল মিডিয়া কন্টেন্ট তৈরির জন্য ডিজাইনার প্রয়োজন।',
    responsibilities: ['Banner design', 'Video editing', 'Branding']
  },
  {
    id: 6,
    title: 'Project Manager / প্রজেক্ট ম্যানেজার',
    company: 'CARE Bangladesh',
    location: 'Chattogram',
    salary: '৳ 90,000',
    category: 'NGO',
    type: 'Contract',
    level: 'Senior',
    posted: '2 weeks ago',
    deadline: '01 Nov, 2023',
    description: 'Experienced Project Manager needed for Health project. / স্বাস্থ্য প্রকল্পের জন্য প্রজেক্ট ম্যানেজার প্রয়োজন।',
    responsibilities: ['Project planning', 'Budget control', 'Donor reporting']
  },
  {
    id: 7,
    title: 'Lecturer (CSE) / প্রভাষক',
    company: 'University of Dhaka',
    location: 'Dhaka',
    salary: 'Grade 9',
    category: 'Public University',
    type: 'Full Time',
    level: 'Entry',
    posted: '1 day ago',
    deadline: '20 Nov, 2023',
    description: 'Department of CSE is inviting applications for Lecturer position. / সিএসই বিভাগ প্রভাষক পদে দরখাস্ত আহ্বান করছে।',
    responsibilities: ['Conducting lectures', 'Research supervision', 'Academic counseling']
  },
  {
    id: 8,
    title: 'Assistant Engineer / সহকারী প্রকৌশলী',
    company: 'Dhaka North City Corporation',
    location: 'Dhaka',
    salary: 'Grade 9',
    category: 'Local Government',
    type: 'Full Time',
    level: 'Entry',
    posted: '3 days ago',
    deadline: '25 Nov, 2023',
    description: 'DNCC requires engineers for urban planning projects. / ডিএনসিসি নগর পরিকল্পনা প্রকল্পের জন্য প্রকৌশলী খুঁজছে।',
    responsibilities: ['Site inspection', 'Project estimation', 'Maintenance supervision']
  }
];

export const JobModule: React.FC<Props> = ({ isBangla }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<JobCategory[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<JobLevel[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Post Job States
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);

  // Memoized Filtering Logic
  const filteredJobs = useMemo(() => {
    return JOBS_DATA.filter(job => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term);

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(job.level);

      return matchesSearch && matchesCategory && matchesType && matchesLevel;
    });
  }, [searchTerm, selectedCategories, selectedTypes, selectedLevels]);

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

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSubmitted(true);
  };

  const getCategoryColor = (cat: JobCategory) => {
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
        
        {/* Header Section */}
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
            <Button 
              onClick={() => { setShowPostModal(true); setPostSubmitted(false); }}
              className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20 rounded-full px-8 py-3 flex items-center gap-2 text-lg font-bold"
            >
              <PlusCircle size={20} />
              {isBangla ? 'চাকরির পোস্ট দিন' : 'Create Job Post'}
            </Button>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full flex justify-between items-center bg-white border-gray-200"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span className="flex items-center gap-2"><Filter size={18}/> {isBangla ? 'ফিল্টার' : 'Filters'}</span>
            <ChevronDown size={18} className={`transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} lg:sticky lg:top-24 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Filter size={20} /> {isBangla ? 'ফিল্টার করুন' : 'Filter By'}
              </h3>
              {(selectedCategories.length > 0 || selectedTypes.length > 0 || selectedLevels.length > 0) && (
                <button onClick={clearFilters} className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1">
                  <RefreshCw size={12} /> {isBangla ? 'রিসেট' : 'Reset'}
                </button>
              )}
            </div>

            {/* Filters UI */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">{isBangla ? 'প্রতিষ্ঠানের ধরন' : 'Job Category'}</h4>
              <div className="space-y-2">
                {jobCategoriesList.map((cat) => (
                  <label key={cat.val} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat.val as JobCategory) ? 'bg-brand-600 border-brand-600' : 'border-gray-300 group-hover:border-brand-400'}`}>
                      {selectedCategories.includes(cat.val as JobCategory) && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={selectedCategories.includes(cat.val as JobCategory)}
                      onChange={() => toggleFilter(cat.val as JobCategory, selectedCategories, setSelectedCategories)}
                    />
                    <span className={`text-sm ${selectedCategories.includes(cat.val as JobCategory) ? 'text-brand-700 font-medium' : 'text-gray-600'}`}>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100"></div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">{isBangla ? 'কাজের ধরন' : 'Job Type'}</h4>
              <div className="space-y-2">
                {[
                  { val: 'Full Time', label: isBangla ? 'ফুল টাইম' : 'Full Time' },
                  { val: 'Part Time', label: isBangla ? 'পার্ট টাইম' : 'Part Time' },
                  { val: 'Contract', label: isBangla ? 'চুক্তিভিত্তিক' : 'Contractual' },
                  { val: 'Remote', label: isBangla ? 'রিমোট / বাসা থেকে' : 'Remote' }
                ].map((type) => (
                  <label key={type.val} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type.val as JobType) ? 'bg-brand-600 border-brand-600' : 'border-gray-300 group-hover:border-brand-400'}`}>
                      {selectedTypes.includes(type.val as JobType) && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={selectedTypes.includes(type.val as JobType)}
                      onChange={() => toggleFilter(type.val as JobType, selectedTypes, setSelectedTypes)}
                    />
                    <span className={`text-sm ${selectedTypes.includes(type.val as JobType) ? 'text-brand-700 font-medium' : 'text-gray-600'}`}>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100"></div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">{isBangla ? 'অভিজ্ঞতা' : 'Experience Level'}</h4>
              <div className="space-y-2">
                {[
                  { val: 'Entry', label: isBangla ? 'এন্ট্রি লেভেল' : 'Entry Level' },
                  { val: 'Mid', label: isBangla ? 'মিড লেভেল' : 'Mid Level' },
                  { val: 'Senior', label: isBangla ? 'সিনিয়র' : 'Senior Level' }
                ].map((lvl) => (
                  <label key={lvl.val} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedLevels.includes(lvl.val as JobLevel) ? 'bg-brand-600 border-brand-600' : 'border-gray-300 group-hover:border-brand-400'}`}>
                      {selectedLevels.includes(lvl.val as JobLevel) && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={selectedLevels.includes(lvl.val as JobLevel)}
                      onChange={() => toggleFilter(lvl.val as JobLevel, selectedLevels, setSelectedLevels)}
                    />
                    <span className={`text-sm ${selectedLevels.includes(lvl.val as JobLevel) ? 'text-brand-700 font-medium' : 'text-gray-600'}`}>{lvl.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
              <Search className="text-gray-400 ml-4" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isBangla ? 'পদের নাম, কোম্পানি বা স্থান খুঁজুন...' : 'Search by title, company, or location...'}
                className="w-full px-4 py-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              />
              <Button className="rounded-xl px-6 m-1">
                {isBangla ? 'খুঁজুন' : 'Search'}
              </Button>
            </div>

            <p className="text-sm text-gray-500 font-medium">
              {isBangla 
                ? `${filteredJobs.length} টি চাকরি পাওয়া গেছে` 
                : `Showing ${filteredJobs.length} jobs`}
            </p>

            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-200 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-xl border-l border-b ${getCategoryColor(job.category)}`}>
                      {isBangla ? categoryLabels[job.category].bn : categoryLabels[job.category].en}
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 border border-gray-100 shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <Building2 size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-brand-700 transition-colors mb-1">{job.title}</h3>
                        <p className="text-gray-600 font-medium mb-3">{job.company}</p>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            <MapPin size={14} className="text-red-400" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            <Clock size={14} className="text-blue-400" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            <DollarSign size={14} className="text-green-500" />
                            {job.salary}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between self-stretch pt-2">
                         <div className="hidden md:block"></div>
                         <Button variant="outline" className="w-full md:w-auto text-xs h-9">
                           {isBangla ? 'বিস্তারিত' : 'Details'}
                         </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন চাকরি পাওয়া যায়নি' : 'No jobs found'}</h3>
                  <p className="text-gray-500 text-sm mt-1">{isBangla ? 'ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন' : 'Try adjusting your search or filters'}</p>
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    {isBangla ? 'ফিল্টার মুছুন' : 'Clear Filters'}
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-brand-50 to-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                    <PlusCircle size={20} />
                  </div>
                  {isBangla ? 'নতুন চাকরির পোস্ট' : 'Create New Job Post'}
                </h2>
                <p className="text-sm text-gray-500 mt-1 ml-11">
                  {isBangla ? 'আপনার প্রতিষ্ঠানের জন্য সেরা কর্মী খুঁজুন' : 'Find the best talent for your company'}
                </p>
              </div>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"><X size={20} /></button>
            </div>

            <div className="p-8">
              {postSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-lg shadow-green-100">
                    <CheckCircle size={40} className="animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? 'জমা দেওয়া সফল হয়েছে!' : 'Submission Successful!'}</h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                    {isBangla ? 'আপনার বিজ্ঞপ্তিটি রিভিউয়ের জন্য পাঠানো হয়েছে।' : 'Your job post has been sent for review.'}
                  </p>
                  <Button onClick={() => setShowPostModal(false)}>{isBangla ? 'বন্ধ করুন' : 'Close'}</Button>
                </div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">{isBangla ? 'পদের নাম' : 'Job Title'} *</label>
                      <input type="text" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">{isBangla ? 'প্রতিষ্ঠান' : 'Company'} *</label>
                      <input type="text" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{isBangla ? 'বিবরণ' : 'Description'} *</label>
                    <textarea required rows={4} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"></textarea>
                  </div>
                  <Button type="submit" className="w-full">{isBangla ? 'জমা দিন' : 'Submit'}</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div className="flex gap-4">
                 <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 border border-brand-100">
                    <Building2 size={32} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                   <p className="text-gray-600 font-medium text-lg">{selectedJob.company}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto">
               <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? 'বেতন' : 'Salary'}</span>
                       <span className="font-bold text-gray-900 text-sm">{selectedJob.salary}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? 'ধরন' : 'Type'}</span>
                       <span className="font-bold text-gray-900 text-sm">{selectedJob.type}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{isBangla ? 'বিবরণ' : 'Description'}</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{isBangla ? 'দায়িত্বসমূহ' : 'Responsibilities'}</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      {selectedJob.responsibilities.map((res, i) => <li key={i}>{res}</li>)}
                    </ul>
                  </div>
               </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
               <Button variant="outline" onClick={() => setSelectedJob(null)}>{isBangla ? 'বন্ধ করুন' : 'Close'}</Button>
               <Button>{isBangla ? 'আবেদন করুন' : 'Apply Now'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
