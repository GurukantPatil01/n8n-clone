import { Redis } from 'ioredis';

/**
 * REDIS CONNECTION
 * 
 * Learning: Redis is an in-memory data store used for:
 * - Job queues (BullMQ)
 * - Caching
 * - Session storage
 * - Real-time data
 * 
 * Installation (Mac): brew install redis
 * Start: brew services start redis
 * Check: redis-cli ping (should return PONG)
 */

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
};

export const redis = new Redis(redisConfig);

redis.on('connect', () => {
    console.log('✅ Redis connected');
});

redis.on('error', (err) => {
    console.error('❌ Redis error:', err);
});

/**
 * LEARNING NOTES:
 * 
 * Redis Connection Options:
 * - host: Redis server address
 * - port: Redis server port (default 6379)
 * - maxRetriesPerRequest: null for BullMQ compatibility
 * - enableReadyCheck: false for better performance
 * - retryStrategy: Exponential backoff for reconnection
 * 
 * Why Redis for Job Queues?
 * - Fast: In-memory operations
 * - Reliable: Persistence options
 * - Atomic: Operations are atomic
 * - Pub/Sub: Built-in messaging
 */
