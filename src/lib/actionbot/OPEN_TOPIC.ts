import { Topic } from "@/models";
import connectDB from "../connectDB";
import axios from "axios";

export async function getTopicsWithTopicName(topicName:string){
    try {
        await connectDB();

        const topics = await Topic.aggregate([
            {
                $match:{
                    title:{ $regex: new RegExp("genai", "i") }
                }
            },{
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner"
                }
            },{
                $project:{
                    $topicId:"$_id",
                    _id:0,
                    topicName:"$title",
                    title:0,
                    "owner.username":1,
                    "owner._id":1
                }
            }
        ])

        if(!topics)return null;
        return topics;
    } catch (error) {
        console.log('Error while retriving topics');
        return null;
    }
}   

export async function findBestTopicFromFoundTopics(secondPrompt:string){
    try {
        const {data:secondResponse} = await axios.post(
            "https://api.cohere.ai/v1/generate",
            {
                model: "command",
                prompt:secondPrompt,
                max_tokens: 1000,
                temperature: 0.7,
            },
            {
                headers: {
                Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                "Content-Type": "application/json",
                },
            }
        );

        const jsonResponse2=JSON.parse(secondResponse?.generations[0].text);
        return jsonResponse2;
    } catch (error) {
        return null;
    }
}

export async function getAllTopics(){
    try {
        await connectDB();

        const topics = await Topic.aggregate([
            {
                $match:{}
            },{
                $project:{
                    topicId:"$_id",
                    title:1
                }
            }
        ])
        return topics;
    } catch (error) {
        return null;
    }
}