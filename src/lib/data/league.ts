// src/lib/data/league.ts — League repository layer
// All functions are async for future API swap compatibility.
// Current implementation reads from static data files (src/data/leagues.ts).

import type { League, Team, Match } from "@/data/types";
import { leagues } from "@/data/leagues";

/**
 * Get all leagues.
 */
export async function getAllLeagues(): Promise<League[]> {
  return leagues;
}

/**
 * Get a league by its slug.
 */
export async function getLeagueBySlug(slug: string): Promise<League | null> {
  return leagues.find((l) => l.slug === slug) || null;
}

/**
 * Get leagues filtered by type (e.g., "club", "international-club").
 */
export async function getLeaguesByType(type: string): Promise<League[]> {
  return leagues.filter((l) => l.type === type);
}

/**
 * Search leagues by name or country.
 */
export async function searchLeagues(query: string): Promise<League[]> {
  const q = query.toLowerCase();
  if (!q) return [];
  return leagues.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q)
  );
}

/**
 * Build league objects with derived teams and matches from the full data set.
 * This populates the `teams` and `matches` fields on each league.
 */
export async function buildLeaguesWithDerivedData(allTeams: Team[], allMatches: Match[]): Promise<League[]> {
  const teamById = new Map<string, Team>();
  for (const team of allTeams) {
    teamById.set(team.id, team);
  }

  const matchByLeague = new Map<string, Match[]>();
  for (const match of allMatches) {
    if (match.leagueId) {
      const existing = matchByLeague.get(match.leagueId) || [];
      existing.push(match);
      matchByLeague.set(match.leagueId, existing);
    }
  }

  return leagues.map((league) => {
    const leagueTeams = allTeams.filter((t) => t.leagueId === league.id);
    const leagueMatches = matchByLeague.get(league.id) || [];
    return {
      ...league,
      teams: leagueTeams,
      matches: leagueMatches,
    };
  });
}
