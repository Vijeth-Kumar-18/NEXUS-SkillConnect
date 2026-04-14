import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

export default function AdminPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage students, companies, and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Manage Students", desc: "Add, edit, or remove student profiles", icon: "👤" },
          { title: "Manage Companies", desc: "Update company requirements and roles", icon: "🏢" },
          { title: "Skill Database", desc: "Maintain the global skill taxonomy", icon: "⚡" },
          { title: "Placement Records", desc: "Track and verify placement data", icon: "📋" },
          { title: "Graph Config", desc: "Configure Neo4j connections and queries", icon: "🔗" },
          { title: "System Settings", desc: "Application configuration and logs", icon: "⚙️" },
        ].map((item) => (
          <Card key={item.title} hover>
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">{item.title}</h3>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
