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
 * Always calls console.warn in development as a safety net.
 */
export async function logError(
  error: unknown,
  context: ErrorContext = {},
): Promise<void> {
  const { message, stack } = extractErrorInfo(error);

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('[ErrorLogger]', { message, stack, context });
    return;
  }

  // Try to send to Sentry
  const sentry = await getSentryInstance();
  if (sentry) {
    const errObj = error instanceof Error ? error : new Error(message);
    sentry.captureException(errObj, {
      tags: { app: 'pitchside' },
      extra: context,
    });
    return;
  }

  // Graceful fallback: log to console.warn even in prod
  console.warn('[ErrorLogger] Sentry not configured — error logged locally:', {
    message,
    stack,
    context,
  });
}

/**
 * Log a non-error warning (e.g., degraded functionality).
 */
export async function logWarning(
  message: string,
  context: ErrorContext = {},
): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[ErrorLogger]', message, context);
    return;
  }

  const sentry = await getSentryInstance();
  if (sentry) {
    sentry.captureMessage(message, {
      level: 'warning',
      tags: { app: 'pitchside' },
      extra: context,
    });
    return;
  }

  console.warn('[ErrorLogger]', message, context);
}
