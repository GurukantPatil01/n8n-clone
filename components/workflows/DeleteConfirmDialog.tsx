'use client';

import { trpc } from '@/lib/trpc/client';

/**
 * DELETE CONFIRM DIALOG
 * 
 * Learning: Confirmation dialog for deleting workflows
 * - Warning message with workflow name
 * - Confirm and cancel actions
 * - Loading state during deletion
 * 
 * Phase 12: Workflow UI Components
 */

interface DeleteConfirmDialogProps {
    workflow: { id: number; name: string } | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeleteConfirmDialog({ workflow, isOpen, onClose, onSuccess }: DeleteConfirmDialogProps) {
    const deleteMutation = trpc.workflows.delete.useMutation({
        onSuccess: () => {
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        },
    });

    const handleConfirm = () => {
        if (workflow) {
            deleteMutation.mutate({ id: workflow.id });
        }
    };

    const handleClose = () => {
        if (!deleteMutation.isPending) {
            onClose();
        }
    };

    if (!isOpen || !workflow) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Dialog */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
                    Delete Workflow
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-100">"{workflow.name}"</span>?
                    This action cannot be undone and will permanently delete all associated nodes, connections, and execution history.
                </p>

                {/* Error message */}
                {deleteMutation.isError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-400">
                            {deleteMutation.error.message}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={deleteMutation.isPending}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={deleteMutation.isPending}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete Workflow'}
                    </button>
                </div>
            </div>
        </div>
    );
}
