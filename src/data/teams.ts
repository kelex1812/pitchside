// src/data/teams.ts — Team data seeding (Epic 3 + 4)

import type {
  Team,
  Match,
  ContentItem,
  PartialMatch,
  Standing,
} from "./types";

// ============================================================================
// Club Teams — La Liga
// ============================================================================

export const barcelona: Team = {
  id: "barcelona",
  name: "FC Barcelona",
  shortName: "Barca",
  slug: "barcelona",
  type: "club",
  league: "la-liga",
  leagueName: "La Liga",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png",
  primaryColor: "#A50044",
  secondaryColor: "#004D98",
  nextMatch: {
    id: "barca-next-1",
    date: "2026-06-20T20:00:00Z",
    kickoff: "2026-06-20T20:00:00Z",
    homeTeamId: "barcelona",
    awayTeamId: "real-madrid",
    homeTeamName: "FC Barcelona",
    awayTeamName: "Real Madrid",
    homeScore: null,
    awayScore: null,
    opponent: "Real Madrid",
    venue: "Estadi Olimpic Lluis Companys, Barcelona",
    isHome: true,
    status: "upcoming",
    competition: "La Liga",
    competitionType: "la-liga",
    matchday: 33,
  },
  recentResults: [
    {
      id: "barca-rc-1",
      date: "2026-06-14T19:00:00Z",
      kickoff: "2026-06-14T19:00:00Z",
      homeTeamId: "barcelona",
      awayTeamId: "sevilla",
      homeTeamName: "FC Barcelona",
      awayTeamName: "Sevilla",
      homeScore: 3,
      awayScore: 1,
      opponent: "Sevilla",
      venue: "Estadi Olimpic Lluis Companys, Barcelona",
      isHome: true,
      status: "completed",
      competition: "La Liga",
      competitionType: "la-liga",
      matchday: 32,
    },
    {
      id: "barca-rc-2",
      date: "2026-06-08T20:00:00Z",
      kickoff: "2026-06-08T20:00:00Z",
      homeTeamId: "atletico-madrid",
      awayTeamId: "barcelona",
      homeTeamName: "Atletico Madrid",
      awayTeamName: "FC Barcelona",
      homeScore: 1,
      awayScore: 2,
      opponent: "Atletico Madrid",
      venue: "Metropolitano, Madrid",
      isHome: false,
      status: "completed",
      competition: "La Liga",
      competitionType: "la-liga",
      matchday: 31,
    },
    {
      id: "barca-rc-3",
      date: "2026-06-01T21:00:00Z",
      kickoff: "2026-06-01T21:00:00Z",
      homeTeamId: "barcelona",
      awayTeamId: "valencia",
      homeTeamName: "FC Barcelona",
      awayTeamName: "Valencia",
      homeScore: 2,
      awayScore: 0,
      opponent: "Valencia",
      venue: "Estadi Olimpic Lluis Companys, Barcelona",
      isHome: true,
      status: "completed",
      competition: "La Liga",
      competitionType: "la-liga",
      matchday: 30,
    },
  ],
  schedule: [
    {
      id: "barca-s-1",
      date: "2026-06-20T20:00:00Z",
      kickoff: "2026-06-20T20:00:00Z",
      homeTeamId: "barcelona",
      awayTeamId: "real-madrid",
      homeTeamName: "FC Barcelona",
      awayTeamName: "Real Madrid",
      homeScore: null,
      awayScore: null,
      opponent: "Real Madrid",
      venue: "Estadi Olimpic Lluis Companys, Barcelona",
      isHome: true,
      status: "upcoming",
      competition: "La Liga",
      competitionType: "la-liga",
      matchday: 33,
    },
    {
      id: "barca-s-2",
      date: "2026-06-27T18:30:00Z",
      kickoff: "2026-06-27T18:30:00Z",
      homeTeamId: "real-sociedad",
      awayTeamId: "barcelona",
      homeTeamName: "Real Sociedad",
      awayTeamName: "FC Barcelona",
      homeScore: null,
      awayScore: null,
      opponent: "Real Sociedad",
      venue: "Reale Arena, San Sebastian",
      isHome: false,
      status: "upcoming",
      competition: "La Liga",
      competitionType: "la-liga",
      matchday: 34,
    },
  ],
  standings: [
    { position: 1, team: "FC Barcelona", played: 32, won: 24, drawn: 5, lost: 3, goalsFor: 72, goalsAgainst: 24, goalDifference: 48, points: 77 },
    { position: 2, team: "Real Madrid", played: 32, won: 23, drawn: 6, lost: 3, goalsFor: 68, goalsAgainst: 22, goalDifference: 46, points: 75 },
    { position: 3, team: "Atletico Madrid", played: 32, won: 20, drawn: 7, lost: 5, goalsFor: 55, goalsAgainst: 28, goalDifference: 27, points: 67 },
    { position: 4, team: "Athletic Bilbao", played: 32, won: 17, drawn: 8, lost: 7, goalsFor: 48, goalsAgainst: 30, goalDifference: 18, points: 59 },
    { position: 5, team: "Villarreal", played: 32, won: 16, drawn: 6, lost: 10, goalsFor: 52, goalsAgainst: 40, goalDifference: 12, points: 54 },
    { position: 6, team: "Real Sociedad", played: 32, won: 15, drawn: 7, lost: 10, goalsFor: 42, goalsAgainst: 35, goalDifference: 7, points: 52 },
    { position: 7, team: "Real Betis", played: 32, won: 14, drawn: 8, lost: 10, goalsFor: 40, goalsAgainst: 38, goalDifference: 2, points: 50 },
    { position: 8, team: "Sevilla", played: 32, won: 13, drawn: 6, lost: 13, goalsFor: 38, goalsAgainst: 42, goalDifference: -4, points: 45 },
  ],
  news: [
    { title: "Barcelona demolish Sevilla 3-1 in thrilling Clasico prep match", source: "FC Barcelona Official", url: "https://www.fcbarcelona.com", publishedAt: "2026-06-14" },
    { title: "Barcelona secure 2-0 win over Valencia at home", source: "La Liga", url: "https://www.laliga.com", publishedAt: "2026-06-01" },
    { title: "Barcelona clinch La Liga title race with dominant season", source: "ESPN", url: "https://www.espn.com", publishedAt: "2026-05-25" },
  ],
};

