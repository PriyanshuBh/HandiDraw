"use client";
import React, { useEffect, useRef, useState } from "react";
import { ShapeOptions } from "./ShapeOptions";
import { Tool, useDraw } from "../hooks/useDraw";
import Filterbar from "./Filterbar";
import { DrawShapes } from "../draw/drawShape";
import { LeftSidebar } from "./LeftSidebar"; 
import { ZoomMenu } from "./ZoomMenu";       
import LeaveRoom from "./LeaveRoom";
import AIModal from "./AIModal";
import { useAuthStore } from "../stores/authStore/authStore";
import { Loader2, Share2 } from "lucide-react";
import { createPortal } from "react-dom";
import ShareRoomCodeModal from "./ShareRoomCodeModal";
import { motion, AnimatePresence } from "motion/react";

function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const { tool, changeTool, color, changeColor, size, changeSize, stroke, changeStroke, zoom, setZoom } = useDraw();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawShapeRef = useRef<DrawShapes | null>(null);
  
  const [showTextArea, setShowTextArea] = useState(false);
  const [textAreaPosition, setTextAreaPosition] = useState({ x: 0, y: 0 }); // Screen Coordinates
  const [textContent, setTextContent] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [showAIModal, setShowAIModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => { if (!authUser) checkAuth(); }, [authUser, checkAuth]);

  useEffect(() => {
    if (canvasRef.current && authUser) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      const g = new DrawShapes(socket, roomId, canvasRef.current, tool as Tool, color, stroke, (newZoomPercent) => {
        setZoom(newZoomPercent); 
      });
      drawShapeRef.current = g;
      g.handleResize(); // Initial size set

      return () => g.removeEventListeners();
    }
  }, [roomId, socket, authUser, setZoom]);

  useEffect(() => { drawShapeRef.current?.setTool(tool as Tool); }, [tool]);
  useEffect(() => { drawShapeRef.current?.setColor(color); }, [color]);
  useEffect(() => { drawShapeRef.current?.setStroke(stroke); }, [stroke]);
  useEffect(() => { drawShapeRef.current?.setFontSize(size); }, [size]);
  useEffect(() => { drawShapeRef.current?.setZoom(zoom); }, [zoom]);
  useEffect(() => { if (tool === "AI") setShowAIModal(true); }, [tool]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "TEXT") {
        if (showTextArea && textContent.trim()) {
            drawShapeRef.current?.addText(textContent, textAreaPosition.x, textAreaPosition.y); 
        }

        const rect = canvasRef.current?.getBoundingClientRect();
        const x = e.clientX - (rect?.left || 0);
        const y = e.clientY - (rect?.top || 0);

        setTextAreaPosition({ x, y });
        setShowTextArea(true);
        setTextContent("");
        
        setTimeout(() => textAreaRef.current?.focus(), 10);
    }
  };

  const handleTextAreaBlur = () => {
      if (textContent.trim()) {
          drawShapeRef.current?.addText(textContent, textAreaPosition.x, textAreaPosition.y + 10); 
      }
      setShowTextArea(false);
      setTextContent("");
  };

// NEW CODE (Fixes ReferenceError)
if (!authUser || isCheckingAuth) {
  // 1. Check if we are in the browser
  // if (typeof window !== "undefined" && document.body) {
  //     return createPortal(
  //         <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 z-[9999]">
  //             <Loader2 className="animate-spin size-10 text-violet-500" />
  //         </div>,
  //         document.body
  //     );
  // }
  // 2. Return basic loader or null for Server-Side Rendering
  return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
          <Loader2 className="animate-spin size-10 text-violet-500" />
      </div>
  );
}

  return (
    <div className="h-screen w-screen bg-zinc-950 overflow-hidden relative selection:bg-transparent text-zinc-100 font-sans">
      <LeftSidebar 
      tool={tool as Tool}     
      setTool={changeTool}
        color={color}
        setColor={changeColor}
        stroke={stroke}
        setStroke={changeStroke}
        size={size}
        setSize={changeSize}
        onShare={() => setShowShareModal(true)}
      />
      
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
         <ShapeOptions tool={tool as Tool} setTool={changeTool} />
      </div>
 
      <div className="fixed top-4 z-50 flex items-center gap-3">
        <button onClick={() => setShowShareModal(true)} className="group fixed top-4 right-16 bg-violet-600 hover:bg-violet-500 text-white px-2.5 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all flex items-center gap-2">
            <Share2 size={16} className='size-5 transition-transform group-hover:scale-95' />
        </button>
        <LeaveRoom socket={socket} roomId={roomId} />
      </div>

      {showTextArea && (
        <textarea
            ref={textAreaRef}
            className="fixed z-50 bg-transparent border border-violet-500/50 rounded-lg px-2 py-1 outline-none resize-none overflow-hidden shadow-xl"
            style={{
                left: textAreaPosition.x,
                top: textAreaPosition.y,
                color: color,
                fontFamily: "'Architects Daughter', cursive",
                fontSize: `${size}px`,
                minWidth: "100px"
            }}
            value={textContent}
            placeholder="Type here..."
            autoFocus
            onChange={(e) => {
                setTextContent(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
                e.target.style.width = 'auto';
                e.target.style.width = Math.max(100, e.target.scrollWidth) + 'px';
            }}
            onBlur={handleTextAreaBlur} 
            onKeyDown={(e) => e.stopPropagation()} 
        />
      )}

      <canvas 
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block touch-none cursor-crosshair active:cursor-grabbing focus:outline-none"
        onContextMenu={(e) => e.preventDefault()}
      />

      <AnimatePresence>
        {tool === "SELECT" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-16 left-4 z-50 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-md border border-violet-500/20 rounded-lg shadow-2xl pointer-events-none"
          >
            <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-300">
              <span className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[11px] text-violet-400">Shift</span>
              <span>+ Click to multi-select</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ZoomMenu 
        zoom={Math.round(zoom)} 
        setZoom={setZoom} 
      />

      <AIModal userId={authUser?.id || ""} roomId={roomId} open={showAIModal && !!authUser?.id} onClose={() => { setShowAIModal(false); changeTool("SELECT"); }} changeTool={changeTool} drawShapeRef={drawShapeRef} />
      <ShareRoomCodeModal roomId={roomId} isOpen={showShareModal} onClose={() => setShowShareModal(false)} />

    </div>
  );
}

export default Canvas;