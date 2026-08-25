import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/neo4j";
import { publicCacheHeaders, withApiHandler } from "@/lib/apiRoute";

export const GET = withApiHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const company = url.searchParams.get("company")?.trim();

  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (a:Alumni)
      OPTIONAL MATCH (a)-[:WORKS_AT]->(c:Company)
      OPTIONAL MATCH (a)-[:HAS_SKILL]->(sk:Skill)
      WITH a, c, collect(DISTINCT sk.name)[0..6] AS topSkills
      WHERE $company IS NULL OR toLower(c.name) CONTAINS toLower($company)
      RETURN a, c, topSkills
      ORDER BY a.gradYear DESC, a.name ASC
      LIMIT 120
      `,
      { company: company || null }
    );

    return NextResponse.json({
      alumni: result.records.map((record) => {
        const a = record.get("a").properties;
        const c = record.get("c")?.properties || {};
        return {
          id: String(a.id),
          name: String(a.name),
          batch: String(a.gradYear),
          company: String(c.name || "Unknown"),
          role: String(a.currentRole || "Professional"),
          timeline: String(a.timeline || "Timeline unavailable"),
          topSkills: (record.get("topSkills") as string[]) || [],
        };
      }),
    }, {
      headers: publicCacheHeaders(90, 300),
    });
  } finally {
    await session.close();
  }
});
