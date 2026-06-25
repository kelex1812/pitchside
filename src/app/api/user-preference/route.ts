// PATCH /api/user-preference — Update user preferences (timezone, theme)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { loadPreferences, savePreferences } from "@/lib/data/persistence";

// In-memory cache for a single request
let cache: Record<string, { timezone: string; theme: string }> | null = null;

function getCache(): Record<string, { timezone: string; theme: string }> {
  if (cache === null) {
    cache = loadPreferences();
  }
  return cache;
}

function persist(): void {
  savePreferences(cache || {});
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { timezone, theme } = body;

    const userId = (session.user as any).userId || session.user.id;
    const store = getCache();

    const existing = store[userId] || { timezone: "UTC", theme: "dark" };
    store[userId] = {
      timezone: timezone || existing.timezone,
      theme: theme || existing.theme,
    };
    persist();

    return NextResponse.json({
      success: true,
      timezone: store[userId].timezone,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).userId || session.user.id;
  const store = getCache();
  const pref = store[userId] || { timezone: "UTC", theme: "dark" };

  return NextResponse.json(pref);
}
