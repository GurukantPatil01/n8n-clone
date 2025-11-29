import { Handle, Position } from 'reactflow';

/**
 * ACTION NODE COMPONENT
 * 
 * Purpose: Perform actions in workflows
 * - Send emails
 * - HTTP requests
 * - Database operations
 * 
 * Design: Blue gradient with gear icon
 */

interface ActionNodeData {
    label: string;
    description?: string;
    icon?: string;
}

export function ActionNode({ data }: { data: ActionNodeData }) {
    return (
        <div className="custom-node action-node group">
            {/* Input handle (left side) */}
            <Handle
                type="target"
                position={Position.Left}
                className="node-handle"
            />

            {/* Output handle (right side) */}
            <Handle
                type="source"
                position={Position.Right}
                className="node-handle"
            />

            {/* Node Header */}
            <div className="node-header gradient-primary">
                <div className="node-icon text-3xl">
                    {data.icon || '⚙️'}
                </div>
            </div>

            {/* Node Body */}
            <div className="node-body">
                <h4 className="node-title">{data.label}</h4>
                {data.description && (
                    <p className="node-description">{data.description}</p>
                )}
            </div>

            {/* Hover indicator */}
            <div className="node-type-badge">Action</div>
        </div>
    );
}
