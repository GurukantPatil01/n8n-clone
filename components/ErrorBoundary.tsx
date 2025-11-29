'use client';

import * as Sentry from '@sentry/nextjs';
import { Component, ReactNode } from 'react';

/**
 * ERROR BOUNDARY COMPONENT
 * 
 * Learning: React Error Boundaries catch errors in component tree
 * - Prevents entire app from crashing
 * - Shows fallback UI
 * - Logs error to Sentry
 * - Can reset and try again
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so next render shows fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // Log error to Sentry
        Sentry.captureException(error, {
            contexts: {
                react: {
                    componentStack: errorInfo.componentStack,
                },
            },
        });

        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error Boundary caught:', error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
                    <div className="card max-w-2xl w-full text-center space-y-6">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Something went wrong
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We've been notified and are working on a fix.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-left">
                                <p className="font-mono text-sm text-red-600 dark:text-red-400">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="btn-primary"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="btn-secondary"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * LEARNING NOTES:
 * 
 * Error Boundary Lifecycle:
 * 1. Error occurs in child component
 * 2. getDerivedStateFromError() updates state
 * 3. Component re-renders with fallback UI
 * 4. componentDidCatch() logs to Sentry
 * 
 * What Error Boundaries DON'T Catch:
 * - Event handlers (use try/catch)
 * - Async code (setTimeout, promises)
 * - Server-side rendering
 * - Errors in the error boundary itself
 * 
 * Best Practices:
 * - Place at strategic points in component tree
 * - Provide helpful fallback UI
 * - Allow users to recover (reset button)
 * - Log errors for debugging
 */
