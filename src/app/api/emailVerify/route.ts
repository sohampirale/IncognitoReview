import { User,IUser } from "@/models";
import { ApiResponse } from "@/utils/ApiResponse";

//starting the email verification process

export async function POST(req:Request){
    const {email} = await req.json();
    const user = await User.findOne({
        email
    })

    if(!user){
        return Response.json(
            new ApiResponse(false,"User with that email does not exists"),{
                status:404
            }
        )
    } else if(user.isVerified){
        return Response.json(
            new ApiResponse(false,"Requested user is already verified"),{
                status:403
            }
        )
    }

}


export async function PUT(req:Request){
    const {OTP}= await req.json();
    
}