# Pitchside R2 — Epic 4: International Soccer Requirements

**Prepared by:** Lois Lane (BA)
**Date:** 2026-06-24
**Epic:** 4 of 4 (Auth, Homepage, League Directory, International Soccer)
**Workspace:** `/Users/kelex/Documents/pitchside`

---

## 1. Overview

Epic 4 builds the **International Soccer** section of Pitchside — a browsable collection of ongoing and upcoming international tournaments (World Cup, continental championships, qualifiers). It introduces three key pages:

1. **International Overview** (`/international`) — list/grid of all international tournaments, with search and category filtering
2. **Tournament Detail** (`/tournament/[slug]`) — tabs for Groups, Standings, Fixtures, Knockout Bracket, and Team Roster
3. **National Team Page** (`/national-team/[slug]`) — team overview with tournament tabs organized by competition

The epic also introduces new data model entities (`Tournament`, `TournamentStage`, `TeamRoster`) and extends `Match` with a `competitionType` field.

**Content constraint:** All data is static seeded data only (`src/data/`). No API integration in R2.

**Out of scope:** International club competitions (Champions League, Europa League — these are Epic 3), live score push updates, multi-language support, betting odds, streaming/embed links, squad depth charts, player statistics beyond match goals.

---

## 2. Shared Conventions Compliance

This doc adheres to `shared-conventions.md` (Sections 1–9). Key decisions adopted without redefinition:

| Convention | Decision (from shared-conventions.md) |
|------------|----------------------------------------|
| Route — International Overview | `/international` (public, no auth required) — Section 2 route table |
| Route — Tournament Detail | `/tournament/[slug]` (public, no auth required) — Section 2 route table |
| Route — National Team Detail | `/national-team/[slug]` (public, no auth required) — Section 2 route table |
| Slug Convention | Kebab-case, lowercase. Examples: `fifa-world-cup-2026`, `euro-2024`, `usa` — Section 7.1 |
| Team ID | `Team.id` is UUID (PK). `Team.slug` is kebab-case (URL only). Follow entity uses `Team.id` — Section 3.1 |
| Team Type | `type: "club" | "national"` — Section 3.1. International soccer uses `national` teams. |
| Match Status | `MatchStatus = "upcoming" | "live" | "completed"` — Section 4. Used on tournament fixture tabs. |
| Standings Computation | Single shared function `computeStandings(matches, teams)` in `src/lib/standings.ts` — Section 5.1. Tournament group standings reuse this exact function. Sorting: Pts desc → GD desc → GF desc. **Shared with Epic 2 and Epic 3.** |
| Knockout Bracket | Single shared function `computeKnockoutResults()` in `src/lib/standings.ts` — Section 5.2. Tournament knockout brackets reuse this exact function. **Shared with Epic 2.** |
| Timezone | Dates stored in UTC on data layer, converted on client. Logged-in users: `UserPreference.timezone`. Anonymous: browser timezone or UTC default — Section 7.2 |
| Dark Theme | Dark-only. `bg-slate-950 text-slate-300 antialiased`. No light mode — Section 7.4 |
| Component locations | Shared components → `src/components/`, page components → `src/app/[route]/page.tsx`, types → `src/data/types.ts`, utilities → `src/lib/`, hooks → `src/hooks/` — Section 6.4 |
| Data layer | Static seeded data from `src/data/` only. Repository function pattern in `src/lib/` abstracts the source for future API swap — Section 7.3 |
| Navigation | Unified header: Home, Leagues (active on `/leagues` and `/league/[slug]`), International (active on `/international` and `/tournament/[slug]`), Search, Follows (logged in) — Section 1 |
| Team page tabs | Conditional: "Club" if team has club matches, "International" if team has international matches — Section 6.1. National teams display "International" tab (Epic 4 scope). |

**Decisions specific to Epic 4 not yet in conventions:**
- `Tournament` and `TournamentStage` entities with category, phases, and hosting countries
- `Match.competitionType` field ("world-cup", "euro", "copa-america", "gold-cup", "nations-league", "friendlies")
- `TeamRoster` entity with squad number, position, and appearances
- `Team.caps` and `Team.goals` fields for international stats
- Tournament seed data scope: World Cup 2026 (primary), Copa America 2024, Euro 2024 as placeholders
- Knockout brackets only appear on tournaments with a knockout phase (World Cup 2026: yes; group-only tournaments: no)

