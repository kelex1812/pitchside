// Leagues Page Client Component
"use client";

import { useState, useMemo } from "react";
import LeagueGrid from "@/components/LeagueGrid";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import { leagues } from "@/data/leagues";

export default function LeaguesPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "club" | "international-club">("all");
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate brief loading state to show skeletons
  useState(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Leagues</h1>
          <p className="text-sm text-slate-400">Browse professional football leagues</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
            aria-label="Search leagues"
          />

          {/* Type Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as "all" | "club" | "international-club")}
            className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer min-h-[44px]"
            aria-label="Filter by league type"
          >
            <option value="all">All Leagues</option>
            <option value="club">Club</option>
            <option value="international-club">International Club</option>
          </select>
        </div>

        {/* League Grid */}
        {!isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton.LeagueCard />
            <Skeleton.LeagueCard />
            <Skeleton.LeagueCard />
            <Skeleton.LeagueCard />
          </div>
        ) : (
          <LeagueGrid
            leagues={leagues}
            searchQuery={searchQuery}
            filterType={filterType}
          />
        )}
      </div>
    </>
  );
}
