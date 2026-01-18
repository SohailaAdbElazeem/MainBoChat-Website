// src/app/api/verify/route.ts
import { NextResponse } from "next/server";

const TOKEN =
  "FIXED_TEeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2ODc3ZDU0OTdiMDRhM2M4Mzc1OWYxMjIiLCJyb2xlIjpbImRlbGV0ZSIsInJlcG9ydCIsInB1Ymxpc2giLCJhZGQiLCJibG9ja2VkQ29udGVudCIsImJsb2NrIiwidmVyaWZ5IiwiYWNjZXB0Iiwid2F0Y2giXSwiaWF0IjoxNzYzNTkxNTU3LCJleHAiOjE3NjQxOTYzNTd9.vIgAat1Kq4Y4fLKhGeGaYKj0l4KD0bChVkmyouWFVcYP_TOKEN";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const apiRes = await fetch(
      `https://bo-chat.space/users/${id}/verify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verified: true }),
      }
    );

    if (!apiRes.ok) {
      const txt = await apiRes.text();
      return NextResponse.json(
        { error: "verify failed", details: txt },
        { status: apiRes.status }
      );
    }

    const json = await apiRes.json();

    return NextResponse.json({
      ok: true,
      result: json,
    });
  } catch (err) {
    console.error("verify error", err);
    return NextResponse.json(
      { error: "server error" },
      { status: 500 }
    );
  }
}
