// File: config/schema/styles.js
const { pgTable, serial, varchar, text } = require('drizzle-orm/pg-core');

const styles = pgTable('styles', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
});

module.exports = {
    styles
};