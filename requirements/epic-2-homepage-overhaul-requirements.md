# Pitchside R2 — Epic 2: Homepage Overhaul Requirements

**Prepared by:** Lois Lane (BA)
**Date:** 2026-06-24
**Epic:** 2 of 4 (Auth, Homepage, League Directory, International Soccer)
**Workspace:** `/Users/kelex/Documents/pitchside`

---

## 1. Overview

Epic 2 overhauls the homepage (`/`) from a flat team list into a structured, sectioned layout that serves as the central hub for all sports content across all epics. The homepage contains five main sections:

1. **"This Week" Live Games Strip** — aggregated matches from all data sources (World Cup, club leagues, international tournaments) for the current calendar week
2. **World Cup Group Standings** — all 12 groups (A–L) with full statistics, qualification highlights
3. **Knockout Bracket** — post-group-stage bracket with all rounds (Round of 32 through Final)
4. **Followed Teams Section** — upcoming matches and recent results for teams the user follows (visible when logged in; placeholder when anonymous)
5. **Club Teams Section** — top club league standings and featured matches

**Phase-based rendering:** The homepage switches between group-stage and knockout views automatically based on match dates (pre-June 27 shows groups; post-June 27 or when all group matches are completed shows knockout).

**Content constraint:** All data is static seeded data only (`src/data/`). No API integration in R2.

**Out of scope:** Real-time score push (WebSockets/SSE), mobile-specific redesign (responsive desktop-first), league detail pages (Epic 3), international tournament pages (Epic 4).

---

## 2. Shared Conventions Compliance

This doc adheres to `shared-conventions.md` (Sections 1–9). Key decisions adopted without redefinition:

| Convention | Decision (from shared-conventions.md) |
|------------|----------------------------------------|
| Route | Homepage is `/` (Section 2, route table). Single landing page. |
| Navigation | Unified header across all pages. "Home" (logo) links to `/`. Nav items: Home, Leagues, International, Search (+ Follows when logged in). No "My Feed" or "Dashboard" as separate nav items — those are homepage sections. |
| Match Status | `MatchStatus = "upcoming" | "live" | "completed"` (Section 4). `live` is computed client-side: current time is within 2 hours of kickoff. |
| "This Week" | Calendar week (Monday–Sunday), not rolling 7-day (Section 5.4). Aggregated from all data sources: World Cup groups, knockout, club leagues, international tournaments. Each match carries a `competition` or `leagueId` field for source display. |
| Standings Computation | Single shared function `computeStandings(matches, teams)` in `src/lib/standings.ts` (Section 5.1). Used by Epic 2 (World Cup groups) and Epic 3 (league standings). Sorting: Pts desc → GD desc → GF desc. |
| Knockout Computation | `computeKnockoutResults(rounds)` in `src/lib/standings.ts` (Section 5.2). Determines winners, propagates to next round. |
| Team ID | Follow entity uses `Team.id` (UUID), not slug. Slug is display/URL only (Section 3.1). |
| Timezone | Dates stored in UTC on data layer, converted on client. Logged-in users: `UserPreference.timezone`. Anonymous: browser timezone or UTC default (Section 7.2). |
| Dark theme | Dark-only. `bg-slate-950 text-slate-300 antialiased`. No light mode (Section 7.4). |
| Component locations | Shared components → `src/components/`, page components → `src/app/page.tsx`, types → `src/data/types.ts`, utilities → `src/lib/`, hooks → `src/hooks/` (Section 6.4). |
| Data layer | Static seeded data from `src/data/` only. Repository function pattern in `src/lib/` abstracts the source for future API swap (Section 7.3). |
| Slug convention | Kebab-case, lowercase. Example: `world-cup-2026` (Section 7.1). |
| Team page tabs | Conditional tabs: "Club" if team has club matches, "International" if team has international matches (Section 6.1). Reused on homepage team name links. |

**Decisions specific to Epic 2 not yet in conventions:**
- Followed teams section on homepage: visible only when logged in, shows upcoming matches and recent results for followed teams. Anonymous users see a CTA: "Sign in to see your followed teams."
- Knockout bracket rendering: uses positions ("1A vs 2B") for unplayed matches before team identities are resolved.
- Knockout tiebreakers: final score is sufficient for R2 MVP (no AET/Pen annotations needed — per conventions Section 9, Q5).

---

