"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Company, SkillGapResult, Student } from "@/data/skillGapData";
import { fetchJson } from "@/lib/apiClient";

import PageWrapper from "@/components/layout/PageWrapper";
import StudentSelector from "@/components/skill-gap/StudentSelector";
import CompanySelector from "@/components/skill-gap/CompanySelector";
import ReadinessCard from "@/components/skill-gap/ReadinessCard";
import SkillTable from "@/components/skill-gap/SkillTable";
import PriorityBars from "@/components/skill-gap/PriorityBars";
import Roadmap from "@/components/skill-gap/Roadmap";

interface ApiCompany {
  id: string;
  name: string;
  role: string;
  requiredSkills: Company["requiredSkills"];
}

export default function SkillGapPage() {
  const [student, setStudent] = useState<Student>({ name: "Student", skills: [] });
  const [companies, setCompanies] = useState<ApiCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SkillGapResult>({
    student: { name: "Student", skills: [] },
    company: { name: "Company", role: "Role", requiredSkills: [] },
    analyzedSkills: [],
    readinessPercent: 0,
    roadmap: [],
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchJson<{ companies: Array<{ id: string; name: string; role: string }> }>("/api/companies"),
      fetchJson<{ name: string; skills: string[] }>("/api/students/me/profile"),
    ])
      .then(([companyData, profile]) => {
        const normalizedCompanies = companyData.companies.map((company) => ({
          id: company.id,
          name: company.name,
          role: company.role,
          requiredSkills: [],
        }));

        setCompanies(normalizedCompanies);
        setSelectedCompanyId(normalizedCompanies[0]?.id || "");
        setStudent({
          name: profile.name,
          skills: profile.skills.map((name) => ({ name, level: 2 })),
        });
        setError("");
      })
      .catch((err) => {
        setCompanies([]);
        setSelectedCompanyId("");
        setError(err instanceof Error ? err.message : "Failed to load skill-gap inputs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    async function loadGap() {
      const selected = companies.find((company) => company.id === selectedCompanyId);
      if (!selected) {
        return;
      }

      const gap = await fetchJson<{
        readinessPercent: number;
        analyzedSkills: SkillGapResult["analyzedSkills"];
        roadmap: string[];
      }>(`/api/skill-gap?companyId=${encodeURIComponent(selected.id)}`);

      setResult({
        student,
        company: {
          name: selected.name,
          role: selected.role,
          requiredSkills: [],
        },
        analyzedSkills: gap.analyzedSkills,
        readinessPercent: gap.readinessPercent,
        roadmap: gap.roadmap,
      });
      setError("");
    }

    if (companies.length && selectedCompanyId) {
      loadGap().catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load skill-gap analysis");
      });
    }
  }, [selectedCompanyId, companies, student]);

  const selectionKey = `${student.name}-${selectedCompanyId || "none"}`;

  const selectedCompanyIndex = useMemo(
    () => Math.max(0, companies.findIndex((company) => company.id === selectedCompanyId)),
    [companies, selectedCompanyId]
  );

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId) || { id: "", name: "Company", role: "Role", requiredSkills: [] },
    [companies, selectedCompanyId]
  );

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
        {error ? <p className="text-xs mt-2 text-rose-300">{error}</p> : null}

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
            {selectedCompany.name} · {selectedCompany.role}
          </span>
        </div>
      </motion.div>

      {/* ── Selectors ─────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-4 mb-8">
        <StudentSelector
          students={[student]}
          selectedIndex={0}
          onChange={() => undefined}
        />
        <CompanySelector
          companies={companies}
          selectedIndex={selectedCompanyIndex}
          onChange={(index) => setSelectedCompanyId(companies[index]?.id || "")}
        />
      </section>

      {loading ? <p className="text-sm text-slate-400 mb-4">Loading skill-gap data...</p> : null}
      {!loading && !companies.length && !error ? <p className="text-sm text-slate-500 mb-4">No companies available for skill-gap analysis.</p> : null}

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
