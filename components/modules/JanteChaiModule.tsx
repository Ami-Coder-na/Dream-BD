
import React, { useState, useMemo } from 'react';
import { BookOpen, Calendar, Trophy, ChevronDown, ChevronUp, History, Feather, Book, Quote, Star } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Kobi {
  id: number;
  sectionBn: string;
  sectionEn: string;
  nameBn: string;
  nameEn: string;
  birthYear: number | string;
  deathYear: number | string;
  worksEn: string;
  worksBn: string;
  awardsEn: string;
  awardsBn: string;
  image: string;
}

interface Props {
  isBangla: boolean;
}

export const JanteChaiModule: React.FC<Props> = ({ isBangla }) => {
  const { poets } = useData();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const sortedPoets = useMemo(() => {
    // Basic sorting if needed, usually we keep order from Context
    return [...(poets || [])];
  }, [poets]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-4 shadow-sm">
            <BookOpen size={16} />
            {isBangla ? 'সাহিত্য ও সংস্কৃতি' : 'Literature & Culture'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            {isBangla ? 'জানতে চাই' : 'Jante Chai'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {isBangla 
              ? 'আমাদের সমৃদ্ধ সাহিত্যের ইতিহাস ও শ্রেষ্ঠ লেখকদের সম্পর্কে জানুন।' 
              : 'Learn about our rich literary history and legendary writers.'}
          </p>
        </div>

        {/* Kobi & Shahittik Section */}
        <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-indigo-700 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 relative z-10">
              <Quote size={28} />
              {isBangla ? 'কবি ও সাহিত্যিকদের ইতিহাস' : 'Poets & Writers History'}
            </h2>
            <p className="text-indigo-100 mt-2 opacity-90 relative z-10">
              {isBangla ? 'প্রাচীনকাল থেকে সমসাময়িক কাল পর্যন্ত এক সাহিত্য যাত্রা' : 'A literary journey from ancient to contemporary times'}
            </p>
          </div>

          <div className="p-6 md:p-12">
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-indigo-100 -translate-x-1/2"></div>

              <div className="space-y-12">
                {sortedPoets.map((kobi, index) => {
                  const isExpanded = expandedId === kobi.id;
                  const isEven = index % 2 === 0;
                  const isFirstInEra = index === 0 || sortedPoets[index - 1].sectionBn !== kobi.sectionBn;

                  return (
                    <React.Fragment key={kobi.id}>
                      {/* Era Header */}
                      {isFirstInEra && (
                        <div className="relative z-20 flex justify-center mb-16 mt-8">
                          <span className="bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg border-2 border-white text-center">
                            {isBangla ? kobi.sectionBn : kobi.sectionEn}
                          </span>
                        </div>
                      )}

                      <div className="relative z-10">
                        {/* Timeline Dot */}
                        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-indigo-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                          <History size={16} className="text-indigo-600" />
                        </div>

                        {/* Content Container */}
                        <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto md:text-left'}`}>
                          <div 
                            onClick={() => toggleExpand(kobi.id)}
                            className={`cursor-pointer inline-block bg-white p-4 rounded-2xl border-2 transition-all hover:shadow-md w-full md:w-auto min-w-[200px] ${isExpanded ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}
                          >
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">
                              {kobi.birthYear} — {kobi.deathYear}
                            </span>
                            <h3 className={`text-xl font-bold text-gray-900 flex items-center gap-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                              {isBangla ? kobi.nameBn : kobi.nameEn}
                              {isExpanded ? <ChevronUp size={18} className="text-indigo-400" /> : <ChevronDown size={18} className="text-indigo-400" />}
                            </h3>
                          </div>

                          {/* Detailed View */}
                          {isExpanded && (
                            <div className={`mt-6 animate-fade-in-up bg-indigo-50 border border-indigo-100 rounded-3xl p-6 md:p-8 text-left shadow-inner w-full overflow-hidden`}>
                              <div className="flex flex-col md:flex-row gap-6">
                                <div className="shrink-0 w-full md:w-32 h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white">
                                  <img src={kobi.image} alt={kobi.nameEn} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div className="border-b border-indigo-100 pb-3">
                                    <h4 className="text-2xl font-black text-indigo-900">
                                      {isBangla ? kobi.nameBn : kobi.nameEn}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mt-1 uppercase tracking-tighter">
                                      <Calendar size={14} />
                                      {kobi.birthYear} — {kobi.deathYear}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <h5 className="text-[10px] font-black text-indigo-400 uppercase mb-1 flex items-center gap-1">
                                        <Book size={12} /> {isBangla ? 'সাহিত্যকর্ম' : 'Literary Works'}
                                      </h5>
                                      <p className="text-gray-700 text-sm font-medium leading-relaxed">
                                        {isBangla ? kobi.worksBn : kobi.worksEn}
                                      </p>
                                    </div>

                                    <div>
                                      <h5 className="text-[10px] font-black text-indigo-400 uppercase mb-1 flex items-center gap-1">
                                        <Trophy size={12} /> {isBangla ? 'পুরস্কার ও সম্মাননা' : 'Awards & Honors'}
                                      </h5>
                                      <p className="text-gray-700 text-sm font-medium leading-relaxed">
                                        {isBangla ? kobi.awardsBn : kobi.awardsEn}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 border-t border-gray-100 text-center">
             <p className="text-gray-400 text-sm italic font-medium">
               {isBangla ? 'আমাদের সাহিত্যের এই বিশাল পরিক্রমায় আরও অনেক বরণীয় নাম যুক্ত হতে থাকবে।' : 'Many more distinguished names will continue to be added to this grand literary journey.'}
             </p>
          </div>
        </section>
      </div>
    </div>
  );
};
