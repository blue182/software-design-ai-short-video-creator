// File: config/schema/styles.js
import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';

export const styles = pgTable('styles', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
});
