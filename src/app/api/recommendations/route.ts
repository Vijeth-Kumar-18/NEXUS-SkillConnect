import { NextResponse } from "next/server";
import { requireAuth, resolveStudentIdFromUser } from "@/lib/apiAuth";
import { getEnhancedRecommendations, getRecommendedMentors } from "@/lib/queries";

export async function GET() {
  const auth = await requireAuth(["STUDENT"]);
  if (!auth.ok) {
    return auth.response;
  }

  const studentId = await resolveStudentIdFromUser(auth.auth.userId);
  if (!studentId) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const [companies, mentors] = await Promise.all([
    getEnhancedRecommendations(studentId),
    getRecommendedMentors(studentId),
  ]);

  return NextResponse.json({ 
    recommendations: companies,
    mentors: mentors,
    summary: {
      totalCompanies: companies.length,
      totalMentors: mentors.length
    }
  });
}
