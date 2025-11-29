'use client';

import { formatDistanceToNow } from 'date-fns';

/**
 * WORKFLOW CARD COMPONENT - N8N STYLE
 * 
 * Learning: Clean list-style workflow display matching n8n's design
 * - Spacious layout with icon, title, and description
 * - Subtle hover effects, no heavy borders
 * - Clean typography and spacing
 * - Light, airy design (not boxy!)
 * 
 * Phase 12: Workflow UI Components (Redesigned)
 */

interface WorkflowCardProps {
    workflow: {
        id: number;
        name: string;
        description?: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nodes?: any[];
        connections?: any[];
    };
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onToggleActive: (id: number) => void;
    onClick?: (id: number) => void;
}

export function WorkflowCard({
    workflow,
    onEdit,
    onDelete,
    onToggleActive,
    onClick,
}: WorkflowCardProps) {
    const nodeCount = workflow.nodes?.length || 0;
    const lastUpdated = formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true });

    const handleCardClick = () => {
        if (onClick) {
            onClick(workflow.id);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(workflow.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(workflow.id);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleActive(workflow.id);
    };

    return (
        <div
            onClick={handleCardClick}
            className={`
                group relative flex items-start gap-4 p-4 transition-all duration-200
                ${onClick ? 'cursor-pointer' : ''}
                hover:bg-gray-50 dark:hover:bg-gray-800/50
                border-b border-gray-100 dark:border-gray-800
                last:border-b-0
            `}
        >
            {/* Icon */}
            <div className={`
                flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                ${workflow.isActive
                    ? 'bg-purple-100 dark:bg-purple-900/20'
                    : 'bg-gray-100 dark:bg-gray-800'
                }
            `}>
                <svg
                    className={`w-6 h-6 ${workflow.isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                            {workflow.name}
                        </h3>
                        {workflow.isActive && (
                            <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full" title="Active" />
                        )}
                    </div>

                    {/* Arrow indicator on hover */}
                    {onClick && (
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                </div>

                {/* Description */}
                {workflow.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {workflow.description}
                    </p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        {nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lastUpdated}
                    </span>
                </div>

                {/* Actions - shown on hover */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleEdit}
                        className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        Edit
                    </button>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <button
                        onClick={handleToggle}
                        className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        {workflow.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <button
                        onClick={handleDelete}
                        className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
