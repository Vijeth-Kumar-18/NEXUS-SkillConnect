import { getSession, toNumber } from "@/lib/neo4j";

interface SkillEdge {
  name: string;
  level: number;
  weight: number;
  demandWeight: number;
}

export interface Recommendation {
  companyId: string;
  company: string;
  role: string;
  location: string;
  packageLpa: number;
  match: number;
  tags: string[];
  missingSkills: string[];
}

function computeMatch(edges: SkillEdge[]): { score: number; missingSkills: string[]; tags: string[] } {
  if (edges.length === 0) {
    return { score: 0, missingSkills: [], tags: [] };
  }

  let weightedTotal = 0;
  let weightedEarned = 0;
  let demandTotal = 0;
  let demandEarned = 0;
  const missingSkills: string[] = [];
  const tags: string[] = [];

  edges.forEach((edge) => {
    const level = toNumber(edge.level);
    const skillWeight = Math.max(1, toNumber(edge.weight));
    const demandWeight = Math.max(1, toNumber(edge.demandWeight));
    const normalizedLevel = Math.min(level, 5) / 5;

    weightedTotal += skillWeight;
    weightedEarned += normalizedLevel * skillWeight;

    demandTotal += demandWeight;
    demandEarned += normalizedLevel * demandWeight;

    if (level === 0) {
      missingSkills.push(edge.name);
    } else if (level >= 3 && tags.length < 4) {
      tags.push(edge.name);
    }
  });

  const skillScore = weightedTotal ? weightedEarned / weightedTotal : 0;
  const demandScore = demandTotal ? demandEarned / demandTotal : 0;
  const finalScore = Math.round((skillScore * 0.6 + demandScore * 0.4) * 100);

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    missingSkills,
    tags,
  };
}

export async function getUserAndStudentByUserId(userId: string): Promise<{
  user: { id: string; email: string; role: string; name: string };
  student: null | { id: string; name: string };
}> {
  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:OWNS_PROFILE]->(s:Student)
      RETURN u, s
      `,
      { userId }
    );

    if (result.records.length === 0) {
      throw new Error("User not found");
    }

    const row = result.records[0];
    const u = row.get("u").properties;
    const sNode = row.get("s");

    return {
      user: { id: String(u.id), email: String(u.email), role: String(u.role), name: String(u.name) },
      student: sNode ? { id: String(sNode.properties.id), name: String(sNode.properties.name) } : null,
    };
  } finally {
    await session.close();
  }
}

export async function getRecommendationsForStudent(studentId: string): Promise<Recommendation[]> {
  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (c:Company)
      OPTIONAL MATCH (c)-[r:REQUIRES_SKILL]->(sk:Skill)
      OPTIONAL MATCH (s:Student {id: $studentId})-[hs:HAS_SKILL]->(sk)
      WITH c, collect({
        name: sk.name,
        level: coalesce(hs.level, 0),
        weight: coalesce(r.weight, 1),
        demandWeight: coalesce(sk.demandWeight, 1)
      }) AS edges
      RETURN c, edges
      `,
      { studentId }
    );

    const recommendations: Recommendation[] = result.records.map((row) => {
      const company = row.get("c").properties;
      const edges = (row.get("edges") as SkillEdge[]).filter((edge) => edge.name);
      const { score, missingSkills, tags } = computeMatch(edges);

      return {
        companyId: String(company.id),
        company: String(company.name),
        role: String(company.role || "Unknown"),
        location: String(company.location || "Unknown"),
        packageLpa: toNumber(company.packageLpa),
        match: score,
        tags,
        missingSkills,
      };
    });

    return recommendations.sort((a, b) => b.match - a.match);
  } finally {
    await session.close();
  }
}

export async function getSkillGap(studentId: string, companyId: string): Promise<{
  readinessPercent: number;
  analyzedSkills: Array<{ name: string; status: "Matched" | "Weak" | "Missing"; importance: number; userLevel: number; priorityScore: number }>;
  roadmap: string[];
}> {
  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (c:Company {id: $companyId})-[r:REQUIRES_SKILL]->(sk:Skill)
      OPTIONAL MATCH (s:Student {id: $studentId})-[hs:HAS_SKILL]->(sk)
      RETURN sk.name AS name, coalesce(r.weight, 1) AS importance, coalesce(hs.level, 0) AS userLevel
      ORDER BY importance DESC
      `,
      { studentId, companyId }
    );

    const analyzedSkills = result.records.map((record) => {
      const userLevel = toNumber(record.get("userLevel"));
      const importance = toNumber(record.get("importance"));
      const status: "Matched" | "Weak" | "Missing" = userLevel === 0 ? "Missing" : userLevel < 3 ? "Weak" : "Matched";
      return {
        name: String(record.get("name")),
        status,
        importance,
        userLevel,
        priorityScore: importance * (5 - Math.min(userLevel, 5)),
      };
    });

    analyzedSkills.sort((a, b) => b.priorityScore - a.priorityScore);

    const matchedCount = analyzedSkills.filter((skill) => skill.status === "Matched").length;
    const readinessPercent = analyzedSkills.length
      ? Math.round((matchedCount / analyzedSkills.length) * 100)
      : 0;

    return {
      readinessPercent,
      analyzedSkills,
      roadmap: analyzedSkills.filter((skill) => skill.status !== "Matched").map((skill) => skill.name),
    };
  } finally {
    await session.close();
  }
}
