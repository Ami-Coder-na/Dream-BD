
"use client";

import React, { useState, useRef } from 'react';
import { 
  Smartphone, Upload, ImageIcon, Loader2, Power, Image as ImageIcon2, Plus, LayoutGrid,
  Globe, Database, Zap, CheckCircle, Search, Layout, Layers, RefreshCw, Smartphone as MobileIcon,
  ShieldCheck, Info, Monitor
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useSiteConfig, ToggableModule, LandingSection } from '../../../contexts/SiteConfigContext';
import { compressImage } from '../../utils/imageUtils';
import { useData } from '../../../contexts/DataContext';
import { AppModule } from '../../../types';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  color?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  label, 
  checked, 
  onChange, 
  color = "bg-brand-500" 
}) => (
  <div className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all group">
    <span className="text-gray-700 font-bold text-sm">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${color.replace('bg-', 'peer-checked:bg-')}`}></div>
    </label>
  </div>
);

interface ImageSlotProps {
  label: string;
  subLabel?: string;
  currentImage?: string;
  onUpload: (base64: string) => void;
  isUploading?: boolean;
}

const ImageSlot: React.FC<ImageSlotProps> = ({ label, subLabel, currentImage, onUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1200, 0.7);
        onUpload(compressed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${currentImage ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
      >
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-brand-600 text-white text-[9px] font-black uppercase rounded shadow-sm z-10">
          {label}
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile} />
        
        {isUploading ? (
          <Loader2 className="animate-spin text-brand-600" />
        ) : currentImage ? (
          <img src={currentImage} className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-300 mb-2 group-hover:border-brand-400 group-hover:text-brand-400 transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-600">Add Image</span>
          </>
        )}
      </div>
      {subLabel && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{subLabel}</span>}
    </div>
  );
};

export const AdminWebsiteManage = () => {
  const { modules, sections, settings, toggleModule, toggleSection, updateSettings } = useSiteConfig();
  const { seedDistricts } = useData();
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file, 800, 0.8);
      updateSettings('websiteLogo', compressed);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file, 128, 0.6);
      updateSettings('websiteFavicon', compressed);
    }
  };

  const handleHeroUpload = (index: number, base64: string) => {
    const newImages = [...(settings.heroImages || [])];
    newImages[index] = base64;
    updateSettings('heroImages', newImages);
  };

  const handleGalleryUpload = (index: number, base64: string) => {
    const newImages = [...(settings.galleryImages || [])];
    newImages[index] = base64;
    updateSettings('galleryImages', newImages);
  };

  const inputStyles = "w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold text-gray-800 text-sm";
  const labelStyles = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  // Full module list from screenshot
  const moduleList = [
    { id: AppModule.CRAFT, label: 'Craft' },
    { id: AppModule.AGRI, label: 'Agriculture' },
    { id: AppModule.EDU, label: 'Education' },
    { id: AppModule.HEALTH, label: 'Health' },
    { id: AppModule.TRANSPORT, label: 'Transport' },
    { id: AppModule.WASTE, label: 'Waste' },
    { id: AppModule.FISHERY, label: 'Fishery' },
    { id: AppModule.DISASTER, label: 'Disaster' },
    { id: AppModule.PROFILE, label: 'Profile' },
    { id: AppModule.JOB, label: 'Job' },
    { id: AppModule.CONTACT, label: 'Contact' },
    { id: AppModule.BLOG, label: 'Blog' },
    { id: AppModule.AMAR_BD, label: 'Amar bd' },
    { id: AppModule.AMAR_JELA, label: 'Amar jela' },
    { id: AppModule.BAZAR_SODAI, label: 'Bazar sodai' },
    { id: AppModule.ABOUT, label: 'About' },
    { id: AppModule.PRIVACY, label: 'Privacy' },
    { id: AppModule.TERMS, label: 'Terms' },
    { id: AppModule.LEGAL, label: 'Legal' },
    { id: AppModule.EXPAT, label: 'Expat' },
    { id: AppModule.VOCATIONAL, label: 'Vocational' },
    { id: AppModule.JANTE_CHAI, label: 'Jante chai' },
    { id: AppModule.SUBSCRIPTION, label: 'Subscription' }
  ];

  // Full section list from screenshot
  const sectionList: { id: LandingSection; label: string }[] = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'craft', label: 'Craft' },
    { id: 'agri', label: 'Agri' },
    { id: 'health', label: 'Health' },
    { id: 'edu', label: 'Edu' },
    { id: 'transport', label: 'Transport' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Testimonials' }
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
      
      {/* 1. Global System Status (NEW - Matching Screenshot 3) */}
      <div className="bg-white rounded-3xl p-8 border-2 border-brand-500/30 shadow-xl shadow-brand-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-500"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Globe size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1a1c2c] uppercase tracking-tight">Global System Online</h2>
              <p className="text-brand-600 font-bold">Success! Your database is connected and syncing globally.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
             <div className="bg-brand-50 border border-brand-100 rounded-lg px-4 py-2 flex items-center gap-2 text-brand-700 font-bold text-xs shadow-sm mb-4 md:mb-0">
               <ShieldCheck size={16} /> Connected! Database is live.
             </div>
             <div className="flex gap-2">
               <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-[11px] font-black uppercase text-gray-500 hover:bg-gray-50 transition-all shadow-sm">Setup Global Access</button>
               <button onClick={() => alert('Syncing...')} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-[11px] font-black uppercase flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20">
                 <Zap size={14} fill="currentColor" /> Test Sync
               </button>
               <button onClick={seedDistricts} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-black uppercase flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                 <Database size={14} /> Seed 64 Districts Data
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Management Grids (NEW - Matching Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Module Management Column */}
        <div className="lg:col-span-7 bg-[#f8fafc] rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <Layers className="text-brand-600" size={20} />
             <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest">Module Management</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[650px] overflow-y-auto custom-scrollbar pr-2">
            {moduleList.map((mod) => (
              <ToggleSwitch 
                key={mod.id}
                label={mod.label}
                checked={modules[mod.id as ToggableModule] ?? true}
                onChange={() => toggleModule(mod.id as ToggableModule)}
              />
            ))}
          </div>
        </div>

        {/* Landing Sections Column */}
        <div className="lg:col-span-5 bg-[#f8fafc] rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <Layout className="text-brand-600" size={20} />
             <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest">Landing Page Sections</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectionList.map((sec) => (
              <ToggleSwitch 
                key={sec.id}
                label={sec.label}
                checked={sections[sec.id] ?? true}
                onChange={() => toggleSection(sec.id)}
                color="bg-indigo-600"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Website Identity (Top Card - Matching Screenshot 1) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white flex items-center gap-3">
          <Smartphone className="text-brand-600" size={22} />
          <h3 className="text-lg font-bold text-gray-900">Website Identity</h3>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelStyles}>Website Title</label>
              <input 
                type="text"
                className={inputStyles}
                value={settings.websiteTitle}
                onChange={(e) => updateSettings('websiteTitle', e.target.value)}
                placeholder="Digital Desh BD"
              />
            </div>
            <div>
              <label className={labelStyles}>Contact Email</label>
              <input 
                type="email"
                className={inputStyles}
                value={settings.contactEmail}
                onChange={(e) => updateSettings('contactEmail', e.target.value)}
                placeholder="contact@digitaldeshbd.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>Logo (Compressed)</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {settings.websiteLogo ? <img src={settings.websiteLogo} className="w-full h-full object-contain" /> : <ImageIcon className="text-gray-300" size={20} />}
                  </div>
                  <Button onClick={() => logoInputRef.current?.click()} variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest bg-white">
                    <Upload size={14} className="mr-2"/> Upload
                  </Button>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
              </div>
              <div>
                <label className={labelStyles}>Favicon</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {settings.websiteFavicon ? <img src={settings.websiteFavicon} className="w-8 h-8 object-contain" /> : <ImageIcon className="text-gray-300" size={20} />}
                  </div>
                  <Button onClick={() => faviconInputRef.current?.click()} variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest bg-white">
                    <Upload size={14} className="mr-2"/> Upload
                  </Button>
                  <input type="file" ref={faviconInputRef} className="hidden" accept="image/*" onChange={handleFaviconUpload} />
                </div>
              </div>
            </div>
            <div>
              <label className={labelStyles}>Contact Phone</label>
              <input 
                type="text"
                className={inputStyles}
                value={settings.contactPhone}
                onChange={(e) => updateSettings('contactPhone', e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
             <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <Power size={18} className="text-red-500" />
                   <h4 className="text-sm font-bold text-gray-900">System Controls</h4>
                </div>
                <ToggleSwitch label="Maintenance Mode" checked={settings.maintenanceMode} onChange={() => updateSettings('maintenanceMode', !settings.maintenanceMode)} color="bg-red-600" />
                <ToggleSwitch label="Global Announcement" checked={settings.announcementActive} onChange={() => updateSettings('announcementActive', !settings.announcementActive)} />
             </div>
             <div className="lg:col-span-8">
                <label className={labelStyles}>Office Address</label>
                <textarea 
                  rows={4}
                  className={`${inputStyles} resize-none font-medium text-base leading-relaxed`}
                  value={settings.address}
                  onChange={(e) => updateSettings('address', e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                ></textarea>
             </div>
          </div>
        </div>
      </div>

      {/* 4. Hero Slider Management (Matching Screenshot 2) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
             <ImageIcon2 size={22} className="text-emerald-500" />
             <h3 className="text-lg font-bold text-gray-900">Hero Slider Images</h3>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
             <span className="text-xs font-black text-gray-900 uppercase">Enable Hero Slider</span>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.heroSliderActive} onChange={() => updateSettings('heroSliderActive', !settings.heroSliderActive)} />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
             </label>
          </div>
        </div>
        <div className="p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ImageSlot label="Hero 1" currentImage={settings.heroImages?.[0]} onUpload={(b) => handleHeroUpload(0, b)} />
            <ImageSlot label="Hero 2" currentImage={settings.heroImages?.[1]} onUpload={(b) => handleHeroUpload(1, b)} />
            <ImageSlot label="Hero 3" currentImage={settings.heroImages?.[2]} onUpload={(b) => handleHeroUpload(2, b)} />
            <ImageSlot label="Hero 4" currentImage={settings.heroImages?.[3]} onUpload={(b) => handleHeroUpload(3, b)} />
          </div>
          <p className="text-center text-[10px] font-bold text-gray-400 italic mt-10 uppercase tracking-widest">* All images are automatically compressed to high-quality WebP to save storage space.</p>
        </div>
      </div>

      {/* 5. Gallery Management (Matching Screenshot 2) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
             <LayoutGrid size={22} className="text-emerald-500" />
             <h3 className="text-lg font-bold text-gray-900">Gallery Management (Beautiful Bangladesh)</h3>
          </div>
          <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">4 Custom Slots</span>
          </div>
        </div>
        <div className="p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ImageSlot label="Slot 1" subLabel="Tea Garden" currentImage={settings.galleryImages?.[0]} onUpload={(b) => handleGalleryUpload(0, b)} />
            <ImageSlot label="Slot 2" subLabel="Riverine" currentImage={settings.galleryImages?.[1]} onUpload={(b) => handleGalleryUpload(1, b)} />
            <ImageSlot label="Slot 3" subLabel="Parliament" currentImage={settings.galleryImages?.[2]} onUpload={(b) => handleGalleryUpload(2, b)} />
            <ImageSlot label="Slot 4" subLabel="Sundarbans" currentImage={settings.galleryImages?.[3]} onUpload={(b) => handleGalleryUpload(3, b)} />
          </div>
        </div>
      </div>

    </div>
  );
};
