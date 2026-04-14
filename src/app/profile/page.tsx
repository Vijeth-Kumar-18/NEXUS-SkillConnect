import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

export default function ProfilePage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Student Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile and skill information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-300 mb-3">
              A
            </div>
            <p className="text-base font-semibold text-slate-200">Abhi</p>
            <p className="text-xs text-slate-500 mt-0.5">B.Tech CSE</p>
            <p className="text-xs text-slate-600 mt-0.5">Batch 2026</p>
          </div>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
            Details
          </h3>
          <div className="space-y-3 text-sm">
            {[
              ["Name", "Abhi"],
              ["Email", "abhi@college.edu"],
              ["Branch", "Computer Science"],
              ["CGPA", "8.5"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-white/[0.04] pb-2">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-300 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
