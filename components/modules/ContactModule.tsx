import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const ContactModule: React.FC<Props> = ({ isBangla }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isBangla ? 'ধন্যবাদ!' : 'Thank You!'}
        </h2>
        <p className="text-gray-600">
          {isBangla 
            ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।' 
            : 'Your message has been sent successfully. We will contact you soon.'}
        </p>
        <Button onClick={() => setSubmitted(false)} className="mt-6" variant="outline">
          {isBangla ? 'ফিরে যান' : 'Go Back'}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Contact Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {isBangla ? 'আমাদের বার্তা পাঠান' : 'Send us a Message'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isBangla ? 'আপনার নাম' : 'Your Name'}
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isBangla ? 'ইমেল' : 'Email Address'}
            </label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isBangla ? 'বার্তা' : 'Message'}
            </label>
            <textarea 
              rows={4}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
            ></textarea>
          </div>
          <Button type="submit" className="w-full">
            {isBangla ? 'পাঠান' : 'Send Message'}
          </Button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="space-y-6">
        <div className="bg-violet-50 p-6 rounded-xl border border-violet-100">
          <h2 className="text-xl font-bold text-violet-900 mb-4">
            {isBangla ? 'যোগাযোগের তথ্য' : 'Contact Information'}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-violet-600 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-gray-900">{isBangla ? 'অফিস' : 'Office'}</h3>
                <p className="text-gray-600 text-sm">
                  ICT Tower, Agargaon,<br/>Dhaka-1207, Bangladesh
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-violet-600 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-gray-900">{isBangla ? 'ফোন' : 'Phone'}</h3>
                <p className="text-gray-600 text-sm">+880 1234 567890</p>
                <p className="text-gray-600 text-sm text-xs mt-1">
                  {isBangla ? '(সকাল ৯টা - বিকাল ৫টা)' : '(9 AM - 5 PM)'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-violet-600 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-gray-900">{isBangla ? 'ইমেল' : 'Email'}</h3>
                <p className="text-gray-600 text-sm">support@dreambd.gov.bd</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-900 mb-2">
             {isBangla ? 'সচরাচর জিজ্ঞাসা (FAQ)' : 'Quick FAQ'}
           </h3>
           <div className="space-y-3">
             <details className="group">
               <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-brand-600 list-none flex justify-between">
                 {isBangla ? 'কিভাবে একাউন্ট খুলব?' : 'How to create account?'}
                 <span className="group-open:rotate-180 transition-transform">▼</span>
               </summary>
               <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                 {isBangla ? 'রেজিস্ট্রেশন বাটনে ক্লিক করে ফর্ম পূরণ করুন।' : 'Click Register and fill out the form.'}
               </p>
             </details>
             <div className="border-t border-gray-50"></div>
             <details className="group">
               <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-brand-600 list-none flex justify-between">
                 {isBangla ? 'পাসওয়ার্ড ভুলে গেছি?' : 'Forgot Password?'}
                 <span className="group-open:rotate-180 transition-transform">▼</span>
               </summary>
               <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                 {isBangla ? 'লগইন পেজে "পাসওয়ার্ড ভুলে গেছি" অপশন ব্যবহার করুন।' : 'Use the "Forgot Password" link on login page.'}
               </p>
             </details>
           </div>
        </div>
      </div>
    </div>
  );
};