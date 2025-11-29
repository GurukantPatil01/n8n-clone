import { pgTable, serial, text, timestamp, boolean, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * USERS TABLE
 * Stores user account information
 * 
 * Learning: This is the root table - users own workflows
 * Updated for Phase 3: 
 * - Added emailVerified and image for Better Auth
 * - Changed ID to text (Better Auth uses string IDs)
 */
export const users = pgTable('users', {
    id: text('id').primaryKey(), // Better Auth uses string IDs
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'), // Profile picture URL
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * WORKFLOWS TABLE
 * Stores workflow definitions created by users
 * 
 * Learning: Each workflow belongs to a user (userId foreign key)
 * The isActive flag lets users enable/disable workflows without deleting them
 * 
 * Phase 3 Update: userId is now text to match Better Auth user IDs
 */
export const workflows = pgTable('workflows', {
    id: serial('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }), // If user is deleted, delete their workflows
    name: text('name').notNull(),
    description: text('description'),
    isActive: boolean('is_active').default(false).notNull(),
    // React Flow canvas state
    nodesJson: jsonb('nodes_json').default([]),
    edgesJson: jsonb('edges_json').default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * NODES TABLE
 * Stores individual nodes (steps) within a workflow
 * 
 * Learning: 
 * - type: Determines what the node does (e.g., "trigger", "http-request", "transform")
 * - config: JSONB field stores node-specific settings (flexible structure)
 * - position: JSONB stores {x, y} coordinates for the visual canvas
 */
export const nodes = pgTable('nodes', {
    id: serial('id').primaryKey(),
    workflowId: integer('workflow_id')
        .notNull()
        .references(() => workflows.id, { onDelete: 'cascade' }), // If workflow deleted, delete its nodes
    type: text('type').notNull(), // e.g., "trigger", "action", "transform"
    name: text('name').notNull(), // Display name
    config: jsonb('config').notNull().default({}), // Node-specific configuration
    position: jsonb('position').notNull().default({ x: 0, y: 0 }), // Canvas position
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * CONNECTIONS TABLE
 * Stores how nodes are connected to each other
 * 
 * Learning:
 * - sourceNodeId -> targetNodeId: Defines the flow direction
 * - sourceHandle/targetHandle: For nodes with multiple inputs/outputs
 * - This creates the "edges" in our workflow graph
 */
export const connections = pgTable('connections', {
    id: serial('id').primaryKey(),
    workflowId: integer('workflow_id')
        .notNull()
        .references(() => workflows.id, { onDelete: 'cascade' }),
    sourceNodeId: integer('source_node_id')
        .notNull()
        .references(() => nodes.id, { onDelete: 'cascade' }),
    targetNodeId: integer('target_node_id')
        .notNull()
        .references(() => nodes.id, { onDelete: 'cascade' }),
    sourceHandle: text('source_handle'), // Which output port (optional)
    targetHandle: text('target_handle'), // Which input port (optional)
});

/**
 * EXECUTIONS TABLE
 * Stores the history of workflow runs
 * 
 * Learning:
 * - status: "running" | "success" | "error"
 * - data: JSONB stores the execution results and intermediate data
 * - This lets users see what happened when a workflow ran
 */
export const executions = pgTable('executions', {
    id: serial('id').primaryKey(),
    workflowId: integer('workflow_id')
        .notNull()
        .references(() => workflows.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('running'), // "running" | "success" | "error"
    startedAt: timestamp('started_at').defaultNow().notNull(),
    finishedAt: timestamp('finished_at'),
    error: text('error'), // Error message if failed
    data: jsonb('data').default({}), // Execution results
});

/**
 * RELATIONS
 * Define how tables relate to each other for Drizzle queries
 * 
 * Learning: This enables us to easily query related data
 * Example: Get a user with all their workflows in one query
 */
export const usersRelations = relations(users, ({ many }) => ({
    workflows: many(workflows),
}));

export const workflowsRelations = relations(workflows, ({ one, many }) => ({
    user: one(users, {
        fields: [workflows.userId],
        references: [users.id],
    }),
    nodes: many(nodes),
    connections: many(connections),
    executions: many(executions),
}));

export const nodesRelations = relations(nodes, ({ one }) => ({
    workflow: one(workflows, {
        fields: [nodes.workflowId],
        references: [workflows.id],
    }),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
    workflow: one(workflows, {
        fields: [connections.workflowId],
        references: [workflows.id],
    }),
    sourceNode: one(nodes, {
        fields: [connections.sourceNodeId],
        references: [nodes.id],
    }),
    targetNode: one(nodes, {
        fields: [connections.targetNodeId],
        references: [nodes.id],
    }),
}));

export const executionsRelations = relations(executions, ({ one }) => ({
    workflow: one(workflows, {
        fields: [executions.workflowId],
        references: [workflows.id],
    }),
}));

/**
 * SESSIONS TABLE (NextAuth)
 * Stores user sessions for authentication
 * 
 * Learning: Sessions allow users to stay logged in
 * - sessionToken: Unique identifier stored in cookie
 * - expires: When the session expires
 * - NextAuth uses JWT strategy by default (no DB sessions needed)
 * - This table is for database session strategy (optional)
 */
export const sessions = pgTable('sessions', {
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires').notNull(),
});

/**
 * ACCOUNTS TABLE (NextAuth)
 * Stores OAuth provider accounts
 * 
 * Learning: Links users to external auth providers
 * - Supports multiple providers per user
 * - Stores OAuth tokens for API access
 * - Composite primary key (provider + providerAccountId)
 */
export const accounts = pgTable('accounts', {
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // "oauth", "email", "credentials"
    provider: text('provider').notNull(), // "google", "github", "credentials"
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
}, (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

/**
 * VERIFICATION TOKENS TABLE (NextAuth)
 * Stores email verification and password reset tokens
 * 
 * Learning: Used for email verification and password resets
 * - identifier: Usually the email address
 * - token: Random token sent to user
 * - expires: Token expiration time
 */
export const verificationTokens = pgTable('verification_tokens', {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires').notNull(),
}, (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

/**
 * NEXTAUTH RELATIONS
 */
export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));
