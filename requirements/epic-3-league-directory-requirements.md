# Pitchside R2 — Epic 3: League Directory Requirements

**Prepared by:** Lois Lane (BA)
**Date:** 2026-06-24
**Epic:** 3 of 4 (Auth, Homepage, League Directory, International Soccer)
**Workspace:** `/Users/kelex/Documents/pitchside`

---

## 1. Overview

Epic 3 builds the league directory — a browsable, searchable, and filterable collection of club leagues. It introduces three key pages:

1. **League Directory** (`/leagues`) — icon grid of all leagues, with search and type filtering
2. **League Detail** (`/league/[slug]`) — tabs for Standings, Fixtures, and Teams within a league
3. **Team Drill-Down** (`/team/[slug]`) — already defined in conventions; Epic 3 adds the league context (which league a team belongs to)

The epic also extends the `League` data entity with display fields (logo, country, type, season dates) and creates five new components for the directory and detail views.

**Content constraint:** All data is static seeded data only (`src/data/`). No API integration in R2.

**Out of scope:** International tournament pages (Epic 4), league search autocomplete (deferral), live score updates, league team rosters beyond name/logo, fantasy integration.

---

## 2. Shared Conventions Compliance

This doc adheres to `shared-conventions.md` (Sections 1–9). Key decisions adopted without redefinition:

| Convention | Decision (from shared-conventions.md) |
|------------|----------------------------------------|
| Route — League Directory | `/leagues` (public, no auth required) — Section 2 route table |
| Route — League Detail | `/league/[slug]` (public, no auth required) — Section 2 route table |
| Route — Team Detail | `/team/[slug]` (public, no auth required) — Section 2 route table |
| Slug Convention | Kebab-case, lowercase. Examples: `la-liga`, `mls`, `usl-league-one` — Section 7.1 |
| Team ID | `Team.id` is UUID (PK). `Team.slug` is kebab-case (URL only). Follow entity uses `Team.id` — Section 3.1 |
| Team Type | `type: "club" | "national"` — Section 3.1. League directory primarily features club teams, but the `/team/[slug]` page supports both types. |
| Match Status | `MatchStatus = "upcoming" | "live" | "completed"` — Section 4. Used on league fixture tabs. |
| Standings Computation | Single shared function `computeStandings(matches, teams)` in `src/lib/standings.ts` — Section 5.1. League detail pages reuse this exact function. Sorting: Pts desc → GD desc → GF desc. |
| Timezone | Dates stored in UTC on data layer, converted on client. Logged-in users: `UserPreference.timezone`. Anonymous: browser timezone or UTC default — Section 7.2 |
| Dark Theme | Dark-only. `bg-slate-950 text-slate-300 antialiased`. No light mode — Section 7.4 |
| Component locations | Shared components → `src/components/`, page components → `src/app/[route]/page.tsx`, types → `src/data/types.ts`, utilities → `src/lib/`, hooks → `src/hooks/` — Section 6.4 |
| Data layer | Static seeded data from `src/data/` only. Repository function pattern in `src/lib/` abstracts the source for future API swap — Section 7.3 |
| Navigation | Unified header: Home, Leagues (active on `/leagues` and `/league/[slug]`), International (reserved), Search, Follows (logged in) — Section 1 |
| Team page tabs | Conditional: "Club" if team has club matches, "International" if team has international matches — Section 6.1 |

**Decisions specific to Epic 3 not yet in conventions:**
- `League` entity extension fields (logoUrl, country, type, seasonStart, seasonEnd)
- `Team.leagueId` reference for team-to-league relationship
- League type filter values ("club", "international-club")
- World Cup is NOT in the league directory (it belongs to `/group/[letter]` per conventions Section 9, Q9)
- League seed data scope: 3 club leagues minimum (La Liga, MLS, USL League One) — conventions Section 9, Q7

---

## 3. Data Model

### 3.1 League Entity (Extended)

