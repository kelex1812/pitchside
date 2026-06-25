// src/app/team/[slug]/page.tsx — Team Detail with League Badge & International Tab (Epic 3 + 4)
import type { Metadata } from "next";
import { getLeagueBySlug, leagues } from "@/data/leagues";
import { getTeamBySlug, allTeams } from "@/data/teams";
import { notFound } from "next/navigation";
import CountdownRing from "@/components/CountdownRing";
import FollowButton from "@/components/FollowButton";
import MatchCard from "@/components/MatchCard";
import EmptyState from "@/components/EmptyState";
import type { Team, Match, PartialMatch } from "@/data/types";

interface TeamDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allTeams.map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: TeamDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return { title: "Team Not Found" };
  return {
    title: `${team.name} | Pitchside`,
    description: `${team.name} — ${team.leagueName || team.league}${team.fifaRank ? `, FIFA Rank #${team.fifaRank}` : ""}`,
    openGraph: {
      title: `${team.name} | Pitchside`,
      description: `${team.name} club and international matches, standings, and news.`,
    },
    twitter: {
      title: `${team.name} | Pitchside`,
      description: `${team.name} — club and international matches.`,
    },
  };
}

// League badge client component (needs useState for loading state)
function LeagueBadge({ league }: { league: { name: string; logoUrl?: string; slug: string } }) {
  return (
    <a
      href={`/league/${league.slug}`}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-colors group"
    >
      {league.logoUrl && (
        <img
          src={league.logoUrl}
          alt={league.name}
          className="w-5 h-5 object-contain"
          loading="lazy"
        />
      )}
      <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{league.name}</span>
    </a>
  );
}

