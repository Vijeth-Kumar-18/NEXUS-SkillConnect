import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

export default function AdminPage() {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Nexus Command Center</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Root access: Manage graph nodes, ontologies, and core placement metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Student Nodes", desc: "Batch import, audit, and manipulate student profile data and competencies.", icon: "🧑‍🎓", color: "text-indigo-400", border: "border-indigo-500" },
          { title: "Company Taxonomy", desc: "Define hiring partners, job roles, and map required skills to companies.", icon: "🏢", color: "text-cyan-400", border: "border-cyan-500" },
          { title: "Skill Ontology", desc: "Curate the global graph of skills, relationships, and mastery levels.", icon: "⚡", color: "text-amber-400", border: "border-amber-500" },
          { title: "Placement Ledger", desc: "Immutable records of alumni transitions and current active placements.", icon: "📋", color: "text-emerald-400", border: "border-emerald-500" },
          { title: "Neo4j Config", desc: "Monitor Cypher queries, graph visualization settings, and database limits.", icon: "🔗", color: "text-rose-400", border: "border-rose-500" },
          { title: "System Logs", desc: "Check server health, API rate limits, and access administrative audit logs.", icon: "⚙️", color: "text-slate-400", border: "border-slate-500" },
        ].map((item) => (
          <Card key={item.title} hover className={`relative overflow-hidden group border-t-2 ${item.border}`}>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl bg-black/20 p-3 rounded-xl border border-white/5 shadow-inner">
                {item.icon}
              </div>
              <h3 className={`text-base font-bold ${item.color}`}>{item.title}</h3>
            </div>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">{item.desc}</p>
            <div className="mt-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 group-hover:text-indigo-300 transition-colors">Access Module →</span>
            </div>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
