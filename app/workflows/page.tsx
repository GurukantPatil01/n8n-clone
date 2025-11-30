'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';

export default function WorkflowsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading } = trpc.workflows.list.useQuery();
    const workflows = data?.workflows || [];

    const filteredWorkflows = workflows.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Workflows</h1>
                        <p className="text-gray-600">Create and manage your workflows</p>
                    </div>
                    <Link
                        href="/workflows/new"
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New workflow
                    </Link>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search workflows"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Workflows List or Empty State */}
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading...</div>
                ) : filteredWorkflows.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No items</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? "No workflows match your search." : "You haven't created any workflows yet."}
                        </p>
                        {!searchTerm && (
                            <p className="text-gray-600 mb-6">Get started by creating your first workflow</p>
                        )}
                        <Link
                            href="/workflows/new"
                            className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Add item
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        {filteredWorkflows.map((workflow, index) => (
                            <Link
                                key={workflow.id}
                                href={`/workflows/${workflow.id}`}
                                className={`block p-4 hover:bg-gray-50 transition-colors ${index !== 0 ? 'border-t border-gray-200' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1">{workflow.name}</h3>
                                        {workflow.description && (
                                            <p className="text-sm text-gray-600">{workflow.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span>{workflow.nodes?.length || 0} nodes</span>
                                            <span>•</span>
                                            <span>{new Date(workflow.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {workflow.isActive && (
                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {filteredWorkflows.length > 0 && (
                    <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
                        <div>Page 1 of 1</div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                                Previous
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
