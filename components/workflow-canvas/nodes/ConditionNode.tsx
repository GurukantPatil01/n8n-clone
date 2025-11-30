'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { WorkflowNodeData } from '@/types/nodes';

/**
 * CONDITION NODE - Decision Diamond Shape
 * 
 * Visual design for branching logic:
 * - Diamond/rhombus shape
 * - 1 input on left
 * - 2 outputs on right (TRUE/FALSE)
 * - Clear labels for each branch
 */

interface ConditionNodeProps extends NodeProps {
    data: WorkflowNodeData & {
        icon?: string;
        color?: string;
        inputs?: number;
        outputs?: number;
    };
}

export const ConditionNode = memo(({ data, selected }: ConditionNodeProps) => {
    // Get condition details if configured
    const config = data.config as any;
    const hasConfig = config?.leftValue && config?.operator && config?.rightValue;

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

    const operatorSymbol = {
        equals: '=',
        notEquals: '≠',
        greaterThan: '>',
        greaterThanOrEqual: '≥',
        lessThan: '<',
        lessThanOrEqual: '≤',
        contains: '∋'
    }[config?.operator] || '?';

    return (
        <div className="relative">
            {/* Input Handle - Left side */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-orange-400 !border-2 !border-orange-600 !rounded-full"
                style={{ left: '-8px', top: '50%' }}
            />

            {/* Diamond/Decision Shape Container */}
            <div
                className={`
                    relative w-[180px] h-[180px]
                    flex items-center justify-center
                    transition-all duration-200
                `}
            >
                {/* Diamond Background */}
                <svg
                    viewBox="0 0 180 180"
                    className={`absolute inset-0 ${selected ? 'drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]' : ''
                        }`}
                >
                    {/* Diamond shape (rotated square) */}
                    <path
                        d="M 90 10 L 170 90 L 90 170 L 10 90 Z"
                        fill="rgba(31, 41, 55, 0.95)"
                        stroke={selected ? '#fb923c' : '#6B7280'}
                        strokeWidth={selected ? '3' : '2'}
                        className="transition-all duration-200"
                    />
                    {/* Inner glow for selected state */}
                    {selected && (
                        <path
                            d="M 90 10 L 170 90 L 90 170 L 10 90 Z"
                            fill="none"
                            stroke="#fb923c"
                            strokeWidth="1"
                            opacity="0.3"
                            className="animate-pulse"
                        />
                    )}
                </svg>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center px-4">
                    {/* Icon */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-lg"
                        style={{ backgroundColor: '#F97316' }}
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </div>

                    {/* Label */}
                    <span className="text-xs font-bold text-gray-100 text-center mb-1">
                        IF
                    </span>

                    {/* Condition Preview */}
                    {hasConfig ? (
                        <div className="text-[10px] text-center text-gray-300 leading-tight max-w-[120px]">
                            <div className="font-mono truncate">{config.leftValue}</div>
                            <div className="text-orange-400 font-bold text-sm my-0.5">{operatorSymbol}</div>
                            <div className="font-mono truncate">{config.rightValue}</div>
                        </div>
                    ) : (
                        <div className="text-[10px] text-gray-400 text-center mt-1">
                            Not configured
                        </div>
                    )}
                </div>

                {/* Execution Status Indicator */}
                {data.executionState && data.executionState !== 'idle' && (
                    <div className="absolute top-2 right-2 z-20">
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

            {/* Output Handle - TRUE (top-right) */}
            <Handle
                type="source"
                position={Position.Right}
                id="true"
                className="!w-3 !h-3 !bg-green-400 !border-2 !border-green-600 !rounded-full"
                style={{ right: '-8px', top: '35%' }}
            />
            {/* TRUE Label */}
            <div
                className="absolute text-[10px] font-bold text-green-400 bg-gray-900/90 px-1.5 py-0.5 rounded border border-green-600/30"
                style={{ right: '12px', top: '30%' }}
            >
                TRUE
            </div>

            {/* Output Handle - FALSE (bottom-right) */}
            <Handle
                type="source"
                position={Position.Right}
                id="false"
                className="!w-3 !h-3 !bg-red-400 !border-2 !border-red-600 !rounded-full"
                style={{ right: '-8px', top: '65%' }}
            />
            {/* FALSE Label */}
            <div
                className="absolute text-[10px] font-bold text-red-400 bg-gray-900/90 px-1.5 py-0.5 rounded border border-red-600/30"
                style={{ right: '12px', top: '68%' }}
            >
                FALSE
            </div>
        </div>
    );
});

ConditionNode.displayName = 'ConditionNode';
