import {NextAuthOptions} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { User } from "@/models"
import connectDB from "../../lib/connectDB"
import GithubProvider from "next-auth/providers/github"

export const authOptions:NextAuthOptions={
    providers:[
        Credentials({
            id:"credentials",
            name:'credentials',
            credentials:{
                identifier:{label:"Username or Email", type:"text"},
                password:{label:"Password", type:"password"}
            },
            authorize:async(credentials)=>{
                await connectDB()
                console.log('Inside authorize');
                
                const user = await User.findOne({
                    $or:[
                        {
                            email:credentials?.identifier
                        },
                        {
                            username:credentials?.identifier
                        }
                    ]
                })

                if(!user){
                    console.log('not found');
                    throw new Error("User with that email and username does not exists")
                } else if (!await user.comparePassword(credentials?.password)){
                    console.log('Incorrect Password');
                    throw new Error("Incorrect Password")
                }

                console.log('Login successfull!');
                
                return user
            }
        }),
        GithubProvider({
            clientId:process.env.AUTH_GITHUB_ID!,
            clientSecret:process.env.AUTH_GITHUB_SECRET!
        })
    ],
    pages:{
        signIn:"/sign-in"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
        async jwt({token,user,account}){
            console.log('Inside jwt() of auth.ts');
            if(user){
                if(account?.provider==="credentials"){
                    token._id=user._id;
                    token.username=user.username;
                    token.email=user.email;
                    token.isVerified=user.isVerified;
                    token.acceptingFeedbacks=user.acceptingFeedbacks;
                    token.avatar_url=user.avatar_url;
                } else if(account?.provider==="github"){
                    token._id=user.id;
                    token.username=user.login || user.name || "NO NAME";
                    token.email = user.email ;
                    token.avatar_url = user.avatar_url;
                }
            } else {
                await connectDB();
                const dbUser = await User.findById(token._id);
                if(!dbUser) return token;
                token.username = dbUser.username;
                token.email = dbUser.email;
                token.isVerified = dbUser.isVerified;
                token.acceptingFeedbacks = dbUser.acceptingFeedbacks;
                token.avatar_url = dbUser.avatar_url;

                return token;
            }
            return token;
        },
        async session({session ,token}){
            console.log('Inside session() of auth.ts');
            if(token){
                session.user._id=token._id;
                session.user.username=token.username;
                session.user.email=token.email;
                session.user.isVerified=token.isVerified;
                session.user.acceptingFeedbacks=token.acceptingFeedbacks;
                session.user.avatar_url=token.avatar_url;
            }
            return session;
        }
    }
}