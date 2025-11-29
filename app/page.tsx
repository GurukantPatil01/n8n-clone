import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * DASHBOARD PAGE
 * 
 * Learning: Main dashboard/home page
 * - Overview of workflows
 * - Recent executions
 * - Quick stats
 */

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome back, {session.user?.name || 'User'}! 👋
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Total Workflows
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    0
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">⚡</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Active Workflows
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    0
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Executions Today
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    0
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Success Rate
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    100%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🎯</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a
                            href="/workflows"
                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
                        >
                            <div className="text-3xl mb-3">⚡</div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                Create Workflow
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Build a new automation workflow
                            </p>
                        </a>

                        <a
                            href="/executions"
                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
                        >
                            <div className="text-3xl mb-3">📋</div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                View Executions
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Check workflow execution history
                            </p>
                        </a>

                        <a
                            href="/settings"
                            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
                        >
                            <div className="text-3xl mb-3">⚙️</div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                Settings
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Configure your account and app
                            </p>
                        </a>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
                    <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-4">
                        🚀 Getting Started
                    </h2>
                    <p className="text-purple-700 dark:text-purple-400 mb-6">
                        Welcome to your n8n clone! Here's how to get started:
                    </p>
                    <ol className="space-y-3 text-purple-700 dark:text-purple-400">
                        <li className="flex gap-3">
                            <span className="font-bold">1.</span>
                            <span>Create your first workflow from the Workflows page</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold">2.</span>
                            <span>Add nodes to your workflow canvas</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold">3.</span>
                            <span>Connect nodes to build your automation</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold">4.</span>
                            <span>Execute your workflow and see the results!</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
