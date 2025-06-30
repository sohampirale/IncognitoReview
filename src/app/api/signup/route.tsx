import mongoose from "mongoose";
import {User} from "../../../models/index"
import { ApiResponse } from "@/utils/ApiResponse.js";
import { IPaylod,generateAccessAndRefreshToken } from "@/utils/token";

export async function POST(req:Request){
    const {username,email,password} = await req.json();

    try {
        const existingUser = await User.findOne({
            email
        })
        if(!existingUser){
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
                return Response.json(
                    new ApiResponse(true,"User created successfully")
                )
            }
        } else {
            if(existingUser.isVerified){
                const payload:IPaylod={
                    _id:existingUser._id,
                    username:existingUser.username
                }
                
                const {accessToken,refreshToken} = generateAccessAndRefreshToken(payload)
                // res
                // .cookie("accessToken")
            }
        }
    } catch (error) {
        
    }
}