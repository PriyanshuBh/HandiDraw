"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Edit3,
  Share2,
  Zap,
  Github,
  Moon,
  Bot,
  ArrowRight,
  PenTool,
  Palette,
  Sparkles,
  Star,
  ChevronDown,
  MousePointer2,
  Maximize,
  Download,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { useAuthStore } from "../stores/authStore/authStore";
// --- Visual Assets ---

const ScribbleUnderline = () => (
  <svg
    viewBox="0 0 300 20"
    className="absolute -bottom-2 left-0 w-full h-auto text-violet-500 opacity-80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M5 12C50 -5 100 25 295 5"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 1, ease: "easeOut" }}
    />
  </svg>
);

const BackgroundGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
            backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
    </div>
  );
};

const MeshGradient = () => {
  return (
    <div className="absolute z-0 inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-700/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-fuchsia-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
    </div>
  );
};

// --- Functional Components ---



const HeroCanvas = () => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.2 },
      },
    },
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50 }}
      style={{ perspective: "1000px" }}
      className="relative w-full max-w-5xl mx-auto aspect-[16/10] bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl shadow-violet-900/20 overflow-hidden mt-12 mb-20 group"
    >
      {/* App Toolbar UI */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 h-12 bg-zinc-800/80 backdrop-blur-md rounded-full px-4 flex items-center gap-3 border border-white/5 shadow-xl z-20">
        {[MousePointer2, Edit3, Palette,  Users].map((Icon, i) => (
          <div key={i} className={`p-2 rounded-lg cursor-pointer transition-all ${i === 1 ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-700'}`}>
            <Icon size={18} />
          </div>
        ))}
        <div className="w-px h-6 bg-zinc-700 mx-1" />
        <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
      </div>

      {/* Grid Pattern Inside Canvas */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

      {/* Drawing Area */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <svg viewBox="0 0 600 300" className="w-full h-full stroke-violet-400 stroke-[3] fill-none stroke-linecap-round stroke-linejoin-round drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
          {/* Box */}
          <motion.rect
            x="150" y="80" width="140" height="100" rx="4"
            variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          />
          {/* Circle */}
          <motion.circle
            cx="450" cy="130" r="50"
            variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 1 }}
          />
          {/* Connecting Arrow */}
          <motion.path
            d="M290 130 C 330 130, 360 130, 400 130"
            variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 2 }}
          />
           <motion.path
            d="M390 120 L 400 130 L 390 140"
            variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 2.2 }}
          />
        </svg>

        {/* Floating User Cursor */}
        <motion.div
          className="absolute z-10"
          initial={{ left: "30%", top: "70%", opacity: 0 }}
          animate={{ 
            left: ["30%", "25%", "25%", "50%", "72%"],
            top: ["70%", "30%", "27%", "43%", "43%"],
            opacity: [0, 1, 1, 1, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
        >
          <MousePointer2 className="text-emerald-500 fill-emerald-500/20" size={20} />
          <div className="ml-4 -mt-2 bg-emerald-500 text-black text-[10px] px-1.5 py-0.5 rounded font-bold">Alex</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const BentoItem = ({
  icon,
  title,
  description,
  className = "",
  delay = 0,
}: {
  icon: any;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`relative p-6 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-800/50 transition-all duration-300 group overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         {icon}
      </div>
      
      <div className="relative z-10">
        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-violet-400 mb-4 group-hover:bg-violet-500 group-hover:text-white transition-colors shadow-lg">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
      
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

const LandingPage = () => {
  const {  authUser ,checkAuth} = useAuthStore();
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const Navbar = () => {
    return (
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/5 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 pl-2">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-violet-500/20">
              <PenTool size={18} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              HandiDraw
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
            >
              {authUser?
                "Home":"Sign In"
  }
            </Link>
            <Link
              href="/signup"
              className="group flex items-center gap-2 bg-white text-zinc-950 px-4 py-2 rounded-lg text-sm font-bold hover:bg-violet-50 hover:scale-105 transition-all"
            >
              Start Drawing
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </motion.nav>
    );
  };
  return (
    <div className="relative min-h-screen text-zinc-100 overflow-x-hidden font-sans bg-zinc-950 selection:bg-violet-500/30 selection:text-violet-200">
      <MeshGradient />
      <BackgroundGrid />
      <Navbar />

      {/* --- Hero Section --- */}
      <section className="relative pt-40 pb-10 px-6">
        <div className="max-w-7xl mx-auto text-center z-10 relative">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            V2.0 is now live
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Whiteboarding for <br />
            <span className="relative inline-block text-white mt-2">
              visual thinkers
              <ScribbleUnderline />
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            HandiDraw is an infinite canvas that transforms your rough sketches into professional diagrams with a unique hand-drawn aesthetic.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/signin"
              className="h-12 px-8 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-violet-500/25 ring-offset-2 ring-offset-zinc-950 focus:ring-2 focus:ring-violet-500"
            >
              Start Sketching Free
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://github.com/PriyanshuBh/handidraw"
              className="h-12 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2 transition-all border border-zinc-800 hover:border-zinc-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={18} />
              Star on GitHub
            </a>
          </motion.div>

          <HeroCanvas />
        </div>
      </section>

      {/* --- Bento Grid Features --- */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Everything you need to <span className="text-violet-400">visualize</span> ideas.
            </h2>
            <p className="text-zinc-400 max-w-xl">
              Powerful enough for engineering diagrams, simple enough for quick brainstorming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large item */}
            <BentoItem
              className="md:col-span-2 md:row-span-2 min-h-[300px]"
              icon={<Zap size={32} />}
              title="Infinite Canvas"
              description="Never run out of space. Our infinite canvas lets you map out complex system architectures, mind maps, and user flows without hitting any boundaries. Pan and zoom with zero lag."
              delay={0.1}
            />
            
            <BentoItem
              icon={<Users size={24} />}
              title="Real-time Sync"
              description="Collaborate with your team instantly. See cursors and updates in real-time."
              delay={0.2}
            />
            
            <BentoItem
              icon={<Edit3 size={24} />}
              title="Auto-Beautify"
              description="Our algorithms smooth out your shaky mouse lines into perfect hand-drawn strokes."
              delay={0.3}
            />

            {/* Wide item */}
            <BentoItem
              className="md:col-span-2"
              icon={<Share2 size={24} />}
              title="Export Anywhere"
              description="Export your creations to PNG, SVG, or copy directly to clipboard to paste into Slack, Notion, or GitHub issues."
              delay={0.4}
            />

             <BentoItem
              icon={<Moon size={24} />}
              title="Dark Mode"
              description="First-class dark mode support for late night coding sessions."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-12 md:p-20 text-center overflow-hidden"
           >
              {/* Glow effects */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Ready to ditch the <br/> boring diagrams?
                </h2>
                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
                  Join thousands of developers and designers using HandiDraw to communicate complex ideas with style.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1"
                  >
                    Get Started for Free
                  </Link>
                </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 text-violet-500 p-2 rounded-lg border border-zinc-800">
              <PenTool size={20} />
            </div>
            <span className="text-lg font-bold text-zinc-200">
              HandiDraw
            </span>
          </div>
          
          <p className="text-zinc-500 text-sm">
            © 2025 HandiDraw. Built by Priyanshu Bharti.
          </p>

          <div className="flex gap-6">
            <a href="https://linkedin.com/in/priyanshu-bharti" className="text-zinc-500 hover:text-white transition-colors" target="_blank">
              LinkedIn
            </a>
            <a href="https://github.com/PriyanshuBh" className="text-zinc-500 hover:text-white transition-colors" target="_blank">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;



































// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Users,
//   Edit3,
//   Share2,
//   Zap,
//   Github,
//   Moon,
//   Sun,
//   Bot,
//   ArrowRight,
//   PenTool,
//   Palette,
//   Sparkles,
//   Star,
//   ChevronDown,
// } from "lucide-react";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useMotionValue,
//   useSpring,
// } from "motion/react";

// // --- Components ---

// const MeshGradient = () => {
//   return (
//     <div className="absolute z-0 inset-0 overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900-900/10 to-cyan-900/20" />
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
//       <div
//         className="absolute bottom-0 right-1/4 w-80 h-80  bg-purple-500/10 rounded-full blur-3xl animate-pulse"
//         style={{ animationDelay: "2s" }}
//       />
//     </div>
//   );
// };

// const BackgroundGrid = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       <svg
//         className="absolute inset-0 h-full w-full"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <defs>
//           <pattern
//             id="grid"
//             width="40"
//             height="40"
//             patternUnits="userSpaceOnUse"
//           >
//             <path
//               d="M 40 0 L 0 0 0 40"
//               fill="none"
//               stroke="rgba(255,255,255,0.05)"
//               strokeWidth="1"
//             />
//           </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#grid)" />
//       </svg>
//     </div>
//   );
// };

// const FloatingShapes = () => {
//   return (
//     <>
//       {/* Geometric Shapes */}
//       <motion.div
//         className="absolute top-20 left-20 w-4 h-4 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"
//         animate={{
//           y: [-20, 20, -20],
//           x: [-10, 10, -10],
//           scale: [1, 1.2, 1],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       />

//       <motion.div
//         className="absolute top-40 right-32 w-6 h-6 border-2 border-violet-300/30 rotate-45"
//         animate={{
//           rotate: [45, 135, 45],
//           scale: [1, 1.1, 1],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 1,
//         }}
//       />

//       <motion.div
//         className="absolute bottom-32 left-32 w-8 h-8 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-lg"
//         animate={{
//           rotate: [0, 180, 360],
//           y: [-15, 15, -15],
//         }}
//         transition={{
//           duration: 10,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 2,
//         }}
//       />

//       {/* Floating Icons */}
//       <motion.div
//         className="absolute top-32 left-1/4 text-violet-400/10"
//         animate={{
//           y: [-10, 10, -10],
//           rotate: [0, 5, -5, 0],
//           scale: [1, 1.1, 1],
//         }}
//         transition={{
//           duration: 7,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         <Palette size={48} />
//       </motion.div>

//       <motion.div
//         className="absolute top-1/3 right-20 text-purple-400/10"
//         animate={{
//           y: [-15, 15, -15],
//           x: [-5, 5, -5],
//           rotate: [0, -10, 10, 0],
//         }}
//         transition={{
//           duration: 9,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 3,
//         }}
//       >
//         <Edit3 size={36} />
//       </motion.div>

//       <motion.div
//         className="absolute bottom-1/3 left-16 text-purple-400/10"
//         animate={{
//           y: [-12, 12, -12],
//           rotate: [0, 15, -15, 0],
//           scale: [1, 1.2, 1],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 4,
//         }}
//       >
//         <Users size={42} />
//       </motion.div>

//       {/* Sparkle Effects */}
//       <motion.div
//         className="absolute top-24 right-1/4 text-violet-400/40"
//         animate={{
//           scale: [1, 1.5, 1],
//           opacity: [0.4, 1, 0.4],
//           rotate: [0, 180, 360],
//         }}
//         transition={{
//           duration: 3,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         <Sparkles size={20} />
//       </motion.div>

//       <motion.div
//         className="absolute bottom-40 right-1/3 text-purple-400/40"
//         animate={{
//           scale: [1, 1.3, 1],
//           opacity: [0.4, 0.8, 0.4],
//           y: [-5, 5, -5],
//         }}
//         transition={{
//           duration: 4,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 1.5,
//         }}
//       >
//         <Zap size={16} />
//       </motion.div>

//       <motion.div
//         className="absolute top-1/2 left-12 text-violet-300/30"
//         animate={{
//           scale: [1, 1.4, 1],
//           opacity: [0.3, 0.7, 0.3],
//           rotate: [0, -180, -360],
//         }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 2.5,
//         }}
//       >
//         <Star size={14} />
//       </motion.div>
//     </>
//   );
// };

// const ScrollIndicator = () => {
//   return (
//     <motion.div
//       className=" mx-auto flex flex-col items-center text-violet-300/60"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ delay: 2, duration: 1 }}
//     >
//       <span className="text-sm font-light mb-2 tracking-wide">
//         Scroll to explore
//       </span>
//       <motion.div
//         animate={{ y: [0, 8, 0] }}
//         transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//       >
//         <ChevronDown size={20} />
//       </motion.div>
//     </motion.div>
//   );
// };

// const Navbar = () => {
//   return (
//     <motion.nav
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800"
//     >
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="bg-violet-600 text-white p-1.5 rounded-lg shadow-lg shadow-violet-500/20">
//             <PenTool size={20} />
//           </div>
//           <span className="text-xl font-bold text-white tracking-tight">
//             HandiDraw
//           </span>
//         </div>
//         <div className="flex items-center gap-4">
//           <Link
//             href="/signin"
//             className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
//           >
//             Sign In
//           </Link>
//           <Link
//             href="/signup"
//             className="group flex items-center gap-2 bg-white text-zinc-950 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.2)]"
//           >
//             Start Drawing
//             <ArrowRight
//               size={14}
//               className="group-hover:translate-x-1 transition-transform"
//             />
//           </Link>
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// const TypewriterText = ({
//   text,
//   delay = 0,
// }: {
//   text: string;
//   delay?: number;
// }) => {
//   const [displayText, setDisplayText] = useState("");

//   useEffect(() => {
//     let timeout: NodeJS.Timeout;
//     let currentIndex = 0;

//     // Reset when text changes
//     setDisplayText("");

//     const typeChar = () => {
//       if (currentIndex < text.length) {
//         setDisplayText((prev) => prev + text.charAt(currentIndex));
//         currentIndex++;
//         // Random typing speed for realism
//         timeout = setTimeout(typeChar, 30 + Math.random() * 30);
//       }
//     };

//     const startTimeout = setTimeout(() => {
//       typeChar();
//     }, delay);

//     return () => {
//       clearTimeout(timeout);
//       clearTimeout(startTimeout);
//     };
//   }, [text, delay]);

//   return (
//     <span className="font-mono text-violet-300">
//       {displayText}
//       <motion.span
//         animate={{ opacity: [1, 0, 1] }}
//         transition={{ duration: 0.8, repeat: Infinity }}
//         className="text-white ml-1 inline-block w-2 h-4 bg-violet-500 align-middle"
//       />
//     </span>
//   );
// };

// const HeroCanvas = () => {
//   // FIXED: Replaced string "easeInOut" with cubic-bezier array [0.42, 0, 0.58, 1] to satisfy TypeScript
//   const pathVariants = {
//     hidden: { pathLength: 0, opacity: 0 },
//     visible: {
//       pathLength: 1,
//       opacity: 1,
//       transition: {
//         pathLength: {
//           duration: 2.5,
//           ease: [0.42, 0, 0.58, 1],
//         },
//         opacity: { duration: 0.01 },
//       },
//     },
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ delay: 0.2 }}
//       className="relative w-full max-w-4xl mx-auto aspect-[16/9] bg-zinc-900 rounded-xl border-2 border-zinc-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden mt-12 mb-20"
//     >
//       {/* Fake UI Header */}
//       <div className="absolute top-0 left-0 right-0 h-10 border-b border-zinc-800 flex items-center px-4 gap-2 bg-zinc-900/50">
//         <div className="flex gap-1.5">
//           <div className="w-3 h-3 rounded-full bg-red-500/80" />
//           <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
//           <div className="w-3 h-3 rounded-full bg-green-500/80" />
//         </div>
//         <div className="mx-auto flex gap-4">
//           <div className="w-6 h-6 bg-zinc-800  rounded flex items-center justify-center  text-zinc-400">
//             <Edit3 size={16} />
//           </div>
//           <div className="w-6 h-6 bg-zinc-800  rounded flex items-center justify-center  text-zinc-400">
//             <Users size={16} />
//           </div>
//           <div className="w-6 h-6 bg-violet-600   rounded flex items-center justify-center text-white">
//             <Bot size={16} />
//           </div>
//         </div>
//         <div className="flex gap-1.5">
//           <div className="w-3 h-3 rounded-full" />
//           <div className="w-3 h-3 rounded-full " />
//           <div className="w-3 h-3 rounded-full " />
//         </div>
//       </div>

//       {/* Drawing Area */}
//       <div className="absolute inset-0 top-10 flex items-center justify-center p-8">
//         <svg
//           viewBox="0 0 400 200"
//           className="w-full h-full stroke-violet-400 stroke-[3] fill-none stroke-linecap-round stroke-linejoin-round filter drop-shadow-[0_0_8px_rgba(167,139,250,0.3)]"
//         >
//           {/* A simple diagram drawing animation */}
//           <motion.rect
//             x="50"
//             y="50"
//             width="100"
//             height="80"
//             rx="4"
//             variants={pathVariants}
//             initial="hidden"
//             whileInView="visible" // Animation runs when it enters the viewport
//             viewport={{ once: true, amount: 0.5 }}
//           />
//           <motion.circle
//             cx="300"
//             cy="90"
//             r="40"
//             variants={pathVariants}
//             initial="hidden"
//             whileInView="visible" // Animation runs when it enters the viewport
//             viewport={{ once: true, amount: 0.5 }}
//             transition={{ delay: 1 }}
//           />
//           <motion.path
//             d="M155 90 L255 90"
//             variants={pathVariants}
//             initial="hidden"
//             whileInView="visible" // Animation runs when it enters the viewport
//             viewport={{ once: true, amount: 0.5 }}
//             transition={{ delay: 2 }}
//           />
//           <motion.path
//             d="M250 85 L260 90 L250 95"
//             variants={pathVariants}
//             initial="hidden"
//             whileInView="visible" // Animation runs when it enters the viewport
//             viewport={{ once: true, amount: 0.5 }}
//             transition={{ delay: 2.2 }}
//           />
//         </svg>

//         {/* Floating Cursor */}
//         <motion.div
//           className="absolute"
//           initial={{ left: "20%", top: "40%" }}
//           animate={{
//             left: ["20%", "45%", "65%", "60%"],
//             top: ["40%", "40%", "50%", "55%"],
//           }}
//           transition={{
//             duration: 4,
//             repeat: Infinity,
//             repeatType: "reverse",
//             ease: "easeInOut",
//           }}
//         >
//           <PenTool
//             className="text-emerald-400 fill-zinc-900 rotate-180 drop-shadow-md"
//             size={24}
//           />
//           <div className="ml-4 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap">
//             You
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// const FeatureItem = ({
//   icon,
//   title,
//   description,
//   delay,
// }: {
//   icon: any;
//   title: string;
//   description: string;
//   delay: number;
// }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay, duration: 0.5 }}
//       whileHover={{ y: -5 }}
//       className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg hover:shadow-[4px_4px_0px_0px_rgba(167,139,250,0.5)] hover:border-violet-500/30 transition-all duration-300 group"
//     >
//       <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center text-violet-400 mb-4 group-hover:text-violet-300 group-hover:bg-violet-500/20 transition-colors">
//         {icon}
//       </div>
//       <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
//       <p className="text-zinc-400 leading-relaxed">{description}</p>
//     </motion.div>
//   );
// };

// const LandingPage = () => {
//   return (
//     <div className="relative min-h-screen text-zinc-100 overflow-x-hidden font-sans bg-zinc-950 selection:bg-violet-500/30 selection:text-violet-200 ">
//       {/* <DotBackground /> */}
//       <MeshGradient />
//       {/* <BackgroundGrid /> */}
//       <FloatingShapes />

//       {/* <Navbar /> */}

//       {/* Hero Section */}
//       <section className="relative pt-32 pb-10 px-6">
//         <div className="max-w-7xl mx-auto text-center z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <a
//               href="http://priyanshubharti.vercel.app"
//               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6 shadow-[3px_3px_0px_0px_#fff] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#fff] "
//               target={"_blank"}
//               rel="noopener noreferrer"
//             >
//               <span className="relative flex h-2 w-2 ">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500 "></span>
//               </span>
//               Personal Portfolio
//             </a>

//             <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight text-white mb-6">
//               Virtual whiteboard for <br />
//               <span className="relative inline-block text-violet-400">
//                 drawing ideas.
//                 <motion.div
//                   initial={{ width: 0, opacity: 0 }}
//                   animate={{ width: "480px", opacity: 1 }}
//                   transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
//                   className="h-1.5 bg-gradient-to-r mt-6 from-violet-500 via-pink-400 to-fuchsia-500 mx-auto rounded-full shadow-lg shadow-emerald-500/50"
//                 />
//                 {/* <svg
//                   className="absolute w-full h-3 -bottom-1 left-0 text-violet-500/30 "
//                   viewBox="0 0 100 10"
//                   preserveAspectRatio="none"
//                 >
//                   <path
//                     d="M0 5 Q 50 10 100 5"
//                     stroke="currentColor"
//                     strokeWidth="8"
//                     fill="none"
//                   />
//                 </svg> */}
//               </span>
//             </h1>

//             <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
//               HandiDraw is a virtual collaborative whiteboard tool that lets you
//               easily sketch diagrams that have a hand-drawn feel.
//             </p>
//             {/* <TypewriterText text="HandiDraw is a virtual collaborative whiteboard tool that lets you
//               easily sketch diagrams that have a hand-drawn feel."/> */}

//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative  mb-24">
//               <Link
//                 href="/signin"
//                 className="h-12 px-8 rounded-lg bg-violet-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-violet-500 transition-all shadow-[4px_4px_0px_0px_#fff] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#fff] border-2 border-zinc-950"
//               >
//                 Start Drawing Now
//                 <Edit3 size={18} />
//               </Link>
//               <a
//                 href="https://github.com/PriyanshuBh/handidraw"
//                 className="h-12 px-8 rounded-lg bg-zinc-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all border-2 border-zinc-700 hover:border-zinc-600 shadow-[4px_4px_0px_0px_#fff] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#fff] "
//                 target={"_blank"}
//                 rel="noopener noreferrer"
//               >
//                 <Github size={20} />
//                 Star on GitHub
//               </a>
//             </div>

//             <ScrollIndicator />
//           </motion.div>
          
//           {/* Interactive Preview Canvas */}
//           <HeroCanvas />
//         </div>
        
//       </section>
   
        
//       {/* Social Proof */}
//       {/* <div className="w-full border-y border-zinc-800 bg-zinc-900/30 backdrop-blur-sm py-10">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//             <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Trusted by teams at</p>
//             <motion.div 
//             className=""
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 text-zinc-500">
//                 <span className="text-xl font-bold">ACME Corp</span>
//                 <span className="text-xl font-bold">Stark Ind</span>
//                 <span className="text-xl font-bold">Wayne Ent</span>
//                 <span className="text-xl font-bold">Cyberdyne</span>
//             </div>
//           </motion.div>
//         </div>
//       </div> */}

//       {/* Features Grid */}
//       <section className="py-16 px-6 relative">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//               Why use HandiDraw?
//             </h2>
//             <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
//               Built for speed and simplicity. No learning curve, just open and
//               start creating.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <FeatureItem
//               icon={<Zap />}
//               title="Infinite Canvas"
//               description="Never run out of space. Our infinite canvas lets you map out complex ideas without boundaries."
//               delay={0.1}
//             />
//             <FeatureItem
//               icon={<Users />}
//               title="Real-time Collaboration"
//               description="Work together with your team in real-time. See cursors and updates instantly as they happen."
//               delay={0.2}
//             />
//             <FeatureItem
//               icon={<Share2 />}
//               title="Easy Sharing"
//               description="Share your drawings via a simple link. Export to PNG, SVG, or copy to clipboard instantly."
//               delay={0.3}
//             />
//             <FeatureItem
//               icon={<Edit3 />}
//               title="Hand-drawn Feel"
//               description="Our algorithms smooth out your lines to make them look like professional sketches."
//               delay={0.4}
//             />
//             <FeatureItem
//               icon={<Moon />}
//               title="Dark Mode Ready"
//               description="Switch between light and dark modes to suit your environment and reduce eye strain."
//               delay={0.5}
//             />
//             <FeatureItem
//               icon={<Github />}
//               title="Open Source"
//               description="Transparent code and community-driven development. Customize it to your needs."
//               delay={0.6}
//             />
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 px-6 ">
//         <motion.div
//           className=""
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.2 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl backdrop-blur-xl  shadow-violet-500/10 ">
//             {/* Decorative circles */}
//             <div className="absolute top-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
//             <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

//             <div className="relative z-10">
//               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
//                 Ready to visualize your workflow?
//               </h2>
//               <motion.div
//                 className=""
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.3, duration: 0.5 }}
//               >
//                 <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
//                   Join thousands of developers, designers, and managers who use
//                   HandiDraw to communicate ideas clearly.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                   <Link
//                     href="/signup"
//                     className="px-8 py-4 bg-violet-600 hover:bg-violet-500 border-2 border-zinc-950 text-white rounded-xl font-bold text-lg transition-all shadow-[4px_4px_0px_0px_#ffffff] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff] "
//                   >
//                     Get Started for Free
//                   </Link>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </motion.div>
//       </section>

//       {/* Simple Footer */}
//       <footer className="py-8 border-t border-zinc-800  relative">
//         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
//           <motion.h4
//             className="text-2xl font-bold  bg-linear-to-b from-violet-400 to-violet-500/80 bg-clip-text text-transparent"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="flex items-center gap-2">
//               <div className="bg-violet-600 text-white p-1.5 rounded-lg shadow-lg shadow-violet-500/20">
//                 <PenTool size={20} />
//               </div>
//               <span className="text-xl font-bold text-white tracking-tight">
//                 HandiDraw
//               </span>
//             </div>
//           </motion.h4>
//           <motion.p
//             className="text-gray-400"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             © 2025 HandiDraw. Released under MIT License.
//           </motion.p>

//           <motion.div
//             className="flex gap-6 "
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//           >
//             <a
//               href="https://linkedin.com/in/priyanshu-bharti"
//               className="text-gray-400 hover:text-white text-sm transition-colors"
//               target={"_blank"}
//               rel="noopener noreferrer"
//             >
//               LinkedIn
//             </a>
//             <a
//               href="https://github.com/PriyanshuBh"
//               className="text-gray-400 hover:text-white text-sm transition-colors"
//               target={"_blank"}
//               rel="noopener noreferrer"
//             >
//               GitHub
//             </a>
//             {/* <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Discord</a> */}
//           </motion.div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
