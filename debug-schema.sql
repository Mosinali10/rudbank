-- Run this in your Neon SQL Editor to check the actual column names

-- Check koduser table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'koduser'
ORDER BY ordinal_position;

-- Check what the primary key column is actually named
SELECT column_name 
FROM information_schema.key_column_usage 
WHERE table_name = 'koduser' 
AND constraint_name LIKE '%pkey%';

-- Check a sample user to see actual column names
SELECT * FROM koduser LIMIT 1;
