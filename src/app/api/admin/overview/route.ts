import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";
import { getSession, toNumber } from "@/lib/neo4j";

export async function GET() {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) {
    return auth.response;
  }

  const session = getSession("READ");
  try {
    const countsResult = await session.run(
      `
      RETURN
        size([(c:Company) | c]) AS companies,
        size([(s:Student) | s]) AS students,
        size([(a:Alumni) | a]) AS alumni,
        size([(sk:Skill) | sk]) AS skills
      `
    );

    const topSkills = await session.run(
      `
      MATCH (c:Company)-[r:REQUIRES_SKILL]->(sk:Skill)
      RETURN sk.name AS skill, count(r) AS demand
      ORDER BY demand DESC
      LIMIT 8
      `
    );

    const row = countsResult.records[0];
    return NextResponse.json({
      counts: {
        companies: toNumber(row.get("companies")),
        students: toNumber(row.get("students")),
        alumni: toNumber(row.get("alumni")),
        skills: toNumber(row.get("skills")),
      },
      topSkills: topSkills.records.map((record) => ({
        skill: String(record.get("skill")),
        demand: toNumber(record.get("demand")),
      })),
    });
  } finally {
    await session.close();
  }
}
