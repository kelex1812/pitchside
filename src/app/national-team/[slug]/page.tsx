// src/app/national-team/[slug]/page.tsx — National Team Detail
import type { Metadata } from "next";
import { getTeamBySlug, allTeams } from "@/data/teams";
import { notFound } from "next/navigation";
import NationalTeamHeader from "@/components/NationalTeamHeader";
import InternationalMatchFeed from "@/components/InternationalMatchFeed";
import EmptyState from "@/components/EmptyState";
import type { Match, Team } from "@/data/types";

export async function generateStaticParams() {
  return allTeams.filter((t) => t.type === "national").map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return { title: "Team Not Found" };
  return {
    title: `${team.name} — International | Pitchside`,
    description: `${team.name} international team: matches, tournaments, and squad.`,
    openGraph: {
      title: `${team.name} — International | Pitchside`,
      description: `${team.name} international matches and tournaments.`,
    },
    twitter: {
      title: `${team.name} — International | Pitchside`,
      description: `${team.name} international matches and tournaments.`,
    },
  };
}

export default async function NationalTeamDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team: Team | undefined = getTeamBySlug(slug);
  if (!team) notFound();

  // Collect all international matches from team's schedule
  const internationalMatches: Match[] = (team.schedule || []).filter(
    (m: Partial<Match>) => m.competitionType && !["la-liga", "premier-league", "serie-a", "bundesliga", "ligue-1", "mls", "usl-l1"].includes(m.competitionType as string)
  ) as unknown as Match[];

  // Also check all teams for matches involving this team with international competitionType
  const crossMatches: Match[] = [];
  for (const otherTeam of allTeams) {
    if (otherTeam.slug === team.slug) continue;
    for (const match of (otherTeam.schedule || [])) {
      const isHome = match.homeTeamId === team.id;
      const isAway = match.awayTeamId === team.id;
      if (isHome || isAway) {
        const compType = match.competitionType;
        if (compType && !["la-liga", "premier-league", "serie-a", "bundesliga", "ligue-1", "mls", "usl-l1"].includes(compType)) {
          crossMatches.push(match as unknown as Match);
        }
      }
    }
  }

  // Deduplicate
  const allMatches = [...internationalMatches, ...crossMatches].filter((m, i, a) =>
    a.findIndex((x) => x.id === m.id) === i
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <NationalTeamHeader team={team} />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Caps/Goals Stats Row */}
        {(team.caps !== undefined || team.goals !== undefined) && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {team.caps !== undefined && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-white">{team.caps}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Caps</p>
              </div>
            )}
            {team.goals !== undefined && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-emerald-400">{team.goals}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Goals</p>
              </div>
            )}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-cyan-400">{team.fifaRank || "—"}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">FIFA Rank</p>
            </div>
          </div>
        )}

        {/* Match Feed */}
        {allMatches.length > 0 ? (
          <InternationalMatchFeed matches={allMatches} />
        ) : (
          <EmptyState.NoMatches />
        )}
      </div>
    </>
  );
}
