// src/lib/data/teams.ts — Team repository layer
// All functions are async for future API swap compatibility.
// Current implementation reads from static data files (src/data/teams.ts).

import type { Team, TeamType } from "@/data/types";
import { allTeams, searchTeams, getTeamBySlug, getTeamById, getGroupStandings, validGroups } from "@/data/teams";

// Re-export existing utility functions
export { allTeams, searchTeams, getTeamBySlug, getTeamById, getGroupStandings, validGroups };

/**
 * Get all teams.
 */
export async function getTeams(): Promise<Team[]> {
  return allTeams;
}

/**
 * Get teams filtered by type (club | national).
 */
export async function getTeamsByType(type: TeamType): Promise<Team[]> {
  return allTeams.filter((t) => t.type === type);
}

/**
 * Get teams filtered by league ID.
 */
export async function getTeamsByLeagueId(leagueId: string): Promise<Team[]> {
  return allTeams.filter((t) => t.leagueId === leagueId);
}

/**
 * Get teams participating in a tournament (national teams by group).
 */
export async function getTeamsByTournamentId(tournamentId: string): Promise<Team[]> {
  // For now, return all national teams for World Cup 2026
  if (tournamentId === "fifa-world-cup-2026") {
    return allTeams.filter((t) => t.type === "national");
  }
  return [];
}
