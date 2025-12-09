"use client";
import { useAuthStore } from '../stores/authStore/authStore';
import { Loader2, Check, Copy, ArrowLeft, Layout, PenTool, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-violet-700/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
    </div>
  );
};

const CreateRoom = () => {
    const { createRoom, roomId, isCreatingRoom, joinRoom, checkAuth, authUser, isCheckingAuth } = useAuthStore()
    const [copied, setCopied] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)
    const [formData, setFormData] = useState({
        name: ""
    })
    const [authChecked, setAuthChecked] = useState(false);
    // State to ensure portal only renders on client
    const [mounted, setMounted] = useState(false); 

    useEffect(() => {
        setMounted(true);
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        createRoom(formData)
    }

    const copyToClipboard = async () => {
        if (roomId) {
            await navigator.clipboard.writeText(roomId)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 4000)
        }
    }

    function handleJoinRoom(){
        joinRoom(roomId)
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
                        <h1 className="text-2xl font-bold text-white mb-2">Create a Room</h1>
                        <p className="text-zinc-400 text-sm">Give your new canvas a name to get started.</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                             <label htmlFor="name" className="text-sm font-medium text-zinc-300 ml-1">Room Name</label>
                             <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                                    <Layout size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Brainstorming Session"
                                    className="w-full bg-zinc-950/50 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-600"
                                    onChange={onChangeHandler}
                                    value={formData.name}
                                    required
                                />
                             </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isCreatingRoom}
                        >
                             {isCreatingRoom ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <Plus size={20} />
                                    Create Room
                                </>
                             )}
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* --- Loading Overlay --- */}
            {isCreatingRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-violet-500 w-12 h-12" />
                        <p className="text-zinc-300 font-medium">Setting up your canvas...</p>
                    </div>
                </div>
            )}

            {/* --- Success Modal (Portal) --- */}
            {mounted && roomId && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div ref={modalRef} className="bg-zinc-900 border border-zinc-700/50 rounded-2xl p-8 shadow-2xl shadow-violet-500/20 w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                                <Check size={32} />
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-2 text-white">Room Created!</h2>
                            <p className="text-zinc-400 text-sm mb-6">Share this code with your team to collaborate.</p>

                            {/* Room ID Display */}
                            <div className="bg-black/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-3 mb-8 group">
                                <span className="text-violet-300 font-mono text-lg tracking-wider select-all">
                                    {roomId}
                                </span>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all active:scale-95"
                                    title="Copy Room ID"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <Link href={`/canvas/${roomId}`} className="block w-full">
                                <button 
                                    className="w-full bg-white text-zinc-950 hover:bg-zinc-200 px-6 py-3.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg"
                                    onClick={handleJoinRoom}
                                >
                                    Enter Room
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default CreateRoom