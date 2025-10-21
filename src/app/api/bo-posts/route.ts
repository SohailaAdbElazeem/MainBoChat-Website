// app/api/bo-posts/route.ts
import { NextResponse } from "next/server";

const TIMEOUT_MS = 8000;
const UPSTREAM_URL = "http://bo-chat.space/homeposts/null";

function toJsonLoose(x: any) {
  if (x == null) return null;
  if (typeof x === "object") return x;
  if (typeof x === "string") {
    const s = x.trim();
    if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"))) {
      try { return JSON.parse(s); } catch {}
    }
  }
  return null;
}
function pickArray(body: any): any[] {
  const cands = [body, body?.resp, body?.posts, body?.data, body?.data?.posts, body?.data?.items, body?.posts?.docs, body?.docs, body?.results, body?.items];
  for (const c of cands) if (Array.isArray(c)) return c;
  return [];
}

async function parseResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  let body: any = null;
  if (ct.includes("application/json")) {
    try { body = await res.json(); } catch { body = null; }
  } else {
    const text = await res.text().catch(() => "");
    body = toJsonLoose(text) ?? text;
  }
  return { ct, body };
}

export async function GET() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(UPSTREAM_URL, {
      method: "GET",
      headers: { Accept: "application/json, text/plain, */*", "User-Agent": "NextProxy/1.0" },
      cache: "no-store",
      signal: ctrl.signal,
      redirect: "follow",
    });

    const { body } = await parseResponse(r);

    if (!r.ok) {
      return NextResponse.json({ error: "Upstream error", status: r.status, body }, { status: r.status });
    }

    const data = pickArray(body);
    return NextResponse.json(Array.isArray(data) ? data : [], {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Proxy failed" }, { status: 500 });
  } finally {
    clearTimeout(timer);
  }
}
