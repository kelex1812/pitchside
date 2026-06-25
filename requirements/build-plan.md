# Pitchside R2 — Steel Build Plan

**Generated:** 2026-06-24
**Source:** Architecture (brainiac t_eca64bb2) + BA docs (lois) + Shared Conventions
**Status:** Ready for implementation (pending design finish)

---

## Build Phases

### PHASE A: Auth Foundation (Epic 1) — MUST BE FIRST

1. **Data Types (`src/data/types.ts`)**
   - Add User, UserPreference, Follow interfaces (from architecture §1.3)
   - Add TeamType, MatchStatus types
   - Verify existing Team, Standing, Match interfaces

2. **Auth Setup (NextAuth.js v5)**
   - Install `@auth/core` or `next-auth`
   - Create `/api/auth/[...nextauth]/route.ts` — Google + GitHub providers
   - Create middleware.ts with auth guard for `/feed` and `/account`
   - Configure session management (JWT sessions or database-backed)

3. **Pages**
   - `/login` page: Google + GitHub OAuth buttons, centered card layout
   - `/feed` page: Authenticated dashboard showing followed teams' matches
   - `/account` page: Profile, timezone, followed teams list, notification placeholder

4. **Hooks & APIs**
   - `src/hooks/useAuth.ts` — Wrap Auth.js session
   - `src/hooks/useFollowTeams.ts` — Dual mode: localStorage (anonymous) + DB (logged-in)
   - `POST /api/follows` — Create follow
   - `DELETE /api/follows/[teamId]` — Remove follow
   - `GET /api/follows` — Get followed teams

5. **localStorage Migration**
   - On first login, read `pitchside-following` from localStorage
   - Convert slugs → team IDs → insert Follow records
   - Clear localStorage key on successful migration

**Contracts Provided:**
- `useAuth()` hook API (Section 5.1 of architecture)
- `useFollowTeams()` hook API (Section 5.2)
- Follow API endpoints
- User + UserPreference + Follow type definitions

---

### PHASE B: Homepage + Shared Utilities (Epic 2) — DEPENDS ON A

1. **Shared Utilities (`src/lib/`)**
   - `src/lib/standings.ts`: `computeStandings()`, `computeKnockoutResults()`, `isLive()`
   - `src/lib/matches.ts`: `getMatchesThisWeek()`, match filtering helpers
   - `src/lib/time.ts`: `convertToUserTime()`, `getWeekRange()`

2. **Repository Layer (`src/lib/data/`)**
   - `matches.ts`: `getAllMatches()`, `getWorldCupGroupMatches()`, `getWorldCupKnockoutMatches()`, `getClubLeagueMatches()`
   - `teams.ts`: `getTeamsByLeague()`, `getFollowedTeams()`
   - `tournaments.ts`: `getTournamentState()`

3. **Shared Components**
   - `src/components/MatchCard.tsx` — Reusable match card
   - `src/components/CountdownRing.tsx` — Countdown timer
   - `src/components/FollowButton.tsx` — Rewritten for persistent state
   - `src/components/StandingsTable.tsx` — Verify existing props match Standing[]

4. **Epic 2-Specific Components**
   - `WeeklyStrip.tsx` — "This Week" live games strip
   - `GroupStandingsGrid.tsx` — Responsive group standings grid
   - `KnockoutBracket.tsx` — Horizontal bracket (desktop), vertical (mobile)
   - `FollowedTeamsSection.tsx` — Followed teams matches/CTA
   - `ClubTeamsSection.tsx` — Featured club leagues

5. **Homepage (`src/app/page.tsx`) — Complete Rewrite**
   Sections in order: WeeklyStrip → GroupStandingsGrid/KnockoutBracket → FollowedTeamsSection → ClubTeamsSection
   Phase logic: group ↔ knockout based on TournamentState

6. **Data Seeding**
   - Update `src/data/teams.ts` with leagueId, caps, goals
   - Update `src/data/matches.ts` with competition, leagueId, tournamentStageId, group, stage
   - Create `src/data/leagues.ts` with 3+ leagues
   - Create `src/data/tournaments.ts` with World Cup 2026

---

### PHASE C: League Directory + International + Team Detail (Epic 3 + 4) — DEPENDS ON A + B

1. **League Directory (Epic 3)**
   - `src/app/leagues/page.tsx` — Icon grid, search, type filter
   - `src/app/league/[slug]/page.tsx` — League detail with tabs (Standings, Fixtures, Teams)
   - Components: `LeagueCard`, `LeagueGrid`, `LeagueHeader`, `LeagueTabs`, `LeagueTeamList`

2. **International Soccer (Epic 4)**
   - `src/app/international/page.tsx` — Tournament grid with search and category filter
   - `src/app/tournament/[slug]/page.tsx` — Tournament detail with tabs (Groups, Standings, Fixtures, Knockout, Teams)
   - `src/app/national-team/[slug]/page.tsx` — National team overview with tournament tabs
   - Components: `TournamentCard`, `TournamentGrid`, `TournamentTabs`, `GroupStandings`, `KnockoutBracketView`, `TeamRosterTable`, `NationalTeamHeader`, `InternationalMatchFeed`, `TournamentSearchFilter`

3. **Team Page Extensions**
   - `/team/[slug]` — Add league badge (Epic 3), international tab (Epic 4)
   - Components: `TeamHeader`, `LeagueBadge`, `TeamTabs`

4. **World Cup Group Pages (Epic 2)**
   - `src/app/group/[letter]/page.tsx` — Individual group standings

5. **Search Page (Epic 3)**
   - `src/app/search/page.tsx` — Unified team search

6. **Header Update**
   - Add "International" to unified header nav (active on `/international` and `/tournament/[slug]`)

---

### PHASE D: Polish + Edge Cases — DEPENDS ON C

1. **Responsive Design** — Mobile breakpoints for all pages (375px minimum)
2. **Error/Empty States** — Every page has appropriate messaging
3. **Loading States** — Skeletons, optimistic UI
4. **SEO & Meta** — OG tags, Twitter Cards, proper titles, canonical URLs
5. **Performance** — Lazy-load heavy components, image optimization, code splitting
6. **Route Validation** — Invalid slugs → "not found" page

---

## Contract Maintenance

**DO NOT BREAK:**
- `useAuth()` hook API (architecture §5.1)
- `useFollowTeams()` hook API (architecture §5.2)
- Repository function signatures (architecture §5.3)
- Shared component prop shapes (architecture §5.4)

All component props and hook APIs must match contract definitions exactly. TypeScript strict mode compilation required.

---

## Completion Checklist

1. `npm run build` passes with zero errors
2. All 15 routes render correctly
3. Header nav correct on all pages
4. Auth flow works: login → redirect → protected route → logout
5. Followed teams persist across navigation
6. World Cup group standings sort by position (Pts → GD → GF)
7. "This Week" strip aggregates ALL competition types
8. Knockout bracket renders correctly
9. League directory search + filter work
10. Mobile responsive at 375px on all routes
11. No console errors on any route
12. TypeScript strict mode compiles clean
