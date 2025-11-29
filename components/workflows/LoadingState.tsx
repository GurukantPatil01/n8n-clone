'use client';

/**
 * LOADING STATE COMPONENT - N8N STYLE
 * 
 * Learning: Clean skeleton loading matching n8n's list design
 * - Vertical list of skeleton items
 * - Subtle pulsing animation
 * - Matches WorkflowCard layout
 * 
 * Phase 12: Workflow UI Components (Redesigned)
 */

interface LoadingStateProps {
    count?: number;
}

export function LoadingState({ count = 6 }: LoadingStateProps) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-start gap-4 p-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0 animate-pulse"
                >
                    {/* Icon skeleton */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>

                    {/* Content skeleton */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                            <div className="w-2 h-2 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-2"></div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
