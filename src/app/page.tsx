// src/app/page.tsx — Homepage (Epic 2)
import type { Metadata } from "next";
import Script from "next/script";
import { allTeams, getGroupStandings } from "@/data/teams";
import { leagues } from "@/data/leagues";
import { getTournamentState } from "@/lib/data/tournaments";
import GroupStandingsGrid from "@/components/GroupStandingsGrid";
import WeeklyStrip from "@/components/WeeklyStrip";
import ClubTeamsSection from "@/components/ClubTeamsSection";
import FollowedTeamsSection from "@/components/FollowedTeamsSection";
import KnockoutBracket from "@/components/KnockoutBracket";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Home — Club Teams & World Cup 2026 | Pitchside",
  description: "Track all 48 FIFA World Cup 2026 teams, club leagues, and your favorite teams. Live scores, standings, schedules, and news — all in one dashboard.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pitchside — Club Teams & World Cup 2026 Dashboard",
    description: "Track all 48 FIFA World Cup 2026 teams, club leagues, and your favorite teams.",
  },
  twitter: {
    title: "Pitchside — Club Teams & World Cup 2026 Dashboard",
    description: "Track all 48 FIFA World Cup 2026 teams, club leagues, and your favorite teams.",
  },
};

export default function HomePage() {
  const clubTeams = allTeams.filter((t) => t.type === "club");
  const nationalTeams = allTeams.filter((t) => t.type === "national");
  const tournamentState = getTournamentState();

  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const groupStandings = groups.map((letter) => getGroupStandings(letter));

  return (
    <>
      {/* JSON-LD structured data */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Pitchside — Club Teams & World Cup 2026 Dashboard",
              description: "Track all 48 FIFA World Cup 2026 teams, club leagues, and your favorite teams. Live scores, standings, schedules, and news — all in one dashboard.",
              url: "https://pitchside.app",
              hasBreadcrumb: {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                ],
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "SportsPortal",
              name: "Pitchside",
              url: "https://pitchside.app",
              description: "Track all 48 FIFA World Cup 2026 teams, club leagues, and your favorite teams. Live scores, standings, schedules, and news.",
              about: {
                "@type": "SportsTeam",
                name: "FIFA World Cup 2026",
              },
              publishingPractice: [
                "https://schema.org/OriginalReporting",
                "https://schema.org/SportsCoverage",
              ],
            },
          ]),
        }}
      />
      <HomePageClient
        clubTeams={clubTeams}
        nationalTeams={nationalTeams}
        tournamentState={tournamentState}
        groupStandings={groupStandings}
        allLeagues={leagues}
      />
    </>
  );
}
