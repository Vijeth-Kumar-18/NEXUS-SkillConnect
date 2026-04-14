import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/security";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
