-- Create the test database
CREATE DATABASE test_blogs;

-- Create a user for the test database
CREATE USER admin WITH ENCRYPTED PASSWORD '54321';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE test_blogs TO admin;