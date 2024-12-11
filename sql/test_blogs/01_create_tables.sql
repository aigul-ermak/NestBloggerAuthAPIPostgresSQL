-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                            -- Auto-incrementing ID
    login VARCHAR(50) NOT NULL,                      -- Login (not null)
    email VARCHAR(100) NOT NULL,                     -- Email (not null)
    password_hash VARCHAR(255) NOT NULL,             -- Password hash (not null)
    password_recovery_code VARCHAR(255),             -- Optional recovery code
    recovery_code_expiration_date TIMESTAMP,         -- Optional expiration date for recovery code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for user creation
    confirmation_code VARCHAR(255),                  -- Optional confirmation code
    expiration_date TIMESTAMP,                       -- Optional expiration date for confirmation code
    is_confirmed BOOLEAN DEFAULT FALSE               -- User confirmation status (default false)
);

-- Create indexes for the users table
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email); 
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_login ON users (login);

-- Create the sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,                            -- Auto-incrementing ID
    user_id INTEGER NOT NULL REFERENCES users(id)     -- Foreign key referencing users table
        ON DELETE CASCADE,                            -- Cascade delete when user is deleted
    device_id VARCHAR(255) NOT NULL,                 -- Device ID (not null)
    ip VARCHAR(45),                                  -- IP address (optional, supports IPv4/IPv6)
    title VARCHAR(255),                              -- Optional session title
    iat_date TIMESTAMP NOT NULL,                     -- Issued at timestamp
    exp_date TIMESTAMP NOT NULL                      -- Expiration timestamp
);

-- Create indexes for the sessions table 
CREATE INDEX IF NOT EXISTS idx_sessions_device_id ON sessions (device_id);
