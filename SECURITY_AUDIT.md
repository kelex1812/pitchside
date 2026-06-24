# Security Audit Report — Pitchside

**Task:** t_27b827d8
**Audit Date:** 2026-06-24
**Scope:** Pitchside Next.js application (static/SSG sports data site)
**Source Root:** `src/` (5 pages, 8 components, 1 data module, 1 hook)

---

## Executive Summary

**Verdict:** NEEDS_REVISION — 1 critical flaw, 1 medium finding, 2 low issues identified.

This is a client-side rendered Next.js application with seeded sports data. There are no server-side API routes, authentication flows, or user-facing forms. The attack surface is narrow: XSS vectors in the search feature, dependency vulnerabilities, and missing security headers. No credentials, API keys, or PII are present.

---

## Findings

### Severity: MEDIUM — Dependency Vulnerability (npm audit)

**CWE-400:** Uncontrolled Resource Consumption / Unbounded Search
**File:** `package.json` (transitive via `node_modules/next/node_modules/postcss`)
**Issue:** PostCSS < 8.5.10 has a documented XSS vulnerability (GHSA-qx2v-qp2m-jg93) via unescaped `</style>` in CSS stringify output. This affects Next.js (9.3.4-canary.0 - 16.3.0-canary.5) as a transitive dependency.
**Risk:** If PostCSS processes attacker-controlled CSS input, it could inject a `</style>` closing tag, potentially breaking out of style contexts and enabling XSS.
**Recommendation:** Run `npm audit fix` to update postcss. If on canary, consider pinning to a stable Next.js release or updating to the latest stable version.

### Severity: MEDIUM — Missing Security Headers

**CWE-693:** Use of Resource Without Disclosing Origin or Without Check
**File:** `next.config.ts`, no `middleware.ts`
**Issue:** The application sets zero security headers. There is no middleware and no `headers()` entry in `next.config.ts`. Missing headers:
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

**Risk:** Without CSP, the application is vulnerable to XSS via injected script tags if any future feature introduces user-generated content. Without HSTS, the site is susceptible to downgrade attacks (SSL stripping). No X-Frame-Options allows clickjacking.
**Recommendation:** Add a `headers()` section to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'X-XSS-Protection', value: '0' },
        ],
      },
    ];
  },
};
```
For CSP, consider: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://upload.wikimedia.org https://media.api-sports.io; connect-src 'self';`

### Severity: LOW — ICS Date Format Bug (Not Security, but Data Integrity)

**File:** `src/components/CalendarExport.tsx` (line 20)
**Issue:** `formatICSDate()` calls `getUTCMonth()` where it should call `getUTCMinutes()`. Line 20 reads `pad(d.getUTCMonth())` but should be `pad(d.getUTCMonth())` for minutes — wait, it's actually using month again instead of minutes.
**Risk:** Calendar events will have incorrect minute values (month value 0-11 instead of minute value 0-59), causing events to display at wrong times in exported .ics files.
**Recommendation:** Replace line 20 with `pad(d.getUTCMinutes())`.

### Severity: LOW — No Error Logging / Monitoring

**File:** All pages and components
**Issue:** No error boundaries, logging, or monitoring infrastructure. The `not-found.tsx` page handles 404s client-side but there's no error reporting for runtime JavaScript errors.
**Risk:** Production errors go unnoticed; debugging production issues is difficult.
**Recommendation:** Implement a global error boundary component and consider Sentry or a similar monitoring service.

---

## OWASP Top 10 Coverage

| # | Category | Status | Notes |
|---|---|---|---|
| 1 | Broken Access Control | PASS | No auth; all content is public. No role-based access needed. |
| 2 | Cryptographic Failures | PASS | No sensitive data requiring encryption. HTTPS enforced via next/image remotePatterns. |
| 3 | Injection | PASS | No database queries. User input (search) only filters static arrays. No `dangerouslySetInnerHTML`. |
| 4 | Insecure Design | NEEDS_WORK | No security headers by default. Low risk for current scope but risky if app grows. |
| 5 | Security Misconfiguration | MEDIUM | Zero security headers. No middleware. `unoptimized` on images (may be intentional for Vercel). |
| 6 | Vulnerable Components | MEDIUM | PostCSS XSS vulnerability. Run `npm audit fix`. |
| 7 | Auth Failures | PASS | No authentication implemented or needed. |
| 8 | Software Integrity | PASS | No code execution, no dynamic imports of user content. |
| 9 | Logging Failures | LOW | No error logging or monitoring. |
| 10 | SSRF | PASS | No SSRF vectors. Image remotePatterns are explicitly whitelisted. |

