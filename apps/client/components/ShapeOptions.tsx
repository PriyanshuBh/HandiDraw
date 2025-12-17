import React from 'react'
import { Circle, Eraser, Minus, MousePointer2, MoveRight, Pencil, Square, Type, Sparkles, Hand, Diamond } from 'lucide-react'
import { Tool } from '../hooks/useDraw'

export const ShapeOptions = ({tool, setTool}: {tool: Tool, setTool: (s: Tool) => void}) => {
    
    const tools = [
        { id: "HAND", icon: Hand, label: "Pan (Grab)" },
        { id: "SELECT", icon: MousePointer2, label: "Select" },
        { id: "divider" },
        { id: "PENCIL", icon: Pencil, label: "Pencil" },
        { id: "RECTANGLE", icon: Square, label: "Rectangle" },
        { id: "DIAMOND", icon: Diamond, label: "Diamond" }, // New Button
        { id: "CIRCLE", icon: Circle, label: "Circle" },
        { id: "ARROW", icon: MoveRight, label: "Arrow" },
        { id: "LINE", icon: Minus, label: "Line" },
        { id: "TEXT", icon: Type, label: "Text" },
        { id: "divider" },
        { id: "ERASER", icon: Eraser, label: "Eraser" },
        { id: "divider" },
        { id: "AI", icon: Sparkles, label: "Ask AI" },
    ];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-2 rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/50">
            {tools.map((t, index) => {
                if (t.id === "divider") {
                    return <div key={`div-${index}`} className="w-px h-6 bg-zinc-800 mx-1" />;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Icon = t.icon as any;
                const isActive = t.id === tool;
                
                return (
                    <button
                        key={t.id}
                        onClick={() => setTool(t.id as Tool)}
                        title={t.label}
                        className={`
                            group relative p-3 rounded-xl transition-all duration-200
                            ${isActive 
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 ring-1 ring-white/10" 
                                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            }
                        `}
                    >
                        <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-100' : 'group-hover:scale-110'}`} />
                        {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-50" />}
                    </button>
                );
            })}
        </div>
    </div>
  )
}