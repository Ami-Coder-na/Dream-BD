
import React, { useState, useMemo } from 'react';
import { ShoppingBag, Star, Truck, Search, Filter, X, CheckCircle, Tag, Leaf, User, Heart, ChevronDown, RefreshCw, Camera } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';

interface Props {
  isBangla: boolean;
}

export const CraftModule: React.FC<Props> = ({ isBangla }) => {
  const { craftProducts } = useData();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ecoOnly, setEcoOnly] = useState(false);

  // Memoized Filtering Logic
  const filteredProducts = useMemo(() => {
    return (craftProducts || []).filter((prod: any) => {
      const nameE = (prod.nameEn || prod.nameen || '').toLowerCase();
      const nameB = (prod.nameBn || prod.namebn || '');
      const matchesSearch = nameE.includes(searchQuery.toLowerCase()) || nameB.includes(searchQuery);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(prod.category);
      const matchesEco = ecoOnly ? prod.ecoFriendly : true;
      return matchesSearch && matchesCategory && matchesEco;
    });
  }, [searchQuery, selectedCategories, ecoOnly, craftProducts]);

  const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
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
              ? 'আমাদের সমৃদ্ধ ঐতিহ্য ও কারুশিল্পের সংকলন। বিস্তারিত জানতে ছবিতে ক্লিক করুন।' 
              : 'A collection of our rich heritage and crafts. Click on an image to learn more.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:hidden col-span-1">
            <Button variant="outline" className="w-full flex justify-between" onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <span className="flex items-center gap-2"><Filter size={16}/> {isBangla ? 'ফিল্টার' : 'Filters'}</span>
              <ChevronDown size={16} className={`transform ${showMobileFilters ? 'rotate-180' : ''} transition-transform`}/>
            </Button>
          </div>

          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24`}>
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Filter size={18} /> {isBangla ? 'ফিল্টার' : 'Filters'}</h3>
              {(selectedCategories.length > 0 || ecoOnly) && (
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
               <div className="pt-4 border-t border-gray-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button 
                      onClick={() => setEcoOnly(!ecoOnly)} 
                      className={`relative w-10 h-5 rounded-full transition-colors ${ecoOnly ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${ecoOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                    <span className="text-sm font-medium text-gray-700">{isBangla ? 'পরিবেশবান্ধব' : 'Eco-Friendly'}</span>
                  </label>
               </div>
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
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => (
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
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/orange/white?text=Craft"; }}
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
                          {product.rating || 4.5}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-700 transition-colors line-clamp-1">
                        {isBangla ? product.nameBn : product.nameEn}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">{product.artisan}</p>
                      <div className="mt-auto pt-2 border-t border-gray-50">
                        <Button size="sm" variant="outline" className="w-full text-xs h-9 border-orange-100 hover:bg-orange-50 text-orange-700">
                          {isBangla ? 'বিস্তারিত দেখুন' : 'Learn More'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">{isBangla ? 'কোন শিল্পকর্ম পাওয়া যায়নি' : 'No crafts found'}</h3>
                <Button variant="outline" onClick={clearFilters} className="mt-4">{isBangla ? 'ফিল্টার মুছুন' : 'Clear Filters'}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
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
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-xs font-black text-orange-800 uppercase tracking-widest mb-1">{isBangla ? 'কারিগর' : 'ARTISAN'}</p>
                    <p className="font-bold text-gray-800">{selectedProduct.artisan}</p>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    <p>{isBangla ? selectedProduct.descriptionBn : selectedProduct.descriptionEn}</p>
                  </div>
                  {selectedProduct.material && (
                    <div className="flex gap-4 items-center pt-2">
                       <span className="text-xs font-bold text-gray-400 uppercase">{isBangla ? 'উপাদান:' : 'Material:'}</span>
                       <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-600">{selectedProduct.material}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto flex justify-between items-center">
                <div className="flex items-center gap-2 text-orange-600">
                   <Camera size={18} />
                   <span className="text-sm font-bold">{isBangla ? 'ঐতিহ্যবাহী সংগ্রহ' : 'Heritage Collection'}</span>
                </div>
                <Button size="lg" onClick={() => setSelectedProduct(null)} className="bg-gray-900 hover:bg-black text-white px-10">
                  {isBangla ? 'বন্ধ করুন' : 'Close'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
