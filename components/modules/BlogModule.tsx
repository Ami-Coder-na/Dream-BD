import React from 'react';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Button } from '../ui/Button';

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
      image: 'https://picsum.photos/400/250?random=10'
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
      image: 'https://picsum.photos/400/250?random=11'
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
      image: 'https://picsum.photos/400/250?random=12'
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
      image: 'https://picsum.photos/400/250?random=13'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isBangla ? 'ড্রিম বিডি ব্লগ' : 'Dream BD Blog'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isBangla ? 'কৃষি, স্বাস্থ্য ও প্রযুক্তির সর্বশেষ খবর' : 'Latest news on agri, health & tech'}
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={isBangla ? 'ব্লগ খুঁজুন...' : 'Search articles...'}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Tag size={10} />
                {post.category}
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {post.author}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                {post.excerpt}
              </p>
              
              <Button variant="outline" size="sm" className="w-full group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 mt-auto">
                {isBangla ? 'আরও পড়ুন' : 'Read More'}
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination / Load More */}
      <div className="text-center pt-4">
        <Button variant="secondary">
          {isBangla ? 'আরও দেখুন' : 'Load More Articles'}
        </Button>
      </div>
    </div>
  );
};