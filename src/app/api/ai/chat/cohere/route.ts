import { authOptions } from "@/app/api/auth";
import { getServerSession } from "next-auth";
import { actionBotDetermineActionTypePrompt, findBestTopicFromFoundTopicsPrompt } from "@/constants";
import axios from "axios";
import { ApiResponse } from "@/utils/ApiResponse";
import { getTopicsWithTopicName, findBestTopicFromFoundTopics, getAllTopics } from "@/lib/actionbot/OPEN_TOPIC";
import Fuse from "fuse.js"
import {sendFeedbackToTopic} from "../../../../../lib/actionbot/GIVE_DIRECT_FEEDBACK"

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
        console.log("making firs tapi cal to cohere")

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
            console.log("inside OPEN_TOPIC")
            const topicName=jsonResponse.topic;
            const topics = await getTopicsWithTopicName(topicName);
            if(!topics || topics.length===0){
                console.log("length 0")
                const allTopics = await getAllTopics();

                const fuse = new Fuse(allTopics!, {
                    keys: ['title'],    
                    threshold: 0.4,     
                });
                
                const fuseResults = fuse.search(topicName);
                console.log('fuseResults = '+JSON.stringify(fuseResults))

                if(fuseResults.length===0){
                    return Response.json(
                    new ApiResponse(false,"No topics found with name : "+topicName,responseData,null,"EMPTY"),{
                            status:404
                        }
                    )
                }

                responseData.redirectUrl=`/Topic/${fuseResults[0].item.topicId}`;

                return Response.json(
                    new ApiResponse(true,"Relevent topic found successfully : "+topicName,responseData,null,"DONE"),{
                        status:200
                    }
                )
                
            } else if(topics.length == 1){
                console.log("length 1")
                responseData.redirectUrl=`/Topic/${topics[0].topicId}`;
                return Response.json(
                    new ApiResponse(true,"Redirecting you to the requested topic...🦾",responseData,null,"DONE"),{
                        status:200
                    }
                )
            }

            console.log("length >1")


            const secondPrompt = findBestTopicFromFoundTopicsPrompt(session?.user?._id?.toString(),userMessage,topics);

            const jsonResponse2=await findBestTopicFromFoundTopics(secondPrompt);

            if(!jsonResponse2 || !jsonResponse2.topicId){
                responseData.redirectUrl=`/Topic/${topics[0].topicId}`
                return Response.json(
                    new ApiResponse(true,"Successfull response from cohere",jsonResponse),{
                        status:200
                    }
                )
            }

            console.log("second ai call succeeded : "+JSON.stringify(jsonResponse2));
            responseData.redirectUrl=`/Topic/${jsonResponse2.topicId}`

            return Response.json(
                new ApiResponse(true,"Successfull response from cohere",responseData),{
                    status:200
                }
            )
           

        } else if(action==='START_GIVE_FEEDBACK'){
            try{
                console.log("inside START_GIVE_FEEDBACK")
                const topicName=jsonResponse.topic;
                const topics = await getTopicsWithTopicName(topicName);

                //
                if(!topics || topics.length===0){
                    console.log("length 0")
                    const allTopics = await getAllTopics();

                    const fuse = new Fuse(allTopics!, {
                        keys: ['title'],    
                        threshold: 0.4,     
                    });
                    
                    const fuseResults = fuse.search(topicName);
                    console.log('fuseResults = '+JSON.stringify(fuseResults))

                    if(fuseResults.length===0){
                        return Response.json(
                            new ApiResponse(false,"No topics found with name : "+topicName,responseData,null,"EMPTY"),{
                                    status:404
                            }
                        )
                    }

                    responseData.redirectUrl=`/Topic/give-feedback/${fuseResults[0].item.topicId}`;

                    return Response.json(
                        new ApiResponse(true,"Relevent topic found successfully : "+topicName,responseData,null,"DONE"),{
                            status:200
                        }
                    )
                    
            } else if(topics.length == 1){
                console.log("length 1")
                responseData.redirectUrl=`/Topic/give-feedback/${topics[0].topicId}`;
                return Response.json(
                    new ApiResponse(true,"Redirecting you to the requested topic...🦾",responseData,null,"DONE"),{
                        status:200
                    }
                )
            }

                console.log("length >1")


                const secondPrompt = findBestTopicFromFoundTopicsPrompt(session?.user?._id?.toString(),userMessage,topics);

                    
                const jsonResponse2=await findBestTopicFromFoundTopics(secondPrompt);

                if(!jsonResponse2 || !jsonResponse2.topicId){
                    responseData.redirectUrl=`/Topic/give-feedback/${topics[0].topicId}`
                    return Response.json(
                        new ApiResponse(true,"Selecting the first topic found for feedback",jsonResponse),{
                            status:200
                        }
                    )
                }

                console.log("second ai call succeeded : "+JSON.stringify(jsonResponse2));
                responseData.redirectUrl=`/Topic/give-feedback/${jsonResponse2.topicId}`

                return Response.json(
                    new ApiResponse(true,"Selecting the most appropriate topic for feedback",responseData),{
                        status:200
                    }
                )
            
            }catch(error){
                return Response.json(
                    new ApiResponse(false,"Failed to serve you currently - from Action Bot",jsonResponse),{
                        status:500
                    }
                )
            }
        } else if(action==='GIVE_DIRECT_FEEDBACK'){
            
            console.log("inside GIVE_DIRECT_FEEDBACK")

            try{
                const topicName=jsonResponse.topic;
                const feedback=jsonResponse.feedback;

                const topics = await getTopicsWithTopicName(topicName);
                console.log("all topics retrived    ")
                //
                if(!topics || topics.length===0){
                    console.log("length 0")
                    const allTopics = await getAllTopics();

                    const fuse = new Fuse(allTopics!, {
                        keys: ['title'],    
                        threshold: 0.4,     
                    });
                    
                    const fuseResults = fuse.search(topicName);
                    console.log('fuseResults = '+JSON.stringify(fuseResults))

                    if(fuseResults.length===0){
                        return Response.json(
                            new ApiResponse(false,"No topics found with name : "+topicName,responseData,null,"EMPTY"),{
                                    status:404
                            }
                        )
                    }

                    const obj = await sendFeedbackToTopic(fuseResults[0].item.topicId,feedback);

                    if(!obj.success){
                        return Response.json(
                            new ApiResponse(false,"Failed to give feedback at the moment",responseData,null,"SERVER_ERROR"),{
                                status:500
                            }
                        )
                    }

                    return Response.json(
                        new ApiResponse(true,obj.message,responseData,null,"DONE"),{
                            status:200
                        }
                    )
                    
            } else if(topics.length == 1){
                console.log('topics.length === 1')
                const obj = await sendFeedbackToTopic(topics[0].topicId,feedback);

                if(!obj.success){
                    return Response.json(
                        new ApiResponse(false,"Failed to give feedback at the moment",responseData,null,"SERVER_ERROR"),{
                            status:500
                        }
                    )
                }

                return Response.json(
                    new ApiResponse(true,obj.message,responseData,null,"DONE"),{
                        status:200
                    }
                )
            }

                console.log("length >1")


                const secondPrompt = findBestTopicFromFoundTopicsPrompt(session?.user?._id?.toString(),userMessage,topics);

                    
                const jsonResponse2=await findBestTopicFromFoundTopics(secondPrompt);

                if(!jsonResponse2 || !jsonResponse2.topicId){
                    const obj = await sendFeedbackToTopic(topics[0].topicId,feedback);
                    if(!obj.success){
                        return Response.json(
                            new ApiResponse(false,"Failed to give feedback at the moment",responseData,null,"SERVER_ERROR"),{
                                status:500
                            }
                        )
                    }
                    return Response.json(
                        new ApiResponse(true,"Feedback given successfully",jsonResponse),{
                            status:200
                        }
                    )
                }

                console.log("second ai call succeeded : "+JSON.stringify(jsonResponse2));

                const obj = await sendFeedbackToTopic(jsonResponse2.topicId,feedback);

                if(!obj.success){
                    return Response.json(
                        new ApiResponse(false,"Failed to give feedback at the moment",responseData,null,"SERVER_ERROR"),{
                            status:500
                        }
                    )
                }

                return Response.json(
                    new ApiResponse(true,obj.message,responseData),{
                        status:200
                    }
                )
            
            }catch(error){
                return Response.json(
                    new ApiResponse(false,"Failed to serve you currently - from Action Bot",jsonResponse),{
                        status:500
                    }
                )
            }
        }
        else {
            console.log('else part!');
        }

        console.log('successfull response from cohere = '+JSON.stringify(jsonResponse));
        
        return Response.json(
            new ApiResponse(true,"NO action matcher found sending success response ",jsonResponse),{
                status:200
            }
        )
    } catch (error) {
        console.log('Error receievd while receiving response from cohere : '+error);
        return Response.json(
            new ApiResponse(false,"Failed to get response from cohere",null,error,"SERVER_ERROR"),{
                status:500
            }
        )
    }
}