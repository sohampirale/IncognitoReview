'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  MessageCircle,
  Clock,
  Share2,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import TopicCard from "./TopicCard";
import axios from "axios";

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}

// Define proper TypeScript interfaces
interface Topic {
  topicId: string;
  title: string;
  allowingFeedbacks: boolean;
  createdAt?: string;
  feedbackCount?: number;
  [key: string]: any;
}

interface Notification {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}

interface MyTopicsProps {
  topics: Topic[];
}

export default function MyTopics({ topics = [] }: MyTopicsProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [topicsList, setTopicsList] = useState<Topic[]>(topics);

  // Initialize notification state
  const [notification, setNotification] = useState<Notification>({
    show: false,
    type: 'success',
    message: ''
  });

  // Update topics list when props change
  useEffect(() => {
    setTopicsList(topics);
  }, [topics]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: 'success', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
  };

  function handleVisitTopic(topicId: string) {
    if (topicId && topicId.trim() !== '' && topicId !== 'undefined' && topicId !== 'null') {
      router.push(`/Topic/${topicId}`);
    } else {
      console.error('Invalid topic ID:', topicId);
      showNotification('error', 'Invalid topic ID');
    }
  }

  async function handleCreateNewTopic() {
    if (!title.trim()) {
      showNotification('error', 'Title is required');
      return;
    }

    setIsCreating(true);
    try {
      const { data: response } = await axios.post("/api/topic", { title: title.trim() });
      console.log('Topic created successfully:', response);
      
      // Add new topic to the list if response contains the topic data
      if (response.topic) {
        setTopicsList(prev => [response.topic, ...prev]);
      }
      
      setTitle('');
      setIsModalOpen(false);
      showNotification('success', 'Topic created successfully!');
      
      router.refresh()
    } catch (error) {
      console.error('Failed to create the topic:', error);
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'Failed to create topic. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setIsCreating(false);
    }
  }

  // Handle Enter key in modal
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating && title.trim()) {
      handleCreateNewTopic();
    }
  };

  const filteredTopics = topicsList.filter((topic: Topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && topic.allowingFeedbacks) ||
      (filterActive === 'inactive' && !topic.allowingFeedbacks);
    return matchesSearch && matchesFilter;
  });

  return (

    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Topics</h1>
              <p className="text-slate-400">Manage your anonymous feedback topics</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Topic</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-3">
              {/* Filter Buttons */}
              <div className="flex bg-slate-700/50 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All', icon: MessageCircle },
                  { key: 'active', label: 'Active', icon: Eye },
                  { key: 'inactive', label: 'Inactive', icon: EyeOff }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilterActive(key as 'all' | 'active' | 'inactive')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      filterActive === key
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Grid/List */}
      <div className="max-w-7xl mx-auto">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No topics found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first topic to get started'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Create Topic
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {filteredTopics.map((topic: Topic, index: number) => (
              <TopicCard
                key={topic.topicId || `topic-${index}`}
                topic={topic}
                onClick={() => topic.topicId && handleVisitTopic(topic.topicId)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border transition-all duration-300 transform ${
          notification.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification({ show: false, type: 'success', message: '' })}
            className="ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* New Topic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-white">Create New Topic</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTitle('');
                }}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="topicTitle" className="block text-sm font-medium text-slate-300 mb-2">
                  Topic Name
                </label>
                <input
                  id="topicTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter topic name..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  autoFocus
                  maxLength={100}
                />
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setTitle('');
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewTopic}
                  disabled={!title.trim() || isCreating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                >
                  {isCreating ? 'Creating...' : 'Create Topic'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

// "use client"

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Eye, EyeOff, User, MessageCircle, Clock, Share2, MoreVertical, Plus, Search, Filter, Grid, List, X, CheckCircle, AlertCircle } from "lucide-react";
// import TopicCard from "./TopicCard";
// import axios from "axios";

// export default function MyTopics({ topics }: { topics: any }) {
//   const router = useRouter();
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [title, setTitle] = useState('');
//   const [isCreating, setIsCreating] = useState(false);

//   // Auto-hide notification after 5 seconds
//   useEffect(() => {
//     if (notification.show) {
//       const timer = setTimeout(() => {
//         setNotification({ show: false, type: 'success', message: '' });
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification.show]);

//   const showNotification = (type: 'success' | 'error', message: string) => {
//     setNotification({ show: true, type, message });
//   };

//   function handleVisitTopic(topicId: string) {
//     // Ensure we only navigate with valid topic IDs
//     if (topicId && topicId.trim() !== '' && topicId !== 'undefined' && topicId !== 'null') {
//       router.push("/Topic/" + topicId);
//     } else {
//       console.error('Invalid topic ID:', topicId);
//     }
//   }