---

## 3. Data Model

### 3.1 Tournament Entity (New)

```typescript
// src/data/types.ts (new)
interface Tournament {
  id: string;            // UUID, PK — "fifa-world-cup-2026"
  name: string;          // Display name: "FIFA World Cup 2026", "Euro 2024"
  slug: string;          // kebab-case, used in URLs (/tournament/[slug])
  category: TournamentCategory; // e.g., "world-cup", "continental-championship"
  logoUrl?: string;      // Tournament logo for directory
  hostCountries: string[]; // ["USA", "Canada", "Mexico"]
  seasonStart: Date;     // e.g., 2026-06-11
  seasonEnd: Date;       // e.g., 2026-07-19
  status: TournamentStatus; // "upcoming" | "ongoing" | "completed"
  stages: TournamentStage[]; // Ordered list of stages (group, knockout, etc.)
  groupStandings?: Standing[]; // Per-group standings (populated from seed data)
  teams: Team[];         // Reference to teams in this tournament
  matches: Match[];      // Reference to all tournament matches
  knockoutResults?: KnockoutBracket; // Knockout bracket data (if applicable)
}

type TournamentCategory =
  | "world-cup"
  | "continental-championship"
  | "olympics"
  | "confederations-cup"
  | "friendlies"
  | "qualifiers";

type TournamentStatus = "upcoming" | "ongoing" | "completed";
```

### 3.2 Tournament Stage Entity (New)

```typescript
// src/data/types.ts (new)
interface TournamentStage {
  id: string;            // UUID, PK — "wc2026-group", "wc2026-knockout"
  name: string;          // "Group Stage", "Round of 32", "Quarter-finals"
  stageOrder: number;    // Sort order (1 = first)
  startDate: Date;
  endDate: Date;
  matchCount: number;    // Total matches in this stage
  description?: string;  // e.g., "12 groups of 4, top 2 + 4 best 3rd place advance"
  isKnockout?: boolean;  // true for knockout stages, false for group stages
}
```

### 3.3 TeamRoster Entity (New)

```typescript
// src/data/types.ts (new)
interface TeamRoster {
  tournamentId: string;    // FK → Tournament.id
  teamId: string;          // FK → Team.id (national team)
  entries: TeamRosterEntry[];
}

interface TeamRosterEntry {
  squadNumber: number;
  playerId: string;        // FK → Player.id (or name fallback)
  playerName: string;      // Display name
  position: "GK" | "DF" | "MF" | "FW";
  appearances?: number;    // Matches played in this tournament
  goals?: number;          // Goals scored in this tournament
  assists?: number;        // Assists in this tournament
}
```

### 3.4 Player Entity (New — optional, fallback to name string)

```typescript
// src/data/types.ts (new)
interface Player {
  id: string;
  name: string;
  teamId: string;
  position: "GK" | "DF" | "MF" | "FW";
  squadNumber: number;
  caps?: number;
  goals?: number;
}
```

### 3.5 Team Entity (Extended)

```typescript
// src/data/types.ts (extended)
interface Team {
  id: string;            // UUID, PK
  name: string;
  slug: string;          // kebab-case
  type: "club" | "national";
  crestUrl: string;
  flag: string;          // country flag emoji or URL (for national teams)
  // ... existing fields
  caps?: number;         // International caps (NEW — national teams only)
  goals?: number;        // International goals scored (NEW — national teams only)
  // null for club teams
}
```

### 3.6 Match Entity (Extended)

```typescript
// src/data/types.ts (extended)
interface Match {
  date: string;
  opponent?: string;
  venue: string;
  isHome: boolean;
  score?: { home: number; away: number };
  status: "upcoming" | "live" | "completed";
  homeTeamId?: string;
  awayTeamId?: string;
  stage?: Stage;
  group?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  competitionType?: string; // NEW — identifies the tournament: "fifa-world-cup-2026", "euro-2024", etc.
}
```

### 3.7 Data File Structure

```
src/data/
  tournaments.ts        → Tournament[] array (1+ tournaments)
  rosters.ts            → TeamRoster[] array
  players.ts            → Player[] array (optional, if roster uses Player objects)
  teams.ts              → Extended with caps/goals for national teams
  types.ts              → Extended with Tournament, TournamentStage, TeamRoster, Player
```

