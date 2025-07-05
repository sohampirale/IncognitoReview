
/**
 * 1.retrive topicId and feedbackId from params
 * 2.retrive session if not found reject - User not logged in
 * 3.run and handle validation
 * 5.fetch topic with topicId and owner:session.user._id if not found reject
 * 4.fetch feedback with topicId and feedbackId if not found reject
 * 6.delete the feedback
 * 7.return successfull response
 */

import { authOptions } from "@/app/api/auth";
import { Topic,Feedback } from "@/models";
import { deleteFeedbackFromTopicSchema } from "@/schemas/schemas";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";

//delete a particular feedback of a topic
export async function DELETE(req:Request,{params}:{params:{
    topicId:string,
    feedbackId:string
}}){
    try {
        const {topicId:receivedTopicId,feedbackId:receivedFeedbackId} = params;
        
        const session = await getServerSession(authOptions);

        if(!session || !session.user?._id){
            return Response.json(
                new ApiResponse(false,"User not logged in",null,null,"NOT_LOGEED_IN"),{
                    status:400
                }
            )
        }

        const parsed=deleteFeedbackFromTopicSchema.safeParse({
            topicId:receivedTopicId,
            feedbackId:receivedFeedbackId
        })

        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid topicId or feedbackId",null,null,"INVALID_FORMAT"),{
                    status:400
                }
            )
        }

        const {topicId,feedbackId} = parsed.data

        const topic = await Topic.findOne({
            _id:topicId
        })

        if(!topic){
            return Response.json(
                new ApiResponse(false,"Topic not found",null,null,"TOPIC_NOT_FOUND"),{
                    status:404
                }
            )
        }else if(!topic.owner.equals(session.user._id)){
            return Response.json(
                new ApiResponse(false,"Unauthorized - you dont have permission to modify this resource",null,null,"UNAUTHORIZED"),{
                    status:400
                }
            )
        }

        const feedback= await Feedback.findOne({
            _id:feedbackId,
        })

        if(!feedback){
            return Response.json(
                new ApiResponse(false,"Feedback not found",null,null,"FEEDBACK_NOT_FOUND"),{
                    status:404
                }
            )
        }else if(!topic._id.equals(feedback.topicId)){
            return Response.json(
                new ApiResponse(false,"This feedback doesnt belong to topic specified",null,null,"MISMATCH"),{
                    status:404
                }
            )
        }

        const feedbackDeleteResponse = await feedback.deleteOne();

        if(feedbackDeleteResponse.deletedCount!==1){
            return Response.json(
                new ApiResponse(false,"Failed to delete the feedback",null,null,"SERVER_ERROR"),{
                    status:500
                }
            )
        }

        return Response.json(
            new ApiResponse(true,"Feedback deleted successfully",null,null,"DONE"),{
                status:200
            }
        )

    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to delete the feedback",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    }
    
}