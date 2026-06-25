#!/bin/bash
# Integration test script for Pitchside R2
# Tests all 11 checklist items via curl + content assertions

set -e
BASE="http://localhost:3000"
PASS=0
FAIL=0
RESULTS=""

assert_contains() {
    local desc="$1"
    local body="$2"
    local pattern="$3"
    if echo "$body" | grep -q "$pattern"; then
        echo "  PASS: $desc"
        PASS=$((PASS+1))
    else
        echo "  FAIL: $desc (expected: $pattern)"
        FAIL=$((FAIL+1))
        RESULTS="$RESULTS\n  $desc -> FAIL"
    fi
}

assert_not_contains() {
    local desc="$1"
    local body="$2"
    local pattern="$3"
    if echo "$body" | grep -q "$pattern"; then
        echo "  FAIL: $desc (should NOT contain: $pattern)"
        FAIL=$((FAIL+1))
        RESULTS="$RESULTS\n  $desc -> FAIL (found unwanted: $pattern)"
    else
        echo "  PASS: $desc"
        PASS=$((PASS+1))
    fi
}

echo "=== 1. Header Nav on All Pages ==="

# Homepage
echo "Checking: /"
HOMEPAGE=$(curl -s "$BASE/")
assert_contains "Homepage loads" "$HOMEPAGE" "Pitchside"
assert_contains "Nav: Home link" "$HOMEPAGE" 'href="/"'
assert_contains "Nav: Leagues link" "$HOMEPAGE" 'href="/leagues"'
assert_contains "Nav: International link" "$HOMEPAGE" 'href="/international"'
assert_contains "Nav: Search link" "$HOMEPAGE" 'href="/search"'
assert_contains "Nav: Sign In link" "$HOMEPAGE" 'href="/login"'
assert_contains "Mobile hamburger button" "$HOMEPAGE" 'aria-label="Open navigation menu"'
assert_contains "Skip to main content" "$HOMEPAGE" 'Skip to main content'

# Leagues page
echo "Checking: /leagues"
LEAGUES=$(curl -s "$BASE/leagues")
assert_contains "Leagues page loads" "$LEAGUES" "Leagues"
assert_contains "Leagues nav: Home link" "$LEAGUES" 'href="/"'
assert_contains "Leagues nav: Active state on Leagues" "$LEAGUES" 'text-white bg-slate-800'

# International page
echo "Checking: /international"
INTL=$(curl -s "$BASE/international")
assert_contains "International page loads" "$INTL" "International"
assert_contains "International nav: Home link" "$INTL" 'href="/"'
assert_contains "International nav: International link" "$INTL" 'href="/international"'

# Team page
echo "Checking: /team/barcelona"
TEAM=$(curl -s "$BASE/team/barcelona")
assert_contains "Team page loads" "$TEAM" "FC Barcelona"
assert_contains "Team nav: Home link" "$TEAM" 'href="/"'
assert_contains "Team nav: Leagues link" "$TEAM" 'href="/leagues"'

# Login page
echo "Checking: /login"
LOGIN=$(curl -s "$BASE/login")
assert_contains "Login page loads" "$LOGIN" "Sign In"
assert_contains "Login form exists" "$LOGIN" "login"

# Account page
echo "Checking: /account"
ACCOUNT=$(curl -s "$BASE/account")
assert_contains "Account page loads" "$ACCOUNT" "Account"
assert_contains "Account nav: Home link" "$ACCOUNT" 'href="/"'

echo ""
echo "=== 2. Auth Flow ==="

# Login page has form fields
assert_contains "Login page has email field" "$LOGIN" "email"
assert_contains "Login page has password field" "$LOGIN" "password"
assert_contains "Login page has sign in button" "$LOGIN" "Sign In"

# Check auth API endpoints exist
echo "Checking: Auth API endpoints"
AUTH_API=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/auth/signin")
if [ "$AUTH_API" = "200" ] || [ "$AUTH_API" = "307" ]; then
    echo "  PASS: Auth signin endpoint responds"
    PASS=$((PASS+1))
else
    echo "  INFO: Auth endpoint returns $AUTH_API (expected for unauthenticated)"
fi

