import { objectIdSchema } from "@/schemas/schemas";
import { ApiResponse } from "@/utils/ApiResponse";
import { User,Topic } from "@/models";

/**
 * 1.retrive the userId from params
 * 2.run validation on userId 
 * 3.fetch all topics with that userId who also have allowingFeedbacks : true
 * 4.return the fetched topics
 */

//get all topics create by a user
/* userId  */
export async function GET(req:Request,{params}:{params:{userId:string}}){
     const pathname = new URL(req.url).pathname;

    const receivedUserId = pathname.split('/').pop()!;
    
    const parsed=objectIdSchema.safeParse(receivedUserId);
    if(!parsed.success){
        return Response.json(
            new ApiResponse(false,"Invalid UserId",null,null,"INVALID_FORMAT"),{
                status:400
            }
        )
    }

    const userId = parsed.data;

    try {
        if(!await User.exists({
            _id:userId
        })){
            return Response.json(
                new ApiResponse(false,"User does not exists",null,null,"USER_NOT_FOUND"),{
                    status:404
                }
            )
        }

        const topics=await Topic.aggregate([
            {
                $match:{
                    owner:userId,
                    allowingFeedbacks:true
                }
            },{
                $project:{
                    title:1,
                    topicId:"$_id",
                    _id:0,
                    createdAt:1,
                    updatedAt:1
                }
            }
        ])

        if(!topics){
            return Response.json(
                new ApiResponse(false,"User has no open topics currently",null,null,"EMPTY"),{
                    status:404
                }
            )
        }

        return Response.json(
            new ApiResponse(true,"All topics retrived successfully",topics,null,"DONE"),{
                status:200
            }
        )
    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to retrive all topics",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}