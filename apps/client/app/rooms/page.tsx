"use client";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Layout, Trash2, PenTool } from "lucide-react";
import RoomCard from "../../components/RoomCard"; 
import RoomCardSkeleton from "../../components/RoomCardSkeleton";
import { AxiosInstance } from "../../lib/axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore/authStore";
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
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-violet-700/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
    </div>
  );
};

interface Room {
  id: string;
  name: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore()
  
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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await AxiosInstance.get("/user/room");
        setRooms(res.data);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleDelete = async (roomId: string) => {
    try {
      await AxiosInstance.delete(`/user/delete-room/${roomId}`);
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
      toast.success("Room deleted successfully!");
    } catch (error) {
      console.error("Failed to delete room", error);
      toast.error("Failed to delete room.");
    }
  };

  if (!authUser || isCheckingAuth) {
    return (
        <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center text-violet-500">
            <Loader2 className="animate-spin size-10" />
        </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200 relative overflow-hidden flex flex-col">
      <MeshGradient />
      <BackgroundGrid />

      {/* --- Header / Navbar --- */}
      <nav className="relative z-20 px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800/50 bg-zinc-950/30 backdrop-blur-sm gap-4">
        <div className="flex items-center gap-4">
            <Link 
                href="/home" 
                className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700"
            >
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Layout className="text-violet-500" size={24}/>
                    Your Rooms
                </h1>
                <p className="text-xs text-zinc-400">Manage your saved drawings</p>
            </div>
        </div>

        <Link href="/create-room">
            <button className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-white/5">
                <Plus size={18} />
                <span>New Room</span>
            </button>
        </Link>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 p-6 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
             
             {/* Loading State */}
             {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {Array(8).fill(0).map((_, index) => (
                        <div key={index} className="opacity-50">
                             <RoomCardSkeleton />
                        </div>
                    ))}
                </div>
             )}

             {/* Empty State */}
             {!loading && rooms.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20"
                >
                    <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center text-zinc-500 mb-6 shadow-xl">
                        <PenTool size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No rooms found</h3>
                    <p className="text-zinc-400 mb-8 text-center max-w-sm">
                        You haven't created any canvases yet. Create your first room to start drawing.
                    </p>
                    <Link href="/create-room">
                        <button className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/20">
                            Create Room
                        </button>
                    </Link>
                </motion.div>
             )}

             {/* Rooms Grid */}
             {!loading && rooms.length > 0 && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                 >
                    {rooms.map((room) => (
                        <div key={room.id} className="group relative">
                             {/* You might want to wrap RoomCard in a container to add custom hover styles if RoomCard doesn't support them */}
                             <RoomCard
                                id={room.id}
                                name={room.name}
                                onDelete={handleDelete}
                             />
                        </div>
                    ))}
                 </motion.div>
             )}
        </div>
      </main>
    </div>
  );
}