import { NextRequest, NextResponse } from "next/server";
import { getSession, toNumber } from "@/lib/neo4j";
import { requireAuth, resolveStudentIdFromUser } from "@/lib/apiAuth";
import { withApiHandler } from "@/lib/apiRoute";

export const GET = withApiHandler(async () => {
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
      MATCH (s:Student {id: $studentId})-[hs:HAS_SKILL]->(sk:Skill)
      RETURN sk.name AS name, coalesce(hs.level, 1) AS level
      ORDER BY level DESC, sk.name ASC
      `,
      { studentId }
    );

    return NextResponse.json({
      skills: result.records.map((record) => ({
        name: String(record.get("name")),
        level: toNumber(record.get("level")),
      })),
    });
  } finally {
    await session.close();
  }
});

export const POST = withApiHandler(async (request: NextRequest) => {
  const auth = await requireAuth(["STUDENT"]);
  if (!auth.ok) {
    return auth.response;
  }

  const studentId = await resolveStudentIdFromUser(auth.auth.userId);
  if (!studentId) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const level = Math.max(1, Math.min(5, Number(body.level) || 1));

  if (!name) {
    return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
  }

  const session = getSession("WRITE");
  try {
    await session.run(
      `
      MERGE (sk:Skill {normalizedName: toLower($name)})
      ON CREATE SET sk.name = $name, sk.createdAt = datetime(), sk.demandWeight = 1
      SET sk.updatedAt = datetime()
      WITH sk
      MATCH (s:Student {id: $studentId})
      MERGE (s)-[hs:HAS_SKILL]->(sk)
      SET hs.level = $level
      `,
      { name, studentId, level }
    );

    return NextResponse.json({ success: true });
  } finally {
    await session.close();
  }
});

export const DELETE = withApiHandler(async (request: NextRequest) => {
  const auth = await requireAuth(["STUDENT"]);
  if (!auth.ok) {
    return auth.response;
  }

  const studentId = await resolveStudentIdFromUser(auth.auth.userId);
  if (!studentId) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const name = url.searchParams.get("name")?.trim() || "";

  if (!name) {
    return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
  }

  const session = getSession("WRITE");
  try {
    await session.run(
      `
      MATCH (s:Student {id: $studentId})-[hs:HAS_SKILL]->(sk:Skill {normalizedName: toLower($name)})
      DELETE hs
      `,
      { studentId, name }
    );

    return NextResponse.json({ success: true });
  } finally {
    await session.close();
  }
});
