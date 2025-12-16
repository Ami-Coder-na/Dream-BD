
import React, { useState } from 'react';
import { Wrench, PlayCircle, Star, Award, BookOpen, MonitorPlay, Users, X, CheckCircle, FileText, Clock, Play, List } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { User } from '../../types';

interface Props {
  isBangla: boolean;
  user?: User | null;
  onLogin?: () => void;
}

// Mock Syllabus Data generator
const getSyllabus = (courseId: number, isBangla: boolean) => {
  const common = [
    { titleEn: 'Introduction & Tools', titleBn: 'ভূমিকা ও যন্ত্রপাতি পরিচিতি', duration: '15 min' },
    { titleEn: 'Safety Precautions', titleBn: 'নিরাপত্তা সতর্কতা', duration: '10 min' },
    { titleEn: 'Basic Components', titleBn: 'মৌলিক উপাদান', duration: '25 min' },
    { titleEn: 'Practical Demonstration 1', titleBn: 'ব্যাবহারিক ক্লাস ১', duration: '40 min' },
    { titleEn: 'Practical Demonstration 2', titleBn: 'ব্যাবহারিক ক্লাস ২', duration: '45 min' },
    { titleEn: 'Troubleshooting & Repairs', titleBn: 'সমস্যা নির্ণয় ও মেরামত', duration: '50 min' },
    { titleEn: 'Final Project & Assessment', titleBn: 'চূড়ান্ত প্রজেক্ট ও মূল্যায়ন', duration: '60 min' },
  ];
  return common.map((item, idx) => ({ ...item, id: idx + 1, completed: idx === 0 }));
};

export const VocationalModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const { vocationalCourses, enrollCourse } = useData(); // Get enrollCourse function
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  const handleStartCourse = (course: any) => {
    if (!user) {
        if (onLogin) onLogin();
        return;
    }
    // Enroll the user in the course
    enrollCourse({
      ...course,
      enrolledDate: new Date().toLocaleDateString(),
      progress: 10, // Mock progress for demo
      status: 'Ongoing'
    });
    
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

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
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => handleStartCourse(course)}>
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
                  <Button onClick={() => handleStartCourse(course)} className="w-full mt-auto bg-gray-900 hover:bg-amber-600 text-white">
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

      {/* Course Player Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={handleCloseModal}>
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
            
            {/* Left: Video Player */}
            <div className="w-full md:w-2/3 bg-black flex flex-col">
               <div className="relative aspect-video bg-black flex items-center justify-center">
                  {/* Placeholder Video */}
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
               </div>
               <div className="p-6 bg-white flex-1 overflow-y-auto">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded mb-2 inline-block">
                    {selectedCourse.category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isBangla ? selectedCourse.titleBn : selectedCourse.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {isBangla 
                      ? 'এই কোর্সে আপনি ব্যবহারিক জ্ঞানের পাশাপাশি তাত্ত্বিক জ্ঞানও অর্জন করবেন। প্রতিটি ধাপ মনোযোগ দিয়ে দেখুন।' 
                      : 'In this course, you will gain practical knowledge as well as theoretical understanding. Watch every step carefully.'}
                  </p>
               </div>
            </div>

            {/* Right: Syllabus */}
            <div className="w-full md:w-1/3 bg-gray-50 border-l border-gray-200 flex flex-col">
               <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <List size={18} /> {isBangla ? 'কোর্স সিলেবাস' : 'Course Content'}
                  </h3>
                  <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                    <X size={20} />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {getSyllabus(selectedCourse.id, isBangla).map((lesson, idx) => (
                    <div 
                      key={lesson.id} 
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                        lesson.completed 
                          ? 'bg-green-50 border-green-200' 
                          : idx === 1 ? 'bg-white border-amber-400 shadow-sm ring-1 ring-amber-100' // Current
                          : 'bg-white border-gray-200 opacity-70'
                      }`}
                    >
                       <div className="mt-1">
                         {lesson.completed ? (
                           <CheckCircle size={18} className="text-green-600" />
                         ) : idx === 1 ? (
                           <PlayCircle size={18} className="text-amber-600" />
                         ) : (
                           <span className="w-4 h-4 rounded-full border-2 border-gray-300 block"></span>
                         )}
                       </div>
                       <div>
                          <h4 className={`text-sm font-bold ${lesson.completed ? 'text-green-800' : 'text-gray-800'}`}>
                            {isBangla ? lesson.titleBn : lesson.titleEn}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock size={10} /> {lesson.duration}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-4 border-t border-gray-200 bg-white">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    {isBangla ? 'পরবর্তী লেসন' : 'Next Lesson'}
                  </Button>
               </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
