"use client";

import Link from "next/link";
import { allTeams, getMatchesForTeam, getTeamBySlug } from "@/data/teams";

export default function FeedPage() {
  const followedTeamIds = typeof window !== "undefined"
    ? (() => {
        try {
          const stored = localStorage.getItem("pitchside-following");
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      })()
    : [];

  if (followedTeamIds.length === 0) {
    return (
      <main className="min-h-screen">
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-4 block">
              &larr; Back to Dashboard
            </a>
            <h1 className="text-2xl font-bold text-white">My Feed</h1>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-slate-400 mb-4">You haven&apos;t followed any teams yet.</p>
          <p className="text-sm text-slate-500">Follow teams to see their updates here.</p>
          <a
            href="/search"
            className="inline-block mt-6 px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors"
          >
            Search Teams
          </a>
        </div>
      </main>
    );
  }

  const followedTeams = allTeams.filter((t) => followedTeamIds.includes(t.id));

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-4 block">
            &larr; Back to Dashboard
          </a>
          <h1 className="text-2xl font-bold text-white">My Feed</h1>
          <p className="text-sm text-slate-400 mt-1">
            {followedTeams.length} team{followedTeams.length !== 1 ? "s" : ""} followed
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Followed Teams Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-3 py-1.5 text-sm rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            All
          </button>
          {followedTeams.map((team) => (
            <Link
              key={team.id}
              href={`/team/${team.slug}`}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {team.name}
            </Link>
          ))}
        </div>

        {/* Latest Updates */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Latest Updates</h2>
          <div className="space-y-4">
            {followedTeams.map((team) => (
              <a
                key={team.id}
                href={`/team/${team.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  {team.crestUrl ? (
                    <img
                      src={team.crestUrl}
                      alt={`${team.name} crest`}
                      className="w-8 h-8 rounded-lg object-contain"
                      style={{ width: "32px", height: "32px" }}
                    />
                  ) : (
                    <span className="text-2xl">{team.flag || "\u26BD"}</span>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    <p className="text-xs text-slate-500">{team.leagueName || `World Cup 2026${team.group ? ` Group ${team.group}` : ""}`}</p>
                  </div>
                </div>
                {team.nextMatch ? (
                  <p className="text-sm text-slate-400">
                    Next match: {team.nextMatch.opponent || "TBD"} on {new Date(team.nextMatch.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 italic">No upcoming matches</p>
                )}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
