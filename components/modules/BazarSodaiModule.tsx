
import React, { useState, useMemo } from 'react';
import { 
  ShoppingBasket, TrendingUp, Truck, Search, Filter, 
  PlusCircle, Sun, CloudRain, Snowflake, User,
  CheckCircle, X, RefreshCw, MapPin, ChevronDown, Tag, 
  Package, DollarSign, MapPinned, Info
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

const SEASONAL_INFO_BASE = [
  { seasonBn: 'শীতকাল', seasonEn: 'Winter', type: 'winter' as const, cropsBn: 'ফুলকপি, বাঁধাকপি, গাজর, টমেটো', cropsEn: 'Cauliflower, Cabbage, Carrot, Tomato' },
  { seasonBn: 'বর্ষাকাল', seasonEn: 'Monsoon', type: 'monsoon' as const, cropsBn: 'চাল কুমড়া, ঝিঙ্গা, চিচিঙ্গা', cropsEn: 'Ash Gourd, Ridge Gourd, Snake Gourd' },
  { seasonBn: 'গ্রীষ্মকাল', seasonEn: 'Summer', type: 'summer' as const, cropsBn: 'আম, কাঁঠাল, লিচু, পটল', cropsEn: 'Mango, Jackfruit, Lychee, Pointed Gourd' },
];

export const BazarSodaiModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const { marketPrices, wholesaleAds, addRequest } = useData(); 
  const [activeTab, setActiveTab] = useState<'paikari' | 'trends'>('paikari');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Post Ad Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [adForm, setAdForm] = useState({
    product: '',
    quantity: '',
    price: '',
    location: '',
    sellerType: 'Farmer'
  });

  const filteredWholesaleListings = useMemo(() => {
    const combined = [...WHOLESALE_LISTINGS, ...wholesaleAds.filter((a:any) => a.status === 'Active')];
    return combined.filter(item => {
      const pName = isBangla ? (item.productBn || item.product) : (item.productEn || item.product);
      const matchesSearch = pName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, wholesaleAds, isBangla]);

  const handleOpenModal = () => {
    if (!user) {
      if (onLogin) onLogin();
      return;
    }
    setSubmitted(false);
    setShowPostModal(true);
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const request = {
      contentType: 'wholesale',
      product: adForm.product,
      quantity: adForm.quantity,
      price: adForm.price,
      location: adForm.location,
      sellerType: adForm.sellerType,
      seller: user?.name || 'Anonymous',
      postedDate: new Date().toLocaleDateString()
    };

    try {
      await addRequest(request);
      setSubmitted(true);
      setAdForm({ product: '', quantity: '', price: '', location: '', sellerType: 'Farmer' });
    } catch (err) {
      alert('Error submitting ad');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'বাজার সদাই' : 'Bazar Sodai'}
          </h1>
        </div>

        {/* Navigation Tabs - Retail Removed */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 flex gap-1 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('paikari')}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'paikari' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Truck size={16} />
              {isBangla ? 'পাইকারি হাট' : 'Paikari Hat'}
            </button>
            <button 
              onClick={() => setActiveTab('trends')}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'trends' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={16} />
              {isBangla ? 'বাজার দর' : 'Market Price'}
            </button>
          </div>
        </div>

        {activeTab === 'paikari' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-orange-900 mb-3">{isBangla ? 'আপনার পণ্য বিক্রি করুন' : 'Sell Your Produce Bulk'}</h2>
                <p className="text-orange-800 text-lg opacity-90">{isBangla ? 'কৃষক বা পাইকারি বিক্রেতারা এখানে সরাসরি বিজ্ঞাপন দিতে পারেন।' : 'Farmers and wholesalers can post ads here directly.'}</p>
              </div>
              <Button onClick={handleOpenModal} size="lg" className="bg-orange-600 hover:bg-orange-700 border-none shadow-xl shadow-orange-600/20 whitespace-nowrap px-10 py-4 text-lg font-bold">
                <PlusCircle size={22} className="mr-2" />{isBangla ? 'বিজ্ঞাপন দিন (ফ্রি)' : 'Post Ad (Free)'}
              </Button>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-4 text-gray-400" size={24} />
              <input 
                type="text" 
                className="w-full pl-14 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white shadow-sm transition-all text-lg"
                placeholder={isBangla ? 'পাইকারি পণ্য বা এলাকা খুঁজুন...' : 'Search wholesale items or location...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWholesaleListings.map((item:any) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                          {isBangla ? (item.productBn || item.product) : (item.productEn || item.product)}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 font-medium">
                          <MapPin size={16} className="text-orange-500" /> {item.location}
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{item.date || item.postedDate}</span>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-bold bg-orange-100 text-orange-700 border border-orange-200">{item.sellerType}</span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3 mb-6 border border-gray-100 group-hover:bg-orange-50/30 transition-colors">
                      <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">{isBangla ? 'পরিমাণ' : 'Quantity'}</span><span className="font-bold text-gray-900">{item.quantity}</span></div>
                      <div className="flex justify-between items-center"><span className="text-gray-500 font-medium">{isBangla ? 'দাম' : 'Price'}</span><span className="font-bold text-orange-600 text-lg">{item.price}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">{item.seller?.charAt(0)}</div>
                      <span className="text-sm font-bold text-gray-700">{item.seller}</span>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 border-none shadow-md shadow-orange-600/10 font-bold">
                      {isBangla ? 'যোগাযোগ' : 'Contact'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="animate-fade-in-up space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SEASONAL_INFO_BASE.map((season, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                      {season.type === 'winter' ? <Snowflake className="text-blue-400" /> : season.type === 'summer' ? <Sun className="text-yellow-500" /> : <CloudRain className="text-gray-500" />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{isBangla ? season.seasonBn : season.seasonEn}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-bold block mb-1 text-gray-800">{isBangla ? 'উপলব্ধ ফসল:' : 'Available Crops:'}</span>
                    {isBangla ? season.cropsBn : season.cropsEn}
                  </p>
                </div>
              ))}
            </div>
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><TrendingUp className="text-blue-600" />{isBangla ? 'আজকের বাজার দর (গড়)' : 'Today\'s Average Price'}</h3>
                <span className="text-sm font-bold text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-widest">
                    <tr><th className="px-8 py-5">{isBangla ? 'পণ্য' : 'Product'}</th><th className="px-8 py-5">{isBangla ? 'বর্তমান দাম' : 'Current Price'}</th><th className="px-8 py-5">{isBangla ? 'গতকালের দাম' : 'Yesterday'}</th><th className="px-8 py-5 text-right">{isBangla ? 'অবস্থা' : 'Trend'}</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {marketPrices.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-gray-900 text-lg">{isBangla ? item.nameBn : item.nameEn}</td>
                        <td className="px-8 py-5 font-bold text-blue-700 text-xl">৳ {item.today}</td>
                        <td className="px-8 py-5 text-gray-500 font-medium text-lg">৳ {item.yesterday}</td>
                        <td className="px-8 py-5 text-right">
                          {item.trend === 'up' && <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-sm font-black">▲ Up</span>}
                          {item.trend === 'down' && <span className="text-green-500 bg-green-50 px-3 py-1 rounded-full text-sm font-black">▼ Down</span>}
                          {item.trend === 'stable' && <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-black">• Stable</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- POST AD MODAL --- */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-orange-50 to-white">
              <div>
                <h2 className="text-2xl font-bold text-orange-900 flex items-center gap-3">
                  <Truck size={28} />
                  {isBangla ? 'পাইকারি বিজ্ঞাপন দিন' : 'Post Wholesale Ad'}
                </h2>
                <p className="text-sm text-orange-700 font-medium ml-10">
                  {isBangla ? 'অ্যাডমিন রিভিউ করার পর বিজ্ঞাপনটি লাইভ হবে' : 'Ad will go live after admin review'}
                </p>
              </div>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"><X size={24} /></button>
            </div>

            <div className="p-8">
              {submitted ? (
                <div className="text-center py-10 animate-fade-in-up">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-lg shadow-green-50">
                    <CheckCircle size={40} className="animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? 'আবেদন জমা হয়েছে!' : 'Request Submitted!'}</h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    {isBangla ? 'আপনার বিজ্ঞাপনটি অ্যাডমিন প্যানেলে পাঠানো হয়েছে। অ্যাপ্রুভ হলে আপনাকে জানানো হবে।' : 'Your ad has been sent to admin for review. You will be notified once approved.'}
                  </p>
                  <Button onClick={() => setShowPostModal(false)} className="bg-orange-600 hover:bg-orange-700 px-10">OK</Button>
                </div>
              ) : (
                <form onSubmit={handleAdSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Package size={16} className="text-orange-500"/> {isBangla ? 'পণ্যের নাম' : 'Product Name'} *
                    </label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-lg"
                      placeholder={isBangla ? 'যেমন: মিনিকেট চাল, বগুড়ার দই...' : 'e.g. Miniket Rice, Bogra Curd...'}
                      value={adForm.product}
                      onChange={e => setAdForm({...adForm, product: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'পরিমাণ' : 'Quantity'} *</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder={isBangla ? 'যেমন: ১০০ কেজি, ৫০০ পিস...' : 'e.g. 100 kg, 500 pcs...'}
                        value={adForm.quantity}
                        onChange={e => setAdForm({...adForm, quantity: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign size={16} className="text-orange-500"/> {isBangla ? 'দাম (৳)' : 'Price (৳)'} *
                      </label>
                      <input 
                        required 
                        type="text" 
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder={isBangla ? 'যেমন: ৫০ টাকা / কেজি' : 'e.g. 50 / kg'}
                        value={adForm.price}
                        onChange={e => setAdForm({...adForm, price: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <MapPinned size={16} className="text-orange-500"/> {isBangla ? 'স্থান/জেলা' : 'Location'} *
                      </label>
                      <input 
                        required 
                        type="text" 
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder={isBangla ? 'যেমন: দিনাজপুর, বগুড়া...' : 'e.g. Dinajpur, Bogra...'}
                        value={adForm.location}
                        onChange={e => setAdForm({...adForm, location: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{isBangla ? 'বিক্রেতার ধরন' : 'Seller Type'} *</label>
                      <select 
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                        value={adForm.sellerType}
                        onChange={e => setAdForm({...adForm, sellerType: e.target.value})}
                      >
                        <option value="Farmer">{isBangla ? 'কৃষক' : 'Farmer'}</option>
                        <option value="Trader">{isBangla ? 'ব্যবসায়ী' : 'Trader'}</option>
                        <option value="Manufacturer">{isBangla ? 'প্রস্তুতকারক' : 'Manufacturer'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-600/20 text-lg flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                      {isBangla ? 'বিজ্ঞাপন জমা দিন' : 'Submit Ad'}
                    </Button>
                    <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 uppercase tracking-widest">
                       <Info size={12}/> Secure system • Manual review
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
