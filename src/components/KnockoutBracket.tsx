// src/components/KnockoutBracket.tsx — World Cup knockout bracket display
import type { KnockoutMatch } from "@/data/types";

interface KnockoutBracketProps {
  rounds: KnockoutMatch[];
}

export default function KnockoutBracket({ rounds }: KnockoutBracketProps) {
  if (rounds.length === 0) {
    return null;
  }

  // Group matches by round
  const roundsMap = new Map<number, KnockoutMatch[]>();
  for (const match of rounds) {
    const existing = roundsMap.get(match.roundOrder) || [];
    existing.push(match);
    roundsMap.set(match.roundOrder, existing);
  }

  const roundOrders = Array.from(roundsMap.keys()).sort();

  const getRoundLabel = (order: number) => {
    switch (order) {
      case 1: return "Round of 32";
      case 2: return "Round of 16";
      case 3: return "Quarter-finals";
      case 4: return "Semi-finals";
      case 5: return "Final";
      default: return `Round ${order}`;
    }
  };

  return (
    <section className="space-y-6 sm:space-y-8" aria-label="Knockout Bracket">
      {roundOrders.map((order) => (
        <div key={order}>
          <h3 className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-medium mb-3 sm:mb-4">
            {getRoundLabel(order)}
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {roundsMap.get(order)?.map((match) => (
              <div
                key={match.id}
                className={`rounded-xl border p-3 sm:p-4 transition-all ${
                  match.winner
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-slate-800 bg-slate-900/40"
                }`}
              >
                {/* Teams */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Home Team */}
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className={`text-sm sm:text-base font-medium truncate ${
                      match.winner === match.homeTeam ? "text-emerald-400 font-bold" : "text-slate-300"
                    }`}>
                      {match.homeTeam || "TBD"}
                    </span>
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
                    <span className={`text-sm sm:text-base font-medium truncate text-right ${
                      match.winner === match.awayTeam ? "text-emerald-400 font-bold" : "text-slate-300"
                    }`}>
                      {match.awayTeam || "TBD"}
                    </span>
                  </div>
                </div>

                {/* Meta info */}
                {(match.date || match.venue) && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs text-slate-400">
                    {match.date && <span>{new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
                    {match.venue && <span className="truncate">{match.venue}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
