# Pitchside R2 — Epic 1: User Login & Auth Requirements

**Prepared by:** Lois Lane (BA)
**Date:** 2026-06-24
**Epic:** 1 of 4 (Auth, Homepage, League Directory, International Soccer)
**Workspace:** `/Users/kelex/Documents/pitchside`

---

## 1. Overview

Epic 1 adds authenticated user identity to Pitchside. The scope is:
- OAuth sign-in (Google, GitHub) via Auth.js v5
- Persistent user data layer (User, UserPreference, Follow entities)
- Profile management and logout
- Database-backed follows with localStorage migration for anonymous users
- Personalized dashboard (`/feed`) gated behind authentication
- Timezone-aware date display for logged-in users

**Out of scope:** Email/password registration, Apple OAuth, notification preferences, real-time match updates, content generation.

---

## 2. Shared Conventions Compliance

This doc adheres to `shared-conventions.md` (Section 1-9). Key decisions borrowed without redefinition:

| Convention | Decision (from shared-conventions.md) |
|------------|----------------------------------------|
| Navigation | Unified header: Sign In button (logged out), Avatar dropdown (logged in). No separate "Dashboard" or "My Feed" nav items. Follows nav item appears only when logged in. |
| Routes | `/login` (public, redirects to `/` if authenticated), `/feed` (protected, redirects to `/login`), `/account` (protected, replaced old `/profile`) |
| Team ID | Follow.entity.teamId references `Team.id` (UUID), not slug. Slug is display/URL only. |
| User entity | `User` interface uses UUID PK, provider/providerId for OAuth lookup, tenantId for isolation. |
| Timezone | Dates stored in UTC on data layer, converted on client via `UserPreference.timezone`. Anonymous users use `Intl.DateTimeFormat().resolvedOptions().timeZone` or UTC default. |
| Dark theme | Dark-only. Root layout `bg-slate-950 text-slate-300 antialiased`. No light mode. |
| Component locations | Hooks → `src/hooks/`, shared components → `src/components/`, page components → `src/app/[route]/page.tsx`, types → `src/data/types.ts` |
| FollowButton | State source: localStorage for anonymous, database for logged-in. Hook interface unchanged (`followTeam`, `unfollowTeam`, `toggleFollow`, `isFollowing`, `followedTeamIds`). |
| Auth guards | `/feed` and `/account` require auth. `/login` redirects to `/` if already logged in. All other routes are public. |

**Scope conflict explicitly resolved (from conventions Section 3.3):** Notification preferences are OUT OF SCOPE. The `/account` page may show a placeholder "Coming in a future release" note, but no notification logic is implemented.

---

## 3. Auth Provider Recommendation

### Decision: OAuth via Google and GitHub (Auth.js v5)

**Chosen technology:** NextAuth.js (Auth.js) v5 with Google and GitHub providers.

**Rationale:**
- Next.js ecosystem native — zero-config integration with App Router, server sessions, and middleware
- V5 uses native Web Crypto API (no polyfills needed), supports Edge runtime
- Session management is built-in with JWT or database-backed sessions
- OAuth provider callbacks return standardized user objects (id, name, email, image)
- `@auth/core` can be swapped later without component changes

**Providers included (per shared-conventions decision):**
| Provider | Configuration | Notes |
|----------|--------------|-------|
| Google | OAuth 2.0 (Client ID + Secret) | Requires Google Cloud Console OAuth app. Email is guaranteed. |
| GitHub | OAuth 2.0 (Client ID + Secret) | Requires GitHub OAuth app. Email may be private — handle gracefully with `@protonmail.com` or `username` fallback. |

**Providers excluded (out of scope):**
| Provider | Reason |
|----------|--------|
| Apple | Not in Epic 1 scope. Per conventions: "Google+GitHub only. Email/password deferred. Apple OAuth not in scope." |
| Email/Password | Deferred to later epic. No registration form. |

**Decision for Chris (Question 1 from conventions):**
> Google and GitHub OAuth apps need to be registered. Do the developer accounts (Google Cloud, GitHub) exist? Who has access?

