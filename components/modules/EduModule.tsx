
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, MonitorPlay, GraduationCap, BrainCircuit, Search, 
  Download, PlayCircle, Award, ChevronRight, FileText, 
  Briefcase, Lightbulb, Library, Laptop, Trophy, Target,
  Star, User, Calendar, X, Filter, ChevronDown, Book, Eye,
  CheckCircle, Lock, Play, ArrowLeft, RefreshCw, List, 
  HelpCircle, Puzzle, Gamepad2, Timer, Globe, TrendingUp, DollarSign, ArrowRight,
  Flag, Map, Feather, History, Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { User as UserType } from '../../types';

interface Props {
  isBangla: boolean;
  user?: UserType | null;
}

type EduTab = 'library' | 'skills' | 'interactive' | 'career';

// --- CAREER DATA ---
const CAREER_PATHS = [
  {
    id: 1,
    titleBn: 'বিসিএস ক্যাডার (প্রশাসন)',
    titleEn: 'BCS Cadre (Admin)',
    icon: <FlagIcon />,
    descBn: 'বাংলাদেশ সিভিল সার্ভিসের সবচেয়ে সম্মানজনক পেশা।',
    descEn: 'Most prestigious career in Bangladesh Civil Service.',
    roadmap: [
      { stepBn: 'স্নাতক ডিগ্রি (Honours/Degree)', stepEn: 'Bachelor Degree' },
      { stepBn: 'বিসিএস প্রিলিমিনারি প্রস্তুতি', stepEn: 'BCS Preliminary Prep' },
      { stepBn: 'লিখিত পরীক্ষা (৯০০ নম্বর)', stepEn: 'Written Exam (900 Marks)' },
      { stepBn: 'মৌখিক পরীক্ষা (২০০ নম্বর)', stepEn: 'Viva Voce (200 Marks)' },
      { stepBn: 'গেজেট ও যোগদান', stepEn: 'Gazette & Joining' }
    ],
    salary: { entry: '৳ 35k', mid: '৳ 70k', senior: '৳ 1.2L+' },
    skillsBn: ['বাংলা ও ইংরেজি', 'সাধারণ জ্ঞান', 'গাণিতিক যুক্তি', 'নেতৃত্ব', 'ধৈর্য'],
    skillsEn: ['Bangla & English', 'General Knowledge', 'Math Reasoning', 'Leadership', 'Patience']
  },
  {
    id: 2,
    titleBn: 'সফটওয়্যার ইঞ্জিনিয়ার',
    titleEn: 'Software Engineer',
    icon: <CodeIcon />,
    descBn: 'প্রযুক্তি খাতে উচ্চ বেতন ও স্বাধীনতার পেশা।',
    descEn: 'High salary and flexibility in the tech industry.',
    roadmap: [
      { stepBn: 'HSC (বিজ্ঞান বিভাগ)', stepEn: 'HSC (Science)' },
      { stepBn: 'CSE তে বিএসসি ডিগ্রি', stepEn: 'BSc in CSE / IT' },
      { stepBn: 'প্রোগ্রামিং ও প্রজেক্ট তৈরি', stepEn: 'Learn Programming & Build Projects' },
      { stepBn: 'ইন্টার্নশিপ / জুনিয়র জব', stepEn: 'Internship / Junior Role' }
    ],
    salary: { entry: '৳ 40k', mid: '৳ 1.0L', senior: '৳ 3.0L+' },
    skillsBn: ['কোডিং (JS/Python)', 'সমস্যা সমাধান', 'সিস্টেম ডিজাইন', 'টিমওয়ার্ক'],
    skillsEn: ['Coding (JS/Python)', 'Problem Solving', 'System Design', 'Teamwork']
  },
  {
    id: 3,
    titleBn: 'ডাক্তার (এমবিবিএস)',
    titleEn: 'Doctor (MBBS)',
    icon: <StethoscopeIcon />,
    descBn: 'মানবসেবা ও সম্মানের একটি মহান পেশা।',
    descEn: 'Noble profession of serving humanity.',
    roadmap: [
      { stepBn: 'HSC (জীববিজ্ঞান সহ)', stepEn: 'HSC (with Biology)' },
      { stepBn: 'মেডিকেল ভর্তি পরীক্ষা', stepEn: 'Medical Admission Test' },
      { stepBn: '৫ বছর এমবিবিএস কোর্স', stepEn: '5 Years MBBS Course' },
      { stepBn: '১ বছর ইন্টার্নশিপ', stepEn: '1 Year Internship' },
      { stepBn: 'বিসিএস (স্বাস্থ্য) / এফসিপিএস', stepEn: 'BCS (Health) / FCPS' }
    ],
    salary: { entry: '৳ 30k', mid: '৳ 80k', senior: '৳ 2.0L+' },
    skillsBn: ['জীববিজ্ঞান', 'ধৈর্য', 'যোগাযোগ দক্ষতা', 'দ্রুত সিদ্ধান্ত গ্রহণ'],
    skillsEn: ['Biology', 'Patience', 'Communication', 'Quick Decision Making']
  },
  {
    id: 4,
    titleBn: 'ব্যাংকার',
    titleEn: 'Banker',
    icon: <BriefcaseIcon />,
    descBn: 'আর্থিক নিরাপত্তা ও স্থিতিশীল ক্যারিয়ার।',
    descEn: 'Financial security and stable career path.',
    roadmap: [
      { stepBn: 'যেকোনো বিষয়ে স্নাতক', stepEn: 'Bachelor in any subject' },
      { stepBn: 'এমবিএ (ব্যাংকিং/ফিন্যান্স)', stepEn: 'MBA (Banking/Finance)' },
      { stepBn: 'ব্যাংক জব প্রিপারেশন', stepEn: 'Bank Job Preparation' },
      { stepBn: 'ম্যানেজমেন্ট ট্রেইনি অফিসার (MTO)', stepEn: 'Management Trainee Officer (MTO)' }
    ],
    salary: { entry: '৳ 45k', mid: '৳ 90k', senior: '৳ 1.5L+' },
    skillsBn: ['গণিত ও বিশ্লেষণ', 'ইংরেজি', 'কাস্টমার সার্ভিস', 'সততা'],
    skillsEn: ['Math & Analysis', 'English', 'Customer Service', 'Integrity']
  },
  {
    id: 5,
    titleBn: 'ফ্রিল্যান্সার',
    titleEn: 'Freelancer',
    icon: <LaptopIcon />,
    descBn: 'স্বাধীনভাবে কাজ করার ও বৈদেশিক মুদ্রা আয়ের সুযোগ।',
    descEn: 'Freedom to work and earn foreign currency.',
    roadmap: [
      { stepBn: 'নির্দিষ্ট দক্ষতা অর্জন (গ্রাফিক্স/ওয়েব)', stepEn: 'Learn a Skill (Graphics/Web)' },
      { stepBn: 'পোর্টফোলিও তৈরি', stepEn: 'Build Portfolio' },
      { stepBn: 'মার্কেটপ্লেসে একাউন্ট (Fiverr/Upwork)', stepEn: 'Join Marketplace (Fiverr/Upwork)' },
      { stepBn: 'ক্লায়েন্ট কমিউনিকেশন', stepEn: 'Client Communication' }
    ],
    salary: { entry: '৳ 20k', mid: '৳ 60k', senior: '৳ 1.5L+' },
    skillsBn: ['টাইম ম্যানেজমেন্ট', 'ইংরেজি যোগাযোগ', 'টেকনিক্যাল দক্ষতা', 'ধৈর্য'],
    skillsEn: ['Time Management', 'English Comm.', 'Technical Skill', 'Patience']
  },
  {
    id: 6,
    titleBn: 'উদ্যোক্তা',
    titleEn: 'Entrepreneur',
    icon: <LightbulbIcon />,
    descBn: 'নিজস্ব ব্যবসা এবং কর্মসংস্থান তৈরির সুযোগ।',
    descEn: 'Start your own business and create jobs.',
    roadmap: [
      { stepBn: 'আইডিয়া জেনারেশন', stepEn: 'Idea Generation' },
      { stepBn: 'মার্কেট রিসার্চ', stepEn: 'Market Research' },
      { stepBn: 'বিজনেস প্ল্যান ও ফান্ডিং', stepEn: 'Business Plan & Funding' },
      { stepBn: 'প্রোডাক্ট লঞ্চ ও মার্কেটিং', stepEn: 'Product Launch & Marketing' }
    ],
    salary: { entry: 'Risk', mid: 'Unlim.', senior: 'Unlim.' },
    skillsBn: ['ঝুঁকি গ্রহণ', 'নেতৃত্ব', 'বিক্রয় ও বিপণন', 'নেটওয়ার্কিং'],
    skillsEn: ['Risk Taking', 'Leadership', 'Sales & Marketing', 'Networking']
  }
];

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Custom Icons
function FlagIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>; }
function CodeIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>; }
function StethoscopeIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v6"/><path d="M16 15v6"/><circle cx="12" cy="21" r="2"/></svg>; }
function BriefcaseIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
function LaptopIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>; }
function LightbulbIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>; }

