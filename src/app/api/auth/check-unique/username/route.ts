import connectDB from "@/lib/connectDB";
import { User } from "@/models";
import { ApiResponse} from "@/utils/ApiResponse";
import { usernameSchema } from "@/schemas/schemas";

export async function POST(req:Request){
    console.log('inside /api/check-unique/username POST');
    
    await connectDB();

    const {username : givenUsername}= await req.json();
    const parsed=usernameSchema.safeParse(givenUsername)
    if(!parsed.success){
        return Response.json(
            new ApiResponse(false,"Invalid username format"),{
                status:400
            }
        )
    }
    const username=parsed.data;
    console.log('username : '+username);
    
    try {
        const existingUser = await User.exists({
            username
        })
        if(existingUser){
            return Response.json(
                new ApiResponse(false,"Username already taken"),{
                    status:400
                }
            )
        } else {
            return Response.json(
                new ApiResponse(true,"Username availaible"),{
                    status:200
                }
            )
        }
    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to check username availaibility"),{
                status:500
            }
        )
    }
}