---

## 4. Data Model

### 4.1 User Entity

```typescript
// src/data/types.ts (new)
interface User {
  id: string;          // UUID, PK
  provider: "google" | "github";
  providerId: string;  // Provider's unique user ID
  email: string | null;
  displayName: string; // Name from OAuth provider
  avatarUrl: string | null;
  tenantId: string;    // Multi-tenant isolation (single tenant for R2)
  createdAt: Date;
  updatedAt: Date;
  // UNIQUE(provider, providerId) — OAuth lookup key
}
```

### 4.2 UserPreference Entity

```typescript
// src/data/types.ts (new)
interface UserPreference {
  id: string;          // UUID, PK
  userId: string;      // UUID, FK → User.id, unique (one-to-one)
  timezone: string;    // IANA timezone, default "UTC"
  theme: "dark";       // Epic 1 only — dark is enforced (no toggle yet)
  createdAt: Date;
  updatedAt: Date;
}
```

**NOTICE:** Theme is always `"dark"` in R2. The `"light" | "system"` options from conventions exist for future expansion but are not exposed in Epic 1 UI.

### 4.3 Follow Entity

```typescript
// src/data/types.ts (new)
interface Follow {
  id: string;          // UUID, PK
  userId: string;      // UUID, FK → User.id
  teamId: string;      // UUID, FK → Team.id (NOT slug — per conventions Section 3.1)
  createdAt: Date;
  // UNIQUE(userId, teamId) — prevents duplicate follows
}
```

### 4.4 Anonymous Follow (localStorage)

Anonymous users' follows persist in `localStorage` under key `pitchside-following`:

```typescript
// localStorage key: "pitchside-following"
// Value: string[] of team slugs (array of kebab-case slugs)
// Example: ["real-madrid", "barcelona", "usa"]
```

---

## 5. User Stories & Acceptance Criteria

### US-1.1: OAuth Sign-In

**As a** visitor to Pitchside, **I want to** sign in using my Google or GitHub account, **so that** I can access my personalized feed and save my team follows.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-1 | **Given** any anonymous user is on any public page (/, /leagues, /team/[slug]), **when** they click the "Sign In" button in the header, **then** they are redirected to the `/login` page. |
| AC-2 | **Given** the user is on `/login`, **when** the page renders, **then** it displays two OAuth buttons: "Continue with Google" and "Continue with GitHub", each with the respective provider icon. |
| AC-3 | **Given** the user is on `/login` and clicks "Continue with Google", **when** the OAuth consent flow completes, **then** the user is signed in and redirected to the page they were viewing before clicking Sign In. |
| AC-4 | **Given** the user is on `/login` and clicks "Continue with Google" but cancels the OAuth flow, **then** they are shown on `/login` with the message "Sign-in cancelled. Try again or use GitHub." |
| AC-5 | **Given** the user is on `/login` and clicks "Continue with GitHub", **when** the OAuth consent flow completes, **then** the user is signed in and redirected to the page they were viewing before clicking Sign In. |
| AC-6 | **Given** the user is on `/login` and clicks "Continue with GitHub" but the provider returns an error (e.g., account suspended), **then** they see a clear error message: "Could not sign in with GitHub. Please try again." |
| AC-7 | **Given** a user is already signed in and navigates to `/login`, **when** the page loads, **then** they are automatically redirected to `/`. |
| AC-8 | **Given** a new user signs in for the first time, **when** the OAuth callback completes, **then** a User record and a UserPreference record (with default timezone "UTC") are created automatically. |
| AC-9 | **Given** an existing user signs in via Google and previously signed in via GitHub (different providers, same person), **then** two separate User records are created (per OAuth provider identity isolation — no account merge in R2). |
| AC-10 | **Given** a user signs in, **when** they navigate to any protected route (`/feed`, `/account`), **then** access is granted without a secondary login prompt. |

### US-1.2: User Profile & Account Settings