### 3.8 KnockoutBracket (New — extends existing)

The shared `computeKnockoutResults()` in `src/lib/standings.ts` returns a `KnockoutBracket` structure:

```typescript
// src/data/types.ts (new)
interface KnockoutMatch {
  id: string;              // e.g., "R32-1"
  stage: string;           // e.g., "Round of 32"
  roundOrder: number;      // 1 = Round of 32, 2 = Round of 16, etc.
  homeTeam: string | null; // Team name or "TBD"
  awayTeam: string | null; // Team name or "TBD"
  homeScore: number | null;
  awayScore: number | null;
  date: string | null;     // ISO string or null if TBD
  venue: string | null;
  nextMatchId: string | null; // FK to next round match (for bracket visualization)
  defeatedTeam: string | null; // For bracket display, which team was eliminated
}

type KnockoutBracket = KnockoutMatch[];
```

---

## 4. Route Table

| Page | Route | Auth | Description |
|------|-------|------|-------------|
| International Overview | `/international` | Public | Lists all tournaments with search/category filter |
| Tournament Detail | `/tournament/[slug]` | Public | Groups, standings, fixtures, knockout bracket, team roster |
| National Team Detail | `/national-team/[slug]` | Public | Team overview with tournament tabs |

---

## 5. Component Inventory

### 5.1 Epic 4 Exclusive Components

| Component | Location | Props | Description | Parent Page |
|-----------|----------|-------|-------------|-------------|
| `TournamentCard` | `src/components/TournamentCard.tsx` | `tournament: Tournament` | Small card for overview page: logo, name, dates, status badge | International Overview |
| `TournamentGrid` | `src/components/TournamentGrid.tsx` | `tournaments: Tournament[]` | Grid layout of TournamentCard components | International Overview |
| `TournamentTabs` | `src/components/TournamentTabs.tsx` | `tournament: Tournament` | Tab bar (Groups, Standings, Fixtures, Knockout, Teams) | Tournament Detail |
| `GroupStandings` | `src/components/GroupStandings.tsx` | `standings: Standing[]`, `groupName: string` | Standings table for a single group | Tournament Detail |
| `GroupFixtures` | `src/components/GroupFixtures.tsx` | `fixtures: Match[]`, `group: string` | Fixtures table for a single group | Tournament Detail |
| `KnockoutBracketView` | `src/components/KnockoutBracketView.tsx` | `knockout: KnockoutBracket` | Visual bracket rendering of knockout matches | Tournament Detail |
| `TeamRosterTable` | `src/components/TeamRosterTable.tsx` | `roster: TeamRoster` | Roster table with position, squad number, name, goals | Tournament Detail |
| `NationalTeamHeader` | `src/components/NationalTeamHeader.tsx` | `team: Team` | National team page header: flag, name, caps, goals | National Team Detail |
| `InternationalMatchFeed` | `src/components/InternationalMatchFeed.tsx` | `matches: Match[]` | Match cards filtered by competitionType | National Team Detail |
| `TournamentSearchFilter` | `src/components/TournamentSearchFilter.tsx` | `categories: TournamentCategory[]` | Search input + category filter chips | International Overview |

### 5.2 Shared Components (from Epic 2, Epic 3)

| Component | Source Epic | Epic 4 Usage |
|-----------|-------------|--------------|
| `Header` | Convention | Navigation: Home, Leagues, International, Search |
| `TeamCard` | Convention | Small team card on tournament page |
| `MatchCard` | Convention | Match card on fixtures tab |
| `StandingsTable` | Epic 3 | Standings tab — reused for group standings |
| `standings.ts` (computeStandings) | Convention | Shared standings computation — Epic 2, 3, 4 all use this |
| `standings.ts` (computeKnockoutResults) | Convention | Shared knockout computation — Epic 2 and 4 use this |
| `Leaderboard` | Convention | Leaderboard on tournament detail |
| `CalendarExport` | Convention | Calendar export including international matches |

---

## 6. Wireframes / Layout Descriptions

### 6.1 International Overview (`/international`)

