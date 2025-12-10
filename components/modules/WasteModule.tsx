import React from 'react';
import { Trash2, Camera, MapPin, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const WasteModule: React.FC<Props> = ({ isBangla }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Report Issue Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gray-100 rounded-full">
            <Trash2 className="text-gray-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isBangla ? 'বর্জ্য রিপোর্ট করুন' : 'Report Waste Issue'}
            </h2>
            <p className="text-sm text-gray-500">
              {isBangla ? 'আপনার এলাকার বর্জ্য অব্যবস্থাপনার ছবি তুলে পাঠান' : 'Upload photo and location of uncollected waste'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors group">
            <Camera className="text-gray-400 group-hover:text-gray-600 mb-2" size={32} />
            <span className="text-sm font-medium text-gray-500">
              {isBangla ? 'ছবি তুলুন / আপলোড করুন' : 'Take Photo / Upload'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                {isBangla ? 'লোকেশন' : 'Location'}
              </label>
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                <MapPin className="text-red-500 mr-2" size={18} />
                <span className="text-gray-800 text-sm">Mirpur 10, Dhaka (Detected)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                {isBangla ? 'সমস্যার ধরন' : 'Issue Type'}
              </label>
              <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400">
                <option>{isBangla ? 'রাস্তায় আবর্জনা' : 'Roadside Garbage'}</option>
                <option>{isBangla ? 'ড্রেন জ্যাম' : 'Drain Blockage'}</option>
                <option>{isBangla ? 'ডাস্টবিন উপচে পড়ছে' : 'Dustbin Overflow'}</option>
              </select>
            </div>

            <Button className="w-full bg-gray-800 hover:bg-gray-900">
              {isBangla ? 'রিপোর্ট জমা দিন' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </div>

      {/* Schedule & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="bg-green-50 border border-green-100 p-6 rounded-xl md:col-span-2">
          <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            {isBangla ? 'বর্জ্য সংগ্রহের সময়সূচী' : 'Collection Schedule'}
          </h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-100">
               <span className="font-medium text-gray-700">{isBangla ? 'গৃহস্থালি বর্জ্য' : 'Household Waste'}</span>
               <span className="text-sm text-green-600 font-bold">Today, 5:00 PM</span>
             </div>
             <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-100">
               <span className="font-medium text-gray-700">{isBangla ? 'প্লাস্টিক রিসাইক্লিং' : 'Plastic Recycling'}</span>
               <span className="text-sm text-green-600 font-bold">Friday, 10:00 AM</span>
             </div>
          </div>
        </div>

        {/* Recycling Stats */}
        <div className="bg-white border border-gray-100 p-6 rounded-xl text-center">
           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
             <CheckCircle size={32} />
           </div>
           <h3 className="font-bold text-gray-900 text-2xl">120 kg</h3>
           <p className="text-sm text-gray-500 mb-2">
             {isBangla ? 'মোট রিসাইক্লিং' : 'Total Recycled'}
           </p>
           <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full inline-block">
             {isBangla ? 'আপনি পরিবেশ বাঁচাচ্ছেন!' : 'You are saving the planet!'}
           </div>
        </div>
      </div>
    </div>
  );
};