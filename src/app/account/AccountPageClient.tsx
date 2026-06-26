// Account Page Client Component
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFollowTeams } from "@/hooks/useFollowTeams";
import { allTeams } from "@/data/teams";
import { Team } from "@/data/types";
import Link from "next/link";

export default function AccountPageClient() {
  const { user, signOut, isAuthenticated, updateDisplayName, updateTimezone } = useAuth();
  const { followedTeams } = useFollowTeams();
  const [timezone, setTimezone] = useState("UTC");
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState("");

  // Toast for anonymous users
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Redirect if not logged in (show toast first)
  useEffect(() => {
    if (!isAuthenticated) {
      setToast({ message: "Please sign in to access your account", type: "error" });
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
  }, [isAuthenticated]);

  // Load user's timezone from API on mount
  useEffect(() => {
    if (user) {
      setDisplayName(user.name);
      loadPreferences();
    }
  }, [user]);

  async function loadPreferences() {
    try {
      const res = await fetch("/api/user-preference");
      if (!res.ok) return;
      const data = await res.json();
      setTimezone(data.timezone || "UTC");
    } catch {
      // Silent fail
    }
  }

  // Get followed teams with full data
  const followedTeamData: Team[] = followedTeams
    .map((ft) => allTeams.find((t) => t.id === ft.teamId || t.slug === ft.teamId))
    .filter((t): t is Team => !!t);

  const handleSaveTimezone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTimezone(timezone);
      setToast({ message: "Timezone saved successfully", type: "success" });
      setSaved(true);
      setTimeout(() => setToast(null), 3000);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setToast({ message: "Failed to save timezone", type: "error" });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading account...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Account
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Profile, preferences & follows</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center px-3">
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
          toast.type === "success"
            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
            : "bg-red-500/20 border-red-500/40 text-red-300"
        }`} role="alert">
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-4 sm:mb-6">Profile</h2>

          <div className="flex items-center gap-4 mb-6">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-slate-700"
                loading="lazy"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-emerald-400">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white truncate">{user.name}</h3>
              <p className="text-sm text-slate-400 truncate">{user.email || "No email"}</p>
              <p className="text-xs text-slate-400 mt-1">
                Signed in with {user.provider}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-sm min-h-[44px] w-full sm:w-auto"
          >
            Sign Out
          </button>
        </section>

        {/* Timezone Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-2 sm:mb-4">Timezone</h2>
          <p className="text-sm text-slate-400 mb-4">
            Match times will display in your selected timezone.
          </p>

          <form onSubmit={handleSaveTimezone} className="flex flex-col sm:flex-row gap-3">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px]"
              aria-label="Select timezone"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT/BST)</option>
              <option value="Europe/Paris">Paris (CET/CEST)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm min-h-[44px] w-full sm:w-auto"
            >
              {saved ? "Saved ✓" : "Save"}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {saved ? "Timezone saved successfully" : ""}
            </span>
          </form>
        </section>

        {/* Followed Teams Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Followed Teams ({followedTeamData.length})
          </h2>

          <div aria-live="polite" role="status">
            {followedTeamData.length === 0 ? (
              <p className="text-sm text-slate-400">
                You haven&apos;t followed any teams yet. Browse teams to start following.
              </p>
            ) : (
            <ul className="space-y-2" role="list">
              {followedTeamData.map((team) => (
                <li
                  key={team.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors min-h-[44px]"
                >
                  <span className="text-xl sm:text-2xl shrink-0">{team.flag || "⚽"}</span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/team/${team.slug}`}
                      className="text-sm font-medium text-white hover:text-emerald-400 transition-colors truncate block min-h-[44px] flex items-center"
                    >
                      {team.name}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {team.leagueName || team.group ? `Group ${team.group}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          </div>
        </section>

        {/* Notifications Placeholder */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-2 sm:mb-4">Notifications</h2>
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-sm text-amber-400 font-medium mb-1">Coming in a future release</p>
            <p className="text-xs text-slate-400">
              Match reminders, transfer alerts, and team news notifications are coming soon.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
