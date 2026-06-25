# Pitchside R2 — Shared Conventions

**Purpose:** Resolve cross-epic conflicts, eliminate ambiguity, and establish the single source of truth for implementation. All four epics (Auth, Homepage, League Directory, International Soccer) must follow these conventions.

**Prepared by:** Lois Lane (BA) — reviewed against requirements/epic-1 through epic-4, REQUIREMENTS_R2.md, and current codebase (`src/`).

**Status:** Final. All conflicts resolved. Use this doc as the primary reference for Brainiac's architecture and implementation.

---

## 1. Navigation / Header Conventions

### Resolution

**Unified Header (all pages, logged in and logged out):**

| Element | Logged Out | Logged In |
|---------|------------|-----------|
| Left | Pitchside logo (links to `/`) | Same |
| Nav items | Home, Leagues, International, Search | Home, Leagues, International, Search, Follows |
| Right | Sign In button | Avatar dropdown → Account, Logout |

**Decisions:**
- No "My Feed" or "Dashboard" as separate nav items. Those are sections on the homepage, not top-level pages.
- "Home" links to `/`. The homepage is the single landing page (Epic 2).
- "International" exists but its page (`/international`) is defined in Epic 4 (requirements pending). The nav item is reserved.
- "Follows" appears only when logged in. Anonymous users see no Follows link.

**Why these decisions:**
- Epic 1's nav (Home, Search, Follows, Account/Logout) omits Leagues and International — too narrow.
- Epic 2's nav (Home, Search, My Feed) omits Leagues and International — conflicts with Epic 3 and 4.
- Epic 3's nav (Dashboard, Leagues, International, Search) uses "Dashboard" which is the homepage concept, not a separate page.
- This convention unifies all four epics into a single, consistent nav.

---

## 2. Route Naming Conventions

### Resolved Conflicts

| Conflict | Resolution |
|----------|-----------|
| Epic 1 uses `/account` for user profile/settings | **KEEP `/account`** |
| Epic 3's route table references `/profile` | **CHANGE to `/account`** |
| REQUIREMENTS_R2.md uses `/profile` | **CHANGE to `/account`** |

**Final route set:**

|| Route | Page | Auth Required | Epic |
||-------|------|---------------|------|
|| `/` | Homepage (weekly fixtures, group standings, knockout, followed teams) | No | 2 |
|| `/leagues` | League Directory | No | 3 |
|| `/league/[slug]` | League Detail | No | 3 |
|| `/international` | International Soccer overview | No | 4 |
|| `/tournament/[slug]` | Tournament Detail | No | 4 |
|| `/national-team/[slug]` | National Team Detail | No | 4 |
|| `/team/[slug]` | Team Detail | No | 3/4 |
|| `/group/[letter]` | World Cup Group | No | 2 |
|| `/search` | Search Teams | No | 3 |
|| `/feed` | Personal Dashboard (followed teams) | **Yes** | 1 |
|| `/login` | Sign In | No (redirects to `/` if already logged in) | 1 |
|| `/account` | User Profile & Settings | **Yes** | 1 |

**Note on `/feed`:** Epic 1's route table says `/feed` is "No" auth, but REQUIREMENTS_R2.md says "Yes." The intentional design is: `/feed` becomes the authenticated user dashboard (my followed teams). It requires auth. Anonymous users visiting `/feed` are redirected to `/login`.

---

## 3. Data Model Conventions

### 3.1 Follow Entity — Resolving Team ID Ambiguity

**Problem:** Epic 1 says `Follow.teamId: string` references "Team.slug or Team.id" — ambiguous.

**Resolution:**
- Use `Team.id` (UUID string, not slug) as the FK reference in the Follow entity.
- Slug is a display/URL identifier; ID is the stable primary key. Never use slug as a FK.

```typescript
// Follow entity (database model)
interface Follow {
  id: string;          // UUID, PK
  userId: string;      // UUID, FK → User.id
  teamId: string;      // UUID, FK → Team.id  (NOT slug)
  createdAt: Date;
  // UNIQUE(userId, teamId) — prevents duplicates
}

// Team entity (extended from current types.ts)
interface Team {
  id: string;          // UUID, PK  (NEW — add this)
  name: string;
  slug: string;        // kebab-case, used in URLs (/team/[\slug])
  type: "club" | "national";
  // ... existing fields (crestUrl, flag, etc.)
}
```

