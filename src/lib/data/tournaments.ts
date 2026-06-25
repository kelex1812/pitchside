// src/lib/data/tournaments.ts — Tournament repository layer

import type { Tournament, TournamentState } from "@/data/types";

export async function getTournaments(): Promise<Tournament[]> {
  // Currently empty — data will be seeded in Phase B
  return [];
}

export async function getTournamentBySlug(slug: string): Promise<Tournament | null> {
  const tournaments = await getTournaments();
  return tournaments.find((t) => t.slug === slug) || null;
}

/**
 * Determine if World Cup 2026 is in group or knockout phase.
 * Group phase: June 14 - July 10, 2026
 * Knockout phase: July 11 - July 19, 2026
 */
export function getTournamentState(): TournamentState {
  const now = new Date();
  const groupStart = new Date("2026-06-14T00:00:00Z");
  const groupEnd = new Date("2026-07-10T23:59:59Z");
  const knockoutEnd = new Date("2026-07-19T23:59:59Z");

  if (now >= groupStart && now <= groupEnd) {
    return {
      phase: "group",
      phaseEndDate: groupEnd,
      lastUpdated: now,
    };
  }

  if (now > groupEnd && now <= knockoutEnd) {
    return {
      phase: "knockout",
      phaseEndDate: knockoutEnd,
      lastUpdated: now,
    };
  }

  return {
    phase: "group",
    phaseEndDate: groupEnd,
    lastUpdated: now,
  };
}
