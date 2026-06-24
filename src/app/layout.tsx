import type { Metadata } from "next";
import "./globals.css";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";

export const metadata: Metadata = {
  title: "Pitchside — Club Teams & World Cup 2026 Dashboard",
  description: "Unified sports dashboard tracking club teams and all 48 FIFA World Cup 2026 teams with schedules, standings, and news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-300 antialiased">
        <ClientErrorBoundary>
          {children}
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
