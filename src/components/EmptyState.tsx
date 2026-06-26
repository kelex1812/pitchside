// EmptyState component with icon, title, description, and optional CTA
// Usage:
//   <EmptyState icon="🔍" title="No leagues match your search" href="/leagues" ctaText="Browse All Leagues" />
//   <EmptyState.Search query="foo" />
//   <EmptyState.Feed />
//   <EmptyState.NoMatches />

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  href?: string;
  ctaText?: string;
  secondaryHref?: string;
  secondaryText?: string;
  compact?: boolean;
}

const ICONS = {
  search: (
    <svg className="w-10 h-10 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  football: (
    <span className="text-5xl opacity-40 block text-center mb-4" role="img" aria-label="football">
      ⚽
    </span>
  ),
  trophy: (
    <svg className="w-10 h-10 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14M5 3v3a7 7 0 007 7h0a7 7 0 007-7V3M9 21h6M12 13v8" />
    </svg>
  ),
  bell: (
    <svg className="w-10 h-10 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  calendar: (
    <svg className="w-10 h-10 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  team: (
    <svg className="w-10 h-10 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
} as const;

export default function EmptyState({
  icon,
  title,
  description,
  href,
  ctaText,
  secondaryHref,
  secondaryText,
  compact,
}: EmptyStateProps) {
  const iconEl = icon || ICONS.football;
  const sizeClass = compact ? "py-8 px-4" : "py-16 px-4";

  return (
    <div className={`text-center ${sizeClass}`} role="status" aria-live="polite">
      <div className="mb-4">{iconEl}</div>
      <h3 className={`font-semibold text-white ${compact ? "text-base" : "text-lg"} mb-2`}>
        {title}
      </h3>
      {description && (
        <p className={`text-slate-400 mb-6 max-w-md mx-auto ${compact ? "text-xs" : "text-sm"}`}>
          {description}
        </p>
      )}
      {(href || secondaryHref) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {href && ctaText && (
            <a
              href={href}
              className="px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium min-w-[120px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {ctaText}
            </a>
          )}
          {secondaryHref && secondaryText && (
            <a
              href={secondaryHref}
              className="px-5 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-sm min-w-[120px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            >
              {secondaryText}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-built empty states for common use cases

EmptyState.Search = function SearchEmptyState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={ICONS.search}
      title={query ? `No teams match "${query}"` : "No teams found"}
      description={query ? "Try adjusting your search or filters." : "Start by searching for a team name, league, or competition."}
      href="/leagues"
      ctaText="Browse Leagues"
    />
  );
};

EmptyState.Feed = function FeedEmptyState() {
  return (
    <EmptyState
      icon={ICONS.team}
      title="No teams followed yet"
      description="Browse leagues to follow teams! Their matches and updates will appear here."
      href="/leagues"
      ctaText="Browse Leagues"
      secondaryHref="/international"
      secondaryText="International"
    />
  );
};

EmptyState.Leagues = function LeaguesEmptyState() {
  return (
    <EmptyState
      icon={ICONS.trophy}
      title="No leagues match your search"
      description="Try a different search term or check back when new leagues are added."
    />
  );
};

EmptyState.Fixtures = function FixturesEmptyState() {
  return (
    <EmptyState
      icon={ICONS.calendar}
      title="No fixtures scheduled for this stage"
      description="Fixture data will be populated as the tournament progresses."
    />
  );
};

EmptyState.NoMatches = function NoMatchesEmptyState() {
  return (
    <EmptyState
      icon={ICONS.football}
      title="No match data available yet"
      description="Match data will be populated as tournament fixtures are seeded."
    />
  );
};
