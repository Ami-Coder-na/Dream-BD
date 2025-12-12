
import React, { useState } from 'react';
import { Search, Calendar, User, ArrowRight, Tag, PenTool, X, CheckCircle, Image as ImageIcon, ArrowLeft, Share2, Clock, Printer, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

// Extended Data with Full Content
const BLOG_POSTS = [
  {
    id: 1,
    title: 'Adoption of Modern Agriculture Technology / আধুনিক কৃষি প্রযুক্তির ব্যবহার',
    excerpt: 'Detailed discussion on how farmers are increasing yields using drones and smart sensors. / ড্রোন এবং স্মার্ট সেন্সর ব্যবহার করে কীভাবে কৃষকরা ফলন বৃদ্ধি করছেন তার বিস্তারিত আলোচনা।',
    content: `
      <p class="mb-4">Agriculture in Bangladesh is undergoing a silent revolution. With the advent of the 4th Industrial Revolution, traditional farming methods are being replaced by smart, data-driven technologies. <strong>Smart Agriculture</strong> or Precision Farming is no longer a concept of the west; it is happening right here in our green delta.</p>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Use of Drones in Farming</h3>
      <p class="mb-4">Farmers in various districts are now piloting drones for pesticide spraying. This not only saves time but also ensures that chemicals are not wasted. Manual spraying often leads to health hazards for farmers, which drones effectively eliminate.</p>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Smart Sensors & IoT</h3>
      <p class="mb-4">IoT-based soil sensors are being used to measure moisture, pH levels, and nutrient content of the soil real-time. This data helps farmers decide exactly how much water or fertilizer is needed, reducing costs by up to 30%.</p>

      <div class="bg-emerald-50 border-l-4 border-emerald-500 p-4 my-6">
        <p class="font-medium text-emerald-800">"বাংলাদেশে স্মার্ট ফার্মিং প্রযুক্তির ব্যবহার আগামী ৫ বছরে ফসলের উৎপাদন ২০% বাড়িয়ে দেবে বলে আশা করা হচ্ছে।"</p>
      </div>

      <p class="mb-4">আমাদের দেশের তরুণ উদ্যোক্তারা কৃষি খাতে নতুন নতুন উদ্ভাবন নিয়ে আসছেন। ড্রিম বিডি অ্যাপের মতো প্ল্যাটফর্ম ব্যবহার করে কৃষকরা এখন ঘরে বসেই আবহাওয়ার পূর্বাভাস এবং বাজার দর জানতে পারছেন। এটি মধ্যস্বত্বভোগীদের দৌরাত্ম্য কমাতেও সাহায্য করছে।</p>
    `,
    author: 'Dr. Rahim Ahmed',
    date: 'Oct 15, 2023',
    readTime: '5 min read',
    category: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26'
  },
  {
    id: 2,
    title: 'Tips for Winter Vegetable Farming / শীতকালীন সবজি চাষের টিপস',
    excerpt: 'Correct rules for pest control and fertilizer application in winter vegetable farming. / শীতের সবজি চাষে পোকা দমন এবং সার প্রয়োগের সঠিক নিয়মাবলী।',
    content: `
      <p class="mb-4">Winter is the golden season for vegetables in Bangladesh. Cauliflower, Cabbage, Tomato, Carrot, and various leafy greens thrive during this time. However, proper care is essential to ensure a bumper harvest.</p>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Soil Preparation (জমি তৈরি)</h3>
      <p class="mb-4">For winter vegetables, the soil should be loose and friable. Adding organic compost or cow dung (গোবর সার) during the final ploughing enriches the soil nutrients. Ensure proper drainage so that water does not stagnate.</p>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Pest Control (পোকামাকড় দমন)</h3>
      <p class="mb-4">Aphids and cutworms are common threats in winter. Instead of heavy chemical usage, farmers are encouraged to use:
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li>Pheromone traps (সেক্স ফেরোমোন ফাঁদ)</li>
        <li>Neem oil spray (নিম তেলের স্প্রে)</li>
        <li>Yellow sticky traps</li>
      </ul>
      </p>

      <p class="mb-4">শীতকালীন সবজির ফলন ভালো পেতে নিয়মিত সেচ দেওয়া জরুরি। তবে খেয়াল রাখতে হবে যেন গোড়ায় পানি না জমে। বিশেষ করে টমেটো এবং আলু চাষে ফাঙ্গাস আক্রমণ রোধে আগাম সতর্কতামূলক ব্যবস্থা নিতে হবে।</p>
    `,
    author: 'Fatema Begum',
    date: 'Oct 12, 2023',
    readTime: '4 min read',
    category: 'Farming',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'
  },
  {
    id: 3,
    title: 'Potential of Cottage Industry / কুটির শিল্পের সম্ভাবনা',
    excerpt: 'Demand for our Nakshi Kantha and Jamdani is increasing day by day in the global market. / বিশ্ববাজারে আমাদের নকশী কাঁথা এবং জামদানির চাহিদা দিন দিন বাড়ছে।',
    content: `
      <p class="mb-4">Bangladesh has a rich heritage of handicrafts. The Cottage Industry (কুটির শিল্প) plays a vital role in our rural economy, especially in empowering women.</p>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Nakshi Kantha: A Global Brand</h3>
      <p class="mb-4">Once a household item, Nakshi Kantha is now a luxury product in Europe and America. The intricate designs tell stories of rural life. Digital platforms are now enabling artisans from Jessore and Jamalpur to sell directly to international buyers.</p>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Challenges & Solutions</h3>
      <p class="mb-4">The main challenge has been fair pricing and market access. Middlemen often take the lion's share of the profit. However, e-commerce platforms like <strong>Dream BD Craft</strong> are eliminating these barriers.</p>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p class="font-medium text-orange-800">"ঐতিহ্যবাহী পণ্যকে আধুনিক ডিজাইনের সাথে মিলিয়ে উপস্থাপন করতে পারলে বিশ্ববাজারে এর চাহিদা আকাশচুম্বী।"</p>
      </div>

      <p class="mb-4">জামদানি শাড়ি আমাদের গর্ব। জিআই (GI) পণ্য হিসেবে স্বীকৃতি পাওয়ার পর এর কদর আরও বেড়েছে। নতুন উদ্যোক্তাদের উচিত পণ্যের গুণগত মান বজায় রেখে ব্র্যান্ডিংয়ে নজর দেওয়া।</p>
    `,
    author: 'Kamrul Hasan',
    date: 'Oct 08, 2023',
    readTime: '6 min read',
    category: 'Trade',
    image: 'https://images.unsplash.com/photo-1605333527878-43d9a5b1064a'
  },
  {
    id: 4,
    title: 'Primary Healthcare from Home / ঘরে বসে প্রাথমিক স্বাস্থ্যসেবা',
    excerpt: 'Villagers are now easily getting expert doctor advice through telemedicine services. / টেলিমেডিসিন সেবার মাধ্যমে গ্রামের মানুষ এখন সহজেই বিশেষজ্ঞ ডাক্তারের পরামর্শ পাচ্ছেন।',
    content: `
      <p class="mb-4">Access to quality healthcare has always been a challenge in remote areas of Bangladesh. But technology is bridging this gap rapidly through Telemedicine.</p>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">The Rise of Telemedicine</h3>
      <p class="mb-4">With high-speed internet reaching unions, villagers can now consult specialists from Dhaka via video calls. This saves travel time and money. Apps like Dream BD Health allow users to:</p>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li>Book appointments instantly</li>
        <li>Get digital prescriptions</li>
        <li>Order medicines online</li>
      </ul>
      
      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Health Awareness</h3>
      <p class="mb-4">Beyond treatment, digital platforms are spreading awareness about nutrition, maternal health, and hygiene. Prevention is better than cure, and information is the key tool.</p>

      <p class="mb-4">জরুরী মুহূর্তে রক্তদাতার খোঁজ করা বা অ্যাম্বুলেন্স ডাকা এখন স্মার্টফোনের এক ক্লিকেই সম্ভব। ডিজিটাল স্বাস্থ্যসেবা আমাদের জীবনযাত্রার মান উন্নয়নে এক বৈপ্লবিক পরিবর্তন এনেছে।</p>
    `,
    author: 'Dr. Nusrat Jahan',
    date: 'Oct 05, 2023',
    readTime: '3 min read',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1576091160550-2187d80a1830'
  }
];

export const BlogModule: React.FC<Props> = ({ isBangla }) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Detail View
  const [selectedPost, setSelectedPost] = useState<typeof BLOG_POSTS[0] | null>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSubmitted(true);
  };

  const handlePostClick = (post: typeof BLOG_POSTS[0]) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
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
              {BLOG_POSTS.filter(p => p.id !== selectedPost.id).slice(0, 2).map(post => (
                <div 
                  key={post.id} 
                  onClick={() => handlePostClick(post)}
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
              <div 
                key={post.id} 
                onClick={() => handlePostClick(post)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer"
              >
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
