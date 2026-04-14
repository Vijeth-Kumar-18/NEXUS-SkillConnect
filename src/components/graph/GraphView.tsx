interface GraphViewProps {
  className?: string;
}

export default function GraphView({ className = "" }: GraphViewProps) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
        Graph Visualization
      </h3>

      {/* Placeholder for Neo4j graph — integrate a library like react-force-graph or vis-network */}
      <div className="flex items-center justify-center h-80 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" opacity="0.6" />
            <circle cx="5" cy="6" r="2" opacity="0.4" />
            <circle cx="19" cy="6" r="2" opacity="0.4" />
            <circle cx="5" cy="18" r="2" opacity="0.4" />
            <circle cx="19" cy="18" r="2" opacity="0.4" />
          </svg>
          <p className="text-sm text-slate-500">Neo4j Graph View</p>
          <p className="text-xs text-slate-600 mt-1">Student → Skill → Company</p>
        </div>
      </div>
    </div>
  );
}
