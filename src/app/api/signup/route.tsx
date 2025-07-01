import {User} from "../../../models/index"
import { ApiResponse } from "@/utils/ApiResponse";
import { IPaylod,generateAccessAndRefreshToken } from "@/utils/token";
import {serialize} from "cookie"
import connectDB from "@/app/lib/connectDB";
import sendEmailVerification from "@/utils/emails/sendEmailVerification";

export async function POST(req:Request){
    await connectDB()
    console.log('inside api/signup POST');
    const {username,email,password} = await req.json();
    console.log('test1');

    try {
        const existingUserByEmail = await User.findOne({
            email
        })
        const existingUserByUsername =  await User.findOne({
            username
        })


        if(
            (existingUserByEmail && !existingUserByUsername)
            ||(!existingUserByEmail && existingUserByUsername)  
        ){
            return Response.json(
                new ApiResponse(false,"User with that username or email already exists"),{
                    status:403
                }
            )
        } else if(!existingUserByEmail && !existingUserByUsername){
            console.log('user does not exist');
            
            const user=await User.create({
                email,
                username,
                password
            })  

            if(!user){
                return Response.json(
                    new ApiResponse(false,"Failed to create the user")
                ,{
                    status:500
                })
            } else {
                
                const payload:IPaylod={
                    _id:user._id.toString(),
                    username:user.username
                }
                
                const emailSentResponse = await sendEmailVerification(user)
                console.log('response of sendingEmailVerification = '+JSON.stringify(emailSentResponse));
                

                const {accessToken,refreshToken} = generateAccessAndRefreshToken(payload)

                const accessTokenCookie=serialize("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 1000*60*15, // 15 minutes
                    path: "/",
                });

                const refreshTokenCookie=serialize("refreshToken",refreshToken,{
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 1000*60*60*24*7,  //7 days
                    path: "/",
                });

                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                headers.append("Set-Cookie", accessTokenCookie);
                headers.append("Set-Cookie", refreshTokenCookie);

                return Response.json(
                    new ApiResponse(true,"User created successfully",{
                        signup:true,
                        login:false,
                        isVerified:false,
                        emailVerificationSent:emailSentResponse.success??false
                    }),{
                        status:200,
                        headers
                    }
                )
            }
        } else {
            console.log('user does exist');

            if(!existingUserByEmail._id.equals(existingUserByUsername._id)){
                return Response.json(
                    new ApiResponse(false,"User with that Username and Email already exists")
                )
            }
           
            const existingUser=existingUserByEmail; 

            if(!await existingUser.comparePassword(password)){
                return Response.json(
                    new ApiResponse(false,"User with that Email and Username already exists"),{
                        status:403
                    }
                )
            }

            const payload:IPaylod={
                _id:existingUser._id.toString(),
                username:existingUser.username
            }
            
            const {accessToken,refreshToken} = generateAccessAndRefreshToken(payload)

            const accessTokenCookie=serialize("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 15, // 15 minutes
                path: "/",
            });

            const refreshTokenCookie=serialize("refreshToken",refreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 15, // 15 minutes
                path: "/",
            });

            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Set-Cookie", accessTokenCookie);
            // headers.append("Set-Cookie", refreshTokenCookie);

            if(existingUser.isVerified){
                return Response
                .json(new ApiResponse(true,"Log in successfull",{
                    signup:false,
                    login:true,
                    isVerified:true
                }),{
                    status:200,
                    headers
                })
            } else {
                   return Response
                .json(new ApiResponse(true,"Log in successfull",{
                    signup:false,
                    login:true,
                    isVerified:false
                }),{
                    status:200,
                    headers
                })
            }
        } 
    }catch (error) {
        console.error('ERROR :: api/signup POST :; '+error);
        return Response.json(
            new ApiResponse(false,'ERROR :: api/signup POST :: Error while signing up',error),{
                status:500
            }
        )
    }
}
