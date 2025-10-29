import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://bo-chat.space/story/686695914211804ef3875338";

export async function GET(req: NextRequest) {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2ODc3ZDU0OTdiMDRhM2M4Mzc1OWYxMjIiLCJyb2xlIjpbImRlbGV0ZSIsInJlcG9ydCIsInB1Ymxpc2giLCJhZGQiLCJibG9ja2VkQ29udGVudCIsImJsb2NrIiwidmVyaWZ5IiwiYWNjZXB0Iiwid2F0Y2giXSwiaWF0IjoxNzYxNzIyOTkyLCJleHAiOjE3NjIzMjc3OTJ9.0fXlWibpU6OO0bE1gQ21g24VIVmkCi1ybO-V9xmJcmA"
    // const auth = req.headers.get("authorization") || "";
    // const auth = req.headers.get("authorization") || "";
    const res = await fetch(UPSTREAM, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { message: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
