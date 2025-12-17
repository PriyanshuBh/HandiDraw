"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Layout, MoreVertical, ArrowRight } from "lucide-react";
import DeleteRoomModal from "./DeleteRoomModal";

interface RoomCardProps {
  id: string;
  name: string;
  onDelete: (id: string) => Promise<void>;
}

const RoomCard: React.FC<RoomCardProps> = ({ id, name, onDelete }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Refs for dropdown and button
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleJoin = () => {
    router.push(`/canvas/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    await onDelete(id);
    setDeleting(false);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    if (!deleting) setShowModal(false);
  };

  return (
    <>
      <div
        className="group relative bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 aspect-square cursor-pointer hover:border-violet-500/30 hover:bg-zinc-900/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/10 flex flex-col justify-between overflow-hidden"
        onClick={handleJoin}
      >
         {/* Background gradient splash */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-violet-500/20 transition-all duration-500" />

        {/* --- Header: Icon & Menu --- */}
        <div className="flex justify-between items-start z-10">
            <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors duration-300">
                <Layout size={24} />
            </div>

            {/* 3-dots menu for mobile */}
            <div className="sm:hidden relative">
            <button
                ref={buttonRef}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                onClick={e => {
                    e.stopPropagation();
                    setShowDropdown((prev) => !prev);
                }}
            >
                <MoreVertical size={20} />
            </button>
            {showDropdown && (
                <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-30 overflow-hidden"
                >
                    <button
                        className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-zinc-800/50 hover:text-red-300 w-full transition-colors text-sm font-medium"
                        onClick={handleDeleteClick}
                    >
                        <Trash2 size={16} />
                        Delete Room
                    </button>
                </div>
            )}
            </div>

            {/* Delete button for desktop (visible on hover) */}
            <button
                className="hidden sm:flex items-center justify-center p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={handleDeleteClick}
                title="Delete Room"
            >
                <Trash2 size={18} />
            </button>
        </div>

        {/* --- Content: Room Name --- */}
        <div className="relative z-10 mt-4 mb-2">
          <h3 className="text-xl font-bold text-white truncate group-hover:text-violet-100 transition-colors" title={name}>
            {name}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Edited recently</p>
        </div>

        {/* --- Footer: Join Button --- */}
        <div className="relative z-10 pt-4 mt-auto">
          <button
            className={`
              w-full flex items-center justify-between bg-zinc-800 text-zinc-300 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300
              group-hover:bg-violet-600 group-hover:text-white
            `}
            onClick={e => {
              e.stopPropagation();
              handleJoin();
            }}
          >
            <span>Open Canvas</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {showModal && (
        <DeleteRoomModal
          roomName={name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          deleting={deleting}
        />
      )}
    </>
  );
};

export default RoomCard;