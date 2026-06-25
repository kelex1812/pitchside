// Account Page — User profile, timezone, followed teams list, notifications placeholder
// Protected route: requires authentication
import type { Metadata } from "next";
import Script from "next/script";
import AccountPageClient from "./AccountPageClient";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Account | Pitchside",
  description: "Manage your profile, timezone preferences, and followed teams.",
  openGraph: {
    title: "Account | Pitchside",
    description: "Manage your profile and preferences.",
  },
  twitter: {
    title: "Account | Pitchside",
    description: "Manage your profile and preferences.",
  },
};

export default function AccountPage() {
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
              name: "Account",
              description: "Manage your profile, timezone preferences, and followed teams.",
              url: "https://pitchside.app/account",
              hasBreadcrumb: {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                  { "@type": "ListItem", "position": 2, "name": "Account" },
                ],
              },
            },
          ]),
        }}
      />
      <AccountPageClient />
      <Footer />
    </>
  );
}
