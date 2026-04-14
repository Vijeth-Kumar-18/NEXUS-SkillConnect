"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EntryLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 4 seconds loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="entry-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none overflow-hidden bg-[#050505]"
        >
          {/* Background ambient light */}
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-[600px] h-[600px] m-auto rounded-full blur-[120px] bg-indigo-600/30" 
          />

          <div className="relative w-64 h-64 flex items-center justify-center" style={{ perspective: "1000px" }}>
            {/* 3D Rings */}
            <motion.div
              animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }}
              transition={{ duration: 5, ease: "linear", repeat: Infinity }}
              className="absolute w-full h-full rounded-full border-[3px] border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
              style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div
              animate={{ rotateX: 180, rotateY: 360, rotateZ: 180 }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              className="absolute w-[80%] h-[80%] rounded-full border-[3px] border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
              style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div
              animate={{ rotateX: 360, rotateY: 360, rotateZ: 0 }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              className="absolute w-[60%] h-[60%] rounded-full border-[3px] border-purple-500/60 shadow-[0_0_40px_rgba(168,85,247,0.6)]"
              style={{ transformStyle: "preserve-3d" }}
            />
            
            {/* 3D Core Node */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotateX: [0, 180, 360], rotateY: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute w-16 h-16 bg-white rounded-xl shadow-[0_0_80px_rgba(255,255,255,1)] flex items-center justify-center overflow-hidden border border-white"
              style={{ transformStyle: "preserve-3d" }}
            >
                <div className="w-8 h-8 bg-black/80 rotate-45 shadow-inner" />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 flex flex-col items-center"
          >
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 via-cyan-300 to-purple-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] mb-2">
              NEXUS
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200/80 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              The Ultimate Placement Intelligence
            </p>
            <div className="w-64 h-1 mt-8 bg-white/10 rounded-full overflow-hidden relative backdrop-blur-md border border-white/5">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.8, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}