"use client";

import Link from "next/link";
import type { Team } from "@/data/types";

interface LeagueTeamListProps {
  teams: Team[];
}

export default function LeagueTeamList({ teams }: LeagueTeamListProps) {
  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No teams available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {teams.map((team) => (
        <Link
          key={team.id}
          href={`/team/${team.slug}`}
          className="block p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            {/* Crest or flag */}
            <div className="relative w-10 h-10 flex-shrink-0">
              {team.crestUrl ? (
                <img
                  src={team.crestUrl}
                  alt={`${team.name} crest`}
                  className="w-10 h-10 object-contain rounded-lg"
                  loading="lazy"
                />
              ) : (
                <span className="text-2xl">{team.flag || "\u26BD"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white truncate">{team.name}</h3>
              {team.shortName && (
                <p className="text-xs text-slate-400">{team.shortName}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
