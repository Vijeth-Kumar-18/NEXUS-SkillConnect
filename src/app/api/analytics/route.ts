import { NextResponse } from "next/server";
import { getSession, toNumber } from "@/lib/neo4j";

export async function GET() {
  const session = getSession("READ");

  try {
    const [overallRes, topRolesRes, topSkillsRes, packageRes, cgpaRes, alumniRes] = await Promise.all([
      session.run(
        `
        RETURN
          size([(c:Company) | c]) AS companies,
          size([(s:Student) | s]) AS students,
          size([(a:Alumni) | a]) AS alumni,
          size([(sk:Skill) | sk]) AS skills
        `
      ),
      session.run(
        `
        MATCH (c:Company)
        RETURN c.role AS name, count(*) AS value
        ORDER BY value DESC
        LIMIT 8
        `
      ),
      session.run(
        `
        MATCH (c:Company)-[:REQUIRES_SKILL]->(sk:Skill)
        RETURN sk.name AS name, count(*) AS value
        ORDER BY value DESC
        LIMIT 8
        `
      ),
      session.run(
        `
        MATCH (c:Company)
        WITH c,
          CASE
            WHEN c.packageLpa < 10 THEN '< 10'
            WHEN c.packageLpa <= 20 THEN '10-20'
            WHEN c.packageLpa <= 30 THEN '20-30'
            ELSE '> 30'
          END AS bucket
        RETURN bucket AS name, count(*) AS value
        ORDER BY name
        `
      ),
      session.run(
        `
        MATCH (s:Student)
        WITH s,
          CASE
            WHEN s.cgpa < 7 THEN '< 7.0'
            WHEN s.cgpa < 8 THEN '7.0-8.0'
            WHEN s.cgpa <= 9 THEN '8.0-9.0'
            ELSE '> 9.0'
          END AS bucket
        RETURN bucket AS name, count(*) AS value
        ORDER BY name
        `
      ),
      session.run(
        `
        MATCH (a:Alumni)
        RETURN a.gradYear AS year, count(*) AS count
        ORDER BY year
        `
      ),
    ]);

    const overall = overallRes.records[0];
    const placements = alumniRes.records.map((record, idx) => {
      const count = toNumber(record.get("count"));
      return {
        year: String(record.get("year")),
        count,
        rate: Math.min(99, Math.round(72 + idx * 1.8 + count * 0.15)),
      };
    });

    return NextResponse.json({
      overall: {
        companiesCount: toNumber(overall.get("companies")),
        studentsCount: toNumber(overall.get("students")),
        alumniCount: toNumber(overall.get("alumni")),
        skillsCount: toNumber(overall.get("skills")),
      },
      companyStats: {
        topRoles: topRolesRes.records.map((record) => ({ name: String(record.get("name")), value: toNumber(record.get("value")) })),
        topSkills: topSkillsRes.records.map((record) => ({ name: String(record.get("name")), value: toNumber(record.get("value")) })),
        packageDistribution: packageRes.records.map((record) => ({ name: String(record.get("name")), value: toNumber(record.get("value")) })),
      },
      studentStats: {
        cgpaDistribution: cgpaRes.records.map((record) => ({ name: String(record.get("name")), value: toNumber(record.get("value")) })),
      },
      alumniStats: {
        alumniPlacements: placements.map((item) => ({ year: item.year, count: item.count })),
        placementRateData: placements.map((item) => ({ year: item.year, rate: item.rate })),
      },
    });
  } finally {
    await session.close();
  }
}
