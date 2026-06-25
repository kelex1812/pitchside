// src/app/tournament/[slug]/page.tsx — Tournament Detail (Epic 4)
import Script from "next/script";
import { getTournamentBySlug, getKnockoutBracket } from "@/lib/data/tournament";
import { notFound } from "next/navigation";
import TournamentBanner from "@/components/TournamentBanner";
import TournamentTabsClient from "./TournamentTabsClient";
import StandingsTable from "@/components/StandingsTable";
import GroupStandings from "@/components/GroupStandings";
import KnockoutBracketView from "@/components/KnockoutBracketView";
import TeamCard from "@/components/TeamCard";
import MatchCard from "@/components/MatchCard";
import { allTeams } from "@/data/teams";
import type { Tournament } from "@/data/types";

export async function generateStaticParams() {
  return [
    { slug: "fifa-world-cup-2026" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tournament = await getTournamentBySlug(slug);
  if (!tournament) return { title: "Tournament Not Found" };
  const stageNames = tournament.stages.map((s) => s.name).join(", ");
  return {
    title: `${tournament.name} | Pitchside`,
    description: `${tournament.name}: ${stageNames}. Live standings, fixtures, and bracket coverage.`,
    openGraph: {
      title: `${tournament.name} | Pitchside`,
      description: `${tournament.name}: ${stageNames}.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tournament.name} | Pitchside`,
      description: `${tournament.name}: ${stageNames}.`,
    },
  };
}

export default async function TournamentDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tournament: Tournament | null = await getTournamentBySlug(slug);
  if (!tournament) notFound();

  // Get knockout bracket data
  const bracket = await getKnockoutBracket(tournament.id);

  // Get all national teams for tournament
  const tournamentTeams = allTeams.filter((t) => t.type === "national");

  const stageNames = tournament.stages.map((s) => s.name).join(", ");

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
              name: tournament.name,
              description: `${tournament.name}: ${stageNames}. Live standings, fixtures, and bracket coverage.`,
              url: `https://pitchside.app/tournament/${tournament.slug}`,
              hasBreadcrumb: {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                  { "@type": "ListItem", "position": 2, "name": "International" },
                  { "@type": "ListItem", "position": 3, "name": tournament.name },
                ],
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              name: tournament.name,
              url: `https://pitchside.app/tournament/${tournament.slug}`,
              description: `${tournament.name}: ${stageNames}. Live standings, fixtures, and bracket coverage.`,
              organizer: {
                "@type": "Organization",
                name: "FIFA",
              },
              location: {
                "@type": "Place",
                name: "USA, Canada, Mexico",
              },
              startDate: "2026-06-11",
              endDate: "2026-07-19",
            },
          ]),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <a href="/international" className="text-sm text-slate-400 hover:text-white transition-colors mb-6 inline-block min-h-[44px] flex items-center">
          ← Back to International
        </a>

        {/* Tournament Banner */}
        <div className="mb-8">
          <TournamentBanner tournament={tournament} />
        </div>

        {/* Tabs */}
        <TournamentTabsClient
          tournament={tournament}
          teams={tournamentTeams}
          bracket={bracket}
        />
      </div>
    </>
  );
}
