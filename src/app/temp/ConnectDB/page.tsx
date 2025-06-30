"use client"

import connectDB from "@/app/lib/connectDB";
import { useState,useEffect } from "react";
import axios from "axios";

export default  function ConnectDB(){
    const [connected,setConnected] = useState(false)

    async function handleConnectDB(){
        try {        
            const response=await axios.get("https://organic-space-fortnight-jjq959j5qp6xcj7qv-3000.app.github.dev/api/db")
            console.log('Response received : '+JSON.stringify(response.data));
            if(response.data?.connection?.connected)
                setConnected(true)
            else 
                setConnected(false)
        } catch (error) {
            setConnected(false)
            console.log('error : '+JSON.stringify(error));
        }
    }

    return(
        <>
            <p>DB status {connected?"Connected" : "Not Connected"}</p>
            <button onClick={handleConnectDB}>Connect DB</button>
        </>
    )
}