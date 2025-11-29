'use client';

/**
 * NODE TOOLBAR COMPONENT
 * 
 * Displays available nodes that can be dragged onto the canvas
 * - Trigger nodes (green)
 * - Action nodes (blue)
 * - Condition nodes (purple)
 */

interface NodeButtonProps {
    type: string;
    label: string;
    icon: string;
    description: string;
    color: string;
}

function NodeButton({ type, label, icon, description, color }: NodeButtonProps) {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('label', label);
        event.dataTransfer.setData('icon', icon);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            className={`${color} p-4 rounded-xl cursor-grab active:cursor-grabbing hover-lift group`}
        >
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <h4 className="font-bold text-white">{label}</h4>
            </div>
            <p className="text-sm text-white/80">{description}</p>
            <div className="mt-2 text-xs text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                Drag to canvas →
            </div>
        </div>
    );
}

export function NodeToolbar() {
    return (
        <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Nodes
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Drag nodes onto the canvas to build your workflow
                    </p>
                </div>

                {/* Trigger Nodes */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Triggers
                    </h3>
                    <div className="space-y-3">
                        <NodeButton
                            type="trigger"
                            label="Webhook"
                            icon="🔗"
                            description="Trigger on HTTP request"
                            color="gradient-success"
                        />
                        <NodeButton
                            type="trigger"
                            label="Schedule"
                            icon="⏰"
                            description="Run on a schedule"
                            color="gradient-success"
                        />
                        <NodeButton
                            type="trigger"
                            label="Manual"
                            icon="👆"
                            description="Start manually"
                            color="gradient-success"
                        />
                    </div>
                </div>

                {/* Action Nodes */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Actions
                    </h3>
                    <div className="space-y-3">
                        <NodeButton
                            type="action"
                            label="HTTP Request"
                            icon="🌐"
                            description="Make API calls"
                            color="gradient-primary"
                        />
                        <NodeButton
                            type="action"
                            label="Send Email"
                            icon="📧"
                            description="Send email messages"
                            color="gradient-primary"
                        />
                        <NodeButton
                            type="action"
                            label="Database"
                            icon="💾"
                            description="Query or insert data"
                            color="gradient-primary"
                        />
                        <NodeButton
                            type="action"
                            label="Transform"
                            icon="🔄"
                            description="Modify data"
                            color="gradient-primary"
                        />
                    </div>
                </div>

                {/* Condition Nodes */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Conditions
                    </h3>
                    <div className="space-y-3">
                        <NodeButton
                            type="condition"
                            label="If/Else"
                            icon="◆"
                            description="Branch based on condition"
                            color="bg-gradient-to-br from-purple-500 to-pink-500"
                        />
                        <NodeButton
                            type="condition"
                            label="Switch"
                            icon="🔀"
                            description="Multiple branches"
                            color="bg-gradient-to-br from-purple-500 to-pink-500"
                        />
                        <NodeButton
                            type="condition"
                            label="Filter"
                            icon="🔍"
                            description="Filter items"
                            color="bg-gradient-to-br from-purple-500 to-pink-500"
                        />
                    </div>
                </div>

                {/* Help Text */}
                <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 p-4">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                        💡 Quick Tip
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                        Drag a node from this panel onto the canvas, then connect nodes by dragging from one handle to another!
                    </p>
                </div>
            </div>
        </div>
    );
}
