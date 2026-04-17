"use client";

import { AnalyzedSkill, SkillStatus } from "@/data/skillGapData";
import { motion } from "framer-motion";

interface SkillTableProps {
  skills: AnalyzedSkill[];
}

const statusConfig: Record<
  SkillStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Matched: {
    label: "Matched",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  Weak: {
    label: "Weak",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  Missing: {
    label: "Missing",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
  },
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const card = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
};

export default function SkillTable({ skills }: SkillTableProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {skills.map((skill, i) => {
        const cfg = statusConfig[skill.status];
        return (
          <motion.div
            key={`${skill.name}-${i}`}
            variants={card}
            whileHover={{ scale: 1.03, y: -2 }}
            className="
              glass glass-hover rounded-2xl p-5 cursor-default
              transition-shadow duration-300
              hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]
            "
          >
            {/* Header: name + badge */}
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-200">
                {skill.name}
              </h4>
              <span
                className={`
                  inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
                  text-[11px] font-semibold border
                  ${cfg.bg} ${cfg.text} ${cfg.border}
                `}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
                  Importance
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-3 rounded-full ${
                        i < skill.importance
                          ? "bg-indigo-400"
                          : "bg-white/5"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
                  Your Level
                </p>
                <p className="text-sm font-semibold text-slate-300">
                  {skill.userLevel}
                  <span className="text-slate-600">/5</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
                  Priority
                </p>
                <p className="text-sm font-bold text-indigo-400">
                  {skill.priorityScore}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
