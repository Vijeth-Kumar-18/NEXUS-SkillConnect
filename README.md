# NEXUS Placement Intelligence (Neo4j Aura)

Graph-based College Placement Analysis and Recommendation System.

This project uses Neo4j Aura as the graph database and implements:

- Data cleaning and ingestion from Data1.txt, Data2.txt, Data3.txt
- Two-role authentication model: ADMIN and STUDENT
- Default password for seeded students: password
- Registration flow for new students
- Dynamic company recommendations and skill-gap intelligence
- Alumni path replay and graph visualization
- Company rounds and interview-preparation question bank

## 1. Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Neo4j Aura via neo4j-driver
- JWT auth via jose
- Recharts + Framer Motion on UI

## 2. Dataset Inputs

Root files consumed for ingestion:

- Data1.txt: company hiring data (role, required skills, rounds, package, location)
- Data2.txt: student profile data (degree, CGPA, skills, projects, target role)
- Data3.txt: alumni data (current company/role, prior companies, timeline, skills, projects)

## 3. Data Cleaning Rules Implemented

Cleaning and normalization happen in src/lib/seed.ts before writing to Neo4j.

### 3.1 Company data cleaning

- Supports mixed row formats in Data1.txt (both canonical and non-canonical records)
- Normalizes missing IDs into generated IDs like JX0001
- Parses required skill lists using | separator
- Normalizes skill names and trims whitespace
- Rounds are clamped between 1 and 8
- Fallback defaults applied for missing location/package/experience

### 3.2 Student data cleaning

- Supports canonical Sxxx rows and non-canonical rows
- Generates student IDs when missing
- Generates email when absent
- Fills missing github and linkedin using slug from name
- Parses top skills and projects from | separated fields
- Applies CGPA fallback when invalid/missing
- Creates default interests
- Creates user login for each student with default password: password

### 3.3 Alumni data cleaning

- Supports canonical Axxx rows and non-canonical rows
- Generates alumni IDs when missing
- Parses prior companies, skills, projects, timeline
- Removes None from prior company chain
- Links alumni to current and prior companies

## 4. Neo4j Graph Model

### Node labels

- User
- Student
- Company
- Skill
- Alumni
- Round
- Question
- Project

### Key relationships

- (User)-[:OWNS_PROFILE]->(Student)
- (Student)-[:HAS_SKILL {level}]->(Skill)
- (Company)-[:REQUIRES_SKILL {weight}]->(Skill)
- (Student)-[:BUILT_PROJECT]->(Project)
- (Alumni)-[:WORKS_AT]->(Company)
- (Alumni)-[:WORKED_AT {order}]->(Company)
- (Company)-[:HAS_ROUND {order}]->(Round)
- (Round)-[:ASKS]->(Question)

### Constraints created automatically

Unique constraints are created for core IDs and keys (User, Student, Company, Skill, Alumni, Project, Round, Question).

## 5. Authentication and Users

### Roles

- ADMIN
- STUDENT

### Admin account

Created during seed. Controlled by:

- ADMIN_EMAIL (default: admin@nexus.edu)
- ADMIN_PASSWORD (default: admin123)

### Seeded students

- Every seeded student gets a User account
- Default password for all seeded students: password

### New student registration

New students can register from /register and are written to Neo4j immediately.

## 6. Environment Setup

Create a .env file in project root.

Required:

- NEO4J_URI
- NEO4J_USERNAME
- NEO4J_PASSWORD

Recommended:

- NEO4J_DATABASE=neo4j
- JWT_SECRET=your-strong-secret
- PASSWORD_SALT=your-password-salt
- ADMIN_EMAIL=admin@nexus.edu
- ADMIN_PASSWORD=admin123

SMTP (optional but recommended):

- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASS
- SMTP_FROM

If SMTP is configured, the app sends:

- Welcome email on new student registration
- Seed/push completion summary email to admin

## 6.1 SMTP Nodemailer Setup

This project uses Nodemailer with SMTP credentials from environment variables.

1. Configure SMTP values in .env (see .env.example)
2. Use provider-specific app password where required (for example, Gmail app password)
3. Test registration flow and verify welcome email delivery
4. Trigger data seed from /admin and verify seed summary email delivery

## 7. Install and Run

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open:

- http://localhost:3000

## 8. How To Push Cleaned Data To Neo4j Aura

Data push can now be run as a two-step command pipeline:

1. Generate a separate filtered data artifact from Data1.txt, Data2.txt, Data3.txt
2. Push that filtered artifact to Neo4j Aura