```
┌─────────────────────────────────────────────┐
│  Header [Home, Leagues, International,      │
│              Search, Follows]                │
├─────────────────────────────────────────────┤
│                                             │
│  International Soccer                       │
│  Browse ongoing and upcoming tournaments    │
│                                             │
│  [Search all tournaments...]  [▼ Categories]│
│  [All] [World Cup] [Continental]            │
│         [Olympics] [Friendlies]             │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────┐         │
│  │ ┌──────────┐ │  │ ┌──────────┐ │         │
│  │ │ Logo     │ │  │ │ Logo     │ │         │
│  │ │ World    │ │  │ │ Euro     │ │         │
│  │ │ Cup 2026 │ │  │ │ 2024     │ │         │
│  │ └──────────┘ │  │ └──────────┘ │         │
│  │ Jun 11 -    │  │ Jun 14 -    │          │
│  │ Jul 19, 2026│  │ Jul 14, 2024│          │
│  │ [Ongoing]   │  │ [Completed] │          │
│  │ USA, Canada,│  │ Europe      │             │
│  │ Mexico      │  │             │          │
│  └──────────────┘  └──────────────┘         │
│                                             │
│  ┌──────────────┐  ┌──────────────┐         │
│  │ ┌──────────┐ │  │ ┌──────────┐ │         │
│  │ │ Logo     │ │  │ │ Logo     │ │         │
│  │ │ Copa     │ │  │ │ Gold Cup │ │         │
│  │ │ America  │ │  │ │ 2025     │ │         │
│  │ │ 2024     │ │  │ └──────────┘ │         │
│  │ │ Jun 20 - │ │  │             │          │
│  │ │ Jul 14,  │ │  │ ┌──────────────┐       │
│  │ │ 2024     │ │  │ │ ┌──────────┐ │       │
│  │ │ South    │ │  │ │ │ Logo     │ │       │
│  │ │ America  │ │  │ │ │ Logo     │ │       │
│  │ │          │ │  │ │ │ Upcoming │ │       │
│  │ │          │ │  │ │ │ [TBD]    │ │       │
│  └──────────────┘  │ └──────────────┘       │
│                    │ (more cards as data)     │
└─────────────────────────────────────────────┘
```

### 6.2 Tournament Detail (`/tournament/fifa-world-cup-2026`)

```
┌─────────────────────────────────────────────┐
│  Header [Home, Leagues, International,      │
│              Search, Follows]                │
├─────────────────────────────────────────────┤
│                                             │
│  FIFA World Cup 2026                        │
│  Jun 11 – Jul 19, 2026 • USA, Canada, Mexico│
│                                             │
│  [Groups] [Standings] [Fixtures] [Knockout] │
│  [Teams]                                    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ── Groups Tab ──                           │
│                                             │
│  Group A          Group B          Group C   │
│  ┌──────────────┐ ┌──────────────┐          │
│  │ # Team   Pts │ │ # Team   Pts │          │
│  │ 1 USA      7 │ │ 1 France   7 │          │
│  │ 2 Uruguay  4 │ │ 2 Canada   4 │          │
│  │ 3 Portugal 1  │ │ 3 Senegal  1  │          │
│  │ 4 Algeria  0 │ │ 4 KSA     0 │            │
│  └──────────────┘ └──────────────┘          │
│  [View more groups →]                       │
│                                             │
│  ── Standings Tab ──                        │
│  (Aggregate standing across all groups,     │
│   top 24 teams ranked by points/GD/GF)      │
│  ┌──────────────────────────────────────┐   │
│  │ #  Team   P  W  D  L  GF  GA  GD  Pts│   │
│  │ 1  USA    3  3  0  0   6   1  5  9  │   │
│  │ 2  France  3  3  0  0   7   2  5  9  │   │
│  │ ...                                   │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ── Fixtures Tab ──                         │
│  ┌──────────────────────────────────────┐   │
│  │ Jun 11                                │   │
│  │ ┌──────────────────────────────────┐ │   │
│  │ │ USA   2 - 1  Uruguay             │ │   │
│  │ │   SoFi Stadium, Los Angeles       │ │   │
│  │ └──────────────────────────────────┘ │   │
│  │ ...                                 │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ── Knockout Tab ──                         │
│  ┌──────────────────────────────────────┐   │
│  │          Round of 32                  │   │
│  │  ┌────────┐    ┌────────┐             │   │
│  │  │ USA    ├───►│ USA    │             │   │
│  │  │ Uruguay│    │        │             │   │
│  │  └────────┘    └────────┘             │   │
│  │          Round of 16                  │   │
│  │  ┌────────┐    ┌────────┐             │   │
│  │  │ USA    ├───►│ France │             │   │
│  │  │ Portugal│   │        │             │   │
│  │  └────────┘    └────────┘             │   │
│  │          Quarter-finals               │   │
│  │  ...                                │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ── Teams Tab ──                            │
│  (48 teams in a searchable grid with flag,  │
│   name, group, fifaRank)                    │
└─────────────────────────────────────────────┘
```

