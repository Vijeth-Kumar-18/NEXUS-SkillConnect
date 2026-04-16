import { NextRequest, NextResponse } from "next/server";
import { getSession, toNumber } from "@/lib/neo4j";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: Params) {
  const { id } = await context.params;
  const session = getSession("READ");

  try {
    const companyRes = await session.run(
      `
      MATCH (c:Company {id: $id})
      OPTIONAL MATCH (c)-[r:REQUIRES_SKILL]->(sk:Skill)
      OPTIONAL MATCH (c)-[:HAS_ROUND]->(rd:Round)
      OPTIONAL MATCH (rd)-[:ASKS]->(q:Question)
      OPTIONAL MATCH (a:Alumni)-[:WORKS_AT]->(c)
      RETURN c,
             collect(DISTINCT {name: sk.name, weight: coalesce(r.weight, 1), demandWeight: coalesce(sk.demandWeight, 1)}) AS skills,
             collect(DISTINCT {id: rd.id, order: rd.order, type: rd.type}) AS rounds,
             collect(DISTINCT {id: q.id, text: q.text, topic: q.topic, difficulty: q.difficulty}) AS questions,
             count(DISTINCT a) AS alumniCount
      `,
      { id }
    );

    if (!companyRes.records.length) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const row = companyRes.records[0];
    const c = row.get("c").properties;

    return NextResponse.json({
      company: {
        id: String(c.id),
        name: String(c.name),
        role: String(c.role || "Unknown"),
        location: String(c.location || "Unknown"),
        experienceLevel: String(c.experienceLevel || "Unknown"),
        packageLpa: toNumber(c.packageLpa),
        eligibilityCgpa: toNumber(c.eligibilityCgpa),
        numRounds: toNumber(c.numRounds),
      },
      requiredSkills: (row.get("skills") as Array<{ name: string; weight: number; demandWeight: number }>)
        .filter((item) => item.name)
        .sort((a, b) => toNumber(b.weight) - toNumber(a.weight)),
      rounds: (row.get("rounds") as Array<{ id: string; order: number; type: string }>)
        .filter((item) => item.id)
        .sort((a, b) => toNumber(a.order) - toNumber(b.order)),
      questions: (row.get("questions") as Array<{ id: string; text: string; topic: string; difficulty: string }>)
        .filter((item) => item.id),
      alumniCount: toNumber(row.get("alumniCount")),
    });
  } finally {
    await session.close();
  }
}
