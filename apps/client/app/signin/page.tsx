"use client";
import { useAuthStore } from "../../stores/authStore/authStore";
import { Loader, Mail, Lock, Eye, EyeOff, ArrowLeft, PenTool } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

// Reuse the background components for consistency
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
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-violet-700/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
    </div>
  );
};

export default function Signin() {
  const {
    login,
    isLoggingIn,
    handleGoogleSignin,
    handleGoogleAuthError,
    authUser,
    checkAuth,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    handleGoogleAuthError();
  }, [handleGoogleAuthError]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      redirect("/home");
    }
  }, [authUser]);

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
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-zinc-400 text-sm">Enter your details to access your canvas.</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                    <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-600"
                  onChange={onChangeHandler}
                  value={formData.email}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    Password
                </label>
                <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                    <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-white pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-600"
                  onChange={onChangeHandler}
                  value={formData.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 gap-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignin}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-white text-zinc-900 hover:bg-zinc-200 transition-colors font-semibold shadow-[0px_2px_0px_0px_rgba(255,255,255,0.2)_inset]"
          >
             {/* Ensure you have a google.svg in your public folder */}
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <span>Google</span>
          </button>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-zinc-400 text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup" // changed from verify-email to standard signup route pattern
                className="font-semibold text-violet-400 hover:text-violet-300 transition-colors hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}