// File: config/schema/user.js
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 50 }),
    profile_text: varchar('profile_text', { length: 1000 }),
    email: varchar('email', { length: 100 }).unique().notNull(),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