export default async function TeamDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team: Team | undefined = getTeamBySlug(slug);
  if (!team) notFound();

  // Look up league from leagueId (club teams) or league field
  let league: { name: string; logoUrl?: string; slug: string } | undefined;
  if (team.leagueName) {
    // Find the league by slug from the leagues data
    const leagueData = leagues.find((l) => l.slug === team.league || l.name === team.leagueName);
    if (leagueData) {
      league = {
        name: leagueData.name,
        logoUrl: leagueData.logoUrl,
        slug: leagueData.slug,
      };
    }
  }

  // Separate upcoming and recent matches
  const upcomingMatches = (team.schedule || []).filter((m: any) => m.status === "upcoming");
  const recentResults = (team.recentResults || []).filter(
    (m: any) => m.status === "completed" && (m.homeScore !== null || m.score !== undefined)
  );

  // Collect international matches (matches with international competition types)
  const internationalMatches: Match[] = [];
  for (const match of [...(team.schedule || []), ...(team.recentResults || [])]) {
    const compType = match.competitionType;
    if (compType && !["la-liga", "premier-league", "serie-a", "bundesliga", "ligue-1", "mls", "usl-l1"].includes(compType)) {
      internationalMatches.push(match as unknown as Match);
    }
    // Also check schedule from other teams for this team's involvement
    if (match.homeTeamId === team.id || match.awayTeamId === team.id) {
      const alreadyHas = internationalMatches.some((m) => m.id === match.id);
      if (!alreadyHas && compType && !["la-liga", "premier-league", "serie-a", "bundesliga", "ligue-1", "mls", "usl-l1"].includes(compType)) {
        internationalMatches.push(match as unknown as Match);
      }
    }
  }
  internationalMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Determine tabs based on available data
  const hasLeague = !!league;
  const hasInternational = internationalMatches.length > 0;

  return (
    <>
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-3 sm:mb-4 block min-h-[44px] flex items-center">
            ← Back to Dashboard
          </a>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
              {team.crestUrl ? (
                <img
                  src={team.crestUrl}
                  alt={`${team.name} crest`}
                  width={64}
                  height={64}
                  className="rounded-lg object-contain"
                  style={{ width: "64px", height: "64px" }}
                  loading="lazy"
                />
              ) : (
                <span className="text-4xl sm:text-5xl">{team.flag || "\u26BD"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{team.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
                {team.leagueName || team.league}
                {team.fifaRank ? ` · FIFA Rank #${team.fifaRank}` : ""}
                {team.group ? ` · Group ${team.group}` : ""}
              </p>
              {/* League Badge */}
              {hasLeague && league && (
                <div className="mt-1 sm:mt-2">
                  <LeagueBadge league={league} />
                </div>
              )}
            </div>
            {/* Follow Button */}
            <div className="flex-shrink-0">
              <FollowButton teamId={team.id} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Match */}
            {team.nextMatch && (
              <NextMatchCard
                match={team.nextMatch}
                teamName={team.name}
              />
            )}

            {/* Tabs */}
            {hasInternational ? (
              <TeamTabs
                hasLeague={hasLeague}
                hasInternational={hasInternational}
                upcomingMatches={upcomingMatches}
                recentResults={recentResults}
                internationalMatches={internationalMatches}
              />
            ) : (
              <>
                {/* Schedule */}
                {(upcomingMatches.length > 0 || recentResults.length > 0) ? (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">
                      {upcomingMatches.length > 0
                        ? `Schedule (${upcomingMatches.length} matches)`
                        : "Recent Results"}
                    </h2>
                    <div className="space-y-3">
                      {upcomingMatches.slice(0, 5).map((match: any, i: number) => (
                        <MatchRow key={`up-${i}`} match={match} isUpcoming />
                      ))}
                      {recentResults.slice(0, 5).map((match: any, i: number) => (
                        <MatchRow key={`rc-${i}`} match={match} isUpcoming={false} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState.NoMatches />
                )}
              </>
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
    </>
  );
}

// Next Match Card Component
function NextMatchCard({
  match,
  teamName,
}: {
  match: PartialMatch;
  teamName: string;
}) {
  const diffMs = match.date ? new Date(match.date).getTime() - new Date().getTime() : Infinity;
  const isLive = diffMs > 0 && diffMs < 5 * 60 * 1000;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 sm:px-6 sm:py-6">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
        Next Match
      </p>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          {isLive ? (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white bg-red-500 animate-pulse">
              LIVE
            </div>
          ) : diffMs > 0 ? (
            <CountdownRing
              match={{ kickoff: match.date ?? "", status: "upcoming" }}
              showLabel={false}
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-800">
              FT
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base sm:text-xl font-bold text-white truncate">
            vs {match.opponent || "TBD"}
            <span className="text-slate-400 font-normal text-xs sm:text-sm ml-2">
              {match.isHome ? "H" : "A"}
            </span>
          </p>
          <p className="text-xs sm:text-sm text-slate-400">
            {new Date(match.date ?? "").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-slate-500 mt-1 truncate">{match.venue}</p>
        </div>
      </div>
    </div>
  );
}

// Tab component for team page (Club / International)
function TeamTabs({
  hasLeague,
  hasInternational,
  upcomingMatches,
  recentResults,
  internationalMatches,
}: {
  hasLeague: boolean;
  hasInternational: boolean;
  upcomingMatches: any[];
  recentResults: any[];
  internationalMatches: Match[];
}) {
  const hasClubMatches = upcomingMatches.length > 0 || recentResults.length > 0;

  return (
    <div>
      {/* Club matches */}
      {hasClubMatches ? (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            {hasLeague ? `${upcomingMatches.length > 0 ? "Club Schedule" : "Recent Results"}` : "Matches"}
          </h2>
          <div className="space-y-3">
            {upcomingMatches.slice(0, 3).map((match: any, i: number) => (
              <MatchRow key={`cl-${i}`} match={match} isUpcoming />
            ))}
            {recentResults.slice(0, 3).map((match: any, i: number) => (
              <MatchRow key={`rc-${i}`} match={match} isUpcoming={false} />
            ))}
          </div>
        </div>
      ) : null}

      {/* International matches */}
      {hasInternational && internationalMatches.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            International
          </h2>
          <div className="space-y-3">
            {internationalMatches.slice(0, 5).map((match: Match, i: number) => (
              <MatchCard key={match.id || i} match={match} showCompetition />
            ))}
          </div>
        </div>
      )}

      {/* No matches at all */}
      {!hasClubMatches && !hasInternational && (
        <EmptyState.NoMatches />
      )}
    </div>
  );
}

// Match Row Component
function MatchRow({
  match,
  isUpcoming,
}: {
  match: {
    date: string;
    opponent?: string;
    venue?: string;
    isHome?: boolean;
    score?: { home: number; away: number };
    status: "upcoming" | "completed";
    stage?: string;
    group?: string;
    competitionType?: string;
  };
  isUpcoming: boolean;
}) {
  const date = new Date(match.date ?? "");
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-3 sm:px-4 sm:py-4 transition-all hover:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {resultColor}
          <span className={`font-medium truncate text-sm sm:text-base ${isUpcoming ? "text-white" : "text-slate-300"}`}>
            vs {match.opponent || "TBD"}
            <span className="text-slate-500 ml-1 text-xs sm:text-sm">({match.isHome ? "H" : "A"})</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {match.stage && (
            <span className="text-xs text-slate-500 hidden sm:inline">{match.stage}</span>
          )}
          {match.score ? (
            <span className="text-sm font-bold text-white tabular-nums">
              {match.score.home} - {match.score.away}
            </span>
          ) : isUpcoming ? (
            <span className="text-xs sm:text-sm text-slate-400">{formattedTime}</span>
          ) : null}
          <span className="text-xs text-slate-500 hidden sm:inline">{formattedDate}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2 truncate">{match.venue}</p>
    </div>
  );
}

// Standings Card Component
function StandingsCard({
  standings,
  teamName,
}: {
  standings: { position: number; team: string; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; goalDifference: number; points: number }[];
  teamName: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 sm:px-6 sm:py-6">
      <h2 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
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

// News Card Component
function NewsCard({
  news,
}: {
  news: { title: string; source: string; url: string; publishedAt: string }[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 sm:px-6 sm:py-6">
      <h2 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Latest News
      </h2>
      <ul className="space-y-3">
        {news.map((item, i) => (
          <li key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-1"
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

// Stats Card Component
function StatsCard({ team }: { team: { schedule?: Partial<import("@/data/types").Match>[]; recentResults?: Partial<import("@/data/types").Match>[] } }) {
  const upcoming = (team.schedule || []).filter((m: any) => m.status === "upcoming").length;
  const completed = (team.recentResults || []).filter((m: any) => m.status === "completed").length;
  const wins = (team.recentResults || []).filter((m: any) => m.score && m.score.home !== undefined && ((m.isHome && m.score.home > m.score.away) || (!m.isHome && m.score.away > m.score.home))).length;
  const losses = (team.recentResults || []).filter((m: any) => m.score && m.score.home !== undefined && ((m.isHome && m.score.home < m.score.away) || (!m.isHome && m.score.away < m.score.home))).length;
  const draws = (team.recentResults || []).filter((m: any) => m.score && m.score.home !== undefined && m.score.home === m.score.away).length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 sm:px-6 sm:py-6">
      <h2 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Stats
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
