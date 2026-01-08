
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, HelpCircle, ChevronDown, ChevronUp, Facebook, Twitter, Youtube } from 'lucide-react';
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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
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
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100 max-w-lg w-full animate-fade-in-up">
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
          <Button onClick={() => setSubmitted(false)} size="lg" variant="outline" className="px-12 rounded-xl font-bold">
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
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
             {isBangla ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch'}
           </h2>
           <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium">
             {isBangla ? 'আপনার যেকোনো প্রশ্ন বা মতামতের জন্য আমরা সর্বদা প্রস্তুত' : 'We are always here to help you with any questions or feedback'}
           </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
           {/* Contact Form */}
           <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
               <Mail className="text-brand-600" />
               {isBangla ? 'আমাদের বার্তা পাঠান' : 'Send us a Message'}
             </h2>
             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                     {isBangla ? 'আপনার নাম' : 'Your Name'}
                   </label>
                   <input 
                     type="text" 
                     required
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-black focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none bg-gray-50 focus:bg-white transition-all font-bold placeholder-gray-300 shadow-sm"
                     placeholder={isBangla ? 'যেমন: রহিম আহমেদ' : 'e.g. Rahim Ahmed'}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                     {isBangla ? 'ফোন নম্বর' : 'Phone Number'}
                   </label>
                   <input 
                     type="text" 
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                     className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-black focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none bg-gray-50 focus:bg-white transition-all font-bold placeholder-gray-300 shadow-sm"
                     placeholder="01XXXXXXXXX"
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                   {isBangla ? 'ইমেল (Gmail)' : 'Email Address (Gmail)'}
                 </label>
                 <input 
                   type="email" 
                   required
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-black focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none bg-gray-50 focus:bg-white transition-all font-bold placeholder-gray-300 shadow-sm"
                   placeholder="example@gmail.com"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                   {isBangla ? 'আপনার বার্তা' : 'Your Message'}
                 </label>
                 <textarea 
                   rows={5}
                   required
                   value={formData.message}
                   onChange={e => setFormData({...formData, message: e.target.value})}
                   className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-black focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none resize-none bg-gray-50 focus:bg-white transition-all font-medium placeholder-gray-300 shadow-sm leading-relaxed"
                   placeholder={isBangla ? 'এখানে আপনার কথা লিখুন...' : 'Write your message here...'}
                 ></textarea>
               </div>
               <Button type="submit" size="lg" disabled={isSubmitting} className="w-full py-5 rounded-2xl bg-brand-600 hover:bg-brand-700 font-black text-lg shadow-xl shadow-brand-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                 {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={20}/> {isBangla ? 'বার্তা পাঠান' : 'Send Message'}</>}
               </Button>
             </form>
           </div>

           {/* Contact Info Column */}
           <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6 group hover:border-brand-200 transition-all hover:shadow-md">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-sm">
                  <MapPin size={28} />
                </div>
                <div>
                   <h4 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'অফিসের ঠিকানা' : 'Office Address'}</h4>
                   <p className="text-gray-500 leading-relaxed font-medium">{settings.address}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6 group hover:border-blue-200 transition-all hover:shadow-md">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                  <Phone size={28} />
                </div>
                <div>
                   <h4 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'সরাসরি কল করুন' : 'Call Us Directly'}</h4>
                   <p className="text-2xl font-black text-gray-800">{settings.contactPhone}</p>
                   <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-widest">{isBangla ? '২৪/৭ সার্ভিস' : '24/7 Service'}</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6 group hover:border-purple-200 transition-all hover:shadow-md">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                  <Mail size={28} />
                </div>
                <div>
                   <h4 className="text-xl font-bold text-gray-900 mb-2">{isBangla ? 'ইমেল করুন' : 'Email Us'}</h4>
                   <p className="text-lg font-bold text-gray-800">{settings.contactEmail}</p>
                   <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-widest">{isBangla ? '১ কার্যদিবসে উত্তর' : 'Reply in 1 working day'}</p>
                </div>
              </div>

              <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <h4 className="text-xl font-bold mb-6 relative z-10">{isBangla ? 'সোশ্যাল মিডিয়ায় আমরা' : 'Follow Our Socials'}</h4>
                <div className="flex gap-4 relative z-10">
                   <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all text-white hover:scale-110">
                      <Facebook size={24} fill="currentColor" />
                   </a>
                   <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-sky-400 transition-all text-white hover:scale-110">
                      <Twitter size={24} fill="currentColor" />
                   </a>
                   <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all text-white hover:scale-110">
                      <Youtube size={24} />
                   </a>
                </div>
              </div>
           </div>
         </div>

         {/* FAQ Section */}
         <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 md:p-16">
            <div className="text-center mb-12">
               <h3 className="text-3xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
                 <HelpCircle size={32} className="text-brand-600" />
                 {isBangla ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}
               </h3>
               <p className="text-gray-500 font-medium">{isBangla ? 'আপনার মনের সাধারণ কিছু প্রশ্নের উত্তর এখানে দেওয়া আছে।' : 'Answers to some of your common questions.'}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {(faqs || []).map((faq, idx) => (
                <div key={faq.id || idx} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedFaq === idx ? 'border-brand-200 ring-4 ring-brand-50' : 'border-gray-100'}`}>
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className={`w-full flex items-center justify-between p-6 text-left transition-colors ${expandedFaq === idx ? 'bg-brand-50/30' : 'hover:bg-gray-50'}`}
                  >
                    <span className={`text-lg font-bold ${expandedFaq === idx ? 'text-brand-700' : 'text-gray-800'}`}>
                      {isBangla ? faq.questionBn : faq.questionEn}
                    </span>
                    {expandedFaq === idx ? <ChevronUp size={24} className="text-brand-600" /> : <ChevronDown size={24} className="text-gray-400" />}
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-6 pt-2 bg-white animate-fade-in">
                       <p className="text-gray-600 leading-relaxed font-medium border-t border-gray-50 pt-4">
                         {isBangla ? faq.answerBn : faq.answerEn}
                       </p>
                    </div>
                  )}
                </div>
              ))}
              {(faqs || []).length === 0 && (
                <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                  <HelpCircle size={40} className="mx-auto mb-2 opacity-20" />
                  <p>{isBangla ? 'কোন প্রশ্ন পাওয়া যায়নি।' : 'No FAQs found.'}</p>
                </div>
              )}
            </div>
         </div>
       </div>
    </div>
  );
};
