
import React, { useState, useMemo } from 'react';
import { 
  Crown, Search, TrendingUp, Users, DollarSign, Zap, Rocket, 
  Filter, CheckCircle, MoreVertical, ShieldAlert, ArrowUpRight, 
  Activity, Clock, Download, Plus, Mail, Phone, Edit3, Trash2, X, Save, Tag, Settings, CreditCard, List,
  PlusCircle, Smartphone, Check, ShieldCheck
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
  
  const [activeSubTab, setActiveSubTab] = useState<'subscribers' | 'verification' | 'plans' | 'promos'>('subscribers');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [tempMerchantNumber, setTempMerchantNumber] = useState(settings.bkashMerchantNumber || '');

  // Plan Edit Modal State
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [planForm, setPlanForm] = useState<any>(null);

  // Promo Code State
  const [newPromo, setNewPromo] = useState({ code: '', discount: 10 });

  // Stats
  const stats = useMemo(() => {
    const subscribers = users.filter((u: User) => u.subscriptionTier && u.subscriptionTier !== SubscriptionTier.FREE);
    const totalRevenue = subscribers.reduce((acc: number, u: User) => {
        const plan = pricingPlans.find((p: PricingPlan) => p.tier === u.subscriptionTier);
        return acc + (plan?.price || 0);
    }, 0);
    
    return {
        total: subscribers.length,
        revenue: totalRevenue,
        plansCount: pricingPlans.length,
        promosCount: promoCodes.length,
        pendingPayments: paymentRequests.filter((r: PaymentRequest) => r.status === 'Pending').length
    };
  }, [users, pricingPlans, promoCodes, paymentRequests]);

  const filteredUsers = users.filter((u: User) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'All' || u.subscriptionTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleUpdateTier = async (userId: string, newTier: SubscriptionTier) => {
    const user = users.find((u: User) => u.id === userId);
    if (user) {
      await updateUser({ ...user, subscriptionTier: newTier });
    }
  };

  const onHandlePayment = async (id: string, action: 'Approved' | 'Rejected') => {
    if (confirm(`Are you sure you want to ${action.toLowerCase()} this payment?`)) {
      await handlePaymentAction(id, action);
    }
  };

  const handleSaveMerchantNumber = () => {
    updateSettings('bkashMerchantNumber', tempMerchantNumber);
    alert('Merchant number updated successfully!');
  };

  // --- PLAN MANAGEMENT ---
  const handleEditPlan = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setPlanForm({ 
      ...plan, 
      featuresEnStr: plan.featuresEn.join('\n'),
      featuresBnStr: plan.featuresBn.join('\n')
    });
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPlans = pricingPlans.map((p: PricingPlan) => 
      p.id === planForm.id ? {
        ...p,
        nameEn: planForm.nameEn,
        nameBn: planForm.nameBn,
        price: Number(planForm.price),
        limit: Number(planForm.limit),
        featuresEn: planForm.featuresEnStr.split('\n').filter((f: string) => f.trim()),
        featuresBn: planForm.featuresBnStr.split('\n').filter((f: string) => f.trim())
      } : p
    );
    await updatePricingPlans(updatedPlans);
    setEditingPlan(null);
  };

  const handleDeletePlan = async (id: string) => {
    if (id === 'free') return alert('Cannot delete free tier.');
    if (!confirm('Are you sure you want to delete this plan?')) return;
    await updatePricingPlans(pricingPlans.filter((p: PricingPlan) => p.id !== id));
  };

  // --- PROMO MANAGEMENT ---
  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code) return;
    const codes = [{ id: Date.now().toString(), code: newPromo.code.toUpperCase(), discount: Number(newPromo.discount), isActive: true }, ...promoCodes];
    await updatePromoCodes(codes);
    setNewPromo({ code: '', discount: 10 });
  };

  const togglePromo = async (id: string) => {
    const codes = promoCodes.map((c: PromoCode) => c.id === id ? { ...c, isActive: !c.isActive } : c);
    await updatePromoCodes(codes);
  };

  const deletePromo = async (id: string) => {
    if (!confirm('Delete promo code?')) return;
    await updatePromoCodes(promoCodes.filter((c: PromoCode) => c.id !== id));
  };

  const getTierBadge = (tier: string) => {
    switch(tier) {
      case SubscriptionTier.PRO: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case SubscriptionTier.MASTER: return 'bg-blue-100 text-blue-700 border-blue-200';
      case SubscriptionTier.ULTRA: return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">AI Subscriptions</h2>
          <p className="text-gray-500 mt-1">Manage Mithu-AI monetization, plans, and verification</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 overflow-x-auto max-w-full">
           <button onClick={() => setActiveSubTab('subscribers')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeSubTab === 'subscribers' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Subscribers</button>
           <button onClick={() => setActiveSubTab('verification')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeSubTab === 'verification' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
             Verification {stats.pendingPayments > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{stats.pendingPayments}</span>}
           </button>
           <button onClick={() => setActiveSubTab('plans')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeSubTab === 'plans' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Manage Plans</button>
           <button onClick={() => setActiveSubTab('promos')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeSubTab === 'promos' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Promo Codes</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Subscribers</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.total}</h3>
            </div>
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Crown size={28} /></div>
         </div>

         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pending Verification</p>
              <h3 className={`text-3xl font-black ${stats.pendingPayments > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.pendingPayments}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${stats.pendingPayments > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}><Smartphone size={28} /></div>
         </div>

         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Plans</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.plansCount}</h3>
            </div>
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner"><Settings size={28} /></div>
         </div>

         <div className="bg-gray-900 p-6 rounded-[2rem] text-white shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Active Promos</p>
              <h3 className="text-3xl font-black">{stats.promosCount}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Tag size={24} /></div>
         </div>
      </div>

      {/* --- CONTENT TABS --- */}

      {/* 1. SUBSCRIBERS LIST */}
      {activeSubTab === 'subscribers' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-3"><h3 className="font-black text-xl text-gray-900">Subscribers</h3></div>
             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1"><Search className="absolute left-3 top-3 text-gray-400" size={16} /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"/></div>
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
                    <td className="p-6"><span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border shadow-sm ${getTierBadge(u.subscriptionTier || 'Free')}`}>{u.subscriptionTier || 'Free'}</span></td>
                    <td className="p-6"><span className="text-xs font-black text-gray-700">{u.imageUploadCount || 0} Images</span></td>
                    <td className="p-6 text-right">
                      <select className="text-[10px] font-bold border border-gray-200 rounded-lg p-1 outline-none" value={u.subscriptionTier || SubscriptionTier.FREE} onChange={(e) => handleUpdateTier(u.id, e.target.value as SubscriptionTier)}>
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

      {/* 2. PAYMENT VERIFICATION */}
      {activeSubTab === 'verification' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-red-50/30">
            <h3 className="font-black text-xl text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-red-600" /> Pending Payment Verifications
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-6">User</th><th className="p-6">Plan Requested</th><th className="p-6">bKash Details</th><th className="p-6">Status</th><th className="p-6 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paymentRequests.map((req: PaymentRequest) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6">
                      <p className="font-bold text-gray-900">{req.userName}</p>
                      <p className="text-[10px] text-gray-400">{new Date(req.timestamp).toLocaleString()}</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${getTierBadge(req.tier)}`}>{req.tier}</span>
                      <p className="text-xs font-bold mt-1 text-gray-500">Amount: ৳ {req.amount}</p>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center gap-2 text-pink-600 font-bold text-sm">
                          <Smartphone size={14}/> {req.userPhone}
                       </div>
                       <p className="text-xs font-black text-gray-800 mt-1 font-mono">TrxID: {req.trxId}</p>
                    </td>
                    <td className="p-6">
                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                         req.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 
                         req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>{req.status}</span>
                    </td>
                    <td className="p-6 text-right">
                       {req.status === 'Pending' ? (
                         <div className="flex justify-end gap-2">
                            <button onClick={() => onHandlePayment(req.id, 'Approved')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-all" title="Approve"><Check size={16}/></button>
                            <button onClick={() => onHandlePayment(req.id, 'Rejected')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-all" title="Reject"><X size={16}/></button>
                         </div>
                       ) : (
                         <span className="text-xs text-gray-400 font-bold italic">Processed</span>
                       )}
                    </td>
                  </tr>
                ))}
                {paymentRequests.length === 0 && (
                  <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold">No payment requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MANAGE PLANS */}
      {activeSubTab === 'plans' && (
        <div className="space-y-8 animate-fade-in">
          {/* MERCHANT NUMBER SETTING */}
          <div className="bg-pink-50 p-8 rounded-[2.5rem] border border-pink-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-pink-600 shadow-sm"><Smartphone size={28}/></div>
                <div>
                   <h3 className="font-black text-xl text-gray-900">Subscription Payment Settings</h3>
                   <p className="text-pink-700 text-sm">Update your bKash merchant number for AI subscriptions anytime.</p>
                </div>
             </div>
             <div className="flex gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  className="bg-white border border-pink-200 rounded-xl px-4 py-3 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-pink-500/20 w-full md:w-64"
                  value={tempMerchantNumber}
                  onChange={e => setTempMerchantNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                />
                <Button onClick={handleSaveMerchantNumber} className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg">Save</Button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan: PricingPlan) => (
              <div key={plan.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col relative group">
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-gray-50 rounded-2xl">{getTierBadge(plan.tier).includes('yellow') ? <Zap size={24} className="text-yellow-500" /> : getTierBadge(plan.tier).includes('blue') ? <Crown size={24} className="text-blue-500" /> : <Rocket size={24} className="text-purple-500" />}</div>
                    <div className="text-right"><p className="text-2xl font-black text-gray-900">৳ {plan.price}</p></div>
                 </div>
                 <h4 className="text-xl font-black text-gray-900 mb-2">{plan.nameBn}</h4>
                 <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">{plan.nameEn}</p>
                 <div className="flex-1 space-y-2 mb-8">
                    {plan.featuresBn.map((f, i) => (
                      <p key={i} className="text-sm text-gray-600 flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> {f}</p>
                    ))}
                 </div>
                 <div className="flex gap-2">
                   <Button onClick={() => handleEditPlan(plan)} className="flex-1 bg-gray-900 text-white font-bold flex items-center justify-center gap-2"><Edit3 size={16}/> Edit</Button>
                   <button onClick={() => handleDeletePlan(plan.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20}/></button>
                 </div>
              </div>
            ))}
            <button className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-3 text-gray-400 hover:bg-white hover:border-brand-500 hover:text-brand-600 transition-all">
               <Plus size={40} />
               <span className="font-bold">Add New Package</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. PROMO CODES */}
      {activeSubTab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
           <div className="lg:col-span-1 h-fit bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-2"><PlusCircle className="text-purple-600" /> Create Promo Code</h3>
              <form onSubmit={handleAddPromo} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Promo Code</label>
                    <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-black tracking-widest uppercase outline-none focus:ring-2 focus:ring-purple-100" placeholder="EID2024" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Discount (%)</label>
                    <input required type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-purple-100" value={newPromo.discount} onChange={e => setNewPromo({...newPromo, discount: Number(e.target.value)})} />
                 </div>
                 <Button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 shadow-lg shadow-purple-100">Create Code</Button>
              </form>
           </div>

           <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 font-black text-gray-900">Active Codes</div>
              <div className="divide-y divide-gray-50">
                 {promoCodes.map((code: PromoCode) => (
                   <div key={code.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-xl ${code.isActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}><Tag size={20}/></div>
                         <div><p className="font-black text-lg text-gray-900">{code.code}</p><p className="text-sm font-bold text-green-600">{code.discount}% OFF</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => togglePromo(code.id)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${code.isActive ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{code.isActive ? 'Active' : 'Disabled'}</button>
                         <button onClick={() => deletePromo(code.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </div>
                   </div>
                 ))}
                 {promoCodes.length === 0 && <div className="p-20 text-center text-gray-300 italic">No promo codes created.</div>}
              </div>
           </div>
        </div>
      )}

      {/* PLAN EDIT MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setEditingPlan(null)}>
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                 <h3 className="font-black text-xl text-gray-900">Edit Package: {editingPlan.nameEn}</h3>
                 <button onClick={() => setEditingPlan(null)}><X size={24}/></button>
              </div>
              <form onSubmit={handleSavePlan} className="p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (BN)</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={planForm.nameBn} onChange={e => setPlanForm({...planForm, nameBn: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (EN)</label><input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" value={planForm.nameEn} onChange={e => setPlanForm({...planForm, nameEn: e.target.value})} /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (৳)</label><input required type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image Upload Limit</label><input required type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold" value={planForm.limit} onChange={e => setPlanForm({...planForm, limit: e.target.value})} /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Details (BN) - 1 per line</label><textarea rows={6} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" value={planForm.featuresBnStr} onChange={e => setPlanForm({...planForm, featuresBnStr: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Details (EN) - 1 per line</label><textarea rows={6} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" value={planForm.featuresEnStr} onChange={e => setPlanForm({...planForm, featuresEnStr: e.target.value})} /></div>
                 </div>
                 <Button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2"><Save size={20}/> Save Package Changes</Button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
