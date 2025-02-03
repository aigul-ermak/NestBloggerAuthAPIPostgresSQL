CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(15) NOT NULL,
    description VARCHAR(500) NOT NULL,
    website_url VARCHAR(100) NOT NULL CHECK (website_url ~ '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
);
