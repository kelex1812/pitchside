"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "pitchside-following";

export function useFollowTeams() {
  const [followedTeamIds, setFollowedTeamIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const followTeam = useCallback((teamId: string) => {
    setFollowedTeamIds((prev) => {
      if (prev.includes(teamId)) return prev;
      const next = [...prev, teamId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const unfollowTeam = useCallback((teamId: string) => {
    setFollowedTeamIds((prev) => {
      const next = prev.filter((id) => id !== teamId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleFollow = useCallback(
    (teamId: string) => {
      if (followedTeamIds.includes(teamId)) {
        unfollowTeam(teamId);
      } else {
        followTeam(teamId);
      }
    },
    [followedTeamIds, followTeam, unfollowTeam]
  );

  const isFollowing = useCallback(
    (teamId: string) => followedTeamIds.includes(teamId),
    [followedTeamIds]
  );

  const clearAllFollows = useCallback(() => {
    setFollowedTeamIds([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    followedTeamIds,
    isHydrated,
    followTeam,
    unfollowTeam,
    toggleFollow,
    isFollowing,
    clearAllFollows,
  };
}
