// GET /api/csrf — Return the current CSRF token so the client can
// include it in subsequent POST/DELETE requests.
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { getCsrfToken } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const csrfToken = getCsrfToken(session);

  if (!csrfToken) {
    return NextResponse.json(
      { error: "CSRF token not available" },
      { status: 500 }
    );
  }

  // Set the token as an HTTP-only cookie so the client can read it
  // using document.cookie (Non-HttpOnly via SameSite=Lax for CSRF)
  const response = NextResponse.json({ csrfToken });
  response.cookies.set("pitchside_csrf", csrfToken, {
    httpOnly: false, // Client needs to read it
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return response;
}
