import "next-auth"
import { DefaultSession } from "next-auth";

declare module "next-auth"{
    interface User{
        _id?:string;
        username?:string;
        email?:string;
        isVerified?:boolean;
        acceptingFeedbacks?:boolean;
        login?:string;
        avatar?:string;
        name?:string;
        avatar_url?:string;
    }

    interface Session{
        user:{
            _id?:string;
             username?:string;
            email?:string;
            isVerified?:boolean;
            acceptingFeedbacks?:boolean;
            avatar_url?:string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt"{
    interface JWT{
        _id?:string;
        username?:string;
        email?:string;
        isVerified?:boolean;
        acceptingFeedbacks?:boolean;
        avatar_url?:string;
    }
}