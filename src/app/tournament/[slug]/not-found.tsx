export default function TournamentNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative inline-block">
          <svg
            className="w-24 h-24 text-emerald-400 opacity-60"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" />
            <path d="M48 8 L48 24 M48 72 L48 88 M8 48 L24 48 M72 48 L88 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="48" cy="48" r="16" stroke="currentColor" strokeWidth="3" />
            <path d="M48 32 L56 40 L56 56 L48 64 L40 56 L40 40 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
          </svg>
        </div>

        <p className="text-8xl font-bold text-emerald-400">404</p>
        <h1 className="text-2xl font-bold text-white">Tournament Not Found</h1>
        <p className="text-slate-400">
          This tournament doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/international"
          className="inline-block px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors min-w-[140px] min-h-[44px] flex items-center justify-center"
        >
          Browse Tournaments
        </a>
      </div>
    </div>
  );
}
