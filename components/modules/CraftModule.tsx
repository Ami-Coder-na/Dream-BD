
import React, { useState, useMemo } from 'react';
import { ShoppingBag, Star, Truck, Search, Filter, X, CheckCircle, Tag, Leaf, User, Heart, ChevronDown, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

interface Product {
  id: number;
  nameEn: string;
  nameBn: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  artisan: string;
  descriptionEn: string;
  descriptionBn: string;
  ecoFriendly: boolean;
  material: string;
}

// External Static Data
const CRAFT_PRODUCTS: Product[] = [
  { 
    id: 1, 
    nameEn: 'Nakshi Kantha', 
    nameBn: 'নকশী কাঁথা', 
    price: 2500, 
    category: 'Textile', 
    image: 'https://images.unsplash.com/photo-1597113366853-fea190b6cd82',
    rating: 4.8,
    reviews: 120,
    artisan: 'Rahima Begum, Jessore',
    descriptionEn: 'Traditional embroidered quilt made from old saris and dhotis. A masterpiece of rural art.',
    descriptionBn: 'পুরাতন শাড়ি এবং ধুতি দিয়ে তৈরি ঐতিহ্যবাহী নকশা করা কাঁথা। গ্রামীণ শিল্পের এক অনন্য নিদর্শন।',
    ecoFriendly: true,
    material: 'Cotton'
  },
  { 
    id: 2, 
    nameEn: 'Bamboo Basket Set', 
    nameBn: 'বাঁশের ঝুড়ি সেট', 
    price: 450, 
    category: 'Bamboo', 
    image: 'https://images.unsplash.com/photo-1519800637379-3732f74164b7',
    rating: 4.5,
    reviews: 45,
    artisan: 'Sunil Das, Sylhet',
    descriptionEn: 'Handwoven bamboo baskets perfect for storage or decoration. Durable and eco-friendly.',
    descriptionBn: 'হাতে বোনা বাঁশের ঝুড়ি যা সংরক্ষণ বা সাজসজ্জার জন্য উপযুক্ত। টেকসই এবং পরিবেশবান্ধব।',
    ecoFriendly: true,
    material: 'Bamboo'
  },
  { 
    id: 3, 
    nameEn: 'Jamdani Saree', 
    nameBn: 'জামদানি শাড়ি', 
    price: 12000, 
    category: 'Textile', 
    image: 'https://images.unsplash.com/photo-1610725664285-a3a962e51a46',
    rating: 4.9,
    reviews: 210,
    artisan: 'Rupganj Weavers',
    descriptionEn: 'Authentic Dhakai Jamdani with intricate geometric patterns. A symbol of Bengali nobility.',
    descriptionBn: 'জ্যামিতিক নকশা সম্বলিত আসল ঢাকাই জামদানি। বাঙালি আভিজাত্যের প্রতীক।',
    ecoFriendly: false,
    material: 'Cotton & Silk'
  },
  { 
    id: 4, 
    nameEn: 'Terracotta Vase', 
    nameBn: 'পোড়ামাটির ফুলদানি', 
    price: 350, 
    category: 'Pottery', 
    image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be',
    rating: 4.6,
    reviews: 85,
    artisan: 'Pal Para, Bogra',
    descriptionEn: 'Beautifully crafted clay vase with traditional motifs. Adds an earthy touch to your home.',
    descriptionBn: 'ঐতিহ্যবাহী মোটিফ সহ সুন্দরভাবে তৈরি মাটির ফুলদানি। আপনার ঘরে মাটির ছোঁয়া আনে।',
    ecoFriendly: true,
    material: 'Clay'
  },
  { 
    id: 5, 
    nameEn: 'Jute Shopping Bag', 
    nameBn: 'পাটের শপিং ব্যাগ', 
    price: 200, 
    category: 'Jute', 
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6',
    rating: 4.7,
    reviews: 300,
    artisan: 'Golden Fiber Co.',
    descriptionEn: 'Reusable eco-friendly shopping bag made from high-quality jute.',
    descriptionBn: 'উচ্চ মানের পাট দিয়ে তৈরি পরিবেশবান্ধব শপিং ব্যাগ।',
    ecoFriendly: true,
    material: 'Jute'
  },
  { 
    id: 6, 
    nameEn: 'Brass Lamp', 
    nameBn: 'পিতলের প্রদীপ', 
    price: 1500, 
    category: 'Metal', 
    image: 'https://images.unsplash.com/photo-1629196914168-3a964433845c',
    rating: 4.8,
    reviews: 50,
    artisan: 'Dhamrai Metal Crafts',
    descriptionEn: 'Hand-polished brass lamp with intricate detailing. Perfect for festivals.',
    descriptionBn: 'হাতে পালিশ করা পিতলের প্রদীপ। উৎসবের জন্য উপযুক্ত।',
    ecoFriendly: false,
    material: 'Brass'
  },
  { 
    id: 7, 
    nameEn: 'Wooden Rickshaw Art', 
    nameBn: 'রিকশা পেইন্টিং শোপিস', 
    price: 850, 
    category: 'Wood', 
    image: 'https://images.unsplash.com/photo-1584351608663-7140f7f32924',
    rating: 4.9,
    reviews: 150,
    artisan: 'Old Dhaka Artists',
    descriptionEn: 'Vibrant rickshaw art painted on a wooden frame. A piece of Dhaka street culture.',
    descriptionBn: 'কাঠের ফ্রেমে আঁকা রিকশা পেইন্টিং। ঢাকার রাস্তার সংস্কৃতির একটি অংশ।',
    ecoFriendly: true,
    material: 'Wood'
  },
  { 
    id: 8, 
    nameEn: 'Handloom Bed Sheet', 
    nameBn: 'হাতের তৈরি চাদর', 
    price: 1200, 
    category: 'Textile', 
    image: 'https://images.unsplash.com/photo-1522771753035-6a5a02a7fc99',
    rating: 4.4,
    reviews: 90,
    artisan: 'Sirajganj Weavers',
    descriptionEn: 'Soft and durable cotton bed sheet woven on a handloom.',
    descriptionBn: 'হ্যান্ডলুমে বোনা নরম এবং টেকসই সুতির বিছানার চাদর।',
    ecoFriendly: true,
    material: 'Cotton'
  }
];

export const CraftModule: React.FC<Props> = ({ isBangla }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [ecoOnly, setEcoOnly] = useState(false);

  // Memoized Filtering Logic
  const filteredProducts = useMemo(() => {
    return CRAFT_PRODUCTS.filter(prod => {
      const matchesSearch = 
        prod.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
        prod.nameBn.includes(searchQuery);
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(prod.category);
      
      const matchesEco = ecoOnly ? prod.ecoFriendly : true;

      let matchesPrice = true;
      if (selectedPriceRanges.length > 0) {
        matchesPrice = selectedPriceRanges.some(range => {
          if (range === 'low') return prod.price <= 500;
          if (range === 'mid') return prod.price > 500 && prod.price <= 2000;
          if (range === 'high') return prod.price > 2000;
          return false;
        });
      }

      return matchesSearch && matchesCategory && matchesPrice && matchesEco;
    });
  }, [searchQuery, selectedCategories, selectedPriceRanges, ecoOnly]);

  const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setEcoOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-orange-50/30 py-8 lg:py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-3 border border-orange-200">
            <ShoppingBag size={14} />
            {isBangla ? 'ঐতিহ্য ও শিল্প' : 'Heritage & Art'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isBangla ? 'বাংলাদেশের ঐতিহ্যবাহী কারুশিল্প' : 'Heritage Crafts of Bangladesh'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {isBangla 
              ? 'সরাসরি কারিগরদের কাছ থেকে কিনুন এবং আমাদের সমৃদ্ধ ঐতিহ্য রক্ষা করুন।' 
              : 'Buy directly from artisans, support fair trade, and preserve our rich heritage.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar and Main Content structure remains same, leveraging filteredProducts */}
          <div className="lg:hidden col-span-1">
            <Button variant="outline" className="w-full flex justify-between" onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <span className="flex items-center gap-2"><Filter size={16}/> {isBangla ? 'ফিল্টার' : 'Filters'}</span>
              <ChevronDown size={16} className={`transform ${showMobileFilters ? 'rotate-180' : ''} transition-transform`}/>
            </Button>
          </div>

          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24`}>
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Filter size={18} /> {isBangla ? 'ফিল্টার' : 'Filters'}</h3>
              {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || ecoOnly) && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1"><RefreshCw size={12} /> {isBangla ? 'রিসেট' : 'Reset'}</button>
              )}
            </div>
            <div className="space-y-6">
               <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{isBangla ? 'ক্যাটাগরি' : 'Category'}</h4>
                  <div className="space-y-2">
                    {['Textile', 'Bamboo', 'Pottery', 'Jute', 'Wood', 'Metal'].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-orange-600 border-orange-600' : 'border-gray-300 group-hover:border-orange-400'}`}>
                          {selectedCategories.includes(cat) && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat)} onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} />
                        <span className={`text-sm ${selectedCategories.includes(cat) ? 'text-orange-700 font-medium' : 'text-gray-600'}`}>{cat}</span>
                      </label>
                    ))}
                  </div>
               </div>
               {/* Other filters... */}
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 bg-white shadow-sm transition-all"
                placeholder={isBangla ? 'কারুশিল্প খুঁজুন...' : 'Search crafts...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer overflow-hidden flex flex-col h-full"
                  >
                    <div className="relative h-56 bg-gray-100 overflow-hidden">
                      <img 
                        src={getOptimizedImageUrl(product.image, 400)} 
                        alt={product.nameEn} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/orange/white?text=Product"; }}
                      />
                      {product.ecoFriendly && (
                        <span className="absolute top-2 left-2 bg-green-100/90 backdrop-blur text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                          <Leaf size={10} /> Eco
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{product.category}</span>
                        <div className="flex items-center text-yellow-500 text-xs font-bold">
                          <Star size={12} fill="currentColor" className="mr-1" />
                          {product.rating}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-700 transition-colors line-clamp-1">
                        {isBangla ? product.nameBn : product.nameEn}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">{product.artisan}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xl">৳ {product.price}</span>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 border-none">
                          {isBangla ? 'দেখুন' : 'View'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন পণ্য পাওয়া যায়নি' : 'No products found'}</h3>
                <Button variant="outline" onClick={clearFilters} className="mt-4">{isBangla ? 'ফিল্টার মুছুন' : 'Clear Filters'}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
              <img 
                src={getOptimizedImageUrl(selectedProduct.image, 800)} 
                alt={selectedProduct.nameEn} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 transition-colors md:hidden shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            <div className="w-full md:w-1/2 flex flex-col bg-white">
              <div className="p-6 md:p-8 overflow-y-auto flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-orange-600 font-bold text-sm tracking-wider uppercase">{selectedProduct.category}</span>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">{isBangla ? selectedProduct.nameBn : selectedProduct.nameEn}</h2>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors hidden md:block"><X size={24} /></button>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">{isBangla ? selectedProduct.descriptionBn : selectedProduct.descriptionEn}</p>
                {/* Details... */}
              </div>
              <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50 mt-auto">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">{isBangla ? 'মূল্য' : 'Price'}</p>
                  <p className="text-3xl font-bold text-orange-700">৳ {selectedProduct.price}</p>
                </div>
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 border-none shadow-lg shadow-orange-600/20 px-8">
                  <ShoppingBag size={20} className="mr-2" />
                  {isBangla ? 'কিনুন' : 'Buy Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