export const realMadrid: Team = {
  id: "real-madrid",
  name: "Real Madrid",
  shortName: "Real",
  slug: "real-madrid",
  type: "club",
  league: "la-liga",
  leagueName: "La Liga",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
  primaryColor: "#FFFFFF",
  secondaryColor: "#00529F",
  nextMatch: {
    date: "2026-06-23T21:00:00Z",
    opponent: "Barcelona",
    venue: "Santiago Bernabeu, Madrid",
    isHome: true,
    status: "upcoming",
  },
  recentResults: [
    { date: "2026-06-13T20:00:00Z", opponent: "Real Sociedad", score: { home: 2, away: 1 }, status: "completed" },
    { date: "2026-06-06T21:00:00Z", opponent: "Athletic Bilbao", score: { home: 1, away: 1 }, status: "completed" },
    { date: "2026-05-30T19:00:00Z", opponent: "Villarreal", score: { home: 3, away: 0 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-23T21:00:00Z", opponent: "Barcelona", venue: "Santiago Bernabeu, Madrid", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "FC Barcelona", played: 32, won: 24, drawn: 5, lost: 3, goalsFor: 72, goalsAgainst: 24, goalDifference: 48, points: 77 },
    { position: 2, team: "Real Madrid", played: 32, won: 23, drawn: 6, lost: 3, goalsFor: 68, goalsAgainst: 22, goalDifference: 46, points: 75 },
    { position: 3, team: "Atletico Madrid", played: 32, won: 20, drawn: 7, lost: 5, goalsFor: 55, goalsAgainst: 28, goalDifference: 27, points: 67 },
    { position: 4, team: "Athletic Bilbao", played: 32, won: 17, drawn: 8, lost: 7, goalsFor: 48, goalsAgainst: 30, goalDifference: 18, points: 59 },
    { position: 5, team: "Villarreal", played: 32, won: 16, drawn: 6, lost: 10, goalsFor: 52, goalsAgainst: 40, goalDifference: 12, points: 54 },
    { position: 6, team: "Real Sociedad", played: 32, won: 15, drawn: 7, lost: 10, goalsFor: 42, goalsAgainst: 35, goalDifference: 7, points: 52 },
    { position: 7, team: "Real Betis", played: 32, won: 14, drawn: 8, lost: 10, goalsFor: 40, goalsAgainst: 38, goalDifference: 2, points: 50 },
    { position: 8, team: "Sevilla", played: 32, won: 13, drawn: 6, lost: 13, goalsFor: 38, goalsAgainst: 42, goalDifference: -4, points: 45 },
  ],
  news: [
    { title: "Real Madrid edge Real Sociedad 2-1 in tight encounter", source: "Real Madrid CF", url: "https://www.realmadrid.com", publishedAt: "2026-06-13" },
    { title: "Real Madrid stroll past Villarreal 3-0 at home", source: "La Liga", url: "https://www.laliga.com", publishedAt: "2026-05-30" },
  ],
};

export const atleticoMadrid: Team = {
  id: "atletico-madrid",
  name: "Atletico Madrid",
  shortName: "Atleti",
  slug: "atletico-madrid",
  type: "club",
  league: "la-liga",
  leagueName: "La Liga",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atletico_Madrid_B ausschreibung 2017.svg/1200px-Atletico_Madrid_B ausschreibung 2017.svg.png",
  primaryColor: "#CE2B37",
  secondaryColor: "#FFFFFF",
  nextMatch: { date: "2026-06-25T19:00:00Z", opponent: "Sevilla", venue: "Metropolitano, Madrid", isHome: true, status: "upcoming" },
  recentResults: [
    { date: "2026-06-12T19:00:00Z", opponent: "Barcelona", score: { home: 1, away: 2 }, status: "completed" },
    { date: "2026-06-05T18:00:00Z", opponent: "Real Betis", score: { home: 2, away: 0 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-25T19:00:00Z", opponent: "Sevilla", venue: "Metropolitano, Madrid", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "FC Barcelona", played: 32, won: 24, drawn: 5, lost: 3, goalsFor: 72, goalsAgainst: 24, goalDifference: 48, points: 77 },
    { position: 2, team: "Real Madrid", played: 32, won: 23, drawn: 6, lost: 3, goalsFor: 68, goalsAgainst: 22, goalDifference: 46, points: 75 },
    { position: 3, team: "Atletico Madrid", played: 32, won: 20, drawn: 7, lost: 5, goalsFor: 55, goalsAgainst: 28, goalDifference: 27, points: 67 },
    { position: 4, team: "Athletic Bilbao", played: 32, won: 17, drawn: 8, lost: 7, goalsFor: 48, goalsAgainst: 30, goalDifference: 18, points: 59 },
    { position: 5, team: "Villarreal", played: 32, won: 16, drawn: 6, lost: 10, goalsFor: 52, goalsAgainst: 40, goalDifference: 12, points: 54 },
    { position: 6, team: "Real Sociedad", played: 32, won: 15, drawn: 7, lost: 10, goalsFor: 42, goalsAgainst: 35, goalDifference: 7, points: 52 },
    { position: 7, team: "Real Betis", played: 32, won: 14, drawn: 8, lost: 10, goalsFor: 40, goalsAgainst: 38, goalDifference: 2, points: 50 },
    { position: 8, team: "Sevilla", played: 32, won: 13, drawn: 6, lost: 13, goalsFor: 38, goalsAgainst: 42, goalDifference: -4, points: 45 },
  ],
  news: [
    { title: "Atletico edge Real Betis 2-0 at home", source: "Atletico Madrid CF", url: "https://www.atleticodemadrid.com", publishedAt: "2026-06-05" },
  ],
};

// ============================================================================
// Club Teams — Premier League
// ============================================================================

export const liverpool: Team = {
  id: "liverpool",
  name: "Liverpool FC",
  shortName: "Liverpool",
  slug: "liverpool",
  type: "club",
  league: "premier-league",
  leagueName: "Premier League",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png",
  primaryColor: "#C8102E",
  secondaryColor: "#00B2A9",
  nextMatch: { date: "2026-06-20T19:30:00Z", opponent: "Arsenal", venue: "Anfield, Liverpool", isHome: true, status: "upcoming" },
  recentResults: [
    { date: "2026-06-14T16:00:00Z", opponent: "Manchester City", score: { home: 2, away: 1 }, status: "completed" },
    { date: "2026-06-07T14:00:00Z", opponent: "Chelsea", score: { home: 1, away: 1 }, status: "completed" },
    { date: "2026-05-31T15:00:00Z", opponent: "Tottenham", score: { home: 3, away: 0 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-20T19:30:00Z", opponent: "Arsenal", venue: "Anfield, Liverpool", isHome: true, status: "upcoming" },
    { date: "2026-06-27T17:00:00Z", opponent: "Chelsea", venue: "Stamford Bridge, London", isHome: false, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Liverpool", played: 30, won: 22, drawn: 6, lost: 2, goalsFor: 65, goalsAgainst: 22, goalDifference: 43, points: 72 },
    { position: 2, team: "Arsenal", played: 30, won: 20, drawn: 7, lost: 3, goalsFor: 60, goalsAgainst: 25, goalDifference: 35, points: 67 },
    { position: 3, team: "Manchester City", played: 30, won: 19, drawn: 6, lost: 5, goalsFor: 58, goalsAgainst: 30, goalDifference: 28, points: 63 },
    { position: 4, team: "Chelsea", played: 30, won: 16, drawn: 7, lost: 7, goalsFor: 50, goalsAgainst: 35, goalDifference: 15, points: 55 },
  ],
  news: [
    { title: "Liverpool beat Man City 2-1 in title decider", source: "Liverpool FC", url: "https://www.liverpoolfc.com", publishedAt: "2026-06-14" },
    { title: "Liverpool cruise past Tottenham 3-0", source: "Sky Sports", url: "https://www.skysports.com", publishedAt: "2026-05-31" },
  ],
};

export const arsenal: Team = {
  id: "arsenal",
  name: "Arsenal FC",
  shortName: "Arsenal",
  slug: "arsenal",
  type: "club",
  league: "premier-league",
  leagueName: "Premier League",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png",
  primaryColor: "#EF0107",
  secondaryColor: "#FFFFFF",
  nextMatch: { date: "2026-06-20T19:30:00Z", opponent: "Liverpool", venue: "Emirates Stadium, London", isHome: false, status: "upcoming" },
  recentResults: [
    { date: "2026-06-13T15:00:00Z", opponent: "Newcastle", score: { home: 3, away: 1 }, status: "completed" },
    { date: "2026-06-06T14:00:00Z", opponent: "Aston Villa", score: { home: 2, away: 2 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-20T19:30:00Z", opponent: "Liverpool", venue: "Anfield, Liverpool", isHome: false, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Liverpool", played: 30, won: 22, drawn: 6, lost: 2, goalsFor: 65, goalsAgainst: 22, goalDifference: 43, points: 72 },
    { position: 2, team: "Arsenal", played: 30, won: 20, drawn: 7, lost: 3, goalsFor: 60, goalsAgainst: 25, goalDifference: 35, points: 67 },
    { position: 3, team: "Manchester City", played: 30, won: 19, drawn: 6, lost: 5, goalsFor: 58, goalsAgainst: 30, goalDifference: 28, points: 63 },
    { position: 4, team: "Chelsea", played: 30, won: 16, drawn: 7, lost: 7, goalsFor: 50, goalsAgainst: 35, goalDifference: 15, points: 55 },
  ],
  news: [
    { title: "Arsenal thrash Newcastle 3-1 at the Emirates", source: "Arsenal FC", url: "https://www.arsenal.com", publishedAt: "2026-06-13" },
  ],
};

export const manchesterCity: Team = {
  id: "manchester-city",
  name: "Manchester City",
  shortName: "Man City",
  slug: "manchester-city",
  type: "club",
  league: "premier-league",
  leagueName: "Premier League",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_BC.svg/1200px-Manchester_City_BC.svg.png",
  primaryColor: "#6CABDD",
  secondaryColor: "#FFFFFF",
  nextMatch: { date: "2026-06-22T15:00:00Z", opponent: "Tottenham", venue: "Etihad Stadium, Manchester", isHome: true, status: "upcoming" },
  recentResults: [
    { date: "2026-06-14T16:00:00Z", opponent: "Liverpool", score: { home: 1, away: 2 }, status: "completed" },
    { date: "2026-06-07T15:00:00Z", opponent: "West Ham", score: { home: 4, away: 1 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-22T15:00:00Z", opponent: "Tottenham", venue: "Etihad Stadium, Manchester", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Liverpool", played: 30, won: 22, drawn: 6, lost: 2, goalsFor: 65, goalsAgainst: 22, goalDifference: 43, points: 72 },
    { position: 2, team: "Arsenal", played: 30, won: 20, drawn: 7, lost: 3, goalsFor: 60, goalsAgainst: 25, goalDifference: 35, points: 67 },
    { position: 3, team: "Manchester City", played: 30, won: 19, drawn: 6, lost: 5, goalsFor: 58, goalsAgainst: 30, goalDifference: 28, points: 63 },
    { position: 4, team: "Chelsea", played: 30, won: 16, drawn: 7, lost: 7, goalsFor: 50, goalsAgainst: 35, goalDifference: 15, points: 55 },
  ],
  news: [
    { title: "Man City lose 1-2 at Liverpool in title race blow", source: "Man City Official", url: "https://www.mancity.com", publishedAt: "2026-06-14" },
  ],
};

// ============================================================================
// Club Teams — Serie A
// ============================================================================

export const interMilan: Team = {
  id: "inter-milan",
  name: "Inter Milan",
  shortName: "Inter",
  slug: "inter-milan",
  type: "club",
  league: "serie-a",
  leagueName: "Serie A",
  crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png",
  primaryColor: "#0068A8",
  secondaryColor: "#000000",
  nextMatch: { date: "2026-06-21T19:00:00Z", opponent: "AC Milan", venue: "San Siro, Milan", isHome: true, status: "upcoming" },
  recentResults: [
    { date: "2026-06-14T19:00:00Z", opponent: "Juventus", score: { home: 2, away: 0 }, status: "completed" },
    { date: "2026-06-07T19:30:00Z", opponent: "Napoli", score: { home: 1, away: 1 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-21T19:00:00Z", opponent: "AC Milan", venue: "San Siro, Milan", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Inter Milan", played: 30, won: 21, drawn: 5, lost: 4, goalsFor: 60, goalsAgainst: 24, goalDifference: 36, points: 68 },
    { position: 2, team: "Juventus", played: 30, won: 18, drawn: 8, lost: 4, goalsFor: 52, goalsAgainst: 26, goalDifference: 26, points: 62 },
    { position: 3, team: "AC Milan", played: 30, won: 17, drawn: 6, lost: 7, goalsFor: 48, goalsAgainst: 32, goalDifference: 16, points: 57 },
    { position: 4, team: "Napoli", played: 30, won: 16, drawn: 7, lost: 7, goalsFor: 45, goalsAgainst: 30, goalDifference: 15, points: 55 },
  ],
  news: [
    { title: "Inter Milan destroy Juventus 2-0 in Derby d'Italia", source: "Inter Milan", url: "https://www.inter.it", publishedAt: "2026-06-14" },
  ],
};

export const juventus: Team = {
  id: "juventus",
  name: "Juventus FC",
  shortName: "Juventus",
  slug: "juventus",
  type: "club",
  league: "serie-a",
  leagueName: "Serie A",
  crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Juventus_FC_2017_icon.svg/1200px-Juventus_FC_2017_icon.svg.png",
  primaryColor: "#000000",
  secondaryColor: "#FFFFFF",
  nextMatch: { date: "2026-06-25T20:45:00Z", opponent: "AC Milan", venue: "Allianzi Stadium, Turin", isHome: true, status: "upcoming" },
  recentResults: [
    { date: "2026-06-14T19:00:00Z", opponent: "Inter Milan", score: { home: 0, away: 2 }, status: "completed" },
    { date: "2026-06-07T17:30:00Z", opponent: "Roma", score: { home: 2, away: 1 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-25T20:45:00Z", opponent: "AC Milan", venue: "Allianzi Stadium, Turin", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Inter Milan", played: 30, won: 21, drawn: 5, lost: 4, goalsFor: 60, goalsAgainst: 24, goalDifference: 36, points: 68 },
    { position: 2, team: "Juventus", played: 30, won: 18, drawn: 8, lost: 4, goalsFor: 52, goalsAgainst: 26, goalDifference: 26, points: 62 },
    { position: 3, team: "AC Milan", played: 30, won: 17, drawn: 6, lost: 7, goalsFor: 48, goalsAgainst: 32, goalDifference: 16, points: 57 },
    { position: 4, team: "Napoli", played: 30, won: 16, drawn: 7, lost: 7, goalsFor: 45, goalsAgainst: 30, goalDifference: 15, points: 55 },
  ],
  news: [
    { title: "Juventus suffer 0-2 derby d'Italia defeat", source: "Juventus FC", url: "https://www.juventus.com", publishedAt: "2026-06-14" },
  ],
};

export const acMilan: Team = {
  id: "ac-milan",
  name: "AC Milan",
  shortName: "Milan",
  slug: "ac-milan",
  type: "club",
  league: "serie-a",
  leagueName: "Serie A",
  crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/1200px-Logo_of_AC_Milan.svg.png",
  primaryColor: "#FB090B",
  secondaryColor: "#000000",
  nextMatch: { date: "2026-06-21T19:00:00Z", opponent: "Inter Milan", venue: "San Siro, Milan", isHome: false, status: "upcoming" },
  recentResults: [
    { date: "2026-06-12T19:45:00Z", opponent: "Lazio", score: { home: 3, away: 1 }, status: "completed" },
    { date: "2026-06-05T19:00:00Z", opponent: "Fiorentina", score: { home: 1, away: 0 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-21T19:00:00Z", opponent: "Inter Milan", venue: "San Siro, Milan", isHome: false, status: "upcoming" },
    { date: "2026-06-25T20:45:00Z", opponent: "Juventus", venue: "Allianzi Stadium, Turin", isHome: false, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Inter Milan", played: 30, won: 21, drawn: 5, lost: 4, goalsFor: 60, goalsAgainst: 24, goalDifference: 36, points: 68 },
    { position: 2, team: "Juventus", played: 30, won: 18, drawn: 8, lost: 4, goalsFor: 52, goalsAgainst: 26, goalDifference: 26, points: 62 },
    { position: 3, team: "AC Milan", played: 30, won: 17, drawn: 6, lost: 7, goalsFor: 48, goalsAgainst: 32, goalDifference: 16, points: 57 },
    { position: 4, team: "Napoli", played: 30, won: 16, drawn: 7, lost: 7, goalsFor: 45, goalsAgainst: 30, goalDifference: 15, points: 55 },
  ],
  news: [
    { title: "Milan beat Lazio 3-1 at San Siro", source: "AC Milan", url: "https://www.acmilan.com", publishedAt: "2026-06-12" },
  ],
};

// ============================================================================
// Club Teams — Bundesliga
// ============================================================================

export const bayernMunich: Team = {
  id: "bayern-munich",
  name: "Bayern Munich",
  shortName: "Bayern",
  slug: "bayern-munich",
  type: "club",
  league: "bundesliga",
  leagueName: "Bundesliga",
  crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png",
  primaryColor: "#DC052D",
  secondaryColor: "#FFFFFF",
  nextMatch: { date: "2026-06-20T17:30:00Z", opponent: "Bayer Leverkusen", venue: "Allianz Arena, Munich", isHome: true, status: "upcoming" },
  recentResults: [
    { date: "2026-06-13T17:30:00Z", opponent: "RB Leipzig", score: { home: 4, away: 2 }, status: "completed" },
    { date: "2026-06-06T17:30:00Z", opponent: "Borussia Dortmund", score: { home: 2, away: 0 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-20T17:30:00Z", opponent: "Bayer Leverkusen", venue: "Allianz Arena, Munich", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Bayern Munich", played: 28, won: 20, drawn: 4, lost: 4, goalsFor: 62, goalsAgainst: 25, goalDifference: 37, points: 64 },
    { position: 2, team: "Bayer Leverkusen", played: 28, won: 18, drawn: 6, lost: 4, goalsFor: 55, goalsAgainst: 28, goalDifference: 27, points: 60 },
    { position: 3, team: "RB Leipzig", played: 28, won: 15, drawn: 7, lost: 6, goalsFor: 48, goalsAgainst: 32, goalDifference: 16, points: 52 },
    { position: 4, team: "Borussia Dortmund", played: 28, won: 14, drawn: 6, lost: 8, goalsFor: 45, goalsAgainst: 35, goalDifference: 10, points: 48 },
  ],
  news: [
    { title: "Bayern demolish RB Leipzig 4-2 in thriller", source: "Bayern Munich", url: "https://www.fcbayern.com", publishedAt: "2026-06-13" },
  ],
};

export const bayernLeverkusen: Team = {
  id: "bayer-leverkusen",
  name: "Bayer Leverkusen",
  shortName: "Leverkusen",
  slug: "bayer-leverkusen",
  type: "club",
  league: "bundesliga",
  leagueName: "Bundesliga",
  crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Bayer_04_Leverkusen_logo_2017.svg/1200px-Bayer_04_Leverkusen_logo_2017.svg.png",
  primaryColor: "#E32221",
  secondaryColor: "#000000",
  nextMatch: { date: "2026-06-20T17:30:00Z", opponent: "Bayern Munich", venue: "Allianz Arena, Munich", isHome: false, status: "upcoming" },
  recentResults: [
    { date: "2026-06-13T15:30:00Z", opponent: "Wolfsburg", score: { home: 3, away: 1 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-20T17:30:00Z", opponent: "Bayern Munich", venue: "Allianz Arena, Munich", isHome: false, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Bayern Munich", played: 28, won: 20, drawn: 4, lost: 4, goalsFor: 62, goalsAgainst: 25, goalDifference: 37, points: 64 },
    { position: 2, team: "Bayer Leverkusen", played: 28, won: 18, drawn: 6, lost: 4, goalsFor: 55, goalsAgainst: 28, goalDifference: 27, points: 60 },
    { position: 3, team: "RB Leipzig", played: 28, won: 15, drawn: 7, lost: 6, goalsFor: 48, goalsAgainst: 32, goalDifference: 16, points: 52 },
    { position: 4, team: "Borussia Dortmund", played: 28, won: 14, drawn: 6, lost: 8, goalsFor: 45, goalsAgainst: 35, goalDifference: 10, points: 48 },
  ],
  news: [],
};

// ============================================================================
// Club Teams — Ligue 1
// ============================================================================

export const psg: Team = {
  id: "psg",
  name: "Paris Saint-Germain",
  shortName: "PSG",
  slug: "psg",
  type: "club",
  league: "ligue-1",
  leagueName: "Ligue 1",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Paris_Saint-Germain_F.C._logo.svg/1200px-Paris_Saint-Germain_F.C._logo.svg.png",
  primaryColor: "#004170",
  secondaryColor: "#DA291C",
  nextMatch: { date: "2026-06-21T20:00:00Z", opponent: "Olympique Marseille", venue: "Parc des Princes, Paris", isHome: true, status: "upcoming" },
  recentResults: [
    { date: "2026-06-14T20:00:00Z", opponent: "AS Monaco", score: { home: 3, away: 0 }, status: "completed" },
    { date: "2026-06-07T19:00:00Z", opponent: "Lille", score: { home: 2, away: 1 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-21T20:00:00Z", opponent: "Olympique Marseille", venue: "Parc des Princes, Paris", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Paris Saint-Germain", played: 30, won: 22, drawn: 5, lost: 3, goalsFor: 65, goalsAgainst: 22, goalDifference: 43, points: 71 },
    { position: 2, team: "AS Monaco", played: 30, won: 17, drawn: 7, lost: 6, goalsFor: 50, goalsAgainst: 30, goalDifference: 20, points: 58 },
    { position: 3, team: "Olympique Marseille", played: 30, won: 15, drawn: 8, lost: 7, goalsFor: 45, goalsAgainst: 32, goalDifference: 13, points: 53 },
    { position: 4, team: "LOSC Lille", played: 30, won: 14, drawn: 6, lost: 10, goalsFor: 40, goalsAgainst: 35, goalDifference: 5, points: 48 },
  ],
  news: [
    { title: "PSG demolish Monaco 3-0 at Parc des Princes", source: "PSG Official", url: "https://www.psg.fr", publishedAt: "2026-06-14" },
  ],
};

// ============================================================================
// MLS Teams
// ============================================================================

export const nycfc: Team = {
  id: "nycfc",
  name: "New York City FC",
  shortName: "NYCFC",
  slug: "nycfc",
  type: "club",
  league: "mls",
  leagueName: "MLS",
  crestUrl: "https://logos-world.net/wp-content/uploads/2022/08/New-York-City-FC-Logo.png",
  primaryColor: "#6CABDD",
  secondaryColor: "#F4701B",
  nextMatch: {
    id: "nycfc-next-1",
    date: "2026-06-21T19:30:00Z",
    kickoff: "2026-06-21T19:30:00Z",
    homeTeamId: "nycfc",
    awayTeamId: "lafc",
    homeTeamName: "New York City FC",
    awayTeamName: "LAFC",
    homeScore: null,
    awayScore: null,
    opponent: "LAFC",
    venue: "Yankee Stadium, New York",
    isHome: true,
    status: "upcoming",
    competition: "MLS",
    competitionType: "mls",
  },
  recentResults: [
    {
      id: "nycfc-rc-1",
      date: "2026-06-14T20:00:00Z",
      kickoff: "2026-06-14T20:00:00Z",
      homeTeamId: "nycfc",
      awayTeamId: "philadelphia",
      homeTeamName: "New York City FC",
      awayTeamName: "Philadelphia Union",
      homeScore: 2,
      awayScore: 1,
      opponent: "Philadelphia Union",
      venue: "Yankee Stadium, New York",
      isHome: true,
      status: "completed",
      competition: "MLS",
      competitionType: "mls",
    },
  ],
  standings: [
    { position: 5, team: "New York City FC", played: 15, won: 7, drawn: 4, lost: 4, goalsFor: 22, goalsAgainst: 18, goalDifference: 4, points: 25 },
  ],
};

export const richmond: Team = {
  id: "richmond",
  name: "Richmond Kickers",
  shortName: "RKC",
  slug: "richmond",
  type: "club",
  league: "usl-l1",
  leagueName: "USL League One",
  crestUrl: "https://media.api-sports.io/soccer/clubs/11326.webp",
  primaryColor: "#FF0000",
  secondaryColor: "#000000",
  nextMatch: {
    id: "richmond-next-1",
    date: "2026-06-22T18:00:00Z",
    kickoff: "2026-06-22T18:00:00Z",
    homeTeamId: "richmond",
    awayTeamId: "atlanta",
    homeTeamName: "Richmond Kickers",
    awayTeamName: "Atlanta United II",
    homeScore: null,
    awayScore: null,
    opponent: "Atlanta United II",
    venue: "City Stadium, Richmond",
    isHome: true,
    status: "upcoming",
    competition: "USL League One",
    competitionType: "usl-l1",
  },
  recentResults: [
    {
      id: "richmond-rc-1",
      date: "2026-06-13T19:00:00Z",
      kickoff: "2026-06-13T19:00:00Z",
      homeTeamId: "richmond",
      awayTeamId: "charleston",
      homeTeamName: "Richmond Kickers",
      awayTeamName: "Charleston Battery",
      homeScore: 1,
      awayScore: 1,
      opponent: "Charleston Battery",
      venue: "City Stadium, Richmond",
      isHome: true,
      status: "completed",
      competition: "USL League One",
      competitionType: "usl-l1",
    },
  ],
  standings: [
    { position: 8, team: "Richmond Kickers", played: 14, won: 4, drawn: 3, lost: 7, goalsFor: 14, goalsAgainst: 20, goalDifference: -6, points: 15 },
  ],
};

// ============================================================================
// World Cup 2026 Teams (48 teams, 12 groups)
// ============================================================================

export const wc2026Teams: Team[] = [
  // Group A
  { id: "usa", name: "USA", shortName: "USA", slug: "usa", flag: "\uD83C\uDDFA\uD83C\uDDF8", type: "national", group: "A", fifaRank: 11 },
  { id: "uruguay", name: "Uruguay", shortName: "URU", slug: "uruguay", flag: "\uD83C\uDDFA\uD83C\uDDFE", type: "national", group: "A", fifaRank: 14 },
  { id: "portugal", name: "Portugal", shortName: "POR", slug: "portugal", flag: "\uD83C\uDDF5\uD83C\uDDF9", type: "national", group: "A", fifaRank: 6 },
  { id: "algeria", name: "Algeria", shortName: "ALG", slug: "algeria", flag: "\uD83C\uDDE9\uD83C\uDDFF", type: "national", group: "A", fifaRank: 43 },
  // Group B
  { id: "canada", name: "Canada", shortName: "CAN", slug: "canada", flag: "\uD83C\uDDE8\uD83C\uDDE6", type: "national", group: "B", fifaRank: 49 },
  { id: "france", name: "France", shortName: "FRA", slug: "france", flag: "\uD83C\uDDEB\uD83C\uDDF7", type: "national", group: "B", fifaRank: 2 },
  { id: "senegal", name: "Senegal", shortName: "SEN", slug: "senegal", flag: "\uD83C\uDDF8\uD83C\uDDF3", type: "national", group: "B", fifaRank: 20 },
  { id: "saudi-arabia", name: "Saudi Arabia", shortName: "KSA", slug: "saudi-arabia", flag: "\uD83C\uDDF8\uD83C\uDDE6", type: "national", group: "B", fifaRank: 56 },
  // Group C
  { id: "mexico", name: "Mexico", shortName: "MEX", slug: "mexico", flag: "\uD83C\uDDF2\uD83C\uDDFD", type: "national", group: "C", fifaRank: 12 },
  { id: "argentina", name: "Argentina", shortName: "ARG", slug: "argentina", flag: "\uD83C\uDDE6\uD83C\uDDF7", type: "national", group: "C", fifaRank: 1 },
  { id: "croatia", name: "Croatia", shortName: "CRO", slug: "croatia", flag: "\uD83C\uDDED\uD83C\uDDF7", type: "national", group: "C", fifaRank: 9 },
  { id: "tunisia", name: "Tunisia", shortName: "TUN", slug: "tunisia", flag: "\uD83C\uDDF9\uD83C\uDDF3", type: "national", group: "C", fifaRank: 32 },
  // Group D
  { id: "brazil", name: "Brazil", shortName: "BRA", slug: "brazil", flag: "\uD83C\uDDE7\uD83C\uDDF7", type: "national", group: "D", fifaRank: 5 },
  { id: "switzerland", name: "Switzerland", shortName: "SUI", slug: "switzerland", flag: "\uD83C\uDDE8\uD83C\uDDED", type: "national", group: "D", fifaRank: 15 },
  { id: "japan", name: "Japan", shortName: "JPN", slug: "japan", flag: "\uD83C\uDDEF\uD83C\uDDF5", type: "national", group: "D", fifaRank: 18 },
  { id: "ghana", name: "Ghana", shortName: "GHA", slug: "ghana", flag: "\uD83C\uDDEC\uD83C\uDDE9", type: "national", group: "D", fifaRank: 60 },
  // Group E
  { id: "england", name: "England", shortName: "ENG", slug: "england", flag: "\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F", type: "national", group: "E", fifaRank: 4 },
  { id: "netherlands", name: "Netherlands", shortName: "NED", slug: "netherlands", flag: "\uD83C\uDDF3\uD83C\uDDF1", type: "national", group: "E", fifaRank: 7 },
  { id: "iran", name: "Iran", shortName: "IRN", slug: "iran", flag: "\uD83C\uDDEE\uD83C\uDDF7", type: "national", group: "E", fifaRank: 22 },
  { id: "costa-rica", name: "Costa Rica", shortName: "CRC", slug: "costa-rica", flag: "\uD83C\uDDE8\uD83C\uDDF7", type: "national", group: "E", fifaRank: 54 },
  // Group F
  { id: "germany", name: "Germany", shortName: "GER", slug: "germany", flag: "\uD83C\uDDE9\uD83C\uDDEA", type: "national", group: "F", fifaRank: 16 },
  { id: "colombia", name: "Colombia", shortName: "COL", slug: "colombia", flag: "\uD83C\uDDE8\uD83C\uDDF4", type: "national", group: "F", fifaRank: 17 },
  { id: "south-korea", name: "South Korea", shortName: "KOR", slug: "south-korea", flag: "\uD83C\uDDF0\uD83C\uDDF7", type: "national", group: "F", fifaRank: 23 },
  { id: "morocco", name: "Morocco", shortName: "MAR", slug: "morocco", flag: "\uD83C\uDDF2\uD83C\uDDE6", type: "national", group: "F", fifaRank: 13 },
  // Group G
  { id: "spain", name: "Spain", shortName: "ESP", slug: "spain", flag: "\uD83C\uDDEA\uD83C\uDDF8", type: "national", group: "G", fifaRank: 8 },
  { id: "ecuador", name: "Ecuador", shortName: "ECU", slug: "ecuador", flag: "\uD83C\uDDEA\uD83C\uDDE8", type: "national", group: "G", fifaRank: 31 },
  { id: "australia", name: "Australia", shortName: "AUS", slug: "australia", flag: "\uD83C\uDDE6\uD83C\uDDFA", type: "national", group: "G", fifaRank: 39 },
  { id: "cameroon", name: "Cameroon", shortName: "CMR", slug: "cameroon", flag: "\uD83C\uDDE8\uD83C\uDDF2", type: "national", group: "G", fifaRank: 46 },
  // Group H
  { id: "italy", name: "Italy", shortName: "ITA", slug: "italy", flag: "\uD83C\uDDEE\uD83C\uDDF9", type: "national", group: "H", fifaRank: 10 },
  { id: "paraguay", name: "Paraguay", shortName: "PAR", slug: "paraguay", flag: "\uD83C\uDDF5\uD83C\uDDFE", type: "national", group: "H", fifaRank: 52 },
  { id: "nigeria", name: "Nigeria", shortName: "NGA", slug: "nigeria", flag: "\uD83C\uDDF3\uD83C\uDDEC", type: "national", group: "H", fifaRank: 44 },
  { id: "qatar", name: "Qatar", shortName: "QAT", slug: "qatar", flag: "\uD83C\uDDF6\uD83C\uDDE6", type: "national", group: "H", fifaRank: 58 },
  // Group I
  { id: "belgium", name: "Belgium", shortName: "BEL", slug: "belgium", flag: "\uD83C\uDDE7\uD83C\uDDEA", type: "national", group: "I", fifaRank: 3 },
  { id: "chile", name: "Chile", shortName: "CHI", slug: "chile", flag: "\uD83C\uDDE8\uD83C\uDDF1", type: "national", group: "I", fifaRank: 40 },
  { id: "iraq", name: "Iraq", shortName: "IRQ", slug: "iraq", flag: "\uD83C\uDDEE\uD83C\uDDF6", type: "national", group: "I", fifaRank: 68 },
  { id: "ivory-coast", name: "Ivory Coast", shortName: "CIV", slug: "ivory-coast", flag: "\uD83C\uDDE8\uD83C\uDDED", type: "national", group: "I", fifaRank: 42 },
  // Group J
  { id: "denmark", name: "Denmark", shortName: "DEN", slug: "denmark", flag: "\uD83C\uDDE9\uD83C\uDDF0", type: "national", group: "J", fifaRank: 21 },
  { id: "peru", name: "Peru", shortName: "PER", slug: "peru", flag: "\uD83C\uDDF5\uD83C\uDDDE", type: "national", group: "J", fifaRank: 35 },
  { id: "egypt", name: "Egypt", shortName: "EGY", slug: "egypt", flag: "\uD83C\uDDEA\uD83C\uDDEC", type: "national", group: "J", fifaRank: 36 },
  { id: "china", name: "China", shortName: "CHN", slug: "china", flag: "\uD83C\uDDE8\uD83C\uDDF3", type: "national", group: "J", fifaRank: 79 },
  // Group K
  { id: "poland", name: "Poland", shortName: "POL", slug: "poland", flag: "\uD83C\uDDF5\uD83C\uDDF1", type: "national", group: "K", fifaRank: 28 },
  { id: "turkey", name: "Turkey", shortName: "TUR", slug: "turkey", flag: "\uD83C\uDDF9\uD83C\uDDF7", type: "national", group: "K", fifaRank: 29 },
  { id: "uae", name: "UAE", shortName: "UAE", slug: "uae", flag: "\uD83C\uDDE6\uD83C\uDDEA", type: "national", group: "K", fifaRank: 67 },
  { id: "new-zealand", name: "New Zealand", shortName: "NZL", slug: "new-zealand", flag: "\uD83C\uDDF3\uD83C\uDDFF", type: "national", group: "K", fifaRank: 104 },
  // Group L
  { id: "austria", name: "Austria", shortName: "AUT", slug: "austria", flag: "\uD83C\uDDE6\uD83C\uDDF9", type: "national", group: "L", fifaRank: 25 },
  { id: "serbia", name: "Serbia", shortName: "SRB", slug: "serbia", flag: "\uD83C\uDDF7\uD83C\uDDEA", type: "national", group: "L", fifaRank: 33 },
  { id: "sweden", name: "Sweden", shortName: "SWE", slug: "sweden", flag: "\uD83C\uDDF8\uD83C\uDDEA", type: "national", group: "L", fifaRank: 27 },
  { id: "mali", name: "Mali", shortName: "MLI", slug: "mali", flag: "\uD83C\uDDF2\uD83C\uDDF1", type: "national", group: "L", fifaRank: 53 },
];

// ============================================================================
// World Cup group stage fixtures: [date, homeId, awayId, venue]
// ============================================================================

type GroupFixture = [string, string, string, string];

export const groupFixtures: Record<string, GroupFixture[]> = {
  A: [
    ["2026-06-11T16:00:00-07:00", "usa", "uruguay", "SoFi Stadium, Los Angeles"],
    ["2026-06-11T13:00:00-05:00", "portugal", "algeria", "AT&T Stadium, Dallas"],
    ["2026-06-15T18:00:00-07:00", "usa", "portugal", "Levi's Stadium, San Francisco"],
    ["2026-06-15T15:00:00-05:00", "uruguay", "algeria", "NRG Stadium, Houston"],
    ["2026-06-19T16:00:00-07:00", "usa", "algeria", "SoFi Stadium, Los Angeles"],
    ["2026-06-19T13:00:00-05:00", "uruguay", "portugal", "Mercedes-Benz Stadium, Atlanta"],
  ],
  B: [
    ["2026-06-12T12:00:00-04:00", "canada", "france", "BMO Field, Toronto"],
    ["2026-06-12T17:00:00-07:00", "senegal", "saudi-arabia", "BC Place, Vancouver"],
    ["2026-06-16T15:00:00-04:00", "canada", "senegal", "BMO Field, Toronto"],
    ["2026-06-16T18:00:00-07:00", "france", "saudi-arabia", "CenturyLink Field, Seattle"],
    ["2026-06-20T13:00:00-04:00", "canada", "saudi-arabia", "BC Place, Vancouver"],
    ["2026-06-20T17:00:00-07:00", "france", "senegal", "Allegiant Stadium, Las Vegas"],
  ],
  C: [
    ["2026-06-12T16:00:00-05:00", "mexico", "argentina", "Estadio Azteca, Mexico City"],
    ["2026-06-12T14:00:00-04:00", "croatia", "tunisia", "Hard Rock Stadium, Miami"],
    ["2026-06-16T16:00:00-05:00", "mexico", "croatia", "Estadio Azteca, Mexico City"],
    ["2026-06-16T12:00:00-05:00", "argentina", "tunisia", "NRG Stadium, Houston"],
    ["2026-06-20T18:00:00-05:00", "mexico", "tunisia", "Estadio Universitario, Monterrey"],
    ["2026-06-20T15:00:00-04:00", "argentina", "croatia", "Mercedes-Benz Stadium, Atlanta"],
  ],
  D: [
    ["2026-06-13T15:00:00-04:00", "brazil", "switzerland", "MetLife Stadium, New York"],
    ["2026-06-13T18:00:00-07:00", "japan", "ghana", "Lumen Field, Seattle"],
    ["2026-06-17T17:00:00-04:00", "brazil", "japan", "Gillette Stadium, Boston"],
    ["2026-06-17T15:00:00-05:00", "switzerland", "ghana", "AT&T Stadium, Dallas"],
    ["2026-06-21T13:00:00-04:00", "brazil", "ghana", "Hard Rock Stadium, Miami"],
    ["2026-06-21T16:00:00-07:00", "switzerland", "japan", "BC Place, Vancouver"],
  ],
  E: [
    ["2026-06-13T13:00:00-05:00", "england", "netherlands", "Estadio Azteca, Mexico City"],
    ["2026-06-13T16:00:00-04:00", "iran", "costa-rica", "Gillette Stadium, Boston"],
    ["2026-06-17T13:00:00-05:00", "england", "iran", "Estadio Universitario, Monterrey"],
    ["2026-06-17T18:00:00-07:00", "netherlands", "costa-rica", "SoFi Stadium, Los Angeles"],
    ["2026-06-21T15:00:00-04:00", "england", "costa-rica", "MetLife Stadium, New York"],
    ["2026-06-21T17:00:00-07:00", "netherlands", "iran", "Levi's Stadium, San Francisco"],
  ],
  F: [
    ["2026-06-14T16:00:00-04:00", "germany", "colombia", "Lincoln Financial Field, Philadelphia"],
    ["2026-06-14T13:00:00-07:00", "south-korea", "morocco", "Allegiant Stadium, Las Vegas"],
    ["2026-06-18T15:00:00-05:00", "germany", "south-korea", "AT&T Stadium, Dallas"],
    ["2026-06-18T18:00:00-07:00", "colombia", "morocco", "CenturyLink Field, Seattle"],
    ["2026-06-22T13:00:00-04:00", "germany", "morocco", "Hard Rock Stadium, Miami"],
    ["2026-06-22T16:00:00-07:00", "colombia", "south-korea", "BC Place, Vancouver"],
  ],
  G: [
    ["2026-06-14T12:00:00-05:00", "spain", "ecuador", "NRG Stadium, Houston"],
    ["2026-06-14T17:00:00-04:00", "australia", "cameroon", "BMO Field, Toronto"],
    ["2026-06-18T16:00:00-05:00", "spain", "australia", "Estadio Azteca, Mexico City"],
    ["2026-06-18T14:00:00-04:00", "ecuador", "cameroon", "Mercedes-Benz Stadium, Atlanta"],
    ["2026-06-22T15:00:00-05:00", "spain", "cameroon", "Estadio Universitario, Monterrey"],
    ["2026-06-22T13:00:00-07:00", "ecuador", "australia", "Lumen Field, Seattle"],
  ],
  H: [
    ["2026-06-15T13:00:00-04:00", "italy", "paraguay", "MetLife Stadium, New York"],
    ["2026-06-15T16:00:00-05:00", "nigeria", "qatar", "Estadio Universitario, Monterrey"],
    ["2026-06-19T15:00:00-04:00", "italy", "nigeria", "Gillette Stadium, Boston"],
    ["2026-06-19T12:00:00-05:00", "paraguay", "qatar", "NRG Stadium, Houston"],
    ["2026-06-23T13:00:00-04:00", "italy", "qatar", "Lincoln Financial Field, Philadelphia"],
    ["2026-06-23T16:00:00-07:00", "paraguay", "nigeria", "Levi's Stadium, San Francisco"],
  ],
  I: [
    ["2026-06-15T18:00:00-07:00", "belgium", "chile", "SoFi Stadium, Los Angeles"],
    ["2026-06-15T14:00:00-05:00", "iraq", "ivory-coast", "Estadio Universitario, Monterrey"],
    ["2026-06-19T16:00:00-04:00", "belgium", "iraq", "Lincoln Financial Field, Philadelphia"],
    ["2026-06-19T13:00:00-07:00", "chile", "ivory-coast", "Allegiant Stadium, Las Vegas"],
    ["2026-06-23T15:00:00-05:00", "belgium", "ivory-coast", "Estadio Azteca, Mexico City"],
    ["2026-06-23T17:00:00-04:00", "chile", "iraq", "BMO Field, Toronto"],
  ],
  J: [
    ["2026-06-16T12:00:00-05:00", "denmark", "peru", "AT&T Stadium, Dallas"],
    ["2026-06-16T17:00:00-04:00", "egypt", "china", "Hard Rock Stadium, Miami"],
    ["2026-06-20T14:00:00-04:00", "denmark", "egypt", "Gillette Stadium, Boston"],
    ["2026-06-20T16:00:00-07:00", "peru", "china", "Lumen Field, Seattle"],
    ["2026-06-24T13:00:00-04:00", "denmark", "china", "BMO Field, Toronto"],
    ["2026-06-24T16:00:00-05:00", "peru", "egypt", "Estadio Universitario, Monterrey"],
  ],
  K: [
    ["2026-06-17T13:00:00-04:00", "poland", "turkey", "Mercedes-Benz Stadium, Atlanta"],
    ["2026-06-17T16:00:00-07:00", "uae", "new-zealand", "BC Place, Vancouver"],
    ["2026-06-21T12:00:00-05:00", "poland", "uae", "NRG Stadium, Houston"],
    ["2026-06-21T18:00:00-04:00", "turkey", "new-zealand", "Lincoln Financial Field, Philadelphia"],
    ["2026-06-25T13:00:00-05:00", "poland", "new-zealand", "AT&T Stadium, Dallas"],
    ["2026-06-25T16:00:00-07:00", "turkey", "uae", "CenturyLink Field, Seattle"],
  ],
  L: [
    ["2026-06-18T13:00:00-05:00", "austria", "serbia", "Estadio Azteca, Mexico City"],
    ["2026-06-18T16:00:00-04:00", "sweden", "mali", "MetLife Stadium, New York"],
    ["2026-06-22T14:00:00-04:00", "austria", "sweden", "Hard Rock Stadium, Miami"],
    ["2026-06-22T17:00:00-07:00", "serbia", "mali", "Allegiant Stadium, Las Vegas"],
    ["2026-06-26T13:00:00-05:00", "austria", "mali", "Estadio Universitario, Monterrey"],
    ["2026-06-26T16:00:00-04:00", "serbia", "sweden", "BMO Field, Toronto"],
  ],
};

// Build schedule and next match for each World Cup team
function buildTeamSchedule(teamId: string): { schedule: Match[]; nextMatch: Match | undefined; recentResults: Match[] } {
  const team = wc2026Teams.find((t) => t.id === teamId);
  if (!team) return { schedule: [], nextMatch: undefined, recentResults: [] };

  const matches: Match[] = [];
  for (const [date, homeId, awayId, venue] of groupFixtures[team.group || ""] || []) {
    if (homeId === teamId || awayId === teamId) {
      const isHome = homeId === teamId;
      const opponentId = isHome ? awayId : homeId;
      const opponent = wc2026Teams.find((t) => t.id === opponentId);
      matches.push({
        id: `${team.group}-${homeId}-${awayId}-${date}`,
        date,
        kickoff: date,
        homeTeamId: homeId,
        awayTeamId: awayId,
        homeTeam: wc2026Teams.find((t) => t.id === homeId)?.name || homeId,
        awayTeam: wc2026Teams.find((t) => t.id === awayId)?.name || awayId,
        homeTeamName: wc2026Teams.find((t) => t.id === homeId)?.name || homeId,
        awayTeamName: wc2026Teams.find((t) => t.id === awayId)?.name || awayId,
        homeScore: null,
        awayScore: null,
        opponent: opponent?.name || opponentId,
        venue,
        isHome,
        status: "upcoming",
        stage: "Group Stage",
        group: team.group,
        competition: `WC Group ${team.group}`,
        competitionType: "fifa-world-cup-2026",
      });
    }
  }

  matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const now = new Date();
  const upcoming = matches
    .filter((m) => new Date(m.date) > now)
    .map((m) => ({ ...m, status: "upcoming" as const }));
  const completed = matches
    .filter((m) => new Date(m.date) <= now)
    .map((m) => ({ ...m, status: "completed" as const, homeScore: 0, awayScore: 0 }));

  const nextMatch = upcoming.length > 0 ? upcoming[0] : undefined;
  const recentResults = completed.slice(-3).reverse();

  return { schedule: upcoming, nextMatch, recentResults };
}

// Augment all World Cup teams with schedule data
for (const team of wc2026Teams) {
  const { schedule, nextMatch, recentResults } = buildTeamSchedule(team.id);
  team.nextMatch = nextMatch;
  team.schedule = schedule;
  team.recentResults = recentResults;
}

// ============================================================================
// Combined team list: club teams + national teams
// ============================================================================

export const allTeams: Team[] = [
  barcelona, realMadrid, atleticoMadrid,
  liverpool, arsenal, manchesterCity,
  interMilan, juventus, acMilan,
  bayernMunich, bayernLeverkusen,
  psg,
  nycfc, richmond,
  ...wc2026Teams,
  // Additional club teams for league standings computation
  {
    id: "athletic-bilbao", name: "Athletic Bilbao", slug: "athletic-bilbao",
    type: "club", league: "la-liga", leagueName: "La Liga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Bilbao_Atleticologo.svg/1200px-Bilbao_Atleticologo.svg.png",
    primaryColor: "#EE2523", secondaryColor: "#FFFFFF",
  },
  {
    id: "villarreal", name: "Villarreal CF", slug: "villarreal",
    type: "club", league: "la-liga", leagueName: "La Liga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Villarreal_CF.svg/1200px-Villarreal_CF.svg.png",
    primaryColor: "#FFE114", secondaryColor: "#005187",
  },
  {
    id: "real-sociedad", name: "Real Sociedad", slug: "real-sociedad",
    type: "club", league: "la-liga", leagueName: "La Liga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Real_Sociedad_logo.svg/1200px-Real_Sociedad_logo.svg.png",
    primaryColor: "#0067B1", secondaryColor: "#FFFFFF",
  },
  {
    id: "real-betis", name: "Real Betis", slug: "real-betis",
    type: "club", league: "la-liga", leagueName: "La Liga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Real_Betis_logo.svg/1200px-Real_Betis_logo.svg.png",
    primaryColor: "#00954C", secondaryColor: "#FFFFFF",
  },
  {
    id: "sevilla", name: "Sevilla FC", slug: "sevilla",
    type: "club", league: "la-liga", leagueName: "La Liga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Sevilla_Logo.svg/1200px-Sevilla_Logo.svg.png",
    primaryColor: "#D40027", secondaryColor: "#FFFFFF",
  },
  {
    id: "valencia", name: "Valencia CF", slug: "valencia",
    type: "club", league: "la-liga", leagueName: "La Liga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Valencia_CF.svg/1200px-Valencia_CF.svg.png",
    primaryColor: "#FF6600", secondaryColor: "#000000",
  },
  {
    id: "chelsea", name: "Chelsea FC", slug: "chelsea",
    type: "club", league: "premier-league", leagueName: "Premier League",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png",
    primaryColor: "#034694", secondaryColor: "#DBA11E",
  },
  {
    id: "tottenham", name: "Tottenham Hotspur", slug: "tottenham",
    type: "club", league: "premier-league", leagueName: "Premier League",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Tottenham_Hotspur_FC_logo.svg/1200px-Tottenham_Hotspur_FC_logo.svg.png",
    primaryColor: "#132257", secondaryColor: "#FFFFFF",
  },
  {
    id: "newcastle", name: "Newcastle United", slug: "newcastle",
    type: "club", league: "premier-league", leagueName: "Premier League",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Newcastle_United_logo.svg/1200px-Newcastle_United_logo.svg.png",
    primaryColor: "#241F20", secondaryColor: "#FFFFFF",
  },
  {
    id: "aston-villa", name: "Aston Villa", slug: "aston-villa",
    type: "club", league: "premier-league", leagueName: "Premier League",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Aston_Villa_logo.svg/1200px-Aston_Villa_logo.svg.png",
    primaryColor: "#670E36", secondaryColor: "#95BFE5",
  },
  {
    id: "west-ham", name: "West Ham United", slug: "west-ham",
    type: "club", league: "premier-league", leagueName: "Premier League",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/West_Ham_United_FC_logo.svg/1200px-West_Ham_United_FC_logo.svg.png",
    primaryColor: "#7A263A", secondaryColor: "#1BB1E7",
  },
  {
    id: "napoli", name: "SSC Napoli", slug: "napoli",
    type: "club", league: "serie-a", leagueName: "Serie A",
    crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/SSC_Napoli_logo.svg/1200px-SSC_Napoli_logo.svg.png",
    primaryColor: "#00A8E1", secondaryColor: "#FFFFFF",
  },
  {
    id: "roma", name: "AS Roma", slug: "roma",
    type: "club", league: "serie-a", leagueName: "Serie A",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/AS_Roma_logo.svg/1200px-AS_Roma_logo.svg.png",
    primaryColor: "#8E1F2F", secondaryColor: "#F4A621",
  },
  {
    id: "lazio", name: "SS Lazio", slug: "lazio",
    type: "club", league: "serie-a", leagueName: "Serie A",
    crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/SS_Lazio_1900.svg/1200px-SS_Lazio_1900.svg.png",
    primaryColor: "#87D8F7", secondaryColor: "#FFFFFF",
  },
  {
    id: "fiorentina", name: "ACF Fiorentina", slug: "fiorentina",
    type: "club", league: "serie-a", leagueName: "Serie A",
    crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/ACF_Fiorentina_logo.svg/1200px-ACF_Fiorentina_logo.svg.png",
    primaryColor: "#4D2E82", secondaryColor: "#FFFFFF",
  },
  {
    id: "rb-leipzig", name: "RB Leipzig", slug: "rb-leipzig",
    type: "club", league: "bundesliga", leagueName: "Bundesliga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/RB_Leipzig_logo.svg/1200px-RB_Leipzig_logo.svg.png",
    primaryColor: "#DD0741", secondaryColor: "#001F47",
  },
  {
    id: "borussia-dortmund", name: "Borussia Dortmund", slug: "borussia-dortmund",
    type: "club", league: "bundesliga", leagueName: "Bundesliga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
    primaryColor: "#FDE100", secondaryColor: "#000000",
  },
  {
    id: "wolfsburg", name: "VfL Wolfsburg", slug: "wolfsburg",
    type: "club", league: "bundesliga", leagueName: "Bundesliga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/VfL_Wolfsburg_Logo.svg",
    primaryColor: "#65B92E", secondaryColor: "#FFFFFF",
  },
  {
    id: "eintracht-frankfurt", name: "Eintracht Frankfurt", slug: "eintracht-frankfurt",
    type: "club", league: "bundesliga", leagueName: "Bundesliga",
    crestUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Eintracht_Frankfurt_logo.svg",
    primaryColor: "#E1000F", secondaryColor: "#000000",
  },
  {
    id: "olympique-marseille", name: "Olympique Marseille", slug: "olympique-marseille",
    type: "club", league: "ligue-1", leagueName: "Ligue 1",
    crestUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Olympique_Marseille_Logo.svg/1200px-Olympique_Marseille_Logo.svg.png",
    primaryColor: "#2FAEE0", secondaryColor: "#FFFFFF",
  },
  {
    id: "as-monaco", name: "AS Monaco", slug: "as-monaco",
    type: "club", league: "ligue-1", leagueName: "Ligue 1",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/AS_Monaco_FC_logo.svg/1200px-AS_Monaco_FC_logo.svg.png",
    primaryColor: "#E7352B", secondaryColor: "#FFFFFF",
  },
  {
    id: "losc-lille", name: "LOSC Lille", slug: "losc-lille",
    type: "club", league: "ligue-1", leagueName: "Ligue 1",
    crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Lille_OSC_2023.svg/1200px-Lille_OSC_2023.svg.png",
    primaryColor: "#E21A23", secondaryColor: "#1D2B53",
  },
  {
    id: "lafc", name: "LAFC", slug: "lafc",
    type: "club", league: "mls", leagueName: "MLS",
    crestUrl: "https://media.api-sports.io/soccer/clubs/11654.webp",
    primaryColor: "#A2955B", secondaryColor: "#000000",
  },
  {
    id: "atlanta-united", name: "Atlanta United FC", slug: "atlanta-united",
    type: "club", league: "mls", leagueName: "MLS",
    crestUrl: "https://media.api-sports.io/soccer/clubs/11621.webp",
    primaryColor: "#A19D60", secondaryColor: "#8B1A17",
  },
  {
    id: "seattle-sounders", name: "Seattle Sounders FC", slug: "seattle-sounders",
    type: "club", league: "mls", leagueName: "MLS",
    crestUrl: "https://media.api-sports.io/soccer/clubs/11658.webp",
    primaryColor: "#5D9744", secondaryColor: "#6CADC7",
  },
  {
    id: "inter-miami", name: "Inter Miami CF", slug: "inter-miami",
    type: "club", league: "mls", leagueName: "MLS",
    crestUrl: "https://media.api-sports.io/soccer/clubs/11655.webp",
    primaryColor: "#F7B5CD", secondaryColor: "#000000",
  },
  {
    id: "philadelphia", name: "Philadelphia Union", slug: "philadelphia",
    type: "club", league: "mls", leagueName: "MLS",
    crestUrl: "https://media.api-sports.io/soccer/clubs/11656.webp",
    primaryColor: "#F57D22", secondaryColor: "#000000",
  },
  {
    id: "atlanta", name: "Atlanta United II", slug: "atlanta",
    type: "club", league: "usl-l1", leagueName: "USL League One",
    crestUrl: "https://media.api-sports.io/soccer/clubs/15904.webp",
    primaryColor: "#A19D60", secondaryColor: "#8B1A17",
  },
  {
    id: "charleston", name: "Charleston Battery", slug: "charleston",
    type: "club", league: "usl-l1", leagueName: "USL League One",
    crestUrl: "https://media.api-sports.io/soccer/clubs/11326.webp",
    primaryColor: "#FFD100", secondaryColor: "#000000",
  },
];

// ============================================================================
// Content generation utilities
// ============================================================================

export function generateContentForTeam(team: Team): ContentItem[] {
  const items: ContentItem[] = [];
  const matches = [...(team.schedule || []), ...(team.recentResults || [])];

  for (const match of matches) {
    if (match.status === "upcoming") {
      const matchDate = match.date || "";
      items.push({
        id: `${team.slug}-preview-${match.id}`,
        teamId: team.id,
        type: "preview",
        title: `Preview: ${team.name} vs ${match.opponent || "TBD"}`,
        body: `Match preview for ${team.name}'s upcoming fixture against ${match.opponent || "TBD"}. Kickoff at ${matchDate}. Venue: ${match.venue || "TBD"}.`,
        publishedAt: new Date().toISOString().split("T")[0],
        matchDate,
        opponent: match.opponent || "TBD",
        isHome: match.isHome ?? true,
        venue: match.venue || "TBD",
      });
    } else if (match.status === "completed" && match.score) {
      const hScore = match.score.home ?? 0;
      const aScore = match.score.away ?? 0;
      const isWin = (match.isHome && hScore > aScore) || (!match.isHome && aScore > hScore);
      const isDraw = hScore === aScore;
      const result = isWin ? "win" : isDraw ? "draw" : "loss";
      items.push({
        id: `${team.slug}-recap-${match.id}`,
        teamId: team.id,
        type: "recap",
        title: `Recap: ${team.name} ${result === "win" ? "defeat" : result === "draw" ? "draw with" : "lose to"} ${match.opponent || "TBD"} ${hScore}-${aScore}`,
        body: `Match recap: ${team.name} ${result} against ${match.opponent || "TBD"} with a score of ${hScore}-${aScore}. Venue: ${match.venue || "TBD"}.`,
        publishedAt: match.date || "",
        matchDate: match.date || "",
        opponent: match.opponent || "TBD",
        isHome: match.isHome ?? true,
        venue: match.venue || "TBD",
        score: { home: hScore, away: aScore },
      });
    }
  }

  return items;
}

// Re-export Team type for convenience
export type { Team } from "./types";

// ============================================================================
// World Cup knockout fixtures
// ============================================================================

type KnockoutFixture = [string, string, string, string, string];

const roundOf32: KnockoutFixture[] = [
  ["2026-06-27T16:00:00-04:00", "1A", "2B", "MetLife Stadium, New York", "R32-1"],
  ["2026-06-27T19:00:00-04:00", "1C", "2D", "Gillette Stadium, Boston", "R32-2"],
  ["2026-06-28T13:00:00-05:00", "1E", "2F", "NRG Stadium, Houston", "R32-3"],
  ["2026-06-28T16:00:00-05:00", "1G", "2H", "AT&T Stadium, Dallas", "R32-4"],
  ["2026-06-28T19:00:00-07:00", "1I", "2J", "SoFi Stadium, Los Angeles", "R32-5"],
  ["2026-06-29T13:00:00-04:00", "1K", "2L", "Hard Rock Stadium, Miami", "R32-6"],
  ["2026-06-29T16:00:00-07:00", "1B", "2A", "BC Place, Vancouver", "R32-7"],
  ["2026-06-29T19:00:00-07:00", "1D", "2C", "Levi's Stadium, San Francisco", "R32-8"],
  ["2026-06-30T13:00:00-05:00", "1F", "2E", "Estadio Azteca, Mexico City", "R32-9"],
  ["2026-06-30T16:00:00-04:00", "1H", "2G", "Mercedes-Benz Stadium, Atlanta", "R32-10"],
  ["2026-06-30T19:00:00-07:00", "1J", "2I", "Lumen Field, Seattle", "R32-11"],
  ["2026-07-01T13:00:00-05:00", "1L", "2K", "Estadio Universitario, Monterrey", "R32-12"],
  ["2026-07-01T16:00:00-04:00", "3A", "3B", "Lincoln Financial Field, Philadelphia", "R32-13"],
  ["2026-07-01T19:00:00-04:00", "3C", "3D", "BMO Field, Toronto", "R32-14"],
  ["2026-07-02T13:00:00-05:00", "3E", "3F", "Estadio Azteca, Mexico City", "R32-15"],
  ["2026-07-02T16:00:00-07:00", "3G", "3H", "Allegiant Stadium, Las Vegas", "R32-16"],
];

const roundOf16: KnockoutFixture[] = [
  ["2026-07-03T16:00:00-04:00", "W-R32-1", "W-R32-2", "MetLife Stadium, New York", "R16-1"],
  ["2026-07-03T19:00:00-05:00", "W-R32-3", "W-R32-4", "AT&T Stadium, Dallas", "R16-2"],
  ["2026-07-04T13:00:00-07:00", "W-R32-5", "W-R32-6", "SoFi Stadium, Los Angeles", "R16-3"],
  ["2026-07-04T16:00:00-07:00", "W-R32-7", "W-R32-8", "BC Place, Vancouver", "R16-4"],
  ["2026-07-05T13:00:00-05:00", "W-R32-9", "W-R32-10", "Estadio Azteca, Mexico City", "R16-5"],
  ["2026-07-05T16:00:00-04:00", "W-R32-11", "W-R32-12", "Mercedes-Benz Stadium, Atlanta", "R16-6"],
  ["2026-07-06T13:00:00-04:00", "W-R32-13", "W-R32-14", "Hard Rock Stadium, Miami", "R16-7"],
  ["2026-07-06T16:00:00-05:00", "W-R32-15", "W-R32-16", "NRG Stadium, Houston", "R16-8"],
];

const quarterFinals: KnockoutFixture[] = [
  ["2026-07-08T16:00:00-04:00", "W-R16-1", "W-R16-2", "MetLife Stadium, New York", "QF-1"],
  ["2026-07-09T16:00:00-07:00", "W-R16-3", "W-R16-4", "SoFi Stadium, Los Angeles", "QF-2"],
  ["2026-07-10T16:00:00-05:00", "W-R16-5", "W-R16-6", "Estadio Azteca, Mexico City", "QF-3"],
  ["2026-07-11T16:00:00-04:00", "W-R16-7", "W-R16-8", "Hard Rock Stadium, Miami", "QF-4"],
];

const semiFinals: KnockoutFixture[] = [
  ["2026-07-14T16:00:00-04:00", "W-QF-1", "W-QF-2", "MetLife Stadium, New York", "SF-1"],
  ["2026-07-15T16:00:00-07:00", "W-QF-3", "W-QF-4", "SoFi Stadium, Los Angeles", "SF-2"],
];

const thirdPlace: KnockoutFixture[] = [
  ["2026-07-18T16:00:00-05:00", "L-SF-1", "L-SF-2", "AT&T Stadium, Dallas", "3P"],
];

const final: KnockoutFixture[] = [
  ["2026-07-19T15:00:00-05:00", "W-SF-1", "W-SF-2", "AT&T Stadium, Dallas", "FINAL"],
];

// ============================================================================
// Exported utilities
// ============================================================================

export function searchTeams(query: string): Team[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allTeams
    .filter((t) => t.name.toLowerCase().includes(q) || t.slug.includes(q))
    .slice(0, 8);
}

export function getTeamBySlug(slug: string): Team | undefined {
  return allTeams.find((t) => t.slug === slug);
}

export function getTeamById(id: string): Team | undefined {
  return wc2026Teams.find((t) => t.id === id);
}

export function getMatchesForTeam(teamId: string): PartialMatch[] {
  const team = wc2026Teams.find((t) => t.id === teamId);
  if (!team) return [];
  return team.schedule || [];
}

export function getGroupStandings(group: string) {
  const groupTeams = wc2026Teams.filter((t) => t.group === group);
  const groupMatches: Match[] = [];
  for (const [date, homeId, awayId, venue] of groupFixtures[group] || []) {
    groupMatches.push({
      id: `${group}-match-${homeId}-${awayId}`,
      date,
      kickoff: date,
      homeTeamId: homeId,
      awayTeamId: awayId,
      homeTeam: wc2026Teams.find((t) => t.id === homeId)?.name || homeId,
      awayTeam: wc2026Teams.find((t) => t.id === awayId)?.name || awayId,
      homeTeamName: wc2026Teams.find((t) => t.id === homeId)?.name || homeId,
      awayTeamName: wc2026Teams.find((t) => t.id === awayId)?.name || awayId,
      homeScore: null,
      awayScore: null,
      venue,
      status: "upcoming",
      stage: "Group Stage",
      group,
      competition: `WC Group ${group}`,
      competitionType: "fifa-world-cup-2026",
    });
  }

  const standings = new Map<string, Standing>();
  for (const t of groupTeams) {
    standings.set(t.id, { position: 0, team: t.name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 });
  }

  for (const match of groupMatches) {
    const home = standings.get(match.homeTeamId!);
    const away = standings.get(match.awayTeamId!);
    if (!home || !away) continue;
    home.played++;
    away.played++;
    home.goalsFor++;
    home.goalsAgainst++;
    away.goalsFor++;
    away.goalsAgainst++;
    home.drawn++;
    away.drawn++;
    home.points++;
    away.points++;
  }

  const result = Array.from(standings.values()).sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
  result.forEach((s, i) => { s.position = i + 1; });
  return result;
}

export const worldCupVenues: string[] = [
  "SoFi Stadium, Los Angeles",
  "Levi's Stadium, San Francisco",
  "Lumen Field, Seattle",
  "BC Place, Vancouver",
  "Allegiant Stadium, Las Vegas",
  "Estadio Azteca, Mexico City",
  "Estadio Universitario, Monterrey",
  "NRG Stadium, Houston",
  "AT&T Stadium, Dallas",
  "Mercedes-Benz Stadium, Atlanta",
  "Hard Rock Stadium, Miami",
  "MetLife Stadium, New York",
  "Lincoln Financial Field, Philadelphia",
  "Gillette Stadium, Boston",
  "BMO Field, Toronto",
  "CenturyLink Field, Seattle",
];

export const validGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
