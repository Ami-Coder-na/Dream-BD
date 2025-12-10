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
  HOME = 'home',
  CRAFT = 'craft',
  AGRI = 'agriculture',
  EDU = 'education',
  HEALTH = 'health',
  TRANSPORT = 'transport',
  WASTE = 'waste',
  FISHERY = 'fishery',
  DISASTER = 'disaster'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
