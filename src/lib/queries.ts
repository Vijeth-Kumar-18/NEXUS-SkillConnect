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
  alumniCount: number;
  eligibilityStatus: "Eligible" | "Ineligible";
  reasoning: string[];
}

export interface MentorRecommendation {
  alumniId: string;
  name: string;
  role: string;
  company: string;
  matchReason: string;
  sharedSkills: string[];
  strength: number;
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
        alumniCount: 0,
        eligibilityStatus: "Eligible" as const,
        reasoning: ["Basic skill match analysis"],
      };
    });

    return recommendations.sort((a, b) => b.match - a.match);
  } finally {
    await session.close();
  }
}

export async function getEnhancedRecommendations(studentId: string): Promise<Recommendation[]> {
  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (s:Student {id: $studentId})
      MATCH (c:Company)
      
      // Skills & Requirements
      OPTIONAL MATCH (c)-[r:REQUIRES_SKILL]->(sk:Skill)
      OPTIONAL MATCH (s)-[hs:HAS_SKILL]->(sk)
      
      // Alumni Connections
      OPTIONAL MATCH (a:Alumni)-[:WORKS_AT|WORKED_AT]->(c)
      
      WITH s, c, 
           count(DISTINCT a) as alumniCount,
           collect({
             name: sk.name,
             level: coalesce(hs.level, 0),
             weight: coalesce(r.weight, 1),
             demandWeight: coalesce(sk.demandWeight, 1)
           }) AS skillEdges
           
      RETURN c, skillEdges, alumniCount, s.cgpa as cgpa, s.targetRole as targetRole
      `,
      { studentId }
    );

    const recommendations: Recommendation[] = result.records.map((row) => {
      const company = row.get("c").properties;
      const skillEdges = (row.get("skillEdges") as SkillEdge[]).filter((e) => e.name);
      const alumniCount = toNumber(row.get("alumniCount"));
      const studentCgpa = toNumber(row.get("cgpa"));
      const targetRole = String(row.get("targetRole")).toLowerCase();
      const companyRole = String(company.role || "").toLowerCase();

      const { score: baseSkillScore, missingSkills, tags } = computeMatch(skillEdges);
      
      // Additional logic for Role Fit
      const roleMatch = companyRole.includes(targetRole) || targetRole.includes(companyRole);
      const roleBonus = roleMatch ? 15 : 0;
      
      // Alumni Bonus
      const alumniBonus = Math.min(alumniCount * 5, 20); // Max 20% bonus for many alumni
      
      // Eligibility
      const minCgpa = toNumber(company.eligibilityCgpa || 7.0);
      const isEligible = studentCgpa >= minCgpa;
      const eligibilityPenalty = isEligible ? 0 : -30;

      const finalScore = Math.min(100, Math.max(0, baseSkillScore + roleBonus + alumniBonus + eligibilityPenalty));

      const reasoning = [];
      if (baseSkillScore > 70) reasoning.push("Strong skill overlap");
      if (roleMatch) reasoning.push(`Direct match for your goal as ${company.role}`);
      if (alumniCount > 0) reasoning.push(`Connected via ${alumniCount} Nexus alumni`);
      if (!isEligible) reasoning.push(`Below required CGPA (${minCgpa}+)`);

      return {
        companyId: String(company.id),
        company: String(company.name),
        role: String(company.role || "Unknown"),
        location: String(company.location || "Unknown"),
        packageLpa: toNumber(company.packageLpa),
        match: finalScore,
        tags,
        missingSkills,
        alumniCount,
        eligibilityStatus: isEligible ? "Eligible" : "Ineligible",
        reasoning,
      };
    });

    return recommendations.sort((a, b) => b.match - a.match);
  } finally {
    await session.close();
  }
}

export async function getRecommendedMentors(studentId: string): Promise<MentorRecommendation[]> {
  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (s:Student {id: $studentId})
      MATCH (a:Alumni)
      WHERE a.id <> $studentId // Ensure not matching self if same node type (though they aren't here)
      
      // Match via Shared Skills (Alumni must have higher or equal level)
      MATCH (s)-[hs:HAS_SKILL]->(sk:Skill)<-[has:HAS_SKILL]-(a)
      WHERE has.level >= hs.level
      
      // Optional: Alumni works at a company the student might like
      OPTIONAL MATCH (a)-[:WORKS_AT]->(c:Company)
      
      WITH s, a, c, collect(sk.name) as sharedSkills
      WHERE size(sharedSkills) > 0
      
      RETURN a, c, sharedSkills, size(sharedSkills) as skillCount
      ORDER BY skillCount DESC
      LIMIT 6
      `,
      { studentId }
    );

    return result.records.map((row) => {
      const alumni = row.get("a").properties;
      const company = row.get("c")?.properties;
      const sharedSkills = row.get("sharedSkills") as string[];

      return {
        alumniId: String(alumni.id),
        name: String(alumni.name),
        role: String(alumni.currentRole || "Professional"),
        company: company ? String(company.name) : "Various Companies",
        matchReason: `Expertise in ${sharedSkills.slice(0, 2).join(", ")}`,
        sharedSkills,
        strength: Math.min(100, sharedSkills.length * 20),
      };
    });
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

    // Calculate weighted readiness percentage
    let weightedTotal = 0;
    let weightedEarned = 0;

    analyzedSkills.forEach((skill) => {
      const skillWeight = Math.max(1, skill.importance);
      const normalizedLevel = Math.min(skill.userLevel, 5) / 5;
      
      weightedTotal += skillWeight;
      weightedEarned += normalizedLevel * skillWeight;
    });

    const readinessPercent = weightedTotal 
      ? Math.round((weightedEarned / weightedTotal) * 100)
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
