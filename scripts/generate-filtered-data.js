const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "filtered-data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "filtered-dataset.json");

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
      requiredSkills: splitPipeList(requiredSkillsRaw).map(normalizeSkillName),
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
    const topSkills = splitPipeList(topSkillsRaw).map(normalizeSkillName);
    const projects = splitPipeList(projectsRaw);

    students.push({
      id,
      name,
      email: `${slug}.${id.toLowerCase()}@nexus.edu`,
      degree,
      expectedGraduation,
      cgpa: Number(cgpaRaw) || 7.5,
      targetRole,
      projects,
      topSkills,
      interests: [targetRole, "Placement Preparation", "Interview Practice"],
      github: `https://github.com/${slug}`,
      linkedin: `https://linkedin.com/in/${slug}`,
      auth: {
        role: "STUDENT",
        defaultPassword: "password",
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
      priorCompanies: splitPipeList(isCanonical ? row.PriorCompanies : row.CurrentCompany).filter(
        (item) => item.toLowerCase() !== "none"
      ),
      skills: splitPipeList(isCanonical ? row.Skills : "").map(normalizeSkillName),
      projects: splitPipeList(isCanonical ? row.KeyProjects : ""),
      timeline: (isCanonical ? row.Timeline : row.CurrentRole || "Career progression available").trim(),
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
  console.log(`Filtered dataset written: ${OUTPUT_FILE}`);
  console.log(`Companies: ${output.stats.companies}, Students: ${output.stats.students}, Alumni: ${output.stats.alumni}`);
}

main();
