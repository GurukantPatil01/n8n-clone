'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

/**
 * CREATE WORKFLOW MODAL
 * 
 * Learning: Modal for creating new workflows
 * - Form with name and description inputs
 * - Validation and error handling
 * - Loading state during creation
 * - Auto-navigate to canvas after creation
 * 
 * Phase 12: Workflow UI Components
 */

interface CreateWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (workflow: any) => void;
}

export function CreateWorkflowModal({ isOpen, onClose, onSuccess }: CreateWorkflowModalProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const createMutation = trpc.workflows.create.useMutation({
        onSuccess: (data) => {
            setName('');
            setDescription('');
            onClose();
            // Auto-navigate to workflow canvas
            router.push(`/workflows/${data.id}`);
            if (onSuccess) {
                onSuccess(data);
            }
        },
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setName('');
            setDescription('');
            createMutation.reset();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            createMutation.mutate({
                name: name.trim(),
                description: description.trim() || undefined,
            });
        }
    };

    const handleClose = () => {
        if (!createMutation.isPending) {
            onClose();
        }
    };

    if (!isOpen) return null;

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
                    Create New Workflow
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
                            disabled={createMutation.isPending}
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
                            disabled={createMutation.isPending}
                        />
                    </div>

                    {/* Error message */}
                    {createMutation.isError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-400">
                                {createMutation.error.message}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={createMutation.isPending}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending || !name.trim()}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create Workflow'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
