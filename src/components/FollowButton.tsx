"use client";

import { useFollowTeams } from "@/hooks/useFollowTeams";

export default function FollowButton({ teamId }: { teamId: string }) {
  const { isHydrated, isFollowing, toggleFollow } = useFollowTeams();

  if (!isHydrated) {
    return (
      <button
        disabled
        className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-600 border border-slate-700 cursor-wait"
      >
        ...
      </button>
    );
  }

  const following = isFollowing(teamId);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggleFollow(teamId); }}
      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
        following
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
          : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
      }`}
      aria-label={
        following ? `Unfollow team` : `Follow team`
      }
      aria-pressed={following}
    >
      {following ? (
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Following
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Follow
        </span>
      )}
    </button>
  );
}
