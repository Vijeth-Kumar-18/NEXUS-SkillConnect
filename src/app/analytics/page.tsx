import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import GraphView from "@/components/graph/GraphView";

export default function AnalyticsPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Analytics</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Deep-dive placement trends and Neo4j graph-based insights.
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Students", value: "3,250", color: "text-indigo-400", sub: "+5% vs last year" },
          { label: "Total Companies", value: "142", color: "text-cyan-400", sub: "+12 new this term" },
          { label: "Avg Readiness", value: "72%", color: "text-amber-400", sub: "Global batch avg" },
          { label: "Skills Tracked", value: "85", color: "text-emerald-400", sub: "Based on JDs" },
        ].map((stat) => (
          <Card key={stat.label} className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.02] transition" />
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color} drop-shadow-md mb-1`}>{stat.value}</p>
            <p className="text-xs font-semibold text-slate-400">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-4">
        <Card className="col-span-1 border-t-4 border-t-amber-500 flex flex-col justify-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-6">Top Required Skills</h3>
            <div className="space-y-4">
              {[
                { skill: "Data Structures & Algorithms", pct: "92%" },
                { skill: "System Design", pct: "75%" },
                { skill: "React.js / Next.js", pct: "64%" },
                { skill: "Python / AI", pct: "58%" },
                { skill: "Cloud (AWS/Azure)", pct: "40%" },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                    <span>{s.skill}</span>
                    <span className="text-amber-400">{s.pct}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: s.pct }} />
                  </div>
                </div>
              ))}
            </div>
        </Card>

        {/* Graph visualization */}
        <div className="col-span-2">
            <Card className="h-full min-h-[400px] border-t-4 border-t-indigo-500">
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">Live Knowledge Graph</h3>
              <p className="text-xs text-slate-400 mb-6">
                Interactive mapping of Student node compatibilities against Company nodes and Skill requirements.
              </p>
              <div className="rounded-xl overflow-hidden border border-white/10 relative" style={{ height: "300px" }}>
                <GraphView />
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <span className="bg-black/60 px-4 py-2 rounded-full text-xs text-white/50 backdrop-blur-md uppercase tracking-widest font-bold">Neo4j Visualization Interface</span>
                </div>
              </div>
            </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