### 6.3 National Team Detail (`/national-team/usa`)

```
┌─────────────────────────────────────────────┐
│  Header [Home, Leagues, International,      │
│              Search, Follows]                │
├─────────────────────────────────────────────┤
│                                             │
│  🇺🇸 United States of America                │
│  FIFA Rank: #11 • Caps: 142 • Goals: 487    │
│                                             │
│  Upcoming:  vs Mexico  |  Jun 15           │
│  Last:     Won 2-1  vs Uruguay             │
│                                             │
│  [World Cup 2026] [Friendlies]              │
│                                             │
│  ── World Cup 2026 Tab ──                   │
│  Group A • Third consecutive WC appearance  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ Matches                             │   │
│  │ Jun 11  USA 2-1 Uruguay  (H)        │   │
│  │ Jun 15  USA 1-0 Portugal   (A)      │   │
│  │ Jun 19  USA 3-0 Algeria    (H)      │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ Team Roster                         │   │
│  │ #7  Pulisic  • FW  • 3 apps, 2 goals│   │
│  │ #8  McKennie • MF  • 3 apps, 1 goal │   │
│  │ #1  Turner   • GK  • 3 apps, 0 goals│   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ── Friendlies Tab ──                       │
│  (List of friendly matches, if any)         │
└─────────────────────────────────────────────┘
```

---

## 7. User Stories

### US-4.1: International Soccer Overview Page

**As a** sports fan,
**I want** to browse a page showing all international tournaments (ongoing, upcoming, completed),
**so that** I can quickly find a tournament I'm interested in.

**Acceptance Criteria:**

- **AC-46:** Given I am on `/international`, when I view the page, then I see a grid of tournament cards showing each tournament's logo, name, date range, status badge (Upcoming / Ongoing / Completed), and host countries.
- **AC-47:** Given I am on `/international`, when I use the search input, then I see filtered results matching the search term in tournament name or host countries (case-insensitive).
- **AC-48:** Given I am on `/international`, when I select a category filter (World Cup / Continental / Olympics / Friendlies / Qualifiers), then I see only tournaments matching the selected category.
- **AC-49:** Given I am on `/international`, when I click on a tournament card, then I navigate to `/tournament/[slug]` for that tournament.
- **AC-50:** Given there are more than 8 tournaments, when I scroll the page, then I see all tournaments (no virtualization required for R2 — but layout supports dynamic count).

### US-4.2: Tournament Detail Page

**As a** tournament fan,
**I want** to see all information about a specific tournament (groups, standings, fixtures, knockout bracket, team list),
**so that** I can follow the tournament from group stage through the final.

**Acceptance Criteria:**

- **AC-51:** Given I am on `/tournament/[slug]`, when I view the page, then I see the tournament name, dates, host countries, status badge, and a tab navigation (Groups, Standings, Fixtures, Knockout, Teams).
- **AC-52:** Given I am on the Groups tab, when I view the page, then I see group standings tables (one per group, or expandable groups) showing position, team name, played, won, drawn, lost, GF, GA, GD, points.
- **AC-53:** Given I am on the Standings tab, when I view the page, then I see an aggregated standings table ranking all teams across all groups by points, then goal difference, then goals for.
- **AC-54:** Given I am on the Fixtures tab, when I view the page, then I see all tournament matches listed chronologically with date, teams, score (if completed), and venue.
- **AC-55:** Given I am on the Knockout tab, when I view the page, then I see a visual bracket layout showing knockout matches (Round of 32, Round of 16, Quarter-finals, Semi-finals, Final, Third Place) with team names, scores, and advancement lines. **If the tournament has no knockout stage (e.g., a group-only tournament), this tab is hidden.**
- **AC-56:** Given I am on the Teams tab, when I view the page, then I see a grid of all teams in the tournament with flag, name, group, and FIFA rank.
- **AC-57:** Given I am on any tab, when I click on a team name, then I navigate to `/national-team/[slug]` for that team.

