// GET /api/teams — Return all teams for client-side resolution
import { NextResponse } from "next/server";
import { allTeams } from "@/data/teams";

export async function GET() {
  // Return minimal team data for follow resolution
  const teams = allTeams.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    shortName: t.shortName,
    flag: t.flag,
    crestUrl: t.crestUrl,
    type: t.type,
    leagueName: t.leagueName,
  }));

  return NextResponse.json(teams);
}
