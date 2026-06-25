"use client";

import LeagueCard from "./LeagueCard";
import EmptyState from "./EmptyState";
import type { League } from "@/data/types";

interface LeagueGridProps {
  leagues: League[];
  searchQuery: string;
  filterType: "all" | "club" | "international-club";
}

export default function LeagueGrid({ leagues, searchQuery, filterType }: LeagueGridProps) {
  const filtered = leagues.filter((league) => {
    // Filter by type
    if (filterType !== "all" && league.type !== filterType) return false;

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        league.name.toLowerCase().includes(q) ||
        league.country.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    return (
      <EmptyState
        title="No leagues match your search"
        description="Try adjusting your search or filters to find what you&apos;re looking for."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {filtered.map((league) => (
        <div key={league.id} className="relative">
          {league.teams.length === 0 && (
            <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-700/80 text-slate-300 text-xs font-medium rounded-full">
              Coming soon
            </span>
          )}
          <LeagueCard league={league} />
        </div>
      ))}
    </div>
  );
}
