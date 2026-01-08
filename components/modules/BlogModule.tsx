
import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, User, ArrowRight, Tag, PenTool, X, CheckCircle, Image as ImageIcon, ArrowLeft, Share2, Clock, Printer, Facebook, Linkedin, Twitter, ExternalLink, Upload, RefreshCw, Link as LinkIcon, MessageCircle } from 'lucide-react';
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
  const { blogs, addRequest, refreshData } = useData();
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copyStatus, setCopyStatus] = useState<number | null>(null);
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

  // Safe id load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id && blogs && blogs.length > 0) {
        const post = blogs.find((b: any) => b.id?.toString() === id);
        if (post) setSelectedPost(post);
      }
    } catch (e) {
      console.warn("Could not access URL search params.");
    }
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
    setNewBlogData({ title: '', category: '', content: '', image: null });
  };

  const handleCopyLink = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/blog?id=${id}`;
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
      const url = encodeURIComponent(`${window.location.origin}/blog?id=${post.id}`);
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
              <div className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedPost.content || '' }} />
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
          <div className="max-w-2xl"><span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wider uppercase mb-3">{isBangla ? 'ব্লগ ও খবর' : 'Blog & News'}</span><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{isBangla ? 'সোনালী দেশ ব্লগ' : 'Shonali Desh Blog'}</h2></div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative w-full sm:w-64"><Search className="absolute left-4 top-3.5 text-gray-400" size={20} /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={isBangla ? 'ব্লগ খুঁজুন...' : 'Search articles...'} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none bg-gray-50 focus:bg-white" /></div>
             <Button onClick={handlePostClick} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center gap-2 px-6 py-3 rounded-xl"><PenTool size={18} />{isBangla ? 'ব্লগ লিখুন' : 'Write Blog'}</Button>
             <Button onClick={() => refreshData && refreshData()} variant="outline" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl"><RefreshCw size={18} />{isBangla ? 'আপডেট' : 'Refresh'}</Button>
          </div>
        </div>
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
      </div>
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPostModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
              <div><h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><PenTool size={20} /></div>{isBangla ? 'নতুন ব্লগ লিখুন' : 'Write New Blog'}</h2></div>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8">
              {postSubmitted ? (
                <div className="text-center py-12 flex flex-col items-center animate-fade-in-up"><div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600"><CheckCircle size={40} className="animate-bounce" /></div><h3 className="text-2xl font-bold text-gray-900 mb-3">{isBangla ? 'জমা দেওয়া সফল হয়েছে!' : 'Submission Successful!'}</h3><Button onClick={() => setShowPostModal(false)} className="bg-emerald-600 hover:bg-emerald-700 px-8">{isBangla ? 'ঠিক আছে' : 'Okay'}</Button></div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-6">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'ব্লগের শিরোনাম' : 'Blog Title'} *</label><input type="text" required value={newBlogData.title} onChange={e => setNewBlogData({...newBlogData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'ক্যাটাগরি' : 'Category'} *</label><select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium appearance-none cursor-pointer" value={newBlogData.category} onChange={e => setNewBlogData({...newBlogData, category: e.target.value})}><option value="">{isBangla ? 'নির্বাচন করুন...' : 'Select...'}</option>{categories.map((cat) => (<option key={cat.id} value={cat.id}>{isBangla ? cat.bn : cat.en}</option>))}</select></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'ছবি' : 'Image'} *</label><div className="relative w-full border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 h-[46px] flex items-center px-4" onClick={() => fileInputRef.current?.click()}><span className="text-sm text-gray-500 truncate">{newBlogData.image ? (isBangla ? 'ছবি নির্বাচিত হয়েছে' : 'Image Selected') : (isBangla ? 'ছবি আপলোড করুন' : 'Upload Image')}</span><input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} /><Upload className="absolute right-4 text-gray-400" size={18} /></div></div>
                  </div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2">{isBangla ? 'বিস্তারিত' : 'Content'} *</label><textarea required rows={6} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium resize-none" value={newBlogData.content} onChange={e => setNewBlogData({...newBlogData, content: e.target.value})}></textarea></div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold py-3 rounded-xl shadow-lg"> {isBangla ? 'জমা দিন' : 'Submit'}</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
