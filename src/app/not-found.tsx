export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="text-center space-y-4">
        <p className="text-8xl font-bold text-emerald-400">404</p>
        <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
        <p className="text-slate-400">The page you&apos;re looking for doesn&apos;t exist.</p>
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
