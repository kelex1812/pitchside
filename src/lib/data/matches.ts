// src/lib/data/matches.ts — Match repository layer
// All functions are async for future API swap compatibility.
// Current implementation reads from static data files (src/data/teams.ts).

import type { Match, PartialMatch } from "@/data/types";
import { allTeams } from "@/data/teams";
import { getMatchesThisWeek, getCompletedMatches, getUpcomingMatches } from "@/lib/matches";

/**
 * Get all matches from all teams' schedules.
 */
export async function getAllMatches(): Promise<Match[]> {
  const matches: Match[] = [];
  for (const team of allTeams) {
    if (team.schedule) {
      for (const match of team.schedule) {
        matches.push(match as unknown as Match);
      }
    }
  }
  return matches;
}

/**
 * Get matches for this week using the aggregation utility.
 */
export async function getMatchesThisWeekRepo(currentDay?: Date): Promise<Match[]> {
  const all = await getAllMatches();
  return getMatchesThisWeek(all as unknown as PartialMatch[], currentDay) as unknown as Match[];
}

/**
 * Get completed matches across all teams.
 */
export async function getCompletedMatchesRepo(): Promise<Match[]> {
  const all = await getAllMatches();
  return getCompletedMatches(all);
}

/**
 * Get upcoming matches across all teams.
 */
export async function getUpcomingMatchesRepo(limit?: number): Promise<Match[]> {
  const all = await getAllMatches();
  return getUpcomingMatches(all, limit);
}

/**
 * Get matches for a specific team.
 */
export async function getMatchesForTeam(teamId: string): Promise<Match[]> {
  const all = await getAllMatches();
  return all.filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId);
}

/**
 * Get matches for a specific league.
 */
export async function getMatchesForLeague(leagueId: string): Promise<Match[]> {
  const all = await getAllMatches();
  return all.filter((m) => m.leagueId === leagueId);
}

/**
 * Get matches for a specific tournament stage.
 */
export async function getMatchesForTournament(tournamentStageId: string): Promise<Match[]> {
  const all = await getAllMatches();
  return all.filter((m) => m.tournamentStageId === tournamentStageId);
}

/**
 * Get a single match by ID.
 */
export async function getMatchById(matchId: string): Promise<Match | null> {
  const matches = await getAllMatches();
  return matches.find((m) => m.id === matchId) || null;
}
