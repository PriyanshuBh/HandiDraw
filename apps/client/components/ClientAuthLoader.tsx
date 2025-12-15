"use client";
import { useAuthStore } from "../stores/authStore/authStore";
import { Loader2, PenTool } from "lucide-react";
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
      <div className="absolute top-[40%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-violet-700/20 rounded-full blur-[120px] animate-pulse" />
    </div>
  );
};

export default function ClientAuthLoader() {
  const { isCheckingAuth } = useAuthStore();

  if (!isCheckingAuth) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden">
      <MeshGradient />
      <BackgroundGrid />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated Logo Container */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/10"
        >
           <PenTool size={36} className="text-violet-500" />
        </motion.div>

        {/* Loading Spinner & Text */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-3"
        >
            <Loader2 className="size-8 animate-spin text-violet-400" />
            <p className="text-zinc-500 text-sm font-medium tracking-wide">Initializing HandiDraw...</p>
        </motion.div>
      </div>
    </div>
  );
}