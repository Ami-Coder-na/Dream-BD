
import React, { useState, useMemo } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search, X, CheckCircle, Calendar, Building2, Filter, ChevronDown, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

type JobCategory = 'Government' | 'Private' | 'NGO' | 'International';
type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Remote';
type JobLevel = 'Entry' | 'Mid' | 'Senior';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  category: JobCategory; // Added category
  type: JobType;
  level: JobLevel;
  posted: string;
  deadline: string;
  description: string;
  responsibilities: string[];
}

export const JobModule: React.FC<Props> = ({ isBangla }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<JobCategory[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<JobLevel[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Expanded Mock Data
  const jobs: Job[] = [
    {
      id: 1,
      title: isBangla ? 'সহকারী পরিচালক' : 'Assistant Director',
      company: isBangla ? 'বাংলাদেশ ব্যাংক' : 'Bangladesh Bank',
      location: isBangla ? 'ঢাকা' : 'Dhaka',
      salary: 'Grade 9',
      category: 'Government',
      type: 'Full Time',
      level: 'Entry',
      posted: '2 days ago',
      deadline: '30 Oct, 2023',
      description: isBangla 
        ? 'বাংলাদেশ ব্যাংক তাদের সাধারণ ব্যাংকিং বিভাগের জন্য সহকারী পরিচালক খুঁজছে।'
        : 'Bangladesh Bank is looking for Assistant Directors for their General Banking division.',
      responsibilities: isBangla 
        ? ['পলিসি তৈরি ও বাস্তবায়ন', 'ব্যাংকিং কার্যক্রম তদারকি', 'রিপোর্ট তৈরি করা']
        : ['Policy formulation and implementation', 'Supervising banking activities', 'Preparing reports']
    },
    {
      id: 2,
      title: isBangla ? 'সফটওয়্যার ইঞ্জিনিয়ার' : 'Software Engineer',
      company: isBangla ? 'পাঠাও' : 'Pathao',
      location: isBangla ? 'ঢাকা' : 'Dhaka',
      salary: '৳ 60,000 - 80,000',
      category: 'Private',
      type: 'Full Time',
      level: 'Mid',
      posted: '1 day ago',
      deadline: '15 Nov, 2023',
      description: isBangla
        ? 'আমরা একজন দক্ষ ফুল-স্ট্যাক ডেভেলপার খুঁজছি যিনি আমাদের কোর টিমে কাজ করবেন।'
        : 'We are looking for a skilled Full-Stack Developer to join our core team.',
      responsibilities: isBangla
        ? ['নতুন ফিচার ডেভেলপ করা', 'কোড অপ্টিমাইজ করা', 'বাগ ফিক্সিং']
        : ['Developing new features', 'Optimizing code', 'Bug fixing']
    },
    {
      id: 3,
      title: isBangla ? 'মাঠ কর্মী' : 'Field Worker',
      company: isBangla ? 'ব্র্যাক' : 'BRAC',
      location: isBangla ? 'রংপুর' : 'Rangpur',
      salary: '৳ 18,000',
      category: 'NGO',
      type: 'Contract',
      level: 'Entry',
      posted: '3 days ago',
      deadline: '20 Nov, 2023',
      description: isBangla
        ? 'গ্রামীণ উন্নয়ন কর্মসূচির জন্য মাঠ পর্যায়ে কাজ করার জন্য কর্মী প্রয়োজন।'
        : 'Field workers needed for rural development programs.',
      responsibilities: isBangla
        ? ['জরিপ পরিচালনা করা', 'তথ্য সংগ্রহ করা', 'সাপ্তাহিক রিপোর্ট জমা দেওয়া']
        : ['Conducting surveys', 'Data collection', 'Submitting weekly reports']
    },
    {
      id: 4,
      title: isBangla ? 'কৃষি কর্মকর্তা' : 'Agriculture Officer',
      company: isBangla ? 'কৃষি সম্প্রসারণ অধিদপ্তর' : 'Dept of Agricultural Extension',
      location: isBangla ? 'রাজশাহী' : 'Rajshahi',
      salary: 'Grade 10',
      category: 'Government',
      type: 'Full Time',
      level: 'Mid',
      posted: '5 days ago',
      deadline: '25 Oct, 2023',
      description: isBangla
        ? 'উপজেলা পর্যায়ে কৃষকদের পরামর্শ প্রদান ও তদারকির জন্য কর্মকর্তা নিয়োগ।'
        : 'Recruitment of officers for advising and supervising farmers at Upazila level.',
      responsibilities: isBangla
        ? ['কৃষকদের প্রশিক্ষণ প্রদান', 'ফসল উৎপাদন তদারকি', 'সরকারি প্রণোদনা বিতরণ']
        : ['Providing training to farmers', 'Monitoring crop production', 'Distributing govt incentives']
    },
    {
      id: 5,
      title: isBangla ? 'গ্রাফিক্স ডিজাইনার' : 'Graphics Designer',
      company: isBangla ? 'ক্রিয়েটিভ আইটি' : 'Creative IT',
      location: isBangla ? 'বাসায় বসে (রিমোট)' : 'Remote',
      salary: '৳ 30,000',
      category: 'Private',
      type: 'Remote',
      level: 'Entry',
      posted: '1 week ago',
      deadline: '10 Nov, 2023',
      description: isBangla
        ? 'সোশ্যাল মিডিয়া কন্টেন্ট তৈরির জন্য একজন সৃজনশীল ডিজাইনার প্রয়োজন।'
        : 'Creative designer needed for creating social media content.',
      responsibilities: isBangla
        ? ['ব্যানার ও পোস্টার ডিজাইন', 'ভিডিও এডিটিং (বেসিক)', 'ব্র্যান্ডিং গাইডলাইন মেনে চলা']
        : ['Designing banners and posters', 'Video editing (basic)', 'Following branding guidelines']
    },
    {
      id: 6,
      title: isBangla ? 'প্রজেক্ট ম্যানেজার' : 'Project Manager',
      company: isBangla ? 'কেয়ার বাংলাদেশ' : 'CARE Bangladesh',
      location: isBangla ? 'চট্টগ্রাম' : 'Chattogram',
      salary: '৳ 90,000',
      category: 'NGO',
      type: 'Contract',
      level: 'Senior',
      posted: '2 weeks ago',
      deadline: '01 Nov, 2023',
      description: isBangla
        ? 'স্বাস্থ্য ও পুষ্টি প্রকল্পের জন্য অভিজ্ঞ প্রজেক্ট ম্যানেজার প্রয়োজন।'
        : 'Experienced Project Manager needed for Health and Nutrition project.',
      responsibilities: isBangla
        ? ['প্রকল্প পরিকল্পনা ও বাস্তবায়ন', 'বাজেট নিয়ন্ত্রণ', 'ডোনার রিপোর্ট তৈরি']
        : ['Project planning and execution', 'Budget control', 'Preparing donor reports']
    }
  ];

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

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

  const getCategoryColor = (cat: JobCategory) => {
    switch (cat) {
      case 'Government': return 'bg-green-100 text-green-800 border-green-200';
      case 'Private': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NGO': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'আপনার স্বপ্নের চাকরি খুঁজুন' : 'Find Your Dream Job'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'সরকারি, বেসরকারি এবং এনজিও - সব ধরনের চাকরির বিশাল সমাহার।' 
              : 'Government, Private, and NGO - A vast collection of all types of jobs.'}
          </p>
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

            {/* Category Filter */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">{isBangla ? 'প্রতিষ্ঠানের ধরন' : 'Job Category'}</h4>
              <div className="space-y-2">
                {[
                  { val: 'Government', label: isBangla ? 'সরকারি চাকরি' : 'Government' },
                  { val: 'Private', label: isBangla ? 'বেসরকারি কোম্পানি' : 'Private Company' },
                  { val: 'NGO', label: isBangla ? 'এনজিও / ডেভেলপমেন্ট' : 'NGO / Development' }
                ].map((cat) => (
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

            {/* Type Filter */}
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

            {/* Experience Level */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">{isBangla ? 'অভিজ্ঞতা' : 'Experience Level'}</h4>
              <div className="space-y-2">
                {[
                  { val: 'Entry', label: isBangla ? 'এন্ট্রি লেভেল (০-২ বছর)' : 'Entry Level' },
                  { val: 'Mid', label: isBangla ? 'মিড লেভেল (৩-৫ বছর)' : 'Mid Level' },
                  { val: 'Senior', label: isBangla ? 'সিনিয়র (৫+ বছর)' : 'Senior Level' }
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
            
            {/* Search Bar */}
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

            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || selectedTypes.length > 0 || selectedLevels.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {[...selectedCategories, ...selectedTypes, ...selectedLevels].map((filter, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100 animate-fade-in">
                    {filter}
                    <button onClick={() => {
                      if (selectedCategories.includes(filter as any)) toggleFilter(filter as any, selectedCategories, setSelectedCategories);
                      if (selectedTypes.includes(filter as any)) toggleFilter(filter as any, selectedTypes, setSelectedTypes);
                      if (selectedLevels.includes(filter as any)) toggleFilter(filter as any, selectedLevels, setSelectedLevels);
                    }} className="hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-gray-500 font-medium">
              {isBangla 
                ? `${filteredJobs.length} টি চাকরি পাওয়া গেছে` 
                : `Showing ${filteredJobs.length} jobs`}
            </p>

            {/* Job List */}
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-200 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    {/* Category Badge */}
                    <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold rounded-bl-xl border-l border-b ${getCategoryColor(job.category)}`}>
                      {job.category === 'Government' ? (isBangla ? 'সরকারি' : 'Government') : 
                       job.category === 'Private' ? (isBangla ? 'বেসরকারি' : 'Private') : 
                       job.category === 'NGO' ? (isBangla ? 'এনজিও' : 'NGO') : job.category}
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

      {/* Job Details Modal - Preserved from previous version but updated UI */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div className="flex gap-4">
                 <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 border border-brand-100">
                    <Building2 size={32} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                   <p className="text-gray-600 font-medium text-lg">{selectedJob.company}</p>
                   <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(selectedJob.category)}`}>
                        {selectedJob.category}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{selectedJob.location}</span>
                   </div>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
               <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? 'বেতন' : 'Salary'}</span>
                       <span className="font-bold text-gray-900 text-sm">{selectedJob.salary}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? 'ধরন' : 'Type'}</span>
                       <span className="font-bold text-gray-900 text-sm">{selectedJob.type}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{isBangla ? 'ডেডলাইন' : 'Deadline'}</span>
                       <span className="font-bold text-gray-900 text-sm">{selectedJob.deadline}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-brand-500 pl-3">
                      {isBangla ? 'চাকরির বিবরণ' : 'Job Description'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-brand-500 pl-3">
                      {isBangla ? 'দায়িত্বসমূহ' : 'Key Responsibilities'}
                    </h3>
                    <ul className="grid grid-cols-1 gap-3">
                      {selectedJob.responsibilities.map((res, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                          <CheckCircle size={18} className="text-brand-600 mt-0.5 shrink-0" />
                          <span className="text-gray-700 text-sm font-medium">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
               <Button variant="outline" onClick={() => setSelectedJob(null)}>
                 {isBangla ? 'বন্ধ করুন' : 'Close'}
               </Button>
               <Button size="lg" className="px-8 shadow-lg shadow-brand-500/20">
                 {isBangla ? 'আবেদন করুন' : 'Apply Now'}
               </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
