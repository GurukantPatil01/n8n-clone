'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

/**
 * NAVIGATION BAR COMPONENT
 * 
 * Learning: A polished navbar with micro-interactions
 * - Smooth dropdown animations
 * - Hover effects on all interactive elements
 * - Click-outside to close dropdown
 * - Generous spacing and whitespace
 */

export function Navbar() {
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
            <div className="max-w-7xl mx-auto px-8 py-5">
                <div className="flex items-center justify-between">
                    {/* Logo with hover effect */}
                    <Link
                        href="/workflows"
                        className="flex items-center gap-4 hover-scale group"
                    >
                        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                            <span className="text-white font-bold text-2xl">N8</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            N8N Clone
                        </span>
                    </Link>

                    {/* User Menu */}
                    {session?.user && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-4 px-5 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover-scale"
                            >
                                {/* User Avatar */}
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-base">
                                        {session.user.name?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>

                                {/* User Name */}
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {session.user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {session.user.email}
                                    </p>
                                </div>

                                {/* Dropdown Arrow */}
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu with slide-in animation */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 slide-in-right overflow-hidden">
                                    {/* User Info Section */}
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {session.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {session.user.email}
                                        </p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link
                                            href="/workflows"
                                            className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            My Workflows
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                signOut({ callbackUrl: '/login' });
                                            }}
                                            className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

/**
 * MICRO-INTERACTIONS USED:
 * 
 * 1. Logo hover: Scale effect + shadow enhancement
 * 2. User button: Background color change + scale
 * 3. Dropdown arrow: Smooth rotation
 * 4. Dropdown menu: Slide-in animation from right
 * 5. Menu items: Background color transitions
 * 6. Click outside: Closes dropdown smoothly
 * 
 * WHITESPACE:
 * - Generous padding: px-8 py-5 (navbar)
 * - Spacing between elements: gap-4
 * - Menu item padding: px-6 py-3
 * - Avatar size: w-12 h-12 (larger for better visibility)
 */