## 3. Homepage Wireframe Structure

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (shared across all pages — see conventions §1)       │
│  [Pitchside]  Home  Leagues  International  Search  [Avatar] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 1: "This Week" Live Games Strip                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  📅 This Week's Action                                   │ │
│  │                                                         │ │
│  │  [Mon Jun 23] [Tue Jun 24] [Wed Jun 25] ... [Sun Jun 29] │ │
│  │                                                         │ │
│  │  Jun 23  —  USA 🇺🇸  2 - 1  Uruguay 🇺🇾  (WC Group G)    │ │
│  │  Jun 24  —  Brazil 🇧🇷  vs  Argentina 🇦🇷  (WC Group B)   │ │
│  │           ⏱ 3d 14h 22m                                   │ │
│  │  Jun 24  —  Real Madrid 🏟  vs  Barcelona 🏟  (La Liga)   │ │
│  │           ⏱ 3d 18h 05m                                   │ │
│  │  Jun 25  —  PSG 🇫🇷  0 - 0  Bayern 🇩🇪  (Ligue 1) [LIVE] │ │
│  │           🔴 LIVE  67'                                   │ │
│  │                                                         │ │
│  │  → Links to /leagues for each competition source          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 2: World Cup Group Standings (conditional)          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🏆 World Cup 2026 — Group Stage                        │ │
│  │                                                         │ │
│  │  ┌───── Group A ─────┐  ┌───── Group B ─────┐           │ │
│  │  │ Pos │ Team │ Pts │  │ Pos │ Team │ Pts │   │           │ │
│  │  │ ─── │ ──── │ ─── │  │ ─── │ ──── │ ─── │   │           │ │
│  │  │  1  │ USA  │ 7   │  │  1  │ Braz │ 6   │   │           │ │
│  │  │  2  │ Ger  │ 4   │  │  2  │ Arg  │ 4   │   │           │ │
│  │  │  3  │ Gre  │ 3   │  │  3  │ Jap  │ 3   │   │           │ │
│  │  │  4  │ Cos  │ 0   │  │  4  │ Aus  │ 1   │   │           │ │
│  │  └──────────────┘  │  └──────────────┘  │         │           │ │
│  │                     │                     │           │           │ │
│  │  ... (Groups C through L, 3 per row on     │           │           │ │
│  │   desktop, 1 per row on mobile)             │           │           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  [CONDITIONAL: After June 27 / all groups complete]          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🏆 World Cup 2026 — Knockout Stage                     │ │
│  │                                                         │ │
│  │  Round of 32         Round of 16      Quarter-finals     │ │
│  │  ┌───────────────┐   ┌───────────────┐   ┌────────────┐ │ │
│  │  │ 1A vs 2B      │   │ USA vs W-R32-2│   │ W-R16-1    │ │ │
│  │  │ 🇺🇸 vs 🇬🇧  │   │ 🇺🇸  vs  🇧🇷│   │ ??? vs ??? │ │ │
│  │  │ Jun 27 · 18:00│   │ Jun 30 · 20:00│   │ Jul 3 · 18 │ │ │
│  │  └───────────────┘   └───────────────┘   └────────────┘ │ │
│  │  ... (bracket flows left to right through all rounds)    │ │
│  │  Third Place Match       Final                            │ │
│  │  ┌───────────────────┐  ┌──────────────────────┐         │ │
│  │  │ W-R16-7 vs W-R16-8│  │ W-SF-1 vs W-SF-2     │         │ │
│  │  │ Jul 15 · 18:00    │  │ Jul 19 · 20:00        │         │ │
│  │  └───────────────────┘  └──────────────────────┘         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 3: Followed Teams Section (conditional)             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  ❤️ My Followed Teams                                   │ │
│  │                                                         │ │
│  │  [Logged in]                                            │ │
│  │  ┌───────────────────────────────────────────────────┐  │ │
│  │  │ Upcoming Matches                                  │  │ │
│  │  │ • USA vs Mexico  —  Jun 26 · 20:00  ⏱ 2d 14h    │  │ │
│  │  │ • Brazil vs Colombia  —  Jun 27 · 16:00  ⏱ 3d    │  │ │
│  │  │                                                   │  │ │
│  │  │ Recent Results                                   │  │ │
│  │  │ • Japan 1 - 2 Spain  (Jun 22)                     │  │ │
│  │  │ • Morocco 0 - 0 Croatia  (Jun 21, FT)            │  │ │
│  │  └───────────────────────────────────────────────────┘  │ │
│  │                                                         │ │
│  │  [Anonymous — not signed in]                            │ │
│  │  ┌───────────────────────────────────────────────────┐  │ │
│  │  │                                                   │  │ │
│  │  │        🤝  Sign in to follow teams                │  │ │
│  │  │        Your personalized feed appears here.       │  │ │
│  │  │        [Sign In]                                  │  │ │
│  │  │                                                   │  │ │
│  │  └───────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SECTION 4: Club Teams / Featured Leagues                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  ⚽ Featured Club Leagues                               │ │
│  │                                                         │ │
│  │  La Liga            MLS             USL League One      │ │
│  │  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐ │ │
│  │  │ ⭐ Real Madrid│   │ ⭐ InterMiami│   │ ⭐ Richmond │ │ │
│  │  │ ⭐ Barcelona  │   │ ⭐ NYCFC     │   │ ⭐ Pittsburgh│ │ │
│  │  │ ⭐ Atletico   │   │ ⭐ LAFC     │   │ ⭐ Lexington │ │ │
│  │  │ ... (5 teams per league)       │   │ ... (5 teams)│ │ │
│  │  │                                          Standings│ │ │
│  │  │                                          [View →] │ │ │
│  │  └──────────────┘   └──────────────┘   └─────────────┘ │ │
│  │                                                         │ │
│  │  All club standings use the same `StandingsTable`        │ │
│  │  component as World Cup groups (conventions §5.1)        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Responsive Notes
- Desktop: 3 group standings per row, full bracket visibility, all 4 sections in a single column.
- Mobile: 1 group standings per row, "This Week" strip scrolls horizontally, bracket collapses to a vertical list view, followed teams section prioritized at top.

