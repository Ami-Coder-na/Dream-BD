
import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, User, ArrowRight, Tag, PenTool, X, CheckCircle, Image as ImageIcon, ArrowLeft, Share2, Clock, Printer, Facebook, Linkedin, Twitter, ExternalLink, Upload, RefreshCw, Link as LinkIcon, MessageCircle, Loader2, Bird } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl, compressImage } from '../utils/imageUtils';
import { useData } from '../../contexts/DataContext';
import { User as UserType } from '../../types';

interface Props {
  isBangla: boolean;
  user?: UserType | null;
  onLogin?: () => void;
}

export const BlogModule: React.FC<Props> = ({ isBangla, user, onLogin }) => {
  const { blogs, addRequest, refreshData, isLoading } = useData();
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copyStatus, setCopyStatus] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New Blog State
  const [newBlogData, setNewBlogData] = useState({
      title: '',
      category: 'General',
      content: '',
      image: null as string | null
  });
  
  // State for Detail View
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // Handle URL syncing for deep linking
  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id && blogs && blogs.length > 0) {
          const post = blogs.find((b: any) => b.id?.toString() === id);
          if (post) setSelectedPost(post);
        } else {
          setSelectedPost(null);
        }
      } catch (e) {
        console.warn("Could not parse URL parameters.");
      }
    };

    // Run on mount/update
    handleUrlChange();

    // Listen for back/forward navigation
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [blogs]);

  const handlePostClick = () => {
      if (!user) {
          if(onLogin) onLogin();
          return;
      }
      setShowPostModal(true);
      setPostSubmitted(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setNewBlogData(prev => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error("Blog image compression failed", err);
      }
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wordCount = newBlogData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200) + ' min read';
    const excerpt = newBlogData.content.substring(0, 100) + '...';

    const request = {
        contenttype: 'blog', 
        title: newBlogData.title,
        category: newBlogData.category,
        content: newBlogData.content,
        author: user ? user.name : 'User', 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        posteddate: new Date().toLocaleDateString(), 
        image: newBlogData.image, 
        readtime: readTime, 
        excerpt: excerpt
    };
    
    addRequest(request);
    setPostSubmitted(true);
    setNewBlogData({ title: '', category: 'General', content: '', image: null });
  };

  const handleCopyLink = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
      navigator.clipboard.writeText(url);
      setCopyStatus(id);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (e) {
      console.warn("Could not copy link.");
    }
  };

  const handleShare = (e: React.MouseEvent, platform: 'fb' | 'wa', post: any) => {
    e.stopPropagation();
    try {
      const url = encodeURIComponent(`${window.location.origin}${window.location.pathname}?id=${post.id}`);
      const text = encodeURIComponent(post.title);
      let shareUrl = '';

      if (platform === 'fb') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      } else if (platform === 'wa') {
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      }

      window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (err) {
      console.warn("Could not open share window.");
    }
  };

  const handleReadMore = (post: any) => {
    if (post.isExternal && post.link) {
      window.open(post.link, '_blank');
    } else {
      setSelectedPost(post);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Update URL without reloading
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('id', post.id);
        window.history.pushState({}, '', url.toString());
      } catch (e) {}
    }
  };

  const handleBack = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reset URL without reloading
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.toString());
    } catch (e) {}
  };

  const filteredPosts = blogs.filter((post: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (post.title?.toLowerCase() || '').includes(searchLower) ||
           (post.category?.toLowerCase() || '').includes(searchLower);
  });

  if (selectedPost) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <ArrowLeft size={18} /> {isBangla ? 'ফিরে যান' : 'Back to News'}
            </button>
            <div className="flex gap-2">
               <button 
                onClick={(e) => handleShare(e, 'fb', selectedPost)}
                className="p-2 bg-white rounded-full text-gray-500 hover:text-blue-600 transition-colors border border-gray-200 shadow-sm"
               >
                 <Facebook size={18} />
               </button>
               <button 
                onClick={(e) => handleShare(e, 'wa', selectedPost)}
                className="p-2 bg-white rounded-full text-gray-500 hover:text-green-600 transition-colors border border-gray-200 shadow-sm"
               >
                 <MessageCircle size={18} />
               </button>
               <button 
                onClick={(e) => handleCopyLink(e, selectedPost.id)}
                className={`p-2 rounded-full transition-all border shadow-sm flex items-center gap-2 px-3 ${copyStatus === selectedPost.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 hover:text-emerald-600 border-gray-200'}`}
               >
                 {copyStatus === selectedPost.id ? <CheckCircle size={18}/> : <LinkIcon size={18} />}
                 <span className="text-xs font-bold">{copyStatus === selectedPost.id ? (isBangla ? 'লিঙ্ক কপি হয়েছে' : 'Copied') : (isBangla ? 'লিঙ্ক কপি করুন' : 'Copy Link')}</span>
               </button>
            </div>
          </div>
          <article className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="relative h-64 md:h-96 w-full">
              <img src={getOptimizedImageUrl(selectedPost.image, 1200)} alt={selectedPost.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/1200x600/f3f4f6/9ca3af?text=Article+Image"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 md:left-10 text-white">
                 <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider shadow-md">{selectedPost.category}</span>
                 <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2 drop-shadow-md">{selectedPost.title}</h1>
              </div>
            </div>
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><User size={16} /></div><span className="font-semibold text-gray-700">{selectedPost.author}</span></div>
                <div className="flex items-center gap-2"><Calendar size={16} className="text-emerald-500" /><span>{selectedPost.date}</span></div>
                <div className="flex items-center gap-2"><Clock size={16} className="text-emerald-500" /><span>{selectedPost.readtime || selectedPost.readTime}</span></div>
              </div>
              <div 
                className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium" 
                dangerouslySetInnerHTML={{ __html: selectedPost.content || '' }} 
              />
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="max-w-2xl"><span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wider uppercase mb-3">{isBangla ? 'ব্লগ ও খবর' : 'Blog & News'}</span><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{isBangla ? 'ডিজিটাল দেশের ব্লগ' : 'Digital Desher Blogs'}</h2></div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative w-full sm:w-64"><Search className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={isBangla ? 'ব্লগ খুঁজুন...' : 'Search articles...'} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none bg-gray-50 focus:bg-white text-black font-medium" /></div>
             <Button onClick={handlePostClick} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center gap-2 px-6 py-3 rounded-xl"><PenTool size={18} />{isBangla ? 'ব্লগ লিখুন' : 'Write Blog'}</Button>
             <Button onClick={() => refreshData && refreshData()} variant="outline" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl"><RefreshCw size={18} />{isBangla ? 'আপডেট' : 'Refresh'}</Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-emerald-500/5 shonali-loader-pulse"></div>
             <div className="relative z-10 flex flex-col items-center">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-md border-2 border-emerald-100 shonali-loader-spin mb-4">
                  <Bird size={32} />
               </div>
               <p className="text-emerald-700 font-black tracking-widest animate-pulse uppercase">{isBangla ? 'ব্লগ লোড হচ্ছে...' : 'LOADING BLOGS...'}</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post: any) => (
                <div key={post.id} onClick={() => handleReadMore(post)} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer relative">
                  {post.isExternal && <div className="absolute top-4 right-4 z-10 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm"><ExternalLink size={14} /></div>}
                  <div className="relative h-56 overflow-hidden">
                    <img src={getOptimizedImageUrl(post.image, 600)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/f3f4f6/9ca3af?text=Article+Image"; }} />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"><Tag size={12} />{post.category}</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col"><div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium"><span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><Calendar size={14} className="text-emerald-500" />{post.date}</span><span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><User size={14} className="text-emerald-500" />{post.author}</span></div><h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">{post.title}</h3><div className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt || '' }} />
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <button className="flex items-center text-emerald-600 font-bold text-sm hover:gap-2 transition-all"> {isBangla ? 'আরও পড়ুন' : 'Read Article'}<ArrowRight size={16} className="ml-1" /></button>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleCopyLink(e, post.id)} 
                        className={`p-2 rounded-full transition-colors ${copyStatus === post.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400 hover:text-emerald-600'}`}
                        title={isBangla ? 'লিঙ্ক কপি করুন' : 'Copy Link'}
                      >
                        {copyStatus === post.id ? <CheckCircle size={16}/> : <LinkIcon size={16} />}
                      </button>
                      <button 
                        onClick={(e) => handleShare(e, 'fb', post)} 
                        className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
                        title="Share on Facebook"
                      >
                        <Facebook size={16} />
                      </button>
                    </div>
                  </div></div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"><Search size={32} className="mx-auto mb-4 text-gray-400" /><h3 className="text-lg font-bold text-gray-900 mb-1">{isBangla ? 'কোন ব্লগ পাওয়া যায়নি' : 'No articles found'}</h3></div>
            )}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="bg-emerald-600 p-6 flex justify-between items-center text-white shrink-0">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <PenTool size={24}/> {isBangla ? 'নতুন ব্লগের জন্য অনুরোধ' : 'Request New Blog Post'}
              </h2>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={24}/></button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              {postSubmitted ? (
                <div className="text-center py-10 animate-fade-in">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={64} className="animate-bounce" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">{isBangla ? 'সফল হয়েছে!' : 'Success!'}</h3>
                  <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">
                    {isBangla ? 'আপনার ব্লগটি অনুমোদনের জন্য জমা দেওয়া হয়েছে। এডমিন যাচাই করে এটি পাবলিশ করবেন।' : 'Your blog post has been submitted for approval.'}
                  </p>
                  <Button onClick={() => setShowPostModal(false)} className="w-full bg-emerald-600 font-black py-4 rounded-2xl shadow-lg">ঠিক আছে</Button>
                </div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">{isBangla ? 'শিরোনাম' : 'Title'} *</label>
                      <input required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 text-black placeholder-gray-500" value={newBlogData.title} onChange={e => setNewBlogData({...newBlogData, title: e.target.value})} placeholder={isBangla ? 'আপনার ব্লগের শিরোনাম লিখুন' : 'Enter blog title'} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">{isBangla ? 'ক্যাটাগরি' : 'Category'} *</label>
                      <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 text-black appearance-none cursor-pointer" value={newBlogData.category} onChange={e => setNewBlogData({...newBlogData, category: e.target.value})}>
                        <option className="text-black" value="Agriculture">{isBangla ? 'কৃষি' : 'Agriculture'}</option>
                        <option className="text-black" value="Health">{isBangla ? 'স্বাস্থ্য' : 'Health'}</option>
                        <option className="text-black" value="Education">{isBangla ? 'শিক্ষা' : 'Education'}</option>
                        <option className="text-black" value="Technology">{isBangla ? 'প্রযুক্তি' : 'Technology'}</option>
                        <option className="text-black" value="Crafts">{isBangla ? 'কারুশিল্প' : 'Crafts'}</option>
                        <option className="text-black" value="General">{isBangla ? 'সাধারণ' : 'General'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">{isBangla ? 'কভার ইমেজ আপলোড করুন' : 'Upload Cover Image'}</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group overflow-hidden relative"
                    >
                      {newBlogData.image ? (
                        <img src={newBlogData.image} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon className="text-gray-300 group-hover:text-emerald-500 transition-colors mb-2" size={48} />
                          <p className="text-sm font-bold text-gray-400">{isBangla ? 'ছবি এখানে ছাড়ুন বা ক্লিক করুন' : 'Click to upload image'}</p>
                        </>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">{isBangla ? 'ব্লগ কন্টেন্ট' : 'Blog Content'} *</label>
                    <textarea 
                      required 
                      rows={10} 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-medium leading-relaxed resize-none outline-none focus:ring-4 focus:ring-emerald-500/10 text-black placeholder-gray-500" 
                      value={newBlogData.content} 
                      onChange={e => setNewBlogData({...newBlogData, content: e.target.value})} 
                      placeholder={isBangla ? 'এখানে বিস্তারিত লিখুন...' : 'Write your blog post here...'}
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-gray-50">
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl text-lg flex items-center justify-center gap-3">
                       <CheckCircle size={24} /> {isBangla ? 'ব্লগটি জমা দিন' : 'Submit for Review'}
                    </Button>
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
