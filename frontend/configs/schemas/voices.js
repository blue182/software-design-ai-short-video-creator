// File: config/schema/voices.js
const { pgTable, serial, varchar, text } = require('drizzle-orm/pg-core');

const voices = pgTable('voices', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).unique().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    gender: varchar('gender', { length: 10 }),
    languageCode: varchar('language_code', { length: 10 }),
    provider: varchar('provider', { length: 50 }),
    sampleUrl: text('sample_url'),
});

module.exports = { voices };