---

## 4. Data Model Additions

All data model additions live in `src/data/types.ts`. The existing `Match`, `Team`, and `Standing` interfaces are extended per the shared conventions.

### 4.1 TournamentState Interface

```typescript
// src/data/types.ts (new)

type TournamentPhase = "group" | "knockout";

interface TournamentState {
  phase: TournamentPhase;
  phaseEndDate: Date | null;  // Last group match date (June 27, 2026)
  lastUpdated: Date;
}
```

**Usage:** The homepage component reads `TournamentState.phase` to determine whether to render group standings or knockout bracket. The transition is computed automatically based on match dates — no manual toggle needed.

**Transition logic:**
- If any group match has `status === "upcoming"` → `phase = "group"`
- If all group matches have `status === "completed"` → `phase = "knockout"`
- Date-based fallback: if current date is after the last group match date, use knockout

### 4.2 Match.status Extension

Per shared conventions Section 4, the existing `Match` status type is simplified:

```typescript
// src/data/types.ts (modified — existing Match interface)

type MatchStatus = "upcoming" | "live" | "completed";
```

- `upcoming` — kickoff date is in the future
- `live` — current time is within 2 hours of kickoff (computed client-side via `isLive(match)`)
- `completed` — match has ended

**NOTES:**
- R2 uses static seeded data only. The `live` status is computed client-side at render time based on the match's scheduled kickoff date and current time.
- `postponed` and `cancelled` states are out of scope (deferred to Phase 2 per conventions Section 4).
- Knockout tiebreakers: AET/Pen annotations are NOT needed for R2 MVP. Final score is sufficient.

### 4.3 Utility Function Signatures

Per shared conventions Sections 5.1, 5.2, and 5.3:

```typescript
// src/lib/standings.ts (new — called by both Epic 2 and Epic 3)

interface Standing {
  teamId: string;
  teamName: string;
  teamSlug: string;
  teamCrestUrl: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  qualificationStatus?: "qualified" | "eliminated" | "contending";
}

export function computeStandings(matches: Match[], teams: Team[]): Standing[];

export function computeKnockoutResults(rounds: KnockoutRound[]): KnockoutRound;

// src/lib/matches.ts (new)

export function getMatchesThisWeek(matches: Match[], currentDay: Date): Match[];
```

### 4.4 KnockoutRound Type

```typescript
// src/data/types.ts (new)

interface KnockoutRound {
  roundName: string;  // "Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Third Place", "Final"
  roundOrder: number;
  matches: KnockoutMatch[];
}

interface KnockoutMatch {
  id: string;
  homeTeam: string;    // team slug or position label ("1A", "2B", "W-R32-1")
  awayTeam: string;    // team slug or position label
  date: Date;
  venue: string;
  homeScore: number | null;
  awayScore: number | null;
  winner: string | null;  // team slug of winner (populated after match)
}
```

### 4.5 Match Competition Source

Each match carries a competition source field so the homepage can display which league/tournament a match belongs to:

```typescript
// src/data/types.ts (extend existing Match interface)

interface Match {
  // ... existing fields ...
  // NEW:
  competition: string;        // e.g., "WC Group A", "La Liga", "MLS"
  leagueId?: string;          // FK to League (for club matches)
  tournamentStageId?: string; // FK to TournamentStage (for international matches)
}
```

---

## 5. User Stories & Acceptance Criteria

### US-2.1: "This Week" Live Games Strip

**As a** visitor or signed-in user on the homepage, **I want to** see all upcoming and completed matches for the current calendar week (Monday–Sunday) aggregated from all competitions, **so that** I can quickly see what's happening across all sports without navigating to individual pages.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-1 | **Given** any user visits `/`, **when** the page renders, **then** they see a "This Week's Action" section below the header with a title and match entries. |
| AC-2 | **Given** the homepage loads, **when** matches are fetched, **then** they include all competition sources: World Cup group matches, World Cup knockout matches, club league matches (La Liga, MLS, USL), and any international tournament matches (Epic 4 data, per conventions §5.3). |
| AC-3 | **Given** a match date falls within the current Monday–Sunday range, **when** the page loads, **then** the match appears in the "This Week" strip with: date, kickoff time in the user's local timezone, both teams (with logos), competition label (e.g., "WC Group A"), and venue. |
| AC-4 | **Given** a completed match appears in the weekly section, **then** the score is displayed prominently: "[HomeTeam] [score] - [score] [AwayTeam]" (e.g., "USA 2 - 1 Uruguay"). |
| AC-5 | **Given** an upcoming match appears in the weekly section, **then** a countdown indicator is shown below the match showing time remaining (e.g., "⏱ 3d 14h 22m"). |
| AC-6 | **Given** a match is currently live (kickoff time is within 2 hours ago), **then** a red "LIVE" badge is displayed next to the match with the current minute if applicable. |
| AC-7 | **Given** a match belongs to a specific competition (e.g., La Liga), **when** the user clicks the competition label, **then** they navigate to the relevant page (`/league/la-liga` or `/international`). |
| AC-8 | **Given** no matches fall within the current calendar week, **then** the section shows an empty state: "No matches this week. Check back soon!" |
| AC-9 | **Given** the user is logged in, **when** dates are displayed in the weekly strip, **then** they are converted from UTC using the user's `UserPreference.timezone`. |
| AC-10 | **Given** the user is anonymous, **when** dates are displayed, **then** they use the browser's detected timezone (via `Intl.DateTimeFormat().resolvedOptions().timeZone`) or default to UTC. |

### US-2.2: World Cup Group Standings

**As a** World Cup fan visiting the homepage, **I want to** see standings for all 12 World Cup groups (A–L) with full statistics sorted by actual group ranking, **so that** I can track which teams are advancing to the knockout stage.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-11 | **Given** any user visits `/`, **when** the page renders and group stage is active, **then** they see a "World Cup 2026 — Group Stage" section containing standings for all 12 groups (A through L). |
| AC-12 | **Given** a group standings table is displayed, **then** every column is present and labeled: Position, Team, Played, Won, Drawn, Lost, Goals For (GF), Goals Against (GA), Goal Difference (GD), Points (Pts). |
| AC-13 | **Given** a group's standings are sorted, **then** teams are ordered by: (1) Points descending, (2) Goal Difference descending, (3) Goals For descending. This sorting is computed by the shared `computeStandings()` utility in `src/lib/standings.ts`. |
| AC-14 | **Given** a team is in the top 2 (qualified positions) of a group, **then** the row has a visual highlight: an emerald green left border (e.g., `border-l-4 border-emerald-500`) indicating qualification to knockout stage. |
| AC-15 | **Given** a team is eliminated (mathematically cannot advance, in bottom 2 of 4-team group), **then** the row is visually dimmed (reduced opacity) to distinguish from qualifying teams. |
| AC-16 | **Given** a group standings table row is rendered, **when** the user clicks on the team name, **then** they navigate to `/team/[team-slug]` (e.g., `/team/usa`, `/team/brazil`). |
| AC-17 | **Given** the page loads, **then** all group standings are computed from the seeded match data in `src/data/` using `computeStandings(groupMatches, groupTeams)` — not hardcoded values. |
| AC-18 | **Given** group match results in the seed data are updated, **when** the page reloads, **then** the standings tables reflect the new calculations automatically (points, GF, GA, GD all recalculate). |
| AC-19 | **Given** the viewport is mobile width (< 768px), **when** the group standings section renders, **then** each group is displayed as a full-width table (one group per row, stacked vertically). |
| AC-20 | **Given** the viewport is desktop width (≥ 768px), **when** the group standings section renders, **then** groups are displayed in a responsive grid of 3 per row. |

