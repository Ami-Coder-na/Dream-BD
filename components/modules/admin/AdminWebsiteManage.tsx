
import React from 'react';
import { 
  Monitor, Layout, Layers, ToggleLeft, ToggleRight, 
  AlertTriangle, Megaphone, Power, CheckCircle, Smartphone, Database, Server
} from 'lucide-react';
import { useSiteConfig, ToggableModule, LandingSection } from '../../../contexts/SiteConfigContext';
import { isSupabaseConfigured } from '../../../services/supabaseClient';
import { AppModule } from '../../../types';

export const AdminWebsiteManage = () => {
  const { modules, sections, settings, toggleModule, toggleSection, updateSettings } = useSiteConfig();

  // Helper for Toggle Switch
  const ToggleSwitch = ({ label, checked, onChange, color = 'bg-green-500' }: { label: string, checked: boolean, onChange: () => void, color?: string }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-all">
      <span className="font-medium text-gray-900">{label}</span>
      <button 
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? color : 'bg-gray-300'}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Database Connection Status (New) */}
      <div className={`rounded-2xl p-6 border-2 flex items-center justify-between ${isSupabaseConfigured ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
         <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isSupabaseConfigured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               <Database size={24} />
            </div>
            <div>
               <h3 className={`text-lg font-bold ${isSupabaseConfigured ? 'text-green-900' : 'text-red-900'}`}>
                 {isSupabaseConfigured ? 'Database Connected' : 'Using Local Storage'}
               </h3>
               <p className={`text-sm ${isSupabaseConfigured ? 'text-green-700' : 'text-red-700'}`}>
                 {isSupabaseConfigured 
                   ? 'Connected to Supabase. Data is syncing in real-time.' 
                   : 'Supabase URL/Key missing in environment variables. Data will not persist.'}
               </p>
            </div>
         </div>
         <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${isSupabaseConfigured ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {isSupabaseConfigured ? 'Online' : 'Offline'}
         </div>
      </div>

      {/* Advanced Settings: Global Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
          <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
            <Monitor size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">System Controls</h3>
            <p className="text-xs text-gray-500">Global settings and maintenance</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Maintenance Mode */}
           <div className={`p-6 rounded-2xl border-2 transition-all ${settings.maintenanceMode ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}>
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${settings.maintenanceMode ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                       <Power size={24} />
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900">Maintenance Mode</h4>
                       <p className="text-xs text-gray-500">Take site offline for users</p>
                    </div>
                 </div>
                 <button 
                    onClick={() => updateSettings('maintenanceMode', !settings.maintenanceMode)}
                    className={`font-bold text-xs px-3 py-1 rounded-full ${settings.maintenanceMode ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                 >
                    {settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}
                 </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                When enabled, regular users will see a "Under Maintenance" screen. Admins can still access the dashboard.
              </p>
           </div>

           {/* Announcement Bar */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h4 className="font-bold text-gray-900 flex items-center gap-2"><Megaphone size={18} className="text-orange-500"/> Announcement Bar</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">{settings.announcementActive ? 'ON' : 'OFF'}</span>
                    <button 
                      onClick={() => updateSettings('announcementActive', !settings.announcementActive)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${settings.announcementActive ? 'bg-orange-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${settings.announcementActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
              </div>
              <textarea 
                value={settings.announcement}
                onChange={(e) => updateSettings('announcement', e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400"
                rows={3}
                placeholder="Enter announcement text..."
              />
              <p className="text-xs text-gray-500">This text will appear at the very top of the website.</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Header Modules Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
             <Layers size={20} className="text-blue-600"/>
             <h3 className="font-bold text-gray-900">Header Modules</h3>
          </div>
          <div className="p-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ToggleSwitch label="Amar Bangladesh" checked={modules[AppModule.AMAR_BD]} onChange={() => toggleModule(AppModule.AMAR_BD)} color="bg-blue-600" />
                <ToggleSwitch label="Amar Jela" checked={modules[AppModule.AMAR_JELA]} onChange={() => toggleModule(AppModule.AMAR_JELA)} color="bg-blue-600" />
                <ToggleSwitch label="Bazar Sodai" checked={modules[AppModule.BAZAR_SODAI]} onChange={() => toggleModule(AppModule.BAZAR_SODAI)} color="bg-blue-600" />
                <ToggleSwitch label="Jobs" checked={modules[AppModule.JOB]} onChange={() => toggleModule(AppModule.JOB)} color="bg-blue-600" />
                <ToggleSwitch label="Blog" checked={modules[AppModule.BLOG]} onChange={() => toggleModule(AppModule.BLOG)} color="bg-blue-600" />
                <ToggleSwitch label="Contact" checked={modules[AppModule.CONTACT]} onChange={() => toggleModule(AppModule.CONTACT)} color="bg-blue-600" />
                
                {/* Services Dropdown Items */}
                <div className="sm:col-span-2 mt-4 mb-2">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Services Dropdown Items</p>
                </div>
                <ToggleSwitch label="Agriculture" checked={modules[AppModule.AGRI]} onChange={() => toggleModule(AppModule.AGRI)} color="bg-blue-600" />
                <ToggleSwitch label="Health" checked={modules[AppModule.HEALTH]} onChange={() => toggleModule(AppModule.HEALTH)} color="bg-blue-600" />
                <ToggleSwitch label="Education" checked={modules[AppModule.EDU]} onChange={() => toggleModule(AppModule.EDU)} color="bg-blue-600" />
                <ToggleSwitch label="Transport" checked={modules[AppModule.TRANSPORT]} onChange={() => toggleModule(AppModule.TRANSPORT)} color="bg-blue-600" />
                <ToggleSwitch label="Disaster" checked={modules[AppModule.DISASTER]} onChange={() => toggleModule(AppModule.DISASTER)} color="bg-blue-600" />
                <ToggleSwitch label="Fishery" checked={modules[AppModule.FISHERY]} onChange={() => toggleModule(AppModule.FISHERY)} color="bg-blue-600" />
                <ToggleSwitch label="Waste Mgmt" checked={modules[AppModule.WASTE]} onChange={() => toggleModule(AppModule.WASTE)} color="bg-blue-600" />
                <ToggleSwitch label="Crafts" checked={modules[AppModule.CRAFT]} onChange={() => toggleModule(AppModule.CRAFT)} color="bg-blue-600" />
             </div>
          </div>
        </div>

        {/* Landing Page Sections Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-fit">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
             <Layout size={20} className="text-indigo-600"/>
             <h3 className="font-bold text-gray-900">Landing Page Sections</h3>
          </div>
          <div className="p-6">
             <div className="space-y-4">
                <ToggleSwitch label="Hero Section (Top Banner)" checked={sections.hero} onChange={() => toggleSection('hero')} color="bg-indigo-600" />
                <ToggleSwitch label="About Platform" checked={sections.about} onChange={() => toggleSection('about')} color="bg-indigo-600" />
                <ToggleSwitch label="How it Works" checked={sections.features} onChange={() => toggleSection('features')} color="bg-indigo-600" />
                <ToggleSwitch label="Beautiful Bangladesh Gallery" checked={sections.gallery} onChange={() => toggleSection('gallery')} color="bg-indigo-600" />
                <ToggleSwitch label="Testimonials" checked={sections.testimonials} onChange={() => toggleSection('testimonials')} color="bg-indigo-600" />
                
                <div className="mt-6 mb-2">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Module Previews on Home</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <ToggleSwitch label="Craft Preview" checked={sections.craft} onChange={() => toggleSection('craft')} color="bg-indigo-600" />
                   <ToggleSwitch label="Agri Preview" checked={sections.agri} onChange={() => toggleSection('agri')} color="bg-indigo-600" />
                   <ToggleSwitch label="Health Preview" checked={sections.health} onChange={() => toggleSection('health')} color="bg-indigo-600" />
                   <ToggleSwitch label="Education Preview" checked={sections.edu} onChange={() => toggleSection('edu')} color="bg-indigo-600" />
                   <ToggleSwitch label="Transport Preview" checked={sections.transport} onChange={() => toggleSection('transport')} color="bg-indigo-600" />
                   <ToggleSwitch label="Waste Preview" checked={sections.waste} onChange={() => toggleSection('waste')} color="bg-indigo-600" />
                   <ToggleSwitch label="Fishery Preview" checked={sections.fishery} onChange={() => toggleSection('fishery')} color="bg-indigo-600" />
                   <ToggleSwitch label="Disaster Preview" checked={sections.disaster} onChange={() => toggleSection('disaster')} color="bg-indigo-600" />
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
