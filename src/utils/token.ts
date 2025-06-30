import mongoose from "mongoose";
import jwt from "jsonwebtoken"

interface IPaylod{
    _id:mongoose.Types.ObjectId | string,
    username:string,
    isVerified?:boolean
}

function generateAccessToken(payload:IPaylod){
    payload._id=payload._id.toString();

    try {
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET_ACCESS_TOKEN!);
        return accessToken;
    } catch (error) {
        throw error
    }
}

function generateRefreshToken(payload:IPaylod){
    payload._id=payload._id.toString();
    try {
        const refreshToken=jwt.sign(payload,process.env.JWT_SECRET_REFRESH_TOKEN!)
    } catch (error) {
        throw error;
    }
}

function generateAccessAndRefreshToken(payload:IPaylod){
    try {        
        const accessToken = generateAccessToken(payload)
        const refreshToken=generateRefreshToken(payload)
        return {accessToken,refreshToken}
    } catch (error) {
        throw error
    }
}

export {
    IPaylod,
    generateAccessToken,
    generateRefreshToken,
    generateAccessAndRefreshToken
}