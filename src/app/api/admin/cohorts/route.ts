import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";
import { getSession, toNumber } from "@/lib/neo4j";
import { withApiHandler } from "@/lib/apiRoute";

export const GET = withApiHandler(async () => {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) {
    return auth.response;
  }

  const session = getSession("READ");
  try {
    const byGraduation = await session.run(
      `
      MATCH (s:Student)
      RETURN s.expectedGraduation AS expectedGraduation,
             count(s) AS students,
             avg(s.cgpa) AS avgCgpa
      ORDER BY expectedGraduation
      `
    );

    const byDegree = await session.run(
      `
      MATCH (s:Student)
      RETURN s.degree AS degree, count(s) AS students
      ORDER BY students DESC
      LIMIT 12
      `
    );

    const totals = await session.run(
      `
      MATCH (s:Student)
      WITH count(s) AS students, count(DISTINCT s.expectedGraduation) AS cohorts, count(DISTINCT s.degree) AS degrees
      RETURN students, cohorts, degrees
      `
    );

    const totalRow = totals.records[0];

    return NextResponse.json({
      totals: {
        students: toNumber(totalRow.get("students")),
        cohorts: toNumber(totalRow.get("cohorts")),
        degrees: toNumber(totalRow.get("degrees")),
      },
      byGraduation: byGraduation.records.map((row) => ({
        expectedGraduation: String(row.get("expectedGraduation") || "Unknown"),
        students: toNumber(row.get("students")),
        avgCgpa: Number(toNumber(row.get("avgCgpa")).toFixed(2)),
      })),
      byDegree: byDegree.records.map((row) => ({
        degree: String(row.get("degree") || "Unknown"),
        students: toNumber(row.get("students")),
      })),
    });
  } finally {
    await session.close();
  }
});
