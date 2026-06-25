# Pitchside R2 — Requirements Document

**Prepared by:** Lois Lane, Business Analyst
**Date:** 2026-06-24
**Project:** Pitchside Sports Dashboard (Next.js 15)
**Scope:** Epics 1-4 (User Auth, Homepage Overhaul, League Directory, International Soccer)
**Constraints:** Group-to-knockout data transition required; no scope creep beyond the 4 epics; no omissions.

---

## 1. Feature Inventory — Current Codebase Assessment

### Keep (retain as-is or refactor, do not remove)

| Feature | Location | Rationale |
|---------|----------|-----------|
| Next.js 15 app router architecture | src/app/ | Solid foundation, already structured |
| src/data/types.ts types (Team, Match, Standing, etc.) | src/data/types.ts | Well-defined, but needs extension |
| CountdownRing component | src/components/CountdownRing.tsx | Used throughout, good UX |
| StandingsTable component | src/components/StandingsTable.tsx | Works, needs additional columns (GF, GA) |
| CalendarExport component | src/components/CalendarExport.tsx | Useful, keep |
| TeamCard component | src/components/TeamCard.tsx | Needs redesign to support new homepage layout |
| NewsFeed component | src/components/NewsFeed.tsx | Keep for team pages |
| ContentFeed component | src/components/ContentFeed.tsx | Keep for content feed |
| ClientErrorBoundary | src/components/ClientErrorBoundary.tsx | Keep |
| Error logging | src/lib/error-logger.ts | Keep |
| Dashboard page (/, full redesign) | src/app/page.tsx | Current layout kept but completely rewritten |
| Group detail pages (/group/[letter]) | src/app/group/[letter]/page.tsx | Standings view enhanced with knockout |
| Team detail pages (/team/[slug]) | src/app/team/[slug]/page.tsx | Enhanced for national teams |
| Search page (/search) | src/app/search/page.tsx | Works, may integrate with league directory |
| Feed page (/feed) | src/app/feed/page.tsx | Becomes authenticated user dashboard |
| FollowButton component | src/components/FollowButton.tsx | Logic rewritten for persistent state |
| Search utility (searchTeams) | src/data/teams.ts | Keep, extend |
| getTeamBySlug / getTeamById | src/data/teams.ts | Keep, extend |

### Merge / Refactor (combine or restructure)

| Feature | Current State | New State |
|---------|---------------|-----------|
| useFollowTeams hook | localStorage-based, client-only | Server-synced, persists in user database |
| Dashboard component | Lists all teams flatly | Redesigned: weekly fixtures + group standings + knockout bracket |
| StandingsTable component | Missing GF, GA, GD columns | Add all columns as specified in Epic 2 |
| Team data structure | Flat export in teams.ts | Structured as database records with relationships |
| FollowButton | Client component, localStorage | Client component, but calls API for auth |

### Drop (remove, not carried forward)

| Feature | Reason |
|---------|--------|
| Hardcoded FC Barcelona, NYCFC, Richmond Kickers | These become part of the dynamic league directory, not static exports |
| Static allTeams export array | Replaced by dynamic data fetch from backend |
| Static groupFixtures / knockout fixtures in teams.ts | Replaced by tournament management backend |
| generatePreview / generateContentForTeam functions | Content generation moves to backend/API layer |
| `/feed` page client-side localStorage reading | Replaced by authenticated user dashboard |

---

## 2. User Stories & Acceptance Criteria

### EPIC 1 — User Login & User Database

#### US-1.1: User Registration & Login (OAuth + Email)
**As a** visitor to Pitchside, **I want to** sign up or log in using OAuth (Google/Apple) or email/password, **so that** my follow preferences and personalized feed are saved and accessible across devices.

