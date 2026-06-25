/**
 * Error logger with optional Sentry integration.
 *
 * Usage:
 *   1. Without Sentry: logs to console.warn (dev) and silently captures (prod).
 *   2. With Sentry: install `@sentry/nextjs` and set `NEXT_PUBLIC_SENTRY_DSN` env var.
 *      The logger auto-detects Sentry and routes errors there.
 *
 * To enable Sentry:
 *   npm install @sentry/nextjs
 *   Add NEXT_PUBLIC_SENTRY_DSN=xxx to .env.local
 *   See https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorContext = Record<string, any>;

let _sentryDsn: string | null = null;

// Field names that should NEVER be sent to Sentry (PII protection)
const SENSITIVE_KEYS = new Set([
  "password", "secret", "token", "key", "credential", "authorization",
  "auth", "passwd", "api_key", "apikey", "apiKey", "access_token",
  "refresh_token", "session", "ssn", "credit_card", "cc",
]);

/**
 * Sanitize an error context object by redacting sensitive field values.
 * Prevents PII from being leaked to Sentry error reports.
 */
function sanitizeContext(context: ErrorContext): ErrorContext {
  const sanitized: ErrorContext = {};

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();

    // Skip if the key looks sensitive
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = "[REDACTED]";
      continue;
    }

    // Recursively sanitize nested objects
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      sanitized[key] = sanitizeContext(value as ErrorContext);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item: unknown) =>
        item !== null && typeof item === "object" ? sanitizeContext(item as ErrorContext) : item
      );
    } else {
      // Primitives are passed through as-is (they should be safe identifiers, not PII)
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// Dynamically check for Sentry DSN to avoid build failures if @sentry/nextjs isn't installed.
function getSentryDsn(): string | null {
  if (_sentryDsn !== null) return _sentryDsn;

  try {
    const dsn =
      typeof process !== 'undefined' && process.env
        ? process.env.NEXT_PUBLIC_SENTRY_DSN || null
        : null;
    _sentryDsn = dsn;
    return dsn;
  } catch {
    _sentryDsn = null;
    return null;
  }
}

let _sentryAvailable: boolean | null = null;

async function getSentryInstance(): Promise<any> {
  if (_sentryAvailable !== null) {
    return _sentryAvailable ? await import('@sentry/nextjs') : null;
  }

  const dsn = getSentryDsn();
  if (!dsn) {
    _sentryAvailable = false;
    return null;
  }

  try {
    const sentry = await import('@sentry/nextjs');
    sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
      ],
    });
    _sentryAvailable = true;
    return sentry;
  } catch {
    _sentryAvailable = false;
    return null;
  }
}

/**
 * Safely extract message and stack from an error-like value.
 * Handles Error, string, and any custom error shapes.
 */
function extractErrorInfo(value: unknown): { message: string; stack: string | null } {
  if (typeof value === 'string') {
    return { message: value, stack: null };
  }
  if (value instanceof Error) {
    return { message: value.message, stack: value.stack ?? null };
  }
  // Fallback: stringify
  try {
    return { message: JSON.stringify(value), stack: null };
  } catch {
    return { message: String(value), stack: null };
  }
}

/**
 * Log an error to Sentry (if configured) and/or console.
 * Context is sanitized to prevent PII leaks before being sent to Sentry.
 * Always calls console.warn in development as a safety net.
 */
export async function logError(
  error: unknown,
  context: ErrorContext = {},
): Promise<void> {
  const { message, stack } = extractErrorInfo(error);

  // Sanitize context to remove PII before sending to Sentry
  const safeContext = sanitizeContext(context);

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('[ErrorLogger]', { message, stack, context: safeContext });
    return;
  }

  // Try to send to Sentry
  const sentry = await getSentryInstance();
  if (sentry) {
    const errObj = error instanceof Error ? error : new Error(message);
    sentry.captureException(errObj, {
      tags: { app: 'pitchside' },
      extra: safeContext,
    });
    return;
  }

  // Graceful fallback: log to console.warn even in prod
  console.warn('[ErrorLogger] Sentry not configured — error logged locally:', {
    message,
    stack,
    context: safeContext,
  });
}

/**
 * Log a non-error warning (e.g., degraded functionality).
 * Context is sanitized to prevent PII leaks.
 */
export async function logWarning(
  message: string,
  context: ErrorContext = {},
): Promise<void> {
  const safeContext = sanitizeContext(context);

  if (process.env.NODE_ENV === 'development') {
    console.warn('[ErrorLogger]', message, safeContext);
    return;
  }

  const sentry = await getSentryInstance();
  if (sentry) {
    sentry.captureMessage(message, {
      level: 'warning',
      tags: { app: 'pitchside' },
      extra: safeContext,
    });
    return;
  }

  console.warn('[ErrorLogger]', message, safeContext);
}
