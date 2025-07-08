import connectDB from "@/lib/connectDB";
import { ApiResponse } from "@/utils/ApiResponse";
import { Topic, TopicReport, User } from "@/models";
import { authOptions } from "@/app/api/auth";

/**
 * 1.Retrive topicId from params
 * 2.retivr session if not foud reject - User not found
 * 3.check user.isVerified if not reject - User is not verified
 * 4.fetch topic with topicId check is session.user._id===topic.owner if not reject - Unauthorized
 * 5.fetch topicReport if not foud reject - Genarte your report on this topic
 * 6.if foud return successful response
 */

import { getServerSession } from "next-auth";
import { objectIdSchema } from "@/schemas/schemas";

export async function GET(req:Request){
    try {
        const pathname = new URL(req.url).pathname;
        const receivedTopicId = pathname.split('/').pop()!;

        const session = await getServerSession(authOptions);

        if(!session || !session.user || !session.user._id){

            return Response.json(
                new ApiResponse(false,"User not logged in",null,null,"NOT_LOGGED_IN"),{
                    status:400
                }
            )
        }

        const parsed  = objectIdSchema.safeParse(receivedTopicId);

        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid data format",null,null,"INVALID_FORMAT"),{
                    status:400
                }
            )
        }

        const topicId = parsed.data;
        
        await connectDB();

        const user = await User.findById(session.user._id)
        const topic = await Topic.findById(topicId);

        if(!user){
            return Response.json(
                new ApiResponse(false,"User not found",null,null,"USER_NOT_FOUND"),{
                    status:404
                }
            )
        } else if(!topic){
            return Response.json(
                new ApiResponse(false,"Request topic not found",null,null,"TOPIC_NOT_FOUND"),{
                    status:404
                }
            )
        }else if(!topic.owner.equals(user._id)){
            return Response.json(
                new ApiResponse(false,"You dont own this topic",null,null,"UNAUTHORIZED"),{
                    status:400
                }
            )
        }else if (!user.isVerified){
            return Response.json(
                new ApiResponse(false,"User is not verified",null,null,"UNVERIFIED"),{
                    status:400
                }
            )
        }

        const topicReport = await TopicReport.findOne({
            topicId
        })

        if(!topicReport){
            return Response.json(
                new ApiResponse(false,"Create report of this topic",null,null,"EMPTY"),{
                    status:404
                }
            )
        }

        console.log('topicReport = '+JSON.stringify(topicReport));
        

        return Response.json(
            new ApiResponse(false,"Topic Report found successfully",topicReport,null,"DONE"),{
                status:200
            }
        )


    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to retrive report of this topic",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}