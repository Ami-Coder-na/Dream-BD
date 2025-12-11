
import React from 'react';
import { MapPin, Calendar, Camera, Heart, Info, ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const AmarBdModule: React.FC<Props> = ({ isBangla }) => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/National_Martyrs%27_Memorial_of_Bangladesh_%283%29.jpg/1280px-National_Martyrs%27_Memorial_of_Bangladesh_%283%29.jpg" 
            alt="Bangladesh National Memorial" 
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Enhanced Dark Overlay for Contrast */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider shadow-lg">
            {isBangla ? 'আমাদের মাতৃভূমি' : 'Our Motherland'}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl tracking-tight">
            {isBangla ? 'আমার বাংলাদেশ' : 'Amar Bangladesh'}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl text-gray-100 drop-shadow-md font-medium leading-relaxed">
            {isBangla 
              ? 'হাজার বছরের ইতিহাস, ঐতিহ্য এবং প্রাকৃতিক সৌন্দর্যের এক অপরূপ লীলাভূমি।' 
              : 'A land of thousands of years of history, heritage, and unparalleled natural beauty.'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-700 mb-2">1971</h3>
              <p className="text-gray-600 font-medium">{isBangla ? 'স্বাধীনতা অর্জন' : 'Independence Year'}</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-red-600 mb-2">147k</h3>
              <p className="text-gray-600 font-medium">{isBangla ? 'বর্গ কিলোমিটার' : 'Square Kilometers'}</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-700 mb-2">170M+</h3>
              <p className="text-gray-600 font-medium">{isBangla ? 'জনসংখ্যা' : 'Population'}</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-red-600 mb-2">8th</h3>
              <p className="text-gray-600 font-medium">{isBangla ? 'বিশ্বে জনসংখ্যায়' : 'Most Populous'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* History & Culture */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-red-500 pl-4">
               {isBangla ? 'ইতিহাস ও ঐতিহ্য' : 'History & Heritage'}
             </h2>
             <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
               <p>
                 {isBangla 
                   ? '১৯৫২ সালের ভাষা আন্দোলন এবং ১৯৭১ সালের মহান মুক্তিযুদ্ধের মাধ্যমে অর্জিত আমাদের এই বাংলাদেশ। রক্তস্নাত ইতিহাসের সাক্ষী এই দেশ।'
                   : 'Bangladesh was born through the Language Movement of 1952 and the Great Liberation War of 1971. A nation built on sacrifice and resilience.'}
               </p>
               <p>
                 {isBangla
                   ? 'পহেলা বৈশাখ, ঈদ, দুর্গোৎসব এবং নবান্ন উৎসবের মতো হাজারো রঙে রঙিন আমাদের সংস্কৃতি।'
                   : 'Our culture is vibrant with festivals like Pohela Boishakh, Eid, Durga Puja, and Nabanna, celebrating unity in diversity.'}
               </p>
             </div>
             <div className="mt-8 flex gap-4">
               <Button className="bg-red-600 hover:bg-red-700 border-none">
                 {isBangla ? 'মুক্তিযুদ্ধ জাদুঘর' : 'Liberation War Museum'}
               </Button>
               <Button variant="outline">
                 {isBangla ? 'আরও জানুন' : 'Learn More'}
               </Button>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Rickshaw_art_of_Bangladesh.jpg/800px-Rickshaw_art_of_Bangladesh.jpg" className="rounded-2xl shadow-lg w-full h-64 object-cover transform translate-y-8" alt="Rickshaw Art" loading="lazy" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Mangal_Shobhajatra_Pohela_Boishakh.jpg/800px-Mangal_Shobhajatra_Pohela_Boishakh.jpg" className="rounded-2xl shadow-lg w-full h-64 object-cover" alt="Culture Art" loading="lazy" />
          </div>
        </div>
      </div>

      {/* Tourism Spots */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isBangla ? 'দর্শনীয় স্থানসমূহ' : 'Tourist Attractions'}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {isBangla ? 'সুন্দরবন থেকে কক্সবাজার, বাংলার রূপ দেখে শেষ করা যায় না।' : 'From the Sundarbans to Cox\'s Bazar, the beauty of Bengal is endless.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: isBangla ? 'কক্সবাজার সমুদ্র সৈকত' : 'Cox\'s Bazar',
                desc: isBangla ? 'বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকত।' : 'The longest natural sea beach in the world.',
                img: 'https://images.unsplash.com/photo-1599423300746-b6250726f15c?auto=format&fit=crop&q=80&w=800' // Reliable Coxs Bazar
              },
              { 
                title: isBangla ? 'সুন্দরবন' : 'The Sundarbans',
                desc: isBangla ? 'বিশ্বের বৃহত্তম ম্যানগ্রোভ বন এবং রয়্যাল বেঙ্গল টাইগারের আবাসস্থল।' : 'Largest mangrove forest and home of the Royal Bengal Tiger.',
                img: 'https://images.unsplash.com/photo-1596706913897-400845353592?auto=format&fit=crop&q=80&w=800' // Reliable Forest
              },
              { 
                title: isBangla ? 'সিলেট চা বাগান' : 'Sylhet Tea Gardens',
                desc: isBangla ? 'পাহাড় এবং সবুজের এক অপূর্ব মিলনমেলা।' : 'A mesmerizing combination of hills and lush greenery.',
                img: 'https://images.unsplash.com/photo-1598501481105-d57639f75850?auto=format&fit=crop&q=80&w=800' // Reliable Tea Garden
              }
            ].map((spot, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <img src={spot.img} alt={spot.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{spot.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{spot.desc}</p>
                  <button className="text-green-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    {isBangla ? 'বিস্তারিত দেখুন' : 'View Details'} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* National Symbols Grid */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <h2 className="text-3xl font-bold text-gray-900 mb-12">
            {isBangla ? 'জাতীয় প্রতীকসমূহ' : 'National Symbols'}
         </h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/400px-Walking_tiger_female.jpg" alt="Tiger" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" loading="lazy" />
               <h4 className="font-bold text-gray-800">{isBangla ? 'রয়েল বেঙ্গল টাইগার' : 'Royal Bengal Tiger'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় পশু' : 'National Animal'}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Nymphaea_nouchali_-_National_flower_of_Bangladesh.jpg/400px-Nymphaea_nouchali_-_National_flower_of_Bangladesh.jpg" alt="Water Lily" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" loading="lazy" />
               <h4 className="font-bold text-gray-800">{isBangla ? 'শাপলা' : 'Water Lily'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় ফুল' : 'National Flower'}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Jackfruit_hanging.JPG/400px-Jackfruit_hanging.JPG" alt="Jackfruit" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" loading="lazy" />
               <h4 className="font-bold text-gray-800">{isBangla ? 'কাঁঠাল' : 'Jackfruit'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় ফল' : 'National Fruit'}</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all duration-300">
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Tenualosa_ilisha_fish.jpg/400px-Tenualosa_ilisha_fish.jpg" alt="Fish" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-green-100 shadow-sm" loading="lazy" />
               <h4 className="font-bold text-gray-800">{isBangla ? 'ইলিশ' : 'Hilsa'}</h4>
               <p className="text-xs text-gray-500 mt-1">{isBangla ? 'জাতীয় মাছ' : 'National Fish'}</p>
            </div>
         </div>
      </div>

    </div>
  );
};
