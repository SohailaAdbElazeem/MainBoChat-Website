// app/api/active-users/route.ts
export const runtime = "nodejs";
export const revalidate = 1800; 

const DEFAULT_ACTIVE_USERS_ID =
  process.env.ACTIVE_USERS_ID || "6877d5497b04a3c83759f122";

export async function GET() {
  // const token = process.env.ACTIVE_USERS_TOKEN;
  const token = process.env.ACTIVE_USERS_TOKEN;
  if (!token) {
    console.error("[active-users] Missing ACTIVE_USERS_TOKEN");
    return new Response(
      JSON.stringify({ error: "Missing ACTIVE_USERS_TOKEN" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const endpoint = `https://bo-chat.space/activeusers/${DEFAULT_ACTIVE_USERS_ID}`;

  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 10_000);

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2ODc3ZDU0OTdiMDRhM2M4Mzc1OWYxMjIiLCJyb2xlIjpbImRlbGV0ZSIsInJlcG9ydCIsInB1Ymxpc2giLCJhZGQiLCJibG9ja2VkQ29udGVudCIsImJsb2NrIiwidmVyaWZ5IiwiYWNjZXB0Iiwid2F0Y2giXSwiaWF0IjoxNzY0MDA1NTk3LCJleHAiOjE3NjQ2MTAzOTd9.wGFSnfk4ULUMG7Qbl8ksRgh6ShX9EkyXQgtPSrfNa4E` },
      signal: ctrl.signal,
      // نسيب ISR شغال على مستوى الرد بتاعنا، بس من الأفضل من غير force-cache هنا
      // عشان لو Upstream بيرجع Cache headers غريبة ما تلخبطش
      cache: "no-store",
      next: { revalidate: 1800 },
    });

    const text = await res.text(); // اقرأ دايمًا الـ body حتى في الأخطاء

    if (!res.ok) {
      // سجّل للـ dev
      console.error(
        "[active-users] Upstream error",
        res.status,
        text?.slice(0, 500)
      );
      // رجّع نفس الـ status مع الـ body عشان تبان الرسالة الحقيقية في الكلاينت
      return new Response(
        JSON.stringify({
          error: "Upstream error",
          status: res.status,
          upstreamBody: safeJsonTry(text),
        }),
        {
          status: res.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // لو الـ body JSON رجّعه كما هو
    return new Response(text, {
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    console.error("[active-users] Request failed:", err?.message || err);
    const isAbort = err?.name === "AbortError";
    return new Response(
      JSON.stringify({
        error: isAbort ? "Upstream timeout" : "Request failed",
        detail: err?.message || String(err),
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  } finally {
    clearTimeout(to);
  }
}

function safeJsonTry(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
