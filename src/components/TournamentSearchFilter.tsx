"use client";

import type { TournamentCategory } from "@/data/types";

interface TournamentSearchFilterProps {
  categories: TournamentCategory[];
  selectedCategory: TournamentCategory | "all";
  onSearch: (query: string) => void;
  onCategoryChange: (category: TournamentCategory | "all") => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  "all": "All",
  "world-cup": "World Cup",
  "continental-championship": "Continental Championship",
  "olympics": "Olympics",
  "confederations-cup": "Confederations Cup",
  "friendlies": "Friendlies",
  "qualifiers": "Qualifiers",
};

export default function TournamentSearchFilter({
  categories,
  selectedCategory,
  onSearch,
  onCategoryChange,
}: TournamentSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search tournaments..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      {/* Category dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as TournamentCategory | "all")}
        className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
      >
        <option value="all">{CATEGORY_LABELS["all"]}</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_LABELS[cat] || cat}
          </option>
        ))}
      </select>
    </div>
  );
}
