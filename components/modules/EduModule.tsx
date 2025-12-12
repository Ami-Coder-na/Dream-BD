
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, MonitorPlay, GraduationCap, BrainCircuit, Search, 
  Download, PlayCircle, Award, ChevronRight, FileText, 
  Briefcase, Lightbulb, Library, Laptop, Trophy, Target,
  Star, User, Calendar, X, Filter, ChevronDown, Book, Eye,
  CheckCircle, Lock, Play, ArrowLeft, RefreshCw, List, 
  HelpCircle, Puzzle, Gamepad2, Timer, Globe, TrendingUp, DollarSign, ArrowRight
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

// --- QUIZ & GAME DATA & ICONS (Reused from previous context) ---
// (Re-declaring necessary icons and data for completeness within this file)
function AtomIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"></circle><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"></path><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"></path></svg>; }
function CalculatorIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>; }
function PaletteIcon({ size = 24, ...props }: IconProps) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.093 0-.679.63-1.219 1.313-1.219h1.093c4.385 0 7.313-4.153 7.313-8.875C22.5 6.5 16.964 2 12 2Z"></path></svg>; }

const QUIZ_LIST = [
  {
    id: 1,
    titleBn: 'সাধারণ জ্ঞান (বাংলাদেশ)',
    titleEn: 'General Knowledge (BD)',
    questions: [
      { qBn: 'বাংলাদেশের জাতীয় প্রতীক কোনটি?', qEn: 'What is the national emblem of Bangladesh?', optionsBn: ['শাপলা', 'ইলিশ', 'রয়েল বেঙ্গল টাইগার', 'দোয়েল'], optionsEn: ['Water Lily', 'Hilsa', 'Royal Bengal Tiger', 'Magpie Robin'], correct: 0 },
      { qBn: 'বাংলাদেশের বিজয় দিবস কবে?', qEn: 'When is the Victory Day of Bangladesh?', optionsBn: ['২১ ফেব্রুয়ারি', '২৬ মার্চ', '১৬ ডিসেম্বর', '১৪ এপ্রিল'], optionsEn: ['21 February', '26 March', '16 December', '14 April'], correct: 2 },
      { qBn: 'মুজিবনগর সরকার কবে গঠিত হয়?', qEn: 'When was the Mujibnagar government formed?', optionsBn: ['১০ এপ্রিল ১৯৭১', '১৭ এপ্রিল ১৯৭১', '২৬ মার্চ ১৯৭১', '১৬ ডিসেম্বর ১৯৭১'], optionsEn: ['10 April 1971', '17 April 1971', '26 March 1971', '16 December 1971'], correct: 0 }
    ]
  },
  {
    id: 2,
    titleBn: 'বিজ্ঞান ও প্রযুক্তি',
    titleEn: 'Science & Tech',
    questions: [
      { qBn: 'পানির রাসায়নিক সংকেত কী?', qEn: 'What is the chemical formula of water?', optionsBn: ['CO2', 'H2O', 'O2', 'NaCl'], optionsEn: ['CO2', 'H2O', 'O2', 'NaCl'], correct: 1 },
      { qBn: 'কম্পিউটারের মস্তিষ্ক কোনটি?', qEn: 'Which is the brain of a computer?', optionsBn: ['RAM', 'Hard Disk', 'CPU', 'Monitor'], optionsEn: ['RAM', 'Hard Disk', 'CPU', 'Monitor'], correct: 2 }
    ]
  }
];

const CARD_IMAGES = [
  { src: <BookOpen size={24} />, id: 1 },
  { src: <Globe size={24} />, id: 2 },
  { src: <Laptop size={24} />, id: 3 },
  { src: <AtomIcon />, id: 4 },
  { src: <CalculatorIcon />, id: 5 },
  { src: <PaletteIcon />, id: 6 },
];

