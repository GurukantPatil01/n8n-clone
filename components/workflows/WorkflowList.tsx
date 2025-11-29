'use client';

import { WorkflowCard } from './WorkflowCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

/**
 * WORKFLOW LIST COMPONENT - N8N STYLE
 * 
 * Learning: Clean list container matching n8n's design
 * - Vertical list layout (not grid)
 * - Subtle dividers between items
 * - Spacious, clean design
 * 
 * Phase 12: Workflow UI Components (Redesigned)
 */

interface WorkflowListProps {
    workflows: any[];
    pagination?: {
        total: number;
        totalPages: number;
        currentPage: number;
        hasMore: boolean;
    };
    onPageChange?: (page: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleActive: (id: number) => void;
    onClick?: (id: number) => void;
    isLoading?: boolean;
    emptyState?: {
        title?: string;
        description?: string;
        action?: {
            label: string;
            onClick: () => void;
        };
    };
}

export function WorkflowList({
    workflows,
    pagination,
    onPageChange,
    onEdit,
    onDelete,
    onToggleActive,
    onClick,
    isLoading,
    emptyState,
}: WorkflowListProps) {
    // Loading state
    if (isLoading) {
        return <LoadingState count={6} />;
    }

    // Empty state
    if (workflows.length === 0) {
        return (
            <EmptyState
                title={emptyState?.title}
                description={emptyState?.description}
                action={emptyState?.action}
            />
        );
    }

    return (
        <div>
            {/* Workflow list - clean vertical layout like n8n */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {workflows.map((workflow) => (
                    <WorkflowCard
                        key={workflow.id}
                        workflow={workflow}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleActive={onToggleActive}
                        onClick={onClick}
                    />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing page {pagination.currentPage} of {pagination.totalPages}
                        {' '}• {pagination.total} total workflows
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange?.(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => onPageChange?.(pagination.currentPage + 1)}
                            disabled={!pagination.hasMore}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
