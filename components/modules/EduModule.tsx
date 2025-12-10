import React from 'react';
import { BookOpen, PlayCircle, Award, Clock, Users, Search } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const EduModule: React.FC<Props> = ({ isBangla }) => {
  const courses = [
    {
      id: 1,
      title: isBangla ? 'HSC উচ্চতর গণিত' : 'HSC Higher Math',
      instructor: 'Dr. Mizanur Rahman',
      students: 1250,
      lessons: 45,
      progress: 75,
      image: 'https://picsum.photos/400/220?random=20'
    },
    {
      id: 2,
      title: isBangla ? 'ইংরেজি গ্রামার ক্র্যাশ কোর্স' : 'English Grammar Crash Course',
      instructor: 'Sarah Khan',
      students: 3400,
      lessons: 20,
      progress: 30,
      image: 'https://picsum.photos/400/220?random=21'
    },
    {
      id: 3,
      title: isBangla ? 'ওয়েব ডেভেলপমেন্ট' : 'Web Development',
      instructor: 'Creative IT',
      students: 800,
      lessons: 60,
      progress: 0,
      image: 'https://picsum.photos/400/220?random=22'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">
            {isBangla ? 'শিখুন, জানুন, এবং এগিয়ে যান' : 'Learn, Grow, and Succeed'}
          </h2>
          <p className="text-blue-100 max-w-xl mb-6">
            {isBangla 
              ? 'আপনার দক্ষতা বৃদ্ধির জন্য সেরা অনলাইন কোর্সগুলো এখানে পাওয়া যাচ্ছে।' 
              : 'Access top-quality online courses to enhance your skills.'}
          </p>
          <div className="flex gap-2 max-w-md bg-white/10 p-1 rounded-lg border border-white/20 backdrop-blur-sm">
            <Search className="text-white/70 ml-2 mt-2.5" size={20} />
            <input 
              type="text" 
              placeholder={isBangla ? 'কোর্স খুঁজুন...' : 'Search for courses...'}
              className="bg-transparent border-none text-white placeholder-white/60 focus:outline-none w-full p-2"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isBangla ? 'মোট কোর্স' : 'Total Courses', val: '150+', icon: <BookOpen className="text-blue-600" /> },
          { label: isBangla ? 'শিক্ষার্থী' : 'Students', val: '12k+', icon: <Users className="text-purple-600" /> },
          { label: isBangla ? 'ভিডিও লেসন' : 'Video Lessons', val: '5000+', icon: <PlayCircle className="text-red-600" /> },
          { label: isBangla ? 'সার্টিফিকেট' : 'Certificates', val: '8k+', icon: <Award className="text-yellow-600" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.val}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Course List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="text-blue-600" size={24} />
          {isBangla ? 'আপনার কোর্সসমূহ' : 'Your Courses'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="relative">
                <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <PlayCircle size={12} /> {course.lessons} Lessons
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-lg text-gray-900 mb-1">{course.title}</h4>
                <p className="text-sm text-gray-500 mb-4">by {course.instructor}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{isBangla ? 'অগ্রগতি' : 'Progress'}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                  {course.progress > 0 ? (isBangla ? 'চালিয়ে যান' : 'Continue Learning') : (isBangla ? 'শুরু করুন' : 'Start Course')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};