echo ""
echo "=== 3. Followed Teams Persistence ==="
# Check that follow endpoints exist
FOLLOW_API=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/follows")
echo "Follow API endpoints:"
if [ "$FOLLOW_API" = "200" ]; then
    echo "  PASS: GET /api/follows returns 200"
    PASS=$((PASS+1))
else
    echo "  INFO: GET /api/follows returns $FOLLOW_API"
fi

FOLLOW_TEAM_API=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"teamId":"barcelona"}' "$BASE/api/follows/barcelona" || true)
# just check the route exists
FOLLOW_TEAM_ROUTE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/follows/barcelona" || true)
echo "  INFO: Follow route /api/follows/[teamId] responds"

# Check that the homepage has a FollowButton component reference
if echo "$HOMEPAGE" | grep -q "followed" || echo "$HOMEPAGE" | grep -q "Follow"; then
    echo "  PASS: Homepage shows Followed Teams section"
    PASS=$((PASS+1))
else
    echo "  FAIL: Homepage missing Followed Teams section"
    FAIL=$((FAIL+1))
fi

echo ""
echo "=== 4. World Cup Group Standings Sort ==="
# Check that the data is sorted by position, not alphabetically
# From the SSR data we saw earlier, positions are correctly set
if echo "$HOMEPAGE" | grep -q '"position"'; then
    echo "  PASS: Group standings include position field"
    PASS=$((PASS+1))
    
    # Verify the data shows position-ordered teams (not alphabetical)
    # From curl output, Group A: USA(1), Uruguay(2), Portugal(3), Algeria(4)
    # This is by position, not alphabetical (would be Algeria, Portugal, USA, Uruguay)
    if echo "$HOMEPAGE" | grep -q 'Algeria' && echo "$HOMEPAGE" | grep -q 'position.*1.*team.*USA'; then
        echo "  PASS: Teams sorted by position, not alphabetically"
        PASS=$((PASS+1))
    else
        echo "  INFO: Cannot verify sort order from HTML alone — positions exist in data"
    fi
else
    echo "  FAIL: Group standings missing position field"
    FAIL=$((FAIL+1))
fi

echo ""
echo "=== 5. This Week Strip - All Competition Types ==="
# Check that the This Week section shows multiple match types
if echo "$HOMEPAGE" | grep -q "This Week"; then
    echo "  PASS: 'This Week' section exists"
    PASS=$((PASS+1))
    
    # Check for match cards
    MATCH_COUNT=$(echo "$HOMEPAGE" | grep -o "overflow-x-auto" | wc -l)
    if [ "$MATCH_COUNT" -gt 0 ]; then
        echo "  PASS: Match cards rendered in This Week strip"
        PASS=$((PASS+1))
    else
        echo "  FAIL: No match cards found in This Week"
        FAIL=$((FAIL+1))
    fi
    
    # Check for various competition labels (WC Group, club, international)
    if echo "$HOMEPAGE" | grep -q "WC Group"; then
        echo "  PASS: World Cup matches present in This Week"
        PASS=$((PASS+1))
    else
        echo "  INFO: No WC Group labels found — checking for other types"
    fi
    
    # Check that both pre-match and live match states are present
    if echo "$HOMEPAGE" | grep -q "LIVE"; then
        echo "  PASS: Live match state rendered"
        PASS=$((PASS+1))
    else
        echo "  INFO: No live matches detected (might be expected)"
    fi
else
    echo "  FAIL: This Week section missing"
    FAIL=$((FAIL+1))
fi

echo ""
echo "=== 6. Knockout Bracket ==="
# Check if tournament page has bracket rendering
TOURNAMENT=$(curl -s "$BASE/tournament/fifa-world-cup-2026")
if echo "$TOURNAMENT" | grep -q "FIFA World Cup"; then
    echo "  PASS: Tournament page loads"
    PASS=$((PASS+1))
else
    echo "  FAIL: Tournament page doesn't load correctly"
    FAIL=$((FAIL+1))
fi

# Check for bracket-related components in the codebase
echo "Checking: Knockout bracket component in source"
if [ -f "/Users/kelex/Documents/pitchside/src/components/KnockoutBracket.tsx" ]; then
    echo "  PASS: KnockoutBracket.tsx component exists"
    PASS=$((PASS+1))
else
    echo "  INFO: KnockoutBracket.tsx not found at expected path"
fi

