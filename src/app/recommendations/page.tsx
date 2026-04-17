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
  location: string;
  packageLpa: number;
  match: number;
  tags: string[];
  alumniCount: number;
  eligibilityStatus: string;
  reasoning: string[];
}

interface MentorRecommendation {
  alumniId: string;
  name: string;
  role: string;
  company: string;
  matchReason: string;
  sharedSkills: string[];
  strength: number;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [mentors, setMentors] = useState<MentorRecommendation[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<{ recommendations: RecommendationItem[]; mentors: MentorRecommendation[] }>("/api/recommendations")
      .then((data) => {
        setRecommendations(data.recommendations);
        setMentors(data.mentors || []);
        setError("");
      })
      .catch((err) => {
        setRecommendations([]);
        setMentors([]);
        setError(err instanceof Error ? err.message : "Failed to load recommendations");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight gradient-text mb-2">Smart Match Dashboard</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Hyper-personalized placement paths based on your skills, role goals, and alumni network.
        </p>
        {error ? <p className="text-xs mt-2 text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded w-fit">{error}</p> : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl">
        {/* Main Matches Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-200">Company Placement Matches</h2>
            <div className="h-px flex-1 mx-4 bg-white/5" />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 w-full animate-pulse bg-white/5 rounded-2xl" />
              ))}
            </div>
          ) : null}

          {!loading && !recommendations.length && !error ? (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-sm text-slate-500">No recommendations available yet. Add skills to improve your matching.</p>
            </div>
          ) : null}

          {recommendations.map((rec, i) => {
            const color =
              rec.match >= 80
                ? "text-emerald-400"
                : rec.match >= 70
                  ? "text-blue-400"
                  : rec.match >= 50
                    ? "text-amber-400"
                    : "text-rose-400";

            const barColor =
              rec.match >= 80
                ? "bg-emerald-500"
                : rec.match >= 70
                  ? "bg-blue-500"
                  : rec.match >= 50
                    ? "bg-amber-500"
                    : "bg-rose-500";

            return (
              <Card key={rec.companyId} hover className="group border border-white/5 transition-all hover:bg-white/[0.02] p-5">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                        {rec.company}
                      </h3>
                      {rec.alumniCount > 0 && (
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
                          {rec.alumniCount} Alumni Bridge
                        </span>
                      )}
                      {rec.eligibilityStatus === "Eligible" ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                          Eligible
                        </span>
                      ) : (
                        <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                          Low Eligibility
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs font-semibold text-slate-400 mb-4 tracking-tight">{rec.role} • {rec.location}</p>
                    
                    <div className="space-y-1 mb-4">
                      {rec.reasoning.map((r, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <div className="h-1 w-1 rounded-full bg-slate-600" />
                          {r}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {rec.tags.slice(0, 4).map((t, idx) => (
                        <span key={`${t}-${idx}`} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/40 text-slate-300 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="flex-1 sm:flex-none">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 hidden sm:block">Match Score</p>
                      <span className={`text-4xl font-black ${color} block text-right`}>
                        {rec.match}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="h-1.5 flex-1 bg-black/40 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`} style={{ width: `${rec.match}%` }} />
                  </div>
                  <Link href={`/companies/${rec.companyId}`} className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                    ANALYZE MATCH →
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Sidebar - Recommended Mentors */}
        <div className="lg:col-span-4 space-y-6">
           <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-200">Top Mentors</h2>
            <div className="h-px flex-1 ml-4 bg-white/5" />
          </div>

          <p className="text-xs font-semibold text-slate-500 leading-relaxed italic">
            Alumni with matching skillsets who work at your high-match companies.
          </p>

          <div className="space-y-4">
            {loading && [1, 2].map(i => (
              <div key={i} className="h-24 w-full animate-pulse bg-white/5 rounded-2xl" />
            ))}

            {!loading && mentors.map((mentor) => (
              <div key={mentor.alumniId} className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-4 transition-all hover:bg-indigo-500/5 hover:border-indigo-500/20">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-slate-400 uppercase">
                    {mentor.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white truncate">
                      {mentor.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate mb-2">
                       {mentor.role} @ <span className="text-indigo-300">{mentor.company}</span>
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1 w-16 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${mentor.strength}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{mentor.strength}% Match</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {mentor.sharedSkills.slice(0, 2).map((skill, idx) => (
                         <span key={`${skill}-${idx}`} className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">
                            {skill}
                         </span>
                      ))}
                      {mentor.sharedSkills.length > 2 && (
                        <span className="text-[9px] text-slate-600 px-1 flex items-center">
                          +{mentor.sharedSkills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <Link href={`/alumni?id=${mentor.alumniId}`} className="absolute top-4 right-4 text-slate-600 hover:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            ))}

            {!loading && !mentors.length && (
               <p className="text-xs text-slate-600 text-center py-4 border border-dashed border-white/5 rounded-xl">
                 No mentors found matching your specific skill profile.
               </p>
            )}
          </div>

          {/* Call to Action Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-2xl">
            <h5 className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-2">Pro Tip</h5>
            <p className="text-[11px] text-indigo-100/60 leading-relaxed font-medium">
              Alumni referrals increase placement success rate by 60%. Connect with your &quot;Nexus Bridge&quot; mentors before applying!
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
