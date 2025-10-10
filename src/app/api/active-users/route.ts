// app/api/active-users/route.ts (أو pages/api/active-users.ts في Pages Router)
export const revalidate = 1800; // 30 دقيقة

export async function GET() {
  const endpoint = "http://bo-chat.space/activeusers/6877d5497b04a3c83759f122";
  const token = process.env.ACTIVE_USERS_TOKEN!; // ضع التوكن في .env

  const res = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
    // تمكين الكاش مع ISR
    next: { revalidate: 1800 },
    cache: "force-cache",
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: `HTTP ${res.status}` }), { status: 500 });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