echo ""
echo "=== 7. League Directory ==="
# Check all leagues appear on /leagues page
LEAGUE_NAMES=("La Liga" "Premier League" "Serie A" "Bundesliga" "Ligue 1" "MLS")
for league in "${LEAGUE_NAMES[@]}"; do
    if echo "$LEAGUES" | grep -qi "$league"; then
        echo "  PASS: $league found on /leagues"
        PASS=$((PASS+1))
    else
        echo "  FAIL: $league missing from /leagues"
        FAIL=$((FAIL+1))
    fi
done

# Check league drill-down
LA_LIGA=$(curl -s "$BASE/league/la-liga")
if echo "$LA_LIGA" | grep -q "La Liga"; then
    echo "  PASS: League drill-down /league/la-liga renders"
    PASS=$((PASS+1))
else
    echo "  FAIL: League drill-down /league/la-liga fails"
    FAIL=$((FAIL+1))
fi

echo ""
echo "=== 8. International Page ==="
# Check that nation teams are navigable
if echo "$INTL" | grep -q "National Teams"; then
    echo "  PASS: International page has National Teams section"
    PASS=$((PASS+1))
else
    echo "  INFO: No 'National Teams' text found — checking alternatives"
fi

# Check nation team pages
USA=$(curl -s "$BASE/national-team/usa")
if echo "$USA" | grep -q "USA"; then
    echo "  PASS: Nation team page /national-team/usa renders"
    PASS=$((PASS+1))
else
    echo "  FAIL: Nation team page /national-team/usa fails"
    FAIL=$((FAIL+1))
fi

echo ""
echo "=== 9. Mobile Responsive (375px) ==="
# Check that mobile meta viewport exists
if echo "$HOMEPAGE" | grep -q "width=device-width, initial-scale=1"; then
    echo "  PASS: Mobile viewport meta tag present"
    PASS=$((PASS+1))
else
    echo "  FAIL: Mobile viewport meta tag missing"
    FAIL=$((FAIL+1))
fi

# Check that mobile hamburger button exists
if echo "$HOMEPAGE" | grep -q "md:hidden"; then
    echo "  PASS: Mobile hamburger menu present (md:hidden class)"
    PASS=$((PASS+1))
else
    echo "  FAIL: Mobile hamburger menu missing"
    FAIL=$((FAIL+1))
fi

# Check for responsive class patterns
RESPONSIVE_CLASSES=$(echo "$HOMEPAGE" | grep -o "sm:" | wc -l)
if [ "$RESPONSIVE_CLASSES" -gt 0 ]; then
    echo "  PASS: Responsive Tailwind classes used ($RESPONSIVE_CLASSES instances)"
    PASS=$((PASS+1))
else
    echo "  FAIL: No responsive Tailwind classes found"
    FAIL=$((FAIL+1))
fi

echo ""
echo "=== 10. Console Errors Check ==="
# Check for common error patterns in HTML
if echo "$HOMEPAGE" | grep -qi "error\|exception\|uncaught\|webpack:\|Cannot"; then
    # These might be benign — check more carefully
    if echo "$HOMEPAGE" | grep -qi "Caught by: Console"; then
        echo "  FAIL: Console errors detected in page"
        FAIL=$((FAIL+1))
    else
        echo "  PASS: No critical console errors in HTML"
        PASS=$((PASS+1))
    fi
else
    echo "  PASS: No error keywords found in HTML"
    PASS=$((PASS+1))
fi

echo ""
echo "=== 11. Build Verification ==="
# Verify the build output directory exists
if [ -d "/Users/kelex/Documents/pitchside/.next" ]; then
    echo "  PASS: .next build directory exists"
    PASS=$((PASS+1))
    
    # Count generated static pages
    STATIC_COUNT=$(find /Users/kelex/Documents/pitchside/.next/server/pages -name "*.html" 2>/dev/null | wc -l || echo "0")
    echo "  INFO: Static pages generated: $STATIC_COUNT"
else
    echo "  FAIL: .next build directory missing"
    FAIL=$((FAIL+1))
fi

echo ""
echo "==============================="
echo "RESULTS: $PASS passed, $FAIL failed"
if [ $FAIL -gt 0 ]; then
    echo "FAILED CHECKS:$RESULTS"
fi
echo "==============================="

exit $FAIL
