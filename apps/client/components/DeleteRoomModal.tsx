"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, X, AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";

interface DeleteRoomModalProps {
  roomName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting?: boolean;
}

const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({
  roomName,
  onConfirm,
  onCancel,
  deleting = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        if (!deleting) onCancel();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onCancel, deleting]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-sm relative animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Warning Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
          onClick={onCancel}
          disabled={deleting}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-5">
                <AlertTriangle size={28} />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Delete Room?</h2>
            
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
             Are you sure you want to delete <span className="font-semibold text-zinc-200">"{roomName}"</span>? This action cannot be undone and all drawings will be lost.
            </p>

            <div className="flex flex-col-reverse sm:flex-row w-full gap-3">
            <button
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50"
                onClick={onCancel}
                disabled={deleting}
            >
                Cancel
            </button>
            <button
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center shadow-lg shadow-red-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={onConfirm}
                disabled={deleting}
            >
                {deleting ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Deleting...
                    </>
                ) : (
                    "Delete"
                )}
            </button>
            </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteRoomModal;