'use client';

import { useState } from 'react';
import Link from 'next/link';

// Stripe price IDs (from Stripe Dashboard)
const STRIPE_PRO_PRICE_ID = 'price_1SYXnIK96kmqf5DsF6VgWLa5';
const STRIPE_ENTERPRISE_PRICE_ID = 'price_1SYXoZK96kmqf5Dsn4RCAfjY';

/**
 * PRICING PAGE
 * 
 * Learning: Display subscription plans and pricing
 * - Free, Pro, and Enterprise tiers
 * - Feature comparison
 * - Call-to-action buttons
 * - Responsive design
 */

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started',
        features: [
            '3 active workflows',
            '100 executions per month',
            'Basic node types',
            'Community support',
            'Email notifications',
        ],
        cta: 'Current Plan',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$19',
        period: 'per month',
        description: 'For power users and small teams',
        features: [
            'Unlimited workflows',
            '10,000 executions per month',
            'All node types',
            'Priority support',
            'Advanced scheduling',
            'Custom integrations',
            'Execution history (30 days)',
        ],
        cta: 'Upgrade to Pro',
        highlighted: true,
        priceId: STRIPE_PRO_PRICE_ID,
    },
    {
        name: 'Enterprise',
        price: '$99',
        period: 'per month',
        description: 'For large teams and organizations',
        features: [
            'Unlimited workflows',
            '100,000 executions per month',
            'All node types',
            'Dedicated support',
            'Advanced scheduling',
            'Custom integrations',
            'Execution history (90 days)',
            'SSO & SAML',
            'SLA guarantee',
            'Custom contracts',
        ],
        cta: 'Upgrade to Enterprise',
        highlighted: false,
        priceId: STRIPE_ENTERPRISE_PRICE_ID,
    },
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (priceId?: string) => {
        if (!priceId) {
            // Free plan - redirect to signup
            window.location.href = '/register';
            return;
        }

        try {
            setLoading(priceId);

            // Call our API to create a checkout session
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
            setLoading(null);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Choose the perfect plan for your automation needs. All plans include a 14-day free trial.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full transition-all ${billingCycle === 'monthly'
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full transition-all ${billingCycle === 'yearly'
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            Yearly
                            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`
                relative rounded-3xl p-8 transition-all duration-300
                ${plan.highlighted
                                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                                    : 'bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl'
                                }
              `}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm ${plan.highlighted ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex items-baseline justify-center">
                                    <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {plan.price}
                                    </span>
                                    <span className={`ml-2 ${plan.highlighted ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                        /{plan.period}
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className={`text-xl ${plan.highlighted ? 'text-white' : 'text-green-500'}`}>
                                            ✓
                                        </span>
                                        <span className={plan.highlighted ? 'text-purple-100' : 'text-gray-700 dark:text-gray-300'}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.priceId)}
                                disabled={loading !== null}
                                className={`
                  w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200
                  ${plan.highlighted
                                        ? 'bg-white text-purple-600 hover:bg-gray-100'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }
                  ${loading !== null ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                            >
                                {loading === plan.priceId ? 'Loading...' : plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                                Can I change plans later?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                                What happens if I exceed my execution limit?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your workflows will pause until the next billing cycle. You can upgrade your plan to increase limits immediately.
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                                Do you offer refunds?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Yes, we offer a 14-day money-back guarantee. No questions asked.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Need a custom plan? Have questions?
                    </p>
                    <Link
                        href="/settings"
                        className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                        Contact Sales
                    </Link>
                </div>
            </div>
        </div>
    );
}
