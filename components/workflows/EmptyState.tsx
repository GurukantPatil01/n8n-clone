'use client';

/**
 * EMPTY STATE COMPONENT
 * 
 * Learning: Displays when no workflows are found
 * - Shows helpful message and icon
 * - Optional action button to create workflow
 * - Different states for different scenarios
 * 
 * Phase 12: Workflow UI Components
 */

interface EmptyStateProps {
    title?: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    icon?: React.ReactNode;
}

export function EmptyState({
    title = 'No workflows yet',
    description = 'Get started by creating your first workflow automation.',
    action,
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {/* Icon */}
            <div className="mb-6 text-gray-400 dark:text-gray-600">
                {icon || (
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                )}
            </div>

            {/* Text */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                {description}
            </p>

            {/* Action button */}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
