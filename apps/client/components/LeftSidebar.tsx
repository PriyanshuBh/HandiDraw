import React from 'react';
import { Menu, FolderOpen, Image as ImageIcon, Github, Twitter, Linkedin, Moon, Sun, Monitor, Trash2, Download, Users, LogIn, Command } from 'lucide-react';
import Filterbar from './Filterbar';
import { Size, Stroke, Tool } from '../hooks/useDraw'; // Import Tool type
import { ComingSoonModal } from './ComingSoonModal';

interface LeftSidebarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  size: Size;
  setSize: (size: Size) => void;
  stroke: Stroke;
  setStroke: (stroke: Stroke) => void;
  onShare: () => void; // Added onShare prop
}

export const LeftSidebar = ({ tool, setTool, color, setColor, size, setSize, stroke, setStroke, onShare }: LeftSidebarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [comingSoon, setComingSoon] = React.useState<{ open: boolean; feature: string }>({
    open: false,
    feature: ''
  });

  const showComingSoon = (feature: string) => {
    setComingSoon({ open: true, feature });
  };

  return (
    <div className="fixed top-4 left-4 z-40 flex flex-col gap-4">
      {/* Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2.5 rounded-lg transition-colors border border-zinc-700 shadow-xl w-10 h-10"
      >
        <Menu size={20} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        
        <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl p-2 flex flex-col w-60 shadow-2xl animate-in slide-in-from-top-2">
           
         <Filterbar color={color} setColor={setColor} stroke={stroke as Stroke} setStroke={setStroke} size={size} setSize={setSize} />
    
            <div className="flex flex-col gap-0.5 border-b border-zinc-800 pb-2 mb-2">
                <SidebarItem icon={Trash2} label="Clear canvas" onClick={() => showComingSoon('Clear Canvas')} />
                <SidebarItem icon={Download} label="Export Drawing" onClick={() => showComingSoon('Export Drawing')} />
                <SidebarItem icon={Users} label="Live collaboration" onClick={() => { setIsOpen(false); onShare(); }} />
            </div>
            <div className="p-2">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2 px-1">
                    <span>Theme</span>
                    <div className="flex bg-zinc-800 rounded-lg p-0.5">
                        <button onClick={() => showComingSoon('Light Mode')} className="p-1.5 hover:text-white rounded-md"><Sun size={14} /></button>
                        <button onClick={() => showComingSoon('Dark Mode')} className="p-1.5 bg-zinc-700 text-white rounded-md shadow-sm"><Moon size={14} /></button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <ComingSoonModal 
        isOpen={comingSoon.open} 
        onClose={() => setComingSoon({ ...comingSoon, open: false })} 
        featureName={comingSoon.feature} 
      />
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);