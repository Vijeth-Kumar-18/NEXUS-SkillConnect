import { NextRequest, NextResponse } from "next/server";
import { getSession, toNumber, toStringArray } from "@/lib/neo4j";
import { requireAuth, resolveStudentIdFromUser } from "@/lib/apiAuth";

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
      OPTIONAL MATCH (s)-[:HAS_SKILL]->(sk:Skill)
      RETURN s, collect(DISTINCT sk.name) AS skills
      `,
      { studentId }
    );

    if (!result.records.length) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const row = result.records[0];
    const student = row.get("s").properties;

    return NextResponse.json({
      id: String(student.id),
      name: String(student.name),
      degree: String(student.degree || ""),
      expectedGraduation: String(student.expectedGraduation || ""),
      cgpa: toNumber(student.cgpa),
      targetRole: String(student.targetRole || ""),
      github: String(student.github || ""),
      linkedin: String(student.linkedin || ""),
      resumeUrl: String(student.resumeUrl || ""),
      interests: toStringArray(student.interests),
      skills: toStringArray(row.get("skills")),
    });
  } finally {
    await session.close();
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(["STUDENT"]);
  if (!auth.ok) {
    return auth.response;
  }

  const studentId = await resolveStudentIdFromUser(auth.auth.userId);
  if (!studentId) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const body = await request.json();
  const session = getSession("WRITE");
  try {
    await session.run(
      `
      MATCH (s:Student {id: $studentId})
      SET s.cgpa = coalesce($cgpa, s.cgpa),
          s.github = coalesce($github, s.github),
          s.linkedin = coalesce($linkedin, s.linkedin),
          s.resumeUrl = coalesce($resumeUrl, s.resumeUrl),
          s.interests = coalesce($interests, s.interests),
          s.targetRole = coalesce($targetRole, s.targetRole),
          s.updatedAt = datetime()
      `,
      {
        studentId,
        cgpa: typeof body.cgpa === "number" ? body.cgpa : null,
        github: body.github || null,
        linkedin: body.linkedin || null,
        resumeUrl: body.resumeUrl || null,
        interests: Array.isArray(body.interests) ? body.interests : null,
        targetRole: body.targetRole || null,
      }
    );

    return NextResponse.json({ success: true });
  } finally {
    await session.close();
  }
}
