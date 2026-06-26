// src/app/league/[slug]/page.tsx — League Detail (Epic 3)
import { getLeagueBySlug } from "@/data/leagues";
import { notFound } from "next/navigation";
import LeagueHeader from "@/components/LeagueHeader";
import LeagueTabsClient from "./LeagueTabsClient";
import StandingsTable from "@/components/StandingsTable";
import FixtureCard from "@/components/FixtureCard";
import LeagueTeamList from "@/components/LeagueTeamList";
import type { League, Match } from "@/data/types";

export async function generateStaticParams() {
  return [
    { slug: "la-liga" },
    { slug: "premier-league" },
    { slug: "serie-a" },
    { slug: "bundesliga" },
    { slug: "ligue-1" },
    { slug: "mls" },
    { slug: "usl-l1" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const league = getLeagueBySlug(slug);
  if (!league) return { title: "League Not Found" };
  return {
    title: `${league.name} | Pitchside`,
    description: `${league.country}'s top football league — standings, fixtures, and teams.`,
    alternates: {
      canonical: `/league/${slug}`,
    },
    openGraph: {
      title: `${league.name} | Pitchside`,
      description: `${league.name} — ${league.country}'s top football league.`,
    },
    twitter: {
      title: `${league.name} | Pitchside`,
      description: `${league.name} — ${league.country}'s top football league.`,
    },
  };
}

export default async function LeagueDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const league: League | undefined = getLeagueBySlug(slug);
  if (!league) notFound();

  // Separate upcoming and completed matches
  const now = new Date();
  const upcomingMatches: Match[] = (league.matches || []).filter((m) => new Date(m.date) > now);
  const completedMatches: Match[] = (league.matches || []).filter((m) => new Date(m.date) <= now).slice(-10);
  const allMatches: Match[] = [...upcomingMatches, ...completedMatches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group matches by matchday if available
  const matchesByMatchday = new Map<number, Match[]>();
  for (const match of allMatches) {
    if (match.matchday) {
      const existing = matchesByMatchday.get(match.matchday) || [];
      existing.push(match);
      matchesByMatchday.set(match.matchday, existing);
    }
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: league.name,
              description: `${league.country}'s top football league — standings, fixtures, and teams.`,
              url: `https://pitchside.app/league/${league.slug}`,
              breadcrumb: { "@id": "#breadcrumb" },
            },
            {
              "@id": "#breadcrumb",
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                { "@type": "ListItem", "position": 2, "name": "Leagues", "item": "https://pitchside.app/leagues" },
                { "@type": "ListItem", "position": 3, "name": league.name },
              ],
            },
          ]),
        }}
      />

      <LeagueHeader league={league} />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Tabs client wrapper */}
        <LeagueTabsClient
          league={league}
          matches={allMatches}
          matchesByMatchday={matchesByMatchday}
          teams={league.teams}
        />
      </div>
    </>
  );
}