//   async function handleCreateNewTopic(){
//     if (!title.trim()) {
//       console.error('Title is required');
//       return;
//     }

//     setIsCreating(true);
//     try {
//       const {data:response} = await axios.post("/api/topic",{
//         title:title
//       })

//       console.log('Topic created successfully');
//       setTitle('');
//       setIsModalOpen(false);
//       // You might want to refresh the topics or add the new topic to the state
//       // router.refresh() or update the topics state
      
//     } catch (error) {
//       console.log('Failed to create the topic');
//     } finally {
//       setIsCreating(false);
//     }
//   }

//   // Filter topics based on search and filter criteria
//   const filteredTopics = topics.filter((topic: any) => {
//     const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterActive === 'all' || 
//       (filterActive === 'active' && topic.allowingFeedbacks) ||
//       (filterActive === 'inactive' && !topic.allowingFeedbacks);
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
//       {/* Header Section */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//               <EyeOff className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-white">My Topics</h1>
//               <p className="text-slate-400">Manage your anonymous feedback topics</p>
//             </div>
//           </div>
//           <button 
//             onClick={() => setIsModalOpen(true)}
//             className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
//           >
//             <Plus className="w-5 h-5" />
//             <span>New Topic</span>
//           </button>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search topics..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
//               />
//             </div>
            
//             <div className="flex items-center space-x-3">
//               {/* Filter Buttons */}
//               <div className="flex bg-slate-700/50 rounded-lg p-1">
//                 {[
//                   { key: 'all', label: 'All', icon: MessageCircle },
//                   { key: 'active', label: 'Active', icon: Eye },
//                   { key: 'inactive', label: 'Inactive', icon: EyeOff }
//                 ].map(({ key, label, icon: Icon }) => (
//                   <button
//                     key={key}
//                     onClick={() => setFilterActive(key as any)}
//                     className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
//                       filterActive === key
//                         ? 'bg-purple-500 text-white shadow-lg'
//                         : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
//                     }`}
//                   >
//                     <Icon className="w-4 h-4" />
//                     <span>{label}</span>
//                   </button>
//                 ))}
//               </div>

//               {/* View Mode Toggle */}
//               <div className="flex bg-slate-700/50 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-md transition-all duration-200 ${
//                     viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
//                   }`}
//                 >
//                   <Grid className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-md transition-all duration-200 ${
//                     viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
//                   }`}
//                 >
//                   <List className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Topics Grid/List */}
//       <div className="max-w-7xl mx-auto">
//         {filteredTopics.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
//               <MessageCircle className="w-12 h-12 text-slate-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-400 mb-2">No topics found</h3>
//             <p className="text-slate-500 mb-6">
//               {searchTerm ? 'Try adjusting your search terms' : 'Create your first topic to get started'}
//             </p>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
//             >
//               Create Topic
//             </button>
//           </div>
//         ) : (
//           <div className={`grid gap-6 ${
//             viewMode === 'grid' 
//               ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
//               : 'grid-cols-1'
//           }`}>
//             {filteredTopics.map((topic: any, index: number) => (
//               <TopicCard
//                 key={topic.topicId || `topic-${index}`}
//                 topic={topic}
//                 onClick={() => topic.topicId && handleVisitTopic(topic.topicId)}
//                 viewMode={viewMode}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Toast Notification */}
//       {notification.show && (
//         <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border transition-all duration-300 transform ${
//           notification.type === 'success' 
//             ? 'bg-green-500/10 border-green-500/20 text-green-400' 
//             : 'bg-red-500/10 border-red-500/20 text-red-400'
//         }`}>
//           {notification.type === 'success' ? (
//             <CheckCircle className="w-5 h-5 flex-shrink-0" />
//           ) : (
//             <AlertCircle className="w-5 h-5 flex-shrink-0" />
//           )}
//           <span className="font-medium">{notification.message}</span>
//           <button
//             onClick={() => setNotification({ show: false, type: 'success', message: '' })}
//             className="ml-2 text-slate-400 hover:text-white transition-colors"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* New Topic Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-md shadow-2xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
//               <h2 className="text-xl font-semibold text-white">Create New Topic</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-white transition-colors p-1"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6">
//               <div className="mb-6">
//                 <label htmlFor="topicTitle" className="block text-sm font-medium text-slate-300 mb-2">
//                   Topic Name
//                 </label>
//                 <input
//                   id="topicTitle"
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter topic name..."
//                   className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
//                   autoFocus
//                 />
//               </div>

