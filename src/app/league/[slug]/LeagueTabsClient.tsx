// src/app/league/[slug]/LeagueTabsClient.tsx — Client-side tab switching for league detail
"use client";

import { useState, useEffect } from "react";
import LeagueTabs from "@/components/LeagueTabs";
import StandingsTable from "@/components/StandingsTable";
import FixtureCard from "@/components/FixtureCard";
import LeagueTeamList from "@/components/LeagueTeamList";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import type { League, Match } from "@/data/types";

interface LeagueTabsClientProps {
  league: League;
  matches: Match[];
  matchesByMatchday: Map<number, Match[]>;
  teams: League["teams"];
}

export default function LeagueTabsClient({ league, matches, matchesByMatchday, teams }: LeagueTabsClientProps) {
  const [activeTab, setActiveTab] = useState("standings");
  const [isLoaded, setIsLoaded] = useState(false);

  // Show skeletons on first render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const upcomingMatches = matches.filter((m) => m.homeScore === null && m.awayScore === null);
  const completedMatches = matches.filter((m) => m.homeScore !== null || m.awayScore !== null);
  const allMatches = [...upcomingMatches, ...completedMatches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <LeagueTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {!isLoaded ? (
          <Skeleton.LeagueTabsContent />
        ) : activeTab === "standings" && league.standings && league.standings.length > 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <StandingsTable standings={league.standings} />
          </div>
        ) : activeTab === "standings" ? (
          <EmptyState.NoMatches />
        ) : activeTab === "fixtures" && allMatches.length > 0 ? (
          <div className="space-y-6">
            {allMatches.map((match) => (
              <FixtureCard key={match.id || `${match.date}-${match.homeTeamId}-${match.awayTeamId}`} match={match} />
            ))}
          </div>
        ) : activeTab === "fixtures" ? (
          <EmptyState.Fixtures />
        ) : activeTab === "teams" && teams && teams.length > 0 ? (
          <div className="mt-2">
            <h2 className="text-lg font-semibold text-white mb-4">Teams</h2>
            <LeagueTeamList teams={teams} />
          </div>
        ) : activeTab === "teams" ? (
          <EmptyState.NoMatches />
        ) : null}
      </div>
    </>
  );
}
