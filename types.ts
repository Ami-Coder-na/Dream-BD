
export enum UserRole {
  ADMIN = 'Admin',
  CITIZEN = 'Citizen',
  FARMER = 'Farmer',
  VENDOR = 'Vendor',
  TEACHER = 'Teacher',
  DOCTOR = 'Doctor',
  TRANSPORT_OP = 'Transport Operator',
  DISASTER_OFFICER = 'Disaster Officer'
}

export enum SubscriptionTier {
  FREE = 'Free',
  PRO = 'Pro',
  MASTER = 'Master',
  ULTRA = 'Ultra'
}

export enum AppModule {
  CRAFT = 'craft',
  AGRI = 'agriculture',
  EDU = 'education',
  HEALTH = 'health',
  TRANSPORT = 'transport',
  WASTE = 'waste',
  FISHERY = 'fishery',
  DISASTER = 'disaster',
  PROFILE = 'profile',
  JOB = 'job',
  CONTACT = 'contact',
  BLOG = 'blog',
  AMAR_BD = 'amar_bd',
  AMAR_JELA = 'amar_jela',
  BAZAR_SODAI = 'bazar_sodai',
  ADMIN = 'admin',
  ABOUT = 'about',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  LEGAL = 'legal',
  EXPAT = 'expat',
  VOCATIONAL = 'vocational',
  JANTE_CHAI = 'jante_chai',
  SUBSCRIPTION = 'subscription',
  NID_PRINT = 'nid_print',
  PHOTO_STUDIO = 'photo_studio'
}

export interface ServiceCategory {
  id: string;
  titleBn: string;
  titleEn: string;
}

export interface ServiceLink {
  id: string | number;
  titleBn: string;
  titleEn: string;
  link: string;
  logo: string;
  category: string;
  badge?: string;
  views?: number;
  module?: AppModule;
  iframe?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email?: string;
  phone?: string;
  location?: string;
  status?: string;
  date?: string;
  subscriptionTier?: SubscriptionTier;
  imageUploadCount?: number;
}

export interface PricingPlan {
  id: string;
  nameEn: string;
  nameBn: string;
  price: number;
  tier: SubscriptionTier;
  limit: number;
  featuresEn: string[];
  featuresBn: string[];
  color: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number; // percentage
  isActive: boolean;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  tier: SubscriptionTier;
  amount: number;
  method: 'bkash';
  userPhone: string;
  trxId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  category: string;
  image: string;
  ecoFriendly: boolean;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  location: string;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: string;
}

export interface Attachment {
  type: 'image' | 'audio';
  url: string; // For display (blob url or base64)
  base64?: string; // For API
  mimeType?: string; // For API
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachment?: Attachment;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

export interface ChatSession {
  id: string;
  title: string;
  date: string; // 'Today', 'Yesterday', etc.
  preview: string;
  messages: ChatMessage[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: Date;
  read: boolean;
  moduleId?: AppModule;
}
