require('dotenv').config();

const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');


console.log('👉 Database URL:', process.env.DRIZZLE_DATABASE_URL);

const sql = neon(process.env.DRIZZLE_DATABASE_URL);
const db = drizzle(sql);

module.exports = {
    db,
    sql,
};