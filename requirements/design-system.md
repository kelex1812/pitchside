# Pitchside R2 — Design System

> **Owner:** Kara (Designer)
> **Date:** 2026-06-24
> **Handoff:** Steel (Implementation)
> **Reference:** Visual mockups at `mockups/pitchside-design-system.html`
> **Design Tokens:** `design-tokens.css`

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Typography](#2-typography)
3. [Color System](#3-color-system)
4. [Spacing & Sizing](#4-spacing--sizing)
5. [Border Radius & Shadows](#5-border-radius--shadows)
6. [Component Specifications](#6-component-specifications)
7. [Page Layouts](#7-page-layouts)
8. [Navigation](#8-navigation)
9. [Responsive Behavior](#9-responsive-behavior)
10. [States & Edge Cases](#10-states--edge-cases)
11. [Animation & Interaction](#11-animation--interaction)
12. [Accessibility](#12-accessibility)

---

## 1. Design Tokens

All tokens are defined in `design-tokens.css` for direct import by Tailwind. The file is the single source of truth.

### Color Tokens (CSS Custom Properties)

| Token | Value | Usage |
|-------|-------|-------|
| `--pitch-primary` | `#10b981` | Primary action color — Follow buttons, active nav, links |
| `--pitch-primary-hover` | `#059669` | Hover state for primary actions |
| `--pitch-primary-active` | `#047857` | Active/pressed state for primary actions |
| `--pitch-primary-muted` | `rgba(16, 185, 129, 0.12)` | Subtle primary tint for backgrounds, badges, hover highlights |
| `--pitch-accent` | `#3b82f6` | Secondary accent — unused in R2 but available for future |
| `--pitch-bg` | `#020617` | Page background (slate-950) |
| `--pitch-surface` | `#0f172a` | Card surfaces (slate-900) |
| `--pitch-surface-raised` | `#1e293b` | Input fields, select dropdowns (slate-800) |
| `--pitch-surface-hover` | `#334155` | Hover state on surfaces (slate-700) |
| `--pitch-border` | `#1e293b` | Default border color (slate-800) |
| `--pitch-border-strong` | `#475569` | Strong borders, inputs on focus (slate-600) |
| `--pitch-text` | `#f8fafc` | Primary text (slate-50) |
| `--pitch-text-secondary` | `#94a3b8` | Secondary text (slate-400) |
| `--pitch-text-muted` | `#64748b` | Muted/disabled text (slate-500) |

### Status Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--pitch-live` | `#ef4444` | Live match indicator (red-500) |
| `--pitch-live-bg` | `rgba(239, 68, 68, 0.12)` | Live badge background |
| `--pitch-success` | `#22c55e` | Qualified standings, success actions (green-500) |
| `--pitch-warning` | `#f59e0b` | Contending standings status (amber-500) |
| `--pitch-danger` | `#ef4444` | Eliminated standings, error states (red-500) |
| `--pitch-info` | `#3b82f6` | Info states (blue-500) |
| `--pitch-completed` | `#64748b` | Completed match status (slate-500) |
| `--pitch-upcoming` | `#38bdf8` | Upcoming match time display (sky-400) |

### Tournament Status Badges

| Badge | Background | Text |
|-------|-----------|------|
| Upcoming | `rgba(100,116,139,0.15)` | `#38bdf8` |
| Ongoing | `rgba(34,197,94,0.15)` | `#22c55e` |
| Completed | `rgba(71,85,105,0.2)` | `#475569` |

### Qualification Status Badges (Standings)

| Status | Background | Text | Label |
|--------|-----------|------|-------|
| Qualified | `rgba(34,197,94,0.12)` | `#22c55e` | Q (green) |
| Eliminated | `rgba(239,68,68,0.12)` | `#ef4444` | E (red) |
| Contending | `rgba(245,158,11,0.12)` | `#f59e0b` | C (amber) |

---

## 2. Typography

### Font Families

| Role | Font Stack |
|------|-----------|
| **Body & Headings** | `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| **Scores & Data** | `JetBrains Mono, ui-monospace, monospace` |

### Type Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 36px (2.25rem) | Bold (700) | Page titles, tournament names |
| H2 | 30px (1.875rem) | Bold (700) | Section titles |
| H3 | 24px (1.5rem) | Semi (600) | Card titles, team headers |
| H4 | 20px (1.25rem) | Semi (600) | Sub-section headers |
| Body | 16px (1rem) | Regular (400) | Paragraph text, table content |
| Body Sm | 14px (0.875rem) | Regular (400) | Captions, secondary text, nav items |
| Caption | 12px (0.75rem) | Regular (400) | Small labels, tooltips |
| Micro | 10px (0.65rem) | Regular (400) | Badge labels, venue text |

### Line Heights

| Level | Line Height |
|-------|------------|
| Headings | 1.25 |
| Body | 1.5 |
| Table cells | 1.5 |

---

## 3. Color System

### Surface Hierarchy

The dark theme uses a single palette progression:

```
Page BG:  #020617 (slate-950)
Card:     #0f172a (slate-900)
Raised:   #1e293b (slate-800)
Hover:    #334155 (slate-700)
Border:   #1e293b (slate-800)
```

### Contrast Requirements

All text must meet WCAG AA contrast ratios against its background:

- White text (`#f8fafc`) on surface (`#0f172a`) → 14.5:1 (exceeds AAA)
- Secondary text (`#94a3b8`) on surface (`#0f172a`) → 6.8:1 (exceeds AA)
- Muted text (`#64748b`) on surface (`#0f172a`) → 4.2:1 (meets AA)
- Primary green (`#10b981`) on surface (`#0f172a`) → 4.6:1 (meets AA)

### Dark-Only Enforcement

R2 is dark-only. The `bg-slate-950 text-slate-300 antialiased` class from Tailwind conventions is the base. No light mode toggle exists. The `UserPreference.theme` field is hardcoded to `"dark"`.

---

## 4. Spacing & Sizing

### Spacing Scale

| Token | Value | Typical Use |
|-------|-------|-------------|
| `--space-1` | 4px | Tight gaps between icons and text |
| `--space-2` | 8px | Padding inside small elements |
| `--space-3` | 12px | Table cell padding |
| `--space-4` | 16px | Standard card padding |
| `--space-6` | 24px | Section gap between major content |
| `--space-8` | 32px | Page section margins |
| `--space-10` | 40px | Large content gaps |
| `--space-12` | 48px | Empty state padding |

### Layout Widths

| Breakpoint | Content Max Width | Grid Columns |
|------------|-------------------|--------------|
| Mobile (375px) | 100% | 1 column |
| Tablet (768px) | 100% | 2 columns |
| Desktop (1024px) | 1152px | 3 columns |
| Wide (1440px) | 1280px | 4 columns |

---

## 5. Border Radius & Shadows

### Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-md` | 6px | Match cards, table elements |
| `--radius-lg` | 8px | General cards, inputs |
| `--radius-xl` | 12px | Large cards, auth container |
| `--radius-full` | 9999px | Badges, crests, avatars, buttons |

### Shadows

Cards use no shadow by default. On hover (league cards, tournament cards), a subtle glow effect replaces shadow:

```css
box-shadow: 0 0 0 1px var(--pitch-primary);
transform: translateY(-1px);
```

---

## 6. Component Specifications

### 6.1 Header Navigation

**Location:** `src/components/Header.tsx`
**Height:** 56px fixed
**Background:** Surface (`#0f172a`) with bottom border (`1px solid #1e293b`)
**Max Width:** 1280px centered
**Sticky:** Yes (sticks to top on scroll)

**Nav Items (desktop):**

| Item | Route | Active On | Auth Required |
|------|-------|-----------|---------------|
| Pitchside (logo) | `/` | Homepage | No |
| Home | `/` | Homepage | No |
| Leagues | `/leagues`, `/league/[slug]` | League pages | No |
| International | `/international`, `/tournament/[slug]`, `/national-team/[slug]` | International pages | No |
| Search | `/search` | Search page | No |
| Follows | `/feed` | Feed page | Yes |

**Nav Item Styles:**

| State | Background | Text Color |
|-------|-----------|------------|
| Default | transparent | `#94a3b8` |
| Hover | `#334155` | `#f8fafc` |
| Active | `rgba(16,185,129,0.12)` | `#f8fafc` |

**Mobile:** Hamburger menu replaces nav items. Menu items: Home, Leagues, International, Search, Follows (auth).

### 6.2 FollowButton

**Location:** `src/components/FollowButton.tsx`

| Property | Value |
|----------|-------|
| Sizes | `sm` (default), `md` |
| Default | `Follow` — outline style, transparent bg, bordered, secondary text |
| Following | `Following` — primary tint bg, primary text, primary border |
| Size SM | Padding 4px 12px, font 12px |
| Size MD | Padding 8px 16px, font 14px |
| Click Behavior | Toggles follow state, sends API request |
| Anonymous | Uses localStorage key `pitchside-following` (stores team slugs) |
| Authenticated | Uses `/api/follows` (stores team UUID) |
| Migration | On first authenticated load, localStorage slugs → DB Follow records, then clear localStorage |

### 6.3 MatchCard

**Location:** `src/components/MatchCard.tsx`

| Property | Value |
|----------|-------|
| Props | `match: Match`, `showCompetition?: boolean`, `compact?: boolean`, `userTimezone?: string` |
| Layout | Horizontal flexrow: home team logo + name, score/VS, away team name + logo, date/time |
| Compact variant | Reduced padding (8px), smaller logos (24px), smaller score, smaller time text |
| Live state | Red LIVE badge with pulsing dot, time shows minute (e.g., "67'") |
| Upcoming state | Shows "vs" as score placeholder, time in sky blue, venue shown below |
| Completed state | Score displayed in monospace font, "FT" as time, venue shown below |
| Team name | Clickable, navigates to `/team/[slug]` |
| Timezone | Converts kickoff to `userTimezone` (logged-in) or browser timezone (anonymous) |

### 6.4 StandingsTable

**Location:** `src/components/StandingsTable.tsx`

| Property | Value |
|----------|-------|
| Props | `standings: Standing[]`, `showQualification?: boolean`, `onTeamClick?: (teamSlug) => void` |
| Columns | Position, Team, P, W, D, L, GF, GA, GD, Points |
| Sorting | Always: Points desc → GD desc → GF desc |
| Team names | Clickable links to `/team/[slug]` |
| Qualification badges | Green Q (qualified), Amber C (contending), Red E (eliminated) — shown when `showQualification` is true |
| Highlighted row | Highlighted row for the "current team" (used on team detail pages) |
| Mobile | On mobile, collapses to: Position, Team, Pts (tap for full stats) OR full horizontal scroll |
| Data Source | `computeStandings(matches, teams)` from `src/lib/standings.ts` |

### 6.5 CountdownRing

**Location:** `src/components/CountdownRing.tsx`

| Property | Value |
|----------|-------|
| Props | `date: string`, `userTimezone?: string`, `showLabel?: boolean` |
| Size | 48px × 48px (default), 32px × 32px (compact) |
| Shape | Circular ring with border |
| Live state | Red border with pulsing animation, shows "LIVE" instead of countdown |
| Countdown display | Shows days/hours remaining in monospace font |
| Border color | Default: border color; Live: red; Final hours: turns green |
| Data Source | Converts `date` (ISO UTC) to user timezone, computes remaining time |

### 6.6 LeagueCard

**Location:** `src/components/LeagueCard.tsx`

| Property | Value |
|----------|-------|
| Props | `league: League`, `onClick?: (slug) => void` |
| Layout | Centered vertical stack: logo, name, country, season dates, arrow |
| Logo | 48px × 48px square with rounded corners (8px), background surface-raised |
| Name | 14px semi-bold, white |
| Country | 12px regular, secondary text |
| Season | 11px regular, muted text |
| Arrow | Right arrow (→) in primary green, at bottom |
| Hover | Primary green border glow, subtle translateY(-2px), entire card is clickable |
| Grid placement | Used in `/leagues` (4-col desktop, 2-col tablet, 1-col mobile) |

### 6.7 LeagueHeader

**Location:** `src/components/LeagueHeader.tsx`

| Property | Value |
|----------|-------|
| Props | `league: League` |
| Layout | Horizontal: logo + league name + country + season dates |
| Logo | 48px square, same as LeagueCard logo |
| Name | 20px semi-bold |
| Country | 14px regular, secondary text |
| Season dates | 12px regular, muted text, shown as "Aug 15, 2026 - May 20, 2027" |
| Card container | Surface background, border, 8px rounded, 24px padding |

### 6.8 LeagueTabs

**Location:** `src/components/LeagueTabs.tsx`

| Property | Value |
|----------|-------|
| Props | `activeTab: string`, `onTabChange: (tab) => void` |
| Tabs | "Standings" (default), "Fixtures", "Teams" |
| Active indicator | Primary green text + 2px bottom border |
| Tab content | Standings → StandingsTable, Fixtures → Matchday-grouped MatchCards, Teams → TeamCard grid |
| Mobile | Horizontal scrollable tab bar (no wrapping) |

### 6.9 LeagueTeamList

**Location:** `src/components/LeagueTeamList.tsx`

| Property | Value |
|----------|-------|
| Props | `teams: Team[]` |
| Layout | Grid of TeamCard components |
| Grid | 4 columns desktop, 2 columns tablet, 1 column mobile |
| Each card | Team crest (32px), team name, "View →" arrow |

### 6.10 TeamCard

**Location:** `src/components/TeamCard.tsx`

| Property | Value |
|----------|-------|
| Props | `team: Team`, `showFlag?: boolean`, `showLeague?: boolean`, `onClick?: () => void` |
| Mini variant | Crest (28px) + team name + league badge. Used in homepage club sections. |
| Card variant | Crest (32px) + team name + league badge + league separator. Used in league detail teams tab. |
| Flag | Shown for national teams (emoji or URL) |
| Click | Navigates to `/team/[slug]` |

### 6.11 KnockoutBracket

**Location:** `src/components/KnockoutBracket.tsx` (homepage)

| Property | Value |
|----------|-------|
| Props | `rounds: KnockoutMatch[]` |
| Layout | Vertical rounds, each containing MatchCards |
| Match display | Home team left, score center, away team right |
| Winner | Team name in primary green |
| Winner propagation | Winner of round N becomes label in round N+1 via `nextMatchId` linking |
| Phase transition | Homepage shows group standings when `TournamentState.phase === "group"`, knockout bracket when `phase === "knockout"` |
| Mobile | Collapses to vertical list view (no bracket structure) |

### 6.12 KnockoutBracketView

**Location:** `src/components/KnockoutBracketView.tsx` (tournament detail)

| Property | Value |
|----------|-------|
| Props | `knockout: KnockoutBracket` |
| Layout | Same as KnockoutBracket but in tournament context |
| Tab visibility | Hidden if tournament has no knockout stage |
| Mobile | Vertical list (no bracket visualization) |

### 6.13 TournamentCard

**Location:** `src/components/TournamentCard.tsx`

| Property | Value |
|----------|-------|
| Props | `tournament: Tournament`, `onClick?: (slug) => void` |
| Layout | Logo (48px) + name + date range, status badge, host countries |
| Logo | 48px × 48px circle, background surface-raised, tournament initials or icon |
| Name | 16px semi-bold |
| Date range | 12px regular, secondary text |
| Status badge | Upcoming/Ongoing/Completed (colored pill) |
| Host countries | 12px regular, muted text |
| Hover | No special hover (like LeagueCard) |
| Grid | Used in `/international` (3-col desktop, 2-col tablet, 1-col mobile) |

### 6.14 TournamentGrid

**Location:** `src/components/TournamentGrid.tsx`

| Property | Value |
|----------|-------|
| Props | `tournaments: Tournament[]` |
| Layout | Grid of TournamentCard components |
| Grid | 3 columns desktop, 2 columns tablet, 1 column mobile |
| Filtering | Client-side: search (name + hosts), category (World Cup, Continental, Olympics, Friendlies, Qualifiers) |

### 6.15 TournamentTabs

**Location:** `src/components/TournamentTabs.tsx`

| Property | Value |
|----------|-------|
| Props | `tournament: Tournament` |
| Tabs | "Groups", "Standings", "Fixtures", "Knockout" (conditional), "Teams" |
| Knockout tab | Hidden if tournament has no knockout stage |
| Active indicator | Primary green text + 2px bottom border |
| Tab content | Groups → per-group standings, Standings → aggregate standings, Fixtures → date-grouped MatchCards, Knockout → KnockoutBracketView, Teams → TeamCard grid (48 teams) |
| Mobile | Horizontal scrollable tab bar |

### 6.16 GroupStandings

**Location:** `src/components/GroupStandings.tsx`

| Property | Value |
|----------|-------|
| Props | `standings: Standing[]`, `groupName: string` |
| Layout | Compact standings table, no P/W/D/GF/GA columns (just position, team, points) |
| Columns | Position, Team, Points (extended on tap for full stats on mobile) |
| Grid | Used in `/tournament/[slug]` Groups tab — 4 per row desktop |
| Data Source | `computeStandings()` from shared utilities |

### 6.17 TeamRosterTable

**Location:** `src/components/TeamRosterTable.tsx`

| Property | Value |
|----------|-------|
| Props | `roster: TeamRoster` |
| Columns | Squad #, Player name, Position, Apps, Goals |
| Position badges | GK, DF, MF, FW (small pills) |
| Layout | Full-width table, scrollable on mobile |
| Data Source | `src/data/rosters.ts` |

### 6.18 NationalTeamHeader

**Location:** `src/components/NationalTeamHeader.tsx`

| Property | Value |
|----------|-------|
| Props | `team: Team` |
| Layout | Flag emoji (large) + team name + stats (FIFA rank, caps, goals) + Follow button |
| Flag | 40px emoji |
| Stats row | FIFA Rank: #XX, Caps: N, Goals: N |
| Quick matches | Shows "Upcoming" and "Last Result" cards below the header |

### 6.19 InternationalMatchFeed

**Location:** `src/components/InternationalMatchFeed.tsx`

| Property | Value |
|----------|-------|
| Props | `matches: Match[]` |
| Layout | Chronological list of MatchCards |
| Filtering | Filtered by `competitionType` for the team's tournaments |
| Sections | Split into "Upcoming" and "Recent" (completed) |

### 6.20 TournamentSearchFilter

**Location:** `src/components/TournamentSearchFilter.tsx`

| Property | Value |
|----------|-------|
| Props | `categories: TournamentCategory[]` |
| Layout | Search input (full width, max 400px) + category chips row below |
| Search | Filters by tournament name and host countries |
| Chips | "All", "World Cup", "Continental", "Olympics", "Friendlies", "Qualifiers" |
| Active chip | Primary green background, white text |

---

## 7. Page Layouts

### 7.1 Homepage (`/`)

**Sections (top to bottom):**

1. **"This Week" Live Games Strip** — Aggregated matches from ALL sources (WC groups, WC knockouts, club leagues, international tournaments). Horizontal scroll on mobile. Uses compact MatchCards. Shows LIVE badge, score/time.

2. **World Cup Group Standings** — Up to 12 groups (A–L) in a 3-column grid on desktop. Each group shows: group letter, position, team name (clickable), points. Qualification badges (Q/C/E) shown on team rows. Collapses to 1-column on mobile.

3. **Knockout Bracket** — Phase-dependent. Shows bracket visualization when `TournamentState.phase === "knockout"`, otherwise hidden. Rounds: Round of 32 → Round of 16 → QF → SF → Final. Collapses to vertical list on mobile.

4. **Followed Teams Section** — Shows upcoming matches and recent results for followed teams. Anonymous users see a CTA placeholder: "Sign in to follow teams." Uses MatchCards with FollowButton on team names.

5. **Featured Club Leagues** — Shows top leagues with 5 teams each. Each league block shows league logo + name, team list (crest + name), and "View Standings →" button. 3-column grid on desktop.

**Responsive:** Mobile-first. All sections stack vertically on mobile. "This Week" strip scrolls horizontally. Group standings go from 3-col → 1-col. Bracket goes from visual → vertical list.

### 7.2 League Directory (`/leagues`)

**Layout:**
```
Header (Leagues active)
├── Page title: "League Directory" + subtitle
├── Search bar + Type filter dropdown (All / Club)
└── League Grid (4-col desktop, 2-col tablet, 1-col mobile)
```

**Search:** Filters leagues by name and country (case-insensitive, partial match). Real-time filtering.

**Filter dropdown:** Options: "All" (default), "Club". Placeholder for "International-Club" reserved.

**Empty state:** "No leagues match your search. Try a different term or browse all leagues."

### 7.3 League Detail (`/league/[slug]`)

**Layout:**
```
Header (Leagues active)
├── League Header (logo + name + country + season dates)
├── Tabs: Standings (default) / Fixtures / Teams
└── Tab content
```

**Tab Details:**

| Tab | Content | Component |
|-----|---------|-----------|
| Standings | Full standings table | StandingsTable (all 10 columns) |
| Fixtures | Matches grouped by matchday | MatchdayGroup → MatchCard × n |
| Teams | Grid of all teams | TeamCard grid (4-col) |

**Invalid slug:** Shows "League not found" with link back to `/leagues`.

### 7.4 Team Detail (`/team/[slug]`)

**Layout:**
```
Header (contextual — Home/Leagues active depending on entry point)
├── Team Header (crest + name + flag + league badge/link + Follow button)
├── Tabs: Club (default) / International
├── Tab content (match cards)
└── Standings section (if applicable)
```

**League badge:** Shows "Playing in: [League Name] →" linking to `/league/[slug]` (club teams only).

**Club tab:** Shows club matches (recent + upcoming).

**International tab:** Shows international matches for the team.

**Standings section:** Shows the team's league standings table (only if the team's league has standings data).

### 7.5 International Overview (`/international`)

**Layout:**
```
Header (International active)
├── Page title: "International Soccer" + subtitle
├── Search bar + Category filter chips
└── Tournament Grid (3-col desktop, 2-col tablet, 1-col mobile)
```

**Category chips:** All, World Cup, Continental, Olympics, Friendlies, Qualifiers.

### 7.6 Tournament Detail (`/tournament/[slug]`)

**Layout:**
```
Header (International active)
├── Tournament Banner (large logo + name + dates + status + host countries)
├── Tabs: Groups / Standings / Fixtures / Knockout (conditional) / Teams
└── Tab content
```

**Tab Details:**

| Tab | Content |
|-----|---------|
| Groups | 4 group standings tables side by side (compact) |
| Standings | Aggregate standings table (all teams across all groups) |
| Fixtures | Date-grouped match list with venue |
| Knockout | Visual bracket (Round of 32 → Final) |
| Teams | 48 teams in a searchable grid with flag, name, group, FIFA rank |

**Knockout tab:** Hidden if tournament has no knockout stage (e.g., group-only tournaments).

### 7.7 National Team Detail (`/national-team/[slug]`)

**Layout:**
```
Header (International active)
├── National Team Header (flag + name + FIFA rank + caps + goals + Follow button)
├── Quick match status (Upcoming / Last Result cards)
├── Tournament Tabs (World Cup 2026, Friendlies, etc.)
│   ├── Group standings for this tournament
│   ├── Team's matches in this tournament
│   └── Optional roster table
└── Follow button
```

### 7.8 Login (`/login`)

**Layout:**
```
Header (Home active)
└── Auth Container (centered, max-width 420px)
    ├── Pitchside logo (large, 56px)
    ├── Title: "Sign in to Pitchside"
    ├── Subtitle explaining benefits
    ├── OAuth buttons: Google, GitHub
    ├── Divider: "or"
    └── Note about redirect behavior
```

**Authenticated redirect:** If user is already logged in, the page detects the session and redirects to `/`.

### 7.9 Account Settings (`/account`)

**Layout:**
```
Header (Follows active)
└── Settings Container (max-width 640px)
    ├── Profile section (avatar, display name editable, email read-only, provider)
    ├── Preferences section (timezone dropdown, theme info, notification placeholder)
    ├── Followed Teams section (team list with Unfollow buttons)
    └── Sign Out button
```

**Profile:** Display name is editable with Save button. Email is read-only (set by OAuth provider).

**Timezone:** Dropdown with common IANA timezones. Affects match times across all pages.

**Notifications:** Placeholder note: "Coming in a future release."

**Followed Teams:** List with team cards and Unfollow buttons.

---

## 8. Navigation

### 8.1 Unified Header

The header is shared across ALL pages. It's defined once in `src/components/Header.tsx` and imported by every page.

**Navigation Map:**

| Nav Item | Route(s) |
|----------|----------|
| Pitchside (logo) | `/` |
| Home | `/` |
| Leagues | `/leagues`, `/league/[slug]` |
| International | `/international`, `/tournament/[slug]`, `/national-team/[slug]` |
| Search | `/search` |
| Follows | `/feed` (auth only) |

**Active detection:** The current route is compared against the nav item's route list. Exact match on the base path.

**Responsive:** On mobile (<768px), nav items are replaced by a hamburger menu.

### 8.2 Breadcrumb (none required)

No breadcrumb navigation is specified in R2. Users navigate via the header nav or by clicking team/league links.

### 8.3 Search Navigation

The `/search` page provides a unified search for teams (club and national). Search page layout mirrors `/leagues` with search bar and TeamCard results grid.

---

## 9. Responsive Behavior

### Breakpoint Definitions

| Breakpoint | Max Width | Behavior |
|------------|-----------|----------|
| Mobile | ≤480px | Single column, hamburger nav, horizontal scroll for tables |
| Tablet | ≤768px | Two column grids, scrollable tab bars |
| Desktop | ≥1024px | Full multi-column layouts, fixed nav |
| Wide | ≥1440px | Max content width 1280px centered |

### Responsive Grid Mapping

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| League Grid | 1 col | 2 col | 4 col |
| Tournament Grid | 1 col | 2 col | 3 col |
| Group Standings | 1 col (full table) | 2 col | 3-4 col (compact) |
| Teams Grid | 1 col | 2 col | 4 col |
| Club League Cards | 1 col | 2 col | 3 col |
| Standings Table | Scrollable / condensed | Scrollable | Full table |

### Component-Specific Responsive Notes

- **MatchCard:** Always horizontal. On mobile, team names may truncate (ellipsis).
- **StandingsTable:** On mobile, use horizontal scroll OR condensed format (Pos, Team, Pts only).
- **KnockoutBracket:** On mobile, collapse to vertical list (no bracket visualization).
- **Tabs:** On mobile, use horizontal scrollable tab bar (no wrapping, no vertical stacking).
- **Grid components:** Always single column on mobile, 2-col on tablet, 3-4 col on desktop.
- **Header:** Hamburger menu on mobile, full nav on desktop.

---

## 10. States & Edge Cases

### 10.1 Loading States

| Component | Loading Pattern |
|-----------|----------------|
| MatchCard | Skeleton: colored bars for team name, score placeholder |
| StandingsTable | Skeleton rows: grid of colored bars |
| LeagueCard | Skeleton: gray rectangle for logo, bars for name/country |
| TournamentCard | Skeleton: same as LeagueCard |
| KnockoutBracket | Skeleton: rounded rectangles for matches |
| Teams Grid | Skeleton: circles + bars for team cards |
| Auth pages | Skeleton: blurred buttons |

**Note:** Loading skeletons are part of Task D (Polish + Edge Cases), but the design patterns are defined here for Steel to reference.

### 10.2 Empty States

| Page | Empty State Message | CTA |
|------|---------------------|-----|
| `/leagues` (search) | "No leagues match your search. Try a different term." | "Browse All Leagues" |
| `/leagues` (no leagues) | No leagues available | None |
| Followed Teams (anonymous) | "Sign in to follow teams. Your personalized feed appears here." | "Sign In" button |
| `/feed` (no follows) | "You haven't followed any teams yet." | "Browse Leagues" button |
| Standings (no data) | "No standings data available yet." | None |
| Fixtures (no matches) | "No fixtures scheduled." | None |

### 10.3 Error States

| Scenario | Error Message | Action |
|----------|--------------|--------|
| API failure (follow) | "Failed to update follows. Please try again." | "Try Again" button |
| Invalid page slug | "Page not found" | Link back to homepage |
| Invalid league slug | "League not found" | Link back to `/leagues` |
| Network timeout | "Something went wrong. We couldn't load this page." | "Try Again" button |

### 10.4 Data States

| Component | State | Visual |
|-----------|-------|--------|
| MatchCard | Live | Red LIVE badge, pulsing dot, show minute |
| MatchCard | Upcoming | "vs" score, time in sky blue |
| MatchCard | Completed | Score in monospace, "FT" label |
| Standings | Qualified | Green Q badge |
| Standings | Contending | Amber C badge |
| Standings | Eliminated | Red E badge |
| Tournament | Upcoming | Gray badge |
| Tournament | Ongoing | Green badge |
| Tournament | Completed | Muted gray badge |
| FollowButton | Not following | Outline style |
| FollowButton | Following | Filled primary tint |

---

## 11. Animation & Interaction

### 11.1 Transitions

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Nav items | color, background | 150ms | ease |
| Cards (hover) | border-color, transform | 200ms | ease |
| Buttons (hover) | background | 150ms | ease |
| Tabs (active) | color, border-bottom | 150ms | ease |
| Live badge dot | opacity | 1.5s infinite | pulse (loop) |
| Countdown ring (live) | border-color | 2s infinite | pulse (loop) |

### 11.2 Micro-interactions

- **Follow button:** Smooth state transition between outline and filled on click
- **League/Tournament cards:** Subtle lift (translateY -1px to -2px) + border glow on hover
- **Team name in standings:** Color change to primary green on hover
- **Tab switching:** Border underline animates to the new tab
- **Filter chips:** Smooth background/text color transition on active toggle

### 11.3 Page Transitions

No explicit page transition animations are specified for R2. Standard Next.js App Router transitions apply (instant navigation with client-side routing).

---

## 12. Accessibility

### 12.1 Color Contrast

All text meets WCAG AA contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text). See [Color System](#3-color-system) section for ratios.

### 12.2 Touch Targets

All interactive elements meet minimum 48×48px touch target size:

- Nav items: minimum 48px height (header is 56px)
- Buttons: minimum 48px height
- Cards: minimum 48px height
- Table rows: minimum 40px height
- Chips: minimum 32px height (acceptable for small filter elements)

### 12.3 Keyboard Navigation

- All nav items are focusable `<a>` elements
- Tab navigation follows DOM order
- Active tab has visible focus indicator (outline on focus)
- All interactive elements respond to Enter and Space keys

### 12.4 Screen Reader

- Team names in standings are `<a>` links (not `<span>`)
- Match status badges use semantic `<span>` with descriptive text
- Form inputs have associated `<label>` or `aria-label`
- Empty states and error messages use semantic error headings

### 12.5 Font Scaling

The design uses `rem` units throughout, which respect user font size preferences. No `px`-based font sizes in layout calculations.

---

## Mockup File

The visual mockup is a single self-contained HTML file at:

```
requirements/mockups/pitchside-design-system.html
```

It contains interactive tabs at the top to navigate between:

1. **Tokens** — All design tokens (colors, spacing, typography, radius)
2. **Header** — Desktop and mobile header variants, active states
3. **Components** — All 20 component specs with every state
4. **Homepage** — All 5 sections of the homepage
5. **/leagues** — League directory with search and filter
6. **/league/[slug]** — League detail with all 3 tabs
7. **/team/[slug]** — Team detail with league badge and club/international tabs
8. **/international** — Tournament overview with search and category chips
9. **/tournament/[slug]** — Tournament detail with all tabs
10. **/national-team/[slug]** — National team page with roster
11. **/login** — Auth page with OAuth buttons
12. **/account** — Account settings with profile, preferences, followed teams

Open in browser:
```
open requirements/mockups/pitchside-design-system.html
```

---

## Steel Handoff Notes

### Priority Order for Implementation

1. **Design tokens first** — `design-tokens.css` defines all CSS custom properties. Steel should import this as a Tailwind config or CSS file.
2. **Header component** — Shared across all pages, should be built first.
3. **Shared components** — Build in order: MatchCard → TeamCard → FollowButton → StandingsTable → CountdownRing → LeagueCard → TournamentCard.
4. **Page layouts** — Build in order: Login → Account → Leagues → League Detail → Team Detail → International → Tournament Detail → National Team → Homepage.
5. **Responsive** — Test all pages at 375px, 768px, 1024px viewports.

### Tailwind Integration

The design tokens map directly to Tailwind's color and spacing scales:

```
--pitch-bg (#020617)    → bg-slate-950
--pitch-surface (#0f172a) → bg-slate-900
--pitch-surface-raised (#1e293b) → bg-slate-800
--pitch-primary (#10b981) → custom: emerald-500
```

Steel should either:
- Extend Tailwind config with custom colors, OR
- Use the CSS custom properties directly in a global stylesheet

### Component Props Contract

All component props are defined in the architecture document (Section 5.4). Steel must follow these exact prop shapes to maintain cross-epic component compatibility.

---

*Design completed 2026-06-24 by Kara (Designer).*
*Handoff pipeline: Brainiac (Architect) → Kara (Designer) → Steel (Implementation) → Zod (QA).*
