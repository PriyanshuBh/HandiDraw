"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Check, Copy, X, Share2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ShareRoomCodeModalProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ShareRoomCodeModal: React.FC<ShareRoomCodeModalProps> = ({ roomId, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
             {/* Header Icon */}
            <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 mb-6 shadow-inner ring-1 ring-violet-500/20">
                <Share2 size={32} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Invite Collaborators</h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed px-2">
                Share this code with your team to grant them access to the canvas.
            </p>
            
            {/* Code Box Container */}
            <div className="w-full relative">
                {/* Floating Label */}
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider absolute -top-2.5 left-4 bg-zinc-900 px-2 z-10">
                    Room Code
                </label>
                
                <div 
                    onClick={copyToClipboard}
                    className="w-full bg-zinc-950/50 border border-zinc-800 hover:border-violet-500/50 rounded-xl p-1 pr-1 pl-4 flex items-center justify-between gap-4 group cursor-pointer transition-all duration-200"
                >
                    <span className="text-violet-300 font-mono text-xl tracking-widest font-bold truncate">
                        {roomId}
                    </span>
                    <button
                        className={`
                            p-3 rounded-lg transition-all duration-200 shadow-lg
                            ${copied 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : 'bg-zinc-800 text-zinc-400 group-hover:bg-violet-600 group-hover:text-white'
                            }
                        `}
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <Copy className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
            
            <p className="text-xs text-zinc-500 mt-6">
                 Anyone with this code can join and edit.
            </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ShareRoomCodeModal;