"use client";

import { AnalyzedSkill, SkillStatus } from "@/data/skillGapData";
import { motion } from "framer-motion";

interface PriorityBarsProps {
  skills: AnalyzedSkill[];
}

const barGradients: Record<SkillStatus, string> = {
  Missing: "from-rose-500 to-rose-400",
  Weak: "from-amber-500 to-amber-400",
  Matched: "from-emerald-500 to-emerald-400",
};

const barGlows: Record<SkillStatus, string> = {
  Missing: "shadow-[0_0_16px_rgba(248,113,113,0.2)]",
  Weak: "shadow-[0_0_16px_rgba(251,191,36,0.2)]",
  Matched: "shadow-[0_0_16px_rgba(52,211,153,0.2)]",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
};

const bar = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function PriorityBars({ skills }: PriorityBarsProps) {
  const maxScore = Math.max(...skills.map((s) => s.priorityScore), 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Priority Ranking
        </h3>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {skills.map((skill) => {
          const widthPercent = (skill.priorityScore / maxScore) * 100;
          const gradient = barGradients[skill.status];
          const glow = barGlows[skill.status];

          return (
            <motion.div key={skill.name} variants={bar} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {skill.name}
                </span>
                <span className="text-xs font-bold text-slate-400 tabular-nums">
                  {skill.priorityScore}
                </span>
              </div>

              <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${gradient} ${glow}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          Missing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Weak
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Matched
        </span>
      </div>
    </motion.div>
  );
}
