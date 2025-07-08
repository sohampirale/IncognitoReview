"use client";

"use client";

import { useSession } from "next-auth/react";
import MyAvatar from "../MyAvatar/MyAvatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
    const headers = [
        { title: "Home", href: "/" },
        { title: "My Topics", href: "/Topic/MyTopics" },
    ];

    const { data: session, status } = useSession();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
                isScrolled
                    ? "bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-800/50"
                    : "bg-gray-900/80 backdrop-blur-sm"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-5 5v-5zM10.5 9A1.5 1.5 0 109 7.5v0A1.5 1.5 0 0010.5 9zM13.5 9A1.5 1.5 0 1012 7.5v0A1.5 1.5 0 0013.5 9zM16.5 9A1.5 1.5 0 1015 7.5v0A1.5 1.5 0 0016.5 9zM21 12c0 4.418-4.03 8-9 8-1.015 0-2.003-.134-2.947-.39L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-400 transition-all duration-200 cursor-pointer">
                            Incognito Feedback
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-2">
                        {headers.map((header) => (
                            <button
                                key={header.title}
                                onClick={() => router.push(header.href)}
                                className="relative px-5 py-2.5 text-gray-300 hover:text-white transition-all duration-200 group font-medium z-10"
                            >
                                <span className="relative z-10">{header.title}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-3/4 transition-all duration-300" />
                            </button>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {status === "authenticated" ? (
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm text-gray-300">Welcome back</span>
                                    <span className="text-xs text-gray-500">@{session.user.username}</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-60 animate-pulse" />
                                    <MyAvatar
                                        src={session.user.avatar_url!}
                                        fallback={session.user.username!}
                                        className="relative w-10 h-10 ring-2 ring-gray-700 hover:ring-purple-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        ) : status === "unauthenticated" ? (
                            <button
                                onClick={() => router.push("/Signin")}
                                className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl z-10"
                            >
                                <span className="relative z-10 font-medium">Login</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg opacity-0 hover:opacity-20 transition-opacity duration-200" />
                            </button>
                        ) : (
                            <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
                        )}

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors z-10">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Glowing bottom border */}
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            </div>
        </header>
    );
}

// "use client"

// import { useSession } from "next-auth/react";
// import MyAvatar from "../MyAvatar/MyAvatar";
// import { useRouter } from "next/navigation";

// export default function Header(){
//     const headers=[{
//         title:"Home",
//         href:"/"
//     },{
//         title:"My Topics",
//         href:"/my-topics"
//     }]

//     const { data: session, status } = useSession();

//     const router = useRouter();
//     return (
//         <p>
//             {headers.map((header)=>{
//                 return (<span key={header.title} onClick={()=>router.push(header.href)}>
//                     {header.title}
//                 </span>)
//             })}

//             {status=='authenticated' && 
//                 <MyAvatar src={session.user.avatar_url!} fallback={session.user.username!}/>
//             }

//             {status=="unauthenticated" && 
//                 <span onClick={()=>router.push("/api/auth/signin")}>Login</span>
//             }
//         </p>
//     )
// }