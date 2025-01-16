-- Check if the 'test_blogs' database exists, and create it if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'test_blogs') THEN
        CREATE DATABASE test_blogs;
    END IF;
END
$$;

-- Create a user for the test database if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE USER admin WITH ENCRYPTED PASSWORD '54321';
    END IF;
END
$$;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE test_blogs TO admin;