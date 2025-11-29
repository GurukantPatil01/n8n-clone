import { Queue, QueueOptions } from 'bullmq';
import { redis } from './redis';

/**
 * WORKFLOW QUEUE
 * 
 * Learning: BullMQ uses Redis to manage job queues
 * - Jobs are added to the queue
 * - Workers process jobs asynchronously
 * - Failed jobs can be retried automatically
 * - Jobs can be scheduled for later execution
 */

// Job data structure
export interface WorkflowJobData {
    workflowId: number;
    userId: string;
    trigger: 'manual' | 'webhook' | 'schedule';
    input?: Record<string, any>;
}

// Queue configuration
const queueOptions: QueueOptions = {
    connection: redis,
    defaultJobOptions: {
        attempts: 3, // Retry up to 3 times
        backoff: {
            type: 'exponential',
            delay: 1000, // Start with 1 second delay
        },
        removeOnComplete: {
            count: 100, // Keep last 100 completed jobs
        },
        removeOnFail: {
            count: 500, // Keep last 500 failed jobs
        },
    },
};

// Create the workflow queue
export const workflowQueue = new Queue<WorkflowJobData>('workflows', queueOptions);

/**
 * Add a workflow to the queue for execution
 */
export async function queueWorkflow(data: WorkflowJobData) {
    try {
        const job = await workflowQueue.add('execute-workflow', data, {
            jobId: `workflow-${data.workflowId}-${Date.now()}`,
        });

        console.log(`✅ Workflow ${data.workflowId} queued with job ID: ${job.id}`);
        return job;
    } catch (error) {
        console.error('❌ Failed to queue workflow:', error);
        throw error;
    }
}

/**
 * Schedule a workflow to run at a specific time
 */
export async function scheduleWorkflow(
    data: WorkflowJobData,
    delay: number // milliseconds
) {
    const job = await workflowQueue.add('execute-workflow', data, {
        delay,
        jobId: `workflow-${data.workflowId}-scheduled-${Date.now()}`,
    });

    console.log(`⏰ Workflow ${data.workflowId} scheduled for ${delay}ms from now`);
    return job;
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
    const job = await workflowQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    return {
        id: job.id,
        state,
        progress: job.progress,
        data: job.data,
        returnvalue: job.returnvalue,
        failedReason: job.failedReason,
    };
}

/**
 * LEARNING NOTES:
 * 
 * Job States:
 * - waiting: Job is in queue, waiting to be processed
 * - active: Job is currently being processed
 * - completed: Job finished successfully
 * - failed: Job failed (will retry if attempts remaining)
 * - delayed: Job is scheduled for later
 * 
 * Retry Strategy:
 * - Exponential backoff: 1s, 2s, 4s, 8s, etc.
 * - Prevents overwhelming the system
 * - Gives temporary issues time to resolve
 * 
 * Job Options:
 * - attempts: How many times to retry
 * - delay: Wait before processing
 * - priority: Higher priority jobs process first
 * - removeOnComplete: Clean up old jobs
 */
