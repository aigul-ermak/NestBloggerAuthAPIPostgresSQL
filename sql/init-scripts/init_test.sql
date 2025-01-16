-- Create the 'test_blogs' database if it doesn't exist
SELECT 'CREATE DATABASE test_blogs'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'test_blogs'
)\gexec;

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