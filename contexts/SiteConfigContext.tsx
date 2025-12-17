import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppModule } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

// Define which modules can be toggled
export type ToggableModule = AppModule;

// Define Landing Page sections
export type LandingSection = 'hero' | 'about' | 'features' | 'craft' | 'agri' | 'health' | 'edu' | 'transport' | 'waste' | 'fishery' | 'disaster' | 'gallery' | 'testimonials';

interface SiteConfig {
  modules: Record<ToggableModule, boolean>;
  sections: Record<LandingSection, boolean>;
  settings: {
    maintenanceMode: boolean;
    announcement: string;
    announcementActive: boolean;
    websiteTitle: string;
    websiteLogo: string; // Base64 or URL
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  toggleModule: (id: ToggableModule) => void;
  toggleSection: (id: LandingSection) => void;
  updateSettings: (key: keyof SiteConfig['settings'], value: any) => void;
}

const defaultModules: Record<ToggableModule, boolean> = {
  [AppModule.CRAFT]: true,
  [AppModule.AGRI]: true,
  [AppModule.EDU]: true,
  [AppModule.HEALTH]: true,
  [AppModule.TRANSPORT]: true,
  [AppModule.WASTE]: true,
  [AppModule.FISHERY]: true,
  [AppModule.DISASTER]: true,
  [AppModule.JOB]: true,
  [AppModule.CONTACT]: true,
  [AppModule.BLOG]: true,
  [AppModule.AMAR_BD]: true,
  [AppModule.AMAR_JELA]: true,
  [AppModule.BAZAR_SODAI]: true,
  [AppModule.PROFILE]: true,
  [AppModule.LEGAL]: true,
  [AppModule.EXPAT]: true,
  [AppModule.VOCATIONAL]: true,
  [AppModule.ADMIN]: true,
};

const defaultSections: Record<LandingSection, boolean> = {
  hero: true,
  about: true,
  features: true,
  craft: true,
  agri: true,
  health: true,
  edu: true,
  transport: true,
  waste: true,
  fishery: true,
  disaster: true,
  gallery: true,
  testimonials: true,
};

const defaultSettings = {
  maintenanceMode: false,
  announcement: 'স্বাগতম! আমাদের ওয়েবসাইট এখন সম্পূর্ণ লাইভ।',
  announcementActive: true,
  websiteTitle: 'Dream BD',
  websiteLogo: '',
  contactEmail: 'info@dreambd.gov.bd',
  contactPhone: '+880 1234 567890',
  address: 'ICT Tower, Agargaon, Dhaka-1207, Bangladesh'
};

const SiteConfigContext = createContext<SiteConfig | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage as fallback
  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('site_modules');
    return saved ? JSON.parse(saved) : defaultModules;
  });

  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('site_sections');
    return saved ? JSON.parse(saved) : defaultSections;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('site_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  // --- SUPABASE SYNC LOGIC ---

  const fetchRemoteConfig = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const { data, error } = await supabase.from('app_config').select('*');
      if (error) {
          console.warn("Supabase Fetch Error:", error.message);
          return;
      }

      if (data && data.length > 0) {
        data.forEach(item => {
          if (item.key === 'modules') setModules(item.value);
          if (item.key === 'sections') setSections(item.value);
          if (item.key === 'settings') setSettings(item.value);
        });
      }
    } catch (err) {
      console.warn("Failed to fetch remote config, using local:", err);
    }
  };

  const pushRemoteConfig = async (key: string, value: any) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('app_config').upsert({ key, value });
      if (error) console.error("Error pushing config:", error);
    } catch (err) {
      console.warn("Failed to push config:", err);
    }
  };

  // Initial Fetch & Subscription
  useEffect(() => {
    fetchRemoteConfig();

    if (isSupabaseConfigured) {
      const subscription = supabase
        .channel('app_config_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'app_config' }, (payload) => {
           // Real-time update from other users
           const { key, value } = payload.new as any;
           if (key === 'modules') setModules(value);
           if (key === 'sections') setSections(value);
           if (key === 'settings') setSettings(value);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, []);

  // Persist changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('site_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('site_sections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('site_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleModule = (id: ToggableModule) => {
    const newState = { ...modules, [id]: !modules[id] };
    setModules(newState); // Optimistic Update
    pushRemoteConfig('modules', newState); // Push to DB
  };

  const toggleSection = (id: LandingSection) => {
    const newState = { ...sections, [id]: !sections[id] };
    setSections(newState); // Optimistic Update
    pushRemoteConfig('sections', newState); // Push to DB
  };

  const updateSettings = (key: keyof typeof settings, value: any) => {
    const newState = { ...settings, [key]: value };
    setSettings(newState); // Optimistic Update
    pushRemoteConfig('settings', newState); // Push to DB
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
