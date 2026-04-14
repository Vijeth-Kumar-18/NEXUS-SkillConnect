import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getSession, toNumber } from "@/lib/neo4j";
import { normalizeSkillName, parseCsv, safeSlug, splitPipeList } from "@/lib/csv";
import { hashPassword } from "@/lib/security";

interface NormalizedCompany {
  id: string;
  name: string;
  role: string;
  requiredSkills: string[];
  rounds: number;
  location: string;
  packageLpa: number;
  experienceLevel: string;
  eligibilityCgpa: number;
}

interface NormalizedStudent {
  id: string;
  name: string;
  email: string;
  degree: string;
  expectedGraduation: string;
  cgpa: number;
  targetRole: string;
  projects: string[];
  topSkills: string[];
  github: string;
  linkedin: string;
  interests: string[];
}

interface NormalizedAlumni {
  id: string;
  name: string;
  gradYear: string;
  currentCompany: string;
  currentRole: string;
  priorCompanies: string[];
  skills: string[];
  projects: string[];
  timeline: string;
}

function loadDataset(fileName: string): string {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function stableLevel(seed: string): number {
  const hash = crypto.createHash("md5").update(seed).digest("hex");
  const n = parseInt(hash.slice(0, 2), 16);
  return (n % 5) + 1;
}

function normalizeCompanyRows(raw: string): NormalizedCompany[] {
  const rows = parseCsv(raw);
  const normalized: NormalizedCompany[] = [];

  rows.forEach((row, index) => {
    const hasCanonicalId = /^J\d+/i.test(row.JobID || "");

    const name = (hasCanonicalId ? row.Company : row.JobID || "").trim();
    const role = (hasCanonicalId ? row.Role : row.Company || "").trim();
    const requiredSkillsRaw = (hasCanonicalId ? row.RequiredSkills : row.Role || "").trim();
    const roundsRaw = hasCanonicalId ? row.NumRounds : row.RequiredSkills;
    const location = (hasCanonicalId ? row.Location : row.NumRounds || "").trim();
    const packageRaw = hasCanonicalId ? row.Package_LPA : row.Location;
    const experienceLevel = (hasCanonicalId ? row.ExperienceLevel : row.Package_LPA || "Entry").trim() || "Entry";

    if (!name || !role) {
      return;
    }

    const id = hasCanonicalId ? row.JobID.trim() : `JX${String(index + 1).padStart(4, "0")}`;
    const rounds = Math.max(1, Math.min(8, Math.round(Number(roundsRaw) || 3)));
    const packageLpa = Number(packageRaw) || 12;
    const requiredSkills = splitPipeList(requiredSkillsRaw).map(normalizeSkillName);

    normalized.push({
      id,
      name,
      role,
      requiredSkills,
      rounds,
      location: location || "Remote",
      packageLpa,
      experienceLevel,
      eligibilityCgpa: 7.0,
    });
  });

  return normalized;
}

function normalizeStudentRows(raw: string): NormalizedStudent[] {
  const rows = parseCsv(raw);
  const normalized: NormalizedStudent[] = [];

  rows.forEach((row, index) => {
    const isCanonical = /^S\d+/i.test(row.StudentID || "");

    const name = (isCanonical ? row.Name : row.StudentID || "").trim();
    const degree = (isCanonical ? row.Degree : row.Name || "").trim();
    const expectedGraduation = String(isCanonical ? row.ExpectedGraduation : row.Degree || "2026").trim();
    const topSkillsRaw = (isCanonical ? row.TopSkills : row.ExpectedGraduation || "").trim();
    const projectsRaw = isCanonical ? row.Projects : "";
    const cgpaRaw = isCanonical ? row.CGPA : row.Projects;
    const targetRole = (isCanonical ? row.TargetRole : row.CGPA || "Software Engineer").trim() || "Software Engineer";

    if (!name || !degree) {
      return;
    }

    const topSkills = splitPipeList(topSkillsRaw).map(normalizeSkillName);
    const projects = splitPipeList(projectsRaw).map((project) => project.trim());

    const id = isCanonical ? row.StudentID.trim() : `S${String(index + 1001).padStart(4, "0")}`;
    const slug = safeSlug(name);
    const cgpa = Number(cgpaRaw) || 7.5;

    normalized.push({
      id,
      name,
      email: `${slug}.${id.toLowerCase()}@nexus.edu`,
      degree,
      expectedGraduation,
      cgpa,
      targetRole,
      projects,
      topSkills,
      github: `https://github.com/${slug || `student-${id.toLowerCase()}`}`,
      linkedin: `https://linkedin.com/in/${slug || `student-${id.toLowerCase()}`}`,
      interests: [targetRole, "Placement Preparation", "Interview Practice"],
    });
  });

  return normalized;
}

function normalizeAlumniRows(raw: string): NormalizedAlumni[] {
  const rows = parseCsv(raw);
  const normalized: NormalizedAlumni[] = [];

  rows.forEach((row, index) => {
    const isCanonical = /^A\d+/i.test(row.AlumniID || "");

    const name = (isCanonical ? row.Name : row.AlumniID || "").trim();
    const gradYear = String(isCanonical ? row.GradYear : row.Name || "2022").trim();
    const currentCompany = (isCanonical ? row.CurrentCompany : row.GradYear || "Unknown").trim() || "Unknown";
    const currentRole = (isCanonical ? row.CurrentRole : "Professional").trim() || "Professional";
    const priorCompaniesRaw = isCanonical ? row.PriorCompanies : row.CurrentCompany;
    const skillsRaw = isCanonical ? row.Skills : "";
    const projectsRaw = isCanonical ? row.KeyProjects : "";
    const timeline = (isCanonical ? row.Timeline : row.CurrentRole || "Career progression available").trim();

    if (!name) {
      return;
    }

    const id = isCanonical ? row.AlumniID.trim() : `AX${String(index + 1).padStart(4, "0")}`;

    normalized.push({
      id,
      name,
      gradYear,
      currentCompany,
      currentRole,
      priorCompanies: splitPipeList(priorCompaniesRaw).filter((item) => item.toLowerCase() !== "none"),
      skills: splitPipeList(skillsRaw).map(normalizeSkillName),
      projects: splitPipeList(projectsRaw),
      timeline,
    });
  });

  return normalized;
}

function generateInterviewQuestion(skill: string, role: string, company: string): string {
  return `How would you apply ${skill} in the ${role} role at ${company}?`;
}

function roundTypeByOrder(order: number): string {
  const roundTypes = ["Aptitude", "Coding", "Technical", "System Design", "Managerial", "HR", "Behavioral", "Offer Discussion"];
  return roundTypes[Math.min(order - 1, roundTypes.length - 1)];
}

async function ensureConstraints(): Promise<void> {
  const session = getSession("WRITE");
  try {
    await session.executeWrite(async (tx) => {
      await tx.run("CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE");
      await tx.run("CREATE CONSTRAINT user_email_unique IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE");
      await tx.run("CREATE CONSTRAINT student_id_unique IF NOT EXISTS FOR (s:Student) REQUIRE s.id IS UNIQUE");
      await tx.run("CREATE CONSTRAINT company_id_unique IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE");
      await tx.run("CREATE CONSTRAINT skill_name_unique IF NOT EXISTS FOR (sk:Skill) REQUIRE sk.normalizedName IS UNIQUE");
      await tx.run("CREATE CONSTRAINT alumni_id_unique IF NOT EXISTS FOR (a:Alumni) REQUIRE a.id IS UNIQUE");
      await tx.run("CREATE CONSTRAINT project_name_unique IF NOT EXISTS FOR (p:Project) REQUIRE p.name IS UNIQUE");
      await tx.run("CREATE CONSTRAINT round_id_unique IF NOT EXISTS FOR (r:Round) REQUIRE r.id IS UNIQUE");
      await tx.run("CREATE CONSTRAINT question_id_unique IF NOT EXISTS FOR (q:Question) REQUIRE q.id IS UNIQUE");
    });
  } finally {
    await session.close();
  }
}

export async function seedFromLocalDatasets(): Promise<{ companies: number; students: number; alumni: number }> {
  await ensureConstraints();

  const companyRows = normalizeCompanyRows(loadDataset("Data1.txt"));
  const studentRows = normalizeStudentRows(loadDataset("Data2.txt"));
  const alumniRows = normalizeAlumniRows(loadDataset("Data3.txt"));

  const skillDemandCount = new Map<string, number>();
  companyRows.forEach((company) => {
    company.requiredSkills.forEach((skill) => {
      skillDemandCount.set(skill, (skillDemandCount.get(skill) || 0) + 1);
    });
  });

  const session = getSession("WRITE");
  try {
    await session.executeWrite(async (tx) => {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@nexus.edu";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

      await tx.run(
        `
        MERGE (u:User {email: $email})
        ON CREATE SET u.id = $id, u.name = 'System Administrator', u.role = 'ADMIN', u.createdAt = datetime()
        SET u.passwordHash = $passwordHash, u.updatedAt = datetime()
        `,
        {
          id: "ADMIN-001",
          email: adminEmail,
          passwordHash: hashPassword(adminPassword),
        }
      );

      for (const company of companyRows) {
        await tx.run(
          `
          MERGE (c:Company {id: $id})
          SET c.name = $name,
              c.role = $role,
              c.location = $location,
              c.packageLpa = $packageLpa,
              c.experienceLevel = $experienceLevel,
              c.eligibilityCgpa = $eligibilityCgpa,
              c.numRounds = $rounds,
              c.updatedAt = datetime()
          `,
          company
        );

        for (let i = 0; i < company.requiredSkills.length; i += 1) {
          const skill = company.requiredSkills[i];
          const demandWeight = skillDemandCount.get(skill) || 1;
          const relationWeight = Math.max(1, 6 - i);

          await tx.run(
            `
            MERGE (sk:Skill {normalizedName: $normalizedName})
            ON CREATE SET sk.name = $name, sk.createdAt = datetime()
            SET sk.demandWeight = $demandWeight, sk.updatedAt = datetime()
            WITH sk
            MATCH (c:Company {id: $companyId})
            MERGE (c)-[r:REQUIRES_SKILL]->(sk)
            SET r.weight = $weight
            `,
            {
              normalizedName: skill.toLowerCase(),
              name: skill,
              demandWeight,
              companyId: company.id,
              weight: relationWeight,
            }
          );
        }

        for (let round = 1; round <= company.rounds; round += 1) {
          const roundId = `${company.id}-R${round}`;
          const type = roundTypeByOrder(round);
          await tx.run(
            `
            MERGE (r:Round {id: $id})
            SET r.order = $order, r.type = $type
            WITH r
            MATCH (c:Company {id: $companyId})
            MERGE (c)-[:HAS_ROUND {order: $order}]->(r)
            `,
            { id: roundId, order: round, type, companyId: company.id }
          );

          const topSkill = company.requiredSkills[(round - 1) % Math.max(company.requiredSkills.length, 1)] || "Problem Solving";
          const questionId = `${roundId}-Q1`;
          await tx.run(
            `
            MERGE (q:Question {id: $id})
            SET q.text = $text, q.topic = $topic, q.difficulty = $difficulty
            WITH q
            MATCH (r:Round {id: $roundId})
            MERGE (r)-[:ASKS]->(q)
            `,
            {
              id: questionId,
              text: generateInterviewQuestion(topSkill, company.role, company.name),
              topic: topSkill,
              difficulty: round >= 4 ? "High" : round >= 2 ? "Medium" : "Low",
              roundId,
            }
          );
        }
      }

      for (const student of studentRows) {
        await tx.run(
          `
          MERGE (s:Student {id: $id})
          SET s.name = $name,
              s.degree = $degree,
              s.expectedGraduation = $expectedGraduation,
              s.cgpa = $cgpa,
              s.targetRole = $targetRole,
              s.github = $github,
              s.linkedin = $linkedin,
              s.resumeUrl = coalesce(s.resumeUrl, ''),
              s.interests = $interests,
              s.updatedAt = datetime()
          `,
          student
        );

        await tx.run(
          `
          MERGE (u:User {email: $email})
          ON CREATE SET u.id = $id, u.name = $name, u.role = 'STUDENT', u.createdAt = datetime()
          SET u.passwordHash = $passwordHash, u.updatedAt = datetime()
          WITH u
          MATCH (s:Student {id: $studentId})
          MERGE (u)-[:OWNS_PROFILE]->(s)
          `,
          {
            id: `U-${student.id}`,
            email: student.email,
            name: student.name,
            studentId: student.id,
            passwordHash: hashPassword("password"),
          }
        );

        for (const skill of student.topSkills) {
          await tx.run(
            `
            MERGE (sk:Skill {normalizedName: $normalizedName})
            ON CREATE SET sk.name = $name, sk.createdAt = datetime(), sk.demandWeight = 1
            SET sk.updatedAt = datetime()
            WITH sk
            MATCH (s:Student {id: $studentId})
            MERGE (s)-[r:HAS_SKILL]->(sk)
            SET r.level = $level
            `,
            {
              normalizedName: skill.toLowerCase(),
              name: skill,
              studentId: student.id,
              level: stableLevel(`${student.id}:${skill}`),
            }
          );
        }

        for (const project of student.projects) {
          await tx.run(
            `
            MERGE (p:Project {name: $name})
            WITH p
            MATCH (s:Student {id: $studentId})
            MERGE (s)-[:BUILT_PROJECT]->(p)
            `,
            { name: project, studentId: student.id }
          );
        }
      }

      for (const alumni of alumniRows) {
        await tx.run(
          `
          MERGE (a:Alumni {id: $id})
          SET a.name = $name,
              a.gradYear = $gradYear,
              a.currentRole = $currentRole,
              a.timeline = $timeline,
              a.updatedAt = datetime()
          `,
          alumni
        );

        await tx.run(
          `
          MERGE (c:Company {id: $companyId})
          ON CREATE SET c.name = $companyName, c.role = 'Unknown', c.location = 'Unknown', c.packageLpa = 0, c.numRounds = 3, c.experienceLevel = 'Unknown', c.eligibilityCgpa = 7.0
          WITH c
          MATCH (a:Alumni {id: $alumniId})
          MERGE (a)-[:WORKS_AT]->(c)
          `,
          {
            companyId: `CO-${safeSlug(alumni.currentCompany) || "unknown"}`,
            companyName: alumni.currentCompany,
            alumniId: alumni.id,
          }
        );

        for (let i = 0; i < alumni.priorCompanies.length; i += 1) {
          const prior = alumni.priorCompanies[i];
          await tx.run(
            `
            MERGE (c:Company {id: $companyId})
            ON CREATE SET c.name = $companyName, c.role = 'Unknown', c.location = 'Unknown', c.packageLpa = 0, c.numRounds = 3, c.experienceLevel = 'Unknown', c.eligibilityCgpa = 7.0
            WITH c
            MATCH (a:Alumni {id: $alumniId})
            MERGE (a)-[r:WORKED_AT]->(c)
            SET r.order = $order
            `,
            {
              companyId: `CO-${safeSlug(prior) || `prior-${i}`}`,
              companyName: prior,
              alumniId: alumni.id,
              order: i + 1,
            }
          );
        }

        for (const skill of alumni.skills) {
          await tx.run(
            `
            MERGE (sk:Skill {normalizedName: $normalizedName})
            ON CREATE SET sk.name = $name, sk.createdAt = datetime(), sk.demandWeight = 1
            SET sk.updatedAt = datetime()
            WITH sk
            MATCH (a:Alumni {id: $alumniId})
            MERGE (a)-[:HAS_SKILL]->(sk)
            `,
            { normalizedName: skill.toLowerCase(), name: skill, alumniId: alumni.id }
          );
        }

        for (const project of alumni.projects) {
          await tx.run(
            `
            MERGE (p:Project {name: $name})
            WITH p
            MATCH (a:Alumni {id: $alumniId})
            MERGE (a)-[:BUILT_PROJECT]->(p)
            `,
            { name: project, alumniId: alumni.id }
          );
        }
      }
    });
  } finally {
    await session.close();
  }

  const verifySession = getSession("READ");
  try {
    const result = await verifySession.run(
      `
      RETURN
        size([(c:Company) | c]) AS companies,
        size([(s:Student) | s]) AS students,
        size([(a:Alumni) | a]) AS alumni
      `
    );

    const row = result.records[0];
    return {
      companies: toNumber(row.get("companies")),
      students: toNumber(row.get("students")),
      alumni: toNumber(row.get("alumni")),
    };
  } finally {
    await verifySession.close();
  }
}
