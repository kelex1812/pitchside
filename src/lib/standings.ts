// src/lib/standings.ts — Standings & knockout computation utilities
// Used by Epic 2 (World Cup groups), Epic 3 (league standings), Epic 4 (tournament groups)

import type { Match, Standing, KnockoutMatch, KnockoutBracket, Team } from "@/data/types";

interface StandingRow {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

/**
 * Compute standings from completed matches and teams.
 * Sorting: (1) Points desc, (2) GD desc, (3) GF desc.
 * Only processes matches with status === "completed" and has both scores.
 */
export function computeStandings(matches: Match[], teams: Team[]): Standing[] {
  const rowMap = new Map<string, StandingRow>();

  // Initialize all teams
  for (const team of teams) {
    rowMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }

  // Process completed matches
  for (const match of matches) {
    if (match.status !== "completed" || match.homeScore === null || match.awayScore === null) continue;
    if (!match.homeTeamId || !match.awayTeamId) continue;

    const home = rowMap.get(match.homeTeamId);
    const away = rowMap.get(match.awayTeamId);
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (match.homeScore < match.awayScore) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      home.points += 1;
      away.drawn++;
      away.points += 1;
    }
  }

  // Calculate goal differences
  for (const row of rowMap.values()) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  }

  // Convert to array and sort: Points desc → GD desc → GF desc
  const result = Array.from(rowMap.values());
  result.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0;
  });

  // Map to Standing[] with position
  return result.map(
    (s, i): Standing => ({
      position: i + 1,
      team: s.teamName,
      played: s.played,
      won: s.won,
      drawn: s.drawn,
      lost: s.lost,
      goalsFor: s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      goalDifference: s.goalDifference,
      points: s.points,
    })
  );
}

/**
 * Compute knockout bracket results.
 * Takes a flat KnockoutMatch[] array, determines winners from scores,
 * propagates winners to next round via nextMatchId linking.
 */
export function computeKnockoutResults(bracket: KnockoutMatch[]): KnockoutBracket {
  const result = bracket.map((m) => ({ ...m }));

  // First pass: determine winners from homeScore/awayScore
  for (const match of result) {
    if (match.homeScore === null && match.awayScore === null) continue;
    if (match.homeScore === null || match.awayScore === null) continue;

    let winner: string | null = null;
    if (match.homeScore > match.awayScore) {
      winner = match.homeTeam;
    } else if (match.awayScore > match.homeScore) {
      winner = match.awayTeam;
    }

    match.winner = winner;
  }

  // Second pass: propagate winners to next round via nextMatchId
  for (const match of result) {
    if (!match.nextMatchId || !match.winner) continue;

    const nextMatch = result.find((m) => m.id === match.nextMatchId);
    if (nextMatch) {
      if (nextMatch.homeTeam === null || nextMatch.homeTeam === "TBD") {
        nextMatch.homeTeam = match.winner;
      } else if (nextMatch.awayTeam === null || nextMatch.awayTeam === "TBD") {
        nextMatch.awayTeam = match.winner;
      }
    }
  }

  return result;
}
