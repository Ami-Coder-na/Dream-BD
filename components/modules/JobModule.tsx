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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isBangla ? 'চাকরি খুঁজুন' : 'Find a Job'}
        </h2>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={isBangla ? 'চাকরির পদ বা কোম্পানি খুঁজুন...' : 'Search job titles or companies...'}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>
          <Button>{isBangla ? 'খুঁজুন' : 'Search'}</Button>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <DollarSign size={14} />
                      {job.salary}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {isBangla ? 'আবেদন করুন' : 'Apply Now'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};