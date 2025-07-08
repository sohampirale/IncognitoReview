import { Topic } from "@/models";
import connectDB from "./connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth";
import { User } from "lucide-react";
import mongoose from "mongoose";

export default async function getOneTopic(topicId: string) {
    if (!topicId) return null;

    try {
        const session = await getServerSession(authOptions);

        await connectDB();
        let topic = await Topic.findById(topicId);

        if (!topic) {
            return null;
        }

        const aggregationPipeline = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(topicId)
                }
            }, {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            }, {
                $unwind: "$owner"
            }, {
                $lookup: {
                    from: "topicreports",
                    localField: "_id",
                    foreignField: "topicId",
                    as: 'report'
                }
            }, {
                $unwind: {
                    path: "$report",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]

        const userId = new mongoose.Types.ObjectId(session?.user?._id);
        const isOwner = session?.user?._id && topic.owner.equals(userId)

        if (isOwner || topic.feedbacksPublic) {
            aggregationPipeline.push({
                $lookup: {
                    from: "feedbacks",
                    localField: "_id",
                    foreignField: "topicId",
                    as: 'feedbacks'
                }
            })

        } 

        aggregationPipeline.push({
            $project: {
                topicId: "$_id",
                _id: 0,
                title: 1,
                thumbnail_url:1,
                feedbacksPublic:1,
                createdAt: 1,
                updatedAt: 1,
                "owner.username": 1,
                "owner._id": 1,
                allowingFeedbacks:1,
                ...((isOwner || topic.feedbacksPublic)?{"feedbacks.note":1,report:1}:{"report.rating":1})
            }
        })

        topic=null;
        topic= await Topic.aggregate(aggregationPipeline)

        return topic[0] || null;
    } catch (error) {
        console.log('Failed to fetch report');
        return null;
    }
}