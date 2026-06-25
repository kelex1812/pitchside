// src/data/leagues.ts — League data seeding (Epic 3)

import type { League, Match } from "@/data/types";
import { allTeams } from "./teams";
import { computeStandings } from "@/lib/standings";

// --- Match helper ---
function makeMatch(
  homeId: string,
  awayId: string,
  homeName: string,
  awayName: string,
  date: string,
  homeScore: number,
  awayScore: number,
  matchday: number,
  leagueId: string
): Match {
  return {
    id: `match-${leagueId}-${homeId}-${awayId}-${matchday}`,
    homeTeamId: homeId,
    awayTeamId: awayId,
    homeTeam: homeName,
    awayTeam: awayName,
    homeScore,
    awayScore,
    date,
    status: "completed",
    matchday,
    leagueId,
  };
}

// Build match data for a league given team pairs and results
function buildLeagueMatches(
  teams: { id: string; name: string }[],
  leagueId: string,
  // Each entry: [homeScore, awayScore] for each match
  results: number[][]
): Match[] {
  const matches: Match[] = [];
  for (let i = 0; i < results.length; i++) {
    const [homeScore, awayScore] = results[i];
    const homeIdx = i % teams.length;
    const awayIdx = (i + 1) % teams.length;
    if (homeIdx === awayIdx) continue;
    const matchday = Math.floor(i / Math.ceil(teams.length / 2)) + 1;
    const date = `2026-${String(Math.min(matchday, 12)).padStart(2, "0")}-15T20:00:00Z`;
    matches.push(
      makeMatch(
        teams[homeIdx].id,
        teams[awayIdx].id,
        teams[homeIdx].name,
        teams[awayIdx].name,
        date,
        homeScore,
        awayScore,
        matchday,
        leagueId
      )
    );
  }
  return matches;
}

// Compute standings from matches for a league
function computeLeagueStandings(league: League): League {
  const matches = league.matches!;
  if (matches.length > 0) {
    const teamIds = new Set<string>();
    for (const m of matches) {
      teamIds.add(m.homeTeamId);
      teamIds.add(m.awayTeamId);
    }
    const relatedTeams = allTeams.filter((t) => teamIds.has(t.id));
    league.standings = computeStandings(matches, relatedTeams);
  }
  return league;
}

// --- Team lookups by league ---
const laLigaTeams = allTeams.filter((t) => t.type === "club" && t.league === "la-liga");
const plTeams = allTeams.filter((t) => t.type === "club" && t.league === "premier-league");
const serieATeams = allTeams.filter((t) => t.type === "club" && t.league === "serie-a");
const bundesligaTeams = allTeams.filter((t) => t.type === "club" && t.league === "bundesliga");
const ligue1Teams = allTeams.filter((t) => t.type === "club" && t.league === "ligue-1");
const mlsTeams = allTeams.filter((t) => t.type === "club" && t.league === "mls");
const uslTeams = allTeams.filter((t) => t.type === "club" && t.league === "usl-l1");

// Build match results for each league (flat list of [homeScore, awayScore])
// We create enough matches so all teams get ~32 games played
function buildRoundRobinResults(teamCount: number): number[][] {
  const results: number[][] = [];
  // Create ~2 rounds of matches for each pair
  for (let round = 0; round < 2; round++) {
    for (let i = 0; i < teamCount; i++) {
      for (let j = i + 1; j < teamCount; j++) {
        // Generate scores that produce reasonable standings
        const h = Math.floor(Math.random() * 4);
        const a = Math.floor(Math.random() * 3);
        results.push([h, a]);
      }
    }
  }
  return results;
}

// La Liga: top 4 teams with specific match data
const laLigaTopTeams = [
  { id: "fc-barcelona", name: "FC Barcelona" },
  { id: "real-madrid", name: "Real Madrid" },
  { id: "atletico-madrid", name: "Atletico Madrid" },
  { id: "athletic-bilbao", name: "Athletic Bilbao" },
  { id: "villarreal", name: "Villarreal" },
  { id: "real-sociedad", name: "Real Sociedad" },
  { id: "real-betis", name: "Real Betis" },
  { id: "sevilla", name: "Sevilla" },
];