This keeps the cleaned data explicit and reusable.

### CLI flow (separate filtered file + push)

Generate filtered dataset file:

```bash
npm run filter:data
```

Output file:

- filtered-data/filtered-dataset.json
- filtered-data/filtered-dataset.csv

Push filtered data to Neo4j:

```bash
npm run push:neo4j
```

Or run both in one command:

```bash
npm run sync:neo4j
```

### What is filtered in the file

During generation, raw records are normalized and enriched:

- malformed or incomplete rows are skipped
- mixed row formats are normalized
- missing IDs are generated
- skills/projects are split and cleaned
- missing student profile fields (github/linkedin/interests) are auto-filled
- default student auth payload is included (`role: STUDENT`, `defaultPassword: password`)

CSV exports also include these same normalized fields and are generated as separate artifacts for direct inspection.

### Neo4j push behavior

The push command automatically prefers CSV if present:

- filtered-data/filtered-neo4j-dataset.csv
- filtered-data/filtered-dataset.csv

If CSV is not available, it falls back to JSON filtered artifacts. Data is then written to Neo4j via Cypher MERGE logic, including:

- users (ADMIN, STUDENT)
- students, companies, alumni
- skills, projects, rounds, interview questions
- core relationships used by dashboard/recommendation features

### Verification checklist

1. Run `npm run filter:data`
2. Confirm filtered-data/filtered-dataset.json exists and has expected counts
3. Run `npm run push:neo4j`
4. Confirm terminal output prints Neo4j totals (companies/students/alumni)
5. Open /dashboard, /recommendations, /companies and verify live graph-backed data

### Option A (recommended): from UI

1. Login as admin at /login
2. Go to /admin
3. Click Import Data1/Data2/Data3

This triggers:

- POST /api/admin/seed

### Option B: API directly

If you call seed API directly, you must be authenticated as ADMIN.

## 9. Core API Endpoints

Auth:

- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me
- POST /api/auth/logout

Admin:

- POST /api/admin/seed
- GET /api/admin/overview

Student and app data:

- GET /api/dashboard
- GET/PUT /api/students/me/profile
- GET/POST/DELETE /api/students/me/skills
- GET /api/companies
- GET /api/companies/[id]
- GET /api/recommendations
- GET /api/skill-gap
- GET /api/alumni
- GET /api/analytics
- GET /api/graph

## 10. Feature Mapping

- Skill Gap Intelligence Engine: /api/skill-gap
- Dynamic Match Score System: src/lib/queries.ts (weighted scoring)
- Alumni Path Replay: /api/alumni + alumni timeline rendering
- Graph Visualization: /graph + /api/graph
- Interview Prep (rounds + questions): /preparation + /api/companies/[id]

## 11. Operating the System

### First-time setup flow

1. Configure .env with Neo4j Aura credentials
2. npm install
3. npm run dev
4. Login as admin
5. Seed data from /admin
6. Login as student (seeded user + password)
7. Use dashboard, recommendations, skill-gap, graph, preparation

### Typical admin operations

- Reseed datasets after changing Data1/Data2/Data3
- Monitor graph counts from /api/admin/overview

### Typical student operations

- Login/register
- Update profile and skills
- View recommendation ranking and skill gaps
- Explore company rounds/questions
- Track alumni and graph connections

## 12. Build and Validation

Build command:

```bash
npm run build
```

Current status:

- Build succeeds
- Lint still has pre-existing text apostrophe warnings in static content pages (about/contact/privacy), not blocking runtime

## 13. Troubleshooting

### Cannot connect to Neo4j Aura

- Verify NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD
- Ensure Aura instance is running and reachable
- Check database name in NEO4J_DATABASE

### Seed endpoint returns unauthorized

- Login as ADMIN first
- Verify ADMIN role exists (seed creates it)

### Student cannot login after seed

- Seeded default password is password
- Ensure login role selected is Student

### New registrations not visible

- Check /api/auth/register response
- Verify User-Student relationship creation in Neo4j

## 14. Security Notes

- Change default admin credentials in .env
- Set strong JWT_SECRET and PASSWORD_SALT in production
- Use HTTPS and secure deployment settings for cookies

## 15. Repository Notes

- Data cleaning and seed logic: src/lib/seed.ts
- Neo4j connector: src/lib/neo4j.ts
- Auth utilities: src/lib/security.ts
- Matching and skill-gap logic: src/lib/queries.ts
