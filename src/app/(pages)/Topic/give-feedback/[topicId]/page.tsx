import GiveFeedback from "@/Components/Topic/GiveFeedback";
import getOneTopic from "@/lib/getOneTopic";

export default async function GiveFeedbackToTopic({ params }: { params: { topicId: string } }){
    const topicId = params.topicId;
    const topic = await getOneTopic(topicId);

    if(!topic){
        return (
            <>
                Topic not found
            </>
        )
    }

    return (
        <>
        <GiveFeedback topicId={topic.topicId.toString()}
         allowingFeedbacks={topic.allowingFeedbacks} 
         title={topic.title} 
        thumbnail_url={topic.thumbnail_url}/>
        </>
    )
}