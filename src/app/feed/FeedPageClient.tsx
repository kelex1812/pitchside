// Feed Page Client Component
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFollowTeams } from "@/hooks/useFollowTeams";
import { allTeams } from "@/data/teams";
import { Team } from "@/data/types";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";

export default function FeedPageClient() {
  const { user, signIn } = useAuth();
  const { followedTeams, isLoading: loading } = useFollowTeams();
  const [notification, setNotification] = useState<string | null>(null);

  // Get followed teams with full data
  const followedTeamData: Team[] = followedTeams
    .map((ft) => allTeams.find((t) => t.id === ft.teamId || t.slug === ft.teamId))
    .filter((t): t is Team => !!t);

  // Sort by next match date
  const sortedTeams = [...followedTeamData].sort((a, b) => {
    if (!a.nextMatch && !b.nextMatch) return 0;
    if (!a.nextMatch) return 1;
    if (!b.nextMatch) return -1;
    return new Date(a.nextMatch.date ?? '').getTime() - new Date(b.nextMatch.date ?? '').getTime();
  });

  return (
    <>
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              My Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {sortedTeams.length} followed teams · Matches & updates
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center px-2">
              Home
            </Link>
            <Link href="/search" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center px-2">
              Search
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Auth notification */}
        {!user && notification !== null && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm" role="alert">
            {notification}
          </div>
        )}

        {/* Followed teams list */}
        <div aria-live="polite" role="status">
          {loading ? (
          <div className="space-y-4">
            <Skeleton.TeamCard />
            <Skeleton.TeamCard />
            <Skeleton.TeamCard />
          </div>
        ) : sortedTeams.length === 0 ? (
          <EmptyState
            title="No followed teams yet"
            description="Browse leagues to follow teams! Your personalized feed will show their matches and updates here."
            href="/leagues"
            ctaText="Browse Leagues"
            secondaryHref="/search"
            secondaryText="Search Teams"
          />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sortedTeams.map((team) => (
              <div
                key={team.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden hover:border-slate-700 transition-all"
                style={{
                  borderLeftWidth: "3px",
                  borderLeftColor: team.primaryColor || "#10b981",
                }}
              >
                {/* Team Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    {team.crestUrl ? (
                      <img
                        src={team.crestUrl}
                        alt={`${team.name} crest`}
                        width={48}
                        height={48}
                        className="rounded-lg object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl sm:text-3xl" role="img" aria-label={`${team.name} flag`}>
                        {team.flag || "⚽"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/team/${team.slug}`}>
                      <h3 className="text-base sm:text-lg font-bold text-white hover:text-emerald-400 transition-colors truncate">
                        {team.name}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {team.leagueName || `World Cup 2026${team.group ? ` · Group ${team.group}` : ""}`}
                    </p>
                  </div>
                </div>

                {/* Next Match */}
                {team.nextMatch && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex-shrink-0 text-xs sm:text-sm font-medium text-emerald-400">
                        NEXT
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-white">
                          vs {team.nextMatch.opponent || "TBD"}
                          <span className="text-slate-400 font-normal text-xs sm:text-sm ml-2">
                            {team.nextMatch.isHome ? "H" : "A"}
                          </span>
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400">
                          {team.nextMatch.date && new Date(team.nextMatch.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
