'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

/**
 * WORKFLOW PAGINATION TEST PAGE
 * 
 * Learning: This page tests pagination, sorting, and filtering
 * - Pagination with limit/offset
 * - Sorting by different fields
 * - Filtering by active status
 * - Search by workflow name
 * 
 * Phase 11: Testing workflow pagination
 */

export default function TestWorkflowsPage() {
    const [workflowName, setWorkflowName] = useState('Test Workflow');
    const [workflowDescription, setWorkflowDescription] = useState('This is a test workflow');

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Sorting state
    const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'name' | 'isActive'>('updatedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Filtering state
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
    const [search, setSearch] = useState('');

    // Query: Get paginated workflows
    const { data, isLoading, refetch } = trpc.workflows.list.useQuery({
        limit,
        offset: (page - 1) * limit,
        sortBy,
        sortOrder,
        isActive: filterActive,
        search: search || undefined,
    });

    // Extract workflows and pagination from response
    const workflows = data?.workflows || [];
    const pagination = data?.pagination;

    // Mutations
    const createMutation = trpc.workflows.create.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const updateMutation = trpc.workflows.update.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const deleteMutation = trpc.workflows.delete.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const toggleActiveMutation = trpc.workflows.toggleActive.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const handleCreate = () => {
        createMutation.mutate({
            name: workflowName,
            description: workflowDescription,
        });
    };

    const handleUpdate = (id: number) => {
        updateMutation.mutate({
            id,
            name: `Updated ${workflowName}`,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this workflow?')) {
            deleteMutation.mutate({ id });
        }
    };

    const handleToggleActive = (id: number) => {
        toggleActiveMutation.mutate({ id });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                    🧪 Workflow Pagination Test Page
                </h1>

                {/* Create Workflow Form */}
                <div className="card mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Create New Workflow
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Workflow Name
                            </label>
                            <input
                                type="text"
                                value={workflowName}
                                onChange={(e) => setWorkflowName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Enter workflow name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={workflowDescription}
                                onChange={(e) => setWorkflowDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={createMutation.isPending}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create Workflow'}
                        </button>
                        {createMutation.isError && (
                            <p className="text-red-600 dark:text-red-400">
                                Error: {createMutation.error.message}
                            </p>
                        )}
                        {createMutation.isSuccess && (
                            <p className="text-green-600 dark:text-green-400">
                                ✅ Workflow created successfully!
                            </p>
                        )}
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="card mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Filters & Controls
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1); // Reset to first page
                                }}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                placeholder="Search workflows..."
                            />
                        </div>

                        {/* Filter by Active Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status Filter
                            </label>
                            <select
                                value={filterActive === undefined ? 'all' : filterActive ? 'active' : 'inactive'}
                                onChange={(e) => {
                                    setFilterActive(e.target.value === 'all' ? undefined : e.target.value === 'active');
                                    setPage(1);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="all">All</option>
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
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as any)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Workflows List */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Workflows ({pagination?.total || 0})
                        </h2>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                Per page:
                            </label>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>

                    {isLoading && (
                        <p className="text-gray-600 dark:text-gray-400">Loading workflows...</p>
                    )}

                    {workflows.length === 0 && !isLoading && (
                        <p className="text-gray-600 dark:text-gray-400">
                            No workflows found. {search && 'Try a different search term or '}Create one above!
                        </p>
                    )}

                    <div className="space-y-4">
                        {workflows.map((workflow) => (
                            <div
                                key={workflow.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {workflow.name}
                                        </h3>
                                        {workflow.description && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                {workflow.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span>ID: {workflow.id}</span>
                                            <span className={`px-2 py-1 rounded ${workflow.isActive
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}>
                                                {workflow.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleUpdate(workflow.id)}
                                        disabled={updateMutation.isPending}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Update Name
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(workflow.id)}
                                        disabled={toggleActiveMutation.isPending}
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 disabled:opacity-50"
                                    >
                                        Toggle Active
                                    </button>
                                    <button
                                        onClick={() => handleDelete(workflow.id)}
                                        disabled={deleteMutation.isPending}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Page {pagination.currentPage} of {pagination.totalPages}
                                {' '}({pagination.total} total workflows)
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={!pagination.hasMore}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Test Results */}
                <div className="card bg-gray-100 dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        📊 Pagination Test Results
                    </h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className={data ? 'text-green-600' : 'text-gray-400'}>
                                {data ? '✅' : '⏳'}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                                Pagination: {data ? 'Working' : 'Loading...'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={pagination ? 'text-green-600' : 'text-gray-400'}>
                                {pagination ? '✅' : '⏳'}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                                Metadata: {pagination ? `Total: ${pagination.total}, Pages: ${pagination.totalPages}` : 'Loading...'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span className="text-gray-700 dark:text-gray-300">
                                Sorting: {sortBy} ({sortOrder})
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span className="text-gray-700 dark:text-gray-300">
                                Filter: {filterActive === undefined ? 'All' : filterActive ? 'Active Only' : 'Inactive Only'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={search ? 'text-green-600' : 'text-gray-400'}>
                                {search ? '✅' : '⏳'}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                                Search: {search || 'Not tested yet'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
