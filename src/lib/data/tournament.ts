// src/lib/data/tournament.ts — Tournament repository layer
// All functions are async for future API swap compatibility.
// Current implementation reads from static data files.

import type { Tournament, TournamentCategory, KnockoutBracket } from "@/data/types";
import { allTeams } from "@/data/teams";
import { computeKnockoutResults } from "@/lib/standings";

// Seed a single World Cup 2026 tournament with knockout bracket data
const worldCupKnockoutMatches: KnockoutBracket = [
  // Round of 32
  {
    id: "R32-1",
    stage: "Round of 32",
    roundOrder: 1,
    homeTeam: "Team A1",
    awayTeam: "Team B2",
    homeScore: null,
    awayScore: null,
    date: "2026-06-30T16:00:00Z",
    venue: "MetLife Stadium",
    winner: null,
    nextMatchId: "R16-1",
    defeatedTeam: null,
  },
  {
    id: "R32-2",
    stage: "Round of 32",
    roundOrder: 1,
    homeTeam: "Team C1",
    awayTeam: "Team D2",
    homeScore: null,
    awayScore: null,
    date: "2026-06-30T20:00:00Z",
    venue: "Arrowhead Stadium",
    winner: null,
    nextMatchId: "R16-1",
    defeatedTeam: null,
  },
  {
    id: "R32-3",
    stage: "Round of 32",
    roundOrder: 1,
    homeTeam: "Team E1",
    awayTeam: "Team F2",
    homeScore: null,
    awayScore: null,
    date: "2026-07-01T16:00:00Z",
    venue: "SoFi Stadium",
    winner: null,
    nextMatchId: "R16-2",
    defeatedTeam: null,
  },
  {
    id: "R32-4",
    stage: "Round of 32",
    roundOrder: 1,
    homeTeam: "Team G1",
    awayTeam: "Team H2",
    homeScore: null,
    awayScore: null,
    date: "2026-07-01T20:00:00Z",
    venue: "AT&T Stadium",
    winner: null,
    nextMatchId: "R16-2",
    defeatedTeam: null,
  },
  // Round of 16
  {
    id: "R16-1",
    stage: "Round of 16",
    roundOrder: 2,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-04T16:00:00Z",
    venue: "MetLife Stadium",
    winner: null,
    nextMatchId: "QF-1",
    defeatedTeam: null,
  },
  {
    id: "R16-2",
    stage: "Round of 16",
    roundOrder: 2,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-04T20:00:00Z",
    venue: "SoFi Stadium",
    winner: null,
    nextMatchId: "QF-1",
    defeatedTeam: null,
  },
  {
    id: "R16-3",
    stage: "Round of 16",
    roundOrder: 2,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-05T16:00:00Z",
    venue: "AT&T Stadium",
    winner: null,
    nextMatchId: "QF-2",
    defeatedTeam: null,
  },
  {
    id: "R16-4",
    stage: "Round of 16",
    roundOrder: 2,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-05T20:00:00Z",
    venue: "Arrowhead Stadium",
    winner: null,
    nextMatchId: "QF-2",
    defeatedTeam: null,
  },
  // Quarter-finals
  {
    id: "QF-1",
    stage: "Quarter-finals",
    roundOrder: 3,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-10T16:00:00Z",
    venue: "MetLife Stadium",
    winner: null,
    nextMatchId: "SF-1",
    defeatedTeam: null,
  },
  {
    id: "QF-2",
    stage: "Quarter-finals",
    roundOrder: 3,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-10T20:00:00Z",
    venue: "SoFi Stadium",
    winner: null,
    nextMatchId: "SF-1",
    defeatedTeam: null,
  },
  {
    id: "QF-3",
    stage: "Quarter-finals",
    roundOrder: 3,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-11T16:00:00Z",
    venue: "AT&T Stadium",
    winner: null,
    nextMatchId: "SF-2",
    defeatedTeam: null,
  },
  {
    id: "QF-4",
    stage: "Quarter-finals",
    roundOrder: 3,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-11T20:00:00Z",
    venue: "Arrowhead Stadium",
    winner: null,
    nextMatchId: "SF-2",
    defeatedTeam: null,
  },
  // Semi-finals
  {
    id: "SF-1",
    stage: "Semi-finals",
    roundOrder: 4,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-14T20:00:00Z",
    venue: "MetLife Stadium",
    winner: null,
    nextMatchId: "FINAL",
    defeatedTeam: null,
  },
  {
    id: "SF-2",
    stage: "Semi-finals",
    roundOrder: 4,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-15T20:00:00Z",
    venue: "SoFi Stadium",
    winner: null,
    nextMatchId: "FINAL",
    defeatedTeam: null,
  },
  // Final
  {
    id: "FINAL",
    stage: "Final",
    roundOrder: 5,
    homeTeam: "TBD",
    awayTeam: "TBD",
    homeScore: null,
    awayScore: null,
    date: "2026-07-19T20:00:00Z",
    venue: "MetLife Stadium",
    winner: null,
    nextMatchId: null,
    defeatedTeam: null,
  },
];

