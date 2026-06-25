"use client";

import type { Tournament } from "@/data/types";

interface TournamentBannerProps {
  tournament: Tournament;
}

export default function TournamentBanner({ tournament }: TournamentBannerProps) {
  const statusColors: Record<Tournament["status"], string> = {
    upcoming: "bg-amber-500/20 text-amber-400",
    ongoing: "bg-emerald-500/20 text-emerald-400",
    completed: "bg-slate-500/20 text-slate-400",
  };

  const statusLabels: Record<Tournament["status"], string> = {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20" />

      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Large logo */}
          {tournament.logoUrl && (
            <img
              src={tournament.logoUrl}
              alt={`${tournament.name} logo`}
              className="w-24 h-24 object-contain rounded-xl flex-shrink-0"
              loading="lazy"
            />
          )}

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{tournament.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[tournament.status]}`}>
                {statusLabels[tournament.status]}
              </span>
              {tournament.hostCountries?.map((country) => (
                <span
                  key={country}
                  className="px-3 py-1 bg-slate-800/60 text-slate-400 text-sm rounded-full"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