const BOOKS_DB = [
  { id: 101, titleBn: 'আমার বাংলা বই (৫ম শ্রেণি)', titleEn: 'Amar Bangla Boi (Class 5)', author: 'NCTB', level: 'Primary', class: 'Class 5', pages: 120, rating: 4.8, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', descBn: 'পঞ্চম শ্রেণির বাংলা পাঠ্যবই।', descEn: 'Bengali textbook for Class 5.', type: 'NCTB Text', content: 'Content coming soon...' },
  { id: 201, titleBn: 'গণিত (৯ম-১০ম শ্রেণি)', titleEn: 'Mathematics (Class 9-10)', author: 'NCTB', level: 'Secondary', class: 'Class 9-10', pages: 350, rating: 4.9, image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178', descBn: 'নবম ও দশম শ্রেণির আবশ্যিক গণিত।', descEn: 'Compulsory Math for Class 9-10.', type: 'NCTB Text', content: 'Algebra Formulas...' },
  { id: 401, titleBn: 'সাধারণ জ্ঞান ২০২৩', titleEn: 'General Knowledge 2023', author: 'Mp3 Series', level: 'Skill Dev', class: 'General', pages: 200, rating: 4.5, image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d', descBn: 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী।', descEn: 'Bangladesh and International affairs.', type: 'General', content: 'GK Content...' }
];

const SKILL_COURSES = [
  { id: 1, titleBn: 'কম্পিউটার ও ডিজিটাল লিটারেসি', titleEn: 'Computer & Digital Literacy', category: 'Tech', type: 'Free', price: 0, duration: '4 Weeks', lessonsCount: 4, image: 'https://images.unsplash.com/photo-1531297461136-82af022f0b79', descBn: 'ইন্টারনেট ও কম্পিউটার প্রশিক্ষণ।', descEn: 'Internet & Computer training.', curriculum: [{ id: 1, titleBn: 'কম্পিউটার পরিচিতি', titleEn: 'Introduction', content: 'Basic hardware.' }] },
  { id: 2, titleBn: 'স্মার্ট কৃষি ও গবাদিপশু পালন', titleEn: 'Smart Agriculture', category: 'Agri', type: 'Paid', price: 500, duration: '6 Weeks', lessonsCount: 5, image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26', descBn: 'আধুনিক চাষাবাদ পদ্ধতি।', descEn: 'Modern farming methods.', curriculum: [{ id: 1, titleBn: 'মাটি প্রস্তুতি', titleEn: 'Soil Prep', content: 'Testing soil.' }] }
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
  const [interactiveMode, setInteractiveMode] = useState<'menu' | 'quiz_select' | 'quiz_play' | 'game_play'>('menu');
  const [currentQuizId, setCurrentQuizId] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState<any>(null);
  const [choiceTwo, setChoiceTwo] = useState<any>(null);
  const [disabled, setDisabled] = useState(false);
  const [gameWon, setGameWon] = useState(false);

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

  const shuffleCards = () => {
    const shuffledCards = [...CARD_IMAGES, ...CARD_IMAGES]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, uniqueId: Math.random(), matched: false }));
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setGameWon(false);
    setInteractiveMode('game_play');
  };

  const handleCardClick = (card: any) => {
    if (!disabled && !card.matched && card.uniqueId !== choiceOne?.uniqueId) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.id === choiceTwo.id) {
        setCards(prev => prev.map(card => card.id === choiceOne.id ? { ...card, matched: true } : card));
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) setGameWon(true);
  }, [cards]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prev => prev + 1);
    setDisabled(false);
  };

  // --- RENDERERS ---

  const renderInteractive = () => {
    if (interactiveMode === 'menu') {
      return (
        <div className="animate-fade-in space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{isBangla ? 'খেলুন এবং শিখুন' : 'Play & Learn'}</h2>
            <p className="text-gray-500">{isBangla ? 'মেধা যাচাইয়ের জন্য কুইজ এবং গেম' : 'Quizzes and games to test your knowledge'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div onClick={() => setInteractiveMode('quiz_select')} className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
              <HelpCircle size={48} className="mb-4 text-purple-100" />
              <h3 className="text-2xl font-bold mb-2">{isBangla ? 'কুইজ খেলুন' : 'Play Quiz'}</h3>
              <p className="text-purple-100 mb-6 text-sm">{isBangla ? 'সাধারণ জ্ঞান এবং বিজ্ঞান বিষয়ক কুইজ' : 'General knowledge and science quizzes'}</p>
              <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-colors">{isBangla ? 'শুরু করুন' : 'Start Now'}</button>
            </div>
            <div onClick={shuffleCards} className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
              <Gamepad2 size={48} className="mb-4 text-emerald-100" />
              <h3 className="text-2xl font-bold mb-2">{isBangla ? 'মেমোরি গেম' : 'Memory Game'}</h3>
              <p className="text-emerald-100 mb-6 text-sm">{isBangla ? 'আপনার স্মৃতিশক্তি পরীক্ষা করুন' : 'Test your memory power'}</p>
              <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-colors">{isBangla ? 'খেলুন' : 'Play'}</button>
            </div>
          </div>
        </div>
      );
    }
    // ... Quiz and Game logic same as before (omitted slightly for brevity but logic is preserved in helper functions) ...
    if (interactiveMode === 'quiz_select') {
        return (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <button onClick={() => setInteractiveMode('menu')} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600"><ArrowLeft size={18} /> {isBangla ? 'ফিরে যান' : 'Back'}</button>
              <h2 className="text-2xl font-bold mb-6">{isBangla ? 'কুইজ নির্বাচন করুন' : 'Select Quiz'}</h2>
              <div className="grid gap-4">{QUIZ_LIST.map(quiz => (<div key={quiz.id} onClick={() => startQuiz(quiz.id)} className="bg-white p-5 rounded-2xl border hover:shadow-md cursor-pointer flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Target size={24}/></div><div><h3 className="text-lg font-bold">{isBangla ? quiz.titleBn : quiz.titleEn}</h3></div></div><ChevronRight /></div>))}</div>
            </div>
        )
    }
    if (interactiveMode === 'quiz_play') {
        const quiz = QUIZ_LIST.find(q => q.id === currentQuizId);
        if(!quiz) return null;
        if(showQuizResult) return (<div className="text-center py-10 bg-white rounded-3xl shadow-lg border border-gray-100 max-w-xl mx-auto"><Trophy size={64} className="mx-auto text-yellow-500 mb-4"/><h2 className="text-3xl font-bold mb-2">{isBangla ? 'সম্পন্ন!' : 'Completed!'}</h2><p className="text-xl font-bold text-blue-600">Score: {quizScore} / {quiz.questions.length}</p><Button className="mt-6" onClick={() => setInteractiveMode('quiz_select')}>{isBangla ? 'আবার খেলুন' : 'Play Again'}</Button></div>);
        const q = quiz.questions[currentQuestionIdx];
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-6 py-4 flex justify-between"><span className="font-bold text-gray-500">Q {currentQuestionIdx+1} / {quiz.questions.length}</span><span className="font-bold text-blue-600">Score: {quizScore}</span></div>
                <div className="p-8"><h3 className="text-xl font-bold mb-6">{isBangla ? q.qBn : q.qEn}</h3><div className="space-y-3">{(isBangla?q.optionsBn:q.optionsEn).map((opt,i) => (<button key={i} onClick={() => handleAnswerClick(i, q.correct)} className={`w-full text-left p-4 rounded-xl border-2 font-medium flex justify-between ${isAnswerChecked ? (i===q.correct ? 'border-green-500 bg-green-50' : (i===selectedOption ? 'border-red-500 bg-red-50' : 'border-gray-100')) : 'border-gray-100 hover:border-blue-500'}`}>{opt} {isAnswerChecked && i===q.correct && <CheckCircle className="text-green-600"/>}</button>))}</div></div>
                <div className="p-6 border-t flex justify-end"><Button onClick={handleNextQuestion} disabled={!isAnswerChecked}>{isBangla ? 'পরবর্তী' : 'Next'}</Button></div>
            </div>
        )
    }
    if(interactiveMode === 'game_play') {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between mb-6"><button onClick={() => setInteractiveMode('menu')} className="flex items-center gap-2"><ArrowLeft size={18}/> {isBangla?'ফিরে যান':'Back'}</button><div className="flex gap-4"><span className="font-bold bg-white px-4 py-1 rounded-full border">{isBangla?'চাল':'Turns'}: {turns}</span><button onClick={shuffleCards} className="flex items-center gap-2 text-emerald-600 font-bold"><RefreshCw size={16}/> Reset</button></div></div>
                {gameWon && <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold">{isBangla?'অভিনন্দন! আপনি জিতেছেন!':'You Won!'}</div>}
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">{cards.map(card => (<div key={card.uniqueId} onClick={() => handleCardClick(card)} className="aspect-square relative cursor-pointer perspective-1000"><div className={`w-full h-full transition-all duration-500 transform-style-3d ${card === choiceOne || card === choiceTwo || card.matched ? 'rotate-y-180' : ''}`}><div className="absolute inset-0 backface-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center"><Puzzle className="text-white/50"/></div><div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-2 border-emerald-500 rounded-xl flex items-center justify-center text-emerald-600">{card.src}</div></div></div>))}</div>
            </div>
        )
    }
  };

  const renderCareer = () => {
    if (selectedCareer) {
      return (
        <div className="animate-fade-in max-w-5xl mx-auto">
          <button 
            onClick={() => setSelectedCareer(null)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 w-fit"
          >
            <ArrowLeft size={18} /> {isBangla ? 'সব পেশা দেখুন' : 'View All Careers'}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Info Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {React.cloneElement(selectedCareer.icon as React.ReactElement, { size: 40 })}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{isBangla ? selectedCareer.titleBn : selectedCareer.titleEn}</h2>
                <p className="text-gray-600 text-sm mb-6">{isBangla ? selectedCareer.descBn : selectedCareer.descEn}</p>
                
                <div className="space-y-3 text-left">
                  <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">{isBangla ? 'শুরুতে বেতন' : 'Entry Salary'}</span>
                    <span className="font-bold text-gray-800">{selectedCareer.salary.entry}</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 uppercase">{isBangla ? 'মিড লেভেল' : 'Mid Level'}</span>
                    <span className="font-bold text-blue-800">{selectedCareer.salary.mid}</span>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-600 uppercase">{isBangla ? 'সিনিয়র' : 'Senior'}</span>
                    <span className="font-bold text-indigo-800">{selectedCareer.salary.senior}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  {isBangla ? 'প্রয়োজনীয় দক্ষতা' : 'Required Skills'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(isBangla ? selectedCareer.skillsBn : selectedCareer.skillsEn).map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Roadmap */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <TrendingUp className="text-green-600" />
                  {isBangla ? 'ক্যারিয়ার রোডম্যাপ' : 'Career Roadmap'}
                </h3>
                
                <div className="relative pl-8 border-l-2 border-dashed border-gray-200 space-y-10">
                  {selectedCareer.roadmap.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                        {idx + 1}
                      </div>
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
                        <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {isBangla ? step.stepBn : step.stepEn}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {isBangla ? 'পরবর্তী ধাপে যাওয়ার জন্য এটি সম্পন্ন করুন।' : 'Complete this step to move forward.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-6 bg-yellow-50 rounded-2xl border border-yellow-100 text-center">
                  <Lightbulb className="mx-auto text-yellow-600 mb-2" size={24} />
                  <p className="text-yellow-800 font-medium text-sm">
                    {isBangla ? 'পরামর্শ: নিয়মিত নতুন দক্ষতা শিখুন এবং নেটওয়ার্কিং বাড়ান।' : 'Tip: Keep learning new skills and expand your network.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fade-in space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? 'ক্যারিয়ার গাইডলাইন' : 'Career Guidelines'}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla ? 'সঠিক নির্দেশনা এবং রোডম্যাপ অনুসরণ করে আপনার স্বপ্নের পেশা বেছে নিন।' : 'Choose your dream profession following the right guidance and roadmap.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_PATHS.map((career) => (
            <div 
              key={career.id} 
              onClick={() => setSelectedCareer(career)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                {React.cloneElement(career.icon as React.ReactElement, { size: 32 })}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{isBangla ? career.titleBn : career.titleEn}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{isBangla ? career.descBn : career.descEn}</p>
              <span className="mt-auto text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                {isBangla ? 'রোডম্যাপ দেখুন' : 'View Roadmap'} <ArrowRight size={16} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLibrary = () => { /* ... existing ... */ 
    return (
        <div className="space-y-10 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {filteredBooks.slice(0, visibleCount).map(book => (
                <div key={book.id} onClick={() => setSelectedBook(book)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col h-full hover:border-blue-200 cursor-pointer">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-gray-100">
                    <img src={getOptimizedImageUrl(book.image, 300)} alt={book.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  </div>
                  <h4 className="font-bold text-gray-900 text-base line-clamp-2 mb-1 group-hover:text-blue-600">{isBangla ? book.titleBn : book.titleEn}</h4>
                  <div className="mt-auto pt-3 border-t border-gray-50">
                    <button className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2">
                      <BookOpen size={16} /> {isBangla ? 'পড়া শুরু করুন' : 'Start Reading'}
                    </button>
                  </div>
                </div>
             ))}
          </div>
        </div>
    );
  };

  const renderSkills = () => { /* ... existing ... */ 
    return (
        <div className="animate-fade-in space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {SKILL_COURSES.slice(0, visibleSkillCount).map(course => (
               <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col">
                  <div className="relative h-48">
                    <img src={getOptimizedImageUrl(course.image, 600)} className="w-full h-full object-cover" alt="" />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{course.category}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-2">{isBangla ? course.titleBn : course.titleEn}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{isBangla ? course.descBn : course.descEn}</p>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                      <button onClick={() => setActiveCourse(course)} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        {isBangla ? 'শুরু করুন' : 'Start'} <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </div>
    );
  };

  const renderCoursePlayer = () => {
    if (!activeCourse) return null;
    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <button onClick={() => setActiveCourse(null)} className="mb-6 flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 w-fit"><ArrowLeft size={18} /> {isBangla ? 'ফিরে যান' : 'Back'}</button>
            <div className="bg-black rounded-2xl aspect-video flex items-center justify-center text-white">Course Video Placeholder</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/30 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      {activeCourse ? renderCoursePlayer() : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
              <BookOpen size={14} />
              {isBangla ? 'শিক্ষা ও দক্ষতা' : 'Education & Skills'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {isBangla ? 'আগামীর পথে শিক্ষা' : 'Education for Future'}
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {isBangla ? 'পাঠ্যবই থেকে শুরু করে দক্ষতা উন্নয়ন - সবকিছু এক প্ল্যাটফর্মে।' : 'From textbooks to skill development - everything in one platform.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2 hide-scrollbar">
            <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 flex gap-1">
                {['library', 'skills', 'interactive', 'career'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => { setActiveTab(tab as EduTab); setActiveCourse(null); setSelectedCareer(null); }}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        {tab === 'library' && <Library size={16} />}
                        {tab === 'skills' && <Briefcase size={16} />}
                        {tab === 'interactive' && <BrainCircuit size={16} />}
                        {tab === 'career' && <Target size={16} />}
                        {isBangla ? (tab === 'library' ? 'লাইব্রেরি' : tab === 'skills' ? 'দক্ষতা' : tab === 'interactive' ? 'ইন্টারঅ্যাক্টিভ' : 'ক্যারিয়ার') : (tab.charAt(0).toUpperCase() + tab.slice(1))}
                    </button>
                ))}
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
      )}

      {/* Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedBook(null)}>
          <div className="bg-white w-full md:max-w-4xl h-full md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white z-10 shadow-sm">
               <h2 className="text-lg font-bold text-gray-900">{isBangla ? selectedBook.titleBn : selectedBook.titleEn}</h2>
               <button onClick={() => setSelectedBook(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white p-6 md:p-10">
               <div className="max-w-3xl mx-auto prose prose-lg prose-slate font-sans leading-relaxed text-gray-800 whitespace-pre-wrap">
                 {selectedBook.content}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