// --- QUIZ & GAME DATA ---

const QUIZ_LIST = [
  {
    id: 1,
    titleBn: 'সাধারণ জ্ঞান (বাংলাদেশ)',
    titleEn: 'General Knowledge (BD)',
    icon: <Flag className="text-green-600" size={32} />,
    color: 'bg-green-50 border-green-100',
    questions: [
      { qBn: 'বাংলাদেশের জাতীয় প্রতীক কোনটি?', qEn: 'What is the national emblem of Bangladesh?', optionsBn: ['শাপলা', 'ইলিশ', 'রয়েল বেঙ্গল টাইগার', 'দোয়েল'], optionsEn: ['Water Lily', 'Hilsa', 'Royal Bengal Tiger', 'Magpie Robin'], correct: 0 },
      { qBn: 'বাংলাদেশের বিজয় দিবস কবে?', qEn: 'When is the Victory Day of Bangladesh?', optionsBn: ['২১ ফেব্রুয়ারি', '২৬ মার্চ', '১৬ ডিসেম্বর', '১৪ এপ্রিল'], optionsEn: ['21 February', '26 March', '16 December', '14 April'], correct: 2 },
      { qBn: 'মুজিবনগর সরকার কবে গঠিত হয়?', qEn: 'When was the Mujibnagar government formed?', optionsBn: ['১০ এপ্রিল ১৯৭১', '১৭ এপ্রিল ১৯৭১', '২৬ মার্চ ১৯৭১', '১৬ ডিসেম্বর ১৯৭১'], optionsEn: ['10 April 1971', '17 April 1971', '26 March 1971', '16 December 1971'], correct: 0 },
      { qBn: 'বাংলাদেশের বৃহত্তম দ্বীপ কোনটি?', qEn: 'Which is the largest island of Bangladesh?', optionsBn: ['সেন্ট মার্টিন', 'ভোলা', 'সন্দ্বীপ', 'হাতিয়া'], optionsEn: ['Saint Martin', 'Bhola', 'Sandwip', 'Hatiya'], correct: 1 },
      { qBn: 'বাংলাদেশের জাতীয় খেলা কোনটি?', qEn: 'What is the national sport of Bangladesh?', optionsBn: ['ক্রিকেট', 'ফুটবল', 'কাবাডি', 'হকি'], optionsEn: ['Cricket', 'Football', 'Kabaddi', 'Hockey'], correct: 2 }
    ]
  },
  {
    id: 2,
    titleBn: 'মুক্তিযুদ্ধ ও ইতিহাস',
    titleEn: 'Liberation War & History',
    icon: <History className="text-red-600" size={32} />,
    color: 'bg-red-50 border-red-100',
    questions: [
      { qBn: 'ভাষা আন্দোলন কত সালে হয়েছিল?', qEn: 'In which year did the Language Movement take place?', optionsBn: ['১৯৪৭', '১৯৫২', '১৯৬৯', '১৯৭১'], optionsEn: ['1947', '1952', '1969', '1971'], correct: 1 },
      { qBn: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান কত তারিখে স্বদেশ প্রত্যাবর্তন করেন?', qEn: 'On what date did Bangabandhu Sheikh Mujibur Rahman return to independent Bangladesh?', optionsBn: ['১৬ ডিসেম্বর', '১০ জানুয়ারি', '২৬ মার্চ', '৭ মার্চ'], optionsEn: ['16 December', '10 January', '26 March', '7 March'], correct: 1 },
      { qBn: 'মুক্তিযুদ্ধে বাংলাদেশকে কয়টি সেক্টরে ভাগ করা হয়েছিল?', qEn: 'Into how many sectors was Bangladesh divided during the Liberation War?', optionsBn: ['৭টি', '৯টি', '১১টি', '১৪টি'], optionsEn: ['7', '9', '11', '14'], correct: 2 },
      { qBn: 'শহীদ বুদ্ধিজীবী দিবস কবে?', qEn: 'When is Martyred Intellectuals Day?', optionsBn: ['১৪ ডিসেম্বর', '১৬ ডিসেম্বর', '২১ ফেব্রুয়ারি', '২৬ মার্চ'], optionsEn: ['14 December', '16 December', '21 February', '26 March'], correct: 0 }
    ]
  },
  {
    id: 3,
    titleBn: 'নদ-নদী ও ভূগোল',
    titleEn: 'Rivers & Geography',
    icon: <Map className="text-blue-600" size={32} />,
    color: 'bg-blue-50 border-blue-100',
    questions: [
      { qBn: 'বাংলাদেশের দীর্ঘতম নদী কোনটি?', qEn: 'Which is the longest river in Bangladesh?', optionsBn: ['পদ্মা', 'মেঘনা', 'যমুনা', 'সুরমা'], optionsEn: ['Padma', 'Meghna', 'Jamuna', 'Surma'], correct: 1 },
      { qBn: 'বাংলাদেশের মোট বিভাগ কয়টি?', qEn: 'How many divisions are there in Bangladesh?', optionsBn: ['৬টি', '৭টি', '৮টি', '৯টি'], optionsEn: ['6', '7', '8', '9'], correct: 2 },
      { qBn: 'সুন্দরবন কোন কোন জেলায় অবস্থিত?', qEn: 'In which districts is the Sundarbans located?', optionsBn: ['খুলনা ও বরিশাল', 'খুলনা, সাতক্ষীরা ও বাগেরহাট', 'চট্টগ্রাম ও কক্সবাজার', 'পটুয়াখালী ও বরগুনা'], optionsEn: ['Khulna & Barisal', 'Khulna, Satkhira & Bagerhat', 'Chittagong & Cox\'s Bazar', 'Patuakhali & Barguna'], correct: 1 }
    ]
  },
  {
    id: 4,
    titleBn: 'সাহিত্য ও সংস্কৃতি',
    titleEn: 'Literature & Culture',
    icon: <Feather className="text-purple-600" size={32} />,
    color: 'bg-purple-50 border-purple-100',
    questions: [
      { qBn: 'বাংলাদেশের জাতীয় কবি কে?', qEn: 'Who is the national poet of Bangladesh?', optionsBn: ['রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জসীম উদ্দীন', 'শামসুর রাহমান'], optionsEn: ['Rabindranath Tagore', 'Kazi Nazrul Islam', 'Jasim Uddin', 'Shamsur Rahman'], correct: 1 },
      { qBn: '"আমার সোনার বাংলা" গানটি কে লিখেছেন?', qEn: 'Who wrote the song "Amar Sonar Bangla"?', optionsBn: ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'লালন শাহ', 'জীবনানন্দ দাশ'], optionsEn: ['Kazi Nazrul Islam', 'Rabindranath Tagore', 'Lalon Shah', 'Jibanananda Das'], correct: 1 },
      { qBn: 'পহেলা বৈশাখ কোন মাসের প্রথম দিন?', qEn: 'Pohela Boishakh is the first day of which month?', optionsBn: ['জানুয়ারি', 'বৈশাখ', 'ফাল্গুন', 'চৈত্র'], optionsEn: ['January', 'Boishakh', 'Falgun', 'Chaitra'], correct: 1 }
    ]
  }
];

