// src/lib/time.ts — Timezone utilities (shared by ALL pages with date display)

/**
 * Convert an ISO date string (UTC) to the user's timezone as a formatted string.
 * Uses date-fns to format relative to the target timezone.
 *
 * @param dateString - ISO 8601 string (UTC), e.g. "2026-06-24T19:00:00Z"
 * @param timezone - IANA timezone, e.g. "America/New_York". Falls back to UTC.
 * @returns Formatted datetime string in the user's timezone
 */
export function convertToUserTime(dateString: string, timezone: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // Use Intl.DateTimeFormat for timezone conversion without external deps
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone || "UTC",
      hour12: true,
    });
    return formatter.format(date);
  } catch {
    // Fallback to ISO string on error
    return dateString;
  }
}

/**
 * Get just the time portion in the user's timezone.
 */
export function convertToUserTimeShort(dateString: string, timezone: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone || "UTC",
      hour12: true,
    });
    return formatter.format(date);
  } catch {
    return dateString;
  }
}

/**
 * Get just the date portion in the user's timezone.
 */
export function convertToUserDate(dateString: string, timezone: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: timezone || "UTC",
    });
    return formatter.format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculate the countdown from now to a target date (UTC ISO string).
 * Returns { days, hours, minutes } in the target timezone.
 */
export function getCountdown(dateString: string, timezone: string): {
  days: number;
  hours: number;
  minutes: number;
  totalMinutes: number;
} {
  const target = new Date(dateString);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs < 0) {
    return { days: 0, hours: 0, minutes: 0, totalMinutes: 0 };
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes, totalMinutes };
}

/**
 * Get the current week range (Monday to Sunday) in UTC.
 * Used by getMatchesThisWeek.
 */
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  d.setUTCHours(0, 0, 0, 0);
  const start = new Date(d);

  const end = new Date(d);
  end.setUTCDate(d.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
}

/**
 * Check if a match is live based on kickoff time.
 * A match is "live" if within 2 hours of kickoff.
 */
export function isLive(match: { kickoff?: string; status?: string }): boolean {
  if (match.status === "completed") return false;
  const kickoff = match.kickoff;
  if (!kickoff) return false;

  const date = new Date(kickoff);
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - date.getTime());
  return diffMs < 2 * 60 * 60 * 1000; // within 2 hours
}

/**
 * Get browser timezone as a string.
 * This is a client-side only function.
 */
export function getBrowserTimezone(): string {
  if (typeof Intl === "undefined" || typeof Intl.DateTimeFormat === "undefined") {
    return "UTC";
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || "UTC";
  } catch {
    return "UTC";
  }
}
