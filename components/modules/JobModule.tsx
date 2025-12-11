
import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search, X, CheckCircle, Calendar, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  deadline: string;
  description: string;
  responsibilities: string[];
}

export const JobModule: React.FC<Props> = ({ isBangla }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobs: Job[] = [
    {
      id: 1,
      title: isBangla ? 'কৃষি শ্রমিক প্রয়োজন' : 'Agricultural Worker Needed',
      company: isBangla ? 'গ্রীন ফার্ম এগ্রো' : 'Green Farm Agro',
      location: isBangla ? 'রংপুর' : 'Rangpur',
      salary: '৳ 15,000',
      type: isBangla ? 'ফুল টাইম' : 'Full Time',
      posted: '2 days ago',
      deadline: '30 Oct, 2023',
      description: isBangla 
        ? 'আমরা আমাদের ফার্মের জন্য একজন অভিজ্ঞ এবং পরিশ্রমী কৃষি শ্রমিক খুঁজছি। প্রধান কাজ হবে ধান ও সবজি চাষের দেখাশোনা করা।'
        : 'We are looking for an experienced and hard-working agricultural worker for our farm. Main responsibility will be managing rice and vegetable cultivation.',
      responsibilities: isBangla 
        ? ['নিয়মিত জমিতে পানি দেওয়া ও সার প্রয়োগ', 'ফসল তোলা এবং সংরক্ষণ করা', 'খামারের যন্ত্রপাতি রক্ষণাবেক্ষণ']
        : ['Regular watering and fertilizer application', 'Harvesting and storing crops', 'Maintenance of farm equipment']
    },
    {
      id: 2,
      title: isBangla ? 'হস্তশিল্প কারিগর' : 'Handicraft Artisan',
      company: isBangla ? 'আড়ং বাংলা' : 'Aarong Bangla',
      location: isBangla ? 'ঢাকা' : 'Dhaka',
      salary: '৳ 20,000',
      type: isBangla ? 'চুক্তিভিত্তিক' : 'Contract',
      posted: '5 days ago',
      deadline: '15 Nov, 2023',
      description: isBangla
        ? 'নকশী কাঁথা এবং পাটের পণ্য তৈরিতে দক্ষ কারিগর প্রয়োজন। আমরা ঐতিহ্যবাহী ডিজাইনের উপর গুরুত্ব দিচ্ছি।'
        : 'Skilled artisans needed for making Nakshi Kantha and Jute products. We focus on traditional designs.',
      responsibilities: isBangla
        ? ['উচ্চ মানের সেলাই এবং ডিজাইন করা', 'নতুন পণ্যের নমুনা তৈরি করা', 'কাঁচামাল সঠিকভাবে ব্যবহার করা']
        : ['High-quality stitching and designing', 'Creating samples for new products', 'Efficient use of raw materials']
    },
    {
      id: 3,
      title: isBangla ? 'ডেলিভারি ম্যান' : 'Delivery Man',
      company: isBangla ? 'সুন্দরবন কুরিয়ার' : 'Sundarban Courier',
      location: isBangla ? 'চট্টগ্রাম' : 'Chittagong',
      salary: '৳ 12,000 + Comm',
      type: isBangla ? 'পার্ট টাইম' : 'Part Time',
      posted: '1 week ago',
      deadline: '10 Nov, 2023',
      description: isBangla
        ? 'চট্টগ্রাম শহরের মধ্যে পার্সেল ডেলিভারি করার জন্য লোক প্রয়োজন। নিজস্ব সাইকেল বা বাইক থাকলে অগ্রাধিকার দেওয়া হবে।'
        : 'Personnel needed for parcel delivery within Chittagong city. Priority given to those with own bicycle or bike.',
      responsibilities: isBangla
        ? ['গ্রাহকের ঠিকানায় পণ্য পৌঁছে দেওয়া', 'ক্যাশ অন ডেলিভারি টাকা সংগ্রহ করা', 'ডেলিভারি রিপোর্ট জমা দেওয়া']
        : ['Delivering products to customer addresses', 'Collecting Cash on Delivery payments', 'Submitting delivery reports']
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isBangla ? 'চাকরি খুঁজুন' : 'Find Your Dream Job'}
          </h2>
          <p className="text-gray-500 mb-6">
            {isBangla ? 'হাজার হাজার চাকরির সুযোগ আপনার অপেক্ষায়।' : 'Thousands of job opportunities are waiting for you.'}
          </p>
          <div className="flex flex-col md:flex-row gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder={isBangla ? 'চাকরির পদ বা কোম্পানি খুঁজুন...' : 'Search job titles or companies...'}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
            <Button size="lg">{isBangla ? 'খুঁজুন' : 'Search'}</Button>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 pl-2">
            {isBangla ? 'সাম্প্রতিক নিয়োগ বিজ্ঞপ্তি' : 'Recent Job Postings'}
          </h3>
          {jobs.map(job => (
            <div 
              key={job.id} 
              onClick={() => setSelectedJob(job)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-brand-200 group cursor-pointer relative"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 border border-pink-100 group-hover:bg-pink-100 transition-colors shrink-0">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <MapPin size={14} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <Clock size={14} />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <DollarSign size={14} />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full md:w-auto mt-2 md:mt-0 pointer-events-none">
                  {isBangla ? 'বিস্তারিত দেখুন' : 'View Details'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Details Modal */}
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
                   <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={14}/> {selectedJob.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14}/> {selectedJob.posted}</span>
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
               <div className="space-y-6">
                  {/* Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                       <span className="block text-xs font-bold text-green-600 uppercase mb-1">{isBangla ? 'বেতন' : 'Salary'}</span>
                       <span className="font-bold text-gray-900">{selectedJob.salary}</span>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                       <span className="block text-xs font-bold text-blue-600 uppercase mb-1">{isBangla ? 'চাকরির ধরন' : 'Job Type'}</span>
                       <span className="font-bold text-gray-900">{selectedJob.type}</span>
                    </div>
                    <div className="bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                       <span className="block text-xs font-bold text-orange-600 uppercase mb-1">{isBangla ? 'আবেদনের শেষ সময়' : 'Deadline'}</span>
                       <span className="font-bold text-gray-900 flex items-center gap-1">
                         <Calendar size={14} /> {selectedJob.deadline}
                       </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                      {isBangla ? 'চাকরির বিবরণ' : 'Job Description'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                      {isBangla ? 'দায়িত্বসমূহ' : 'Key Responsibilities'}
                    </h3>
                    <ul className="space-y-3">
                      {selectedJob.responsibilities.map((res, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle size={18} className="text-brand-600 mt-0.5 shrink-0" />
                          <span className="text-gray-700">{res}</span>
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
