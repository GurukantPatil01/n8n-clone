import { Node, Edge } from 'reactflow';
import { WorkflowNodeData } from '@/types/nodes';
import { generateChatCompletion } from '@/lib/openai';

/**
 * WORKFLOW EXECUTION ENGINE
 * 
 * Executes workflow nodes in topological order
 * - Parses workflow graph
 * - Executes nodes sequentially
 * - Passes data between nodes
 * - Handles errors
 */

export interface ExecutionContext {
    data: Record<string, any>; // Data passed between nodes
    variables: Record<string, any>; // Workflow variables
}

export interface ExecutionResult {
    nodeId: string;
    status: 'success' | 'error';
    output?: any;
    error?: string;
    duration: number;
}

export interface NodeExecutor {
    execute: (node: Node<WorkflowNodeData>, context: ExecutionContext) => Promise<any>;
}

/**
 * Topological sort to determine execution order
 * Returns nodes in order from triggers to final actions
 */
function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    // Initialize
    nodes.forEach(node => {
        inDegree.set(node.id, 0);
        adjacencyList.set(node.id, []);
    });

    // Build graph
    edges.forEach(edge => {
        const current = inDegree.get(edge.target) || 0;
        inDegree.set(edge.target, current + 1);
        const neighbors = adjacencyList.get(edge.source) || [];
        neighbors.push(edge.target);
        adjacencyList.set(edge.source, neighbors);
    });

    // Find starting nodes (triggers with no incoming edges)
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
        if (degree === 0) {
            queue.push(nodeId);
        }
    });

    const sorted: Node[] = [];
    while (queue.length > 0) {
        const nodeId = queue.shift()!;
        const node = nodeMap.get(nodeId);
        if (node) {
            sorted.push(node);
        }

        const neighbors = adjacencyList.get(nodeId) || [];
        neighbors.forEach(neighborId => {
            const current = inDegree.get(neighborId)!;
            inDegree.set(neighborId, current - 1);
            if (current - 1 === 0) {
                queue.push(neighborId);
            }
        });
    }

    return sorted;
}

/**
 * Execute a single node based on its type
 */
async function executeNode(
    node: Node<WorkflowNodeData>,
    context: ExecutionContext
): Promise<any> {
    const nodeData = node.data as any;

    // Simulate node execution based on type
    switch (nodeData.type) {
        case 'manual':
            // Manual trigger - just pass through
            return { triggered: true, timestamp: new Date().toISOString() };

        case 'webhook':
            return { method: 'POST', body: context.data };

        case 'schedule':
            return { scheduled: true, time: new Date().toISOString() };

        case 'google-sheets':
            // Mock Google Sheets operation
            await sleep(500);
            return {
                operation: nodeData.config?.operation || 'read',
                rows: [
                    ['Name', 'Email', 'Status'],
                    ['John Doe', 'john@example.com', 'Active'],
                    ['Jane Smith', 'jane@example.com', 'Active'],
                ],
            };

        case 'gmail':
            // Mock Gmail operation
            await sleep(500);
            return {
                operation: nodeData.config?.operation || 'send',
                to: nodeData.config?.to || 'user@example.com',
                subject: nodeData.config?.subject || 'Test Email',
                sent: true,
            };

        case 'google-calendar':
            await sleep(500);
            return {
                event: 'Meeting scheduled',
                time: new Date().toISOString(),
            };

        case 'google-docs':
            await sleep(500);
            return {
                document: 'Document created',
                url: 'https://docs.google.com/document/d/example',
            };

        case 'gpt':
            // Check if configured with real API
            if (nodeData.config?.prompt) {
                try {
                    await sleep(800);

                    // Use real OpenAI API
                    const systemPrompt = nodeData.config.systemPrompt || 'You are a helpful assistant.';
                    const userPrompt = nodeData.config.prompt;
                    const model = nodeData.config.model || 'gpt-3.5-turbo';
                    const temperature = nodeData.config.temperature || 0.7;
                    const maxTokens = nodeData.config.maxTokens || 1000;

                    // Replace variables in prompt with data from previous nodes
                    let processedPrompt = userPrompt;
                    Object.keys(context.data).forEach(key => {
                        const placeholder = `{{${key}}}`;
                        if (processedPrompt.includes(placeholder)) {
                            processedPrompt = processedPrompt.replace(
                                placeholder,
                                JSON.stringify(context.data[key])
                            );
                        }
                    });

                    const response = await generateChatCompletion({
                        model,
                        temperature,
                        maxTokens,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: processedPrompt },
                        ],
                    });

                    return {
                        prompt: userPrompt,
                        processedPrompt,
                        response,
                        model,
                    };
                } catch (error) {
                    throw new Error(`OpenAI API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            } else {
                // Mock GPT operation (fallback)
                await sleep(800);
                const prompt = nodeData.config?.prompt || 'Process this text';
                return {
                    prompt,
                    response: `AI processed: "${prompt}"\n\nResult: This is a simulated GPT response.`,
                    model: nodeData.config?.model || 'gpt-3.5-turbo',
                };
            }

        case 'http-request':
            await sleep(400);
            return {
                url: nodeData.config?.url || 'https://example.com/api',
                method: nodeData.config?.method || 'GET',
                status: 200,
                data: { success: true },
            };

        case 'set-variable':
            const varName = nodeData.config?.name || 'result';
            const varValue = nodeData.config?.value || context.data;
            context.variables[varName] = varValue;
            return { [varName]: varValue };

        default:
            return { executed: true, type: nodeData.type };
    }
}

// Helper sleep function
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute entire workflow
 */
export async function executeWorkflow(
    nodes: Node<WorkflowNodeData>[],
    edges: Edge[],
    onNodeStart?: (nodeId: string) => void,
    onNodeComplete?: (result: ExecutionResult) => void,
    onNodeError?: (nodeId: string, error: string) => void
): Promise<{
    success: boolean;
    results: ExecutionResult[];
    finalData: any;
}> {
    const context: ExecutionContext = {
        data: {},
        variables: {},
    };

    const results: ExecutionResult[] = [];
    const sortedNodes = topologicalSort(nodes, edges);

    console.log('Execution order:', sortedNodes.map(n => `${n.id} (${(n.data as any).type})`));

    for (const node of sortedNodes) {
        const startTime = Date.now();

        try {
            // Notify start
            onNodeStart?.(node.id);

            // Execute node
            const output = await executeNode(node, context);

            // Store output for next nodes
            context.data[node.id] = output;

            const duration = Date.now() - startTime;
            const result: ExecutionResult = {
                nodeId: node.id,
                status: 'success',
                output,
                duration,
            };

            results.push(result);
            onNodeComplete?.(result);

        } catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            const result: ExecutionResult = {
                nodeId: node.id,
                status: 'error',
                error: errorMessage,
                duration,
            };

            results.push(result);
            onNodeError?.(node.id, errorMessage);

            // Stop execution on error
            return {
                success: false,
                results,
                finalData: context.data,
            };
        }
    }

    return {
        success: true,
        results,
        finalData: context.data,
    };
}
