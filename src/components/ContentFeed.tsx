import { generateContentForTeam } from "@/data/teams";
import type { ContentItem, Team } from "@/data/types";

interface ContentFeedProps {
  team: Team;
}

export default function ContentFeed({ team }: ContentFeedProps) {
  const content = generateContentForTeam(team);

  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No content available for {team.name}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                item.type === "preview"
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {item.type === "preview" ? "PREVIEW" : "RECAP"}
            </span>
            <span className="text-xs text-slate-400">{item.publishedAt}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{item.body}</p>
          {item.score && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span>Score: {item.score.home} - {item.score.away}</span>
              <span>·</span>
              <span>{item.venue}</span>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
