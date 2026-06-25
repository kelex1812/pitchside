"use client";

import { useAuth } from "@/hooks/useAuth";
import { useFollowTeams } from "@/hooks/useFollowTeams";
import { allTeams } from "@/data/teams";
import { Team } from "@/data/types";
import Link from "next/link";

export default function FollowedTeamsSection() {
  const { isAuthenticated } = useAuth();
  const { followedTeams, isLoading } = useFollowTeams();

  const followedTeamData: Team[] = followedTeams
    .map((ft) => allTeams.find((t) => t.id === ft.teamId || t.slug === ft.teamId))
    .filter((t): t is Team => !!t);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          Followed Teams
        </h2>
        {!isAuthenticated && (
          <Link href="/leagues" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            Browse Leagues →
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-slate-400">Loading...</div>
        </div>
      ) : followedTeamData.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400">
            {!isAuthenticated
              ? "Log in to follow teams and see their matches here."
              : "No followed teams yet."}
          </p>
          {!isAuthenticated && (
            <Link
              href="/leagues"
              className="inline-block mt-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Browse Leagues →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {followedTeamData.map((team) => (
            <Link
              key={team.id}
              href={`/team/${team.slug}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <span className="text-2xl">{team.flag || "⚽"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{team.name}</p>
                <p className="text-xs text-slate-400">
                  {team.leagueName || team.group ? `Group ${team.group}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
