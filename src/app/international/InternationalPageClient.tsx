// International / Tournament Overview Page
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import TournamentGrid from "@/components/TournamentGrid";
import TournamentSearchFilter from "@/components/TournamentSearchFilter";
import { getAllTournaments, searchTournaments, getTournamentsByCategory } from "@/lib/data/tournament";
import type { TournamentCategory, Tournament } from "@/data/types";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";

export default function InternationalPageClient() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TournamentCategory | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories: TournamentCategory[] = [
    "world-cup",
    "continental-championship",
    "olympics",
    "confederations-cup",
    "friendlies",
    "qualifiers",
  ];

  useEffect(() => {
    getAllTournaments().then((data) => {
      setTournaments(data);
      setIsLoading(false);
    });
  }, []);

  // Filter tournaments client-side based on search and category
  const filteredTournaments = useMemo(() => {
    let result = tournaments;
    if (selectedCategory !== "all") {
      result = result.filter((t) => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    return result;
  }, [tournaments, searchQuery, selectedCategory]);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">International</h1>
          <p className="text-sm text-slate-400">World Cup, European Championship, Copa America, and more</p>
        </div>

        {/* Search and Filter */}
        <TournamentSearchFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSearch={(query) => setSearchQuery(query)}
          onCategoryChange={(category) => setSelectedCategory(category)}
        />

        {/* Tournament Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton.TournamentCard />
              <Skeleton.TournamentCard />
              <Skeleton.TournamentCard />
            </div>
          ) : filteredTournaments.length === 0 ? (
            <EmptyState.Search />
          ) : (
            <TournamentGrid tournaments={filteredTournaments} />
          )}
        </div>
      </div>
    </>
  );
}
