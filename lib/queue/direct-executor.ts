/**
 * SIMPLE IN-MEMORY EXECUTOR (Fallback when Redis is not available)
 * 
 * Learning: This provides a fallback execution method
 * - Works without Redis
 * - Executes workflows synchronously
 * - Good for development/testing
 * 
 * In production, always use BullMQ with Redis for:
 * - Async execution
 * - Job persistence
 * - Retries
 * - Scaling
 */

import { executeWorkflow } from './executor';
import type { WorkflowJobData } from './workflow-queue';

/**
 * Execute workflow immediately (no queue)
 */
export async function executeWorkflowDirect(data: WorkflowJobData) {
    console.log('⚠️  Executing workflow directly (no queue)');
    console.log('💡 For production, set up Redis and use BullMQ');

    return await executeWorkflow(data);
}

/**
 * Check if Redis/BullMQ is available
 */
export async function isQueueAvailable(): Promise<boolean> {
    try {
        const { redis } = await import('./redis');
        await redis.ping();
        return true;
    } catch (error) {
        return false;
    }
}
