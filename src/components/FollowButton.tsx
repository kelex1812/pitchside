// src/components/FollowButton.tsx — Follow/Unfollow toggle for teams
"use client";

import { useState, useEffect } from "react";
import { useFollowTeams } from "@/hooks/useFollowTeams";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function FollowButton({ teamId, teamName }: { teamId: string; teamName?: string }) {
  const { isFollowing, toggleFollow, isLoading } = useFollowTeams();
  const { isAuthenticated } = useAuth();
  const [showAnonymousToast, setShowAnonymousToast] = useState(false);

  // Auto-dismiss toast after 4 seconds (AC: 3-5s range)
  useEffect(() => {
    if (showAnonymousToast) {
      const timer = setTimeout(() => setShowAnonymousToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showAnonymousToast]);

  const following = isFollowing(teamId);

  return (
    <>
      {/* Anonymous follow toast — fixed top-center banner */}
      {showAnonymousToast && (
        <div
          className="fixed left-0 right-0 top-0 z-50 px-3 py-2.5 bg-amber-500/90 backdrop-blur-sm border-b border-amber-400/50 shadow-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-amber-900 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-amber-900 font-medium">
              Sign in to sync your follows across devices
            </span>
            <Link
              href="/login"
              className="ml-1 text-sm font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-800 transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => setShowAnonymousToast(false)}
              className="ml-auto p-1 text-amber-800 hover:text-amber-900 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Dismiss notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Follow button */}
      {isLoading ? (
        <button
          disabled
          className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-600 border border-slate-700 cursor-wait min-h-[44px] min-w-[80px] flex items-center justify-center"
          aria-label="Loading follow status"
        >
          ...
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFollow(teamId, { name: teamName || "", slug: teamId });
            if (!isAuthenticated) {
              setShowAnonymousToast(true);
            }
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors min-h-[44px] min-w-[80px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            following
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
          }`}
          aria-label={following ? `Unfollow team` : `Follow team`}
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
      )}
    </>
  );
}
