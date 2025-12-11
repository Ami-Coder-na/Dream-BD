import React, { useState, useMemo } from 'react';
import { 
  ShoppingBasket, TrendingUp, Truck, Search, Filter, 
  PlusCircle, Sun, CloudRain, Snowflake, ShoppingCart, User,
  CheckCircle, X, RefreshCw, MapPin, ChevronDown, Tag
} from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

const FilterCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-lime-600 border-lime-600' : 'border-gray-300 group-hover:border-lime-400'}`}>
      {checked && <CheckCircle size={12} className="text-white" />}
    </div>
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    <span className={`text-sm ${checked ? 'text-lime-700 font-medium' : 'text-gray-600'}`}>{label}</span>
  </label>
);

export const BazarSodaiModule: React.FC<Props> = ({ isBangla }) => {
  const [activeTab, setActiveTab] = useState<'retail' | 'paikari' | 'trends'>('retail');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // --- RETAIL FILTERS STATE ---
  const [selectedRetailCategories, setSelectedRetailCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  // --- PAIKARI FILTERS STATE ---
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSellerTypes, setSelectedSellerTypes] = useState<string[]>([]);

  // --- DATA ---
  const retailProducts = [
    { id: 1, nameBn: 'তাজা আলু', nameEn: 'Fresh Potato', price: 45, unit: 'kg', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400', category: 'Vegetable' },
    { id: 2, nameBn: 'দেশি পেঁয়াজ', nameEn: 'Local Onion', price: 90, unit: 'kg', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400', category: 'Vegetable' },
    { id: 3, nameBn: 'রুই মাছ', nameEn: 'Rui Fish', price: 350, unit: 'kg', img: 'https://images.unsplash.com/photo-1599321955726-90471f64560d?auto=format&fit=crop&q=80&w=400', category: 'Fish' },
    { id: 4, nameBn: 'মসুর ডাল', nameEn: 'Lentils', price: 130, unit: 'kg', img: 'https://images.unsplash.com/photo-1515543904379-3d757afe9b68?auto=format&fit=crop&q=80&w=400', category: 'Grocery' },
    { id: 5, nameBn: 'সবুজ আপেল', nameEn: 'Green Apple', price: 220, unit: 'kg', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400', category: 'Fruit' },
    { id: 6, nameBn: 'সয়াবিন তেল', nameEn: 'Soybean Oil', price: 170, unit: 'L', img: 'https://images.unsplash.com/photo-1474979266404-7cadd259c308?auto=format&fit=crop&q=80&w=400', category: 'Grocery' },
    { id: 7, nameBn: 'বেগুন', nameEn: 'Eggplant', price: 60, unit: 'kg', img: 'https://images.unsplash.com/photo-1615485500704-8e99099928b3?auto=format&fit=crop&q=80&w=400', category: 'Vegetable' },
    { id: 8, nameBn: 'পাকা আম', nameEn: 'Ripe Mango', price: 120, unit: 'kg', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400', category: 'Fruit' },
  ];

  const wholesaleListings = [
    { id: 1, product: isBangla ? 'দিনাজপুরের লিচু' : 'Dinajpur Lychee', quantity: '5000 pcs', price: '৳ 3.5 / pc', location: 'Dinajpur', seller: 'Karim Fruit Store', sellerType: 'Store', date: '2 hrs ago' },
    { id: 2, product: isBangla ? 'বগুড়ার দই' : 'Bogra Doi', quantity: '100 pots', price: '৳ 180 / pot', location: 'Bogra', seller: 'Misty Bari', sellerType: 'Manufacturer', date: '5 hrs ago' },
    { id: 3, product: isBangla ? 'মিনিকেট চাল' : 'Miniket Rice', quantity: '50 Mon', price: '৳ 2800 / mon', location: 'Naogaon', seller: 'Bhai Bhai Traders', sellerType: 'Trader', date: '1 day ago' },
    { id: 4, product: isBangla ? 'পাবনার পেঁয়াজ' : 'Pabna Onion', quantity: '200 kg', price: '৳ 80 / kg', location: 'Pabna', seller: 'Krishi Khamar', sellerType: 'Farmer', date: '1 day ago' },
    { id: 5, product: isBangla ? 'টাঙ্গাইলের শাড়ি' : 'Tangail Saree', quantity: '50 pcs', price: '৳ 450 / pc', location: 'Tangail', seller: ' তাঁত ঘর', sellerType: 'Weaver', date: '3 hrs ago' },
  ];

  const marketPrices = [
    { nameBn: 'বেগুন (গোল)', nameEn: 'Eggplant (Round)', today: 60, yesterday: 55, trend: 'up' },
    { nameBn: 'কাঁচা মরিচ', nameEn: 'Green Chili', today: 120, yesterday: 140, trend: 'down' },
    { nameBn: 'টমেটো', nameEn: 'Tomato', today: 40, yesterday: 40, trend: 'stable' },
    { nameBn: 'মুরগি (ব্রয়লার)', nameEn: 'Chicken (Broiler)', today: 210, yesterday: 200, trend: 'up' },
  ];

  const seasonalInfo = [
    { seasonBn: 'শীতকাল', seasonEn: 'Winter', icon: <Snowflake className="text-blue-400" />, crops: isBangla ? 'ফুলকপি, বাঁধাকপি, গাজর, টমেটো' : 'Cauliflower, Cabbage, Carrot, Tomato' },
    { seasonBn: 'বর্ষাকাল', seasonEn: 'Monsoon', icon: <CloudRain className="text-gray-500" />, crops: isBangla ? 'চাল কুমড়া, ঝিঙ্গা, চিচিঙ্গা' : 'Ash Gourd, Ridge Gourd, Snake Gourd' },
    { seasonBn: 'গ্রীষ্মকাল', seasonEn: 'Summer', icon: <Sun className="text-yellow-500" />, crops: isBangla ? 'আম, কাঁঠাল, লিচু, পটল' : 'Mango, Jackfruit, Lychee, Pointed Gourd' },
  ];

  // --- FILTER LOGIC ---

  const filteredRetailProducts = useMemo(() => {
    return retailProducts.filter(prod => {
      const matchesSearch = 
        prod.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
        prod.nameBn.includes(searchQuery);
      
      const matchesCategory = selectedRetailCategories.length === 0 || selectedRetailCategories.includes(prod.category);
      
      let matchesPrice = true;
      if (selectedPriceRanges.length > 0) {
        matchesPrice = selectedPriceRanges.some(range => {
          if (range === 'low') return prod.price <= 100;
          if (range === 'mid') return prod.price > 100 && prod.price <= 200;
          if (range === 'high') return prod.price > 200;
          return false;
        });
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [retailProducts, searchQuery, selectedRetailCategories, selectedPriceRanges]);

  const filteredWholesaleListings = useMemo(() => {
    return wholesaleListings.filter(item => {
      const matchesSearch = 
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(item.location);
      const matchesSeller = selectedSellerTypes.length === 0 || selectedSellerTypes.includes(item.sellerType);

      return matchesSearch && matchesLocation && matchesSeller;
    });
  }, [wholesaleListings, searchQuery, selectedLocations, selectedSellerTypes]);

  const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const clearRetailFilters = () => {
    setSelectedRetailCategories([]);
    setSelectedPriceRanges([]);
    setSearchQuery('');
  };

  const clearPaikariFilters = () => {
    setSelectedLocations([]);
    setSelectedSellerTypes([]);
    setSearchQuery('');
  };

  // --- RENDER HELPERS ---

  return (
    <div className="bg-lime-50/30 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-100 text-lime-700 text-sm font-bold mb-4 border border-lime-200">
            <ShoppingBasket size={16} />
            {isBangla ? 'বাংলাদেশের ডিজিটাল হাট' : 'Digital Market of Bangladesh'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'বাজার সদাই' : 'Bazar Sodai'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'খুচরা কিনুন, পাইকারি বেচুন এবং জানুন আজকের বাজার দর। সব এক ঠিকানায়।' 
              : 'Shop retail, sell wholesale, and check today\'s market prices. All in one place.'}
          </p>
        </div>

        {/* Navigation Tabs - Modern Pills */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 flex gap-1 overflow-x-auto max-w-full">
            <button 
              onClick={() => setActiveTab('retail')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'retail' 
                  ? 'bg-lime-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart size={16} />
              {isBangla ? 'কেনাকাটা' : 'Shop Retail'}
            </button>
            <button 
              onClick={() => setActiveTab('paikari')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'paikari' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Truck size={16} />
              {isBangla ? 'পাইকারি হাট' : 'Paikari Hat'}
            </button>
            <button 
              onClick={() => setActiveTab('trends')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'trends' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={16} />
              {isBangla ? 'বাজার দর' : 'Market Price'}
            </button>
          </div>
        </div>

        {/* --- VIEW: RETAIL SHOP --- */}
        {activeTab === 'retail' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in-up">
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden col-span-1">
              <Button variant="outline" className="w-full flex justify-between" onClick={() => setShowMobileFilters(!showMobileFilters)}>
                <span className="flex items-center gap-2"><Filter size={16}/> {isBangla ? 'ফিল্টার' : 'Filters'}</span>
                <ChevronDown size={16} className={`transform ${showMobileFilters ? 'rotate-180' : ''} transition-transform`}/>
              </Button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={18} /> {isBangla ? 'ফিল্টার' : 'Filters'}
                </h3>
                {(selectedRetailCategories.length > 0 || selectedPriceRanges.length > 0) && (
                  <button onClick={clearRetailFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                    <RefreshCw size={12} /> {isBangla ? 'রিসেট' : 'Reset'}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{isBangla ? 'ক্যাটাগরি' : 'Category'}</h4>
                  <div className="space-y-2">
                    {['Vegetable', 'Fruit', 'Fish', 'Grocery'].map(cat => (
                      <FilterCheckbox 
                        key={cat}
                        label={isBangla && cat === 'Vegetable' ? 'শাক-সবজি' : isBangla && cat === 'Fruit' ? 'ফলমূল' : isBangla && cat === 'Fish' ? 'মাছ' : isBangla && cat === 'Grocery' ? 'মুদি' : cat} 
                        checked={selectedRetailCategories.includes(cat)}
                        onChange={() => toggleFilter(cat, selectedRetailCategories, setSelectedRetailCategories)}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100"></div>

                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{isBangla ? 'দাম (টাকা)' : 'Price Range'}</h4>
                  <div className="space-y-2">
                    {[
                      { val: 'low', label: isBangla ? '১০০ টাকার নিচে' : 'Under 100' },
                      { val: 'mid', label: isBangla ? '১০০ - ২০০ টাকা' : '100 - 200' },
                      { val: 'high', label: isBangla ? '২০০ টাকার বেশি' : 'Above 200' }
                    ].map(range => (
                      <FilterCheckbox 
                        key={range.val}
                        label={range.label} 
                        checked={selectedPriceRanges.includes(range.val)}
                        onChange={() => toggleFilter(range.val, selectedPriceRanges, setSelectedPriceRanges)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lime-500/50 bg-white shadow-sm transition-all"
                  placeholder={isBangla ? 'পণ্য খুঁজুন...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredRetailProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRetailProducts.map((prod) => (
                    <div key={prod.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative flex flex-col">
                      <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
                        <img 
                          src={prod.img} 
                          alt={prod.nameEn} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-lime-700 shadow-sm flex items-center gap-1">
                          <Tag size={10} />
                          {prod.category}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-lime-700 transition-colors">
                          {isBangla ? prod.nameBn : prod.nameEn}
                        </h3>
                        <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-50">
                          <div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{isBangla ? 'প্রতি' : 'Per'} {prod.unit}</p>
                            <p className="text-lime-700 font-bold text-xl">৳ {prod.price}</p>
                          </div>
                          <button className="bg-lime-600 hover:bg-lime-700 text-white p-2.5 rounded-xl shadow-lg shadow-lime-600/20 transform active:scale-95 transition-all">
                            <PlusCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <ShoppingBasket size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন পণ্য পাওয়া যায়নি' : 'No products found'}</h3>
                  <Button variant="outline" onClick={clearRetailFilters} className="mt-4">
                    {isBangla ? 'ফিল্টার মুছুন' : 'Clear Filters'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW: PAIKARI HAT (WHOLESALE) --- */}
        {activeTab === 'paikari' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in-up">
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden col-span-1">
              <Button variant="outline" className="w-full flex justify-between" onClick={() => setShowMobileFilters(!showMobileFilters)}>
                <span className="flex items-center gap-2"><Filter size={16}/> {isBangla ? 'ফিল্টার' : 'Filters'}</span>
                <ChevronDown size={16} className={`transform ${showMobileFilters ? 'rotate-180' : ''} transition-transform`}/>
              </Button>
            </div>

            {/* Sidebar Filters */}
            <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={18} /> {isBangla ? 'ফিল্টার' : 'Filters'}
                </h3>
                {(selectedLocations.length > 0 || selectedSellerTypes.length > 0) && (
                  <button onClick={clearPaikariFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                    <RefreshCw size={12} /> {isBangla ? 'রিসেট' : 'Reset'}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{isBangla ? 'জেলা / স্থান' : 'Location'}</h4>
                  <div className="space-y-2">
                    {['Dinajpur', 'Bogra', 'Naogaon', 'Pabna', 'Tangail'].map(loc => (
                      <FilterCheckbox 
                        key={loc}
                        label={loc} 
                        checked={selectedLocations.includes(loc)}
                        onChange={() => toggleFilter(loc, selectedLocations, setSelectedLocations)}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100"></div>

                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{isBangla ? 'বিক্রেতার ধরন' : 'Seller Type'}</h4>
                  <div className="space-y-2">
                    {[
                      { val: 'Farmer', label: isBangla ? 'কৃষক' : 'Farmer' },
                      { val: 'Store', label: isBangla ? 'দোকান' : 'Store' },
                      { val: 'Trader', label: isBangla ? 'ব্যবসায়ী' : 'Trader' },
                      { val: 'Weaver', label: isBangla ? 'তাঁতী' : 'Weaver' }
                    ].map(type => (
                      <FilterCheckbox 
                        key={type.val}
                        label={type.label} 
                        checked={selectedSellerTypes.includes(type.val)}
                        onChange={() => toggleFilter(type.val, selectedSellerTypes, setSelectedSellerTypes)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Banner */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold text-orange-900 mb-2">
                    {isBangla ? 'আপনার পণ্য বিক্রি করুন' : 'Sell Your Produce Bulk'}
                  </h2>
                  <p className="text-orange-800 text-sm max-w-lg">
                    {isBangla 
                      ? 'কৃষক বা পাইকারি বিক্রেতারা এখানে সরাসরি বিজ্ঞাপন দিতে পারেন। কোন মধ্যস্থতাকারী নেই।' 
                      : 'Farmers and wholesalers can post ads here directly. No middlemen involved.'}
                  </p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 border-none shadow-lg shadow-orange-600/20 whitespace-nowrap">
                  <PlusCircle size={18} className="mr-2" />
                  {isBangla ? 'বিজ্ঞাপন দিন (ফ্রি)' : 'Post Ad (Free)'}
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white shadow-sm transition-all"
                  placeholder={isBangla ? 'পাইকারি পণ্য খুঁজুন...' : 'Search wholesale items...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Truck className="text-orange-600" size={20} />
                {isBangla ? 'চলমান অফারসমূহ' : 'Live Wholesale Offers'}
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{filteredWholesaleListings.length}</span>
              </h3>

              {filteredWholesaleListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredWholesaleListings.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">{item.product}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <MapPin size={12} /> {item.location}
                              <span>•</span>
                              <span>{item.date}</span>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                            item.sellerType === 'Farmer' ? 'bg-green-100 text-green-700' : 
                            item.sellerType === 'Store' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.sellerType}
                          </span>
                        </div>
                        
                        <div className="bg-orange-50/50 rounded-xl p-4 space-y-2 mb-6 border border-orange-50">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{isBangla ? 'পরিমাণ' : 'Quantity'}</span>
                            <span className="font-bold text-gray-900">{item.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{isBangla ? 'দাম' : 'Price'}</span>
                            <span className="font-bold text-orange-600">{item.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            <User size={14} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.seller}</span>
                        </div>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 border-none shadow-md shadow-orange-600/10">
                          {isBangla ? 'যোগাযোগ' : 'Contact'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Truck size={32} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন বিজ্ঞাপন পাওয়া যায়নি' : 'No listings found'}</h3>
                  <Button variant="outline" onClick={clearPaikariFilters} className="mt-4">
                    {isBangla ? 'ফিল্টার মুছুন' : 'Clear Filters'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW: MARKET TRENDS --- */}
        {activeTab === 'trends' && (
          <div className="animate-fade-in-up space-y-8">
            {/* Seasonal Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seasonalInfo.map((season, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gray-50 rounded-full">{season.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900">{isBangla ? season.seasonBn : season.seasonEn}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-bold block mb-1">{isBangla ? 'উপলব্ধ ফসল:' : 'Available Crops:'}</span>
                    {season.crops}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" />
                  {isBangla ? 'আজকের বাজার দর (গড়)' : 'Today\'s Average Price'}
                </h3>
                <span className="text-xs text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">{isBangla ? 'পণ্য' : 'Product'}</th>
                      <th className="px-6 py-4">{isBangla ? 'বর্তমান দাম (কেজি)' : 'Current Price (kg)'}</th>
                      <th className="px-6 py-4">{isBangla ? 'গতকালের দাম' : 'Yesterday'}</th>
                      <th className="px-6 py-4">{isBangla ? 'অবস্থা' : 'Trend'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {marketPrices.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {isBangla ? item.nameBn : item.nameEn}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">৳ {item.today}</td>
                        <td className="px-6 py-4 text-gray-500">৳ {item.yesterday}</td>
                        <td className="px-6 py-4">
                          {item.trend === 'up' && <span className="text-red-500 flex items-center gap-1 text-xs font-bold bg-red-50 px-2 py-1 rounded w-fit">▲ {isBangla ? 'বেড়েছে' : 'Up'}</span>}
                          {item.trend === 'down' && <span className="text-green-500 flex items-center gap-1 text-xs font-bold bg-green-50 px-2 py-1 rounded w-fit">▼ {isBangla ? 'কমেছে' : 'Down'}</span>}
                          {item.trend === 'stable' && <span className="text-gray-500 flex items-center gap-1 text-xs font-bold bg-gray-100 px-2 py-1 rounded w-fit">• {isBangla ? 'স্থিতিশীল' : 'Stable'}</span>}
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
    </div>
  );
};