import type { Standing } from "@/data/types";

interface StandingsTableProps {
  standings: Standing[];
  showQualification?: boolean;
  onTeamClick?: (teamSlug: string) => void;
}

export default function StandingsTable({ standings, showQualification, onTeamClick }: StandingsTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400">#</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-slate-400">Team</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-400">P</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-400">W</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-400">D</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-400">L</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-400 hidden md:table-cell">GF</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-400 hidden md:table-cell">GA</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-400 hidden sm:table-cell">GD</th>
              <th className="text-center px-3 py-2 text-xs font-semibold text-slate-400">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr
                key={s.team}
                className={`border-b border-slate-800/50 last:border-0 transition-colors ${
                  onTeamClick ? "hover:bg-slate-800/30 cursor-pointer" : ""
                }`}
                onClick={() => onTeamClick?.(s.team)}
              >
                <td className="px-3 py-2 font-medium text-slate-400">{s.position}</td>
                <td className="px-3 py-2 font-medium text-slate-200">{s.team}</td>
                <td className="text-center px-2 py-2 tabular-nums text-slate-400">{s.played}</td>
                <td className="text-center px-2 py-2 tabular-nums text-emerald-400">{s.won}</td>
                <td className="text-center px-2 py-2 tabular-nums text-slate-400">{s.drawn}</td>
                <td className="text-center px-2 py-2 tabular-nums text-red-400">{s.lost}</td>
                <td className="text-center px-2 py-2 tabular-nums hidden md:table-cell text-slate-400">{s.goalsFor}</td>
                <td className="text-center px-2 py-2 tabular-nums hidden md:table-cell text-slate-400">{s.goalsAgainst}</td>
                <td className={`text-center px-2 py-2 tabular-nums font-medium hidden sm:table-cell ${
                  s.goalDifference > 0 ? "text-emerald-400" : s.goalDifference < 0 ? "text-red-400" : "text-slate-400"
                }`}>
                  {s.goalDifference > 0 ? "+" : ""}{s.goalDifference}
                </td>
                <td className="text-center px-3 py-2 font-bold text-slate-200">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
