'use client';

import { useState, useEffect } from 'react';

/**
 * WORKFLOW FILTERS COMPONENT
 * 
 * Learning: Search, sort, and filter controls for workflows
 * - Search input with debouncing
 * - Sort by dropdown
 * - Sort order toggle
 * - Status filter
 * - Clear filters button
 * 
 * Phase 12: Workflow UI Components
 */

interface WorkflowFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortBy: string;
    onSortByChange: (value: string) => void;
    sortOrder: 'asc' | 'desc';
    onSortOrderChange: (value: 'asc' | 'desc') => void;
    filterActive?: boolean;
    onFilterActiveChange: (value?: boolean) => void;
}

export function WorkflowFilters({
    search,
    onSearchChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    filterActive,
    onFilterActiveChange,
}: WorkflowFiltersProps) {
    const [localSearch, setLocalSearch] = useState(search);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch, onSearchChange]);

    // Sync with external search changes
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const handleClearFilters = () => {
        setLocalSearch('');
        onSearchChange('');
        onSortByChange('updatedAt');
        onSortOrderChange('desc');
        onFilterActiveChange(undefined);
    };

    const hasActiveFilters = search || sortBy !== 'updatedAt' || sortOrder !== 'desc' || filterActive !== undefined;

    return (
        <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Filters
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Search workflows..."
                        />
                        <svg
                            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                    </label>
                    <select
                        value={filterActive === undefined ? 'all' : filterActive ? 'active' : 'inactive'}
                        onChange={(e) => {
                            const value = e.target.value;
                            onFilterActiveChange(value === 'all' ? undefined : value === 'active');
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="all">All Workflows</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="updatedAt">Last Updated</option>
                        <option value="createdAt">Created Date</option>
                        <option value="name">Name</option>
                        <option value="isActive">Status</option>
                    </select>
                </div>

                {/* Sort Order */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort Order
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onSortOrderChange('desc')}
                            className={`
                                flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                                ${sortOrder === 'desc'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }
                            `}
                        >
                            Desc
                        </button>
                        <button
                            onClick={() => onSortOrderChange('asc')}
                            className={`
                                flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                                ${sortOrder === 'asc'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }
                            `}
                        >
                            Asc
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
