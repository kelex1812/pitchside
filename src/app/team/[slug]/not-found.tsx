export default function TeamNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="text-center space-y-4">
        <p className="text-8xl font-bold text-emerald-400">404</p>
        <h1 className="text-2xl font-bold text-white">Team Not Found</h1>
        <p className="text-slate-400">This team doesn&apos;t exist or has been moved.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
