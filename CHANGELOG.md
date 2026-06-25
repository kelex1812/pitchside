# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- **JSON-LD structured data on all 13 routes** — Injected `application/ld+json` scripts via `next/script` in every route page to provide machine-readable SEO data for search engines. Covers: `Organization` (in `layout.tsx`, rendered on every page), `WebPage` with `BreadcrumbList` (on all pages), `SportsPortal` (homepage), `SportsTeam` (team/[slug] and national-team/[slug] pages), and `SportsEvent` (tournament/[slug] and group/[letter] pages).

### Fixed
- **Accessibility: Duplicate `<main>` landmarks** — Removed duplicate `<main>` wrapper elements from 11 route pages: `FeedPageClient`, `AccountPage`, `InternationalPageClient`, `LeaguesPageClient`, `LeagueDetail`, `TournamentDetail`, `NationalTeamDetail`, `TeamDetail`, `SearchPageClient`, `LoginPageClient`, and `GroupDetail`. The root `layout.tsx` already provides the single `<main id="main-content">` landmark for all routes. For `LoginPageClient`, the flex-centering layout classes were moved to the inner wrapper div to preserve visual layout. This fixes WCAG 4.1.1 compliance issues where assistive technology would encounter multiple `<main>` landmarks on the same page.
- **Accessibility: Color contrast — `text-slate-500` fails WCAG AA on dark backgrounds** — Replaced `text-slate-500` (contrast ~3.0:1) with `text-slate-400` (contrast ~7.0:1) in all text elements on dark backgrounds, bringing them above the WCAG AA threshold of ≥4.5:1. Also updated `placeholder:text-slate-500` to `placeholder:text-slate-400` in the `.search-input` component. Preserved `text-slate-500` on SVG icon elements (EmptyState.tsx) where it is used decoratively via `currentColor`. 177 instances updated across 28 files.
