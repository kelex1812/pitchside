// ========================================
// CORE TYPES (Pitchside R2 — Unified Data Model)
// ========================================

// --- TeamType & MatchStatus ---
export type TeamType = "club" | "national";
export type MatchStatus = "upcoming" | "live" | "completed";

// --- Follow ---
export interface Follow {
  id: string;
  userId: string;
  teamId: string;
  createdAt: Date;
}

// --- PartialMatch: lightweight match for team schedule/feed ---
export interface PartialMatch {
  id?: string;
  date?: string;
  kickoff?: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homeTeam?: string | null;
  awayTeam?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  status?: MatchStatus;
  venue?: string;
  opponent?: string;
  isHome?: boolean;
  score?: { home: number | null; away: number | null };
  stage?: string;
  group?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  competition?: string;
  competitionType?: string;
  matchday?: number;
  leagueId?: string;
}

// --- ContentItem: generated preview/recap for team feed ---
export interface ContentItem {
  id: string;
  teamId: string;
  type: "preview" | "recap";
  title: string;
  body: string;
  publishedAt: string;
  matchDate: string;
  opponent: string;
  isHome: boolean;
  venue: string;
  score?: { home: number; away: number };
}

export interface Match {
  id: string;              // e.g., "match-123"
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: string | null;  // Team name for display
  awayTeam: string | null;
  homeScore: number | null;
  awayScore: number | null;
  homeTeamFlag?: string;
  awayTeamFlag?: string;
  date: string;
  kickoff?: string;         // Alias for date (some data sources use kickoff)
  status: MatchStatus;
  venue?: string;
  round?: string;
  matchday?: number;
  stage?: string;
  group?: string;
  competition?: string;
  competitionType?: string;
  opponent?: string;
  isHome?: boolean;
  homeTeamIdStr?: string;
  awayTeamIdStr?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  leagueId?: string;
  tournamentStageId?: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  type: TeamType;
  league?: string;
  leagueId?: string;
  leagueName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  crestUrl?: string;
  shortName?: string;
  caps?: number;
  goals?: number;
  flag?: string;
  schedule?: PartialMatch[];
  recentResults?: PartialMatch[];
  standings?: {
    position: number;
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }[];
  nextMatch?: PartialMatch;
  fifaRank?: number;
  group?: string;
  news?: {
    title: string;
    source: string;
    url: string;
    publishedAt: string;
  }[];
}

// --- Standing (group/league position row) ---
export interface Standing {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// --- League ---
export interface League {
  id: string;
  name: string;
  slug: string;
  country: string;
  type?: "club" | "international-club";
  logoUrl?: string;
  teams: { id: string; name: string; slug: string; type: TeamType; crestUrl?: string; flag?: string }[];
  standings?: {
    position: number;
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }[];
  matches?: Match[];
}

// --- Tournament ---
export type TournamentCategory = "world-cup" | "continental-championship" | "olympics" | "confederations-cup" | "friendlies" | "qualifiers";
export type TournamentStatus = "upcoming" | "ongoing" | "completed";

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  category: TournamentCategory;
  hostCountries?: string[];
  seasonStart: Date;
  seasonEnd: Date;
  status: TournamentStatus;
  stages: TournamentStage[];
  groupStandings?: Standing[][];
  teams: Team[];
  matches: Match[];
  knockoutResults?: KnockoutBracket;
}

export interface TournamentStage {
  id: string;            // UUID, PK
  name: string;
  stageOrder: number;
  startDate: Date;
  endDate: Date;
  matchCount: number;
  description?: string;
  isKnockout?: boolean;
}

export interface TeamRoster {
  tournamentId: string;  // FK → Tournament.id
  teamId: string;        // FK → Team.id (national team)
  entries: TeamRosterEntry[];
}

export interface TeamRosterEntry {
  squadNumber: number;
  playerId: string;
  playerName: string;
  position: "GK" | "DF" | "MF" | "FW";
  appearances?: number;
  goals?: number;
  assists?: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: "GK" | "DF" | "MF" | "FW";
  squadNumber: number;
  caps?: number;
  goals?: number;
}

// ========================================
// KNOCKOUT BRACKET (Epic 4)
// ========================================

export interface KnockoutMatch {
  id: string;            // e.g., "R32-1"
  stage: string;         // e.g., "Round of 32"
  roundOrder: number;    // 1 = Round of 32, 2 = Round of 16, etc.
  homeTeam: string | null;
  awayTeam: string | null;
  homeTeamFlag?: string;
  awayTeamFlag?: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string | null;
  venue: string | null;
  winner: string | null; // Team slug (propagated after match)
  nextMatchId: string | null;
  defeatedTeam: string | null;
}

export type KnockoutBracket = KnockoutMatch[];

// ========================================
// HOME PAGE STATE (Epic 2)
// ========================================

export type TournamentPhase = "group" | "knockout";

export interface TournamentState {
  phase: TournamentPhase;
  phaseEndDate: Date | null;   // Last group match date
  lastUpdated: Date;
}
