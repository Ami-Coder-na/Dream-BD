import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, Layout, Layers, ToggleLeft, ToggleRight, 
  AlertTriangle, Megaphone, Power, CheckCircle, Smartphone, Database, Server, HardDrive, Copy, Check, Save, RefreshCw, Key,
  Globe, MapPin, Phone, Mail, Upload, X, Image as ImageIcon,
  Zap, PlusCircle, RotateCcw, Wifi, WifiOff, Globe2, Lock, ShieldCheck, Terminal, AlertCircle, Info, Code, ArrowRight, Loader2, Plus
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useSiteConfig, ToggableModule, LandingSection } from '../../../contexts/SiteConfigContext';
import { isSupabaseConfigured, isGlobalConfig, supabase } from '../../../services/supabaseClient';
import { AppModule } from '../../../types';
import { useData } from '../../../contexts/DataContext';
import { compressImage, getOptimizedImageUrl } from '../../utils/imageUtils';

// Fix: Added missing ToggleSwitch helper component to resolve "Cannot find name 'ToggleSwitch'" error.
// Fix: Used React.FC for ToggleSwitch to properly handle React props like 'key'.
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
  color = "bg-brand-600" 
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-brand-200 transition-colors">
    <span className="text-gray-900 font-bold text-sm">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className={`w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${color.replace('bg-', 'peer-checked:bg-')}`}></div>
    </label>
  </div>
);

