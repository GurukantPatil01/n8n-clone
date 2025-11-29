'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';

/**
 * EDIT WORKFLOW MODAL
 * 
 * Learning: Modal for editing existing workflows
 * - Pre-filled form with workflow data
 * - Update name, description, and active status
 * - Validation and error handling
 * 
 * Phase 12: Workflow UI Components
 */

interface EditWorkflowModalProps {
    workflow: {
        id: number;
        name: string;
        description?: string | null;
        isActive: boolean;
    } | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (workflow: any) => void;
}

export function EditWorkflowModal({ workflow, isOpen, onClose, onSuccess }: EditWorkflowModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(false);

    const updateMutation = trpc.workflows.update.useMutation({
        onSuccess: (data) => {
            onClose();
            if (onSuccess) {
                onSuccess(data);
            }
        },
    });

    // Populate form when workflow changes
    useEffect(() => {
        if (workflow) {
            setName(workflow.name);
            setDescription(workflow.description || '');
            setIsActive(workflow.isActive);
        }
    }, [workflow]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            updateMutation.reset();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (workflow && name.trim()) {
            updateMutation.mutate({
                id: workflow.id,
                name: name.trim(),
                description: description.trim() || undefined,
                isActive,
            });
        }
    };

    const handleClose = () => {
        if (!updateMutation.isPending) {
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

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Edit Workflow
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Workflow Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter workflow name"
                            required
                            autoFocus
                            disabled={updateMutation.isPending}
                        />
                    </div>

                    {/* Description input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            placeholder="Describe what this workflow does"
                            rows={3}
                            disabled={updateMutation.isPending}
                        />
                    </div>

                    {/* Active status toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Workflow Status
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {isActive ? 'Workflow is currently active' : 'Workflow is currently inactive'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            disabled={updateMutation.isPending}
                            className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                ${isActive ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            <span
                                className={`
                                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                    ${isActive ? 'translate-x-6' : 'translate-x-1'}
                                `}
                            />
                        </button>
                    </div>

                    {/* Error message */}
                    {updateMutation.isError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-400">
                                {updateMutation.error.message}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={updateMutation.isPending}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending || !name.trim()}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
