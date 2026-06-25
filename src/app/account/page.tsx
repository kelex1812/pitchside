// Account Page — User profile, timezone, followed teams list, notifications placeholder
// Protected route: requires authentication
import type { Metadata } from "next";
import AccountPageClient from "./AccountPageClient";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Account | Pitchside",
  description: "Manage your profile, timezone preferences, and followed teams.",
  openGraph: {
    title: "Account | Pitchside",
    description: "Manage your profile and preferences.",
  },
  twitter: {
    title: "Account | Pitchside",
    description: "Manage your profile and preferences.",
  },
};

export default function AccountPage() {
  return (
    <>
      <AccountPageClient />
      <Footer />
    </>
  );
}
