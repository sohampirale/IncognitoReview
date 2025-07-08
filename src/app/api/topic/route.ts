
import { noteSchema, titleSchema,objectIdSchema } from "@/schemas/schemas";
import { ApiResponse } from "@/utils/ApiResponse";
import { Topic, User } from "@/models";
import { authOptions } from "../auth";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/connectDB";
import { fetchThumbnailForTopic } from "@/utils/fetchThumbnailForTopic";
import { getSearchKeywordThumbnailPrompt } from "@/constants";
import getTitlesuggestionForThumbnailMatching from "@/utils/getTitlesuggestionForThumbnailMatching";



/**
 * 1.fetch session if not found reject - User not logged in
 * 2.run and handle validation from body
 * 3.fetch user using session.user._id if nto foud reject - User not found
 * 4.check user.isVerified if not reject - User is not verified
 * 5.If yes create the topic
 * 6.return successfull response
 */

//Create a topic

export async function POST(req:Request){
    try {
        const session =await getServerSession(authOptions)

        if(!session){
            return Response.json(
                new ApiResponse(false,"User not logged in",null,null,"UNAUTHENTICATED"),{
                    status:400
                }
            )
        }

        const {title:receivedTitle} = await req.json();
        const parsed=titleSchema.safeParse(receivedTitle)

        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid data format",null,parsed.error.format(),"INVALID_FORMAT"),{
                    status:400
                }
            )
        }

        const title = parsed.data;

        await connectDB();

        const user = await User.findById(session.user._id);

        if(!user){
            return Response.json(
                new ApiResponse(false,"User not found",null,null,"USER_NOT_FOUND"),{
                    status:404
                }
            )
        } else if(!user.isVerified){
            return Response.json(
                new ApiResponse(false,"User is not verified - cannot create topic",null,null,"UNVERIFIED"),{
                    status:400
                }
            )
        }
        console.log('about to retrive thumbnail_url');
        
        
        const titleSuggestion = await getTitlesuggestionForThumbnailMatching(title)
        console.log('titleSuggestion from cohere = '+titleSuggestion);
        
        const thumbnail_url=await fetchThumbnailForTopic(titleSuggestion);

        console.log('thumbnail url received : '+thumbnail_url);

        const topic = await Topic.create({
            owner:user._id,
            title,
            thumbnail_url:thumbnail_url || "No thumbnail url found"
        })

        if(!topic){
            return Response.json(
                new ApiResponse(false,"Failed to create the topic",null,null,"SERVER_ERROR"),{
                    status:500
                }
            )
        }

        return Response.json(
            new ApiResponse(true,"Topic created successfully",topic,null,"DONE"),{
                status:200
            }
        )
    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to create the topic",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}

//Toggle acceptingFeedbacks -here


/**
 * 1.fetch all topics from db and send in recently created order
 * 2.return successfull response
 */

//Get all topics
export async function GET(req:Request){
    try {
        await connectDB();

        const topics = await Topic.aggregate([
            {
                $match:{}
            },{
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner"
                }
            },{
                $unwind:"$owner"
            },{
                $sort:{
                    createdAt:-1
                }
            },{
                $project:{
                    topicId:"$_id",
                    title:1,
                    "owner.username":1,
                    createdAt:1,
                    updatedAt:1,
                    thumbnail_url:1
                }
            }
        ])

        return Response.json(
            new ApiResponse(true,"All topics fetched successfully",topics,null,"DONE"),{
                status:200
            }
        )
    } catch (error) {
         return Response.json(
            new ApiResponse(true,"Error while fetching all topics",null,null,"SERVER_ERROR"),{
                status:200
            }
        )
    }
}