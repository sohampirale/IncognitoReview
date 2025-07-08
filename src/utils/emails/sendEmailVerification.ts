import { IUser,User } from "@/models";
import randomOTPGenerator from "../randomOTPGenerator";
import resend from "@/lib/resend";
import EmailVerification from "../../../emails/EmailVerification";

async function sendEmailVerification(user:IUser){
    if(user.isVerified){
         return {
            message:"User is already verified",
            success:false,
            status:400
        }
    }

    const OTP=randomOTPGenerator();

    try {
        user.verifyCode=OTP;
        user.verifyCodeExpiry=new Date(Date.now() + 1000*60*5);
        await user.save();

        const {data,error} = await resend.emails.send({
            from:'onboarding@resend.dev',
            to:[user.email],
            subject:"Email Confirmation Mail on Incognito Feedback",
            react:EmailVerification({name:user.username,OTP})
        })

        if(error){
            console.log('ERROR :: sendEmailVerification :: '+JSON.stringify(error));
            
            return {
                message:"Failed to send email",
                success:false,
                status:500
            } 
        }

        console.log('Email sent successfully');
        return {
            message:"Verification email sent successfully",
            success:true,
            status:200
        }
    } catch (error) {
        return {
            message:"Failed to send email",
            success:false,
            status:500
        }
    }
}

export default sendEmailVerification