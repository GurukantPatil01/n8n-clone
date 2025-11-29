/**
 * NODE TYPE DEFINITIONS
 * 
 * Learning: Types for workflow nodes
 * - Different categories: triggers, google services, AI, actions
 * - Node data structure
 * - Configuration types
 */

export type NodeCategory = 'trigger' | 'google' | 'ai' | 'action';

export type NodeType =
    // Triggers
    | 'manual'
    | 'webhook'
    | 'schedule'
    // Google Services
    | 'google-sheets'
    | 'gmail'
    | 'google-calendar'
    | 'google-docs'
    // AI
    | 'gpt'
    // Actions
    | 'http-request'
    | 'set-variable';

export interface NodeTemplate {
    type: NodeType;
    category: NodeCategory;
    label: string;
    description: string;
    icon: string;
    color: string;
    inputs: number;
    outputs: number;
}

export const NODE_TEMPLATES: Record<NodeType, NodeTemplate> = {
    // Triggers
    'manual': {
        type: 'manual',
        category: 'trigger',
        label: 'Manual',
        description: 'Start manually',
        icon: 'hand',
        color: '#14B8A6', // teal-500
        inputs: 0,
        outputs: 1,
    },
    'webhook': {
        type: 'webhook',
        category: 'trigger',
        label: 'Webhook',
        description: 'Trigger on HTTP request',
        icon: 'link',
        color: '#14B8A6',
        inputs: 0,
        outputs: 1,
    },
    'schedule': {
        type: 'schedule',
        category: 'trigger',
        label: 'Schedule',
        description: 'Run on a schedule',
        icon: 'clock',
        color: '#14B8A6',
        inputs: 0,
        outputs: 1,
    },

    // Google Services
    'google-sheets': {
        type: 'google-sheets',
        category: 'google',
        label: 'Google Sheets',
        description: 'Read/write Google Sheets',
        icon: 'table',
        color: '#10B981', // green-500
        inputs: 1,
        outputs: 1,
    },
    'gmail': {
        type: 'gmail',
        category: 'google',
        label: 'Gmail',
        description: 'Send/read emails',
        icon: 'mail',
        color: '#EF4444', // red-500
        inputs: 1,
        outputs: 1,
    },
    'google-calendar': {
        type: 'google-calendar',
        category: 'google',
        label: 'Google Calendar',
        description: 'Manage calendar events',
        icon: 'calendar',
        color: '#3B82F6', // blue-500
        inputs: 1,
        outputs: 1,
    },
    'google-docs': {
        type: 'google-docs',
        category: 'google',
        label: 'Google Docs',
        description: 'Create/edit documents',
        icon: 'file-text',
        color: '#2563EB', // blue-600
        inputs: 1,
        outputs: 1,
    },

    // AI
    'gpt': {
        type: 'gpt',
        category: 'ai',
        label: 'GPT',
        description: 'Process with AI',
        icon: 'sparkles',
        color: '#A855F7', // purple-500
        inputs: 1,
        outputs: 1,
    },

    // Actions
    'http-request': {
        type: 'http-request',
        category: 'action',
        label: 'HTTP Request',
        description: 'Make an HTTP request',
        icon: 'globe',
        color: '#3B82F6', // blue-500
        inputs: 1,
        outputs: 1,
    },
    'set-variable': {
        type: 'set-variable',
        category: 'action',
        label: 'Set Variable',
        description: 'Set a variable value',
        icon: 'database',
        color: '#6366F1', // indigo-500
        inputs: 1,
        outputs: 1,
    },
};

// Configuration types for different nodes
export interface GoogleSheetsConfig {
    operation: 'read' | 'write' | 'update';
    spreadsheetId: string;
    sheetName: string;
    range?: string;
}

export interface GmailConfig {
    operation: 'send' | 'read' | 'search';
    to?: string;
    subject?: string;
    body?: string;
    searchQuery?: string;
}

export interface GPTConfig {
    model: 'gpt-3.5-turbo' | 'gpt-4';
    prompt: string;
    temperature?: number;
    maxTokens?: number;
}

export interface HTTPRequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    headers?: Record<string, string>;
    body?: string;
}

export type NodeConfig =
    | GoogleSheetsConfig
    | GmailConfig
    | GPTConfig
    | HTTPRequestConfig
    | Record<string, any>;

export interface WorkflowNodeData {
    label: string;
    type: NodeType;
    config?: NodeConfig;
    executionState?: 'idle' | 'running' | 'success' | 'error';
    executionResult?: any;
}
