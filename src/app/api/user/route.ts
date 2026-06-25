// PATCH /api/user — Update user profile (display name)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { displayName } = body;

    if (!displayName || typeof displayName !== "string") {
      return NextResponse.json({ error: "displayName is required" }, { status: 400 });
    }

    // In dev mode, update session via next-auth update
    // In production, this would update the database
    // For now, just acknowledge the update
    return NextResponse.json({ success: true, displayName });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
