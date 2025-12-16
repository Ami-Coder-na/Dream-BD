
import React, { useState, useEffect, useRef } from 'react';
import { Wrench, PlayCircle, Star, Award, BookOpen, MonitorPlay, Users, X, CheckCircle, FileText, Clock, Play, List, Download, Share2, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { User } from '../../types';

interface Props {
  isBangla: boolean;
  user?: User | null;
  onLogin?: () => void;
}

interface SyllabusItem {
  id: number;
  titleEn: string;
  titleBn: string;
  duration: string;
  videoId: string; // Add videoId for functionality
  completed: boolean;
}

// Mock Syllabus Data
const getSyllabusData = (isBangla: boolean): SyllabusItem[] => {
  return [
    { id: 1, titleEn: 'Introduction & Tools', titleBn: 'ভূমিকা ও যন্ত্রপাতি পরিচিতি', duration: '15 min', videoId: 'intro', completed: false },
    { id: 2, titleEn: 'Safety Precautions', titleBn: 'নিরাপত্তা সতর্কতা', duration: '10 min', videoId: 'safety', completed: false },
    { id: 3, titleEn: 'Basic Components', titleBn: 'মৌলিক উপাদান', duration: '25 min', videoId: 'components', completed: false },
    { id: 4, titleEn: 'Practical Demonstration 1', titleBn: 'ব্যাবহারিক ক্লাস ১', duration: '40 min', videoId: 'practical1', completed: false },
    { id: 5, titleEn: 'Practical Demonstration 2', titleBn: 'ব্যাবহারিক ক্লাস ২', duration: '45 min', videoId: 'practical2', completed: false },
    { id: 6, titleEn: 'Troubleshooting & Repairs', titleBn: 'সমস্যা নির্ণয় ও মেরামত', duration: '50 min', videoId: 'repair', completed: false },
    { id: 7, titleEn: 'Final Project & Assessment', titleBn: 'চূড়ান্ত প্রজেক্ট ও মূল্যায়ন', duration: '60 min', videoId: 'final', completed: false },
  ];
};

export const VocationalModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const { vocationalCourses, enrollCourse } = useData();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  
  // Course Player State
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateDataUrl, setCertificateDataUrl] = useState<string | null>(null);

  // Initialize syllabus when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const initialSyllabus = getSyllabusData(isBangla);
      // Mark first as completed for demo logic start
      initialSyllabus[0].completed = true;
      setSyllabus(initialSyllabus);
      setCurrentLessonIdx(0);
    }
  }, [selectedCourse, isBangla]);

  const handleStartCourse = (course: any) => {
    if (!user) {
        if (onLogin) onLogin();
        return;
    }
    enrollCourse({
      ...course,
      enrolledDate: new Date().toLocaleDateString(),
      progress: 0,
      status: 'Ongoing'
    });
    
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowCertificateModal(false);
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLessonIdx(index);
  };

  const handleNextLesson = () => {
    // Mark current as completed
    const updatedSyllabus = [...syllabus];
    updatedSyllabus[currentLessonIdx].completed = true;
    setSyllabus(updatedSyllabus);

    if (currentLessonIdx < syllabus.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
      // Mark next as completed (simulating viewed)
      updatedSyllabus[currentLessonIdx + 1].completed = true; 
    } else {
      // Course Completed
      generateCertificate();
      setShowCertificateModal(true);
    }
  };

  const generateCertificate = () => {
    if (!user || !selectedCourse) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1000, 700);
    gradient.addColorStop(0, "#fffbeb"); // amber-50
    gradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 700);

    // Decorative Border
    ctx.strokeStyle = "#d97706"; // amber-600
    ctx.lineWidth = 20;
    ctx.strokeRect(30, 30, 940, 640);
    
    ctx.strokeStyle = "#111827"; // gray-900
    ctx.lineWidth = 4;
    ctx.strokeRect(55, 55, 890, 590);

    // Corner Ornaments
    ctx.fillStyle = "#d97706";
    ctx.beginPath(); ctx.arc(55, 55, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(945, 55, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(55, 645, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(945, 645, 15, 0, Math.PI * 2); ctx.fill();

    // Content
    ctx.textAlign = "center";
    
    // Header
    ctx.font = "bold 50px serif";
    ctx.fillStyle = "#111827";
    ctx.fillText("CERTIFICATE", 500, 160);
    
    ctx.font = "30px sans-serif";
    ctx.fillStyle = "#d97706";
    ctx.fillText("OF COMPLETION", 500, 200);

    // Body
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#4b5563";
    ctx.fillText("This certificate is proudly presented to", 500, 280);

    // User Name
    ctx.font = "italic bold 60px serif";
    ctx.fillStyle = "#111827";
    ctx.fillText(user.name, 500, 360);
    
    // Underline
    ctx.beginPath();
    ctx.moveTo(300, 375);
    ctx.lineTo(700, 375);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#4b5563";
    ctx.fillText("For successfully completing the vocational course on", 500, 430);

    // Course Name
    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = "#d97706";
    ctx.fillText(isBangla ? selectedCourse.titleBn : selectedCourse.title, 500, 490);

    // Footer
    const date = new Date().toLocaleDateString();
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#111827";
    ctx.fillText(`Date: ${date}`, 250, 600);
    ctx.fillText("Dream BD Authority", 750, 600);

    // Signatures lines
    ctx.beginPath(); ctx.moveTo(150, 570); ctx.lineTo(350, 570); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(650, 570); ctx.lineTo(850, 570); ctx.stroke();

    setCertificateDataUrl(canvas.toDataURL('image/jpeg'));
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

      {/* Course Player Popup */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={handleCloseModal}>
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]" onClick={e => e.stopPropagation()}>
            
            {/* Left: Video Player Area */}
            <div className="w-full md:w-2/3 bg-black flex flex-col relative">
               <div className="relative flex-1 bg-black flex items-center justify-center">
                  {/* Simulated Video Player */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <div className="w-full h-full relative group">
                        {/* Placeholder image that looks like video */}
                        <img 
                          src={getOptimizedImageUrl(selectedCourse.image, 800)} 
                          className="w-full h-full object-cover opacity-60" 
                          alt="Video Placeholder"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <PlayCircle size={80} className="text-white opacity-90 drop-shadow-lg cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                        {/* Fake Controls */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                           <div className="h-full bg-red-600" style={{ width: '35%' }}></div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded inline-block">
                       {selectedCourse.category}
                     </span>
                     <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                        Lesson {currentLessonIdx + 1} of {syllabus.length}
                     </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isBangla ? syllabus[currentLessonIdx]?.titleBn : syllabus[currentLessonIdx]?.titleEn}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {isBangla 
                      ? 'এই কোর্সে আপনি ব্যবহারিক জ্ঞানের পাশাপাশি তাত্ত্বিক জ্ঞানও অর্জন করবেন। প্রতিটি ধাপ মনোযোগ দিয়ে দেখুন।' 
                      : 'In this course, you will gain practical knowledge as well as theoretical understanding. Watch every step carefully.'}
                  </p>
               </div>
            </div>

            {/* Right: Syllabus List */}
            <div className="w-full md:w-1/3 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <List size={18} /> {isBangla ? 'কোর্স সিলেবাস' : 'Course Syllabus'}
                  </h3>
                  <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {syllabus.map((lesson, idx) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => handleLessonSelect(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 group ${
                        idx === currentLessonIdx 
                          ? 'bg-white border-amber-400 shadow-md ring-1 ring-amber-100' // Current
                          : lesson.completed 
                            ? 'bg-green-50 border-green-200' // Completed
                            : 'bg-white border-gray-200 opacity-70 hover:opacity-100 hover:border-amber-200' // Pending
                      }`}
                    >
                       <div className="mt-1 flex-shrink-0">
                         {lesson.completed ? (
                           <CheckCircle size={18} className="text-green-600" />
                         ) : idx === currentLessonIdx ? (
                           <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
                         ) : (
                           <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-amber-400 transition-colors"></div>
                         )}
                       </div>
                       <div>
                          <h4 className={`text-sm font-bold leading-tight mb-1 ${idx === currentLessonIdx ? 'text-amber-800' : lesson.completed ? 'text-green-800' : 'text-gray-700'}`}>
                            {isBangla ? lesson.titleBn : lesson.titleEn}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10} /> {lesson.duration}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-4 border-t border-gray-200 bg-white z-10">
                  <Button 
                    onClick={handleNextLesson} 
                    className={`w-full text-white shadow-lg ${
                      currentLessonIdx === syllabus.length - 1 
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                        : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                    }`}
                  >
                    {currentLessonIdx === syllabus.length - 1 
                      ? (isBangla ? 'সার্টিফিকেট নিন' : 'Claim Certificate') 
                      : (isBangla ? 'পরবর্তী লেসন' : 'Next Lesson')}
                  </Button>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificateModal && certificateDataUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setShowCertificateModal(false)}>
           <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <div className="w-full flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                 <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                   <ShieldCheck className="text-amber-600" />
                   {isBangla ? 'অভিনন্দন! আপনার সার্টিফিকেট' : 'Congratulations! Your Certificate'}
                 </h2>
                 <button onClick={() => setShowCertificateModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
              </div>
              
              <div className="relative w-full aspect-[1.4/1] shadow-2xl mb-6 rounded-lg overflow-hidden border-8 border-amber-50">
                 <img src={certificateDataUrl} alt="Certificate" className="w-full h-full object-contain" />
              </div>

              <div className="flex gap-4 w-full sm:w-auto">
                 <a 
                   href={certificateDataUrl} 
                   download={`Certificate_${user?.name.replace(/\s+/g, '_')}.jpg`}
                   className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-200"
                 >
                   <Download size={20} /> {isBangla ? 'ডাউনলোড করুন' : 'Download'}
                 </a>
                 <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-bold transition-all">
                   <Share2 size={20} /> {isBangla ? 'শেয়ার করুন' : 'Share'}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
