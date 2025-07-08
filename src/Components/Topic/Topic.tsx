"use client"
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Star, TrendingUp, TrendingDown, MessageCircle, Shield, Lock, Unlock, Edit3 } from "lucide-react";

export default function Topic({topic, isOwner}: {topic: any, isOwner: boolean}) {
    const [allowingFeedbacks, setAllowingFeedbacks] = useState(topic.allowingFeedbacks || false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    if (!topic) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Topic Not Found</h2>
                    <p className="text-gray-400">The topic you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    async function handleToggleAllowingFeedbacks() {
        setIsLoading(true);
        try {
            const {data: response} = await axios.patch("/api/topic/" + topic.topicId, {
                allowingFeedbacks: !allowingFeedbacks
            });
            setAllowingFeedbacks((prev: boolean) => !prev);
            console.log('response received for toggle : ' + JSON.stringify(response));
        } catch (error) {
            console.log('error toggling allowing feedbacks');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGenerateReportWithAI(topicId:string){
        try {
            const {data:response} = await axios.post("/api/ai/report/topic/cohere/"+topicId)
            console.log('Report created successfully');
        } catch (error) {
            console.log('Failed to create the report at the moment try again later');
        }
    }

    console.log('isOwner = ' + isOwner);

    const handleGiveFeedback = () => {
        router.push(`/Topic/give-feedback/${topic.topicId}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-800 border border-gray-600 shadow-lg">
                            {topic.thumbnail_url ? (
                                <img 
                                    src={topic.thumbnail_url} 
                                    alt={topic.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <MessageCircle className="w-12 h-12 text-gray-500" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Topic Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{topic.title}</h1>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-600">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-300">{topic.owner.username}</span>
                            </div>
                            
                            {isOwner && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-600/50">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm text-purple-300">Owner</span>
                                </div>
                            )}
                        </div>

                        {/* Give Feedback Button */}
                        {!isOwner && (
                            <button
                                onClick={handleGiveFeedback}
                                className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Give Feedback
                            </button>
                        )}

                        {/* Toggle for Owner */}
                        {isOwner && (
                            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2">
                                    {allowingFeedbacks ? (
                                        <Unlock className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Lock className="w-5 h-5 text-red-400" />
                                    )}
                                    <span className="text-white font-medium">Allow Feedbacks</span>
                                </div>

                                <button onClick={()=>handleGenerateReportWithAI(topic.topicId)}>Generate Report with AI</button>
                                <button
                                    onClick={handleToggleAllowingFeedbacks}
                                    disabled={isLoading}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                        allowingFeedbacks ? 'bg-green-600' : 'bg-gray-600'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span
                                        className={`${
                                            allowingFeedbacks ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </button>
                                
                                <span className={`text-sm font-medium ${allowingFeedbacks ? 'text-green-400' : 'text-red-400'}`}>
                                    {allowingFeedbacks ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Report Section */}
            {topic.report && (
                <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Analytics Report - AI Generated</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Rating */}
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm text-gray-400">Overall Rating</span>
                            </div>
                            <div className="text-2xl font-bold text-white">{topic.report.rating || 'N/A'}</div>
                        </div>
                        
                        {/* Positive Feedbacks - Only for owner */}
                        {isOwner && topic.report.nPositive !== undefined && (
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <span className="text-sm text-gray-400">Positive</span>
                                </div>
                                <div className="text-2xl font-bold text-green-400">{topic.report.nPositive}</div>
                            </div>
                        )}
                        
                        {/* Negative Feedbacks - Only for owner */}
                        {isOwner && topic.report.nNegative !== undefined && (
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown className="w-5 h-5 text-red-400" />
                                    <span className="text-sm text-gray-400">Negative</span>
                                </div>
                                <div className="text-2xl font-bold text-red-400">{topic.report.nNegative}</div>
                            </div>
                        )}
                    </div>
                    
                    {/* Improvements - Only for owner */}
                    {isOwner && topic.report.improvements && topic.report.improvements.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Suggested Improvements</h3>
                            <div className="space-y-2">
                                {topic.report.improvements.map((improvement: string, index: number) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-300 leading-relaxed">{improvement}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Feedbacks Section */}
            {(isOwner || topic.feedbacksPublic) && topic.feedbacks && topic.feedbacks.length > 0 && (
                <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-700 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Anonymous Feedbacks</h2>
                        <div className="ml-auto px-3 py-1 bg-gray-800 rounded-full border border-gray-600">
                            <span className="text-sm text-gray-400">{topic.feedbacks.length} feedback{topic.feedbacks.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {topic.feedbacks.map((feedback: any, index: number) => (
                            <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-300 leading-relaxed">{feedback.note}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Feedbacks Message */}
            {(isOwner || topic.feedbacksPublic) && (!topic.feedbacks || topic.feedbacks.length === 0) && (
                <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Feedbacks Yet</h3>
                    <p className="text-gray-400">Be the first to share your thoughts anonymously!</p>
                </div>
            )}
        </div>
    );
}


// // "use client"
// // import axios from "axios";
// // import { useState } from "react";

// // export default function Topic({topic,isOwner}:{topic:any,isOwner:boolean}){
// //     const [allowingFeedbacks,setAllowingFeedbacks] = useState(topic.allowingFeedbacks || false)
// //     if(!topic){
// //         return (
// //             <p>Topic not found</p>
// //         )
// //     }

// //     async function handleToggleAllowingFeedbacks(){
// //         try {
// //             const {data:response} = await axios.patch("/api/topic/"+topic.topicId,{
// //                 allowingFeedbacks:!allowingFeedbacks
// //             })
// //             setAllowingFeedbacks((prev:boolean)=>!prev)
// //             console.log('response received for toggle : '+JSON.stringify(response));
            
// //         } catch (error) {
// //             console.log('error toggling allowing feedbacks');
// //         }
// //     }

// //     console.log('isOnwer = '+isOwner    );
    
// //     return (
// //         <>
// //             <p>Topic title : {topic.title}</p>        
// //             <p>Owner : {topic.owner.username!}</p>
// //             <img src={topic.thumbnail_url}/> 
// //             {   isOwner ?
// //                 (
// //                     <div>   
// //                         <div>
// //                             <label>Allow/Disallow feedbacks</label>
// //                             <input type="checkbox" onClick={handleToggleAllowingFeedbacks} checked={allowingFeedbacks}/>
// //                         </div>

                        

// //                         {topic.report && <div>
// //                             Report : <div>
// //                                 <p>Rating : {topic.report.rating}</p>
// //                                 <p>No of positive feedbacks : {topic.report.nPositive}</p>
// //                                 <p>No of negative feedbacks : {topic.report.nNegative}</p>
// //                                 <div>
// //                                     Improvements : {
// //                                         topic.report.improvements.map((improvement:string)=>{
// //                                             return (
// //                                                 <p>{improvement}</p>
// //                                             )
// //                                         })
// //                                     }
// //                                 </div>
// //                             </div>
// //                         </div>}
// //                     </div>
// //                 ):
// //                 (
// //                     <div>
// //                           {topic.report && <div>
// //                             Report : <div>
// //                                 <p>Rating : {topic.report.rating}</p>
// //                             </div>
// //                         </div>}
// //                     </div>
// //                 )
// //             }
// //             {
// //                 (isOwner || topic.feedbacksPublic)  ? (<>{topic.feedbacks && <div>Feedbacks : {topic.feedbacks.map((feedback:any)=>{
// //                             return (
// //                                 <p>feedback : {feedback.note}</p>
// //                             )
// //                         })}</div>}</>):(
// //                             <span></span>
// //                         )
// //             }
// //         </>
// //     )
// // }