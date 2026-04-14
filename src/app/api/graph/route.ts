import { NextResponse } from "next/server";
import { requireAuth, resolveStudentIdFromUser } from "@/lib/apiAuth";
import { getSession, toNumber } from "@/lib/neo4j";

export async function GET() {
  const auth = await requireAuth(["STUDENT"]);
  if (!auth.ok) {
    return auth.response;
  }

  const studentId = await resolveStudentIdFromUser(auth.auth.userId);
  if (!studentId) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (s:Student {id: $studentId})
      OPTIONAL MATCH (s)-[hs:HAS_SKILL]->(sk:Skill)
      OPTIONAL MATCH (c:Company)-[r:REQUIRES_SKILL]->(sk)
      RETURN s,
             collect(DISTINCT {id: sk.normalizedName, name: sk.name, level: coalesce(hs.level, 0)}) AS skills,
             collect(DISTINCT {id: c.id, name: c.name, role: c.role, weight: coalesce(r.weight, 1), skillId: sk.normalizedName}) AS companies
      `,
      { studentId }
    );

    if (!result.records.length) {
      return NextResponse.json({ nodes: [], links: [] });
    }

    const row = result.records[0];
    const student = row.get("s").properties;
    const skills = (row.get("skills") as Array<{ id: string; name: string; level: number }>).filter((item) => item.id);
    const companyEdges = (row.get("companies") as Array<{ id: string; name: string; role: string; weight: number; skillId: string }>).filter((item) => item.id);
    const companyMap = new Map<string, { id: string; name: string; role: string; weight: number }>();
    companyEdges.forEach((item) => {
      if (!companyMap.has(item.id)) {
        companyMap.set(item.id, { id: item.id, name: item.name, role: item.role, weight: item.weight });
      }
    });
    const companies = Array.from(companyMap.values());

    const nodes = [
      { id: String(student.id), label: String(student.name), type: "student", score: 1 },
      ...skills.map((skill) => ({ id: `skill-${skill.id}`, label: skill.name, type: "skill", score: toNumber(skill.level) })),
      ...companies.map((company) => ({ id: `company-${company.id}`, label: company.name, type: "company", score: toNumber(company.weight) })),
    ];

    const links = [
      ...skills.map((skill) => ({ source: String(student.id), target: `skill-${skill.id}`, type: "HAS_SKILL" })),
      ...companyEdges
        .filter((company) => company.skillId)
        .map((company) => ({ source: `skill-${company.skillId}`, target: `company-${company.id}`, type: "REQUIRES" })),
    ];

    return NextResponse.json({ nodes, links });
  } finally {
    await session.close();
  }
}
