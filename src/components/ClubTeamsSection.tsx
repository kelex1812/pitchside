import Link from "next/link";
import type { League } from "@/data/types";
import StandingsTable from "./StandingsTable";

interface ClubTeamsSectionProps {
  leagues: League[];
}

export default function ClubTeamsSection({ leagues }: ClubTeamsSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
        Featured Leagues
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {leagues.slice(0, 4).map((league) => (
          <div
            key={league.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all"
          >
            {/* League header */}
            <Link href={`/league/${league.slug}`} className="block px-4 py-3 border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src={league.logoUrl}
                  alt={`${league.name} logo`}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-sm truncate">{league.name}</h3>
                  <p className="text-xs text-slate-400">{league.country}</p>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-emerald-400">View →</span>
              </div>
            </Link>

            {/* First 3 standings rows */}
            {league.standings && league.standings.length > 0 && (
              <div className="px-4 py-2">
                <StandingsTable
                  standings={league.standings.slice(0, 3)}
                />
              </div>
            )}

            {/* Quick team list */}
            {league.teams && league.teams.length > 0 && (
              <div className="px-4 py-2 border-t border-slate-800/50">
                <div className="flex flex-wrap gap-2">
                  {league.teams.slice(0, 6).map((team) => (
                    <Link
                      key={team.id}
                      href={`/team/${team.slug}`}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                    >
                      {team.flag && <span className="text-xs">{team.flag}</span>}
                      <span className="text-xs text-slate-300 truncate max-w-24">{team.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
