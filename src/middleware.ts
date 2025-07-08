import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req:NextRequest){
    // const token =await  getToken({req,secret:process.env.NEXTAUTH_SECRET});
    // const url = req.nextUrl;
    // console.log('inside middleware token = '+JSON.stringify(token));
    // // if(token && url.pathname.startsWith("/api/auth/signin")){
    // //     console.log('ALready logged in ');
    // //     return NextResponse.redirect(new URL("/", req.url));
    // // }
    return NextResponse.next();
}

export const config = {
    matcher: ['/:path*'], // only protect these,
}