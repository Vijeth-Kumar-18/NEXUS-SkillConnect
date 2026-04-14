"use client";

import { motion } from "framer-motion";

interface RoadmapProps {
  steps: string[];
}

const descriptions: Record<string, string> = {
  DSA: "Master data structures & algorithms — the core of every technical interview.",
  "System Design": "Learn to architect scalable, distributed systems from scratch.",
  DBMS: "Understand relational databases, normalization, and query optimization.",
  "Operating Systems": "Build a strong foundation in OS concepts: processes, memory, and concurrency.",
  Java: "Strengthen your object-oriented programming fundamentals in Java.",
  SQL: "Write efficient queries and understand relational data modeling.",
  Aptitude: "Sharpen your quantitative, logical, and verbal reasoning skills.",
  React: "Build modern, component-driven user interfaces with React.",
  Python: "Learn Python for scripting, data processing, and backend development.",
  "Low Level Design": "Master SOLID principles, design patterns, and clean code architecture.",
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.4 },
  },
};

const step = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export default function Roadmap({ steps }: RoadmapProps) {
  if (steps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <span className="text-3xl mb-3 block">🎉</span>
        <p className="text-sm font-medium text-emerald-400">
          All skills matched — no gaps to fill!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="h-5 w-1 rounded-full bg-gradient-to-b from-indigo-400 to-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Learning Roadmap
        </h3>
      </div>

      <motion.ol
        variants={container}
        initial="hidden"
        animate="show"
        className="relative ml-4"
      >
        {/* Connecting line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/50 via-indigo-500/20 to-transparent" />

        {steps.map((skill, i) => (
          <motion.li
            key={skill}
            variants={step}
            className="relative pl-10 pb-7 last:pb-0 group"
          >
            {/* Numbered dot */}
            <span
              className="
                absolute left-0 top-0.5 flex h-[22px] w-[22px] items-center justify-center
                rounded-full bg-indigo-500/20 border border-indigo-500/40
                text-[10px] font-bold text-indigo-300
                group-hover:bg-indigo-500/30 group-hover:border-indigo-400/60
                transition-colors duration-200
              "
            >
              {i + 1}
            </span>

            <div>
              <p className="text-sm font-semibold text-slate-200 leading-tight">
                <span className="text-indigo-400 mr-1.5">Step {i + 1}:</span>
                Learn{" "}
                <span className="text-white">{skill}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {descriptions[skill] || `Build proficiency in ${skill} to close this gap.`}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </motion.div>
  );
}
