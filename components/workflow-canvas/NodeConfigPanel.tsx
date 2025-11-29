'use client';

import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { WorkflowNodeData } from '@/types/nodes';

/**
 * NODE CONFIGURATION PANEL
 * 
 * Slide-out panel for configuring node settings
 * - Opens when a node is selected
 * - Different forms for different node types
 * - Saves configuration to node data
 */

interface NodeConfigPanelProps {
    selectedNode: Node<WorkflowNodeData> | null;
    onSave: (nodeId: string, config: any) => void;
    onClose: () => void;
}

export function NodeConfigPanel({ selectedNode, onSave, onClose }: NodeConfigPanelProps) {
    const [config, setConfig] = useState<any>({});

    // Load existing config when node changes
    useEffect(() => {
        if (selectedNode?.data.config) {
            setConfig(selectedNode.data.config);
        } else {
            setConfig({});
        }
    }, [selectedNode]);

    if (!selectedNode) return null;

    const nodeType = (selectedNode.data as any).type;
    const nodeLabel = selectedNode.data.label;

    const handleSave = () => {
        onSave(selectedNode.id, config);
        onClose();
    };

    const updateConfig = (key: string, value: any) => {
        setConfig({ ...config, [key]: value });
    };

    // Render different forms based on node type
    const renderConfigForm = () => {
        switch (nodeType) {
            case 'gpt':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Model
                            </label>
                            <select
                                value={config.model || 'gpt-3.5-turbo'}
                                onChange={(e) => updateConfig('model', e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            >
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                System Prompt
                            </label>
                            <textarea
                                value={config.systemPrompt || ''}
                                onChange={(e) => updateConfig('systemPrompt', e.target.value)}
                                placeholder="You are a helpful assistant..."
                                rows={3}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                User Prompt
                            </label>
                            <textarea
                                value={config.prompt || ''}
                                onChange={(e) => updateConfig('prompt', e.target.value)}
                                placeholder="Process this text: {{input}}"
                                rows={4}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Use {`{{variableName}}`} to insert data from previous nodes
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Temperature: {config.temperature || 0.7}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={config.temperature || 0.7}
                                onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Focused</span>
                                <span>Balanced</span>
                                <span>Creative</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Max Tokens
                            </label>
                            <input
                                type="number"
                                value={config.maxTokens || 1000}
                                onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
                                min="1"
                                max="4000"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                );

            case 'google-sheets':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Operation
                            </label>
                            <select
                                value={config.operation || 'read'}
                                onChange={(e) => updateConfig('operation', e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            >
                                <option value="read">Read Data</option>
                                <option value="append">Append Row</option>
                                <option value="update">Update Cells</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Spreadsheet ID
                            </label>
                            <input
                                type="text"
                                value={config.spreadsheetId || ''}
                                onChange={(e) => updateConfig('spreadsheetId', e.target.value)}
                                placeholder="1BxiMVs0XRA5..."
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sheet Name
                            </label>
                            <input
                                type="text"
                                value={config.sheetName || 'Sheet1'}
                                onChange={(e) => updateConfig('sheetName', e.target.value)}
                                placeholder="Sheet1"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Range
                            </label>
                            <input
                                type="text"
                                value={config.range || 'A1:D10'}
                                onChange={(e) => updateConfig('range', e.target.value)}
                                placeholder="A1:D10"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                );

            case 'gmail':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                To
                            </label>
                            <input
                                type="email"
                                value={config.to || ''}
                                onChange={(e) => updateConfig('to', e.target.value)}
                                placeholder="recipient@example.com"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={config.subject || ''}
                                onChange={(e) => updateConfig('subject', e.target.value)}
                                placeholder="Email subject"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Body
                            </label>
                            <textarea
                                value={config.body || ''}
                                onChange={(e) => updateConfig('body', e.target.value)}
                                placeholder="Email body... Use {{data}} for dynamic content"
                                rows={6}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>No configuration needed for this node type.</p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Configure Node
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{nodeLabel}</p>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4">
                {renderConfigForm()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
