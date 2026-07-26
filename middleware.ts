 import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ["/dashboard", "/account"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

   const response = intlMiddleware(req);

   const segments = pathname.split("/");
  const locale = segments[1];

   const normalizedPath = "/" + segments.slice(2).join("/");

  const needsAuth = PROTECTED_ROUTES.some((route) =>
    normalizedPath.startsWith(route)
  );

  if (!needsAuth) {
    return response;
  }

  const token = req.cookies.get("sid")?.value;

  if (!token) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    await jwtVerify(token, secret);

    return response;
  } catch {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};