**Acceptance Criteria:**
- [ ] AC-1: Given a visitor on any page, when they click "Sign In," then they see a login modal with "Continue with Google" and "Continue with Apple" buttons, and a divider with "or sign in with email"
- [ ] AC-2: Given a visitor clicks "Continue with Google," when the OAuth flow completes successfully, then they are redirected to the page they were viewing before signing in
- [ ] AC-3: Given a visitor clicks "Continue with Apple," when the OAuth flow completes successfully, then they are redirected to the page they were viewing before signing in
- [ ] AC-4: Given a visitor is on the login page, when they enter email and password (min 8 chars), then they can submit to create an account if new, or log in if existing
- [ ] AC-5: Given a visitor enters incorrect credentials, when they submit, then they see a clear error message "Invalid email or password"
- [ ] AC-6: Given a visitor submits a form with invalid email format, then the client validates and shows "Please enter a valid email" before submitting

#### US-1.2: User Profile & Preferences
**As a** registered user, **I want to** have a profile page where I can manage my name, avatar, and notification preferences, **so that** I can personalize my Pitchside experience.

**Acceptance Criteria:**
- [ ] AC-7: Given a signed-in user, when they navigate to /profile, then they see their name, email, avatar (from OAuth provider), and a "Notification Settings" section
- [ ] AC-8: Given a user on /profile, when they toggle "Match Reminders" ON, then they receive push/email notifications for matches of followed teams within 1 hour of kickoff
- [ ] AC-9: Given a user on /profile, when they toggle "Match Reminders" OFF, then no match-related notifications are sent
- [ ] AC-10: Given a user's OAuth provider updates their avatar, the next time they load /profile, the avatar is reflected

#### US-1.3: Persistent Follow State
**As a** signed-in user, **I want to** follow and unfollow teams from any page and have my selections persist, **so that** I don't lose my followed teams when I close the browser or switch devices.

**Acceptance Criteria:**
- [ ] AC-11: Given a signed-in user clicks "Follow" on a team card, when the API call succeeds, then the button state changes to "Following" with a green checkmark immediately (optimistic update)
- [ ] AC-12: Given a signed-in user clicks "Following" to unfollow a team, when the API call succeeds, then the button state changes to "Follow" immediately
- [ ] AC-13: Given a user follows Team A on their phone, when they log in on their laptop, then Team A appears in their followed teams list on the laptop
- [ ] AC-14: Given an anonymous (not signed-in) user clicks "Follow", when they do not have an account, then a toast prompts "Sign in to save your follows" and the follow is NOT persisted to localStorage
- [ ] AC-15: Given an anonymous user clicks "Follow", when localStorage already has follows, then clicking "Follow" retains the localStorage behavior temporarily but shows a banner: "Sign in to sync your follows across devices"

---

### EPIC 2 — Homepage Overhaul

#### US-2.1: Weekly Live Fixtures Section
**As a** visitor or signed-in user on the homepage, **I want to** see all club and tournament matches happening within the current week, **so that** I can quickly see what's on without digging through individual team pages.

