
import React, { useState } from 'react';
import { 
  TrendingUp, ShoppingCart, Truck, Plus, Edit3, Trash2, 
  Search, Save, X, Check, Filter, Image as ImageIcon,
  DollarSign, Package
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../contexts/DataContext';

// Helper to convert Bangla numbers
const bnToEn = (str: any) => {
    if(!str) return 0;
    const s = str.toString();
    const numbers = { '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4, '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9 };
    // @ts-ignore
    const enStr = s.replace(/[০-৯]/g, (match: string) => numbers[match]);
    return parseFloat(enStr) || parseFloat(s) || 0;
};

export const AdminMarket = () => {
  const { 
    marketPrices, updateMarketPrices,
    retailProducts, addRetailProduct, updateRetailProduct, deleteRetailProduct,
    wholesaleAds, updateWholesaleAd, deleteWholesaleAd
  } = useData();

  const [activeTab, setActiveTab] = useState<'prices' | 'retail' | 'wholesale'>('prices');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // --- ACTIONS: PRICES ---
  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert inputs safely
    const todayP = bnToEn(editingItem.today);
    const yesterdayP = bnToEn(editingItem.yesterday);

    const cleanItem = {
      ...editingItem,
      today: todayP,
      yesterday: yesterdayP
    };

    if (editingItem.id) {
      // Update existing
      updateMarketPrices(marketPrices.map((p: any) => p.id === editingItem.id ? cleanItem : p));
    } else {
      // Add new
      updateMarketPrices([...marketPrices, { ...cleanItem, id: Date.now() }]);
    }
    setShowPriceModal(false);
    setEditingItem(null);
  };

  const deletePrice = (id: number) => {
    if(confirm('Delete this price record?')) updateMarketPrices(marketPrices.filter((p: any) => p.id !== id));
  };

  // --- ACTIONS: RETAIL ---
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceVal = bnToEn(editingItem.price);
    const cleanProduct = { ...editingItem, price: priceVal };

    if (editingItem.id) {
      updateRetailProduct(cleanProduct);
    } else {
      addRetailProduct({ ...cleanProduct, stock: 'Available' });
    }
    setShowProductModal(false);
    setEditingItem(null);
  };

  const deleteProduct = (id: number) => {
    if(confirm('Delete this product?')) deleteRetailProduct(id);
  };

  // --- ACTIONS: WHOLESALE ---
  const handleWholesaleAction = (id: number, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      const ad = wholesaleAds.find((a: any) => a.id === id);
      if (ad) updateWholesaleAd({ ...ad, status: 'Active' });
    } else {
      deleteWholesaleAd(id);
    }
  };

  // --- RENDERERS ---

  const renderPricesTab = () => (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600" /> Daily Market Rates
        </h3>
        <Button onClick={() => { setEditingItem({}); setShowPriceModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus size={18} /> Add Item
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
            <tr>
              <th className="p-4">Commodity Name</th>
              <th className="p-4">Unit</th>
              <th className="p-4 text-right">Yesterday (৳)</th>
              <th className="p-4 text-right">Today (৳)</th>
              <th className="p-4 text-right">Trend</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {marketPrices.map((item: any) => {
              const diff = item.today - item.yesterday;
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">
                    {item.nameEn} <span className="text-gray-400 text-xs block">{item.nameBn}</span>
                  </td>
                  <td className="p-4 text-gray-600">{item.unit}</td>
                  <td className="p-4 text-right text-gray-500">{item.yesterday}</td>
                  <td className="p-4 text-right font-bold text-gray-900">{item.today}</td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${diff > 0 ? 'bg-red-50 text-red-600' : diff < 0 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {diff > 0 ? '▲ Up' : diff < 0 ? '▼ Down' : '• Stable'} {diff !== 0 && Math.abs(diff)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setEditingItem(item); setShowPriceModal(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16}/></button>
                      <button onClick={() => deletePrice(item.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRetailTab = () => (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="text-green-600" /> Retail Products Inventory
        </h3>
        <Button onClick={() => { setEditingItem({}); setShowProductModal(true); }} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
          <Plus size={18} /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retailProducts.map((prod: any) => (
          <div key={prod.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 group hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-900">{prod.nameEn}</h4>
                <p className="text-xs text-gray-500">{prod.nameBn}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-medium">{prod.category}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-700 text-lg">৳ {prod.price}</p>
                <p className="text-xs text-gray-400">per {prod.unit}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
              <span className={`text-xs font-bold px-2 py-1 rounded ${prod.stock === 'Available' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {prod.stock}
              </span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingItem(prod); setShowProductModal(true); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"><Edit3 size={16}/></button>
                <button onClick={() => deleteProduct(prod.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWholesaleTab = () => (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Truck className="text-orange-600" /> Wholesale Ad Requests
        </h3>
        <div className="flex gap-2">
           <span className="flex items-center gap-1 text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
             {wholesaleAds.filter((a: any) => a.status === 'Pending').length} Pending
           </span>
        </div>
      </div>

      <div className="space-y-4">
        {wholesaleAds.map((ad: any) => (
          <div key={ad.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex-1">
               <div className="flex items-center gap-3 mb-1">
                 <h4 className="font-bold text-gray-900 text-lg">{ad.product}</h4>
                 <span className={`text-xs px-2 py-0.5 rounded font-bold ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                   {ad.status}
                 </span>
               </div>
               <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                 <span>Qty: <strong>{ad.quantity}</strong></span>
                 <span>Price: <strong>৳ {ad.price}</strong></span>
                 <span>Seller: {ad.seller}</span>
                 <span className="text-gray-400">{ad.date}</span>
               </div>
             </div>

             {ad.status === 'Pending' && (
               <div className="flex gap-3">
                 <Button onClick={() => handleWholesaleAction(ad.id, 'approve')} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                   <Check size={16} className="mr-1" /> Approve
                 </Button>
                 <Button onClick={() => handleWholesaleAction(ad.id, 'reject')} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                   <X size={16} className="mr-1" /> Reject
                 </Button>
               </div>
             )}
             {ad.status === 'Active' && (
               <Button onClick={() => handleWholesaleAction(ad.id, 'reject')} variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                 <Trash2 size={16} className="mr-1" /> Delete
               </Button>
             )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
           <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-full md:w-fit">
              {[
                { id: 'prices', icon: <TrendingUp size={16}/>, label: 'Daily Prices' },
                { id: 'retail', icon: <ShoppingCart size={16}/>, label: 'Retail Shop' },
                { id: 'wholesale', icon: <Truck size={16}/>, label: 'Wholesale Ads' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
           </div>

           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-3 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search items..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
             />
           </div>
        </div>

        {activeTab === 'prices' && renderPricesTab()}
        {activeTab === 'retail' && renderRetailTab()}
        {activeTab === 'wholesale' && renderWholesaleTab()}

      </div>

      {/* --- MODALS --- */}

      {/* Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-blue-50">
              <h3 className="font-bold text-lg text-blue-900">{editingItem?.id ? 'Update Price' : 'Add Commodity'}</h3>
              <button onClick={() => setShowPriceModal(false)} className="text-blue-900 hover:bg-blue-100 rounded-full p-1 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handlePriceUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Name (English)</label><input required className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={editingItem?.nameEn || ''} onChange={e => setEditingItem({...editingItem, nameEn: e.target.value})} /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Name (Bangla)</label><input required className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" value={editingItem?.nameBn || ''} onChange={e => setEditingItem({...editingItem, nameBn: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Unit</label><input required className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="kg/pc" value={editingItem?.unit || ''} onChange={e => setEditingItem({...editingItem, unit: e.target.value})} /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Yesterday</label><input required type="text" className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. 50" value={editingItem?.yesterday || ''} onChange={e => setEditingItem({...editingItem, yesterday: e.target.value})} /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Today</label><input required type="text" className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="e.g. 52" value={editingItem?.today || ''} onChange={e => setEditingItem({...editingItem, today: e.target.value})} /></div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">Save Record</Button>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-green-50">
              <h3 className="font-bold text-lg text-green-900">{editingItem?.id ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-green-900 hover:bg-green-100 rounded-full p-1 transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Name (English)</label><input required className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" value={editingItem?.nameEn || ''} onChange={e => setEditingItem({...editingItem, nameEn: e.target.value})} /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Name (Bangla)</label><input required className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" value={editingItem?.nameBn || ''} onChange={e => setEditingItem({...editingItem, nameBn: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Price (৳)</label><input required type="text" className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="e.g. 200" value={editingItem?.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Unit</label><input required className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="kg" value={editingItem?.unit || ''} onChange={e => setEditingItem({...editingItem, unit: e.target.value})} /></div>
              </div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select className="w-full p-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none cursor-pointer" value={editingItem?.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                  <option>Vegetable</option><option>Fruit</option><option>Fish</option><option>Grocery</option><option>Meat</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white mt-2">Save Product</Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
