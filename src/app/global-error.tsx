'use client';

import Error from 'next/error';
import { useEffect } from 'react';
import { logError } from '@/lib/error-logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, {
      errorType: 'global-error',
      digest: error.digest ?? null,
      timeStamp: Date.now(),
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-300 antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <p className="text-8xl font-bold text-red-500">!</p>
            <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
            <p className="text-slate-400">
              This error is being logged for monitoring. Please try again or contact support.
            </p>
            <button
              onClick={() => reset()}
              className="inline-block px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