//               {/* Modal Actions */}
//               <div className="flex space-x-3">
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCreateNewTopic}
//                   disabled={!title.trim() || isCreating}
//                   className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
//                 >
//                   {isCreating ? 'Creating...' : 'Create Topic'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client"

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Eye, EyeOff, User, MessageCircle, Clock, Share2, MoreVertical, Plus, Search, Filter, Grid, List } from "lucide-react";
// import TopicCard from "./TopicCard";

// export default function MyTopics({ topics }: { topics: any }) {
//   const router = useRouter();
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

//   function handleVisitTopic(topicId: string) {
//     // Ensure we only navigate with valid topic IDs
//     if (topicId && topicId.trim() !== '' && topicId !== 'undefined' && topicId !== 'null') {
//       router.push("/Topic/" + topicId);
//     } else {
//       console.error('Invalid topic ID:', topicId);
//     }
//   }

//   async function handleCreateNewTopic(){
//     try {
//       //make a new useState named title for it claude
//       //and dont make fake api call with setTimeout 
//       const {data:response} = await axios.post("/api/topic",{
//         title:title
//       })

//       console.log('TOpic created successfully');
      

//     } catch (error) {
//       console.log('Failed to create the topic');
       
//     }
//   }

//   // Filter topics based on search and filter criteria
//   const filteredTopics = topics.filter((topic: any) => {
//     const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterActive === 'all' || 
//       (filterActive === 'active' && topic.allowingFeedbacks) ||
//       (filterActive === 'inactive' && !topic.allowingFeedbacks);
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
//       {/* Header Section */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//               <EyeOff className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-white">My Topics</h1>
//               <p className="text-slate-400">Manage your anonymous feedback topics</p>
//             </div>
//           </div>
//           <button  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2">
//             <Plus className="w-5 h-5" />
//             <span>New Topic</span>
//           </button>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search topics..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
//               />
//             </div>
            
//             <div className="flex items-center space-x-3">
//               {/* Filter Buttons */}
//               <div className="flex bg-slate-700/50 rounded-lg p-1">
//                 {[
//                   { key: 'all', label: 'All', icon: MessageCircle },
//                   { key: 'active', label: 'Active', icon: Eye },
//                   { key: 'inactive', label: 'Inactive', icon: EyeOff }
//                 ].map(({ key, label, icon: Icon }) => (
//                   <button
//                     key={key}
//                     onClick={() => setFilterActive(key as any)}
//                     className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
//                       filterActive === key
//                         ? 'bg-purple-500 text-white shadow-lg'
//                         : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
//                     }`}
//                   >
//                     <Icon className="w-4 h-4" />
//                     <span>{label}</span>
//                   </button>
//                 ))}
//               </div>

//               {/* View Mode Toggle */}
//               <div className="flex bg-slate-700/50 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-md transition-all duration-200 ${
//                     viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
//                   }`}
//                 >
//                   <Grid className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-md transition-all duration-200 ${
//                     viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
//                   }`}
//                 >
//                   <List className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Topics Grid/List */}
//       <div className="max-w-7xl mx-auto">
//         {filteredTopics.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
//               <MessageCircle className="w-12 h-12 text-slate-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-400 mb-2">No topics found</h3>
//             <p className="text-slate-500 mb-6">
//               {searchTerm ? 'Try adjusting your search terms' : 'Create your first topic to get started'}
//             </p>
//             <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25">
//               Create Topic
//             </button>
//           </div>
//         ) : (
//           <div className={`grid gap-6 ${
//             viewMode === 'grid' 
//               ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
//               : 'grid-cols-1'
//           }`}>
//             {filteredTopics.map((topic: any, index: number) => (
//               <TopicCard
//                 key={topic.topicId || `topic-${index}`}
//                 topic={topic}
//                 onClick={() => topic.topicId && handleVisitTopic(topic.topicId)}
//                 viewMode={viewMode}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client"
// import { useRouter } from "next/navigation";

// export default function MyTopics({topics}:{topics:any}){

//     const router = useRouter();

//     function handleVisitTopic(topicId:string){
//         router.push("/Topic/"+topicId)
//     }
//     console.log('topics = '+JSON.stringify(topics));
    

//     return (
//         <>
//             {topics.map((topic:any)=>(
//                 <>
//                     <div onClick={()=>handleVisitTopic(topic.topicId)}>
//                         <p>Title : {topic.title}</p>
//                         <p><img src={topic.thumbnail_url}/></p>
//                         <p>Allowing Feedbacks : <input type="checkbox" checked={topic.allowingFeedbacks}/></p>
//                         <p>Owner : {topic.owner.username}</p>
//                     </div>
//                 </>
//             ))}
//         </>
//     )
// }