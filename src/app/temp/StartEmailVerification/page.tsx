"use client"
import axios from "axios"

export default function StartEmailVerification(){
    async function handleClilck(){
        try {
            console.log('inside handleClick');
            
            const {data:response}= await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/email/verify`)
            console.log('responsee : '+JSON.stringify(response));
            
        } catch (error:any) {
            console.log('ERROR : '+JSON.stringify(error.response));
            
        }
    }
    return (
        <>
        <button onClick={handleClilck}>Start Email Verification</button>
        </>
    )
}