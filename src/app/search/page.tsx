"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { wc2026Teams, searchTeams } from "@/data/teams";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTeams(query);
  }, [query]);

  const allTeamsList = useMemo(
    () => [...wc2026Teams].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-4 block">
            &larr; Back to Dashboard
          </a>
          <h1 className="text-2xl font-bold text-white mb-4">Search Teams</h1>
          <input
            type="text"
            placeholder="Search by team name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            autoFocus
            aria-label="Search teams"
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Results */}
        {query.trim() && results.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Results ({results.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((team) => (
                <Link
                  key={team.id}
                  href={`/team/${team.slug}`}
                  className="block p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{team.flag || "\u26BD"}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{team.name}</h3>
                      <p className="text-sm text-slate-400">
                        Group {team.group} · FIFA #{team.fifaRank}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {query.trim() && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No teams found matching &quot;{query}&quot;</p>
          </div>
        )}

        {/* All Teams (no search) */}
        {allTeamsList.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-white mb-4">All Teams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {allTeamsList.map((team) => (
                <Link
                  key={team.id}
                  href={`/team/${team.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all"
                >
                  <span className="text-2xl">{team.flag || "\u26BD"}</span>
                  <span className="text-sm font-medium text-slate-300">{team.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
