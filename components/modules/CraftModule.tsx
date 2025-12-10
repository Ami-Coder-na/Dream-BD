import React from 'react';
import { ShoppingBag, Star, Truck } from 'lucide-react';
import { Product } from '../../types';
import { MOCK_PRODUCTS } from '../../constants';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const CraftModule: React.FC<Props> = ({ isBangla }) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-50 p-6 rounded-xl border border-orange-200">
        <h2 className="text-2xl font-bold text-orange-900 mb-2">
          {isBangla ? 'বাংলাদেশের ঐতিহ্যবাহী কারুশিল্প' : 'Heritage Crafts of Bangladesh'}
        </h2>
        <p className="text-orange-800">
          {isBangla 
            ? 'সরাসরি কারিগরদের কাছ থেকে কিনুন এবং আমাদের ঐতিহ্য রক্ষা করুন।' 
            : 'Buy directly from artisans and support our heritage. Authentic products, fair prices.'}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-gray-200">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.ecoFriendly && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Eco-Friendly
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{isBangla ? product.nameBn : product.name}</h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="flex items-center text-yellow-500 text-xs">
                  <Star size={12} fill="currentColor" />
                  <span className="ml-1">4.8</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-brand-700">৳ {product.price}</span>
                <Button size="sm" className="flex items-center gap-1">
                  <ShoppingBag size={14} />
                  {isBangla ? 'কিনুন' : 'Add'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg border border-gray-100 flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full text-orange-600">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="font-medium text-sm">{isBangla ? 'দ্রুত ডেলিভারি' : 'Fast Delivery'}</h4>
            <p className="text-xs text-gray-500">{isBangla ? '৬৪ জেলায়' : 'Across 64 Districts'}</p>
          </div>
        </div>
        {/* More feature blocks could go here */}
      </div>
    </div>
  );
};
