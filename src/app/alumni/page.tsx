import PageWrapper from "@/components/layout/PageWrapper";
import AlumniCard from "@/components/alumni/AlumniCard";
import CareerTimeline from "@/components/alumni/CareerTimeline";
import Card from "@/components/common/Card";

const alumni = [
  { name: "Ravi Kumar", batch: "2023", company: "Google", role: "SDE-2" },
  { name: "Priya Sharma", batch: "2022", company: "Amazon", role: "SDE-1" },
  { name: "Amit Patel", batch: "2024", company: "Microsoft", role: "SWE" },
  { name: "Neha Gupta", batch: "2021", company: "Meta", role: "Product Manager" },
  { name: "Suresh Das", batch: "2025", company: "Atlassian", role: "Frontend Engineer" },
  { name: "Meera Singh", batch: "2023", company: "Uber", role: "Backend Developer" },
];

const sampleTimeline = [
  { year: "2022", title: "Intern — SDE", company: "Google" },
  { year: "2023", title: "Full-Time SDE-1", company: "Google" },
  { year: "2025", title: "SDE-2", company: "Google" },
  { year: "2026", title: "Senior Engineer", company: "Google" },
];

export default function AlumniPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Alumni Network</h1>
        <p className="text-sm font-medium text-slate-400">
          Track alumni career paths, placements, and learn their strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alumni cards */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alumni.map((a) => (
              <AlumniCard key={a.name} {...a} />
            ))}
          </div>

          <Card className="border-t-4 border-t-indigo-500 mt-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">
              Connect & Mentorship
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Get 1-on-1 guidance from our top placed alumni. They can review your resume, conduct mock interviews, and share company-specific insights.
            </p>
            <button className="px-4 py-2 bg-indigo-500/20 text-indigo-300 font-bold text-xs uppercase tracking-wider rounded-lg border border-indigo-500/50 hover:bg-indigo-500/30 transition">
              Request Mentorship
            </button>
          </Card>
        </div>

        {/* Career timeline */}
        <div className="flex flex-col gap-6">
          <div className="p-5 glass rounded-2xl border-t-4 border-t-emerald-500">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 mb-4">Sample Path: Ravi Kumar</h3>
            <CareerTimeline steps={sampleTimeline} />
          </div>

          <Card>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Top Alumni Fields</h3>
            <div className="space-y-3">
              {[
                { field: "Software Engineering", count: "45%" },
                { field: "Data Science", count: "25%" },
                { field: "Product Management", count: "15%" },
                { field: "Consulting", count: "15%" },
              ].map((f) => (
                <div key={f.field} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">{f.field}</span>
                  <span className="text-indigo-400 font-bold">{f.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
