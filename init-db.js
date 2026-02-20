import pool from './src/config/db.js';

const schema = `
CREATE TABLE IF NOT EXISTS "KodUser" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer',
    balance DECIMAL(15, 2) DEFAULT 100000.00
);

CREATE TABLE IF NOT EXISTS "UserToken" (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    uid INTEGER REFERENCES "KodUser"(id),
    expiry TIMESTAMP NOT NULL
);
`;

async function initDB() {
    try {
        console.log("Checking database schema...");
        await pool.query(schema);
        console.log("Database schema verified/created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Database initialization error:", err.message);
        process.exit(1);
    }
}

initDB();
