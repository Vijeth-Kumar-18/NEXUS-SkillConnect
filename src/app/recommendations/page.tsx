import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

const recommendations = [
  { company: "Amazon", role: "SDE I", match: 85, tags: ["Cloud", "System Design"], deadline: "2 Days Left" },
  { company: "Microsoft", role: "Cloud Support", match: 78, tags: ["Azure", "Networking"], deadline: "1 Week" },
  { company: "Google", role: "SDE", match: 62, tags: ["DSA", "Problem Solving"], deadline: "Next Month" },
  { company: "Infosys", role: "Systems Engineer", match: 45, tags: ["Java", "SQL"], deadline: "Hiring Now" },
  { company: "TCS", role: "Software Engineer", match: 40, tags: ["C++", "Aptitude"], deadline: "Hiring Now" },
];

export default function RecommendationsPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Recommendations</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          AI-driven company matches based on your current skill proficiency graph.
        </p>
      </div>

      <div className="space-y-4 max-w-4xl">
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
                    <p className="text-[10px] font-bold text-slate-500 mt-1">{rec.deadline}</p>
                  </div>
                </div>
                
                {/* Progress bar matching */}
                <div className="mt-4 h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${rec.match}%` }} />
                </div>
              </Card>
            );
          })}
      </div>
    </PageWrapper>
  );
}
