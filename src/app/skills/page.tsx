import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/common/Card";

const sampleSkills = [
  { name: "Java", level: 4, category: "Language" },
  { name: "C++", level: 3, category: "Language" },
  { name: "DSA", level: 3, category: "Core" },
  { name: "React", level: 2, category: "Frontend" },
  { name: "Node.js", level: 3, category: "Backend" },
  { name: "System Design", level: 1, category: "Architecture" },
];

export default function SkillsPage() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight gradient-text mb-2">My Skills</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Catalog and upgrade your technical proficiency vectors in the Nexus grid.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleSkills.map((skill) => (
          <Card key={skill.name} hover className="relative overflow-hidden group border border-white/5 transition-all hover:bg-white/[0.02]">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">{skill.category}</p>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-200">{skill.name}</h3>
              <span className="text-xs text-indigo-400 font-bold px-2 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                Lv {skill.level}/5
              </span>
            </div>

            {/* Level bar */}
            <div className="h-2 rounded-full bg-black/40 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 relative"
                style={{ width: `${(skill.level / 5) * 100}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent"></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-semibold">
              {skill.level === 5 ? "Mastered" : skill.level >= 3 ? "Proficient" : "Learning"}
            </p>
          </Card>
        ))}

        {/* Add skill placeholder */}
        <Card hover className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 h-full text-slate-500 hover:border-indigo-500/40 hover:text-indigo-400 transition cursor-pointer min-h-[160px]">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 mb-2 font-light text-2xl">+</div>
          <p className="text-sm font-bold uppercase tracking-wider">Log New Skill</p>
        </Card>
      </div>
    </PageWrapper>
  );
}
