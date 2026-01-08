
"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppModule } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export type ToggableModule = AppModule;
export type LandingSection = 'hero' | 'about' | 'features' | 'craft' | 'agri' | 'health' | 'edu' | 'transport' | 'gallery' | 'testimonials';

export interface SiteSettings {
  websiteTitle: string;
  websiteLogo: string;
  websiteFavicon: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  maintenanceMode: boolean;
  announcementActive: boolean;
  announcement: string;
  heroSliderActive: boolean;
  heroImages: string[];
  galleryImages: string[];
  bkashMerchantNumber: string;
}

interface SiteConfigContextType {
  modules: Record<ToggableModule, boolean>;
  sections: Record<LandingSection, boolean>;
  settings: SiteSettings;
  toggleModule: (module: ToggableModule) => void;
  toggleSection: (section: LandingSection) => void;
  updateSettings: (key: keyof SiteSettings, value: any) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

// Implementation of the SiteConfigProvider to manage global module and section visibility
export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Record<ToggableModule, boolean>>(() => {
    const initial: any = {};
    Object.values(AppModule).forEach(m => initial[m] = true);
    return initial;
  });

  const [sections, setSections] = useState<Record<LandingSection, boolean>>({
    hero: true, about: true, features: true, craft: true, agri: true, health: true, edu: true, transport: true, gallery: true, testimonials: true
  });

  const [settings, setSettings] = useState<SiteSettings>({
    websiteTitle: 'Digital Desh BD',
    websiteLogo: '',
    websiteFavicon: '',
    contactEmail: 'contact@digitaldeshbd.com',
    contactPhone: '+880 1XXX-XXXXXX',
    address: 'Dhaka, Bangladesh',
    maintenanceMode: false,
    announcementActive: false,
    announcement: '',
    heroSliderActive: false,
    heroImages: [],
    galleryImages: [],
    bkashMerchantNumber: '01700000000'
  });

  const toggleModule = (module: ToggableModule) => {
    setModules(prev => ({ ...prev, [module]: !prev[module] }));
  };

  const toggleSection = (section: LandingSection) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateSettings = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SiteConfigContext.Provider value={{ modules, sections, settings, toggleModule, toggleSection, updateSettings }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

// Custom hook to access site configuration
export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  return context;
};
