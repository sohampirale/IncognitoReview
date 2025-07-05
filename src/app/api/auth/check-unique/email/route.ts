import connectDB from "@/app/lib/connectDB";
import { User } from "@/models";
import { ApiResponse} from "@/utils/ApiResponse";
import { emailSchema } from "@/schemas/schemas";

export async function POST(req:Request){
    console.log('inside /api/check-unique/email POST');
    
    await connectDB();

    const {email : givenEmail}= await req.json();
    const parsed=emailSchema.safeParse(givenEmail)
    if(!parsed.success){
        return Response.json(
            new ApiResponse(false,"Invalid email format"),{
                status:400
            }
        )
    }
    const email=parsed.data;
    console.log('email : '+email);
    
    try {
        const existingUser = await User.exists({
            email
        })
        if(existingUser){
            return Response.json(
                new ApiResponse(false,"email already taken"),{
                    status:400
                }
            )
        } else {
            return Response.json(
                new ApiResponse(true,"email availaible"),{
                    status:200
                }
            )
        }
    } catch (error) {
        return Response.json(
            new ApiResponse(false,"Failed to check email availaibility"),{
                status:500
            }
        )
    }
}