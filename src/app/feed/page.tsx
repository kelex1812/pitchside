// Feed Page — Personal dashboard showing followed teams' matches
// Protected route: requires authentication
import type { Metadata } from "next";
import Script from "next/script";
import FeedPageClient from "./FeedPageClient";

export const metadata: Metadata = {
  title: "My Feed — Pitchside",
  description: "Your personalized feed of followed teams' matches and updates.",
  alternates: {
    canonical: "/feed",
  },
  openGraph: {
    title: "My Feed | Pitchside",
    description: "Your personalized feed of followed teams' matches and updates.",
  },
  twitter: {
    title: "My Feed | Pitchside",
    description: "Your personalized feed of followed teams' matches and updates.",
  },
};

export default function FeedPage() {
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
              name: "My Feed",
              description: "Your personalized feed of followed teams' matches and updates.",
              url: "https://pitchside.app/feed",
              hasBreadcrumb: {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                  { "@type": "ListItem", "position": 2, "name": "My Feed" },
                ],
              },
            },
          ]),
        }}
      />
      <FeedPageClient />
    </>
  );
}
