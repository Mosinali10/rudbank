import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Simple test query
pool.query("SELECT 1")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error:", err));

export default pool;
