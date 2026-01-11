
"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { AppModule } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export type ToggableModule = AppModule;
export type LandingSection = 'hero' | 'about' | 'features' | 'craft' | 'agri' | 'health' | 'edu' | 'transport' | 'gallery' | 'testimonials';

export interface SiteSettings {
  websiteTitle: string;
  showWebsiteTitle: boolean;
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
  showWebsiteTitle: true,
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
  const [modules, setModules] = useState<Record<ToggableModule, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const m = localStorage.getItem('site_modules');
        if (m && m !== "undefined" && m !== "null") return JSON.parse(m);
      } catch (e) {}
    }
    return initialModules;
  });

  const [sections, setSections] = useState<Record<LandingSection, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem('site_sections');
        if (s && s !== "undefined" && s !== "null") return JSON.parse(s);
      } catch (e) {}
    }
    return initialSections;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const st = localStorage.getItem('site_settings');
        if (st && st !== "undefined" && st !== "null") {
          return { ...initialSettings, ...JSON.parse(st) };
        }
      } catch (e) {}
    }
    return initialSettings;
  });

  const fetchGlobalConfig = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*');

      if (data && !error) {
        data.forEach(item => {
          if (item.key === 'modules') {
            setModules(item.value);
            localStorage.setItem('site_modules', JSON.stringify(item.value));
          }
          else if (item.key === 'sections') {
            setSections(item.value);
            localStorage.setItem('site_sections', JSON.stringify(item.value));
          }
          else if (item.key === 'settings') {
            const mergedSettings = { ...initialSettings, ...item.value };
            setSettings(mergedSettings);
            localStorage.setItem('site_settings', JSON.stringify(mergedSettings));
          }
        });
      }
    } catch (err) {
      console.warn("Global config background fetch failed.");
    }
  }, []);

  useEffect(() => {
    fetchGlobalConfig();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('site_config_realtime')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'site_config' 
        }, (payload: any) => {
          if (payload.new) {
            const { key, value } = payload.new;
            if (key === 'modules') {
              setModules(value);
              localStorage.setItem('site_modules', JSON.stringify(value));
            }
            else if (key === 'sections') {
              setSections(value);
              localStorage.setItem('site_sections', JSON.stringify(value));
            }
            else if (key === 'settings') {
              const merged = { ...initialSettings, ...value };
              setSettings(merged);
              localStorage.setItem('site_settings', JSON.stringify(merged));
            }
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchGlobalConfig]);

  const saveToCloud = async (key: string, value: any) => {
    if (value === undefined) return;
    localStorage.setItem(`site_${key}`, JSON.stringify(value));
    
    if (isSupabaseConfigured && window.navigator.onLine) {
      try {
        await supabase
          .from('site_config')
          .upsert([{ 
            key, 
            value, 
            updated_at: new Date().toISOString() 
          }], { onConflict: 'key' });
      } catch (err) {
        console.warn("Cloud sync failed.");
      }
    }
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
      const next = { ...initialSettings, ...prev, [key]: value };
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
