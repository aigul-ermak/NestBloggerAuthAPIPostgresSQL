-- Create the 'blogs' database if it doesn't exist
SELECT 'CREATE DATABASE blogs'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'blogs'
)\gexec;

-- Create a user for the production database
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE USER admin WITH ENCRYPTED PASSWORD 'kumon';
    END IF;
END
$$;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE blogs TO admin;