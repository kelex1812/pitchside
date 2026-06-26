// src/app/international/page.tsx — International / Tournament Overview (Epic 4)
import type { Metadata } from "next";
import InternationalPageClient from "./InternationalPageClient";

export const metadata: Metadata = {
  title: "International Football | Pitchside",
  description: "World Cup, European Championship, Copa America, and more. Follow all international tournaments with standings, fixtures, and team squads.",
  alternates: {
    canonical: "/international",
  },
  openGraph: {
    title: "International Football | Pitchside",
    description: "World Cup, European Championship, Copa America, and more.",
  },
  twitter: {
    title: "International Football | Pitchside",
    description: "World Cup, European Championship, Copa America, and more.",
  },
};

export default function InternationalPage() {
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
              name: "International Football",
              description: "World Cup, European Championship, Copa America, and more. Follow all international tournaments with standings, fixtures, and team squads.",
              url: "https://pitchside.app/international",
              breadcrumb: { "@id": "#breadcrumb" },
            },
            {
              "@id": "#breadcrumb",
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                { "@type": "ListItem", "position": 2, "name": "International", "item": "https://pitchside.app/international" },
              ],
            },
          ]),
        }}
      />
      <InternationalPageClient />
    </>
  );
}
