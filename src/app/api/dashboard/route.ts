import { NextResponse } from "next/server";
import { requireAuth, resolveStudentIdFromUser } from "@/lib/apiAuth";
import { getSession, toNumber } from "@/lib/neo4j";
import { getRecommendationsForStudent } from "@/lib/queries";
import { withApiHandler } from "@/lib/apiRoute";

export const GET = withApiHandler(async () => {
  const auth = await requireAuth(["STUDENT", "ADMIN"]);
  if (!auth.ok) {
    return auth.response;
  }

  const studentId = await resolveStudentIdFromUser(auth.auth.userId);
  if (!studentId) {
    return NextResponse.json({
      profile: { name: auth.auth.name, role: auth.auth.role },
      stats: { skillsTracked: 0, averageMatch: 0, companiesTargeted: 0, mockInterviews: 0 },
      topRecommendations: [],
      alerts: [],
    });
  }

  const [recommendations, sessionResult] = await Promise.all([
    getRecommendationsForStudent(studentId),
    (async () => {
      const session = getSession("READ");
      try {
        const result = await session.run(
          `
          MATCH (s:Student {id: $studentId})
          OPTIONAL MATCH (s)-[hs:HAS_SKILL]->(sk:Skill)
          OPTIONAL MATCH (s)-[:BUILT_PROJECT]->(p:Project)
          RETURN s, count(DISTINCT sk) AS skillsTracked, count(DISTINCT p) AS projects
          `,
          { studentId }
        );
        return result.records[0];
      } finally {
        await session.close();
      }
    })(),
  ]);

  const profileNode = sessionResult.get("s").properties;
  const missingSkills = Array.from(
    new Set(recommendations.slice(0, 5).flatMap((item) => item.missingSkills.slice(0, 2)))
  );

  const averageMatch = recommendations.length
    ? Math.round(recommendations.reduce((acc, item) => acc + item.match, 0) / recommendations.length)
    : 0;

  return NextResponse.json({
    profile: {
      id: String(profileNode.id),
      name: String(profileNode.name),
      degree: String(profileNode.degree || ""),
      expectedGraduation: String(profileNode.expectedGraduation || ""),
      cgpa: toNumber(profileNode.cgpa),
      targetRole: String(profileNode.targetRole || ""),
      github: String(profileNode.github || ""),
      linkedin: String(profileNode.linkedin || ""),
      interests: (profileNode.interests as string[]) || [],
    },
    stats: {
      skillsTracked: toNumber(sessionResult.get("skillsTracked")),
      averageMatch,
      companiesTargeted: recommendations.filter((item) => item.match >= 50).length,
      mockInterviews: recommendations.slice(0, 3).reduce((acc, item) => acc + Math.min(2, Math.floor(item.match / 35)), 0),
    },
    topRecommendations: recommendations.slice(0, 3),
    alerts: missingSkills.slice(0, 6),
  });
});
