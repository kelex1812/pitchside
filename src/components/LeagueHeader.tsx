"use client";

import Link from "next/link";
import Image from "next/image";
import type { League } from "@/data/types";

interface LeagueHeaderProps {
  league: League;
}

export default function LeagueHeader({ league }: LeagueHeaderProps) {
  return (
    <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        {/* Back link */}
        <Link
          href="/leagues"
          className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Leagues
        </Link>

        <div className="w-px h-8 bg-slate-800" />

        {/* Logo */}
        <Image
          src={league.logoUrl || "/placeholder-league.png"}
          alt={`${league.name} logo`}
          width={64}
          height={64}
          priority
          className="w-16 h-16 object-contain rounded-lg"
        />

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-white truncate">{league.name}</h1>
          <p className="text-sm text-slate-400">
            {league.country} &middot; {league.teams.length} teams
          </p>
        </div>
      </div>
    </div>
  );
}
