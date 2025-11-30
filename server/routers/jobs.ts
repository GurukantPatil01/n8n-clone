import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { executeWorkflowDirect } from '@/lib/queue/direct-executor';

/**
 * JOBS ROUTER
 * 
 * tRPC endpoints for managing background jobs
 * - Execute workflows
 * - Check job status
 * - List recent jobs
 */

export const jobsRouter = router({
    /**
     * Execute a workflow manually
     * 
     * Note: Uses direct execution as fallback when Redis is not available
     * For production, set up Redis and use BullMQ
     */
    executeWorkflow: protectedProcedure
        .input(
            z.object({
                workflowId: z.number(),
                input: z.record(z.string(), z.any()).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                // Execute directly (fallback when Redis not available)
                const result = await executeWorkflowDirect({
                    workflowId: input.workflowId,
                    userId: ctx.user.id!,
                    trigger: 'manual',
                    input: input.input,
                });

                return {
                    success: result.success,
                    message: result.success
                        ? 'Workflow executed successfully'
                        : 'Workflow execution failed',
                    result,
                };
            } catch (error) {
                console.error('Failed to execute workflow:', error);
                throw new Error('Failed to execute workflow');
            }
        }),
});

/**
 * LEARNING NOTES:
 * 
 * Background Job Pattern:
 * 1. User triggers action (click "Execute")
 * 2. API adds job to queue
 * 3. Returns immediately with job ID
 * 4. Worker processes job asynchronously
 * 5. User can check status with job ID
 * 
 * Benefits:
 * - Non-blocking: UI doesn't freeze
 * - Reliable: Jobs survive server restarts
 * - Scalable: Multiple workers can process jobs
 * - Retry: Failed jobs automatically retry
 * 
 * Use Cases:
 * - Long-running workflows
 * - Scheduled tasks
 * - Email sending
 * - Data processing
 * - API integrations
 */
