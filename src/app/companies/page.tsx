import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import Link from "next/link";

const companies = [
  { id: "google", name: "Google", role: "SDE I", type: "Product", skills: 8, match: "High Priority" },
  { id: "amazon", name: "Amazon", role: "SDE I", type: "E-Commerce", skills: 6, match: "Moderate Priority" },
  { id: "microsoft", name: "Microsoft", role: "Cloud Support", type: "Product", skills: 7, match: "Good Match" },
  { id: "infosys", name: "Infosys", role: "Systems Engineer", type: "Service", skills: 4, match: "Safety" },
  { id: "tcs", name: "TCS", role: "Digital Innovator", type: "Service", skills: 5, match: "Safety" },
  { id: "netflix", name: "Netflix", role: "Senior Engineer", type: "Streaming", skills: 9, match: "Aspirational" },
];

export default function CompaniesPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Companies</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Explore hiring partners, their roles, and skill profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Link href={`/companies/${company.id}`} key={company.id}>
            <Card hover className="h-full flex flex-col group relative overflow-hidden border border-white/5 transition-all hover:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg font-black text-indigo-400 shadow-[inset_0_4px_10px_rgba(99,102,241,0.1)]">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-200">{company.name}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{company.type}</p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-indigo-400 font-bold">→</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-300">{company.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-auto">
                <div className="p-2 rounded-lg bg-black/20 border border-white/5 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Required Skills</p>
                  <p className="text-xl font-black text-slate-200">{company.skills}</p>
                </div>
                <div className="p-2 rounded-lg bg-black/20 border border-white/5 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Category</p>
                  <p className="text-[10px] font-black text-emerald-400 uppercase mt-1">{company.match}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
