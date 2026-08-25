"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import Link from "next/link";
import { fetchJson } from "@/lib/apiClient";

interface CompanyDetailResponse {
  company: {
    id: string;
    name: string;
    role: string;
    location: string;
    experienceLevel: string;
    packageLpa: number;
    eligibilityCgpa: number;
    numRounds: number;
  };
  requiredSkills: Array<{ name: string; weight: number; demandWeight: number }>;
  rounds: Array<{ id: string; order: number; type: string }>;
  questions: Array<{ id: string; text: string; topic: string; difficulty: string }>;
  alumniCount: number;
}

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [detail, setDetail] = useState<CompanyDetailResponse | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchJson<CompanyDetailResponse>(`/api/companies/${encodeURIComponent(id)}`)
      .then((data) => setDetail(data))
      .catch(() => setDetail(null));
  }, [id]);

  return (
    <PageWrapper>
      <div className="mb-6">
        <Link href="/companies" className="text-xs text-indigo-400 hover:underline mb-2 inline-block">
          ← Back to Companies
        </Link>
        <h1 className="text-2xl font-bold gradient-text capitalize">{detail?.company.name || id}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {detail?.company.role || "Role"} · {detail?.company.location || "Location"} · {detail?.company.packageLpa || 0} LPA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
            Required Skills
          </h3>
          <div className="space-y-2 text-sm text-slate-400">
            {(detail?.requiredSkills || []).map((skill) => (
              <div key={skill.name} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
                <span>{skill.name}</span>
                <span className="text-xs text-indigo-400 font-bold">Weight {skill.weight}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
            Placement Stats
          </h3>
          <div className="space-y-3 text-sm text-slate-400">
            <p>Eligibility CGPA: <span className="text-slate-200 font-semibold">{detail?.company.eligibilityCgpa || 0}</span></p>
            <p>Total Rounds: <span className="text-slate-200 font-semibold">{detail?.company.numRounds || 0}</span></p>
            <p>Alumni currently here: <span className="text-slate-200 font-semibold">{detail?.alumniCount || 0}</span></p>
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Round Breakdown</p>
              <div className="flex flex-wrap gap-2">
                {(detail?.rounds || []).map((round) => (
                  <span key={round.id} className="px-2 py-1 rounded-md text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {round.order}. {round.type}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Question Prep</p>
              <ul className="space-y-2">
                {(detail?.questions || []).slice(0, 4).map((question) => (
                  <li key={question.id} className="text-xs text-slate-300 rounded-md border border-white/10 px-2 py-2">
                    {question.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
