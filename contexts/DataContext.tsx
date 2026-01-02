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
  const [faqs, setFaqs] = useState<any[]>(getLocal('db_faqs', [
    { id: 1, questionBn: 'কিভাবে একাউন্ট খুলব?', questionEn: 'How to create account?', answerBn: 'রেজিস্ট্রেশন বাটনে ক্লিক করে ফর্ম পূরণ করুন।', answerEn: 'Click Register and fill out the form.' },
    { id: 2, questionBn: 'পাসওয়ার্ড ভুলে গেছি?', questionEn: 'Forgot Password?', answerBn: 'লগইন পেজে "পাসওয়ার্ড ভুলে গেছি" অপশন ব্যবহার করুন।', answerEn: 'Use the "Forgot Password" link on login page.' }
  ]));

  const [totalVisitors, setTotalVisitors] = useState<number>(() => parseInt(localStorage.getItem('total_visitors') || '1250'));

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
    setFaqs(getLocal('db_faqs', faqs).map(normalizeFaq));
    
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
      }

      const loadTable = async (name: string, setter: any, normalizer?: any) => {
        const { data, error } = await supabase.from(name).select('*').order('created_at', { ascending: false });
        if (data) {
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
        loadTable('faqs', setFaqs, normalizeFaq)
      ]);
    } catch (globalErr: any) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

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
       // Bulk sync for FAQs table
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

  const logVisit = () => {
    setTotalVisitors(prev => {
        const newVal = prev + 1;
        localStorage.setItem('total_visitors', newVal.toString());
        return newVal;
    });
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
      jobs, blogs, requests, blogRequests, wholesaleRequests, grievances, users, messages, donors, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses, districts, donorViewLogs, diseases, aboutUs, privacyPolicy, termsConditions, faqs,
      addRequest, addGrievance, updateGrievanceStatus, deleteGrievance, addMessage, markMessageRead, deleteMessage, enrollCourse, seedDistricts, updateDistrict, deleteDistrict, addDonorViewLog, addDisease, updateDisease, deleteDisease, updateAboutUs, updatePrivacyPolicy, updateTermsConditions, updateFaqs,
      addUser, updateUserStatus, deleteUser, updateMarketPrices, addJob, updateJob, deleteJob, addBlog, updateBlog, deleteBlog, handleRequestAction,
      updateWholesaleAd, deleteWholesaleAd, addRetailProduct, updateRetailProduct, deleteRetailProduct,
      addLawyer, deleteLawyer, addExchangeRate, deleteExchangeRate, addVocationalCourse, deleteVocationalCourse,
      totalVisitors, logVisit, updateUser, refreshData: fetchData
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