# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Fixed
- **Accessibility: Duplicate `<main>` landmarks** — Removed duplicate `<main>` wrapper elements from 9 route pages (`FeedPageClient`, `AccountPage`, `InternationalPageClient`, `LeaguesPageClient`, `LeagueDetail`, `TournamentDetail`, `NationalTeamDetail`, `TeamDetail`, `SearchPageClient`). The root `layout.tsx` already provides the single `<main id="main-content">` landmark for all routes. This fixes WCAG 4.1.1 compliance issues where assistive technology would encounter multiple `<main>` landmarks on the same page.
