// Skeleton loading placeholders with shimmer animation
// Usage: <Skeleton className="w-full h-4" />, <Skeleton.Wrapper />, <Skeleton.MatchCard />
//
// Example usage in a page:
//   const [loading, setLoading] = useState(true);
//   ...
//   {loading ? <Skeleton.TabContent /> : <ActualContent />}

export default function Skeleton({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-800 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Pre-built skeleton layouts for common components

Skeleton.MatchCard = function MatchCardSkeleton({ count = 3 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 animate-pulse"
        >
          {/* Header: date + status */}
          <div className="flex items-center justify-between">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-14 h-3" />
          </div>
          {/* Teams row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="w-16 h-5" />
            <div className="flex-1 flex items-center justify-end gap-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          </div>
          {/* Venue */}
          <Skeleton className="w-32 h-3" />
        </div>
      ))}
    </div>
  );
};

Skeleton.StandingsTable = function StandingsTableSkeleton({ count = 8 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 animate-pulse">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-6 h-4" />
          <Skeleton className="w-6 h-4" />
          <Skeleton className="w-6 h-4" />
          <Skeleton className="w-6 h-4 hidden sm:block" />
          <Skeleton className="w-8 h-4" />
        </div>
      ))}
    </div>
  );
};

Skeleton.GroupStandingsCard = function GroupStandingsCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden animate-pulse">
      <div className="px-4 py-3 border-b border-slate-800">
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="px-4 py-2 space-y-2">
        <Skeleton.StandingsTable count={4} />
      </div>
    </div>
  );
};

Skeleton.WeeklyStrip = function WeeklyStripSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex-shrink-0 w-72 rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 animate-pulse">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-14 h-3" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-24 h-4 flex-1" />
          </div>
          <Skeleton className="w-16 h-5" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-24 h-4 flex-1" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          <Skeleton className="w-32 h-3" />
        </div>
      ))}
    </div>
  );
};

Skeleton.LeadCard = function LeadCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-16" />
    </div>
  );
};

Skeleton.TournamentCard = function TournamentCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-36 h-5 mb-2" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
    </div>
  );
};

Skeleton.TeamCard = function TeamCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-3" />
    </div>
  );
};

Skeleton.LeagueCard = function LeagueCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="w-28 h-5" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-3" />
    </div>
  );
};

// Additional skeletons for tab content and page layouts

Skeleton.TabContent = function TabContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Tab heading */}
      <Skeleton className="w-48 h-6" />
      {/* Tab content - match cards */}
      <div className="space-y-3">
        <Skeleton.MatchCard count={4} />
      </div>
    </div>
  );
};

Skeleton.TournamentTabsContent = function TournamentTabsContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Groups section */}
      <div className="space-y-4">
        {Array.from({ length: 2 }, (_, i) => (
          <Skeleton.GroupStandingsCard key={i} />
        ))}
      </div>
    </div>
  );
};

Skeleton.LeagueTabsContent = function LeagueTabsContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="w-32 h-5" />
      <Skeleton.StandingsTable count={10} />
      <Skeleton className="w-40 h-5 mt-6" />
      <Skeleton.MatchCard count={4} />
    </div>
  );
};

Skeleton.KnockoutBracket = function KnockoutBracketSkeleton({ rounds = 5 }: { rounds?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: rounds }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <div className="space-y-2">
            {Array.from({ length: 2 }, (_, j) => (
              <div key={j} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-8 h-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-28 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

Skeleton.TeamDetail = function TeamDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-36 h-4" />
        </div>
      </div>
      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-40 h-3" />
          </div>
          <Skeleton.MatchCard count={5} />
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <Skeleton className="w-24 h-4" />
            <Skeleton.StandingsTable count={6} />
          </div>
        </div>
      </div>
    </div>
  );
};
