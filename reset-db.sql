-- Run this in Neon SQL Editor to reset the database for Phase 3
-- This will delete all existing data and recreate tables with the correct schema

-- Drop all tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS executions CASCADE;
DROP TABLE IF EXISTS nodes CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS verifications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Now run: npm run db:push
-- This will create all tables with the new schema (text IDs for Better Auth)
