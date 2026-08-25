"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import EntryLoader from "@/components/common/EntryLoader";
import { useState, useEffect } from "react";

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1769&auto=format&fit=crop"
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 4500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      {loading && <EntryLoader />}
      
      {!loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 flex flex-col bg-black overflow-hidden"
        >
          {/* Hero Section with Background Carousel - DRASTICALLY LIGHTER OVERLAY */}
          <div className="relative w-full min-h-[95vh] flex flex-col items-center justify-center pt-28 px-6">
            <div className="absolute inset-0 overflow-hidden z-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={CAROUSEL_IMAGES[currentIndex]}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Background"
                />
              </AnimatePresence>
              {/* Very minimal overlay, images fully visible */}
              <div className="absolute inset-0 bg-black/10 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
            </div>

            {/* Centralized Glassmorphism Panel to keep text readable against bright images */}
            <div className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-10 mb-20 p-10 md:p-14 rounded-[3rem] glass border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 text-indigo-200 text-sm font-bold mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Introducing NEXUS Matching
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-2xl"
              >
                Connect Ambition with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-indigo-300 drop-shadow-lg">Opportunity.</span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-2xl text-gray-100 max-w-3xl mb-12 font-medium drop-shadow-lg"
              >
                We map your skills against what top companies actually want. Drop the guesswork and start building a profile that gets you hired.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/register" className="px-8 py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95">
                  Start Building Profile
                </Link>
                <Link href="/login" className="px-8 py-4 rounded-xl font-bold border border-white/50 text-white bg-black/30 hover:bg-white/20 transition-all backdrop-blur-md active:scale-95">
                  Access Dashboard
                </Link>
              </motion.div>

              <div className="flex gap-3 mt-16 pb-4">
                {CAROUSEL_IMAGES.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.9)]' : 'bg-white/40 w-2 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Target Tracks / Skills Grid instead of boring paragraphs */}
          <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-10">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Popular Career Tracks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { role: "Software Engineer", skills: ["React", "Node.js", "System Design"] },
                { role: "Data Scientist", skills: ["Python", "SQL", "Machine Learning"] },
                { role: "Product Manager", skills: ["Agile", "Roadmapping", "Strategy"] },
                { role: "UX Researcher", skills: ["Figma", "Wireframing", "User Testing"] }
              ].map((track, i) => (
                <div key={i} className="glass border border-white/10 bg-white/[0.02] p-6 rounded-2xl hover:bg-white/[0.05] transition-all cursor-default">
                  <h4 className="text-lg font-bold text-cyan-400 mb-3">{track.role}</h4>
                  <div className="flex flex-wrap gap-2">
                    {track.skills.map((skill, j) => (
                      <span key={j} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Steps With Visual Icons & Detailed Features */}
          <section className="w-full max-w-7xl mx-auto px-6 pb-24 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-gray-400">Your journey from student to hired professional</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: "1. Build Profile", detail: "Connect GitHub, upload resume", icon: "📄" },
                { title: "2. Analyze Gaps", detail: "AI maps you to job reqs", icon: "🔍" },
                { title: "3. Learn Target Skills", detail: "Follow custom course pathways", icon: "📚" },
                { title: "4. Apply Confidently", detail: "Get referred by top alumni", icon: "🚀" }
              ].map((step, i) => (
                <div key={i} className="text-center flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full glass border border-white/10 bg-indigo-500/10 flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

        </motion.div>
      )}
    </>
  );
}