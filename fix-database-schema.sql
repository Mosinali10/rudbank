-- Run this in your Neon SQL Editor to fix the database schema

-- 1. Check if transactions table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'transactions';

-- 2. If it doesn't exist, create it with correct foreign key
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    uid INTEGER REFERENCES koduser(uid),  -- References uid, not id
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. If it exists but has wrong foreign key, drop and recreate
-- DROP TABLE IF EXISTS transactions CASCADE;
-- Then run the CREATE TABLE above

-- 4. Verify the schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'transactions'
ORDER BY ordinal_position;