**OWASP Categories Affected:** 4 of 10 (0 critical, 2 medium, 2 low)

---

## Checklist Verification

- [x] Authentication for protected routes — N/A (no auth needed)
- [x] Session management — N/A (no sessions)
- [x] Authorization checks — N/A (public site)
- [x] No hardcoded credentials — PASS (none found)
- [x] OAuth flows — N/A
- [x] JWT secrets — N/A
- [x] Sensitive data encrypted — PASS (no sensitive data)
- [x] No PII in URLs/logs/client — PASS (only team IDs in localStorage)
- [x] Input validation — PASS (search has min 2 char filter, static data only)
- [x] Output encoding — PASS (React JSX auto-encodes, no dangerouslySetInnerHTML)
- [x] SQL injection prevention — PASS (no database)
- [x] CSRF protection — PASS (no state-changing endpoints)
- [x] Rate limiting — N/A (no public APIs)
- [x] Request size limits — N/A
- [x] Error handling — NEEDS_WORK (no error boundaries or logging)
- [x] CORS — N/A (no cross-origin API calls)
- [x] HTTPS enforced — PASS (next/image remotePatterns require https)
- [x] Security headers — MEDIUM (none set)
- [x] Dependencies checked — MEDIUM (postcss vulnerability)
- [x] Environment variables — PASS (no .env files found, no secrets needed)
- [x] Least-privilege — PASS (static frontend only)

---

## localStorage / Cookie Audit

| Storage | Key | Content | Secure Flags | Verdict |
|---------|-----|---------|--------------|---------|
| localStorage | `pitchside-following` | JSON array of team IDs (e.g., `["barcelona", "usa"]`) | N/A (localStorage) | PASS — Only non-sensitive team identifiers, no PII, no auth tokens |

No cookies are set by the application.

---

## next.config.ts Analysis

```typescript
// VERIFIED — Images properly constrained
images: {
  remotePatterns: [
    { protocol: "https", hostname: "upload.wikimedia.org" },
    { protocol: "https", hostname: "media.api-sports.io" },
  ],
}
```
Only two trusted remote image hosts are allowed. No wildcard hosts. Good.

The `unoptimized` prop on `next/image` usage suggests the app is running outside Vercel's image optimization runtime. This is a deployment configuration concern, not a security issue.

---

## Search Page Security

**File:** `src/app/search/page.tsx`
- User input (`q`) is filtered against static arrays (`allTeams`, team name/short name).
- Results display only team names and dates from seeded data — no user content rendered.
- Search query is displayed via `{q}` in JSX which React auto-escapes.
- `minLength(2)` filter prevents trivial queries.
- **Verdict: PASS** — No XSS, no injection.

---

## CalendarExport Component

**File:** `src/components/CalendarExport.tsx`
- User input is team selection (checkbox list from static data).
- ICS output escapes backslashes, semicolons, commas, and newlines.
- External links in NewsFeed use `rel="noopener noreferrer"` — PASS.
- **Verdict: PASS** — Properly escaped, no XSS risk.

---

## Recommendations Summary

### Priority 1 — Fix (Critical/Medium)
1. **Run `npm audit fix`** — resolves PostCSS XSS vulnerability (GHSA-qx2v-qp2m-jg93)
2. **Add security headers** — implement `headers()` in `next.config.ts` or add `middleware.ts` with security header middleware

### Priority 2 — Address (Low)
3. **Fix ICS date format** — `getUTCMonth()` → `getUTCMinutes()` in `CalendarExport.tsx` line 20
4. **Add error boundary** — implement `src/app/error.tsx` global error boundary

### Priority 3 — Consider (Future)
5. **Add CSP header** — once the app gains any user-generated content, a strict CSP is essential
6. **Add monitoring** — consider Sentry or similar for error tracking in production

---

## Final Verdict

**OVERALL: NEEDS_REVISION**

The application is a simple static/SSG sports data viewer with a narrow attack surface. The primary concerns are:
1. A known vulnerability in the PostCSS transitive dependency (MEDIUM)
2. Complete absence of security headers (MEDIUM)

No authentication, no API endpoints, no PII, and no server-side mutations reduce the risk significantly. The app would be appropriate for a security review to PASS once the dependency and headers issues are addressed.
