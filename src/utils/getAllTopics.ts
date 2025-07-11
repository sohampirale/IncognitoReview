import connectDB from "@/lib/connectDB"
import { Topic } from "@/models";

export default async function getAllTopics(){
    try {
        await connectDB();

        const topics = await Topic.aggregate([
            {
                $match: {}
            }, {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            }, {
                $unwind: "$owner"
            },{
                $sort:{
                    createdAt:-1
                }
            }, {
                $project: {
                    topicId: "$_id",
                    title: 1,
                    "owner.username": 1,
                    createdAt: 1,
                    updatedAt: 1,
                    thumbnail_url:1
                }
            }
        ])

        return topics;
    } catch (_error) {
        return null;
    }
}