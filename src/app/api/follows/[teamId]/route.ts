// DELETE /api/follows/[teamId] — Unfollow a team (auth-gated)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { deleteFollow } from "@/lib/data/follows";
import { verifyCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0];
  return req.headers.get("x-real-ip") || "unknown";
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const session = await getServerSession(authOptions);

  // Auth check before anything else
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`follows-delete:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // CSRF verification
  if (!verifyCsrfToken(session, request)) {
    return NextResponse.json({ error: "CSRF token missing or invalid" }, { status: 403 });
  }

  try {
    const { teamId } = await params;

    if (!teamId) {
      return NextResponse.json({ error: "teamId is required" }, { status: 400 });
    }

    const userId = (session.user as any).userId || session.user.id;
    await deleteFollow(userId, teamId);

    return NextResponse.json({ success: true, teamId });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
