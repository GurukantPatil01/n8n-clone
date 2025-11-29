'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Subscription {
    plan: string;
    status: string;
    executionsUsed: number;
    executionsLimit: number;
    workflowsUsed: number;
    workflowsLimit: number;
}

interface BillingContentProps {
    subscription: Subscription;
}

export default function BillingContent({ subscription }: BillingContentProps) {
    const usagePercentage = (subscription.executionsUsed / subscription.executionsLimit) * 100;
    const searchParams = useSearchParams();
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (searchParams.get('success')) {
            setShowSuccess(true);
            // Hide success message after 5 seconds
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [searchParams]);

    return (
        <div className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Success Message */}
                {showSuccess && (
                    <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🎉</span>
                            <div>
                                <h3 className="font-bold text-green-900 dark:text-green-300">
                                    Subscription Successful!
                                </h3>
                                <p className="text-green-700 dark:text-green-400">
                                    Your subscription has been activated. Welcome to the Pro plan!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Billing & Subscription
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your subscription and view usage
                    </p>
                </div>

                {/* Current Plan */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Current Plan
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                You're on the {subscription.plan} plan
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full ${subscription.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                            }`}>
                            {subscription.status}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                                    Workflows
                                </span>
                                <span className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                                    {subscription.workflowsUsed}/{subscription.workflowsLimit}
                                </span>
                            </div>
                            <div className="w-full bg-purple-200 dark:bg-purple-900/40 rounded-full h-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all"
                                    style={{ width: `${(subscription.workflowsUsed / subscription.workflowsLimit) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                    Executions This Month
                                </span>
                                <span className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                                    {subscription.executionsUsed}/{subscription.executionsLimit}
                                </span>
                            </div>
                            <div className="w-full bg-blue-200 dark:bg-blue-900/40 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${usagePercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {subscription.plan === 'Free' && (
                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                            <p className="text-yellow-800 dark:text-yellow-300">
                                ⚠️ You're using {usagePercentage.toFixed(0)}% of your monthly executions. Upgrade to Pro for unlimited workflows and 10,000 executions/month!
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Link
                        href="/pricing"
                        className="card hover:shadow-xl transition-shadow cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⬆️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                                    Upgrade Plan
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Get more workflows and executions
                                </p>
                            </div>
                        </div>
                    </Link>

                    <button
                        onClick={() => alert('To manage your subscription, you need to complete a checkout first. The customer portal will be available after subscribing.')}
                        className="card hover:shadow-xl transition-shadow cursor-pointer group text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-2xl">💳</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                                    Manage Billing
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Update payment method and invoices
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
