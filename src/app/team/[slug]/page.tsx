import { Team, allTeams } from "@/data/teams";
import { notFound } from "next/navigation";

export default async function TeamDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team: Team | undefined = allTeams.find((t) => t.slug === slug);
  if (!team) notFound();

  const upcomingMatches = (team.schedule || []).filter((m) => m.status === "upcoming");
  const recentResults = (team.recentResults || []).filter((m) => m.status === "completed" && m.score).slice(0, 5);
  const allMatches = [...upcomingMatches, ...recentResults].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-4 block">
            &larr; Back to Dashboard
          </a>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              {team.crestUrl ? (
                <img
                  src={team.crestUrl}
                  alt={`${team.name} crest`}
                  width={64}
                  height={64}
                  className="rounded-lg object-contain"
                  style={{ width: "64px", height: "64px" }}
                />
              ) : (
                <span className="text-5xl">{team.flag || "\u26BD"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white truncate">{team.name}</h1>
              <p className="text-sm text-slate-400">
                {team.leagueName || `World Cup 2026${team.group ? ` · Group ${team.group}` : ""}`}
                {team.fifaRank && ` · FIFA Rank #${team.fifaRank}`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Match */}
            {team.nextMatch && (
              <NextMatchCard match={team.nextMatch} teamColor={team.primaryColor} />
            )}

            {/* Schedule */}
            {allMatches.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">
                  {upcomingMatches.length > 0
                    ? `Schedule (${allMatches.length} matches)`
                    : "Recent Results"}
                </h2>
                <div className="space-y-3">
                  {allMatches.map((match) => (
                    <MatchRow key={match.date} match={match} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Standings */}
            {team.standings && team.standings.length > 0 && (
              <StandingsCard standings={team.standings} teamName={team.name} />
            )}

            {/* News */}
            {team.news && team.news.length > 0 && (
              <NewsCard news={team.news} />
            )}

            {/* Stats */}
            <StatsCard team={team} />
          </div>
        </div>
      </div>
    </main>
  );
}

function NextMatchCard({
  match,
  teamColor,
}: {
  match: {
    date: string;
    opponent?: string;
    venue: string;
    isHome: boolean;
    status: "upcoming" | "completed";
  };
  teamColor?: string;
}) {
  const diffMs = new Date(match.date).getTime() - new Date().getTime();
  const isLive = diffMs > 0 && diffMs < 5 * 60 * 1000;
  const days = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((Math.abs(diffMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
        Next Match
      </p>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {isLive ? (
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white bg-red-500 animate-pulse">
              LIVE
            </div>
          ) : diffMs > 0 ? (
            <CountdownRing days={days} hours={hours} teamColor={teamColor} />
          ) : (
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-800">
              FT
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xl font-bold text-white">
            vs {match.opponent || "TBD"}
            <span className="text-slate-400 font-normal text-sm ml-2">
              {match.isHome ? "H" : "A"}
            </span>
          </p>
          <p className="text-sm text-slate-400">
            {new Date(match.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-slate-500 mt-1">{match.venue}</p>
        </div>
      </div>
    </div>
  );
}

import CountdownRing from "@/components/CountdownRing";

function MatchRow({
  match,
}: {
  match: {
    date: string;
    opponent?: string;
    venue: string;
    isHome: boolean;
    score?: { home: number; away: number };
    status: "upcoming" | "completed";
    stage?: string;
    group?: string;
  };
}) {
  const isUpcoming = match.status === "upcoming";
  const date = new Date(match.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const resultColor =
    match.score && match.score.home !== undefined ? (
      match.isHome ? (
        match.score.home > match.score.away ? (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">W</span>
        ) : match.score.home === match.score.away ? (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">D</span>
        ) : (
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400">L</span>
        )
      ) : match.score.away > match.score.home ? (
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">W</span>
      ) : match.score.home === match.score.away ? (
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">D</span>
      ) : (
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400">L</span>
      )
    ) : null;

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-all hover:bg-slate-900/60 ${isUpcoming ? "" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {resultColor}
          <span className={`font-medium truncate ${isUpcoming ? "text-white" : "text-slate-300"}`}>
            vs {match.opponent || "TBD"}
            <span className="text-slate-500 ml-1 text-sm">({match.isHome ? "H" : "A"})</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {match.stage && (
            <span className="text-xs text-slate-500 hidden sm:inline">{match.stage}</span>
          )}
          {match.score ? (
            <span className="text-sm font-bold text-white tabular-nums">
              {match.score.home} - {match.score.away}
            </span>
          ) : isUpcoming ? (
            <span className="text-sm text-slate-400">{formattedTime}</span>
          ) : null}
          <span className="text-xs text-slate-500 hidden sm:inline">{formattedDate}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2 truncate">{match.venue}</p>
    </div>
  );
}

function StandingsCard({
  standings,
  teamName,
}: {
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
  teamName: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Standings
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left px-2 py-1.5 text-xs font-medium text-slate-500">#</th>
            <th className="text-left px-2 py-1.5 text-xs font-medium text-slate-500">Team</th>
            <th className="text-center px-2 py-1.5 text-xs font-medium text-slate-500">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => (
            <tr
              key={s.team}
              className={`border-b border-slate-800/50 last:border-0 ${
                s.team === teamName ? "bg-emerald-500/10" : ""
              }`}
            >
              <td className="px-2 py-2 text-slate-500">{s.position}</td>
              <td className={`px-2 py-2 font-medium ${s.team === teamName ? "text-emerald-400" : "text-slate-300"}`}>
                {s.team}
              </td>
              <td className="text-center px-2 py-2 font-bold text-slate-200">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewsCard({
  news,
}: {
  news: {
    title: string;
    source: string;
    url: string;
    publishedAt: string;
  }[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Latest News
      </h2>
      <ul className="space-y-3">
        {news.map((item, i) => (
          <li key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
            >
              <p className="text-sm text-slate-300 group-hover:text-white transition-colors leading-snug">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-emerald-400">{item.source}</span>
                <span className="text-xs text-slate-600">{item.publishedAt}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsCard({ team }: { team: { nextMatch?: { date: string }; schedule?: { status: string }[]; recentResults?: { score?: any; status: string; isHome?: boolean }[] } }) {
  const upcoming = (team.schedule || []).filter((m) => m.status === "upcoming").length;
  const completed = (team.recentResults || []).filter((m) => m.status === "completed").length;
  const wins = (team.recentResults || []).filter((m) => m.score && m.score.home !== undefined && ((m.isHome && m.score.home > m.score.away) || (!m.isHome && m.score.away > m.score.home))).length;
  const losses = (team.recentResults || []).filter((m) => m.score && m.score.home !== undefined && ((m.isHome && m.score.home < m.score.away) || (!m.isHome && m.score.away < m.score.home))).length;
  const draws = (team.recentResults || []).filter((m) => m.score && m.score.home !== undefined && m.score.home === m.score.away).length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Stats
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-white">{completed}</p>
          <p className="text-xs text-slate-500">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{upcoming}</p>
          <p className="text-xs text-slate-500">Upcoming</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-400">{wins}</p>
          <p className="text-xs text-slate-500">Wins</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-400">{losses}</p>
          <p className="text-xs text-slate-500">Losses</p>
        </div>
      </div>
      {draws > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xl font-bold text-amber-400">{draws}</p>
              <p className="text-xs text-slate-500">Draws</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
