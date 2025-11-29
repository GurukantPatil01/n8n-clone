import { Handle, Position } from 'reactflow';

/**
 * TRIGGER NODE COMPONENT
 * 
 * Purpose: Starting point for workflows
 * - Webhook triggers
 * - Schedule triggers
 * - Manual triggers
 * 
 * Design: Green gradient with lightning icon
 */

interface TriggerNodeData {
    label: string;
    description?: string;
    icon?: string;
}

export function TriggerNode({ data }: { data: TriggerNodeData }) {
    return (
        <div className="custom-node trigger-node group">
            {/* Output handle (right side) */}
            <Handle
                type="source"
                position={Position.Right}
                className="node-handle"
            />

            {/* Node Header */}
            <div className="node-header gradient-success">
                <div className="node-icon text-3xl">
                    {data.icon || '⚡'}
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
            <div className="node-type-badge">Trigger</div>
        </div>
    );
}
