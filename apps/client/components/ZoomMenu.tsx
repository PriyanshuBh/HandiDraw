import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ZoomMenuProps {
    zoom: number;
    setZoom: (z: number) => void;
}

export const ZoomMenu = ({ zoom, setZoom }: ZoomMenuProps) => {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex gap-3">
        <div className="bg-zinc-800/90 backdrop-blur-md border border-zinc-700 rounded-lg flex items-center p-1 shadow-xl">
            <button 
                onClick={() => setZoom(Math.max(10, zoom - 10))}
                className="p-2 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-md transition-colors"
                title="Zoom Out"
            >
                <Minus size={16} />
            </button>
            <span className="text-xs font-mono w-12 text-center text-zinc-300 select-none">{zoom}%</span>
            <button 
                onClick={() => setZoom(Math.min(500, zoom + 10))}
                className="p-2 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-md transition-colors"
                title="Zoom In"
            >
                <Plus size={16} />
            </button>
        </div>
    </div>
  );
};