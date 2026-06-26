// src/app/HomePageClient.tsx — Client-side logic for homepage (skeleton + data loading)
"use client";

import { useState, useEffect } from "react";
import { Team, KnockoutMatch, League } from "@/data/types";
import GroupStandingsGrid from "@/components/GroupStandingsGrid";
import WeeklyStrip from "@/components/WeeklyStrip";
import ClubTeamsSection from "@/components/ClubTeamsSection";
import FollowedTeamsSection from "@/components/FollowedTeamsSection";
import KnockoutBracket from "@/components/KnockoutBracket";
import Skeleton from "@/components/Skeleton";
import { getTournamentState } from "@/lib/data/tournaments";
import type { TournamentState } from "@/data/types";
import { leagues } from "@/data/leagues";

interface HomePageClientProps {
  clubTeams: Team[];
  nationalTeams: Team[];
  tournamentState: TournamentState;
  groupStandings: any[][];
  allLeagues: League[];
}

export default function HomePageClient({
  clubTeams,
  nationalTeams,
  tournamentState,
  groupStandings,
  allLeagues: initialLeagues,
}: HomePageClientProps) {
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([]);
  const [allLeagues, setAllLeagues] = useState<League[]>(initialLeagues);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Build leagues with derived data from match data
    (async () => {
      try {
        const res = await fetch("/api/tournaments");
        if (!res.ok) return;
        const tournaments = await res.json();
        const wc = tournaments[0]; // World Cup
        if (wc && wc.knockoutResults) {
          setKnockoutMatches(wc.knockoutResults);
        }
      } catch {
        // Silent fail
      }
      setIsInitialLoad(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 antialiased">
      {/* 1. Weekly Strip — top bar */}
      <WeeklyStrip teams={[...clubTeams, ...nationalTeams]} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 sm:space-y-12">
      {/* 2. Page heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        FIFA World Cup 2026 &amp; Club Leagues Dashboard
      </h1>

      {/* 3. Followed Teams Section */}
      <FollowedTeamsSection />

      {/* 4. World Cup 2026 Group Standings */}
        <section aria-label="World Cup 2026 Group Standings" aria-busy={isInitialLoad} aria-live="polite" role="status">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            FIFA World Cup 2026 — Group Stage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {isInitialLoad
              ? Array.from({ length: 4 }, (_, i) => (
                  <Skeleton.GroupStandingsCard key={i} />
                ))
              : groupStandings.map((standing, i) => (
                  <GroupStandingsGrid key={["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"][i]} groups={[standing]} />
                ))}
          </div>
        </section>

        {/* 4. Knockout Bracket (conditional on phase === "knockout") */}
        {tournamentState.phase === "knockout" && knockoutMatches.length > 0 && (
          <section aria-label="Knockout bracket">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              Knockout Stage
            </h2>
            <div className="overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0">
                <KnockoutBracket rounds={knockoutMatches} />
              </div>
            </div>
          </section>
        )}

        {/* 5. Club Teams / Featured Leagues */}
        <ClubTeamsSection leagues={allLeagues} />
      </div>
    </div>
  );
}
