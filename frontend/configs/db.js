import 'dotenv/config';


import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

console.log('👉 Database URL:', process.env.DRIZZLE_DATABASE_URL); // 👈 Log ra

const sql = neon(process.env.DRIZZLE_DATABASE_URL);
export const db = drizzle(sql);
