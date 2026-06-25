// src/components/KnockoutBracketView.tsx — Interactive knockout bracket component
"use client";

import { useCallback, useEffect, useRef } from "react";
import type { KnockoutBracket, KnockoutMatch } from "@/data/types";
import EmptyState from "./EmptyState";

interface KnockoutBracketViewProps {
  bracket: KnockoutBracket | null;
}

// Get round name abbreviation
function getRoundName(roundOrder: number): string {
  switch (roundOrder) {
    case 1: return "R32";
    case 2: return "R16";
    case 3: return "QF";
    case 4: return "SF";
    case 5: return "FINAL";
    default: return `R${roundOrder}`;
  }
}

// Get full round name for display
function getRoundDisplayName(roundOrder: number): string {
  switch (roundOrder) {
    case 1: return "Round of 32";
    case 2: return "Round of 16";
    case 3: return "Quarter-finals";
    case 4: return "Semi-finals";
    case 5: return "Final";
    default: return `Round ${roundOrder}`;
  }
}

// Group matches by round
function groupByRound(bracket: KnockoutBracket): Map<number, KnockoutMatch[]> {
  const roundMap = new Map<number, KnockoutMatch[]>();
  for (const match of bracket) {
    const existing = roundMap.get(match.roundOrder) || [];
    existing.push(match);
    roundMap.set(match.roundOrder, existing);
  }
  return roundMap;
}

export default function KnockoutBracketView({ bracket }: KnockoutBracketViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!bracket || bracket.length === 0) {
    return <EmptyState.Fixtures />;
  }

  const rounds = groupByRound(bracket);
  const sortedRounds = Array.from(rounds.entries()).sort(([a], [b]) => a - b);

  // Allow horizontal scroll on mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="overflow-x-auto pb-4 sm:pb-0" ref={containerRef} role="region" aria-label="Knockout bracket" tabIndex={0}>
      <div className="min-w-[600px] sm:min-w-0 space-y-6 sm:space-y-8">
        {sortedRounds.map(([order, matches]) => (
          <section key={order}>
            {/* Round header */}
            <h3 className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-medium mb-3 sm:mb-4">
              {getRoundDisplayName(order)}
            </h3>

            {/* Matches with connecting lines */}
            <div className="space-y-2 sm:space-y-3">
              {matches.map((match, idx) => {
                const nextMatch = bracket.find(
                  (m) => m.id === match.nextMatchId
                );

                return (
                  <div
                    key={match.id}
                    className={`rounded-xl border p-3 sm:p-4 transition-all relative ${
                      match.winner
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    {/* Teams */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Home Team */}
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <div
                          className="w-0.5 h-6 sm:h-8 rounded-full flex-shrink-0"
                          style={{ backgroundColor: match.winner === match.homeTeam ? "#10b981" : "#334155" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {match.homeTeamFlag && <span className="text-base leading-none">{match.homeTeamFlag}</span>}
                            <span
                              className={`text-sm sm:text-base font-medium truncate ${
                                match.winner === match.homeTeam ? "text-emerald-400 font-bold" : "text-slate-300"
                              }`}
                            >
                              {match.homeTeam || "TBD"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score / VS */}
                      <div className="flex-shrink-0 text-center px-2">
                        {match.homeScore !== null && match.awayScore !== null ? (
                          <div className="text-sm sm:text-base font-bold text-white tabular-nums tracking-tight">
                            {match.homeScore} - {match.awayScore}
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm text-slate-400">vs</span>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
                        <div className="flex-1 min-w-0 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span
                              className={`text-sm sm:text-base font-medium truncate ${
                                match.winner === match.awayTeam ? "text-emerald-400 font-bold" : "text-slate-300"
                              }`}
                            >
                              {match.awayTeam || "TBD"}
                            </span>
                            {match.awayTeamFlag && <span className="text-base leading-none">{match.awayTeamFlag}</span>}
                          </div>
                        </div>
                        <div
                          className="w-0.5 h-6 sm:h-8 rounded-full flex-shrink-0"
                          style={{ backgroundColor: match.winner === match.awayTeam ? "#10b981" : "#334155" }}
                        />
                      </div>
                    </div>

                    {/* Meta info */}
                    {(match.date || match.venue) && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs text-slate-400">
                        {match.date && <span>{new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>}
                        {match.venue && <span className="truncate">{match.venue}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
