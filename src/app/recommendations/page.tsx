import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

const recommendations = [
  { company: "Google", role: "SDE", match: 20 },
  { company: "Amazon", role: "SDE", match: 50 },
  { company: "TCS", role: "Software Engineer", match: 25 },
  { company: "Infosys", role: "Systems Engineer", match: 25 },
];

export default function RecommendationsPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Recommendations</h1>
        <p className="text-sm text-slate-500 mt-1">
          Companies ranked by your match score
        </p>
      </div>

      <div className="space-y-3">
        {recommendations
          .sort((a, b) => b.match - a.match)
          .map((rec, i) => {
            const color =
              rec.match >= 75
                ? "text-emerald-400"
                : rec.match >= 40
                  ? "text-amber-400"
                  : "text-rose-400";

            return (
              <Card key={rec.company} hover>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-600 w-6">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-200">
                      {rec.company}
                    </p>
                    <p className="text-xs text-slate-500">{rec.role}</p>
                  </div>
                  <span className={`text-xl font-bold ${color}`}>
                    {rec.match}%
                  </span>
                </div>
              </Card>
            );
          })}
      </div>
    </PageWrapper>
  );
}