### US-2.3: Knockout Bracket Display (Post-Group Stage)

**As a** World Cup fan, **I want to** automatically see a knockout bracket after the group stage ends, **so that** I can follow the tournament progression without the homepage going stale.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-21 | **Given** all group stage matches have been played (no upcoming group matches), **when** any user visits `/`, **then** the homepage shows a knockout bracket section instead of (or replacing) the group standings section. |
| AC-22 | **Given** a knockout bracket is displayed, **then** it shows all rounds in order from left to right: Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Third Place → Final. |
| AC-23 | **Given** a knockout match has not yet been played (both scores are null), **then** the matchup shows team names or position labels (e.g., "1A vs 2B", "W-R32-1 vs W-R32-2") with the scheduled date and venue. |
| AC-24 | **Given** a knockout match has been played, **then** the winner is highlighted in bold text with an emerald color, and the final score is displayed. |
| AC-25 | **Given** a knockout match result is entered (scores updated in seed data), **when** the next round's matchup references that match, **then** the bracket updates to show the actual team names (not position labels) once the winner is known. |
| AC-26 | **Given** a user is viewing a knockout bracket, **when** they click on a team name, **then** they navigate to `/team/[team-slug]` for that team. |
| AC-27 | **Given** the knockout bracket section renders, **then** all knockout data is read from the seeded data in `src/data/` and computed via the shared `computeKnockoutResults()` utility in `src/lib/standings.ts`. |
| AC-28 | **Given** the viewport is mobile width (< 768px), **when** the knockout bracket renders, **then** it collapses into a vertical list of matches grouped by round (instead of the horizontal bracket layout). |
| AC-29 | **Given** the Third Place match and Final are displayed, **then** they are visually distinguished (separated section or different background) from the earlier rounds. |
| AC-30 | **Given** a knockout match is currently live, **then** it follows the same LIVE badge convention as the "This Week" strip (red badge, within 2 hours of kickoff). |

### US-2.4: Group-to-Knockout Phase Transition

**As a** visitor to the homepage, **I want** the data model to handle the transition from group stage to knockout automatically based on match results, **so that** the homepage always shows the current tournament phase without manual intervention.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-31 | **Given** the homepage component initializes, **when** it loads, **then** it reads the `TournamentState` to determine the current phase (`"group"` or `"knockout"`) and renders the appropriate section(s). |
| AC-32 | **Given** the data model shows group stage is active (at least one group match has `status === "upcoming"`), **when** the homepage renders, **then** it displays the World Cup Group Standings section. |
| AC-33 | **Given** all group matches have `status === "completed"` (no upcoming group matches), **when** the homepage renders, **then** it displays the Knockout Bracket section instead. |
| AC-34 | **Given** the phase transition occurs (all groups complete), **when** the page reloads, **then** both group standings and knockout bracket are available (standings persist for reference, bracket is shown as the primary view). |
| AC-35 | **Given** knockout match results are updated in the seed data, **when** the page reloads, **then** the bracket automatically propagates winners to the next round without manual intervention. |
| AC-36 | **Given** the shared conventions Section 4 MatchStatus type is `"upcoming" | "live" | "completed"`, **when** a match transitions from `"upcoming"` to `"completed"`, **then** the `TournamentState.phase` recomputation triggers the correct view switch. |
| AC-37 | **Given** a tiebreak scenario occurs (two teams tied on points in a group), **then** the tiebreak rules are applied in order: (1) Goal difference, (2) Goals scored. Extra time and penalty annotations are NOT required for R2 (per conventions Section 9, Q5). |

### US-2.5: Followed Teams Section

