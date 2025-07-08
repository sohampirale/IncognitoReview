"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Send, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Clock, 
  RefreshCw,
  EyeOff,
  Key,
  Lock,
  X
} from "lucide-react";
import axios from "axios";

// Enhanced VerifyEmail Component
export default function VerifyEmail({ email, verificationOngoing }: { email: string; verificationOngoing: boolean }) {
  const [sendEmailConfirmation, setSendEmailConfirmation] = useState(verificationOngoing);
  const [OTP, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Parse OTP into individual digits
  const otpDigits = OTP.padEnd(6, ' ').split('').slice(0, 6);

  // Timer for resend functionality
  useEffect(() => {
    if (sendEmailConfirmation && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && sendEmailConfirmation) {
      setCanResend(true);
    }
  }, [timeLeft, sendEmailConfirmation]);

  // Initialize timer when email is sent
  useEffect(() => {
    if (sendEmailConfirmation) {
      setTimeLeft(300); // 5 minutes
      setCanResend(false);
    }
  }, [sendEmailConfirmation]);

  const handleSendEmail = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      
      const { data: response } = await axios.get("/api/email/verify");
      
      console.log('OTP sent successfully to email: ' + email);
      setSendEmailConfirmation(true);
      setSuccess("Verification code sent to your email!");
      setTimeLeft(300);
      setCanResend(false);
    } catch (error: any) {
      console.log('Failed to send OTP to email: ' + email);
      setError(error.response?.data?.message || "Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVerification = () => {
    router.back();
  };

  const handleVerifyEmail = async () => {
    if (OTP.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccess("");

    try {
      
      const { data: response } = await axios.put("/api/email/verify", {
        OTP
      });
      
      console.log('OTP verification successful');
      setSuccess("Email verified successfully!");
      
      // Redirect after success
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.log('Failed to verify OTP');
      setError(error.response?.data?.message || "Invalid verification code. Please try again.");
      setOTP("");
      // Focus first input on error
      otpInputs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOTP = otpDigits.map((digit, i) => i === index ? value : digit).join('').replace(/\s/g, '');
    setOTP(newOTP);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOTP("");
    setError("");
    setSuccess("");
    handleSendEmail();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-slate-400">
            Secure your account with email verification
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
          {!sendEmailConfirmation ? (
            /* Send Email Confirmation */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Email Verification Required</h2>
                <p className="text-slate-400 mb-4">
                  We'll send a verification code to your email address to confirm your identity.
                </p>
                
                {/* Email Display */}
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-white font-medium">{email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSendEmail}
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isLoading
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancelVerification}
                  className="w-full py-4 rounded-xl font-medium bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            /* OTP Verification */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Enter Verification Code</h2>
                <p className="text-slate-400 mb-4">
                  We've sent a 6-digit code to <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-4">
                <div className="flex justify-center space-x-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpInputs.current[index] = el}
                      type="text"
                      maxLength={1}
                      value={digit === ' ' ? '' : digit}
                      onChange={(e) => handleOTPChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-12 text-center text-xl font-bold bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      disabled={isVerifying}
                    />
                  ))}
                </div>

                {/* Timer */}
                {timeLeft > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Code expires in {formatTime(timeLeft)}</span>
                  </div>
                )}

                {/* Resend Button */}
                {canResend && (
                  <div className="text-center">
                    <button
                      onClick={handleResend}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Resend Code</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyEmail}
                disabled={OTP.length !== 6 || isVerifying}
                className={`w-full py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  OTP.length !== 6 || isVerifying
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105'
                }`}
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Verify Email</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-3 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-green-400 text-sm">{success}</span>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center space-x-2 text-slate-400 mb-2">
            <EyeOff className="w-4 h-4" />
            <span className="text-sm font-medium">Privacy Protected</span>
          </div>
          <p className="text-slate-400 text-xs">
            Your email verification is secure and encrypted. We never share your information with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}

// Enhanced Page Component for Already Verified Users
export function AlreadyVerifiedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Already Verified!</h1>
          <p className="text-slate-400">
            Your email has already been verified
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Account Verified</h2>
          <p className="text-slate-400 mb-6">
            Your account is fully verified and ready to use. You can now access all features of IncognitoFeedback.
          </p>
          
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-200 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// Enhanced Page Component for Failed Email Retrieval
export function EmailRetrievalFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Error</h1>
          <p className="text-slate-400">
            Unable to retrieve your email address
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Email Retrieval Failed</h2>
          <p className="text-slate-400 mb-6">
            We couldn't retrieve your email address from your account. Please try signing in again or contact support if the problem persists.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push("/api/auth/signin")}
              className="w-full py-4 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Sign In Again
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full py-4 rounded-xl font-medium bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client"

// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function VerifyEmail({email,verificationOngoing}:{email:string,verificationOngoing:boolean}){
//     const [sendEmailConfirmation,setSendEmailConfirmation]=useState(verificationOngoing);
//     const [OTP,setOTP]=useState("")
//     const router = useRouter();

//     async function handleSendEmail(){
//         try {
//             const {data:response} = await axios.get("/api/email/verify");
//             console.log('OTP sent successfulyl to email : '+email);
//             setSendEmailConfirmation(true)
//         } catch (error) {
//             console.log('failed to send OTP to email : '+email);
//         }
//     }


//     function handleCancelVerification(){
//         router.back();
//     }

//     async function handleVerifyEmail(){
//         try {
//             const {data:response} = await axios.put("/api/email/verify",{
//                 OTP
//             })
//             console.log('OTP verification successfull');
//         } catch (error) {
//             console.log('Failed to verify OTP');
//         }
//     }

//     return (
//         <>
//             <p className="mt-50"></p>
//             {!sendEmailConfirmation && (<>
//                     <p>Send OTP to email : {email}</p>
//                     <button onClick={handleSendEmail}>Yes</button>
//                     <button onClick={handleCancelVerification}>No</button>
//                 </>)
//             }

//             {sendEmailConfirmation && (<>
//                 <label>Enter OTP sent to your email</label>
//                 <input type="text" value={OTP} onChange={(e)=>setOTP(e.target.value)} />
//                 <button onClick={handleVerifyEmail}>Verify</button>
//             </>)}

//         </>
//     )
// }