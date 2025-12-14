
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AppModule } from '../types';

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
  [AppModule.ADMIN]: true, // Always true usually
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

const SiteConfigContext = createContext<SiteConfig | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState(defaultModules);
  const [sections, setSections] = useState(defaultSections);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    announcement: 'স্বাগতম! আমাদের ওয়েবসাইট এখন সম্পূর্ণ লাইভ।',
    announcementActive: true,
  });

  const toggleModule = (id: ToggableModule) => {
    setModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (id: LandingSection) => {
    setSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateSettings = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
