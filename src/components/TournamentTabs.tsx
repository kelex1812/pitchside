"use client";

import { useRef, useCallback } from "react";
import type { Tournament } from "@/data/types";

interface TournamentTabsProps {
  tournament: Tournament;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TournamentTabs({
  tournament,
  activeTab,
  onTabChange,
}: TournamentTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const hasGroups = tournament.stages.some(
    (s) => !s.isKnockout
  );
  const hasKnockout = tournament.stages.some(
    (s) => s.isKnockout
  );

  const tabs = [
    ...(hasGroups ? [{ label: "Groups", value: "groups" }] : []),
    ...(tournament.stages.some((s) => s.name === "Standings" || hasGroups)
      ? [{ label: "Standings", value: "standings" }]
      : []),
    { label: "Fixtures", value: "fixtures" },
    ...(hasKnockout ? [{ label: "Knockout", value: "knockout" }] : []),
    { label: "Teams", value: "teams" },
  ];

  // Ensure at least one tab is selected
  const defaultTab = tabs.length > 0 ? tabs[0].value : "fixtures";
  const currentTab = tabs.find((t) => t.value === activeTab)
    ? activeTab
    : defaultTab;

  // Keyboard navigation: arrow keys, Home, End
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((t) => t.value === currentTab);

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
    [currentTab, tabs]
  );

  return (
    <div className="border-b border-slate-800" role="tablist" aria-label="Tournament navigation tabs">
      <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
        {tabs.map((tab, index) => {
          const isActive = currentTab === tab.value;

          return (
            <button
              key={tab.value}
              id={`${tab.value}-tab`}
              onClick={() => onTabChange(tab.value)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.value}`}
              tabIndex={isActive ? 0 : -1}
              ref={(el) => { tabRefs.current[index] = el; }}
              onKeyDown={handleKeyDown}
              className={`px-3 sm:px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
