'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/lib/error-logger';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Client-side error boundary that catches React rendering errors
 * (JSX errors, hook errors, lifecycle errors) that server-side
 * error boundaries cannot catch.
 *
 * Displays a styled error message with a "Try Again" button that
 * resets the component tree. Also logs errors via the error logger
 * (Sentry if configured, console.warn otherwise).
 */
export class ClientErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error through our error logger (Sentry-aware)
    logError(error, {
      componentStack: errorInfo.componentStack,
      timeStamp: Date.now(),
    });

    // Call custom onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
          <div className="text-center space-y-4 max-w-md">
            <p className="text-8xl font-bold text-red-500">!</p>
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="text-slate-400">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="inline-block px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