**As a** signed-in user, **I want to** view and edit my account settings (display name, avatar), **so that** my profile reflects my preferences.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-11 | **Given** a signed-in user navigates to `/account`, **when** the page loads, **then** it displays the user's avatar, display name, email address (from OAuth provider), and the OAuth provider used to sign in. |
| AC-12 | **Given** the user is on `/account`, **when** they change their display name, **then** the name is saved to the User entity and reflected immediately on the page and in the avatar dropdown. |
| AC-13 | **Given** the user's OAuth provider (Google or GitHub) updates their profile picture, **when** the user loads `/account` again, **then** the avatar is updated from the provider (or cached locally). |
| AC-14 | **Given** the user is on `/account`, **then** the Timezone section shows a dropdown of common IANA timezone values (not the full list) and saves the selection to `UserPreference.timezone`. |
| AC-15 | **Given** the user is on `/account` and selects a timezone, **when** they save, **then** all dates across the app (homepage fixtures, team schedules, league fixtures) update to the selected timezone on the next page load. |
| AC-16 | **Given** the user is on `/account`, **then** there is a "Notification Preferences" section with a note: "Coming in a future release." No toggle or form is rendered — this is a placeholder only. |
| AC-17 | **Given** the user is on `/account`, **then** their followed teams are listed with the ability to unfollow each team directly from the account page. |

### US-1.3: Logout

**As a** signed-in user, **I want to** log out from my account, **so that** my session ends and I can sign in as someone else (or browse anonymously).

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-18 | **Given** a signed-in user has their avatar dropdown open (from the header), **when** they click "Logout", **then** they are signed out and redirected to `/` (homepage). |
| AC-19 | **Given** a signed-in user is on a protected route (`/feed` or `/account`) and clicks Logout, **then** they are redirected to `/` (not the route they were on). |
| AC-20 | **Given** a user has logged out, **when** they try to navigate to `/feed` or `/account`, **then** they are redirected to `/login` with a message: "Please sign in to access this page." |
| AC-21 | **Given** a user has logged out, **when** they try to access the API for followed teams, **then** the response is an empty array (no stale data is returned). |

### US-1.4: Persistent Database-Backed Follows

**As a** signed-in user, **I want to** follow and unfollow teams with persistent database storage, **so that** my followed teams are available across all devices and sessions.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-22 | **Given** a signed-in user clicks "Follow" on a team card (from any page), **when** the database insert succeeds, **then** the button state changes to "Following" immediately (optimistic update). |
| AC-23 | **Given** a signed-in user clicks "Following" on a team card, **when** the database delete succeeds, **then** the button state changes to "Follow" immediately. |
| AC-24 | **Given** a signed-in user follows Team A on device 1, **when** they log in on device 2, **then** Team A appears in their followed teams list on device 2. |
| AC-25 | **Given** a signed-in user tries to follow a team they already follow, **then** the database returns a duplicate constraint error and the UI shows no change (the button stays "Following"). |
| AC-26 | **Given** the database API call fails (network error) during a follow action, **when** the error is caught, **then** a toast shows "Could not update follows. Please try again." and the button reverts to its previous state. |

### US-1.5: localStorage Migration on First Login

**As a** user who was following teams anonymously (via localStorage), **I want to** have my anonymous follows automatically migrated to my database-backed follows when I sign in, **so that** I don't lose any follows.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-27 | **Given** an anonymous user has entries in `localStorage` (`pitchside-following`) with team slugs, **when** they sign in, **then** the app reads the localStorage entries, converts slugs to team IDs, and inserts Follow records into the database for any that don't already exist. |
| AC-28 | **Given** the localStorage migration succeeds, **when** it completes, **then** the localStorage key `pitchside-following` is deleted (cleared). |
| AC-29 | **Given** the localStorage migration encounters a team slug that doesn't exist in the team database, **then** that slug is silently skipped (no error shown to user). |
| AC-30 | **Given** the localStorage migration fails (network error), **then** the localStorage entries are preserved (not cleared) so the user can try again later or contact support. |

### US-1.6: Anonymous Follow Banner

