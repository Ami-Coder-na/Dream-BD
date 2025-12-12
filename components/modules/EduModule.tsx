
import React, { useState, useMemo, useRef } from 'react';
import { 
  BookOpen, MonitorPlay, GraduationCap, BrainCircuit, Search, 
  Download, PlayCircle, Award, ChevronRight, FileText, 
  Briefcase, Lightbulb, Library, Laptop, Trophy, Target,
  Star, User, Calendar, X, Filter, ChevronDown, Book, Eye,
  CheckCircle, Lock, Play, ArrowLeft, RefreshCw, List
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { User as UserType } from '../../types';

interface Props {
  isBangla: boolean;
  user?: UserType | null;
}

type EduTab = 'library' | 'skills' | 'interactive' | 'career';

// --- GK DATA (100 Questions) ---
const GK_CONTENT_BN = `
১. বাংলাদেশের সাংবিধানিক নাম কী?
উঃ গণপ্রজাতন্ত্রী বাংলাদেশ।

২. বাংলাদেশের ভূখণ্ডের আয়তন কত?
উঃ ১,৪৭,৫৭০ বর্গ কিমি।

৩. বাংলাদেশের সীমান্তবর্তী দেশ কয়টি?
উঃ ২টি (ভারত ও মিয়ানমার)।

৪. বাংলাদেশের মোট সীমান্ত দৈর্ঘ্য কত?
উঃ ৫,১৩৮ কিমি।

৫. ভারতের সাথে বাংলাদেশের সীমান্ত দৈর্ঘ্য কত?
উঃ ৪,১৫৬ কিমি।

৬. মিয়ানমারের সাথে বাংলাদেশের সীমান্ত দৈর্ঘ্য কত?
উঃ ২৭১ কিমি।

৭. বাংলাদেশের উপকূলীয় জেলার সংখ্যা কয়টি?
উঃ ১৯টি।

৮. বাংলাদেশের উষ্ণতম স্থান কোনটি?
উঃ লালপুর, নাটোর।

৯. বাংলাদেশের শীতলতম স্থান কোনটি?
উঃ শ্রীমঙ্গল, মৌলভীবাজার।

১০. বাংলাদেশের সর্বোচ্চ পর্বতশৃঙ্গ কোনটি?
উঃ তাজিংডং (বিজয়)।

১১. কাপ্তাই হ্রদ কোথায় অবস্থিত?
উঃ রাঙ্গামাটি।

১২. চলন বিল কোথায় অবস্থিত?
উঃ পাবনা, নাটোর ও সিরাজগঞ্জ জেলায়।

১৩. বাংলাদেশের বৃহত্তম দ্বীপ কোনটি?
উঃ ভোলা।

১৪. সেন্টমার্টিন দ্বীপের অপর নাম কী?
উঃ নারিকেল জিঞ্জিরা।

১৫. বাংলাদেশের একমাত্র প্রবাল দ্বীপ কোনটি?
উঃ সেন্টমার্টিন।

১৬. পদ্মা নদী কোথায় মেঘনার সাথে মিলিত হয়েছে?
উঃ চাঁদপুরে।

১৭. যমুনা নদী কোথায় পদ্মার সাথে মিলিত হয়েছে?
উঃ গোয়ালন্দ ঘাটে।

১৮. পুরাতন ব্রহ্মপুত্র নদের শাখা নদী কোনটি?
উঃ শীতলক্ষ্যা।

১৯. বঙ্গবন্ধু সেতু কোন নদীর উপর অবস্থিত?
উঃ যমুনা নদী।

২০. পদ্মা সেতুর দৈর্ঘ্য কত?
উঃ ৬.১৫ কিমি।

২১. বাংলাদেশের প্রথম চা বাগান কোথায় প্রতিষ্ঠিত হয়?
উঃ সিলেটের মালনীছড়ায় (১৮৫৪ সালে)।

২২. বাংলাদেশের বৃহত্তম বনাঞ্চল কোনটি?
উঃ সুন্দরবন।

২৩. সুন্দরবনের আয়তন কত?
উঃ প্রায় ১০,০০০ বর্গ কিমি (বাংলাদেশ অংশে ৬,০১৭ বর্গ কিমি)।

২৪. সুন্দরবনকে ওয়ার্ল্ড হেরিটেজ সাইট ঘোষণা করে কোন সংস্থা?
উঃ ইউনেস্কো (১৯৯৭ সালে)।

২৫. বাংলাদেশের জাতীয় প্রতীক কী?
উঃ উভয় পাশে ধানের শীষ বেষ্টিত পানিতে ভাসমান শাপলা।

২৬. বাংলাদেশের জাতীয় ফুল কী?
উঃ শাপলা।

২৭. বাংলাদেশের জাতীয় ফল কী?
উঃ কাঁঠাল।

২৮. বাংলাদেশের জাতীয় মাছ কী?
উঃ ইলিশ।

২৯. বাংলাদেশের জাতীয় পশু কী?
উঃ রয়েল বেঙ্গল টাইগার।

৩০. বাংলাদেশের জাতীয় পাখি কী?
উঃ দোয়েল।

৩১. বাংলাদেশের জাতীয় খেলা কী?
উঃ কাবাডি (হা-ডু-ডু)।

৩২. বাংলাদেশের জাতীয় কবি কে?
উঃ কাজী নজরুল ইসলাম।

৩৩. বাংলাদেশের প্রথম রাষ্ট্রপতি কে ছিলেন?
উঃ বঙ্গবন্ধু শেখ মুজিবুর রহমান।

৩৪. বাংলাদেশের প্রথম প্রধানমন্ত্রী কে ছিলেন?
উঃ তাজউদ্দীন আহমদ।

৩৫. বাংলাদেশের সংবিধান কত সালে গৃহীত হয়?
উঃ ১৯৭২ সালে (৪ নভেম্বর)।

৩৬. সংবিধানের কত নং অনুচ্ছেদে রাষ্ট্রধর্ম ইসলামের কথা বলা হয়েছে?
উঃ ২(ক) নং অনুচ্ছেদে।

৩৭. বাংলাদেশের আইনসভার নাম কী?
উঃ জাতীয় সংসদ।

৩৮. জাতীয় সংসদের মোট আসন সংখ্যা কত?
উঃ ৩৫০টি (৩০০টি নির্বাচিত + ৫০টি সংরক্ষিত মহিলা আসন)।

৩৯. জাতীয় সংসদের প্রতীক কী?
উঃ শাপলা ফুল।

৪০. মুজিবনগর সরকার কবে গঠিত হয়?
উঃ ১০ এপ্রিল ১৯৭১।

৪১. মুজিবনগর সরকার কবে শপথ গ্রহণ করে?
উঃ ১৭ এপ্রিল ১৯৭১।

৪২. বাংলাদেশকে প্রথম স্বীকৃতি প্রদানকারী দেশ কোনটি?
উঃ ভুটান।

৪৩. বীরশ্রেষ্ঠ উপাধি প্রাপ্ত মুক্তিযোদ্ধার সংখ্যা কত?
উঃ ৭ জন।

৪৪. বীর উত্তম খেতাব প্রাপ্ত মুক্তিযোদ্ধার সংখ্যা কত?
উঃ ৬৮ জন।

৪৫. সার্ক (SAARC) এর সদর দপ্তর কোথায়?
উঃ কাঠমান্ডু, নেপাল।

৪৬. জাতিসংঘ (UN) কত সালে প্রতিষ্ঠিত হয়?
উঃ ১৯৪৫ সালে।

৪৭. জাতিসংঘের সদর দপ্তর কোথায়?
উঃ নিউইয়র্ক, যুক্তরাষ্ট্র।

৪৮. বিশ্ব স্বাস্থ্য সংস্থা (WHO) এর সদর দপ্তর কোথায়?
উঃ জেনেভা, সুইজারল্যান্ড।

৪৯. বিশ্বকাপ ফুটবল কত বছর পর পর অনুষ্ঠিত হয়?
উঃ ৪ বছর।

৫০. ক্রিকেটের জনক বলা হয় কোন দেশকে?
উঃ ইংল্যান্ড।

৫১. বাংলাদেশের প্রথম ভূ-উপগ্রহ কেন্দ্র কোথায় স্থাপিত হয়?
উঃ বেতবুনিয়া, রাঙ্গামাটি।

৫২. বঙ্গবন্ধু স্যাটেলাইট-১ কবে উৎক্ষেপণ করা হয়?
উঃ ১১ মে ২০১৮।

৫৩. বাংলাদেশের ইন্টারনেট ডোমেইন কোনটি?
উঃ .bd

৫৪. বাংলাদেশের টাকার নোটে কার স্বাক্ষর থাকে?
উঃ বাংলাদেশ ব্যাংকের গভর্নরের (১ ও ২ টাকার নোট বাদে)।

৫৫. ১ ও ২ টাকার নোটে কার স্বাক্ষর থাকে?
উঃ অর্থ সচিবের।

৫৬. ঢাকা বিশ্ববিদ্যালয় কত সালে প্রতিষ্ঠিত হয়?
উঃ ১৯২১ সালে।

৫৭. কেন্দ্রীয় শহীদ মিনারের স্থপতি কে?
উঃ হামিদুর রহমান।

৫৮. জাতীয় স্মৃতিসৌধের স্থপতি কে?
উঃ সৈয়দ মাইনুল হোসেন।

৫৯. জাতীয় সংসদ ভবনের স্থপতি কে?
উঃ লুই আই কান।

৬০. অপরাজেয় বাংলা ভাস্কর্যটি কোথায় অবস্থিত?
উঃ ঢাকা বিশ্ববিদ্যালয় কলা ভবনের সামনে।

৬১. সাবাস বাংলাদেশ ভাস্কর্যটি কোথায়?
উঃ রাজশাহী বিশ্ববিদ্যালয়ে।

৬২. সংশপ্তক ভাস্কর্যটি কোথায়?
উঃ জাহাঙ্গীরনগর বিশ্ববিদ্যালয়ে।

৬৩. বাংলাদেশের বৃহত্তম স্থলবন্দর কোনটি?
উঃ বেনাপোল।

৬৪. বাংলাদেশের একমাত্র পাহাড়ী দ্বীপ কোনটি?
উঃ মহেশখালী।

৬৫. বাংলাদেশের দীর্ঘতম সমুদ্র সৈকত কোথায়?
উঃ কক্সবাজার।

৬৬. কুয়াকাটা সমুদ্র সৈকত কোন জেলায়?
উঃ পটুয়াখালী।

৬৭. ভবদহ বিল কোথায় অবস্থিত?
উঃ যশোরে।

৬৮. চলন বিলের মধ্য দিয়ে প্রবাহিত নদীর নাম কী?
উঃ আত্রাই।

৬৯. বাংলাদেশের কোন জেলাকে শস্য ভাণ্ডার বলা হয়?
উঃ বরিশাল।

৭০. বাংলাদেশের রুটির ঝুড়ি বলা হয় কোন জেলাকে?
উঃ নওগাঁ।

৭১. চায়ের দেশ বলা হয় কোন জেলাকে?
উঃ মৌলভীবাজার।

৭২. ৩৬০ আউলিয়ার দেশ কোনটি?
উঃ সিলেট।

৭৩. ১২ আউলিয়ার দেশ কোনটি?
উঃ চট্টগ্রাম।

৭৪. হিমছড়ি কোন জেলায় অবস্থিত?
উঃ কক্সবাজার।

৭৫. শুভলং ঝর্ণা কোথায়?
উঃ রাঙ্গামাটি।

৭৬. মাধবকুন্ড জলপ্রপাত কোথায়?
উঃ বড়লেখা, মৌলভীবাজার।

৭৭. বাংলার ভেনিস বলা হয় কাকে?
উঃ বরিশালকে।

৭৮. প্রাচ্যের ডান্ডি বলা হয় কোন জেলাকে?
উঃ নারায়ণগঞ্জ।

৭৯. সাগর কন্যা বলা হয় কোন এলাকাকে?
উঃ কুয়াকাটা।

৮০. ময়নামতি কোথায় অবস্থিত?
উঃ কুমিল্লায়।

৮১. মহাস্থানগড় কোথায় অবস্থিত?
উঃ বগুড়ায়।

৮২. পাহাড়পুর বৌদ্ধ বিহার কোথায়?
উঃ নওগাঁ জেলায়।

৮৩. লালবাগ কেল্লা কে নির্মাণ শুরু করেন?
উঃ শাহজাদা আজম।

৮৪. আহসান মঞ্জিল কোথায় অবস্থিত?
উঃ পুরান ঢাকার ইসলামপুরে (বুড়িগঙ্গা নদীর তীরে)।

৮৫. ষাট গম্বুজ মসজিদ কোথায়?
উঃ বাগেরহাট।

৮৬. সোনা মসজিদ কোথায়?
উঃ চাঁপাইনবাবগঞ্জ।

৮৭. তারা মসজিদ কোথায়?
উঃ আরমানিটোলা, ঢাকা।

৮৮. জাতীয় যাদুঘর কোথায় অবস্থিত?
উঃ শাহবাগ, ঢাকা।

৮৯. মুক্তিযুদ্ধ যাদুঘর কোথায়?
উঃ আগারগাঁও, ঢাকা।

৯০. বরেন্দ্র যাদুঘর কোথায়?
উঃ রাজশাহী।

৯১. বাংলাদেশের বৃহত্তম বিল কোনটি?
উঃ চলন বিল।

৯২. বাংলাদেশের বৃহত্তম হাওড় কোনটি?
উঃ হাকালুকি হাওড়।

৯৩. হালদা ভ্যালি কোথায়?
উঃ খাগড়াছড়ি।

৯৪. নাফ নদী কোথায় অবস্থিত?
উঃ বাংলাদেশ ও মিয়ানমার সীমান্তে।

৯৫. তিন বিঘা করিডোর কোথায়?
উঃ লালমনিরহাট।

৯৬. বাংলা সনের প্রবর্তক কে?
উঃ সম্রাট আকবর।

৯৭. বাংলা নববর্ষ পহেলা বৈশাখ চালু করেন কে?
উঃ সম্রাট আকবর।

৯৮. বাংলাদেশের লোকশিল্প যাদুঘর কোথায়?
উঃ সোনারগাঁও।

৯৯. বাংলাদেশের প্রথম এভারেস্ট জয়ী কে?
উঃ মুসা ইব্রাহীম।

১০০. বাংলাদেশের প্রথম মহিলা এভারেস্ট জয়ী কে?
উঃ নিশাত মজুমদার।
`;

// --- EXPANDED DATA CONSTANTS ---

const BOOKS_DB = [
  // Primary (Class 1-5)
  {
    id: 101,
    titleBn: 'আমার বাংলা বই (৫ম শ্রেণি)',
    titleEn: 'Amar Bangla Boi (Class 5)',
    author: 'NCTB',
    level: 'Primary',
    class: 'Class 5',
    pages: 120,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    descBn: 'পঞ্চম শ্রেণির শিক্ষার্থীদের জন্য জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড কর্তৃক প্রণীত বাংলা পাঠ্যবই।',
    descEn: 'Bengali textbook for Class 5 students developed by NCTB.',
    type: 'NCTB Text',
    content: 'এই বইয়ের ডিজিটাল ভার্সন শীঘ্রই আসছে। আপডেটের জন্য অপেক্ষা করুন...'
  },
  {
    id: 102,
    titleBn: 'প্রাথমিক গণিত (৪র্থ শ্রেণি)',
    titleEn: 'Elementary Math (Class 4)',
    author: 'NCTB',
    level: 'Primary',
    class: 'Class 4',
    pages: 110,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    descBn: 'চতুর্থ শ্রেণির গণিত বই - যোগ, বিয়োগ, গুণ, ভাগ ও জ্যামিতি।',
    descEn: 'Math book for Class 4 covering arithmetic and geometry.',
    type: 'NCTB Text',
    content: 'গণিত অনুশীলন:\n১. যোগ কর: ৪৫০ + ৩২০ = ?\n২. বিয়োগ কর: ৫০০ - ২০০ = ?\n৩. গুণ কর: ১২ x ৫ = ?'
  },
  
  // Secondary (Class 6-10)
  {
    id: 201,
    titleBn: 'গণিত (৯ম-১০ম শ্রেণি)',
    titleEn: 'Mathematics (Class 9-10)',
    author: 'NCTB',
    level: 'Secondary',
    class: 'Class 9-10',
    pages: 350,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178',
    descBn: 'নবম ও দশম শ্রেণির আবশ্যিক গণিত। বীজগণিত, জ্যামিতি ও ত্রিকোণমিতি।',
    descEn: 'Compulsory Math for Class 9-10 including Algebra and Trigonometry.',
    type: 'NCTB Text',
    content: 'বীজগণিত সূত্রাবলী:\n(a+b)² = a² + 2ab + b²\n(a-b)² = a² - 2ab + b²\na² - b² = (a+b)(a-b)'
  },
  
  // Skill & General
  {
    id: 401,
    titleBn: 'সাধারণ জ্ঞান ২০২৩',
    titleEn: 'General Knowledge 2023',
    author: 'Mp3 Series',
    level: 'Skill Dev',
    class: 'General',
    pages: 200,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d',
    descBn: 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী, বিসিএস ও চাকরির প্রস্তুতির জন্য।',
    descEn: 'Bangladesh and International affairs.',
    type: 'General',
    content: GK_CONTENT_BN // Providing rich content here
  },
  {
    id: 402,
    titleBn: 'ফ্রিল্যান্সিং গাইডলাইন',
    titleEn: 'Freelancing Guideline',
    author: 'Jobayer Academy',
    level: 'Skill Dev',
    class: 'Skill',
    pages: 150,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    descBn: 'ঘরে বসে আয়ের পূর্ণাঙ্গ গাইডলাইন।',
    descEn: 'Complete guideline for earning from home.',
    type: 'Tech',
    content: 'ফ্রিল্যান্সিং শুরু করার ধাপসমূহ:\n১. দক্ষতা নির্বাচন করুন (যেমন: গ্রাফিক্স ডিজাইন, ওয়েব ডেভেলপমেন্ট)।\n২. একটি মার্কেটপ্লেস এ প্রোফাইল খুলুন (Upwork, Fiverr)।\n৩. পোর্টফোলিও তৈরি করুন।'
  }
];

const SKILL_COURSES = [
  {
    id: 1,
    titleBn: 'কম্পিউটার ও ডিজিটাল লিটারেসি',
    titleEn: 'Computer & Digital Literacy',
    category: 'Tech',
    type: 'Free',
    price: 0,
    duration: '4 Weeks',
    lessonsCount: 4,
    image: 'https://images.unsplash.com/photo-1531297461136-82af022f0b79',
    descBn: 'ইন্টারনেট ব্যবহার, মোবাইল ব্যাংকিং এবং সরকারি পোর্টাল ব্যবহারের প্রশিক্ষণ।',
    descEn: 'Training on internet usage, mobile banking, and government portals.',
    curriculum: [
      { id: 1, titleBn: 'কম্পিউটার পরিচিতি', titleEn: 'Introduction to Computer', content: 'Basic hardware and software concepts.' },
      { id: 2, titleBn: 'ইন্টারনেট ব্যবহার', titleEn: 'Using the Internet', content: 'Browsing, searching, and safety.' },
      { id: 3, titleBn: 'মাইক্রোসফট অফিস', titleEn: 'Microsoft Office', content: 'Word, Excel, and PowerPoint basics.' },
      { id: 4, titleBn: 'ডিজিটাল ব্যাংকিং', titleEn: 'Digital Banking', content: 'Using bKash, Nagad, and Online Banking.' }
    ]
  },
  {
    id: 2,
    titleBn: 'স্মার্ট কৃষি ও গবাদিপশু পালন',
    titleEn: 'Smart Agriculture & Livestock',
    category: 'Agri',
    type: 'Paid',
    price: 500,
    duration: '6 Weeks',
    lessonsCount: 5,
    image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26',
    descBn: 'আধুনিক চাষাবাদ পদ্ধতি এবং গবাদিপশু পালনের বৈজ্ঞানিক উপায়।',
    descEn: 'Modern farming methods and scientific animal rearing.',
    curriculum: [
      { id: 1, titleBn: 'মাটি প্রস্তুতি', titleEn: 'Soil Preparation', content: 'Testing soil pH and preparation.' },
      { id: 2, titleBn: 'উন্নত বীজ নির্বাচন', titleEn: 'Seed Selection', content: 'Identifying HYV seeds.' },
      { id: 3, titleBn: 'সার ব্যবস্থাপনা', titleEn: 'Fertilizer Management', content: 'Organic and chemical fertilizers.' },
      { id: 4, titleBn: 'রোগ বালাই দমন', titleEn: 'Pest Control', content: 'Integrated Pest Management (IPM).' },
      { id: 5, titleBn: 'ফসল সংগ্রহ', titleEn: 'Harvesting', content: 'Post-harvest technology.' }
    ]
  },
  {
    id: 3,
    titleBn: 'ক্ষুদ্র ব্যবসা ও উদ্যোক্তা',
    titleEn: 'Small Business & Entrepreneurship',
    category: 'Business',
    type: 'Free',
    price: 0,
    duration: '5 Weeks',
    lessonsCount: 3,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
    descBn: 'ব্যবসা পরিকল্পনা, বিপণন এবং আর্থিক ব্যবস্থাপনার গাইডলাইন।',
    descEn: 'Guidelines for business planning, marketing, and financial management.',
    curriculum: [
      { id: 1, titleBn: 'ব্যবসা পরিকল্পনা', titleEn: 'Business Planning', content: 'Creating a lean business model.' },
      { id: 2, titleBn: 'মার্কেটিং কৌশল', titleEn: 'Marketing Strategy', content: 'Digital and offline marketing.' },
      { id: 3, titleBn: 'হিসাবরক্ষণ', titleEn: 'Bookkeeping', content: 'Managing cash flow and profit.' }
    ]
  },
  {
    id: 4,
    titleBn: 'গ্রাফিক্স ডিজাইন ব্যাসিক',
    titleEn: 'Graphics Design Basic',
    category: 'Tech',
    type: 'Paid',
    price: 1200,
    duration: '8 Weeks',
    lessonsCount: 6,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d',
    descBn: 'ফটোশপ এবং ইলাস্ট্রেটর দিয়ে ডিজাইনের হাতেখড়ি।',
    descEn: 'Introduction to design using Photoshop and Illustrator.',
    curriculum: [
      { id: 1, titleBn: 'ফটোশপ পরিচিতি', titleEn: 'Intro to Photoshop', content: 'Tools and workspace.' },
      { id: 2, titleBn: 'লেয়ার ও মাস্কিং', titleEn: 'Layers & Masking', content: 'Editing non-destructively.' },
      { id: 3, titleBn: 'কালার থিওরি', titleEn: 'Color Theory', content: 'Choosing the right palette.' }
    ]
  },
  {
    id: 5,
    titleBn: 'পুকুরে মাছ চাষ',
    titleEn: 'Pond Fish Farming',
    category: 'Agri',
    type: 'Free',
    price: 0,
    duration: '3 Weeks',
    lessonsCount: 4,
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7',
    descBn: 'বৈজ্ঞানিক পদ্ধতিতে পুকুর প্রস্তুত ও মাছ চাষ।',
    descEn: 'Scientific pond preparation and fish cultivation.',
    curriculum: [
      { id: 1, titleBn: 'পুকুর খনন', titleEn: 'Pond Digging', content: 'Size and depth calculation.' },
      { id: 2, titleBn: 'পোনা মজুদ', titleEn: 'Stocking Fingerlings', content: 'Transport and release.' }
    ]
  }
];

const QUIZZES = [
  { id: 1, titleBn: 'সাধারণ বিজ্ঞান', titleEn: 'General Science', questions: 20, time: '15 min' },
  { id: 2, titleBn: 'বাংলাদেশ ও বিশ্ব', titleEn: 'Bangladesh & Global', questions: 25, time: '20 min' },
  { id: 3, titleBn: 'ইংরেজি গ্রামার', titleEn: 'English Grammar', questions: 15, time: '10 min' },
];

const CAREER_GUIDES = [
  { 
    id: 1, 
    type: 'Admission', 
    titleBn: 'বিশ্ববিদ্যালয় ভর্তি গাইড', 
    titleEn: 'University Admission Guide', 
    descBn: 'ঢাকা বিশ্ববিদ্যালয়, বুয়েট এবং মেডিকেলে ভর্তির পূর্ণাঙ্গ প্রস্তুতি।',
    descEn: 'Complete preparation for DU, BUET, and Medical admission.'
  },
  { 
    id: 2, 
    type: 'Scholarship', 
    titleBn: 'উচ্চ শিক্ষার স্কলারশিপ', 
    titleEn: 'Higher Ed Scholarships', 
    descBn: 'বিদেশে উচ্চ শিক্ষার জন্য ফুল-ফ্রি স্কলারশিপের তথ্য।',
    descEn: 'Info on full-free scholarships for higher studies abroad.'
  }
];

export const EduModule: React.FC<Props> = ({ isBangla, user }) => {
  const [activeTab, setActiveTab] = useState<EduTab>('library');
  
  // Library Filter State
  const [libraryCategory, setLibraryCategory] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedBook, setSelectedBook] = useState<typeof BOOKS_DB[0] | null>(null);

  // Skill Course State
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('All');
  const [skillPriceFilter, setSkillPriceFilter] = useState('All');
  const [visibleSkillCount, setVisibleSkillCount] = useState(3);
  
  // Course Player State
  const [activeCourse, setActiveCourse] = useState<typeof SKILL_COURSES[0] | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [playerTab, setPlayerTab] = useState<'overview' | 'reading'>('overview');

  // --- LOGIC ---

  const getBooksByCategory = (category: string) => {
    return BOOKS_DB.filter(b => b.level === category);
  };

  const filteredBooks = useMemo(() => {
    let books = BOOKS_DB;
    if (libraryCategory !== 'All') {
      books = books.filter(b => b.level === libraryCategory);
    }
    if (classFilter !== 'All') {
      books = books.filter(b => b.class === classFilter);
    }
    return books;
  }, [libraryCategory, classFilter]);

  const filteredCourses = useMemo(() => {
    return SKILL_COURSES.filter(course => {
      const matchCat = skillCategoryFilter === 'All' || course.category === skillCategoryFilter;
      const matchPrice = skillPriceFilter === 'All' || course.type === skillPriceFilter;
      return matchCat && matchPrice;
    });
  }, [skillCategoryFilter, skillPriceFilter]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const handleLoadMoreSkills = () => {
    setVisibleSkillCount(prev => prev + 3);
  };

  const resetLibrary = () => {
    setLibraryCategory('All');
    setClassFilter('All');
    setVisibleCount(8);
  };

  const handleStartCourse = (course: typeof SKILL_COURSES[0]) => {
    if (!user) {
      alert(isBangla ? 'কোর্স শুরু করতে অনুগ্রহ করে লগইন করুন।' : 'Please login to start the course.');
      return;
    }
    
    // If Paid, simulate check (in real app, check payment status)
    if (course.type === 'Paid') {
      const confirmBuy = window.confirm(isBangla 
        ? `এটি একটি পেইড কোর্স (৳${course.price})। আপনি কি এনরোল করতে চান?` 
        : `This is a paid course (৳${course.price}). Do you want to enroll?`);
      if (!confirmBuy) return;
    }

    setActiveCourse(course);
    setCurrentLessonIndex(0);
    setShowCertificate(false);
    setPlayerTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextLesson = () => {
    if (!activeCourse) return;
    if (currentLessonIndex < activeCourse.curriculum.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowCertificate(true);
    }
  };

  const handleDownloadCertificate = () => {
    // ... existing certificate logic
    if (!user || !activeCourse) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // ... (rest of certificate drawing code from previous turn)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#2563eb';
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fbbf24';
    ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);
    ctx.font = 'bold 50px serif';
    ctx.fillStyle = '#1e3a8a';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE', canvas.width / 2, 180);
    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('OF COMPLETION', canvas.width / 2, 225);
    ctx.font = 'italic 24px serif';
    ctx.fillStyle = '#374151';
    ctx.fillText('This certificate is proudly presented to', canvas.width / 2, 300);
    ctx.font = 'bold 60px serif';
    ctx.fillStyle = '#1d4ed8';
    ctx.fillText(user.name, canvas.width / 2, 380);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 200, 395);
    ctx.lineTo(canvas.width / 2 + 200, 395);
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText('For successfully completing the course', canvas.width / 2, 450);
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(activeCourse.titleEn, canvas.width / 2, 500);
    const date = new Date().toLocaleDateString();
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`Date: ${date}`, 250, 600);
    ctx.fillText('Dream BD Instructor', 750, 600);
    ctx.beginPath();
    ctx.moveTo(650, 570);
    ctx.lineTo(850, 570);
    ctx.stroke();
    const dataUrl = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Certificate_${user.name.replace(/\s+/g, '_')}_${activeCourse.id}.jpg`;
    link.click();
  };

  // --- RENDER FUNCTIONS ---

  const renderBookCard = (book: typeof BOOKS_DB[0]) => (
    <div key={book.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col h-full hover:border-blue-200">
      <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-gray-100">
        <img 
          src={getOptimizedImageUrl(book.image, 300)} 
          alt={book.titleEn} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded shadow-sm text-blue-700">
            {book.class}
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <h4 className="font-bold text-gray-900 text-base line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {isBangla ? book.titleBn : book.titleEn}
        </h4>
        <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
          <User size={12} /> {book.author}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-50">
          <button 
            onClick={() => setSelectedBook(book)}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95"
          >
            <BookOpen size={16} />
            {isBangla ? 'পড়া শুরু করুন' : 'Start Reading'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderLibrary = () => {
    if (libraryCategory === 'All') {
      const sections = [
        { titleBn: 'প্রাথমিক শিক্ষা (১ম-৫ম)', titleEn: 'Primary Education (1-5)', key: 'Primary' },
        { titleBn: 'মাধ্যমিক শিক্ষা (৬ষ্ঠ-১০ম)', titleEn: 'Secondary Education (6-10)', key: 'Secondary' },
        { titleBn: 'উচ্চ মাধ্যমিক (এইচএসসি)', titleEn: 'Higher Secondary (HSC)', key: 'Higher Secondary' },
        { titleBn: 'দক্ষতা ও সাধারণ জ্ঞান', titleEn: 'Skills & General Knowledge', key: 'Skill Dev' }
      ];

      return (
        <div className="space-y-10 animate-fade-in">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
             {['Primary', 'Secondary', 'Higher Secondary', 'Skill Dev'].map(cat => (
               <button 
                 key={cat}
                 onClick={() => { setLibraryCategory(cat); setVisibleCount(8); }}
                 className="px-6 py-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all font-medium text-sm shadow-sm"
               >
                 {cat}
               </button>
             ))}
          </div>

          {sections.map(section => {
            const sectionBooks = getBooksByCategory(section.key).slice(0, 4);
            if (sectionBooks.length === 0) return null;

            return (
              <div key={section.key}>
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3">
                    {isBangla ? section.titleBn : section.titleEn}
                  </h3>
                  <button 
                    onClick={() => { setLibraryCategory(section.key); setVisibleCount(8); }}
                    className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {isBangla ? 'সব দেখুন' : 'View All'} <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {sectionBooks.map(book => renderBookCard(book))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2">
             <button onClick={resetLibrary} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600">
               <Library size={16} /> {isBangla ? 'লাইব্রেরি' : 'Library'}
             </button>
             <ChevronRight size={16} className="text-gray-300" />
             <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
               {libraryCategory}
             </span>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative">
                <Filter size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <select 
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                >
                  <option value="All">{isBangla ? 'সব ক্লাস' : 'All Classes'}</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9-10">Class 9-10</option>
                  <option value="HSC">HSC</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
             </div>
             <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder={isBangla ? 'বই খুঁজুন...' : 'Search books...'}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>

        {filteredBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredBooks.slice(0, visibleCount).map(book => renderBookCard(book))}
            </div>
            {visibleCount < filteredBooks.length && (
              <div className="flex justify-center pt-6">
                <Button onClick={handleLoadMore} variant="outline" className="px-8 border-blue-200 text-blue-700 hover:bg-blue-50">
                  {isBangla ? 'আরও দেখুন' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
             <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
             <p className="text-gray-500">{isBangla ? 'কোন বই পাওয়া যায়নি' : 'No books found'}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSkills = () => (
    <div className="animate-fade-in space-y-8">
      {/* Existing Skills Render Code */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-3">{isBangla ? 'দক্ষতাই শক্তি' : 'Skills are Power'}</h2>
          <p className="text-blue-100 mb-6">
            {isBangla ? 'কৃষি, প্রযুক্তি এবং ব্যবসায়িক দক্ষতা অর্জন করে নিজেকে স্বাবলম্বী করুন।' : 'Empower yourself with skills in Agriculture, Tech, and Business.'}
          </p>
          <Button className="bg-white text-blue-700 hover:bg-blue-50 border-none">
            {isBangla ? 'কোর্স ক্যাটালগ' : 'Course Catalog'}
          </Button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
          <Laptop size={250} />
        </div>
      </div>
      
      {/* Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCourses.slice(0, visibleSkillCount).map(course => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col">
             <div className="relative h-48">
               <img src={getOptimizedImageUrl(course.image, 600)} className="w-full h-full object-cover" alt="" />
               <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{course.category}</span>
             </div>
             <div className="p-5 flex-1 flex flex-col">
               <h3 className="font-bold text-gray-900 mb-2">{isBangla ? course.titleBn : course.titleEn}</h3>
               <p className="text-sm text-gray-600 mb-4 line-clamp-2">{isBangla ? course.descBn : course.descEn}</p>
               <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Cert. Available</span>
                 <button onClick={() => handleStartCourse(course)} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                   {isBangla ? 'শুরু করুন' : 'Start'} <ChevronRight size={16} />
                 </button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="flex justify-center mb-8 overflow-x-auto pb-2 hide-scrollbar">
      <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-100 flex gap-1">
        <button 
          onClick={() => { setActiveTab('library'); setActiveCourse(null); }}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'library' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Library size={16} />
          {isBangla ? 'লাইব্রেরি' : 'Library'}
        </button>
        <button 
          onClick={() => { setActiveTab('skills'); setActiveCourse(null); }}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'skills' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Briefcase size={16} />
          {isBangla ? 'দক্ষতা' : 'Skills'}
        </button>
        <button 
          onClick={() => { setActiveTab('interactive'); setActiveCourse(null); }}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'interactive' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BrainCircuit size={16} />
          {isBangla ? 'ইন্টারঅ্যাক্টিভ' : 'Interactive'}
        </button>
        <button 
          onClick={() => { setActiveTab('career'); setActiveCourse(null); }}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'career' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Target size={16} />
          {isBangla ? 'ক্যারিয়ার' : 'Career'}
        </button>
      </div>
    </div>
  );

  const renderCoursePlayer = () => {
    if (!activeCourse) return null;
    const currentLesson = activeCourse.curriculum[currentLessonIndex];

    return (
      <div className="max-w-6xl mx-auto animate-fade-in">
        <button 
          onClick={() => setActiveCourse(null)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 w-fit"
        >
          <ArrowLeft size={18} />
          {isBangla ? 'কোর্সে ফিরে যান' : 'Back to Courses'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-black rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                   <h3 className="font-bold text-lg mb-1">{isBangla ? currentLesson.titleBn : currentLesson.titleEn}</h3>
                   <div className="h-1 bg-white/30 rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-blue-500 w-1/3"></div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="flex border-b border-gray-100">
                 <button 
                   onClick={() => setPlayerTab('overview')}
                   className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${playerTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                 >
                   {isBangla ? 'ওভারভিউ' : 'Overview'}
                 </button>
                 <button 
                   onClick={() => setPlayerTab('reading')}
                   className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${playerTab === 'reading' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                 >
                   <span className="flex items-center justify-center gap-2">
                     <FileText size={16} />
                     {isBangla ? 'পড়ুন' : 'Reading'}
                   </span>
                 </button>
               </div>

               <div className="p-6">
                 {playerTab === 'overview' ? (
                   <div className="animate-fade-in">
                     <h2 className="text-2xl font-bold text-gray-900 mb-4">{isBangla ? activeCourse.titleBn : activeCourse.titleEn}</h2>
                     <div className="prose prose-blue max-w-none text-gray-600">
                       <p>{isBangla ? activeCourse.descBn : activeCourse.descEn}</p>
                       
                       <div className="mt-6 grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-xs text-gray-500 uppercase font-bold mb-1">{isBangla ? 'সময়কাল' : 'Duration'}</p>
                             <p className="font-bold text-gray-800">{activeCourse.duration}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-xs text-gray-500 uppercase font-bold mb-1">{isBangla ? 'লেসন সংখ্যা' : 'Lessons'}</p>
                             <p className="font-bold text-gray-800">{activeCourse.lessonsCount}</p>
                          </div>
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-4 text-blue-600">
                        <BookOpen size={20} />
                        <h3 className="text-lg font-bold">{isBangla ? currentLesson.titleBn : currentLesson.titleEn}</h3>
                      </div>
                      <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed">
                        <p className="text-lg">{currentLesson.content}</p>
                        
                        {/* Simulated Extended Content for Reading Experience */}
                        <p>
                          {isBangla 
                            ? 'এই পাঠে আমরা বিস্তারিত আলোচনা করব কীভাবে ধাপে ধাপে এই দক্ষতা অর্জন করা যায়। ভিডিওতে দেখানো বিষয়গুলো নিচে বিস্তারিত লেখা আছে যাতে আপনি পড়ার মাধ্যমেও শিখতে পারেন।'
                            : 'In this lesson, we will discuss in detail how to acquire this skill step by step. The topics shown in the video are written below in detail so that you can also learn by reading.'}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                          <li>{isBangla ? 'মূল ধারণা এবং সংজ্ঞা' : 'Key concepts and definitions'}</li>
                          <li>{isBangla ? 'ব্যবহারিক প্রয়োগ' : 'Practical applications'}</li>
                          <li>{isBangla ? 'সতর্কতা এবং টিপস' : 'Precautions and tips'}</li>
                        </ul>
                        <p className="mt-4">
                          {isBangla
                            ? 'অনুগ্রহ করে ভিডিওটি মনোযোগ দিয়ে দেখুন এবং নিচের কুইজ সেকশন থেকে নিজেকে যাচাই করুন।'
                            : 'Please watch the video carefully and verify yourself from the quiz section below.'}
                        </p>
                      </div>
                   </div>
                 )}
               </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                   <h3 className="font-bold text-gray-900">{isBangla ? 'কোর্স কারিকুলাম' : 'Course Curriculum'}</h3>
                   <p className="text-xs text-gray-500 mt-1">{currentLessonIndex + 1} of {activeCourse.curriculum.length} lessons completed</p>
                </div>
                <div className="divide-y divide-gray-100">
                   {activeCourse.curriculum.map((lesson, idx) => (
                     <div 
                       key={lesson.id}
                       onClick={() => { setCurrentLessonIndex(idx); setShowCertificate(false); }}
                       className={`p-4 flex gap-3 cursor-pointer transition-colors ${
                         idx === currentLessonIndex 
                           ? 'bg-blue-50 border-l-4 border-blue-500' 
                           : 'hover:bg-gray-50'
                       }`}
                     >
                        <div className={`mt-1 ${idx < currentLessonIndex ? 'text-green-500' : idx === currentLessonIndex ? 'text-blue-500' : 'text-gray-300'}`}>
                           {idx < currentLessonIndex ? <CheckCircle size={18} /> : idx === currentLessonIndex ? <PlayCircle size={18} /> : <Lock size={18} />}
                        </div>
                        <div>
                           <h4 className={`text-sm font-bold ${idx === currentLessonIndex ? 'text-blue-700' : 'text-gray-700'}`}>
                             {isBangla ? lesson.titleBn : lesson.titleEn}
                           </h4>
                           <p className="text-xs text-gray-500 mt-1">10 mins</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {showCertificate && (
               <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl p-6 text-white text-center shadow-lg animate-fade-in-up">
                  <Award size={48} className="mx-auto mb-4 text-yellow-100" />
                  <h3 className="text-xl font-bold mb-2">{isBangla ? 'অভিনন্দন!' : 'Congratulations!'}</h3>
                  <p className="text-yellow-100 text-sm mb-6">
                    {isBangla ? 'আপনি কোর্সটি সফলভাবে সম্পন্ন করেছেন।' : 'You have successfully completed the course.'}
                  </p>
                  <Button onClick={handleDownloadCertificate} className="bg-white text-amber-600 hover:bg-amber-50 border-none w-full">
                    {isBangla ? 'সার্টিফিকেট ডাউনলোড' : 'Download Certificate'}
                  </Button>
               </div>
             )}

             {!showCertificate && (
               <Button onClick={handleNextLesson} className="w-full h-12 text-lg shadow-lg shadow-blue-200">
                 {currentLessonIndex < activeCourse.curriculum.length - 1 
                   ? (isBangla ? 'পরবর্তী পাঠ' : 'Next Lesson') 
                   : (isBangla ? 'কোর্স শেষ করুন' : 'Finish Course')}
               </Button>
             )}
          </div>
        </div>
      </div>
    );
  };

  const renderInteractive = () => (
    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
       <BrainCircuit size={48} className="mx-auto text-gray-300 mb-3" />
       <h3 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'কুইজ ও গেম' : 'Quiz & Games'}</h3>
       <p className="text-gray-500">{isBangla ? 'শীঘ্রই আসছে...' : 'Coming soon...'}</p>
    </div>
  );

  const renderCareer = () => (
    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
       <Target size={48} className="mx-auto text-gray-300 mb-3" />
       <h3 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'ক্যারিয়ার গাইডলাইন' : 'Career Guidelines'}</h3>
       <p className="text-gray-500">{isBangla ? 'শীঘ্রই আসছে...' : 'Coming soon...'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50/30 py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      {activeCourse ? (
        renderCoursePlayer()
      ) : (
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
              {isBangla 
                ? 'পাঠ্যবই থেকে শুরু করে দক্ষতা উন্নয়ন - সবকিছু এক প্ল্যাটফর্মে।' 
                : 'From textbooks to skill development - everything in one platform.'}
            </p>
          </div>

          {/* Navigation */}
          {renderTabs()}

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'library' && renderLibrary()}
            {activeTab === 'skills' && renderSkills()}
            {activeTab === 'interactive' && renderInteractive()}
            {activeTab === 'career' && renderCareer()}
          </div>
        </div>
      )}

      {/* --- READER MODAL (Replaces Basic Details Modal) --- */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedBook(null)}>
          <div className="bg-white w-full md:max-w-4xl h-full md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white z-10 shadow-sm">
               <div className="flex items-center gap-3">
                 <button onClick={() => setSelectedBook(null)} className="md:hidden p-2 -ml-2 text-gray-500"><ArrowLeft size={20} /></button>
                 <div>
                   <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                     {isBangla ? selectedBook.titleBn : selectedBook.titleEn}
                   </h2>
                   <p className="text-xs text-gray-500 flex items-center gap-1">
                     <User size={12} /> {selectedBook.author} • {selectedBook.pages} Pages
                   </p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 text-xs">
                   <List size={14} /> {isBangla ? 'সূচিপত্র' : 'Contents'}
                 </Button>
                 <button 
                   onClick={() => setSelectedBook(null)}
                   className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                 >
                   <X size={24} />
                 </button>
               </div>
            </div>

            {/* Reading Content Area */}
            <div className="flex-1 overflow-y-auto bg-white p-6 md:p-10">
               <div className="max-w-3xl mx-auto">
                  {/* Book Cover in Reader (Optional, good for intro) */}
                  <div className="flex justify-center mb-8">
                    <img 
                      src={getOptimizedImageUrl(selectedBook.image, 400)} 
                      alt="Cover" 
                      className="w-48 shadow-lg rounded-md transform hover:scale-105 transition-transform border border-gray-200"
                    />
                  </div>
                  
                  {/* Actual Text Content */}
                  <div className="prose prose-lg prose-slate font-sans leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {selectedBook.content ? selectedBook.content : (isBangla ? 'এই বইয়ের বিষয়বস্তু শীঘ্রই যুক্ত করা হবে।' : 'Content coming soon...')}
                  </div>
               </div>
            </div>

            {/* Footer / Controls */}
            <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center text-sm text-gray-500 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
               <span className="font-medium">Page 1 of {Math.ceil(selectedBook.pages / 20)}</span>
               <div className="flex gap-3">
                 <Button variant="outline" size="sm" className="px-4" disabled>{isBangla ? 'পূর্ববর্তী' : 'Prev'}</Button>
                 <Button variant="outline" size="sm" className="px-4">{isBangla ? 'পরবর্তী' : 'Next'}</Button>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
