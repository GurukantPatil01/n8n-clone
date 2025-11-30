'use client';

import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { WorkflowNodeData } from '@/types/nodes';

/**
 * NODE CONFIGURATION MODAL - N8N STYLE
 * 
 * Centered modal that appears on top of canvas
 * - Professional tabbed interface
 * - Input/Output sections
 * - Proper close on backdrop click
 */

interface NodeConfigPanelProps {
    selectedNode: Node<WorkflowNodeData> | null;
    onSave: (nodeId: string, config: any) => void;
    onClose: () => void;
}

export function NodeConfigPanel({ selectedNode, onSave, onClose }: NodeConfigPanelProps) {
    const [config, setConfig] = useState<any>({});
    const [activeTab, setActiveTab] = useState<'parameters' | 'settings'>('parameters');

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
            case 'http-request':
                return (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Request Method
                            </label>
                            <select
                                value={config.method || 'GET'}
                                onChange={(e) => updateConfig('method', e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PATCH">PATCH</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                URL *
                            </label>
                            <input
                                type="text"
                                value={config.url || ''}
                                onChange={(e) => updateConfig('url', e.target.value)}
                                placeholder="https://api.example.com/endpoint"
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">
                                Use <code className="px-1 py-0.5 bg-gray-800 rounded">{`{{variable}}`}</code> for dynamic values
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Headers
                            </label>
                            <textarea
                                value={config.headers || ''}
                                onChange={(e) => updateConfig('headers', e.target.value)}
                                placeholder='{"Authorization": "Bearer {{token}}", "Content-Type": "application/json"}'
                                rows={4}
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 font-mono text-sm"
                            />
                        </div>

                        {(config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Body
                                </label>
                                <textarea
                                    value={config.body || ''}
                                    onChange={(e) => updateConfig('body', e.target.value)}
                                    placeholder='{"key": "value"}'
                                    rows={6}
                                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 font-mono text-sm"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'gpt':
                return (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Model
                            </label>
                            <select
                                value={config.model || 'gpt-3.5-turbo'}
                                onChange={(e) => updateConfig('model', e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100"
                            >
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                System Prompt
                            </label>
                            <textarea
                                value={config.systemPrompt || ''}
                                onChange={(e) => updateConfig('systemPrompt', e.target.value)}
                                placeholder="You are a helpful assistant that analyzes leads..."
                                rows={3}
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                User Prompt *
                            </label>
                            <textarea
                                value={config.prompt || ''}
                                onChange={(e) => updateConfig('prompt', e.target.value)}
                                placeholder="Analyze this lead and score from 1-10:\nName: {{webhook.name}}\nCompany: {{webhook.company}}"
                                rows={5}
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">
                                Reference previous nodes: <code className="px-1 py-0.5 bg-gray-800 rounded">{`{{nodeId.field}}`}</code>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Temperature: {config.temperature || 0.7}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={config.temperature || 0.7}
                                onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Focused (0)</span>
                                <span>Balanced (1)</span>
                                <span>Creative (2)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Max Tokens
                            </label>
                            <input
                                type="number"
                                value={config.maxTokens || 1000}
                                onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
                                min="1"
                                max="4000"
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-100"
                            />
                        </div>
                    </div>
                );

            case 'google-sheets':
                return (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Operation
                            </label>
                            <select
                                value={config.operation || 'append'}
                                onChange={(e) => updateConfig('operation', e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100"
                            >
                                <option value="read">Read Data</option>
                                <option value="append">Append Row</option>
                                <option value="update">Update Cells</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Spreadsheet ID *
                            </label>
                            <input
                                type="text"
                                value={config.spreadsheetId || ''}
                                onChange={(e) => updateConfig('spreadsheetId', e.target.value)}
                                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100 placeholder-gray-500 font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Sheet Name
                            </label>
                            <input
                                type="text"
                                value={config.sheetName || 'Sheet1'}
                                onChange={(e) => updateConfig('sheetName', e.target.value)}
                                placeholder="Sheet1"
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                        </div>

                        {config.operation === 'append' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Data to Append
                                </label>
                                <textarea
                                    value={config.data || ''}
                                    onChange={(e) => updateConfig('data', e.target.value)}
                                    placeholder="{{webhook.name}}, {{webhook.email}}, {{gpt.score}}"
                                    rows={3}
                                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                                />
                                <p className="text-xs text-gray-400 mt-1.5">
                                    Comma-separated values. Use variables from previous nodes.
                                </p>
                            </div>
                        )}

                        {config.operation === 'read' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Range
                                </label>
                                <input
                                    type="text"
                                    value={config.range || 'A1:D10'}
                                    onChange={(e) => updateConfig('range', e.target.value)}
                                    placeholder="A1:D10"
                                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'gmail':
                return (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                To *
                            </label>
                            <input
                                type="email"
                                value={config.to || ''}
                                onChange={(e) => updateConfig('to', e.target.value)}
                                placeholder="sales@company.com"
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                value={config.subject || ''}
                                onChange={(e) => updateConfig('subject', e.target.value)}
                                placeholder="🔥 Hot Lead: {{webhook.name}}"
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Body *
                            </label>
                            <textarea
                                value={config.body || ''}
                                onChange={(e) => updateConfig('body', e.target.value)}
                                placeholder="High-value lead detected!&#10;&#10;Contact: {{webhook.name}}&#10;Email: {{webhook.email}}&#10;Company: {{http-request.company}}&#10;Score: {{gpt.score}}/10"
                                rows={8}
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">
                                Use variables to personalize: <code className="px-1 py-0.5 bg-gray-800 rounded">{`{{nodeId.field}}`}</code>
                            </p>
                        </div>
                    </div>
                );

            case 'condition':
                return (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Left Value *
                            </label>
                            <input
                                type="text"
                                value={config.leftValue || ''}
                                onChange={(e) => updateConfig('leftValue', e.target.value)}
                                placeholder="{{gpt.score}}"
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Operator
                            </label>
                            <select
                                value={config.operator || 'greaterThanOrEqual'}
                                onChange={(e) => updateConfig('operator', e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100"
                            >
                                <option value="equals">Equals (=)</option>
                                <option value="notEquals">Not Equals (≠)</option>
                                <option value="greaterThan">Greater Than (&gt;)</option>
                                <option value="greaterThanOrEqual">Greater or Equal (≥)</option>
                                <option value="lessThan">Less Than (&lt;)</option>
                                <option value="lessThanOrEqual">Less or Equal (≤)</option>
                                <option value="contains">Contains</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Right Value *
                            </label>
                            <input
                                type="text"
                                value={config.rightValue || ''}
                                onChange={(e) => updateConfig('rightValue', e.target.value)}
                                placeholder="7"
                                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                            />
                        </div>

                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-300 font-mono">
                                If {config.leftValue || '{{value}}'} {' '}
                                {config.operator === 'greaterThanOrEqual' && '≥'} {' '}
                                {config.rightValue || '{{value}}'}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                TRUE → Left output &nbsp;&nbsp;|&nbsp;&nbsp; FALSE → Right output
                            </p>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-12 text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-lg mb-1">No configuration needed</p>
                        <p className="text-sm">This node works automatically</p>
                    </div>
                );
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                onClick={onClose}
            />

            {/* Modal - Centered on top */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                <div
                    className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Tabs */}
                    <div className="border-b border-gray-700">
                        <div className="p-6 pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        Configure Node
                                    </h3>
                                    <p className="text-sm text-gray-400">{nodeLabel}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setActiveTab('parameters')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'parameters'
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                >
                                    Parameters
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'settings'
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                >
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'parameters' ? (
                            renderConfigForm()
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Node Name
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedNode.data.label}
                                        readOnly
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">Retry on Failure</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Automatically retry if this node fails</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={config.retryOnFailure ?? true}
                                            onChange={(e) => updateConfig('retryOnFailure', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-700 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
