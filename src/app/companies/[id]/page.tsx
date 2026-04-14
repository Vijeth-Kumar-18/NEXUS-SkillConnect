import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";
import Link from "next/link";

interface CompanyDetailProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: CompanyDetailProps) {
  const { id } = await params;

  return (
    <PageWrapper>
      <div className="mb-6">
        <Link href="/companies" className="text-xs text-indigo-400 hover:underline mb-2 inline-block">
          ← Back to Companies
        </Link>
        <h1 className="text-2xl font-bold gradient-text capitalize">{id}</h1>
        <p className="text-sm text-slate-500 mt-1">
          Company details and skill requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
            Required Skills
          </h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>Skill requirements will be loaded from the dataset</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
            Placement Stats
          </h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>Placement statistics placeholder</p>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
