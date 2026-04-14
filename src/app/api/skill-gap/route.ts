import { NextRequest, NextResponse } from "next/server";
import { requireAuth, resolveStudentIdFromUser } from "@/lib/apiAuth";
import { getSkillGap, getRecommendationsForStudent } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(["STUDENT"]);
  if (!auth.ok) {
    return auth.response;
  }

  const studentId = await resolveStudentIdFromUser(auth.auth.userId);
  if (!studentId) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const companyId = new URL(request.url).searchParams.get("companyId");
  let selectedCompanyId = companyId || "";

  if (!selectedCompanyId) {
    const recommendations = await getRecommendationsForStudent(studentId);
    selectedCompanyId = recommendations[0]?.companyId || "";
  }

  if (!selectedCompanyId) {
    return NextResponse.json({ error: "No companies available" }, { status: 404 });
  }

  const gap = await getSkillGap(studentId, selectedCompanyId);
  return NextResponse.json({ companyId: selectedCompanyId, ...gap });
}
