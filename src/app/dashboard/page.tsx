import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

export default function DashboardPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Welcome back, Student</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your placement analysis overview
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Skills</p>
          <p className="text-2xl font-bold text-indigo-400">3</p>
          <p className="text-xs text-slate-500">skills tracked</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Match Score</p>
          <p className="text-2xl font-bold text-cyan-400">62%</p>
          <p className="text-xs text-slate-500">avg readiness</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Companies</p>
          <p className="text-2xl font-bold text-emerald-400">4</p>
          <p className="text-xs text-slate-500">companies tracked</p>
        </Card>
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile summary */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
            Profile Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Abhi</p>
                <p className="text-xs text-slate-500">B.Tech CSE • 2026</p>
              </div>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-white/[0.06]">
              Skills: Java, DSA, React
            </div>
          </div>
        </Card>

        {/* Recommendations placeholder */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
            Top Recommendations
          </h3>
          <div className="space-y-2.5">
            {["Google — SDE", "Amazon — SDE", "Infosys — Systems Engineer"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60" />
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
