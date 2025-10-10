// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { z } from 'zod';
import { SignJWT } from 'jose';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bodySchema = z.object({ tokenId: z.string().min(10) });

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: NextRequest) {
  // 1) Origin/Referer تحكم مبدئي بالمصادر
  const origin = req.headers.get('origin') || '';
  const allowed = [ 'http://localhost:3000', 'https://your-domain.com' ];
  if (!allowed.some(a => origin.startsWith(a))) {
    // ممكن تخليها تحذير فقط أثناء التطوير
    // return bad('Forbidden origin', 403);
  }

  // 2) body
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return bad('Invalid body');

  const { tokenId } = parsed.data;

  try {
    // 3) تحقق من التوكن مع جوجل
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID, // مهم يطابق
    });

    const payload = ticket.getPayload();
    if (!payload) return bad('Invalid token', 401);

    // فحوصات إضافية اختيارية (iss/exp/email_verified)
    const iss = payload.iss;
    if (iss !== 'https://accounts.google.com' && iss !== 'accounts.google.com') {
      return bad('Invalid issuer', 401);
    }
    if (!payload.email || payload.email_verified !== true) {
      return bad('Unverified email', 401);
    }

    // 4) بيانات المستخدم من جوجل
    const user = {
      sub: payload.sub!, // مُعرّف جوجل الفريد
      email: payload.email!,
      name: payload.name || '',
      picture: payload.picture || '',
    };

    // 5) (اختياري) upsert في قاعدة البيانات
    // await db.user.upsert({ where: { providerAccountId: user.sub, provider: 'google' }, create: {...}, update: {...} });

    // 6) إنشاء سيشن JWT قصير المدى
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const jwt = await new SignJWT({
      sub: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      provider: 'google',
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const res = NextResponse.json({ ok: true });

    // 7) كوكي HttpOnly + Secure
    res.cookies.set({
      name: 'sid',
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
    });

    return res;
  } catch (err) {
    console.error('Google auth error:', err);
    return bad('Authentication failed', 401);
  }
}
