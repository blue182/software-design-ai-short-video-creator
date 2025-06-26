// File: config/schema/languages.js
import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';

export const languages = pgTable('languages', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 10 }).unique().notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    flagIconUrl: text('flag_icon_url'),
});
