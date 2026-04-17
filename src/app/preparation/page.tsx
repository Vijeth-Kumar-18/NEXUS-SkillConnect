"use client";

import { useEffect, useMemo, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import { fetchJson } from "@/lib/apiClient";

interface CompanyOption {
  id: string;
  name: string;
  role: string;
}

interface CompanyDetail {
  company: { id: string; name: string; role: string; numRounds: number };
  rounds: Array<{ id: string; order: number; type: string }>;
  questions: Array<{ id: string; text: string; topic: string; difficulty: string }>;
}

export default function PreparationPage() {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // loading is true by default
    fetchJson<{ companies: CompanyOption[] }>("/api/companies")
      .then((data) => {
        setCompanies(data.companies);
        if (data.companies[0]) {
          setSelectedId(data.companies[0].id);
          setDetailLoading(true);
        }
        setError("");
      })
      .catch((err) => {
        setCompanies([]);
        setError(err instanceof Error ? err.message : "Failed to load company list");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    fetchJson<CompanyDetail>(`/api/companies/${encodeURIComponent(selectedId)}`)
      .then((data) => {
        setDetail(data);
        setError("");
      })
      .catch((err) => {
        setDetail(null);
        setError(err instanceof Error ? err.message : "Failed to load preparation details");
      })
      .finally(() => {
        setDetailLoading(false);
      });
  }, [selectedId]);

  const groupedQuestions = useMemo(() => {
    const map = new Map<string, string[]>();
    (detail?.questions || []).forEach((question) => {
      const key = question.topic || "General";
      const list = map.get(key) || [];
      list.push(question.text);
      map.set(key, list);
    });
    return Array.from(map.entries());
  }, [detail]);

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Interview Preparation</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Company-wise rounds, question focus, and targeted prep path.
        </p>
        {error ? <p className="text-xs mt-2 text-rose-300">{error}</p> : null}
      </div>

      <Card className="mb-6">
        <label className="block text-[11px] uppercase tracking-wider text-slate-500 mb-2">Select Company</label>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setDetailLoading(true);
          }}
          disabled={loading || !companies.length}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/40"
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id} className="bg-[#0f1120] text-slate-200">
              {company.name} - {company.role}
            </option>
          ))}
        </select>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">Round Flow</h3>
          {detailLoading ? <p className="text-xs text-slate-400 mb-3">Loading rounds...</p> : null}
          <div className="space-y-3">
            {(detail?.rounds || []).map((round) => (
              <div key={round.id} className="rounded-lg border border-white/10 px-3 py-3 flex items-center justify-between">
                <span className="text-sm text-slate-200">Round {round.order}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">{round.type}</span>
              </div>
            ))}
            {!detail?.rounds?.length ? <p className="text-xs text-slate-500">No rounds configured yet.</p> : null}
          </div>
        </Card>

        <Card>
          <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Question Bank</h3>
          {detailLoading ? <p className="text-xs text-slate-400 mb-3">Loading question bank...</p> : null}
          <div className="space-y-4">
            {groupedQuestions.map(([topic, questions]) => (
              <div key={topic} className="rounded-lg border border-white/10 px-3 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{topic}</p>
                <ul className="space-y-2">
                  {questions.slice(0, 3).map((question, i) => (
                    <li key={`${question}-${i}`} className="text-xs text-slate-300">• {question}</li>
                  ))}
                </ul>
              </div>
            ))}
            {!groupedQuestions.length ? <p className="text-xs text-slate-500">No interview questions available.</p> : null}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
