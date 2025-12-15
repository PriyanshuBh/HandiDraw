"use client";
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export const ComingSoonModal = ({ isOpen, onClose, featureName }: ComingSoonModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 mb-4 border border-violet-500/20">
                <Sparkles size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                The <span className="text-violet-400 font-semibold">{featureName}</span> feature is currently under development. Stay tuned for more updates!
              </p>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors border border-zinc-700"
              >
                Got it
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
