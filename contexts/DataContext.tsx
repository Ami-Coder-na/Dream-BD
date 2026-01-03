
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole } from '../types';

const DataContext = createContext<any>(null);

const getLocal = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  try {
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Normalizers
const normalizeLog = (log: any) => {
  if (!log) return null;
  return {
    id: log.id || Date.now() + Math.random(),
    donorName: log.donorname || log.donorName || log.donor_name || 'Unknown',
    donorPhone: log.donorphone || log.donorPhone || log.donor_phone || 'N/A',
    viewerName: log.viewername || log.viewerName || log.viewer_name || 'Anonymous',
    viewerPhone: log.viewerphone || log.viewerPhone || log.viewer_phone || 'N/A',
    viewerDistrict: log.viewerdistrict || log.viewerDistrict || log.viewer_district || 'Unknown',
    created_at: log.created_at || log.createdat || log.date || new Date().toISOString()
  };
};

const normalizeDistrict = (d: any) => {
  if (!d) return null;
  return {
    id: d.id,
    nameEn: d.nameen || d.nameEn || '',
    nameBn: d.namebn || d.nameBn || '',
    division: d.division || '',
    population: d.population || '',
    area: d.area || '',
    description: d.description || '',
    upazilas: Array.isArray(d.upazilas) ? d.upazilas : [],
    education: d.education || { primary: 0, highSchool: 0, college: 0, university: 0 },
    hospitals: Array.isArray(d.hospitals) ? d.hospitals : [],
    touristSpots: d.touristspots || d.touristSpots || [],
    images: d.images || []
  };
};

const normalizeFaq = (f: any) => ({
  id: f.id,
  questionBn: f.questionbn || f.questionBn || '',
  questionEn: f.questionen || f.questionEn || '',
  answerBn: f.answerbn || f.answerBn || '',
  answerEn: f.answeren || f.answerEn || ''
});

const DEFAULT_FAQS = [
  { id: 1, questionBn: 'কিভাবে একাউন্ট খুলব?', questionEn: 'How to create account?', answerBn: 'রেজিস্ট্রেশন বাটনে ক্লিক করে আপনার তথ্য দিন।', answerEn: 'Click Register and fill out your information.' },
  { id: 2, questionBn: 'পাসওয়ার্ড ভুলে গেছি কি করব?', questionEn: 'Forgot Password?', answerBn: 'লগইন পেজে "পাসওয়ার্ড ভুলে গেছেন" লিঙ্কে ক্লিক করুন।', answerEn: 'Use the "Forgot Password" link on the login page.' },
  { id: 3, questionBn: 'এই অ্যাপটি কি সরকারি?', questionEn: 'Is this a govt app?', answerBn: 'এটি একটি সমন্বিত ডিজিটাল প্ল্যাটফর্ম যা নাগরিকদের বিভিন্ন সেবা সহজে পৌঁছে দেয়।', answerEn: 'It is an integrated digital platform designed to provide easy access to various services for citizens.' },
  { id: 4, questionBn: 'কিভাবে অভিযোগ জানাব?', questionEn: 'How to report an issue?', answerBn: 'বর্জ্য ব্যবস্থাপনা বা অন্যান্য মডিউলের "অভিযোগ জানান" অপশনটি ব্যবহার করুন।', answerEn: 'Use the "Report Issue" option in the Waste Management or other modules.' },
  { id: 5, questionBn: 'চাকরির খবর কোথায় পাব?', questionEn: 'Where to find jobs?', answerBn: 'হোমপেজ বা মেনু থেকে "চাকরি" মডিউলে গেলেই সব আপডেট পাবেন।', answerEn: 'You can find all updates in the "Jobs" module from the homepage or menu.' }
];

const INITIAL_POETS = [
  { id: 1, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'শাহ মুহাম্মদ সগীর', nameEn: 'Shah Muhammad Sagir', birthYear: '১৪শ শতাব্দী', deathYear: '১৫শ শতাব্দী', worksBn: 'ইউসুফ-জুলেখা', worksEn: 'Yusuf-Zulekha', awardsBn: 'রাজকীয় পৃষ্ঠপোষকতা', awardsEn: 'Royal patronage', image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a' },
  { id: 2, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'দৌলত কাজী', nameEn: 'Daulat Qazi', birthYear: '১৬শ শতাব্দী', deathYear: 1638, worksBn: 'সতী ময়না ও লোর-চন্দ্রানী', worksEn: 'Sati Maina', awardsBn: 'আরাকান রাজসভার মর্যাদা', awardsEn: 'Arakan Royal Court honor', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f' },
  { id: 3, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'আলাওল', nameEn: 'Alaol', birthYear: 1607, deathYear: 1680, worksBn: 'পদ্মাবতী, তোহফা', worksEn: 'Padmavati, Tohfa', awardsBn: 'মধ্যযুগের শ্রেষ্ঠ কবি', awardsEn: 'Greatest medieval poet', image: 'https://images.unsplash.com/photo-1457369804593-52c41a4a159e' },
  { id: 4, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'সৈয়দ সুলতান', nameEn: 'Syed Sultan', birthYear: 1550, deathYear: 1648, worksBn: 'নবী বংশ', worksEn: 'Nabi Bangsha', awardsBn: 'মহাকাব্যিক অবদান', awardsEn: 'Epic contribution', image: 'https://images.unsplash.com/photo-1519791823145-803154c79810' },
  { id: 5, sectionBn: 'প্রাচীন ও মধ্যযুগ', sectionEn: 'Ancient & Medieval Era', nameBn: 'আবদুল হাকিম', nameEn: 'Abdul Hakim', birthYear: 1620, deathYear: 1690, worksBn: 'নূরনামা', worksEn: 'Noornama', awardsBn: 'মাতৃভাষা প্রেমের প্রতীক', awardsEn: 'Linguistic patriotism symbol', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353' },
  { id: 6, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'কাজী নজরুল ইসলাম', nameEn: 'Kazi Nazrul Islam', birthYear: 1899, deathYear: 1976, worksBn: 'অগ্নিবীণা, বিষের বাঁশি', worksEn: 'Agni Bina, National Poet', awardsBn: 'স্বাধীনতা পদক, একুশে পদক', awardsEn: 'Independence & Ekushey Padak', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' },
  { id: 7, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'জসীমউদ্দীন', nameEn: 'Jasimuddin', birthYear: 1903, deathYear: 1976, worksBn: 'নকশী কাঁথার মাঠ', worksEn: 'Nakshi Kanthar Math', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1513001900722-370f803f498d' },
  { id: 8, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'ফররুখ আহমদ', nameEn: 'Farrukh Ahmad', birthYear: 1918, deathYear: 1974, worksBn: 'সাত সাগরের মাঝি', worksEn: 'Sat Sagorer Majhi', awardsBn: 'বাংলা একাডেমি পুরস্কার', awardsEn: 'Bangla Academy Award', image: 'https://images.unsplash.com/photo-1491841251912-0708f5146c9a' },
  { id: 9, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'গোলাম মোস্তফা', nameEn: 'Golam Mostafa', birthYear: 1897, deathYear: 1964, worksBn: 'বিশ্বনবী', worksEn: 'Bishonabi', awardsBn: 'সিতারা-ই-ইমতিয়াজ', awardsEn: 'Sitara-i-Imtiaz', image: 'https://images.unsplash.com/photo-1474932430478-3a7fb9082db0' },
  { id: 10, sectionBn: '🌿 আধুনিক যুগের সূচনাপর্ব (১৯০০–১৯৪৭)', sectionEn: 'Early Modern Era (1900–1947)', nameBn: 'সুফিয়া কামাল', nameEn: 'Sufia Kamal', birthYear: 1911, deathYear: 1999, worksBn: 'সাঁঝের মায়া', worksEn: 'Sanjher Maya', awardsBn: 'স্বাধীনতা পদক', awardsEn: 'Independence Award', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f' },
  { id: 11, sectionBn: '🔥 ভাষা আন্দোলন ও উত্তরকাল (১৯৪৭–১৯৭০)', sectionEn: 'Language Movement Era (1947–1970)', nameBn: 'জীবনানন্দ দাশ', nameEn: 'Jibanananda Das', birthYear: 1899, deathYear: 1954, worksBn: 'বনলতা সেন', worksEn: 'Banalata Sen', awardsBn: 'রবীন্দ্র-স্মৃতি পুরস্কার', awardsEn: 'Rabindra Memorial Award', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8' },
  { id: 12, sectionBn: '🔥 ভাষা আন্দোলন ও উত্তরকাল (১৯৪৭–১৯৭০)', sectionEn: 'Language Movement Era (1947–1970)', nameBn: 'বুদ্ধদেব বসু', nameEn: 'Buddhadeb Basu', birthYear: 1908, deathYear: 1974, worksBn: 'তিথিডোর', worksEn: 'Tithidore', awardsBn: 'সাহিত্য অকাদেমি পুরস্কার', awardsEn: 'Sahitya Akademi Award', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66' },
  { id: 13, sectionBn: '🔥 ভাষা আন্দোলন ও উত্তরকাল (১৯৪৭–১৯৭০)', sectionEn: 'Language Movement Era (1947–1970)', nameBn: 'সৈয়দ আলী আহসান', nameEn: 'Syed Ali Ahsan', birthYear: 1922, deathYear: 2002, worksBn: 'একক সন্ধ্যায় বসন্ত', worksEn: 'Selected Poems', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1532012197367-bf455173070b' },
  { id: 14, sectionBn: '🔥 ভাষা আন্দোলন ও উত্তরকাল (১৯৪৭–১৯৭০)', sectionEn: 'Language Movement Era (1947–1970)', nameBn: 'আবু হেনা মোস্তফা কামাল', nameEn: 'Abu Hena Mostafa Kamal', birthYear: 1936, deathYear: 1989, worksBn: 'আপন যৌবন বৈরী', worksEn: 'Apon Joubon Boiri', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1476273170682-98e78ca742ad' },
  { id: 15, sectionBn: '🔥 ভাষা আন্দোলন ও উত্তরকাল (১৯৪৭–১৯৭০)', sectionEn: 'Language Movement Era (1947–1970)', nameBn: 'আহসান হাবীব', nameEn: 'Ahsan Habib', birthYear: 1917, deathYear: 1985, worksBn: 'রাত্রিশেষ', worksEn: 'Ratrishesh', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877' },
  { id: 16, sectionBn: '🔥 ভাষা আন্দোলন ও উত্তরকাল (১৯৪৭–১৯৭০)', sectionEn: 'Language Movement Era (1947–1970)', nameBn: 'শামসুর রাহমান', nameEn: 'Shamsur Rahman', birthYear: 1929, deathYear: 2006, worksBn: 'স্বাধীনতা তুমি', worksEn: 'Freedom Poems', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb' },
  { id: 17, sectionBn: '🔥 ভাষা আন্দোলন ও উত্তরকাল (১৯৪৭–১৯৭০)', sectionEn: 'Language Movement Era (1947–1970)', nameBn: 'আল মাহমুদ', nameEn: 'Al Mahmud', birthYear: 1936, deathYear: 2019, worksBn: 'সোনালী কাবিন', worksEn: 'Sonali Kabin', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d' },
  { id: 18, sectionBn: '🇧🇩 মুক্তিযুদ্ধ ও স্বাধীনতা পরবর্তী যুগ', sectionEn: 'Post-Independence Era', nameBn: 'নির্মলেন্দু গুণ', nameEn: 'Nirmalendu Goon', birthYear: 1945, deathYear: 'জীবিত', worksBn: 'হুলিয়া', worksEn: 'Huliya', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9' },
  { id: 19, sectionBn: '🇧🇩 মুক্তিযুদ্ধ ও স্বাধীনতা পরবর্তী যুগ', sectionEn: 'Post-Independence Era', nameBn: 'মাহমুদুল হক', nameEn: 'Mahmudul Haque', birthYear: 1941, deathYear: 2008, worksBn: 'জীবন আমার বোন', worksEn: 'Jibon Amar Bon', awardsBn: 'বাংলা একাডেমি পুরস্কার', awardsEn: 'Bangla Academy Award', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a' },
  { id: 20, sectionBn: '🇧🇩 মুক্তিযুদ্ধ ও স্বাধীনতা পরবর্তী যুগ', sectionEn: 'Post-Independence Era', nameBn: 'হাসান হাফিজুর রহমান', nameEn: 'Hasan Hafizur Rahman', birthYear: 1932, deathYear: 1983, worksBn: 'বিমুখ প্রান্তর', worksEn: 'Bimukh Prantor', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e' },
  { id: 21, sectionBn: '🇧🇩 মুক্তিযুদ্ধ ও স্বাধীনতা পরবর্তী যুগ', sectionEn: 'Post-Independence Era', nameBn: 'শহীদ কাদরী', nameEn: 'Shahid Qadri', birthYear: 1942, deathYear: 2016, worksBn: 'উত্তরাধিকার', worksEn: 'Uttoradhikar', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1496395039792-664324f114c0' },
  { id: 22, sectionBn: '🇧🇩 মুক্তিযুদ্ধ ও স্বাধীনতা পরবর্তী যুগ', sectionEn: 'Post-Independence Era', nameBn: 'রফিক আজাদ', nameEn: 'Rafiq Azad', birthYear: 1941, deathYear: 2016, worksBn: 'ভাত দে হারামজাদা', worksEn: 'Famous Poems', awardsBn: 'স্বাধীনতা পদক', awardsEn: 'Independence Award', image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843' },
  { id: 23, sectionBn: '🇧🇩 মুক্তিযুদ্ধ ও স্বাধীনতা পরবর্তী যুগ', sectionEn: 'Post-Independence Era', nameBn: 'আবুল হাসান', nameEn: 'Abul Hasan', birthYear: 1947, deathYear: 1975, worksBn: 'রাজা যায় রাজা আসে', worksEn: 'Raja Jay Raja Ashe', awardsBn: 'বাংলা একাডেমি পুরস্কার', awardsEn: 'Bangla Academy Award', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18acc' },
  { id: 24, sectionBn: '🌸 সমকালীন কবি', sectionEn: 'Contemporary Poets', nameBn: 'হেলাল হাফিজ', nameEn: 'Helal Hafiz', birthYear: 1948, deathYear: 'জীবিত', worksBn: 'যে জলে আগুন জ্বলে', worksEn: 'Je Jole Agun Jole', awardsBn: 'বাংলা একাডেমি পুরস্কার', awardsEn: 'Bangla Academy Award', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7' },
  { id: 25, sectionBn: '🌸 সমকালীন কবি', sectionEn: 'Contemporary Poets', nameBn: 'মুহাম্মদ সামাদ', nameEn: 'Muhammad Samad', birthYear: 1956, deathYear: 'জীবিত', worksBn: 'প্রেমের কবিতা', worksEn: 'Selected Poems', awardsBn: 'বাংলা একাডেমি পুরস্কার', awardsEn: 'Bangla Academy Award', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42' },
  { id: 26, sectionBn: '🌸 সমকালীন কবি', sectionEn: 'Contemporary Poets', nameBn: 'রুদ্র মুহাম্মদ শহীদুল্লাহ', nameEn: 'Rudra Mohammad Shahidullah', birthYear: 1956, deathYear: 1991, worksBn: 'উপদ্রুত উপকূল', worksEn: 'Famous Lyrics', awardsBn: 'মুনীর চৌধুরী পুরস্কার', awardsEn: 'Munir Chowdhury Award', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794' },
  { id: 27, sectionBn: '🌸 সমকালীন কবি', sectionEn: 'Contemporary Poets', nameBn: 'মোস্তাফিজ শফি', nameEn: 'Mustafiz Shafi', birthYear: 1970, deathYear: 'জীবিত', worksBn: 'মানুষের মানচিত্র', worksEn: 'Modern Works', awardsBn: 'সাহিত্য সম্মাননা', awardsEn: 'Literary Recognition', image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744' },
  { id: 28, sectionBn: '🌸 সমকালীন কবি', sectionEn: 'Contemporary Poets', nameBn: 'জয় গোস্বামী', nameEn: 'Joy Goswami', birthYear: 1954, deathYear: 'জীবিত', worksBn: 'পাগলী তোমার সঙ্গে', worksEn: 'Influential Poet', awardsBn: 'সাহিত্য অকাদেমি পুরস্কার', awardsEn: 'Sahitya Akademi Award', image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff' },
  { id: 29, sectionBn: '🌸 সমকালীন কবি', sectionEn: 'Contemporary Poets', nameBn: 'শঙ্খ ঘোষ', nameEn: 'Sankha Ghosh', birthYear: 1932, deathYear: 2021, worksBn: 'বাবরের প্রার্থনা', worksEn: 'Bengali Intellectual', awardsBn: 'জ্ঞানপীঠ পুরস্কার', awardsEn: 'Jnanpith Award', image: 'https://images.unsplash.com/photo-1457369804593-52c41a4a159e' },
  { id: 30, sectionBn: '📚 কথাসাহিত্যিক (লেখক/ঔপন্যাসিক)', sectionEn: 'Prose Writers & Novelists', nameBn: 'রবীন্দ্রনাথ ঠাকুর', nameEn: 'Rabindranath Tagore', birthYear: 1861, deathYear: 1941, worksBn: 'গীতাঞ্জলি, গোরা', worksEn: 'Nobel Laureate', awardsBn: 'নোবেল পুরস্কার (১৯১৩)', awardsEn: 'Nobel Prize (1913)', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646' },
  { id: 31, sectionBn: '📚 কথাসাহিত্যিক (লেখক/ঔপন্যাসিক)', sectionEn: 'Prose Writers & Novelists', nameBn: 'শরৎচন্দ্র চট্টোপাধ্যায়', nameEn: 'Sarat Chandra Chattopadhyay', birthYear: 1876, deathYear: 1938, worksBn: 'দেবদাস, শ্রীকান্ত', worksEn: 'Devdas', awardsBn: 'জগত্তারিণী স্বর্ণপদক', awardsEn: 'Jagattarini Gold Medal', image: 'https://images.unsplash.com/photo-1492138786312-c283025ebf5a' },
  { id: 32, sectionBn: '📚 কথাসাহিত্যিক (লেখক/ঔপন্যাসিক)', sectionEn: 'Prose Writers & Novelists', nameBn: 'হুমায়ূন আহমেদ', nameEn: 'Humayun Ahmed', birthYear: 1948, deathYear: 2012, worksBn: 'নন্দিত নরকে, হিমু', worksEn: 'Creator of Himu', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d' },
  { id: 33, sectionBn: '📚 কথাসাহিত্যিক (লেখক/ঔপন্যাসিক)', sectionEn: 'Prose Writers & Novelists', nameBn: 'সৈয়দ মুজতবা আলী', nameEn: 'Syed Mujtaba Ali', birthYear: 1904, deathYear: 1974, worksBn: 'দেশে-বিদেশে', worksEn: 'Deshe Bideshe', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3' },
  { id: 34, sectionBn: '📚 কথাসাহিত্যিক (লেখক/ঔপন্যাসিক)', sectionEn: 'Prose Writers & Novelists', nameBn: 'আখতারুজ্জামান ইলিয়াস', nameEn: 'Akhtaruzzaman Elias', birthYear: 1943, deathYear: 1997, worksBn: 'চিলেকোঠার সেপাই', worksEn: 'Chilekothar Sepai', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8' },
  { id: 35, sectionBn: '📚 কথাসাহিত্যিক (লেখক/ঔপন্যাসিক)', sectionEn: 'Prose Writers & Novelists', nameBn: 'সেলিনা হোসেন', nameEn: 'Selina Hossain', birthYear: 1947, deathYear: 'জীবিত', worksBn: 'হাঙর নদী গ্রেনেড', worksEn: 'Hangor Nodi Grenade', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f' },
  { id: 36, sectionBn: '📚 কথাসাহিত্যিক (লেখক/ঔপন্যাসিক)', sectionEn: 'Prose Writers & Novelists', nameBn: 'আনিসুল হক', nameEn: 'Anisul Hoque', birthYear: 1965, deathYear: 'জীবিত', worksBn: 'মা', worksEn: 'Maa (Mother)', awardsBn: 'বাংলা একাডেমি পুরস্কার', awardsEn: 'Bangla Academy Award', image: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e' },
  { id: 37, sectionBn: '📚 কথাসাহিত্যিক (লেখক/ঔপন্যাসিক)', sectionEn: 'Prose Writers & Novelists', nameBn: 'ইমদাদুল হক মিলন', nameEn: 'Imdadul Haq Milon', birthYear: 1955, deathYear: 'জীবিত', worksBn: 'নূরজাহান', worksEn: 'Nurjahan', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18acc' },
  { id: 38, sectionBn: '✨ নারী কবি ও সাহিত্যিক', sectionEn: 'Female Poets & Writers', nameBn: 'সুফিয়া কামাল', nameEn: 'Sufia Kamal', birthYear: 1911, deathYear: 1999, worksBn: 'একাত্তরের ডায়েরী', worksEn: 'Janani Shahoshika', awardsBn: 'স্বাধীনতা পদক', awardsEn: 'Independence Award', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f' },
  { id: 39, sectionBn: '✨ নারী কবি ও সাহিত্যিক', sectionEn: 'Female Poets & Writers', nameBn: 'বেগম রোকেয়া', nameEn: 'Begum Rokeya', birthYear: 1880, deathYear: 1932, worksBn: 'সুলতানার স্বপ্ন', worksEn: "Sultana's Dream", awardsBn: 'নারী জাগরণের অগ্রদূত', awardsEn: 'Pioneer of Women Rights', image: 'https://images.unsplash.com/photo-1485811661309-ab85183a729c' },
  { id: 40, sectionBn: '✨ নারী কবি ও সাহিত্যিক', sectionEn: 'Female Poets & Writers', nameBn: 'তসলিমা নাসরিন', nameEn: 'Taslima Nasrin', birthYear: 1962, deathYear: 'জীবিত', worksBn: 'লজ্জা', worksEn: 'Lajja', awardsBn: 'আনন্দ পুরস্কার', awardsEn: 'Ananda Puraskar', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81' },
  { id: 41, sectionBn: '✨ নারী কবি ও সাহিত্যিক', sectionEn: 'Female Poets & Writers', nameBn: 'রিজিয়া রহমান', nameEn: 'Rizia Rahman', birthYear: 1939, deathYear: 2019, worksBn: 'বং থেকে বাংলা', worksEn: 'Bong Theke Bangla', awardsBn: 'একুশে পদক', awardsEn: 'Ekushey Padak', image: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471' },
  { id: 42, sectionBn: '✨ নারী কবি ও সাহিত্যিক', sectionEn: 'Female Poets & Writers', nameBn: 'শামসিয়া রহমান', nameEn: 'Shamsia Rahman', birthYear: 1960, deathYear: 'জীবিত', worksBn: 'সমকালীন সাহিত্য', worksEn: 'Contemporary Prose', awardsBn: 'সাহিত্য সম্মাননা', awardsEn: 'Literary Recognition', image: 'https://images.unsplash.com/photo-1532012197367-bf455173070b' }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [blogRequests, setBlogRequests] = useState<any[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [wholesaleAds, setWholesaleAds] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [vocationalCourses, setVocationalCourses] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [donorViewLogs, setDonorViewLogs] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<any[]>([]);
  const [poets, setPoets] = useState<any[]>(() => getLocal('db_poets', INITIAL_POETS));
  const [aboutUs, setAboutUs] = useState<any>(getLocal('db_about_us', {
    titleEn: 'About Shonali Desh',
    titleBn: 'সোনালী দেশ সম্পর্কে',
    contentEn: 'Shonali Desh is a unified digital platform dedicated to empowering the people of Bangladesh.',
    contentBn: 'সোনালী দেশ বাংলাদেশের মানুষের ক্ষমতায়নের জন্য একটি সমন্বিত ডিজিটাল প্ল্যাটফর্ম।',
    missionEn: 'Our mission is to bring technology to every corner of the country.',
    missionBn: 'আমাদের লক্ষ্য দেশের প্রতিটি প্রান্তে প্রযুক্তি পৌঁছে দেওয়া।',
    visionEn: 'To build a smart, sustainable, and digital Bangladesh.',
    visionBn: 'একটি স্মার্ট, টেকসই এবং ডিজিটাল বাংলাদেশ গড়া।'
  }));
  const [privacyPolicy, setPrivacyPolicy] = useState<any>(getLocal('db_privacy_policy', {
    contentEn: 'Default Privacy Policy...',
    contentBn: 'ডিফল্ট গোপনীয়তা নীতি...'
  }));
  const [termsConditions, setTermsConditions] = useState<any>(getLocal('db_terms_conditions', {
    contentEn: 'Default Terms and Conditions...',
    contentBn: 'ডিফল্ট শর্তাবলী...'
  }));
  
  const [faqs, setFaqs] = useState<any[]>(() => {
    const local = getLocal('db_faqs', []);
    return local.length > 0 ? local.map(normalizeFaq) : DEFAULT_FAQS;
  });

  const [totalVisitors, setTotalVisitors] = useState<number>(() => parseInt(localStorage.getItem('total_visitors') || '1250'));
  const [todayVisitors, setTodayVisitors] = useState<number>(() => parseInt(localStorage.getItem('today_visitors') || '45'));

  const fetchData = async () => {
    setJobs(getLocal('db_jobs', []));
    setBlogs(getLocal('db_blogs', []));
    setRequests(getLocal('db_requests', []));
    setBlogRequests(getLocal('db_blog_requests', []));
    setWholesaleRequests(getLocal('db_wholesale_requests', []));
    setDistricts(getLocal('db_districts', []).map(normalizeDistrict));
    setDonorViewLogs(getLocal('db_donor_view_logs', []).map(normalizeLog).filter(Boolean));
    setDonors(getLocal('db_donors', []));
    setGrievances(getLocal('db_grievances', []));
    setMessages(getLocal('db_contact_messages', []));
    setWholesaleAds(getLocal('db_wholesale_ads', []));
    setLawyers(getLocal('db_lawyers', []));
    setMarketPrices(getLocal('db_market_prices', []));
    setExchangeRates(getLocal('db_exchange_rates', []));
    setVocationalCourses(getLocal('db_vocational_courses', []));
    setUsers(getLocal('db_users', []));
    setDiseases(getLocal('db_diseases', []));
    setPoets(getLocal('db_poets', INITIAL_POETS));
    
    if (!isSupabaseConfigured) return;

    try {
      const { data: configData } = await supabase.from('app_config').select('*');
      if (configData) {
        const aboutItem = configData.find(i => i.key === 'about_us');
        if (aboutItem) setAboutUs(aboutItem.value);
        const privacyItem = configData.find(i => i.key === 'privacy_policy');
        if (privacyItem) setPrivacyPolicy(privacyItem.value);
        const termsItem = configData.find(i => i.key === 'terms_conditions');
        if (termsItem) setTermsConditions(termsItem.value);
        
        const visitorData = configData.find(i => i.key === 'visitor_stats');
        if (visitorData) {
          const stats = visitorData.value;
          const todayStr = new Date().toDateString();
          setTotalVisitors(stats.total || 1250);
          if (stats.lastDate === todayStr) {
            setTodayVisitors(stats.today || 45);
          } else {
            setTodayVisitors(1);
          }
        }
      }

      const loadTable = async (name: string, setter: any, normalizer?: any) => {
        const { data, error } = await supabase.from(name).select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          const normalizedData = normalizer ? data.map(normalizer).filter(Boolean) : data;
          setter(normalizedData);
          localStorage.setItem(`db_${name}`, JSON.stringify(normalizedData));
        }
      };

      await Promise.all([
        loadTable('jobs', setJobs),
        loadTable('blogs', setBlogs),
        loadTable('requests', setRequests),
        loadTable('blog_requests', setBlogRequests),
        loadTable('wholesale_requests', setWholesaleRequests),
        loadTable('grievances', setGrievances),
        loadTable('users', setUsers),
        loadTable('contact_messages', setMessages),
        loadTable('market_prices', setMarketPrices),
        loadTable('wholesale_ads', setWholesaleAds),
        loadTable('donors', setDonors),
        loadTable('districts', setDistricts, normalizeDistrict),
        loadTable('lawyers', setLawyers),
        loadTable('exchange_rates', setExchangeRates),
        loadTable('vocational_courses', setVocationalCourses),
        loadTable('donor_view_logs', setDonorViewLogs, normalizeLog),
        loadTable('diseases', setDiseases),
        loadTable('faqs', setFaqs, normalizeFaq),
        loadTable('poets', setPoets)
      ]);
    } catch (globalErr: any) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addPoet = async (poet: any) => {
    const updated = [poet, ...poets];
    setPoets(updated);
    localStorage.setItem('db_poets', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('poets').insert([poet]);
  };

  const updatePoet = async (poet: any) => {
    const updated = poets.map(p => p.id === poet.id ? poet : p);
    setPoets(updated);
    localStorage.setItem('db_poets', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('poets').update(poet).eq('id', poet.id);
  };

  const deletePoet = async (id: any) => {
    const updated = poets.filter(p => p.id !== id);
    setPoets(updated);
    localStorage.setItem('db_poets', JSON.stringify(updated));
    if (isSupabaseConfigured) await supabase.from('poets').delete().eq('id', id);
  };

  const updateAboutUs = async (data: any) => {
    setAboutUs(data);
    localStorage.setItem('db_about_us', JSON.stringify(data));
    if (isSupabaseConfigured) await supabase.from('app_config').upsert({ key: 'about_us', value: data });
  };

  const updatePrivacyPolicy = async (data: any) => {
    setPrivacyPolicy(data);
    localStorage.setItem('db_privacy_policy', JSON.stringify(data));
    if (isSupabaseConfigured) await supabase.from('app_config').upsert({ key: 'privacy_policy', value: data });
  };

  const updateTermsConditions = async (data: any) => {
    setTermsConditions(data);
    localStorage.setItem('db_terms_conditions', JSON.stringify(data));
    if (isSupabaseConfigured) await supabase.from('app_config').upsert({ key: 'terms_conditions', value: data });
  };

  const updateFaqs = async (data: any[]) => {
    setFaqs(data);
    localStorage.setItem('db_faqs', JSON.stringify(data));
    if (isSupabaseConfigured) {
       const payload = data.map(f => ({
         id: f.id,
         questionbn: f.questionBn,
         questionen: f.questionEn,
         answerbn: f.answerBn,
         answeren: f.answerEn
       }));
       await supabase.from('faqs').upsert(payload);
    }
  };

  const addDisease = async (disease: any) => {
    if (isSupabaseConfigured) await supabase.from('diseases').insert([disease]);
    await fetchData();
  };

  const updateDisease = async (disease: any) => {
    if (isSupabaseConfigured) await supabase.from('diseases').update(disease).eq('id', disease.id);
    await fetchData();
  };

  const deleteDisease = async (id: number) => {
    setDiseases(prev => prev.filter(d => d.id !== id));
    if (isSupabaseConfigured) await supabase.from('diseases').delete().eq('id', id);
  };

  const updateUser = async (updatedUser: any) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem('db_users', JSON.stringify(updated));
      return updated;
    });
    if (isSupabaseConfigured) await supabase.from('users').upsert(updatedUser);
  };

  const updateMarketPrices = async (prices: any[]) => {
    setMarketPrices(prices);
    localStorage.setItem('db_market_prices', JSON.stringify(prices));
    if (isSupabaseConfigured) await supabase.from('market_prices').upsert(prices as any);
  };

  const updateDistrict = async (district: any) => {
    if (isSupabaseConfigured) await supabase.from('districts').upsert(district);
    await fetchData();
  };

  const seedDistricts = async () => {
    if (!isSupabaseConfigured) return;
    await fetchData();
  };

  const addDonorViewLog = async (log: any) => {
    if (isSupabaseConfigured) await supabase.from('donor_view_logs').insert([log]);
    await fetchData();
  };

  const logVisit = async () => {
    if (sessionStorage.getItem('visited_this_session')) return; // Prevent double counting in same session
    
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem('last_visit_date');
    
    let newTotal = totalVisitors + 1;
    let newToday = (savedDate === todayStr) ? todayVisitors + 1 : 1;

    setTotalVisitors(newTotal);
    setTodayVisitors(newToday);
    
    localStorage.setItem('total_visitors', newTotal.toString());
    localStorage.setItem('today_visitors', newToday.toString());
    localStorage.setItem('last_visit_date', todayStr);
    sessionStorage.setItem('visited_this_session', 'true');

    if (isSupabaseConfigured) {
      await supabase.from('app_config').upsert({ 
        key: 'visitor_stats', 
        value: { total: newTotal, today: newToday, lastDate: todayStr } 
      });
    }
  };

  const addJob = async (job: any) => {
    if (isSupabaseConfigured) await supabase.from('jobs').insert([job]);
    await fetchData();
  };

  const updateJob = async (job: any) => {
    if (isSupabaseConfigured) await supabase.from('jobs').update(job).eq('id', job.id);
    await fetchData();
  };

  const deleteJob = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('jobs').delete().eq('id', id);
    await fetchData();
  };

  const addBlog = async (blog: any) => {
    if (isSupabaseConfigured) await supabase.from('blogs').insert([blog]);
    await fetchData();
  };

  const updateBlog = async (blog: any) => {
    if (isSupabaseConfigured) await supabase.from('blogs').update(blog).eq('id', blog.id);
    await fetchData();
  };

  const deleteBlog = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('blogs').delete().eq('id', id);
    await fetchData();
  };

  const addRequest = async (request: any) => {
    const table = request.contenttype === 'job' ? 'requests' : request.contenttype === 'blog' ? 'blog_requests' : 'wholesale_requests';
    if (isSupabaseConfigured) await supabase.from(table).insert([request]);
    await fetchData();
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject', type: string) => {
    if (isSupabaseConfigured) {
      const table = type === 'job' ? 'requests' : type === 'blog' ? 'blog_requests' : 'wholesale_requests';
      if (action === 'approve') {
        const target = type === 'job' ? 'jobs' : type === 'blog' ? 'blogs' : 'wholesale_ads';
        const { id, ...data } = item;
        await supabase.from(target).insert([data]);
      }
      await supabase.from(table).delete().eq('id', item.id);
    }
    await fetchData();
  };

  const addGrievance = async (g: any) => {
    if (isSupabaseConfigured) await supabase.from('grievances').insert([g]);
    await fetchData();
  };

  const updateGrievanceStatus = async (id: number, status: string) => {
    if (isSupabaseConfigured) await supabase.from('grievances').update({ status }).eq('id', id);
    await fetchData();
  };

  const deleteGrievance = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('grievances').delete().eq('id', id);
    await fetchData();
  };

  const addMessage = async (m: any) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').insert([m]);
    await fetchData();
  };

  const markMessageRead = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id);
    await fetchData();
  };

  const deleteMessage = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('contact_messages').delete().eq('id', id);
    await fetchData();
  };

  const addUser = async (u: any) => {
    if (isSupabaseConfigured) await supabase.from('users').insert([u]);
    await fetchData();
  };

  const updateUserStatus = async (id: string, status: string) => {
    if (isSupabaseConfigured) await supabase.from('users').update({ status }).eq('id', id);
    await fetchData();
  };

  const deleteUser = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id);
    await fetchData();
  };

  const updateWholesaleAd = async (ad: any) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(ad).eq('id', ad.id);
    await fetchData();
  };

  const deleteWholesaleAd = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id);
    await fetchData();
  };

  const addRetailProduct = async (p: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').insert([p]);
    await fetchData();
  };

  const updateRetailProduct = async (p: any) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').update(p).eq('id', p.id);
    await fetchData();
  };

  const deleteRetailProduct = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id);
    await fetchData();
  };

  const enrollCourse = (c: any) => setEnrolledCourses(prev => [...prev, c]);

  const deleteDistrict = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from('districts').delete().eq('id', id);
    await fetchData();
  };

  const addLawyer = async (l: any) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').insert([l]);
    await fetchData();
  };

  const deleteLawyer = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id);
    await fetchData();
  };

  const addExchangeRate = async (r: any) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').insert([r]);
    await fetchData();
  };

  const deleteExchangeRate = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id);
    await fetchData();
  };

  const addVocationalCourse = async (c: any) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').insert([c]);
    await fetchData();
  };

  const deleteVocationalCourse = async (id: number) => {
    if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id);
    await fetchData();
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, blogRequests, wholesaleRequests, grievances, users, messages, donors, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses, districts, donorViewLogs, diseases, aboutUs, privacyPolicy, termsConditions, faqs, poets,
      addPoet, updatePoet, deletePoet,
      addRequest, addGrievance, updateGrievanceStatus, deleteGrievance, addMessage, markMessageRead, deleteMessage, enrollCourse, seedDistricts, updateDistrict, deleteDistrict, addDonorViewLog, addDisease, updateDisease, deleteDisease, updateAboutUs, updatePrivacyPolicy, updateTermsConditions, updateFaqs,
      addUser, updateUserStatus, deleteUser, updateMarketPrices, addJob, updateJob, deleteJob, addBlog, updateBlog, deleteBlog, handleRequestAction,
      updateWholesaleAd, deleteWholesaleAd, addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addLawyer, deleteLawyer, addExchangeRate, deleteExchangeRate, addVocationalCourse, deleteVocationalCourse,
      totalVisitors, todayVisitors, logVisit, updateUser, refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
