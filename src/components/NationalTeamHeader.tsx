"use client";

import Link from "next/link";
import Image from "next/image";
import type { Team } from "@/data/types";

interface NationalTeamHeaderProps {
  team: Team;
}

export default function NationalTeamHeader({ team }: NationalTeamHeaderProps) {
  return (
    <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        {/* Back link */}
        <Link
          href="/international"
          className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          International
        </Link>

        <div className="w-px h-8 bg-slate-800" />

        {/* Flag emoji */}
        <span className="text-5xl" role="img" aria-label={`${team.name} flag`}>
          {team.flag || "\u26BD"}
        </span>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-white truncate">{team.name}</h1>
          <p className="text-sm text-slate-400">
            {team.shortName}
            {team.group ? ` \u00B7 Group ${team.group}` : ""}
            {team.fifaRank ? ` \u00B7 FIFA #${team.fifaRank}` : ""}
          </p>
        </div>

        {/* Caps/Goals sidebar */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          {team.caps !== undefined && (
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Caps</span>
              <p className="text-lg font-bold text-white tabular-nums">{team.caps}</p>
            </div>
          )}
          {team.goals !== undefined && (
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Goals</span>
              <p className="text-lg font-bold text-emerald-400 tabular-nums">{team.goals}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
