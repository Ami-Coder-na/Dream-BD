import React, { useState, useMemo } from 'react';
import { 
  ShoppingBasket, TrendingUp, Truck, Search, Filter, 
  PlusCircle, Sun, CloudRain, Snowflake, User as UserIcon,
  CheckCircle, X, RefreshCw, MapPin, ChevronDown, Tag, 
  Package, DollarSign, MapPinned, Info, Phone
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';
import { User as UserType } from '../../types';

interface Props {
  isBangla: boolean;
  user?: UserType | null;
  onLogin?: () => void;
}

const WHOLESALE_LISTINGS = [
  { id: 1, productEn: 'Dinajpur Lychee', productBn: 'দিনাজপুরের লিচু', quantity: '5000 pcs', price: '৳ 3.5 / pc', location: 'Dinajpur', seller: 'Karim Fruit Store', sellerType: 'Store', date: '2 hrs ago' },
  { id: 2, productEn: 'Bogra Doi', productBn: 'বগুড়ার দই', quantity: '100 pots', price: '৳ 180 / pot', location: 'Bogra', seller: 'Misty Bari', sellerType: 'Manufacturer', date: '5 hrs ago' },
  { id: 3, productEn: 'Miniket Rice', productBn: 'মিনিকেট চাল', quantity: '50 Mon', price: '৳ 2800 / mon', location: 'Naogaon', seller: 'Bhai Bhai Traders', sellerType: 'Trader', date: '1 day ago' },
];

export const BazarSodaiModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const { marketPrices, wholesaleAds, addRequest } = useData(); 
  const [activeTab, setActiveTab] = useState<'paikari' | 'trends'>('paikari');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [adForm, setAdForm] = useState({
    product: '',
    quantity: '',
    price: '',
    location: '',
    sellerType: 'Farmer',
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const filteredWholesaleListings = useMemo(() => {
    const combined = [...WHOLESALE_LISTINGS, ...wholesaleAds.filter((a:any) => a.status === 'Active')];
    const searchLower = (searchQuery || '').toLowerCase();
    return combined.filter(item => {
      const pName = isBangla ? (item.productBn || item.product || '') : (item.productEn || item.product || '');
      const matchesSearch = pName.toLowerCase().includes(searchLower) ||
                            (item.location || '').toLowerCase().includes(searchLower);
      return matchesSearch;
    });
  }, [searchQuery, wholesaleAds, isBangla]);

  const handleOpenModal = () => {
    if (!user) {
      if (onLogin) onLogin();
      return;
    }
    setSubmitted(false);
    setAdForm({ ...adForm, name: user.name, phone: user.phone || '' });
    setShowPostModal(true);
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const request = {
      contenttype: 'wholesale', // Standardized lowercase
      product: adForm.product,
      quantity: adForm.quantity,
      price: adForm.price,
      location: adForm.location,
      sellertype: adForm.sellerType, // Standardized lowercase
      seller: adForm.name,
      phone: adForm.phone,
      posteddate: new Date().toLocaleDateString() // Standardized lowercase
    };
    try {
      await addRequest(request);
      setSubmitted(true);
      setAdForm({ product: '', quantity: '', price: '', location: '', sellerType: 'Farmer', name: '', phone: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-lime-50/30 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-100 text-lime-700 text-sm font-bold mb-4 border border-lime-200">
            <ShoppingBasket size={16} />
            {isBangla ? 'বাংলাদেশের ডিজিটাল হাট' : 'Digital Market of Bangladesh'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{isBangla ? 'বাজার সদাই' : 'Bazar Sodai'}</h1>
        </div>
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 flex gap-1">
            <button onClick={() => setActiveTab('paikari')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'paikari' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>{isBangla ? 'পাইকারি হাট' : 'Paikari Hat'}</button>
            <button onClick={() => setActiveTab('trends')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'trends' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>{isBangla ? 'বাজার দর' : 'Market Price'}</button>
          </div>
        </div>
        {activeTab === 'paikari' ? (
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <h2 className="text-3xl font-bold text-orange-900">{isBangla ? 'আপনার পণ্য বিক্রি করুন' : 'Sell Your Produce Bulk'}</h2>
              <Button onClick={handleOpenModal} size="lg" className="bg-orange-600 hover:bg-orange-700">{isBangla ? 'বিজ্ঞাপন দিন (ফ্রি)' : 'Post Ad (Free)'}</Button>
            </div>
            <div className="relative max-w-2xl mx-auto"><input type="text" className="w-full pl-14 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white" placeholder={isBangla ? 'পাইকারি পণ্য বা এলাকা খুঁজুন...' : 'Search wholesale items or location...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /><Search className="absolute left-4 top-4 text-gray-400" size={24} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWholesaleListings.map((item:any) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                  <h4 className="text-2xl font-bold text-gray-900">{isBangla ? (item.productBn || item.product) : (item.productEn || item.product)}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 font-medium"><MapPin size={16} className="text-orange-500" /> {item.location}</div>
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-3 my-4"><div className="flex justify-between"><span className="text-gray-500">{isBangla ? 'পরিমাণ' : 'Quantity'}</span><span className="font-bold">{item.quantity}</span></div><div className="flex justify-between"><span className="text-gray-500">{isBangla ? 'দাম' : 'Price'}</span><span className="font-bold text-orange-600">{item.price}</span></div></div>
                  <a href={`tel:${item.phone}`} className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-xl font-bold"><Phone size={18} /> {isBangla ? 'কল করুন' : 'Call'}</a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up"><div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30"><h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><TrendingUp className="text-blue-600" />{isBangla ? 'আজকের বাজার দর (গড়)' : 'Today\'s Average Price'}</h3></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase"><tr><th className="px-8 py-5">{isBangla ? 'পণ্য' : 'Product'}</th><th className="px-8 py-5">{isBangla ? 'বর্তমান দাম' : 'Price'}</th><th className="px-8 py-5 text-right">{isBangla ? 'অবস্থা' : 'Trend'}</th></tr></thead><tbody className="divide-y divide-gray-100">{marketPrices.map((item: any, idx: number) => (<tr key={idx}><td className="px-8 py-5 font-bold text-gray-900">{isBangla ? item.nameBn : item.nameEn}</td><td className="px-8 py-5 font-bold text-blue-700">৳ {item.today}</td><td className="px-8 py-5 text-right">{item.trend === 'up' ? <span className="text-red-500">▲ Up</span> : item.trend === 'down' ? <span className="text-green-500">▼ Down</span> : <span className="text-gray-500">• Stable</span>}</td></tr>))}</tbody></table></div></div>
        )}
      </div>
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-orange-900 mb-6">{isBangla ? 'পাইকারি বিজ্ঞাপন দিন' : 'Post Wholesale Ad'}</h2>
            {submitted ? (
              <div className="text-center py-10"><CheckCircle size={48} className="mx-auto text-green-500 mb-4" /><h3 className="text-xl font-bold mb-8">{isBangla ? 'আবেদন জমা হয়েছে!' : 'Submitted!'}</h3><Button onClick={() => setShowPostModal(false)}>OK</Button></div>
            ) : (
              <form onSubmit={handleAdSubmit} className="space-y-4">
                <input required className="w-full p-3 bg-gray-50 border rounded-xl" placeholder={isBangla ? 'পণ্যের নাম' : 'Product Name'} value={adForm.product} onChange={e => setAdForm({...adForm, product: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required className="w-full p-3 bg-gray-50 border rounded-xl" placeholder={isBangla ? 'পরিমাণ' : 'Quantity'} value={adForm.quantity} onChange={e => setAdForm({...adForm, quantity: e.target.value})} />
                  <input required className="w-full p-3 bg-gray-50 border rounded-xl" placeholder={isBangla ? 'দাম' : 'Price'} value={adForm.price} onChange={e => setAdForm({...adForm, price: e.target.value})} />
                </div>
                <input required className="w-full p-3 bg-gray-50 border rounded-xl" placeholder={isBangla ? 'স্থান/জেলা' : 'Location'} value={adForm.location} onChange={e => setAdForm({...adForm, location: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required className="w-full p-3 bg-gray-50 border rounded-xl" placeholder={isBangla ? 'আপনার নাম' : 'Your Name'} value={adForm.name} onChange={e => setAdForm({...adForm, name: e.target.value})} />
                  <input required className="w-full p-3 bg-gray-50 border rounded-xl" placeholder={isBangla ? 'ফোন নম্বর' : 'Phone Number'} value={adForm.phone} onChange={e => setAdForm({...adForm, phone: e.target.value})} />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-600">{isSubmitting ? '...' : (isBangla ? 'জমা দিন' : 'Submit')}</Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};