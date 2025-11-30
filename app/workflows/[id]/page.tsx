'use client';

import { use, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { WorkflowCanvas } from '@/components/workflow-canvas/WorkflowCanvas';
import { Node, Edge } from 'reactflow';
import { NODE_TEMPLATES } from '@/types/nodes';
import { executeWorkflow, ExecutionResult } from '@/lib/workflow-executor';
import { NodeConfigPanel } from '@/components/workflow-canvas/NodeConfigPanel';

/**
 * WORKFLOW EDITOR PAGE - N8N STYLE
 * 
 * Learning: Canvas-based workflow editor matching n8n's design
 * - Left toolbar with icons
 * - Slide-out nodes panel
 * - Canvas takes majority of space
 * - Dark canvas background
 * 
 * Phase 13: Workflow Canvas
 */

export default function WorkflowEditorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const workflowId = parseInt(resolvedParams.id);
    const router = useRouter();

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showNodesPanel, setShowNodesPanel] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [showConfigPanel, setShowConfigPanel] = useState(false);

    // Fetch workflow details
    const { data: workflow, isLoading } = trpc.workflows.getById.useQuery({
        id: workflowId,
    });

    // Load nodes and edges when workflow is fetched
    useEffect(() => {
        if (workflow) {
            // Load from database
            const loadedNodes = (workflow.nodesJson as any) || [];
            const loadedEdges = (workflow.edgesJson as any) || [];
            setNodes(loadedNodes);
            setEdges(loadedEdges);
        }
    }, [workflow]);

    // Save workflow mutation
    const saveMutation = trpc.workflows.update.useMutation({
        onSuccess: () => {
            setIsSaving(false);
        },
    });

    // Handle save
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            await saveMutation.mutateAsync({
                id: workflowId,
                name: workflow?.name || 'Untitled',
                nodesJson: nodes as any,
                edgesJson: edges as any,
            });
        } catch (error) {
            console.error('Failed to save workflow:', error);
            setIsSaving(false);
        }
    }, [workflowId, workflow, nodes, edges, saveMutation]);

    // Handle workflow execution
    const handleExecute = useCallback(async () => {
        if (nodes.length === 0) {
            alert('Add some nodes to execute!');
            return;
        }

        setIsExecuting(true);
        setExecutionResults([]);

        try {
            const result = await executeWorkflow(
                nodes,
                edges,
                // On node start
                (nodeId) => {
                    setNodes((prevNodes) =>
                        prevNodes.map((n) =>
                            n.id === nodeId
                                ? { ...n, data: { ...n.data, executionState: 'running' } }
                                : n
                        )
                    );
                },
                // On node complete
                (execResult) => {
                    setNodes((prevNodes) =>
                        prevNodes.map((n) =>
                            n.id === execResult.nodeId
                                ? {
                                    ...n,
                                    data: {
                                        ...n.data,
                                        executionState:
                                            execResult.status === 'success' ? 'success' : 'error',
                                    },
                                }
                                : n
                        )
                    );
                    setExecutionResults((prev) => [...prev, execResult]);
                },
                // On node error
                (nodeId, error) => {
                    setNodes((prevNodes) =>
                        prevNodes.map((n) =>
                            n.id === nodeId
                                ? { ...n, data: { ...n.data, executionState: 'error' } }
                                : n
                        )
                    );
                }
            );

            console.log('Execution completed:', result);
        } catch (error) {
            console.error('Execution failed:', error);
        } finally {
            setIsExecuting(false);
        }
    }, [nodes, edges]);

    // Handle node selection
    const handleNodeClick = useCallback((_event: any, node: Node) => {
        setSelectedNode(node);
        setShowConfigPanel(true);
    }, []);

    // Handle config save
    const handleConfigSave = useCallback((nodeId: string, config: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, config, configured: true } }
                    : node
            )
        );
    }, [setNodes]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white">Loading workflow...</div>
            </div>
        );
    }

    if (!workflow) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
                <div className="text-white text-xl mb-4">Workflow not found</div>
                <button
                    onClick={() => router.push('/workflows')}
                    className="text-blue-400 hover:text-blue-300"
                >
                    ← Back to workflows
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            {/* Top Toolbar */}
            <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
                {/* Left: Back button and workflow name */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/workflows')}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-white font-medium">{workflow.name}</h1>
                        {workflow.description && (
                            <p className="text-xs text-gray-400">{workflow.description}</p>
                        )}
                    </div>
                </div>

                {/* Center: Tabs */}
                <div className="flex items-center gap-1">
                    <button className="px-4 py-2 text-sm text-white bg-gray-700 rounded-lg">
                        Editor
                    </button>
                    <button className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        Executions
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mr-4">
                        <span className="text-xs text-gray-400">
                            {workflow.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600">
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${workflow.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                    {/* Execute Button */}
                    <button
                        onClick={handleExecute}
                        disabled={isExecuting || nodes.length === 0}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isExecuting || nodes.length === 0
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                    >
                        {isExecuting ? 'Executing...' : 'Execute'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex relative overflow-hidden">
                {/* Left Toolbar - n8n style */}
                <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 gap-4 z-20">
                    {/* Add Node Button */}
                    <button
                        onClick={() => setShowNodesPanel(!showNodesPanel)}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200 ${showNodesPanel
                            ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                            : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                            }`}
                        title="Add node"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>

                    {/* Search Button */}
                    <button
                        className="w-10 h-10 rounded-lg border border-gray-700 bg-transparent flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-all duration-200"
                        title="Search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {/* Workflow Button */}
                    <button
                        className="w-10 h-10 rounded-lg border border-gray-700 bg-transparent flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-all duration-200"
                        title="Workflow"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>

                    {/* Help Button */}
                    <button
                        className="w-10 h-10 rounded-lg border border-gray-700 bg-transparent flex items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-all duration-200"
                        title="Help"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </button>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* AI Button */}
                    <button
                        className="w-10 h-10 rounded-lg border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-200"
                        title="AI Assistant"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </button>
                </div>

                {/* Nodes Panel - Slides out from left */}
                <div
                    className={`absolute left-16 top-0 bottom-0 w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-10 ${showNodesPanel ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Nodes
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Drag nodes onto the canvas to build your workflow
                            </p>
                        </div>

                        {/* Nodes List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Triggers Section */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    TRIGGERS
                                </h3>
                                <div className="space-y-2">
                                    {Object.values(NODE_TEMPLATES)
                                        .filter(node => node.category === 'trigger')
                                        .map(node => (
                                            <div
                                                key={node.type}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('application/reactflow', node.type);
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                className="p-4 rounded-lg cursor-move transition-all duration-200 hover:scale-[1.02]"
                                                style={{ backgroundColor: node.color }}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-6 h-6 text-white">
                                                        {/* Icon placeholder - will be rendered by CustomNode */}
                                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            {node.icon === 'hand' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />}
                                                            {node.icon === 'link' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />}
                                                            {node.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-white">{node.label}</h4>
                                                </div>
                                                <p className="text-sm text-white/80">{node.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Google Services Section */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    GOOGLE SERVICES
                                </h3>
                                <div className="space-y-2">
                                    {Object.values(NODE_TEMPLATES)
                                        .filter(node => node.category === 'google')
                                        .map(node => (
                                            <div
                                                key={node.type}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('application/reactflow', node.type);
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                className="p-4 rounded-lg cursor-move transition-all duration-200 hover:scale-[1.02]"
                                                style={{ backgroundColor: node.color }}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-6 h-6 text-white">
                                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            {node.icon === 'table' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />}
                                                            {node.icon === 'mail' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                                                            {node.icon === 'calendar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                                                            {node.icon === 'file-text' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-white">{node.label}</h4>
                                                </div>
                                                <p className="text-sm text-white/80">{node.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* AI Section */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    AI
                                </h3>
                                <div className="space-y-2">
                                    {Object.values(NODE_TEMPLATES)
                                        .filter(node => node.category === 'ai')
                                        .map(node => (
                                            <div
                                                key={node.type}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('application/reactflow', node.type);
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                className="p-4 rounded-lg cursor-move transition-all duration-200 hover:scale-[1.02]"
                                                style={{ backgroundColor: node.color }}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-6 h-6 text-white">
                                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-white">{node.label}</h4>
                                                </div>
                                                <p className="text-sm text-white/80">{node.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Logic Section */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    LOGIC
                                </h3>
                                <div className="space-y-2">
                                    {Object.values(NODE_TEMPLATES)
                                        .filter(node => node.category === 'logic')
                                        .map(node => (
                                            <div
                                                key={node.type}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('application/reactflow', node.type);
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                className="p-4 rounded-lg cursor-move transition-all duration-200 hover:scale-[1.02]"
                                                style={{ backgroundColor: node.color }}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-6 h-6 text-white">
                                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-white">{node.label}</h4>
                                                </div>
                                                <p className="text-sm text-white/80">{node.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Actions Section */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    ACTIONS
                                </h3>
                                <div className="space-y-2">
                                    {Object.values(NODE_TEMPLATES)
                                        .filter(node => node.category === 'action')
                                        .map(node => (
                                            <div
                                                key={node.type}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('application/reactflow', node.type);
                                                    e.dataTransfer.effectAllowed = 'move';
                                                }}
                                                className="p-4 rounded-lg cursor-move transition-all duration-200 hover:scale-[1.02]"
                                                style={{ backgroundColor: node.color }}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-6 h-6 text-white">
                                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            {node.icon === 'globe' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />}
                                                            {node.icon === 'database' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />}
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-white">{node.label}</h4>
                                                </div>
                                                <p className="text-sm text-white/80">{node.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Canvas Area - Takes majority of space */}
                <div className="flex-1 relative overflow-hidden">
                    <WorkflowCanvas
                        workflowId={workflowId}
                        initialNodes={nodes}
                        initialEdges={edges}
                        onNodesChange={setNodes}
                        onEdgesChange={setEdges}
                        onNodeClick={handleNodeClick}
                    />
                </div>

                {/* Node Configuration Panel */}
                {showConfigPanel && (
                    <NodeConfigPanel
                        selectedNode={selectedNode}
                        onSave={handleConfigSave}
                        onClose={() => setShowConfigPanel(false)}
                    />
                )}
            </div>

            {/* Bottom Toolbar */}
            <div className="h-12 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{nodes.length} nodes</span>
                    <span>•</span>
                    <span>{edges.length} connections</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Zoom out">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                    <span className="text-xs text-gray-400 w-12 text-center">100%</span>
                    <button className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Zoom in">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
