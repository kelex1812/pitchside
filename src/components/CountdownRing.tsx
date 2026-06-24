"use client";

interface CountdownRingProps {
  days: number;
  hours: number;
  teamColor?: string;
}

export default function CountdownRing({ days, hours, teamColor }: CountdownRingProps) {
  const totalHours = days * 24 + hours;
  const circumference = 2 * Math.PI * 28;
  const progress = Math.max(0, Math.min(1, totalHours / (30 * 24)));
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative w-14 h-14">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
        {/* Background ring */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#1e293b"
          strokeWidth="4"
        />
        {/* Progress ring */}
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={teamColor || "#10b981"}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {days > 0 ? (
          <>
            <span className="text-sm font-bold text-white leading-none">{days}</span>
            <span className="text-[8px] text-slate-500 leading-none">days</span>
          </>
        ) : (
          <>
            <span className="text-sm font-bold text-white leading-none">{hours}</span>
            <span className="text-[8px] text-slate-500 leading-none">hrs</span>
          </>
        )}
      </div>
    </div>
  );
}
