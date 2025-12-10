
import { Product, UserRole, Alert, AppModule } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Nakshi Kantha', nameBn: 'নকশী কাঁথা', price: 2500, category: 'Textile', image: 'https://images.unsplash.com/photo-1599691657388-75707b69512d?q=80&w=300', ecoFriendly: true },
  { id: '2', name: 'Bamboo Basket', nameBn: 'বাঁশের ঝুড়ি', price: 450, category: 'Bamboo', image: 'https://images.unsplash.com/photo-1605151268069-70562e6097c0?q=80&w=300', ecoFriendly: true },
  { id: '3', name: 'Jamdani Saree', nameBn: 'জামদানি শাড়ি', price: 12000, category: 'Textile', image: 'https://images.unsplash.com/photo-1617309995644-8c081e649080?q=80&w=300', ecoFriendly: false },
  { id: '4', name: 'Clay Pot', nameBn: 'মাটির কলস', price: 150, category: 'Pottery', image: 'https://images.unsplash.com/photo-1505315180424-9b2d3588f030?q=80&w=300', ecoFriendly: true },
];

export const ALERTS: Alert[] = [
  { id: '1', level: 'danger', message: 'Cyclone Warning Signal 4 in Coastal Areas.', timestamp: '10 min ago' },
  { id: '2', level: 'warning', message: 'Heavy rainfall expected in Sylhet division.', timestamp: '2 hours ago' },
];

export const MODULE_CONFIG = {
  [AppModule.CRAFT]: { title: 'Craft Marketplace', titleBn: 'কারুশিল্প বাজার', color: 'bg-orange-500' },
  [AppModule.AGRI]: { title: 'Agriculture', titleBn: 'কৃষি তথ্য', color: 'bg-green-600' },
  [AppModule.EDU]: { title: 'Education', titleBn: 'শিক্ষা', color: 'bg-blue-500' },
  [AppModule.HEALTH]: { title: 'Health', titleBn: 'স্বাস্থ্য সেবা', color: 'bg-teal-500' },
  [AppModule.TRANSPORT]: { title: 'Transport', titleBn: 'পরিবহন', color: 'bg-indigo-600' },
  [AppModule.WASTE]: { title: 'Waste Mgmt', titleBn: 'বর্জ্য ব্যবস্থাপনা', color: 'bg-gray-600' },
  [AppModule.FISHERY]: { title: 'Fishery', titleBn: 'মৎস্য চাষ', color: 'bg-cyan-600' },
  [AppModule.DISASTER]: { title: 'Disaster Prep', titleBn: 'দুর্যোগ ব্যবস্থাপনা', color: 'bg-red-600' },
  [AppModule.JOB]: { title: 'Jobs & Careers', titleBn: 'চাকরি ও ক্যারিয়ার', color: 'bg-pink-600' },
  [AppModule.CONTACT]: { title: 'Contact Us', titleBn: 'যোগাযোগ', color: 'bg-violet-600' },
  [AppModule.BLOG]: { title: 'Blog', titleBn: 'ব্লগ', color: 'bg-emerald-600' },
  [AppModule.AMAR_BD]: { title: 'Amar Bangladesh', titleBn: 'আমার বাংলাদেশ', color: 'bg-green-700' },
  [AppModule.PROFILE]: { title: 'User Profile', titleBn: 'ব্যবহারকারীর প্রোফাইল', color: 'bg-slate-600' },
};
