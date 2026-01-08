import React, { useState, useMemo } from 'react';
import { 
  Crown, Search, TrendingUp, Users, DollarSign, Zap, Rocket, 
  Filter, CheckCircle, MoreVertical, ShieldAlert, ArrowUpRight, 
  Activity, Clock, Download, Plus, Mail, Phone, Edit3, Trash2, X, Save, Tag, Settings, CreditCard, List,
  PlusCircle, Smartphone, Check, ShieldCheck, AlertCircle, Pencil
} from 'lucide-react';
import { useData } from '../../../contexts/DataContext';
import { SubscriptionTier, User, PricingPlan, PromoCode, PaymentRequest } from '../../../types';
import { Button } from '../../ui/Button';
import { useSiteConfig } from '../../../contexts/SiteConfigContext';

export const AdminSubscription = () => {
  const { 
    users, updateUser, pricingPlans, promoCodes, paymentRequests,
    updatePricingPlans, updatePromoCodes, handlePaymentAction 
  } = useData();
  
  const { settings, updateSettings } = useSiteConfig();
  
  const [activeSubTab, setActiveSubTab] = useState<'subscribers' | 'verification' | 'plans' | 'promos'>('plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [tempMerchantNumber, setTempMerchantNumber] = useState(settings.bkashMerchantNumber || '');

  // Plan/Promo Modal State
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isAddingNewPlan, setIsAddingNewPlan] = useState(false);
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [planForm, setPlanForm] = useState<any>(null);
  const [promoForm, setPromoForm] = useState({ code: '', discount: 0 });

  // Stats
  const stats = useMemo(() => {
    const subscribers = (users || []).filter((u: User) => u.subscriptionTier && u.subscriptionTier !== SubscriptionTier.FREE);
    const totalRevenue = subscribers.reduce((acc: number, u: User) => {
        const plan = (pricingPlans || []).find((p: PricingPlan) => p.tier === u.subscriptionTier);
        return acc + (plan?.price || 0);
    }, 0);
    
    return {
        total: subscribers.length,
        revenue: totalRevenue,
        plansCount: (pricingPlans || []).length,
        promosCount: (promoCodes || []).length,
        pendingPayments: (paymentRequests || []).filter((r: PaymentRequest) => r.status === 'Pending').length
    };
  }, [users, pricingPlans, promoCodes, paymentRequests]);

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u: User) => {
      const nameMatch = (u.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const emailMatch = (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || emailMatch;
      const matchesTier = tierFilter === 'All' || u.subscriptionTier === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [users, searchQuery, tierFilter]);

  const handleUpdateTier = async (userId: string, newTier: SubscriptionTier) => {
    const user = (users || []).find((u: User) => u.id === userId);
    if (user) {
      await updateUser({ ...user, subscriptionTier: newTier });
    }
  };

  const handleSaveMerchantNumber = () => {
    updateSettings('bkashMerchantNumber', tempMerchantNumber);
    alert('Merchant number updated successfully!');
  };

  // --- PLAN MANAGEMENT ---
  const handleAddNewPlan = () => {
    setIsAddingNewPlan(true);
    setPlanForm({
      id: `plan_${Date.now()}`,
      nameEn: '',
      nameBn: '',
      price: 0,
      tier: SubscriptionTier.PRO,
      limit: 10,
      featuresEnStr: '',
      featuresBnStr: '',
      color: 'from-blue-500 to-indigo-600'
    });
  };

  const handleEditPlan = (plan: PricingPlan) => {
    setIsAddingNewPlan(false);
    setEditingPlan(plan);
    setPlanForm({ 
      ...plan, 
      featuresEnStr: (plan.featuresEn || []).join('\n'),
      featuresBnStr: (plan.featuresBn || []).join('\n')
    });
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPlanData = {
      id: planForm.id,
      nameEn: planForm.nameEn,
      nameBn: planForm.nameBn,
      price: Number(planForm.price),
      tier: planForm.tier as SubscriptionTier,
      limit: Number(planForm.limit),
      featuresEn: (planForm.featuresEnStr || '').split('\n').filter((f: string) => f.trim()),
      featuresBn: (planForm.featuresBnStr || '').split('\n').filter((f: string) => f.trim()),
      color: planForm.color || 'from-brand-500 to-brand-600'
    };

    let updatedPlans;
    if (isAddingNewPlan) {
      updatedPlans = [...(pricingPlans || []), newPlanData];
    } else {
      updatedPlans = (pricingPlans || []).map((p: PricingPlan) => p.id === planForm.id ? newPlanData : p);
    }

    await updatePricingPlans(updatedPlans);
    setEditingPlan(null);
    setIsAddingNewPlan(false);
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    await updatePricingPlans((pricingPlans || []).filter((p: PricingPlan) => p.id !== id));
  };

  // --- PROMO CODE MANAGEMENT ---
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code.trim()) return;

    const newPromo: PromoCode = {
      id: `promo_${Date.now()}`,
      code: promoForm.code.trim().toUpperCase(),
      discount: Number(promoForm.discount),
      isActive: true
    };

    await updatePromoCodes([...(promoCodes || []), newPromo]);
    setIsAddingPromo(false);
    setPromoForm({ code: '', discount: 0 });
    alert('Promo code added successfully!');
  };

  const getTierBadge = (tier: string) => {
    switch(tier) {
      case SubscriptionTier.PRO: return 'bg-yellow-50 text-yellow-500';
      case SubscriptionTier.MASTER: return 'bg-blue-50 text-blue-500';
      case SubscriptionTier.ULTRA: return 'bg-purple-50 text-purple-500';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#1a1c2c] tracking-tight">AI Subscriptions</h2>
          <p className="text-gray-500 mt-1 font-medium">Manage Mithu-AI monetization, plans, and verification</p>
        </div>
        <div className="flex bg-[#f1f4f9] p-1.5 rounded-2xl">
           <button onClick={() => setActiveSubTab('subscribers')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'subscribers' ? 'bg-white text-[#1a1c2c] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Subscribers</button>
           <button onClick={() => setActiveSubTab('verification')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'verification' ? 'bg-white text-[#1a1c2c] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Verification</button>
           <button onClick={() => setActiveSubTab('plans')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'plans' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Manage Plans</button>
           <button onClick={() => setActiveSubTab('promos')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeSubTab === 'promos' ? 'bg-white text-[#1a1c2c] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Promo Codes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
           <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Subscribers</p><h4 className="text-4xl font-black text-[#1a1c2c]">{stats.total}</h4></div>
           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Crown size={32}/></div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
           <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Verification</p><h4 className="text-4xl font-black text-[#1a1c2c]">{stats.pendingPayments}</h4></div>
           <div className="p-4 bg-[#f1f4f9] text-[#1a1c2c] rounded-2xl border border-gray-200"><Smartphone size={32}/></div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
           <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Plans</p><h4 className="text-4xl font-black text-[#1a1c2c]">{stats.plansCount}</h4></div>
           <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl"><Settings size={32}/></div>
        </div>
        <div className="bg-[#1a1c2c] p-8 rounded-[2rem] text-white flex items-center justify-between shadow-xl">
           <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Promos</p><h4 className="text-4xl font-black">{stats.promosCount}</h4></div>
           <div className="p-4 bg-white/10 rounded-2xl"><Tag size={32}/></div>
        </div>
      </div>

      {activeSubTab === 'plans' && (
        <div className="space-y-10 animate-fade-in">
          {/* bKash Merchant Settings Bar */}
          <div className="bg-[#fff1f5] p-8 rounded-[2.5rem] border border-[#ffe4ec] flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-[#e91e63] shadow-sm">
                   <Smartphone size={32}/>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#1a1c2c]">Subscription Payment Settings</h3>
                  <p className="text-[#e91e63] font-bold text-sm">Update your bKash merchant number for AI subscriptions anytime.</p>
                </div>
             </div>
             <div className="flex gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  value={tempMerchantNumber} 
                  onChange={e => setTempMerchantNumber(e.target.value)} 
                  className="bg-white border border-pink-100 rounded-xl px-6 py-4 text-lg font-black text-[#1a1c2c] outline-none w-full md:w-64 shadow-sm" 
                />
                <button onClick={handleSaveMerchantNumber} className="bg-[#e91e63] hover:bg-[#d81b60] text-white font-black px-10 rounded-xl transition-all shadow-lg shadow-pink-200">Save</button>
             </div>
          </div>

          {/* Pricing Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {(pricingPlans || []).map((plan: PricingPlan) => (
              <div key={plan.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col group relative">
                 <div className="flex justify-between items-start mb-10">
                    <div className={`p-4 rounded-3xl ${getTierBadge(plan.tier)}`}>
                       {plan.tier === SubscriptionTier.PRO ? <Zap size={36} fill="currentColor" /> : plan.tier === SubscriptionTier.MASTER ? <Crown size={36} fill="currentColor" /> : <Rocket size={36} fill="currentColor" />}
                    </div>
                    <div className="text-right">
                       <h4 className="text-4xl font-black text-[#1a1c2c]">৳ {plan.price}</h4>
                    </div>
                 </div>
                 <h4 className="text-3xl font-black text-[#1a1c2c] mb-1">{plan.nameBn}</h4>
                 <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">{plan.nameEn}</p>
                 
                 <div className="flex-1 space-y-4 mb-10">
                    {(plan.featuresBn || []).map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={4} />
                        </div>
                        {f}
                      </div>
                    ))}
                 </div>

                 <div className="flex gap-3">
                   <button 
                    onClick={() => handleEditPlan(plan)} 
                    className="flex-1 bg-[#1a1c2c] hover:bg-black text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-2 transition-all shadow-xl shadow-gray-200"
                   >
                     <Pencil size={18} /> Edit
                   </button>
                   <button 
                    onClick={() => handleDeletePlan(plan.id)} 
                    className="p-5 bg-red-50 text-red-500 rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all border border-red-100"
                   >
                     <Trash2 size={24}/>
                   </button>
                 </div>
              </div>
            ))}

            {/* Add New Package Card */}
            <div 
              onClick={handleAddNewPlan}
              className="bg-white p-10 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all min-h-[500px] group"
            >
               <div className="w-20 h-20 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center group-hover:scale-110 transition-transform mb-6">
                 <Plus size={48} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-black text-gray-400">Add New Package</h3>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'promos' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-black text-xl text-gray-900">Active Promo Codes</h3>
                <button 
                  onClick={() => setIsAddingPromo(true)}
                  className="bg-[#1a1c2c] hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg"
                >
                  <PlusCircle size={18}/> Add Promo Code
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <tr><th className="p-6">Promo Code</th><th className="p-6">Discount</th><th className="p-6 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(promoCodes || []).map((code: PromoCode) => (
                      <tr key={code.id} className="hover:bg-purple-50/20 transition-colors">
                        <td className="p-6"><span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-mono font-black border border-purple-100 uppercase tracking-wider">{code.code}</span></td>
                        <td className="p-6 font-black text-gray-800">{code.discount}% OFF</td>
                        <td className="p-6 text-right"><button onClick={() => updatePromoCodes((promoCodes || []).filter(c => c.id !== code.id))} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button></td>
                      </tr>
                    ))}
                    {(promoCodes || []).length === 0 && (
                      <tr><td colSpan={3} className="p-16 text-center text-gray-400 font-bold uppercase tracking-widest opacity-20 italic">No promo codes active</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {/* Verification & Subscribers Tabs (Unchanged logic, just maintaining file structure) */}
      {activeSubTab === 'subscribers' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
             <h3 className="font-black text-xl text-gray-900">Subscribers Directory</h3>
             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1"><Search className="absolute left-3 top-3 text-gray-400" size={16} /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none text-black"/></div>
                <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none">
                  <option value="All">All Plans</option>
                  <option value={SubscriptionTier.FREE}>Free</option>
                  <option value={SubscriptionTier.PRO}>Pro</option>
                  <option value={SubscriptionTier.MASTER}>Master</option>
                  <option value={SubscriptionTier.ULTRA}>Ultra</option>
                </select>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-6">Subscriber</th><th className="p-6">Tier</th><th className="p-6">Usage</th><th className="p-6 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((u: User) => (
                  <tr key={u.id} className="hover:bg-indigo-50/20 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4"><img src={u.avatar} className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm" />
                        <div><p className="font-black text-gray-900 text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="p-6"><span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border shadow-sm ${u.subscriptionTier === SubscriptionTier.FREE ? 'bg-gray-50 text-gray-400' : getTierBadge(u.subscriptionTier || 'Free')}`}>{u.subscriptionTier || 'Free'}</span></td>
                    <td className="p-6"><span className="text-xs font-black text-gray-700">{u.imageUploadCount || 0} Images</span></td>
                    <td className="p-6 text-right">
                      <select className="text-[10px] font-bold border border-gray-200 rounded-lg p-1 outline-none text-black" value={u.subscriptionTier || SubscriptionTier.FREE} onChange={(e) => handleUpdateTier(u.id, e.target.value as SubscriptionTier)}>
                         <option value={SubscriptionTier.FREE}>Free</option>
                         <option value={SubscriptionTier.PRO}>Pro</option>
                         <option value={SubscriptionTier.MASTER}>Master</option>
                         <option value={SubscriptionTier.ULTRA}>Ultra</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'verification' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-50"><h3 className="font-black text-xl text-gray-900">Payment Verification Queue</h3></div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                   <tr><th className="p-6">User / Plan</th><th className="p-6">Amount</th><th className="p-6">bKash / TrxID</th><th className="p-6">Time</th><th className="p-6 text-right">Actions</th></tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {(paymentRequests || []).map((req: PaymentRequest) => (
                      <tr key={req.id} className="hover:bg-red-50/20 transition-colors">
                        <td className="p-6"><div><p className="font-black text-gray-900 text-sm">{req.userName}</p><p className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">{req.tier} Plan</p></div></td>
                        <td className="p-6"><span className="text-sm font-black text-gray-800">৳ {req.amount}</span></td>
                        <td className="p-6"><div><p className="text-xs font-bold text-gray-700">{req.userPhone}</p><p className="text-[10px] text-gray-400 font-mono mt-1 uppercase">{req.trxId}</p></div></td>
                        <td className="p-6 text-[10px] text-gray-400 font-bold uppercase">{new Date(req.timestamp).toLocaleString()}</td>
                        <td className="p-6 text-right">
                           {req.status === 'Pending' ? (
                             <div className="flex justify-end gap-2">
                                <button onClick={() => handlePaymentAction(req.id, 'Approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><Check size={18}/></button>
                                <button onClick={() => handlePaymentAction(req.id, 'Rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><X size={18}/></button>
                             </div>
                           ) : (
                             <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{req.status}</span>
                           )}
                        </td>
                      </tr>
                    ))}
                    {(paymentRequests || []).length === 0 && (
                      <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest opacity-30 italic">No payment requests found</td></tr>
                    )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Plan Modal */}
      {(editingPlan || isAddingNewPlan) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => { setEditingPlan(null); setIsAddingNewPlan(false); }}>
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f1f4f9]">
                 <h3 className="font-black text-xl text-[#1a1c2c]">{isAddingNewPlan ? 'Create New Package' : `Edit Package: ${editingPlan?.nameEn}`}</h3>
                 <button onClick={() => { setEditingPlan(null); setIsAddingNewPlan(false); }}><X size={24}/></button>
              </div>
              <form onSubmit={handleSavePlan} className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (BN)</label><input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold" value={planForm.nameBn} onChange={e => setPlanForm({...planForm, nameBn: e.target.value})} placeholder="e.g. প্রো প্ল্যান" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (EN)</label><input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold" value={planForm.nameEn} onChange={e => setPlanForm({...planForm, nameEn: e.target.value})} placeholder="e.g. Pro Plan" /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (৳)</label><input required type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-black" value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image Upload Limit</label><input required type="number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-black" value={planForm.limit} onChange={e => setPlanForm({...planForm, limit: e.target.value})} /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tier</label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold appearance-none" value={planForm.tier} onChange={e => setPlanForm({...planForm, tier: e.target.value})}>
                        <option value={SubscriptionTier.PRO}>Pro</option>
                        <option value={SubscriptionTier.MASTER}>Master</option>
                        <option value={SubscriptionTier.ULTRA}>Ultra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gradient Color</label>
                      <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold appearance-none" value={planForm.color} onChange={e => setPlanForm({...planForm, color: e.target.value})}>
                        <option value="from-yellow-400 to-orange-500">Yellow/Orange (Pro)</option>
                        <option value="from-blue-500 to-indigo-600">Blue/Indigo (Master)</option>
                        <option value="from-purple-600 to-pink-600">Purple/Pink (Ultra)</option>
                      </select>
                    </div>
                 </div>
                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Details (BN) - 1 per line</label><textarea rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none text-black font-medium" value={planForm.featuresBnStr} onChange={e => setPlanForm({...planForm, featuresBnStr: e.target.value})} placeholder="ফিচার ১&#10;ফিচার ২" /></div>
                 <Button type="submit" className="w-full bg-[#1a1c2c] text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2">
                   <Save size={20}/> {isAddingNewPlan ? 'Create Package' : 'Save Package Changes'}
                 </Button>
              </form>
           </div>
        </div>
      )}

      {/* Promo Modal */}
      {isAddingPromo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsAddingPromo(false)}>
           <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f1f4f9]">
                 <h3 className="font-black text-xl text-[#1a1c2c] flex items-center gap-2"><Tag size={20}/> New Promo Code</h3>
                 <button onClick={() => setIsAddingPromo(false)}><X size={24}/></button>
              </div>
              <form onSubmit={handleSavePromo} className="p-8 space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Promo Code Name</label>
                    <input 
                      required 
                      type="text"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all" 
                      value={promoForm.code} 
                      onChange={e => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})} 
                      placeholder="e.g. SAVE50" 
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Discount Percentage (%)</label>
                    <input 
                      required 
                      type="number"
                      min="0"
                      max="100"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-black outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all" 
                      value={promoForm.discount} 
                      onChange={e => setPromoForm({...promoForm, discount: Number(e.target.value)})} 
                      placeholder="e.g. 50" 
                    />
                 </div>
                 <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                   <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-[11px] text-blue-700 leading-relaxed font-bold">This code will be immediately available for all users during AI subscription checkout.</p>
                 </div>
                 <Button type="submit" className="w-full bg-[#1a1c2c] hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-gray-200 flex items-center justify-center gap-2">
                   <CheckCircle size={20}/> Activate Promo Code
                 </Button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
