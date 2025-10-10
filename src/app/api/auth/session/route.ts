import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "bochat_token";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value || "";
  const uid = req.cookies.get("bochat_uid")?.value || "";
  return NextResponse.json({ authenticated: !!token, userId: uid });
}
