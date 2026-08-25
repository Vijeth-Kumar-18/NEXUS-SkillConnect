"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { fetchJson } from "@/lib/apiClient";

export interface AnalyticsPayload {
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

export default function AnalyticsPage() {
  const [payload, setPayload] = useState<AnalyticsPayload>(fallback);

  useEffect(() => {
    fetchJson<AnalyticsPayload>("/api/analytics")
      .then((data) => setPayload(data))
      .catch(() => setPayload(fallback));
  }, []);

  return (
    <PageWrapper>
      <div className="mb-10 lg:pl-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">Analytics</span>
        </h1>
        <p className="text-lg font-medium text-slate-300 max-w-3xl leading-relaxed">
          Graph-native analytics from Neo4j on role demand, skill trends, and alumni outcomes.
        </p>
      </div>

      <AnalyticsDashboard payload={payload} />
    </PageWrapper>
  );
}
