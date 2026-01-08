
"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
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

// Defaults
const initialModules: any = {};
Object.values(AppModule).forEach(m => initialModules[m] = true);

const initialSections: Record<LandingSection, boolean> = {
  hero: true, about: true, features: true, craft: true, agri: true, health: true, edu: true, transport: true, gallery: true, testimonials: true
};

const initialSettings: SiteSettings = {
  websiteTitle: 'Digital Desh BD',
  websiteLogo: 'https://zpsxpqurazjeqviwooky.supabase.co/storage/v1/object/public/images/logo.png',
  websiteFavicon: '',
  contactEmail: 'contact@digitaldeshbd.com',
  contactPhone: '+880 1700-000000',
  address: 'Dhaka, Bangladesh',
  maintenanceMode: false,
  announcementActive: false,
  announcement: '',
  heroSliderActive: false,
  heroImages: [],
  galleryImages: [],
  bkashMerchantNumber: '01700000000'
};

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Record<ToggableModule, boolean>>(initialModules);
  const [sections, setSections] = useState<Record<LandingSection, boolean>>(initialSections);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  // Sync with Supabase on Load
  useEffect(() => {
    const fetchGlobalConfig = async () => {
      if (!isSupabaseConfigured) {
        // Fallback to local storage if offline
        const m = localStorage.getItem('site_modules');
        const s = localStorage.getItem('site_sections');
        const st = localStorage.getItem('site_settings');
        if (m) setModules(JSON.parse(m));
        if (s) setSections(JSON.parse(s));
        if (st) setSettings(JSON.parse(st));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('*');

        if (data && !error) {
          data.forEach(item => {
            if (item.key === 'modules') setModules(item.value);
            if (item.key === 'sections') setSections(item.value);
            if (item.key === 'settings') setSettings(item.value);
          });
        }
      } catch (err) {
        console.error("Global config fetch error:", err);
      }
    };

    fetchGlobalConfig();
  }, []);

  const saveToCloud = async (key: string, value: any) => {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('site_config')
          .upsert([{ key, value, updated_at: new Date() }], { onConflict: 'key' });
      } catch (err) {
        console.error("Cloud save failed:", err);
      }
    }
    // Always backup to localStorage for offline resilience
    localStorage.setItem(`site_${key}`, JSON.stringify(value));
  };

  const toggleModule = (module: ToggableModule) => {
    setModules(prev => {
      const next = { ...prev, [module]: !prev[module] };
      saveToCloud('modules', next);
      return next;
    });
  };

  const toggleSection = (section: LandingSection) => {
    setSections(prev => {
      const next = { ...prev, [section]: !prev[section] };
      saveToCloud('sections', next);
      return next;
    });
  };

  const updateSettings = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveToCloud('settings', next);
      return next;
    });
  };

  return (
    <SiteConfigContext.Provider value={{ modules, sections, settings, toggleModule, toggleSection, updateSettings }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  return context;
};
