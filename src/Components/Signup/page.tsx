"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function Signup() {
  console.log('Inside <Signup/>');
  const [signupNotification, setSignupNotification] = useState({ message: "", type: "" });
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (!username) {
      setNotification("");
      return;
    }
    const timeoutId = setTimeout(() => {
      if (username.length < 2) {
        setNotification("min. length : 2");
        return;
      }
      checkUniqueUsername();
    }, 700);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [username]);

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

    // Show success notification
    setSignupNotification({ 
      message: "Account created successfully! Redirecting...", 
      type: "success" 
    });

    // Redirect after 2 seconds
    setTimeout(() => {
      if (data.data.emailVerificationSent) {
        router.push("/VerifyEmail");
      } else {
        router.push("/Signin");
      }
    }, 2000);

  } catch (error) {
    // Show error notification
    let errorMessage = "Signup failed. Please try again.";
    if (axios.isAxiosError(error)) {
      console.error("Error:", error.response?.data);
      errorMessage = error.response?.data?.message || errorMessage;
    }
    
    setSignupNotification({ 
      message: errorMessage, 
      type: "error" 
    });

    // Clear notification and redirect to signin after 2 seconds
    setTimeout(() => {
      setSignupNotification({ message: "", type: "" });
      router.push("/Signin");
    }, 2000);

  } finally {
    setLoading(false);
  }
}

  async function checkUniqueUsername() {
    console.log('making check');
    try {
      const { data: response } = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/auth/check-unique/username`, {
        username
      });
      console.log('response = ' + JSON.stringify(response));

      setNotification(response.message);
    } catch (error) {
      console.log('ERROR data : ' + JSON.stringify(error.response.data));

      setNotification(error.response.data.message);
    }
  }

  const navigateToSignIn = () => {
    router.push('/Signin');
  };

  const isUsernameAvailable = notification && !notification.includes("min. length") && !notification.includes("taken") && !notification.includes("invalid");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative">
        {/* Floating Cards Effect */}
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg blur-sm"></div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg blur-sm"></div>
        
        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl relative z-10">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Incognito Account</h1>
            <p className="text-gray-400">Join the anonymous feedback revolution</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your alias"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
              {/* Username Status */}
              {notification && (
                <div className={`mt-2 p-2 rounded-md flex items-center gap-2 text-sm ${
                  isUsernameAvailable 
                    ? 'bg-green-900/50 border border-green-700/50 text-green-300' 
                    : 'bg-red-900/50 border border-red-700/50 text-red-300'
                }`}>
                  {isUsernameAvailable ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{notification}</span>
                </div>
              )}

              {/* Signup Notification */}
            {signupNotification.message && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                signupNotification.type === "success" 
                  ? 'bg-green-900/50 border border-green-700/50 text-green-300' 
                  : 'bg-red-900/50 border border-red-700/50 text-red-300'
              }`}>
                {signupNotification.type === "success" ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{signupNotification.message}</span>
              </div>
            )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSignup}
              disabled={loading || !username || !email || !password}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing up...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={navigateToSignIn}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              By creating an account, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

//core logic

// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { login, logout } from "../../store/userSlice"
// import { useRouter } from "next/navigation";
// export default function Signup() {
//   console.log('Inside <Signup/>');
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [notification, setNotification] = useState("")


//   useEffect(() => {
//     if(!username){
//       setNotification("")
//       return;
//     }  
//     const timeoutId = setTimeout(()=>{  
//       if(username.length<2){
//         setNotification("min. length : 2")
//         return;
//       }    
//       checkUniqueUsername()
//     },700)

//     return ()=>{
//       clearTimeout(timeoutId)
//     }
//   }, [username])

//   async function handleSignup() {
//     setLoading(true);
//     try {
//       const { data } = await axios.post("/api/signup", {
//         username,
//         email,
//         password,
//       });

//       console.log("data:", JSON.stringify(data));
//       console.log('data.data.emailVerificationSent = ' + data.data.emailVerificationSent);

//       if (data.data.emailVerificationSent) {
//         router.push("/VerifyEmail")
//       } else {
//         router.push("/Signin")
//       } 
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         console.error("Error:", error.response?.data);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function checkUniqueUsername() {
//     console.log('making check');
//     try {
//       const { data: response } = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/auth/check-unique/username`, {
//         username
//       })
//       console.log('response = ' + JSON.stringify(response));

//       setNotification(response.message);

//     } catch (error: any) {
//       console.log('ERROR data : ' + JSON.stringify(error.response.data));

//       setNotification(error.response.data.message);
//     }
//   }


//   return (

//     <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
//       <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
//         <h2 className="text-3xl font-semibold text-gray-100 text-center">
//           Create Your Incognito Account
//         </h2>

//         <div className="space-y-4">
//           <div>
//             <label
//               htmlFor="username"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Username
//             </label>
//             <label>{notification}</label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => {
//                 setUsername(e.target.value)
//               }}
//               placeholder="Your alias"
//               className="w-full px-4 py-2 bg-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full px-4 py-2 bg-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-300 mb-1"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               className="w-full px-4 py-2 bg-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleSignup}
//           disabled={loading || !username || !email || !password}
//           className={`w-full py-2 rounded-lg text-lg font-medium transition 
//             ${loading || !username || !email || !password
//               ? "bg-gray-600 text-gray-400 cursor-not-allowed"
//               : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-lg"
//             }`}
//         >
//           {loading ? "Signing up…" : "Sign Up"}
//         </button>
//       </div>
//     </div>
//   );
// }

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