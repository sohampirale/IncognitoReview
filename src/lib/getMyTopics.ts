// Fixed getMyTopics function
import connectDB from "./connectDB";
import { Topic } from "@/models";
import mongoose from "mongoose";

export async function getMyTopics(userId: string) {
    try {
        await connectDB();
        const owner = new mongoose.Types.ObjectId(userId);

        const topics = await Topic.aggregate([
            {
                $match: {
                    owner
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
                $project: {
                    topicId: "$_id",
                    _id: 0,
                    title: 1,
                    thumbnail_url: 1,
                    allowingFeedbacks: 1,
                    "owner.username": 1,
                    "owner._id": 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        if (!topics || topics.length === 0) return [];

        const cleanTopics = topics.map((topic) => ({
            ...topic,
            topicId: topic.topicId?.toString(),
            owner: {
                _id: topic.owner._id?.toString(),
                username: topic.owner.username
            },
            createdAt: topic.createdAt?.toISOString(),
            updatedAt: topic.updatedAt?.toISOString(),
        }));

        return cleanTopics;
    } catch (error) {
        console.error('Error while fetching all topics of a user:', error);
        return [];
    }
}