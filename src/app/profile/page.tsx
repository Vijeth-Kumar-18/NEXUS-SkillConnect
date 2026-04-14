import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

export default function ProfilePage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Student Profile</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Identity management and core attributes mapping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1 border-t-4 border-t-indigo-500 pb-8">
          <div className="flex flex-col items-center text-center mt-6">
            <div className="relative">
              <div className="h-28 w-28 rounded-full bg-black/30 border-2 border-indigo-500/50 flex items-center justify-center text-4xl font-black text-indigo-400 mb-4 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                A
              </div>
              <div className="absolute right-1 bottom-4 bg-emerald-500 h-6 w-6 rounded-full border-4 border-[#0a0b14]"></div>
            </div>
            <p className="text-2xl font-bold text-slate-200">Abhi</p>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">B.Tech CSE</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">Batch 2026</p>
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-4 py-2 bg-indigo-500 text-white text-xs font-bold uppercase rounded-lg shadow-md hover:bg-indigo-400 transition">Edit ID</button>
            <button className="px-4 py-2 border border-white/10 text-slate-300 text-xs font-bold uppercase rounded-lg hover:bg-white/5 transition">Share Node</button>
          </div>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2 border-t-4 border-t-cyan-500">
          <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-500 mb-6">
            Detailed Properties
          </h3>
          <div className="space-y-4">
            {[
              ["Full Name", "Abhi"],
              ["University ID", "NEX-22-0498"],
              ["Contact Email", "abhi@nexus.edu"],
              ["Degree Path", "B.Tech Computer Science"],
              ["CGPA", "8.5 (High Honors)"],
              ["LeetCode Link", "leetcode.com/abhi_nexus"],
              ["GitHub Node", "github.com/abhi-dev"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/[0.04] pb-3 group">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors mb-1 sm:mb-0">{label}</span>
                <span className="text-sm font-bold text-slate-300 bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
