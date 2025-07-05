
import { noteSchema, titleSchema,objectIdSchema } from "@/schemas/schemas";
import { ApiResponse } from "@/utils/ApiResponse";
import { Topic, User } from "@/models";
import { authOptions } from "../auth";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/connectDB";



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

        const topic = await Topic.create({
            owner:user._id,
            title
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