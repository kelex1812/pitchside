// src/app/tournament/[slug]/TournamentTabsClient.tsx — Client-side tab switching for tournament detail
"use client";

import { useState, useMemo, useEffect } from "react";
import TournamentTabs from "@/components/TournamentTabs";
import StandingsTable from "@/components/StandingsTable";
import GroupStandings from "@/components/GroupStandings";
import KnockoutBracketView from "@/components/KnockoutBracketView";
import TeamCard from "@/components/TeamCard";
import MatchCard from "@/components/MatchCard";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";
import type { Tournament, KnockoutBracket, Standing } from "@/data/types";
import { allTeams } from "@/data/teams";

interface TournamentTabsClientProps {
  tournament: Tournament;
  teams: typeof allTeams;
  bracket: KnockoutBracket | null;
}

export default function TournamentTabsClient({ tournament, teams, bracket }: TournamentTabsClientProps) {
  const [activeTab, setActiveTab] = useState("groups");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const groupStandings = tournament.groupStandings || [];
  const tournamentMatches = tournament.matches || [];

  // Aggregate standings for tournament-wide standings
  const aggregateStandings: Standing[] = useMemo(() => {
    const teamsMap = new Map<string, Standing>();
    for (const match of tournamentMatches) {
      if (match.homeScore !== null && match.awayScore !== null) {
        // Home team
        const home = teamsMap.get(match.homeTeamId!) || {
          position: 0, team: match.homeTeamName || "", played: 0, won: 0, drawn: 0, lost: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
        };
        home.played++;
        home.goalsFor += match.homeScore;
        home.goalsAgainst += match.awayScore;
        if (match.homeScore > match.awayScore) { home.won++; home.points += 3; }
        else if (match.homeScore === match.awayScore) { home.drawn++; home.points += 1; }
        else { home.lost++; }
        teamsMap.set(match.homeTeamId!, home);

        // Away team
        const away = teamsMap.get(match.awayTeamId!) || {
          position: 0, team: match.awayTeamName || "", played: 0, won: 0, drawn: 0, lost: 0,
          goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
        };
        away.played++;
        away.goalsFor += match.awayScore;
        away.goalsAgainst += match.homeScore;
        if (match.awayScore > match.homeScore) { away.won++; away.points += 3; }
        else if (match.awayScore === match.homeScore) { away.drawn++; away.points += 1; }
        else { away.lost++; }
        teamsMap.set(match.awayTeamId!, away);
      }
    }
    const result = Array.from(teamsMap.values());
    result.sort((a, b) => b.points - a.points || (b.goalDifference) - (a.goalDifference) || (b.goalsFor) - (a.goalsFor));
    result.forEach((s, i) => { s.position = i + 1; });
    return result;
  }, [tournamentMatches]);

  // Match dates grouped
  const matchesByDate = useMemo(() => {
    const dateMap = new Map<string, typeof tournamentMatches>();
    for (const match of tournamentMatches) {
      const date = match.date.split("T")[0];
      const existing = dateMap.get(date) || [];
      existing.push(match);
      dateMap.set(date, existing);
    }
    return dateMap;
  }, [tournamentMatches]);

  return (
    <>
      <TournamentTabs
        tournament={tournament}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-6" role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`${activeTab}-tab`}>
        {!isLoaded ? (
          <Skeleton.TournamentTabsContent />
        ) : activeTab === "groups" && groupStandings.length > 0 ? (
          <div className="space-y-6" id="groups-panel">
            {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].map((letter, i) => {
              const standings = groupStandings[i];
              if (!standings || standings.length === 0) return null;
              return <GroupStandings key={letter} standings={standings} groupName={letter} />;
            })}
          </div>
        ) : activeTab === "groups" ? (
          <EmptyState.Fixtures />
        ) : activeTab === "standings" && aggregateStandings.length > 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <StandingsTable standings={aggregateStandings} />
          </div>
        ) : activeTab === "standings" ? (
          <EmptyState.NoMatches />
        ) : activeTab === "fixtures" ? (
          <div className="space-y-6">
            {Array.from(matchesByDate.entries()).map(([date, dateMatches]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-slate-400 mb-3">{new Date(date + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
                <div className="space-y-3">
                  {dateMatches.map((match) => (
                    <MatchCard key={match.id} match={match as any} showCompetition />
                  ))}
                </div>
              </div>
            ))}
            {tournamentMatches.length === 0 && <EmptyState.Fixtures />}
          </div>
        ) : activeTab === "knockout" && bracket && bracket.length > 0 ? (
          <KnockoutBracketView bracket={bracket} />
        ) : activeTab === "knockout" ? (
          <EmptyState.Fixtures />
        ) : activeTab === "teams" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                showFlag
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
