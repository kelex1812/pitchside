import { validGroups, wc2026Teams } from "@/data/teams";

interface GroupPageProps {
  params: Promise<{ letter: string }>;
}

export async function generateStaticParams() {
  return validGroups.map((letter) => ({ letter }));
}

export async function generateMetadata({ params }: GroupPageProps) {
  const { letter } = await params;
  const groupTeams = wc2026Teams.filter((t) => t.group === letter);
  const teamNames = groupTeams.map((t) => t.name).join(", ");
  return {
    title: `Group ${letter} — FIFA World Cup 2026`,
    description: `FIFA World Cup 2026 Group ${letter}: ${teamNames}`,
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { letter } = await params;
  const groupTeams = wc2026Teams.filter((t) => t.group === letter);

  if (groupTeams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center space-y-4">
          <p className="text-8xl font-bold text-emerald-400">404</p>
          <h1 className="text-2xl font-bold text-white">Group Not Found</h1>
          <p className="text-slate-400">Group {letter} does not exist.</p>
          <a href="/" className="inline-block px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors mb-4 block">
            &larr; Back to Dashboard
          </a>
          <h1 className="text-2xl font-bold text-white">Group {letter}</h1>
          <p className="text-sm text-slate-400 mt-1">FIFA World Cup 2026</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Teams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {groupTeams.map((team) => (
            <a
              key={team.id}
              href={`/team/${team.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all"
            >
              <span className="text-4xl">{team.flag || "\u26BD"}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                <p className="text-sm text-slate-400">FIFA Rank #{team.fifaRank || "—"}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Fixtures */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Group Fixtures</h2>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Match</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Home</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Away</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date / Venue</th>
                </tr>
              </thead>
              <tbody>
                {groupTeams.map((team) => {
                  const teamMatches = team.schedule || [];
                  return teamMatches.map((match, i) => {
                    const isHome = match.homeTeamId === team.id;
                    const opponent = match.opponent || "TBD";
                    return (
                      <tr key={match.date + i} className="border-b border-slate-800/50 last:border-0">
                        <td className="px-4 py-3 text-slate-400">
                          {match.stage && <span className="text-xs text-slate-500">{match.stage}</span>}
                        </td>
                        <td className={`px-4 py-3 ${isHome ? "text-white font-semibold" : "text-slate-400"}`}>
                          {team.name}
                        </td>
                        <td className={`px-4 py-3 text-center ${!isHome ? "text-white font-semibold" : "text-slate-400"}`}>
                          {opponent}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400">
                          <div>{new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                          <div className="text-xs text-slate-500">{match.venue}</div>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
