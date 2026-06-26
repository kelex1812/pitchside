# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- **JSON-LD structured data on all 13 routes** — Injected `application/ld+json` scripts via plain `<script>` tags (not `next/script`, which prevented server-side rendering) in every route page. Covers: `Organization` (in `layout.tsx`, rendered on every page), `WebPage` with `BreadcrumbList` (on all pages), `SportsPortal` (homepage), `SportsTeam` (team/[slug] and national-team/[slug] pages), and `SportsEvent` (tournament/[slug] and group/[letter] pages).

### Fixed
- **SEO: JSON-LD rendering fixes** — Fixed 5 issues in structured data implementation: (1) replaced `next/script` with plain `<script>` tags so JSON-LD renders in initial server HTML for crawlers that don't execute JS; (2) corrected `hasBreadcrumb` to `breadcrumb` (valid schema.org property name); (3) restructured BreadcrumbList as sibling `@graph` entity with `@id` references instead of inline nesting; (4) added `item` URLs to all breadcrumb items at position >= 2; (5) added `@id` identifier to Organization in layout.tsx.

### Fixed
- **Accessibility: Duplicate `<main>` landmarks** — Removed duplicate `<main>` wrapper elements from 11 route pages: `FeedPageClient`, `AccountPage`, `InternationalPageClient`, `LeaguesPageClient`, `LeagueDetail`, `TournamentDetail`, `NationalTeamDetail`, `TeamDetail`, `SearchPageClient`, `LoginPageClient`, and `GroupDetail`. The root `layout.tsx` already provides the single `<main id="main-content">` landmark for all routes. For `LoginPageClient`, the flex-centering layout classes were moved to the inner wrapper div to preserve visual layout. This fixes WCAG 4.1.1 compliance issues where assistive technology would encounter multiple `<main>` landmarks on the same page.
- **Accessibility: Color contrast — `text-slate-500` fails WCAG AA on dark backgrounds** — Replaced `text-slate-500` (contrast ~3.0:1) with `text-slate-400` (contrast ~7.0:1) in all text elements on dark backgrounds, bringing them above the WCAG AA threshold of ≥4.5:1. Also updated `placeholder:text-slate-500` to `placeholder:text-slate-400` in the `.search-input` component. Preserved `text-slate-500` on SVG icon elements (EmptyState.tsx) where it is used decoratively via `currentColor`. 177 instances updated across 28 files.
- **SEO: Added canonical URLs to all pages** — Added `alternates: { canonical }` to `generateMetadata` on all 12 page routes (homepage, /account, /feed, /search, /leagues, /international, /login, /league/[slug], /team/[slug], /national-team/[slug], /tournament/[slug], /group/[letter]). Resolves to full URLs like `https://pitchside.app/league/premier-league` via `metadataBase` in root layout. Eliminates duplicate content risk for search engines.
