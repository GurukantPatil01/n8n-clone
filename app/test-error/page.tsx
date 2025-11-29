'use client';

import { logError, addBreadcrumb, trackEvent } from '@/lib/error-tracking';
import { useState } from 'react';

/**
 * ERROR TRACKING TEST PAGE
 * 
 * This page demonstrates all error tracking features:
 * - Error boundaries
 * - Custom error logging
 * - Breadcrumbs
 * - Event tracking
 */

export default function TestErrorPage() {
    const [count, setCount] = useState(0);

    const handleTestError = () => {
        addBreadcrumb('User clicked test error button');
        throw new Error('🧪 Test Error: This is a test error from the UI!');
    };

    const handleLoggedError = () => {
        addBreadcrumb('User clicked logged error button');
        try {
            throw new Error('🔍 Logged Error: This error is caught and logged');
        } catch (error) {
            logError(error as Error, {
                context: 'Test page',
                action: 'Manual error logging',
                count,
            });
            alert('Error logged! Check console and Sentry dashboard.');
        }
    };

    const handleAsyncError = async () => {
        addBreadcrumb('User clicked async error button');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error('⏱️ Async Error: This error happens after a delay');
    };

    const handleTrackEvent = () => {
        trackEvent('test_button_clicked', {
            buttonName: 'Track Event',
            timestamp: new Date().toISOString(),
            count,
        });
        alert('Event tracked! Check Sentry breadcrumbs.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                        <span className="text-white font-bold text-4xl">🐛</span>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        Error Tracking Test
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Test all error tracking features
                    </p>
                </div>

                {/* Counter */}
                <div className="card text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Interaction Counter (adds context to errors)
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                setCount(count - 1);
                                addBreadcrumb('Counter decreased', { count: count - 1 });
                            }}
                            className="btn-secondary"
                        >
                            -
                        </button>
                        <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                            {count}
                        </span>
                        <button
                            onClick={() => {
                                setCount(count + 1);
                                addBreadcrumb('Counter increased', { count: count + 1 });
                            }}
                            className="btn-secondary"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Test Buttons */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Error Boundary Test */}
                    <div className="card space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">💥</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Error Boundary</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Uncaught error - triggers error boundary
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleTestError}
                            className="w-full btn-danger"
                        >
                            Throw Uncaught Error
                        </button>
                    </div>

                    {/* Logged Error Test */}
                    <div className="card space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📝</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Logged Error</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Caught error - logged to Sentry
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLoggedError}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover-scale"
                        >
                            Log Caught Error
                        </button>
                    </div>

                    {/* Async Error Test */}
                    <div className="card space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Async Error</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Error after 1 second delay
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleAsyncError}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover-scale"
                        >
                            Throw Async Error
                        </button>
                    </div>

                    {/* Event Tracking Test */}
                    <div className="card space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Track Event</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Add breadcrumb without error
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleTrackEvent}
                            className="w-full btn-primary"
                        >
                            Track Event
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
                    <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-4 text-lg">
                        📋 How to Test
                    </h3>
                    <ol className="space-y-2 text-blue-700 dark:text-blue-400">
                        <li className="flex gap-2">
                            <span className="font-bold">1.</span>
                            <span>Open browser console (F12) to see local logs</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">2.</span>
                            <span>Click buttons to trigger different error types</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">3.</span>
                            <span>Check Sentry dashboard at https://sentry.io</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">4.</span>
                            <span>View error details, stack traces, and breadcrumbs</span>
                        </li>
                    </ol>
                </div>

                {/* Sentry Status */}
                <div className="card">
                    <h3 className="font-bold mb-4">🔍 Sentry Status</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">DSN Configured:</span>
                            <span className={`font-semibold ${process.env.NEXT_PUBLIC_SENTRY_DSN ? 'text-green-600' : 'text-yellow-600'}`}>
                                {process.env.NEXT_PUBLIC_SENTRY_DSN ? '✅ Yes' : '⚠️ No (logging to console only)'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Environment:</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {process.env.NODE_ENV}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
