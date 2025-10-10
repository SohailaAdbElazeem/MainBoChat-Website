import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "bochat_token";

function pickParam(u: URL, names: string[]) {
  for (const n of names) {
    const v = u.searchParams.get(n);
    if (v) return v;
  }
  return "";
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const token = pickParam(url, ["token", "jwt", "access_token"]) || "";
  const userId = pickParam(url, ["userId", "uid", "id"]) || "";

  const userStr = pickParam(url, ["user", "data"]);

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=google_login_no_token", req.url),
      { status: 302 }
    );
  }

  const isProd = process.env.NODE_ENV === "production";

  const resp = NextResponse.redirect(new URL("/", req.url), { status: 302 });
  resp.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (userId) {
    resp.cookies.set("bochat_uid", userId, {
      httpOnly: false,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }


  return resp;
}
