"use client";

import type { TeamRoster, TeamRosterEntry } from "@/data/types";

interface TeamRosterTableProps {
  roster: TeamRoster;
}

// Group roster entries by position
function groupByPosition(entries: TeamRosterEntry[]): Record<string, TeamRosterEntry[]> {
  const groups: Record<string, TeamRosterEntry[]> = {};
  const order = ["GK", "DF", "MF", "FW"];

  for (const entry of entries) {
    if (!groups[entry.position]) {
      groups[entry.position] = [];
    }
    groups[entry.position].push(entry);
  }

  // Sort within each group by squad number
  for (const pos of Object.keys(groups)) {
    groups[pos].sort((a, b) => a.squadNumber - b.squadNumber);
  }

  return groups;
}

const POSITION_LABELS: Record<string, string> = {
  GK: "Goalkeepers",
  DF: "Defenders",
  MF: "Midfielders",
  FW: "Forwards",
};

export default function TeamRosterTable({ roster }: TeamRosterTableProps) {
  const groups = groupByPosition(roster.entries);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-400 w-16">#</th>
            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-400">Player</th>
            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-400 w-28">Position</th>
            <th className="text-center px-3 py-2 text-xs font-semibold text-slate-400 hidden sm:table-cell">Apps</th>
            <th className="text-center px-3 py-2 text-xs font-semibold text-slate-400 hidden sm:table-cell">Goals</th>
            <th className="text-center px-3 py-2 text-xs font-semibold text-slate-400 hidden sm:table-cell">Assists</th>
          </tr>
        </thead>
        <tbody>
          {["GK", "DF", "MF", "FW"].map((position) => {
            const entries = groups[position];
            if (!entries || entries.length === 0) return null;

            return (
              <div key={position}>
                {/* Position header */}
                <tr className="border-b border-slate-800/50">
                  <td colSpan={6} className="px-4 py-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {POSITION_LABELS[position] || position}
                    </span>
                  </td>
                </tr>

                {/* Player rows */}
                {entries.map((entry) => (
                  <tr
                    key={entry.playerId}
                    className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-4 py-2.5 tabular-nums text-slate-400">
                      {entry.squadNumber}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-white">
                      {entry.playerName}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded font-medium">
                        {entry.position}
                      </span>
                    </td>
                    <td className="text-center px-3 py-2.5 tabular-nums text-slate-400 hidden sm:table-cell">
                      {entry.appearances ?? "-"}
                    </td>
                    <td className="text-center px-3 py-2.5 tabular-nums text-emerald-400 hidden sm:table-cell">
                      {entry.goals ?? "-"}
                    </td>
                    <td className="text-center px-3 py-2.5 tabular-nums text-cyan-400 hidden sm:table-cell">
                      {entry.assists ?? "-"}
                    </td>
                  </tr>
                ))}
              </div>
            );
          })}
        </tbody>
      </table>

      {/* No data state */}
      {roster.entries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No roster data available.</p>
        </div>
      )}
    </div>
  );
}
