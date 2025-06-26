// lib/db/user.js
import { db } from '@/configs/db';
import { users } from '@/configs/schemas/users';
import { eq } from 'drizzle-orm';

export async function getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
}

export async function createUser({ email, username, avatar_url }) {
    return await db.insert(users).values({ email, username, avatar_url });
}
