import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import Link from "next/link";

const companies = [
  { id: "google", name: "Google", role: "SDE", skills: 5 },
  { id: "amazon", name: "Amazon", role: "SDE", skills: 4 },
  { id: "infosys", name: "Infosys", role: "Systems Engineer", skills: 4 },
  { id: "tcs", name: "TCS", role: "Software Engineer", skills: 4 },
];

export default function CompaniesPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Companies</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse companies and their skill requirements
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {companies.map((company) => (
          <Link href={`/companies/${company.id}`} key={company.id}>
            <Card hover className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-sm font-bold text-indigo-300">
                  {company.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{company.name}</p>
                  <p className="text-xs text-slate-500">{company.role}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 pt-2 border-t border-white/[0.06]">
                {company.skills} required skills
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}
