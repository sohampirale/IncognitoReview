import connectDB from "@/app/lib/connectDB";
import { User } from "@/models";
import { OTPSchema } from "@/schemas/schemas";
import { ApiResponse } from "@/utils/ApiResponse";
import sendEmailVerification from "@/utils/emails/sendEmailVerification";
import { getToken } from "next-auth/jwt";
import { NextRequest,NextResponse } from "next/server";

/** Starting the email verification process
 * 1.fetch user from token using useToken
 * 2.fetch the user from DB
 * 3.check if user is alreadyVerified 
 * 4.If yes reject - User is already verified
 * 5.if no check if 
 * 6.if user has started the verification process that is verifyCodeExpiry !==null
 * 7.if !=null and user.verifyCodeExpiry < Date.now() resent email - Email resent successfully
 * 8. if !=null and user.verifyCodeExpiry > Date.now() resent email verification after
 *       user.verifyCodeExpiry - Date.now() minutes
 * 9.if ===null send the verificationEmail
 * 
 */
export async function GET(req: NextRequest) {
    await connectDB()
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    })

    if (!token) {
        return Response.json(
            new ApiResponse(false, "User not logged in")
        ), {
            status: 400
        }
    } else if (token.isVerified) {
        return Response.json(
            new ApiResponse(false, "User is already verified")
        ), {
            status: 400
        }
    }

    await connectDB()

    const user = await User.findById({
        _id: token._id
    })
    console.log('test1');

    if (!user) {
        console.log('test2');

        return Response.json(
            new ApiResponse(false, "User does not exists in the DB"), {
            status: 404
        }
        )
    } else if (!user.verifyCodeExpiry) {
        console.log('user.verifyCodeExpiry = '+user.verifyCodeExpiry);
        
        console.log('test3');

        const response = await sendEmailVerification(user);
        console.log('response of sending Email : ' + JSON.stringify(response));

        if (!response.success) {
            console.log("Reject");
            return Response.json(
                new ApiResponse(false, response.message), {
                status: response.status || 500
            }
            )
        }
        console.log("accept");

        return Response.json(
            new ApiResponse(true, response.message), {
            status: response.status || 200
        }
        )
    } else if (user.verifyCodeExpiry > Date.now()) {
        console.log('test4');

        const remainnignTimeMins =Math.floor((user.verifyCodeExpiry.getTime() - Date.now()) / (1000 * 60));
        return Response.json(
            new ApiResponse(false, `Wait for ${remainnignTimeMins} minutes before trying again`), {
            status: 400
        }

        )
    } else {
        console.log('test5');

        const response = await sendEmailVerification(user)
        return Response.json(
            new ApiResponse(true, "Email for verification send again successfully"), {
            status: response.status || 200
        }
        )
    }
}

/** Verifying the OTP
 * 1.fetch the OTP from body
 * 2.Run validation on it
 * 3.fetch the userId from token using useToken then fetch user from DB
 * 4.check if user is verified 
 * 5.if yes then reject - use rlaready evrified
 * 6.if no then check verifyCodeExprify > Date.now()
 * 7.If no then reject - OTP request timed out
 * 8.If yes compare verifyCode
 * 9.if no reject invalid code
 */

export async function PUT(req:NextRequest) {
    try {
        const token = await getToken({req,secret:process.env.NEXTAUTH_SECRET});

        if(!token){
            return NextResponse.redirect("/api/auth/signin", {
                status: 302 
            });
        }

        const {OTP:fetchedOTP} = await req.json();

        const parsed=OTPSchema.safeParse(fetchedOTP)

        if(!parsed.success){
            return Response.json(
                new ApiResponse(false,'Invalid OTP format',null,parsed.error.format())
            )
        }

        await connectDB();
        const OTP=parsed.data;

        const user = await User.findById(token._id);

        if(!user){
            return Response.json(
                new ApiResponse(false,"User does not exist"),{
                    status:404
                }
            )
        } else if(user.isVerified){
            return Response.json(
                new ApiResponse(false,"User is already verified"),{
                    status:400
                }
            )
        }

        const verifyCodeExpiry=user.verifyCodeExpiry;
        if(!verifyCodeExpiry || !user.verifyCode ){
            return Response.json(
                new ApiResponse(false,"You haven't requested for OTP yet"),{
                    status:400
                }
            )
        } else if(verifyCodeExpiry<Date.now()){
            return Response.json(
                new ApiResponse(false,"OTP request timed out"),{
                    status:400
                }
            )
        } else if(user.verifyCode!==OTP) {
            return Response.json(
                new ApiResponse(false,"Incorrect OTP"),{
                    status:400
                }
            )
        } 
        user.isVerified=true;
        user.verifyCode=null;
        user.verifyCodeExpiry=null;
        await user.save();

        return Response.json(
            new ApiResponse(false,"OTP verification successfull"),{
                status:200
            }
        )
    
    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to verify OTP"),{
                status:500
            }
        )   
    }
}