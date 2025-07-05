"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, logout } from "../../../store/userSlice"
import { useRouter } from "next/navigation";

export default function Signup() {
  console.log('Inside <Signup/>');
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("")


  useEffect(() => {
    if(!username){
      setNotification("")
      return;
    }  
    const timeoutId = setTimeout(()=>{  
      if(username.length<2){
        setNotification("min. length : 2")
        return;
      }    
      checkUniqueUsername()
    },700)

    return ()=>{
      clearTimeout(timeoutId)
    }
  }, [username])

  async function handleSignup() {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/signup", {
        username,
        email,
        password,
      });

      console.log("data:", JSON.stringify(data));
      console.log('data.data.emailVerificationSent = ' + data.data.emailVerificationSent);

      if (!data.data.signup) {
        router.push("/Home")
      } else if (data.data.emailVerificationSent) {
        router.push("/Email/VerifyEmail")
      } else {
        router.push("/Home")
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function checkUniqueUsername() {
    console.log('making check');
    try {
      const { data: response } = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/auth/check-unique/username`, {
        username
      })
      console.log('response = ' + JSON.stringify(response));

      setNotification(response.message);

    } catch (error: any) {
      console.log('ERROR data : ' + JSON.stringify(error.response.data));

      setNotification(error.response.data.message);
    }
  }


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-100 text-center">
          Create Your Incognito Account
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Username
            </label>
            <label>{notification}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              placeholder="Your alias"
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading || !username || !email || !password}
          className={`w-full py-2 rounded-lg text-lg font-medium transition 
            ${loading || !username || !email || !password
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-lg"
            }`}
        >
          {loading ? "Signing up…" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}

// "use client"

// import { useState } from "react"
// import axios from "axios"

// export default function Signup(){
//     const [username,setUsername]=useState("")
//     const [email,setEmail]=useState("")
//     const [password,setPassword]=useState("")

//     async function handleSignup(){
//         try {
//             const response = await axios.post("/api/signup",{
//                 username,
//                 email,
//                 password
//             })
//             console.log('Response received : '+JSON.stringify(response.data));
//         } catch (error) {
//             if(axios.isAxiosError(error))
//             console.error('Error : '+JSON.stringify(error?.response?.data));
//         }
//     }

//     return(
//         <>
//             <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter username"/>
//             <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter email"/>
//             <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter password"/>
//             <button onClick={handleSignup}>Signup</button>
//         </>
//     )
// }