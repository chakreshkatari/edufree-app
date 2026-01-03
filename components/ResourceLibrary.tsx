import React, { useState } from 'react';
import { searchEducationalResources } from '../services/geminiService';
import { Resource } from '../types';
import { Search, Star, ThumbsUp, ExternalLink, Loader2, BookOpen, Video, FileText, MonitorPlay } from 'lucide-react';

export const ResourceLibrary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await searchEducationalResources(query);
      // Add fake IDs and extra vote data since API returns partial data
      const processedResults = results.map((r: any, index: number) => ({
        ...r,
        id: `res-${Date.now()}-${index}`,
        votes: Math.floor(Math.random() * 200) + 10,
        rating: r.rating || (4 + Math.random()),
        url: r.url || `https://www.google.com/search?q=${encodeURIComponent(r.title)}`
      }));
      setResources(processedResults);
    } catch (error) {
      console.error(error);
      alert("Search failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'book': return <BookOpen size={16} />;
      case 'course': return <MonitorPlay size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">Smart Resource Library</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Eliminate search fatigue. Ask our AI to curate the best free educational content for you.
        </p>
        
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mt-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to learn? (e.g. 'Linear Algebra', 'React Hooks')"
            className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <button 
            type="submit"
            disabled={isLoading || !query}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-full font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
             {[1,2,3].map(i => (
               <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
             ))}
          </div>
        )}

        {!isLoading && hasSearched && resources.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No resources found. Try a different topic.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-3">
                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                  ${resource.type === 'video' ? 'bg-red-50 text-red-600' : 
                    resource.type === 'course' ? 'bg-green-50 text-green-600' : 
                    'bg-blue-50 text-blue-600'}`}>
                  {getTypeIcon(resource.type)}
                  <span>{resource.type}</span>
                </span>
                <div className="flex items-center space-x-1 text-amber-500 font-semibold text-sm">
                  <Star size={14} fill="currentColor" />
                  <span>{resource.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {resource.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                {resource.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-slate-400 text-sm">
                   <button className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                      <ThumbsUp size={16} />
                      <span>{resource.votes}</span>
                   </button>
                </div>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-indigo-600 font-medium text-sm hover:underline"
                >
                  <span>Access</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};