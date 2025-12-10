import React from 'react';
import { AppModule, User } from '../types';
import { MODULE_CONFIG, ALERTS } from '../constants';
import { ShoppingBag, Sprout, BookOpen, HeartPulse, Bus, Trash2, Fish, AlertOctagon, ArrowRight } from 'lucide-react';
import { CraftModule } from './modules/CraftModule';
import { AgriModule } from './modules/AgriModule';

interface DashboardProps {
  user: User;
  activeModule: AppModule;
  onModuleSelect: (module: AppModule) => void;
  isBangla: boolean;
}

const getModuleIcon = (module: AppModule) => {
  switch (module) {
    case AppModule.CRAFT: return <ShoppingBag />;
    case AppModule.AGRI: return <Sprout />;
    case AppModule.EDU: return <BookOpen />;
    case AppModule.HEALTH: return <HeartPulse />;
    case AppModule.TRANSPORT: return <Bus />;
    case AppModule.WASTE: return <Trash2 />;
    case AppModule.FISHERY: return <Fish />;
    case AppModule.DISASTER: return <AlertOctagon />;
    default: return <ShoppingBag />;
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ user, activeModule, onModuleSelect, isBangla }) => {
  
  // If we are on the Home 'module', show the grid of cards
  if (activeModule === AppModule.HOME) {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isBangla ? `স্বাগতম, ${user.name}` : `Welcome back, ${user.name}`}
            </h1>
            <p className="text-gray-500 mt-2">
              {isBangla ? 'আজ আপনি কোন সেবাটি নিতে চান?' : 'Which service would you like to access today?'}
            </p>
          </div>
        </div>

        {/* Alerts Banner */}
        {ALERTS.length > 0 && (
          <div className="space-y-2">
            {ALERTS.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg flex items-center justify-between ${alert.level === 'danger' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                <div className="flex items-center gap-3">
                  <AlertOctagon size={20} />
                  <span className="font-medium">{alert.message}</span>
                </div>
                <span className="text-xs opacity-75">{alert.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(MODULE_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => onModuleSelect(key as AppModule)}
              className="group relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-200 transition-all duration-300 text-left p-6"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 ${config.color} shadow-md group-hover:scale-110 transition-transform`}>
                {getModuleIcon(key as AppModule)}
              </div>
              <h3 className="font-bold text-gray-800 text-lg">
                {isBangla ? config.titleBn : config.title}
              </h3>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-600">
                <ArrowRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Render Specific Module Content
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6 text-gray-500 text-sm">
        <button onClick={() => onModuleSelect(AppModule.HOME)} className="hover:text-brand-600">
          {isBangla ? 'হোম' : 'Home'}
        </button>
        <span>/</span>
        <span className="font-medium text-gray-900">
          {isBangla ? MODULE_CONFIG[activeModule].titleBn : MODULE_CONFIG[activeModule].title}
        </span>
      </div>

      {activeModule === AppModule.CRAFT && <CraftModule isBangla={isBangla} />}
      {activeModule === AppModule.AGRI && <AgriModule isBangla={isBangla} />}
      
      {/* Placeholder for other modules to keep code concise */}
      {![AppModule.CRAFT, AppModule.AGRI].includes(activeModule) && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
            {getModuleIcon(activeModule)}
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {isBangla ? 'শীঘ্রই আসছে' : 'Coming Soon'}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            {isBangla 
              ? 'এই মডিউলটি বর্তমানে উন্নয়নাধীন রয়েছে। অনুগ্রহ করে পরে আবার চেক করুন।' 
              : 'This module is currently under development as part of the Phase 2 rollout.'}
          </p>
        </div>
      )}
    </div>
  );
};
