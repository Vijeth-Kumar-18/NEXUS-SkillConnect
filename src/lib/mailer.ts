import nodemailer from "nodemailer";

interface MailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (typeof value !== "string") {
    return fallback;
  }
  return value.toLowerCase() === "true";
}

function isMailerConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );
}

function getTransporter() {
  if (!isMailerConfigured()) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: parseBool(process.env.SMTP_SECURE, port === 465),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendMail(params: MailParams): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
}

export async function sendStudentWelcomeEmail(input: {
  to: string;
  name: string;
  studentId: string;
}): Promise<void> {
  await sendMail({
    to: input.to,
    subject: "Welcome to NEXUS Placement Intelligence",
    text: `Hi ${input.name}, your student account has been created successfully. Student ID: ${input.studentId}.`,
    html: `
      <h2>Welcome to NEXUS Placement Intelligence</h2>
      <p>Hi <strong>${input.name}</strong>,</p>
      <p>Your student account has been created successfully.</p>
      <p><strong>Student ID:</strong> ${input.studentId}</p>
      <p>You can now log in and start exploring recommendations, skill-gap analysis, alumni paths, and graph insights.</p>
    `,
  });
}

export async function sendSeedSummaryEmail(input: {
  to: string;
  companies: number;
  students: number;
  alumni: number;
}): Promise<void> {
  await sendMail({
    to: input.to,
    subject: "NEXUS Neo4j Data Push Completed",
    text: `Data push completed. Companies: ${input.companies}, Students: ${input.students}, Alumni: ${input.alumni}.`,
    html: `
      <h3>NEXUS Neo4j Data Push Completed</h3>
      <p>The cleaned dataset has been pushed to Neo4j Aura.</p>
      <ul>
        <li><strong>Companies:</strong> ${input.companies}</li>
        <li><strong>Students:</strong> ${input.students}</li>
        <li><strong>Alumni:</strong> ${input.alumni}</li>
      </ul>
    `,
  });
}
