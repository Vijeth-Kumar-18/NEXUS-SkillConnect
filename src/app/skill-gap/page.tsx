"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { data, analyzeSkillGap } from "@/data/skillGapData";

import PageWrapper from "@/components/layout/PageWrapper";
import StudentSelector from "@/components/skill-gap/StudentSelector";
import CompanySelector from "@/components/skill-gap/CompanySelector";
import ReadinessCard from "@/components/skill-gap/ReadinessCard";
import SkillTable from "@/components/skill-gap/SkillTable";
import PriorityBars from "@/components/skill-gap/PriorityBars";
import Roadmap from "@/components/skill-gap/Roadmap";

export default function SkillGapPage() {
  const [studentIndex, setStudentIndex] = useState(0);
  const [companyIndex, setCompanyIndex] = useState(0);

  const student = data.students[studentIndex];
  const company = data.companies[companyIndex];

  const result = useMemo(
    () => analyzeSkillGap(student, company),
    [student, company]
  );

  const selectionKey = `${studentIndex}-${companyIndex}`;

  return (
    <PageWrapper>
      {/* ── Header ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text leading-tight mb-2">
          Skill Gap Intelligence
        </h1>
        <p className="text-sm text-slate-500 max-w-lg">
          Your personalized path to top companies — powered by graph-based
          skill analysis.
        </p>

        {/* Active badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-300">
              {student.name.charAt(0)}
            </span>
            {student.name}
          </span>
          <span className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {company.name} · {company.role}
          </span>
        </div>
      </motion.div>

      {/* ── Selectors ─────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-4 mb-8">
        <StudentSelector
          students={data.students}
          selectedIndex={studentIndex}
          onChange={setStudentIndex}
        />
        <CompanySelector
          companies={data.companies}
          selectedIndex={companyIndex}
          onChange={setCompanyIndex}
        />
      </section>

      {/* ── Dynamic content ───────────────────────────── */}
      <motion.div
        key={selectionKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Readiness Score */}
        <section className="mb-8">
          <ReadinessCard
            percent={result.readinessPercent}
            companyName={result.company.name}
          />
        </section>

        {/* Skill Cards */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-indigo-400 to-purple-400" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Skill Analysis
            </h2>
            <span className="ml-auto text-xs text-slate-600 tabular-nums">
              {result.analyzedSkills.length} skills
            </span>
          </div>
          <SkillTable skills={result.analyzedSkills} />
        </section>

        {/* Roadmap + Priority Bars */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Roadmap steps={result.roadmap} />
          <PriorityBars skills={result.analyzedSkills} />
        </section>
      </motion.div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-600 pt-4 pb-2 border-t border-white/5">
        Priority = importance × (5 − level)
        <span className="mx-2 text-slate-700">·</span>
        Student → HAS_SKILL → Skill
        <span className="mx-2 text-slate-700">·</span>
        Company → REQUIRES → Skill
      </footer>
    </PageWrapper>
  );
}
