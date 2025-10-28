"use client";
import { useAuthStore } from "../../stores/authStore/authStore";
import { Loader, Mail, ArrowLeft, PenTool } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AxiosInstance } from '../../lib/axios';

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

export default function ForgotPassword() {
  const { authUser, checkAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check auth status on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (authUser) {
      redirect("/home");
    }
  }, [authUser]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await AxiosInstance.post('/auth/forgot-password', { email });
      setMessage(response.data.msg);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.msg || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200">
      <MeshGradient />
      <BackgroundGrid />

      {/* Back Button */}
      <Link 
        href="/signin" // Link back to signin
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Sign In</span>
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
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
            <p className="text-zinc-400 text-sm">Enter your email to reset your password.</p>
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Messages */}
          {message && <p className="text-sm text-center text-green-500 mt-4">{message}</p>}
          {error && <p className="text-sm text-center text-red-500 mt-4">{error}</p>}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-zinc-400 text-sm">
              Remember your password?{" "}
              <Link
                href="/signin"
                className="font-semibold text-violet-400 hover:text-violet-300 transition-colors hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
