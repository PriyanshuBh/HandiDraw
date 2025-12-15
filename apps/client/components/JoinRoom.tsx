"use client";
import { useAuthStore } from '../stores/authStore/authStore';
import { Loader2, DoorOpen, Hash, ArrowLeft, ArrowRight, PenTool } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { redirect, useRouter } from "next/navigation";
import Link from 'next/link';
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
      <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-violet-700/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
    </div>
  );
};

const JoinRoom = () => {
    const { joinRoom, isJoiningRoom, checkAuth, authUser, isCheckingAuth } = useAuthStore()
    const [formData, setFormData] = useState({
        roomId: "",
    })
    const router = useRouter()
    const [authChecked, setAuthChecked] = useState(false);
    
    useEffect(() => {
        const checkUserAuth = async () => {
            await checkAuth();  
            setAuthChecked(true);  
        };

        checkUserAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (authChecked && !authUser) {
            redirect("/");  
        }
    }, [authChecked, authUser]);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: value
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const success = await joinRoom(formData.roomId || "")
        if(success)
            router.push(`/canvas/${formData.roomId}`)
    }

    if(!authUser || isCheckingAuth){
        return (
            <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center text-violet-500">
                <Loader2 className="animate-spin size-10" />
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200">
            <MeshGradient />
            <BackgroundGrid />

             {/* Back Button */}
            <Link 
                href="/home"
                className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors z-20 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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

                <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl shadow-black/40 relative">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Join a Room</h1>
                        <p className="text-zinc-400 text-sm">Enter the Room ID to start collaborating.</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                             <label htmlFor="roomId" className="text-sm font-medium text-zinc-300 ml-1">Room ID</label>
                             <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                                    <Hash size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="roomId"
                                    placeholder="Paste Room ID here..."
                                    className="w-full bg-zinc-950/50 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-600 font-mono tracking-wide"
                                    onChange={onChangeHandler}
                                    value={formData.roomId}
                                    required
                                    autoComplete="off"
                                />
                             </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            disabled={isJoiningRoom || !formData.roomId}
                        >
                            {isJoiningRoom ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Enter Room
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* --- Loading Overlay (Optional aesthetic touch) --- */}
            {isJoiningRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
                        <div className="relative">
                            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
                            <Loader2 className="animate-spin text-violet-500 w-10 h-10 relative z-10" />
                        </div>
                        <p className="text-zinc-300 font-medium">Connecting to room...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JoinRoom