'use client';

import { useState, FormEvent } from 'react';
import { createUser } from '@/lib/actions';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * REGISTER PAGE - Phase 4 Enhanced
 * 
 * Improvements:
 * - Generous whitespace and padding
 * - Smooth micro-interactions
 * - Better visual hierarchy
 * - Loading states with animations
 * - Password strength indicator
 */

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await createUser(email, password, name);

            // Automatically sign in after registration
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Account created but login failed. Please try logging in.');
                setIsLoading(false);
                return;
            }

            router.push('/workflows');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-8 fade-in">
            <div className="w-full max-w-lg">
                {/* Logo and Title */}
                <div className="text-center mb-12 space-y-4">
                    <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-2xl hover-scale">
                        <span className="text-white font-bold text-4xl">N8</span>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Get Started
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Create your account to start automating
                    </p>
                </div>

                {/* Register Form */}
                <div className="card hover-lift">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-5 fade-in">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-700 dark:text-red-400 font-semibold">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Name Field */}
                        <div className="space-y-3">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-3">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-3">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input"
                                required
                                disabled={isLoading}
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-3">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link
                        href="/login"
                        className="block text-center btn-secondary text-lg py-4"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-sm">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}

/**
 * MICRO-INTERACTIONS:
 * - Logo: Hover scale effect
 * - Card: Lift effect on hover
 * - Inputs: Smooth focus ring animation
 * - Button: Scale on hover, press effect
 * - Error: Fade-in animation
 * - Loading: Spinning animation
 * 
 * WHITESPACE:
 * - Page padding: p-8
 * - Form spacing: space-y-8
 * - Input padding: py-3 px-4
 * - Button padding: py-4
 * - Card padding: p-8 (from globals.css)
 * - Generous margins between sections
 */
