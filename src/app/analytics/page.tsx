import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import GraphView from "@/components/graph/GraphView";

export default function AnalyticsPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Placement trends and graph-based insights
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Students", value: "3", color: "text-indigo-400" },
          { label: "Total Companies", value: "4", color: "text-cyan-400" },
          { label: "Avg Readiness", value: "32%", color: "text-amber-400" },
          { label: "Skills Tracked", value: "11", color: "text-emerald-400" },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Graph visualization */}
      <GraphView />
    </PageWrapper>
  );
}
