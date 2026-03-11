import { createPool } from '@vercel/postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function init() {
    const pool = createPool({
        connectionString: process.env.POSTGRES_URL,
    });

    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS guestbook_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Success! Created table if it didn't exist.");
    } catch (error) {
        console.error("Error creating table:", error);
    } finally {
        pool.end();
    }
}

init();
