// app/api/bo-posts/route.ts
import { NextResponse } from "next/server";

const TIMEOUT_MS = 8000;
const UPSTREAM_URL = "https://bo-chat.space/homeposts/null";

// تحويل القيمة إلى كائن JSON إذا كان نصوصاً تشبه JSON
function toJsonLoose(x: unknown): unknown {
  if (x == null) return null;
  if (typeof x === "object") return x;
  if (typeof x === "string") {
    const s = x.trim();
    if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"))) {
      try {
        return JSON.parse(s);
      } catch {
        // تجاهل أخطاء التحليل
      }
    }
  }
  return null;
}

// استخراج أول مصفوفة من جسم الاستجابة (بافتراض أن البيانات قد تكون في حقول مختلفة)
function pickArray(body: unknown): unknown[] {
  // التحقق من أن body كائن وليس null/undefined
  const obj = typeof body === "object" && body !== null ? body : null;

  const candidates = [
    body,
    obj && "resp" in obj ? (obj as Record<string, unknown>).resp : undefined,
    obj && "posts" in obj ? (obj as Record<string, unknown>).posts : undefined,
    obj && "data" in obj ? (obj as Record<string, unknown>).data : undefined,
    obj && "data" in obj && typeof (obj as Record<string, unknown>).data === "object" && (obj as Record<string, unknown>).data !== null && "posts" in (obj as Record<string, unknown>).data
      ? ((obj as Record<string, unknown>).data as Record<string, unknown>).posts
      : undefined,
    obj && "data" in obj && typeof (obj as Record<string, unknown>).data === "object" && (obj as Record<string, unknown>).data !== null && "items" in (obj as Record<string, unknown>).data
      ? ((obj as Record<string, unknown>).data as Record<string, unknown>).items
      : undefined,
    obj && "posts" in obj && typeof (obj as Record<string, unknown>).posts === "object" && (obj as Record<string, unknown>).posts !== null && "docs" in (obj as Record<string, unknown>).posts
      ? ((obj as Record<string, unknown>).posts as Record<string, unknown>).docs
      : undefined,
    obj && "docs" in obj ? (obj as Record<string, unknown>).docs : undefined,
    obj && "results" in obj ? (obj as Record<string, unknown>).results : undefined,
    obj && "items" in obj ? (obj as Record<string, unknown>).items : undefined,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

// تحويل استجابة الـ fetch إلى جسم (مع دعم JSON والنصوص)
async function parseResponse(res: Response): Promise<{ body: unknown }> {
  const contentType = res.headers.get("content-type") || "";
  let body: unknown = null;

  if (contentType.includes("application/json")) {
    try {
      body = await res.json();
    } catch {
      body = null;
    }
  } else {
    const text = await res.text().catch(() => "");
    body = toJsonLoose(text) ?? text;
  }
  return { body };
}

export async function GET() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(UPSTREAM_URL, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "NextProxy/1.0",
      },
      cache: "no-store",
      signal: ctrl.signal,
      redirect: "follow",
    });

    const { body } = await parseResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: response.status, body },
        { status: response.status }
      );
    }

    const posts = pickArray(body);
    return NextResponse.json(Array.isArray(posts) ? posts : [], {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage || "Proxy failed" }, { status: 500 });
  } finally {
    clearTimeout(timer);
  }
}