import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_o9zhrI2KEWDR@ep-holy-field-a1fy4mx4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

const migration = `
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    uid INTEGER REFERENCES koduser(id),
    type VARCHAR(20) NOT NULL, -- 'credit', 'debit', 'transfer'
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function migrate() {
    try {
        console.log("Adding Transactions table to Cloud DB...");
        await pool.query(migration);
        console.log("SUCCESS: Transactions table created.");
        process.exit(0);
    } catch (err) {
        console.error("ERROR:", err.message);
        process.exit(1);
    }
}

migrate();
