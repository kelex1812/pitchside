// src/app/login/page.tsx — OAuth login page (client component)
// Server component wrapper for metadata (metadata API not allowed in "use client")

import type { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Sign In | Pitchside",
  description: "Sign in to Pitchside to sync your followed teams across devices.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Sign In | Pitchside",
    description: "Sign in to Pitchside to sync your followed teams across devices.",
  },
  twitter: {
    title: "Sign In | Pitchside",
    description: "Sign in to Pitchside to sync your followed teams across devices.",
  },
};

export default function LoginPage() {
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
              name: "Sign In",
              description: "Sign in to Pitchside to sync your followed teams across devices.",
              url: "https://pitchside.app/login",
              breadcrumb: { "@id": "#breadcrumb" },
            },
            {
              "@id": "#breadcrumb",
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                { "@type": "ListItem", "position": 2, "name": "Sign In", "item": "https://pitchside.app/login" },
              ],
            },
          ]),
        }}
      />
      <LoginPageClient />
    </>
  );
}
