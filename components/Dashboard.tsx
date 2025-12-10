import React from 'react';
import { AppModule, User } from '../types';
import { CraftModule } from './modules/CraftModule';
import { AgriModule } from './modules/AgriModule';
import { JobModule } from './modules/JobModule';
import { ContactModule } from './modules/ContactModule';
import { BlogModule } from './modules/BlogModule';
import { ProfilePage } from './ProfilePage';
import { ShoppingBag, Sprout, BookOpen, HeartPulse, Bus, Trash2, Fish, AlertOctagon, Briefcase, MessageCircle, Newspaper } from 'lucide-react';

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
    case AppModule.JOB: return <Briefcase />;
    case AppModule.CONTACT: return <MessageCircle />;
    case AppModule.BLOG: return <Newspaper />;
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
      case AppModule.JOB:
        return <JobModule isBangla={isBangla} />;
      case AppModule.CONTACT:
        return <ContactModule isBangla={isBangla} />;
      case AppModule.BLOG:
        return <BlogModule isBangla={isBangla} />;
      default:
        // Placeholder for modules under development
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
                ? 'এই মডিউলটি বর্তমানে উন্নয়নাধীন রয়েছে। অনুগ্রহ করে পরে আবার চেক করুন।' 
                : 'This module is currently under development as part of the Phase 2 rollout.'}
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