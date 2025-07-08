
import { NextRequest, NextResponse, userAgent } from "next/server";
import { reportCreationForTopicPrompt } from "@/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth";
import { ApiResponse } from "@/utils/ApiResponse";
import { objectIdSchema, topicReportSchema } from "@/schemas/schemas";
import { Feedback, Topic, TopicReport, User } from "@/models";
import connectDB from "@/lib/connectDB";

//create report of a topic using cohere

/**
 * 1.Retrive topicId from req.body
 * 2.fetch session if not found reject - User not logged in
 * 3.run and handle validation
 * 4.fetch topic with topicId if not ofund reject - topic not found
 * 5.fetch user if not found reject - User not found
 * 6.chekc if user.isVerified if not reject - User is not verified
 * 7.check no of user.nAITopicReports if exceeded reject 
 * 8.if topic.owner !== user._id reject - Unauthorized
 * 9.fetch all feedbacks using aggregate $match:topicId and only get the feedback texts
 * 10.concat the final prompt
 * 11.make request to cohere
 * 12.on failure reject - Failed to generate AI report
 * 13.on success fetch topicReport with topicId if not found create
 * 14.if found update details
 */

export async function POST(req: NextRequest) {

  try {

      const session = await getServerSession(authOptions);
      
      if(!session || !session.user || !session.user._id){
        return Response.json(
          new ApiResponse(false,"User not logged in",null,null,"NOT_LOGGED_IN"),{
            status:400
          }
        )
      }
      
      const receivedUserId = session.user._id;

      const parsed = objectIdSchema.safeParse(receivedUserId);
      
      if(!parsed.success){
        return Response.json(
          new ApiResponse(false,"Invalid",null,null,"NOT_LOGGED_IN"),{
            status:400
          }
        )
      }
      
      const userId = parsed.data;

      await connectDB();

      const user = await User.findById(userId);

      if(!user){
        return Response.json(
            new ApiResponse(false,"User not found",null,null,"USER_NOT_FOUND"),{
                status:404
            }
        )
      } else if(!user.isVerified){
        return Response.json(
            new ApiResponse(false,"User is not verified",null,null,"UNVERIFIED"),{
                status:400
            }
        )
      }

      let allFeedbacks=feedbacks.map(obj=>obj.note).join("\n")

    const prompt = reportCreationForTopicPrompt+allFeedbacks;

    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command", 
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const result = await response.json();

    const textResponse = result.generations?.[0]?.text;
    if(!textResponse){
      return Response.json(
        new ApiResponse(false,"Failed to generate report currently",null,null,"COHERE_ERROR"),{
          status:501
        }
      ) 
    }

    const jsonResponse = JSON.parse(textResponse)

    const parsedResponse = topicReportSchema.safeParse(jsonResponse);

    if(!parsedResponse.success){
       return Response.json(
        new ApiResponse(false,"Failed to generate report in correct format",null,null,"COHERE_ERROR"),{
          status:501
        }
      ) 
    }

    const {rating,nPositive,nNegative,improvements} = parsedResponse.data;
    
    const topicReport = await TopicReport.findOne({
      topicId
    })

    if(topicReport){
      topicReport.rating=rating;
      topicReport.nPositive=nPositive;
      topicReport.nNegative=nNegative;
      topicReport.improvements=improvements
      await topicReport.save();

      return Response.json(
        new ApiResponse(true,"Report updated successfully on this topic",null,null,"DONE"),{
          status:200
        }
      ) 
    }

    const newTopicReport= await TopicReport.create({
      topicId,
      rating,
      nPositive,
      nNegative,
      improvements
    })

    return Response.json(
      new ApiResponse(true,"Report created successfully",null,null,"DONE"),{
        status:200
      }
    ) 
  } catch (error) {
    console.error("Cohere API Error:", error);
      return Response.json(
        new ApiResponse(false,"Failed to generate report ",null,null,"SERVER_ERROR"),{
          status:500
        }
      ) 
    }
}
