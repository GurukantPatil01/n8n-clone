import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { workflows, nodes, connections } from '@/db/schema';
import { eq, and, asc, desc, sql } from 'drizzle-orm';

/**
 * WORKFLOW ROUTER
 * 
 * Learning: This router handles all workflow-related API operations
 * - Queries: Read data (list, getById)
 * - Mutations: Write data (create, update, delete)
 * 
 * Each procedure has:
 * 1. Input validation (using Zod)
 * 2. Business logic (database operations)
 * 3. Return type (automatically inferred by TypeScript)
 */

export const workflowRouter = router({
    /**
     * LIST - Get all workflows for the logged-in user with pagination, sorting, and filtering
     * 
     * Phase 11 Update: Added pagination, sorting, filtering, and search
     * - Pagination: limit/offset for page-based navigation
     * - Sorting: by createdAt, updatedAt, name, or isActive
     * - Filtering: by isActive status
     * - Search: by workflow name (case-insensitive)
     * 
     * Returns: Paginated results with metadata
     */
    list: protectedProcedure
        .input(
            z.object({
                // Pagination
                limit: z.number().min(1).max(100).default(20),
                offset: z.number().min(0).default(0),

                // Sorting
                sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'isActive']).default('updatedAt'),
                sortOrder: z.enum(['asc', 'desc']).default('desc'),

                // Filtering
                isActive: z.boolean().optional(),
                search: z.string().optional(),
            }).optional()
        )
        .query(async ({ ctx, input = {} }) => {
            const { limit = 20, offset = 0, sortBy = 'updatedAt', sortOrder = 'desc', isActive, search } = input;

            // Build where conditions
            const conditions = [eq(workflows.userId, ctx.user.id!)];

            if (isActive !== undefined) {
                conditions.push(eq(workflows.isActive, isActive));
            }

            if (search) {
                // Case-insensitive search using ilike
                conditions.push(sql`LOWER(${workflows.name}) LIKE LOWER(${'%' + search + '%'})`);
            }

            const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

            // Get total count for pagination metadata
            const [{ count: totalCount }] = await ctx.db
                .select({ count: sql<number>`count(*)::int` })
                .from(workflows)
                .where(whereClause);

            // Map sortBy to actual column
            const sortColumn = {
                createdAt: workflows.createdAt,
                updatedAt: workflows.updatedAt,
                name: workflows.name,
                isActive: workflows.isActive,
            }[sortBy];

            // Get paginated workflows
            const allWorkflows = await ctx.db.query.workflows.findMany({
                where: whereClause,
                with: {
                    nodes: true,
                    connections: true,
                },
                orderBy: sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn),
                limit,
                offset,
            });

            // Calculate pagination metadata
            const totalPages = Math.ceil(totalCount / limit);
            const currentPage = Math.floor(offset / limit) + 1;
            const hasMore = offset + limit < totalCount;

            return {
                workflows: allWorkflows,
                pagination: {
                    total: totalCount,
                    totalPages,
                    currentPage,
                    hasMore,
                    limit,
                    offset,
                },
            };
        }),

    /**
     * GET BY ID - Get a single workflow (must belong to user)
     * 
     * Input: { id: number }
     * Returns: Workflow with nodes and connections, or null if not found
     * 
     * Phase 3 Update: Requires authentication and ownership check
     * Learning: .input() validates the input using Zod schema
     * If validation fails, tRPC automatically returns an error
     */
    getById: protectedProcedure
        .input(
            z.object({
                id: z.number().int().positive(),
            })
        )
        .query(async ({ ctx, input }) => {
            const workflow = await ctx.db.query.workflows.findFirst({
                where: eq(workflows.id, input.id),
                with: {
                    nodes: true,
                    connections: true,
                },
            });

            // Verify ownership
            if (workflow && workflow.userId !== ctx.user.id) {
                throw new Error('Unauthorized: This workflow belongs to another user');
            }

            return workflow;
        }),

    /**
     * CREATE - Create a new workflow for the logged-in user
     * 
     * Mutation: Modifies data (has side effects)
     * Input: { name, description? }
     * Returns: The created workflow
     * 
     * Phase 3 Update: No userId needed! Uses authenticated user automatically
     * Learning: Zod validation ensures:
     * - name is a string, 1-100 characters
     * - description is optional
     * - userId comes from ctx.user.id (authenticated user)
     */
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const [workflow] = await ctx.db
                .insert(workflows)
                .values({
                    name: input.name,
                    description: input.description,
                    userId: ctx.user.id!, // From authenticated session!
                    isActive: false,
                })
                .returning();

            return workflow;
        }),

    /**
     * UPDATE - Update an existing workflow (must belong to user)
     * 
     * Input: { id, name?, description?, isActive? }
     * Returns: The updated workflow
     * 
     * Phase 3 Update: Requires authentication and ownership check
     * Learning: All fields except id are optional
     * Only provided fields will be updated
     */
    update: protectedProcedure
        .input(
            z.object({
                id: z.number().int().positive(),
                name: z.string().min(1).max(100).optional(),
                description: z.string().optional(),
                isActive: z.boolean().optional(),
                // React Flow canvas state
                nodesJson: z.any().optional(), // Array of React Flow nodes
                edgesJson: z.any().optional(), // Array of React Flow edges
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...updateData } = input;

            // Verify ownership before updating
            const existing = await ctx.db.query.workflows.findFirst({
                where: eq(workflows.id, id),
            });

            if (!existing || existing.userId !== ctx.user.id) {
                throw new Error('Unauthorized: Cannot update this workflow');
            }

            const [workflow] = await ctx.db
                .update(workflows)
                .set({
                    ...updateData,
                    updatedAt: new Date(),
                })
                .where(eq(workflows.id, id))
                .returning();

            return workflow;
        }),

    /**
     * DELETE - Delete a workflow (must belong to user)
     * 
     * Input: { id: number }
     * Returns: { success: true }
     * 
     * Phase 3 Update: Requires authentication and ownership check
     * Learning: Cascade delete (from Phase 1) automatically removes:
     * - All nodes in this workflow
     * - All connections in this workflow
     * - All executions of this workflow
     */
    delete: protectedProcedure
        .input(
            z.object({
                id: z.number().int().positive(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Verify ownership before deleting
            const existing = await ctx.db.query.workflows.findFirst({
                where: eq(workflows.id, input.id),
            });

            if (!existing || existing.userId !== ctx.user.id) {
                throw new Error('Unauthorized: Cannot delete this workflow');
            }

            await ctx.db.delete(workflows).where(eq(workflows.id, input.id));

            return { success: true };
        }),

    /**
     * TOGGLE ACTIVE - Enable/disable a workflow (must belong to user)
     * 
     * Input: { id: number }
     * Returns: The updated workflow
     * 
     * Phase 3 Update: Requires authentication and ownership check
     * Learning: This is a convenience mutation that toggles isActive
     * We could use update(), but this is more semantic
     */
    toggleActive: protectedProcedure
        .input(
            z.object({
                id: z.number().int().positive(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // First, get the current state
            const current = await ctx.db.query.workflows.findFirst({
                where: eq(workflows.id, input.id),
            });

            if (!current) {
                throw new Error('Workflow not found');
            }

            // Verify ownership
            if (current.userId !== ctx.user.id) {
                throw new Error('Unauthorized: Cannot modify this workflow');
            }

            // Toggle the isActive state
            const [workflow] = await ctx.db
                .update(workflows)
                .set({
                    isActive: !current.isActive,
                    updatedAt: new Date(),
                })
                .where(eq(workflows.id, input.id))
                .returning();

            return workflow;
        }),
});

/**
 * LEARNING SUMMARY
 * 
 * This router demonstrates:
 * 1. Query vs Mutation: .query() for reads, .mutation() for writes
 * 2. Input Validation: Zod schemas ensure type safety and validation
 * 3. Type Inference: TypeScript knows all return types automatically
 * 4. Database Operations: Using Drizzle ORM with type-safe queries
 * 5. Error Handling: Throwing errors that tRPC automatically formats
 * 
 * Next: We'll create the app router that combines all routers
 */
