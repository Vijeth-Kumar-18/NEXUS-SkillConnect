"use client";

import { motion } from "framer-motion";

interface ReadinessCardProps {
  percent: number;
  companyName: string;
}

export default function ReadinessCard({
  percent,
  companyName,
}: ReadinessCardProps) {
  const radius = 80;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  // Color gradient based on readiness
  const gradientId = "readiness-gradient";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8"
    >
      {/* Circular progress with glow */}
      <div className="relative h-48 w-48 shrink-0 glow-accent">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Background ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />

          {/* Animated progress ring */}
          <motion.circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          />
        </svg>

        {/* Center percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold gradient-text glow-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {percent}%
          </motion.span>
          <span className="text-[11px] text-slate-500 uppercase tracking-wider mt-1">
            Ready
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold text-slate-200 mb-1">
          Readiness Score
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          You are{" "}
          <span className="text-indigo-400 font-semibold">{percent}% ready</span>{" "}
          for{" "}
          <span className="text-white font-semibold">{companyName}</span>
        </p>
        <div className="mt-4 flex gap-2 justify-center sm:justify-start">
          {percent >= 75 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Strong Match
            </span>
          ) : percent >= 40 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Moderate Match
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-medium text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              Needs Improvement
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
