"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore/authStore";
import { Loader, Mail, Lock, Eye, EyeOff, PenTool, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";

// --- Visual Assets (Reused for consistency) ---

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
      <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-violet-700/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
    </div>
  );
};

// --- Schema ---
const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string()
      .min(8, "Password should be at least 8 characters")
      .max(100, "Password should not exceed 100 characters")
      .regex(/[a-z]/, "At least 1 lowercase letter")
      .regex(/[A-Z]/, "At least 1 uppercase letter")
      .regex(/[0-9]/, "At least 1 number")
      .regex(/[^A-Za-z0-9]/, "At least 1 special character"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type SignupFormFields = z.infer<typeof signupSchema>;

export default function Signup() {
  const { signup, isSigningUp, inputEmail, authUser, checkAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const emailFromUrl = searchParams.get('email');
    
    if (emailFromUrl) {
      useAuthStore.setState({ inputEmail: emailFromUrl });
    }
    
    // Redirect logic
    if (!inputEmail && !emailFromUrl) {
      redirect("/verify-email");
    }
    
    if(authUser) redirect("/home");
  }, [inputEmail, authUser]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignupFormFields>({
    defaultValues: {
      email: inputEmail || "",
      password: "",
      confirmPassword: ""
    },
    resolver: zodResolver(signupSchema)
  });

  const onSubmit: SubmitHandler<SignupFormFields> = async (data) => {
    try {
      const { email, password, confirmPassword } = data;
      signup({ email, password, confirmPassword });
    } catch (error) {
      setError("root", { message: "Registration failed" });
      console.error("Error while signing up", error)
    }
  };

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
        href="/verify-email"
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
         className="w-full max-w-lg px-6 z-10"
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
            <h1 className="text-2xl font-bold text-white mb-2">Finish setting up</h1>
            <p className="text-zinc-400 text-sm">Create a strong password to secure your account.</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Email Field (Read Only) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300 ml-1">Email</label>
              <div className="relative group opacity-70">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Mail size={18} />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  readOnly
                  className="w-full bg-zinc-950/30 border border-zinc-800 text-zinc-400 pl-10 pr-4 py-3 rounded-xl cursor-not-allowed focus:outline-none"
                  id="email"
                />
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <CheckCircle2 size={18} />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300 ml-1">Password</label>
              <div className="relative group">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                    <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Create a password"
                  className={`w-full bg-zinc-950/50 border ${errors.password ? 'border-red-500/50' : 'border-zinc-800'} text-white pl-10 pr-12 py-3 rounded-xl focus:ring-2 ${errors.password ? 'focus:ring-red-500/20' : 'focus:ring-violet-500/50'} ${errors.password ? 'focus:border-red-500' : 'focus:border-violet-500'} outline-none transition-all placeholder:text-zinc-600`}
                  id="password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Error Message with Icon */}
              {errors.password && (
                <div className="flex items-center gap-1.5 mt-1 ml-1 text-red-400 text-xs animate-in slide-in-from-top-1">
                    <XCircle size={12} />
                    <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300 ml-1">Confirm Password</label>
              <div className="relative group">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                    <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Re-enter password"
                  className={`w-full bg-zinc-950/50 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-zinc-800'} text-white pl-10 pr-12 py-3 rounded-xl focus:ring-2 ${errors.confirmPassword ? 'focus:ring-red-500/20' : 'focus:ring-violet-500/50'} ${errors.confirmPassword ? 'focus:border-red-500' : 'focus:border-violet-500'} outline-none transition-all placeholder:text-zinc-600`}
                  id="confirmPassword"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                 <div className="flex items-center gap-1.5 mt-1 ml-1 text-red-400 text-xs animate-in slide-in-from-top-1">
                    <XCircle size={12} />
                    <span>{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isSigningUp}
            >
              {isSigningUp ? <Loader className="mx-auto animate-spin" size={20} /> : "Create Account"}
            </button>
            
             {/* General Error */}
            {errors.root && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {errors.root.message}
                </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}