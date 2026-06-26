// src/app/search/page.tsx — Search Teams (Epic 3)
import type { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Search Teams | Pitchside",
  description: "Search for club teams, national teams, and leagues. Find team schedules, standings, and news.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Search Teams | Pitchside",
    description: "Search for club teams, national teams, and leagues.",
  },
  twitter: {
    title: "Search Teams | Pitchside",
    description: "Search for club teams, national teams, and leagues.",
  },
};

export default function SearchPage() {
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
              name: "Search Teams",
              description: "Search for club teams, national teams, and leagues. Find team schedules, standings, and news.",
              url: "https://pitchside.app/search",
              breadcrumb: { "@id": "#breadcrumb" },
            },
            {
              "@id": "#breadcrumb",
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                { "@type": "ListItem", "position": 2, "name": "Search", "item": "https://pitchside.app/search" },
              ],
            },
          ]),
        }}
      />
      <SearchPageClient />
    </>
  );
}
