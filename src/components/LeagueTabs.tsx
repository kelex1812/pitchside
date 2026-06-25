"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";

interface LeagueTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function LeagueTabs({ activeTab, onTabChange }: LeagueTabsProps) {
  const pathname = usePathname();
  const slug = pathname?.split("/league/")[1]?.split("/")[0] || "";
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const tabs = [
    { label: "Standings", value: "standings", href: `/league/${slug}` },
    { label: "Fixtures", value: "fixtures", href: `/league/${slug}/fixtures` },
    { label: "Teams", value: "teams", href: `/league/${slug}/teams` },
  ];

  // Keyboard navigation: arrow keys, Home, End
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((t) => {
        const isActive =
          activeTab === t.value ||
          (t.value === "standings" && pathname === t.href);
        return isActive;
      });

      let newIndex = currentIndex;
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case "ArrowRight":
        case "ArrowDown":
          newIndex = (currentIndex + 1) % tabs.length;
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      tabRefs.current[newIndex]?.focus();
    },
    [activeTab, pathname, tabs]
  );

  return (
    <div className="border-b border-slate-800" role="tablist" aria-label="League navigation tabs">
      <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {tabs.map((tab, index) => {
          const isActive =
            activeTab === tab.value ||
            (tab.value === "standings" && pathname === tab.href);

          return (
            <Link
              key={tab.value}
              href={tab.href}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey) return;
                onTabChange(tab.value);
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.value}`}
              tabIndex={isActive ? 0 : -1}
              ref={(el) => { tabRefs.current[index] = el; }}
              onKeyDown={handleKeyDown}
              className={`px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap min-h-[44px] flex items-center ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
