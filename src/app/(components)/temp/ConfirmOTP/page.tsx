"use client"

import axios from "axios";
import { useState } from "react";

export default function ConfirmOTP(){
    const [OTP,setOTP]=useState("")
    const [notification,setNotification]=useState("")

    async function handleClick(){
        try {
            const {data:response} = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/email/verify`,{
                OTP
            })

            console.log('response : '+JSON.stringify(response));
            setNotification(response.message)
        } catch (error) {
            if(axios.isAxiosError(error)){
                console.log('ERROR : '+JSON.stringify(error.response?.data));
                
                setNotification(error.response?.data.message)
            }
        }
    }

    return (
        <>
            <p><input type="text" placeholder="Enter OTP" value={OTP} onChange={(e)=>setOTP(e.target.value)}/></p>
            <p><button onClick={handleClick}>Confirm OTP</button></p>
            <p>{notification}</p>
        </>
    )
}