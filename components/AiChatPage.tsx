
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bird, ArrowLeft, Loader2, User as UserIcon, Sparkles, Paperclip, X as XIcon, Image as ImageIcon, Mic, ThumbsUp, ThumbsDown, MessageSquare, Clock, Plus, Menu, Trash2, Check, Zap, Crown, Rocket, ShieldCheck, CreditCard, Smartphone, Wallet, Tag, ClipboardCheck } from 'lucide-react';
import { generateAssistantResponse } from '../services/geminiService';
import { ChatMessage, Attachment, ChatSession, SubscriptionTier, PricingPlan, PromoCode, PaymentRequest } from '../types';
import { useData } from '../contexts/DataContext';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { Button } from './ui/Button';

interface AiChatPageProps {
  onBack: () => void;
  isBangla: boolean;
}

export const AiChatPage: React.FC<AiChatPageProps> = ({ onBack, isBangla }) => {
  const { users, updateUser, pricingPlans, promoCodes, addPaymentRequest } = useData();
  const { settings } = useSiteConfig();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'plans' | 'methods' | 'confirm' | 'details'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  
  const [userBkashNumber, setUserBkashNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix: Added useMemo to the React imports to resolve the compilation error on line 36.
  // Get current user (reactive with safe parsing)
  const currentUser = useMemo(() => {
    try {
      const sessionStr = localStorage.getItem('digital_desh_bd_user_session');
      if (!sessionStr) return null;
      const session = JSON.parse(sessionStr);
      const userId = session?.user?.id;
      return users.find((u: any) => u.id === userId) || session?.user || null;
    } catch (e) {
      return null;
    }
  }, [users]);
  
  const defaultWelcomeMessage: ChatMessage = {
    id: 'init',
    role: 'model',
    text: isBangla 
      ? 'স্বাগতম! আমি মিঠু। কৃষি, স্বাস্থ্য, শিক্ষা বা অন্য যেকোনো বিষয়ে আমি আপনাকে কীভাবে সাহায্য করতে পারি? আপনি ছবি বা অডিও পাঠাতে পারেন।' 
      : 'Welcome! I am Mithu. How can I assist you today? You can also share images or audio for analysis.',
    timestamp: new Date()
  };

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('digital_desh_bd_chat_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((session: any) => ({
            ...session,
            messages: Array.isArray(session.messages) 
              ? session.messages.map((msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp || Date.now())
                }))
              : []
          }));
        }
      }
    } catch (e) {
      console.warn("Failed to load chat sessions", e);
    }
    return [];
  });

  const [messages, setMessages] = useState<ChatMessage[]>([defaultWelcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const sessionsToSave = sessions.map(session => ({
        ...session,
        messages: (session.messages || []).map(msg => {
          if (msg.attachment) {
            return { ...msg, attachment: { type: msg.attachment.type, url: '', mimeType: msg.attachment.mimeType } };
          }
          return msg;
        })
      })).slice(0, 15);
      localStorage.setItem('digital_desh_bd_chat_sessions', JSON.stringify(sessionsToSave));
    } catch (e) {
      console.error("Storage Error", e);
    }
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
       const tier = currentUser?.subscriptionTier || SubscriptionTier.FREE;
       const count = currentUser?.imageUploadCount || 0;
       
       let limit = 3;
       if (tier !== SubscriptionTier.FREE) {
          const activePlan = pricingPlans.find((p: PricingPlan) => p.tier === tier);
          if (activePlan) limit = activePlan.limit;
       }

       if (count >= limit) {
          setPaymentStep('plans');
          setShowPricing(true);
          event.target.value = '';
          return;
       }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      const base64Data = base64String.split(',')[1];
      const type = file.type.startsWith('image/') ? 'image' : 'audio';

      setSelectedFile({
        type,
        url: base64String,
        base64: base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handlePlanSelection = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setPaymentStep('methods');
  };

  const handleMethodSelection = (method: string) => {
    setSelectedMethod(method);
    setPaymentStep('confirm');
  };

  const handleApplyPromo = () => {
     const match = (promoCodes || []).find((c: PromoCode) => c.code === promoInput.trim().toUpperCase() && c.isActive);
     if (match) {
        setAppliedPromo(match);
        alert(isBangla ? 'প্রোমো কোড সফলভাবে যুক্ত হয়েছে!' : 'Promo code applied successfully!');
     } else {
        alert(isBangla ? 'ভুল প্রোমো কোড।' : 'Invalid promo code.');
     }
  };

  const handleConfirmNext = () => {
     setPaymentStep('details');
  };

  const handleFinalSubmit = async () => {
     if (!userBkashNumber.trim() || !trxId.trim()) {
        alert(isBangla ? 'অনুগ্রহ করে আপনার বিকাশ নম্বর এবং TrxID দিন।' : 'Please enter your bKash number and TrxID.');
        return;
     }
     
     if (!currentUser || !selectedPlan) return;

     const paymentRequest: PaymentRequest = {
        id: `pay_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        planId: selectedPlan.id,
        tier: selectedPlan.tier,
        amount: calculateFinalPrice(),
        method: 'bkash',
        userPhone: userBkashNumber.trim(),
        trxId: trxId.trim().toUpperCase(),
        status: 'Pending',
        timestamp: new Date().toISOString()
     };

     await addPaymentRequest(paymentRequest);
     
     alert(isBangla ? 'আপনার পেমেন্ট তথ্য জমা দেওয়া হয়েছে। অ্যাডমিন ভেরিফাই করলে আপনার একাউন্ট আপগ্রেড হয়ে যাবে।' : 'Your payment info has been submitted. Admin will upgrade your account after verification.');
     
     setShowPricing(false);
     setPaymentStep('plans');
     setSelectedPlan(null);
     setSelectedMethod(null);
     setAppliedPromo(null);
     setPromoInput('');
     setUserBkashNumber('');
     setTrxId('');
  };

  const calculateFinalPrice = () => {
    if (!selectedPlan) return 0;
    if (!appliedPromo) return selectedPlan.price;
    const discount = (selectedPlan.price * appliedPromo.discount) / 100;
    return Math.max(0, selectedPlan.price - discount);
  };

  const handleSessionSelect = (session: ChatSession) => {
    if (loading) return; 
    setActiveSessionId(session.id);
    setMessages(session.messages || [defaultWelcomeMessage]);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    if (loading) return; 
    setActiveSessionId(null);
    setMessages([defaultWelcomeMessage]);
    setSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      attachment: selectedFile || undefined,
      timestamp: new Date()
    };

    const msgsAfterUser = [...messages, userMsg];
    setMessages(msgsAfterUser);
    
    setInput('');
    const currentAttachment = selectedFile;
    setSelectedFile(null);
    setLoading(true);

    if (currentAttachment?.type === 'image' && currentUser) {
      const updatedCount = (currentUser.imageUploadCount || 0) + 1;
      updateUser({ ...currentUser, imageUploadCount: updatedCount });
    }

    const historyForApi = messages.filter(m => m.id !== 'init').map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await generateAssistantResponse(
      input || (isBangla ? '[ফাইল পাঠানো হয়েছে]' : '[File sent]'), 
      `User Tier: ${currentUser?.subscriptionTier || 'Free'}. Context: AI Help Page.`,
      historyForApi,
      currentAttachment ? { mimeType: currentAttachment.mimeType!, data: currentAttachment.base64! } : undefined
    );

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText || "No response.",
      timestamp: new Date()
    };

    const finalMessages = [...msgsAfterUser, botMsg];
    setMessages(finalMessages);
    setLoading(false);

    if (activeSessionId) {
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, preview: botMsg.text.substring(0, 40) + '...', messages: finalMessages } : s));
    } else {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: input.substring(0, 30) || (isBangla ? 'নতুন আলাপ' : 'New Conversation'),
        date: 'Today',
        preview: botMsg.text.substring(0, 40) + '...',
        messages: finalMessages
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }
  };

  const getPlanIcon = (tier: SubscriptionTier) => {
    switch(tier) {
      case SubscriptionTier.PRO: return <Zap className="text-yellow-500" />;
      case SubscriptionTier.MASTER: return <Crown className="text-blue-500" />;
      case SubscriptionTier.ULTRA: return <Rocket className="text-purple-500" />;
      default: return <Bird className="text-brand-600" />;
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-gray-900">
      <aside className={`fixed md:relative z-30 w-72 h-full bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="font-bold text-gray-700 flex items-center gap-2"><Clock size={18} /> {isBangla ? 'পূর্ববর্তী আলাপ' : 'History'}</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-gray-200 rounded"><XIcon size={20} /></button>
        </div>
        <div className="p-3">
          <button onClick={handleNewChat} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-lg font-bold shadow-md disabled:opacity-50 transition-all">
            <Plus size={18} /> {isBangla ? 'নতুন চ্যাট' : 'New Chat'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {(sessions || []).map(session => (
            <div key={session.id} onClick={() => handleSessionSelect(session)} className={`p-3 rounded-lg cursor-pointer transition-all border mb-2 ${activeSessionId === session.id ? 'bg-white border-brand-200 shadow-sm ring-1 ring-brand-100' : 'border-transparent hover:bg-white hover:border-gray-200'}`}>
              <h4 className={`font-bold text-sm truncate ${activeSessionId === session.id ? 'text-brand-700' : 'text-gray-800'}`}>{session.title}</h4>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">{session.preview}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-100">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs">{(currentUser?.name || 'G')[0]}</div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-gray-900">{currentUser?.name || 'Guest'}</span>
                 <span className="text-[10px] font-black text-brand-600 uppercase">{currentUser?.subscriptionTier || 'Free'}</span>
               </div>
             </div>
             {(currentUser?.subscriptionTier === SubscriptionTier.FREE || !currentUser?.subscriptionTier) && (
               <button onClick={() => { setPaymentStep('plans'); setShowPricing(true); }} className="p-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors" title="Upgrade"><Crown size={14} /></button>
             )}
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full relative">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(true)} className="p-2 md:hidden text-gray-600"><Menu size={20} /></button>
             <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><ArrowLeft size={20} /></button>
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-md"><Bird size={20} /></div>
               <h1 className="font-bold text-gray-900">মিঠু - এআই</h1>
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
           <div className="max-w-[1000px] mx-auto space-y-6 pb-20">
              {(messages || []).map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-1 shadow-sm text-brand-600"><Bird size={14}/></div>}
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'}`}>
                    {msg.attachment && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-gray-100"><img src={msg.attachment.url} className="max-w-xs max-h-60 object-cover" /></div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed prose prose-sm" dangerouslySetInnerHTML={{ __html: msg.text || '' }} />
                  </div>
                </div>
              ))}
              {loading && <div className="flex justify-start gap-3"><div className="w-8 h-8 bg-white border rounded-full flex items-center justify-center animate-pulse"><Loader2 size={14} className="animate-spin text-brand-600"/></div><div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-gray-400 text-xs italic">Mithu is thinking...</div></div>}
              <div ref={messagesEndRef} />
           </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent">
           <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-[2rem] p-2 flex items-end gap-2 shadow-xl focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,audio/*" onChange={handleFileSelect} />
              <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-brand-600 rounded-full hover:bg-brand-50 transition-colors"><Paperclip size={20}/></button>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder={isBangla ? 'মিঠুকে লিখুন...' : 'Type to Mithu...'} className="flex-1 bg-transparent border-none py-3 px-2 text-gray-900 outline-none resize-none max-h-32 scrollbar-hide text-sm md:text-base" rows={1} />
              <button onClick={handleSend} disabled={loading || (!input.trim() && !selectedFile)} className="bg-brand-600 hover:bg-brand-700 text-white p-3 rounded-full shadow-lg disabled:opacity-50 transition-all"><Send size={20}/></button>
           </div>
        </div>
      </main>

      {showPricing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => { setShowPricing(false); setPaymentStep('plans'); }}
              className="absolute top-6 right-8 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-[110]"
            >
              <XIcon size={24} />
            </button>
            
            {paymentStep === 'plans' && (
               <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-black uppercase mb-4 tracking-widest"><Bird size={14}/> {isBangla ? 'এআই আপগ্রেড' : 'AI UPGRADE'}</div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">{isBangla ? 'মিঠু প্রো নির্বাচন করুন' : 'Choose Your Mithu Pro'}</h2>
                    <p className="text-gray-500 max-w-lg mx-auto font-medium">{isBangla ? 'বেশি ইমেজ আপলোড করতে এবং প্রিমিয়াম ফিচার পেতে আপনার পছন্দের প্ল্যানটি বেছে নিন।' : 'Upgrade to upload more images and unlock advanced AI capabilities.'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(pricingPlans || []).map((plan: PricingPlan) => (
                      <div key={plan.id} className="relative group">
                        <div className={`h-full bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col border-b-8 ${plan.tier === SubscriptionTier.MASTER ? 'border-b-blue-600' : plan.tier === SubscriptionTier.ULTRA ? 'border-b-purple-600' : 'border-b-yellow-500'}`}>
                            <div className="flex justify-between items-start mb-6">
                              <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">{getPlanIcon(plan.tier)}</div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase">{isBangla ? 'মাসিক' : 'MONTHLY'}</p>
                                <p className="text-2xl font-black text-gray-900">৳ {plan.price}</p>
                              </div>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-6">{isBangla ? plan.nameBn : plan.nameEn}</h4>
                            <ul className="space-y-3 mb-10 flex-1">
                              {(isBangla ? plan.featuresBn : plan.featuresEn).map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium"><Check size={16} className="text-brand-500 shrink-0" /> {f}</li>
                              ))}
                            </ul>
                            <button onClick={() => handlePlanSelection(plan)} className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 bg-gradient-to-r ${plan.color} hover:brightness-110`}>
                              {isBangla ? 'শুরু করুন' : 'Get Started'}
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            )}

            {paymentStep === 'methods' && (
              <div className="p-8 md:p-16 animate-fade-in">
                <button onClick={() => setPaymentStep('plans')} className="mb-8 flex items-center gap-2 text-gray-500 font-bold hover:text-gray-800 transition-colors"><ArrowLeft size={20}/> {isBangla ? 'প্ল্যান পরিবর্তন করুন' : 'Change Plan'}</button>
                <div className="text-center mb-12">
                   <h2 className="text-3xl font-black text-gray-900 mb-2">{isBangla ? 'পেমেন্ট মেথড বেছে নিন' : 'Select Payment Method'}</h2>
                   <p className="text-gray-500">{isBangla ? 'আপনার পছন্দের মাধ্যমে নিরাপদ পেমেন্ট করুন' : 'Make a secure payment via your preferred method'}</p>
                </div>

                <div className="flex justify-center max-w-2xl mx-auto">
                   <button onClick={() => handleMethodSelection('bkash')} className="group p-8 w-48 rounded-3xl border-2 border-gray-100 hover:border-brand-500 hover:bg-brand-50 transition-all flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform"><Smartphone size={32}/></div>
                      <span className="font-black text-gray-900">bKash</span>
                   </button>
                </div>
              </div>
            )}

            {paymentStep === 'confirm' && (
               <div className="p-8 md:p-16 animate-fade-in text-center max-w-xl mx-auto">
                  <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={40}/>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-4">{isBangla ? 'পেমেন্ট নিশ্চিত করুন' : 'Confirm Payment'}</h2>
                  
                  <div className="bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100 text-left">
                     <div className="flex justify-between mb-2"><span className="text-gray-600 font-medium">{isBangla ? 'নির্বাচিত প্ল্যান' : 'Plan'}</span><span className="font-bold">{isBangla ? selectedPlan?.nameBn : selectedPlan?.nameEn}</span></div>
                     <div className="flex justify-between mb-2"><span className="text-gray-600 font-medium">{isBangla ? 'পেমেন্ট মেথড' : 'Method'}</span><span className="font-bold uppercase">{selectedMethod}</span></div>
                     
                     <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                           <input 
                             type="text" 
                             value={promoInput}
                             onChange={e => setPromoInput(e.target.value.toUpperCase())}
                             placeholder={isBangla ? 'প্রোমো কোড' : 'PROMO CODE'}
                             className="flex-1 px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 outline-none text-sm font-bold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                           />
                           <button onClick={handleApplyPromo} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">
                              {isBangla ? 'প্রয়োগ করুন' : 'Apply'}
                           </button>
                        </div>
                        {appliedPromo && (
                          <div className="mt-2 text-left flex items-center gap-1 text-green-600 text-[10px] font-bold">
                            <Tag size={10} /> {appliedPromo.code} - {appliedPromo.discount}% OFF
                          </div>
                        )}
                     </div>

                     <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-black text-lg">
                        <span>{isBangla ? 'মোট প্রদেয়' : 'Total Payable'}</span>
                        <div className="text-right">
                           {appliedPromo && <span className="text-xs text-gray-400 line-through mr-2">৳ {selectedPlan?.price}</span>}
                           <span className="text-brand-600">৳ {calculateFinalPrice()}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex gap-4">
                     <Button variant="outline" onClick={() => setPaymentStep('methods')} className="flex-1 py-4 rounded-2xl font-bold">{isBangla ? 'পিছনে' : 'Back'}</Button>
                     <Button onClick={handleConfirmNext} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-brand-500/20">{isBangla ? 'নিশ্চিত করুন' : 'Confirm'}</Button>
                  </div>
               </div>
            )}

            {paymentStep === 'details' && (
              <div className="p-8 md:p-16 animate-fade-in max-w-xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">{isBangla ? 'বিকাশ পেমেন্ট তথ্য' : 'bKash Payment Details'}</h2>
                </div>

                <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 mb-8 space-y-4">
                   <div className="text-center">
                     <p className="text-sm text-pink-700 font-bold uppercase tracking-widest mb-1">{isBangla ? 'আমাদের মার্চেন্ট নম্বর' : 'Our Merchant Number'}</p>
                     <p className="text-2xl font-black text-gray-900">{settings.bkashMerchantNumber || '01XXXXXXXXX'}</p>
                     <p className="text-[10px] text-pink-600 mt-1 font-bold">{isBangla ? '(সেন্ড মানি করুন)' : '(Send Money)'}</p>
                   </div>
                   
                   <div className="pt-4 border-t border-pink-200">
                     <div className="flex justify-between font-bold text-gray-700">
                        <span>{isBangla ? 'প্রদেয় পরিমাণ' : 'Payable Amount'}</span>
                        <span className="text-pink-600">৳ {calculateFinalPrice()}</span>
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{isBangla ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন' : 'Your bKash Number'}</label>
                      <input 
                        type="text" 
                        value={userBkashNumber}
                        onChange={e => setUserBkashNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none font-bold focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Transaction ID (TrxID)</label>
                      <input 
                        type="text" 
                        value={trxId}
                        onChange={e => setTrxId(e.target.value.toUpperCase())}
                        placeholder="BKX92..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none font-bold focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                      />
                   </div>
                </div>

                <div className="mt-8 flex gap-4">
                   <Button variant="outline" onClick={() => setPaymentStep('confirm')} className="flex-1 py-4 rounded-2xl font-bold">{isBangla ? 'পিছনে' : 'Back'}</Button>
                   <Button onClick={handleFinalSubmit} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-pink-500/20">
                     <ClipboardCheck size={18} className="mr-2" /> {isBangla ? 'সাবমিট করুন' : 'Submit Info'}
                   </Button>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-center items-center gap-2">
               <ShieldCheck className="text-green-600" size={18} />
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isBangla ? 'নিরাপদ পেমেন্ট গ্যারান্টি' : 'Secure Payment Guarantee'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
