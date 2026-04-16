import { NextRequest, NextResponse } from "next/server";
import { getSession, toNumber } from "@/lib/neo4j";
import { hashPassword, createAuthToken, setAuthCookie } from "@/lib/security";
import { safeSlug } from "@/lib/csv";
import { sendStudentWelcomeEmail } from "@/lib/mailer";

interface RegisterBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  degree?: string;
  expectedGraduation?: string;
  password?: string;
  targetRole?: string;
  github?: string;
  linkedin?: string;
  topSkills?: string[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RegisterBody;
  const firstName = body.firstName?.trim() || "";
  const lastName = body.lastName?.trim() || "";
  const name = `${firstName} ${lastName}`.trim();
  const email = body.email?.trim().toLowerCase() || "";
  const password = body.password || "";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
  }

  const degree = body.degree?.trim() || "B.Tech Computer Science";
  const expectedGraduation = body.expectedGraduation?.trim() || "2026";
  const targetRole = body.targetRole?.trim() || "Software Engineer";
  const baseSlug = safeSlug(name) || "student";

  const session = getSession("WRITE");
  try {
    const existing = await session.run("MATCH (u:User {email: $email}) RETURN u LIMIT 1", { email });
    if (existing.records.length) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const idResult = await session.run("MATCH (s:Student) RETURN count(s) AS count");
    const nextNumber = toNumber(idResult.records[0].get("count")) + 1;
    const studentId = `S${String(10000 + nextNumber).slice(-4)}`;
    const userId = `U-${studentId}`;

    await session.executeWrite(async (tx) => {
      await tx.run(
        `
        CREATE (s:Student {
          id: $studentId,
          name: $name,
          degree: $degree,
          expectedGraduation: $expectedGraduation,
          cgpa: 0,
          targetRole: $targetRole,
          github: $github,
          linkedin: $linkedin,
          resumeUrl: '',
          interests: [$targetRole, 'Placement Preparation'],
          createdAt: datetime(),
          updatedAt: datetime()
        })
        `,
        {
          studentId,
          name,
          degree,
          expectedGraduation,
          targetRole,
          github: body.github?.trim() || `https://github.com/${baseSlug}`,
          linkedin: body.linkedin?.trim() || `https://linkedin.com/in/${baseSlug}`,
        }
      );

      await tx.run(
        `
        CREATE (u:User {
          id: $userId,
          email: $email,
          name: $name,
          role: 'STUDENT',
          passwordHash: $passwordHash,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        WITH u
        MATCH (s:Student {id: $studentId})
        CREATE (u)-[:OWNS_PROFILE]->(s)
        `,
        {
          userId,
          email,
          name,
          passwordHash: hashPassword(password),
          studentId,
        }
      );

      for (const skill of body.topSkills || []) {
        const skillName = skill.trim();
        if (!skillName) {
          continue;
        }

        await tx.run(
          `
          MERGE (sk:Skill {normalizedName: toLower($skillName)})
          ON CREATE SET sk.name = $skillName, sk.demandWeight = 1, sk.createdAt = datetime()
          SET sk.updatedAt = datetime()
          WITH sk
          MATCH (s:Student {id: $studentId})
          MERGE (s)-[r:HAS_SKILL]->(sk)
          SET r.level = 2
          `,
          { skillName, studentId }
        );
      }
    });

    const token = await createAuthToken({ sub: userId, role: "STUDENT", email, name });
    await setAuthCookie(token);

    sendStudentWelcomeEmail({ to: email, name, studentId }).catch(() => {
      // Email delivery should not block registration success.
    });

    return NextResponse.json({ success: true, studentId, userId });
  } finally {
    await session.close();
  }
}