### US-4.3: National Team Page

**As a** national team supporter,
**I want** to see my team's overview, upcoming matches, recent results, and tournament-specific information,
**so that** I can follow my national team's international campaign.

**Acceptance Criteria:**

- **AC-58:** Given I am on `/national-team/[slug]`, when I view the page, then I see the national team's flag, full name, FIFA rank, total caps, total international goals, upcoming match, and last result.
- **AC-59:** Given I am on the team page, when I view the tournament tabs, then I see tabs for each tournament the team is participating in (e.g., "World Cup 2026", "Friendlies").
- **AC-60:** Given I am on a tournament tab, when I view the page, then I see the team's matches in that tournament (with date, opponent, score, venue) and an optional roster table (squad number, position, player name, goals).
- **AC-61:** Given I am on the team page, when I scroll, then I see the team's group standings (if in a tournament with groups) showing the team's standing and group mates.

---

## 8. Integration Points

### 8.1 Shared with Epic 2 (Homepage Overhaul)

| Feature | Shared Utility | Usage |
|---------|---------------|-------|
| Standings computation | `src/lib/standings.ts` — `computeStandings()` | Group standings on tournament detail page |
| Knockout bracket | `src/lib/standings.ts` — `computeKnockoutResults()` | Knockout bracket on tournament detail page |
| Header | `src/components/Header.tsx` | Navigation includes "International" tab (highlighted on `/international` and `/tournament/[slug]`) |
| Dark theme | Convention Section 7.4 | Same dark theme across all pages |

### 8.2 Shared with Epic 3 (League Directory)

| Feature | Shared Utility | Usage |
|---------|---------------|-------|
| Standings table component | `src/components/StandingsTable.tsx` | Reused for group standings and aggregate standings |
| Standings computation | `src/lib/standings.ts` — `computeStandings()` | Same function, same sort order (Pts → GD → GF) |
| Header | `src/components/Header.tsx` | Same unified header |
| MatchCard | `src/components/MatchCard.tsx` | Reused for tournament fixtures |
| CalendarExport | `src/components/CalendarExport.tsx` | Extended to include international matches |

### 8.3 Shared with Epic 1 (Auth)

| Feature | Shared Utility | Usage |
|---------|---------------|-------|
| Team following | Auth system (Epic 1) | Users can follow national teams; following state shown on team page |
| User preferences | Auth system (Epic 1) | Timezone preferences apply to international match times |

---

## 9. Open Questions for Chris

| # | Question | Why it matters | Impact |
|---|----------|---------------|--------|
| Q1 | **Which tournaments should be in scope for R2?** The requirements mention World Cup 2026, Copa America 2024, Euro 2024. Should we seed 3 tournaments or just World Cup 2026 with placeholder data for the others? | Affects data file size and component complexity | Data model and seed data scope |
| Q2 | **Should the Knockout tab be hidden or shown as "TBD" for group-only tournaments?** World Cup 2026 has knockouts; placeholder tournaments may not. | Affects whether we need conditional rendering logic or a placeholder state | Component design |
| Q3 | **For the aggregate standings (Standings tab), should we use only group-stage matches, or include knockout matches?** If a team advances through knockouts, does their aggregate row update? | Affects standings computation logic | `computeStandings()` function signature |
| Q4 | **Do we need player-level stats (goals, assists, appearances) per tournament, or is match data sufficient?** The roster table needs squad numbers and player names; deeper stats add complexity. | Affects whether we seed `TeamRoster` and `Player` data | Data model complexity |
| Q5 | **What is the "Competitions" field on the `Match` entity?** The conventions mention `Match.competition`. Is this the same as `Match.competitionType`? If different, how do they relate? | Affects data model consistency across epic requirements | Type definitions |
| Q6 | **Should `/team/[slug]` (existing club team pages from conventions) also show international matches if the team type changes to "national"?** Or should national teams only appear on `/national-team/[slug]`? | Affects routing logic and team type detection | Routing decisions |
| Q7 | **How many national teams should be seeded?** World Cup 2026 has 48 teams. Should we seed all 48, or a representative subset (e.g., 16)? | Affects data file size and performance | Data scope |
| Q8 | **Should international matches on the homepage featured carousel be from active tournaments?** The homepage (Epic 2) already has a featured carousel. Should international matches be eligible? | Affects what matches get featured | Epic 2 / Epic 4 integration |

