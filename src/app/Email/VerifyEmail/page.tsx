"use client"

import { useState } from "react"

export default function VerifyEmail(){
    const [OTP,setOTP] = useState("")

    async function handleVerifyEmail(){

    }

    return(
        <>
            <p>Enter the OTP sent to your email</p>
            <input type="password" value={OTP} onChange={(e)=>setOTP(e.target.value)} />
            <button onClick={handleVerifyEmail}>Verify Email</button>
        </>
    )
}