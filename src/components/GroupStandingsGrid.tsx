import Link from "next/link";
import StandingsTable from "./StandingsTable";
import type { Standing } from "@/data/types";

interface GroupStandingsGridProps {
  groups: Standing[][];
}

export default function GroupStandingsGrid({ groups }: GroupStandingsGridProps) {
  const groupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {groupLetters.map((letter, i) => {
        const standings = groups[i];
        if (!standings || standings.length === 0) return null;

        return (
          <div
            key={letter}
            className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all"
          >
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-800">
              <Link
                href={`/group/${letter}`}
                className="flex items-center justify-between group"
              >
                <h3 className="font-bold text-white text-sm sm:text-base">Group {letter}</h3>
                <span className="text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                  View →
                </span>
              </Link>
            </div>
            <div className="px-2 sm:px-4 py-1 sm:py-2">
              <StandingsTable standings={standings} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
