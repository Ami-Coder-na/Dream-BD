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
  AMAR_JELA = 'amar_jela'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email?: string;
  phone?: string;
  location?: string;
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