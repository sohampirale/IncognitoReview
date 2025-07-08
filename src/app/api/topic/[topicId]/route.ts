export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import { ApiResponse } from "@/utils/ApiResponse";
import { toggleTopicAllowingFeedbacksSchema,giveFeedbackInTopicSchema, objectIdSchema, getAllFeedbacksOfTopicSchema } from "@/schemas/schemas";
import { Feedback, Topic, User } from "@/models";
import connectDB from "@/lib/connectDB";
import { NextRequest } from "next/server";

/**
 * 1.Get all feedbacks of a topic
 * 2.Toggle acceptingFeedbacks of a topic PATCH
 * 3.Give feedback to a topic - POST D
 * 4.Delete a topic - DELETE D
 */

//Get all feedbacks of a topic 

/**
 * 1.Retrive feedbackId from params
 * 2.retrive userId from session if not found reject - User not logged in
 * 3.run and handle validation
 * 4.fetch user from session.user._id if not found reject - User not found
 * 5.fetch with topic with topicId 
 * 6.if topic.feedbacksPublic is true then run aggregate with $match _id:topicId on Topic and lookup on Feedback where localfield : _id foreign field : topicId
 * 7.if topic.feedbacksPublic is false then check if user._id !== topic.owner then reject - Feedbacks on this topic are private
 * 8.if user._id aggregate $match _id:topicId and owner:user._id and lookup on Feedback - localField:_id and foreignField : topicId
 * 9.return the successful response
 */

export async function GET(req:Request,  
    { params: { topicId:receivedTopicId } }: { params: { topicId: string } }
){
    try {
        // const {topicId:receivedTopicId} = params;

        const parsed = objectIdSchema.safeParse(receivedTopicId)

        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid topicId format",null,null,"INVALID_FORMAT"),{
                    status:400
                }
            )
        }

        const topicId = parsed.data;

        await connectDB();

        const topic = await Topic.findById(topicId);

        if(!topic){
            return Response.json(
                new ApiResponse(false,"Topic not found",null,null,"TOPIC_NOT_FOUND"),{
                    status:404
                }
            )
        } else if(topic.feedbacksPublic){
            const feedbacks = await Feedback.find({
                topicId
            })

            if(!feedbacks){
                return Response.json(
                    new ApiResponse(false,"No feedbacks on this topic yet",null,null,"EMPTY"),{
                        status:400
                    }
                )
            }

            return Response.json(
                new ApiResponse(true,"All feedbacks retrived successfully",null,null,"DONE"),{
                    status:200
                }
            )

        }

        const session = await getServerSession(authOptions);

        if(!session || !session.user?._id){
            return Response.json(
                new ApiResponse(false,"Feedbacks of this topic are made private",null,null,"PRIVATE"),{
                    status:400
                }
            )
        }

        const user = await User.findById(session.user._id);

        if(!user){
            return Response.json(
                new ApiResponse(false,"User not found",null,null,"USER_NOT_FOUND"),{
                    status:404
                }
            )
        } else if(!topic.owner.equals(user._id)){
            return Response.json(
                new ApiResponse(false,"Feedbacks of this topic are made private by owner",null,null,"INVALID_FORMAT"),{
                    status:400
                }
            )
        }

        const feedbacks = await Feedback.find({
            owner:topic.owner,
            topicId:topic._id
        })

        if(!feedbacks){
            return Response.json(
                new ApiResponse(false,"No feedbacks received yet",null,null,"EMPTY"),{
                    status:400
                }
            )
        }

        return Response.json(
            new ApiResponse(true,"All feedbacks retrived successfully",null,null,"DONE"),{
                status:200
            }
        )
        
    } catch (error) {
        
    }
}

//Toggle allowingFeedbacks of a topic

