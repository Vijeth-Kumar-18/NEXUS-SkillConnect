import PageWrapper from "@/components/layout/PageWrapper";
import GraphView from "@/components/graph/GraphView";

export default function GraphPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">Graph Network</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Live Student → Skill → Company graph powered by Neo4j Aura.
        </p>
      </div>

      <GraphView className="max-w-6xl" />
    </PageWrapper>
  );
}
