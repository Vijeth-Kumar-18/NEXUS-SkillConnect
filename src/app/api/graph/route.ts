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
      WITH s, sk, coalesce(hs.level, 0) AS level
      ORDER BY level DESC, sk.name ASC
      WITH s, [x IN collect({
        id: sk.normalizedName,
        name: sk.name,
        level: level
      }) WHERE x.id IS NOT NULL][0..14] AS skills
      UNWIND skills AS chosenSkill
      MATCH (c:Company)-[r:REQUIRES_SKILL]->(:Skill {normalizedName: chosenSkill.id})
      WITH s, collect(DISTINCT chosenSkill) AS skills, c,
           count(*) AS matchedSkills,
           max(coalesce(r.weight, 1)) AS maxWeight
      ORDER BY matchedSkills DESC, maxWeight DESC, c.name ASC
      WITH s, skills, collect({
        id: c.id,
        name: c.name,
        role: c.role,
        weight: maxWeight,
        matchedSkills: matchedSkills
      })[0..16] AS companies
      RETURN s, skills, companies
      `,
      { studentId }
    );

    if (!result.records.length) {
      return NextResponse.json({ nodes: [], links: [] });
    }

    const row = result.records[0];
    const student = row.get("s").properties;
    const skills = (row.get("skills") as Array<{ id: string; name: string; level: number }>).filter((item) => item.id);
    const companies = (row.get("companies") as Array<{ id: string; name: string; role: string; weight: number; matchedSkills: number }>).filter(
      (item) => item.id
    );

    const linkResult = await session.run(
      `
      UNWIND $skillIds AS skillId
      MATCH (sk:Skill {normalizedName: skillId})<-[r:REQUIRES_SKILL]-(c:Company)
      WHERE c.id IN $companyIds
      RETURN sk.normalizedName AS skillId, c.id AS companyId, max(coalesce(r.weight, 1)) AS weight
      `,
      {
        skillIds: skills.map((s) => s.id),
        companyIds: companies.map((c) => c.id),
      }
    );

    const nodes = [
      { id: String(student.id), label: String(student.name), type: "student", score: 1 },
      ...skills.map((skill) => ({ id: `skill-${skill.id}`, label: skill.name, type: "skill", score: toNumber(skill.level) })),
      ...companies.map((company) => ({ id: `company-${company.id}`, label: company.name, type: "company", score: toNumber(company.weight) })),
    ];

    const studentSkillLinks = skills.map((skill) => ({ source: String(student.id), target: `skill-${skill.id}`, type: "HAS_SKILL" }));
    const skillCompanyLinks = linkResult.records.map((record) => ({
      source: `skill-${String(record.get("skillId"))}`,
      target: `company-${String(record.get("companyId"))}`,
      type: "REQUIRES",
      weight: toNumber(record.get("weight")),
    }));

    const links = [...studentSkillLinks, ...skillCompanyLinks];

    return NextResponse.json({ nodes, links });
  } finally {
    await session.close();
  }
}
