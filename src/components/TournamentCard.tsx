"use client";

import Link from "next/link";
import type { Tournament } from "@/data/types";

interface TournamentCardProps {
  tournament: Tournament;
  onClick?: (slug: string) => void;
}

function getStatusBadge(status: Tournament["status"]): { bg: string; text: string; label: string } {
  switch (status) {
    case "ongoing":
      return { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Ongoing" };
    case "upcoming":
      return { bg: "bg-amber-500/20", text: "text-amber-400", label: "Upcoming" };
    case "completed":
      return { bg: "bg-slate-500/20", text: "text-slate-400", label: "Completed" };
  }
}

export default function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  const badge = getStatusBadge(tournament.status);

  const card = (
    <Link
      href={`/tournament/${tournament.slug}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return;
        onClick?.(tournament.slug);
      }}
      className="block rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden hover:border-slate-700 transition-all"
    >
      {/* Top section with logo and badge */}
      <div className="px-5 py-4 flex items-start gap-4">
        {tournament.logoUrl && (
          <img
            src={tournament.logoUrl}
            alt={`${tournament.name} logo`}
            className="w-12 h-12 object-contain flex-shrink-0 rounded-lg"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate">{tournament.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Host countries as pills */}
      {tournament.hostCountries?.map((country) => (
          <span
            key={country}
            className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full"
          >
            {country}
          </span>
      ))}
    </Link>
  );

  return onClick ? (
    <div onClick={(e) => e.stopPropagation()}>{card}</div>
  ) : (
    card
  );
}
