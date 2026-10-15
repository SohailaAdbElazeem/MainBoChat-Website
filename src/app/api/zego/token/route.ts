// // // src/app/api/zego/token/route.ts
 

import { NextResponse } from "next/server";
import { generateToken04 } from "@/lib/zego/zegoServerAssistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID || process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    if (!appId || !serverSecret) {
      return NextResponse.json({ success: false, error: "Zego credentials are missing in env" }, { status: 500 });
    }

    // توليد التوكن (صلاحية لمدة يوم مثلاً 86400 ثانية)
    const effectiveTimeInSeconds = 86400;
    const token = generateToken04(appId, userId, serverSecret, effectiveTimeInSeconds, "");

    return NextResponse.json({
      success: true,
      appId: appId,
      token: token,
    });
  } catch (error: any) {
    console.error("Token generation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}