### 3.2 User Entity

```typescript
interface User {
  id: string;          // UUID, PK
  provider: "google" | "github";  // OAuth provider
  providerId: string;  // Provider's user ID (unique per provider)
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  tenantId: string;    // Multi-tenant isolation (single tenant for R2)
  createdAt: Date;
  updatedAt: Date;
  // UNIQUE(provider, providerId) — OAuth lookup
}
```

### 3.3 UserPreference Entity

```typescript
interface UserPreference {
  id: string;          // UUID, PK
  userId: string;      // UUID, FK → User.id, unique
  timezone: string;    // IANA timezone, default "UTC"
  theme: "dark" | "light" | "system";
  createdAt: Date;
  updatedAt: Date;
}
```

**NOTICE — Scope conflict resolved:** Epic 1 US-6 (USERS preference = timezone + theme only) takes priority. REQUIREMENTS_R2.md US-1.2 adds "notification preferences" which is explicitly out of scope per Epic 1's constraints ("No scope creep — notification preferences deferred to later epics"). Notification settings stay on the `/account` UI as a placeholder with a note: "Coming in a future release." Do NOT implement notification logic.

### 3.4 Anonymous Follow Handling

**Resolution:** Epic 1's current behavior (`useFollowTeams` with localStorage) becomes the anonymous fallback. When an anonymous user clicks Follow:
1. Persist to localStorage (same as current behavior).
2. Show a toast/banner: "Sign in to sync your follows across devices."
3. When the user logs in, migrate localStorage follows to the database (Epic 1 US-7).

This resolves the REQUIREMENTS_R2.md US-1.3 AC-14/15 conflict with Epic 1's simpler approach.

### 3.5 Tournament Entity (New — Epic 4)

```typescript
// src/data/types.ts (new)
interface Tournament {
  id: string;           // UUID, PK — "fifa-world-cup-2026"
  name: string;         // Display name: "FIFA World Cup 2026"
  slug: string;         // kebab-case, used in URLs (/tournament/[slug])
  category: TournamentCategory;
  logoUrl?: string;
  hostCountries: string[];
  seasonStart: Date;
  seasonEnd: Date;
  status: TournamentStatus; // "upcoming" | "ongoing" | "completed"
  stages: TournamentStage[];
  groupStandings?: Standing[][];  // Per-group standings (indexed by group letter/number)
  teams: Team[];
  matches: Match[];
  knockoutResults?: KnockoutBracket;
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

### 3.6 Tournament Stage Entity (New — Epic 4)

```typescript
// src/data/types.ts (new)
interface TournamentStage {
  id: string;           // UUID, PK — "wc2026-group", "wc2026-knockout"
  name: string;         // "Group Stage", "Round of 32", "Quarter-finals"
  stageOrder: number;   // Sort order (1 = first)
  startDate: Date;
  endDate: Date;
  matchCount: number;
  description?: string;
  isKnockout?: boolean; // true for knockout stages, false for group stages
}
```

### 3.7 TeamRoster Entity (New — Epic 4)

```typescript
// src/data/types.ts (new)
interface TeamRoster {
  tournamentId: string;   // FK → Tournament.id
  teamId: string;         // FK → Team.id (national team)
  entries: TeamRosterEntry[];
}

interface TeamRosterEntry {
  squadNumber: number;
  playerId: string;       // FK → Player.id (or name fallback)
  playerName: string;
  position: "GK" | "DF" | "MF" | "FW";
  appearances?: number;
  goals?: number;
  assists?: number;
}
```

### 3.8 Player Entity (New — Epic 4, optional)

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

### 3.9 KnockoutBracket Entity (New — Epic 4, reuses convention Section 5.2)

```typescript
// src/data/types.ts (new)
interface KnockoutMatch {
  id: string;            // e.g., "R32-1"
  stage: string;         // e.g., "Round of 32"
  roundOrder: number;    // 1 = Round of 32, 2 = Round of 16, etc.
  homeTeam: string | null;
  awayTeam: string | null;
  homeScore: number | null;
  awayScore: number | null;
  date: string | null;
  venue: string | null;
  nextMatchId: string | null;
  defeatedTeam: string | null;
  winner: string | null;  // Team slug — propagated through bracket by computeKnockoutResults()
}

