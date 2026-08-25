import { NextResponse } from "next/server";
import { getSession } from "@/lib/neo4j";
import { readAuthTokenFromCookies, UserRole } from "@/lib/security";

export interface AuthContext {
  userId: string;
  role: UserRole;
  email: string;
  name: string;
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<{ ok: true; auth: AuthContext } | { ok: false; response: NextResponse }> {
  const token = await readAuthTokenFromCookies();
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (allowedRoles && !allowedRoles.includes(token.role)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return {
    ok: true,
    auth: {
      userId: token.sub,
      role: token.role,
      email: token.email,
      name: token.name,
    },
  };
}

export async function resolveStudentIdFromUser(userId: string): Promise<string | null> {
  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:OWNS_PROFILE]->(s:Student)
      RETURN s.id AS studentId
      `,
      { userId }
    );

    if (!result.records.length) {
      return null;
    }

    const studentId = result.records[0].get("studentId");
    return studentId ? String(studentId) : null;
  } finally {
    await session.close();
  }
}
