import { Handle, Position } from 'reactflow';

/**
 * CONDITION NODE COMPONENT
 * 
 * Purpose: Branching logic in workflows
 * - If/else conditions
 * - Switch statements
 * - Filters
 * 
 * Design: Purple gradient with diamond icon
 */

interface ConditionNodeData {
    label: string;
    description?: string;
    icon?: string;
}

export function ConditionNode({ data }: { data: ConditionNodeData }) {
    return (
        <div className="custom-node condition-node group">
            {/* Input handle (left side) */}
            <Handle
                type="target"
                position={Position.Left}
                className="node-handle"
            />

            {/* Output handles (right side - true/false) */}
            <Handle
                type="source"
                position={Position.Right}
                id="true"
                className="node-handle"
                style={{ top: '30%' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="false"
                className="node-handle"
                style={{ top: '70%' }}
            />

            {/* Node Header */}
            <div className="node-header bg-gradient-to-br from-purple-500 to-pink-500">
                <div className="node-icon text-3xl">
                    {data.icon || '◆'}
                </div>
            </div>

            {/* Node Body */}
            <div className="node-body">
                <h4 className="node-title">{data.label}</h4>
                {data.description && (
                    <p className="node-description">{data.description}</p>
                )}
                <div className="flex gap-2 mt-2 text-xs">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">True</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded">False</span>
                </div>
            </div>

            {/* Hover indicator */}
            <div className="node-type-badge">Condition</div>
        </div>
    );
}