**Acceptance Criteria:**
- [ ] AC-16: Given any user visits /, when they scroll past the hero section, then they see a "This Week's Action" section with matches from all leagues (La Liga, MLS, USL League One, World Cup)
- [ ] AC-17: Given a match date falls within the current Monday-through-Sunday range, when the page loads, then the match appears in "This Week's Action" with date, time (user's local timezone), teams, and venue
- [ ] AC-18: Given a completed match appears in the weekly section, then the score is displayed prominently (e.g., "USA 2 - 1 Uruguay")
- [ ] AC-19: Given an upcoming match appears in the weekly section, then a countdown indicator shows time remaining until kickoff

#### US-2.2: World Cup Group Standings
**As a** World Cup fan, **I want to** see each group's standings with full statistics (W, L, D, GF, GA, GD, Points), ordered by actual group ranking, **so that** I can track which teams are advancing.

**Acceptance Criteria:**
- [ ] AC-20: Given any user views the homepage, when they scroll to the World Cup section, then they see 12 group standings tables (Groups A through L)
- [ ] AC-21: Given a group standings table, then every column is present and labeled: Position, Team, Played, Won, Drawn, Lost, Goals For (GF), Goals Against (GA), Goal Difference (GD), Points (Pts)
- [ ] AC-22: Given a group's standings are sorted, then teams are ordered by: (1) Points descending, (2) Goal Difference descending, (3) Goals For descending
- [ ] AC-23: Given a team is in the top 2 of a group, then the row has a visual highlight (emerald green left border) indicating qualification
- [ ] AC-24: Given a group standings table row is clicked, when the user navigates to /team/[slug], then they land on that team's detail page

#### US-2.3: Knockout Bracket Display (Post-Group Stage)
**As a** World Cup fan, **I want to** automatically see a knockout bracket after the group stage ends, **so that** I can follow the tournament progression without the homepage going stale.

**Acceptance Criteria:**
- [ ] AC-25: Given all group stage matches have been played (no upcoming group matches), when any user visits /, then the homepage shows a knockout bracket instead of group standings
- [ ] AC-26: Given a knockout bracket is displayed, then it shows the Round of 32 with all 16 matchups, then Round of 16, Quarter-finals, Semi-finals, Third Place, and Final
- [ ] AC-27: Given a knockout match has not yet been played, then the matchup shows team names (or positions like "1A vs 2B" for unplayed teams) with the scheduled date and venue
- [ ] AC-28: Given a knockout match has been played, then the winner is highlighted in bold/emerald, and the score is displayed
- [ ] AC-29: Given a knockout match result is entered, when the next round's matchup references that match (e.g., "W-R32-1 vs W-R32-2"), then the bracket updates to show the actual teams once known
- [ ] AC-30: Given a user is on a knockout bracket, when they click on a team name, then they navigate to /team/[slug] for that team

#### US-2.4: Seamless Group-to-Knockout Transition
**As a** developer (implicit stakeholder), **I want** the data model to handle the transition from group stage to knockout automatically, **so that** the homepage updates without manual intervention.

**Acceptance Criteria:**
- [ ] AC-31: Given the data model has a Tournament entity with stages (GROUP_STAGE, KNOCKOUT), then the frontend queries the current stage and renders the appropriate view
- [ ] AC-32: Given group match results are updated, then the group standings recalculate automatically (points, GD, GF, GA)
- [ ] AC-33: Given knockout bracket results are updated, then the next-round matchups populate automatically based on which teams won
- [ ] AC-34: Given a tiebreak scenario (two teams tied on points in a group), then the tiebreak rules are applied in order: (1) Goal difference, (2) Goals scored, (3) Fair play points, (4) Drawing of lots

---

### EPIC 3 — League Directory Page

> **Detailed requirements document:** See `requirements/epic-3-league-directory-requirements.md` for wireframes, AC breakdown, route tables, and data entity specs.

#### US-3.1: League Directory Grid
**As a** sports fan browsing Pitchside, **I want to** visit a dedicated page that shows all available leagues as an icon grid, **so that** I can quickly discover and explore the league I'm interested in.

**Acceptance Criteria:**
- [ ] AC-35: Given any user navigates to /leagues, then they see a page titled "Leagues" with a responsive grid of league cards
- [ ] AC-36: Given a league card is displayed, then it shows: league logo/icon, league name, season year, number of teams, and country/region
- [ ] AC-37: Given a league icon/logo is clicked, when the user navigates to /league/[slug], then they land on the league detail page
- [ ] AC-38: Given a league does not have a logo image, then a styled placeholder icon is shown (based on league type: football pitch, trophy, etc.)
- [ ] AC-39: Given a search field at the top of the page, when a user types a league name or country, then the grid filters to show only matching leagues (case-insensitive partial match)
- [ ] AC-40: Given a filter dropdown is available, when a user selects a league type (domestic_league, domestic_cup, international_cup), then only leagues of that type are shown
- [ ] AC-41: Given no leagues match the current search or filter, then the page shows an empty state: icon, "No leagues found" title, and "Try a different search" subtitle
- [ ] AC-42: Given the page loads, then leagues are sorted alphabetically by name

#### US-3.2: League Detail Page
**As a** fan of a specific league, **I want to** visit a detail page for that league showing standings, fixtures, and team roster, **so that** I can get a complete picture of the league without navigating away.

**Acceptance Criteria:**
- [ ] AC-43: Given a user navigates to /league/[slug], then they see the league header with logo, name, season, country, and league type
- [ ] AC-44: Given a league detail page, then there are tabs: "Standings", "Fixtures", and "Teams" (default tab: Standings)
- [ ] AC-45: Given the Standings tab is active, then a standings table is displayed with columns: Position, Team, Played, Won, Drawn, Lost, Goals For (GF), Goals Against (GA), Goal Difference (GD), Points (Pts)
- [ ] AC-46: Given a team row in the standings table is clicked, when the user navigates to /team/[slug], then they land on that team's detail page
- [ ] AC-47: Given the Fixtures tab is active, then upcoming and recent matches are shown grouped by date, with teams, scores (if completed), venue, and kickoff time in user's local timezone
- [ ] AC-48: Given the Teams tab is active, then a list of all teams in the league is shown with team logo, name, current position (if standings exist), and a link to the team's detail page
- [ ] AC-49: Given a league has no standings data yet, then a message "Standings will be available once the season begins" is shown instead of an empty table
- [ ] AC-50: Given a league has no fixtures yet, then a message "Fixtures will be available closer to the season start" is shown
- [ ] AC-51: Given no teams exist for a league, then a message "No teams in this league yet" is shown on the Teams tab
- [ ] AC-52: Given a "Back to Leagues" link at the top of the page, when clicked, the user navigates back to /leagues

#### US-3.3: Team Drill-Down from League
**As a** league fan browsing standings or team lists, **I want to** click directly from a team name to their detail page, **so that** I can explore a team's full schedule, news, and stats without searching.

**Acceptance Criteria:**
- [ ] AC-53: Given a user is on a league detail page, when they click any team name in the standings table or Teams tab, then they navigate to /team/[team-slug]
- [ ] AC-54: Given a user lands on /team/[slug] after clicking from a league context, then the team page displays a breadcrumb: "Leagues > [League Name] > [Team Name]"
- [ ] AC-55: Given a team page is viewed from a league context, then the team's club matches (not international) are shown by default, with a tab to switch to international matches
- [ ] AC-56: Given a team has both club and international data, then the team page clearly separates club matches from international matches (two tabs: "Club" and "International")
- [ ] AC-57: Given a team page has a "Back to [League Name]" link in the breadcrumb, when clicked, the user returns to /league/[league-slug]

#### US-3.4: League Data Management (Implicit — Developer)
**As a** developer, **I want** league data to be stored as structured entities with relationships to teams and matches, **so that** the frontend can query league data independently of team data and scale as new leagues are added.

**Acceptance Criteria:**
- [ ] AC-58: Given the data model includes a League entity, then it has fields: id, name, slug, logoUrl, season, country, type, teamCount
- [ ] AC-59: Given the data model includes a LeagueTeam relationship, then a league can have zero or more teams, and a team belongs to zero or one league
- [ ] AC-60: Given standings data is updated, then the league detail page reflects the latest standings without manual refresh (recomputed from match results)
- [ ] AC-61: Given a new league is added to the seed data, then it automatically appears on the /leagues grid without code changes (driven by data, not route config)

---

### EPIC 4 — International Soccer Page

#### US-4.1: International Tournaments Page
**As a** national team fan, **I want to** visit a dedicated page that shows all ongoing and upcoming international tournaments, **so that** I can follow international soccer separately from club competitions.

**Acceptance Criteria:**
- [ ] AC-46: Given any user navigates to /international, then they see a page titled "International Soccer" with sections for ongoing and upcoming tournaments
- [ ] AC-47: Given a tournament card is displayed, then it shows: tournament name, country/host, dates, status (Ongoing/Upcoming/Completed), and number of participating teams
- [ ] AC-48: Given a tournament card is clicked, when the user navigates to /international/[tournament-slug], then they see the tournament's group standings, fixtures, and team list
- [ ] AC-49: Given a tournament page, then there is a "Next Matches" section showing the next round of fixtures across all groups or the current knockout stage

#### US-4.2: Nation Team Pages
**As a** national team fan, **I want to** see full schedules for any nation including friendlies, tournament matches, and qualifiers, **so that** I can track all of a country's matches in one place.

**Acceptance Criteria:**
- [ ] AC-50: Given a user navigates to /team/[nation-slug] for a national team, then they see a schedule page organized by competition: World Cup 2026, World Cup Qualifiers, Friendlies, etc.
- [ ] AC-51: Given a nation team page, then each match entry shows: competition name, date/time (user's timezone), opponent (with flag), venue, result (if played), and match status (upcoming/completed)
- [ ] AC-52: Given a nation team has played matches, then a "Results" section shows recent matches with results, sorted by date (most recent first)
- [ ] AC-53: Given a nation team has upcoming matches, then a "Fixtures" section shows upcoming matches, sorted by date (soonest first)
- [ ] AC-54: Given a user is on a nation team page, when they click "Follow" on the team, then the team is added to their followed teams list (if signed in), or prompted to sign in (if not signed in)

#### US-4.3: International Team Schedules
**As a** national team supporter, **I want to** see a complete schedule for my nation including friendlies, qualifying matches, and tournament games, **so that** I never miss a match.

**Acceptance Criteria:**
- [ ] AC-55: Given a user is on a nation team page, when they view the schedule, then matches are grouped by type: (1) World Cup 2026, (2) World Cup Qualifiers, (3) Continental Qualifiers, (4) Friendlies/Tournaments
- [ ] AC-56: Given a match has a completed score, then the score is displayed inline (e.g., "USA 2 - 1 Uruguay")
- [ ] AC-57: Given an upcoming match has a countdown, then the countdown shows days, hours, and minutes remaining
- [ ] AC-58: Given an international match is live, then a red "LIVE" badge appears next to the match

---

## 3. Data Entities Outline

### Core Entities (new or extended from current types.ts)

```
User
  - id: string (UUID)
  - email: string (unique, optional for OAuth)
  - name: string
  - avatarUrl: string (optional, from OAuth provider)
  - provider: string ("google" | "apple" | "email")
  - createdAt: DateTime
  - preferences: object (notification settings)

FollowedTeam
  - id: string (UUID)
  - userId: string (FK → User)
  - teamId: string
  - createdAt: DateTime
  - UNIQUE(userId, teamId)

Team (extended from current)
  - id: string
  - name: string
  - shortName: string
  - slug: string
  - type: "club" | "national"
  - leagueId: string (FK → League, nullable)
  - continent: string (nullable, for international)
  - crestUrl: string (nullable)
  - primaryColor: string (nullable)
  - secondaryColor: string (nullable)
  - flag: string (nullable, for national teams)
  - fifaRank: number (nullable)
  - Founded: string (nullable)
  - stadium: string (nullable)
  - nextMatch: Match (computed, nullable)
  - recentResults: Match[] (computed, nullable)
  - schedule: Match[] (computed, nullable)

League
  - id: string
  - name: string
  - slug: string
  - logoUrl: string
  - season: string
  - country: string
  - type: "domestic_league" | "domestic_cup" | "international_cup"
  - teamCount: number
  - seasonStart: DateTime (nullable)
  - seasonEnd: DateTime (nullable)
  - teams: Team[] (via league FK)

Tournament
  - id: string
  - name: string
  - slug: string
  - type: "world_cup" | "continental" | "invitational"
  - hostCountries: string[]
  - startDate: DateTime
  - endDate: DateTime
  - status: "upcoming" | "ongoing" | "completed"
  - stages: TournamentStage[]
  - teams: Team[]

TournamentStage
  - id: string
  - tournamentId: string (FK → Tournament)
  - name: string ("Group A", "Round of 32", "Final", etc.)
  - type: "group" | "knockout"
  - order: number
  - matches: Match[]

Match
  - id: string (UUID)
  - homeTeamId: string (FK → Team)
  - awayTeamId: string (FK → Team)
  - tournamentStageId: string (FK → TournamentStage, nullable)
  - leagueId: string (FK → League, nullable)
  - date: DateTime
  - venue: string
  - status: "scheduled" | "live" | "completed" | "postponed" | "cancelled"
  - homeScore: number (nullable)
  - awayScore: number (nullable)
  - period: string ("1H", "2H", "ET", "PEN", "FT")
  - isNeutralVenue: boolean

ContentItem
  - id: string (UUID)
  - teamId: string (FK → Team)
  - type: "preview" | "recap" | "article" | "news"
  - title: string
  - body: string
  - publishedAt: DateTime
  - imageUrl: string (nullable)
  - source: string
  - matchDate: DateTime (nullable)
```

### Key Relationships
- **User ↔ FollowedTeam**: One-to-Many (one user follows many teams)
- **Team ↔ League**: Many-to-One (many teams in one league, nullable)
- **Team ↔ LeagueTeam**: Explicit relationship table (supports zero-league teams, e.g., World Cup nations)
- **League ↔ LeagueTeam**: One-to-Many (one league has many teams)
- **Team ↔ TournamentStage**: Many-to-Many via Match
- **Tournament ↔ TournamentStage**: One-to-Many
- **League ↔ Match**: One-to-Many (league matches)
- **TournamentStage ↔ Match**: One-to-Many
- **Team ↔ Match**: Many-to-Many (as home or away)
- **Team ↔ ContentItem**: One-to-Many

---

## 4. Content Requirements

### Content Types Needed

| Content | Source | Frequency | Notes |
|---------|--------|-----------|-------|
| Team data (names, slugs, crests, colors, flags, FIFA rank) | Manual seed data / API | One-time seed, updates monthly | Currently hardcoded; needs to be database records |
| League data (names, logos, seasons) | Manual seed data / API | Updates per season | New data for league directory |
| Match fixtures (club) | Manual seed / API | Weekly updates | Currently hardcoded in teams.ts |
| Match fixtures (World Cup group stage) | Manual seed data | Already exists in teams.ts | Needs to remain for group-to-knockout transition |
| Match fixtures (World Cup knockout) | Manual seed / API | Pre-populated, results update live | Already exists in teams.ts |
| Match results (scores) | API / Manual entry | After each match | Currently all 0-0 placeholder scores |
| Team standings | Computed from match results | After each match | Currently hardcoded static data |
| News articles | API feed (ESPN, official club sites) | Daily / multiple times per day | Currently hardcoded in teams.ts |
| Content (previews, recaps) | API / CMS generated | Per match | Currently auto-generated from match data in teams.ts |

### Content Constraints
- All dates MUST store in UTC and convert to user's timezone on the client
- Score data MUST handle null for upcoming matches
- Team crests and league logos MUST support CDN/cached URLs
- News articles MUST include canonical source URL for attribution
- League standings MUST use the existing `StandingsTable` component from `src/components/StandingsTable.tsx` (no changes needed — it already accepts `Standing[]` with the correct column structure: Position, Team, Played, Won, Drawn, Lost, GF, GA, GD, Pts)

---

## 5. Integration Needs

### Epic 3 → Epic 2 Integration
- **Standing interface:** Reused identically from Epic 2 (AC-11 in Epic 2). League standings use the same column structure and sorting algorithm as World Cup group standings (Pts → GD → GF).
- **Match interface:** League fixtures use the same `Match` interface from Epic 2, with `leagueId` FK pointing to the League entity.
- **Knockout logic:** If a league has a knockout phase (domestic cups), the knockout bracket logic from Epic 2 applies. Noted for future scope but not required in R2.
- **Tournament Stage (Group → Knockout):** The `TournamentStage` interface from Epic 2 can be reused for league phases (regular season, playoffs) — this is noted but not required in R2.

### Authentication Provider
- **Recommended:** NextAuth.js (Auth.js) v5 with Google and Apple providers
- **Alternative:** Supabase Auth (if using Supabase as DB)
- **Rationale:** Next.js ecosystem native, supports OAuth out of the box, session management built-in
- **Required:** Google OAuth client ID/Secret, Apple Developer account for Sign in with Apple

### Database
- **Recommended:** PostgreSQL (Supabase, Neon, or AWS RDS)
- **Rationale:** Relational data with complex relationships (teams → matches → tournaments → leagues), mature Next.js support, good migration tooling
- **Required Schema:** All entities from Section 3 above
- **Migration Tool:** Prisma ORM or Drizzle ORM

### Real-Time Updates (Future Consideration — Not In-Scope for R2)
- Match score updates during live games
- Consider WebSockets or Server-Sent Events for live score push
- Note: Not part of the 4 epics; flag for future backlog

### External APIs (Phase 2 — Not In-Scope for R2)
- Live match score API (e.g., Football-Data.org, API-Football, ESPN API)
- News aggregation API
- Note: R2 uses seed data; real API integration is a future enhancement

---

## 5.5. Component Inventory

### New Components (Epic 3)

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `LeagueCard` | `src/components/LeagueCard.tsx` | `league: League`, `onClick?: (slug: string) => void` | Single league card for directory grid. Shows logo, name, season, teamCount, country. Handles missing logo with placeholder. |
| `LeagueGrid` | `src/components/LeagueGrid.tsx` | `leagues: League[]`, `filter: string`, `searchQuery: string` | Responsive grid container (2-col mobile, 3-col tablet, 4-col desktop). Handles empty state. |
| `LeagueHeader` | `src/components/LeagueHeader.tsx` | `league: League`, `showBackLink?: boolean` | League detail page header. Shows logo, name, season, country, type, teamCount, back link. |
| `LeagueTabs` | `src/components/LeagueTabs.tsx` | `activeTab: "standings" \| "fixtures" \| "teams"`, `onTabChange: (tab: string) => void` | Tab navigation for league detail page. |
| `LeagueTeamList` | `src/components/LeagueTeamList.tsx` | `teams: Team[]`, `leagueName: string` | Teams tab content. Shows team logo, name, position (if standings exist), link to team page. |

### Reused Components (Epic 3)

| Component | Source File | Change |
|-----------|-------------|--------|
| `StandingsTable` | `src/components/StandingsTable.tsx` | None — already accepts `Standing[]` with correct columns |
| `TeamCard` | `src/components/TeamCard.tsx` | Minor — support inline click-to-team navigation from league context |
| `CountdownRing` | `src/components/CountdownRing.tsx` | None — used for upcoming fixtures on league detail page |

---

## 6. Route Table Proposal

### Existing Routes (Modified)

| Route | Current | R2 Change |
|-------|---------|-----------|
| `/` | Dashboard (flat team list) | Complete redesign: Weekly fixtures + World Cup groups/knockout |
| `/team/[slug]` | Team detail (schedules, news, standings) | Enhanced: Competition-filtered schedule for national teams |
| `/group/[letter]` | Group page (teams + fixtures) | Enhanced: Standings with full stats, transition to knockout |
| `/search` | Search all teams | Enhanced: Filters by type (club/international), league, competition |
| `/feed` | Anonymous feed (localStorage-based) | Authenticated: Personalized dashboard of followed teams |
| `/login` | Does not exist | NEW: Login/signup page |
| `/profile` | Does not exist | NEW: User profile and settings |

### New Routes

| Route | Page | Description | Epic |
|-------|------|-------------|------|
| `/leagues` | League Directory | Icon grid of all leagues, searchable | 3 |
| `/league/[slug]` | League Detail | Standings, fixtures, teams | 3 |
| `/international` | International Soccer | Ongoing/upcoming tournaments | 4 |
| `/international/[tournament]` | Tournament Detail | Groups, standings, fixtures, teams | 4 |

### Route Ordering (Navigation)

```
/ (Dashboard)
  /leagues (League Directory)
    /league/[slug] (League Detail)
      /team/[slug] (Team Detail — via drill-down)
  /international (International Soccer)
    /international/[tournament] (Tournament Detail)
      /team/[slug] (Team Detail — via drill-down)
  /team/[slug] (Team Detail — direct access)
  /group/[letter] (World Cup Group)
  /search (Search)
  /feed (Personal Dashboard — protected)
  /login (Auth — public)
  /profile (User Profile — protected)
```

### Authentication Guards

| Route | Auth Required |
|-------|---------------|
| `/` | No |
| `/leagues` | No |
| `/league/[slug]` | No |
| `/international` | No |
| `/international/[tournament]` | No |
| `/team/[slug]` | No |
| `/group/[letter]` | No |
| `/search` | No |
| `/feed` | Yes |
| `/profile` | Yes |
| `/login` | Redirect if already logged in |

---

## 7. Open Questions for Chris

1. **Auth provider preference:** Does the client have a preference between NextAuth.js (Google + Apple OAuth), Supabase Auth, or another provider? Are Google/Apple developer accounts available?

2. **Database preference:** PostgreSQL via Supabase, Neon, or AWS? Or does the client prefer MongoDB/SQLite?

3. **Real-time updates:** Should R2 include live match score updates (WebSockets/SSE) or is that strictly a Phase 2 feature?

4. **Data source:** For club league data (MLS, La Liga, USL), should this be manually maintained seed data (current approach) or connected to an external sports API? What is the budget for API subscriptions?

5. **International tournaments beyond World Cup 2026:** Should the international page include Copa America, Euro 2028 qualifiers, etc., or is World Cup 2026 the sole focus for R2?

6. **Follow button for anonymous users:** Should anonymous follows persist in localStorage until login, or prompt login immediately on first follow attempt?

7. **Content generation:** Should previews/recaps be server-generated from match data (as currently done in teams.ts) or pulled from an external content API?

8. **Team data scope:** How many club teams should be in the initial seed data? The current 3 (Barcelona, NYCFC, Richmond Kickers) plus all 48 World Cup teams = 51 teams total, or is there a preference for which leagues to cover?

### Epic 3 — Additional Questions

9. **League data scope beyond 3 club leagues:** Should R2 include additional European leagues (Premier League, Serie A, Bundesliga, Ligue 1, Eredivisie) to make the directory feel populated, or are the 3 club leagues + World Cup groups sufficient for the first release?

10. **League logo assets:** Does the client have official league logos available, or should we use SVG icon placeholders (trophy, pitch, stadium icons) for R2?

11. **Club vs. national team separation on team pages:** When a user clicks a team from a league page (e.g., Barcelona from La Liga), should the team page default to showing only club matches, or show all matches (club + international) with tabs?

12. **World Cup in league directory:** Should the World Cup 2026 appear in the league directory as an "International Tournament" type league, or should it remain a separate /international section (Epic 4)?

13. **League season handling:** R2 only needs current season. Should the data model support multiple seasons (e.g., La Liga 2025, La Liga 2026) for future phases, or is single-season per league sufficient?

14. **Search scope on league directory:** Should the league directory search only match league name/country, or should it also surface results when users search for team names that belong to leagues (e.g., searching "Barcelona" should surface the La Liga page)?

---

## 8. Scope Confirmation

**In Scope (strictly these 4 epics):**
- Epic 1: User authentication (OAuth/email), user database, profiles, persistent follows
- Epic 2: Homepage redesign (weekly fixtures, group standings with full stats, knockout bracket)
- Epic 3: League directory page (`/leagues`), league detail pages (`/league/[slug]`), team drill-down from league context, League entity extension (logoUrl, country, type, teamCount), seed data for 3 leagues (La Liga, MLS, USL League One), new components (LeagueCard, LeagueGrid, LeagueHeader, LeagueTabs, LeagueTeamList)
- Epic 4: International soccer page, nation team pages, tournament pages

**Out of Scope (explicitly excluded):**
- Real-time live score updates via WebSockets
- External sports API integration (Phase 2)
- Push notifications (Phase 2)
- Email newsletter / mailing list
- Social sharing features
- Mobile app (native)
- Admin/content management system for editing data
- Payment/billing system
- Multi-language/i18n
- League fixture data entry / admin UI (Epic 3)
- League comparison tool or stats beyond standings (Epic 3)
- World Cup as a "league" in the directory (handled by Epic 2 /group route, not Epic 3)

**Blockers:**
- Open questions in Section 7 must be resolved before architecture design begins
- Client must confirm auth provider and database preference
- Client must confirm data scope (how many leagues/teams to seed)

---

## 9. Handoff

**Recommended Lane:** Brainiac (Web/Next.js architect)
**Why:** All 4 epics are frontend-heavy with a Next.js codebase. Brainiac can design the data layer, API routes, and frontend architecture for these features. Jor-El (Salesforce) is not needed unless the client wants Salesforce integration for user data.

**Prepared for:** brainiac (architect) → ready to design system architecture and implementation plan

---

*Document generated 2026-06-24 by Lois Lane, Fortress of Solitude Consulting*