export const AdminWebsiteManage = () => {
  const { modules, sections, settings, toggleModule, toggleSection, updateSettings } = useSiteConfig();
  const { seedDistricts } = useData();
  const [copied, setCopied] = useState(false);
  const [configCopied, setConfigCopied] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for 4 Hero and 4 Gallery slots
  const heroRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const galleryRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const [dbUrl, setDbUrl] = useState(localStorage.getItem('dream_sb_url') || '');
  const [dbKey, setDbKey] = useState(localStorage.getItem('dream_sb_key') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState('gray');
  const [showGlobalInstructions, setShowGlobalInstructions] = useState(false);
  
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [uploadingGalleryIdx, setUploadingGalleryIdx] = useState<number | null>(null);
  const [uploadingHeroIdx, setUploadingHeroIdx] = useState<number | null>(null);

  useEffect(() => {
      if (isSupabaseConfigured) {
          handleTestConnection(true);
      }
  }, []);

  const handleCopyConfig = () => {
    const code = `const HARDCODED_URL = '${dbUrl}';\nconst HARDCODED_KEY = '${dbKey}';`;
    navigator.clipboard.writeText(code);
    setConfigCopied(true);
    setTimeout(() => setConfigCopied(false), 2000);
  };

  const handleTestConnection = async (silent = false) => {
      if(!silent) setTestResult('Testing Connection...');
      try {
          const { error } = await supabase.from('app_config').select('*', { count: 'exact', head: true });
          if (error && error.code !== 'PGRST116') {
              setTestResult(`Connection Failed: ${error.message}`); 
              setStatusColor('red'); 
          }
          else { 
              setTestResult(`✅ Connected! Database is live.`); 
              setStatusColor('green'); 
          }
      } catch (err: any) { setTestResult(`Error: ${err.message}`); setStatusColor('red'); }
  };

  // --- IMAGE UPLOAD HANDLERS WITH COMPRESSION ---

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingLogo(true);
      try {
        const compressed = await compressImage(file, 800, 0.8);
        updateSettings('websiteLogo', compressed);
      } catch (err) {
        console.error("Logo compression failed", err);
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingFavicon(true);
      try {
        const compressed = await compressImage(file, 128, 0.6);
        updateSettings('websiteFavicon', compressed);
      } catch (err) {
        console.error("Favicon compression failed", err);
      } finally {
        setIsUploadingFavicon(false);
      }
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingHeroIdx(index);
      try {
        const compressed = await compressImage(file, 1920, 0.7); // High resolution but compressed
        const currentHero = [...(settings.heroImages || [])];
        // Ensure array has enough elements
        while (currentHero.length < 4) currentHero.push('');
        currentHero[index] = compressed;
        updateSettings('heroImages', currentHero);
      } catch (err) {
        console.error("Hero upload failed", err);
      } finally {
        setUploadingHeroIdx(null);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingGalleryIdx(index);
      try {
        const compressed = await compressImage(file, 1200, 0.7);
        const currentGallery = [...(settings.galleryImages || [])];
        // Ensure array has enough elements
        while (currentGallery.length < 4) currentGallery.push('');
        currentGallery[index] = compressed;
        updateSettings('galleryImages', currentGallery);
      } catch (err) {
        console.error("Gallery upload failed", err);
      } finally {
        setUploadingGalleryIdx(null);
      }
    }
  };

  const handleSeedData = async () => {
    if (confirm('This will insert real data for 64 districts into your database. Existing district records with same IDs will be updated. Proceed?')) {
      setIsSeeding(true);
      try {
        await seedDistricts();
      } finally {
        setIsSeeding(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Database Status Card */}
      <div className={`relative overflow-hidden rounded-2xl p-1 shadow-lg ${isGlobalConfig ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}>
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className={`p-5 rounded-2xl shadow-xl shrink-0 ${isGlobalConfig ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                {isGlobalConfig ? <Globe2 size={40} /> : <Lock size={40} />}
              </div>
              <div className="text-center lg:text-left">
                <h2 className={`text-3xl font-black tracking-tight ${isGlobalConfig ? 'text-emerald-900' : 'text-amber-900'}`}>
                  {isGlobalConfig ? 'GLOBAL SYSTEM ONLINE' : 'LOCAL MODE ENABLED'}
                </h2>
                <p className={`mt-2 font-medium text-lg max-w-lg ${isGlobalConfig ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {isGlobalConfig ? 'Success! Your database is connected and syncing globally.' : 'The app is running in restricted mode. Configure Supabase to enable global sync.'}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                   <Button onClick={() => setShowGlobalInstructions(!showGlobalInstructions)} variant="outline" className="bg-white border-gray-300 font-bold">
                     {showGlobalInstructions ? 'Hide Instructions' : 'Setup Global Access'}
                   </Button>
                   <Button onClick={() => handleTestConnection(false)} className="bg-brand-600 text-white flex items-center gap-2">
                     <Zap size={18} /> Test Sync
                   </Button>
                   {isSupabaseConfigured && (
                     <Button 
                       onClick={handleSeedData} 
                       disabled={isSeeding}
                       className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                     >
                       {isSeeding ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
                       Seed 64 Districts Data
                     </Button>
                   )}
                </div>
              </div>
            </div>
            {testResult && (
              <div className={`p-4 rounded-xl border font-bold text-sm ${statusColor === 'green' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {testResult}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <Layers className="text-brand-600" />
            <h3 className="text-xl font-bold text-gray-900">Module Management</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(modules).filter(m => m !== 'admin').map((modId) => (
              <ToggleSwitch 
                key={modId}
                label={modId.charAt(0).toUpperCase() + modId.slice(1).replace('_', ' ')}
                checked={modules[modId as ToggableModule]}
                onChange={() => toggleModule(modId as ToggableModule)}
              />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <Layout className="text-brand-600" />
            <h3 className="text-xl font-bold text-gray-900">Landing Page Sections</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(sections).map((secId) => (
              <ToggleSwitch 
                key={secId}
                label={secId.charAt(0).toUpperCase() + secId.slice(1)}
                checked={sections[secId as LandingSection]}
                onChange={() => toggleSection(secId as LandingSection)}
                color="bg-indigo-600"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Slider Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg text-brand-600"><ImageIcon size={20} /></div>
            <h3 className="text-xl font-bold text-gray-900">Hero Slider Images</h3>
          </div>
          <ToggleSwitch 
            label="Enable Hero Slider" 
            checked={settings.heroSliderActive} 
            onChange={() => updateSettings('heroSliderActive', !settings.heroSliderActive)}
            color="bg-brand-600"
          />
        </div>
        <div className="p-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((idx) => {
                 const img = settings.heroImages?.[idx];
                 return (
                   <div key={idx} className="space-y-3">
                      <div 
                        onClick={() => heroRefs[idx].current?.click()}
                        className={`aspect-video rounded-2xl border-2 border-dashed transition-all overflow-hidden relative group cursor-pointer flex items-center justify-center ${img ? 'border-brand-100' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                      >
                         {img ? (
                            <>
                               <img src={getOptimizedImageUrl(img, 600)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold text-xs shadow-xl flex items-center gap-2">
                                     {uploadingHeroIdx === idx ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                                     {uploadingHeroIdx === idx ? 'Processing' : 'Replace Image'}
                                  </div>
                               </div>
                            </>
                         ) : (
                            <div className="text-center">
                               {uploadingHeroIdx === idx ? <Loader2 className="animate-spin text-brand-600 mb-2 mx-auto" /> : <PlusCircle className="text-gray-300 mb-2 mx-auto" size={32} />}
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{uploadingHeroIdx === idx ? 'Compressing...' : 'Add Hero Image'}</p>
                            </div>
                         )}
                         <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-md uppercase tracking-widest z-10">Hero {idx + 1}</span>
                      </div>
                      <input type="file" ref={heroRefs[idx]} className="hidden" accept="image/*" onChange={(e) => handleHeroUpload(e, idx)} />
                   </div>
                 );
              })}
           </div>
           <p className="mt-6 text-xs text-gray-400 font-medium italic text-center">* All images are automatically compressed to high-quality WebP to save storage space.</p>
        </div>
      </div>

      {/* Gallery Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><ImageIcon size={20} /></div>
            <h3 className="text-xl font-bold text-gray-900">Gallery Management (Beautiful Bangladesh)</h3>
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">4 Custom Slots</div>
        </div>
        <div className="p-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((idx) => {
                 const img = settings.galleryImages?.[idx];
                 const labels = ['Tea Garden', 'Riverine', 'Parliament', 'Sundarbans'];
                 return (
                   <div key={idx} className="space-y-3">
                      <div 
                        onClick={() => galleryRefs[idx].current?.click()}
                        className={`aspect-[4/3] rounded-2xl border-2 border-dashed transition-all overflow-hidden relative group cursor-pointer flex items-center justify-center ${img ? 'border-teal-100' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                      >
                         {img ? (
                            <>
                               <img src={getOptimizedImageUrl(img, 400)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold text-xs shadow-xl flex items-center gap-2">
                                     {uploadingGalleryIdx === idx ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                                     {uploadingGalleryIdx === idx ? 'Processing' : 'Replace Image'}
                                  </div>
                               </div>
                            </>
                         ) : (
                            <div className="text-center">
                               {uploadingGalleryIdx === idx ? <Loader2 className="animate-spin text-teal-600 mb-2 mx-auto" /> : <PlusCircle className="text-gray-300 mb-2 mx-auto" size={32} />}
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{uploadingGalleryIdx === idx ? 'Processing' : 'Add Image'}</p>
                            </div>
                         )}
                         <span className="absolute top-2 left-2 bg-teal-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-md uppercase tracking-widest z-10">Slot {idx + 1}</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase text-center">{labels[idx]}</p>
                      <input type="file" ref={galleryRefs[idx]} className="hidden" accept="image/*" onChange={(e) => handleGalleryUpload(e, idx)} />
                   </div>
                 );
              })}
           </div>
        </div>
      </div>

      {/* Website Identity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
             <Smartphone className="text-brand-600" />
             <h3 className="text-xl font-bold text-gray-900">Website Identity</h3>
           </div>
           <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Website Title</label>
                  <input 
                    type="text"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                    value={settings.websiteTitle}
                    onChange={(e) => updateSettings('websiteTitle', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Logo (Compressed)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                        {settings.websiteLogo ? <img src={settings.websiteLogo} className="w-full h-full object-contain" /> : <ImageIcon className="text-gray-300" size={20} />}
                      </div>
                      <Button onClick={() => logoInputRef.current?.click()} variant="outline" size="sm" className="text-xs px-3 py-2 bg-white">
                        {isUploadingLogo ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14} className="mr-2"/>}
                        Upload
                      </Button>
                      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Favicon</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                        {settings.websiteFavicon ? <img src={settings.websiteFavicon} className="w-8 h-8 object-contain" /> : <ImageIcon className="text-gray-300" size={20} />}
                      </div>
                      <Button onClick={() => faviconInputRef.current?.click()} variant="outline" size="sm" className="text-xs px-3 py-2 bg-white">
                        {isUploadingFavicon ? <Loader2 className="animate-spin" size={14}/> : <Upload size={14} className="mr-2"/>}
                        Upload
                      </Button>
                      <input type="file" ref={faviconInputRef} className="hidden" accept="image/*" onChange={handleFaviconUpload} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact Email</label>
                  <input 
                    type="email"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                    value={settings.contactEmail}
                    onChange={(e) => updateSettings('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact Phone</label>
                  <input 
                    type="text"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                    value={settings.contactPhone}
                    onChange={(e) => updateSettings('contactPhone', e.target.value)}
                  />
                </div>
              </div>
           </div>
        </div>

      {/* System Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Power className="text-red-500" /> System Controls
            </h3>
            <div className="space-y-4">
              <ToggleSwitch 
                label="Maintenance Mode" 
                checked={settings.maintenanceMode} 
                onChange={() => updateSettings('maintenanceMode', !settings.maintenanceMode)}
                color="bg-red-600"
              />
              <ToggleSwitch 
                label="Global Announcement" 
                checked={settings.announcementActive} 
                onChange={() => updateSettings('announcementActive', !settings.announcementActive)}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Office Address</label>
           <textarea 
             className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-medium"
             value={settings.address}
             onChange={(e) => updateSettings('address', e.target.value)}
             rows={3}
           />
        </div>
      </div>
    </div>
  );
};