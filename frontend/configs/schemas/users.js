// File: config/schema/user.js
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 50 }).unique().notNull(),
    fullname: varchar('fullname', { length: 50 }),
    email: varchar('email', { length: 100 }).unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