```typescript
// src/data/types.ts (extended — NEW)
interface League {
  id: string;            // UUID, PK
  name: string;          // Display name: "La Liga", "MLS", "USL League One"
  slug: string;          // kebab-case, used in URLs (/league/[slug])
  logoUrl: string;       // SVG icon or team crest URL for directory grid
  country: string;       // ISO country name: "Spain", "USA/Canada/Mexico", "USA"
  type: "club" | "international-club"; // For R2: all club. "international-club" for future multi-country leagues.
  seasonStart: Date;     // e.g., 2026-08-15
  seasonEnd: Date;       // e.g., 2027-05-20
  teams: Team[];         // Reference to teams in this league (populated from seed data)
  matches: Match[];      // Reference to all league matches (populated from seed data)
}
```

### 3.2 Team Entity (Extended)

```typescript
// src/data/types.ts (extended)
interface Team {
  id: string;            // UUID, PK
  name: string;
  slug: string;          // kebab-case
  type: "club" | "national";
  crestUrl: string;      // team logo
  flag: string;          // country flag emoji or URL (for national teams)
  // ... existing fields (founded, stadium, etc.)
  leagueId: string | null;  // FK → League.id (NEW — only set for club teams)
  // null for national teams; set to a League.id for club teams
}
```

### 3.3 Data File Structure

All league and team data lives in static seed files under `src/data/`:

```
src/data/
  leagues.ts          → League[] array (3+ leagues)
  teams.ts            → Team[] array (teams with leagueId references)
  matches.ts          → Match[] array (with leagueId or tournamentStageId)
```

The repository function pattern (conventions Section 7.3):

```typescript
// src/lib/data/league.ts
export async function getAllLeagues(): Promise<League[]>;
export async function getLeagueBySlug(slug: string): Promise<League | null>;
export async function getLeaguesByType(type: string): Promise<League[]>;
export async function searchLeagues(query: string): Promise<League[]>;

// src/lib/data/team.ts (extended)
export async function getTeamsByLeagueId(leagueId: string): Promise<Team[]>;
```

---

## 4. Wireframe Descriptions (Text)

### 4.1 `/leagues` — League Directory

**Desktop layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (shared — Leagues is highlighted)                     │
│  [Pitchside]  Home  Leagues  International  Search  [Avatar] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  League Directory                                             │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ [🔍 Search leagues...]                                  │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  Filter by Type:  [All ▼]   (dropdown with: All, Club)      │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │  [Logo] │  │  [Logo] │  │  [Logo] │  ...                │
│  │  La Liga│  │   MLS   │  │USL Leag.│                      │
│  │  Spain  │  │ USA/CAN │  │  USA    │                      │
│  │  Aug 26 │  │ Feb 26  │  │ Mar 26  │                      │
│  │ → View  │  │ → View  │  │ → View  │                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │  [Logo] │  │  [Logo] │  │  [Logo] │  ...                │
│  │Premier   │  │  Bundesliga│ │ Ligue 1│                      │
│  │ England │  │  Germany  │  │  France │                      │
│  │ Aug 26  │  │ Aug 26    │  │ Aug 26  │                      │
│  │ → View  │  │ → View    │  │ → View  │                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Mobile layout:**

```
┌─────────────────────┐
│  HEADER (hamburger)  │
├─────────────────────┤
│                     │
│  League Directory   │
│                     │
│  [🔍 Search...]     │
│                     │
│  Type: [All ▼]      │
│                     │
│  ┌───────────────┐  │
│  │  [Logo]       │  │
│  │  La Liga      │  │
│  │  Spain        │  │
│  │  Aug 26       │  │
│  │  → View       │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │  [Logo]       │  │
│  │   MLS         │  │
│  │  USA/CAN      │  │
│  │  Feb 26       │  │
│  │  → View       │  │
│  └───────────────┘  │
│                     │
│  ...                │
│                     │
└─────────────────────┘
```

**Layout details:**
- Grid: 3-column on desktop, 1-column on mobile
- Cards are clickable (entire card is a link to `/league/[slug]`)
- Cards show: logo (top), name, country, season start date, "View" arrow
- Search filters by league name and country (case-insensitive, partial match)
- Filter dropdown has: "All", "Club" (single value for R2; "International-Club" placeholder reserved for Epic 4)

