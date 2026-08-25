import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth";
import { seedFromLocalDatasets } from "@/lib/seed";
import { sendSeedSummaryEmail } from "@/lib/mailer";
import { withApiHandler } from "@/lib/apiRoute";

export const POST = withApiHandler(async () => {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) {
    return auth.response;
  }

  const result = await seedFromLocalDatasets();

  sendSeedSummaryEmail({
    to: process.env.ADMIN_EMAIL || auth.auth.email,
    companies: result.companies,
    students: result.students,
    alumni: result.alumni,
  }).catch(() => {
    // Email delivery should not block seed API success.
  });

  return NextResponse.json({ success: true, ...result });
});