**As a** visitor (anonymous user), **I want to** see a prompt when I try to follow a team, **so that** I know I need to sign in to sync my follows.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-31 | **Given** an anonymous user clicks "Follow" on a team card, **when** the follow action executes (persisting to localStorage), **then** a toast/banner appears: "Sign in to sync your follows across devices." |
| AC-32 | **Given** the anonymous follow toast is displayed, **when** the user closes it, **then** the follow is still persisted in localStorage (the toast is informational only, it does not block the action). |
| AC-33 | **Given** an anonymous user has followed teams (stored in localStorage), **when** they click "Sign In" and complete the OAuth flow, **then** the localStorage migration (AC-27 through AC-30) runs automatically. |

### US-1.7: Personalized Authenticated Dashboard (`/feed`)

**As a** signed-in user, **I want to** see a personalized dashboard showing my followed teams' upcoming matches and recent results, **so that** I get a curated feed of content relevant to my interests.

**Acceptance Criteria:**

| ID | Scenario |
|----|----------|
| AC-34 | **Given** a signed-in user navigates to `/feed`, **when** the page loads, **then** it displays upcoming matches for all followed teams, grouped by date. |
| AC-35 | **Given** a signed-in user has no followed teams, **when** they navigate to `/feed`, **then** they see an empty state: "You haven't followed any teams yet. Follow teams from the homepage, leagues, or team pages to see their matches here." with a link to `/leagues`. |
| AC-36 | **Given** an anonymous user navigates to `/feed`, **when** the page loads, **then** they are redirected to `/login` with the message "Please sign in to access your personalized dashboard." |
| AC-37 | **Given** a signed-in user is on `/feed` with followed teams, **when** the page displays matches, **then** the match times are shown in the user's configured timezone (from UserPreference.timezone, defaulting to UTC). |
| AC-38 | **Given** a signed-in user is on `/feed`, **then** each match entry shows: date/time, home team vs away team (with logos), score (if completed), and a countdown ring (if upcoming). Each team name is a clickable link to `/team/[slug]`. |
| AC-39 | **Given** a signed-in user is on `/feed` and follows a new team from another page (e.g., `/leagues`), **when** they return to `/feed`, **then** that team's matches appear in the feed on the next page load. |
| AC-40 | **Given** a signed-in user is on `/feed` and unfollows a team, **when** they refresh the page, **then** that team's matches no longer appear in the feed. |

---

## 6. Feature Inventory: useFollowTeams Hook Changes

### Current State (Anonymous)

The existing `useFollowTeams` hook reads/writes from `localStorage`:
- Key: `pitchside-following`
- Value: `string[]` of team slugs
- Functions: `followTeam(slug)`, `unfollowTeam(slug)`, `isFollowing(slug)`, `getFollowedTeams()`

### Changes Required for Epic 1

| Aspect | Current | After Epic 1 |
|--------|---------|--------------|
| **Data source (anonymous)** | localStorage | localStorage (unchanged) |
| **Data source (logged in)** | N/A | Database API (Follow table) |
| **write target (anonymous)** | localStorage | localStorage (unchanged) |
| **write target (logged in)** | N/A | Database API |
| **teamId format (anonymous)** | slug (string) | slug (string) — unchanged |
| **teamId format (logged in)** | N/A | UUID (Team.id) — new |
| **Conversion (anonymous → logged in)** | N/A | localStorage slugs → lookup Team.id → insert Follow records |
| **Hook interface** | `followTeam`, `unfollowTeam`, `isFollowing`, `followedTeamIds` | Same interface, type parameter changes from `string` to `string | Team` |
| **State management** | Client-side only | Client-side + server-synced |

### Implementation Notes for Brainiac

1. The `useFollowTeams` hook needs a new prop or context: `session` (from Auth.js).
2. When session exists: the hook reads from the Follow API endpoint instead of localStorage.
3. When session is null: the hook falls back to the existing localStorage behavior.
4. The localStorage key `pitchside-following` still uses slugs for anonymous users — the hook must handle slug→UUID conversion when migrating.
5. The hook should expose a new function: `migrateFollows()` that runs on first authenticated session load.

---

## 7. Integration Needs

### 7.1 OAuth Credentials (Chris Action Required)

