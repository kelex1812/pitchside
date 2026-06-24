import { useState } from "react";
import Image from "next/image";
import CountdownRing from "./CountdownRing";
import StandingsTable from "./StandingsTable";
import NewsFeed from "./NewsFeed";
import FollowButton from "./FollowButton";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    shortName: string;
    leagueName?: string;
    crestUrl?: string;
    primaryColor?: string;
    flag?: string;
    group?: string;
    nextMatch?: {
      date: string;
      opponent?: string;
      venue: string;
      isHome: boolean;
      status: "upcoming" | "completed";
    };
    recentResults?: {
      date: string;
      opponent?: string;
      venue: string;
      isHome: boolean;
      score?: { home: number; away: number };
      status: "upcoming" | "completed";
    }[];
    standings?: {
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
    news?: {
      title: string;
      source: string;
      url: string;
      publishedAt: string;
    }[];
  };
  href?: string;
}

export default function TeamCard({ team, href }: TeamCardProps) {
  const [showStandings, setShowStandings] = useState(true);
  const LinkComponent = (href ? "a" : "div") as React.ElementType;
  const tagProps = href ? { href, className: "block focus:outline-none" } : {};

  const date = team.nextMatch?.date ? new Date(team.nextMatch.date) : undefined;
  const now = new Date();
  const diffMs = date && date.getTime() - now.getTime();
  const isLive = diffMs !== undefined && diffMs > 0 && diffMs < 5 * 60 * 1000;
  const isUpcoming = diffMs !== undefined && diffMs > 5 * 60 * 1000;
  const days = date ? Math.floor(Math.abs(diffMs || 0) / (1000 * 60 * 60 * 24)) : 0;
  const hours = date ? Math.floor((Math.abs(diffMs || 0) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0;
  const formattedDate = date?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <LinkComponent
      {...(tagProps as any)}
      className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all hover:border-slate-700"
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: team.primaryColor || "#10b981",
      }}
      role="region"
      aria-label={`${team.name} dashboard`}
    >
      {/* Team Header */}
      <div className="px-6 py-5 flex items-center gap-4">
        <div className="relative w-14 h-14 flex-shrink-0">
          {team.crestUrl ? (
            <Image
              src={team.crestUrl}
              alt={`${team.name} crest`}
              width={56}
              height={56}
              className="rounded-lg object-contain"
              unoptimized
            />
          ) : (
            <span className="text-4xl">{team.flag || "\u26BD"}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white truncate">{team.name}</h2>
          <p className="text-sm text-slate-400">
            {team.leagueName || `World Cup 2026${team.group ? ` · Group ${team.group}` : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FollowButton teamId={team.id} />
          <button
            onClick={() => setShowStandings(!showStandings)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              showStandings
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
            }`}
            aria-expanded={showStandings}
            aria-controls={`standings-${team.id}`}
          >
            {showStandings ? "Hide Standings" : "Show Standings"}
          </button>
        </div>
      </div>

      {/* Next Match Countdown */}
      <div className="px-6 pb-5">
        {team.nextMatch ? (
          <NextMatch match={team.nextMatch} teamColor={team.primaryColor} isUpcoming={isUpcoming} isLive={isLive} days={days} hours={hours} formattedDate={formattedDate} />
        ) : (
          <p className="text-sm text-slate-500 italic">Schedule data not available.</p>
        )}
      </div>

      {/* Recent Results */}
      <div className="px-6 pb-5">
        <RecentResults results={team.recentResults} />
      </div>

      {/* Standings */}
      {showStandings && team.standings && team.standings.length > 0 && (
        <div className="px-6 pb-5" id={`standings-${team.id}`}>
          <StandingsTable standings={team.standings} teamName={team.name} />
        </div>
      )}

      {/* News Feed */}
      {team.news && team.news.length > 0 && (
        <div className="px-6 pb-6 border-t border-slate-800">
          <NewsFeed news={team.news} />
        </div>
      )}
    </LinkComponent>
  );
}

function NextMatch({
  match,
  teamColor,
  isLive,
  isUpcoming,
  days,
  hours,
  formattedDate,
}: {
  match: {
    date: string;
    opponent?: string;
    venue: string;
    isHome: boolean;
    status: "upcoming" | "completed";
  };
  teamColor?: string;
  isLive: boolean;
  isUpcoming: boolean;
  days: number;
  hours: number;
  formattedDate: string | undefined;
}) {
  const diffMs = new Date(match.date).getTime() - new Date().getTime();
  const concluded = !isLive && !isUpcoming;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        {isLive ? (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white bg-red-500 animate-pulse"
            role="status"
            aria-label="Match is currently live"
          >
            LIVE
          </div>
        ) : isUpcoming ? (
          <CountdownRing days={days} hours={hours} teamColor={teamColor} />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-800"
            aria-label="Match has already concluded"
          >
            {diffMs > 0 ? "UP" : "FT"}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Next Match</p>
        <p className="text-lg font-semibold text-white mt-0.5">
          vs {match.opponent || "TBD"}
          <span className="text-slate-400 font-normal text-sm ml-2">
            {match.isHome ? "H" : "A"}
          </span>
        </p>
        <p className="text-sm text-slate-400">{formattedDate}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{match.venue}</p>
      </div>
    </div>
  );
}

function RecentResults({
  results,
}: {
  results?: {
    date: string;
    opponent?: string;
    venue: string;
    isHome: boolean;
    score?: { home: number; away: number };
    status: "upcoming" | "completed";
  }[];
}) {
  if (!results || results.length === 0) {
    return (
      <div>
        <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
          Recent Results
        </h3>
        <p className="text-sm text-slate-500 italic">No recent results to display.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
        Recent Results
      </h3>
      <div className="space-y-2">
        {results.map((match, i) => {
          const score = match.score;
          if (!score) {
            return (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-400">?</span>
                  <span className="text-sm text-slate-300">
                    {match.opponent}
                    <span className="text-slate-500 ml-1">({match.isHome ? "H" : "A"})</span>
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(match.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            );
          }

          const resultColor = match.isHome
            ? score.home > score.away
              ? "text-emerald-400"
              : score.home === score.away
                ? "text-amber-400"
                : "text-red-400"
            : score.away > score.home
              ? "text-emerald-400"
              : score.home === score.away
                ? "text-amber-400"
                : "text-red-400";
          const result = match.isHome
            ? score.home > score.away
              ? "W"
              : score.home === score.away
                ? "D"
                : "L"
            : score.away > score.home
              ? "W"
              : score.home === score.away
                ? "D"
                : "L";

          return (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  result === "W" ? "bg-emerald-500/10 text-emerald-400" : result === "D" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                }`} aria-label={`Result: ${result}`}>
                  {result}
                </span>
                <span className="text-sm text-slate-300">
                  {match.opponent}
                  <span className="text-slate-500 ml-1">({match.isHome ? "H" : "A"})</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${resultColor}`} aria-label={`Score: ${score.home} - ${score.away}`}>
                  {score.home} - {score.away}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(match.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
