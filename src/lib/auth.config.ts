// NextAuth.js v4 configuration for Pitchside R2
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

// Validate required env vars at module load time
const requiredAuthVars = ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET", "AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET"];
for (const envVar of requiredAuthVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
if (!process.env.AUTH_SECRET) {
  throw new Error(
    "Missing required environment variable: AUTH_SECRET. " +
    "Generate one with: npx auth secret"
  );
}

declare module "next-auth" {
  interface User {
    userId?: string;
    provider?: string;
    providerId?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string | null;
      image: string | null;
      provider?: string;
      providerId?: string;
      userId?: string;
      _csrfToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    providerId?: string;
    userId?: string;
    _csrfToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (reduced from 30)
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days (reduced from 30)
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        (token as any).provider = account.provider;
        (token as any).providerId = account.providerId;
        (token as any).userId = account.providerId;
        // Generate CSRF token once on first login / token creation
        // and embed it in the JWT so it persists across requests
        if (!token._csrfToken) {
          const tokenBytes = Array.from(crypto.getRandomValues(new Uint8Array(20)))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          (token as any)._csrfToken = tokenBytes;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = token.provider as "google" | "github";
        (session.user as any).providerId = token.providerId as string;
        (session.user as any).userId = token.userId as string;
        // Pass CSRF token from JWT to session so API routes can verify it
        (session.user as any)._csrfToken = token._csrfToken as string | undefined;
      }
      return session;
    },
  },
};
