"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/apiClient";

interface RecommendationItem {
  companyId: string;
  company: string;
  role: string;
  match: number;
  tags: string[];
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJson<{ recommendations: RecommendationItem[] }>("/api/recommendations")
      .then((data) => {
        setRecommendations(data.recommendations);
        setError("");
      })
      .catch((err) => {
        setRecommendations([]);
        setError(err instanceof Error ? err.message : "Failed to load recommendations");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Recommendations</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          AI-driven company matches based on your current skill proficiency graph.
        </p>
        {error ? <p className="text-xs mt-2 text-rose-300">{error}</p> : null}
      </div>

      <div className="space-y-4 max-w-4xl">
        {loading ? <p className="text-sm text-slate-400">Loading recommendations...</p> : null}
        {!loading && !recommendations.length && !error ? (
          <p className="text-sm text-slate-500">No recommendations available yet. Add skills to improve your matching.</p>
        ) : null}
        {recommendations
          .sort((a, b) => b.match - a.match)
          .map((rec, i) => {
            const color =
              rec.match >= 75
                ? "text-emerald-400"
                : rec.match >= 60
                  ? "text-amber-400"
                  : "text-rose-400";

            const barColor =
              rec.match >= 75
                ? "bg-emerald-500"
                : rec.match >= 60
                  ? "bg-amber-500"
                  : "bg-rose-500";

            return (
              <Card key={rec.company} hover className="group border border-white/5 transition-all hover:bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center font-black text-xl text-slate-300">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-200">
                        {rec.company}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">{rec.role}</p>
                      <div className="flex gap-2 mt-2">
                        {rec.tags.map(t => (
                          <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 border-t border-white/10 sm:border-0 pt-4 sm:pt-0">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 hidden sm:block">Match Score</p>
                    <span className={`text-2xl font-black ${color} drop-shadow-md`}>
                      {rec.match}%
                    </span>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">Live Ranking</p>
                  </div>
                </div>
                
                {/* Progress bar matching */}
                <div className="mt-4 h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${rec.match}%` }} />
                </div>
                <div className="mt-3">
                  <Link href={`/companies/${rec.companyId}`} className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 hover:text-indigo-200">
                    Open Company Profile →
                  </Link>
                </div>
              </Card>
            );
          })}
      </div>
    </PageWrapper>
  );
}