/**
 * 1.fetch  & handle session 
 * 2.fetch & handle topicId
 * 3.run and handle validation of topicId
 * 4.fetch topic if not found reject - TOpic not found
 * 5.check if user even exists with session.user._id if not found reject - User not found
 * 6.check topic.owner === session.user._id if not reject - Unauthorized,No permission
 * 7.check topic.acceptingFeedbacks === acceptingFeedbacks if yes reject - This topic is already accepting/not accepting feedbacks
 * 8.update and save topic
 * 9.return success response
 */

export async function PATCH(req:Request,{
    params
}:{
    params:{
        topicId:string
    }
}){
    try {

        console.log('inside api/topic/[topicId] PATCH');
        
        const pathname = new URL(req.url).pathname;
        const receivedTopicId = pathname.split('/').pop()!;
        
        
        const {allowingFeedbacks:receivedAllowingFeedbacks} = await req.json();
        console.log('allowingFeedbacks = '+receivedAllowingFeedbacks);
        const session = await getServerSession(authOptions);
        console.log('session fetched');
        
        if(!session){
            return Response.json(
                new ApiResponse(false,"User is not logged in",null,null,"NOT_LOGGED_IN"),{
                    status:400
                }
            )
        }
        console.log('test-1');

        const parsed=toggleTopicAllowingFeedbacksSchema.safeParse({
            topicId:receivedTopicId,
            allowingFeedbacks:receivedAllowingFeedbacks
        });

        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid data format",null,null,"INVALID_FORMAT"),{
                    status:400
                }
            )
        }

        const {topicId,allowingFeedbacks}=parsed.data;

        const topic = await Topic.findById(topicId);

        if(!topic){
            return Response.json(
                new ApiResponse(false,"Topic not found",null,null,"TOPIC_NOT_FOUND"),{
                    status:404
                }
            )
        }else if(!topic.owner.equals(session.user._id)){
            return Response.json(
                new ApiResponse(false,"Unauthorized",null,null,"UNAUTHORIZED"),{
                    status:400
                }
            )
        } else if(topic.allowingFeedbacks==allowingFeedbacks){
            let message="This topic is already "+(allowingFeedbacks?"":" not")+" allowing feedbacks"

            return Response.json(
                new ApiResponse(false,message,null,null,"SAME_STATE"),{
                    status:400
                }
            )
        }
        
        topic.allowingFeedbacks=allowingFeedbacks;
        await topic.save();

        let message="This topic is now "+(allowingFeedbacks?"":" not")+" allowing feedbacks"
        console.log(message);
        
        return Response.json(
            new ApiResponse(true,message,null,null,"DONE"),{
                status:200
            }
        )

    } catch (error) {
        return Response.json(
            new ApiResponse(true,"Failed to update the topic",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}

//Give feedback to a topic

/**
 * 1.retrive note and userId from req.body
 * 2.run and handle validation
 * 3.fetch user with userId
 * 4.check if user is verified if not reject - User is not verified who created this topic
 * 5.fetch the topic if not found reject - topic not found
 * 6.check if topic is allowingFeedbacks if not - reject This topic is not curently accepting Feedbacks at the moment
 * 7.if yes create the feedback with owner as topic.owner and topicId as topic._id
 * 8.return successfull response
 */

export async function POST(req:NextRequest,
    { params }:{ params:{topicId:string}}
){
    try {
        const {note:receivedNote} = await req.json();

         const pathname = new URL(req.url).pathname;

        const receivedTopicId = pathname.split('/').pop()!;

        const parsed = giveFeedbackInTopicSchema.safeParse({
            note:receivedNote,
            topicId:receivedTopicId
        })
    
        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid data format",null,null,"INVALID_FORMAT"),{
                    status:403
                }
            )
        }

        await connectDB();

        const {topicId,note} = parsed.data;

        const topic = await Topic.findById(topicId);
        console.log('topic = '+JSON.stringify(topic));
        
        if(!topic){
            return Response.json(
                new ApiResponse(false,"Topic not found",null,null,"TOPIC_NOT_FOUD"),{
                    status:404
                }
            )
        } else if(!topic.allowingFeedbacks){
            return Response.json(
                new ApiResponse(false,"This topic is not accepting feedbacks at the moment",null,null,"FEEDBACKS_DISABLED"),{
                    status:400
                }
            )
        }
        const user = await User.findById(topic.owner);

        if(!user){
            return Response.json(
                new ApiResponse(false,"Owner of the topic does not exists",null,null,"USER_NOT_FOUND"),{
                    status:404
                }
            )
        } else if(!user.isVerified){
            return Response.json(
                new ApiResponse(false,"Onwer of this topic is not verified",null,null,"UNVERIFIED"),{
                    status:400
                }
            )
        }

        const feedback = await Feedback.create({
            owner:topic.owner,
            topicId:topic._id,
            note
        })

        if(!feedback){
            return Response.json(
                new ApiResponse(false,"Failed to give feedback",null,null,"SERVER_ERROR"),{
                    status:500
                }
            )
        }

        return Response.json(
            new ApiResponse(true,"Feedback give successfully",null,null,"DONE"),{
                status:200
            }
        )

    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to give feedback",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}

//Delete a topic

/**
 * 1.fetch session if not found reject - User not logged in
 * 2.fetch topicId from params 
 * 3.run and handle validation on topicId
 * 4.fetch topic with topicId if not found reject - Topic not found
 * 5.fetch user with session.user._id if not found reject - User not found
 * 6.check if user.isVerified if not reject - User is not verified
 * 7.check if user._id === topic.owner if not reject - Unauthorized
 * 8.delete the topic
 * 9.delete all feedbacks which have topicId === topic._id
 * return success response
 */

export async function DELETE(req:Request,{params}:{params:{topicId:string}}){
    try {
        const session = await getServerSession(authOptions)
        if(!session || !session.user?._id){
            return Response.json(
                new ApiResponse(false,"User not logged in",null,null,"NOT_LOGGED_IN"),{
                    status:400
                }
            )
        }

        const {topicId:receivedTopicId} = params;

        const parsed = objectIdSchema.safeParse(receivedTopicId);

        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,"Invalid data format",null,null,"INVALID_FORMAT"),{
                    status:400
                }
            )
        }

        await connectDB();

        const topicId = parsed.data

        const user = await User.findById(session.user._id);

        if(!user){
            return Response.json(
                new ApiResponse(false,"User not found",null,null,"USER_NOT_FOUND"),{
                    status:404
                }
            )
        }else if(!user.isVerified){
            return Response.json(
                new ApiResponse(false,"User is not verified",null,null,"UNVERIFIED"),{
                    status:400
                }
            )
        }

        const topic = await Topic.findById(topicId);

        if(!topic){
            return Response.json(
                new ApiResponse(false,"Topic not found",null,null,"TOPIC_NOT_FOUND"),{
                    status:404
                }
            )
        } else if(!topic.owner.equals(user._id)){
            return Response.json(
                new ApiResponse(false,"Unauthorized - you dont own this topic",null,null,"UNAUTHORIZED"),{
                    status:400
                }
            )
        }

        const topicDeletionResponse= await topic.deleteOne();

        if(!topicDeletionResponse.acknowledged){
            return Response.json(
                new ApiResponse(false,"Failed to delete the topic",null,null,"SERVER_ERROR"),{
                    status:500
                }
            )
        }

        const feedbacksDeletionResponse = await Feedback.deleteMany({
            topicId
        })

        if(!feedbacksDeletionResponse.acknowledged){
            return Response.json(
                new ApiResponse(false,"Topic deleted successfull & Failed to delete feedbacks of that topic",null,null,"SERVER_ERROR"),{
                    status:500
                }
            )
        }

        return Response.json(
            new ApiResponse(false,"Topic deleted successfully",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
        
    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to delete the topic",null,null,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}