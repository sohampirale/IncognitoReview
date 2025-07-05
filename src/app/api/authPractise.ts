import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authOptions:NextAuthOptions={
    providers:[
        Credentials({
            id:"someid",
            name:"some name",
            credentials:{
                identifier:{},
                password:{}
            },
            async authorize(credentials){
                return null
            }
        })
    ],
    secret:process.env.NEXTAUTH_SECRET,
    session:{
        strategy:"jwt"
    },
    pages:{

    },
    callbacks:{
        async jwt({account,user,token}){
            return token;
        },
        async session({session,token}){
            return session
        }
    }
}