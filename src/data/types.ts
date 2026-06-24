export type TeamType = "club" | "national";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  type: TeamType;
  league?: string;
  leagueName?: string;
  // Club team fields
  crestUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  // World Cup team fields
  flag?: string;
  group?: string;
  fifaRank?: number;
  nextMatch?: Match;
  recentResults?: Match[];
  schedule?: Match[];
  standings?: Standing[];
  news?: NewsItem[];
}

export interface Match {
  date: string;
  opponent?: string;
  venue: string;
  isHome: boolean;
  score?: { home: number; away: number };
  status: "upcoming" | "completed";
  // World Cup specific
  homeTeamId?: string;
  awayTeamId?: string;
  stage?: Stage;
  group?: string;
  homeScore?: number | null;
  awayScore?: number | null;
}

export type Stage =
  | "Group Stage"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-finals"
  | "Semi-finals"
  | "Third Place"
  | "Final";

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

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export interface ContentItem {
  id: string;
  teamId: string;
  type: "preview" | "recap" | "article";
  title: string;
  body: string;
  publishedAt: string;
  matchDate: string;
  opponent: string;
  isHome: boolean;
  venue: string;
  score?: { home: number; away: number };
}

export interface League {
  id: string;
  name: string;
  slug: string;
  season: string;
}

export interface TeamWithMatches extends Team {
  matches: Match[];
}
