
import React, { useState } from 'react';
import { Search, Calendar, User, ArrowRight, Tag, PenTool, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

// Static Data Moved Outside
const BLOG_POSTS = [
  {
    id: 1,
    title: 'Adoption of Modern Agriculture Technology / আধুনিক কৃষি প্রযুক্তির ব্যবহার',
    excerpt: 'Detailed discussion on how farmers are increasing yields using drones and smart sensors. / ড্রোন এবং স্মার্ট সেন্সর ব্যবহার করে কীভাবে কৃষকরা ফলন বৃদ্ধি করছেন তার বিস্তারিত আলোচনা।',
    author: 'Dr. Rahim Ahmed',
    date: 'Oct 15, 2023',
    category: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26'
  },
  {
    id: 2,
    title: 'Tips for Winter Vegetable Farming / শীতকালীন সবজি চাষের টিপস',
    excerpt: 'Correct rules for pest control and fertilizer application in winter vegetable farming. / শীতের সবজি চাষে পোকা দমন এবং সার প্রয়োগের সঠিক নিয়মাবলী।',
    author: 'Fatema Begum',
    date: 'Oct 12, 2023',
    category: 'Farming',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'
  },
  {
    id: 3,
    title: 'Potential of Cottage Industry / কুটির শিল্পের সম্ভাবনা',
    excerpt: 'Demand for our Nakshi Kantha and Jamdani is increasing day by day in the global market. / বিশ্ববাজারে আমাদের নকশী কাঁথা এবং জামদানির চাহিদা দিন দিন বাড়ছে।',
    author: 'Kamrul Hasan',
    date: 'Oct 08, 2023',
    category: 'Trade',
    image: 'https://images.unsplash.com/photo-1605333527878-43d9a5b1064a'
  },
  {
    id: 4,
    title: 'Primary Healthcare from Home / ঘরে বসে প্রাথমিক স্বাস্থ্যসেবা',
    excerpt: 'Villagers are now easily getting expert doctor advice through telemedicine services. / টেলিমেডিসিন সেবার মাধ্যমে গ্রামের মানুষ এখন সহজেই বিশেষজ্ঞ ডাক্তারের পরামর্শ পাচ্ছেন।',
    author: 'Dr. Nusrat Jahan',
    date: 'Oct 05, 2023',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1576091160550-2187d80a1830'
  }
];

export const BlogModule: React.FC<Props> = ({ isBangla }) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSubmitted(true);
  };

  const filteredPosts = BLOG_POSTS.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'Agriculture', bn: 'কৃষি', en: 'Agriculture' },
    { id: 'Health', bn: 'স্বাস্থ্য', en: 'Health' },
    { id: 'Education', bn: 'শিক্ষা', en: 'Education' },
    { id: 'Crafts', bn: 'কারুশিল্প', en: 'Crafts' },
    { id: 'Transport', bn: 'পরিবহন', en: 'Transport' },
    { id: 'Fishery', bn: 'মৎস্য চাষ', en: 'Fishery' },
    { id: 'Waste Management', bn: 'বর্জ্য ব্যবস্থাপনা', en: 'Waste Management' },
    { id: 'Disaster Management', bn: 'দুর্যোগ ব্যবস্থাপনা', en: 'Disaster Management' },
    { id: 'Jobs', bn: 'চাকরি ও ক্যারিয়ার', en: 'Jobs & Careers' },
    { id: 'Bazar Sodai', bn: 'বাজার সদাই', en: 'Bazar Sodai' },
    { id: 'Technology', bn: 'প্রযুক্তি', en: 'Technology' },
    { id: 'Lifestyle', bn: 'জীবনধারা', en: 'Lifestyle' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="max-w-2xl">
             <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wider uppercase mb-3">
               {isBangla ? 'ব্লগ ও খবর' : 'Blog & News'}
             </span>
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {isBangla ? 'ড্রিম বিডি ব্লগ' : 'Dream BD Blog'}
             </h2>
             <p className="text-gray-500 text-lg">
               {isBangla ? 'কৃষি, স্বাস্থ্য ও প্রযুক্তির সর্বশেষ খবর এবং টিপস জানুন।' : 'Latest insights on agriculture, health, and technology.'}
             </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative w-full sm:w-64">
               <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={isBangla ? 'ব্লগ খুঁজুন...' : 'Search articles...'}
                 className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-gray-50 focus:bg-white"
               />
             </div>
             <Button 
                onClick={() => { setShowPostModal(true); setPostSubmitted(false); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap"
             >
               <PenTool size={18} />
               {isBangla ? 'ব্লগ লিখুন' : 'Write Blog'}
             </Button>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={getOptimizedImageUrl(post.image, 600)} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/f3f4f6/9ca3af?text=Article+Image"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Tag size={12} />
                    {post.category}
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                      <Calendar size={14} className="text-emerald-500" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                      <User size={14} className="text-emerald-500" />
                      {post.author}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <button className="flex items-center text-emerald-600 font-bold text-sm hover:gap-2 transition-all group/btn">
                      {isBangla ? 'আরও পড়ুন' : 'Read Article'}
                      <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{isBangla ? 'কোন ব্লগ পাওয়া যায়নি' : 'No articles found'}</h3>
              <p className="text-gray-500 text-sm">{isBangla ? 'অনুগ্রহ করে অন্য কিওয়ার্ড দিয়ে চেষ্টা করুন।' : 'Please try searching with different keywords.'}</p>
            </div>
          )}
        </div>
      </div>
       {/* Write Blog Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <PenTool size={20} />
                  </div>
                  {isBangla ? 'নতুন ব্লগ লিখুন' : 'Write New Blog'}
                </h2>
                <p className="text-sm text-gray-500 mt-1 ml-11">
                  {isBangla ? 'আপনার জ্ঞান ও অভিজ্ঞতা সবার সাথে শেয়ার করুন' : 'Share your knowledge and experience with everyone'}
                </p>
              </div>
              <button 
                onClick={() => setShowPostModal(false)} 
                className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {postSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-lg shadow-green-100">
                    <CheckCircle size={40} className="animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {isBangla ? 'জমা দেওয়া সফল হয়েছে!' : 'Submission Successful!'}
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                    {isBangla 
                      ? 'আপনার লেখাটি রিভিউয়ের জন্য পাঠানো হয়েছে।' 
                      : 'Your article has been submitted for review.'}
                  </p>
                  <Button onClick={() => setShowPostModal(false)} className="bg-emerald-600 hover:bg-emerald-700 px-8">
                    {isBangla ? 'ঠিক আছে' : 'Okay'}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'ব্লগের শিরোনাম' : 'Blog Title'} *</label>
                    <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'ক্যাটাগরি' : 'Category'} *</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <option value="">{isBangla ? 'নির্বাচন করুন...' : 'Select...'}</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {isBangla ? cat.bn : cat.en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'ছবি' : 'Image'}</label>
                       <input type="file" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'বিস্তারিত' : 'Content'} *</label>
                    <textarea required rows={6} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">{isBangla ? 'জমা দিন' : 'Submit'}</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
