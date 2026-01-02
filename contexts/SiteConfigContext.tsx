
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppModule } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

// Fix: Export ToggableModule and LandingSection for use in Admin modules
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
  galleryImages: string[];
}

interface SiteConfigContextType {
  modules: Record<ToggableModule, boolean>;
  sections: Record<LandingSection, boolean>;
  settings: SiteSettings;
  toggleModule: (module: ToggableModule) => void;
  toggleSection: (section: LandingSection) => void;
  updateSettings: (key: keyof SiteSettings, value: any) => void;
}

const DEFAULT_MODULES: Record<ToggableModule, boolean> = {
  [AppModule.CRAFT]: true,
  [AppModule.AGRI]: true,
  [AppModule.EDU]: true,
  [AppModule.HEALTH]: true,
  [AppModule.TRANSPORT]: true,
  [AppModule.WASTE]: true,
  [AppModule.FISHERY]: true,
  [AppModule.DISASTER]: true,
  [AppModule.PROFILE]: true,
  [AppModule.JOB]: true,
  [AppModule.CONTACT]: true,
  [AppModule.BLOG]: true,
  [AppModule.AMAR_BD]: true,
  [AppModule.AMAR_JELA]: true,
  [AppModule.BAZAR_SODAI]: true,
  [AppModule.ADMIN]: true,
  [AppModule.ABOUT]: true,
  [AppModule.PRIVACY]: true,
  [AppModule.TERMS]: true,
  [AppModule.LEGAL]: true,
  [AppModule.EXPAT]: true,
  [AppModule.VOCATIONAL]: true,
  [AppModule.JANTE_CHAI]: true,
};

const DEFAULT_SECTIONS: Record<LandingSection, boolean> = {
  hero: true,
  about: true,
  features: true,
  craft: true,
  agri: true,
  health: true,
  edu: true,
  transport: true,
  gallery: true,
  testimonials: true,
};

const DEFAULT_SETTINGS: SiteSettings = {
  websiteTitle: 'Digital Desh BD',
  websiteLogo: '',
  websiteFavicon: '',
  contactEmail: 'info@digitaldeshbd.com',
  contactPhone: '+880 1XXX-XXXXXX',
  address: 'Dhaka, Bangladesh',
  maintenanceMode: false,
  announcementActive: false,
  announcement: 'Welcome to Digital Desh BD!',
  galleryImages: [
    'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5',
    'https://images.unsplash.com/photo-1628189873998-25f00e95a947',
    'https://images.unsplash.com/photo-1619671603704-8b6567958611',
    'https://images.unsplash.com/photo-1548013146-72479768bada'
  ]
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Record<ToggableModule, boolean>>(DEFAULT_MODULES);
  const [sections, setSections] = useState<Record<LandingSection, boolean>>(DEFAULT_SECTIONS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const fetchRemoteConfig = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const { data, error } = await supabase.from('app_config').select('*');
      if (error) return;

      if (data && data.length > 0) {
        data.forEach(item => {
          if (item.key === 'modules') setModules(item.value);
          if (item.key === 'sections') setSections(item.value);
          if (item.key === 'settings') {
            // Merge existing settings with defaults to ensure new keys like galleryImages exist
            setSettings({ ...DEFAULT_SETTINGS, ...item.value });
          }
        });
      }
    } catch (err: any) {}
  };

  useEffect(() => {
    fetchRemoteConfig();
  }, []);

  const toggleModule = (module: ToggableModule) => {
    const newModules = { ...modules, [module]: !modules[module] };
    setModules(newModules);
    if (isSupabaseConfigured) {
      supabase.from('app_config').upsert({ key: 'modules', value: newModules }).then();
    }
  };

  const toggleSection = (section: LandingSection) => {
    const newSections = { ...sections, [section]: !sections[section] };
    setSections(newSections);
    if (isSupabaseConfigured) {
      supabase.from('app_config').upsert({ key: 'sections', value: newSections }).then();
    }
  };

  const updateSettings = (key: keyof SiteSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (isSupabaseConfigured) {
      supabase.from('app_config').upsert({ key: 'settings', value: newSettings }).then();
    }
  };

  return (
    <SiteConfigContext.Provider value={{ modules, sections, settings, toggleModule, toggleSection, updateSettings }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
