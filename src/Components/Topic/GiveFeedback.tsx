"use client";
import { useState, useEffect } from "react";
import { Send, Lock, EyeOff, MessageCircle, AlertCircle, CheckCircle, X, User, Shield, Clock, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function GiveFeedback({
  topicId,
  title,
  allowingFeedbacks,
  thumbnail_url
}: {
  topicId: string;
  title: string;
  allowingFeedbacks: boolean;
  thumbnail_url: string;
}) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [charCount, setCharCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const maxChars = 500;
    const router = useRouter();
  useEffect(() => {
    setCharCount(note.length);
  }, [note]);

  // Error state - Topic ID not provided
  if (!topicId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Topic Not Found</h2>
            <p className="text-slate-400 mb-6">
              We couldn't find the topic you're looking for. The link might be invalid or the topic may have been removed.
            </p>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200" onClick={()=>router.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state - Feedback not allowed
  if (!allowingFeedbacks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <EyeOff className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Feedback Closed</h2>
            <p className="text-slate-400 mb-6">
              This topic is currently not accepting new feedback. The creator may have paused feedback collection temporarily.
            </p>
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white font-medium mb-2">"{title}"</h3>
              <p className="text-slate-400 text-sm">Topic by anonymous creator</p>
            </div>
            <button onClick={()=>router.push("/Topic/"+topicId)} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 mx-auto">
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmitFeedback() {
    if (!note.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {

      const { data: response } = await axios.post("/api/topic/" + topicId, {
        note
      });
      
      setSubmitStatus('success');
      setNote("");
      setShowConfirmation(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
      
    } catch (error) {
      setSubmitStatus('error');
      console.log('Error submitting feedback');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success confirmation overlay
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Feedback Sent!</h2>
            <p className="text-slate-400 mb-6">
              Your anonymous feedback has been delivered successfully. Thank you for sharing your thoughts!
            </p>
            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Your identity remains completely anonymous</span>
              </div>
            </div>
            <button 
              onClick={() => {setShowConfirmation(false); }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Send Another Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Anonymous Feedback</h1>
              <p className="text-slate-400">Share your thoughts anonymously</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors duration-200">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Topic Information */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Topic Details</h2>
              
              {/* Topic Thumbnail */}
              {thumbnail_url && thumbnail_url.trim() !== '' ? (
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={thumbnail_url}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4">
                  <MessageCircle className="w-12 h-12 text-slate-600" />
                </div>
              )}

              {/* Topic Title */}
              <h3 className="text-lg font-medium text-white mb-4 leading-relaxed">
                {title}
              </h3>

              {/* Privacy Notice */}
              <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-green-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">100% Anonymous</span>
                </div>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Your identity is completely protected</li>
                  <li>• No personal information is collected</li>
                  <li>• Feedback cannot be traced back to you</li>
                </ul>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Feedback Tips</h3>
              <div className="space-y-3 text-slate-400 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be specific and constructive in your feedback</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Focus on behaviors or situations, not personalities</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Suggest improvements when pointing out issues</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Your Feedback</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or feedback here..."
                    maxLength={maxChars}
                    className="w-full h-40 bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    disabled={isSubmitting}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <span className={`text-xs ${
                      charCount > maxChars * 0.8 ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {charCount}/{maxChars}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!note.trim() || isSubmitting}
                  className={`w-full py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    !note.trim() || isSubmitting
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending Feedback...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Anonymous Feedback</span>
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'error' && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-400 text-sm">Failed to send feedback. Please try again.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center space-x-2 text-slate-400 mb-3">
                <Lock className="w-5 h-5" />
                <span className="font-medium">Privacy & Security</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your feedback is encrypted and stored securely. We never track IP addresses or browser fingerprints. 
                The topic creator will only see your message content, nothing else.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client"
// import axios from "axios"
// import { useState } from "react"

// export default function GiveFeedback({topicId,title,allowingFeedbacks,thumbnail_url}:{
//     topicId:string,
//     title:string,
//     allowingFeedbacks:boolean,
//     thumbnail_url:string
// }){
//     if(!topicId){
//         return (
//             <>
//                 <p>Topic Id not provided</p>
//             </>
//         )
//     } else if(!allowingFeedbacks){
//         return (
//             <>
//                 This topic is currently not allowing feedbacks
//             </>
//         )
//     }

//     const [note,setNote] = useState("")

//     async function handleSubmitFeedback(){
//         try {
//             const {data:response } = await axios.post("/api/topic/"+topicId,{
//                 note
//             })

//             console.log('Feedback submitted successfully');
//         } catch (error) {
//             console.log('Error submitting feedback');
            
//         }
//     }

//     return (
//         <>
//             <p className="mt-50">Title : {title}</p>
//             <input type="text" placeholder="Enter feedback"  value={note} onChange={(e)=>setNote(e.target.value)}/>
//             <button onClick={handleSubmitFeedback}>Submit Incognito Feedback</button>
//         </>
//     )
// }