type KnockoutBracket = KnockoutMatch[];
```

**Decision:** Flat array with `nextMatchId` linking is used over nested KnockoutRound objects. A match's `winner` becomes the `homeTeam` or `awayTeam` label in the next round. `roundOrder` handles UI grouping (all matches with same roundOrder are in the same bracket round).

### 3.10 TournamentPhase Type (New — Epic 2)

```typescript
// src/data/types.ts (new)
type TournamentPhase = "group" | "knockout";

interface TournamentState {
  phase: TournamentPhase;
  phaseEndDate: Date | null;   // Last group match date
  lastUpdated: Date;
}
```

**Decision:** Homepage reads `TournamentState` to decide whether to render group standings or knockout bracket. Phase transition is result-based (all group matches completed) by default.

### 3.11 Match Entity — Complete Field Convention (Replaces §3.10)

```typescript
// src/data/types.ts (extended)
interface Match {
  id: string;              // UUID, PK
  homeTeamId: string;      // FK → Team.id
  awayTeamId: string;      // FK → Team.id
  date: string;            // ISO 8601 date-only string (UTC) — for display "day of"
  kickoff: string;         // ISO 8601 datetime string (UTC) — for time-based computation
  status: MatchStatus;     // "upcoming" | "live" | "completed"
  homeScore: number | null;
  awayScore: number | null;
  venue?: string;
  competition: string;            // Display label for UI: "WC Group A", "La Liga"
  competitionType?: string;       // Internal type: "fifa-world-cup-2026", "euro-2024"
  leagueId?: string;              // FK → League.id (club matches only)
  tournamentStageId?: string;     // FK → TournamentStage.id (international matches only)
  group?: string;                 // Group letter (e.g., "A", "B") for WC matches
  stage?: string;                 // Stage name (e.g., "Group Stage", "Round of 32")
  matchday?: number;              // Matchday number for league fixtures
}
```

**Clarification:** `competition` is the human-readable label shown in UI. `competitionType` is the internal slug-like key used for data filtering (e.g., `getMatchesThisWeek()` filters by competitionType to group matches). `leagueId` and `tournamentStageId` are the primary FK relationships; `competition` and `competitionType` are redundant display helpers seeded from the FK relationship.

### 3.12 Team Entity Extension (Epic 4)

National teams may have caps and goals fields:

```typescript
// src/data/types.ts (extended)
interface Team {
  // ... existing fields
  caps?: number;   // International caps (national teams only)
  goals?: number;  // International goals scored (national teams only)
}
```

---

## 4. Match Entity — Status Type Convention

### Conflict

| Source | Status type |
|--------|-------------|
| Current codebase (`src/data/types.ts`) | `"upcoming" \| "completed"` |
| Epic 2 | Recommends adding `"live"`: `"upcoming" \| "live" \| "completed"` |
| REQUIREMENTS_R2.md | `"scheduled" \| "live" \| "completed" \| "postponed" \| "cancelled"` |

### Resolution

Adopt **Epic 2's simpler model** for R2 MVP:

```typescript
type MatchStatus = "upcoming" | "live" | "completed";
```

- `"upcoming"` = kickoff date is in the future.
- `"live"` = current time is within 2 hours of kickoff.
- `"completed"` = match has ended.

R2 uses static seeded data only (per Epic 2 constraints). Live status is computed client-side via `isLive(match)`. Postponed/cancelled states are out of scope.

The REQUIREMENTS_R2.md expanded status set is acknowledged for Phase 2.

---

## 5. Shared Utility Conventions

### 5.1 Standings Computation — Single Shared Function

**Problem:** Epic 2 needs `computeGroupStandings(groupFixtures, groupTeams)` for World Cup groups. Epic 3 needs standings for league pages. Same algorithm (Pts → GD → GF), different data sources.

**Resolution:** ONE shared utility function:

```typescript
// src/lib/standings.ts
export function computeStandings(matches: Match[], teams: Team[]): Standing[];
```

This function:
- Takes any set of matches and teams.
- Computes P/W/D/L/GF/GA/GD/Pts from completed matches.
- Sorts by: (1) Points desc, (2) GD desc, (3) GF desc.
- Returns `Standing[]` — the existing interface is reused without changes.

**Used by:**
- Epic 2: `computeStandings(groupMatches, groupTeams)` for each World Cup group.
- Epic 3: `computeStandings(leagueMatches, leagueTeams)` for league detail pages.

Place in `src/lib/standings.ts`. Import from both homepage (Epic 2) and league detail page (Epic 3).

### 5.2 Knockout Results Computation

```typescript
// src/lib/standings.ts (extended)
export function computeKnockoutResults(bracket: KnockoutBracket): KnockoutBracket;
```

Takes knockout matches (Round of 32 through Final as a flat `KnockoutMatch[]` array), determines winners from `homeScore`/`awayScore`, sets `winner` field, propagates winners to next round via `nextMatchId` linking. Returns `KnockoutBracket` with updated `homeTeam`/`awayTeam` labels for the next round.

### 5.3 "This Week" Match Aggregation

```typescript
// src/lib/matches.ts
export function getMatchesThisWeek(matches: Match[], currentDay: Date): Match[];
```

Aggregates from ALL data sources:
- World Cup group matches (Epic 2)
- World Cup knockout matches (Epic 2)
- Club league matches (Epic 3)
- International tournament matches (Epic 4) — keyed by `Match.competitionType`

The homepage "This Week" strip calls this function with the combined match list from all epics. Each match carries a `competition` or `leagueId` / `tournamentStageId` field so the UI can display the source (e.g., "WC Group A", "La Liga", "World Cup 2026").

### 5.4 Date Range Convention

**"This Week" = calendar week (Monday–Sunday).** This aligns with sports broadcasting conventions and is the simplest to implement. Not a rolling 7-day window.

---

## 6. Component Conventions

### 6.1 Team Page Tabs — Club vs International

**Problem:** Epic 3 (AC-22/23) proposes adding "Club" and "International" tabs to team pages. This overlaps with Epic 4's data model.

**Resolution:** Design the tabs now, render conditionally:

```tsx
// src/app/team/[slug]/page.tsx
// Show "Club" tab if team.type === "club" OR team has club matches
// Show "International" tab if team.type === "national" OR team has international matches
// If both exist: show both tabs
// If only one exists: show one tab (no tab bar needed)
```

**Team page layout (all teams, club and national):**
1. Team header (logo/flag, name, details) — always shown.
2. **Tab bar (conditional):**
   - Club matches — shown if team has club schedule data.
   - International matches — shown if team has international schedule data.
3. **Standings section** — shown if team has standings data (club leagues or group standings).
4. **Upcoming/Recent matches** — shown always.
5. **News feed** — shown if team has news data.

This satisfies Epic 3's AC-22/23 requirement while being forward-compatible with Epic 4's full international data model.

### 6.2 Search Page — Unified Filter Model

**Problem:** Epic 3 needs league-level filtering on `/search`. Epic 4 needs international competition filtering.

**Resolution:** Design a unified search filter model:

```tsx
// /search page filters:
// - Type: Club / National (radio)
// - League: Dropdown (populated from League entities, Epic 3)
// - Competition: Dropdown (populated from Tournament entities, Epic 4)
// - Search input: Text field (team name partial match)
```

All filters are optional and additive (AND logic). The underlying `searchTeams` utility in `src/data/teams.ts` is extended to accept filter params.

### 6.3 FollowButton — State Source Convention

The current `useFollowTeams` hook (localStorage-based) is the foundation. After Epic 1 is implemented:

| Auth State | Follow Source | Write Target |
|------------|--------------|--------------|
| Anonymous | localStorage (`pitchside-following`) | localStorage |
| Logged in | Database (Follow table) | Database API |
| Logged in + migration in progress | localStorage (fallback) | Database (on success, delete localStorage) |

The hook interface (`followTeam`, `unfollowTeam`, `toggleFollow`, `isFollowing`, `followedTeamIds`) remains unchanged for component compatibility. The implementation layer swaps from localStorage to database-synced.

### 6.4 Component File Location Convention

| Component Type | Location | Examples |
|---------------|----------|----------|
| Shared UI components | `src/components/` | `FollowButton`, `TeamCard`, `StandingsTable`, `CountdownRing` |
| Page components | `src/app/[route]/page.tsx` | `src/app/team/[slug]/page.tsx` |
| Server-side data fetching | Inside page components or `src/lib/` functions | `getTeamBySlug()`, `computeStandings()` |
| Client hooks | `src/hooks/` | `useFollowTeams` |
| Utility functions | `src/lib/` | `standings.ts`, `matches.ts` |
| Type definitions | `src/data/types.ts` | All interfaces |

---

## 7. Additional Conventions

### 7.1 Slug Convention

All slugs (team, league, tournament, group) use kebab-case, lowercase. Examples: `real-madrid`, `la-liga`, `world-cup-2026`. Generated from display name with non-alphanumeric characters replaced by hyphens.

### 7.2 Timezone Convention

All dates stored in UTC on the data layer. Converted to user's local timezone on the client:
- Logged-in users: use `UserPreference.timezone`.
- Anonymous users: use browser's `Intl.DateTimeFormat().resolvedOptions().timeZone` or default to UTC.
- Display: `Intl.DateTimeFormat` with the resolved timezone.

### 7.3 Static Data Layer Convention

R2 uses static seeded data from `src/data/` only. The data model should use a repository/service function pattern in `src/lib/` that abstracts the data source, enabling a future swap to API calls without rewriting components.

Example:
```typescript
// src/lib/data/team.ts
export async function getTeamBySlug(slug: string): Promise<Team | null> {
  // Currently reads from src/data/teams.ts
  // Future: swaps to database query without changing page components
}
```

### 7.4 Dark Theme Convention

Pitchside is dark-only. Root layout uses `bg-slate-950 text-slate-300 antialiased`. No light mode support in R2. All new components follow this convention.

---

## 8. Items Deferred to Epic 4

These are resolved in the Epic 4 requirements doc (`requirements/epic-4-international-soccer-requirements.md`):
- International tournament bracket/cup display (reuses Epic 2's `computeKnockoutResults()` in `src/lib/standings.ts`).
- "International" nav item (implemented — highlights on `/international` and `/tournament/[slug]`).
- National team pages on `/national-team/[slug]` with tournament tabs.
- Follow entity — Follow table supports both club and national teams (generic `teamId`).
- Knockout tab hidden for group-only tournaments.
- Aggregate standings across all groups (Standings tab).

---

## 9. Unresolved Questions (Flagged for Chris)

| # | Issue | Epic(s) | Notes |
|---|-------|---------|-------|
| 1 | Auth providers: Google+GitHub (Epic 1) vs Google+Apple+Email (R2) | 1, R2 | **Decision: Google+GitHub only** (per Epic 1). Email/password deferred. Apple OAuth not in scope. |
| 2 | Database choice | 1 | Architect decision for Brainiac. PostgreSQL recommended. |
| 3 | OAuth provider credentials | 1 | Chris must register Google + GitHub OAuth apps. |
| 4 | Deployment target | 1 | Affects session cookie config and OAuth redirect URLs. |
|| 5 | Knockout tiebreakers: AET/Pen annotations? | 2 | Not needed for R2 MVP — final score is sufficient. |
|| 6 | Match score data update process | 2 | Manual update or helper script? Recommendation: simple script. |
|| 7 | League data scope (beyond 3 club leagues)? | 3 | Recommendation: 3 club leagues + World Cup groups sufficient for R2. |
|| 8 | League logo assets | 3 | Recommendation: SVG icon placeholders for R2. |
|| 9 | World Cup in league directory? | 3/4 | **Decision: NO.** World Cup is handled by Epic 2 (`/group/[letter]`), not the league directory. |
|| 10 | Tournament seed data scope | 4 | Which tournaments to seed (World Cup 2026 + placeholders vs 3 full tournaments)? Affects data file size. |
|| 11 | Aggregate standings: include knockout matches? | 4 | Does aggregate standings row update when teams advance through knockouts? |
|| 12 | Player-level stats per tournament | 4 | Depth of roster data: squad number + name vs appearances/goals/assists per tournament. |
|| 13 | National teams on `/team/[slug]` vs `/national-team/[slug]` | 3/4 | Should national teams appear on the existing `/team/[slug]` route or separate route? Decision: `/national-team/[slug]` is new route. |
|| 14 | Homepage featured carousel: include international matches? | 2/4 | Should active tournament matches be eligible for featured carousel? |
|
---

*Document generated 2026-06-24 by Lois Lane, Fortress of Solitude Consulting.*
*Handed off to Brainiac (web architect) for system architecture and implementation planning.*