---

## 10. Scope Boundary

### In Scope
- International overview page (`/international`)
- Tournament detail page (`/tournament/[slug]`) with Groups, Standings, Fixtures, Knockout, Teams tabs
- National team detail page (`/national-team/[slug]`) with tournament tabs
- Tournament data model (Tournament, TournamentStage, TeamRoster, Player)
- Extended Match entity with `competitionType`
- Knockout bracket visualization
- Knockout bracket shared computation (`computeKnockoutResults()`)
- National team seed data (48 World Cup 2026 teams, schedule, rosters)
- Search and category filtering on `/international`
- Tab navigation on tournament and team pages
- Integration with existing Header, CalendarExport, MatchCard, StandingsTable components

### Out of Scope
- International club competitions (Champions League, Europa League) — Epic 3
- Live score updates / WebSockets
- Multi-language support
- Betting odds / predictions
- Streaming links or video embeds
- Player profiles beyond roster listing
- Squad depth charts / formation diagrams
- Historical tournament archives (pre-2024)
- International qualifiers beyond seeding the World Cup 2026 tournament
- FIFA ranking change tracking over time

---

## 11. Dependencies

| Dependency | Epic | Status | Notes |
|-----------|------|--------|-------|
| `computeStandings()` in `src/lib/standings.ts` | Shared convention | Planned | Epic 4 reuses the same function as Epic 2 and Epic 3 |
| `computeKnockoutResults()` in `src/lib/standings.ts` | Shared convention | Planned | Epic 4 reuses the same function as Epic 2 |
| Header component | Shared convention | Planned | Add "International" nav item |
| TeamCard component | Shared convention | Planned | Small card for tournament team list |
| MatchCard component | Shared convention | Planned | Match card on fixtures tab |
| StandingsTable component | Epic 3 | Planned | Reused for group standings |
| Auth system (following) | Epic 1 | Planned | Enable following national teams |
| CalendarExport component | Epic 1 | Planned | Include international matches in export |

---

## 12. Deliverables Summary

| Deliverable | Location | Description |
|-------------|----------|-------------|
| `Tournament`, `TournamentStage`, `TeamRoster`, `Player` interfaces | `src/data/types.ts` | New type definitions |
| Extended `Match.competitionType` and `Team.caps/goals` | `src/data/types.ts` | Type extensions |
| Tournament seed data | `src/data/tournaments.ts` | Tournament entities and metadata |
| Team roster data | `src/data/rosters.ts` | Squad lists per tournament |
| Knockout bracket data | `src/data/teams.ts` (existing) | Already partially seeded for World Cup 2026 |
| Tournament overview page | `src/app/international/page.tsx` | `/international` route |
| Tournament detail page | `src/app/tournament/[slug]/page.tsx` | `/tournament/[slug]` route |
| National team page | `src/app/national-team/[slug]/page.tsx` | `/national-team/[slug]` route |
| `TournamentCard` component | `src/components/TournamentCard.tsx` | Small tournament card |
| `TournamentGrid` component | `src/components/TournamentGrid.tsx` | Grid layout of tournament cards |
| `TournamentTabs` component | `src/components/TournamentTabs.tsx` | Tab bar for tournament detail |
| `GroupStandings` component | `src/components/GroupStandings.tsx` | Per-group standings table |
| `GroupFixtures` component | `src/components/GroupFixtures.tsx` | Per-group fixtures table |
| `KnockoutBracketView` component | `src/components/KnockoutBracketView.tsx` | Visual bracket rendering |
| `TeamRosterTable` component | `src/components/TeamRosterTable.tsx` | Roster table |
| `NationalTeamHeader` component | `src/components/NationalTeamHeader.tsx` | National team page header |
| `InternationalMatchFeed` component | `src/components/InternationalMatchFeed.tsx` | Match feed for team page |
| `TournamentSearchFilter` component | `src/components/TournamentSearchFilter.tsx` | Search + category filter |
| Updated `Header` component | `src/components/Header.tsx` | Add "International" nav |
| Updated `standings.ts` | `src/lib/standings.ts` | `computeKnockoutResults()` (shared) |

---

*End of Epic 4 requirements document.*
