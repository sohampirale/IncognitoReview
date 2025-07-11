import { authOptions } from "@/app/api/auth";
import getOneTopic from "@/lib/getOneTopic";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import Topic from "@/Components/Topic/Topic";

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }){
    const { topicId } = await params;  // ← This line changed

    const topic = await getOneTopic(topicId);
    console.log('topic fetched : '+JSON.stringify(topic));

    const session = await getServerSession(authOptions);
    const userId = session?.user?._id;
    const isOwner = topic?.owner._id.equals(userId);
    
    if (topic) {
        topic.topicId = topic.topicId.toString();
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {topic ? (
                    <Topic topic={topic} isOwner={isOwner} />
                ) : (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.156 0-4.145-.857-5.59-2.249C4.416 10.954 3 8.126 3 5a9.003 9.003 0 0118 0c0 3.126-1.416 5.954-3.41 7.751z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Topic Not Found</h2>
                            <p className="text-gray-400">The topic you're looking for doesn't exist or has been removed.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
// import { authOptions } from "@/app/api/auth";
// import getOneTopic from "@/lib/getOneTopic";
// import { getServerSession } from "next-auth";
// import mongoose from "mongoose";
// import Topic from "@/Components/Topic/Topic";

// export default async function TopicPage({ params }: { params: { topicId: string } }){
//     const topicId = params.topicId;

//     const topic=await getOneTopic(topicId);
//     console.log('topic fetched : '+JSON.stringify(topic));

//     const session = await getServerSession(authOptions);
//     const userId = session?.user?._id;
//     const isOwner = topic.owner._id.equals(userId);
//     topic.topicId = topic.topicId.toString();
//     return (
//         <>
//             <Topic topic={topic} isOwner={isOwner}/>
//         </>
//     )
    
// }
// //686973d4e5f3012397f8c5c0