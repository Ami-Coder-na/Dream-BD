
import React from 'react';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Button } from '../ui/Button';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface Props {
  isBangla: boolean;
}

export const BlogModule: React.FC<Props> = ({ isBangla }) => {
  const posts = [
    {
      id: 1,
      title: isBangla ? 'আধুনিক কৃষি প্রযুক্তির ব্যবহার' : 'Adoption of Modern Agriculture Technology',
      excerpt: isBangla 
        ? 'ড্রোন এবং স্মার্ট সেন্সর ব্যবহার করে কীভাবে কৃষকরা ফলন বৃদ্ধি করছেন তার বিস্তারিত আলোচনা।' 
        : 'Detailed discussion on how farmers are increasing yields using drones and smart sensors.',
      author: 'Dr. Rahim Ahmed',
      date: 'Oct 15, 2023',
      category: isBangla ? 'কৃষি' : 'Agriculture',
      image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26' // Tractor/Field
    },
    {
      id: 2,
      title: isBangla ? 'শীতকালীন সবজি চাষের টিপস' : 'Tips for Winter Vegetable Farming',
      excerpt: isBangla 
        ? 'শীতের সবজি চাষে পোকা দমন এবং সার প্রয়োগের সঠিক নিয়মাবলী।' 
        : 'Correct rules for pest control and fertilizer application in winter vegetable farming.',
      author: 'Fatema Begum',
      date: 'Oct 12, 2023',
      category: isBangla ? 'ফার্মিং' : 'Farming',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37' // Vegetables
    },
    {
      id: 3,
      title: isBangla ? 'বাংলাদেশের কুটির শিল্পের সম্ভাবনা' : 'Potential of Cottage Industry in Bangladesh',
      excerpt: isBangla 
        ? 'বিশ্ববাজারে আমাদের নকশী কাঁথা এবং জামদানির চাহিদা দিন দিন বাড়ছে।' 
        : 'Demand for our Nakshi Kantha and Jamdani is increasing day by day in the global market.',
      author: 'Kamrul Hasan',
      date: 'Oct 08, 2023',
      category: isBangla ? 'বাণিজ্য' : 'Trade',
      image: 'https://images.unsplash.com/photo-1605333527878-43d9a5b1064a' // Sewing/Craft
    },
    {
      id: 4,
      title: isBangla ? 'ঘরে বসে প্রাথমিক স্বাস্থ্যসেবা' : 'Primary Healthcare from Home',
      excerpt: isBangla 
        ? 'টেলিমেডিসিন সেবার মাধ্যমে গ্রামের মানুষ এখন সহজেই বিশেষজ্ঞ ডাক্তারের পরামর্শ পাচ্ছেন।' 
        : 'Villagers are now easily getting expert doctor advice through telemedicine services.',
      author: 'Dr. Nusrat Jahan',
      date: 'Oct 05, 2023',
      category: isBangla ? 'স্বাস্থ্য' : 'Health',
      image: 'https://images.unsplash.com/photo-1576091160550-2187d80a1830' // Doctor
    }
  ];

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header & Search */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
           <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wider uppercase mb-2">
             {isBangla ? 'ব্লগ ও খবর' : 'Blog & News'}
           </span>
           <h2 className="text-4xl font-bold text-gray-900">
            {isBangla ? 'ড্রিম বিডি ব্লগ' : 'Dream BD Blog'}
           </h2>
           <p className="text-gray-500 text-lg">
             {isBangla ? 'কৃষি, স্বাস্থ্য ও প্রযুক্তির সর্বশেষ খবর এবং টিপস জানুন' : 'Latest insights on agriculture, health, and technology'}
           </p>
           
           <div className="relative max-w-md mx-auto mt-6">
             <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
             <input 
               type="text" 
               placeholder={isBangla ? 'ব্লগ খুঁজুন...' : 'Search articles...'}
               className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none shadow-sm"
             />
           </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={getOptimizedImageUrl(post.image, 600)} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300/f3f4f6/9ca3af?text=Article+Image"; }}
                />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Tag size={12} />
                  {post.category}
                </span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {post.author}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <button className="flex items-center text-emerald-600 font-bold text-sm hover:gap-2 transition-all group/btn mt-auto">
                  {isBangla ? 'আরও পড়ুন' : 'Read Article'}
                  <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination / Load More */}
        <div className="text-center pt-8">
          <Button variant="outline" size="lg" className="px-8">
            {isBangla ? 'আরও দেখুন' : 'Load More Articles'}
          </Button>
        </div>
      </div>
    </div>
  );
};
