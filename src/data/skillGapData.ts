// ============================================================
// Skill Gap Intelligence Engine — Dataset
// ============================================================

export interface StudentSkill {
  name: string;
  level: number; // 0–5
}

export interface Student {
  name: string;
  skills: StudentSkill[];
}

export interface RequiredSkill {
  name: string;
  importance: number; // 1–5
}

export interface Company {
  name: string;
  role: string;
  requiredSkills: RequiredSkill[];
}

export type SkillStatus = "Matched" | "Weak" | "Missing";

export interface AnalyzedSkill {
  name: string;
  status: SkillStatus;
  importance: number;
  userLevel: number;
  priorityScore: number;
}

export interface SkillGapResult {
  student: Student;
  company: Company;
  analyzedSkills: AnalyzedSkill[];
  readinessPercent: number;
  roadmap: string[];
}

// ── DATASET ──────────────────────────────────────────

export const data = {
  students: [
    {
      name: "Abhi",
      skills: [
        { name: "Java", level: 3 },
        { name: "DSA", level: 2 },
        { name: "React", level: 2 },
      ],
    },
    {
      name: "Rahul",
      skills: [
        { name: "Python", level: 3 },
        { name: "SQL", level: 3 },
        { name: "Aptitude", level: 2 },
      ],
    },
    {
      name: "Sneha",
      skills: [
        { name: "DSA", level: 4 },
        { name: "System Design", level: 2 },
        { name: "Java", level: 3 },
      ],
    },
  ] as Student[],

  companies: [
    {
      name: "Google",
      role: "SDE",
      requiredSkills: [
        { name: "DSA", importance: 5 },
        { name: "System Design", importance: 5 },
        { name: "DBMS", importance: 4 },
        { name: "Operating Systems", importance: 4 },
        { name: "Java", importance: 3 },
      ],
    },
    {
      name: "Amazon",
      role: "SDE",
      requiredSkills: [
        { name: "DSA", importance: 5 },
        { name: "Low Level Design", importance: 4 },
        { name: "Java", importance: 4 },
        { name: "DBMS", importance: 3 },
      ],
    },
    {
      name: "Infosys",
      role: "Systems Engineer",
      requiredSkills: [
        { name: "Java", importance: 4 },
        { name: "SQL", importance: 4 },
        { name: "Aptitude", importance: 3 },
        { name: "DBMS", importance: 3 },
      ],
    },
    {
      name: "TCS",
      role: "Software Engineer",
      requiredSkills: [
        { name: "Java", importance: 4 },
        { name: "Python", importance: 3 },
        { name: "SQL", importance: 3 },
        { name: "Aptitude", importance: 3 },
      ],
    },
  ] as Company[],
};

// ── ANALYSIS ENGINE ─────────────────────────────────────────

export function analyzeSkillGap(
  student: Student,
  company: Company
): SkillGapResult {

  // Normalize skill names (IMPORTANT FIX)
  const studentSkillMap = new Map(
    student.skills.map((s) => [s.name.toLowerCase(), s.level])
  );

  const analyzedSkills: AnalyzedSkill[] = company.requiredSkills.map((req) => {
    const skillName = req.name.toLowerCase();

    const userLevel = studentSkillMap.get(skillName) ?? 0;

    let status: SkillStatus;
    if (userLevel === 0) {
      status = "Missing";
    } else if (userLevel < 3) {
      status = "Weak";
    } else {
      status = "Matched";
    }

    const priorityScore = req.importance * (5 - userLevel);

    return {
      name: req.name,
      status,
      importance: req.importance,
      userLevel,
      priorityScore,
    };
  });

  // Sort by priority (high → low)
  analyzedSkills.sort((a, b) => b.priorityScore - a.priorityScore);

  // Readiness calculation
  const matchedCount = analyzedSkills.filter(
    (s) => s.status === "Matched"
  ).length;

  const readinessPercent = Math.round(
    (matchedCount / analyzedSkills.length) * 100
  );

  // Learning roadmap
  const roadmap = analyzedSkills
    .filter((s) => s.status !== "Matched")
    .map((s) => s.name);

  return {
    student,
    company,
    analyzedSkills,
    readinessPercent,
    roadmap,
  };
}