// Search Teams Page Client Component
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { allTeams, searchTeams } from "@/data/teams";
import { leagues } from "@/data/leagues";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";

export default function SearchPageClient() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "club" | "national">("all");
  const [filterLeague, setFilterLeague] = useState<string>("all");
  const [filterCompetition, setFilterCompetition] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate brief loading state to show skeletons
  useState(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  });

  const results = useMemo(() => {
    let filtered = query.trim() ? searchTeams(query) : allTeams;

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Apply league filter
    if (filterLeague !== "all") {
      filtered = filtered.filter((t) => t.league === filterLeague || t.leagueId === filterLeague);
    }

    // Apply competition filter
    if (filterCompetition !== "all") {
      if (filterCompetition === "world-cup") {
        filtered = filtered.filter((t) => t.type === "national" && !!t.group);
      } else if (filterCompetition === "club-competitions") {
        filtered = filtered.filter((t) => t.type === "club");
      } else if (filterCompetition === "international") {
        filtered = filtered.filter((t) => t.type === "national");
      }
    }

    return filtered;
  }, [query, filterType, filterLeague, filterCompetition]);

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-4 block min-h-[44px] flex items-center">
            &larr; Back to Dashboard
          </a>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">Search Teams</h1>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by team name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
              autoFocus
              aria-label="Search teams"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors md:hidden min-h-[44px]"
            aria-expanded={showFilters}
            aria-controls="filter-section"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters */}
          <div id="filter-section" className={`${showFilters ? "block" : "hidden"} md:flex flex-col md:flex-row gap-3 mt-3`}>
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "club" | "national")}
              className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer min-h-[44px]"
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="club">Club</option>
              <option value="national">National</option>
            </select>

            {/* League Filter */}
            <select
              value={filterLeague}
              onChange={(e) => setFilterLeague(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer min-h-[44px]"
              aria-label="Filter by league"
            >
              <option value="all">All Leagues</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.slug}>{league.name}</option>
              ))}
            </select>

            {/* Competition Filter */}
            <select
              value={filterCompetition}
              onChange={(e) => setFilterCompetition(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer min-h-[44px]"
              aria-label="Filter by competition"
            >
              <option value="all">All Competitions</option>
              <option value="world-cup">World Cup</option>
              <option value="club-competitions">Club Competitions</option>
              <option value="international">International</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Active Filter Chips */}
        {(filterType !== "all" || filterLeague !== "all" || filterCompetition !== "all") && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filterType !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
                Type: {filterType}
                <button onClick={() => setFilterType("all")} className="ml-1 hover:text-white min-h-[44px] flex items-center" aria-label={`Remove ${filterType} filter`}>×</button>
              </span>
            )}
            {filterLeague !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm">
                League: {leagues.find((l) => l.slug === filterLeague)?.name || filterLeague}
                <button onClick={() => setFilterLeague("all")} className="ml-1 hover:text-white min-h-[44px] flex items-center" aria-label={`Remove ${filterLeague} filter`}>×</button>
              </span>
            )}
            {filterCompetition !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                Competition: {filterCompetition}
                <button onClick={() => setFilterCompetition("all")} className="ml-1 hover:text-white min-h-[44px] flex items-center" aria-label={`Remove ${filterCompetition} filter`}>×</button>
              </span>
            )}
            <button
              onClick={() => { setFilterType("all"); setFilterLeague("all"); setFilterCompetition("all"); }}
              className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center px-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        {results.length > 0 && (
          <p className="text-sm text-slate-400 mb-4">
            {results.length} team{results.length !== 1 ? "s" : ""} found
            {query.trim() && ` for "${query}"`}
          </p>
        )}

        {/* Search Results */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton.TeamCard />
            <Skeleton.TeamCard />
            <Skeleton.TeamCard />
            <Skeleton.TeamCard />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((team) => (
              <Link
                key={team.id}
                href={`/team/${team.slug}`}
                className="block p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all group min-h-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                tabIndex={0}
              >
                <div className="flex items-center gap-3">
                  {team.flag ? (
                    <span className="text-3xl shrink-0" role="img" aria-label={`${team.name} flag`}>
                      {team.flag}
                    </span>
                  ) : (
                    team.crestUrl ? (
                      <img
                        src={team.crestUrl}
                        alt=""
                        className="w-8 h-8 object-contain shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xl shrink-0">⚽</span>
                    )
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-base truncate group-hover:text-emerald-400 transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-sm text-slate-400 truncate">
                      {team.type === "national"
                        ? team.group ? `Group ${team.group} · FIFA #${team.fifaRank}` : "International Team"
                        : team.leagueName || team.league || "Club Team"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : query.trim() ? (
          <EmptyState.Search query={query} />
        ) : null}

        {/* All Teams (no search) */}
        {!isLoaded ? null : !query.trim() && results.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-white mb-4">All Teams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {results.map((team) => (
                <Link
                  key={team.id}
                  href={`/team/${team.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all group min-h-[48px]"
                >
                  {team.flag ? (
                    <span className="text-2xl shrink-0">{team.flag}</span>
                  ) : team.crestUrl ? (
                    <img
                      src={team.crestUrl}
                      alt=""
                      className="w-6 h-6 object-contain shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-lg shrink-0">⚽</span>
                  )}
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                    {team.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
