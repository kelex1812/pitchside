// Re-export NextAuth config and helpers for Pitchside R2 (v4)
export { authOptions } from "./auth.config";

// Server-side session access (used in API routes, server components)
export { getServerSession } from "next-auth";

// JWT token access (used in middleware)
export { getToken } from "next-auth/jwt";

// Client-side hooks
export { signIn, signOut, useSession } from "next-auth/react";
