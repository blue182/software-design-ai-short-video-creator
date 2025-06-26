// File: config/schema/durations.js
import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';

export const durations = pgTable('durations', {
    id: serial('id').primaryKey(),
    seconds: integer('seconds').notNull(),
    label: varchar('label', { length: 50 }),
});
