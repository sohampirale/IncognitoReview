import jwt from "jsonwebtoken"

interface IPaylod{
    _id:string,
    username:string,
    isVerified?:boolean
}

function generateAccessToken(payload:IPaylod){
    try {
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET_ACCESS_TOKEN!);
        return accessToken;
    } catch (error) {
        throw error
    }
}

function generateRefreshToken(payload:IPaylod){
    try {
        const refreshToken=jwt.sign(payload,process.env.JWT_SECRET_REFRESH_TOKEN!)
        return refreshToken;
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
    type IPaylod,
    generateAccessToken,
    generateRefreshToken,
    generateAccessAndRefreshToken
}