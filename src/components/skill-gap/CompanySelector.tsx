"use client";

import { Company } from "@/data/skillGapData";
import { motion } from "framer-motion";

interface CompanySelectorProps {
  companies: Company[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export default function CompanySelector({
  companies,
  selectedIndex,
  onChange,
}: CompanySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="flex-1 min-w-[200px]"
    >
      <label
        htmlFor="company-select"
        className="block text-[11px] font-medium uppercase tracking-widest text-slate-500 mb-2"
      >
        Company
      </label>
      <div className="relative">
        <select
          id="company-select"
          value={selectedIndex}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full appearance-none glass rounded-xl
            px-4 py-3 pr-10 text-sm font-medium text-slate-200
            transition-all duration-200
            hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)]
            focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20
            focus:outline-none cursor-pointer
          "
        >
          {companies.map((c, i) => (
            <option key={c.name} value={i} className="bg-[#0f1120] text-slate-200">
              {c.name} — {c.role}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </motion.div>
  );
}