**As a** signed-in user on the homepage, **I want to** see a personalized section showing upcoming matches and recent results for the teams I follow, **so that** I get a curated feed of content relevant to my interests.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-38 | **Given** a signed-in user visits `/`, **when** the page renders, **then** they see a "My Followed Teams" section between the World Cup section and the Club Teams section. |
| AC-39 | **Given** a signed-in user is on the homepage, **when** the followed teams section loads, **then** it displays two subsections: (1) "Upcoming Matches" showing the next match for each followed team, and (2) "Recent Results" showing the last 2 completed matches per followed team. |
| AC-40 | **Given** a match entry appears in the followed teams section, **then** it shows: date/time (in user's timezone), both teams with logos, score (if completed), and a countdown ring (if upcoming). |
| AC-41 | **Given** a team name appears in a match entry within the followed teams section, **when** the user clicks it, **then** they navigate to `/team/[team-slug]`. |
| AC-42 | **Given** a signed-in user has zero followed teams, **when** they visit `/`, **then** the followed teams section shows an empty state: "You haven't followed any teams yet. Follow teams from the World Cup standings, featured clubs, or team pages to get started." |
| AC-43 | **Given** an anonymous (not signed-in) user visits `/`, **when** the followed teams section renders, **then** they see a placeholder: "Sign in to follow teams — your personalized feed appears here." with a "Sign In" button that links to `/login`. |
| AC-44 | **Given** a signed-in user follows a new team from another page (e.g., clicks Follow on a World Cup group standings row), **when** they return to the homepage, **then** that team's matches appear in the followed teams section on the next page load. |
| AC-45 | **Given** a signed-in user unfollows a team, **when** they refresh the homepage, **then** that team's matches no longer appear in the followed teams section. |

### US-2.6: Club Teams / Featured Leagues Section

**As a** sports fan browsing the homepage, **I want to** see featured club leagues with their team rosters and standings, **so that** I can discover and explore club competitions alongside the World Cup content.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-46 | **Given** any user visits `/`, **when** the page renders, **then** they see a "Featured Club Leagues" section below the followed teams section (or below the World Cup section if not logged in). |
| AC-47 | **Given** a club league card is displayed, **then** it shows: league name, league logo/icon placeholder, list of teams (up to 5 shown per card), and a "View Standings →" link. |
| AC-48 | **Given** a league card is displayed with standings, **then** the standings are computed by the shared `computeStandings()` utility in `src/lib/standings.ts` from the league's match data. |
| AC-49 | **Given** a user clicks a team name on a club league card, **when** they navigate to `/team/[team-slug]`, **then** the team page displays the team header with logo/flag, name, and details (reusing conventions §6.1 component layout). |
| AC-50 | **Given** a user clicks "View Standings →" on a league card, **when** they navigate to `/league/[league-slug]`, **then** they see the league detail page with Standings tab active by default (conventions §2 route table, Epic 3). |
| AC-51 | **Given** a club league card is rendered, **when** the user clicks any team name, **then** they navigate to the team's detail page where the "Club" tab is shown by default (conventions §6.1). |

---

## 6. Component Inventory for Epic 2

### New Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `WeeklyStrip` | `src/components/WeeklyStrip.tsx` | `matches: Match[]` | "This Week" live games strip. Groups matches by date, shows countdown rings for upcoming, LIVE badges for in-progress, scores for completed. Scrollable horizontal layout on mobile. |
| `GroupStandingsGrid` | `src/components/GroupStandingsGrid.tsx` | `groups: Standing[][]` | Responsive grid of group standings tables. 3 per row on desktop, 1 per row on mobile. Uses `StandingsTable` internally. Highlights top 2 rows with emerald border. |
| `StandingsTable` | `src/components/StandingsTable.tsx` | `standings: Standing[]` | **Existing component — reused without changes.** Accepts `Standing[]` with columns: Position, Team, Played, Won, Drawn, Lost, GF, GA, GD, Pts. |
| `KnockoutBracket` | `src/components/KnockoutBracket.tsx` | `rounds: KnockoutRound[]` | Horizontal bracket layout on desktop (left-to-right flow), vertical list on mobile. Shows position labels for unplayed matches, team names/scores for played. Links on team names to `/team/[slug]`. |
| `FollowedTeamsSection` | `src/components/FollowedTeamsSection.tsx` | `followedTeams: Team[]`, `matches: Match[]`, `isLoggedIn: boolean` | Displays upcoming/recent matches for followed teams. Shows CTA placeholder when anonymous. |
| `ClubTeamsSection` | `src/components/ClubTeamsSection.tsx` | `leagues: League[]` | Featured club leagues section with team cards per league. Each card links to team detail and league detail. |
| `MatchCard` | `src/components/MatchCard.tsx` | `match: Match`, `showCompetition?: boolean`, `compact?: boolean` | Reusable match display card. Shows teams, score, date/time, countdown, LIVE badge. Used by WeeklyStrip and FollowedTeamsSection. |

### Reused Components

| Component | Source File | Change |
|-----------|-------------|--------|
| `CountdownRing` | `src/components/CountdownRing.tsx` | None — used for upcoming matches in WeeklyStrip and FollowedTeamsSection. |
| `StandingsTable` | `src/components/StandingsTable.tsx` | None — already accepts `Standing[]` with correct columns. Reused by GroupStandingsGrid and ClubTeamsSection. |
| `FollowButton` | `src/components/FollowButton.tsx` | Logic rewritten for persistent state (database for logged-in, localStorage for anonymous — per conventions §6.3). |
| `TeamCard` | `src/components/TeamCard.tsx` | Minor — support inline click-to-team navigation from club teams section. |
| `Header` | `src/app/(components)/Header.tsx` (or wherever it lives) | No changes — per conventions §1, the unified header is established and used by all pages. |

### Page Component

| Component | File | Description |
|-----------|------|-------------|
| Homepage (page) | `src/app/page.tsx` | **Completely rewritten.** Renders all 4-5 sections in order: (1) WeeklyStrip, (2) GroupStandingsGrid or KnockoutBracket (conditional), (3) FollowedTeamsSection (conditional on auth), (4) ClubTeamsSection. Reads all data from static seed data via repository functions in `src/lib/`. |

---

## 7. Data Flow

```
src/data/ (seeded data)
    │
    ▼
src/lib/matches.ts  ──→  getMatchesThisWeek()
src/lib/standings.ts ──→  computeStandings()
                         computeKnockoutResults()
    │
    ▼
src/app/page.tsx (homepage)
    │
    ├──→ WeeklyStrip (matches from all sources, filtered by getMatchesThisWeek)
    ├──→ GroupStandingsGrid or KnockoutBracket (computed from TournamentState)
    ├──→ FollowedTeamsSection (followed teams from useFollowTeams hook + match data)
    └──→ ClubTeamsSection (league data + computed standings)
```

### Data Repository Pattern

Per conventions Section 7.3, the homepage reads data through repository functions in `src/lib/` that abstract the static data source:

```typescript
// src/lib/data/matches.ts (new)
export function getAllMatches(): Match[];
export function getWorldCupGroupMatches(): Match[];
export function getWorldCupKnockoutMatches(): KnockoutMatch[];
export function getClubLeagueMatches(leagueSlug: string): Match[];

// src/lib/data/teams.ts (extend existing)
export function getTeamsByLeague(leagueSlug: string): Team[];
export function getFollowedTeams(): Team[];  // returns from localStorage or DB

// src/lib/data/tournament.ts (new)
export function getTournamentState(): TournamentState;
```

---

## 8. Dependencies on Other Epics

| Dependency | Epic | Impact |
|------------|------|--------|
| Team.id field (UUID) | 1, 3, 4 | Homepage Followed Teams section references `Team.id` (UUID) for follow lookups. Follow API must be available. |
| useFollowTeams hook | 1 | Homepage reads followed teams state from the hook. Hook must return team objects (not just slugs) for logged-in users. |
| UserPreference.timezone | 1 | Homepage all date display uses `UserPreference.timezone` for logged-in users. |
| Auth middleware | 1 | Homepage checks auth status to conditionally render Followed Teams section. |
| Standings utility | 3 | `computeStandings()` is shared with Epic 3 league pages. Epic 2 usage validates the utility works correctly. |
| Knockout utility | 4 | `computeKnockoutResults()` is shared with Epic 4 international tournaments. Epic 2 usage validates the utility. |
| Match competition field | 3, 4 | `Match.competition` field is needed for the WeeklyStrip to display source labels (e.g., "La Liga", "WC Group A"). |
| Follow entity | 3, 4 | Homepage Followed Teams section queries the Follow entity for logged-in users. |

---

## 9. Scope Boundaries

### In Scope

- Complete homepage (`/`) redesign with 4–5 structured sections
- "This Week" live games strip aggregating all competition sources for the calendar week
- World Cup group standings for all 12 groups (A–L) with full stats
- World Cup knockout bracket with all rounds (Round of 32 → Final)
- Followed teams section (upcoming + recent matches) for logged-in users, CTA for anonymous
- Featured club leagues section with standings
- Phase-based conditional rendering (group ↔ knockout transition)
- Data model additions: `TournamentState`, `TournamentPhase`, `KnockoutRound`, `KnockoutMatch`, `Match.competition`
- `MatchStatus` extension to include `"live"`
- Utility functions: `getMatchesThisWeek()`, `computeStandings()`, `computeKnockoutResults()`
- Responsive layout (desktop 3-column grid, mobile stacked)
- All data read from static seeded data (`src/data/`)
- Repository function pattern in `src/lib/` for data abstraction

### Out of Scope

- Real-time score push (WebSockets / Server-Sent Events) — deferred to Phase 2
- Mobile-specific redesign — desktop-first responsive only
- League detail pages (standings, fixtures, teams tabs) — Epic 3
- International tournament pages — Epic 4
- Postponed / cancelled match status — Phase 2 (per conventions §4)
- AET/Penalty tiebreakers for knockout — not needed for R2 MVP
- League logo assets — SVG placeholders suffice for R2
- News feed on homepage — team pages only
- Calendar export on homepage — keep existing component but not integrated into new layout
- Push notifications — out of scope per conventions §3.3

---

## 10. Open Questions for Chris / Brainiac

| # | Question | Epic | Impact | Notes |
|---|----------|------|--------|-------|
| 1 | **Knockout tiebreakers:** For knockout matches tied after regulation, should the bracket display AET/Penalty results? | 2 | UI display only | **Recommendation: NO.** Final score is sufficient for R2. Conventions §9 Q5 already resolved. |
| 2 | **Match score data update process:** Who updates the static seed data after matches are played? A helper script? Manual edits to `src/data/`? | 2 | Data maintenance | **Recommendation: simple Node script** that reads from a CSV or JSON source and writes to `src/data/matches.ts`. |
| 3 | **Club teams scope:** How many clubs per featured league should the homepage show? 5 shown per card (as designed), or more? | 2 | UI sizing | **Recommendation: 5 teams per card** with "View all" link to `/league/[slug]`. |
| 4 | **Followed teams empty state:** Should the homepage automatically scroll to or highlight the followed teams section when a user follows their first team? | 2 | UX polish | Nice-to-have. Out of scope for MVP if tight on time. |
| 5 | **Date-based vs result-based knockout transition:** Should the group→knockout transition be triggered by (a) all group matches completed, or (b) a fixed date (June 27)? | 2 | Both work | **Recommendation: result-based** (all group matches completed). Falls back to date-based if logic is needed. |

---

## 11. Wireframe Descriptions (Text)

### Desktop Layout (`≥ 768px`)

**Order (top to bottom):**
1. **Header** — unified nav (conventions §1)
2. **"This Week" Strip** — full-width horizontal scroll, 3-4 matches visible per row, date tabs for weekday navigation
3. **World Cup Group Standings** — 3-column grid of standings tables (Groups A-L), each table ~25% width
4. **World Cup Knockout Bracket** (conditional) — horizontal bracket layout, rounds flow left-to-right, ~90% width, centered
5. **Followed Teams Section** (conditional on auth) — two columns: upcoming matches left, recent results right, full-width
6. **Featured Club Leagues** — 3-column card grid, each card shows league name, 5 teams, standings summary

**Spacing:** Sections separated by 2rem vertical padding. Each section has a distinct background (`bg-slate-900` or `bg-transparent`) for visual separation.

### Mobile Layout (`< 768px`)

**Order (top to bottom):**
1. **Header** — hamburger menu (simplified nav)
2. **"This Week" Strip** — horizontal scroll, 1 match per row, full-width cards
3. **World Cup Group Standings** — 1 column, 1 group per row (stacked)
4. **World Cup Knockout Bracket** (conditional) — vertical list, grouped by round, each match is a full-width card
5. **Followed Teams Section** (conditional on auth) — single column, upcoming + recent stacked
6. **Featured Club Leagues** — 1 column, 1 league per row (stacked)

---

## 12. Priority Assessment

| User Story | Priority | Rationale |
|------------|----------|-----------|
| US-2.1 (This Week Strip) | **High** | Primary value prop of homepage — immediate visibility of live/upcoming content |
| US-2.2 (Group Standings) | **High** | World Cup is the centerpiece content; fans expect standings on the homepage |
| US-2.3 (Knockout Bracket) | **High** | Critical for post-group-stage engagement; keeps homepage fresh |
| US-2.4 (Phase Transition) | **High** | Makes the homepage self-managing; no manual intervention required |
| US-2.5 (Followed Teams) | **Medium** | Drives auth adoption but requires Epic 1 completion first |
| US-2.6 (Club Teams Section) | **Medium** | Enhances homepage but secondary to World Cup content |

---

*Document generated 2026-06-24 by Lois Lane, Fortress of Solitude Consulting.*
*Handed off to Brainiac (web architect) for system architecture and implementation planning.*
