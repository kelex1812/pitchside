"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getMatchesThisWeek } from "@/lib/matches";
import type { Match, PartialMatch, Team } from "@/data/types";
import MatchCard from "./MatchCard";

interface WeeklyStripProps {
  teams?: Team[];
}

function getTeamByName(teams: Team[] | undefined, name: string | undefined): Team | undefined {
  if (!name || !teams) return undefined;
  return teams.find((t) => t.name === name || t.slug === name);
}

export default function WeeklyStrip({ teams }: WeeklyStripProps) {
  const allMatches = useMemo(() => {
    if (!teams) return [];
    const matches: PartialMatch[] = [];
    for (const team of teams) {
      if (team.schedule) {
        matches.push(...team.schedule);
      }
    }
    return getMatchesThisWeek(matches);
  }, [teams]);

  if (allMatches.length === 0) return null;

  return (
    <section className="border-b border-slate-800 bg-slate-900/50" aria-label="This week's matches">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <p className="text-xs sm:text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 sm:mb-3">
          This Week
        </p>
        {/* Horizontal scroll on mobile, wrap on larger screens */}
        <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible scrollbar-hide">
          {allMatches.slice(0, 6).map((match, i) => {
            const homeTeam = getTeamByName(teams, match.homeTeamName);
            const awayTeam = getTeamByName(teams, match.awayTeamName);

            return (
              <div key={match.id || `${match.kickoff}-${i}`} className="flex-shrink-0 w-64 sm:w-72">
                <MatchCard
                  match={match as Match}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  showCompetition
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
