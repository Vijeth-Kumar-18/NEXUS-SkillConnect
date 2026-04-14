import Card from "@/components/common/Card";

interface MatchScoreCardProps {
  studentName: string;
  companyName: string;
  score: number;
}

export default function MatchScoreCard({ studentName, companyName, score }: MatchScoreCardProps) {
  const color =
    score >= 75 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-rose-400";

  return (
    <Card hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-200">{studentName}</p>
          <p className="text-xs text-slate-500">→ {companyName}</p>
        </div>
        <span className={`text-2xl font-bold ${color}`}>{score}%</span>
      </div>
    </Card>
  );
}
