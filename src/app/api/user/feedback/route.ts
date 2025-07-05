import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { ApiResponse } from "@/utils/ApiResponse";
import connectDB from "@/app/lib/connectDB";
import { User,Feedback } from "@/models";
import { giveFeeedbackSchema,deleteFeedbackSchema,toggleAcceptingFeedbacksSchema } from "@/schemas/schemas";

/**
 * 1.get session if not found reject  - User not logged in
 * 2.fetch that particular user from session.user._id
 * 3. aggregation pipeline from Feddback lookup feedback.owner
 * 4.return the response
 */

//get all feedbacks of the user
export async function GET(req:Request){
    const session = await getServerSession(authOptions)

    const loggedInUser = session?.user;

    if(!session || !loggedInUser){
        return Response.json(
            new ApiResponse(false,"User not logged in"),{
                status:400
            }
        )
    }

    try {
        await connectDB();

        const user=await User.findById(loggedInUser._id)
        if(!user){
            return Response.json(
                new ApiResponse(false,'User not found'),{
                    status:404
                }
            )
        }else if(!user.isVerified){
            return Response.json(
                new ApiResponse(false,"User not verified yet",null,null,"NOT_VERIFIED"),{
                    status:400
                }
            )
        }

        const data=await Feedback.aggregate([
            {
                $match:{
                    owner:user._id
                }   
            },{
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"fetchedOwner"
                }
            },{
                $unwind:"$fetchedOwner"
            },{
                $project:{
                    feedbackId:"$_id",
                    _id:0,
                    note:1,
                    username:"$fetchedOwner.username"
                }
            }
        ])

        if(!data){
            return Response.json(
                new ApiResponse(false,"No feedbacks yet"),{
                    status:404
                }
            )
        }
        return Response.json(
            new ApiResponse(true,"All feedbacks retrived successfully",data),{
                status:200
            }
        )
    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to retrive data",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    } 
}

/**
 * 1.
 * 2.extract userId,note from body
 * 3.run validation on the id extracted from body
 * 4.validation check
 * 5.fetch the user from db if not found reject - User not found
 * 6.check if user.isVerified if no - reject - User is not verified yet
 * 7.check user.acceptingFeedbacks if false -reject - User is not currently accepting profile feedbacks
 * 8.if true create another feedback with owner : userId
 * 9.return successful response
 */

//Giving feedback to a user
export async function PUT(req:Request){
    const body = await req.json();
    const parsedBody = giveFeeedbackSchema.safeParse(body);
    if(!parsedBody.success){
        return Response.json(
            new ApiResponse(false,"Invalid Format",null,parsedBody.error.format()),{
                status:403
            }
        )
    }
    const {note,userId} = parsedBody.data;

    try {
        await connectDB()

        const user = await User.findById(userId);
        
        if(!user){
            return Response.json(
                new ApiResponse(false,"User not found",null,null,"NOT_FOUND"),{
                    status:404
                }
            )
        } else if(!user.isVerified){
            return Response.json(
                new ApiResponse(false,"User is not verified",null,null,"NOT_VERIFIED"),{
                    status:400
                }
            )
        } else if(!user.acceptingFeedbacks){
            return Response.json(
                new ApiResponse(false,"User is not accepting feedbacks",null,null,"FEEDBACKS_DISABLED"),{
                    status:400
                }
            )
        }

        const feedback = await Feedback.create({
            note,
            owner:userId
        })

        if(!feedback){
            return Response.json(
                new ApiResponse(false,"Failed to give feedback",null,null,"SERVER_ERROR"),{
                    status:500
                }
            )
        }

        return Response.json(
            new ApiResponse(true,"Annonymous feedback sent successfull",null,null,"DONE"),{
                status:200
            }
        )


    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to give feedback to user",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}

/**
 * 1.fetch session if not found reject - User not logged in
 * 2.fetch feedbackId from the body - run and handle validation
 * 3.fetch that feedback with given feedbackId
 * 4.fecth the user with session.user._id
 * 5.compare feedback.owner === user._id if not reject - Permission not allowed
 * 6.if yes delete feedback 
 * 7.return successfull response
 */

//delete any particular feedback
export async function DELETE(req:Request){    
    try {
        const session =await getServerSession(authOptions)
        if(!session){
            return Response.json(
                new ApiResponse(false,"User not logged in",null,null,"NOT_LOGGED_IN"),{
                    status:400
                }
            )
        }

        const body = await req.json();
        const parsed=deleteFeedbackSchema.safeParse(body);
        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid format",null,parsed.error.format(),"INVALID_FORMAT")
            )
        }

        const {userId,feedbackId} = parsed.data;

        const user = await User.findById(userId);
        const feedback=await Feedback.findById(feedbackId);

        if(!user){
            return Response.json(
                new ApiResponse(false,"User not found",null,null,"USER_NOT_FOUND"),{
                    status:404
                }
            )
        }else if(!feedback){
            return Response.json(
                new ApiResponse(false,"Feedback not found",null,null,"FEEDBACK_NOT_FOUND"),{
                    status:404
                }
            )
        } else if(user._id!=session.user._id || feedback.owner!=user._id){
            return Response.json(
                new ApiResponse(false,"Not authorized to perform this action",null,null,"UNAUTHORIZED"),{
                    status:400
                }
            )
        }

        await feedback.deleteOne();

        return Response.json(
            new ApiResponse(true,"Requested feedback deleted successfully",null,null,"DONE"),{
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



/**
 * 1.fetch session if session not foud reject - Login first
 * 2.fetch the acceptingFeedbacks from body
 * 3.fetch the user
 * 4.if user not found reject - user not found
 * 5.check if user.acceptingFeedbacks===acceptingFeedbacks that we received 
 * if same then reject - User already accepting or not accepting feedbakcs
 * 6.update and user.save()
 * 7.send success response
 */

//toggle acceptingFeedbacks
export async function PATCH(req:Request){
    const {acceptingFeedbacks:receivedAcceptingFeedback} = await req.json();
    const parsed=toggleAcceptingFeedbacksSchema.safeParse(receivedAcceptingFeedback);
    if(!parsed.success){
        return Response.json(
            new ApiResponse(false,"acceptingFeedback should be true or false"),{
                status:400
            }
        )
    }
    const acceptingFeedbacks=parsed.data;

    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        const id=session?.user?._id;

        if(!session || !id){
            return Response.json(
                new ApiResponse(false,"User is not logged in"),{
                    status:400
                }
            )
        }

        const user=await User.findById(id)
        if(!user){
             return Response.json(
                new ApiResponse(false,"User not found"),{
                    status:400
                }
            )
        } else if(user.acceptingFeedbacks===acceptingFeedbacks){
            let message="User is already "+(acceptingFeedbacks?"":" not ")+"accepting feedbacks";

            return Response.json(
                new ApiResponse(false,message),{
                    status:400
                }
            )
        }

        user.acceptingFeedbacks=acceptingFeedbacks;
        await user.save();
        let message="User is now "+(acceptingFeedbacks?"":" not ")+"accepting feedbacks";

        return Response.json(
            new ApiResponse(true,message),{
                status:200
            }
        )

    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to update "),{
                status:400
            }
        )
    }
}

