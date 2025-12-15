import React from "react";
import { Color, Size, Stroke } from "../hooks/useDraw";
import { Palette, Minus, Type } from "lucide-react";

interface FilterProps {
  setColor: (color: Color) => void;
  color: Color;
  setSize: (size: Size) => void;
  size: Size;
  stroke: Stroke ;
  setStroke: (stroke: Stroke) => void;
}

const Filterbar = ({
  color,
  setColor,
  size,
  setSize,
  stroke,
  setStroke,
}: FilterProps) => {
  
  const colors: Color[] = [
    "#ffffff", // White
    "#FAB072", // Orange
    "#BB0000", // Red
    "#FF69B4", // Pink
    "#9158f4", // Purple
    "#00FF00", // Green
  ];

  const sizes = [
    { id: "S", size: 16 as Size },
    { id: "M", size: 24 as Size },
    { id: "L", size: 32 as Size },
    { id: "XL", size: 48 as Size },
  ];

  const strokes = [
    { id: "Thin", size: 1 as Stroke, height: "h-[2px]" },
    { id: "Medium", size: 3 as Stroke, height: "h-[4px]" },
    { id: "Bold", size: 5 as Stroke, height: "h-[6px]" },
  ];

  return (
    <div className=" top-24 left-4 z-40 select-none">
      <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 flex flex-col gap-6 p-5 rounded-2xl shadow-2xl w-56 animate-in slide-in-from-left-5 duration-300">
        
        {/* --- Stroke Color --- */}
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-zinc-400">
                <Palette size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Stroke Color</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {colors.map((colorId) => (
                <button
                    key={colorId}
                    onClick={() => setColor(colorId)}
                    className={`
                    w-full aspect-square rounded-md border transition-all duration-200 hover:scale-110
                    ${color === colorId 
                        ? 'border-white ring-2 ring-violet-500/50 shadow-lg shadow-violet-500/20' 
                        : 'border-zinc-700 hover:border-zinc-500'
                    }
                    `}
                    style={{ backgroundColor: colorId }}
                    title={colorId}
                />
                ))}
            </div>
        </div>

        <div className="h-px bg-zinc-800" />

        {/* --- Stroke Width --- */}
        <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 text-zinc-400">
                <Minus size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Stroke Width</span>
            </div>
            <div className="flex gap-2">
                {strokes.map((st) => (
                    <button
                        key={st.id}
                        onClick={() => setStroke(st.size)}
                        className={`
                            flex-1 h-9 rounded-lg border flex items-center justify-center transition-all
                            ${stroke === st.size 
                                ? 'bg-zinc-800 border-violet-500 text-white shadow-sm' 
                                : 'bg-zinc-950 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:bg-zinc-800'
                            }
                        `}
                        title={st.id}
                    >
                        <div className={`w-6 bg-current rounded-full ${st.height}`} />
                    </button>
                ))}
            </div>
        </div>

        <div className="h-px bg-zinc-800" />

        {/* --- Font Size --- */}
        <div> 
             <div className="flex items-center gap-2 text-zinc-400 mb-3">
                <Type size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Font Size</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => (
                <button
                    key={sz.id}
                    onClick={() => setSize(sz.size)}
                    className={`
                    flex-1 h-8 rounded-lg text-xs font-bold transition-all border flex items-center justify-center
                    ${size === sz.size 
                        ? 'bg-violet-600 border-violet-500 text-white' 
                        : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:text-white'
                    }
                    `}
                >
                    {sz.id}
                </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Filterbar;