// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { API_BASE, DEFAULT_APP_URL } from "./config";

// export function extractToken(data: any): string | null {
//   const t =
//     data?.token ||
//     data?.data?.token ||
//     data?.accessToken ||
//     data?.jwt ||
//     data?.session?.token;
//   return typeof t === "string" && t.trim() ? t.trim() : null;
// }

// export function getAppUrl(req: NextRequest): string {
//   // حاول تستخدم ENV أولاً
//   if (process.env.APP_URL) return process.env.APP_URL;
//   // استنتاج من الهيدر (ينفع على Vercel/Node)
//   const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
//   const proto = req.headers.get("x-forwarded-proto") ?? "http";
//   return `${proto}://${host}`;
// }

// export async function strictJson(res: Response) {
//   const ct = res.headers.get("content-type") || "";
//   if (!ct.includes("application/json")) {
//     const txt = await res.text().catch(() => "");
//     throw new Error(txt || "Non-JSON response from backend");
//   }
//   return res.json();
// }

// export function setAuthCookie(token: string) {
//   // 7 أيام مثالاً – غيّر حسب احتياجك
//   cookies().set("bochat_token", token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7,
//   });
// }

// export function clearAuthCookie() {
//   cookies().set("bochat_token", "", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "lax",
//     path: "/",
//     maxAge: 0,
//   });
// }

// /** Proxy helper لطلباتك للسيرفر الأصلي */
// export async function proxyPostJson(path: string, payload: any, init?: RequestInit) {
//   const res = await fetch(`${API_BASE}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
//     body: JSON.stringify(payload),
//     redirect: "manual",
//     // مهم: من غير credentials لأننا بنتكلم سيرفر-لسيرفر
//     ...init,
//   });

//   if ([301, 302, 303, 307, 308].includes(res.status)) {
//     throw new Error("Unexpected redirect from backend");
//   }
//   const data = await strictJson(res).catch((e: any) => {
//     throw new Error(e?.message || "Invalid backend response");
//   });

//   return { status: res.status, data };
// }

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE, DEFAULT_APP_URL } from "./config";

// تعريف الأنواع المستخدمة بدلاً من any
type ApiData = {
  token?: string;
  data?: {
    token?: string;
  };
  accessToken?: string;
  jwt?: string;
  session?: {
    token?: string;
  };
  message?: string;
  error?: string;
};

type ProxyPayload = Record<string, unknown>;

export function extractToken(data: ApiData): string | null {
  const t =
    data?.token ||
    data?.data?.token ||
    data?.accessToken ||
    data?.jwt ||
    data?.session?.token;
  return typeof t === "string" && t.trim() ? t.trim() : null;
}

export function getAppUrl(req: NextRequest): string {
   if (process.env.APP_URL) return process.env.APP_URL;
   const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
   const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function strictJson(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Non-JSON response from backend");
  }
  return res.json();
}

export function setAuthCookie(token: string) {
  // 7 أيام مثالاً – غيّر حسب احتياجك
  cookies().set("bochat_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  cookies().set("bochat_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Proxy helper لطلباتك للسيرفر الأصلي */
export async function proxyPostJson(
  path: string,
  payload: ProxyPayload,
  init?: RequestInit
): Promise<{ status: number; data: unknown }> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: JSON.stringify(payload),
    redirect: "manual",
    // مهم: من غير credentials لأننا بنتكلم سيرفر-لسيرفر
    ...init,
  });

  if ([301, 302, 303, 307, 308].includes(res.status)) {
    throw new Error("Unexpected redirect from backend");
  }
  const data = await strictJson(res).catch((e: unknown) => {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(message || "Invalid backend response");
  });

  return { status: res.status, data };
}