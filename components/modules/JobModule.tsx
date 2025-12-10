
import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const JobModule: React.FC<Props> = ({ isBangla }) => {
  const jobs = [
    {
      id: 1,
      title: isBangla ? 'কৃষি শ্রমিক প্রয়োজন' : 'Agricultural Worker Needed',
      company: isBangla ? 'গ্রীন ফার্ম এগ্রো' : 'Green Farm Agro',
      location: isBangla ? 'রংপুর' : 'Rangpur',
      salary: '৳ 15,000',
      type: isBangla ? 'ফুল টাইম' : 'Full Time',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: isBangla ? 'হস্তশিল্প কারিগর' : 'Handicraft Artisan',
      company: isBangla ? 'আড়ং বাংলা' : 'Aarong Bangla',
      location: isBangla ? 'ঢাকা' : 'Dhaka',
      salary: '৳ 20,000',
      type: isBangla ? 'চুক্তিভিত্তিক' : 'Contract',
      posted: '5 days ago'
    },
    {
      id: 3,
      title: isBangla ? 'ডেলিভারি ম্যান' : 'Delivery Man',
      company: isBangla ? 'সুন্দরবন কুরিয়ার' : 'Sundarban Courier',
      location: isBangla ? 'চট্টগ্রাম' : 'Chittagong',
      salary: '৳ 12,000 + Comm',
      type: isBangla ? 'পার্ট টাইম' : 'Part Time',
      posted: '1 week ago'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
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

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 pl-2">
            {isBangla ? 'সাম্প্রতিক নিয়োগ বিজ্ঞপ্তি' : 'Recent Job Postings'}
          </h3>
          {jobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-brand-200 group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 border border-pink-100 group-hover:bg-pink-100 transition-colors">
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
                <Button variant="outline" className="w-full md:w-auto mt-2 md:mt-0">
                  {isBangla ? 'আবেদন করুন' : 'Apply Now'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
