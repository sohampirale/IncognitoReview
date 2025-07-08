"use client"
import axios from "axios";
import { useState } from "react";

export default function CohereFeedback(){
    const [prompt,setPrompt] = useState("");
    async function handleSend(){
        try {
            console.log('Req sent');
            
            const {data:response} = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/ai/feedback/cohere`,{
                prompt
            })
            console.log('Response received : '+JSON.stringify(response));
        } catch (error) {
            console.log('ERROR : '+JSON.stringify(error));
        }
    }
    return (
        <>
            <input type="text" value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </>
    )
}