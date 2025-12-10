import { Product, UserRole, Alert, AppModule } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Nakshi Kantha', nameBn: 'নকশী কাঁথা', price: 2500, category: 'Textile', image: 'https://picsum.photos/300/300?random=1', ecoFriendly: true },
  { id: '2', name: 'Bamboo Basket', nameBn: 'বাঁশের ঝুড়ি', price: 450, category: 'Bamboo', image: 'https://picsum.photos/300/300?random=2', ecoFriendly: true },
  { id: '3', name: 'Jamdani Saree', nameBn: 'জামদানি শাড়ি', price: 12000, category: 'Textile', image: 'https://picsum.photos/300/300?random=3', ecoFriendly: false },
  { id: '4', name: 'Clay Pot', nameBn: 'মাটির কলস', price: 150, category: 'Pottery', image: 'https://picsum.photos/300/300?random=4', ecoFriendly: true },
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
  [AppModule.PROFILE]: { title: 'User Profile', titleBn: 'ব্যবহারকারীর প্রোফাইল', color: 'bg-slate-600' },
};