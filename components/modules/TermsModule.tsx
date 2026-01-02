
import React from 'react';
import { Gavel, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

export const TermsModule: React.FC<Props> = ({ isBangla }) => {
  const { termsConditions } = useData();

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4 animate-fade-in font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
           <div className="flex flex-col items-center text-center mb-12">
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <FileCheck size={32} />
             </div>
             <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">
               {isBangla ? 'শর্তাবলী' : 'Terms and Conditions'}
             </h1>
             <p className="text-gray-500 font-medium max-w-lg">
               {isBangla ? 'আমাদের প্ল্যাটফর্ম ব্যবহারের নিয়মসমূহ জানুন।' : 'Understand the rules for using our platform.'}
             </p>
           </div>

           <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
             {isBangla ? termsConditions.contentBn : termsConditions.contentEn}
           </div>

           <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
             {isBangla ? 'শেষ আপডেট: জানুয়ারি ২০২৪' : 'Last Updated: January 2024'}
           </div>
        </div>
      </div>
    </div>
  );
};
