'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';

/**
 * WORKFLOW MANAGEMENT PAGE - Phase 4 Enhanced
 * 
 * Improvements:
 * - Generous whitespace and padding
 * - Smooth micro-interactions on all elements
 * - Better visual hierarchy
 * - Polished empty states
 * - Loading skeletons
 */

export default function WorkflowsPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [newWorkflowName, setNewWorkflowName] = useState('');
    const [newWorkflowDescription, setNewWorkflowDescription] = useState('');

    const { data, isLoading, error } = trpc.workflows.list.useQuery();
    const workflows = data?.workflows || [];
    const utils = trpc.useUtils();

    const createMutation = trpc.workflows.create.useMutation({
        onSuccess: () => {
            utils.workflows.list.invalidate();
            setNewWorkflowName('');
            setNewWorkflowDescription('');
            setIsCreating(false);
        },
    });

    const deleteMutation = trpc.workflows.delete.useMutation({
        onSuccess: () => {
            utils.workflows.list.invalidate();
        },
    });

    const toggleMutation = trpc.workflows.toggleActive.useMutation({
        onSuccess: () => {
            utils.workflows.list.invalidate();
        },
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkflowName.trim()) return;

        try {
            await createMutation.mutateAsync({
                name: newWorkflowName,
                description: newWorkflowDescription || undefined,
            });
        } catch (error) {
            console.error('Failed to create workflow:', error);
        }
    };

    // Loading state with skeleton
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="skeleton h-12 w-64 rounded-2xl"></div>
                    <div className="skeleton h-6 w-96 rounded-xl"></div>
                    <div className="grid gap-6 mt-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton h-48 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-12">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md text-center fade-in">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Error Loading Workflows
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {error.message}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-12 fade-in">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header with generous spacing */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Workflows
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        Manage your automation workflows
                    </p>
                </div>

                {/* Create Button with hover effect */}
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-primary shadow-xl hover:shadow-2xl"
                    >
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Workflow
                    </button>
                )}

                {/* Create Form with smooth animation */}
                {isCreating && (
                    <div className="card hover-lift fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                            Create New Workflow
                        </h2>
                        <form onSubmit={handleCreate} className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Workflow Name *
                                </label>
                                <input
                                    type="text"
                                    value={newWorkflowName}
                                    onChange={(e) => setNewWorkflowName(e.target.value)}
                                    placeholder="e.g., Daily Report Automation"
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={newWorkflowDescription}
                                    onChange={(e) => setNewWorkflowDescription(e.target.value)}
                                    placeholder="What does this workflow do?"
                                    rows={4}
                                    className="input resize-none"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {createMutation.isPending ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : 'Create Workflow'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewWorkflowName('');
                                        setNewWorkflowDescription('');
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Workflows List */}
                {workflows && workflows.length === 0 ? (
                    // Empty state with generous whitespace
                    <div className="card text-center py-20 hover-lift">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            No Workflows Yet
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-md mx-auto leading-relaxed">
                            Create your first workflow to get started with automation!
                        </p>
                        {!isCreating && (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="btn-primary shadow-xl"
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Your First Workflow
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {workflows?.map((workflow) => (
                            <div
                                key={workflow.id}
                                className="card hover-lift cursor-pointer group"
                            >
                                <div className="flex items-start justify-between gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {workflow.name}
                                            </h3>
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${workflow.isActive
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 pulse-slow'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {workflow.isActive ? '● Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        {workflow.description && (
                                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                                {workflow.description}
                                            </p>
                                        )}
                                        <div className="flex gap-8 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                                {workflow.nodes?.length || 0} nodes
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                {workflow.connections?.length || 0} connections
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(workflow.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const executeMutation = trpc.jobs.executeWorkflow.useMutation();
                                                    await executeMutation.mutateAsync({ workflowId: workflow.id });
                                                    alert('Workflow executed successfully!');
                                                } catch (error) {
                                                    alert('Failed to execute workflow');
                                                }
                                            }}
                                            className="px-5 py-2.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-xl font-semibold transition-all duration-200 hover-scale flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Execute
                                        </button>
                                        <Link
                                            href={`/workflows/${workflow.id}`}
                                            className="px-5 py-2.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 rounded-xl font-semibold transition-all duration-200 hover-scale flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => toggleMutation.mutate({ id: workflow.id })}
                                            disabled={toggleMutation.isPending}
                                            className="px-5 py-2.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-xl font-semibold transition-all duration-200 hover-scale disabled:opacity-50"
                                        >
                                            {workflow.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Delete workflow "${workflow.name}"?`)) {
                                                    deleteMutation.mutate({ id: workflow.id });
                                                }
                                            }}
                                            disabled={deleteMutation.isPending}
                                            className="px-5 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-xl font-semibold transition-all duration-200 hover-scale disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Learning Note */}
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
                    <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4">
                        🎓 Phase 4 Complete: Beautiful UI!
                    </h3>
                    <p className="text-purple-600 dark:text-purple-300 text-lg mb-4 leading-relaxed">
                        This page now features polished design with:
                    </p>
                    <ul className="space-y-3 text-purple-600 dark:text-purple-300">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm">✓</span>
                            Generous whitespace for breathing room
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm">✓</span>
                            Smooth micro-interactions on hover
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm">✓</span>
                            Loading states with skeleton screens
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm">✓</span>
                            Beautiful empty states with clear CTAs
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm">✓</span>
                            Consistent design system throughout
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
