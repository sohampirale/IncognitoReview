import { authOptions } from "@/app/api/auth";
import { Topic, User } from "@/models";
import { updateTopicTitleSchema } from "@/schemas/schemas";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";

/*
 * change title of topic - PATCH - D 
 */


//change title of a topic

/*
* 1.retrive topicId from params and title from body
 * 2.fetch session if not found reject - USer not logged in
 * 3.run and handle validation on topicId and title
 * 4.fetch user from session.user._id if not foud reject - user not found
 *  check user.isVerified if not reject - user is not verified cannot modify
 * 5.fetch topic with topicId
 * 6.check topic.owner === user._id if not reject - Unauthorized
 * 7.update topic.title and save the topic
 * 8.return successfull response
*/

export async function PATCH(req:Request,{params}:{params:{topicId:string}}){
    try {

        const session = await getServerSession(authOptions)

        if(!session || !session.user?._id){
            return Response.json(
                new ApiResponse(false,"User not logged in",null,null,"NOT_LOGGED_IN"),{
                    status:400
                }
            )
        }

        const {title:receivedTitle} = await req.json();
        const {topicId : receivedTopicId} = params;

        const parsed = updateTopicTitleSchema.safeParse({
            topicId:receivedTopicId,
            title:receivedTitle
        })

        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid data format",null,null,"INVALID"),{
                    status:400
                }
            )
        } 

        const {title,topicId} = parsed.data;

        const topic = await Topic.findById(topicId);

        if(!topic){
            return Response.json(
                new ApiResponse(false,"Topic not found",null,null,"TOPIC_NOT_FOUND"),{
                    status:404
                }
            )
        } 


        const owner = await User.findById(session.user._id);

        if(!owner){
            return Response.json(
                new ApiResponse(false,"Owner not found",null,null,"OWNER_NOT_FOUND"),{
                    status:404
                }
            )
        }else if(!owner._id.equals(topic.owner)){
            return Response.json(
                new ApiResponse(false,"Unauthorized - you dont own this topic",null,null,"UNAUTHORIZED"),{
                    status:404
                }
            )
        } else if(!owner.isVerified){
             return Response.json(
                new ApiResponse(false,"Owner of this topic is not verified",null,null,"UNVERIFIED"),{
                    status:400
                }
            )
        } 

        topic.title=title;
        await topic.save();
        
        return Response.json(
            new ApiResponse(true,"Title updated successfully",topic,null,"DONE"),{
                status:200
            }
        )
        
    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to update title",null,null,"SERVER_ERROR"),{
                status:500
            }
        )        
    }
}