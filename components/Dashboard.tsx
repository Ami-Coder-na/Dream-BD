
import React from 'react';
import { AppModule, User } from '../types';
import { CraftModule } from './modules/CraftModule';
import { AgriModule } from './modules/AgriModule';
import { EduModule } from './modules/EduModule';
import { HealthModule } from './modules/HealthModule';
import { TransportModule } from './modules/TransportModule';
import { WasteModule } from './modules/WasteModule';
import { FisheryModule } from './modules/FisheryModule';
import { DisasterModule } from './modules/DisasterModule';
import { ProfilePage } from './ProfilePage';
import { ShoppingBag, Sprout, BookOpen, HeartPulse, Bus, Trash2, Fish, AlertOctagon } from 'lucide-react';

interface DashboardProps {
  user: User;
  activeModule: AppModule;
  onModuleSelect: (module: AppModule) => void;
  onUpdateUser: (updatedUser: User) => void;
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

export const Dashboard: React.FC<DashboardProps> = ({ user, activeModule, onModuleSelect, onUpdateUser, isBangla }) => {
  
  const renderContent = () => {
    switch (activeModule) {
      case AppModule.PROFILE:
        return <ProfilePage user={user} onUpdateUser={onUpdateUser} isBangla={isBangla} />;
      case AppModule.CRAFT:
        return <CraftModule isBangla={isBangla} />;
      case AppModule.AGRI:
        return <AgriModule isBangla={isBangla} />;
      case AppModule.EDU:
        return <EduModule isBangla={isBangla} />;
      case AppModule.HEALTH:
        return <HealthModule isBangla={isBangla} />;
      case AppModule.TRANSPORT:
        return <TransportModule isBangla={isBangla} />;
      case AppModule.WASTE:
        return <WasteModule isBangla={isBangla} />;
      case AppModule.FISHERY:
        return <FisheryModule isBangla={isBangla} />;
      case AppModule.DISASTER:
        return <DisasterModule isBangla={isBangla} />;
        
      // Job, Blog, Contact are handled at App level as full pages, 
      // but if they fall through here for any reason, we handle them safely.
      default:
        return (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 animate-fade-in">
            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4 text-gray-500">
              {getModuleIcon(activeModule)}
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {isBangla ? 'শীঘ্রই আসছে' : 'Coming Soon'}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {isBangla 
                ? 'এই মডিউলটি বর্তমানে উন্নয়নাধীন রয়েছে।' 
                : 'This module is currently under development.'}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {renderContent()}
    </div>
  );
};