"use client";

import Link from "next/link";
import Image from "next/image";
import { allTeams } from "@/data/teams";
import type { Team } from "@/data/types";
import CalendarExport from "./CalendarExport";
import CountdownRing from "./CountdownRing";
import FollowButton from "./FollowButton";

export default function Dashboard() {
  const clubTeams = allTeams.filter((t) => t.type === "club");
  const nationalTeams = allTeams.filter((t) => t.type === "national");

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Pitchside
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {clubTeams.length + nationalTeams.length} teams · 12 groups · All in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Search
            </Link>
            <Link
              href="/feed"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              My Feed
            </Link>
            <CalendarExport teams={allTeams} />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Club Teams */}
        <section>
          <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Club Teams
          </h2>
          <div className="space-y-6">
            {clubTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </section>

        {/* World Cup 2026 */}
        <section>
          <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            FIFA World Cup 2026
          </h2>

          {/* Group Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
            {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map((groupLetter) => {
              const groupTeams = nationalTeams.filter((t) => t.group === groupLetter);
              return (
                <Link
                  key={groupLetter}
                  href={`/group/${groupLetter}`}
                  className="block p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-bold text-base text-white mb-3">
                    Group {groupLetter}
                  </h3>
                  <div className="space-y-1.5">
                    {groupTeams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center gap-2 text-sm text-slate-400"
                      >
                        <span className="text-base">{team.flag || "\u26BD"}</span>
                        <span>{team.name}</span>
                      </div>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* All National Teams */}
          <div className="space-y-6">
            {nationalTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          <p>Data is seeded with 2026 season information. Last updated: June 2026.</p>
        </div>
      </footer>
    </main>
  );
}

function TeamCard({ team }: { team: Team }) {
  const tag = team.nextMatch
    ? new Date(team.nextMatch.date).getTime() - new Date().getTime()
    : undefined;

  const diffMs = tag;
  const isLive = diffMs !== undefined && diffMs > 0 && diffMs < 5 * 60 * 1000;
  const isUpcoming = diffMs !== undefined && diffMs > 5 * 60 * 1000;
  const days = diffMs !== undefined ? Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24)) : 0;
  const hours = diffMs !== undefined ? Math.floor((Math.abs(diffMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0;

  return (
    <div
      className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all hover:border-slate-700"
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: team.primaryColor || "#10b981",
      }}
      role="region"
      aria-label={`${team.name} dashboard`}
    >
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
          <Link href={`/team/${team.slug}`}>
            <h2 className="text-xl font-bold text-white truncate hover:text-emerald-400 transition-colors">{team.name}</h2>
          </Link>
          <p className="text-sm text-slate-400">
            {team.leagueName || `World Cup 2026${team.group ? ` \u00b7 Group ${team.group}` : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FollowButton teamId={team.id} />
        </div>
      </div>

      {team.nextMatch && (
        <div className="px-6 pb-5">
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
                <CountdownRing days={days} hours={hours} teamColor={team.primaryColor} />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-800"
                  aria-label="Match has already concluded"
                >
                  {diffMs !== undefined && diffMs > 0 ? "UP" : "FT"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Next Match</p>
              <p className="text-lg font-semibold text-white mt-0.5">
                vs {team.nextMatch.opponent || "TBD"}
                <span className="text-slate-400 font-normal text-sm ml-2">
                  {team.nextMatch.isHome ? "H" : "A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
