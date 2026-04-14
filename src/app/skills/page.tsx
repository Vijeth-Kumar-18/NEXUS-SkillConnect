import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

const sampleSkills = [
  { name: "Java", level: 3 },
  { name: "DSA", level: 2 },
  { name: "React", level: 2 },
];

export default function SkillsPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Skills</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track and manage your technical skills
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleSkills.map((skill) => (
          <Card key={skill.name} hover>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200">{skill.name}</h3>
              <span className="text-xs text-indigo-400 font-semibold">
                Lv {skill.level}/5
              </span>
            </div>

            {/* Level bar */}
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                style={{ width: `${(skill.level / 5) * 100}%` }}
              />
            </div>
          </Card>
        ))}

        {/* Add skill placeholder */}
        <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.08] h-28 text-slate-600 text-sm hover:border-indigo-500/30 hover:text-slate-400 transition cursor-pointer">
          + Add Skill
        </div>
      </div>
    </PageWrapper>
  );
}
