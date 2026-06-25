"use client";

import TournamentCard from "./TournamentCard";
import EmptyState from "./EmptyState";
import type { Tournament } from "@/data/types";

interface TournamentGridProps {
  tournaments: Tournament[];
}

export default function TournamentGrid({ tournaments }: TournamentGridProps) {
  if (tournaments.length === 0) {
    return (
      <EmptyState
        title="No tournaments found"
        description="Try adjusting your search or category filter."
        href="/international"
        ctaText="Browse All"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}
