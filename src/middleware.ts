// src/middleware.ts — Next.js middleware for auth guards on /feed and /account
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * Validate that a URL is safe to redirect to.
 * Only allows paths that are:
 * 1. On the same origin (no cross-domain redirects)
 * 2. Not a protocol-relative URL
 * 3. An absolute path starting with /
 */
function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url, "http://localhost");
    // Must be same origin
    if (parsed.origin !== "http://localhost") return false;
    // Must be a relative path
    return parsed.pathname.startsWith("/");
  } catch {
    // Malformed URL — not safe
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Protected routes: /feed and /account
  if (pathname.startsWith("/feed") || pathname.startsWith("/account")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      const returnTo = pathname;
      // Only set returnTo if it's a safe internal path
      if (isSafeRedirectUrl(returnTo)) {
        loginUrl.searchParams.set("returnTo", returnTo);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/feed/:path*",
    "/account/:path*",
  ],
};
