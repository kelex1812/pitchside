"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import type { Team } from "@/data/types";
import { getCountdown, getBrowserTimezone } from "@/lib/time";

interface CountdownRingProps {
  match: { kickoff: string; status: string };
  userTimezone?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  homeTeam?: Team;
  awayTeam?: Team;
}

export default function CountdownRing({
  match,
  userTimezone = "UTC",
  showLabel = true,
  size = "md",
  homeTeam,
  awayTeam,
}: CountdownRingProps) {
  const now = useMemo(() => Date.now(), []);

  const countDown = useMemo(() => {
    return getCountdown(match.kickoff, userTimezone);
  }, [match.kickoff, userTimezone, now]);

  // Get theme color from home or away team
  const themeColor = homeTeam?.primaryColor || awayTeam?.primaryColor || "#10b981";

  // Determine display text
  const isPast = countDown.totalMinutes === 0 && match.status !== "live";
  const displayText = isPast
    ? "FT"
    : countDown.days > 0
      ? `${countDown.days}d ${countDown.hours}h`
      : countDown.hours > 0
        ? `${countDown.hours}h ${countDown.minutes}m`
        : `${countDown.minutes}m`;

  // SVG sizes
  const sizes = { sm: 56, md: 64, lg: 80 };
  const radius = { sm: 24, md: 28, lg: 35 };
  const stroke = { sm: 3, md: 4, lg: 5 };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  const diameter = radius[size] * 2;
  const circumference = 2 * Math.PI * radius[size];

  // Progress: full ring = 30 days, map countdown to 0-1
  const totalHours = countDown.days * 24 + countDown.hours;
  const progress = Math.max(0, Math.min(1, totalHours / (30 * 24)));
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex flex-col items-center">
      <div
        className="relative"
        style={{ width: sizes[size], height: sizes[size] }}
      >
        <svg
          className="w-full h-full -rotate-90"
          viewBox={`0 0 ${diameter} ${diameter}`}
        >
          {/* Background ring */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius[size]}
            fill="none"
            stroke="#1e293b"
            strokeWidth={stroke[size]}
          />
          {/* Progress ring */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius[size]}
            fill="none"
            stroke={themeColor}
            strokeWidth={stroke[size]}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${textSizes[size]} font-bold text-white leading-none`}>
            {displayText}
          </span>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span className="text-[10px] text-slate-400 mt-1 leading-none">
          {isPast ? "Full Time" : "Countdown"}
        </span>
      )}
    </div>
  );
}
