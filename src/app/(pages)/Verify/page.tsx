import { authOptions } from "@/app/api/auth"
import VerifyEmail, { AlreadyVerifiedPage, EmailRetrievalFailedPage } from "@/Components/Verify/VerifyEmail";
import checkEmailVerificationOngoing from "@/lib/checkEmailVerificationOngoing";
import getUserEmail from "@/lib/getUserEmail";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function VerifyEmailPage(){
    const session = await getServerSession(authOptions);

    

    if(!session || !session.user || !session.user._id){
        redirect("/api/auth/signin")
    } else if(session.user.isVerified){
        console.log('User is verified');
        return (
            <>
                <AlreadyVerifiedPage/>
            </>
        )
    }

    let email = session!.user.email;

    if(!email){
        email = await getUserEmail(session?.user._id!)
        if(!email){
            return (
                <>
                    <EmailRetrievalFailedPage/>
                </>
            )
        }
    } 

    const verificationOngoing= await checkEmailVerificationOngoing(session.user._id);

    return (
        <>
            <VerifyEmail email={email} verificationOngoing={verificationOngoing}/>
        </>
    )
}