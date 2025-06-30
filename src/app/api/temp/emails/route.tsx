import { NextApiRequest, NextApiResponse } from "next";
import EmailVerification from "../../../../../emails/EmailVerification";
import { resend } from "@/app/lib/resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    console.log('inside a[i/temp/emails POST');
    
    const body = await req.json();
    console.log('body = '+JSON.stringify(body));

    const {data,error} = await resend.emails.send({
        from:'Acme <onboarding@resend.dev>',
        to:[body.email],
        subject:"Testing the email from resend",
        react:EmailVerification({name:body.name})
    })

    console.log('data = '+JSON.stringify(data));
    console.log('error = '+JSON.stringify(error));
    

    if(error){
        console.log('Error in sending the email');
        return NextResponse.json({
            message:'Failed to send the email'
        })
    } else {
        return NextResponse.json({
            message:"Email sent successfully"
        })
    }
}