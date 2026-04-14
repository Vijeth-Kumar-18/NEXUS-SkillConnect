interface ScoreDetail {
  label: string;
  score: number;
  maxScore: number;
}

interface ScoreBreakdownProps {
  details: ScoreDetail[];
}

export default function ScoreBreakdown({ details }: ScoreBreakdownProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
        Score Breakdown
      </h3>

      <div className="space-y-3">
        {details.map((item) => {
          const pct = (item.score / item.maxScore) * 100;
          return (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-slate-500 tabular-nums">
                  {item.score}/{item.maxScore}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
