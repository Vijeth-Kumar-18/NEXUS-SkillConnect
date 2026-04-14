const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const neo4j = require("neo4j-driver");

const ROOT = process.cwd();
const INPUT_FILE = path.join(ROOT, "filtered-data", "filtered-dataset.json");

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

function requiredEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function hashPassword(plainText) {
  const salt = process.env.PASSWORD_SALT || "nexus-salt";
  return crypto.createHash("sha256").update(`${plainText}:${salt}`).digest("hex");
}

function normalizeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function roundTypeByOrder(order) {
  const roundTypes = ["Aptitude", "Coding", "Technical", "System Design", "Managerial", "HR", "Behavioral", "Offer Discussion"];
  return roundTypes[Math.min(order - 1, roundTypes.length - 1)];
}

function generateInterviewQuestion(skill, role, company) {
  return `How would you apply ${skill} in the ${role} role at ${company}?`;
}

function ensureInputExists() {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Filtered data file not found: ${INPUT_FILE}. Run: npm run filter:data`);
  }
}

async function ensureConstraints(session) {
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
}

async function pushFilteredDataset(dataset) {
  const driver = neo4j.driver(
    requiredEnv("NEO4J_URI"),
    neo4j.auth.basic(requiredEnv("NEO4J_USERNAME"), requiredEnv("NEO4J_PASSWORD"))
  );

  const session = driver.session({
    database: process.env.NEO4J_DATABASE || "neo4j",
    defaultAccessMode: neo4j.session.WRITE,
  });

  try {
    await ensureConstraints(session);

    const demandMap = new Map();
    dataset.companies.forEach((company) => {
      (company.requiredSkills || []).forEach((skill) => {
        demandMap.set(skill, (demandMap.get(skill) || 0) + 1);
      });
    });

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

      for (const company of dataset.companies) {
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
          const demandWeight = demandMap.get(skill) || 1;

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
              normalizedName: String(skill).toLowerCase(),
              name: skill,
              demandWeight,
              companyId: company.id,
              weight: Math.max(1, 6 - i),
            }
          );
        }

        for (let round = 1; round <= Number(company.rounds || 3); round += 1) {
          const roundId = `${company.id}-R${round}`;
          await tx.run(
            `
            MERGE (r:Round {id: $id})
            SET r.order = $order, r.type = $type
            WITH r
            MATCH (c:Company {id: $companyId})
            MERGE (c)-[:HAS_ROUND {order: $order}]->(r)
            `,
            { id: roundId, order: round, type: roundTypeByOrder(round), companyId: company.id }
          );

          const topSkill = company.requiredSkills[(round - 1) % Math.max(company.requiredSkills.length, 1)] || "Problem Solving";
          await tx.run(
            `
            MERGE (q:Question {id: $id})
            SET q.text = $text, q.topic = $topic, q.difficulty = $difficulty
            WITH q
            MATCH (r:Round {id: $roundId})
            MERGE (r)-[:ASKS]->(q)
            `,
            {
              id: `${roundId}-Q1`,
              text: generateInterviewQuestion(topSkill, company.role, company.name),
              topic: topSkill,
              difficulty: round >= 4 ? "High" : round >= 2 ? "Medium" : "Low",
              roundId,
            }
          );
        }
      }

      for (const student of dataset.students) {
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
            passwordHash: hashPassword((student.auth && student.auth.defaultPassword) || "password"),
          }
        );

        for (const skill of student.skillLevels || []) {
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
              normalizedName: String(skill.name).toLowerCase(),
              name: skill.name,
              studentId: student.id,
              level: Number(skill.level) || 2,
            }
          );
        }

        for (const project of student.projects || []) {
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

      for (const alumni of dataset.alumni) {
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

        const currentCompanyId = `CO-${normalizeSlug(alumni.currentCompany) || "unknown"}`;
        await tx.run(
          `
          MERGE (c:Company {id: $companyId})
          ON CREATE SET c.name = $companyName, c.role = 'Unknown', c.location = 'Unknown', c.packageLpa = 0, c.numRounds = 3, c.experienceLevel = 'Unknown', c.eligibilityCgpa = 7.0
          WITH c
          MATCH (a:Alumni {id: $alumniId})
          MERGE (a)-[:WORKS_AT]->(c)
          `,
          {
            companyId: currentCompanyId,
            companyName: alumni.currentCompany,
            alumniId: alumni.id,
          }
        );

        for (let i = 0; i < (alumni.priorCompanies || []).length; i += 1) {
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
              companyId: `CO-${normalizeSlug(prior) || `prior-${i}`}`,
              companyName: prior,
              alumniId: alumni.id,
              order: i + 1,
            }
          );
        }

        for (const skill of alumni.skills || []) {
          await tx.run(
            `
            MERGE (sk:Skill {normalizedName: $normalizedName})
            ON CREATE SET sk.name = $name, sk.createdAt = datetime(), sk.demandWeight = 1
            SET sk.updatedAt = datetime()
            WITH sk
            MATCH (a:Alumni {id: $alumniId})
            MERGE (a)-[:HAS_SKILL]->(sk)
            `,
            {
              normalizedName: String(skill).toLowerCase(),
              name: skill,
              alumniId: alumni.id,
            }
          );
        }

        for (const project of alumni.projects || []) {
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

    const verify = await session.run(
      `
      RETURN
        size([(c:Company) | c]) AS companies,
        size([(s:Student) | s]) AS students,
        size([(a:Alumni) | a]) AS alumni
      `
    );

    const row = verify.records[0];
    console.log("Neo4j push complete");
    console.log(`Companies: ${neo4j.integer.toNumber(row.get("companies"))}`);
    console.log(`Students: ${neo4j.integer.toNumber(row.get("students"))}`);
    console.log(`Alumni: ${neo4j.integer.toNumber(row.get("alumni"))}`);
  } finally {
    await session.close();
    await driver.close();
  }
}

async function main() {
  loadEnvFile();
  ensureInputExists();

  const dataset = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  await pushFilteredDataset(dataset);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
