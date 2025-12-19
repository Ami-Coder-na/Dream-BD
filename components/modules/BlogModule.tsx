
import React, { useState, useRef } from 'react';
import { Search, Calendar, User, ArrowRight, Tag, PenTool, X, CheckCircle, Image as ImageIcon, ArrowLeft, Share2, Clock, Printer, Facebook, Linkedin, Twitter, ExternalLink, Upload, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';
import { User as UserType } from '../../types';

interface Props {
  isBangla: boolean;
  user?: UserType | null;
  onLogin?: () => void;
}

export const BlogModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const { blogs, addRequest, refreshData } = useData();
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New Blog State
  const [newBlogData, setNewBlogData] = useState({
      title: '',
      category: '',
      content: '',
      image: null as string | null
  });
  
  // State for Detail View
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const handlePostClick = () => {
      if (!user) {
          if(onLogin) onLogin();
          return;
      }
      setShowPostModal(true);
      setPostSubmitted(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBlogData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate Read Time (approx 200 words per min)
    const wordCount = newBlogData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200) + ' min read';

    // Generate Excerpt (first 100 chars)
    const excerpt = newBlogData.content.substring(0, 100) + '...';

    const request = {
        contentType: 'blog',
        title: newBlogData.title,
        category: newBlogData.category,
        content: newBlogData.content,
        author: user ? user.name : 'User', 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        postedDate: new Date().toLocaleDateString(),
        image: newBlogData.image, 
        readTime: readTime,
        excerpt: excerpt
    };
    
    addRequest(request);
    setPostSubmitted(true);
    setNewBlogData({ title: '', category: '', content: '', image: null });
  };

  const handleReadMore = (post: any) => {
    if (post.isExternal && post.link) {
      window.open(post.link, '_blank');
    } else {
      setSelectedPost(post);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = blogs.filter((post: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (post.title?.toLowerCase() || '').includes(searchLower) ||
           (post.category?.toLowerCase() || '').includes(searchLower);
  });

  const categories = [
    { id: 'Agriculture', bn: 'কৃষি', en: 'Agriculture' },
    { id: 'Health', bn: 'স্বাস্থ্য', en: 'Health' },
    { id: 'Education', bn: 'শিক্ষা', en: 'Education' },
    { id: 'Crafts', bn: 'কারুশিল্প', en: 'Crafts' },
    { id: 'Transport', bn: 'পরিবহন', en: 'Transport' },
    { id: 'Technology', bn: 'প্রযুক্তি', en: 'Technology' },
  ];

  // --- RENDER DETAIL VIEW ---
  if (selectedPost) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200"
            >
              <ArrowLeft size={18} />
              {isBangla ? 'ফিরে যান' : 'Back to News'}
            </button>
            <div className="flex gap-2">
               <button className="p-2 bg-white rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-gray-200 shadow-sm" title="Share on Facebook">
                 <Facebook size={18} />
               </button>
               <button className="p-2 bg-white rounded-full text-gray-500 hover:text-sky-500 hover:bg-sky-50 transition-colors border border-gray-200 shadow-sm" title="Share on Twitter">
                 <Twitter size={18} />
               </button>
               <button className="p-2 bg-white rounded-full text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors border border-gray-200 shadow-sm" title="Share on LinkedIn">
                 <Linkedin size={18} />
               </button>
               <button className="p-2 bg-white rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors border border-gray-200 shadow-sm" title="Print Article">
                 <Printer size={18} />
               </button>
            </div>
          </div>

          {/* Article Container */}
          <article className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 w-full">
              <img 
                src={getOptimizedImageUrl(selectedPost.image, 1200)} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/1200x600/f3f4f6/9ca3af?text=Article+Image"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 md:left-10 text-white">
                 <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider shadow-md">
                   {selectedPost.category}
                 </span>
                 <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2 drop-shadow-md">
                   {selectedPost.title}
                 </h1>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-10">
              
              {/* Meta Data */}
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <User size={16} />
                  </div>
                  <span className="font-semibold text-gray-700">{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-500" />
                  <span>{selectedPost.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-emerald-500" />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>

              {/* HTML Content Render */}
              <div 
                className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedPost.content || '' }}
              />

              {/* Tags/Footer */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">{isBangla ? 'ট্যাগ সমূহ' : 'Tags'}</h4>
                <div className="flex gap-2 flex-wrap">
                  {['Digital Bangladesh', 'Smart Farming', 'Innovation', 'Rural Development'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </article>

          {/* Related Posts */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-emerald-500 pl-3">
              {isBangla ? 'আরও পড়ুন' : 'You Might Also Like'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.filter((p: any) => p.id !== selectedPost.id).slice(0, 2).map((post: any) => (
                <div 
                  key={post.id} 
                  onClick={() => handleReadMore(post)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                    <img src={getOptimizedImageUrl(post.image, 200)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1 inline-block">{post.category}</span>
                    <h4 className="font-bold text-gray-800 line-clamp-2 group-hover:text-emerald-700 transition-colors text-sm mb-1">{post.title}</h4>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- RENDER LIST VIEW ---
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
               {isBangla ? 'কৃষি, স্বাস্থ্য ও প্রযুক্তির সর্বশেষ খবর এবং টিপস জানুন (লাইভ আপডেট)।' : 'Latest insights on agriculture, health, and technology (Live Updates).'}
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
                onClick={handlePostClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap"
             >
               <PenTool size={18} />
               {isBangla ? 'ব্লগ লিখুন' : 'Write Blog'}
             </Button>
             <Button 
                onClick={() => refreshData && refreshData()}
                variant="outline"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap"
             >
               <RefreshCw size={18} />
               {isBangla ? 'আপডেট' : 'Refresh'}
             </Button>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <div 
                key={post.id} 
                onClick={() => handleReadMore(post)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer relative"
              >
                {post.isExternal && (
                  <div className="absolute top-4 right-4 z-10 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm">
                    <ExternalLink size={14} />
                  </div>
                )}
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
                  
                  <div className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt || '' }} />
                  
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
                    <input type="text" required value={newBlogData.title} onChange={e => setNewBlogData({...newBlogData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'ক্যাটাগরি' : 'Category'} *</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium appearance-none cursor-pointer" value={newBlogData.category} onChange={e => setNewBlogData({...newBlogData, category: e.target.value})}>
                        <option value="">{isBangla ? 'নির্বাচন করুন...' : 'Select...'}</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {isBangla ? cat.bn : cat.en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'ছবি' : 'Image'} *</label>
                       <div 
                         className="relative w-full border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors h-[46px] flex items-center px-4"
                         onClick={() => fileInputRef.current?.click()}
                       >
                         <span className="text-sm text-gray-500 truncate">
                           {newBlogData.image ? (isBangla ? 'ছবি নির্বাচিত হয়েছে' : 'Image Selected') : (isBangla ? 'ছবি আপলোড করুন' : 'Upload Image')}
                         </span>
                         <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                         <Upload className="absolute right-4 text-gray-400" size={18} />
                       </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'বিস্তারিত' : 'Content'} *</label>
                    <textarea required rows={6} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium resize-none" value={newBlogData.content} onChange={e => setNewBlogData({...newBlogData, content: e.target.value})}></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold py-3 rounded-xl shadow-lg shadow-emerald-200">{isBangla ? 'জমা দিন' : 'Submit'}</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
