import { Eye, EyeOff, User, MessageCircle, Clock, Share2, MoreVertical, Plus, Search, Filter, Grid, List } from "lucide-react";
import { useState } from "react";

export default function TopicCard({ topic, onClick, viewMode }: { topic: any; onClick: () => void; viewMode: 'grid' | 'list' }) {
  const [isHovered, setIsHovered] = useState(false);

  // Only make card clickable if we have a valid topic ID
  const isClickable = topic.topicId && topic.topicId.trim() !== '' && topic.topicId !== 'undefined' && topic.topicId !== 'null';

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group transition-all duration-300 ${
        isClickable 
          ? 'cursor-pointer transform hover:scale-105 hover:shadow-2xl' 
          : 'cursor-not-allowed opacity-75'
      } ${viewMode === 'list' ? 'hover:scale-100' : ''}`}
    >
      <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 ${
        isHovered ? 'shadow-lg shadow-purple-500/10' : ''
      } ${viewMode === 'list' ? 'flex items-center' : ''}`}>
        
        {/* Thumbnail Section */}
        <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-video'} bg-gradient-to-br from-slate-700 to-slate-800`}>
          {topic.thumbnail_url && topic.thumbnail_url.trim() !== '' ? (
            <img
              src={topic.thumbnail_url}
              alt={topic.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-slate-600" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
              topic.allowingFeedbacks
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {topic.allowingFeedbacks ? (
                <><Eye className="w-3 h-3" /><span>Active</span></>
              ) : (
                <><EyeOff className="w-3 h-3" /><span>Inactive</span></>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
              {topic.title}
            </h3>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-slate-400">
              <User className="w-4 h-4" />
              <span className="text-sm">{topic.owner?.username || 'Anonymous'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Created recently</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-slate-400">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">0 feedbacks</span>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors duration-200">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}