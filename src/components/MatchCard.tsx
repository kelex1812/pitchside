"use client";

import { convertToUserTimeShort, convertToUserDate } from "@/lib/time";
import { isLive } from "@/lib/time";
import type { Match, Team } from "@/data/types";

interface MatchCardProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
  showCompetition?: boolean;
  compact?: boolean;
  userTimezone?: string;
  onClick?: (match: Match) => void;
}

export default function MatchCard({
  match,
  homeTeam,
  awayTeam,
  showCompetition = false,
  compact = false,
  userTimezone = "UTC",
  onClick,
}: MatchCardProps) {
  const live = isLive(match);
  const kickoff = match.kickoff ?? match.date;
  const timeStr = convertToUserTimeShort(kickoff, userTimezone);
  const dateStr = convertToUserDate(kickoff, userTimezone);

  const homeColor = homeTeam?.primaryColor || "#10b981";
  const awayColor = awayTeam?.primaryColor || "#6366f1";
  const homeFlag = homeTeam?.flag;
  const awayFlag = awayTeam?.flag;
  const homeName = homeTeam?.name || match.homeTeamName || "TBD";
  const awayName = awayTeam?.name || match.awayTeamName || "TBD";

  const card = (
    <div
      className={`rounded-xl border transition-all cursor-pointer ${
        live
          ? "border-red-500/30 shadow-sm shadow-red-500/10 bg-red-500/5"
          : match.status === "completed"
            ? "border-slate-800/80 bg-slate-900/40"
            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
      }`}
      onClick={() => onClick?.(match)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick(match) : undefined}
    >
      {/* Competition label */}
      {showCompetition && match.competition && (
        <div className={`px-4 py-2 border-b border-slate-800 ${compact ? "" : "mb-3"}`}>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            {match.competition}
          </span>
        </div>
      )}

      <div className={compact ? "px-4 py-3" : "px-4 py-4"}>
        {/* Header: date + status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{dateStr}</span>
            {live && (
              <span className="text-xs font-bold text-red-400 animate-pulse">LIVE</span>
            )}
          </div>
          <span className="text-xs text-slate-400 tabular-nums">{timeStr}</span>
        </div>

        {/* Teams */}
        <div className="flex items-center gap-3">
          {/* Home Team */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div
              className="w-1 h-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: homeColor }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {homeFlag && <span className="text-base leading-none">{homeFlag}</span>}
                <span
                  className={`text-sm font-medium truncate ${
                    live ? "text-white" : "text-slate-300"
                  }`}
                >
                  {homeName}
                </span>
              </div>
            </div>
          </div>

          {/* Score / Time */}
          <div className="flex-shrink-0 text-center">
            {match.status === "completed" && match.homeScore !== null && match.awayScore !== null ? (
              <div className="text-lg font-bold text-white tabular-nums tracking-tight">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : match.status === "live" ? (
              <div className="text-sm font-bold text-red-400 tabular-nums">
                {match.homeScore ?? 0}-{match.awayScore ?? 0}
              </div>
            ) : (
              <div className={`text-sm text-slate-400 tabular-nums ${compact ? "text-xs" : ""}`}>
                {timeStr}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
            <div className="flex-1 min-w-0 text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span
                  className={`text-sm font-medium truncate ${
                    live ? "text-white" : "text-slate-300"
                  }`}
                >
                  {awayName}
                </span>
                {awayFlag && <span className="text-base leading-none">{awayFlag}</span>}
              </div>
            </div>
            <div
              className="w-1 h-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: awayColor }}
            />
          </div>
        </div>

        {/* Venue */}
        {match.venue && (
          <p className="text-xs text-slate-400 mt-2 truncate">{match.venue}</p>
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
