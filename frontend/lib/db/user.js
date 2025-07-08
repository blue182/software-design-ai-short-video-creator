// lib/db/user.js
const { db } = require('../../configs/db.js');
const { users } = require('../../configs/schemas/users.js');
const { eq } = require('drizzle-orm');

async function getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
}

async function createUser({ email, username, avatar_url, clerk_id }) {
    const result = await db
        .insert(users)
        .values({ email, username, avatar_url, clerkId: clerk_id })
        .returning();

    return result[0];
}

module.exports = {
    getUserByEmail,
    createUser,
};
