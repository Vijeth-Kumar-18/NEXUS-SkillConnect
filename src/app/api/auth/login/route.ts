import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/neo4j";
import { createAuthToken, setAuthCookie, verifyPassword, UserRole } from "@/lib/security";

interface LoginBody {
  email?: string;
  password?: string;
  role?: UserRole;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password || "";
  const role = body.role;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const session = getSession("READ");
  try {
    const result = await session.run(
      `
      MATCH (u:User {email: $email})
      OPTIONAL MATCH (u)-[:OWNS_PROFILE]->(s:Student)
      RETURN u, s
      `,
      { email }
    );

    if (!result.records.length) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const row = result.records[0];
    const user = row.get("u").properties;
    const studentNode = row.get("s");

    const userRole = String(user.role || "STUDENT") as UserRole;
    if (role && role !== userRole) {
      return NextResponse.json({ error: `This account is not registered as ${role}` }, { status: 403 });
    }

    const ok = verifyPassword(password, String(user.passwordHash || ""));
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createAuthToken({
      sub: String(user.id),
      role: userRole,
      email: String(user.email),
      name: String(user.name || "User"),
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: String(user.id),
        email: String(user.email),
        role: userRole,
        name: String(user.name || "User"),
        studentId: studentNode ? String(studentNode.properties.id) : null,
      },
    });
  } finally {
    await session.close();
  }
}
