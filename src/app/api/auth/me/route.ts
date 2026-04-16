import { NextResponse } from "next/server";
import { requireAuth, resolveStudentIdFromUser } from "@/lib/apiAuth";

export async function GET() {
  const authCheck = await requireAuth();
  if (!authCheck.ok) {
    return authCheck.response;
  }

  const studentId = await resolveStudentIdFromUser(authCheck.auth.userId);

  return NextResponse.json({
    user: {
      id: authCheck.auth.userId,
      role: authCheck.auth.role,
      email: authCheck.auth.email,
      name: authCheck.auth.name,
      studentId,
    },
  });
}
