// File: config/schema/durations.js
const { pgTable, serial, integer, varchar } = require('drizzle-orm/pg-core');

const durations = pgTable('durations', {
    id: serial('id').primaryKey(),
    seconds: integer('seconds').notNull(),
    label: varchar('label', { length: 50 }),
});

module.exports = {
    durations
}