import { authOptions } from "@/app/api/auth";
import { getServerSession } from "next-auth";
import { actionBotDetermineActionTypePrompt, findBestTopicFromFoundTopicsPrompt } from "@/constants";
import axios from "axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { getTopicsWithTopicName, findBestTopicFromFoundTopics, getAllTopics } from "@/lib/actionbot/OPEN_TOPIC";
import Fuse from "fuse.js"

export  async function POST(req:Request){
    console.log('inside /api/ai/chat/cohere POST');
    try {
        const {userMessage}=await req.json();
        if(!userMessage){
            return Response.json(
                new ApiResponse(false,"Message cannot be empty",null,null,"EMPTY"),{
                    status:400
                }
            )
        }

        const responseData = {
            redirectUrl:""
        }

        const session = await getServerSession(authOptions);
        const prompt = actionBotDetermineActionTypePrompt(userMessage)

        const {data:response} = await axios.post(
            "https://api.cohere.ai/v1/generate",
            {
                model: "command",
                prompt,
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

        const data = response.generations[0].text
        const jsonResponse = JSON.parse(data)
        const action =jsonResponse.action;
        if(action==='OPEN_TOPIC'){
            const topicName=jsonResponse.topic;
            const topics = await getTopicsWithTopicName(topicName);
            if(!topics || topics.length===0){
                const allTopics = await getAllTopics();

                const fuse = new Fuse(allTopics!, {
                    keys: ['title'],    
                    threshold: 0.4,     
                });

                const fuseResults = fuse.search(topicName);
                if(fuseResults.length===0){
                    return Response.json(
                    new ApiResponse(false,"No topics found with name : "+topicName,responseData,null,"EMPTY"),{
                            status:404
                        }
                    )
                }
                
            } else if(topics.length == 1){
                responseData.redirectUrl=`/Topic/${topics[0].topicId}`;
                return Response.json(
                    new ApiResponse(true,"Redirecting you to the requested topic...🦾",responseData,null,"SERVER_ERROR"),{
                        status:500
                    }
                )
            }

            const secondPrompt = findBestTopicFromFoundTopicsPrompt(userMessage,topics,session?.user?._id?.toString())

            try {
                
                const jsonResponse2=await findBestTopicFromFoundTopics(secondPrompt);

                if(!jsonResponse2 || !jsonResponse2.topicId){
                    responseData.redirectUrl=`/Topic/${topics[0].topicId}`
                    return Response.json(
                        new ApiResponse(true,"Successfull response from cohere",jsonResponse),{
                            status:200
                        }
                    )
                }
                
                responseData.redirectUrl=`/Topic/${jsonResponse2.topicId}`

                return Response.json(
                    new ApiResponse(true,"Successfull response from cohere",responseData),{
                        status:200
                    }
                )
            } catch (error) {
                responseData.redirectUrl=`/Topic/${topics[0].topicId}`
                return Response.json(
                    new ApiResponse(true,"Successfull response from cohere",jsonResponse),{
                        status:200
                    }
                )
            }

        } else {
            console.log('else part!');
        }

        console.log('successfull response from cohere = '+JSON.stringify(jsonResponse));
        return Response.json(
            new ApiResponse(true,"Successfull response from cohere",jsonResponse),{
                status:200
            }
        )
    } catch (error) {
        console.log('Error receievd while receiving response from cohere');
        return Response.json(
            new ApiResponse(false,"Failed to get response from cohere",null,error,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}