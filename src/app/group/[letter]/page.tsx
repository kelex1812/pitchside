import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { validGroups, wc2026Teams, groupFixtures, getTeamById } from "@/data/teams";
import EmptyState from "@/components/EmptyState";
import Skeleton from "@/components/Skeleton";

interface GroupPageProps {
  params: Promise<{ letter: string }>;
}

export async function generateStaticParams() {
  return validGroups.map((letter) => ({ letter }));
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }): Promise<Metadata> {
  const { letter } = await params;
  const groupTeams = wc2026Teams.filter((t) => t.group === letter);
  const teamNames = groupTeams.map((t) => t.name).join(", ");
  return {
    title: `Group ${letter} — FIFA World Cup 2026 | Pitchside`,
    description: `FIFA World Cup 2026 Group ${letter}: ${teamNames}. Standings, fixtures, and team profiles.`,
    alternates: {
      canonical: `/group/${letter}`,
    },
    openGraph: {
      title: `Group ${letter} — FIFA World Cup 2026 | Pitchside`,
      description: `FIFA World Cup 2026 Group ${letter}: ${teamNames}.`,
    },
    twitter: {
      title: `Group ${letter} — FIFA World Cup 2026 | Pitchside`,
      description: `FIFA World Cup 2026 Group ${letter}: ${teamNames}.`,
    },
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { letter } = await params;
  const groupTeams = wc2026Teams.filter((t) => t.group === letter);

  if (groupTeams.length === 0) {
    notFound();
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
              name: `Group ${letter} — FIFA World Cup 2026`,
              description: `FIFA World Cup 2026 Group ${letter}: ${groupTeams.map((t) => t.name).join(", ")}. Standings, fixtures, and team profiles.`,
              url: `https://pitchside.app/group/${letter}`,
              breadcrumb: { "@id": "#breadcrumb" },
            },
            {
              "@id": "#breadcrumb",
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pitchside.app" },
                { "@type": "ListItem", "position": 2, "name": "International", "item": "https://pitchside.app/international" },
                { "@type": "ListItem", "position": 3, "name": "Groups", "item": "https://pitchside.app/groups" },
                { "@type": "ListItem", "position": 4, "name": `Group ${letter}` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              name: `FIFA World Cup 2026 Group ${letter}`,
              url: `https://pitchside.app/group/${letter}`,
              description: `FIFA World Cup 2026 Group ${letter}: ${groupTeams.map((t) => t.name).join(", ")}.`,
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

      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-4 block min-h-[44px] flex items-center">
            &larr; Back to Dashboard
          </a>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Group {letter}</h1>
          <p className="text-sm text-slate-400 mt-1">FIFA World Cup 2026</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Teams */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {groupTeams.map((team) => (
            <a
              key={team.id}
              href={`/team/${team.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all min-h-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span className="text-4xl shrink-0">{team.flag || "⚽"}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-white truncate">{team.name}</h3>
                <p className="text-sm text-slate-400">FIFA Rank #{team.fifaRank || "—"}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Fixtures */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Group Fixtures</h2>
          {(() => {
            const fixtures = groupFixtures[letter] || [];
            if (fixtures.length === 0) {
              return <EmptyState.Fixtures />;
            }
            const seen = new Set<string>();
            return (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Match</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Home</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Away</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date / Venue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fixtures
                        .filter(([date]) => {
                          const key = `${date}-${date}`;
                          if (seen.has(date)) return false;
                          seen.add(date);
                          return true;
                        })
                        .map(([date, homeId, awayId, venue]) => {
                          const homeTeam = getTeamById(homeId);
                          const awayTeam = getTeamById(awayId);
                          return (
                            <tr key={date} className="border-b border-slate-800/50 last:border-0">
                              <td className="px-4 py-3 text-slate-400">
                                Group Stage
                              </td>
                              <td className={`px-4 py-3 ${homeTeam && groupTeams.some(t => t.slug === homeTeam.slug) ? "text-white font-semibold" : "text-slate-400"}`}>
                                {homeTeam?.flag} {homeTeam?.name}
                              </td>
                              <td className={`px-4 py-3 text-center ${awayTeam && groupTeams.some(t => t.slug === awayTeam.slug) ? "text-white font-semibold" : "text-slate-400"}`}>
                                {awayTeam?.flag} {awayTeam?.name}
                              </td>
                              <td className="px-4 py-3 text-right text-slate-400 whitespace-nowrap">
                                <div>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
                                <div className="text-xs text-slate-400">{venue}</div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </section>
      </div>
    </>
  );
}
