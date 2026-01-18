/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 8000;

// يمكنك تعديله بسهولة لاحقًا أو تمريره كـ query param
const UPSTREAM_URL = "https://bo-chat.space/story/686695914211804ef3875338";

// ⚠️ لو هتستخدم التوكن دايمًا كده، الأفضل تحطه في .env
// process.env.BOCHAT_TOKEN
const STATIC_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2ODc3ZDU0OTdiMDRhM2M4Mzc1OWYxMjIiLCJyb2xlIjpbImRlbGV0ZSIsInJlcG9ydCIsInB1Ymxpc2giLCJhZGQiLCJibG9ja2VkQ29udGVudCIsImJsb2NrIiwidmVyaWZ5IiwiYWNjZXB0Iiwid2F0Y2giXSwiaWF0IjoxNzY3NzI1Njg2LCJleHAiOjE3NjgzMzA0ODZ9.7_vbY4ifpv13s2aj2Du3za-YonHDg9k_DreaQesqVJs";

export async function GET(req: NextRequest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // ✅ خذ التوكن من الهيدر لو موجود وإلا استخدم الثابت
    const authHeader = req.headers.get("authorization");
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : STATIC_TOKEN;

    const res = await fetch(UPSTREAM_URL, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    // نحاول نحصل على JSON، ولو فشل نرجع النص
    const text = await res.text();
    let data: any = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: res.status, data },
        { status: res.status }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Failed to fetch stories" },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
