// src/lib/matches.ts — Match filtering and aggregation utilities

import type { PartialMatch, Match } from "@/data/types";
import { getWeekRange } from "./time";

/**
 * Get matches for this week (Monday to Sunday calendar week).
 * Aggregates from ALL competition types (World Cup, leagues, friendlies, etc).
 * Sorted by kickoff time ascending.
 */
export function getMatchesThisWeek(allMatches: PartialMatch[], currentDay: Date = new Date()): PartialMatch[] {
  const { start, end } = getWeekRange(currentDay);
  const seen = new Set<string>();
  const matchesThisWeek = allMatches
    .filter((m) => {
      const date = m.kickoff ?? m.date ?? "";
      const matchDate = new Date(date);
      return !isNaN(matchDate.getTime()) && matchDate >= start && matchDate <= end;
    });
  return matchesThisWeek
    .reduce((acc, m) => {
      const key = m.id ?? `${m.homeTeamName}-${m.awayTeamName}-${m.kickoff ?? m.date ?? ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        acc.push(m);
      }
      return acc;
    }, [] as PartialMatch[])
    .sort((a, b) => {
      const dateA = new Date(a.kickoff ?? a.date ?? "");
      const dateB = new Date(b.kickoff ?? b.date ?? "");
      return dateA.getTime() - dateB.getTime();
    });
}

/**
 * Get completed matches (sorted by date, most recent first).
 */
export function getCompletedMatches(matches: Match[]): Match[] {
  return matches
    .filter((m) => m.status === "completed")
    .sort((a, b) => {
      const dateB = new Date(b.kickoff ?? b.date);
      const dateA = new Date(a.kickoff ?? a.date);
      return dateB.getTime() - dateA.getTime();
    });
}

/**
 * Get upcoming matches (sorted by kickoff time ascending).
 */
export function getUpcomingMatches(matches: Match[], limit?: number): Match[] {
  const upcoming = matches.filter((m) => m.status === "upcoming" || m.status === "live");
  upcoming.sort((a, b) => {
    const dateA = new Date(a.kickoff ?? a.date);
    const dateB = new Date(b.kickoff ?? b.date);
    return dateA.getTime() - dateB.getTime();
  });
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Get matches for a specific team (home or away).
 */
export function getMatchesForTeam(matches: Match[], teamId: string): Match[] {
  return matches.filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId);
}

/**
 * Get recent matches for a team (completed, most recent first).
 */
export function getRecentMatches(matches: Match[], teamId: string, limit: number = 5): Match[] {
  const teamMatches = getMatchesForTeam(matches, teamId);
  return getCompletedMatches(teamMatches).slice(0, limit);
}

/**
 * Get matches for a specific league.
 */
export function getMatchesForLeague(matches: Match[], leagueId: string): Match[] {
  return matches.filter((m) => m.leagueId === leagueId);
}

/**
 * Get matches for a specific tournament stage.
 */
export function getMatchesForTournament(matches: Match[], tournamentStageId: string): Match[] {
  return matches.filter((m) => m.tournamentStageId === tournamentStageId);
}

/**
 * Get matches for a specific competition type.
 */
export function getMatchesByCompetition(matches: Match[], competitionType: string): Match[] {
  return matches.filter((m) => m.competitionType === competitionType);
}
