const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const FILTERED_DIR = path.join(ROOT, "filtered-data");
const SOURCE_FILE = path.join(FILTERED_DIR, "filtered-dataset.json");
const OUTPUT_FILE = path.join(FILTERED_DIR, "filtered-neo4j-dataset.json");
const OUTPUT_CSV_FILE = path.join(FILTERED_DIR, "filtered-neo4j-dataset.csv");

function safeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function ensureString(value, fallback = "") {
  const out = String(value || "").trim();
  return out || fallback;
}

function ensureNonEmptyList(value, fallbackItem) {
  const out = ensureArray(value)
    .map((item) => ensureString(item))
    .filter(Boolean);
  return out.length > 0 ? out : [fallbackItem];
}

function stableIndex(seed, size) {
  if (!size) {
    return 0;
  }
  let hash = 0;
  for (let i = 0; i < String(seed).length; i += 1) {
    hash = (hash << 5) - hash + String(seed).charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % size;
}

function pickFromPool(seed, pool, fallback) {
  if (!Array.isArray(pool) || pool.length === 0) {
    return fallback;
  }
  return pool[stableIndex(seed, pool.length)] || fallback;
}

function buildValuePools(students) {
  const rolePool = Array.from(
    new Set(
      students
        .map((student) => ensureString(student.targetRole))
        .filter(Boolean)
    )
  );

  const skillPool = Array.from(
    new Set(
      students
        .flatMap((student) => (Array.isArray(student.topSkills) ? student.topSkills : []))
        .map((skill) => ensureString(skill))
        .filter(Boolean)
    )
  );

  const projectPool = Array.from(
    new Set(
      students
        .flatMap((student) => (Array.isArray(student.projects) ? student.projects : []))
        .map((project) => ensureString(project))
        .filter(Boolean)
    )
  );

  const interestPool = Array.from(
    new Set(
      students
        .flatMap((student) => (Array.isArray(student.interests) ? student.interests : []))
        .map((interest) => ensureString(interest))
        .filter(Boolean)
    )
  );

  return {
    rolePool: rolePool.length ? rolePool : ["Software Engineer", "Data Scientist"],
    skillPool: skillPool.length ? skillPool : ["Problem Solving", "SQL", "Python"],
    projectPool: projectPool.length ? projectPool : ["Career Tracker"],
    interestPool: interestPool.length ? interestPool : ["Placement Preparation", "Interview Practice"],
  };
}

function ensureStudent(student, index) {
  const id = ensureString(student.id, `S${String(index + 1).padStart(4, "0")}`);
  const name = ensureString(student.name, `Student ${index + 1}`);
  const slug = safeSlug(name) || `student-${id.toLowerCase()}`;
  const email = ensureString(student.email, `${slug}.${id.toLowerCase()}@nexus.edu`);

  const topSkills = ensureArray(student.topSkills)
    .map((skill) => ensureString(skill))
    .filter(Boolean);

  const skillLevels = ensureArray(student.skillLevels)
    .map((row, i) => {
      if (!row) {
        return null;
      }
      const skillName = ensureString(row.name, topSkills[i] || "Problem Solving");
      const level = Number(row.level);
      return {
        name: skillName,
        level: Number.isFinite(level) ? Math.max(1, Math.min(5, Math.round(level))) : 2,
      };
    })
    .filter(Boolean);

  const normalizedSkillLevels =
    skillLevels.length > 0
      ? skillLevels
      : topSkills.map((skill) => ({
          name: skill,
          level: 2,
        }));

  const generatedPassword = email;

  return {
    ...student,
    id,
    name,
    email,
    degree: ensureString(student.degree, "Unknown"),
    expectedGraduation: ensureString(student.expectedGraduation, "2026"),
    cgpa: Number.isFinite(Number(student.cgpa)) ? Number(student.cgpa) : 7.0,
    targetRole: ensureString(student.targetRole, "Software Engineer"),
    projects: ensureNonEmptyList(student.projects, "General Project"),
    topSkills: topSkills.length > 0 ? topSkills : ["General Aptitude"],
    interests: ensureNonEmptyList(student.interests, "Placement Preparation"),
    github: ensureString(student.github, `https://github.com/${slug}`),
    linkedin: ensureString(student.linkedin, `https://linkedin.com/in/${slug}`),
    auth: {
      role: ensureString(student?.auth?.role, "STUDENT"),
      defaultPassword: ensureString(student?.auth?.defaultPassword, generatedPassword),
    },
    skillLevels: normalizedSkillLevels,
  };
}

function ensureCompany(company, index) {
  return {
    ...company,
    id: ensureString(company.id, `J${String(index + 1).padStart(4, "0")}`),
    name: ensureString(company.name, "Unknown Company"),
    role: ensureString(company.role, "Unknown Role"),
    requiredSkills: ensureNonEmptyList(company.requiredSkills, "General Aptitude"),
    rounds: Math.max(1, Math.min(8, Math.round(Number(company.rounds) || 3))),
    location: ensureString(company.location, "Unknown"),
    packageLpa: Number.isFinite(Number(company.packageLpa)) ? Number(company.packageLpa) : 0,
    experienceLevel: ensureString(company.experienceLevel, "Unknown"),
    eligibilityCgpa: Number.isFinite(Number(company.eligibilityCgpa)) ? Number(company.eligibilityCgpa) : 7,
  };
}

function ensureAlumni(alumni, index) {
  return {
    ...alumni,
    id: ensureString(alumni.id, `A${String(index + 1).padStart(4, "0")}`),
    name: ensureString(alumni.name, `Alumni ${index + 1}`),
    gradYear: ensureString(alumni.gradYear, "2022"),
    currentCompany: ensureString(alumni.currentCompany, "Unknown"),
    currentRole: ensureString(alumni.currentRole, "Professional"),
    priorCompanies: ensureNonEmptyList(alumni.priorCompanies, ensureString(alumni.currentCompany, "Unknown")),
    skills: ensureNonEmptyList(alumni.skills, "General Aptitude"),
    projects: ensureNonEmptyList(alumni.projects, "General Project"),
    timeline: ensureString(alumni.timeline, "Career progression available"),
  };
}

function csvEscape(value) {
  const text = String(value == null ? "" : value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function joinList(value) {
  return Array.isArray(value) ? value.join(" | ") : "";
}

function serializeSkillLevels(skillLevels) {
  if (!Array.isArray(skillLevels)) {
    return "";
  }

  return skillLevels
    .map((row) => `${String(row.name || "").trim()}=${Number(row.level) || 2}`)
    .filter((item) => String(item).trim() !== "")
    .join(" | ");
}

function buildDefaultCsvRow(recordType, id, name, seedEmail, pools) {
  const primarySkill = pickFromPool(`${id}:skill:1`, pools.skillPool, "Problem Solving");
  const secondarySkill = pickFromPool(`${id}:skill:2`, pools.skillPool, "SQL");
  const generatedRole = pickFromPool(`${id}:role`, pools.rolePool, "Software Engineer");
  const generatedProject = pickFromPool(`${id}:project`, pools.projectPool, "Career Tracker");
  const generatedInterest = pickFromPool(`${id}:interest`, pools.interestPool, "Placement Preparation");

  return {
    recordType,
    id,
    name,
    email: seedEmail,
    defaultPassword: seedEmail,
    role: recordType === "STUDENT" ? "STUDENT" : `${recordType}_ENTITY`,
    degree: "B.S. Computer Science",
    expectedGraduation: "2026",
    cgpa: 7,
    targetRole: generatedRole,
    github: "https://github.com/nexus-generated",
    linkedin: "https://linkedin.com/in/nexus-generated",
    topSkills: `${primarySkill} | ${secondarySkill}`,
    skillLevels: `${primarySkill}=3 | ${secondarySkill}=2`,
    projects: generatedProject,
    interests: generatedInterest,
    company: pickFromPool(`${id}:company`, ["Nexus Labs", "GraphEdge Tech", "CloudCraft Systems"], "Nexus Labs"),
    jobRole: generatedRole,
    requiredSkills: `${primarySkill} | ${secondarySkill}`,
    rounds: 3,
    location: "Remote",
    packageLpa: 12,
    experienceLevel: "Entry",
    eligibilityCgpa: 7,
    gradYear: "2022",
    currentCompany: "Unknown",
    currentRole: "Professional",
    priorCompanies: "Unknown",
    timeline: "Career progression available",
  };
}

function buildNeo4jCsv(companies, students, alumni) {
  const pools = buildValuePools(students);
  const headers = [
    "recordType",
    "id",
    "name",
    "email",
    "defaultPassword",
    "role",
    "degree",
    "expectedGraduation",
    "cgpa",
    "targetRole",
    "github",
    "linkedin",
    "topSkills",
    "skillLevels",
    "projects",
    "interests",
    "company",
    "jobRole",
    "requiredSkills",
    "rounds",
    "location",
    "packageLpa",
    "experienceLevel",
    "eligibilityCgpa",
    "gradYear",
    "currentCompany",
    "currentRole",
    "priorCompanies",
    "timeline",
  ];

  const lines = [headers.join(",")];

  companies.forEach((company) => {
    const companyName = ensureString(company.name, "Unknown Company");
    const seedEmail = `${safeSlug(companyName) || String(company.id || "company").toLowerCase()}@nexus.generated`;
    const row = {
      ...buildDefaultCsvRow("COMPANY", company.id, companyName, seedEmail, pools),
      company: companyName,
      jobRole: company.role,
      requiredSkills: joinList(company.requiredSkills),
      rounds: company.rounds,
      location: company.location,
      packageLpa: company.packageLpa,
      experienceLevel: company.experienceLevel,
      eligibilityCgpa: company.eligibilityCgpa,
    };

    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  });

  students.forEach((student) => {
    const seedEmail = ensureString(student.email, `${safeSlug(student.name) || String(student.id || "student").toLowerCase()}@nexus.edu`);
    const row = {
      ...buildDefaultCsvRow("STUDENT", student.id, student.name, seedEmail, pools),
      email: seedEmail,
      defaultPassword: student?.auth?.defaultPassword || seedEmail,
      role: student?.auth?.role || "STUDENT",
      degree: student.degree,
      expectedGraduation: student.expectedGraduation,
      cgpa: student.cgpa,
      targetRole: student.targetRole,
      github: student.github,
      linkedin: student.linkedin,
      topSkills: joinList(student.topSkills),
      skillLevels: serializeSkillLevels(student.skillLevels),
      projects: joinList(student.projects),
      interests: joinList(student.interests),
    };

    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  });

  alumni.forEach((person) => {
    const seedEmail = `${safeSlug(person.name) || String(person.id || "alumni").toLowerCase()}@nexus.alumni`;
    const row = {
      ...buildDefaultCsvRow("ALUMNI", person.id, person.name, seedEmail, pools),
      gradYear: person.gradYear,
      currentCompany: person.currentCompany,
      currentRole: person.currentRole,
      priorCompanies: joinList(person.priorCompanies),
      topSkills: joinList(person.skills),
      projects: joinList(person.projects),
      timeline: person.timeline,
    };

    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  });

  return `${lines.join("\n")}\n`;
}

function main() {
  if (!fs.existsSync(SOURCE_FILE)) {
    throw new Error(`Missing source file: ${SOURCE_FILE}.`);
  }

  const source = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"));

  const companies = ensureArray(source.companies).map(ensureCompany);
  const students = ensureArray(source.students).map(ensureStudent);
  const alumni = ensureArray(source.alumni).map(ensureAlumni);

  const output = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.relative(ROOT, SOURCE_FILE),
    description: "Neo4j-ready filtered dataset with normalized student auth/social fields",
    stats: {
      companies: companies.length,
      students: students.length,
      alumni: alumni.length,
    },
    companies,
    students,
    alumni,
  };

  if (!fs.existsSync(FILTERED_DIR)) {
    fs.mkdirSync(FILTERED_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");
  fs.writeFileSync(OUTPUT_CSV_FILE, buildNeo4jCsv(companies, students, alumni), "utf8");

  console.log(`Neo4j filtered dataset written: ${OUTPUT_FILE}`);
  console.log(`Neo4j filtered CSV written: ${OUTPUT_CSV_FILE}`);
  console.log(`Companies: ${output.stats.companies}, Students: ${output.stats.students}, Alumni: ${output.stats.alumni}`);
}

main();
