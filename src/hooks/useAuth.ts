"use client";

import { useSession, signIn as nextSignIn, signOut as nextSignOut } from "next-auth/react";

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  provider: "google" | "github";
  providerId: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  session: unknown;
  isLoading: boolean;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  signIn: (provider: "google" | "github", opts?: { callbackUrl?: string }) => Promise<void>;
  signOut: (opts?: { callbackUrl?: string }) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updateTimezone: (timezone: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status, update } = useSession();

  const user = session?.user
    ? {
        id: (session.user as any).userId || (session.user as any).providerId || "",
        name: session.user.name || "",
        email: session.user.email,
        image: session.user.image,
        provider: (session.user as any).provider || "google",
        providerId: (session.user as any).providerId || "",
      }
    : null;

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const isUnauthenticated = status === "unauthenticated";

  const signIn = async (provider: "google" | "github", opts?: { callbackUrl?: string }) => {
    await nextSignIn(provider, { callbackUrl: opts?.callbackUrl || window.location.href });
  };

  const signOut = async (opts?: { callbackUrl?: string }) => {
    await nextSignOut({ callbackUrl: opts?.callbackUrl || "/" });
  };

  // Update user display name via API
  const updateDisplayName = async (name: string) => {
    if (!isAuthenticated) return;
    try {
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name }),
      });
      await update();
    } catch {
      // Silent fail — will retry on next session refresh
    }
  };

  // Update user timezone via API
  const updateTimezone = async (timezone: string) => {
    if (!isAuthenticated) return;
    try {
      await fetch("/api/user-preference", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone }),
      });
    } catch {
      // Silent fail
    }
  };

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    isUnauthenticated,
    signIn,
    signOut,
    updateDisplayName,
    updateTimezone,
  };
}