| Provider | What Chris Needs | Where |
|----------|------------------|-------|
| Google | Create OAuth 2.0 Client ID in Google Cloud Console | Google Cloud Console → APIs & Services → Credentials |
| GitHub | Create OAuth App in GitHub Developer Settings | GitHub → Settings → Developer settings → OAuth Apps |
| Both | Share Client ID and Client Secret with the dev team | Add to `.env.local` as `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |
| Both | Configure authorized redirect URI | Will be `{NEXT_PUBLIC_BASE_URL}/auth/callback/[provider]`. e.g., `http://localhost:3000/auth/callback/google` and `http://localhost:3000/auth/callback/github` |

### 7.2 Session Management

- **Mechanism:** Auth.js v5 with database-backed sessions (recommended) or JWT sessions.
- **Cookie config:** Will depend on deployment target (see Question 4 in Open Questions). Default for development: `localhost` with `secure=false`. Production: `secure=true`, `sameSite=lax`, `domain` set to production domain.
- **Session lifetime:** 30 days (default). Users must re-authenticate after expiry.

### 7.3 Database API Endpoints (for Follow entity)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/follows` | GET | Required | Returns Follow[] for current user's followed teams |
| `/api/follows` | POST | Required | Creates a Follow record (userId from session, teamId from body) |
| `/api/follows/[teamId]` | DELETE | Required | Deletes a Follow record for current user and teamId |
| `/api/auth/[...nextauth]` | GET/POST | Public | Auth.js v5 callback handler |

---

## 8. Route Proposal

