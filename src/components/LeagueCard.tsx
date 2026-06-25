"use client";

import Link from "next/link";
import Image from "next/image";
import type { League } from "@/data/types";

interface LeagueCardProps {
  league: League;
  onClick?: (slug: string) => void;
}

export default function LeagueCard({ league, onClick }: LeagueCardProps) {
  const card = (
    <Link
      href={`/league/${league.slug}`}
      onClick={() => onClick?.(league.slug)}
      className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:shadow-md transition-all"
    >
      <Image
        src={league.logoUrl || "/placeholder-logo.png"}
        alt={`${league.name} logo`}
        width={48}
        height={48}
        className="w-12 h-12 object-contain flex-shrink-0"
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold text-white truncate">{league.name}</h3>
        <p className="text-sm text-slate-400">{league.country}</p>
        <p className="text-xs text-slate-400 mt-1">
          {league.teams.length} teams
        </p>
      </div>
    </Link>
  );

  return onClick ? (
    <div onClick={(e) => e.stopPropagation()}>{card}</div>
  ) : (
    card
  );
}
