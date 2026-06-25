// src/lib/csrf.ts — CSRF protection for mutating API routes.
// The CSRF token is embedded in the JWT (see src/lib/auth.config.ts callbacks)
// so it persists across requests with NextAuth's JWT session strategy.

/**
 * Read the CSRF token from the JWT stored in the session.
 * Returns the token string or null if not present.
 */
export function getCsrfToken(session: any): string | null {
  if (!session) return null;
  return (session as any).user?._csrfToken ?? null;
}

/**
 * Verify the CSRF token from the request header against the JWT payload.
 * Returns true if valid, false otherwise.
 */
export function verifyCsrfToken(
  session: any,
  request: Request
): boolean {
  if (!session) return false;

  // Check X-CSRF-Token header (preferred for fetch/XHR)
  const token = request.headers.get("x-csrf-token");
  if (!token) return false;

  const sessionToken = getCsrfToken(session);
  if (!sessionToken) return false;

  // Constant-time comparison to prevent timing attacks
  if (token.length !== sessionToken.length) return false;

  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ sessionToken.charCodeAt(i);
  }
  return result === 0;
}