### Epic 1 Routes (per shared-conventions)

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/login` | Sign In | No (redirects to `/` if already logged in) | OAuth sign-in page. Shows Google and GitHub buttons only. |
| `/feed` | Personalized Dashboard | Yes (redirects to `/login`) | Authenticated user's followed teams' matches and results. |
| `/account` | User Profile & Settings | Yes (redirects to `/login`) | Display name, avatar, timezone settings, followed teams list, notification placeholder. |

### Auth.js v5 Callback Routes (implicit)

| Route | Description |
|-------|-------------|
| `/auth/signin` | Auth.js built-in sign-in page (NOT used — Epic 1 uses a custom `/login` page) |
| `/auth/signout` | Auth.js built-in sign-out (NOT used — Epic 1 uses header dropdown logout) |
| `/auth/callback/google` | Google OAuth callback (Auth.js handles session creation) |
| `/auth/callback/github` | GitHub OAuth callback (Auth.js handles session creation) |
| `/auth` | Auth.js base route |

---

## 9. Scope Boundaries

### In Scope
- Google OAuth sign-in and sign-up (first-time users)
- GitHub OAuth sign-in and sign-up (first-time users)
- User entity creation from OAuth callbacks
- UserPreference entity creation (default timezone = UTC)
- Follow entity with database API (CRUD for follows)
- localStorage → database migration on first login
- Anonymous localStorage follow persistence (unchanged from current)
- `/login` page (custom OAuth sign-in)
- `/feed` page (authenticated dashboard)
- `/account` page (profile, timezone, followed teams)
- Logout from header dropdown
- Timezone-aware date display for logged-in users
- Follow button state changes (authenticated and anonymous)

### Out of Scope
- Email/password registration or login
- Apple Sign In
- Password reset or account recovery
- Multi-provider account linking (same user, different providers)
- Notification preferences implementation (placeholder UI only)
- Theme switching (dark only in R2)
- Account deletion
- Two-factor authentication
- Session expiration warnings
- "Remember me" or extended session duration
- Social sharing or profile public visibility
- User search or profile discovery

---

## 10. Dependencies on Other Epics

| Dependency | Epic | Impact |
|------------|------|--------|
| Team.id field | 2, 3, 4 | All team pages (Epic 2 group standings, Epic 3 league detail) must include `Team.id` (UUID) alongside existing `slug`. Follow entity references this ID. |
| Follow entity | 2, 3, 4 | Knockout bracket on homepage (Epic 2) and league pages (Epic 3) may show "followed" status indicators — Follow API must be available. |
| Timezone convention | 2, 3, 4 | Homepage "This Week" fixtures, league fixtures, and team schedules must all use UserPreference.timezone for logged-in users. |
| Auth.js middleware | All | All protected routes (`/feed`, `/account`) use Auth.js middleware for access control. |

---

## 11. Open Questions for Chris / Brainiac

| # | Question | Epic | Impact | Notes |
|---|----------|------|--------|-------|
| 1 | **OAuth provider registration:** Are Google Cloud and GitHub developer accounts available? Who has access to create the OAuth apps? | 1 | Blocks implementation | No sign-in without OAuth credentials. |
| 2 | **Database choice:** Brainiac's architecture decision. PostgreSQL (Supabase, Neon, or AWS RDS) recommended. | 1 | Blocks data model implementation | Per conventions Section 9, Q2. |
| 3 | **Deployment target:** Will this be deployed to Vercel, a VPS, or another platform? | 1 | Affects Auth.js cookie config (`secure`, `domain`, `sameSite`) | Per conventions Section 9, Q4. |
| 4 | **Single tenant for R2:** Is there exactly one organization/team for R2? | 1 | Affects User.tenantId and Follow.userId scoping | Convention says single tenant — confirm with Chris. |
| 5 | **Migration trigger timing:** Should localStorage migration happen during the OAuth callback (server-side) or on the first client-side render after login? | 1 | Affects UX (flash of anonymous state) | Client-side is simpler but may show a flicker. Server-side is cleaner but adds latency to the callback. |
| 6 | **Anonymous localStorage format:** Should `pitchside-following` continue to use team slugs (current) or switch to team IDs? | 1 | Affects migration logic | Convention says anonymous uses slugs. Migration converts slugs → UUIDs. Confirm this is acceptable. |

---

## 12. Wireframe Descriptions (Text)

### `/login` — Sign In Page
- Centered card on dark background
- Pitchside logo at top
- Title: "Sign In to Pitchside"
- "Continue with Google" button (white bg, Google G icon)
- Divider: "or"
- "Continue with GitHub" button (dark bg, GitHub icon)
- Bottom: "Sign in to save your follows and personalize your feed."

### `/feed` — Personalized Dashboard
- Full-width layout, no sidebar
- Header: "My Teams" or user's name
- Two sections:
  - **Upcoming Matches:** Cards with date, countdown ring, team logos, team names (clickable)
  - **Recent Results:** Cards with date, score prominently displayed, team logos
- Empty state if no follows: icon, text, "Browse Leagues" link
- Matches ordered by date (soonest first)

### `/account` — User Profile & Settings
- Two-column layout:
  - **Left (Profile):** Avatar (large), display name (editable), email (read-only), provider icon, "Save" button
  - **Right (Settings):**
    - **Timezone:** Dropdown with common timezones (no search, no full list), "Save" button
    - **Notification Preferences:** Section header + note "Coming in a future release." (no form)
    - **Followed Teams:** Scrollable list showing team logos, names, and "Unfollow" buttons
- Header: "Account Settings"
- Back link or breadcrumb to `/`

---

## 13. Priority Assessment

| User Story | Priority | Rationale |
|------------|----------|-----------|
| US-1.1 (OAuth Sign-In) | **High** | Foundation for all other Epic 1 features |
| US-1.2 (Account Settings) | **High** | Core user customization |
| US-1.3 (Logout) | **High** | Basic security requirement |
| US-1.4 (Persistent Follows) | **High** | Primary value proposition of auth |
| US-1.5 (localStorage Migration) | **High** | Prevents follow loss on first login |
| US-1.6 (Anonymous Banner) | **Medium** | Nice-to-have UX improvement |
| US-1.7 (Personalized Dashboard) | **High** | Drives user engagement; depends on auth |

---

*Document generated 2026-06-24 by Lois Lane, Fortress of Solitude Consulting.*
*Handed off to Brainiac (web architect) for system architecture and implementation planning.*
*Follow-up task spawned: t_eca64bb2 (for implementation verification).*
