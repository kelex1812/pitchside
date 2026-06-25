import { useState } from "react";
import Image from "next/image";
import CountdownRing from "./CountdownRing";
import StandingsTable from "./StandingsTable";
import FollowButton from "./FollowButton";
import type { Team } from "@/data/types";

interface TeamCardProps {
  team: Team;
  showFlag?: boolean;
  showLeague?: boolean;
  onClick?: () => void;
  href?: string;
}

export default function TeamCard({ team, showFlag = true, showLeague = true, onClick, href }: TeamCardProps) {
  const LinkComponent = (href ? "a" : "div") as React.ElementType;
  const tagProps = href ? { href, className: "block focus:outline-none" } : {};

  return (
    <LinkComponent
      {...tagProps}
      className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all hover:border-slate-700 cursor-pointer"
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: team.primaryColor || "#10b981",
      }}
      role="region"
      aria-label={`${team.name} team card`}
      onClick={() => onClick?.()}
    >
      {/* Team Header */}
      <div className="px-5 py-4 flex items-center gap-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          {team.crestUrl ? (
            <Image
              src={team.crestUrl}
              alt={`${team.name} crest`}
              width={48}
              height={48}
              className="rounded-lg object-contain"
            />
          ) : (
            <span className="text-3xl">{team.flag || "\u26BD"}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate">{team.name}</h3>
          {showLeague && <p className="text-xs text-slate-400 truncate">{team.leagueName || team.group ? `Group ${team.group}` : ""}</p>}
        </div>
        <FollowButton teamId={team.id} />
      </div>
    </LinkComponent>
  );
}