const BOOKS_DB = [
  { id: 101, titleBn: 'আমার বাংলা বই (৫ম শ্রেণি)', titleEn: 'Amar Bangla Boi (Class 5)', author: 'NCTB', level: 'Primary', class: 'Class 5', pages: 120, rating: 4.8, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', descBn: 'পঞ্চম শ্রেণির বাংলা পাঠ্যবই।', descEn: 'Bengali textbook for Class 5.', type: 'NCTB Text', content: 'Content coming soon...' },
  { id: 201, titleBn: 'গণিত (৯ম-১০ম শ্রেণি)', titleEn: 'Mathematics (Class 9-10)', author: 'NCTB', level: 'Secondary', class: 'Class 9-10', pages: 350, rating: 4.9, image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904', descBn: 'নবম ও দশম শ্রেণির আবশ্যিক গণিত।', descEn: 'Compulsory Math for Class 9-10.', type: 'NCTB Text', content: 'Algebra Formulas...' },
  { id: 401, titleBn: 'সাধারণ জ্ঞান ২০২৩', titleEn: 'General Knowledge 2023', author: 'Mp3 Series', level: 'Skill Dev', class: 'General', pages: 200, rating: 4.5, image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18', descBn: 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী।', descEn: 'Bangladesh and International affairs.', type: 'General', content: 'GK Content...' }
];

const SKILL_COURSES = [
  { id: 1, titleBn: 'কম্পিউটার ও ডিজিটাল লিটারেসি', titleEn: 'Computer & Digital Literacy', category: 'Tech', type: 'Free', price: 0, duration: '4 Weeks', lessonsCount: 4, image: 'https://images.unsplash.com/photo-1531297461136-82af022f0b79', descBn: 'ইন্টারনেট ও কম্পিউটার প্রশিক্ষণ।', descEn: 'Internet & Computer training.', curriculum: [{ id: 1, titleBn: 'কম্পিউটার পরিচিতি', titleEn: 'Introduction', content: 'Basic hardware.' }] },
  { id: 2, titleBn: 'স্মার্ট কৃষি ও গবাদিপশু পালন', titleEn: 'Smart Agriculture', category: 'Agri', type: 'Paid', price: 500, duration: '6 Weeks', lessonsCount: 5, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef', descBn: 'আধুনিক চাষাবাদ পদ্ধতি।', descEn: 'Modern farming methods.', curriculum: [{ id: 1, titleBn: 'মাটি প্রস্তুতি', titleEn: 'Soil Prep', content: 'Testing soil.' }] }
];

export const EduModule: React.FC<Props> = ({ isBangla, user }) => {
  const [activeTab, setActiveTab] = useState<EduTab>('library');
  
  // Library State
  const [libraryCategory, setLibraryCategory] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedBook, setSelectedBook] = useState<typeof BOOKS_DB[0] | null>(null);

  // Skill State
  const [visibleSkillCount, setVisibleSkillCount] = useState(3);
  const [activeCourse, setActiveCourse] = useState<typeof SKILL_COURSES[0] | null>(null);

  // Interactive State
  const [interactiveMode, setInteractiveMode] = useState<'menu' | 'quiz_play'>('menu');
  const [currentQuizId, setCurrentQuizId] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Career State
  const [selectedCareer, setSelectedCareer] = useState<typeof CAREER_PATHS[0] | null>(null);

  // --- HELPERS ---
  const filteredBooks = useMemo(() => {
    let books = BOOKS_DB;
    if (libraryCategory !== 'All') books = books.filter(b => b.level === libraryCategory);
    if (classFilter !== 'All') books = books.filter(b => b.class === classFilter);
    return books;
  }, [libraryCategory, classFilter]);

  // --- INTERACTIVE LOGIC ---
  const startQuiz = (id: number) => {
    setCurrentQuizId(id);
    setCurrentQuestionIdx(0);
    setQuizScore(0);
    setShowQuizResult(false);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setInteractiveMode('quiz_play');
  };

  const handleAnswerClick = (optionIdx: number, correctIdx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(optionIdx);
    setIsAnswerChecked(true);
    if (optionIdx === correctIdx) setQuizScore(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    const activeQuizData = QUIZ_LIST.find(q => q.id === currentQuizId);
    if (!activeQuizData) return;
    if (currentQuestionIdx < activeQuizData.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setShowQuizResult(true);
    }
  };

  // --- RENDERERS ---

  const renderInteractive = () => {
    if (interactiveMode === 'menu') {
      return (
        <div className="animate-fade-in space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{isBangla ? 'খেলুন এবং শিখুন' : 'Play & Learn'}</h2>
            <p className="text-gray-500">{isBangla ? 'মেধা যাচাইয়ের জন্য বিভিন্ন বিষয়ের কুইজ' : 'Quizzes on various topics to test your knowledge'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {QUIZ_LIST.map((quiz) => (
              <div 
                key={quiz.id}
                onClick={() => startQuiz(quiz.id)} 
                className={`rounded-3xl p-6 shadow-sm hover:shadow-lg border-2 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group ${quiz.color.replace('bg-', 'hover:bg-opacity-80 ').replace('border-', 'border-')}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 opacity-20 bg-current`}></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    {quiz.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{isBangla ? quiz.titleBn : quiz.titleEn}</h3>
                    <p className="text-sm text-gray-600">{quiz.questions.length} {isBangla ? 'টি প্রশ্ন' : 'Questions'}</p>
                  </div>
                  <div className="bg-white/50 p-2 rounded-full text-gray-700 hover:bg-white hover:text-blue-600 transition-colors">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (interactiveMode === 'quiz_play') {
        const quiz = QUIZ_LIST.find(q => q.id === currentQuizId);
        if(!quiz) return null;
        
        if(showQuizResult) return (
          <div className="text-center py-12 bg-white rounded-3xl shadow-lg border border-gray-100 max-w-xl mx-auto animate-fade-in">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={48} className="text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{isBangla ? 'অভিনন্দন!' : 'Congratulations!'}</h2>
            <p className="text-xl text-gray-600 mb-6">
              {isBangla ? `আপনার স্কোর: ${quizScore} / ${quiz.questions.length}` : `Your Score: ${quizScore} / ${quiz.questions.length}`}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setInteractiveMode('menu')} variant="outline">{isBangla ? 'মেনুতে ফিরে যান' : 'Back to Menu'}</Button>
              <Button onClick={() => startQuiz(quiz.id)}>{isBangla ? 'আবার খেলুন' : 'Play Again'}</Button>
            </div>
          </div>
        );

        const currentQ = quiz.questions[currentQuestionIdx];

        return (
          <div className="max-w-2xl mx-auto animate-fade-in">
             <div className="mb-6 flex justify-between items-center">
               <button onClick={() => setInteractiveMode('menu')} className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
                 <ArrowLeft size={18} /> {isBangla ? 'ফিরে যান' : 'Back'}
               </button>
               <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                 {currentQuestionIdx + 1} / {quiz.questions.length}
               </span>
             </div>

             <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                <div className="h-2 bg-gray-100 absolute top-0 left-0 right-0">
                   <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-8 mt-2 leading-relaxed">
                  {isBangla ? currentQ.qBn : currentQ.qEn}
                </h3>

                <div className="space-y-3">
                  {(isBangla ? currentQ.optionsBn : currentQ.optionsEn).map((opt, idx) => {
                    let btnClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center ";
                    if (isAnswerChecked) {
                       if (idx === currentQ.correct) btnClass += "bg-green-50 border-green-500 text-green-700";
                       else if (idx === selectedOption) btnClass += "bg-red-50 border-red-500 text-red-700";
                       else btnClass += "bg-gray-50 border-gray-200 text-gray-400";
                    } else {
                       btnClass += "bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700";
                    }

                    return (
                      <button 
                        key={idx} 
                        onClick={() => handleAnswerClick(idx, currentQ.correct)}
                        disabled={isAnswerChecked}
                        className={btnClass}
                      >
                        <span>{opt}</span>
                        {isAnswerChecked && idx === currentQ.correct && <CheckCircle size={20} className="text-green-600" />}
                        {isAnswerChecked && idx === selectedOption && idx !== currentQ.correct && <X size={20} className="text-red-600" />}
                      </button>
                    );
                  })}
                </div>

                {isAnswerChecked && (
                  <div className="mt-8 flex justify-end animate-fade-in-up">
                    <Button onClick={handleNextQuestion} size="lg" className="px-8">
                      {currentQuestionIdx < quiz.questions.length - 1 ? (isBangla ? 'পরবর্তী' : 'Next') : (isBangla ? 'ফলাফল' : 'Finish')} <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </div>
                )}
             </div>
          </div>
        );
    }
    return null;
  };

  const renderCareer = () => {
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Sidebar List */}
           <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{isBangla ? 'জনপ্রিয় ক্যারিয়ার পথ' : 'Popular Career Paths'}</h3>
              {CAREER_PATHS.map(career => (
                <div 
                  key={career.id}
                  onClick={() => setSelectedCareer(career)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center gap-4 ${
                    selectedCareer?.id === career.id 
                      ? 'bg-blue-50 border-blue-500 shadow-sm' 
                      : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                   <div className={`p-2 rounded-lg ${selectedCareer?.id === career.id ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                     {career.icon}
                   </div>
                   <div>
                     <h4 className={`font-bold text-sm ${selectedCareer?.id === career.id ? 'text-blue-800' : 'text-gray-800'}`}>
                       {isBangla ? career.titleBn : career.titleEn}
                     </h4>
                   </div>
                   <ChevronRight size={16} className={`ml-auto ${selectedCareer?.id === career.id ? 'text-blue-500' : 'text-gray-300'}`} />
                </div>
              ))}
           </div>

           {/* Details Panel */}
           <div className="lg:col-span-2">
              {selectedCareer ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
                   <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                      <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        {selectedCareer.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{isBangla ? selectedCareer.titleBn : selectedCareer.titleEn}</h2>
                        <p className="text-gray-600 mt-1">{isBangla ? selectedCareer.descBn : selectedCareer.descEn}</p>
                      </div>
                   </div>

                   {/* Roadmap */}
                   <div className="mb-8">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Map size={16} /> {isBangla ? 'রোডম্যাপ' : 'Roadmap'}
                      </h4>
                      <div className="space-y-0">
                        {selectedCareer.roadmap.map((step, i) => (
                          <div key={i} className="flex gap-4 relative">
                             {/* Connector Line */}
                             {i !== selectedCareer.roadmap.length - 1 && (
                               <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200"></div>
                             )}
                             <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 ring-4 ring-white">
                               {i + 1}
                             </div>
                             <div className="pb-6">
                               <p className="font-bold text-gray-800">{isBangla ? step.stepBn : step.stepEn}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                         <h4 className="text-green-800 font-bold mb-3 flex items-center gap-2"><DollarSign size={16}/> {isBangla ? 'বেতন পরিসীমা' : 'Salary Range'}</h4>
                         <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Entry</span> <span className="font-bold">{selectedCareer.salary.entry}</span></div>
                            <div className="flex justify-between"><span>Mid</span> <span className="font-bold">{selectedCareer.salary.mid}</span></div>
                            <div className="flex justify-between"><span>Senior</span> <span className="font-bold">{selectedCareer.salary.senior}</span></div>
                         </div>
                      </div>
                      <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                         <h4 className="text-purple-800 font-bold mb-3 flex items-center gap-2"><BrainCircuit size={16}/> {isBangla ? 'প্রয়োজনীয় দক্ষতা' : 'Key Skills'}</h4>
                         <div className="flex flex-wrap gap-2">
                            {(isBangla ? selectedCareer.skillsBn : selectedCareer.skillsEn).map((skill, i) => (
                              <span key={i} className="bg-white px-2 py-1 rounded text-xs font-medium text-purple-700 border border-purple-100 shadow-sm">{skill}</span>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 min-h-[300px] border-2 border-dashed border-gray-200 rounded-2xl">
                   <Target size={48} className="mb-4 opacity-50" />
                   <p>{isBangla ? 'বাম পাশ থেকে একটি পেশা নির্বাচন করুন' : 'Select a career path from the left'}</p>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };

  const renderLibrary = () => {
    return (
      <div className="animate-fade-in space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">{isBangla ? 'ই-লাইব্রেরি' : 'E-Library'}</h2>
            <div className="flex gap-2">
               <select 
                 className="bg-white border border-gray-200 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                 onChange={(e) => setLibraryCategory(e.target.value)}
                 value={libraryCategory}
               >
                 <option value="All">{isBangla ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
                 <option value="Primary">{isBangla ? 'প্রাথমিক' : 'Primary'}</option>
                 <option value="Secondary">{isBangla ? 'মাধ্যমিক' : 'Secondary'}</option>
                 <option value="Skill Dev">{isBangla ? 'দক্ষতা উন্নয়ন' : 'Skill Dev'}</option>
               </select>
            </div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredBooks.slice(0, visibleCount).map(book => (
              <div key={book.id} className="group cursor-pointer">
                 <div className="aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden mb-3 relative shadow-md group-hover:shadow-xl transition-all">
                    <img src={book.image} alt={book.titleEn} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">{isBangla ? 'পড়ুন' : 'Read'}</Button>
                    </div>
                 </div>
                 <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                   {isBangla ? book.titleBn : book.titleEn}
                 </h4>
                 <p className="text-xs text-gray-500">{book.author}</p>
              </div>
            ))}
         </div>
      </div>
    );
  };

  const renderSkills = () => {
    return (
      <div className="animate-fade-in space-y-8">
         <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{isBangla ? 'দক্ষতা উন্নয়ন কোর্স' : 'Skill Development Courses'}</h2>
            <p className="text-gray-500">{isBangla ? 'নিজেকে দক্ষ করে তুলুন এবং স্বাবলম্বী হোন' : 'Upskill yourself and become self-reliant'}</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SKILL_COURSES.map(course => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col">
                 <div className="relative h-48 overflow-hidden">
                    <img src={course.image} alt={course.titleEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                       {course.type}
                    </div>
                 </div>
                 <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit mb-2">{course.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{isBangla ? course.titleBn : course.titleEn}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex-1">{isBangla ? course.descBn : course.descEn}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                       <div className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          <Clock size={14}/> {course.duration}
                       </div>
                       <Button size="sm" variant="outline" className="text-xs">{isBangla ? 'বিস্তারিত' : 'Details'}</Button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4">
            <GraduationCap size={16} />
            {isBangla ? 'শিক্ষা ও দক্ষতা' : 'Education & Skills'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'শিখুন, জানুন, এবং এগিয়ে যান' : 'Learn, Grow, and Advance'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'একাডেমিক পড়াশোনা থেকে শুরু করে দক্ষতা উন্নয়ন এবং ক্যারিয়ার গাইডলাইন - সব এক ছাদের নিচে।' 
              : 'From academic studies to skill development and career guidelines - all under one roof.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1">
            <button 
              onClick={() => { setActiveTab('library'); setInteractiveMode('menu'); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'library' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Library size={16} />
              {isBangla ? 'লাইব্রেরি' : 'Library'}
            </button>
            <button 
              onClick={() => { setActiveTab('skills'); setInteractiveMode('menu'); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'skills' ? 'bg-white text-purple-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Laptop size={16} />
              {isBangla ? 'স্কিলস' : 'Skills'}
            </button>
            <button 
              onClick={() => { setActiveTab('interactive'); setInteractiveMode('menu'); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'interactive' ? 'bg-white text-green-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Gamepad2 size={16} />
              {isBangla ? 'কুইজ' : 'Quiz'}
            </button>
            <button 
              onClick={() => { setActiveTab('career'); setInteractiveMode('menu'); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'career' ? 'bg-white text-orange-600 shadow-md' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Briefcase size={16} />
              {isBangla ? 'ক্যারিয়ার' : 'Career'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'library' && renderLibrary()}
          {activeTab === 'skills' && renderSkills()}
          {activeTab === 'interactive' && renderInteractive()}
          {activeTab === 'career' && renderCareer()}
        </div>

      </div>
    </div>
  );
};
