const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const neo4j = require("neo4j-driver");

const ROOT = process.cwd();
const DEFAULT_INPUT_FILE = path.join(ROOT, "filtered-data", "filtered-neo4j-dataset.json");
const DEFAULT_INPUT_CSV_FILE = path.join(ROOT, "filtered-data", "filtered-neo4j-dataset.csv");
const FALLBACK_INPUT_FILE = path.join(ROOT, "filtered-data", "filtered-dataset.json");
const FALLBACK_INPUT_CSV_FILE = path.join(ROOT, "filtered-data", "filtered-dataset.csv");

function splitCsvLine(line) {
  const out = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  out.push(current.trim());
  return out;
}

function parseCsv(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = splitCsvLine(lines[i]);
    if (!values.length) {
      continue;
    }

    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || "";
    });

    if (Object.values(row).every((value) => !String(value || "").trim())) {
      continue;
    }

    rows.push(row);
  }

  return rows;
}

function splitPipeList(value) {
  return String(value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSkillLevels(value, topSkills) {
  const entries = splitPipeList(value)
    .map((item) => {
      const [name, rawLevel] = String(item).split("=");
      if (!String(name || "").trim()) {
        return null;
      }
      const level = Number(rawLevel);
      return {
        name: String(name).trim(),
        level: Number.isFinite(level) ? Math.max(1, Math.min(5, Math.round(level))) : 2,
      };
    })
    .filter(Boolean);

  if (entries.length > 0) {
    return entries;
  }

  return splitPipeList(topSkills).map((skill) => ({
    name: skill,
    level: 2,
  }));
}

function parseCsvDataset(raw) {
  const rows = parseCsv(raw);
  const dataset = {
    companies: [],
    students: [],
    alumni: [],
  };

  rows.forEach((row) => {
    const type = String(row.recordType || "").trim().toUpperCase();

    if (type === "COMPANY") {
      dataset.companies.push({
        id: String(row.id || "").trim(),
        name: String(row.name || row.company || "").trim(),
        role: String(row.jobRole || "").trim(),
        requiredSkills: splitPipeList(row.requiredSkills),
        rounds: Math.max(1, Math.min(8, Math.round(Number(row.rounds) || 3))),
        location: String(row.location || "Unknown").trim() || "Unknown",
        packageLpa: Number.isFinite(Number(row.packageLpa)) ? Number(row.packageLpa) : 0,
        experienceLevel: String(row.experienceLevel || "Unknown").trim() || "Unknown",
        eligibilityCgpa: Number.isFinite(Number(row.eligibilityCgpa)) ? Number(row.eligibilityCgpa) : 7,
      });
      return;
    }

    if (type === "STUDENT") {
      dataset.students.push({
        id: String(row.id || "").trim(),
        name: String(row.name || "").trim(),
        email: String(row.email || "").trim(),
        degree: String(row.degree || "Unknown").trim() || "Unknown",
        expectedGraduation: String(row.expectedGraduation || "2026").trim() || "2026",
        cgpa: Number.isFinite(Number(row.cgpa)) ? Number(row.cgpa) : 7.0,
        targetRole: String(row.targetRole || "Software Engineer").trim() || "Software Engineer",
        projects: splitPipeList(row.projects),
        topSkills: splitPipeList(row.topSkills),
        interests: splitPipeList(row.interests),
        github: String(row.github || "").trim(),
        linkedin: String(row.linkedin || "").trim(),
        auth: {
          role: String(row.role || "STUDENT").trim() || "STUDENT",
          defaultPassword: String(row.defaultPassword || "password").trim() || "password",
        },
        skillLevels: parseSkillLevels(row.skillLevels, row.topSkills),
      });
      return;
    }

    if (type === "ALUMNI") {
      dataset.alumni.push({
        id: String(row.id || "").trim(),
        name: String(row.name || "").trim(),
        gradYear: String(row.gradYear || "2022").trim() || "2022",
        currentCompany: String(row.currentCompany || "Unknown").trim() || "Unknown",
        currentRole: String(row.currentRole || "Professional").trim() || "Professional",
        priorCompanies: splitPipeList(row.priorCompanies),
        skills: splitPipeList(row.topSkills),
        projects: splitPipeList(row.projects),
        timeline: String(row.timeline || "Career progression available").trim() || "Career progression available",
      });
    }
  });

  return dataset;
}

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

function formatProgress(current, total) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const pct = Math.min(100, Math.round((Number(current) / safeTotal) * 100));
  return `${current}/${total} (${pct}%)`;
}

function shouldLogProgress(current, total, every) {
  if (current <= 1 || current >= total) {
    return true;
  }
  return current % every === 0;
}

function chunkArray(items, batchSize) {
  const out = [];
  for (let i = 0; i < items.length; i += batchSize) {
    out.push(items.slice(i, i + batchSize));
  }
  return out;
}

function resolveInputFile() {
  if (process.env.FILTERED_INPUT_FILE) {
    return path.resolve(ROOT, process.env.FILTERED_INPUT_FILE);
  }

  if (fs.existsSync(DEFAULT_INPUT_CSV_FILE)) {
    return DEFAULT_INPUT_CSV_FILE;
  }

  if (fs.existsSync(DEFAULT_INPUT_FILE)) {
    return DEFAULT_INPUT_FILE;
  }

  if (fs.existsSync(FALLBACK_INPUT_CSV_FILE)) {
    return FALLBACK_INPUT_CSV_FILE;
  }

  return FALLBACK_INPUT_FILE;
}

function ensureInputExists() {
  const inputFile = resolveInputFile();
  if (!fs.existsSync(inputFile)) {
    throw new Error(
      `Filtered data file not found: ${inputFile}. Run: npm run prepare:neo4j-filtered-data (or npm run filter:data).`
    );
  }

  return inputFile;
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

  const configuredDatabase = String(process.env.NEO4J_DATABASE || "").trim();
  const sessionConfig = {
    defaultAccessMode: neo4j.session.WRITE,
  };

  if (configuredDatabase) {
    sessionConfig.database = configuredDatabase;
  }

  const session = driver.session(sessionConfig);
  const batchSize = Math.max(100, Number(process.env.PUSH_BATCH_SIZE || 1000));
  const totalCompanies = Array.isArray(dataset.companies) ? dataset.companies.length : 0;
  const totalStudents = Array.isArray(dataset.students) ? dataset.students.length : 0;
  const totalAlumni = Array.isArray(dataset.alumni) ? dataset.alumni.length : 0;
  const heartbeatMs = Math.max(3000, Number(process.env.PUSH_PROGRESS_HEARTBEAT_MS || 5000));
  let phase = "initializing";
  let processedCompanies = 0;
  let processedStudents = 0;
  let processedAlumni = 0;
  let heartbeat = null;

  heartbeat = setInterval(() => {
    console.log(
      `[heartbeat] phase=${phase} companies=${formatProgress(processedCompanies, totalCompanies)} students=${formatProgress(processedStudents, totalStudents)} alumni=${formatProgress(processedAlumni, totalAlumni)}`
    );
  }, heartbeatMs);

  try {
    console.log(
      `Push started. Companies: ${totalCompanies}, Students: ${totalStudents}, Alumni: ${totalAlumni}.`
    );
    phase = "constraints";
    console.log("Step 1/5: Ensuring constraints...");
    await ensureConstraints(session);
    console.log("Step 1/5 complete: Constraints ready.");

    const demandMap = new Map();
    dataset.companies.forEach((company) => {
      (company.requiredSkills || []).forEach((skill) => {
        demandMap.set(skill, (demandMap.get(skill) || 0) + 1);
      });
    });

    phase = "admin-user";
    console.log("Step 2/7: Ensuring admin user...");
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
    });
    console.log("Step 2/7 complete: Admin user ready.");

    const runBatchedWrite = async (phaseLabel, rows, query, onProgress) => {
      if (!rows.length) {
        console.log(`${phaseLabel}: nothing to write.`);
        return;
      }
      const batches = chunkArray(rows, batchSize);
      let written = 0;
      for (let i = 0; i < batches.length; i += 1) {
        const batchRows = batches[i];
        await session.executeWrite(async (tx) => {
          await tx.run(query, { rows: batchRows });
        });
        written += batchRows.length;
        if (onProgress) {
          onProgress(written);
        }
        console.log(`${phaseLabel}: batch ${i + 1}/${batches.length} (${batchRows.length} rows), total ${written}/${rows.length}`);
      }
    };

    phase = "write-companies";
    console.log("Step 3/7: Writing companies, skills, rounds, and questions in batches...");

    const companyRows = dataset.companies.map((company) => ({
      id: company.id,
      name: company.name,
      role: company.role,
      location: company.location,
      packageLpa: company.packageLpa,
      experienceLevel: company.experienceLevel,
      eligibilityCgpa: company.eligibilityCgpa,
      rounds: Number(company.rounds) || 3,
    }));

    const companySkillRows = [];
    const roundRows = [];
    const questionRows = [];
    dataset.companies.forEach((company) => {
      (company.requiredSkills || []).forEach((skill, idx) => {
        companySkillRows.push({
          companyId: company.id,
          normalizedName: String(skill).toLowerCase(),
          name: skill,
          demandWeight: demandMap.get(skill) || 1,
          weight: Math.max(1, 6 - idx),
        });
      });

      const rounds = Math.max(1, Number(company.rounds) || 3);
      for (let round = 1; round <= rounds; round += 1) {
        const roundId = `${company.id}-R${round}`;
        const topSkill = company.requiredSkills[(round - 1) % Math.max(company.requiredSkills.length, 1)] || "Problem Solving";
        roundRows.push({
          id: roundId,
          order: round,
          type: roundTypeByOrder(round),
          companyId: company.id,
        });
        questionRows.push({
          id: `${roundId}-Q1`,
          text: generateInterviewQuestion(topSkill, company.role, company.name),
          topic: topSkill,
          difficulty: round >= 4 ? "High" : round >= 2 ? "Medium" : "Low",
          roundId,
        });
      }
    });

    await runBatchedWrite(
      "Companies",
      companyRows,
      `
      UNWIND $rows AS row
      MERGE (c:Company {id: row.id})
      SET c.name = row.name,
          c.role = row.role,
          c.location = row.location,
          c.packageLpa = row.packageLpa,
          c.experienceLevel = row.experienceLevel,
          c.eligibilityCgpa = row.eligibilityCgpa,
          c.numRounds = row.rounds,
          c.updatedAt = datetime()
      `,
      (written) => {
        processedCompanies = written;
      }
    );

    await runBatchedWrite(
      "Company skills",
      companySkillRows,
      `
      UNWIND $rows AS row
      MERGE (sk:Skill {normalizedName: row.normalizedName})
      ON CREATE SET sk.createdAt = datetime()
      SET sk.name = row.name, sk.demandWeight = row.demandWeight, sk.updatedAt = datetime()
      WITH row, sk
      MATCH (c:Company {id: row.companyId})
      MERGE (c)-[r:REQUIRES_SKILL]->(sk)
      SET r.weight = row.weight
      `
    );

    await runBatchedWrite(
      "Rounds",
      roundRows,
      `
      UNWIND $rows AS row
      MERGE (r:Round {id: row.id})
      SET r.order = row.order, r.type = row.type
      WITH row, r
      MATCH (c:Company {id: row.companyId})
      MERGE (c)-[rel:HAS_ROUND]->(r)
      SET rel.order = row.order
      `
    );

    await runBatchedWrite(
      "Questions",
      questionRows,
      `
      UNWIND $rows AS row
      MERGE (q:Question {id: row.id})
      SET q.text = row.text, q.topic = row.topic, q.difficulty = row.difficulty
      WITH row, q
      MATCH (r:Round {id: row.roundId})
      MERGE (r)-[:ASKS]->(q)
      `
    );

    phase = "write-students";
    console.log("Step 4/7: Writing students and auth in batches...");

    const studentRows = dataset.students.map((student) => ({
      id: student.id,
      name: student.name,
      degree: student.degree,
      expectedGraduation: student.expectedGraduation,
      cgpa: student.cgpa,
      targetRole: student.targetRole,
      github: student.github,
      linkedin: student.linkedin,
      interests: student.interests || [],
    }));

    const studentUserRows = dataset.students.map((student) => ({
      id: `U-${student.id}`,
      email: student.email,
      name: student.name,
      studentId: student.id,
      passwordHash: hashPassword((student.auth && student.auth.defaultPassword) || "password"),
    }));

    const studentSkillRows = [];
    const studentProjectRows = [];
    dataset.students.forEach((student) => {
      (student.skillLevels || []).forEach((skill) => {
        studentSkillRows.push({
          studentId: student.id,
          normalizedName: String(skill.name).toLowerCase(),
          name: skill.name,
          level: Number(skill.level) || 2,
        });
      });

      (student.projects || []).forEach((project) => {
        studentProjectRows.push({
          studentId: student.id,
          name: project,
        });
      });
    });

    await runBatchedWrite(
      "Students",
      studentRows,
      `
      UNWIND $rows AS row
      MERGE (s:Student {id: row.id})
      SET s.name = row.name,
          s.degree = row.degree,
          s.expectedGraduation = row.expectedGraduation,
          s.cgpa = row.cgpa,
          s.targetRole = row.targetRole,
          s.github = row.github,
          s.linkedin = row.linkedin,
          s.resumeUrl = coalesce(s.resumeUrl, ''),
          s.interests = row.interests,
          s.updatedAt = datetime()
      `,
      (written) => {
        processedStudents = written;
      }
    );

    await runBatchedWrite(
      "Student users",
      studentUserRows,
      `
      UNWIND $rows AS row
      MERGE (u:User {email: row.email})
      ON CREATE SET u.id = row.id, u.name = row.name, u.role = 'STUDENT', u.createdAt = datetime()
      SET u.passwordHash = row.passwordHash, u.updatedAt = datetime()
      WITH row, u
      MATCH (s:Student {id: row.studentId})
      MERGE (u)-[:OWNS_PROFILE]->(s)
      `
    );

    await runBatchedWrite(
      "Student skills",
      studentSkillRows,
      `
      UNWIND $rows AS row
      MERGE (sk:Skill {normalizedName: row.normalizedName})
      ON CREATE SET sk.createdAt = datetime(), sk.demandWeight = 1
      SET sk.name = row.name, sk.updatedAt = datetime()
      WITH row, sk
      MATCH (s:Student {id: row.studentId})
      MERGE (s)-[r:HAS_SKILL]->(sk)
      SET r.level = row.level
      `
    );

    await runBatchedWrite(
      "Student projects",
      studentProjectRows,
      `
      UNWIND $rows AS row
      MERGE (p:Project {name: row.name})
      WITH row, p
      MATCH (s:Student {id: row.studentId})
      MERGE (s)-[:BUILT_PROJECT]->(p)
      `
    );

    phase = "write-alumni";
    console.log("Step 5/7: Writing alumni graph in batches...");

    const alumniRows = dataset.alumni.map((alumni) => ({
      id: alumni.id,
      name: alumni.name,
      gradYear: alumni.gradYear,
      currentRole: alumni.currentRole,
      timeline: alumni.timeline,
    }));

    const alumniCurrentCompanyRows = [];
    const alumniPriorCompanyRows = [];
    const alumniSkillRows = [];
    const alumniProjectRows = [];

    dataset.alumni.forEach((alumni) => {
      alumniCurrentCompanyRows.push({
        alumniId: alumni.id,
        companyId: `CO-${normalizeSlug(alumni.currentCompany) || "unknown"}`,
        companyName: alumni.currentCompany,
      });

      (alumni.priorCompanies || []).forEach((prior, idx) => {
        alumniPriorCompanyRows.push({
          alumniId: alumni.id,
          companyId: `CO-${normalizeSlug(prior) || `prior-${idx}`}`,
          companyName: prior,
          order: idx + 1,
        });
      });

      (alumni.skills || []).forEach((skill) => {
        alumniSkillRows.push({
          alumniId: alumni.id,
          normalizedName: String(skill).toLowerCase(),
          name: skill,
        });
      });

      (alumni.projects || []).forEach((project) => {
        alumniProjectRows.push({
          alumniId: alumni.id,
          name: project,
        });
      });
    });

    await runBatchedWrite(
      "Alumni",
      alumniRows,
      `
      UNWIND $rows AS row
      MERGE (a:Alumni {id: row.id})
      SET a.name = row.name,
          a.gradYear = row.gradYear,
          a.currentRole = row.currentRole,
          a.timeline = row.timeline,
          a.updatedAt = datetime()
      `,
      (written) => {
        processedAlumni = written;
      }
    );

    await runBatchedWrite(
      "Alumni current companies",
      alumniCurrentCompanyRows,
      `
      UNWIND $rows AS row
      MERGE (c:Company {id: row.companyId})
      ON CREATE SET c.name = row.companyName,
                    c.role = 'Unknown',
                    c.location = 'Unknown',
                    c.packageLpa = 0,
                    c.numRounds = 3,
                    c.experienceLevel = 'Unknown',
                    c.eligibilityCgpa = 7.0
      SET c.updatedAt = datetime()
      WITH row, c
      MATCH (a:Alumni {id: row.alumniId})
      MERGE (a)-[:WORKS_AT]->(c)
      `
    );

    await runBatchedWrite(
      "Alumni prior companies",
      alumniPriorCompanyRows,
      `
      UNWIND $rows AS row
      MERGE (c:Company {id: row.companyId})
      ON CREATE SET c.name = row.companyName,
                    c.role = 'Unknown',
                    c.location = 'Unknown',
                    c.packageLpa = 0,
                    c.numRounds = 3,
                    c.experienceLevel = 'Unknown',
                    c.eligibilityCgpa = 7.0
      SET c.updatedAt = datetime()
      WITH row, c
      MATCH (a:Alumni {id: row.alumniId})
      MERGE (a)-[r:WORKED_AT]->(c)
      SET r.order = row.order
      `
    );

    await runBatchedWrite(
      "Alumni skills",
      alumniSkillRows,
      `
      UNWIND $rows AS row
      MERGE (sk:Skill {normalizedName: row.normalizedName})
      ON CREATE SET sk.createdAt = datetime(), sk.demandWeight = 1
      SET sk.name = row.name, sk.updatedAt = datetime()
      WITH row, sk
      MATCH (a:Alumni {id: row.alumniId})
      MERGE (a)-[:HAS_SKILL]->(sk)
      `
    );

    await runBatchedWrite(
      "Alumni projects",
      alumniProjectRows,
      `
      UNWIND $rows AS row
      MERGE (p:Project {name: row.name})
      WITH row, p
      MATCH (a:Alumni {id: row.alumniId})
      MERGE (a)-[:BUILT_PROJECT]->(p)
      `
    );

    phase = "complete-writes";
    console.log("Step 6/7 complete: Batched entity writes finished.");

    phase = "verify";
    console.log("Step 7/7: Verifying totals in Neo4j...");
    const verify = await session.run(
      `
      MATCH (c:Company)
      WITH count(c) AS companies
      MATCH (s:Student)
      WITH companies, count(s) AS students
      MATCH (a:Alumni)
      RETURN companies, students, count(a) AS alumni
      `
    );

    const row = verify.records[0];
    console.log("Neo4j push complete");
    console.log(`Companies: ${neo4j.integer.toNumber(row.get("companies"))}`);
    console.log(`Students: ${neo4j.integer.toNumber(row.get("students"))}`);
    console.log(`Alumni: ${neo4j.integer.toNumber(row.get("alumni"))}`);
  } finally {
    if (heartbeat) {
      clearInterval(heartbeat);
    }
    await session.close();
    await driver.close();
  }
}

async function main() {
  loadEnvFile();
  const inputFile = ensureInputExists();

  const extension = path.extname(inputFile).toLowerCase();
  const raw = fs.readFileSync(inputFile, "utf8");
  const dataset = extension === ".csv" ? parseCsvDataset(raw) : JSON.parse(raw);

  console.log(`Using filtered data file: ${inputFile}`);
  await pushFilteredDataset(dataset);
}

main().catch((error) => {
  const message = String(error && error.message ? error.message : error);
  if (/unauthorized|authentication failure|invalid credentials/i.test(message)) {
    console.error("Neo4j authentication failed.");
    console.error("Please update NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD in .env with valid credentials.");
    console.error("Then run: npm run push:neo4j");
  } else if (/database .* does not exist|routing table .* does not exist/i.test(message)) {
    console.error("Neo4j database name is invalid for this instance.");
    console.error("Set NEO4J_DATABASE in .env to an existing database name, or remove NEO4J_DATABASE to use the default database.");
    console.error("Then run: npm run push:neo4j");
  } else {
    console.error(message);
  }
  process.exit(1);
});
