"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import { fetchJson } from "@/lib/apiClient";

interface CohortRow {
  expectedGraduation: string;
  students: number;
  avgCgpa: number;
}

interface DegreeRow {
  degree: string;
  students: number;
}

interface CohortsPayload {
  totals: {
    students: number;
    cohorts: number;
    degrees: number;
  };
  byGraduation: CohortRow[];
  byDegree: DegreeRow[];
}

const fallback: CohortsPayload = {
  totals: { students: 0, cohorts: 0, degrees: 0 },
  byGraduation: [],
  byDegree: [],
};

export default function AdminCohortsPage() {
  const [payload, setPayload] = useState<CohortsPayload>(fallback);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<CohortsPayload>("/api/admin/cohorts")
      .then((data) => {
        setPayload(data);
        setError("");
      })
      .catch((err) => {
        setPayload(fallback);
        setError(err instanceof Error ? err.message : "Failed to load cohorts");
      });
  }, []);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Admin Cohorts</h1>
        <p className="text-sm font-medium text-slate-400">Student distribution by graduation year and degree.</p>
        {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400">Students</p>
          <p className="text-2xl font-bold text-cyan-300">{payload.totals.students}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400">Cohorts</p>
          <p className="text-2xl font-bold text-indigo-300">{payload.totals.cohorts}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-400">Degrees</p>
          <p className="text-2xl font-bold text-emerald-300">{payload.totals.degrees}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3">By Graduation</h3>
          <div className="space-y-2">
            {payload.byGraduation.map((row) => (
              <div key={row.expectedGraduation} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm">
                <span className="text-slate-200">{row.expectedGraduation}</span>
                <span className="text-cyan-300">{row.students} students · avg CGPA {row.avgCgpa.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-3">By Degree</h3>
          <div className="space-y-2">
            {payload.byDegree.map((row) => (
              <div key={row.degree} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm">
                <span className="text-slate-200">{row.degree}</span>
                <span className="text-emerald-300">{row.students} students</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
