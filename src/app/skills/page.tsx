"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/apiClient";

interface StudentSkill {
  name: string;
  level: number;
}

function inferCategory(name: string): string {
  const n = name.toLowerCase();
  if (["java", "python", "go", "c++", "typescript", "javascript"].includes(n)) return "Language";
  if (["react", "next.js", "node.js", "graphql"].includes(n)) return "Stack";
  if (["system design", "kubernetes", "docker", "aws", "sql"].includes(n)) return "Platform";
  return "Core";
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");

  async function loadSkills() {
    const data = await fetchJson<{ skills: StudentSkill[] }>("/api/students/me/skills");
    setSkills(data.skills);
    setError("");
  }

  useEffect(() => {
    fetchJson<{ skills: StudentSkill[] }>("/api/students/me/skills")
      .then((data) => {
        setSkills(data.skills);
        setError("");
      })
      .catch((err) => {
        setSkills([]);
        setError(err instanceof Error ? err.message : "Failed to load skills");
      });
  }, []);

  async function addSkill() {
    if (!newSkill.trim()) {
      return;
    }
    await fetchJson("/api/students/me/skills", {
      method: "POST",
      body: JSON.stringify({ name: newSkill.trim(), level: 2 }),
    });
    setNewSkill("");
    await loadSkills();
  }

  async function removeSkill(name: string) {
    await fetchJson(`/api/students/me/skills?name=${encodeURIComponent(name)}`, {
      method: "DELETE",
    });
    await loadSkills();
  }

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">My Skills</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Catalog and upgrade your technical proficiency vectors in the Nexus grid.
        </p>
        {error ? <p className="text-xs mt-2 text-rose-300">{error}</p> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill.name} hover className="relative overflow-hidden group border border-white/5 transition-all hover:bg-white/[0.02]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">{inferCategory(skill.name)}</p>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-200">{skill.name}</h3>
              <span className="text-xs text-indigo-400 font-bold px-2 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                Lv {skill.level}/5
              </span>
            </div>

            {/* Level bar */}
            <div className="h-2 rounded-full bg-black/40 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 relative"
                style={{ width: `${(skill.level / 5) * 100}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent"></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-semibold">
              {skill.level === 5 ? "Mastered" : skill.level >= 3 ? "Proficient" : "Learning"}
            </p>
            <button onClick={() => removeSkill(skill.name)} className="mt-3 text-[10px] uppercase font-bold tracking-wider text-rose-400 hover:text-rose-300 transition">
              Remove
            </button>
          </Card>
        ))}

        {/* Add skill placeholder */}
        <Card hover className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 h-full text-slate-500 hover:border-indigo-500/40 hover:text-indigo-400 transition min-h-[160px] p-4">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. DSA"
            className="w-full mb-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/40"
          />
          <button onClick={addSkill} className="w-full rounded-lg bg-indigo-500/20 border border-indigo-500/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-indigo-300 hover:bg-indigo-500/30 transition">
            Add Skill
          </button>
        </Card>
      </div>
    </PageWrapper>
  );
}
