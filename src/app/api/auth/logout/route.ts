import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/security";
import { withApiHandler } from "@/lib/apiRoute";

export const POST = withApiHandler(async () => {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
});
