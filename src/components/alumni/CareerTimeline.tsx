interface TimelineStep {
  year: string;
  title: string;
  company: string;
}

interface CareerTimelineProps {
  steps: TimelineStep[];
}

export default function CareerTimeline({ steps }: CareerTimelineProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-5">
        Career Timeline
      </h3>

      <ol className="relative ml-3 border-l border-indigo-500/20">
        {steps.map((step, i) => (
          <li key={i} className="pl-8 pb-6 last:pb-0 relative">
            <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500/40 border-2 border-indigo-400" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{step.year}</p>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{step.title}</p>
            <p className="text-xs text-slate-400">{step.company}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