const laLigaResults: number[][] = [
  [3, 1], [2, 0], [1, 0], [2, 1], [3, 0], [2, 0], [1, 0], [2, 1], // MD1 round 1
  [1, 2], [0, 2], [0, 1], [1, 2], [0, 3], [0, 1], [1, 2], [0, 2], // MD2
  [2, 1], [1, 0], [1, 0], [2, 0], [1, 1], [2, 0], [0, 1], [1, 1], // MD3
  [0, 1], [1, 2], [1, 0], [0, 2], [2, 0], [0, 0], [1, 0], [1, 1], // MD4
  [1, 2], [0, 2], [0, 1], [2, 0], [1, 1], [1, 2], [0, 1], [0, 1], // MD5
  [3, 0], [2, 1], [1, 0], [2, 0], [1, 1], [1, 0], [1, 1], [2, 0], // MD6
  [2, 0], [1, 0], [0, 1], [1, 2], [1, 1], [1, 0], [0, 1], [1, 0], // MD7
  [2, 1], [0, 1], [1, 1], [2, 0], [1, 1], [1, 2], [1, 1], [0, 1], // MD8
  [2, 0], [1, 0], [1, 1], [2, 1], [1, 0], [1, 2], [1, 0], [0, 1], // MD9
  [3, 0], [1, 0], [1, 1], [2, 0], [1, 1], [1, 0], [0, 1], [1, 0], // MD10
  [2, 0], [1, 1], [1, 0], [2, 0], [1, 1], [2, 0], [0, 1], [1, 0], // MD11
  [2, 0], [1, 0], [1, 1], [1, 0], [0, 0], [1, 0], [1, 1], [1, 0], // MD12
];

// Build all leagues with round-robin match data
const plResults = buildRoundRobinResults(plTeams.length);
const serieAResults = buildRoundRobinResults(serieATeams.length);
const bundesligaResults = buildRoundRobinResults(bundesligaTeams.length);
const ligue1Results = buildRoundRobinResults(ligue1Teams.length);
const mlsResults = buildRoundRobinResults(mlsTeams.length);
const uslResults = buildRoundRobinResults(uslTeams.length);

export const leagues: League[] = [
  {
    id: "la-liga",
    name: "La Liga",
    slug: "la-liga",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/La_Liga_logo_2023.svg/800px-La_Liga_logo_2023.svg.png",
    country: "Spain",
    type: "club",
    teams: laLigaTeams,
    matches: buildLeagueMatches(laLigaTopTeams, "la-liga", laLigaResults),
    standings: [],
  },
  {
    id: "premier-league",
    name: "Premier League",
    slug: "premier-league",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fm/Premier_Logo.svg/800px-Premier_Logo.svg.png",
    country: "England",
    type: "club",
    teams: plTeams,
    matches: buildLeagueMatches(plTeams, "premier-league", plResults),
    standings: [],
  },
  {
    id: "serie-a",
    name: "Serie A",
    slug: "serie-a",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Serie_A_logo.svg/800px-Serie_A_logo.svg.png",
    country: "Italy",
    type: "club",
    teams: serieATeams,
    matches: buildLeagueMatches(serieATeams, "serie-a", serieAResults),
    standings: [],
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    slug: "bundesliga",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Bundesliga_logo.svg/800px-Bundesliga_logo.svg.png",
    country: "Germany",
    type: "club",
    teams: bundesligaTeams,
    matches: buildLeagueMatches(bundesligaTeams, "bundesliga", bundesligaResults),
    standings: [],
  },
  {
    id: "ligue-1",
    name: "Ligue 1",
    slug: "ligue-1",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ligue_1_Logo_2018.svg/800px-Ligue_1_Logo_2018.svg.png",
    country: "France",
    type: "club",
    teams: ligue1Teams,
    matches: buildLeagueMatches(ligue1Teams, "ligue-1", ligue1Results),
    standings: [],
  },
  {
    id: "mls",
    name: "Major League Soccer",
    slug: "mls",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Major_League_Soccer_logo.svg/800px-Major_League_Soccer_logo.svg.png",
    country: "USA/Canada",
    type: "club",
    teams: mlsTeams,
    matches: buildLeagueMatches(mlsTeams, "mls", mlsResults),
    standings: [],
  },
  {
    id: "usl-l1",
    name: "USL League One",
    slug: "usl-l1",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/USL_League_One_Logo.png/800px-USL_League_One_Logo.png",
    country: "USA",
    type: "club",
    teams: uslTeams,
    matches: buildLeagueMatches(uslTeams, "usl-l1", uslResults),
    standings: [],
  },
];

// Post-process: compute standings from matches for each league
for (const league of leagues) {
  computeLeagueStandings(league);
}

export function getLeagueBySlug(slug: string): League | undefined {
  return leagues.find((l) => l.slug === slug);
}

export function searchLeagues(query: string): League[] {
  const q = query.toLowerCase();
  if (!q) return [];
  return leagues.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q)
  );
}
