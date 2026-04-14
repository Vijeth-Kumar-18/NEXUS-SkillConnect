const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "filtered-data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "filtered-dataset.json");
const OUTPUT_CSV_FILE = path.join(OUTPUT_DIR, "filtered-dataset.csv");

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
    if (values.length < 2) {
      continue;
    }

    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || "";
    });

    if (!Object.values(row).some(Boolean)) {
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

function ensureList(value, fallbackItem) {
  const out = Array.isArray(value) ? value.filter(Boolean) : [];
  return out.length > 0 ? out : [fallbackItem];
}

function normalizeSkillName(name) {
  return String(name || "").replace(/\s+/g, " ").trim();
}

function safeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function loadDataset(fileName) {
  const filePath = path.join(ROOT, fileName);
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function stableLevel(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 5) + 1;
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
        .map((student) => String(student.targetRole || "").trim())
        .filter(Boolean)
    )
  );

  const skillPool = Array.from(
    new Set(
      students
        .flatMap((student) => (Array.isArray(student.topSkills) ? student.topSkills : []))
        .map((skill) => String(skill || "").trim())
        .filter(Boolean)
    )
  );

  const projectPool = Array.from(
    new Set(
      students
        .flatMap((student) => (Array.isArray(student.projects) ? student.projects : []))
        .map((project) => String(project || "").trim())
        .filter(Boolean)
    )
  );

  const interestPool = Array.from(
    new Set(
      students
        .flatMap((student) => (Array.isArray(student.interests) ? student.interests : []))
        .map((interest) => String(interest || "").trim())
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

function buildCsvRows(companies, students, alumni) {
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
    const safeCompanyName = company.name || "Unknown Company";
    const seedEmail = `${safeSlug(safeCompanyName) || String(company.id || "company").toLowerCase()}@nexus.generated`;
    const row = {
      ...buildDefaultCsvRow("COMPANY", company.id, safeCompanyName, seedEmail, pools),
      company: company.name,
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
    const seedEmail = student.email || `${safeSlug(student.name) || String(student.id || "student").toLowerCase()}@nexus.edu`;
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

function normalizeCompanyRows(raw) {
  const rows = parseCsv(raw);
  const companies = [];

  rows.forEach((row, index) => {
    const hasCanonicalId = /^J\d+/i.test(row.JobID || "");

    const id = hasCanonicalId ? String(row.JobID || "").trim() : `JX${String(index + 1).padStart(4, "0")}`;
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

    companies.push({
      id,
      name,
      role,
      requiredSkills: ensureList(splitPipeList(requiredSkillsRaw).map(normalizeSkillName), "General Aptitude"),
      rounds: Math.max(1, Math.min(8, Math.round(Number(roundsRaw) || 3))),
      location: location || "Remote",
      packageLpa: Number(packageRaw) || 12,
      experienceLevel,
      eligibilityCgpa: 7,
    });
  });

  return companies;
}

function normalizeStudentRows(raw) {
  const rows = parseCsv(raw);
  const students = [];

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

    const id = isCanonical ? String(row.StudentID || "").trim() : `S${String(index + 1001).padStart(4, "0")}`;
    const slug = safeSlug(name) || `student-${id.toLowerCase()}`;
    const email = `${slug}.${id.toLowerCase()}@nexus.edu`;
    const topSkills = ensureList(splitPipeList(topSkillsRaw).map(normalizeSkillName), "General Aptitude");
    const projects = ensureList(splitPipeList(projectsRaw), "General Project");
    const interests = ensureList([targetRole, "Placement Preparation", "Interview Practice"], "Placement Preparation");

    students.push({
      id,
      name,
      email,
      degree,
      expectedGraduation,
      cgpa: Number(cgpaRaw) || 7.5,
      targetRole,
      projects,
      topSkills,
      interests,
      github: `https://github.com/${slug}`,
      linkedin: `https://linkedin.com/in/${slug}`,
      auth: {
        role: "STUDENT",
        defaultPassword: email,
      },
      skillLevels: topSkills.map((skill) => ({
        name: skill,
        level: stableLevel(`${id}:${skill}`),
      })),
    });
  });

  return students;
}

function normalizeAlumniRows(raw) {
  const rows = parseCsv(raw);
  const alumni = [];

  rows.forEach((row, index) => {
    const isCanonical = /^A\d+/i.test(row.AlumniID || "");

    const id = isCanonical ? String(row.AlumniID || "").trim() : `AX${String(index + 1).padStart(4, "0")}`;
    const name = (isCanonical ? row.Name : row.AlumniID || "").trim();
    const gradYear = String(isCanonical ? row.GradYear : row.Name || "2022").trim();
    const currentCompany = (isCanonical ? row.CurrentCompany : row.GradYear || "Unknown").trim() || "Unknown";
    const currentRole = (isCanonical ? row.CurrentRole : "Professional").trim() || "Professional";

    if (!name) {
      return;
    }

    alumni.push({
      id,
      name,
      gradYear,
      currentCompany,
      currentRole,
      priorCompanies: ensureList(
        splitPipeList(isCanonical ? row.PriorCompanies : row.CurrentCompany).filter((item) => item.toLowerCase() !== "none"),
        currentCompany
      ),
      skills: ensureList(splitPipeList(isCanonical ? row.Skills : "").map(normalizeSkillName), "General Aptitude"),
      projects: ensureList(splitPipeList(isCanonical ? row.KeyProjects : ""), "General Project"),
      timeline: (isCanonical ? row.Timeline : row.CurrentRole || "Career progression available").trim() || "Career progression available",
    });
  });

  return alumni;
}

function main() {
  const companies = normalizeCompanyRows(loadDataset("Data1.txt"));
  const students = normalizeStudentRows(loadDataset("Data2.txt"));
  const alumni = normalizeAlumniRows(loadDataset("Data3.txt"));

  const output = {
    generatedAt: new Date().toISOString(),
    sourceFiles: ["Data1.txt", "Data2.txt", "Data3.txt"],
    stats: {
      companies: companies.length,
      students: students.length,
      alumni: alumni.length,
    },
    companies,
    students,
    alumni,
  };

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8");
  fs.writeFileSync(OUTPUT_CSV_FILE, buildCsvRows(companies, students, alumni), "utf8");
  console.log(`Filtered dataset written: ${OUTPUT_FILE}`);
  console.log(`Filtered CSV written: ${OUTPUT_CSV_FILE}`);
  console.log(`Companies: ${output.stats.companies}, Students: ${output.stats.students}, Alumni: ${output.stats.alumni}`);
}

main();
