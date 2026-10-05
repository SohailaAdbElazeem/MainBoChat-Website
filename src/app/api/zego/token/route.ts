// // src/app/api/zego/token/route.ts
// import { NextResponse } from 'next/server';
// // @ts-ignore
// import { generateToken04 } from '@/lib/zego/zegoServerAssistant';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const userId: string = body.userId || body.userID || '';

//     const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
//     const serverSecret = process.env.ZEGO_SERVER_SECRET;

//     if (!appId || !serverSecret) {
//       return NextResponse.json(
//         { success: false, error: 'Zego config missing' },
//         { status: 500 }
//       );
//     }

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: 'userId مطلوب' },
//         { status: 400 }
//       );
//     }

//     // ✅ المفتاح 32 حرف — نمرره كامل
//     const token = generateToken04(appId, userId, serverSecret, 3600, '');

//     return NextResponse.json({
//       success: true,
//       token,
//       appId,
//     });
//   } catch (error: any) {
//     console.error('❌ Zego token error:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error?.errorMessage || error?.message || 'فشل إنشاء التوكن',
//       },
//       { status: 500 }
//     );
//   }
// }


// ////////////
// src/app/api/zego/token/route.ts
import { NextResponse } from 'next/server';
// @ts-ignore
import { generateToken04 } from '@/lib/zego/zegoServerAssistant';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId: string = String(body.userId || body.userID || '').trim();

    // 1. تحويل الـ AppID إلى رقم صريح
    const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    
    // 2. تنظيف الـ Server Secret لضمان أن طوله 32 حرف بالضبط
    const serverSecret = process.env.ZEGO_SERVER_SECRET?.trim() || '';

    // التحقق المسبق قبل إرسال البيانات لدالة التشفير
    if (!appId || isNaN(appId)) {
      return NextResponse.json({ success: false, error: 'appId غير صالح' }, { status: 500 });
    }

    if (!serverSecret || (serverSecret.length !== 32 && serverSecret.length !== 64)) {
      console.error(`❌ خطأ: ZEGO_SERVER_SECRET طوله الحالي ${serverSecret.length} والمطلوب 32 أو 64 حرفاً.`);
      return NextResponse.json({ success: false, error: 'ZEGO_SERVER_SECRET غير صالح' }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId مطلوب' }, { status: 400 });
    }

    // 3. استدعاء الدالة بحماية وأمان
    const effectiveTimeInSeconds = 3600;
    const token = generateToken04(
      appId,
      userId,
      serverSecret,
      effectiveTimeInSeconds,
      "" // payload فارغ للخدمات العامة (ZIM + Call Kit)
    );

    return NextResponse.json({
      success: true,
      token,
      appId,
    });
  } catch (error: any) {
    console.error('❌ Zego token generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.errorMessage || error?.message || 'فشل إنشاء التوكن',
      },
      { status: 500 }
    );
  }
}