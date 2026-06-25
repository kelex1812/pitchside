"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

const STORAGE_KEY = "pitchside-following";

interface TeamFollow {
  teamId: string;
  teamName: string;
  teamSlug: string;
  teamFlag?: string;
  teamCrestUrl?: string;
}

export interface UseFollowTeamsReturn {
  followedTeamIds: string[];
  followedTeams: TeamFollow[];
  isFollowing: (teamId: string) => boolean;
  followTeam: (teamId: string, teamData?: { name?: string; slug?: string; flag?: string; crestUrl?: string }) => Promise<void>;
  unfollowTeam: (teamId: string) => Promise<void>;
  toggleFollow: (teamId: string, teamData?: { name?: string; slug?: string; flag?: string; crestUrl?: string }) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  migrationComplete: boolean;
  migrating: boolean;
}

let cachedCsrfToken: string | null = null;

/**
 * Fetch the CSRF token from the API endpoint.
 * This persists the token via a cookie and returns it in the response.
 * Results are cached per client session to avoid repeated calls.
 */
async function fetchCsrfToken(): Promise<string | null> {
  if (cachedCsrfToken) return cachedCsrfToken;
  try {
    const res = await fetch("/api/csrf");
    if (!res.ok) return null;
    const data = await res.json();
    cachedCsrfToken = data.csrfToken;
    return cachedCsrfToken;
  } catch {
    return null;
  }
}

export function useFollowTeams(): UseFollowTeamsReturn {
  const { user, isAuthenticated } = useAuth();
  const [followedTeams, setFollowedTeams] = useState<TeamFollow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrating, setMigrating] = useState(false);

  // Load from localStorage (anonymous mode)
  const loadLocalStorage = useCallback((): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Save to localStorage (anonymous mode)
  const saveLocalStorage = useCallback((teamIds: string[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teamIds));
    } catch {
      // Silent fail
    }
  }, []);

  // Sync localStorage to DB when user logs in
  useEffect(() => {
    if (!isAuthenticated && !user && !migrationComplete) {
      // Still anonymous — load from localStorage
      const teamIds = loadLocalStorage();
      if (teamIds.length === 0) {
        setMigrationComplete(true);
        setIsLoading(false);
        return;
      }
      // Load team data for localStorage-followed teams
      fetchTeamDataAndSet(teamIds);
    }
  }, [isAuthenticated, user, migrationComplete, loadLocalStorage]);

  // Load followed teams when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFollowedTeams();
      migrateLocalStorage();
    }
  }, [isAuthenticated, user]);

  async function fetchTeamDataAndSet(teamIds: string[]) {
    try {
      const res = await fetch("/api/teams");
      if (!res.ok) {
        // Fallback: create minimal team objects
        setFollowedTeams(
          teamIds.map((id) => ({ teamId: id, teamName: id, teamSlug: id }))
        );
        setIsLoading(false);
        return;
      }
      const allTeams = await res.json();
      const teams = teamIds
        .map((id: string) =>
          allTeams.find((t: any) => t.id === id || t.slug === id)
        )
        .filter(Boolean)
        .map((t: any) => ({
          teamId: t.id,
          teamName: t.name,
          teamSlug: t.slug,
          teamFlag: t.flag,
          teamCrestUrl: t.crestUrl,
        }));
      setFollowedTeams(teams);
    } catch {
      setFollowedTeams(
        teamIds.map((id) => ({ teamId: id, teamName: id, teamSlug: id }))
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadFollowedTeams() {
    try {
      const res = await fetch("/api/follows");
      if (!res.ok) {
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setFollowedTeams(data);
    } catch {
      // Silent fail — fall through to localStorage
    } finally {
      setIsLoading(false);
    }
  }

  async function migrateLocalStorage() {
    if (migrationComplete || migrating || !user) return;

    const teamIds = loadLocalStorage();
    if (teamIds.length === 0) {
      setMigrationComplete(true);
      return;
    }

    setMigrating(true);

    try {
      const csrfToken = await fetchCsrfToken();
      for (const teamId of teamIds) {
        await fetch("/api/follows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
          },
          body: JSON.stringify({ teamId }),
        });
      }
      localStorage.removeItem(STORAGE_KEY);
      setMigrationComplete(true);
      await loadFollowedTeams();
    } catch {
      // Migration failed — keep localStorage data
    } finally {
      setMigrating(false);
    }
  }

  async function followTeam(teamId: string, teamData?: { name?: string; slug?: string; flag?: string; crestUrl?: string }) {
    if (!isAuthenticated) {
      // Anonymous follow — use localStorage
      const current = loadLocalStorage();
      if (!current.includes(teamId)) {
        const next = [...current, teamId];
        saveLocalStorage(next);
        if (teamData) {
          setFollowedTeams((prev) => {
            if (prev.find((t) => t.teamId === teamId)) return prev;
            return [...prev, { teamId, teamName: teamData?.name || "", teamSlug: teamData?.slug || "", teamFlag: teamData?.flag, teamCrestUrl: teamData?.crestUrl }];
          });
        }
      }
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken();
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({ teamId }),
      });
      if (!res.ok) throw new Error("Failed to follow");
      await loadFollowedTeams();
    } catch {
      // Fall back to localStorage
      const current = loadLocalStorage();
      if (!current.includes(teamId)) {
        saveLocalStorage([...current, teamId]);
      }
    }
  }

  async function unfollowTeam(teamId: string) {
    if (!isAuthenticated) {
      const current = loadLocalStorage();
      const next = current.filter((id: string) => id !== teamId);
      saveLocalStorage(next);
      setFollowedTeams((prev) => prev.filter((t) => t.teamId !== teamId));
      return;
    }

    try {
      const csrfToken = await fetchCsrfToken();
      await fetch(`/api/follows/${teamId}`, {
        method: "DELETE",
        headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {},
      });
      await loadFollowedTeams();
    } catch {
      // Fall back to localStorage
      const current = loadLocalStorage();
      const next = current.filter((id: string) => id !== teamId);
      saveLocalStorage(next);
      setFollowedTeams((prev) => prev.filter((t) => t.teamId !== teamId));
    }
  }

  async function toggleFollow(teamId: string, teamData?: { name?: string; slug?: string; flag?: string; crestUrl?: string }) {
    const isFollowing = followedTeams.some((t) => t.teamId === teamId);
    if (isFollowing) {
      await unfollowTeam(teamId);
    } else {
      await followTeam(teamId, teamData);
    }
  }

  const isFollowing = useCallback(
    (teamId: string) => followedTeams.some((t) => t.teamId === teamId),
    [followedTeams]
  );

  return {
    followedTeamIds: followedTeams.map((t) => t.teamId),
    followedTeams,
    isFollowing,
    followTeam,
    unfollowTeam,
    toggleFollow,
    isLoading,
    isAuthenticated,
    migrationComplete,
    migrating,
  };
}
