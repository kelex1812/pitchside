// src/lib/data/persistence.ts — File-based persistence layer for follows & preferences.
// Works reliably for self-hosted / Docker deployments.
// On Vercel serverless, data is lost on cold start — that is the expected behavior.
// Future: swap to PostgreSQL / PlanetScale when DB integration is ready.

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FOLLOWS_FILE = path.join(DATA_DIR, "follows.json");
const PREFS_FILE = path.join(DATA_DIR, "preferences.json");

// Ensure data directory exists
function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generic typed JSON file store
function readJson<T>(filePath: string, fallback: T): T {
  try {
    ensureDir();
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(filePath: string, data: T): void {
  try {
    ensureDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Filesystem errors are non-fatal — fall back to in-memory in callers
  }
}

// Follows persistence
export function loadFollows(): Record<string, unknown[]> {
  return readJson<Record<string, unknown[]>>(FOLLOWS_FILE, {});
}

export function saveFollows(data: Record<string, unknown[]>): void {
  writeJson(FOLLOWS_FILE, data);
}

// Preferences persistence
export function loadPreferences(): Record<string, { timezone: string; theme: string }> {
  return readJson<Record<string, { timezone: string; theme: string }>>(PREFS_FILE, {});
}

export function savePreferences(data: Record<string, { timezone: string; theme: string }>): void {
  writeJson(PREFS_FILE, data);
}
