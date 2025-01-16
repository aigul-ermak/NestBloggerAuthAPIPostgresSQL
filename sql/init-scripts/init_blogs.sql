-- Create the production database
CREATE DATABASE blogs;

-- Create a user for the production database
CREATE USER admin WITH ENCRYPTED PASSWORD 'kumon';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE blogs TO admin;