// Build the World Cup 2026 tournament object
function buildWorldCup2026(): Tournament {
  const nationalTeams = allTeams.filter((t) => t.type === "national");
  const wcMatches = (allTeams
    .flatMap((t) => t.schedule || [])
    .filter((m) => m.competitionType === "fifa-world-cup-2026") as unknown as import("@/data/types").Match[]);

  return {
    id: "fifa-world-cup-2026",
    name: "FIFA World Cup 2026",
    slug: "fifa-world-cup-2026",
    category: "world-cup",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f8/FIFA_World_Cup_logo.svg",
    hostCountries: ["USA", "Canada", "Mexico"],
    seasonStart: new Date("2026-06-14"),
    seasonEnd: new Date("2026-07-19"),
    status: "ongoing",
    stages: [
      {
        id: "wc-group",
        name: "Group Stage",
        stageOrder: 1,
        startDate: new Date("2026-06-14"),
        endDate: new Date("2026-07-10"),
        matchCount: 48 * 3,
        description: "48 teams in 12 groups of 4, top 2 from each group advance",
        isKnockout: false,
      },
      {
        id: "wc-knockout",
        name: "Knockout Stage",
        stageOrder: 2,
        startDate: new Date("2026-06-30"),
        endDate: new Date("2026-07-19"),
        matchCount: 32,
        description: "Single-elimination bracket with Round of 32 through Final",
        isKnockout: true,
      },
    ],
    groupStandings: [],
    teams: nationalTeams,
    matches: wcMatches,
    knockoutResults: worldCupKnockoutMatches,
  };
}

const seededTournaments: Tournament[] = [buildWorldCup2026()];

/**
 * Get all tournaments.
 */
export async function getAllTournaments(): Promise<Tournament[]> {
  return seededTournaments;
}

/**
 * Get a tournament by its slug.
 */
export async function getTournamentBySlug(slug: string): Promise<Tournament | null> {
  return seededTournaments.find((t) => t.slug === slug) || null;
}

/**
 * Get tournaments filtered by category.
 */
export async function getTournamentsByCategory(category: TournamentCategory): Promise<Tournament[]> {
  return seededTournaments.filter((t) => t.category === category);
}

/**
 * Search tournaments by name or host countries.
 */
export async function searchTournaments(query: string): Promise<Tournament[]> {
  const q = query.toLowerCase();
  if (!q) return [];
  return seededTournaments.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.hostCountries?.some((c) => c.toLowerCase().includes(q))
  );
}

/**
 * Get knockout bracket with computed winners.
 */
export async function getKnockoutBracket(tournamentId: string): Promise<KnockoutBracket | null> {
  const tournament = seededTournaments.find((t) => t.id === tournamentId);
  if (!tournament?.knockoutResults) return null;
  return computeKnockoutResults(tournament.knockoutResults);
}
