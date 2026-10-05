// // src/app/api/zego/test/route.ts
// import { NextResponse } from 'next/server';
// import { createCipheriv, randomBytes } from 'crypto';

// function generateToken04(
//   appId: number,
//   userId: string,
//   secret: string,
//   effectiveTimeInSeconds: number,
//   payload: string = ''
// ): string {
//   const createTime = Math.floor(Date.now() / 1000);
//   const tokenInfo = {
//     app_id: appId,
//     user_id: userId,
//     nonce: Math.floor(Math.random() * 2147483647),
//     ctime: createTime,
//     expire: createTime + effectiveTimeInSeconds,
//     payload,
//   };

//   const plainText = JSON.stringify(tokenInfo);
//   const iv = randomBytes(16);

//   const key32 = Buffer.alloc(32);
//   const secretBuf = Buffer.from(secret, 'utf8');
//   secretBuf.copy(key32, 0, 0, Math.min(secretBuf.length, 32));

//   const cipher = createCipheriv('aes-256-cbc', key32, iv);
//   const encrypted = Buffer.concat([
//     cipher.update(Buffer.from(plainText, 'utf8')),
//     cipher.final(),
//   ]);

//   const tokenBody = Buffer.concat([iv, encrypted]).toString('base64');
//   return '04' + tokenBody;
// }

// export async function GET() {
//   const appId = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
//   const secret = process.env.ZEGO_SERVER_SECRET;

//   const len = secret ? secret.length : 0;
//   const isValid = len === 32 || len === 64;

//   let tokenSample: string | null = null;
//   let tokenError: string | null = null;
//   try {
//     if (appId && secret) {
//       tokenSample = generateToken04(
//         Number(appId),
//         'test_user_123',
//         secret,
//         3600,
//         ''
//       );
//     }
//   } catch (e: any) {
//     tokenError = e.message;
//   }

//   return NextResponse.json({
//     appId: appId ? `موجود (${appId})` : '❌ غير موجود',
//     secretExists: !!secret,
//     secretLength: len,
//     expectedLength: '32 أو 64',
//     isValid,
//     tokenGenerated: !!tokenSample,
//     tokenPrefix: tokenSample ? tokenSample.slice(0, 15) + '...' : null,
//     tokenLength: tokenSample ? tokenSample.length : 0,
//     tokenError,
//   });
// }

// ظظظظظظظظظظظظظظظ
// src/app/api/zego/test/route.ts
import { NextResponse } from 'next/server';
// @ts-ignore
import { generateToken04 } from '@/lib/zego/zegoServerAssistant';

export async function GET() {
  const appIdRaw = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
  const secretRaw = process.env.ZEGO_SERVER_SECRET;

  // تنظيف المتغيرات
  const appId = appIdRaw ? Number(appIdRaw.trim()) : null;
  const secret = secretRaw ? secretRaw.trim() : '';

  const len = secret.length;
  const isValid = len === 32 || len === 64;

  let tokenSample: string | null = null;
  let tokenError: string | null = null;

  try {
    if (appId && secret && isValid) {
      // استدعاء خوارزمية Zego الرسمية
      tokenSample = generateToken04(
        appId,
        'test_user_123',
        secret,
        3600,
        ''
      );
    } else if (!isValid) {
      tokenError = `طول الـ Secret غير صحيح (${len}). المطلوب 32 أو 64 حرفاً.`;
    }
  } catch (e: any) {
    tokenError = e.message || 'فشل توليد التوكن';
  }

  return NextResponse.json({
    appId: appId ? `موجود (${appId})` : '❌ غير موجود أو غير صالح',
    secretExists: !!secretRaw,
    secretLength: len,
    expectedLength: '32 أو 64',
    isValid,
    tokenGenerated: !!tokenSample,
    tokenPrefix: tokenSample ? tokenSample.slice(0, 15) + '...' : null,
    tokenLength: tokenSample ? tokenSample.length : 0,
    tokenError,
  });
}