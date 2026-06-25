"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useCallback, useEffect, useRef } from "react";

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFocusIndex, setMobileFocusIndex] = useState(-1);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  // Nav items that appear for all users
  const publicNavItems = [
    { label: "Home", href: "/" },
    { label: "Leagues", href: "/leagues" },
    { label: "International", href: "/international" },
    { label: "Search", href: "/search" },
  ];

  // Nav items that appear only when logged in
  const authNavItems = [
    { label: "Follows", href: "/feed" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/international") {
      return (
        pathname.startsWith("/international") ||
        pathname.startsWith("/tournament") ||
        pathname.startsWith("/national-team")
      );
    }
    if (href === "/leagues") {
      return pathname.startsWith("/leagues") || pathname.startsWith("/league/");
    }
    return pathname.startsWith(href);
  };

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Trap focus within mobile menu
  const handleMobileKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!mobileMenuOpen) return;
      const allLinks = mobileMenuRef.current?.querySelectorAll<HTMLAnchorElement>("a");
      if (!allLinks) return;
      const links = Array.from(allLinks);
      const visibleLinks = links.filter((l) => !l.getAttribute("hidden"));

      switch (e.key) {
        case "Escape":
          setMobileMenuOpen(false);
          firstMobileLinkRef.current?.focus();
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            setMobileFocusIndex((prev) => (prev <= 0 ? visibleLinks.length - 1 : prev - 1));
          } else {
            setMobileFocusIndex((prev) => (prev >= visibleLinks.length - 1 ? 0 : prev + 1));
          }
          visibleLinks[mobileFocusIndex]?.focus();
          break;
      }
    },
    [mobileMenuOpen, mobileFocusIndex]
  );

  // Stop body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Reset focus index when menu opens
  useEffect(() => {
    if (mobileMenuOpen) setMobileFocusIndex(0);
  }, [mobileMenuOpen]);

  const allNavItems = [...publicNavItems, ...(isAuthenticated ? authNavItems : [])];

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50" role="banner">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg" aria-label="Pitchside home">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Pitchside
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                isActive(item.href)
                  ? "text-white bg-slate-800"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated &&
            authNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "text-white bg-slate-800"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        {/* Right: Mobile hamburger + Auth */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg p-1 hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Auth button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-colors"
                  aria-label="Account menu"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-emerald-400">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-20">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <p className="text-sm font-medium text-white truncate">
                          {user.name}
                        </p>
                        {user.email && (
                          <p className="text-xs text-slate-400 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setShowDropdown(false)}
                        className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        Account
                      </Link>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors min-h-[44px] flex items-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        hidden={!mobileMenuOpen}
        onKeyDown={handleMobileKeyDown}
        className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
          {allNavItems.map((item) => (
            <Link
              key={item.href}
              ref={item === allNavItems[0] ? firstMobileLinkRef : undefined}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "text-white bg-slate-800"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              } min-h-[44px] flex items-center`}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile auth link */}
          {!isAuthenticated && (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center px-3 py-2.5 text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors min-h-[44px] flex items-center justify-center"
            >
              Sign In
            </Link>
          )}
          {isAuthenticated && user && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg min-h-[44px] flex items-center"
              >
                {user.name}
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
