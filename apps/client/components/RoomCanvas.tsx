"use client"
import React, { useEffect, useRef, useState } from 'react'
import Canvas from './Canvas'
import { WS_URL } from '../lib/config'
import { AxiosInstance } from '../lib/axios'
import { Loader2, PenTool, Wifi } from 'lucide-react'
import { motion } from "motion/react"

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
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-violet-700/10 rounded-full blur-[120px] animate-pulse" />
    </div>
  );
};

const RoomCanvas = ({roomId}: {roomId: string}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const { data } = await AxiosInstance.get('/user/get-token');
        const ws = new WebSocket(`${WS_URL}?token=${data.token}`);
        
        ws.onopen = () => {
          socketRef.current = ws;
          setSocket(ws);
          ws.send(JSON.stringify({
            type: "join_room",
            roomId
          }));
        };
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };
  
    connectWebSocket();
  
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [roomId])

  if(!socket) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden font-sans selection:bg-violet-500/30 selection:text-violet-200">
            <MeshGradient />
            <BackgroundGrid />
            
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo Animation */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                    <div className="w-24 h-24 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
                        <PenTool size={40} className="text-violet-500" />
                    </div>
                </motion.div>

                {/* Status Text */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center gap-3 text-violet-400 bg-violet-500/10 px-4 py-1.5 rounded-full border border-violet-500/20">
                        <Wifi size={16} className="animate-pulse" />
                        <span className="text-xs font-bold tracking-wide uppercase">Connecting</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Joining Room...</h2>
                    <p className="text-zinc-500 text-sm max-w-xs">Establishing a secure connection to the whiteboard server.</p>
                </div>

                {/* Spinner */}
                <Loader2 className="animate-spin text-zinc-600 mt-4" size={24} />
            </div>
        </div>
    )
  }

  return (
    <div className="w-full h-screen bg-zinc-950 relative ">
        <Canvas roomId={roomId} socket={socket} />
    </div>
  )
}

export default RoomCanvas