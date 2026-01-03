
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

export const ContactModule: React.FC<Props> = ({ isBangla }) => {
  const { addMessage, faqs } = useData();
  const { settings } = useSiteConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict @gmail.com validation
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      alert(isBangla ? 'শুধুমাত্র @gmail.com ইমেইল ব্যবহার করা যাবে।' : 'Only @gmail.com emails are allowed.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert(isBangla ? 'দুঃখিত, বার্তা পাঠানো সম্ভব হয়নি।' : 'Sorry, failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100 max-w-lg w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="text-green-600" size={36} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {isBangla ? 'ধন্যবাদ!' : 'Thank You!'}
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            {isBangla 
              ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।' 
              : 'Your message has been sent successfully. We will contact you soon.'}
          </p>
          <Button onClick={() => setSubmitted(false)} size="lg" variant="outline">
            {isBangla ? 'ফিরে যান' : 'Go Back'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
       <div className="max-w-7xl mx-auto">
         <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-gray-900 mb-4">
             {isBangla ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch'}
           </h2>
           <p className="text-gray-500 max-w-xl mx-auto">
             {isBangla ? 'আপনার যেকোনো প্রশ্ন বা মতামতের জন্য আমরা সর্বদা প্রস্তুত' : 'We are always here to help you with any questions or feedback'}
           </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
           {/* Contact Form */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">
               {isBangla ? 'আমাদের বার্তা পাঠান' : 'Send us a Message'}
             </h2>
             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     {isBangla ? 'আপনার নাম' : 'Your Name'}
                   </label>
                   <input 
                     type="text" 
                     required
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     {isBangla ? 'ফোন নম্বর' : 'Phone Number'}
                   </label>
                   <input 
                     type="text" 
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   {isBangla ? 'ইমেল' : 'Email Address'}
                 </label>
                 <input 
                   type="email" 
                   required
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
                   placeholder="example@gmail.com"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   {isBangla ? 'বার্তা' : 'Message'}
                 </label>
                 <textarea 
                   rows={5}
                   required
                   value={formData.message}
                   onChange={e => setFormData({...formData, message: e.target.value})}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none bg-gray-50 focus:bg-white transition-all"
                 ></textarea>
               </div>
               <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                 {isSubmitting ? <Loader2 className="animate-spin" /> : (isBangla ? 'বার্তা পাঠান' : 'Send Message')}
               </Button>
             </form>
           </div>

           {/* Contact Info */}
           <div className="space-y-8">
             <div className="bg-violet-600 p-8 rounded-2xl text-white shadow-lg overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mb-10"></div>
               
               <h2 className="text-2xl font-bold mb-8 relative z-10">
                 {isBangla ? 'যোগাযোগের তথ্য' : 'Contact Information'}
               </h2>
               <div className="space-y-6 relative z-10">
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="text-white" size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg">{isBangla ? 'অফিস' : 'Office'}</h3>
                     <p className="text-violet-100 opacity-90 whitespace-pre-wrap">
                       {settings.address}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="text-white" size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg">{isBangla ? 'ফোন' : 'Phone'}</h3>
                     <p className="text-violet-100 opacity-90 font-mono">{settings.contactPhone}</p>
                     <p className="text-xs mt-1 text-violet-200">
                       {isBangla ? '(সকাল ৯টা - বিকাল ৫টা)' : '(9 AM - 5 PM)'}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="text-white" size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg">{isBangla ? 'ইমেল' : 'Email'}</h3>
                     <p className="text-violet-100 opacity-90">{settings.contactEmail}</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  {isBangla ? 'সচরাচর জিজ্ঞাসা (FAQ)' : 'Quick FAQ'}
                </h3>
                <div className="space-y-4">
                  {(faqs || []).map((faq: any) => (
                    <details key={faq.id} className="group border border-gray-100 rounded-lg p-3 open:bg-gray-50">
                      <summary className="cursor-pointer font-medium text-gray-700 hover:text-brand-600 list-none flex justify-between items-center">
                        {isBangla ? faq.questionBn : faq.questionEn}
                        <span className="group-open:rotate-180 transition-transform text-gray-400">▼</span>
                      </summary>
                      <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                        {isBangla ? faq.answerBn : faq.answerEn}
                      </p>
                    </details>
                  ))}
                </div>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};
