// GET/POST /api/follows — Followed teams API (auth-gated)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { allTeams } from "@/data/teams";
import { createFollow, deleteFollow, getUserFollows, isFollowing } from "@/lib/data/follows";
import { verifyCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0];
  return req.headers.get("x-real-ip") || "unknown";
}

export async function GET(request: NextRequest) {
  // Rate limit: public-facing endpoint, generous limit
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`follows-get:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).userId || session.user.id;

  // Load follows from repository
  const follows = await getUserFollows(userId);

  // Resolve follow data with team info
  const followedTeamIds = follows.map((f) => f.teamId);
  const teams = allTeams.filter(
    (t) => followedTeamIds.includes(t.id) || followedTeamIds.includes(t.slug)
  );

  const result = teams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    teamSlug: team.slug,
    teamFlag: team.flag,
    teamCrestUrl: team.crestUrl,
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Auth check before anything else
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`follows-post:${ip}`);
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
    const body = await request.json();
    const { teamId } = body;

    if (!teamId) {
      return NextResponse.json({ error: "teamId is required" }, { status: 400 });
    }

    // Validate team exists
    const team = allTeams.find((t) => t.id === teamId || t.slug === teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const userId = (session.user as any).userId || session.user.id;
    const follow = await createFollow(userId, teamId);

    return NextResponse.json({ success: true, follow, team });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
