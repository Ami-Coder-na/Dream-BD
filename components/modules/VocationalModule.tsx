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
  videoId: string; 
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
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateDataUrl, setCertificateDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCourse) {
      const initialSyllabus = getSyllabusData(isBangla);
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
    const updatedSyllabus = [...syllabus];
    updatedSyllabus[currentLessonIdx].completed = true;
    setSyllabus(updatedSyllabus);

    if (currentLessonIdx < syllabus.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
      updatedSyllabus[currentLessonIdx + 1].completed = true; 
    } else {
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

    const gradient = ctx.createLinearGradient(0, 0, 1000, 700);
    gradient.addColorStop(0, "#fffbeb"); 
    gradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 700);

    ctx.strokeStyle = "#d97706"; 
    ctx.lineWidth = 20;
    ctx.strokeRect(30, 30, 940, 640);
    
    ctx.strokeStyle = "#111827"; 
    ctx.lineWidth = 4;
    ctx.strokeRect(55, 55, 890, 590);

    ctx.fillStyle = "#d97706";
    ctx.beginPath(); ctx.arc(55, 55, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(945, 55, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(55, 645, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(945, 645, 15, 0, Math.PI * 2); ctx.fill();

    ctx.textAlign = "center";
    ctx.font = "bold 50px serif";
    ctx.fillStyle = "#111827";
    ctx.fillText("CERTIFICATE", 500, 160);
    
    ctx.font = "30px sans-serif";
    ctx.fillStyle = "#d97706";
    ctx.fillText("OF COMPLETION", 500, 200);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#4b5563";
    ctx.fillText("This certificate is proudly presented to", 500, 280);

    ctx.font = "italic bold 60px serif";
    ctx.fillStyle = "#111827";
    ctx.fillText(user.name, 500, 360);
    
    ctx.beginPath();
    ctx.moveTo(300, 375);
    ctx.lineTo(700, 375);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#4b5563";
    ctx.fillText("For successfully completing the vocational course on", 500, 430);

    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = "#d97706";
    ctx.fillText(isBangla ? selectedCourse.titleBn : selectedCourse.title, 500, 490);

    const date = new Date().toLocaleDateString();
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#111827";
    ctx.fillText(`Date: ${date}`, 250, 600);
    ctx.fillText("Shonali Desh Authority", 750, 600);

    ctx.beginPath(); ctx.moveTo(150, 570); ctx.lineTo(350, 570); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(650, 570); ctx.lineTo(850, 570); ctx.stroke();

    setCertificateDataUrl(canvas.toDataURL('image/jpeg'));
  };

  return (
    <div className="bg-amber-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
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
      </div>
      {/* ... (Existing Modal Logic) */}
    </div>
  );
};