### 4.2 `/league/[slug]` — League Detail Page

**Desktop layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (shared — Leagues is highlighted)                     │
│  [Pitchside]  Home  Leagues  International  Search  [Avatar] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  [League Logo]  La Liga  —  Spain                     │   │
│  │  Season: Aug 15, 2026 → May 20, 2027                  │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────┬─────────┬─────────┐                             │
│  │Standings│ Fixtures│  Teams  │                             │
│  └─────────┴─────────┴─────────┘                             │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Standings Tab (shown by default)                      │   │
│  │                                                       │   │
│  │  ┌─────┬────────────┬───┬───┬───┬───┬───┬────┐       │   │
│  │  │ Pos │ Team       │ P │ W │ D │ L │ GF│ GA │ Pts │   │
│  │  ├─────┼────────────┼───┼───┼───┼───┼───┼────┤─────┤   │
│  │  │  1  │ Real Madrid│ 18│14 │ 2 │ 2 │42 │12 │  44 │   │
│  │  │  2  │ Barcelona  │ 18│13 │ 3 │ 2 │40 │14 │  42 │   │
│  │  │  3  │ Atletico   │ 18│12 │ 4 │ 2 │35 │10 │  40 │   │
│  │  │ ... │ ...        │ ..│.. │ ..│ ..│.. │.. │  .. │   │
│  │  └─────┴────────────┴───┴───┴───┴───┴───┴────┴─────┘   │   │
│  │                                                       │   │
│  │  [Team names are clickable → /team/[slug]]              │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Tabs behavior:**
- **Standings** (default): Full league table with all statistics. Uses `StandingsTable` shared component (conventions Section 6.2). Powered by `computeStandings(leagueMatches, leagueTeams)`.
- **Fixtures**: Match schedule for the league, grouped by matchday. Each match shows: date, kickoff time (in user's timezone), home team vs away team (with logos), score (if completed). Clickable team names → `/team/[slug]`.
- **Teams**: Grid of all teams in the league. Each team card shows: logo, name, country flag (if applicable), link to `/team/[slug]`.

**Mobile layout (league detail):**
- Same header and league header section
- Tabs become a horizontal scrollable tab bar (or stacked toggle buttons on very small screens)
- Standings table: swipeable or use a condensed format (Pos, Team, Pts only; tap for full stats)
- Fixtures: stacked cards, one per match
- Teams: 2-column grid

### 4.3 `/team/[slug]` — Team Detail (Expanded)

Team detail page is shared across Epics 2, 3, and 4. Epic 3 extends it with league context:

- **Team header:** logo/crest, name, country flag, and a **League badge/link** showing which league the team belongs to (e.g., "La Liga" as a clickable link to `/league/la-liga`)
- **Conditional tabs** (per conventions Section 6.1):
  - Club matches (shown if `team.type === "club"` and team has club matches)
  - International matches (shown if team has international matches)
- **Standings section:** shown if the team's league has standings data
- **Upcoming/Recent matches:** shown always
- **League context:** above the tabs, show "Playing in: [League Name] →" linking to the league detail page

---

## 5. User Stories & Acceptance Criteria

### US-3.1: League Directory Browse

**As a** visitor to Pitchside, **I want to** browse all available leagues in a visual grid, **so that** I can find and explore the leagues I'm interested in.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-1 | **Given** any user navigates to `/leagues`, **when** the page loads, **then** it displays a grid of league cards (icon, name, country, season start date, "View" link). |
| AC-2 | **Given** the user is on `/leagues`, **when** the page loads, **then** at least 3 league cards are displayed: La Liga, MLS, and USL League One (seeded from `src/data/leagues.ts`). |
| AC-3 | **Given** the user is on `/leagues`, **when** they type into the search box, **then** the grid filters in real-time to show only leagues whose name or country matches the search text (case-insensitive, partial match). |
| AC-4 | **Given** the user is on `/leagues` and the search returns no results, **then** a message appears: "No leagues match your search. Try a different term." |
| AC-5 | **Given** the user is on `/leagues`, **when** the page loads, **then** the type filter dropdown shows "All" as the default selection with options: "All", "Club". |
| AC-6 | **Given** the user is on `/leagues` and selects "Club" from the type filter, **then** only leagues with `type: "club"` are displayed. |
| AC-7 | **Given** the user is on `/leagues` and selects "All" from the type filter, **then** all leagues are displayed (no filter applied). |
| AC-8 | **Given** the user is on `/leagues` and both search text and type filter are active, **then** both filters apply (AND logic — results must match the search AND the type). |
| AC-9 | **Given** a user sees a league card on `/leagues`, **when** they click anywhere on the card (logo, name, or "View" arrow), **then** they are navigated to `/league/[slug]` for that league. |
| AC-10 | **Given** the user is on `/leagues` (anonymous or logged in), **then** the page loads identically — no auth is required. |

### US-3.2: League Detail Page

**As a** user browsing Pitchside, **I want to** see detailed information about a specific league including standings, fixtures, and team roster, **so that** I can follow the league's progress throughout the season.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-11 | **Given** a user navigates to `/league/[slug]` with a valid slug (e.g., `/league/la-liga`), **when** the page loads, **then** it displays the league header with: league logo, league name, country, and season date range. |
| AC-12 | **Given** a user navigates to `/league/[slug]` with an invalid slug, **when** the page loads, **then** it displays a "League not found" message with a link back to `/leagues`. |
| AC-13 | **Given** the user is on `/league/[slug]`, **when** the page loads, **then** three tabs are displayed: "Standings", "Fixtures", "Teams". The "Standings" tab is active by default. |
| AC-14 | **Given** the user is on the Standings tab of `/league/[slug]`, **then** the page displays a full standings table using the shared `StandingsTable` component with columns: Position, Team, Played, Won, Drawn, Lost, Goals For, Goals Against, Goal Difference, Points. |
| AC-15 | **Given** the user is on the Standings tab, **then** the standings are computed from completed matches using the shared `computeStandings()` function from `src/lib/standings.ts`. Sorting order: Points desc → Goal Difference desc → Goals For desc. |
| AC-16 | **Given** the user is on the Standings tab, **when** they click on a team name in the table, **then** they are navigated to `/team/[team-slug]`. |
| AC-17 | **Given** the user clicks the "Fixtures" tab on `/league/[slug]`, **then** the page displays all league matches grouped by matchday, showing: date, kickoff time (in user's local timezone), home team logo, home team name, score (if completed), away team score, away team name. |
| AC-18 | **Given** the user is viewing the Fixtures tab, **when** they click on a team name (home or away), **then** they are navigated to `/team/[team-slug]`. |
| AC-19 | **Given** the user is on the Fixtures tab, **then** matches are grouped by matchday headers (e.g., "Matchday 1", "Matchday 2", ...). Matches within each matchday are ordered by kickoff time. |
| AC-20 | **Given** the user clicks the "Teams" tab on `/league/[slug]`, **then** the page displays a grid of all teams in the league, each showing: team logo, team name, and a link to `/team/[team-slug]`. |
| AC-21 | **Given** the user is on the Teams tab, **when** they click on a team card, **then** they are navigated to `/team/[team-slug]`. |
| AC-22 | **Given** the user is on `/league/[slug]`, **when** the page loads, **then** match times are displayed in the user's configured timezone (logged-in users: `UserPreference.timezone`; anonymous users: browser timezone or UTC). |
| AC-23 | **Given** the user is on `/league/[slug]`, **then** the page loads identically for both anonymous and logged-in users — no authentication is required. |

### US-3.3: Team Drill-Down from League View

**As a** league viewer, **I want to** click on any team name or card to see that team's detailed page, **so that** I can explore the team's schedule, standings, and information.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-24 | **Given** the user is on any page within a league context (`/leagues`, `/league/[slug]`), **when** they click on a team name or team card, **then** they are navigated to `/team/[team-slug]` for that specific team. |
| AC-25 | **Given** the user is on `/team/[slug]` and the team belongs to a league (has `leagueId` set), **then** the team page displays a league badge/link showing: "Playing in: [League Name] →" which links to `/league/[league-slug]`. |
| AC-26 | **Given** the user is on `/team/[slug]` and the team does NOT belong to a league (e.g., a national team with `leagueId: null`), **then** no league badge is displayed. |
| AC-27 | **Given** the user is on `/team/[slug]` and clicks the league badge link, **then** they are navigated to `/league/[league-slug]` for that team's league. |
| AC-28 | **Given** the user is on `/team/[slug]`, **then** the page shows conditional tabs per conventions Section 6.1: "Club" tab if the team has club matches, "International" tab if the team has international matches. |

### US-3.4: League Seed Data

**As a** developer/architect, **I want** the system to include at least 3 seeded leagues with teams and matches, **so that** the league directory and detail pages have meaningful content to display.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-29 | **Given** the seed data is loaded, **then** at least 3 leagues exist in `src/data/leagues.ts`: La Liga, MLS, and USL League One. |
| AC-30 | **Given** a seeded league exists, **then** it has all required fields: `id` (UUID), `name`, `slug` (kebab-case), `logoUrl`, `country`, `type`, `seasonStart`, `seasonEnd`. |
| AC-31 | **Given** a seeded league exists, **then** its `teams` array contains at least 3 teams with valid `id`, `name`, `slug`, `type`, `crestUrl`, and `leagueId` fields. |
| AC-32 | **Given** a seeded league exists, **then** its `matches` array contains at least 2 matches with valid `id`, `homeTeamId`, `awayTeamId`, `scoreHome`, `scoreAway`, `status`, and `kickoff` fields. |
| AC-33 | **Given** all seeded leagues and teams exist, **then** every team's `leagueId` references a valid league `id` (no orphaned team references). |
| AC-34 | **Given** all seeded matches exist, **then** every match's `homeTeamId` and `awayTeamId` reference valid team `id` values (no orphaned match references). |

---

## 6. Component Inventory

### 6.1 New Components (Epic 3)

| Component | Location | Purpose | Props |
|-----------|----------|---------|-------|
| `LeagueCard` | `src/components/LeagueCard.tsx` | Individual league card in the directory grid. Displays: logo, name, country, season start, "View" arrow. | `league: League`, `onClick?: (slug: string) => void` |
| `LeagueGrid` | `src/components/LeagueGrid.tsx` | Grid container for multiple `LeagueCard` components. Handles responsive layout (3-col desktop, 1-col mobile). | `leagues: League[]`, `searchQuery?: string`, `filterType?: string` |
| `LeagueHeader` | `src/components/LeagueHeader.tsx` | Banner at top of `/league/[slug]`. Displays: league logo, name, country, season dates. | `league: League` |
| `LeagueTabs` | `src/components/LeagueTabs.tsx` | Tab bar for league detail page. Contains: Standings, Fixtures, Teams tabs. | `activeTab: string`, `onTabChange: (tab: string) => void` |
| `LeagueTeamList` | `src/components/LeagueTeamList.tsx` | Grid/list of teams within a league (used on the Teams tab). | `teams: Team[]` |

### 6.2 Reused Components (from conventions)

| Component | Epic(s) that use it | Notes |
|-----------|---------------------|-------|
| `StandingsTable` | Epic 2 (homepage), **Epic 3** (league detail standings tab) | Shared component. Receives `Standing[]` data. |
| `TeamCard` | **Epic 3** (league detail teams tab), Epic 2, Epic 4 | Display team name, logo, link to `/team/[slug]`. |
| `FollowButton` | **Epic 3** (team pages within league context) | State depends on auth status (localStorage vs database). |
| `CountdownRing` | Epic 2, **Epic 3** (fixtures tab for upcoming matches) | Shows countdown to match kickoff. |

---

## 7. Integration Notes

### 7.1 Standings Computation

The `computeStandings()` function defined in shared conventions Section 5.1 is used on league detail pages exactly as specified:

```typescript
// In league detail page (or server function):
import { computeStandings } from "@/lib/standings";
import { getLeagueBySlug } from "@/lib/data/league";
import { getTeamsByLeagueId } from "@/lib/data/team";

const league = await getLeagueBySlug(params.slug);
const matches = league.matches.filter(m => m.status === "completed");
const standings = computeStandings(matches, league.teams);
```

This is the same function used by Epic 2 for World Cup groups. No Epic 3-specific standings logic.

### 7.2 Search Implementation

The search on `/leagues` is a client-side filter on the loaded league data:

```typescript
// In src/data/leagues.ts (extended):
export function searchLeagues(query: string, leagues: League[]): League[] {
  const q = query.toLowerCase();
  return leagues.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.country.toLowerCase().includes(q)
  );
}
```

### 7.3 Repository Pattern for Data Access

All league data is accessed through repository functions in `src/lib/data/league.ts` (conventions Section 7.3). This allows future swap from static seed data to API calls without changing page components:

```typescript
// src/lib/data/league.ts
export async function getAllLeagues(): Promise<League[]> {
  // Currently: return leagues from src/data/leagues.ts
  // Future: return data from API endpoint
}

export async function getLeagueBySlug(slug: string): Promise<League | null> {
  // Currently: find league in seed data by slug
  // Future: API call with slug parameter
}

export async function getLeaguesByType(type: string): Promise<League[]> {
  // Currently: filter seed data by type
  // Future: API call with type filter
}

export async function searchLeagues(query: string): Promise<League[]> {
  // Currently: filter seed data by name/country
  // Future: API search endpoint
}
```

---

## 8. Scope Boundaries

### In Scope
- `/leagues` page — icon grid, search, type filter
- `/league/[slug]` page — league header with logo, name, country, season dates
- `/league/[slug]` tabs — Standings (via `StandingsTable` + `computeStandings`), Fixtures (matchday-grouped), Teams (grid)
- `/team/[slug]` league badge — shows which league a team belongs to (club teams only)
- `League` entity extension (logoUrl, country, type, seasonStart, seasonEnd)
- `Team.leagueId` field for team-to-league relationship
- Seed data: 3 leagues minimum (La Liga, MLS, USL League One) with teams and matches
- Repository pattern for all league data access
- Responsive layout (desktop grid → mobile single column)

### Out of Scope
- World Cup in league directory (handled by Epic 2 at `/group/[letter]` — per conventions Section 9, Q9)
- League search autocomplete (deferred to later)
- International tournament pages (Epic 4)
- League ranking or comparison between leagues
- Fantasy integration or player data within leagues
- Team rosters beyond name and logo on team cards
- Live score push or real-time updates
- League-specific user preferences or notifications (out of scope — conventions Section 3.3)
- Pagination or infinite scroll on league directory (all 3+ leagues fit in a single grid for R2)

---

## 9. Dependencies on Other Epics

| Dependency | Epic | Impact |
|------------|------|--------|
| `Team.id` (UUID) field | 1, 2, 4 | League detail pages display team names/links that reference `Team.id` for Follow API compatibility. |
| `computeStandings()` function | 2 | League standings tab reuses the same function from Epic 2. Located in `src/lib/standings.ts`. |
| `StandingsTable` component | 2 | Shared component, rendered on league detail standings tab. Located in `src/components/StandingsTable.tsx`. |
| Auth.js middleware | 1 | Not directly used (league pages are public), but FollowButton on team drill-downs depends on Epic 1's auth state. |
| Timezone convention | 1 | Match times on league fixtures tab use `UserPreference.timezone` for logged-in users (conventions Section 7.2). |
| Team page conditional tabs | 4 | Team detail pages shown from league context use conditional tabs (Club/International) per conventions Section 6.1. |

---

## 10. Open Questions for Chris / Brainiac

| # | Question | Epic | Impact | Notes |
|---|----------|------|--------|-------|
| 1 | **League logo assets:** Are league crest/SVG assets available, or should we use placeholder icons for R2? | 3 | Affects visual quality of `/leagues` grid | Convention Section 9, Q8. Recommendation: SVG icon placeholders for R2. |
| 2 | **League data scope:** Is 3 leagues (La Liga, MLS, USL League One) sufficient, or should we add more club leagues? | 3 | Affects directory content richness | Convention Section 9, Q7. Recommendation: 3 club leagues sufficient for R2. |
| 3 | **Seed data volume:** How many teams and matches should be seeded per league? | 3 | Affects `src/data/` file sizes | Recommendation: 3+ teams and 2+ matches per league minimum; architect should determine reasonable volume. |
| 4 | **Type filter values:** For the type filter dropdown, should "Club" show both `type: "club"` and `type: "international-club"` in R2? | 3 | Affects filter logic | For R2, all seeded leagues are `type: "club"`. The "international-club" type is reserved for Epic 4 multi-country leagues. Recommendation: "All" and "Club" only for R2, with "Club" showing all seeded leagues. |

---

## 11. Wireframe: `/team/[slug]` — Team Detail (Epic 3 Extension)

This page exists across Epics 2, 3, and 4. Epic 3 adds the **league context badge**:

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (shared)                                               │
│  [Pitchside]  Home  Leagues  International  Search  [Avatar] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  [Team Crest]  Real Madrid                              │   │
│  │  Club • Founded 1902 • Santiago Bernabéu Stadium        │   │
│  │                                                       │   │
│  │  [🏆 Playing in: La Liga →]                            │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────┐  ┌─────────────────────────────────┐  │
│  │  Club Matches     │  │  Standings                      │  │
│  │                   │  │  ┌───┬───────────┬───┐            │  │
│  │  [Matchday 1 cards] │  │  │ 1 │Real Madrid│ 44│            │  │
│  │  [Matchday 2 cards] │  │  │ 2 │Barcelona │ 42│            │  │
│  │  ...              │  │  │... │ ...     │  ..│            │  │
│  │                   │  │  └───┴───────────┴───┘            │  │
│  └───────────────────┘  └─────────────────────────────────┘  │
│                                                              │
│  Upcoming Matches:                                             │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Jun 28 — Real Madrid vs Barcelona (La Liga)          │   │
│  │  ⏱ 4d 12h 30m                                         │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**League badge:** Only shown when `team.leagueId` is not null. Clicking it navigates to `/league/[league-slug]`.

---

## 12. Priority Assessment

| User Story | Priority | Rationale |
|------------|----------|-----------|
| US-3.1 (League Directory Browse) | **High** | Foundation — no directory without browseable list |
| US-3.2 (League Detail Page) | **High** | Core value — standings, fixtures, teams are the main content |
| US-3.3 (Team Drill-Down) | **High** | Navigation between league and team pages is essential UX |
| US-3.4 (Seed Data) | **High** | Required for all other stories to have content to display |

---

## 13. Component Hierarchy (League Detail Page)

```
LeagueDetailPage (/league/[slug])
├── LeagueHeader (league: League)
├── LeagueTabs (activeTab, onTabChange)
│   ├── Tab: Standings
│   │   └── StandingsTable (standings: Standing[])  ← from Epic 2
│   │       └── TeamLink (team name → /team/[slug])
│   ├── Tab: Fixtures
│   │   ├── MatchdayGroup (matchday: string, matches: Match[])
│   │   │   └── FixtureCard (match: Match)
│   │   │       └── TeamLink (home team)
│   │   │       └── TeamLink (away team)
│   │   │       └── CountdownRing (if upcoming)
│   │   └── ...
│   └── Tab: Teams
│       └── LeagueTeamList (teams: Team[])
│           └── TeamCard (team: Team) → /team/[slug]
```

---

## 14. Data Flow (League Detail)

```
User navigates to /league/la-liga
    │
    ▼
getLeagueBySlug("la-liga")  →  reads from src/data/leagues.ts
    │
    ├─► League data returned (name, slug, logo, teams[], matches[])
    │
    ├─► computeStandings(league.matches[completed], league.teams)
    │       └─► Standing[] (sorted by Pts → GD → GF)
    │
    ├─► getTeamsByLeagueId(league.id)  →  filtered from src/data/teams.ts
    │       └─► Team[]
    │
    └─► Group matches by matchday for fixtures tab
            └─► MatchdayGroup[]
```

---

*Document generated 2026-06-24 by Lois Lane, Fortress of Solitude Consulting.*
*Handed off to Brainiac (web architect) for system architecture and implementation planning.*
