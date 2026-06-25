// src/lib/data/follows.ts — Follow repository layer (per architecture §4.6)
// All functions are async for future API swap compatibility.
// Uses file-based JSON store (data/follows.json) for persistence.
// Note on Vercel serverless: file writes are lost on cold start — expected behavior.
// Future: swap to PostgreSQL when DB integration is ready.
import { Follow } from "@/data/types";
import { loadFollows, saveFollows } from "./persistence";

// In-memory cache to avoid repeated disk reads during a single request
let cache: Record<string, Follow[]> | null = null;

function getCache(): Record<string, Follow[]> {
  if (cache === null) {
    const raw = loadFollows();
    cache = Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, v as Follow[]])
    );
  }
  return cache;
}

function persist(): void {
  saveFollows(cache || {});
}

export async function getUserFollows(userId: string): Promise<Follow[]> {
  const store = getCache();
  return store[userId] || [];
}

export async function createFollow(userId: string, teamId: string): Promise<Follow> {
  const store = getCache();
  const existing = store[userId] || [];

  // Avoid duplicates
  if (existing.some((f) => f.teamId === teamId)) {
    return existing.find((f) => f.teamId === teamId)!;
  }

  const follow: Follow = {
    id: `follow_${userId}_${teamId}_${Date.now()}`,
    userId,
    teamId,
    createdAt: new Date(),
  };

  store[userId] = [...existing, follow];
  persist();
  return follow;
}

export async function deleteFollow(userId: string, teamId: string): Promise<void> {
  const store = getCache();
  const existing = store[userId] || [];
  const filtered = existing.filter((f) => f.teamId !== teamId);
  store[userId] = filtered;
  persist();
}

export async function isFollowing(userId: string, teamId: string): Promise<boolean> {
  const follows = getCache()[userId] || [];
  return follows.some((f) => f.teamId === teamId);
}
