"use client"

import axios from "axios"
import { useState } from "react"

export default function SendEmail(){
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")

    async function handleEmailVerification(){
        try {        
            const response = await axios.post("https://organic-space-fortnight-jjq959j5qp6xcj7qv-3000.app.github.dev/api/temp/emails",{
                email,
                name
            })

            console.log('response received = '+JSON.stringify(response.data));
        } catch (error) {
            console.log('ERROR while sending email,ERROR : '+JSON.stringify(error));
        }
    }

    return(
        <>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter email"/>
            <input type="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter name"/>
            <button onClick={handleEmailVerification}>Send Email Verification</button>
        </>
    )
}