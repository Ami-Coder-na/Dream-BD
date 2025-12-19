
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
  [AppModule.LEGAL]: true,
  [AppModule.EXPAT]: true,
  [AppModule.VOCATIONAL]: true,
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
  websiteTitle: 'Dream BD',
  websiteLogo: '',
  websiteFavicon: '',
  contactEmail: 'info@dreambd.com',
  contactPhone: '+880 1XXX-XXXXXX',
  address: 'Dhaka, Bangladesh',
  maintenanceMode: false,
  announcementActive: false,
  announcement: 'Welcome to Dream BD!',
};

// Fix line 41-48: Properly define SiteConfigContext
const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Fix: Declare state and setters used in fetchRemoteConfig
  const [modules, setModules] = useState<Record<ToggableModule, boolean>>(DEFAULT_MODULES);
  const [sections, setSections] = useState<Record<LandingSection, boolean>>(DEFAULT_SECTIONS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const fetchRemoteConfig = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const { data, error } = await supabase.from('app_config').select('*');
      if (error) {
          if (error.message.includes('fetch')) {
             console.info("Supabase is unreachable. Using local configuration.");
          } else {
             console.warn("Config Error:", error.message);
          }
          return;
      }

      if (data && data.length > 0) {
        data.forEach(item => {
          // Fix line 28-30: setModules, setSections, setSettings are now in scope
          if (item.key === 'modules') setModules(item.value);
          if (item.key === 'sections') setSections(item.value);
          if (item.key === 'settings') setSettings(item.value);
        });
      }
    } catch (err: any) {
      // Catch network-level errors silently as they are handled by local state
    }
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
    // Fix: Providing the actual context values to consuming components
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
