import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * DATABASE CONNECTION
 * 
 * Learning: This creates a singleton connection to PostgreSQL
 * - We use the DATABASE_URL from environment variables
 * - The connection is reused across the app (don't create multiple connections)
 * - In development, we set max connections to 1 to avoid connection pool issues
 */

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection
const client = postgres(process.env.DATABASE_URL, {
    max: 1, // Maximum number of connections (1 for development)
});

// Create Drizzle instance with our schema
export const db = drizzle(client, { schema });

/**
 * HOW TO USE:
 * 
 * Import this in any file where you need database access:
 * import { db } from '@/db';
 * 
 * Then you can query:
 * const users = await db.query.users.findMany();
 * const workflow = await db.query.workflows.findFirst({
 *   where: eq(workflows.id, 1),
 *   with: { nodes: true, connections: true }
 * });
 */
