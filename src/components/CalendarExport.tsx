"use client";

import { useState } from "react";
import type { Team } from "@/data/types";
import { allTeams } from "@/data/teams";

interface CalendarExportProps {
  teams?: Team[];
}

function formatICSDate(isoDate: string): string {
  const d = new Date(isoDate);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export default function CalendarExport({ teams: propTeams }: CalendarExportProps) {
  const teams = propTeams || allTeams;
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleExport = () => {
    const matches: { date: string; homeTeam: string; awayTeam: string; stage: string; venue: string; group?: string }[] = [];

    for (const teamId of selectedTeamIds) {
      const team = teams.find((t) => t.id === teamId);
      if (!team) continue;

      const schedule = team.schedule || [];
      for (const match of schedule) {
        // Use current Match type: homeTeamId/awayTeamId to determine home/away, homeTeam/awayTeam for display
        const isHomeMatch = match.homeTeamId === team.id;
        const opponentName = isHomeMatch ? match.awayTeam ?? match.awayTeamName ?? "" : match.homeTeam ?? match.homeTeamName ?? "";
        matches.push({
          date: match.date ?? "",
          homeTeam: isHomeMatch ? team.name : opponentName,
          awayTeam: isHomeMatch ? opponentName : team.name,
          stage: match.stage || "Friendly",
          venue: match.venue || "TBD",
        });
      }
    }

    if (matches.length === 0) return;

    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pitchside//Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:Pitchside - ${selectedTeamIds.length} Team(s) Schedule`,
    ];

    for (const match of matches) {
      const uid = `pitch-${match.homeTeam}-${match.awayTeam}-${match.date.replace(/[:.]/g, "-")}`;
      const dtstart = formatICSDate(match.date);

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTART:${dtstart}`);
      lines.push("DURATION:PT2H");
      lines.push(`SUMMARY:${escapeICS(`${match.homeTeam} vs ${match.awayTeam}`)}`);
      lines.push(`DESCRIPTION:${escapeICS(`${match.stage}${match.group ? ` (Group ${match.group})` : ""}`)}`);
      lines.push(`LOCATION:${escapeICS(match.venue)}`);
      lines.push("BEGIN:VALARM");
      lines.push("TRIGGER:-PT1H");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:Reminder: ${escapeICS(`${match.homeTeam} vs ${match.awayTeam}`)}`);
      lines.push("END:VALARM");
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");

    const icsContent = lines.join("\r\n");
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pitchside-calendar-${selectedTeamIds.length}-teams.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowPicker(false);
  };

  const toggleTeam = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
        aria-haspopup="true"
        aria-expanded={showPicker}
      >
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendar
        </span>
      </button>

      {showPicker && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-700 bg-slate-900 shadow-xl z-50 p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Select Teams</h3>
          <div className="max-h-60 overflow-y-auto space-y-1 mb-3">
            {teams.map((team) => (
              <label
                key={team.id}
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={selectedTeamIds.includes(team.id)}
                  onChange={() => toggleTeam(team.id)}
                  className="rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
                <span className="truncate">{team.name}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{selectedTeamIds.length} selected</span>
            <button
              onClick={handleExport}
              disabled={selectedTeamIds.length === 0}
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export .ics
            </button>
          </div>
        </div>
      )}

      {showPicker && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setShowPicker(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
