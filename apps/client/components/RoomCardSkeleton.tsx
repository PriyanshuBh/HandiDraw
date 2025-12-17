const RoomCardSkeleton = () => {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 aspect-square flex flex-col justify-between animate-pulse">
      
      {/* --- Header: Icon Placeholder --- */}
      <div className="flex justify-between items-start">
        {/* Icon box */}
        <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl"></div>
        {/* Optional menu placeholder */}
        <div className="w-8 h-8 bg-zinc-800/30 rounded-lg hidden sm:block"></div>
      </div>

      {/* --- Middle: Title Placeholders --- */}
      <div className="mt-4 mb-2">
        {/* Title line */}
        <div className="h-6 bg-zinc-800/50 rounded-md w-3/4 mb-3"></div>
        {/* "Edited recently" line */}
        <div className="h-3 bg-zinc-800/30 rounded-md w-1/3"></div>
      </div>

      {/* --- Footer: Button Placeholder --- */}
      <div className="pt-4 mt-auto">
        <div className="h-12 bg-zinc-800/50 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;