import type { Metadata } from "next";
import "./globals.css";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pitchside.app"),
  title: {
    default: "Pitchside — Club Teams & World Cup 2026 Dashboard",
    template: "%s | Pitchside",
  },
  description:
    "Unified sports dashboard tracking club teams and all 48 FIFA World Cup 2026 teams with schedules, standings, and news.",
  keywords: ["football", "soccer", "World Cup 2026", "standings", "fixtures", "club teams", "leagues"],
  category: "Sports",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Pitchside",
    title: {
      default: "Pitchside — Club Teams & World Cup 2026 Dashboard",
      template: "%s | Pitchside",
    },
    description:
      "Unified sports dashboard tracking club teams and all 48 FIFA World Cup 2026 teams with schedules, standings, and news.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Pitchside Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Pitchside — Club Teams & World Cup 2026 Dashboard",
      template: "%s | Pitchside",
    },
    description:
      "Unified sports dashboard tracking club teams and all 48 FIFA World Cup 2026 teams with schedules, standings, and news.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-300 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@id": "https://pitchside.app/#organization",
              "@type": "Organization",
              name: "Pitchside",
              url: "https://pitchside.app",
              logo: "https://pitchside.app/logo.png",
              sameAs: [],
              description:
                "Unified sports dashboard tracking club teams and all 48 FIFA World Cup 2026 teams with schedules, standings, and news.",
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:rounded-lg focus:font-medium"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <ClientErrorBoundary>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </ClientErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
