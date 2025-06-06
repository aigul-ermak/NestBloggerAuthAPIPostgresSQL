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