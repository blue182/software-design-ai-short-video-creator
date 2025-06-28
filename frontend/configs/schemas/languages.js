// File: config/schema/languages.js
const { pgTable, serial, varchar, text } = require('drizzle-orm/pg-core');

const languages = pgTable('languages', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 10 }).unique().notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    flagEmoji: varchar('flag_emoji', { length: 4 }),
});

module.exports = {
    languages
};