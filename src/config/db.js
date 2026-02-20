import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Simple test query
pool.query("SELECT 1")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));

export default pool;
