"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import AnalyticsDashboard from "@/app/analytics/AnalyticsDashboard";
import { fetchJson } from "@/lib/apiClient";

interface AnalyticsPayload {
  overall: {
    companiesCount: number;
    studentsCount: number;
    alumniCount: number;
    skillsCount: number;
  };
  companyStats: {
    topRoles: Array<{ name: string; value: number }>;
    topSkills: Array<{ name: string; value: number }>;
    packageDistribution: Array<{ name: string; value: number }>;
  };
  studentStats: {
    cgpaDistribution: Array<{ name: string; value: number }>;
  };
  alumniStats: {
    alumniPlacements: Array<{ year: string; count: number }>;
    placementRateData: Array<{ year: string; rate: number }>;
  };
}

const fallback: AnalyticsPayload = {
  overall: { companiesCount: 0, studentsCount: 0, alumniCount: 0, skillsCount: 0 },
  companyStats: { topRoles: [], topSkills: [], packageDistribution: [] },
  studentStats: { cgpaDistribution: [] },
  alumniStats: { alumniPlacements: [], placementRateData: [] },
};

export default function AdminAnalyticsPage() {
  const [payload, setPayload] = useState<AnalyticsPayload>(fallback);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<AnalyticsPayload>("/api/analytics")
      .then((data) => {
        setPayload(data);
        setError("");
      })
      .catch((err) => {
        setPayload(fallback);
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      });
  }, []);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Admin Analytics</h1>
        <p className="text-sm font-medium text-slate-400">Placement and skill intelligence for all cohorts.</p>
        {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
      </div>

      <AnalyticsDashboard payload={payload} />
    </PageWrapper>
  );
}
