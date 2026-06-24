import { Team, Match, Standing, NewsItem, ContentItem } from "./types";

export type { Team, Match, Standing, NewsItem, ContentItem };

// ============================================================================
// Utility functions
// ============================================================================

function generatePreview(match: Match, teamName: string, teamShortName: string): ContentItem {
  const matchDate = new Date(match.date);
  const dayName = matchDate.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = matchDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const timeStr = matchDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
  const location = match.isHome ? teamName : match.opponent || "";
  const locationLabel = match.isHome ? "home" : "away";

  return {
    id: `preview-${teamName.toLowerCase().replace(/\s+/g, "-")}-${(match.opponent || "").toLowerCase().replace(/\s+/g, "-")}`,
    teamId: teamName,
    type: "preview",
    title: `${teamShortName} vs ${match.opponent || ""} — Match Preview`,
    body: `${teamName} face ${match.opponent || ""} on ${dayName}, ${monthDay} at ${timeStr} in a ${locationLabel} fixture at ${match.venue}. The sides meet with plenty at stake as the season enters a crucial phase.`,
    publishedAt: new Date(matchDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    matchDate: match.date,
    opponent: match.opponent || "",
    isHome: match.isHome,
    venue: match.venue,
  };
}

function generateRecap(match: Match, teamName: string, teamShortName: string): ContentItem {
  const matchDate = new Date(match.date);
  const monthDay = matchDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const score = match.score || { home: 0, away: 0 };
  const homeScore = match.isHome ? score.home : score.away;
  const awayScore = match.isHome ? score.away : score.home;

  let resultWord: string;
  let emotion: string;
  if (homeScore > awayScore) {
    resultWord = "win";
    emotion = match.isHome ? "a dominant home victory" : "a gutsy away victory";
  } else if (homeScore === awayScore) {
    resultWord = "draw";
    emotion = "a hard-fought draw";
  } else {
    resultWord = "defeat";
    emotion = match.isHome ? "a tough home loss" : "a disappointing away loss";
  }

  return {
    id: `recap-${teamName.toLowerCase().replace(/\s+/g, "-")}-${(match.opponent || "").toLowerCase().replace(/\s+/g, "-")}`,
    teamId: teamName,
    type: "recap",
    title: `${teamShortName} ${homeScore}-${awayScore} ${resultWord.charAt(0).toUpperCase() + resultWord.slice(1)} vs ${match.opponent || ""} — Match Recap`,
    body: `${teamName} secured ${emotion} on ${monthDay}, defeating ${match.opponent || ""} ${homeScore}-${awayScore} at ${match.venue}. The result keeps ${teamShortName} in contention as the season progresses.`,
    publishedAt: new Date(matchDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    matchDate: match.date,
    opponent: match.opponent || "",
    isHome: match.isHome,
    venue: match.venue,
    score: match.score,
  };
}

export function generateContentForTeam(team: Team): ContentItem[] {
  const items: ContentItem[] = [];
  if (!team.schedule) return items;

  for (const match of team.schedule) {
    items.push(generatePreview(match, team.name, team.shortName));
  }

  if (team.recentResults) {
    for (const match of team.recentResults) {
      if (match.score) {
        items.push(generateRecap(match, team.name, team.shortName));
      }
    }
  }

  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return items;
}

// ============================================================================
// Club Teams
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
    date: "2026-06-20T20:00:00Z",
    opponent: "Real Madrid",
    venue: "Estadi OlÃ­mpic LluÃ­s Companys, Barcelona",
    isHome: true,
    status: "upcoming",
  },
  recentResults: [
    { date: "2026-06-14T19:00:00Z", opponent: "Sevilla", venue: "Estadi OlÃ­mpic LluÃ­s Companys, Barcelona", isHome: true, score: { home: 3, away: 1 }, status: "completed" },
    { date: "2026-06-08T20:00:00Z", opponent: "Atletico Madrid", venue: "Metropolitano, Madrid", isHome: false, score: { home: 1, away: 2 }, status: "completed" },
    { date: "2026-06-01T21:00:00Z", opponent: "Valencia", venue: "Estadi OlÃ­mpic LluÃ­s Companys, Barcelona", isHome: true, score: { home: 2, away: 0 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-20T20:00:00Z", opponent: "Real Madrid", venue: "Estadi OlÃ­mpic LluÃ­s Companys, Barcelona", isHome: true, status: "upcoming" },
    { date: "2026-06-27T18:30:00Z", opponent: "Real Sociedad", venue: "Reale Arena, San SebastiÃ¡n", isHome: false, status: "upcoming" },
    { date: "2026-07-04T21:00:00Z", opponent: "Athletic Bilbao", venue: "Estadi OlÃ­mpic LluÃ­s Companys, Barcelona", isHome: true, status: "upcoming" },
    { date: "2026-07-11T20:00:00Z", opponent: "Villarreal", venue: "Estadi de la CerÃ¡mica, Vila-real", isHome: false, status: "upcoming" },
    { date: "2026-07-18T19:00:00Z", opponent: "Real Betis", venue: "Estadi OlÃ­mpic LluÃ­s Companys, Barcelona", isHome: true, status: "upcoming" },
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

export const nycfc: Team = {
  id: "nycfc",
  name: "New York City FC",
  shortName: "NYCFC",
  slug: "nycfc",
  type: "club",
  league: "mls",
  leagueName: "Major League Soccer",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/New_York_City_FC_2015.svg/1200px-New_York_City_FC_2015.svg.png",
  primaryColor: "#66ABDA",
  secondaryColor: "#FF6F00",
  nextMatch: {
    date: "2026-06-21T19:30:00Z",
    opponent: "Atlanta United",
    venue: "Yankee Stadium, Bronx, NY",
    isHome: true,
    status: "upcoming",
  },
  recentResults: [
    { date: "2026-06-15T00:00:00Z", opponent: "Philadelphia Union", venue: "Yankee Stadium, Bronx, NY", isHome: true, score: { home: 2, away: 1 }, status: "completed" },
    { date: "2026-06-09T00:00:00Z", opponent: "Inter Miami", venue: "DRV PNK Stadium, Fort Lauderdale", isHome: false, score: { home: 2, away: 2 }, status: "completed" },
    { date: "2026-06-02T00:00:00Z", opponent: "Charlotte FC", venue: "Yankee Stadium, Bronx, NY", isHome: true, score: { home: 3, away: 0 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-21T19:30:00Z", opponent: "Atlanta United", venue: "Yankee Stadium, Bronx, NY", isHome: true, status: "upcoming" },
    { date: "2026-06-28T23:30:00Z", opponent: "LA Galaxy", venue: "Dignity Health Sports Park, Carson, CA", isHome: false, status: "upcoming" },
    { date: "2026-07-03T19:30:00Z", opponent: "New York Red Bulls", venue: "Yankee Stadium, Bronx, NY", isHome: true, status: "upcoming" },
    { date: "2026-07-10T20:00:00Z", opponent: "Columbus Crew", venue: "Lower.com Field, Columbus, OH", isHome: false, status: "upcoming" },
    { date: "2026-07-17T19:30:00Z", opponent: "FC Cincinnati", venue: "Yankee Stadium, Bronx, NY", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Inter Miami", played: 18, won: 12, drawn: 3, lost: 3, goalsFor: 38, goalsAgainst: 18, goalDifference: 20, points: 39 },
    { position: 2, team: "New York City FC", played: 18, won: 11, drawn: 4, lost: 3, goalsFor: 34, goalsAgainst: 17, goalDifference: 17, points: 37 },
    { position: 3, team: "New York Red Bulls", played: 18, won: 10, drawn: 5, lost: 3, goalsFor: 30, goalsAgainst: 19, goalDifference: 11, points: 35 },
    { position: 4, team: "Atlanta United", played: 18, won: 10, drawn: 4, lost: 4, goalsFor: 32, goalsAgainst: 21, goalDifference: 11, points: 34 },
    { position: 5, team: "Columbus Crew", played: 18, won: 9, drawn: 5, lost: 4, goalsFor: 28, goalsAgainst: 20, goalDifference: 8, points: 32 },
    { position: 6, team: "FC Cincinnati", played: 18, won: 9, drawn: 4, lost: 5, goalsFor: 26, goalsAgainst: 22, goalDifference: 4, points: 31 },
    { position: 7, team: "Charlotte FC", played: 18, won: 8, drawn: 3, lost: 7, goalsFor: 22, goalsAgainst: 24, goalDifference: -2, points: 27 },
    { position: 8, team: "Philadelphia Union", played: 18, won: 7, drawn: 4, lost: 7, goalsFor: 24, goalsAgainst: 26, goalDifference: -2, points: 25 },
  ],
  news: [
    { title: "NYCFC beat Philadelphia Union 2-1 at Yankee Stadium", source: "NYCFC Official", url: "https://www.nycfc.com", publishedAt: "2026-06-15" },
    { title: "NYCFC draw 2-2 with Inter Miami in top-of-table clash", source: "MLS", url: "https://www.mlssoccer.com", publishedAt: "2026-06-09" },
    { title: "NYCFC cruise past Charlotte 3-0 in dominant display", source: "ESPN", url: "https://www.espn.com", publishedAt: "2026-06-02" },
  ],
};

export const richmond: Team = {
  id: "richmond",
  name: "Richmond Kickers",
  shortName: "RKS",
  slug: "richmond",
  type: "club",
  league: "usl-l1",
  leagueName: "USL League One",
  crestUrl: "https://media.api-sports.io/soccer/teams/3955.png",
  primaryColor: "#8B0000",
  secondaryColor: "#FFFFFF",
  nextMatch: {
    date: "2026-06-21T23:00:00Z",
    opponent: "Lubbock CRC",
    venue: "City Stadium, Richmond, VA",
    isHome: true,
    status: "upcoming",
  },
  recentResults: [
    { date: "2026-06-14T23:00:00Z", opponent: "Greenville Triumph", venue: "Education Credit Union Market, Greenville", isHome: false, score: { home: 1, away: 1 }, status: "completed" },
    { date: "2026-06-08T23:00:00Z", opponent: "Birmingham Legion", venue: "City Stadium, Richmond, VA", isHome: true, score: { home: 2, away: 0 }, status: "completed" },
    { date: "2026-06-01T23:00:00Z", opponent: "Fort Lauderdale CF", venue: "City Stadium, Richmond, VA", isHome: true, score: { home: 3, away: 1 }, status: "completed" },
  ],
  schedule: [
    { date: "2026-06-21T23:00:00Z", opponent: "Lubbock CRC", venue: "City Stadium, Richmond, VA", isHome: true, status: "upcoming" },
    { date: "2026-06-27T23:00:00Z", opponent: "Chattanooga Red Wolves", venue: "City Stadium, Richmond, VA", isHome: true, status: "upcoming" },
    { date: "2026-07-04T22:00:00Z", opponent: "South Georgia Tormenta", venue: "Tormenta Stadium, Statesboro, GA", isHome: false, status: "upcoming" },
    { date: "2026-07-11T23:00:00Z", opponent: "FC Tulsa", venue: "ONEOK Field, Tulsa, OK", isHome: false, status: "upcoming" },
    { date: "2026-07-18T23:00:00Z", opponent: "Greenville Triumph", venue: "City Stadium, Richmond, VA", isHome: true, status: "upcoming" },
  ],
  standings: [
    { position: 1, team: "Lubbock CRC", played: 16, won: 11, drawn: 2, lost: 3, goalsFor: 30, goalsAgainst: 14, goalDifference: 16, points: 35 },
    { position: 2, team: "Richmond Kickers", played: 16, won: 10, drawn: 3, lost: 3, goalsFor: 28, goalsAgainst: 15, goalDifference: 13, points: 33 },
    { position: 3, team: "Birmingham Legion", played: 16, won: 9, drawn: 4, lost: 3, goalsFor: 25, goalsAgainst: 16, goalDifference: 9, points: 31 },
    { position: 4, team: "Greenville Triumph", played: 16, won: 8, drawn: 3, lost: 5, goalsFor: 22, goalsAgainst: 18, goalDifference: 4, points: 27 },
    { position: 5, team: "South Georgia Tormenta", played: 16, won: 7, drawn: 4, lost: 5, goalsFor: 20, goalsAgainst: 19, goalDifference: 1, points: 25 },
    { position: 6, team: "FC Tulsa", played: 16, won: 6, drawn: 4, lost: 6, goalsFor: 18, goalsAgainst: 20, goalDifference: -2, points: 22 },
    { position: 7, team: "Fort Lauderdale CF", played: 16, won: 5, drawn: 3, lost: 8, goalsFor: 16, goalsAgainst: 24, goalDifference: -8, points: 18 },
    { position: 8, team: "Chattanooga Red Wolves", played: 16, won: 3, drawn: 2, lost: 11, goalsFor: 12, goalsAgainst: 30, goalDifference: -18, points: 11 },
  ],
  news: [
    { title: "Richmond Kickers draw 1-1 away at Greenville Triumph", source: "Richmond Kickers Official", url: "https://www.richmondkickers.com", publishedAt: "2026-06-14" },
    { title: "Richmond Kickers dominate Birmingham 2-0 at City Stadium", source: "USL League One", url: "https://www.uslleagueone.com", publishedAt: "2026-06-08" },
    { title: "Richmond Kickers thrash Fort Lauderdale 3-1 in front of home crowd", source: "Richmond Times-Dispatch", url: "https://www.richmond.com", publishedAt: "2026-06-01" },
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
  { id: "peru", name: "Peru", shortName: "PER", slug: "peru", flag: "\uD83C\uDDF5\uD83C\uDDEA", type: "national", group: "J", fifaRank: 35 },
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

// World Cup group stage fixtures: [date, homeId, awayId, venue]
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
        date,
        opponent: opponent?.name || opponentId,
        venue,
        isHome,
        status: "upcoming",
        stage: "Group Stage",
        group: team.group,
      });
    }
  }

  // Sort by date
  matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const now = new Date();
  const upcoming = matches.map((m) =>
    new Date(m.date) > now ? m : { ...m, status: "completed" as const }
  ).filter((m) => m.status === "upcoming");
  const completed = matches.map((m) =>
    new Date(m.date) <= now
      ? { ...m, status: "completed" as const, score: { home: 0, away: 0 } }
      : m
  ).filter((m) => m.status === "completed");

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

export const allTeams: Team[] = [barcelona, nycfc, richmond, ...wc2026Teams];

// ============================================================================
// World Cup fixtures data (kept for group pages and schedule lookup)
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

export function searchTeams(query: string): Team[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return wc2026Teams
    .filter((t) => t.name.toLowerCase().includes(q) || t.slug.includes(q))
    .slice(0, 8);
}

export function getTeamBySlug(slug: string): Team | undefined {
  return wc2026Teams.find((t) => t.slug === slug);
}

export function getTeamById(id: string): Team | undefined {
  return wc2026Teams.find((t) => t.id === id);
}

export function getMatchesForTeam(teamId: string): Match[] {
  const team = wc2026Teams.find((t) => t.id === teamId);
  if (!team) return [];
  return team.schedule || [];
}

export function getGroupStandings(group: string) {
  const groupTeams = wc2026Teams.filter((t) => t.group === group);
  const groupMatches: Match[] = [];
  for (const [date, homeId, awayId, venue] of groupFixtures[group] || []) {
    groupMatches.push({
      date,
      homeTeamId: homeId,
      awayTeamId: awayId,
      venue,
      isHome: true,
      status: "upcoming",
      stage: "Group Stage",
      group,
    });
  }

  interface StandingRow {
    teamId: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  }

  const standings = new Map<string, StandingRow>();
  for (const t of groupTeams) {
    standings.set(t.id, { teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
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
    // Without actual scores, all are 0-0 (upcoming), so default to draws for display
    home.drawn++;
    away.drawn++;
    home.points++;
    away.points++;
  }

  return Array.from(standings.values()).sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
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
