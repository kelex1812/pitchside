import StandingsTable from "./StandingsTable";
import type { Standing } from "@/data/types";

interface GroupStandingsProps {
  standings: Standing[];
  groupName: string;
}

export default function GroupStandings({ standings, groupName }: GroupStandingsProps) {
  if (!standings || standings.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800">
          <h3 className="font-bold text-white">Group {groupName}</h3>
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-slate-400 text-sm">No standings available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="font-bold text-white">Group {groupName}</h3>
      </div>
      <div className="px-4 py-2">
        <StandingsTable standings={standings} />
      </div>
    </div>
  );
}
