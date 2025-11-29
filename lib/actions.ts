'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

/**
 * SERVER-SIDE USER CREATION
 * 
 * Learning: This file contains server-only functions
 * - Must not be imported by client components
 * - Uses database and Node.js APIs (crypto, bcrypt)
 */

/**
 * Create User Function
 * 
 * Learning: NextAuth doesn't handle registration by default
 * We need a custom function to create users
 */
export async function createUser(email: string, password: string, name: string) {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique ID
    const id = randomUUID();

    // Insert user
    const [user] = await db.insert(users).values({
        id,
        email,
        name,
        passwordHash,
        emailVerified: false,
    }).returning();

    return user;
}
