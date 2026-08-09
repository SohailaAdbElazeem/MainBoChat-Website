import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://bo-chat.space";
const FRONT_URL = process.env.NEXT_PUBLIC_FRONT_URL || "https://localhost:3000";

interface OAuthResponse {
  url?: string;
  redirect?: string;
  message?: string;
}

export async function GET(req: NextRequest) {
  const redirect = `${FRONT_URL}/api/oauth/google/callback`; 

  let res = await fetch(`${API_BASE}/viaGoogle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ redirect }),
  });

  if (!res.ok) {
    const formBody = new URLSearchParams({ redirect }).toString();
    res = await fetch(`${API_BASE}/viaGoogle`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    });
  }

  const location = res.headers.get("location");
  let data: OAuthResponse | null = null;
  const ct = res.headers.get("content-type") || "";
  if (!location && ct.includes("application/json")) {
    try { 
      data = await res.json() as OAuthResponse; 
    } catch { /* ignore */ }
  }

  const googleUrl = location || data?.url || data?.redirect;
  if (!res.ok || !googleUrl) {
    const msg = data?.message || `viaGoogle failed (${res.status})`;
    return new NextResponse(`OAuth start failed: ${msg}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.redirect(googleUrl, { status: 302 });
}