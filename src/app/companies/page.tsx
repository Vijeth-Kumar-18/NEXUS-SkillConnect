"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/apiClient";

interface CompanyListItem {
  id: string;
  name: string;
  role: string;
  type: string;
  skills: number;
  matchLabel: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<{ companies: CompanyListItem[] }>("/api/companies")
      .then((data) => {
        setCompanies(data.companies);
        setError("");
      })
      .catch((err) => {
        setCompanies([]);
        setError(err instanceof Error ? err.message : "Failed to load companies");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Companies</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Explore hiring partners, their roles, and skill profiles.
        </p>
        {error ? <p className="text-xs mt-2 text-rose-300">{error}</p> : null}
      </div>

      {loading ? <p className="text-sm text-slate-400 mb-4">Loading companies...</p> : null}
      {!loading && !companies.length && !error ? <p className="text-sm text-slate-500 mb-4">No companies found.</p> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Link href={`/companies/${company.id}`} key={company.id}>
            <Card hover className="h-full flex flex-col group relative overflow-hidden border border-white/5 transition-all hover:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg font-black text-indigo-400 shadow-[inset_0_4px_10px_rgba(99,102,241,0.1)]">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-200">{company.name}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{company.type}</p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-indigo-400 font-bold">→</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-300">{company.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-auto">
                <div className="p-2 rounded-lg bg-black/20 border border-white/5 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Required Skills</p>
                  <p className="text-xl font-black text-slate-200">{company.skills}</p>
                </div>
                <div className="p-2 rounded-lg bg-black/20 border border-white/5 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Category</p>
                  <p className="text-[10px] font-black text-emerald-400 uppercase mt-1">{company.matchLabel}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
