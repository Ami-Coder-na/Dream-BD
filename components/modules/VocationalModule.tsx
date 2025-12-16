
import React from 'react';
import { Wrench, PlayCircle, Star, Award, BookOpen, MonitorPlay, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

export const VocationalModule: React.FC<Props> = ({ isBangla }) => {
  const { vocationalCourses } = useData();

  return (
    <div className="bg-amber-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-200 text-amber-800 text-sm font-bold mb-4">
            <Wrench size={16} />
            {isBangla ? 'কারিগরি শিক্ষা ও দক্ষতা' : 'Vocational & Skills'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'দক্ষতা অর্জন করুন, স্বাবলম্বী হোন' : 'Learn Skills, Be Self-Reliant'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'মোবাইল সার্ভিসিং, সেলাই, ইলেকট্রিক কাজ সহ নানা ট্রেড কোর্স ভিডিও টিউটোরিয়াল ও প্রজেক্টের মাধ্যমে শিখুন।' 
              : 'Learn trades like mobile servicing, sewing, electrical work via video tutorials and projects.'}
          </p>
        </div>

        {/* Featured Courses Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MonitorPlay className="text-amber-600" />
            {isBangla ? 'জনপ্রিয় কোর্সসমূহ' : 'Popular Courses'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vocationalCourses.map((course: any) => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-amber-100 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getOptimizedImageUrl(course.image, 600)} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {course.category}
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {isBangla ? course.titleBn : course.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><BookOpen size={14}/> {course.duration}</span>
                    <span className="flex items-center gap-1 font-bold text-amber-700">৳ {course.fee}</span>
                  </div>
                  <Button className="w-full mt-auto bg-gray-900 hover:bg-amber-600 text-white">
                    {isBangla ? 'কোর্স শুরু করুন' : 'Start Course'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
            <Award className="text-amber-500" />
            {isBangla ? 'সফলতার গল্প' : 'Success Stories'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start p-4 bg-amber-50 rounded-2xl">
               <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="User" className="w-full h-full object-cover" />
               </div>
               <div>
                 <p className="italic text-gray-600 mb-3 text-sm">
                   "{isBangla ? 'মোবাইল সার্ভিসিং শিখে আমি এখন নিজের দোকানে মাসে ২০ হাজার টাকা আয় করছি। ধন্যবাদ ড্রিম বিডি!' : 'After learning mobile servicing, I earn 20k/month from my own shop. Thanks Dream BD!'}"
                 </p>
                 <h5 className="font-bold text-gray-900">{isBangla ? 'করিম মিয়া' : 'Karim Mia'}</h5>
                 <p className="text-xs text-amber-600 font-bold">Entrepreneur, Rangpur</p>
               </div>
            </div>
            <div className="flex gap-4 items-start p-4 bg-amber-50 rounded-2xl">
               <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" alt="User" className="w-full h-full object-cover" />
               </div>
               <div>
                 <p className="italic text-gray-600 mb-3 text-sm">
                   "{isBangla ? 'ঘরে বসেই সেলাই কাজ শিখেছি। এখন অনলাইনের মাধ্যমে অর্ডার নিয়ে কাজ করি।' : 'Learned sewing from home. Now I take orders online.'}"
                 </p>
                 <h5 className="font-bold text-gray-900">{isBangla ? 'নাজমা বেগম' : 'Nazma Begum'}</h5>
                 <p className="text-xs text-amber-600 font-bold">Homemaker, Dhaka</p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
