import { NextResponse } from "next/server";
import { getSession, toNumber } from "@/lib/neo4j";
import { readAuthTokenFromCookies } from "@/lib/security";
import { resolveStudentIdFromUser } from "@/lib/apiAuth";
import { getRecommendationsForStudent } from "@/lib/queries";

export async function GET() {
  const token = await readAuthTokenFromCookies();
  const studentId = token ? await resolveStudentIdFromUser(token.sub) : null;
  const recommendations = studentId ? await getRecommendationsForStudent(studentId) : [];
  const matchByCompanyId = new Map(recommendations.map((item) => [item.companyId, item.match]));

  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (c:Company)
      OPTIONAL MATCH (c)-[:REQUIRES_SKILL]->(sk:Skill)
      RETURN c, count(sk) AS skillCount
      ORDER BY c.name ASC
      `
    );

    return NextResponse.json({
      companies: result.records.map((record) => {
        const c = record.get("c").properties;
        const companyId = String(c.id);
        const match = matchByCompanyId.get(companyId) || 0;
        return {
          id: companyId,
          name: String(c.name),
          role: String(c.role || "Unknown"),
          type: String(c.experienceLevel || "General"),
          location: String(c.location || "Unknown"),
          packageLpa: toNumber(c.packageLpa),
          skills: toNumber(record.get("skillCount")),
          match,
          matchLabel:
            match >= 80 ? "High Priority" :
            match >= 60 ? "Good Match" :
            match >= 45 ? "Moderate Priority" : "Aspirational",
        };
      }),
    });
  } finally {
    await session.close();
  }
}
