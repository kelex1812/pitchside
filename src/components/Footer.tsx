// Shared Footer component — consistent across all pages
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/30 mt-12" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand column */}
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Pitchside
            </h2>
            <p className="text-sm text-slate-400">
              Unified sports dashboard tracking club teams and all 48 FIFA World Cup 2026 teams.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Navigate
            </h3>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                Home
              </Link>
              <Link href="/leagues" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                Leagues
              </Link>
              <Link href="/international" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                International
              </Link>
              <Link href="/search" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                Search
              </Link>
            </nav>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Explore
            </h3>
            <nav aria-label="Explore navigation" className="flex flex-col gap-2">
              <Link href="/international" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                World Cup 2026
              </Link>
              <Link href="/leagues?filter=club" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                Club Leagues
              </Link>
              <Link href="/feed" className="text-sm text-slate-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                My Feed
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Pitchside. Data seeded with 2026 season information. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
