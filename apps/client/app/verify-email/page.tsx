"use client";
import { useState, useEffect, FormEvent } from "react";
import { useAuthStore } from "../../stores/authStore/authStore";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader, Mail, KeyRound, ArrowRight, ArrowLeft, PenTool } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

// --- Visual Assets ---

const BackgroundGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
            backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
    </div>
  );
};

const MeshGradient = () => {
  return (
    <div className="absolute z-0 inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-violet-700/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
    </div>
  );
};

export default function EmailVerify() {
  const {
    sentEmail,
    sendingEmail,
    verifyEmail,
    isVerifying,
    handleGoogleSignup,
    handleGoogleAuthError,
    otpSent,
    resetOtpSent,
    authUser,
    checkAuth
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  useEffect(() => {
    handleGoogleAuthError();
    return () => {
      resetOtpSent();
    };
  }, [handleGoogleAuthError, resetOtpSent]);

  async function handleSendOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sentEmail({ email });
  }

  async function handleSubmitOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await verifyEmail({ email, otp });
    router.push("/signup");
  }

  useEffect(() => {
      checkAuth()
    }, [checkAuth])
  
    useEffect(() => {
      if (authUser) {
        redirect("/home")
      }
    }, [authUser])

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200">
      <MeshGradient />
      <BackgroundGrid />

      {/* Back Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="w-full max-w-md px-6 z-10"
      >
         {/* Logo */}
         <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-violet-500/20">
                    <PenTool size={24} />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                    HandiDraw
                </span>
            </div>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl shadow-black/40">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Get started</h1>
            <p className="text-zinc-400 text-sm">Enter your email to verify your identity.</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={otpSent ? handleSubmitOtp : handleSendOtp}>
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                    <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full bg-zinc-950/50 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-600 ${otpSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  name="email"
                  id="email"
                  required
                  disabled={otpSent}
                />
              </div>
            </div>

            {/* OTP Input (Animated) */}
            {otpSent && (
               <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col gap-2 overflow-hidden"
               >
                <label htmlFor="otp" className="text-sm font-medium text-zinc-300 ml-1">One-Time Password</label>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                        <KeyRound size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="w-full bg-zinc-950/50 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-600 tracking-widest"
                        onChange={(e) => setOtp(e.target.value)}
                        value={otp}
                        name="otp"
                        id="otp"
                        required
                        autoFocus
                    />
                </div>
              </motion.div>
            )}

            {/* Main Action Button */}
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              disabled={otpSent ? isVerifying : sendingEmail}
            >
              {otpSent ? (
                 isVerifying ? <Loader className="animate-spin" size={20} /> : "Verify Code"
              ) : (
                 sendingEmail ? <Loader className="animate-spin" size={20} /> : (
                    <>
                        Send OTP 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </>
                 )
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 gap-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white text-zinc-900 hover:bg-zinc-200 transition-colors font-semibold shadow-[0px_2px_0px_0px_rgba(255,255,255,0.2)_inset]"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <span>Continue with Google</span>
          </button>

          {/* Footer Link */}
          <div className="text-center mt-8">
            <p className="text-zinc-400 text-sm">
              Already have an account?{" "}
              <Link 
                href="/signin" 
                className="font-semibold text-violet-400 hover:text-violet-300 transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}