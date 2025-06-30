import connectDB from "@/app/lib/connectDB";
import { NextResponse } from "next/server";

export async function GET(req:any){
    console.log('Inside api/db GET');

    try {
        const res=await connectDB()
        console.log('res = '+JSON.stringify(res));
        
        return NextResponse.json({connection:res})
    } catch (error) {
        return NextResponse.json({
            error
        })
    }
}