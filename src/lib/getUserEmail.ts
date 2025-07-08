import mongoose from "mongoose";
import connectDB from "./connectDB";
import { User } from "@/models";

export default async function getUserEmail(userId:string){
    const _id=new mongoose.Types.ObjectId(userId);
    try {
        await connectDB();

        const user = await User.findById(_id);
        if(!user)return null;
        return user.email;
    } catch (error) {
        console.log('Failed to return the email');
        return null;
    }
}