"use client";
import { redirect, useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore/authStore";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Loader2, 
  User, 
  LogOut, 
  DoorOpen, 
  Plus, 
  Users, 
  PenTool,
  ChevronDown,
  LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ComingSoonModal } from "./ComingSoonModal";

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
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-700/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
    </div>
  );
};

export default function HomePage() {
  const { logout, authUser, checkAuth, isLoggingOut, isCheckingAuth } = useAuthStore();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
      redirect("/signin"); 
    }
  }, [authChecked, authUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!authUser || isCheckingAuth) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center text-violet-500">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }

  // Get User Initials
  const userInitial = authUser.email ? authUser.email[0]?.toUpperCase() : "U";
  const userName = authUser.name || authUser.email.split('@')[0];

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200 relative overflow-hidden flex flex-col">
      <MeshGradient />
      <BackgroundGrid />

      {/* --- Header / Navbar --- */}
      <nav className="relative z-20 px-6 py-5 flex justify-between items-center border-b border-zinc-800/50 bg-zinc-950/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-violet-500/20">
                <PenTool size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                HandiDraw
            </span>
            </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-800 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-inner">
               {userInitial}
            </div>
            <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 mt-2 w-64 bg-zinc-900 rounded-xl shadow-2xl shadow-black/50 border border-zinc-800 overflow-hidden z-50"
              >
                {/* User Info Header */}
                <div className="px-4 py-4 border-b border-zinc-800 bg-zinc-900/50">
                  <p className="text-sm font-bold text-white truncate">{userName}</p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{authUser.email}</p>
                </div>

                {/* Menu Items */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/rooms");
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-3"
                  >
                    <LayoutGrid size={16} className="text-violet-400" />
                    My Rooms
                  </button>
                  
                  {/* Account Settings (Placeholder) */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setComingSoonOpen(true);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-3"
                  >
                    <User size={16} className="text-zinc-500" />
                    Account
                  </button>
                </div>

                {/* Logout */}
                <div className="p-1 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3 disabled:opacity-50"
                  >
                    {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Welcome back, <span className="text-violet-400">{userName}</span>
          </h1>
          <p className="text-lg text-zinc-400 mb-12">
            Ready to collaborate? Start a new session or join your team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
            {/* Create Room Card */}
            <Link href="/create-room" className="group">
              <div className="h-full p-8 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl hover:border-violet-500/50 hover:bg-zinc-900/60 transition-all duration-300 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                    <Plus size={100} />
                </div>
                
                <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 mb-6 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                  <Plus size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Create Room</h3>
                <p className="text-zinc-400">Start a new blank canvas and invite others to collaborate.</p>
              </div>
            </Link>

            {/* Join Room Card */}
            <Link href="/join-room" className="group">
              <div className="h-full p-8 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:bg-zinc-900/60 transition-all duration-300 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
                    <DoorOpen size={100} />
                </div>

                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <DoorOpen size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Join Room</h3>
                <p className="text-zinc-400">Enter a room code to jump into an existing session.</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>

      <ComingSoonModal 
        isOpen={comingSoonOpen} 
        onClose={() => setComingSoonOpen(false)} 
        featureName="Account Settings" 
      />
    </div>
  );
}