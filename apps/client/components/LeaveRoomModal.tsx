"use client";
import { useAuthStore } from '../stores/authStore/authStore'
import { X, LogOut, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from "react-dom";

interface LeaveRoomModalProps {
  socket: WebSocket;
  roomId: string;
}

const LeaveRoomModal: React.FC<LeaveRoomModalProps> = ({ socket, roomId }) => {
  const { changeModalVisibility } = useAuthStore()
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
        setMounted(false);
        document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        changeModalVisibility();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [changeModalVisibility]);

  const leaveRoomHandler = () => {
    // Send leave_room message to ws-server
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "leave_room",
        roomId
      }));
    }
    router.replace("/home")
    changeModalVisibility()
  }

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Top Warning Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
          onClick={changeModalVisibility}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-5">
                <LogOut size={24} className="ml-1" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Leave Session?</h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Are you sure you want to exit? You can rejoin later using the Room ID.
            </p>

            <div className="flex flex-col-reverse sm:flex-row w-full gap-3">
                <button
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-3 rounded-xl font-semibold transition-colors"
                    onClick={changeModalVisibility}
                >
                    Cancel
                </button>
                <button
                    onClick={leaveRoomHandler}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20 transition-all transform active:scale-95"
                >
                    Yes, Leave
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default LeaveRoomModal;