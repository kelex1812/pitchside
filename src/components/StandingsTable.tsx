interface StandingsTableProps {
  standings: {
    position: number;
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }[];
  teamName?: string;
}

export default function StandingsTable({ standings, teamName }: StandingsTableProps) {
  const rowClass = standings
    .filter((s) => s.team === teamName)
    .map((s) => s.position)[0]
    ? "bg-emerald-500/5"
    : "";

  return (
    <div>
      <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
        Standings
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">#</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Team</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-500">P</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-500">W</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-500">D</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-500">L</th>
              <th className="text-center px-2 py-2 text-xs font-semibold text-slate-500 hidden sm:table-cell">GD</th>
              <th className="text-center px-3 py-2 text-xs font-semibold text-slate-500">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr
                key={s.team}
                className={`border-b border-slate-800/50 last:border-0 transition-colors ${
                  s.team === teamName ? "bg-emerald-500/10" : "hover:bg-slate-800/30"
                }`}
              >
                <td className="px-3 py-2 font-medium text-slate-400">{s.position}</td>
                <td className="px-3 py-2 font-medium text-slate-200">{s.team}</td>
                <td className="text-center px-2 py-2 tabular-nums text-slate-400">{s.played}</td>
                <td className="text-center px-2 py-2 tabular-nums text-emerald-400">{s.won}</td>
                <td className="text-center px-2 py-2 tabular-nums text-slate-400">{s.drawn}</td>
                <td className="text-center px-2 py-2 tabular-nums text-red-400">{s.lost}</td>
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
