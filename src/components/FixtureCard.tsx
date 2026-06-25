"use client";

import Link from "next/link";
import { convertToUserTimeShort, convertToUserDate } from "@/lib/time";
import type { Match } from "@/data/types";

interface FixtureCardProps {
  match: Match;
  userTimezone?: string;
  onClick?: (match: Match) => void;
}

export default function FixtureCard({ match, userTimezone = "UTC", onClick }: FixtureCardProps) {
  const kickoff = match.kickoff ?? match.date;
  const timeStr = convertToUserTimeShort(kickoff, userTimezone);
  const dateStr = convertToUserDate(kickoff, userTimezone);

  const homeName = match.homeTeamName || "TBD";
  const awayName = match.awayTeamName || "TBD";

  const card = (
    <div
      className={`rounded-xl border transition-all cursor-pointer ${
        match.status === "completed"
          ? "border-slate-800/80 bg-slate-900/40"
          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
      }`}
      onClick={() => onClick?.(match)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick(match) : undefined}
    >
      <div className="px-4 py-4">
        {/* Header: matchday + competition */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {match.matchday && (
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs font-medium rounded">
                MD {match.matchday}
              </span>
            )}
            {match.group && (
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded">
                {match.group}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">{dateStr}</span>
        </div>

        {/* Teams and score */}
        <div className="flex items-center gap-3">
          {/* Home Team */}
          <div className="flex-1 flex items-center gap-2">
            <span
              className={`text-sm font-medium truncate ${
                match.status === "completed" && match.homeScore !== null && match.homeScore > (match.awayScore ?? 0)
                  ? "text-white font-bold"
                  : "text-slate-300"
              }`}
            >
              {homeName}
            </span>
          </div>

          {/* Score / Time */}
          <div className="flex-shrink-0 text-center">
            {match.status === "completed" && match.homeScore !== null && match.awayScore !== null ? (
              <div className="text-lg font-bold text-white tabular-nums tracking-tight">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="text-sm text-slate-400 tabular-nums">{timeStr}</div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <span
              className={`text-sm font-medium truncate text-right ${
                match.status === "completed" && match.awayScore !== null && match.awayScore > (match.homeScore ?? 0)
                  ? "text-white font-bold"
                  : "text-slate-300"
              }`}
            >
              {awayName}
            </span>
          </div>
        </div>

        {/* Venue */}
        {match.venue && (
          <p className="text-xs text-slate-400 mt-2 truncate">{match.venue}</p>
        )}

        {/* Competition */}
        {match.competition && (
          <p className="text-xs text-slate-400 mt-1 truncate">{match.competition}</p>
        )}
      </div>
    </div>
  );

  return onClick ? (
    <div onClick={(e) => e.stopPropagation()}>{card}</div>
  ) : (
    card
  );
}
