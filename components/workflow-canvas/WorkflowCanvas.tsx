'use client';

import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
} from 'reactflow';
import { CustomNode } from './nodes/CustomNode';
import { ConditionNode } from './nodes/ConditionNode';
import { NODE_TEMPLATES, NodeType, WorkflowNodeData } from '@/types/nodes';
import 'reactflow/dist/style.css';

/**
 * WORKFLOW CANVAS COMPONENT
 * 
 * Visual workflow editor using React Flow
 * - Drag and drop nodes from panel
 * - Connect nodes with edges
 * - Zoom and pan
 * - Mini-map for navigation
 */

// Node type mapping - condition uses special diamond shape
const nodeTypes = {
    'manual': CustomNode,
    'webhook': CustomNode,
    'schedule': CustomNode,
    'google-sheets': CustomNode,
    'gmail': CustomNode,
    'google-calendar': CustomNode,
    'google-docs': CustomNode,
    'gpt': CustomNode,
    'condition': ConditionNode, // Special diamond shape for branching
    'http-request': CustomNode,
    'set-variable': CustomNode,
};

interface WorkflowCanvasProps {
    workflowId?: number;
    initialNodes?: Node<WorkflowNodeData>[];
    initialEdges?: Edge[];
    onNodesChange?: (nodes: Node<WorkflowNodeData>[]) => void;
    onEdgesChange?: (edges: Edge[]) => void;
    onNodeClick?: (event: any, node: Node) => void;
}

export function WorkflowCanvas({
    workflowId,
    initialNodes = [],
    initialEdges = [],
    onNodesChange: onNodesChangeProp,
    onEdgesChange: onEdgesChangeProp,
    onNodeClick: onNodeClickProp,
}: WorkflowCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    // Sync with initialNodes/initialEdges when they change (on workflow load)
    useEffect(() => {
        if (initialNodes.length > 0 && nodes.length === 0) {
            setNodes(initialNodes);
        }
    }, [initialNodes, setNodes]);

    useEffect(() => {
        if (initialEdges.length > 0 && edges.length === 0) {
            setEdges(initialEdges);
        }
    }, [initialEdges, setEdges]);

    // Handle new connections
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge({
                ...params,
                animated: true,
                style: { stroke: '#3b82f6', strokeWidth: 2 },
                type: 'smoothstep',
            }, eds));
        },
        [setEdges]
    );

    // Handle drag over (for dropping nodes)
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Handle drop (add new node)
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowInstance) return;

            const nodeType = event.dataTransfer.getData('application/reactflow') as NodeType;
            if (!nodeType || !NODE_TEMPLATES[nodeType]) return;

            const template = NODE_TEMPLATES[nodeType];
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node<WorkflowNodeData> = {
                id: `${nodeType}-${Date.now()}`,
                type: nodeType,
                position,
                data: {
                    label: template.label,
                    type: nodeType,
                    icon: template.icon,
                    color: template.color,
                    inputs: template.inputs,
                    outputs: template.outputs,
                    executionState: 'idle',
                } as any,
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    // Notify parent of changes
    useEffect(() => {
        if (onNodesChangeProp) {
            onNodesChangeProp(nodes);
        }
    }, [nodes, onNodesChangeProp]);

    useEffect(() => {
        if (onEdgesChangeProp) {
            onEdgesChangeProp(edges);
        }
    }, [edges, onEdgesChangeProp]);

    // Empty state when no nodes
    const isEmpty = nodes.length === 0;

    return (
        <div className="w-full h-full bg-gray-900 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClickProp}
                fitView
                className="bg-gray-900"
            >
                <Background color="#374151" />
                <Controls className="bg-gray-800 border border-gray-700" />
                <MiniMap
                    className="bg-gray-800 border border-gray-700"
                    nodeColor={(node) => {
                        const nodeData = node.data as WorkflowNodeData & { color?: string };
                        return nodeData.color || '#6b7280';
                    }}
                />
            </ReactFlow>

            {/* Empty State */}
            {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="text-lg font-medium mb-2">Start building your workflow</p>
                        <p className="text-sm">Drag nodes from the left panel onto the canvas</p>
                    </div>
                </div>
            )}
        </div>
    );
}
