"use client";

import { useMemo } from "react";
import FixtureCard from "./FixtureCard";
import type { Match } from "@/data/types";

interface InternationalMatchFeedProps {
  matches: Match[];
  userTimezone?: string;
}

export default function InternationalMatchFeed({
  matches,
  userTimezone = "UTC",
}: InternationalMatchFeedProps) {
  // Group matches by competition type
  const grouped = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    const order: string[] = [];

    for (const match of matches) {
      const key = match.competitionType || "other";
      if (!groups[key]) {
        groups[key] = [];
        order.push(key);
      }
      groups[key].push(match);
    }

    return { groups, order };
  }, [matches]);

  // Competition display labels
  const competitionLabels: Record<string, string> = {
    "fifa-world-cup-2026": "FIFA World Cup 2026",
    "euro-2024": "Euro 2024",
    "copa-america-2024": "Copa America 2024",
    "friendlies": "Friendlies",
    "usmnt-friendlies": "USMNT Friendlies",
    "gold-cup-2025": "Gold Cup 2025",
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No matches found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.order.map((competitionType) => {
        const competitionMatches = grouped.groups[competitionType];
        const label = competitionLabels[competitionType] || competitionType;

        return (
          <section key={competitionType}>
            {/* Competition header */}
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              {label}
            </h2>

            {/* Match cards */}
            <div className="space-y-3">
              {competitionMatches.map((match) => (
                <FixtureCard
                  key={match.id}
                  match={match}
                  userTimezone={userTimezone}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
