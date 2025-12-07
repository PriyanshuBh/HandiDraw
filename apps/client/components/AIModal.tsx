"use client";
import { Tool } from "../hooks/useDraw";
import { 
    Loader2, X, Box, Workflow, ArrowLeft, 
    Sparkles, CheckCircle2 
} from "lucide-react";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { AxiosInstance } from "../lib/axios";
import { DrawShapes, Shapes } from "../draw/drawShape";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

interface AIModalProps {
  roomId: string;
  userId: string;
  open: boolean;
  onClose: () => void;
  changeTool?: (tool: Tool) => void;
  drawShapeRef: RefObject<DrawShapes | null>;
}

const AIModal: React.FC<AIModalProps> = ({ open, onClose, changeTool, drawShapeRef, roomId, userId }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [objectPrompt, setObjectPrompt] = useState("");
  const [flowPrompt, setFlowPrompt] = useState("");
  const [activeSection, setActiveSection] = useState<"object" | "flow" | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Shapes[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>("");
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
        document.removeEventListener("mousedown", handleClick);
        document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    if (response && Array.isArray(response) && previewCanvasRef.current) {
      const ctx = previewCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 480, 320);
        // Draw grid background for preview
        ctx.fillStyle = "#18181b"; // Zinc-950
        ctx.fillRect(0, 0, 480, 320);
        
        drawShapeRef.current?.drawGeneratedShapes(ctx, response, roomId, userId, 480, 320);
      }
    }
  }, [response]);

  const handleClose = () => {
    if (changeTool) changeTool("PENCIL"); // Reset to pencil or select
    onClose();
    setTimeout(() => resetModal(), 300); // Reset after animation
  };

  const handleSubmit = async (type: "OBJECT" | "FLOWCHART", content: string) => {
    if (!userId) {
      setError("You must be logged in to use AI features.");
      return;
    }
    setLoading(true);
    setResponse(null);
    setError(null);
    setLastPrompt(content);
    
    try {
      const res = await AxiosInstance.post("/user/generate-drawing", { type, content, roomId });
      setResponse(res.data.result || res.data);
      setObjectPrompt("");
      setFlowPrompt("");
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to generate drawing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const insertIntoCanvas = () => {
    drawShapeRef.current?.pushToExistingShapes(userId);
    handleClose();
  };

  const resetModal = () => {
    setActiveSection(null);
    setResponse(null);
    setError(null);
    setObjectPrompt("");
    setFlowPrompt("");
    setLastPrompt("");
  };

  const renderPrompt = (prompt: string) => {
    if (prompt.length <= 50) return <span className="italic">"{prompt}"</span>;
    
    return (
      <span className="italic">
        "{isPromptExpanded ? prompt : `${prompt.slice(0, 50)}...`}"
        <button 
          onClick={() => setIsPromptExpanded(!isPromptExpanded)}
          className="ml-2 text-xs text-violet-400 hover:text-violet-300 font-bold underline"
        >
          {isPromptExpanded ? "less" : "more"}
        </button>
      </span>
    );
  };

  if (!open || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={`
            bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300
            ${response ? "w-full max-w-2xl" : "w-full max-w-lg"}
        `}
      >
        {/* Header Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors z-20"
          onClick={handleClose}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-violet-500/10 rounded-xl text-violet-400">
                    <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
            </div>
            <p className="text-zinc-400 text-sm">
                {!activeSection 
                    ? "Choose a mode to start generating shapes." 
                    : activeSection === 'object' 
                        ? "Describe an object and I'll draw it for you."
                        : "Describe a process and I'll create a flowchart."
                }
            </p>
        </div>

        <div className="px-8 pb-8 flex-1 overflow-y-auto max-h-[80vh]">
            
            {/* --- 1. SELECTION MENU --- */}
            {!activeSection && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <button
                        onClick={() => setActiveSection("object")}
                        className="group relative flex flex-col items-center justify-center p-6 gap-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800 hover:border-violet-500/50 transition-all duration-300"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            <Box size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-white text-lg mb-1">Object</h3>
                            <p className="text-zinc-500 text-xs leading-relaxed">Generate simple vector objects like cars, houses, or icons.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSection("flow")}
                        className="group relative flex flex-col items-center justify-center p-6 gap-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800 hover:border-violet-500/50 transition-all duration-300"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                            <Workflow size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-white text-lg mb-1">Flowchart</h3>
                            <p className="text-zinc-500 text-xs leading-relaxed">Create diagrams for algorithms, processes, or user flows.</p>
                        </div>
                    </button>
                </div>
            )}

            {/* --- 2. INPUT FORM --- */}
            {(activeSection && !response) && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={() => { setActiveSection(null); setError(null); }}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft size={14} /> Back
                    </button>

                    <div className="flex flex-col gap-4">
                        {activeSection === 'object' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-emerald-400">Object Description</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                    placeholder="e.g. A red sports car side view..."
                                    value={objectPrompt}
                                    onChange={(e) => setObjectPrompt(e.target.value)}
                                    autoFocus
                                    disabled={loading}
                                    onKeyDown={(e) => e.key === 'Enter' && !loading && objectPrompt.trim() && handleSubmit("OBJECT", objectPrompt)}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-purple-400">Process Description</label>
                                <textarea
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none min-h-[100px]"
                                    placeholder="e.g. Login flow: Enter credentials -> Validate -> Success/Error..."
                                    value={flowPrompt}
                                    onChange={(e) => setFlowPrompt(e.target.value)}
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={() => {
                                if (activeSection === 'object') handleSubmit("OBJECT", objectPrompt);
                                else handleSubmit("FLOWCHART", flowPrompt);
                            }}
                            disabled={loading || (activeSection === 'object' ? !objectPrompt.trim() : !flowPrompt.trim())}
                            className={`
                                w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                                ${activeSection === 'object' 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' 
                                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            {loading ? "Generating..." : "Generate Drawing"}
                        </button>
                    </div>
                </div>
            )}

            {/* --- 3. PREVIEW & CONFIRM --- */}
            {response && (
                <div className="animate-in zoom-in-95 duration-300 flex flex-col gap-6">
                    <div className="flex flex-col gap-1 text-center">
                        <div className="text-zinc-400 text-sm">Generated result for:</div>
                        <div className="text-white text-sm px-4">{renderPrompt(lastPrompt)}</div>
                    </div>

                    <div className="relative w-full aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center">
                        <canvas
                            ref={previewCanvasRef}
                            width={480}
                            height={320}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setResponse(null); }}
                            className="flex-1 py-3 rounded-xl font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
                        >
                            Discard
                        </button>
                        <button
                            onClick={insertIntoCanvas}
                            className="flex-[2] py-3 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={20} />
                            Add to Canvas
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AIModal;