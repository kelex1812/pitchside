// src/app/leagues/page.tsx — League Directory (Epic 3)
import type { Metadata } from "next";
import Script from "next/script";
import LeaguesPageClient from "./LeaguesPageClient";

export const metadata: Metadata = {
  title: "Football Leagues | Pitchside",
  description: "Browse professional football leagues worldwide. Find standings, fixtures, and teams for Premier League, La Liga, Serie A, Bundesliga, Ligue 1, MLS, and more.",
  openGraph: {
    title: "Football Leagues | Pitchside",
    description: "Browse professional football leagues worldwide.",
  },
  twitter: {
    title: "Football Leagues | Pitchside",
    description: "Browse professional football leagues worldwide.",
  },
};

export default function LeaguesPage() {
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
              name: "Football Leagues",
              description: "Browse professional football leagues worldwide. Find standings, fixtures, and teams for Premier League, La Liga, Serie A, Bundesliga, Ligue 1, MLS, and more.",
              url: "https://pitchside.app/leagues",
              hasBreadcrumb: {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                  { "@type": "ListItem", "position": 2, "name": "Leagues" },
                ],
              },
            },
          ]),
        }}
      />
      <LeaguesPageClient />
    </>
  );
}
