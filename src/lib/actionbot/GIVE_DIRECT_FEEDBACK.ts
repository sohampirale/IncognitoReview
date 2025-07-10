import {Topic,Feedback} from "../../models"
import connectDB from "../connectDB"
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose"

export async function sendFeedbackToTopic(topicId:string,note:string){
  console.log("inside sendFeedbackToTopic")

  const obj={
    message:"",
    success:false
  }

  try{
    await connectDB();

    console.log("fetching topic now")
    const topic = await Topic.findById(new mongoose.Types.ObjectId(topicId));
    console.log("topic fetched ")

    if(!topic){
      console.log("topic not found")
      return obj;
    }

    if(!topic.allowingFeedbacks){
      console.log("topic is not allowing feedbacks at the moment")
      return obj;
    }


    try{
          console.log('creating feedback now')

          const feedback = await Feedback.create({
              owner:topic.owner,
              topicId:topic._id,
              note
          })

          if(!feedback){
            obj.message="Failed to create the feedback"
             return obj;
          }

          obj.success=true;
          obj.message="Feedback given successfully"
          
          return obj
      } catch (error) {
          obj.message="Failed to give feedback"
          console.log("Error creating feedback")
          return obj;
      }


  }catch(error){
    obj.message="Failed to give feedback"
    console.log("Error finding topic")
    return obj;
  }
}