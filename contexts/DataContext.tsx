
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole } from '../types';

const DataContext = createContext<any>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [blogRequests, setBlogRequests] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [wholesaleAds, setWholesaleAds] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [vocationalCourses, setVocationalCourses] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [districtBranding, setDistrictBranding] = useState<any[]>([]);
  const [districtDetails, setDistrictDetails] = useState<any[]>([]);

  const normalizeData = (data: any) => {
    if (!data || typeof data !== 'object') return data;
    const normalized: any = {};
    for (const key in data) {
      normalized[key.toLowerCase()] = data[key] === undefined ? null : data[key];
    }
    return normalized;
  };

  const mapFromDb = (item: any) => {
    if (!item) return item;
    const newItem = { ...item };
    const fieldMap: Record<string, string> = {
      'postedby': 'postedBy', 'posteddate': 'postedDate', 'readtime': 'readTime',
      'sellertype': 'sellerType', 'nameen': 'nameEn', 'namebn': 'nameBn',
      'titlebn': 'titleBn', 'productbn': 'productBn', 'producten': 'productEn'
    };
    Object.keys(fieldMap).forEach(dbKey => {
      if (dbKey in newItem) {
        newItem[fieldMap[dbKey]] = newItem[dbKey];
        if (dbKey !== fieldMap[dbKey]) delete newItem[dbKey];
      }
    });
    return newItem;
  };

  const fetchTable = async (table: string, setter: any, orderBy = 'id', ascending = false) => {
    if (!isSupabaseConfigured) return;
    try {
        const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
        if (!error && data) setter(data.map(mapFromDb));
    } catch(e) {}
  };

  const fetchData = async () => {
    if (!isSupabaseConfigured) return;
    fetchTable('jobs', setJobs);
    fetchTable('blogs', setBlogs);
    fetchTable('requests', setRequests);
    fetchTable('blog_requests', setBlogRequests);
    fetchTable('grievances', setGrievances);
    fetchTable('users', setUsers);
    fetchTable('contact_messages', setMessages);
    fetchTable('market_prices', setMarketPrices);
    fetchTable('retail_products', setRetailProducts);
    fetchTable('wholesale_ads', setWholesaleAds);
    fetchTable('lawyers', setLawyers);
    fetchTable('exchange_rates', setExchangeRates);
    fetchTable('vocational_courses', setVocationalCourses);
    fetchTable('donors', setDonors);
    fetchTable('district_branding', setDistrictBranding);
    fetchTable('district_details', setDistrictDetails, 'district_id');
  };

  useEffect(() => {
    fetchData();
    if (isSupabaseConfigured) {
        const channel = supabase.channel('content_sync').on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData()).subscribe();
        return () => { supabase.removeChannel(channel); };
    }
  }, []);

  const addGeneric = async (table: string, item: any) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from(table).insert([normalizeData(item)]);
    if (!error) fetchData();
    return error;
  };

  const updateGeneric = async (table: string, item: any, idField = 'id') => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from(table).update(normalizeData(item)).eq(idField, item[idField]);
    if (!error) fetchData();
    return error;
  };

  const deleteGeneric = async (table: string, id: any, idField = 'id') => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from(table).delete().eq(idField, id);
    if (!error) fetchData();
    return error;
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, blogRequests, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, districtBranding, districtDetails, grievances, users, messages, donors,
      addJob: (item: any) => addGeneric('jobs', item),
      updateJob: (item: any) => updateGeneric('jobs', item),
      deleteJob: (id: number) => deleteGeneric('jobs', id),
      addBlog: (item: any) => addGeneric('blogs', item),
      updateBlog: (item: any) => updateGeneric('blogs', item),
      deleteBlog: (id: number) => deleteGeneric('blogs', id),
      addMarketPrice: (item: any) => addGeneric('market_prices', item),
      updateMarketPrice: (item: any) => updateGeneric('market_prices', item),
      deleteMarketPrice: (id: number) => deleteGeneric('market_prices', id),
      addRetailProduct: (item: any) => addGeneric('retail_products', item),
      updateRetailProduct: (item: any) => updateGeneric('retail_products', item),
      deleteRetailProduct: (id: number) => deleteGeneric('retail_products', id),
      addLawyer: (item: any) => addGeneric('lawyers', item),
      deleteLawyer: (id: number) => deleteGeneric('lawyers', id),
      addExchangeRate: (item: any) => addGeneric('exchange_rates', item),
      deleteExchangeRate: (id: number) => deleteGeneric('exchange_rates', id),
      addVocationalCourse: (item: any) => addGeneric('vocational_courses', item),
      deleteVocationalCourse: (id: number) => deleteGeneric('vocational_courses', id),
      addBranding: (item: any) => addGeneric('district_branding', item),
      updateBranding: (item: any) => updateGeneric('district_branding', item),
      deleteBranding: (id: number) => deleteGeneric('district_branding', id),
      updateDistrictDetails: (item: any) => updateGeneric('district_details', item, 'district_id'),
      handleRequestAction: async (item: any, action: 'approve' | 'reject', type: 'job' | 'blog') => {
        const table = type === 'blog' ? 'blog_requests' : 'requests';
        await deleteGeneric(table, item.id);
        if (action === 'approve') {
          const { id, created_at, ...rest } = item;
          if (type === 'job') addGeneric('jobs', { ...rest, status: 'Active' });
          else addGeneric('blogs', { ...rest, status: 'Active' });
        }
      },
      addRequest: (item: any) => {
        const { contentType, ...dbData } = item;
        return addGeneric(contentType === 'blog' ? 'blog_requests' : 'requests', { ...dbData, status: 'Pending', postedDate: new Date().toLocaleDateString() });
      },
      refreshData: fetchData, totalVisitors: 1250, logVisit: () => {}
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
