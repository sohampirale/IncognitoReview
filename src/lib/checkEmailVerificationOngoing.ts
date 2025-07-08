import connectDB from "./connectDB";
import { User } from "@/models";


export default async function checkEmailVerificationOngoing(userId){
    try {
        await connectDB();
        const user = await User.findById(userId)

        if(!user)return false;
        else if(!user.verifyCodeExpiry){
            return false
        }else if(user.verifyCodeExpiry>Date.now()){
            return true;
        } else return false
    } catch (error) {
        return false;
    }
}