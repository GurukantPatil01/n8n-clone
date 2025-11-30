'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';

export default function NewWorkflowPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const createMutation = trpc.workflows.create.useMutation({
        onSuccess: (data) => {
            // Redirect to the new workflow editor
            router.push(`/workflows/${data.workflow.id}`);
        },
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await createMutation.mutateAsync({
                name: name.trim(),
                description: description.trim() || undefined,
            });
        } catch (error) {
            console.error('Failed to create workflow:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/workflows" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block">
                        ← Back to Workflows
                    </Link>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create New Workflow</h1>
                    <p className="text-gray-600">Set up a new automation workflow</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                                Workflow Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Lead Qualification System"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                                Description (optional)
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What does this workflow do?"
                                rows={4}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Error Message */}
                        {createMutation.isError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-700 text-sm">
                                    Failed to create workflow. Please try again.
                                </p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={createMutation.isPending || !name.trim()}
                                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Create Workflow'}
                            </button>
                            <Link
                                href="/workflows"
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
