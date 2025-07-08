"use client"
import React, { useEffect, useState } from 'react';
import { Search, User, Clock, Grid, List } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router=useRouter();
  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        const { data: response } = await axios.get("/api/topic");
        setTopics(response?.data || []);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
        setError('Failed to load topics. Please try again.');
        setTopics([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort logic
  const filteredAndSortedTopics = topics
    .filter(topic => topic?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'updated': return new Date(b.updatedAt) - new Date(a.updatedAt);
        default: return 0;
      }
    });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  function handleVisitTopic(topicId:string){
    router.push("/Topic/"+topicId)
  }

  return (

    <div className="min-h-screen bg-gray-900">
     

      {/* Controls */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md mx-auto p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2 font-mono">LOADING_TOPICS</h3>
              <p className="text-gray-400 font-mono text-sm">// Fetching anonymous data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-red-900/20 border border-red-800 rounded-lg max-w-md mx-auto p-8">
              <div className="h-16 w-16 text-red-400 mx-auto mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2 font-mono">ERROR_LOADING</h3>
              <p className="text-red-400 font-mono text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors font-mono text-sm"
              >
                RETRY
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-white font-mono">{filteredAndSortedTopics.length}</span>
                <span className="text-gray-400 ml-2 font-mono text-sm">TOPICS</span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-transparent text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="updated">Recently Updated</option>
                </select>

                {/* View Mode */}
                <div className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

        {/* Topics Grid */}
        {viewMode === 'grid' ? (
          <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTopics.map((topic, index) => (
              <div onClick={()=>handleVisitTopic(topic.topicId)}
                key={topic.topicId}
                className="group bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img
                    src={topic.thumbnail_url}
                    alt={topic.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* ID Badge */}
                  <div className="absolute top-3 left-3 bg-black/80 text-gray-300 px-2 py-1 rounded text-xs font-mono">
                    #{topic.topicId?.toString().slice(-4) || 'N/A'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-gray-300 transition-colors">
                    {topic.title}
                  </h3>
                  
                  <div className="space-y-3 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-mono">{topic.owner?.username || 'Anonymous'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{formatTimeAgo(topic.createdAt)}</span>
                      </div>
                      <button className="text-gray-400 hover:text-white transition-colors font-mono text-xs">
                        VIEW_TOPIC →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedTopics.map((topic, index) => (
              <div onClick={()=>handleVisitTopic(topic.topicId)}
                key={topic.topicId}
                className="group bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.4s ease-out forwards'
                }}
              >
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <img
                      src={topic.thumbnail_url}
                      alt={topic.title}
                      className="w-20 h-20 object-cover rounded-lg opacity-80 group-hover:opacity-90 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white group-hover:text-gray-300 transition-colors">
                        {topic.title}
                      </h3>
                      <div className="bg-black/50 text-gray-300 px-2 py-1 rounded text-xs font-mono ml-4">
                        #{topic.topicId?.toString().slice(-4) || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-mono">{topic.owner?.username || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Created {formatDate(topic.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">•</span>
                          <span>Updated {formatTimeAgo(topic.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <button className="text-gray-400 hover:text-white transition-colors font-mono text-sm">
                        VIEW_TOPIC →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedTopics.length === 0 && topics.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md mx-auto p-8">
              <div className="h-16 w-16 text-gray-600 mx-auto mb-4 text-6xl">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2 font-mono">NO_TOPICS_AVAILABLE</h3>
              <p className="text-gray-400 font-mono text-sm">// No topics have been created yet</p>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {!loading && !error && filteredAndSortedTopics.length === 0 && topics.length > 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md mx-auto p-8">
              <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2 font-mono">NO_SEARCH_RESULTS</h3>
              <p className="text-gray-400 font-mono text-sm">// Try adjusting your search query</p>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .bg-gray-750 {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
}

// import getAllTopics from "@/utils/getAllTopics";

// export default async function Home(){
//     const topics = await getAllTopics();
//     return (
//         <>
//             <p>All Topics</p>
//             { topics && topics.map((topic)=>{

//                 return (<div key={topic.topicId}>
//                     <p>{topic.title}</p>
//                     <img src={topic.thumbnail_url}/>
//                     <p>Owner : {topic.owner.username}</p>
//                     <p>topicId : {topic.topicId.toString()}</p>
//                 </div>)
//             })
//             }        
//         </>
//     )
// }