import { NextRequest, NextResponse } from "next/server";
import { extractToken, proxyPostJson, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { identifier, password, lang } = body || {};

    if (!identifier || !password) {
      return NextResponse.json(
        { ok: false, message: "Missing credentials" },
        { status: 400 }
      );
    }

    const { status, data } = await proxyPostJson("/login", { identifier, password, lang });

    // نجبر النجاح الحقيقي على وجود token
    const token = extractToken(data);
    if (!token) {
      const serverMsg = String(data?.message ?? data?.msg ?? data?.error ?? "");
      return NextResponse.json(
        { ok: false, message: serverMsg || "Invalid credentials" },
        { status: status >= 400 && status < 600 ? status : 401 }
      );
    }

    setAuthCookie(token);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: unknown) {
  const message = e instanceof Error ? e.message : String(e);
  return NextResponse.json(
    { ok: false, message: message || "Login failed" },
    { status: 500 }
  );
}
  // catch (e: any) {
  //   return NextResponse.json(
  //     { ok: false, message: e?.message || "Login failed" },
  //     { status: 500 }
  //   );
  // }
}
