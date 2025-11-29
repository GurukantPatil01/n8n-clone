'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { WorkflowNodeData } from '@/types/nodes';

/**
 * CUSTOM NODE - n8n style
 * 
 * Features:
 * - Smooth rounded edges
 * - Large centered icon
 * - Clean minimal design
 * - Subtle border
 * - No sharp corners!
 */

interface CustomNodeProps extends NodeProps {
    data: WorkflowNodeData & {
        icon?: string;
        color?: string;
        inputs?: number;
        outputs?: number;
    };
}

export const CustomNode = memo(({ data, selected }: CustomNodeProps) => {
    const hasInputs = (data.inputs ?? 1) > 0;
    const hasOutputs = (data.outputs ?? 1) > 0;

    // Get icon SVG based on icon name
    const getIcon = () => {
        switch (data.icon) {
            case 'hand':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />;
            case 'link':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />;
            case 'clock':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
            case 'table':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />;
            case 'mail':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
            case 'calendar':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
            case 'file-text':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
            case 'sparkles':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />;
            case 'globe':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />;
            case 'database':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />;
            default:
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />;
        }
    };

    // Status colors
    const getStatusColor = () => {
        switch (data.executionState) {
            case 'running':
                return 'bg-yellow-500';
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-600';
        }
    };

    // Get lighter background color
    const getLightColor = (baseColor: string) => {
        // Add transparency to create lighter version
        return baseColor + '20'; // 20 is 12.5% opacity in hex
    };

    return (
        <div className="relative">
            {/* Input Handle */}
            {hasInputs && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-2.5 !h-2.5 !bg-gray-400 !border-2 !border-gray-700 !rounded-full"
                    style={{ left: '-7px' }}
                />
            )}

            {/* Node Container - Smooth rounded design */}
            <div
                className={`
                    relative min-w-[140px] px-4 py-3
                    bg-gray-800/90
                    rounded-2xl
                    border-2 transition-all duration-200
                    backdrop-blur-sm
                    ${selected
                        ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                        : 'border-gray-600/50 hover:border-gray-500/70'
                    }
                `}
            >
                {/* Icon Circle - Centered and prominent */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-1 shadow-lg"
                        style={{
                            backgroundColor: data.color || '#6b7280',
                        }}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {getIcon()}
                        </svg>
                    </div>

                    {/* Node Label */}
                    <span className="text-sm font-medium text-gray-100 text-center leading-tight whitespace-nowrap">
                        {data.label}
                    </span>

                    {/* Config indicator */}
                    {data.config && (
                        <div className="text-[10px] text-gray-400 mt-0.5">
                            Configured
                        </div>
                    )}
                </div>

                {/* Execution Status Indicator - Bottom right */}
                {data.executionState && data.executionState !== 'idle' && (
                    <div className="absolute -bottom-1 -right-1">
                        <div className={`w-5 h-5 rounded-full ${getStatusColor()} border-2 border-gray-800 flex items-center justify-center ${data.executionState === 'running' ? 'animate-pulse' : ''
                            }`}>
                            {data.executionState === 'success' && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {data.executionState === 'error' && (
                                <span className="text-white text-xs font-bold">!</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Output Handle */}
            {hasOutputs && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="!w-2.5 !h-2.5 !bg-gray-400 !border-2 !border-gray-700 !rounded-full"
                    style={{ right: '-7px' }}
                />
            )}
        </div>
    );
});

CustomNode.displayName = 'CustomNode';
